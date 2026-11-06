A mechanical morning routine filters the 30 Sensex constituents into **1 or 2 high-probability Call or Put option targets** before your active 11:30 AM – 1:30 PM execution window.

---

### Step 1: Macro & Market Regime Check (09:15 – 09:30 AM)

Before looking at individual stocks, determine whether today favors **Call (CE) Buying**, **Put (PE) Buying**, or **Sitting in Cash**.

#### 1. India VIX Filter (Option Buying Feasibility)

* **VIX < 11.5 (Low Volatility / Severe Theta Decay)**: Premiums move sluggishly and consolidation bases take longer to expand. Restrict trades to top heavyweights showing extraordinary volume.
* **VIX 12.0 – 16.5 (Sweet Spot)**: Ideal for the 1-Lot Momentum Blueprint. Steady directional trends allow fast +25% to +50% expansions without erratic whip-saws.
* **VIX > 18.0 (High Volatility)**: Wide intraday swings. Option premiums will have high IV, requiring tighter stop-loss point limits ($< 10\%$) because mean reversion happens quickly.

#### 2. Sensex Index Trend (Directional Bias)

Compare the BSE Sensex cash chart and its VWAP:

* **Bullish Regime (CE Bias)**: Sensex trades above yesterday’s close AND sustains **above 15m/5m VWAP** with 9 EMA > 26 EMA. Only look for **CE buying setups**.
* **Bearish Regime (PE Bias)**: Sensex trades below yesterday’s close AND sustains **below 15m/5m VWAP** with 9 EMA < 26 EMA. Only look for **PE buying setups**.
* **Choppy / Flat Regime (Sensex crisscrossing VWAP within $\pm 0.25\%$)**: Skip index heavyweights; restrict focus exclusively to individual stock outliers with independent high-relative-volume catalysts.

---

### Step 2: Sensex Constituent Filtering (09:30 – 10:15 AM)

The BSE Sensex is dominated by its top 10 heavyweights (~65% total weight). Categorize your search pool into two distinct clusters:

* **Cluster A (Index Drivers)**: HDFC Bank, ICICI Bank, Reliance Industries, Bharti Airtel, State Bank of India, Infosys, TCS.
* **Cluster B (High-Beta Momentum Movers)**: Bajaj Finance, Tata Steel, M&M, Axis Bank, Sun Pharma, Titan.

#### The 4-Step Selection Filter:

| Filter Parameter | Call (CE) Candidate Rules | Put (PE) Candidate Rules |
| --- | --- | --- |
| **Price Action** | Up **+0.8% to +2.5%** (avoid extended >4% gap-ups) | Down **-0.8% to -2.5%** (avoid extended >4% panic gaps) |
| **Volume vs 20 SMA** | 15-min volume tracks **$\ge 1.5\text{x}$ 20-period volume SMA** | 15-min volume tracks **$\ge 1.5\text{x}$ 20-period volume SMA** |
| **VWAP Relationship** | Cash Spot & Futures sustained **strictly above VWAP** | Cash Spot & Futures sustained **strictly below VWAP** |
| **Derivatives Data** | **Long Buildup**: Futures Price $\uparrow$ + Futures OI $\uparrow$ | **Short Buildup**: Futures Price $\downarrow$ + Futures OI $\uparrow$ |

*Discard any stock in "Long Unwinding" (Price $\downarrow$, OI $\downarrow$) or "Short Covering" (Price $\uparrow$, OI $\downarrow$) because those moves lack institutional momentum.*

---

### Step 3: Triangulating the 3 Charts (10:15 – 10:30 AM)

Once 2 candidate stocks pass the filters (e.g., 1 CE candidate and 1 PE candidate), open their respective charts side-by-side in Zerodha or TradingView:

```
[Chart 1: Cash Spot (5m/3m)]    ---> Confirms structural support/resistance
[Chart 2: Stock Futures (3m)]    ---> Confirms institutional volume & VWAP hold
[Chart 3: ATM Option (3m)]       ---> Primary execution chart (Blueprint rules)

```

#### Selecting the Exact Strike:

* Always choose the **nearest At-The-Money (ATM)** or **1-strike In-The-Money (ITM)** monthly contract.
* **Liquidity Check**: Look at the market depth / order book on Zerodha. The bid-ask spread must be **1 tick (₹0.05 to ₹0.10)**. If the spread is ₹0.30 or wider, discard the contract immediately.

---

### Step 4: The 10:30 – 11:30 AM Freeze & 11:30 AM Signal Execution

