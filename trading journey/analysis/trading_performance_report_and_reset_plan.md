# Consolidated Trading Performance Report & Strategic Reset Plan
**Period Covered:** April 1, 2026 – November 3, 2026  
**Accounts Analyzed:** Zerodha & Sahi (Equity Delivery & F&O / Options)

---

## 1. Executive Performance Dashboard

An audit of your raw transaction logs reveals a clear structural contrast:
* **Equity Delivery / Swing Trading:** A disciplined, high-patience system yielding a **100% win rate** across both accounts, generating positive net alpha.
* **F&O / Options Trading:** High-frequency, negative-expectancy trading severely amplified by high brokerage and transaction friction, resulting in significant net capital erosion.

### Consolidated P&L & Friction Matrix

| Trading Segment | Executed Trades | Win Rate | Gross Realized P&L | Total Charges & Taxes | Net Realized P&L | Friction / Gross Loss Impact |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Zerodha Equity** | 20 | 100.0% | +₹2,186.81 | ₹581.26 *(₹97.46 charges + ₹483.80 DP/AMC)* | **+₹1,605.55** | Net Green |
| **Sahi Equity** | 5 | 100.0% | +₹167.79 | ₹55.29 *(₹14.79 statutory + ₹40.50 DP)* | **+₹112.50** | Net Green |
| **Zerodha F&O** | 36 | 50.0% | -₹5,215.25 | ₹3,995.83 *(₹3,200 brokerage alone)* | **-₹9,211.08** | Charges = 76.6% of Gross Loss |
| **Sahi Options** | 76 | 30.3% | -₹7,003.26 | ₹2,317.24 *(₹1,830 brokerage alone)* | **-₹9,320.50** | Charges = 33.1% of Gross Loss |
| **Consolidated** | **137** | **48.2%** | **-₹9,863.91** | **₹6,949.62** | **-₹16,813.53** | **Friction is 41.3% of total loss** |

*Note: Zerodha Equity currently holds 16 open positions with an unrealized P&L of -₹1,915.01.*

---

## 2. Statistical Metric Analysis

```
+--------------------------------------------------------------------------+
| COMBINED OPTIONS & F&O METRICS                                           |
+--------------------------------------------------------------------------+
| Total Closed Trades          : 112                                       |
| Winning Trades               : 41 (36.6%)                                |
| Losing Trades                : 71 (63.4%)                                |
| Gross P&L                    : -₹12,218.51                               |
| Average Win                  : ₹407.21                                   |
| Average Loss                 : ₹407.24                                   |
| Win / Loss Size Ratio        : 1.00                                      |
| Profit Factor                : 0.58                                      |
| Total Friction (Fees/Taxes)  : ₹6,313.07                                 |
| Net P&L                      : -₹18,531.58                               |
+--------------------------------------------------------------------------+
```

### Statistical Diagnosis

1. **The Risk-to-Reward (R:R) Deficit:**
   * In option buying, a $36.6\%$ win rate is not inherently fatal, provided the average win significantly exceeds the average loss (e.g., an R:R of $1:2.5$ or $1:3.0$).
   * Your data demonstrates an exact **1:1 payout ratio** (Average Win of ₹407 vs. Average Loss of ₹407). Mathematically, an edge with a $36.6\%$ hit rate and a $1:1$ ratio produces negative expectancy even before accounting for fees:
   $$\text{Expectancy per Trade} = (0.366 \times 407.21) - (0.634 \times 407.24) = 149.04 - 258.19 = -₹109.15$$
2. **The Turnover / Fee Trap:**
   * Over ₹6,300 was paid in flat brokerage and exchange transaction taxes on F&O contracts alone. 
   * On small lot sizes, a ₹20 buy + ₹20 sell + STT/stamp duty structure costs between **₹55 and ₹65 per completed trade**. For a trade risking ₹300 to ₹500, transaction friction immediately impairs your entry by $10\%$ to $20\%$.
