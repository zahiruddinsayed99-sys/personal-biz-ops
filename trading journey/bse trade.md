```python
# Extract exact numbers from the two BSE screenshots (16 Nov 2026, 12:11 - 12:12 IST)
# Screenshot 1: Option Chain (BSE, 23 Nov expiry = 7 days DTE)
spot = 3912.00
pcr = 0.87
max_pain = 3700
atm_iv = 32.80
ivp = 19.00 # "19.00 - Low"

# Strikes and LTPs from Option Chain:
# 3900 CE = 78.95 (Call OI = 9.52L, +46.46%), 3900 PE = 66.05 (Put OI = 7.03L, +4.71%)
# 3950 CE = 55.00 (Call OI = 5.20L, +21.84%), 3950 PE = 92.00 (Put OI = 1.26L, +38.46%)
# 4000 CE = 38.00 (Call OI = 11.39L, +5.21%), 4000 PE = 124.35 (Put OI = 3.95L, +12.40%)
# 3850 CE = 110.90 (Call OI = 1.42L), 3850 PE = 45.80 (Put OI = 1.84L)
# 3800 CE = 141.75 (Call OI = 5.24L), 3800 PE = 30.10 (Put OI = 4.46L)

# Screenshot 2: 1H Chart of BSE (left) & 15m Chart of BSE NOV 3700 PE (right)
# 1H BSE Chart: O=3920.20, H=3927.00, L=3903.30, C=3904.00 (-16.70, -0.43%)
# 1H EMA 9 = 3918.67 (blue), EMA 21 = 3892.70 (green) -> Note: EMA Cross 9 21 label says 3,903.72 / 3,868.14, right axis shows 3918.67 / 3892.70. Price ~3904-3912 is sitting right on/slightly below 9 EMA (~3918) and just above 21 EMA (~3892.70) after a huge run from 3200 to 3960.
# Also look at 3700 PE on right chart: trading around ₹12.45 (Buy 12.70 / Sell 12.40, spread ₹0.30).

# Let's check BSE F&O lot size and position sizing math!
# Note: BSE Ltd (NSE: BSE) lot size in F&O - let's check common lot sizes (e.g., 125 or 250 or 375 depending on price revision, let's compute per-unit and check standard lot sizes)
for lot_size in [125, 250, 375]:
    # 1. Long Call 3900 CE @ 78.95
    lc_cost = 78.95 * lot_size
    # 2. Bull Call Spread: Buy 3900 CE (78.95) / Sell 3950 CE (55.00) -> Net Debit = 23.95, Width = 50 (47.9% of width)
    bcs_50_debit = (78.95 - 55.00) * lot_size
    bcs_50_max_prof = (50 - 23.95) * lot_size
    # 3. Bull Call Spread: Buy 3900 CE (78.95) / Sell 4000 CE (38.00) -> Net Debit = 40.95, Width = 100 (40.95% of width)
    bcs_100_debit = (78.95 - 38.00) * lot_size
    bcs_100_max_prof = (100 - 40.95) * lot_size
    print(f"--- If Lot Size = {lot_size} ---")
    print(f"Long 3900 CE (₹78.95): Debit = ₹{lc_cost:,.2f} (Cap: ₹5,000)")
    print(f"Bull Call 3900/3950 (Net ₹23.95, 47.9% width): Debit = ₹{bcs_50_debit:,.2f}, MaxProfit = ₹{bcs_50_max_prof:,.2f}, 40% SL = ₹{bcs_50_debit*0.4:,.2f}, 65% Tgt = ₹{bcs_50_max_prof*0.65:,.2f}")
    print(f"Bull Call 3900/4000 (Net ₹40.95, 41.0% width): Debit = ₹{bcs_100_debit:,.2f}, MaxProfit = ₹{bcs_100_max_prof:,.2f}, 40% SL = ₹{bcs_100_debit*0.4:,.2f}, 65% Tgt = ₹{bcs_100_max_prof*0.65:,.2f}")


```

