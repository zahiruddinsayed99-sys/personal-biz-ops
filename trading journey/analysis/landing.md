```python
import os
import glob
import pandas as pd

# List csv files
csv_files = glob.glob("*.csv")
print("Files:", csv_files)

for f in csv_files:
    print(f"\n--- {f} ---")
    try:
        # peek first 5 lines
        with open(f, 'r') as fp:
            lines = [fp.readline() for _ in range(5)]
            print("".join(lines))
    except Exception as e:
        print(f"Error reading {f}: {e}")


```

```text
Files: ['Zerodha FnO PnL - F&O.csv', 'Zerodha Equity PnL - Other Debits and Credits.csv', 'Zerodha Equity PnL - Equity.csv', 'Equity-FNO-Pnl-Sahi - Options PnL.csv', 'Equity-FNO-Pnl-Sahi - Equity PnL.csv']

--- Zerodha FnO PnL - F&O.csv ---
Client ID,FZY169,,,,,,,,,,,
P&L Statement for F&O from 2026-04-01 to 2026-11-03,,,,,,,,,,,,
Summary,,,,,,,,,,,,
Charges,3995.8274,,,,,,,,,,,
Other Credit & Debit,0,,,,,,,,,,,


--- Zerodha Equity PnL - Other Debits and Credits.csv ---
Client ID,FZY169,,
Other Debits and Credits for EQ from 2026-04-01 to 2026-11-03,,,
,,,
Particulars,Posting Date,Debit,Credit
DP Charges for Sale of RELIANCE on 02/11/2026,2026-11-02,15.34,0


--- Zerodha Equity PnL - Equity.csv ---
Client ID,FZY169,,,,,,,,,,,
P&L Statement for Equity from 2026-04-01 to 2026-11-03,,,,,,,,,,,,
,,,,,,,,,,,,
Summary,Column 1,Column 2,Column 3,Column 4,Column 5,Column 6,Column 7,Column 8,Column 9,Column 10,Column 11,Column 12
Charges,97.4574,,,,,,,,,,,


--- Equity-FNO-Pnl-Sahi - Options PnL.csv ---
F&O (Equities) P&L Statement from 01 April 2026 to 02 November 2026,,,,,,,,,,
Name,ZAHIRUDDIN KAMALUDDIN SAYED,,,,,,,,,
User ID / UCC,4013221300,,,,,,,,,
Realised P&L without charges,,,,,,,,,,
Futures,0.00,,,,,,,,,


--- Equity-FNO-Pnl-Sahi - Equity PnL.csv ---
Equity P&L Statement from 01 April 2026 to 02 November 2026,,,,,,,,,
Name,ZAHIRUDDIN KAMALUDDIN SAYED,,,,,,,,
User ID / UCC,4013221300,,,,,,,,
P&L Summary,,,,,,,,,
Realised P&L,167.79,,,,,,,,



```

```python
# Inspect full structure / tables inside each file
for f in csv_files:
    print(f"==================== {f} ====================")
    with open(f, 'r') as fp:
        lines = fp.readlines()
        print(f"Total lines: {len(lines)}")
        for idx, line in enumerate(lines[:35]):
            print(f"{idx}: {line.strip()}")
        if len(lines) > 35:
            print("... (showing end of file)")
            for idx, line in enumerate(lines[-15:], start=len(lines)-15):
                print(f"{idx}: {line.strip()}")


```

