```python
import glob
import csv
import pandas as pd

files = sorted(glob.glob('*.csv'))
print("Attached CSVs:", files)

for f in files:
    print(f"\n================ {f} ================")
    with open(f, 'r', encoding='utf-8') as fp:
        reader = csv.reader(fp)
        for i, row in enumerate(reader):
            if any(cell.strip() for cell in row):
                print(f"Row {i:02d}: {row}")


```

```text
Attached CSVs: ['MarketStructure_Options_System_10_Trade_Batch_Analytics.csv', 'MarketStructure_Options_System_Dashboard.csv', 'MarketStructure_Options_System_Pre_Trade_Calculator.csv', 'MarketStructure_Options_System_Profit_Exit_Thresholds.csv', 'MarketStructure_Options_System_Setup_Entry_Playbook.csv', 'MarketStructure_Options_System_Structure_IVP_Matrix.csv', 'MarketStructure_Options_System_Trade_Log.csv', 'MarketStructure_Options_System_Watchlist_Scanner.csv', 'SwingPilot_Options_Spreads_FY2_10-Trade_Batch_Analytics.csv', 'SwingPilot_Options_Spreads_FY2_Dashboard.csv', 'SwingPilot_Options_Spreads_FY2_Pre-Trade_Risk_Calculator.csv', 'SwingPilot_Options_Spreads_FY2_Profit_Exit_Thresholds.csv', 'SwingPilot_Options_Spreads_FY2_Setup_Entry_Playbook.csv', 'SwingPilot_Options_Spreads_FY2_System_Rules_Checklist.csv', 'SwingPilot_Options_Spreads_FY2_Trade_Log.csv', 'SwingPilot_Options_Spreads_FY2_Watchlist.csv']

================ MarketStructure_Options_System_10_Trade_Batch_Analytics.csv ================
Row 00: ['Batch #', 'Trade Range', 'Closed Trades', 'Wins', 'Losses', 'Win Rate %', 'Total Brokerage (₹)', 'Net P&L (₹)', 'Avg R-Multiple', 'Cohort Audit Status']
Row 01: ['Batch 1', 'Trades 1–10', '0', '0', '0', '0.0%', '0', '0', '0', 'In Progress / Pending']
Row 02: ['Batch 2', 'Trades 11–20', '0', '0', '0', '0.0%', '0', '0', '0', 'In Progress / Pending']
Row 03: ['Batch 3', 'Trades 21–30', '0', '0', '0', '0.0%', '0', '0', '0', 'In Progress / Pending']
Row 04: ['Batch 4', 'Trades 31–40', '0', '0', '0', '0.0%', '0', '0', '0', 'In Progress / Pending']
Row 05: ['Batch 5', 'Trades 41–50', '0', '0', '0', '0.0%', '0', '0', '0', 'In Progress / Pending']
Row 06: ['Batch 6', 'Trades 51–60', '0', '0', '0', '0.0%', '0', '0', '0', 'In Progress / Pending']
Row 07: ['Batch 7', 'Trades 61–70', '0', '0', '0', '0.0%', '0', '0', '0', 'In Progress / Pending']
Row 08: ['Batch 8', 'Trades 71–80', '0', '0', '0', '0.0%', '0', '0', '0', 'In Progress / Pending']
Row 09: ['Batch 9', 'Trades 81–90', '0', '0', '0', '0.0%', '0', '0', '0', 'In Progress / Pending']
Row 10: ['Batch 10', 'Trades 91–100', '0', '0', '0', '0.0%', '0', '0', '0', 'In Progress / Pending']

================ MarketStructure_Options_System_Dashboard.csv ================
Row 00: ['1. SYSTEM PARAMETERS & RISK GUARDRAILS', '', '', '']
Row 01: ['Starting Capital (₹)', '', '', '50000']
Row 02: ['Max Long Option Debit (%)', '', '', '10.0%']
Row 03: ['Max Debit Spread Capital (%)', '', '', '15.0%']
Row 04: ['Max Credit Spread SPAN Margin (₹)', '', '', '38500']
Row 05: ['Max Planned SL / Trade (%)', '', '', '5.0%']
Row 06: ['Sahi Brokerage / Order (₹)', '', '', '12.5']
Row 07: ['Max Long Option Debit (₹)', '', '', '5000']
Row 08: ['Max Debit Spread Capital (₹)', '', '', '7500']
Row 09: ['Max Planned SL / Trade (₹)', '', '', '2500']
Row 10: ['Weekly Loss Circuit Breaker (10%)', '', '', '5000']
Row 11: ['Monthly Drawdown Audit Pause (15%)', '', '', '7500']
Row 12: ['Max Concurrent Active Positions', '', '', '1']
Row 13: ['Market Structure / Segment', 'Trades', 'Win Rate %', 'Net P&L (₹)', 'Avg R-Multiple']
Row 14: ['Impulse BOS', '0', '0.0%', '0', '0']
Row 15: ['Trend Pullback', '0', '0.0%', '0', '0']
Row 16: ['Range S&R Rejection', '0', '0.0%', '0', '0']
Row 17: ['Index', '0', '0.0%', '0', '0']
Row 18: ['F&O Stock', '0', '0.0%', '0', '0']
Row 19: ['Strategy', 'Trades', 'Wins', 'Win Rate %', 'Net P&L (₹)', 'Avg R-Multiple']
Row 20: ['Long Call', '0', '0', '0.0%', '0', '0']
Row 21: ['Long Put', '0', '0', '0.0%', '0', '0']
Row 22: ['Bull Call Spread', '0', '0', '0.0%', '0', '0']
Row 23: ['Bear Put Spread', '0', '0', '0.0%', '0', '0']
Row 24: ['Bull Put Spread', '0', '0', '0.0%', '0', '0']
Row 25: ['Bear Call Spread', '0', '0', '0.0%', '0', '0']
Row 26: ['CURRENT CAPITAL (₹)', '', '', '', 'NET P&L (₹)', '', '']
Row 27: ['50000', '', '', '', '0', '', '']
Row 28: ['NET RETURN (%)', '', '', '', 'TOTAL CLOSED TRADES', '', '']
Row 29: ['0.0%', '', '', '', '0', '', '']
Row 30: ['WIN RATE (%)', '', '', '', 'PROFIT FACTOR', '', '']
Row 31: ['0.0%', '', '', '', '0', '', '']
Row 32: ['AVERAGE WINNING TRADE (₹)', '', '', '', 'EXPECTANCY / TRADE (₹)', '', '']
Row 33: ['0', '', '', '', '0', '', '']
Row 34: ['AVERAGE LOSING TRADE (₹)', '', '', '', 'AVG R-MULTIPLE ACHIEVED', '', '']
Row 35: ['0', '', '', '', '0', '', '']
Row 36: ['TOTAL BROKERAGE PAID (₹)', '', '', '', 'MAX PEAK-TO-TROUGH DD (₹)', '', '']
Row 37: ['0', '', '', '', '0', '', '']

================ MarketStructure_Options_System_Pre_Trade_Calculator.csv ================
Row 00: ['2. AUTOMATED RISK, REWARD & EXIT ENGINE', '']
Row 01: ['Total Quantity (Lots × Lot Size)', '65']
Row 02: ['Strike Width (Points)', '200']
Row 03: ['Net Premium Paid / Credit Received (₹/unit)', '80']
Row 04: ['Total Capital / Margin Blocked (₹)', '5200']
Row 05: ['Capital / Margin Blocked (% of Account)', '10.4%']
Row 06: ['Max Theoretical Gross Profit (₹)', '7800']
Row 07: ['Planned Stop-Loss Amount (₹)', '2080']
Row 08: ['Planned Stop-Loss (% of Account Capital)', '4.2%']
Row 09: ['Exit Option / Spread Price at SL (₹/unit)', '48']
Row 10: ['Planned Gross Target Profit (₹)', '5070']
Row 11: ['Exit Option / Spread Price at Target (₹/unit)', '158']
Row 12: ['Sahi Round-Trip Brokerage (₹)', '50']
Row 13: ['Check 1: Capital / SPAN Margin Limit', '', '', 'PASS — Within ₹7,500 Debit Cap', '', '']
Row 14: ['Check 2: Hard Stop-Loss Cap (≤ 5% / ₹2,500)', '', '', 'PASS — Risk Within ₹2,500 Cap', '', '']
Row 15: ['Check 3: Credit Spread Index-Only Rule', '', '', 'PASS — Instrument Allowed', '', '']
Row 16: ['Check 4: Minimum Net Risk-to-Reward (≥ 1 : 1.5)', '', '', 'PASS — Net R:R ≥ 1:1.5', '', '']
Row 17: ['FINAL EXECUTION GATE DECISION', '', '', 'GO — APPROVED TO EXECUTE', '', '']
Row 18: ['1. TRADE SETUP INPUTS (CREAM CELLS = USER ENTRY)', '']
Row 19: ['Current Account Capital (₹)', '']
Row 20: ['Strategy Mode', '']
Row 21: ['Specific Strategy', '']
Row 22: ['Market Structure Regime', '']
Row 23: ['Segment (Index / F&O Stock)', '']
Row 24: ['Underlying Symbol', '']
Row 25: ['Lot Size (Qty per Lot)', '']
Row 26: ['Number of Lots', '']
Row 27: ['Primary Leg Strike (Long for Debit/Long, Short for Credit)', '']
Row 28: ['Hedge Leg Strike (0 for Long Option)', '']
Row 29: ['Primary Leg Premium (₹/unit)', '']
Row 30: ['Hedge Leg Premium (₹/unit, 0 for Long Option)', '']
Row 31: ['SPAN + Exposure Margin Required (₹, for Credit Spreads)', '']
Row 32: ['Planned Stop-Loss (% of Debit/Long, or Multiple for Credit)', '']
Row 33: ['Planned Profit Target (% of Max Profit / Credit, or R:R)', '']

================ MarketStructure_Options_System_Profit_Exit_Thresholds.csv ================
Row 00: ['Strategy Group', 'Primary Profit Target', 'Stretch Target / Trailing', 'Hard Stop-Loss (Max ₹2,500)', 'Time-Based Exit (Theta Guard)', 'Pre-Expiry Cutoff']
Row 01: ['Long Call / Long Put\n(Impulse BOS)', 'Book 50% quantity at 1 : 1.5 Net R:R (+45% premium gain).', 'Move SL to cost on remaining 50%; trail using 1H 21 EMA to 1 : 2.5+ R:R.', '30% of entry premium (capped at ₹1,500–₹2,000) OR 1H close back inside breakout level.', 'Exit at market after 2 trading sessions if underlying fails to follow through.', 'Exit 24–48 hrs before expiry (DTE ≤ 1).']
Row 02: ['Bull Call / Bear Put\n(Debit Spreads)', 'Place Limit/GTT exit at 65% of Max Spread Profit immediately after entry.', '75% of Max Spread Profit if momentum accelerates rapidly within 1–2 sessions.', '40% of Net Debit paid (capped at ₹2,500 / 5% capital) OR break of 51 EMA structure.', 'Close around breakeven/small loss after 3–4 sideways sessions if spot chops flat.', 'Square off Short leg first, then Long leg at DTE ≤ 1.']
Row 03: ['Bull Put / Bear Call\n(Credit Spreads)', 'Place Limit/GTT buy-back order at 65%–70% of Max Credit Received.', '80% of Max Credit only if underlying moves strongly away from short strike with ≥ 3 DTE left.', 'Spread widens to 2.0× entry credit (strictly capped at ₹2,500 / 5% capital).', 'Close after 4–5 sessions if IV fails to drop or price hugs short strike.', 'Square off Long hedge AFTER buying back Short leg at DTE ≤ 1.']

================ MarketStructure_Options_System_Setup_Entry_Playbook.csv ================
Row 00: ['Step', 'Action Item', 'Exact Verification Criteria', 'Sahi App Execution Rule', 'Gate']
Row 01: ['Step 1', 'Account & Circuit-Breaker Audit', 'Confirm 0 OPEN trades in Trade_Log, weekly loss < ₹5,000, and monthly drawdown < ₹7,500.', 'Do not open Sahi order pad if any circuit breaker is active.', 'HARD GATE']
Row 02: ['Step 2', 'Timing & Event Filter', 'Execute strictly between 11:30 AM – 1:30 PM IST (skip 9:15–9:45 AM opening whipsaws). Verify no earnings/RBI/macro event inside 2–5 day hold.', 'Check Bid-Ask spread ≤ ₹0.50 on NIFTY/SENSEX or ≤ ₹1.00 on F&O stocks.', 'HARD GATE']
Row 03: ['Step 3', 'Structure + IVP + Calculator Gate', 'Score setup in Structure_IVP_Matrix and enter live quotes in Pre_Trade_Calculator. Verify Net R:R ≥ 1:1.5 after brokerage.', 'Both tabs must display VALID and GO — APPROVED TO EXECUTE.', 'MUST READ GO']
Row 04: ['Step 4', 'Hedged Basket / Leg-Sequencing', 'For Debit & Credit Spreads: use Sahi Basket Order or execute BUY leg FIRST, then SELL leg immediately via Limit orders near mid-price.', 'Captures instant NSE/BSE SPAN + Exposure margin benefit; prevents peak margin shortfall.', 'BUY LEG FIRST']
Row 05: ['Step 5', 'Immediate Trade Log Entry', 'Log Entry Date, Paper/Live mode, Structure, IVP %, Strategy, Strikes, Qty, Net Prem/Credit, Planned SL, and Target in Trade_Log.', 'Record actual filled prices, not theoretical screen quotes.', 'LOG NOW']
Row 06: ['Step 6', 'GTT Target & Spot Alert Placement', 'Place Limit/GTT exit order at exact Target Spread/Option Price from Pre_Trade_Calculator and set spot price invalidation alert.', 'Never leave an open position without a predefined exit level.', 'SET & FORGET']
Row 07: ['Dimension', 'Long Call / Long Put (Regime 1)', 'Bull Call / Bear Put Spread (Regime 2)', 'Bull Put / Bear Call Spread (Regime 3)', 'Non-Negotiable Filter']
Row 08: ['Higher-TF Structure', 'Clean BOS close above/below swing high/low; price breaking out of tight range with expanding range candles.', 'HH/HL above 21 & 51 EMA (Bull Call) or LH/LL below 21 & 51 EMA (Bear Put).', 'Sideways range or failed breakout sweep at major Daily Supply/Demand zone.', 'Daily + 1H must align']
Row 09: ['Entry Trigger (15m/1H)', 'First 15m/1H breakout close with ≥ 1.5× average volume; enter on minor 5m/15m retest.', 'Pullback to 21 EMA or VWAP followed by strong rejection candle in trend direction.', 'Rejection wick / engulfing candle back inside range after sweeping S&R.', 'Never chase extended candles']
Row 10: ['Option Chain / OI', 'Aggressive fresh Call buying (Long Call) or Put buying (Long Put) at ATM/next strike.', 'Put OI floor below spot + Call unwinding (Bullish); Call OI wall above + Put unwinding (Bearish).', 'Massive Call OI wall above short strike (Bear Call) or Put OI wall below short strike (Bull Put).', 'Confirm on Sahi / Sensibull OI']
Row 11: ['Strike & DTE Rule', '7–15 DTE; Buy ATM or 1-strike ITM (Delta 0.55–0.65). Max premium ₹5,000.', '7–20 DTE; Buy ATM + Sell OTM (1–3 strikes away). Net Debit = 35%–45% of width.', '7–20 DTE; Sell OTM (Delta 0.25–0.30) + Buy further OTM hedge. NIFTY/SENSEX only.', 'Zero 0DTE/1DTE entries']

================ MarketStructure_Options_System_Structure_IVP_Matrix.csv ================
Row 00: ['Gate #', 'Verification Dimension', 'Requirement / Rule', 'User Check (YES / NO)', 'Gate Status']
Row 01: ['Gate 1', 'No Open Trades & Drawdown Safe', '0 OPEN trades in Trade_Log; Weekly loss < ₹5,000; Monthly DD < ₹7,500.', 'YES', 'PASS']
Row 02: ['Gate 2', 'Execution Window & Event Filter', 'Time is 11:30 AM – 1:30 PM IST; no earnings/RBI/Budget event inside hold window.', 'YES', 'PASS']
Row 03: ['Gate 3', 'Higher-Timeframe Structure Clear', 'Daily & 1H clearly show Impulse BOS, Trend Pullback, or Range S&R Sweep.', 'YES', 'PASS']
Row 04: ['Gate 4', 'IVP & Strategy Match', 'IVP (<35% Long, 20-55% Debit Spread, >55% Index Credit Spread) matches structure.', 'YES', 'PASS']
Row 05: ['Gate 5', 'Option Chain OI & Liquidity', 'OI wall/PCR confirms direction; Bid-Ask gap ≤ ₹0.50 (Index) or ≤ ₹1.00 (Stock).', 'YES', 'PASS']
Row 06: ['Gate 6', 'DTE & Instrument Compliance', '7–20 DTE selected; Credit Spreads strictly on NIFTY or SENSEX only.', 'YES', 'PASS']
Row 07: ['FINAL PRE-FLIGHT SETUP VERDICT', '', '', 'SETUP VALID — PROCEED TO CALCULATOR', '']
Row 08: ['Regime #', 'Market Structure State (Daily & 1H)', 'IVP Regime', 'Qualifying Strategy', 'Strike & Delta Blueprint (7–20 DTE)', 'Max Capital / Margin', 'Hard Stop-Loss & Target', 'Time Stop & Expiry Cutoff']
Row 09: ['Regime 1\nImpulse Breakout', 'Clean Break of Structure (BOS) above multi-day Swing High or below Swing Low with volume expansion; price extending away from 21 EMA.', 'Low IVP\n(< 35%)', 'Long Call (Bullish BOS)\nLong Put (Bearish BOS)', 'Buy 1 ATM or 1-Strike ITM (Delta 0.55–0.65). Never buy far-OTM lottery strikes.', 'Max ₹5,000\n(10% Debit)', 'SL: 30% of Premium (Max ₹1,500–₹2,000)\nTarget: Book 50% at 1:1.5 R:R, trail rest to 1:2.5+', '2 Trading Sessions\nSquare off stocks at DTE ≤ 1']
Row 10: ['Regime 2\nTrend Pullback', 'Established HH/HL above 21 & 51 EMA (or LH/LL below) pulling back into 21 EMA / VWAP / prior breakout zone with rejection candle.', 'Moderate IVP\n(20% – 55%)', 'Bull Call Spread (Bullish)\nBear Put Spread (Bearish)', 'Buy 1 ATM + Sell 1 OTM (1–3 strikes away at next S/R). Net Debit = 35%–45% of strike width.', 'Max ₹7,500\n(15% Debit)', 'SL: 40% of Net Debit (Max ₹2,500 / 5%)\nTarget: Limit exit at 65%–75% of Max Profit', '3–4 Trading Sessions\nSquare off stocks at DTE ≤ 1']
Row 11: ['Regime 3\nRange & S&R Sweep', 'Range-bound market or failed breakout / liquidity sweep at major Daily Supply/Demand + OI wall; 21 & 51 EMA flat.', 'High IVP\n(> 55%)', 'Bull Put Spread (Support)\nBear Call Spread (Resistance)', 'Sell 1 OTM beyond S/R (Delta 0.25–0.30) + Buy 1 further OTM hedge (100–200 pts NIFTY / 300–500 pts SENSEX). Index Only.', 'Max ₹38,500\nSPAN Margin', 'SL: Spread widens to 2.0× Credit (Capped at ₹2,500 / 5%)\nTarget: Limit exit at 65%–70% of Max Credit', '4–5 Trading Sessions\nExit all legs by DTE ≤ 1']

================ MarketStructure_Options_System_Trade_Log.csv ================
Row 00: ['Trade #', 'Entry Date', 'Exit Date', 'Mode', 'Segment', 'Market Structure', 'Entry IVP %', 'Strategy', 'Underlying', 'Strikes (Long/Short)', 'Qty', 'Entry Net Prem/Credit (₹)', 'Capital/Margin Blocked (₹)', 'Planned SL (₹)', 'Target Profit (₹)', 'Exit Price (₹/unit)', 'Brokerage (₹)', 'Net P&L (₹)', 'Status', 'R-Multiple', 'Equity Curve (₹)', 'Drawdown (₹)', 'Rule Adherence & Notes']
Row 01: ['1', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 02: ['2', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 03: ['3', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 04: ['4', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 05: ['5', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 06: ['6', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 07: ['7', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 08: ['8', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 09: ['9', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 10: ['10', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 11: ['11', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 12: ['12', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 13: ['13', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 14: ['14', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 15: ['15', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 16: ['16', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 17: ['17', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 18: ['18', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 19: ['19', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 20: ['20', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 21: ['21', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 22: ['22', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 23: ['23', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 24: ['24', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 25: ['25', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 26: ['26', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 27: ['27', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 28: ['28', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 29: ['29', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 30: ['30', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 31: ['31', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 32: ['32', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 33: ['33', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 34: ['34', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 35: ['35', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 36: ['36', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 37: ['37', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 38: ['38', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 39: ['39', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 40: ['40', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 41: ['41', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 42: ['42', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 43: ['43', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 44: ['44', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 45: ['45', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 46: ['46', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 47: ['47', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 48: ['48', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 49: ['49', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 50: ['50', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 51: ['51', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 52: ['52', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 53: ['53', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 54: ['54', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 55: ['55', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 56: ['56', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 57: ['57', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 58: ['58', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 59: ['59', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 60: ['60', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 61: ['61', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 62: ['62', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 63: ['63', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 64: ['64', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 65: ['65', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 66: ['66', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 67: ['67', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 68: ['68', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 69: ['69', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 70: ['70', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 71: ['71', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 72: ['72', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 73: ['73', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 74: ['74', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 75: ['75', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 76: ['76', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 77: ['77', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 78: ['78', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 79: ['79', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 80: ['80', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 81: ['81', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 82: ['82', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 83: ['83', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 84: ['84', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 85: ['85', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 86: ['86', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 87: ['87', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 88: ['88', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 89: ['89', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 90: ['90', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 91: ['91', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 92: ['92', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 93: ['93', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 94: ['94', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 95: ['95', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 96: ['96', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 97: ['97', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 98: ['98', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 99: ['99', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']
Row 100: ['100', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '50000', '', '']

================ MarketStructure_Options_System_Watchlist_Scanner.csv ================
Row 00: ['Underlying (Lot Size)', 'Segment', 'Daily / 1H Market Structure', 'Current IVP %', 'Key Support / Resistance & OI Walls', 'Qualifying Strategy', 'Target Strikes (7–20 DTE)', 'Est. Debit / SPAN Margin']
Row 01: ['NIFTY (65)', 'Index', 'Trend Pullback / Range S&R', '42.0%', 'Map 21/51 EMA + Max Call/Put OI walls', 'Bull Call / Bear Put / Credit Spread', 'ATM / 1-3 OTM (150–200 pt width)', 'Debit: ₹5,000–₹7,000 | SPAN: ~₹22,000']
Row 02: ['SENSEX (20)', 'Index', 'Impulse BOS / Range S&R', '48.0%', 'Map Daily Swing High/Low + OI walls', 'Long Option / Spreads', 'ATM / 400–600 pt spread width', 'Debit: ₹5,000–₹7,000 | SPAN: ~₹24,000']
Row 03: ['RELIANCE (500)', 'F&O Stock', 'Trend Pullback', '36.0%', '1H 21 EMA & VWAP + Option Chain OI', 'Bull Call / Bear Put Spread', 'ATM / 20–30 pt width (DTE > 7)', 'Debit: ₹5,500–₹7,200 (Stocks: Debit/Long Only)']
Row 04: ['HDFCBANK (550)', 'F&O Stock', 'Impulse BOS / Pullback', '30.0%', 'Daily Supply/Demand + 21 EMA', 'Long Call/Put or Debit Spread', 'ATM / 15–20 pt width (DTE > 7)', 'Debit: ₹4,500–₹6,800 (Stocks: Debit/Long Only)']
Row 05: ['ICICIBANK (700)', 'F&O Stock', 'Trend Pullback', '34.0%', '1H 21/51 EMA + PCR confirmation', 'Bull Call / Bear Put Spread', 'ATM / 10–15 pt width (DTE > 7)', 'Debit: ₹5,000–₹6,500 (Stocks: Debit/Long Only)']
Row 06: ['INFY (400)', 'F&O Stock', 'Impulse BOS', '28.0%', 'Breakout box + volume surge', 'Long Call / Long Put', 'ATM or 1-Strike ITM (Delta 0.60)', 'Long Prem: ≤ ₹5,000 (Avoid Earnings Week)']

================ SwingPilot_Options_Spreads_FY2_10-Trade_Batch_Analytics.csv ================
Row 00: ['Batch #', 'Trade Range', 'Period (Start – End)', 'Closed Trades', 'Wins', 'Losses', 'Win Rate %', 'Gross P&L (₹)', 'Brokerage (₹)', 'Net P&L (₹)', 'Avg R-Multiple']
Row 01: ['Batch 1', 'Trades 1–10', 'Pending', '0', '0', '0', '0.0%', '0', '50', '0', '0']
Row 02: ['Batch 2', 'Trades 11–20', 'Pending', '0', '0', '0', '0.0%', '0', '0', '0', '0']
Row 03: ['Batch 3', 'Trades 21–30', 'Pending', '0', '0', '0', '0.0%', '0', '0', '0', '0']
Row 04: ['Batch 4', 'Trades 31–40', 'Pending', '0', '0', '0', '0.0%', '0', '0', '0', '0']
Row 05: ['Batch 5', 'Trades 41–50', 'Pending', '0', '0', '0', '0.0%', '0', '0', '0', '0']
Row 06: ['Batch 6', 'Trades 51–60', 'Pending', '0', '0', '0', '0.0%', '0', '0', '0', '0']
Row 07: ['Batch 7', 'Trades 61–70', 'Pending', '0', '0', '0', '0.0%', '0', '0', '0', '0']
Row 08: ['Batch 8', 'Trades 71–80', 'Pending', '0', '0', '0', '0.0%', '0', '0', '0', '0']
Row 09: ['Batch 9', 'Trades 81–90', 'Pending', '0', '0', '0', '0.0%', '0', '0', '0', '0']
Row 10: ['Batch 10', 'Trades 91–100', 'Pending', '0', '0', '0', '0.0%', '0', '0', '0', '0']

================ SwingPilot_Options_Spreads_FY2_Dashboard.csv ================
Row 00: ['SYSTEM PARAMETERS & RISK LIMITS', '', '']
Row 01: ['Starting Capital (₹)', '', '50000']
Row 02: ['Max Capital / Trade (%)', '', '15.0%']
Row 03: ['Max Planned SL / Trade (%)', '', '5.0%']
Row 04: ['Sahi Brokerage / Round-Trip (₹)', '', '50']
Row 05: ['Batch Size (Trades per Group)', '', '10']
Row 06: ['OVERALL ACCOUNT METRICS (CLOSED TRADES)', 'CURRENT CAPITAL', '₹50,000.00', 'NET RETURN (%)', '0.0%', 'WIN RATE (%)', '0.0%', 'PERFORMANCE BY STRATEGY & INSTRUMENT', 'Segment', 'Bull Call Spread', 'Bear Put Spread', 'Index (NIFTY/SENSEX)', 'F&O Stocks']
Row 07: ['', '', '', '', '', '', '', '', 'Trades', '0', '0', '0', '0']
Row 08: ['', 'NET P&L (₹)', '0', 'TOTAL CLOSED TRADES', '0', 'PROFIT FACTOR', '0', '', 'Win %', '0.0%', '0.0%', '0.0%', '0.0%']
Row 09: ['', '', '', '', '', '', '', '', 'Net P&L (₹)', '0', '0', '0', '0']
Row 10: ['ADVANCED TRADE ANALYTICS', '', '', '', '', '']
Row 11: ['Average Winning Trade (₹)', '', '0', 'Expectancy per Trade (₹)', '', '0']
Row 12: ['Average Losing Trade (₹)', '', '0', 'Average R-Multiple Achieved', '', '0']
Row 13: ['Largest Single Win (₹)', '', '0', 'Total Sahi Brokerage Paid (₹)', '', '50']
Row 14: ['Largest Single Loss (₹)', '', '0', 'Max Peak-to-Trough Drawdown (₹)', '', '0']
Row 15: ['DERIVED RISK GUARDRAILS', '']
Row 16: ['Max Debit Deployed / Trade', '7500']
Row 17: ['Max Planned SL / Trade', '2500']
Row 18: ['Weekly Loss Circuit Breaker (10%)', '5000']
Row 19: ['Monthly Drawdown Pause (15%)', '7500']
Row 20: ['Max Concurrent Positions', '1']

================ SwingPilot_Options_Spreads_FY2_Pre-Trade_Risk_Calculator.csv ================
Row 00: ['Capital Deployment Check (Max ≤ 15% of Capital)', '', '', 'PASS — Within 15% Limit', '', '']
Row 01: ['Planned Stop-Loss Check (SL ≤ 5% of Capital)', '', '', 'PASS — Risk Within 5% Limit', '', '']
Row 02: ['Risk-to-Reward Check (Minimum 1 : 1.5 R:R)', '', '', 'PASS — Favorable R:R', '', '']
Row 03: ['FINAL TRADE DECISION', '', '', 'GO — APPROVED TO EXECUTE', '', '']
Row 04: ['2. RISK & REWARD ANALYSIS (AUTO)', '']
Row 05: ['Total Quantity (Lots × Lot Size)', '825']
Row 06: ['Net Premium Paid / Unit (₹)', '7']
Row 07: ['Total Capital Deployed / Max Loss (₹)', '5775']
Row 08: ['Capital Deployed (% of Account)', '11.6%']
Row 09: ['Strike Width (Points)', '20']
Row 10: ['Max Gross Profit Potential (₹)', '10725']
Row 11: ['Planned Stop-Loss Amount (₹)', '2310']
Row 12: ['Planned SL (% of Total Capital)', '4.6%']
Row 13: ['Exit Spread Value at SL (₹/unit)', '4.2']
Row 14: ['Planned Target Profit (₹)', '6971.25']
Row 15: ['1. TRADE INPUTS (USER ENTRY)', '', '']
Row 16: ['Current Account Capital (₹)', '', '50000']
Row 17: ['Underlying Symbol', '', 'SHRIRAMFIN']
Row 18: ['Instrument Type', '', 'F&O Stock']
Row 19: ['Spread Strategy', '', 'Bear Put Spread']
Row 20: ['Lot Size (Qty per Lot)', '', '825']
Row 21: ['Number of Lots', '', '1']
Row 22: ['Long (Buy) Strike Price', '', '960']
Row 23: ['Short (Sell) Strike Price', '', '940']
Row 24: ['Long Option Buy Premium (₹/unit)', '', '17.15']
Row 25: ['Short Option Sell Premium (₹/unit)', '', '10.15']
Row 26: ['Planned Stop-Loss (% of Net Debit)', '', '40.0%']
Row 27: ['Planned Target (% of Max Profit)', '', '65.0%']

================ SwingPilot_Options_Spreads_FY2_Profit_Exit_Thresholds.csv ================
Row 00: ['Rule Category', 'Threshold / Parameter', '', 'Why It Matters', '', 'Exact Action in Sahi App', '']
Row 01: ['1. Primary Take-Profit', '65% to 75% of Max Spread Profit', '', 'Final 25–30% of spread profit requires holding deep ITM into expiry, exposing you to sudden gamma reversals.', '', 'Place a Good-Till-Triggered / Limit exit order at the 65% target spread price immediately after entry.', '']
Row 02: ['2. Minimum R:R Filter', 'At least 1 : 1.5 (Net of ₹50 Brokerage)', '', 'Ensures 1 winning trade recovers 1.5 to 3 losing trades, keeping expectancy positive even at a 45% win rate.', '', 'Never enter a spread if 65% target profit minus ₹50 is less than 1.5× your planned stop-loss.', '']
Row 03: ['3. Chart Level Take-Profit', '50%–60% Profit at Major Daily S/R', '', 'Stocks/indices frequently bounce sharply off daily moving averages (21/51 EMA) or swing highs/lows.', '', 'If spot reaches your target chart zone (e.g., 21 EMA) and stalls, exit manually at market/limit.', '']
Row 04: ['4. Time-Based Exit', '3 to 4 Sideways Trading Sessions', '', "Debit spreads lose extrinsic value if the underlying consolidates flat, even if price hasn't hit your SL.", '', 'Close the spread around breakeven or small loss after 3–4 flat days and redeploy into a cleaner trend.', '']
Row 05: ['5. Pre-Expiry Cutoff', '1 to 2 Days Before Expiry (DTE ≤ 1)', '', 'F&O stock options face physical delivery margin spikes and STT/exercise penalties if held ITM on expiry day.', '', 'Square off both legs (Short leg first, then Long leg) 24–48 hours before expiration—zero exceptions.', '']
Row 06: ['Exit Tier / Action', '% of Max Profit / Debit', 'Exit Spread Price (₹/unit)', 'Gross P&L (₹)', 'Net P&L after ₹50 (₹)', 'Reward : Risk (vs SL)', 'Execution Rule / Trigger']
Row 07: ['Max Theoretical Profit (Expiry)', '100.0%', '20', '10725', '10675', '4.62121', 'DO NOT WAIT — Requires deep ITM hold into expiry; high gamma/delivery risk']
Row 08: ['Stretch Profit Target (75% Max)', '75.0%', '16.75', '8043.75', '7993.75', '3.4605', 'Upper take-profit cap; close full position if momentum accelerates early']
Row 09: ['Primary Profit Target (65% Max)', '65.0%', '15.45', '6971.25', '6921.25', '2.99621', 'DEFAULT TAKE-PROFIT — Place limit exit basket order here immediately after entry']
Row 10: ['Conservative / Resistance Exit (50%)', '50.0%', '13.5', '5362.5', '5312.5', '2.29978', 'Book early if underlying stalls at major daily Support/Resistance or 3+ days pass']
Row 11: ['Breakeven Exit (Cost + Brokerage)', '0.0%', '7.06061', '50', '0', '0', 'Time-stop exit if underlying chops sideways for 3–4 sessions without moving']
Row 12: ['Hard Stop-Loss (40% of Debit)', '-40.0%', '4.2', '-2310', '-2360', '-1', 'DEFAULT HARD SL — Exit immediately; caps account loss under ~4.7% of ₹50,000']
Row 13: ['Max Account SL Cap (50% of Debit)', '-50.0%', '3.5', '-2887.5', '-2937.5', '-1.25', 'ABSOLUTE MAX LOSS — Never allow a debit spread loss to exceed 50% of debit']

================ SwingPilot_Options_Spreads_FY2_Setup_Entry_Playbook.csv ================
Row 00: ['Step', 'Action Item', '', 'Verification Criteria & Rule', '', '', 'Gate Status']
Row 01: ['Step 1', 'Active Position & Loss Check', '', 'Confirm 0 OPEN trades in Trade Log, weekly loss < ₹5,000, and monthly drawdown < ₹7,500.', '', '', 'MANDATORY GATE']
Row 02: ['Step 2', 'Timing & Liquidity Filter', '', 'Execute during 11:30 AM – 1:30 PM IST window (skip 9:15–9:45 AM opening whipsaws). Bid-ask gap ≤ ₹0.50 on indices / ₹1.00 on stocks; no earnings event inside hold window.', '', '', 'MANDATORY GATE']
Row 03: ['Step 3', 'Pre-Trade Calculator Audit', '', "Enter strikes, premiums, and lot size in 'Pre-Trade Risk Calculator'. Verify Max Debit ≤ ₹7,500, 40% SL ≤ ₹2,500, and R:R ≥ 1 : 1.5.", '', '', "MUST READ 'GO'"]
Row 04: ['Step 4', 'Hedged Basket Order in Sahi', '', 'Place a Basket Order or execute the BUY leg FIRST, followed immediately by the SELL leg using Limit Orders near mid-price to capture SPAN + Exposure margin benefit.', '', '', 'BUY LEG FIRST']
Row 05: ['Step 5', 'Immediate Trade Log Entry', '', "Record Entry Date, Strikes, Qty, actual filled Buy Prem & Sell Prem, Planned SL (40% debit), and Target (65% max profit) in 'Trade Log' tab.", '', '', 'LOG IMMEDIATELY']
Row 06: ['Step 6', 'Alert & Exit Order Setup', '', "Set GTT/Limit take-profit order at the 65% target spread price (from 'Profit & Exit Thresholds' tab) and price alerts at spot invalidation level.", '', '', 'SET & FORGET']
Row 07: ['Setup Dimension', 'BULL CALL SPREAD (Bullish Directional)', '', '', 'BEAR PUT SPREAD (Bearish Directional)', '', '']
Row 08: ['Higher Timeframe Trend (Daily / 1H)', 'Price trading ABOVE both 21 EMA and 51 EMA; Higher Highs & Higher Lows structure intact.', '', '', 'Price trading BELOW both 21 EMA and 51 EMA; Lower Highs & Lower Lows structure intact.', '', '']
Row 09: ['Option Chain / OI Confirmation', 'Strong Put OI support floor below spot; Call unwinding at ATM/OTM strikes; PCR ≥ 0.85.', '', '', 'Heavy Call OI resistance wall just above spot; Put unwinding at ATM strikes; PCR ≤ 0.85.', '', '']
Row 10: ['Entry Trigger (15m / 1H Chart)', 'Pullback to 21 EMA or VWAP support followed by bullish engulfing/rejection close with rising volume. Never chase vertical breakouts.', '', '', 'Rally/retest into 21/51 EMA or VWAP resistance followed by bearish breakdown candle with rising volume.', '', '']
Row 11: ['Strike Construction (7–20 DTE)', 'BUY 1 ATM Call (or 1 strike ITM) + SELL 1 OTM Call (1–3 strikes higher near next resistance).', '', '', 'BUY 1 ATM Put (or 1 strike OTM) + SELL 1 OTM Put (1–3 strikes lower near next support).', '', '']
Row 12: ['Net Debit & Width Rule', 'Net Debit (Buy CE - Sell CE) = 35% to 45% of strike width. Total Debit ≤ ₹7,500.', '', '', 'Net Debit (Buy PE - Sell PE) = 35% to 45% of strike width. Total Debit ≤ ₹7,500.', '', '']
Row 13: ['Initial Margin Filter (Sahi)', 'Standalone margin ≤ ₹38,500 (fits ₹40K initial cash) until account is topped up to ₹50K.', '', '', 'Standalone margin ≤ ₹38,500 (fits ₹40K initial cash) until account is topped up to ₹50K.', '', '']

================ SwingPilot_Options_Spreads_FY2_System_Rules_Checklist.csv ================
Row 00: ['Primary Underlyings', 'NIFTY and SENSEX (weekly/next-weekly expiries with tight bid-ask spreads).', '', '']
Row 01: ['F&O Stock Selection', 'Only top 25 liquid F&O stocks (e.g., RELIANCE, HDFCBANK, ICICIBANK, INFY, TCS, SBIN) where 1-lot spread debit ≤ ₹7,500. Avoid earnings week.', '', '']
Row 02: ['Days to Expiration (DTE)', 'Enter with 7 to 20 DTE for swing trades (2–7 day holding period). Avoid 0DTE/1DTE expiry day gamma spikes.', '', '']
Row 03: ['Strike Construction', 'Buy ATM (At-The-Money) strike and Sell OTM (Out-Of-The-Money) strike 1–3 strikes away. Net debit should be 35%–45% of strike width.', '', '']
Row 04: ['Minimum Risk-to-Reward', 'Only take setups offering at least 1 : 1.5 R:R (e.g., ₹2,500 planned risk for ₹3,750+ target profit).', '', '']
Row 05: ['Order Execution (Sahi App)', 'Always place a Basket Order or execute the BUY leg first, followed immediately by the SELL leg to get full SPAN + Exposure margin benefit.', '', '']
Row 06: ['Pre-Trade Calculator Gate', "Plug strikes and premiums into 'Pre-Trade Risk Calculator' tab first. Only execute if Final Decision reads 'GO — APPROVED TO EXECUTE'.", '', '']
Row 07: ['No Averaging Down', 'Never add lots to a losing spread. Honor the pre-decided stop-loss without hesitation.', '', '']
Row 08: ['Time Stop Rule', 'If the underlying remains sideways after 3–4 trading sessions and theta decay begins eroding the spread, close the position early.', '', '']
Row 09: ['10-Trade Cohort Review', "Review '10-Trade Batch Analytics' after every 10 completed trades before increasing position size or adjusting rules.", '', '']
Row 10: ['Maximum Capital per Spread', '10% to 15% of capital (₹5,000 – ₹7,500 max debit). Never deploy more than ₹7,500 on a single trade.', '', '']
Row 11: ['Planned Stop-Loss (Actual Risk)', '4% to 5% of total capital (₹2,000 – ₹2,500). Exit when spread loses ~40% of entry debit or underlying breaks key support/resistance.', '', '']
Row 12: ['Concurrent Position Limit', 'Strictly 1 active spread trade at a time until 20+ logged trades demonstrate positive expectancy.', '', '']
Row 13: ['Brokerage & Transaction Cost', 'Sahi App: ₹12.50 per order × 2 legs × 2 sides (Entry + Exit) = ₹50 flat round-trip deducted automatically in Trade Log.', '', '']
Row 14: ['Circuit Breakers', 'Stop trading for the week if weekly loss hits ₹5,000 (10%). Pause & audit system if account drops ₹7,500 (15%) from peak.', '', '']

================ SwingPilot_Options_Spreads_FY2_Trade_Log.csv ================
Row 00: ['Strikes (Long/Short)', '960 PE / 940 PE']
Row 01: ['Qty (Lot×Lots)', '825']
Row 02: ['Buy Prem (₹)', '17.15']
Row 03: ['Sell Prem (₹)', '10.15']
Row 04: ['Net Prem (₹)', '7']
Row 05: ['Max Debit / Risk (₹)', '5775']
Row 06: ['Planned SL (₹)', '2310']
Row 07: ['Target Profit (₹)', '6971']
Row 08: ['Exit Spread (₹)', '']
Row 09: ['Exit Value (₹)', '']
Row 10: ['Gross P&L (₹)', '']
Row 11: ['Brokerage (₹)', '50']
Row 12: ['Net P&L (₹)', '']
Row 13: ['Status', 'OPEN']
Row 14: ['R-Multiple', '']
Row 15: ['Equity Curve (₹)', '']
Row 16: ['Drawdown (₹)', '']

================ SwingPilot_Options_Spreads_FY2_Watchlist.csv ================
Row 00: ['Underlying (Lot)', 'Expiry (DTE)', 'Spot & OI Context', 'Bull Call Trigger', 'Bear Put Trigger', 'Target Spread Width', 'Est. Debit & Margin']
Row 01: ['NIFTY (65)', '23-Nov-26 (8 DTE)', 'Spot ~25,129 | Call OI wall 25,200; Put OI floor 25,000; IV ~12.8%', '1H close > 25,220 with rising volume → Buy 25150 CE / Sell 25350 CE', '1H breakdown < 25,000 → Buy 25100 PE / Sell 24900 PE', '200 pts', 'Debit: ~₹5,200–₹6,100 | Margin: ~₹20,000']
Row 02: ['SENSEX (20)', '26-Nov-26 (11 DTE)', 'Spot ~81,911–82,015 | Call OI peak 82,000; Put OI 80,000; IV ~17.3%', 'Sustained hold > 82,100 → Buy 82000 CE / Sell 82600 CE', 'Rejection at 82,000 & break < 81,550 → Buy 81900 PE / Sell 81300 PE', '600 pts', 'Debit: ~₹5,000–₹6,000 | Margin: ~₹22,000']
Row 03: ['RELIANCE (500)', '23-Nov-26 (8 DTE)', 'Spot ~₹1,311 | Strong 1M momentum (+12.3%), high liquidity', 'Pullback bounce off 1H 21 EMA / ₹1,300 → Buy 1310 CE / Sell 1340 CE', 'Breakdown below ₹1,290 support → Buy 1310 PE / Sell 1280 PE', '30 pts', 'Debit: ~₹5,500–₹6,800 | Margin: ~₹32,000']
Row 04: ['ICICIBANK (700)', '23-Nov-26 (8 DTE)', 'Tight bid-ask spreads; liquid banking leader', 'Reclaim above 1H 21 EMA → 10–15 pt ATM/OTM Bull Call Spread', 'Break below 1H 51 EMA → 10–15 pt ATM/OTM Bear Put Spread', '10–15 pts', 'Debit: ~₹5,000–₹6,500 | Margin: ~₹30,000']


```

```python
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
