Absolutely. Let's create a SwingPilot One-Lot Exit Decision Matrix covering all possible combinations for Bull Call and Bear Put spreads.

The objective is to answer one question after every trade:

HOLD, EXIT PROFIT, EXIT LOSS, or REVIEW?

We'll use one lot only, no partial booking, and no averaging.

# 1. Inputs to evaluate after entering a trade

| Factor            | Example                      |
| ----------------- | ---------------------------- |
| Spread direction  | Bull Call / Bear Put         |
| Planned risk      | ₹400                         |
| Planned reward    | ₹800                         |
| Risk-reward ratio | 1:2                          |
| Quantity          | 1 lot                        |
| Current P&L       | +₹600                        |
| Market direction  | Favour / Opposite            |
| Chart condition   | Target reached / Not reached |
| 1H structure      | Intact / Broken              |
| Time in trade     | 1–10 sessions                |

Here, 1R = ₹400 and 2R = ₹800. These are illustrative values.

# 2. Profit-side combinations

Assume the trade is currently profitable.

| Current P&L | Market direction | Target         | 1H structure     | Decision              |
| ----------- | ---------------- | -------------- | ---------------- | --------------------- |
| +0.5R       | Favour           | Not reached    | Intact           | HOLD                  |
| +1R         | Favour           | Not reached    | Intact           | HOLD / trail          |
| +1.5R       | Favour           | Not reached    | Intact           | HOLD / protect profit |
| +1.5R       | Favour           | Reached        | Intact           | EXIT                  |
| +1.5R       | Opposite         | Reached        | Intact or broken | EXIT                  |
| +1R         | Opposite         | Not reached    | Intact           | REVIEW; tighten exit  |
| +0.5R       | Opposite         | Not reached    | Broken           | EXIT                  |
| +2R         | Any              | Reached or not | Any              | EXIT                  |

Important: With one lot, every profit exit means closing the entire spread.

# 3. Loss-side combinations

| Current P&L | Market direction | Target      | 1H structure | Decision                                            |
| ----------- | ---------------- | ----------- | ------------ | --------------------------------------------------- |
| −0.25R      | Favour           | Not reached | Intact       | HOLD / investigate                                  |
| −0.5R       | Favour           | Not reached | Intact       | HOLD if setup valid                                 |
| −0.5R       | Opposite         | Not reached | Intact       | REVIEW                                              |
| −0.7R       | Opposite         | Not reached | Broken       | EXIT                                                |
| −1R         | Any              | Not reached | Any          | EXIT                                                |
| −0.5R       | Opposite         | Not reached | Broken       | EXIT                                                |
| −0.25R      | Opposite         | Not reached | Intact       | Monitor closely                                     |
| −0.75R      | Favour           | Not reached | Intact       | Check whether setup remains valid; don't widen stop |

The planned loss limit should be an actual executable spread exit level, not just an underlying chart price.

# 4. All four spread combinations

A. Bull Call Spread

Favourable = Sensex moving UP

- Profit + target reached → EXIT.
- Profit + target not reached + trend intact → HOLD / trail.
- Market reverses + 1H bullish structure breaks → EXIT.
- Loss reaches predefined stop → EXIT.

  B. Bull Call Spread

Opposite = Sensex moving DOWN

- Profit + target reached → EXIT.
- Profit + target not reached + structure intact → REVIEW.
- Structure breaks → EXIT.
- Maximum planned loss reached → EXIT.

  C. Bear Put Spread

Favourable = Sensex moving DOWN

- Profit + target reached → EXIT.
- Profit + target not reached + trend intact → HOLD / trail.
- Market reverses + 1H bearish structure breaks → EXIT.
- Loss reaches predefined stop → EXIT.

  D. Bear Put Spread

Opposite = Sensex moving UP

- Profit + target reached → EXIT.
- Profit + target not reached + structure intact → REVIEW.
- Structure breaks → EXIT.
- Maximum planned loss reached → EXIT.

# 5. Special combinations: What if the market behaves differently?

These situations also need rules.

| Special situation                                    | Action                                                           |
| ---------------------------------------------------- | ---------------------------------------------------------------- |
| Gap in favourable direction                          | Recalculate spread P&L; book if target achieved                  |
| Gap in opposite direction                            | Check executable loss immediately; exit if invalidated           |
| Underlying reaches target but spread profit is small | Check IV, theta and short-leg value; consider exit               |
| Spread reaches 70–80% of maximum profit              | Review early exit                                                |
| 3 sessions without progress                          | Reassess original setup                                          |
| IV drops sharply                                     | Recalculate spread value and remaining reward                    |
| Expiry is approaching                                | Reassess settlement and remaining risk; don't hold automatically |

# 6. SwingPilot final exit hierarchy

The rules should be applied in this priority order:

1. Maximum loss / invalidation

   Exit immediately when the predefined loss or chart invalidation condition triggers.
2. Target reached

   Close full position, even if the market still looks favourable.
3. Trend reversal

   Exit when the confirmed 1H structure breaks.
4. Trailing profit

   If target is not reached and trend remains intact, protect accumulated profit.
5. Time stop

   Reassess after 3 sessions without progress.

# 7. Interactive SwingPilot exit simulator

You can select a combination and get the recommended action.

## One-lot exit calculator

Spread type

Bull Call

Bear Put

Market movement

Favour trade

Opposite direction

Planned risk (₹)

Planned reward (₹)

Current combined spread P&L (₹)

Chart target

Reached

Not reached

1H structure

Intact

Broken

Trading sessions held

1

2

3

4+

CALCULATED PAPER-TRADING DECISION

# EXIT FULL POSITION — BOOK PROFIT

Current P&L in R

1.50R

Reward target

₹800

Illustrative decision aid. Confirm actual spread liquidation price, charges, stop and order fills before acting. Chart target and risk rules take precedence over this simplified simulator.

Explain this exit scenario

My recommendation: Use this matrix for your first 30–50 paper trades. Record the entry debit, actual exit value of both legs, charges, P&L in rupees and R, and the reason for exit. We can then evaluate whether 1.5R, 2R, or trailing exits produce better results for SwingPilot.