```text
==================== Zerodha FnO PnL - F&O.csv ====================
Total lines: 59
0: Client ID,FZY169,,,,,,,,,,,
1: P&L Statement for F&O from 2026-04-01 to 2026-11-03,,,,,,,,,,,,
2: Summary,,,,,,,,,,,,
3: Charges,3995.8274,,,,,,,,,,,
4: Other Credit & Debit,0,,,,,,,,,,,
5: Realized P&L,-5215.25,,,,,,,,,,,
6: Unrealized P&L,0,,,,,,,,,,,
7: ,,,,,,,,,,,,
8: Charges,,,,,,,,,,,,
9: ,,,,,,,,,,,,
10: Account Head,Amount,,,,,,,,,,,
11: Brokerage - Z,3200,,,,,,,,,,,
12: Exchange Transaction Charges - Z,66.6082,,,,,,,,,,,
13: Clearing Charges - Z,0,,,,,,,,,,,
14: Central GST - Z,0,,,,,,,,,,,
15: State GST - Z,0,,,,,,,,,,,
16: Integrated GST - Z,588.0245,,,,,,,,,,,
17: Securities Transaction Tax - Z,141,,,,,,,,,,,
18: SEBI Turnover Fees - Z,0.1946,,,,,,,,,,,
19: Stamp Duty - Z,0,,,,,,,,,,,
20: IPFT,0.0001,,,,,,,,,,,
21: ,,,,,,,,,,,,
22: Symbol,ISIN,Quantity,Buy Value,Sell Value,Realized P&L,Realized P&L Pct.,Previous Closing Price,Open Quantity,Open Quantity Type,Open Value,Unrealized P&L,Unrealized P&L Pct.
23: BEL26MAY440CE,,2850,4275,5486.25,1211.25,28.3333,0,0,,0,0,0
24: HCLTECH26MAY1200CE,,350,1330,3850,2520,189.4737,0,0,,0,0,0
25: ITC26MAY312.5CE,,1600,720,80,-640,-88.8889,0,0,,0,0,0
26: ITC26MAY315CE,,1600,2320,80,-2240,-96.5517,0,0,,0,0,0
27: NIFTY2641323650PE,,65,3074.5,572,-2502.5,-81.3953,0,0,,0,0,0
28: NIFTY2642124400PE,,130,1335.75,809.25,-526.5,-39.4161,0,0,,0,0,0
29: NIFTY2642124600CE,,65,1264.25,1404,139.75,11.054,0,0,,0,0,0
30: NIFTY2650523900PE,,650,14056.25,15128.75,1072.5,7.6301,0,0,,0,0,0
31: NIFTY2650524000CE,,65,1170,1495,325,27.7778,0,0,,0,0,0
32: NIFTY2650524000PE,,130,1605.5,1040,-565.5,-35.2227,0,0,,0,0,0
33: NIFTY2650524100CE,,130,1267.5,906.75,-360.75,-28.4615,0,0,,0,0,0
34: NIFTY2651223350PE,,195,178.7501,130.0001,-48.75,-27.2727,0,0,,0,0,0
... (showing end of file)
44: SENSEX2642377500PE,,40,1244,1335,91,7.3151,0,0,,0,0,0
45: SENSEX2650776500PE,,40,3320,3640,320,9.6386,0,0,,0,0,0
46: SENSEX2651473400PE,,80,2301,423,-1878,-81.6167,0,0,,0,0,0
47: SENSEX2651474100PE,,20,772,240,-532,-68.9119,0,0,,0,0,0
48: SENSEX2651474500PE,,20,319,33,-286,-89.6552,0,0,,0,0,0
49: SENSEX2652174100PE,,80,6548,6917,369,5.6353,0,0,,0,0,0
50: SENSEX2652176000CE,,60,2413,471,-1942,-80.4807,0,0,,0,0,0
51: SENSEX2660473000PE,,40,3375,3772,397,11.763,0,0,,0,0,0
52: SENSEX2661172600PE,,80,8315,7599,-716,-8.6109,0,0,,0,0,0
53: SENSEX2661173000PE,,60,1366,967,-399,-29.2094,0,0,,0,0,0
54: SENSEX2661174800CE,,20,141,102,-39,-27.6596,0,0,,0,0,0
55: SENSEX2661175000CE,,100,7927,7281,-646,-8.1494,0,0,,0,0,0
56: SENSEX26APR76200PE,,20,1780,2580,800,44.9438,0,0,,0,0,0
57: SENSEX26APR76400PE,,40,1096,1302,206,18.7956,0,0,,0,0,0
58: SENSEX26APR76800CE,,20,650,930,280,43.0769,0,0,,0,0,0
==================== Zerodha Equity PnL - Other Debits and Credits.csv ====================
Total lines: 26
0: Client ID,FZY169,,
1: Other Debits and Credits for EQ from 2026-04-01 to 2026-11-03,,,
2: ,,,
3: Particulars,Posting Date,Debit,Credit
4: DP Charges for Sale of RELIANCE on 02/11/2026,2026-11-02,15.34,0
5: DP Charges for Sale of ZYDUSLIFE on 30/10/2026,2026-10-30,15.34,0
6: DP Charges for Sale of BHARTIARTL on 27/10/2026,2026-10-27,15.34,0
7: DP Charges for Sale of HAL on 19/10/2026,2026-10-19,15.34,0
8: DP Charges for Sale of BANDHANBNK on 23/09/2026,2026-09-23,15.34,0
9: AMC for Demat Account for 11-05-2026 to 09-08-2026,2026-09-17,88.5,0
10: DP Charges for Sale of LIQUIDCASE on 16/09/2026,2026-09-16,15.34,0
11: DP Charges for Sale of AXISBANK on 07/09/2026,2026-09-07,15.34,0
12: DP Charges for Sale of ADANIENT on 27/08/2026,2026-08-27,15.34,0
13: DP Charges for Sale of BERGEPAINT on 12/08/2026,2026-08-12,15.34,0
14: DP Charges for Sale of MOMOMENTUM on 30/07/2026,2026-07-30,15.34,0
15: DP Charges for Sale of KARURVYSYA on 29/07/2026,2026-07-29,15.34,0
16: DP Charges for Sale of MINDSPACE on 29/07/2026,2026-07-29,15.34,0
17: DP Charges for Sale of TECHM on 21/07/2026,2026-07-21,15.34,0
18: DP Charges for Sale of CUB on 11/06/2026,2026-06-11,15.34,0
19: AMC for Demat Account for 09-02-2026 to 10-05-2026,2026-06-05,88.5,0
20: DP Charges for Sale of ETERNAL on 01/06/2026,2026-06-01,15.34,0
21: DP Charges for Sale of MOMOMENTUM on 25/05/2026,2026-05-25,15.34,0
22: DP Charges for Sale of HCLTECH on 21/05/2026,2026-05-21,15.34,0
23: DP Charges for Sale of CREDITACC on 11/05/2026,2026-05-11,15.34,0
24: DP Charges for Sale of SOBHA on 04/05/2026,2026-05-04,15.34,0
25: DP Charges for Sale of MOMOMENTUM on 09/04/2026,2026-04-09,15.34,0
==================== Zerodha Equity PnL - Equity.csv ====================
Total lines: 55
0: Client ID,FZY169,,,,,,,,,,,
1: P&L Statement for Equity from 2026-04-01 to 2026-11-03,,,,,,,,,,,,
2: ,,,,,,,,,,,,
3: Summary,Column 1,Column 2,Column 3,Column 4,Column 5,Column 6,Column 7,Column 8,Column 9,Column 10,Column 11,Column 12
4: Charges,97.4574,,,,,,,,,,,
5: Other Credit & Debit,-483.8,,,,,,,,,,,
6: Realized P&L,2186.81,,,,,,,,,,,
7: Unrealized P&L,-1915.0125,,,,,,,,,,,
8: Charges,,,,,,,,,,,,
9: Account Head,Amount,,,,,,,,,,,
10: Brokerage - Z,7.2902,,,,,,,,,,,
11: Exchange Transaction Charges - Z,3.9886,,,,,,,,,,,
12: Clearing Charges - Z,0,,,,,,,,,,,
13: Central GST - Z,0,,,,,,,,,,,
14: State GST - Z,0,,,,,,,,,,,
15: Integrated GST - Z,2.0528,,,,,,,,,,,
16: Securities Transaction Tax - Z,79,,,,,,,,,,,
17: SEBI Turnover Fees - Z,0.1257,,,,,,,,,,,
18: Stamp Duty - Z,5,,,,,,,,,,,
19: IPFT,0.0001,,,,,,,,,,,
20: Symbol,ISIN,Quantity,Buy Value,Sell Value,Realized P&L,Realized P&L Pct.,Previous Closing Price,Open Quantity,Open Quantity Type,Open Value,Unrealized P&L,Unrealized P&L Pct.
21: 775MFL27,INE414G07HE6,0,0,0,0,0,1051,200,,0,105100,0
22: ADANIENT,INE423A01024,1,2991,3155.95,164.95,5.5149,0,0,,0,0,0
23: ASHOKLEY,INE208A01029,0,0,0,0,0,149.1,11,,1735.05,-94.95,-5.4725
24: ASTRAL,INE006I01046,0,0,0,0,0,1355.6,1,,1498.2,-142.6,-9.5181
25: AXISBANK,INE238A01034,1,1218.5,1266.3,47.8,3.9229,0,0,,0,0,0
26: BANDHANBNK,INE545U01014,1,176.1,192.55,16.45,9.3413,0,0,,0,0,0
27: BEL,INE263A01024,0,0,0,0,0,376.5,13,,5290.8,-396.3,-7.4904
28: BERGEPAINT,INE463A01038,5,2635.1,2767.5,132.4,5.0245,468.6,3,,1564.1,-158.3,-10.1208
29: BHARTIARTL,INE397D01024,1,1902.3,1971.3,69,3.6272,0,0,,0,0,0
30: CREDITACC,INE741K01010,3,4101.9,4530.6,428.7,10.4513,0,0,,0,0,0
31: CUB,INE491A01021,3,769.08,776.1,7.02,0.9128,0,0,,0,0,0
32: CYIENT,INE136B01020,1,1187,1203,16,1.3479,0,0,,0,0,0
33: EMBASSY,INE041025011,0,0,0,0,0,411.22,5,,2165.99,-109.89,-5.0734
34: ETERNAL,INE758T01015,3,722.57,746.4,23.83,3.298,0,0,,0,0,0
... (showing end of file)
40: LIQUIDBEES,INF732E01037,0,0,0,0,0,999.99,0.746,,633,112.9925,17.8503
41: LIQUIDCASE,INF0R8F01034,9,1027.26,1043.46,16.2,1.577,0,0,,0,0,0
42: LODHA,INE670K01029,0,0,0,0,0,1002.8,2,,2229.2,-223.6,-10.0305
43: LT,INE018A01030,1,3997.7,4028,30.3,0.7579,0,0,,0,0,0
44: MFLZC27,INE414G07HG1,0,0,0,0,0,1329,200,,0,132900,0
45: MINDSPACE,INE0CCU25019,5,2311.66,2474.75,163.09,7.0551,0,0,,0,0,0
46: MOMOMENTUM,INF247L01BK2,148,8648.4,9031.97,383.57,4.4352,0,0,,0,0,0
47: MOTHERSON,INE775A01035,0,0,0,0,0,159,6,,959.73,-5.73,-0.597
48: RELIANCE,INE002A01018,1,1210.8,1252.5,41.7,3.444,0,0,,0,0,0
49: SENSEXIETF,INF346A01034,0,0,0,0,0,866.72,8,,6900.51,33.25,0.4818
50: SOBHA,INE671H01015,1,1296,1447.3,151.3,11.6744,0,0,,0,0,0
51: TATASTEEL,INE081A01020,0,0,0,0,0,177.37,5,,954.1,-67.25,-7.0485
52: TECHM,INE669C01036,1,1429.6,1598,168.4,11.7795,0,0,,0,0,0
53: TORNTPHARM,INE685A01028,0,0,0,0,0,4585.1,1,,4930,-344.9,-6.9959
54: ZYDUSLIFE,INE010B01027,1,1174.5,1247.6,73.1,6.2239,1240.5,1,,1238.3,2.2,0.1777
==================== Equity-FNO-Pnl-Sahi - Options PnL.csv ====================
Total lines: 97
0: F&O (Equities) P&L Statement from 01 April 2026 to 02 November 2026,,,,,,,,,,
1: Name,ZAHIRUDDIN KAMALUDDIN SAYED,,,,,,,,,
2: User ID / UCC,4013221300,,,,,,,,,
3: Realised P&L without charges,,,,,,,,,,
4: Futures,0.00,,,,,,,,,
5: Options,"-7,003.26",,,,,,,,,
6: Total,"-7,003.26",,,,,,,,,
7: Unrealised P&L without charges,,,,,,,,,,
8: Futures,0.00,,,,,,,,,
9: Options,0.00,,,,,,,,,
10: Total,0.00,,,,,,,,,
11: Charges,,,,,,,,,,
12: Brokerage,"1,830.00",,,,,,,,,
13: Exchange Transaction Charges,47.25,,,,,,,,,
14: Integrated GST,337.91,,,,,,,,,
15: Securities Transaction Tax (STT),101.00,,,,,,,,,
16: SEBI Turnover Fees,0.08,,,,,,,,,
17: Stamp Duty,1.00,,,,,,,,,
18: Total,"2,317.24",,,,,,,,,
19: ,,,,,,,,,,
20: Symbol,Quantity,Buy date,Buy price,Buy value,Sell date,Sell price,Sell value,Realized P&L,Unrealized P&L,Previous closing price
21: SENSEX 27 May 77000 Call,140,25 May 2026,159.65,"22,351.00",25 May 2026,161.86,"22,660.40",309.00,0.00,-
22: SENSEX 27 May 75500 Put,20,26 May 2026,50.80,"1,016.00",26 May 2026,99.95,"1,999.00",983.00,0.00,-
23: SENSEX 27 May 77000 Call,20,26 May 2026,154.00,"3,080.00",26 May 2026,120.70,"2,414.00",-666.00,0.00,-
24: SENSEX 27 May 76500 Call,40,27 May 2026,34.12,"1,364.80",27 May 2026,34.02,"1,360.80",-4.00,0.00,-
25: SENSEX 27 May 75800 Put,20,27 May 2026,33.60,672.00,27 May 2026,44.70,894.00,222.00,0.00,-
26: NIFTY 02 Jun 24300 Call,65,27 May 2026,35.65,"2,317.25",01 Jun 2026,3.65,237.25,"-2,080.00",0.00,-
27: SENSEX 04 Jun 76500 Call,20,01 Jun 2026,75.82,"1,516.40",02 Jun 2026,25.98,519.60,-996.75,0.00,-
28: SENSEX 04 Jun 76500 Call,20,01 Jun 2026,75.82,"1,516.40",01 Jun 2026,59.95,"1,199.00",-317.50,0.00,-
29: SENSEX 04 Jun 76500 Call,60,02 Jun 2026,28.03,"1,681.80",02 Jun 2026,25.98,"1,558.80",-123.00,0.00,-
30: SENSEX 04 Jun 76500 Call,20,02 Jun 2026,28.03,560.60,03 Jun 2026,10.30,206.00,-354.75,0.00,-
31: SENSEX 04 Jun 76500 Call,20,03 Jun 2026,9.60,192.00,03 Jun 2026,10.30,206.00,14.00,0.00,-
32: SENSEX 04 Jun 73500 Put,20,04 Jun 2026,11.60,232.00,04 Jun 2026,5.55,111.00,-121.00,0.00,-
33: SENSEX 11 Jun 73500 Put,40,11 Jun 2026,12.82,512.80,11 Jun 2026,9.15,366.00,-147.00,0.00,-
34: SENSEX 11 Jun 73000 Put,20,11 Jun 2026,16.00,320.00,11 Jun 2026,13.00,260.00,-60.00,0.00,-
... (showing end of file)
82: SENSEX 15 Oct 71300 Put,40,15 Oct 2026,7.45,298.00,15 Oct 2026,6.27,250.80,-47.00,0.00,-
83: SENSEX 15 Oct 74500 Call,120,15 Oct 2026,30.24,"3,628.80",15 Oct 2026,22.99,"2,758.80",-870.00,0.00,-
84: NIFTY 19 Oct 22300 Put,130,16 Oct 2026,6.92,899.60,16 Oct 2026,4.00,520.00,-380.25,0.00,-
85: NIFTY 19 Oct 23400 Call,65,19 Oct 2026,2.35,152.75,19 Oct 2026,1.90,123.50,-29.25,0.00,-
86: NIFTY 19 Oct 23450 Call,65,19 Oct 2026,4.15,269.75,19 Oct 2026,2.29,148.85,-120.25,0.00,-
87: SENSEX 22 Oct 71700 Put,60,21 Oct 2026,15.90,954.00,21 Oct 2026,15.50,930.00,-24.00,0.00,-
88: SENSEX 22 Oct 76200 Call,40,21 Oct 2026,10.92,436.80,21 Oct 2026,7.65,306.00,-131.00,0.00,-
89: SENSEX 22 Oct 72000 Put,80,21 Oct 2026,7.62,609.60,21 Oct 2026,8.16,652.80,43.00,0.00,-
90: SENSEX 22 Oct 71900 Put,20,22 Oct 2026,15.15,303.00,22 Oct 2026,7.55,151.00,-152.00,0.00,-
91: NIFTY 27 Oct 23450 Call,65,23 Oct 2026,5.02,326.30,26 Oct 2026,2.50,162.50,-164.13,0.00,-
92: NIFTY 27 Oct 23450 Call,65,23 Oct 2026,5.02,326.30,23 Oct 2026,4.80,312.00,-14.63,0.00,-
93: NIFTY 27 Oct 22350 Put,65,27 Oct 2026,1.60,104.00,27 Oct 2026,1.00,65.00,-39.00,0.00,-
94: NIFTY 27 Oct 23150 Call,130,27 Oct 2026,1.90,247.00,27 Oct 2026,1.32,171.60,-74.75,0.00,-
95: SENSEX 29 Oct 74900 Call,60,28 Oct 2026,13.61,816.60,28 Oct 2026,11.58,694.80,-122.00,0.00,-
96: SENSEX 29 Oct 71100 Put,20,28 Oct 2026,12.65,253.00,28 Oct 2026,10.40,208.00,-45.00,0.00,-
==================== Equity-FNO-Pnl-Sahi - Equity PnL.csv ====================
Total lines: 26
0: Equity P&L Statement from 01 April 2026 to 02 November 2026,,,,,,,,,
1: Name,ZAHIRUDDIN KAMALUDDIN SAYED,,,,,,,,
2: User ID / UCC,4013221300,,,,,,,,
3: P&L Summary,,,,,,,,,
4: Realised P&L,167.79,,,,,,,,
5: Unrealised P&L,0,,,,,,,,
6: Total P&L,167.79,,,,,,,,
7: Charges,,,,,,,,,
8: Brokerage,2.78,,,,,,,,
9: Exchange Transaction Charges,0.19,,,,,,,,
10: Integrated GST,7.82,,,,,,,,
11: Securities Transaction Tax (STT),4.00,,,,,,,,
12: DP Charges for Sell,40.50,,,,,,,,
13: Total,55.29,,,,,,,,
14: Realised Trades,,,,,,,,,
15: Stock,ISIN,Quantity,Buy Date,Buy Price,Buy Value,Sell Date,Sell Price,Sell Value,P&L
16: Hindustan Zinc Ltd.,INE267A01025,1,07 Jul 2026,537.2,537.2,10 Aug 2026,604,604,66.8
17: Hindustan Zinc Ltd.,INE267A01025,1,21 Jul 2026,534.75,534.75,10 Aug 2026,604,604,69.25
18: Axis Bank Ltd.,INE238A01034,1,10 Aug 2026,1241.8,1241.8,10 Aug 2026,1246.9,1246.9,5.1
19: City Union Bank Limited,INE491A01021,1,21 Aug 2026,219.35,219.35,01 Sep 2026,234.75,234.75,15.4
20: Bandhan Bank Limited,INE545U01014,1,28 Aug 2026,169.3,169.3,22 Sep 2026,180.54,180.54,11.24
21: ,,,,,,,,,
22: Unrealised Trades,,,,,,,,,
23: Stock,ISIN,Quantity,Buy Date,Buy Price,Buy Value,Closing Price,Closing Value,Unrealised P&L,
24: ,,,,,,,,,
25: "Generated at 03 Nov 2026, 06:47 PM by Aaritya Broking Pvt. Ltd.",,,,,,,,,


```