3. **Execution Clustering & Overtrading:**
   * In Sahi Options, trading volume grew from an average of ~9 trades per month between May and September to **29 trades in October 2026**. This sudden spike in frequency correlated directly with your steepest equity drawdown period.

---

## 3. The 14-Day Structured Trading Break

A trading break is an operational reset designed to interrupt revenge cycles, decouple emotional attachment from recent drawdowns, and recalibrate your execution habits.

### Week 1: Total Operational Reset & Trade Audit (Days 1–7)

* **Objective:** Disengage from execution impulses and classify past trading errors.
* **Protocol:**
  1. **Enforce Segment Lock:** Activate Zerodha Kill Switch and cease all active order entry in Sahi.
  2. **Audit the 71 Option Losses:** Categorize every loss into one of four buckets:
     * **Bucket A (Chased Momentum / FOMO):** Entered after an extended candle without waiting for a retest.
     * **Bucket B (Time-Decay Bleed):** Held an out-of-the-money contract through mid-day range consolidation.
     * **Bucket C (Systematic Stop-Out):** Followed a planned setup with proper sizing, but the market invalidated the level.
     * **Bucket D (Friction Victim):** Closed around breakeven, but fees made the trade red.
  3. **Tally Costs:** Total the exact rupee value lost exclusively to Buckets A, B, and D.

### Week 2: Constrained Simulation & System Calibration (Days 8–14)

* **Objective:** Validate execution discipline without risking real capital.
* **Paper Trading Rules:**
  * **Restricted Time Window:** Observe charts and log potential setups strictly between **11:30 AM and 1:30 PM IST**.
  * **Maximum 1 Trade Setup Per Day:** Quality over quantity.
  * **Rigid Criteria:**
    * Maximum risk per trade: ₹500.
    * Minimum target: ₹1,000 (enforcing a strict $1:2$ Risk-to-Reward ratio).
    * Deduct a flat **₹65 simulated fee** from every trade outcome. If the setup cannot absorb this cost comfortably, disqualify it.

```
+---------------------------------------------------------------------------------------------------+
| PAPER TRADING LOG SCHEMA                                                                          |
+------+------------+--------+-------------+------------+--------+--------+------------+------------+
| Date | Instrument | Strike | Entry Price | Stop Level | Target | Exit   | Gross P&L  | Net (-₹65) |
+------+------------+--------+-------------+------------+--------+--------+------------+------------+
|      |            |        |             |            |        |        |            |            |
+---------------------------------------------------------------------------------------------------+
```

---

## 4. Restart Framework & Rules of Engagement

Once the two-week protocol is complete, implement the following operational safeguards before reintroducing real capital:

### 1. Capital Allocation & Position Limits
* **Options Volume Restriction:** Limit trading to **1 single lot** exclusively. Averaging down or adding contracts to a losing position is prohibited.
* **Daily Trade Limit:** Enforce a strict limit of **one F&O trade per day**. Whether it hits target or stop-loss, terminate trading for the day immediately afterward.
* **Weekly Circuit Breaker:** If cumulative weekly losses reach **-₹1,500**, trading access is locked for the remainder of the calendar week.

### 2. Transition Toward Core Competency (Equity Swing Trading)
* Your equity delivery data demonstrates high consistency across both platforms ($25\text{ wins out of }25\text{ trades}$, netting positive return).
* Reallocate your trading focus toward swing setups on liquid, large-to-mid-cap equities:
  * Trade multi-day moves using daily support levels and volume consolidation.
  * Avoid intraday theta decay, gamma squeezes, and rapid-fire turnover fees.

---

## 5. Summary Checklist

```
[ ] Days 1–7  : Complete broker segment lock; classify 71 option losses into Buckets A–D.
[ ] Days 8–14 : Paper trade exactly 1 setup/day (11:30 AM – 1:30 PM window only, 1:2 R:R minimum).
[ ] Post-Break: Restrict live options to 1 trade/day, 1 lot maximum, with a weekly ₹1,500 circuit breaker.
[ ] Portfolio : Shift primary working capital allocation toward Equity Swing Trading.
```