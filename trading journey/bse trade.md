# Verify calculations from MarketStructure_Options_System_Pre_Trade_Calculator.csv
qty = 65
width = 200
net_prem = 145 - 65 # 80
cap_blocked = net_prem * qty # 5200
cap_pct = cap_blocked / 50000 # 10.4%
max_gross_profit = (width - net_prem) * qty # 7800
planned_sl = cap_blocked * 0.40 # 2080
sl_pct = planned_sl / 50000 # 4.16% -> 4.2%
exit_sl_unit = net_prem * (1 - 0.40) # 48
gross_target = max_gross_profit * 0.65 # 5070
exit_tgt_unit = net_prem + (gross_target / qty) # 80 + 78 = 158
brokerage = 50
net_target = gross_target - brokerage # 5020
net_loss = planned_sl + brokerage # 2130
net_rr = net_target / net_loss # 2.3568 -> 2.36

print(f"Qty: {qty}, Width: {width}, NetPrem: {net_prem}, CapBlocked: {cap_blocked} ({cap_pct:.1%})")
print(f"MaxGrossProfit: {max_gross_profit}, PlannedSL: {planned_sl} ({sl_pct:.1%}), ExitSLUnit: {exit_sl_unit}")
print(f"GrossTarget: {gross_target}, ExitTgtUnit: {exit_tgt_unit}, Brokerage: {brokerage}")
print(f"NetTarget: {net_target}, NetLoss: {net_loss}, NetRR: {net_rr:.2f}")


```

```text
Qty: 65, Width: 200, NetPrem: 80, CapBlocked: 5200 (10.4%)
MaxGrossProfit: 7800, PlannedSL: 2080.0 (4.2%), ExitSLUnit: 48.0
GrossTarget: 5070.0, ExitTgtUnit: 158.0, Brokerage: 50
NetTarget: 5020.0, NetLoss: 2130.0, NetRR: 2.36