```python
# Let's do a deep dive analysis on all 4 trading segments:
# 1. Zerodha Equity
# 2. Zerodha F&O
# 3. Sahi Equity
# 4. Sahi Options

# Let's parse Zerodha F&O
import io

# Parse Zerodha FnO
with open('Zerodha FnO PnL - F&O.csv', 'r') as f:
    lines = f.readlines()

header_idx = None
for i, l in enumerate(lines):
    if l.startswith("Symbol,ISIN"):
        header_idx = i
        break

df_z_fno = pd.read_csv('Zerodha FnO PnL - F&O.csv', skiprows=header_idx)
print("Zerodha FnO shape:", df_z_fno.shape)
print(df_z_fno.head())

# Parse Zerodha Equity
with open('Zerodha Equity PnL - Equity.csv', 'r') as f:
    lines = f.readlines()

header_idx = None
for i, l in enumerate(lines):
    if l.startswith("Symbol,ISIN"):
        header_idx = i
        break

df_z_eq = pd.read_csv('Zerodha Equity PnL - Equity.csv', skiprows=header_idx)
print("Zerodha Equity shape:", df_z_eq.shape)

# Parse Sahi Options
with open('Equity-FNO-Pnl-Sahi - Options PnL.csv', 'r') as f:
    lines = f.readlines()

header_idx = None
for i, l in enumerate(lines):
    if l.startswith("Symbol,Quantity,Buy date"):
        header_idx = i
        break

df_sahi_opt = pd.read_csv('Equity-FNO-Pnl-Sahi - Options PnL.csv', skiprows=header_idx)
print("Sahi Options shape:", df_sahi_opt.shape)

# Parse Sahi Equity
with open('Equity-FNO-Pnl-Sahi - Equity PnL.csv', 'r') as f:
    lines = f.readlines()

header_idx = None
for i, l in enumerate(lines):
    if l.startswith("Stock,ISIN,Quantity"):
        header_idx = i
        break

df_sahi_eq = pd.read_csv('Equity-FNO-Pnl-Sahi - Equity PnL.csv', skiprows=header_idx)
# stop before "Unrealised Trades"
df_sahi_eq = df_sahi_eq.dropna(subset=['Stock'])
print("Sahi Equity shape:", df_sahi_eq.shape)


```