Between 10:30 AM and 11:30 AM, institutions establish mid-day inventory. **Do not enter early.** Use this hour to monitor your 3-Minute Option Premium chart for the Blueprint Pre-Conditions:

1. **Option Premium vs VWAP**:
* **For CE**: Call premium must remain **above its own VWAP**.


* **For PE**: Put premium must remain **above its own VWAP**. *(Note: Even for a falling stock, its PE premium must be rising and trading above the PE chart's VWAP)*.




2. **Base Formation**: Identify a **4 to 6 candle tight horizontal consolidation base** near the 9 and 26 EMA crossover.


3. **Pre-Calculate Risk Before 11:30 AM**:
* Measure the distance from the top of the base (Trigger) to the base swing low.


* If $\text{Risk} \le 15\%$: Trade is pre-approved.


* If the breakout candle closes after 11:30 AM, execute the trade immediately and enter the parameters into your `Trade_Execution_Tracker`.





Would you like to add automated conditional formatting into your `Morning_Stock_Radar` sheet to color-code stocks based on CE (Long Buildup) vs PE (Short Buildup) criteria?
---
### Step-by-Step Blueprint & Screener Setup

To trade this system patiently and eliminate emotional decision-making, mechanical execution must replace live screen staring.

---

### 1. Morning Routine: Identifying Trending Stocks (09:15 – 10:30 AM)

Do not track 20 stocks at once; narrow it down to **2 to 3 high-momentum candidates** before your trading window:

1. **Top Gainers & Sector Strength (09:15 – 09:30 AM)**:
* Filter the top 3–5 stocks on the Nifty 500 / F&O gainers list that are up between **+1.0% and +2.5%** with sector momentum (e.g., Financials, Metals, Auto).
* Avoid stocks with huge gaps (>4%), as they frequently face early profit booking or chop.


2. **Volume Confirmation (09:30 – 10:15 AM)**:
* The stock's volume on the 5-minute/15-minute timeframe should track at **1.5x to 2x above its 20-period average volume**.


3. **The Triple-Chart Alignment Filter**:
* **Cash Stock (Spot)**: Price must be trading firmly above daily VWAP and above the 20 EMA.
* **Stock Futures**: Must show **Long Buildup** (Price up + Open Interest expanding).
* **ATM Option Premium (3-Minute)**: Open the immediate At-The-Money (ATM) or 1-strike In-The-Money (ITM) Call option. If the spot is trending but the option chart is stuck below its VWAP, **do not take the trade**.



---

### 2. Waiting for the Signal (11:30 AM – 1:30 PM Window)

Once your 2 candidate option charts are open:

* **Wait for the Consolidation Base**: Price must print **4 to 6 candles in a tight sideways range** hugging or riding above VWAP with the **9 EMA > 26 EMA**.


* **Calculate Risk Before Entry**:

$$\text{Risk \%} = \frac{\text{Breakout Entry} - \text{Base Swing Low}}{\text{Breakout Entry}}$$


* If the risk is **$\le$ 15%**, the trade setup is **Valid**.


* If the risk is **$> 20\%$**, skip the trade regardless of how tempting the chart appears.




* **Enter on Candle Close**: Do not anticipate. Let the 3-minute candle close above the consolidation high, then enter instantly via limit order.



---

### 3. The 4-Stage Emotion-Free Trailing Protocol

Once in the position, manage the trade using fixed broker stop-loss orders rather than manual reactions:

| Stage | Trigger / Move | Broker Action | Psychological Goal |
| --- | --- | --- | --- |
| **Initial Stop-Loss** | Trade Entry | Set hard SL at Consolidation Swing Low (5–10 pts below).

 | Defines exact risk up front. |
| **Stage 1** | **+25% to +30% Gain**

 | Modify SL order to **Cost-to-Cost (Entry Price)**.

 | **100% Risk-Free.** Fear of losing capital is completely eliminated. |
| **Stage 2** | **+50% Gain**

 | Move SL to the low of the **last 2 candles** (locks $\approx$+25% profit).

 | Guarantees a profitable trade even if the market suddenly reverses. |
| **Stage 3** | **Riding the Trend**

 | Hold as long as 3-minute candles **close above 9 EMA**.

 | Prevents premature profit-booking on minor intra-candle wicks. |
| **Stage 4** | **Exit Signal**

 | Hit **2x Target limit order** OR exit on **candle breaking previous candle's low** after an extended upper wick (climax sign).

 | Captures outsized momentum (+70% to +100%) systematically. |

---

### What Is Inside the Attached Excel Workbook

The generated workbook (**`1_Lot_Momentum_Option_Trading_System.xlsx`**) includes three integrated sheets:

1. **`Trade_Execution_Tracker`**:
* Pre-programmed with formulas for **Initial SL**, **Risk %**, **Validation Filter**, **Stage 1 Price (+25%)**, **Stage 2 Price (+50%)**, **2x Target**, **Gross PnL**, and **Net PnL** (factoring in ₹65 friction).
* Includes your **BAJFINANCE NOV 1080 CE** trade populated as the baseline benchmark.


2. **`Morning_Stock_Radar`**:
* A systematic checklist to record Pre-Market gap, volume relative to 20 SMA, Cash Spot VWAP, Futures OI buildup, and Option Base status before classifying a stock into **Tier 1 (Ready)**, **Tier 2 (Track)**, or **Tier 3 (Ignore)**.


3. **`Discipline_Protocol`**:
* A print-ready table outlining the mandatory rules, mechanical broker orders, and common emotional pitfalls for each phase of the trade.



Would you like to customize the pre-market screening filters (such as specific sector indices or OI thresholds in Sensibull) to match your morning prep?
---
Your paper trade on the **BAJFINANCE NOV 1080 CE (3-Minute Chart)** is **strongly aligned** with the core rules of your **Reproducible 1-Lot Momentum Blueprint**.

Here is the step-by-step audit comparing your execution against the checklist:

---

### 1. Pre-Conditions: Alignment Audit

* **Chart Timeframe (3-Minute)**: **Aligned.** The Zerodha chart is set strictly to the `3m` timeframe.


* **VWAP Filter**: **Aligned.** Price crossed above VWAP (orange line at ~₹14.80–₹14.87) during the late morning and sustained above it into the breakout.


* **EMA Trend Alignment**: **Aligned.** 9 EMA (blue) crossed above 26 EMA (green) right around the 12:15–12:30 period, confirming bullish momentum.


* **Base Structure**: **Aligned.** Between 12:00 and 12:45, the option printed a clean 10+ candle tight sideways consolidation band between ₹14.60 and ₹15.70, building the required volume accumulation base.


* **Volume Check**: **Aligned.** While the initial crossing had modest volume, noticeable volume expansion kicked in right as price started testing and breaking above the base.



---

### 2. Entry & Initial Stop-Loss

* **Breakout Trigger & Action**: **Aligned.** The entry line marked at **₹15.70** captures the breakout above the base high cleanly.


* **Stop-Loss (SL) Placement**: **Aligned.**
* Swing base support was sitting right at **₹14.66**.


* Risk = ₹15.70 – ₹14.66 = **₹1.04 points** (~6.6% risk).


* This is well within your blueprint rule of **10% to 15% max SL** (and far below the 20% avoid threshold).





---

### 3. Trailing & Milestone Execution

Your marked chart milestones match your 1-Lot trailing rules:

* **Stage 1 (+25% Move ~ ₹19.60–₹19.70)**: **Aligned.** Marked right at **₹19.70**. At this point, your SL automatically shifts to cost-to-cost (₹15.70), making the trade 100% risk-free.


* **Stage 2 (+50% Move ~ ₹23.55–₹23.71)**: **Aligned.** Marked accurately at **₹23.71**. Here, profit is locked beneath the previous 2-candle low (around the ₹19.70–₹20.00 shelf).


* **Stage 3 (Riding the Trend)**: **Aligned.** From ₹19.70 all the way to ₹26.00+, no 3-minute candle closed below the blue 9 EMA, signaling an uninterrupted hold.



---

### 4. Target & Exit Signals

* **Double Target (2x = ₹31.40)**: The move topped out at **₹29.00**. Because 2x was not fully hit before the session closed, **Exit Method B (Trailing / Climax)** applied.


* **Climax / Exit Trigger**:
* Near ₹28.50–₹29.00, the candles stretched far above the 9 EMA and formed upper rejection wicks.


* A red candle broke the previous candle’s low near **₹27.20–₹27.00**, triggering your Stage 3 / Method B exit rule to lock in **+73% to +75% gain** (~₹11.50 points per share).





---

### Operational Observation

* **Timing & Liquidity**: The breakout triggered between 12:30 PM and 1:00 PM, which lands inside the mid-day institutional continuation window. For stock options (especially nearing expiry weeks), ensure bid-ask spread slippage on Sahi/Zerodha remains tight when setting market-trailing stops.



Did you execute your exit via a trailing stop beneath the red candle low, or did you hold until the market close at 3:30 PM?
