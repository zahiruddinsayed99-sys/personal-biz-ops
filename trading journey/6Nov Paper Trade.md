```python
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

# Create workbook
wb = openpyxl.Workbook()

# Sheet 1: Trade Execution & Trailing Tracker
ws1 = wb.active
ws1.title = "Trade_Execution_Tracker"
ws1.views.sheetView[0].showGridLines = True

# Colors
navy_header = PatternFill(start_color="1F4E78", end_color="1F4E78", fill_type="solid")
slate_sub = PatternFill(start_color="D9E1F2", end_color="D9E1F2", fill_type="solid")
green_fill = PatternFill(start_color="E2EFDA", end_color="E2EFDA", fill_type="solid")
gold_fill = PatternFill(start_color="FFF2CC", end_color="FFF2CC", fill_type="solid")
zebra_fill = PatternFill(start_color="F9FAFB", end_color="F9FAFB", fill_type="solid")

font_title = Font(name="Calibri", size=15, bold=True, color="1F4E78")
font_sub = Font(name="Calibri", size=10, italic=True, color="595959")
font_header = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
font_bold = Font(name="Calibri", size=10, bold=True)
font_regular = Font(name="Calibri", size=10)

thin_border = Side(border_style="thin", color="D9D9D9")
border_all = Border(left=thin_border, right=thin_border, top=thin_border, bottom=thin_border)
header_border = Border(left=thin_border, right=thin_border, top=thin_border, bottom=Side(border_style="medium", color="1F4E78"))

# Title
ws1["A1"] = "1-LOT MOMENTUM OPTION EXECUTION & TRAILING CALCULATOR"
ws1["A1"].font = font_title
ws1["A2"] = "Strict 4-Stage Rule Automation: Risk Filter, Stage 1 (+25% Cost-to-Cost), Stage 2 (+50% Lock), Stage 3 Trailing & 2x Target"
ws1["A2"].font = font_sub

# Headers
headers1 = [
    "Date", "Contract / Symbol", "Trade Type", "Lot Size",
    "Entry Price (₹)", "Base Low (₹)", "Initial SL (₹)", "Risk Pts", "Risk %", "Risk Status",
    "Stage 1 Target (+25%)", "Stage 1 Action",
    "Stage 2 Target (+50%)", "Stage 2 Action",
    "2x Double Target (+100%)",
    "Exit Price (₹)", "Gross PnL (₹)", "Brokerage & Friction (₹)", "Net PnL (₹)", "ROI %", "Exit Reason / Stage"
]

for col_idx, h in enumerate(headers1, 1):
    cell = ws1.cell(row=4, column=col_idx, value=h)
    cell.fill = navy_header
    cell.font = font_header
    cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    cell.border = header_border

ws1.row_dimensions[4].height = 32

# Sample Row 1: BAJFINANCE 1080 CE
r = 5
ws1.cell(row=r, column=1, value="2026-11-06").alignment = Alignment(horizontal="center")
ws1.cell(row=r, column=2, value="BAJFINANCE NOV 1080 CE").alignment = Alignment(horizontal="left")
ws1.cell(row=r, column=3, value="CE Buy").alignment = Alignment(horizontal="center")
ws1.cell(row=r, column=4, value=125).alignment = Alignment(horizontal="center")
ws1.cell(row=r, column=5, value=15.70).alignment = Alignment(horizontal="right")
ws1.cell(row=r, column=6, value=14.66).alignment = Alignment(horizontal="right")

# Formulas
ws1.cell(row=r, column=7, value=f"=F{r}").alignment = Alignment(horizontal="right") # Initial SL
ws1.cell(row=r, column=8, value=f"=E{r}-G{r}").alignment = Alignment(horizontal="right") # Risk Pts
ws1.cell(row=r, column=9, value=f"=H{r}/E{r}").alignment = Alignment(horizontal="right") # Risk %
ws1.cell(row=r, column=10, value=f'=IF(I{r}<=0.15,"VALID (<15%)",IF(I{r}<=0.2,"MARGINAL (15-20%)","REJECT (>20%)"))').alignment = Alignment(horizontal="center")

# Targets
ws1.cell(row=r, column=11, value=f"=E{r}*1.25").alignment = Alignment(horizontal="right") # Stage 1 (+25%)
ws1.cell(row=r, column=12, value=f'="Shift SL to Cost (₹" & TEXT(E{r},"0.00") & ")"').alignment = Alignment(horizontal="center")
ws1.cell(row=r, column=13, value=f"=E{r}*1.50").alignment = Alignment(horizontal="right") # Stage 2 (+50%)
ws1.cell(row=r, column=14, value=f'="Trail SL to 2-candle low (+25% locked)"').alignment = Alignment(horizontal="center")
ws1.cell(row=r, column=15, value=f"=E{r}*2.00").alignment = Alignment(horizontal="right") # 2x Target

# Exit & PnL
ws1.cell(row=r, column=16, value=27.00).alignment = Alignment(horizontal="right") # Exit Price
ws1.cell(row=r, column=17, value=f"=(P{r}-E{r})*D{r}").alignment = Alignment(horizontal="right") # Gross PnL
ws1.cell(row=r, column=18, value=65.00).alignment = Alignment(horizontal="right") # Friction
ws1.cell(row=r, column=19, value=f"=Q{r}-R{r}").alignment = Alignment(horizontal="right") # Net PnL
ws1.cell(row=r, column=20, value=f"=(P{r}-E{r})/E{r}").alignment = Alignment(horizontal="right") # ROI %
ws1.cell(row=r, column=21, value="Stage 3 Climax Rejection (Broken Prev Candle Low)").alignment = Alignment(horizontal="left")

# Format row 5
for c in range(1, len(headers1) + 1):
    cell = ws1.cell(row=r, column=c)
    cell.font = font_regular
    cell.border = border_all
    if c in [5, 6, 7, 8, 11, 13, 15, 16, 17, 18, 19]:
        cell.number_format = "₹#,##0.00"
    elif c in [9, 20]:
        cell.number_format = "0.0%"
    elif c == 4:
        cell.number_format = "#,##0"

# Add 15 template blank rows with formulas
for row_num in range(6, 21):
    fill_to_use = zebra_fill if row_num % 2 == 0 else PatternFill(fill_type=None)
    ws1.cell(row=row_num, column=3, value="CE Buy").alignment = Alignment(horizontal="center")
    ws1.cell(row=row_num, column=7, value=f'=IF(F{row_num}="","",F{row_num})').alignment = Alignment(horizontal="right")
    ws1.cell(row=row_num, column=8, value=f'=IF(E{row_num}="","",E{row_num}-G{row_num})').alignment = Alignment(horizontal="right")
    ws1.cell(row=row_num, column=9, value=f'=IF(E{row_num}="","",H{row_num}/E{row_num})').alignment = Alignment(horizontal="right")
    ws1.cell(row=row_num, column=10, value=f'=IF(I{row_num}="","",IF(I{row_num}<=0.15,"VALID (<15%)",IF(I{row_num}<=0.2,"MARGINAL (15-20%)","REJECT (>20%)")))').alignment = Alignment(horizontal="center")
    
    ws1.cell(row=row_num, column=11, value=f'=IF(E{row_num}="","",E{row_num}*1.25)').alignment = Alignment(horizontal="right")
    ws1.cell(row=row_num, column=12, value=f'=IF(E{row_num}="","","Shift SL to Cost (₹" & TEXT(E{row_num},"0.00") & ")")').alignment = Alignment(horizontal="center")
    ws1.cell(row=row_num, column=13, value=f'=IF(E{row_num}="","",E{row_num}*1.5)').alignment = Alignment(horizontal="right")
    ws1.cell(row=row_num, column=14, value=f'=IF(E{row_num}="","","Trail SL to 2-candle low (+25% locked)")').alignment = Alignment(horizontal="center")
    ws1.cell(row=row_num, column=15, value=f'=IF(E{row_num}="","",E{row_num}*2)').alignment = Alignment(horizontal="right")
    
    ws1.cell(row=row_num, column=17, value=f'=IF(OR(P{row_num}="",E{row_num}=""),"",(P{row_num}-E{row_num})*D{row_num})').alignment = Alignment(horizontal="right")
    ws1.cell(row=row_num, column=18, value=65.00).alignment = Alignment(horizontal="right")
    ws1.cell(row=row_num, column=19, value=f'=IF(Q{row_num}="","",Q{row_num}-R{row_num})').alignment = Alignment(horizontal="right")
    ws1.cell(row=row_num, column=20, value=f'=IF(OR(P{row_num}="",E{row_num}=""),"",(P{row_num}-E{row_num})/E{row_num})').alignment = Alignment(horizontal="right")

    for col_idx in range(1, len(headers1) + 1):
        c = ws1.cell(row=row_num, column=col_idx)
        c.font = font_regular
        c.border = border_all
        if fill_to_use.fill_type:
            c.fill = fill_to_use
        if col_idx in [5, 6, 7, 8, 11, 13, 15, 16, 17, 18, 19]:
            c.number_format = "₹#,##0.00"
        elif col_idx in [9, 20]:
            c.number_format = "0.0%"
        elif col_idx == 4:
            c.number_format = "#,##0"

# Sheet 2: Morning Screener & Triple-Confirmation Radar
ws2 = wb.create_sheet(title="Morning_Stock_Radar")
ws2.views.sheetView[0].showGridLines = True

ws2["A1"] = "MORNING TREND RADAR & 3-TIER ALIGNMENT CHECKLIST"
ws2["A1"].font = font_title
ws2["A2"] = "Pre-market & Opening Screener (09:15 - 11:30 AM) to prepare watchlist before your 11:30 AM - 1:30 PM execution window"
ws2["A2"].font = font_sub

headers2 = [
    "Stock Symbol", "Sector / Theme", "Pre-Market / 09:30 Gap %", "Day Volume vs 20-Avg", 
    "Cash Stock Trend (>VWAP?)", "Stock Future (>VWAP & +OI?)", "ATM Strike Selected", 
    "ATM Premium (>VWAP?)", "EMA Setup (9 > 26 EMA?)", "Base Formation (4-6 Candles?)", 
    "Execution Readiness", "Watchlist Tier / Action"
]

for col_idx, h in enumerate(headers2, 1):
    cell = ws2.cell(row=4, column=col_idx, value=h)
    cell.fill = navy_header
    cell.font = font_header
    cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    cell.border = header_border

ws2.row_dimensions[4].height = 28

sample_radar = [
    ("BAJFINANCE", "NBFC / Financials", "+1.4%", "1.8x Above Avg", "YES (Above VWAP)", "YES (Long Buildup)", "1080 CE", "YES", "YES", "YES (10 candles)", "READY FOR BREAKOUT", "Tier 1 (Execute on breakout)"),
    ("HINDZINC", "Metals / Commodities", "+2.1%", "2.2x Above Avg", "YES (Above VWAP)", "YES (OI +4%)", "540 CE", "YES", "YES", "Forming (3 candles)", "WAIT FOR BASE CLOSE", "Tier 1 (Monitor base)"),
    ("MOTHERSON", "Auto Ancillaries", "+0.6%", "0.9x Avg", "YES (Above VWAP)", "NO (Neutral OI)", "175 CE", "NO (At VWAP)", "NO", "No Base", "NOT READY", "Tier 3 (Ignore)"),
    ("LODHA", "Real Estate", "+1.8%", "1.4x Above Avg", "YES (Above VWAP)", "YES (Long Buildup)", "1300 CE", "YES", "Forming Cross", "Forming Base", "WAIT FOR CONFIRMATION", "Tier 2 (Track on 3m)")
]

for idx, data in enumerate(sample_radar, 5):
    for c_idx, val in enumerate(data, 1):
        cell = ws2.cell(row=idx, column=c_idx, value=val)
        cell.font = font_regular
        cell.border = border_all
        if c_idx in [1, 2, 7, 12]:
            cell.alignment = Alignment(horizontal="left")
        else:
            cell.alignment = Alignment(horizontal="center")

# Sheet 3: Emotion & Discipline Protocol
ws3 = wb.create_sheet(title="Discipline_Protocol")
ws3.views.sheetView[0].showGridLines = True

ws3["A1"] = "EMOTION-FREE EXECUTION BLUEPRINT & RULES CHECKLIST"
ws3["A1"].font = font_title
ws3["A2"] = "Mental Guardrails to eliminate premature exits, revenge trades, and over-monitoring"
ws3["A2"].font = font_sub

protocol_data = [
    ("Phase", "Rule / Condition", "Mandatory Action", "Emotional Pitfall to Avoid"),
    ("Pre-Market", "Stock Selection (09:15 - 10:30)", "Pick top 2-3 stocks with Sector strength, >VWAP, and Volume spike.", "Chasing random green candles without base consolidation."),
    ("Pre-Condition", "3-Minute Timeframe strict", "Wait for 4-6 candle base consolidation near or above VWAP with 9 EMA > 26 EMA.", "Anticipating the breakout before the 3-minute candle actually closes."),
    ("Pre-Condition", "Risk Filter (<15%)", "Calculate: (Entry - Swing Low) / Entry. If >15-20%, skip the trade immediately.", "Entering when the stop-loss is too deep, leading to fear and early panic exit."),
    ("Entry", "Breakout Execution", "Buy on breakout candle close with immediate GTT limit stop-loss order placed in broker.", "Second-guessing entry or buying on market order when spread is wide."),
    ("Stage 1 (+25% to +30%)", "Shift to Cost-to-Cost", "Modify SL order instantly to exact entry price. Trade is now 100% Risk-Free.", "Booking too early out of fear of losing small floating green profit."),
    ("Stage 2 (+50%)", "Lock 25% Gain", "Move SL to the low of the last 2 candles or structural shelf. Guarantee +25% profit.", "Greedily hoping for 2x without securing locked profits."),
    ("Stage 3 (Riding Trend)", "Hold Above 9 EMA", "Do not touch the trade as long as 3-minute candles close above the 9 EMA.", "Staring at the PnL tick-by-tick and getting shaken out by natural intra-candle wicks."),
    ("Stage 4 (Climax / 2x)", "Exit Execution", "Either hit 2x Limit Order OR exit when a candle breaks previous candle low with long upper wick.", "Holding through a full trend reversal or hoping for a bounce after a breakdown.")
]

for r_idx, row in enumerate(protocol_data, 4):
    for c_idx, val in enumerate(row, 1):
        cell = ws3.cell(row=r_idx, column=c_idx, value=val)
        if r_idx == 4:
            cell.fill = navy_header
            cell.font = font_header
            cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
            cell.border = header_border
        else:
            cell.font = font_regular
            cell.border = border_all
            cell.alignment = Alignment(horizontal="left", vertical="top", wrap_text=True)
            if r_idx % 2 == 1:
                cell.fill = zebra_fill

ws3.row_dimensions[4].height = 25

# Adjust column widths for all sheets
for ws in [ws1, ws2, ws3]:
    for col in ws.columns:
        max_len = 0
        col_letter = get_column_letter(col[0].column)
        for cell in col:
            # Skip title row length
            if cell.row in [1, 2]:
                continue
            val_str = str(cell.value or "")
            if len(val_str) > max_len:
                max_len = len(val_str)
        ws.column_dimensions[col_letter].width = max(max_len + 3, 12)

# Specific tweaks
ws1.column_dimensions["A"].width = 13
ws1.column_dimensions["B"].width = 25
ws1.column_dimensions["J"].width = 18
ws1.column_dimensions["L"].width = 25
ws1.column_dimensions["N"].width = 30
ws1.column_dimensions["U"].width = 35

ws2.column_dimensions["A"].width = 16
ws2.column_dimensions["B"].width = 22
ws2.column_dimensions["F"].width = 25
ws2.column_dimensions["K"].width = 24
ws2.column_dimensions["L"].width = 25

ws3.column_dimensions["A"].width = 20
ws3.column_dimensions["B"].width = 32
ws3.column_dimensions["C"].width = 45
ws3.column_dimensions["D"].width = 40

file_path = "1_Lot_Momentum_Option_Trading_System.xlsx"
wb.save(file_path)
print(f"FILE_SAVED: {file_path}")


```

```text
FILE_SAVED: 1_Lot_Momentum_Option_Trading_System.xlsx


```

Your Excel file is ready:


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