```text
Zerodha FnO shape: (36, 13)
               Symbol  ISIN  Quantity  Buy Value  Sell Value  Realized P&L  Realized P&L Pct.  Previous Closing Price  Open Quantity  Open Quantity Type  Open Value  Unrealized P&L  Unrealized P&L Pct.
0       BEL26MAY440CE   NaN      2850     4275.0     5486.25       1211.25            28.3333                       0              0                 NaN           0               0                    0
1  HCLTECH26MAY1200CE   NaN       350     1330.0     3850.00       2520.00           189.4737                       0              0                 NaN           0               0                    0
2     ITC26MAY312.5CE   NaN      1600      720.0       80.00       -640.00           -88.8889                       0              0                 NaN           0               0                    0
3       ITC26MAY315CE   NaN      1600     2320.0       80.00      -2240.00           -96.5517                       0              0                 NaN           0               0                    0
4   NIFTY2641323650PE   NaN        65     3074.5      572.00      -2502.50           -81.3953                       0              0                 NaN           0               0                    0
Zerodha Equity shape: (34, 13)
Sahi Options shape: (76, 11)
Sahi Equity shape: (8, 10)


```

```python
# Let's clean and compute metrics for each dataset:

# 1. Zerodha FnO
z_fno_realized = -5215.25
z_fno_charges = 3995.83
z_fno_net = z_fno_realized - z_fno_charges

# Analyze df_z_fno trades
print("--- Zerodha FnO Details ---")
df_z_fno['Realized P&L'] = pd.to_numeric(df_z_fno['Realized P&L'], errors='coerce')
wins_z_fno = df_z_fno[df_z_fno['Realized P&L'] > 0]
losses_z_fno = df_z_fno[df_z_fno['Realized P&L'] < 0]
breakeven_z_fno = df_z_fno[df_z_fno['Realized P&L'] == 0]

print(f"Total trades: {len(df_z_fno)}")
print(f"Wins: {len(wins_z_fno)}, Losses: {len(losses_z_fno)}, Breakeven: {len(breakeven_z_fno)}")
print(f"Win rate: {len(wins_z_fno)/len(df_z_fno):.2%}")
print(f"Gross Profit: {wins_z_fno['Realized P&L'].sum():.2f}")
print(f"Gross Loss: {losses_z_fno['Realized P&L'].sum():.2f}")
print(f"Gross P&L: {df_z_fno['Realized P&L'].sum():.2f}")
print(f"Total Charges: {z_fno_charges}")
print(f"Net P&L: {z_fno_net:.2f}")
print(f"Avg Win: {wins_z_fno['Realized P&L'].mean():.2f}, Avg Loss: {losses_z_fno['Realized P&L'].mean():.2f}")
print(f"Largest Win: {wins_z_fno['Realized P&L'].max()}, Largest Loss: {losses_z_fno['Realized P&L'].min()}")

# 2. Sahi Options
print("\n--- Sahi Options Details ---")
# clean numeric columns
for col in ['Buy value', 'Sell value', 'Realized P&L']:
    df_sahi_opt[col] = df_sahi_opt[col].astype(str).str.replace(',', '').str.replace('"', '').str.strip()
    df_sahi_opt[col] = pd.to_numeric(df_sahi_opt[col], errors='coerce')

df_sahi_opt = df_sahi_opt.dropna(subset=['Realized P&L'])
sahi_opt_charges = 2317.24
s_wins = df_sahi_opt[df_sahi_opt['Realized P&L'] > 0]
s_losses = df_sahi_opt[df_sahi_opt['Realized P&L'] < 0]
s_be = df_sahi_opt[df_sahi_opt['Realized P&L'] == 0]

print(f"Total trades: {len(df_sahi_opt)}")
print(f"Wins: {len(s_wins)}, Losses: {len(s_losses)}, Breakeven: {len(s_be)}")
print(f"Win rate: {len(s_wins)/len(df_sahi_opt):.2%}")
print(f"Gross Profit: {s_wins['Realized P&L'].sum():.2f}")
print(f"Gross Loss: {s_losses['Realized P&L'].sum():.2f}")
print(f"Gross P&L: {df_sahi_opt['Realized P&L'].sum():.2f}")
print(f"Total Charges: {sahi_opt_charges}")
print(f"Net P&L: {df_sahi_opt['Realized P&L'].sum() - sahi_opt_charges:.2f}")
print(f"Avg Win: {s_wins['Realized P&L'].mean():.2f}, Avg Loss: {s_losses['Realized P&L'].mean():.2f}")
print(f"Largest Win: {s_wins['Realized P&L'].max()}, Largest Loss: {s_losses['Realized P&L'].min()}")

# 3. Zerodha Equity
print("\n--- Zerodha Equity Details ---")
df_z_eq_trades = df_z_eq[df_z_eq['Quantity'] > 0].copy()
df_z_eq_trades['Realized P&L'] = pd.to_numeric(df_z_eq_trades['Realized P&L'], errors='coerce')
eq_wins = df_z_eq_trades[df_z_eq_trades['Realized P&L'] > 0]
eq_losses = df_z_eq_trades[df_z_eq_trades['Realized P&L'] < 0]
print(f"Closed Equity Trades: {len(df_z_eq_trades)}")
print(f"Wins: {len(eq_wins)}, Losses: {len(eq_losses)}")
print(f"Gross Realized P&L: {df_z_eq_trades['Realized P&L'].sum():.2f}")
print(f"Charges: 97.46, Other debits (DP/AMC): 483.80")
print(f"Net Realized P&L: {df_z_eq_trades['Realized P&L'].sum() - 97.46 - 483.80:.2f}")

# 4. Sahi Equity
print("\n--- Sahi Equity Details ---")
df_sahi_eq_trades = df_sahi_eq[df_sahi_eq['P&L'].notnull() & (df_sahi_eq['Stock'] != 'Stock')].copy()
df_sahi_eq_trades['P&L'] = pd.to_numeric(df_sahi_eq_trades['P&L'], errors='coerce')
print(df_sahi_eq_trades[['Stock', 'Buy Date', 'Sell Date', 'P&L']])
print("Total Sahi Equity Gross P&L:", df_sahi_eq_trades['P&L'].sum())
print("Charges:", 55.29)
print("Net:", df_sahi_eq_trades['P&L'].sum() - 55.29)


```

