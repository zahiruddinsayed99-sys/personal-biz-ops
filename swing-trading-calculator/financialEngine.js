function calculateTradeResult(capital, isWin, profitTarget, stopLoss) {
    const buyValue = capital;

    // STT (0.1%) and Exchange Charges (~0.00345%) on BUY
    const sttBuy = buyValue * 0.001;
    const excBuy = buyValue * 0.0000345;

    let sellValue = 0;
    if (isWin) {
        sellValue = buyValue * (1 + profitTarget / 100);
    } else {
        sellValue = buyValue * (1 - stopLoss / 100);
    }

    // STT (0.1%), Exchange Charges (~0.00345%), and DP Fees (₹15.93) on SELL
    const sttSell = sellValue * 0.001;
    const excSell = sellValue * 0.0000345;
    const dpCharges = 15.93;

    const totalCharges = sttBuy + excBuy + sttSell + excSell + dpCharges;
    const grossProfit = sellValue - buyValue;
    const netProfit = grossProfit - totalCharges;

    return {
        netProfit,
        totalCharges,
        grossProfit
    };
}

function calculateSimulation() {
    // Get values from inputs
    const startingCapital = parseFloat(document.getElementById('capital').value);
    const profitTarget = parseFloat(document.getElementById('profitTarget').value);
    const stopLoss = parseFloat(document.getElementById('stopLoss').value);
    const winRate = parseFloat(document.getElementById('winRate').value);

    // Validate inputs
    if (isNaN(startingCapital) || startingCapital <= 0 ||
        isNaN(profitTarget) || profitTarget <= 0 ||
        isNaN(stopLoss) || stopLoss <= 0 ||
        isNaN(winRate) || winRate <= 0 || winRate > 100) {
        return; // wait for valid input
    }

    let currentCapital = startingCapital;
    const targetCapital = startingCapital * 2;

    let totalTrades = 0;
    let winningTrades = 0;
    let totalGrossProfit = 0;
    let totalNetProfit = 0;

    // We use a probability accumulator starting at 0.5 to evenly distribute wins and losses
    // based exactly on the target win rate percentage.
    let prob = 0.5;

    while (currentCapital < targetCapital) {
        // Break if capital drops too low to cover DP charges safely or if trades exceed a massive number (unviable strategy)
        if (currentCapital < 100 || totalTrades > 5000) {
            break;
        }

        prob += (winRate / 100);
        let isWin = false;

        if (prob >= 1) {
            isWin = true;
            prob -= 1;
            winningTrades++;
        }

        totalTrades++;

        const res = calculateTradeResult(currentCapital, isWin, profitTarget, stopLoss);

        totalGrossProfit += res.grossProfit;
        totalNetProfit += res.netProfit;
        currentCapital += res.netProfit;
    }

    // Update DOM
    if (totalTrades > 5000 || currentCapital < targetCapital) {
        document.getElementById('resTotalProfit').innerText = "Unreachable";
        document.getElementById('resNetProfit').innerText = "Unreachable";
        document.getElementById('resTotalTrades').innerText = "N/A";
        document.getElementById('resWinningTrades').innerText = "N/A";
    } else {
        document.getElementById('resTotalProfit').innerText = totalGrossProfit.toFixed(2);
        document.getElementById('resNetProfit').innerText = totalNetProfit.toFixed(2);
        document.getElementById('resTotalTrades').innerText = totalTrades;
        document.getElementById('resWinningTrades').innerText = winningTrades;
    }
}

// Add event listeners once DOM is loaded (browser only)
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const inputs = ['capital', 'profitTarget', 'stopLoss', 'winRate'];
        inputs.forEach(id => {
            document.getElementById(id).addEventListener('input', calculateSimulation);
        });

        // Initial calculation
        calculateSimulation();
    });
}

// For testing purposes, we export the functions if running in Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { calculateTradeResult, calculateSimulation };
}