```text
--- If Lot Size = 125 ---
Long 3900 CE (₹78.95): Debit = ₹9,868.75 (Cap: ₹5,000)
Bull Call 3900/3950 (Net ₹23.95, 47.9% width): Debit = ₹2,993.75, MaxProfit = ₹3,256.25, 40% SL = ₹1,197.50, 65% Tgt = ₹2,116.56
Bull Call 3900/4000 (Net ₹40.95, 41.0% width): Debit = ₹5,118.75, MaxProfit = ₹7,381.25, 40% SL = ₹2,047.50, 65% Tgt = ₹4,797.81
--- If Lot Size = 250 ---
Long 3900 CE (₹78.95): Debit = ₹19,737.50 (Cap: ₹5,000)
Bull Call 3900/3950 (Net ₹23.95, 47.9% width): Debit = ₹5,987.50, MaxProfit = ₹6,512.50, 40% SL = ₹2,395.00, 65% Tgt = ₹4,233.12
Bull Call 3900/4000 (Net ₹40.95, 41.0% width): Debit = ₹10,237.50, MaxProfit = ₹14,762.50, 40% SL = ₹4,095.00, 65% Tgt = ₹9,595.62
--- If Lot Size = 375 ---
Long 3900 CE (₹78.95): Debit = ₹29,606.25 (Cap: ₹5,000)
Bull Call 3900/3950 (Net ₹23.95, 47.9% width): Debit = ₹8,981.25, MaxProfit = ₹9,768.75, 40% SL = ₹3,592.50, 65% Tgt = ₹6,349.69
Bull Call 3900/4000 (Net ₹40.95, 41.0% width): Debit = ₹15,356.25, MaxProfit = ₹22,143.75, 40% SL = ₹6,142.50, 65% Tgt = ₹14,393.44


```

```python
# Let's check exact R:R and risk numbers for BSE 23 Nov expiry (7 DTE)
# Current data from screenshots:
# Spot = 3912.00 (1H chart close = 3904.00, pulling back toward 21 EMA at 3892.70)
# IV Percentile = 19.00 (Low), ATM IV = 32.80, PCR = 0.87, Max Pain = 3700
# 3900 CE = 78.95 (Call OI = 9.52L, +46.46% fresh Call writing!), 3900 PE = 66.05 (Put OI = 7.03L, +4.71%)
# 4000 CE = 38.00 (Call OI = 11.39L, +5.21% massive resistance wall)
# 3950 CE = 55.00 (Call OI = 5.20L, +21.84%)
# 3700 PE = ~12.45 (Buy 12.70 / Sell 12.40 -> Bid-Ask gap = ₹0.30)

# Let's verify R:R on Bull Call Spread 3900 CE / 3950 CE and 3900 CE / 4000 CE (regardless of lot size, per-unit ratio holds, and check lot size = 375 or 250 or 125)
# Note: On NSE, BSE Ltd lot size is 375 (after split/bonus adjustments, let's check both per-unit and 375/250/125 lot sizes without guessing lot size if not shown).
net_debit_50 = 78.95 - 55.00 # 23.95
max_prof_50 = 50 - net_debit_50 # 26.05
sl_50 = net_debit_50 * 0.40 # 9.58
tgt_50 = max_prof_50 * 0.65 # 16.9325
rr_50 = tgt_50 / sl_50 # 1.767 -> 1.77

net_debit_100 = 78.95 - 38.00 # 40.95
max_prof_100 = 100 - net_debit_100 # 59.05
sl_100 = net_debit_100 * 0.40 # 16.38
tgt_100 = max_prof_100 * 0.65 # 38.3825
rr_100 = tgt_100 / sl_100 # 2.343 -> 2.34

print(f"3900/3950 Bull Call: Net Debit = ₹{net_debit_50:.2f} (47.9% of 50pt width), SL = ₹{sl_50:.2f}, 65% Tgt = ₹{tgt_50:.2f}, Gross R:R = 1:{rr_50:.2f}")
print(f"3900/4000 Bull Call: Net Debit = ₹{net_debit_100:.2f} (41.0% of 100pt width), SL = ₹{sl_100:.2f}, 65% Tgt = ₹{tgt_100:.2f}, Gross R:R = 1:{rr_100:.2f}")


```

```text
3900/3950 Bull Call: Net Debit = ₹23.95 (47.9% of 50pt width), SL = ₹9.58, 65% Tgt = ₹16.93, Gross R:R = 1:1.77
3900/4000 Bull Call: Net Debit = ₹40.95 (41.0% of 100pt width), SL = ₹16.38, 65% Tgt = ₹38.38, Gross R:R = 1:2.34


```

Running **BSE (23 Nov Expiry — 7 DTE)** through your **`Structure_IVP_Matrix`** and **`Pre_Trade_Calculator`** rules gives a clear, objective answer: **it is a valid watchlist candidate for a Bull Call Spread, NOT an immediate market entry right now.**

---

### 1. Market Structure & IVP Diagnosis (From Your Live Charts)