```text
--- Zerodha FnO Details ---
Total trades: 36
Wins: 18, Losses: 18, Breakeven: 0
Win rate: 50.00%
Gross Profit: 11172.00
Gross Loss: -16387.25
Gross P&L: -5215.25
Total Charges: 3995.83
Net P&L: -9211.08
Avg Win: 620.67, Avg Loss: -910.40
Largest Win: 2520.0, Largest Loss: -2502.5

--- Sahi Options Details ---
Total trades: 76
Wins: 23, Losses: 53, Breakeven: 0
Win rate: 30.26%
Gross Profit: 5518.75
Gross Loss: -12522.01
Gross P&L: -7003.26
Total Charges: 2317.24
Net P&L: -9320.50
Avg Win: 239.95, Avg Loss: -236.26
Largest Win: 983.0, Largest Loss: -2080.0

--- Zerodha Equity Details ---
Closed Equity Trades: 20
Wins: 20, Losses: 0
Gross Realized P&L: 2186.81
Charges: 97.46, Other debits (DP/AMC): 483.80
Net Realized P&L: 1605.55

--- Sahi Equity Details ---
                     Stock     Buy Date    Sell Date    P&L
0      Hindustan Zinc Ltd.  07 Jul 2026  10 Aug 2026  66.80
1      Hindustan Zinc Ltd.  21 Jul 2026  10 Aug 2026  69.25
2           Axis Bank Ltd.  10 Aug 2026  10 Aug 2026   5.10
3  City Union Bank Limited  21 Aug 2026  01 Sep 2026  15.40
4     Bandhan Bank Limited  28 Aug 2026  22 Sep 2026  11.24
Total Sahi Equity Gross P&L: 167.79000000000002
Charges: 55.29
Net: 112.50000000000003


```

