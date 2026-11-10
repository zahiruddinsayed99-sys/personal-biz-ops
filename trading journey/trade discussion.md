Understood. For SwingPilot, we'll assume 1 lot only for both Bull Call and Bear Put spreads during paper trading.

This changes our exit strategy slightly.

## 1. One-lot exit rule

Since you have only one lot, partial profit booking is not practical.

| Profit / condition            | Action                      |
| ----------------------------- | --------------------------- |
| +0.5R                         | Hold if setup remains valid |
| +1R                           | Review stop and chart       |
| +1.5R + target reached        | Full exit                   |
| +2R                           | Full exit                   |
| 1H structure invalidated      | Full exit                   |
| Loss reaches predefined limit | Full exit                   |

## 2. Your previous scenario

Bull Call Spread:

- Market moving opposite.
- P&L = +1.5R.
- Target reached.
- Quantity = 1 lot.

Full exit — 1 lot

Close:

1. Short CE → BUY BACK.
2. Long CE → SELL.
3. Verify both legs show zero quantity.

## 3. SwingPilot final one-lot principle

No partial exit. No averaging. No adding another lot to a losing position.

Book the entire spread when the exit condition is triggered.

One more important point: ₹500 maximum risk includes both legs' net debit, charges and estimated slippage. If one lot cannot fit this risk budget, the decision is NO TRADE.