* **Higher-Timeframe Structure (`Trend Pullback`):** On the 1H chart, BSE has rallied cleanly from **₹3,200 to ~₹3,960** in a strong Higher-High / Higher-Low uptrend. Right now, price is consolidating/pulling back (**₹3,904–₹3,912**), sitting slightly below the **1H 9 EMA (₹3,918.67)** and testing just above the **1H 21 EMA (₹3,892.70)**.
* **Volatility Regime (`IVP = 19.0 — Low`):** With **IV Percentile at 19.0** (ATM IV **32.80**), options are relatively cheap. Under your system:
* **Credit Spreads (`Bull Put` / `Bear Call`) are BANNED** (IVP is well below `55%`, and BSE is an F&O stock, not NIFTY/SENSEX).
* **Naked `Long Call` is TOO EXPENSIVE** for a ₹50,000 account (`3900 CE` is **₹78.95/unit**, which exceeds your **₹5,000** 10% Long Option debit cap for 1 full F&O lot).
* **Qualifying Strategy:** **`Bull Call Spread`** (Regime 2: Trend Pullback + Low-to-Moderate IVP).


* **Option Chain Conflict (`Why Not to Enter Yet`):**
* **4000 CE** holds the largest resistance wall (**11.39L OI**, +5.21%).
* More importantly, **3900 CE just saw +46.46% fresh Call OI addition (9.52L OI)** vs. only **+4.71% Put OI addition at 3900 PE (7.03L OI)**, with **PCR at 0.87**. That means intraday Call writers are defending **₹3,900–₹3,920** right now.
* *(Note on the `3700 PE` chart on the right: it is trading at **₹12.45** with a tight **₹0.30** bid-ask spread, confirming good liquidity, though at 7 DTE a deep OTM 3700 PE is a low-probability lottery strike and violates your ATM/1-OTM rule).*



---

### 2. Pre-Trade Calculator Audit (Candidate Spreads at 7 DTE)

If BSE holds the **1H 21 EMA (₹3,892.70)** and prints a bullish 15m/1H reversal candle, here is how the two candidate **Bull Call Spreads** price out from your option chain:

| Spread Construction | Buy / Sell Premiums (₹/unit) | Net Debit / Unit | Debit % of Width (Rule: 35%–45%) | 40% Hard SL / Unit | 65% Profit Target / Unit | Gross R:R (Rule: ≥ 1:1.5) |
| --- | --- | --- | --- | --- | --- | --- |
| **3900 CE / 3950 CE** (50-pt width) | Buy **₹78.95** / Sell **₹55.00** | **₹23.95** | **47.9%** *(Slightly rich)* | **₹9.58** (Exit @ ₹14.37) | **₹16.93** (Exit @ ₹40.88) | **1 : 1.77** *(Pass)* |
| **3900 CE / 4000 CE** (100-pt width) | Buy **₹78.95** / Sell **₹38.00** | **₹40.95** | **41.0%** *(Ideal range)* | **₹16.38** (Exit @ ₹24.57) | **₹38.38** (Exit @ ₹79.33) | **1 : 2.34** *(Strong)* |

* **Critical Lot-Size Capital Check:** Before placing any order in Sahi, plug BSE's exact NSE F&O lot size into your `Pre_Trade_Calculator` tab. If 1 lot of BSE is **375 qty**, even the narrower `3900/3950 CE` spread costs **₹8,981.25** (`₹23.95 × 375`), which **violates your ₹7,500 (15%) max debit cap** and triggers a **`NO-GO`**. If the lot size is **250 qty**, `3900/3950 CE` costs **₹5,987.50** (with a **₹2,395** SL — both **PASS**).

---

### 3. Actionable Plan for This Setup

1. **Wait for Trigger (Do Not Catch a Falling Knife):** Let BSE test the **₹3,890–₹3,900** zone (`1H 21 EMA` at ₹3,892.70). Only consider entry if a **15m or 1H bullish engulfing/rejection candle** closes back above **₹3,915** with **3900 CE Call writers unwinding** (OI % turning negative).
2. **Verify Lot Size Cap First:** Check BSE's lot size in Sahi. If `Net Debit × Lot Size > ₹7,500` or `40% SL > ₹2,500`, skip BSE completely and stick to **NIFTY / SENSEX** or lower-debit F&O stocks where 1 lot fits cleanly inside your ₹50,000 guardrails.
3. **Hard Exit Cutoff:** Because this is a **23 Nov expiry (7 DTE)** F&O stock contract, if entered, you must square off no later than **Thursday/Friday (DTE ≤ 1)** to avoid physical delivery margin spikes.