```python
# Let's inspect the F&O trades behavior closely (dates, holding duration, instruments)
# In Sahi:
df_sahi_opt['Buy date'] = pd.to_datetime(df_sahi_opt['Buy date'], format='%d %b %Y')
df_sahi_opt['Sell date'] = pd.to_datetime(df_sahi_opt['Sell date'], format='%d %b %Y')
df_sahi_opt['Holding_Days'] = (df_sahi_opt['Sell date'] - df_sahi_opt['Buy date']).dt.days

print("Sahi holding days value counts:")
print(df_sahi_opt['Holding_Days'].value_counts())

# Group by month for Sahi
df_sahi_opt['Month'] = df_sahi_opt['Sell date'].dt.to_period('M')
sahi_monthly = df_sahi_opt.groupby('Month').agg(
    trades=('Realized P&L', 'count'),
    gross_pnl=('Realized P&L', 'sum'),
    wins=('Realized P&L', lambda x: (x > 0).sum()),
    losses=('Realized P&L', lambda x: (x < 0).sum())
)
print("\nSahi Monthly Performance:")
print(sahi_monthly)

# Check instrument breakdown in Sahi
df_sahi_opt['Underlying'] = df_sahi_opt['Symbol'].apply(lambda x: 'SENSEX' if 'SENSEX' in x else ('NIFTY' if 'NIFTY' in x else 'OTHER'))
print("\nSahi Underlying Performance:")
print(df_sahi_opt.groupby('Underlying').agg(
    trades=('Realized P&L', 'count'),
    gross_pnl=('Realized P&L', 'sum'),
    win_rate=('Realized P&L', lambda x: (x > 0).mean())
))

# Inspect overnight vs intraday in Sahi
print("\nSahi Intraday vs Overnight:")
print(df_sahi_opt.groupby('Holding_Days').agg(
    trades=('Realized P&L', 'count'),
    gross_pnl=('Realized P&L', 'sum'),
    win_rate=('Realized P&L', lambda x: (x > 0).mean())
))


```

