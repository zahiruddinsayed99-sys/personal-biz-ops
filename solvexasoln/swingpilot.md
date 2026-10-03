Designing an Inside Bar breakout scanner that handles multi-timeframe evaluation (**1-hour, 3-hour, and Daily**) for two-way swing trading (F&O underlying stocks and indices) requires a critical design adjustment: `GOOGLEFINANCE()` natively supports only daily historical candles. It cannot retrieve intraday 1-hour or 3-hour OHLC bars.

To implement **Option C (Hybrid)** seamlessly across these timeframes, the data engine must use Google Apps Script to fetch historical candlestick series from a market data provider (such as Yahoo Finance API or a broker webhook), evaluate the Mother-Baby pattern, and update current breakout status against live quotes.

## Strategy Architecture & Breakout Geometry

In a strict Mother Bar breakout setup, the Inside Bar (Baby candle, period $T$) defines consolidation entirely inside the preceding Mother candle (period $T-1$). The breakout threshold is anchored strictly to the Mother bar's extremes rather than the baby bar's range.

```svg
<svg viewBox="0 0 640 280" width="100%" role="img" aria-label="Mother Bar Breakout Geometry">
    <title>Mother-Baby Inside Bar Breakout Framework</title>
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" fill="currentColor"></path>
      </marker>
    </defs>
    <!-- Background grid guidelines -->
    <line x1="50" y1="40" x2="590" y2="40" stroke="var(--border, #7f8489)" stroke-dasharray="3 3" fill="none"></line>
    <line x1="50" y1="230" x2="590" y2="230" stroke="var(--border, #7f8489)" stroke-dasharray="3 3" fill="none"></line>

    <!-- Mother Bar (T-1) -->
    <line x1="160" y1="40" x2="160" y2="230" stroke="currentColor" stroke-width="2" fill="none"></line>
    <rect x="135" y="75" width="50" height="120" fill="var(--accent-container, #2b3952)" stroke="currentColor" stroke-width="1.5"></rect>
    <text x="160" y="260" text-anchor="middle" fill="currentColor" font-size="13">Mother Bar (T-1)</text>

    <!-- Baby Bar (T) -->
    <line x1="310" y1="80" x2="310" y2="190" stroke="currentColor" stroke-width="2" fill="none"></line>
    <rect x="290" y="105" width="40" height="70" fill="var(--bg-card, #333)" stroke="currentColor" stroke-width="1.5"></rect>
    <text x="310" y="260" text-anchor="middle" fill="currentColor" font-size="13">Baby Bar (T)</text>

    <!-- Breakout Long Trigger -->
    <line x1="160" y1="40" x2="550" y2="40" stroke="var(--success, #00b06f)" stroke-width="2" fill="none"></line>
    <text x="560" y="44" text-anchor="start" fill="var(--success, #00b06f)" font-weight="bold" font-size="12">Bullish Trigger (High + Buffer)</text>
    <text x="560" y="58" text-anchor="start" fill="currentColor" font-size="11">Buy Call / Long Underlying</text>

    <!-- Breakout Short Trigger -->
    <line x1="160" y1="230" x2="550" y2="230" stroke="var(--danger, #ff5252)" stroke-width="2" fill="none"></line>
    <text x="560" y="234" text-anchor="start" fill="var(--danger, #ff5252)" font-weight="bold" font-size="12">Bearish Trigger (Low - Buffer)</text>
    <text x="560" y="248" text-anchor="start" fill="currentColor" font-size="11">Buy Put / Short Underlying</text>

    <!-- Boundary lines showing containment -->
    <line x1="185" y1="40" x2="280" y2="40" stroke="currentColor" stroke-width="1" stroke-dasharray="2 2" fill="none"></line>
    <line x1="185" y1="230" x2="280" y2="230" stroke="currentColor" stroke-width="1" stroke-dasharray="2 2" fill="none"></line>
  </svg>
```

Mother Bar Breakout execution bounds showing containment criteria and trigger thresholds.

### Execution Rules

* **Inside Bar Validation:** $\text{High}_T \le \text{High}_{T-1}$ and $\text{Low}_T \ge \text{Low}_{T-1}$.
* **Bullish Call/Long Trigger:** $\text{Price} \ge \text{Mother High} + \delta$ (where $\delta$ is a tick buffer, typically $0.05\%$ to avoid wick noise). Stop-Loss is placed at the Mother Bar Low or the Baby Bar Low (conservative vs. standard).
* **Bearish Put/Short Trigger:** $\text{Price} \le \text{Mother Low} - \delta$. Stop-Loss is placed at the Mother Bar High.
* **Options Execution Strategy:** When trading index or liquid stock options, trades trigger slightly In-The-Money (ITM) or At-The-Money (ATM) monthly/weekly contracts to mitigate high theta bleed while capturing delta expansion.

## System Blueprint: Google Sheets Structure

The spreadsheet uses two operational sheets: an interface tab for interactive monitoring and a backend configuration tab.

| Column Header | Source / Mechanism | Functional Purpose |
| --- | --- | --- |
| Ticker / Symbol | Manual entry / F&O Watchlist | E.g., `NSE:RELIANCE`, `NSE:NIFTY`, `NSE:HDFCBANK` |
| LTP (Current Price) | `=GOOGLEFINANCE(ticker, "price")` | Live intraday tick feed to evaluate triggers in real time |
| Pattern State | Apps Script output | Displays `Inside Bar Formed`, `Neutral`, or `Double Inside` |
| Mother High / Low | Apps Script output | Static price benchmarks derived from bar $T-1$ |
| Breakout Status | Sheet Formula / Logic | Evaluates: `TRIGGERED LONG`, `TRIGGERED SHORT`, or `COILING` |
| Distance to Trigger | Sheet Formula | Quantifies distance in percentage to long or short activation |
| Suggested Option Strike | Sheet Formula | Rounds trigger price to nearest standard ATM/ITM option strike |

