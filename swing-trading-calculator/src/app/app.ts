import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  startingCapital: number = 100000;
  profitTarget: number = 5;
  stopLoss: number = 2;
  winRate: number = 60;

  totalGrossProfit: string = "0.00";
  totalNetProfit: string = "0.00";
  totalTrades: string = "0";
  winningTrades: string = "0";

  ngOnInit() {
    this.calculateSimulation();
  }

  calculateSimulation() {
    if (this.startingCapital <= 0 || this.profitTarget <= 0 || this.stopLoss <= 0 || this.winRate <= 0 || this.winRate > 100) {
      return;
    }

    let currentCapital = this.startingCapital;
    const targetCapital = this.startingCapital * 2;

    let trades = 0;
    let wins = 0;
    let gross = 0;
    let net = 0;

    let prob = 0.5;

    while (currentCapital < targetCapital) {
        if (currentCapital < 100 || trades > 5000) {
            break;
        }

        prob += (this.winRate / 100);
        let isWin = false;

        if (prob >= 1) {
            isWin = true;
            prob -= 1;
            wins++;
        }

        trades++;

        const res = this.calculateTradeResult(currentCapital, isWin, this.profitTarget, this.stopLoss);

        gross += res.grossProfit;
        net += res.netProfit;
        currentCapital += res.netProfit;
    }

    if (trades > 5000 || currentCapital < targetCapital) {
      this.totalGrossProfit = "Unreachable";
      this.totalNetProfit = "Unreachable";
      this.totalTrades = "N/A";
      this.winningTrades = "N/A";
    } else {
      this.totalGrossProfit = gross.toFixed(2);
      this.totalNetProfit = net.toFixed(2);
      this.totalTrades = trades.toString();
      this.winningTrades = wins.toString();
    }
  }

  calculateTradeResult(capital: number, isWin: boolean, pTgt: number, sLss: number) {
    const buyValue = capital;

    const sttBuy = buyValue * 0.001;
    const excBuy = buyValue * 0.0000345;

    let sellValue = 0;
    if (isWin) {
        sellValue = buyValue * (1 + pTgt / 100);
    } else {
        sellValue = buyValue * (1 - sLss / 100);
    }

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
}