```text
Sahi holding days value counts:
Holding_Days
0    61
1    11
3     3
5     1
Name: count, dtype: int64

Sahi Monthly Performance:
         trades  gross_pnl  wins  losses
Month                                   
2026-05       5     844.00     3       2
2026-06      16   -4568.00     3      13
2026-07      12    -496.00     3       9
2026-08       9   -1161.00     2       7
2026-09       4     293.50     2       2
2026-10      30   -1915.76    10      20

Sahi Underlying Performance:
            trades  gross_pnl  win_rate
Underlying                             
NIFTY           15   -2720.26  0.200000
SENSEX          61   -4283.00  0.327869

Sahi Intraday vs Overnight:
              trades  gross_pnl  win_rate
Holding_Days                             
0                 61   -1827.63  0.311475
1                 11   -2888.00  0.272727
3                  3    -207.63  0.333333
5                  1   -2080.00  0.000000


```

```python
# Check Zerodha FnO details
# What were the biggest losses in Zerodha FnO?
print("Top 5 Zerodha FnO Losses:")
print(df_z_fno.sort_values(by='Realized P&L').head(5)[['Symbol', 'Quantity', 'Buy Value', 'Sell Value', 'Realized P&L', 'Realized P&L Pct.']])

print("\nTop 5 Zerodha FnO Wins:")
print(df_z_fno.sort_values(by='Realized P&L', ascending=False).head(5)[['Symbol', 'Quantity', 'Buy Value', 'Sell Value', 'Realized P&L', 'Realized P&L Pct.']])

# Combined totals across both brokers:
total_gross_opt = df_z_fno['Realized P&L'].sum() + df_sahi_opt['Realized P&L'].sum()
total_opt_charges = z_fno_charges + sahi_opt_charges
total_net_opt = total_gross_opt - total_opt_charges

total_gross_eq = df_z_eq_trades['Realized P&L'].sum() + df_sahi_eq_trades['P&L'].sum()
total_eq_charges = 97.46 + 483.80 + 55.29
total_net_eq = total_gross_eq - total_eq_charges

print(f"\nCOMBINED OPTIONS (Zerodha + Sahi):")
print(f"Total Gross: {total_gross_opt:.2f}")
print(f"Total Charges: {total_opt_charges:.2f}")
print(f"Total Net: {total_net_opt:.2f}")

print(f"\nCOMBINED EQUITY (Zerodha + Sahi):")
print(f"Total Gross: {total_gross_eq:.2f}")
print(f"Total Charges: {total_eq_charges:.2f}")
print(f"Total Net: {total_net_eq:.2f}")


```

```text
Top 5 Zerodha FnO Losses:
                Symbol  Quantity  Buy Value  Sell Value  Realized P&L  Realized P&L Pct.
4    NIFTY2641323650PE        65    3074.50       572.0      -2502.50           -81.3953
3        ITC26MAY315CE      1600    2320.00        80.0      -2240.00           -96.5517
27  SENSEX2652176000CE        60    2413.00       471.0      -1942.00           -80.4807
23  SENSEX2651473400PE        80    2301.00       423.0      -1878.00           -81.6167
12   NIFTY2651223500CE       130    1914.25       162.5      -1751.75           -91.5110

Top 5 Zerodha FnO Wins:
                Symbol  Quantity  Buy Value  Sell Value  Realized P&L  Realized P&L Pct.
1   HCLTECH26MAY1200CE       350    1330.00     3850.00       2520.00           189.4737
13   NIFTY2651223500PE       260    3945.50     5190.25       1244.75            31.5486
0        BEL26MAY440CE      2850    4275.00     5486.25       1211.25            28.3333
16   NIFTY26APR24000PE       260    4228.25     5307.25       1079.00            25.5188
7    NIFTY2650523900PE       650   14056.25    15128.75       1072.50             7.6301

COMBINED OPTIONS (Zerodha + Sahi):
Total Gross: -12218.51
Total Charges: 6313.07
Total Net: -18531.58

COMBINED EQUITY (Zerodha + Sahi):
Total Gross: 2354.60
Total Charges: 636.55
Total Net: 1718.05


```

### Comprehensive Trading Performance Summary (April – November 2026)

Across both brokerages (Zerodha and Sahi/Aaditya Broking), your trading activity reveals a stark contrast: **Delivery & Swing Equity trading is consistently profitable**, whereas **Index & Stock Options trading has suffered significant erosion driven by asymmetric losses and high friction costs.**