## Data Engine Architecture: Handling 1h, 3h, and Daily Timeframes

Google Apps Script handles data acquisition by fetching OHLC bars on demand or via a schedule. The user chooses the timeframe from a dropdown in cell `B1`.

**1-Hour Timeframe (`1h`)**
Aggregates 60-minute candles. Ideal for intraday swing entries where Mother Bars form during the morning session (9:15–10:15 AM) and break in the afternoon.

**3-Hour Timeframe (`3h`)**
Splits the trading day into two major blocks (e.g., 9:15–12:15 and 12:15–3:15). Yields reliable signals for 2-to-5 day holding periods with lower intraday whipsaw.

**Daily Timeframe (`1d`)**
Classic swing setup evaluated post-market. Breakouts carry multi-week directional follow-through.

### Apps Script Scanning Engine

This script reads the watchlist, queries historical candles (via Yahoo Finance API query endpoints for NSE symbols like `RELIANCE.NS`), parses the OHLC arrays according to the selected timeframe, and writes back the trigger levels.

```javascript
/**
 * Runs inside Google Sheets Script Editor.
 * Fetches OHLC and detects Mother-Baby Inside Bar structures.
 */
function scanInsideBars() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Scanner");
  
  // Cell B1 contains a dropdown: "1d", "60m", or "3h"
  const timeframe = sheet.getRange("B1").getValue() || "1d";
  const lastRow = sheet.getLastRow();
  if (lastRow < 4) return;
  
  const symbols = sheet.getRange(4, 1, lastRow - 3, 1).getValues().flat();
  const results = [];
  
  symbols.forEach(sym => {
    if (!sym) {
      results.push(["", "", "", ""]);
      return;
    }
    
    // Convert format if necessary (e.g., "NSE:SBIN" to "SBIN.NS")
    const cleanSym = sym.replace("NSE:", "") + ".NS";
    const ohlc = fetchHistoricalOHLC(cleanSym, timeframe);
    
    if (!ohlc || ohlc.length < 2) {
      results.push(["Data Error", "-", "-", "-"]);
      return;
    }
    
    const baby = ohlc[ohlc.length - 1];   // Bar T
    const mother = ohlc[ohlc.length - 2]; // Bar T-1
    
    const isInsideBar = (baby.high <= mother.high) && (baby.low >= mother.low);
    
    if (isInsideBar) {
      results.push([
        "INSIDE BAR",
        mother.high,
        mother.low,
        (mother.high - mother.low).toFixed(2) // Range / Risk
      ]);
    } else {
      results.push(["NO PATTERN", "-", "-", "-"]);
    }
  });
  
  // Write pattern data back to columns C through F starting at row 4
  sheet.getRange(4, 3, results.length, 4).setValues(results);
}

function fetchHistoricalOHLC(ticker, interval) {
  // Map interval for Yahoo Finance: 60m for 1h, 1d for Daily
  const yInterval = (interval === "3h") ? "60m" : interval;
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?range=5d&interval=${yInterval}`;
  
  try {
    const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    const json = JSON.parse(response.getContentText());
    const quote = json.chart.result[0].indicators.quote[0];
    
    let bars = [];
    for (let i = 0; i < quote.open.length; i++) {
      if (quote.open[i] && quote.high[i] && quote.low[i] && quote.close[i]) {
        bars.push({
          open: quote.open[i],
          high: quote.high[i],
          low: quote.low[i],
          close: quote.close[i]
        });
      }
    }
    
    // Synthetic aggregation for 3-hour bars if selected
    if (interval === "3h" && bars.length >= 3) {
      bars = aggregateBars(bars, 3);
    }
    
    return bars;
  } catch (e) {
    return null;
  }
}

function aggregateBars(hourlyBars, factor) {
  const aggregated = [];
  for (let i = 0; i < hourlyBars.length; i += factor) {
    const chunk = hourlyBars.slice(i, i + factor);
    if (chunk.length > 0) {
      aggregated.push({
        open: chunk[0].open,
        high: Math.max(...chunk.map(b => b.high)),
        low: Math.min(...chunk.map(b => b.low)),
        close: chunk[chunk.length - 1].close
      });
    }
  }
  return aggregated;
}
```

## Live Trigger Logic (Hybrid Integration)

Once Apps Script has extracted the static Mother Bar High and Low, real-time formula monitoring tracks the live LTP against the trigger levels.

* **Long Trigger Check (Column G):**
`=IF(C4="INSIDE BAR", IF(B4 >= D4*1.0005, "LONG TRIGGERED", IF(B4 <= E4*0.9995, "SHORT TRIGGERED", "WAITING")), "NEUTRAL")`
* **Options Call Strike Finder (Column H):**
`=IF(C4="INSIDE BAR", MROUND(D4, IF(D4>1000, 50, 10)) & " CE", "-")`
* **Options Put Strike Finder (Column I):**
`=IF(C4="INSIDE BAR", MROUND(E4, IF(E4>1000, 50, 10)) & " PE", "-")`