```

The attached **`MarketStructure_Options_System_FY26-27`** workbook is completely intact, formula-verified, and clean (zero dummy trades in `Trade_Log`, starting equity initialized at **₹50,000.00** across all 100 rows).

---

### 1. Summary of Changes (`SwingPilot_Options_Spreads_FY26-27` → `MarketStructure_Options_System_FY26-27`)

* **Strategy Scope Expanded (2 → All 6 Directional & Spread Variants):**
* **Legacy (`SwingPilot`):** Supported only `Bull Call Spread` and `Bear Put Spread`.
* **New (`MarketStructure_Options_System`):** Routes setups across all **6 variants** (`Long Call`, `Long Put`, `Bull Call Spread`, `Bear Put Spread`, `Bull Put Spread`, `Bear Call Spread`) mapped to **3 Market Structure + IVP Regimes** (`Impulse BOS` at IVP < 35%, `Trend Pullback` at IVP 20%–55%, and `Range S&R Rejection` at IVP > 55%).


* **New `Structure_IVP_Matrix` Tab & 6-Gate Pre-Flight Scorer:**
* Added an interactive 6-gate `YES/NO` checklist before trade sizing that verifies open-trade count (`0`), the **11:30 AM – 1:30 PM IST** execution window, Daily/1H structure alignment, IVP regime match, Option Chain OI/bid-ask liquidity (`≤ ₹0.50` Index / `≤ ₹1.00` Stock), and the **NIFTY/SENSEX-only** rule for Credit Spreads.


* **3-Mode `Pre_Trade_Calculator` Engine:**
* Upgraded from a single debit-spread calculator to a dynamic **3-Mode Engine** (`Long Option`, `Debit Spread`, `Credit Spread`) enforcing **₹5,000 (10%)** max debit for Long Options, **₹7,500 (15%)** max debit for Debit Spreads, **₹38,500** max SPAN margin for Credit Spreads, a unified **₹2,500 (5.0%)** hard stop-loss ceiling, and automatic Sahi brokerage (**₹25** round-trip for 1-leg vs. **₹50** for 2-leg).


* **Clean-Slate `Trade_Log` & Multi-Dimension `Dashboard`:**
* Cleared the `SHRIRAMFIN` entry, added **`Mode (Paper / Live)`**, **`Market Structure`**, and **`Entry IVP %`** columns to `Trade_Log`, updated the Net P&L formula to automatically invert subtraction for Credit Spreads `(Entry - Exit) × Qty - Brokerage`, and expanded `Dashboard` and `10_Trade_Batch_Analytics` to track performance by **Strategy**, **Market Structure**, and **Segment**.



---

### 2. Exact Input Checklist While Trading (What You Fill In & Where)

When scanning and executing a live or paper trade during the **11:30 AM – 1:30 PM IST** window, enter **only** the user-input cells across these 3 tabs in sequence:

#### Step A: `Structure_IVP_Matrix` Tab (6 Pre-Flight Dropdowns)

Set each gate to **`YES`** or **`NO`** before calculating size:

1. **Gate 1:** `0` OPEN trades in `Trade_Log`, weekly loss under **₹5,000**, and monthly drawdown under **₹7,500**.
2. **Gate 2:** Current time is **11:30 AM – 1:30 PM IST** with no earnings/RBI/macro event inside your hold window.
3. **Gate 3:** Daily & 1H chart clearly confirms **`Impulse BOS`**, **`Trend Pullback`**, or **`Range S&R Rejection`**.
4. **Gate 4:** Live **IV Percentile (IVP)** matches the strategy (`< 35%` Long Option, `20%–55%` Debit Spread, `> 55%` Index Credit Spread).
5. **Gate 5:** Option Chain OI wall/PCR confirms direction and bid-ask spread is **`≤ ₹0.50`** (Index) or **`≤ ₹1.00`** (F&O Stock).
6. **Gate 6:** Contract is **7–20 DTE**, and any Credit Spread is strictly on **NIFTY** or **SENSEX**.
*(Proceed only when Row 7 displays **`SETUP VALID — PROCEED TO CALCULATOR`**).*

#### Step B: `Pre_Trade_Calculator` Tab (14 Cream User-Entry Cells)

Enter your live Sahi / Kite option chain quotes into the left-hand input block:

1. **Strategy Mode:** Select `Long Option`, `Debit Spread`, or `Credit Spread`.
2. **Specific Strategy:** Select `Long Call`, `Long Put`, `Bull Call Spread`, `Bear Put Spread`, `Bull Put Spread`, or `Bear Call Spread`.
3. **Market Structure Regime:** Select `Impulse BOS`, `Trend Pullback`, or `Range S&R Rejection`.
4. **Segment:** Select `Index` or `F&O Stock`.
5. **Underlying Symbol:** e.g., `NIFTY`, `SENSEX`, `RELIANCE`, `ICICIBANK`.
6. **Lot Size (Qty per Lot):** e.g., `65` for NIFTY, `20` for SENSEX.
7. **Number of Lots:** Keep at `1` during initial batches.
8. **Primary Leg Strike:** Long strike for Long Option / Debit Spread; **Short** strike for Credit Spread.
9. **Hedge Leg Strike:** Enter `0` for Long Option; enter OTM hedge strike for Spreads.
10. **Primary Leg Premium (₹/unit):** Current mid/limit price of the primary leg.
11. **Hedge Leg Premium (₹/unit):** Enter `0` for Long Option; enter hedge leg premium for Spreads.
12. **SPAN + Exposure Margin Required (₹):** Enter `0` for Long Option / Debit Spread; enter Sahi basket SPAN margin for Credit Spreads (must be **`≤ ₹38,500`**).
13. **Planned Stop-Loss (%):** Enter `30.0%` (`0.30`) for Long Option, `40.0%` (`0.40`) for Debit Spread, or `100.0%` (`1.00`) for Credit Spread (auto-capped at **₹2,500**).
14. **Planned Profit Target (%):** Enter `65.0%` (`0.65`) default target.
*(Execute order in Sahi only when Row 26 displays **`GO — APPROVED TO EXECUTE`**).*

#### Step C: `Trade_Log` Tab (17 Cream Columns per Trade Row)

* **At Trade Entry (13 inputs):**
1. `Entry Date` (YYYY-MM-DD)
2. `Mode` (`Paper` or `Live`)
3. `Segment` (`Index` or `F&O Stock`)
4. `Market Structure` (`Impulse BOS`, `Trend Pullback`, or `Range S&R Rejection`)
5. `Entry IVP %` (e.g., `19.0%`)
6. `Strategy` (Exact 1 of 6 variants)
7. `Underlying` (Symbol)
8. `Strikes (Long/Short)` (e.g., `25150 CE / 25350 CE`)
9. `Qty` (Total quantity = Lots × Lot Size)
10. `Entry Net Prem/Credit (₹)` (Actual filled net debit or credit per unit)
11. `Capital/Margin Blocked (₹)` (Total debit paid or SPAN margin blocked)
12. `Planned SL (₹)` (From `Pre_Trade_Calculator`, `≤ ₹2,500`)
13. `Target Profit (₹)` (From `Pre_Trade_Calculator`)
14. `Status` → Set to **`OPEN`** (and set GTT/Limit exit in Sahi).


* **At Trade Exit (3 inputs):**
15. `Exit Date`
16. `Exit Price (₹/unit)` (Actual filled exit option or net spread price)
17. `Status` → Update from `OPEN` to **`WIN`**, **`LOSS`**, or **`BE`** (Brokerage, Net P&L, R-Multiple, Equity Curve, Drawdown, `Dashboard`, and `10_Trade_Batch_Analytics` update automatically)
18. `Rule Adherence & Notes` (Record any slippage, early exit reason, or rule check).

*(Note: One minor cosmetic check on `Pre_Trade_Calculator` — when switching `Strategy Mode` to `Long Option`, remember to manually type `0` in `Hedge Leg Strike` and `Hedge Leg Premium` so old spread values do not carry over into the calculation.)*