---

### Segment Performance & Metrics Report

| Trading Segment | Broker | Trades | Win Rate | Gross P&L | Total Charges / Taxes | Net Realized P&L | Profit Factor / Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Delivery / Swing Equity** | **Zerodha** | 20 | **100.0%** | +₹2,186.81 | ₹581.26 | **+₹1,605.55** | Clean profit; DP/AMC accounted for ₹483.80 |
| **Delivery / Swing Equity** | **Sahi** | 5 | **100.0%** | +₹167.79 | ₹55.29 | **+₹112.50** | 100% win rate across small swing positions |
| **F&O / Options** | **Zerodha** | 36 | **50.0%** | -₹5,215.25 | ₹3,995.83 | **-₹9,211.08** | Avg Win: ₹620.67 vs. Avg Loss: -₹910.40 |
| **Options Buying** | **Sahi** | 76 | **30.3%** | -₹7,003.26 | ₹2,317.24 | **-₹9,320.50** | 23 Wins / 53 Losses; Heavy decay on Sensex/Nifty |
| **Combined Equity** | Both | 25 | **100.0%** | **+₹2,354.60** | **₹636.55** | **+₹1,718.05** | **Consistently positive edge** |
| **Combined Options** | Both | 112 | **36.6%** | **-₹12,218.51** | **₹6,313.07** | **-₹18,531.58** | **Net loss: -₹18,531.58** |

---

### Root-Cause Analytical Insights

1. **The Friction Trap (Charges & Slippage)**
* In Options trading, you generated **-₹12,218.51** in gross trading losses, but paid **₹6,313.07** in brokerage, exchange fees, and GST. Friction added another **51.7%** on top of your market losses.
* On low-premium Sensex/Nifty options, fixed per-order brokerages (₹20/order) eat away a massive percentage of capital on 1-to-2 lot trades.


2. **Asymmetric Holding & Cutoffs (The Options Buyer Dilemma)**
* In Sahi options, overnight carry trades accounted for disproportionate losses:
* **Intraday (Day 0 exit):** 61 trades, -₹1,827.63 (Avg ~-₹30/trade).
* **Overnight (Held 1 to 5 days):** 15 trades, -₹5,175.63 (over **73%** of total Sahi gross options losses).


* Multiple trades were held until 80% to 95% premium destruction (e.g., NIFTY 24300 CE: -₹2,080 / -90%, ITC 315 CE: -₹2,240 / -96%, NIFTY 23650 PE: -₹2,502 / -81%). Winners, by contrast, were often closed early for modest 10%–30% gains.


3. **Your True Edge: Equity Swing Selection**
* Every single closed equity trade in both accounts was positive (ADANIENT, BERGEPAINT, SOBHA, TECHM, HINDZINC, AXISBANK, etc.).
* Your chart setups, stock picking, and entry timing for equities work reliably. The breakdown occurs exclusively in intraday/short-term derivative leverage and time decay ($Theta$).



---

### 2-Week Trading Break Exercise (Mental & Structural Reset)

A mandatory 2-week freeze is necessary to decouple emotional frustration, clear screen fatigue, and reconstruct risk parameters.

#### Week 1: Total Screen Detachment & Trade Journal Autopsy

* **Days 1–3: Complete Blackout:** Do not open broker terminals (Zerodha Kite / Sahi) between 9:15 AM and 3:30 PM. Remove trading apps from your phone's home screen.
* **Days 4–7: Post-Mortem Audit:**
* Open the 5 worst options losses (ITC 315 CE, NIFTY 23650 PE, SENSEX 76000 CE, SENSEX 73400 PE, NIFTY 24300 CE).
* Answer three questions for each: *What was the initial planned invalidation price? Why wasn't the stop executed when hit? Was this trade held hoping for a bounce or gap-up?*



#### Week 2: System Formalization & Paper Trading Sandbox

* **Build Hard Rules:**
1. **Strict Zero-Overnight Rule on Options:** No weekly index options held past 3:15 PM under any circumstance.
2. **Max Stop-Loss per Option Trade:** Set an absolute dollar cap (e.g., maximum loss of ₹300–₹400 per trade). If hit, exit immediately.
3. **Daily Loss Circuit Breaker:** 2 consecutive stop-outs = terminal closed for the day.


* **Paper Trading Execution:**
* Forward-test your setup (e.g., Fair Value Gap / VWAP / Inside Bar breakout) exclusively on paper or a spreadsheet tracker.
* Trade strictly 1 setup per day during a fixed 90-to-120 minute window. Record entry, planned stop, target, and slippage.



---

### Step-by-Step Restart Roadmap

```
Week 1 (Detachment)   ──>   Week 2 (Paper Rules)   ──>   Week 3 (Micro-Size Live)   ──>   Week 4+ (Scale/Pivot)
Zero live orders             Paper trade 1 setup/day      Trade 1 lot max            Double size only if net 
Audit 5 worst trades         Strict 1:2 R:R validation    Hard daily stop (-₹600)    positive after all charges

```

1. **Capital Allocation Split:**
* Allocate **80%** of trading capital to Swing/Delivery Equities, where your win rate is already proven.
* Allocate only **20%** (or an amount you are comfortable risking) to high-speed derivative setups.


2. **Restart Phase (Week 3 - Live Re-entry):**
* Trade strictly **1 lot**.
* Max 2 trades per day.
* If day P&L hits -₹600, your broker terminal is closed for the day without exception.


3. **Execution Review Benchmark:**
* At the end of 20 live trades post-restart, calculate **Net P&L after broker charges**. If net returns are negative despite a reasonable win rate, pause options buying entirely and pivot focus entirely toward swing equity setups.



Would you like to draft a standardized paper trading spreadsheet template with built-in brokerage/STT formulas to track your Week 2 test runs?
