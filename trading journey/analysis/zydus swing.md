```python
# Exact calculations for Zydus Lifesciences trade
buy_price = 1238.30
cmp = 1261.80

target_6pct = buy_price * 1.06
target_8pct = buy_price * 1.08
target_10pct = buy_price * 1.10

ath_resistance = 1324.00 # approximate from weekly chart (August 2024 peak around 1320-1325)

print(f"Buy Price: {buy_price}")
print(f"CMP: {cmp} (+{((cmp-buy_price)/buy_price)*100:.2f}%)")
print(f"Target 6%: {target_6pct:.2f} (Gain: ₹{target_6pct - buy_price:.2f})")
print(f"Target 8%: {target_8pct:.2f} (Gain: ₹{target_8pct - buy_price:.2f})")
print(f"Target 10%: {target_10pct:.2f} (Gain: ₹{target_10pct - buy_price:.2f})")

# DP Charges impact on 1 Qty vs 3 Qty (original + 2 added) vs 10 Qty
dp_zerodha = 15.34

for qty in [1, 2, 3, 5, 10, 15]:
    profit_8pct = (target_8pct - buy_price) * qty
    net_profit = profit_8pct - dp_zerodha
    dp_drag = (dp_zerodha / profit_8pct) * 100
    print(f"Qty: {qty} | Capital: ₹{buy_price*qty:.2f} | 8% Profit: ₹{profit_8pct:.2f} | Net: ₹{net_profit:.2f} | DP Drag: {dp_drag:.2f}%")


```

```text
Buy Price: 1238.3
CMP: 1261.8 (+1.90%)
Target 6%: 1312.60 (Gain: ₹74.30)
Target 8%: 1337.36 (Gain: ₹99.06)
Target 10%: 1362.13 (Gain: ₹123.83)
Qty: 1 | Capital: ₹1238.30 | 8% Profit: ₹99.06 | Net: ₹83.72 | DP Drag: 15.48%
Qty: 2 | Capital: ₹2476.60 | 8% Profit: ₹198.13 | Net: ₹182.79 | DP Drag: 7.74%
Qty: 3 | Capital: ₹3714.90 | 8% Profit: ₹297.19 | Net: ₹281.85 | DP Drag: 5.16%
Qty: 5 | Capital: ₹6191.50 | 8% Profit: ₹495.32 | Net: ₹479.98 | DP Drag: 3.10%
Qty: 10 | Capital: ₹12383.00 | 8% Profit: ₹990.64 | Net: ₹975.30 | DP Drag: 1.55%
Qty: 15 | Capital: ₹18574.50 | 8% Profit: ₹1485.96 | Net: ₹1470.62 | DP Drag: 1.03%


```

### Technical Structure & Chart Analysis (ZYDUSLIFE Weekly)

* **Multi-Month Base Breakout:** Chart par Zydus Life ne May–October 2026 ke consolidation cup base (₹1,100–₹1,240 zone) se strong weekly expansion candle ke sath breakout diya hai.


* **Position Status:** Buy price **₹1,238.30** par tha aur CMP **₹1,261.80** (+1.90% running gain) hai.


* **All-Time High (ATH) Supply Zone:** August 2024 ka ATH peak **₹1,320 – ₹1,325** ke paas hai. Yeh zone pehla major natural target aur resistance banega.



---

### Target Levels (6% to 10% Math)

| Level / Target | Price (₹) | Target % | Gain Per Share (₹) | Structural Reference |
| --- | --- | --- | --- | --- |
| **Conservative (T1)** | **₹1,312.60** | **+6.0%** | +₹74.30 | Just below All-Time High resistance zone

 |
| **ATH Test (T2)** | **₹1,337.40** | **+8.0%** | +₹99.06 | All-Time High breakout retest zone

 |
| **Trend Extension (T3)** | **₹1,362.10** | **+10.0%** | +₹123.83 | Blue-sky breakout expansion into new ATH |

---

### Pullback & Pyramiding (Adding 1–2 Qty)

1. **Ideal Add Zone:** Agar stock sideways consolidate ya retest pullback deta hai toward **₹1,240 – ₹1,248** (breakout zone), wahan 1 ya 2 quantity add karein.


2. **Invalidation Level (Hard Stop):** Breakout candle base aur recent weekly swing support **₹1,215** ke niche sustain karne par trade ka momentum slow ho jayega. Weekly closing below ₹1,215 invalidates the swing breakout.


3. **Quantity Sizing vs. DP Drag Math:**
* **1 Qty par:** 8% gain par total gross profit ₹99 banta hai, jisme ₹15.34 Zerodha DP charge seedha **15.5% profit kha jata hai**.
* **3 Qty par (1 existing + 2 added on pullback):** Total capital deployed ~₹3,715 hoga. 8% target par gross profit **₹297.20** banega aur DP charge impact drop hokar **5.1%** reh jayega.
* *Ideal Swing Scale:* Agar aap is position ko total **5 se 8 Qty** (~₹6,200 – ₹10,000) tak gradually scale karein, toh DP charge ka drag **< 3%** ho jayega, jo swing delivery ke liye optimal hai.



---

### Holding & Trailing Protocol

* **Daily Timeframe Trailing:** Chart par switch karke **9 EMA** ya **prior day low** ko monitor karein. Jab tak price daily closing basis par prior swing low nahi todta, hold karte rahein.
* **T1 (₹1,312) Approach:** Jab price ₹1,315 – ₹1,320 zone mein pahuche:


* Agar total 3 quantity hai, toh 1-2 quantity ₹1,315–₹1,325 ke paas book karein (+6% to +8% safe lock).


* Remaining 1 quantity ka stop-loss trail karke **Cost (₹1,245–₹1,250)** par rakh dein aur ₹1,360+ ke blue-sky breakout ke liye ride karein.
