import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface HoldingPosition {
  id?: string;
  symbol: string;
  stockName: string;
  entryPrice: number;
  currentPrice: number;
  quantity: number;
  stopLossPercent: number;
  target1Percent: number;
  target2Percent: number;
  highestPrice: number;
  trailingStopPercent: number;
  useTrailingStop: boolean;
  daysHeld: number;
  trend: 'Bullish' | 'Neutral' | 'Bearish';
  rsi: 'Bullish (50-65)' | 'Overbought (>70)' | 'Oversold (<30)' | 'Neutral';
  volume: 'High (Institutional)' | 'Normal' | 'Distribution (Red Spike)';
  niftyTrend: 'Bullish' | 'Consolidating' | 'Correction';
  upcomingEvent: boolean;
}

export interface RuleTrigger {
  ruleId: string;
  title: string;
  description: string;
  severity: 'green' | 'yellow' | 'orange' | 'red';
  icon: string;
}

export interface AdviceResult {
  action: 'STRONG_HOLD' | 'HOLD' | 'PARTIAL_EXIT' | 'FULL_EXIT' | 'TIME_EXIT' | 'STOP_LOSS_EXIT';
  badgeText: string;
  badgeClass: string;
  primaryAction: string;
  summary: string;
  rulesTriggered: RuleTrigger[];
  metrics: {
    buyValue: number;
    currentValue: number;
    grossPnL: number;
    grossPnLPercent: number;
    netPnL: number;
    netPnLPercent: number;
    totalCharges: number;
    stt: number;
    dpCharges: number;
    exchangeTxn: number;
    gstAndFee: number;
    stopLossPrice: number;
    target1Price: number;
    target2Price: number;
    trailingStopPrice: number;
    riskRewardRatio: string;
    distanceToSLPercent: number;
    distanceToTgt1Percent: number;
    progressToTarget1Percent: number;
    progressFromSLPercent: number;
  };
}

export interface PresetScenario {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  badge: string;
  badgeColor: string;
  position: HoldingPosition;
}

export interface QuickStock {
  symbol: string;
  name: string;
  suggestedEntry: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  activeTab: 'advisor' | 'simulator' | 'portfolio' | 'guide' = 'advisor';
  isDarkMode: boolean = true;

  // Portfolio Watchlist Search & Filters
  portfolioSearchTerm: string = '';
  portfolioFilter: 'ALL' | 'ACTION_REQUIRED' | 'HOLDING' = 'ALL';

  // Add Position Modal State
  isAddModalOpen: boolean = false;
  newHolding: HoldingPosition = {
    symbol: '',
    stockName: '',
    entryPrice: 100,
    currentPrice: 100,
    quantity: 10,
    stopLossPercent: 2.5,
    target1Percent: 5.0,
    target2Percent: 12.0,
    highestPrice: 100,
    trailingStopPercent: 3.0,
    useTrailingStop: true,
    daysHeld: 1,
    trend: 'Bullish',
    rsi: 'Bullish (50-65)',
    volume: 'Normal',
    niftyTrend: 'Bullish',
    upcomingEvent: false
  };

  // -------------------------------------------------------------
  // TAB 1: HOLD VS EXIT ADVISOR STATE
  // -------------------------------------------------------------
  position: HoldingPosition = {
    symbol: 'RELIANCE',
    stockName: 'Reliance Industries Ltd',
    entryPrice: 2800,
    currentPrice: 2982, // +6.5% gain
    quantity: 50,
    stopLossPercent: 2.5,
    target1Percent: 5.0,
    target2Percent: 12.0,
    highestPrice: 2995,
    trailingStopPercent: 3.0,
    useTrailingStop: true,
    daysHeld: 7,
    trend: 'Bullish',
    rsi: 'Bullish (50-65)',
    volume: 'High (Institutional)',
    niftyTrend: 'Bullish',
    upcomingEvent: false
  };

  adviceResult!: AdviceResult;

  // Preset Indian Stocks for 1-click selection
  quickStocks: QuickStock[] = [
    { symbol: 'RELIANCE', name: 'Reliance Industries', suggestedEntry: 2800 },
    { symbol: 'TATASTEEL', name: 'Tata Steel', suggestedEntry: 160 },
    { symbol: 'INFY', name: 'Infosys Ltd', suggestedEntry: 1820 },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', suggestedEntry: 1650 },
    { symbol: 'ITC', name: 'ITC Ltd', suggestedEntry: 470 },
    { symbol: 'LT', name: 'Larsen & Toubro', suggestedEntry: 3600 }
  ];

  // Quick scenarios for minimal typing
  presetScenarios: PresetScenario[] = [
    {
      id: 'breakout_winner',
      title: '🚀 Hit Target 1 (+6.5%)',
      subtitle: 'Stock reached T1 with high volume',
      icon: '🎯',
      badge: 'Partial Exit',
      badgeColor: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      position: {
        symbol: 'RELIANCE',
        stockName: 'Reliance Industries',
        entryPrice: 2800,
        currentPrice: 2982,
        quantity: 50,
        stopLossPercent: 2.5,
        target1Percent: 5.0,
        target2Percent: 12.0,
        highestPrice: 2995,
        trailingStopPercent: 3.0,
        useTrailingStop: true,
        daysHeld: 6,
        trend: 'Bullish',
        rsi: 'Bullish (50-65)',
        volume: 'High (Institutional)',
        niftyTrend: 'Bullish',
        upcomingEvent: false
      }
    },
    {
      id: 'hit_sl',
      title: '🛑 Hit Stop Loss (-2.8%)',
      subtitle: 'Price broke below planned SL',
      icon: '💥',
      badge: 'Cut Loss',
      badgeColor: 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30',
      position: {
        symbol: 'TATASTEEL',
        stockName: 'Tata Steel',
        entryPrice: 160,
        currentPrice: 155.5,
        quantity: 500,
        stopLossPercent: 2.5,
        target1Percent: 6.0,
        target2Percent: 12.0,
        highestPrice: 162,
        trailingStopPercent: 3.0,
        useTrailingStop: false,
        daysHeld: 3,
        trend: 'Bearish',
        rsi: 'Neutral',
        volume: 'Distribution (Red Spike)',
        niftyTrend: 'Correction',
        upcomingEvent: false
      }
    },
    {
      id: 'time_stagnant',
      title: '⏳ Stagnant Dead Money',
      subtitle: 'Held 18 days with 0.3% move',
      icon: '⏱️',
      badge: 'Time Exit',
      badgeColor: 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30',
      position: {
        symbol: 'INFY',
        stockName: 'Infosys Ltd',
        entryPrice: 1820,
        currentPrice: 1825,
        quantity: 50,
        stopLossPercent: 3.0,
        target1Percent: 6.0,
        target2Percent: 12.0,
        highestPrice: 1845,
        trailingStopPercent: 3.0,
        useTrailingStop: true,
        daysHeld: 18,
        trend: 'Neutral',
        rsi: 'Neutral',
        volume: 'Normal',
        niftyTrend: 'Consolidating',
        upcomingEvent: false
      }
    },
    {
      id: 'target2_full',
      title: '🏆 Hit Target 2 (+13.2%)',
      subtitle: 'Extended profit target reached',
      icon: '💰',
      badge: 'Full Exit',
      badgeColor: 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
      position: {
        symbol: 'ITC',
        stockName: 'ITC Ltd',
        entryPrice: 470,
        currentPrice: 532,
        quantity: 300,
        stopLossPercent: 2.0,
        target1Percent: 5.0,
        target2Percent: 12.0,
        highestPrice: 535,
        trailingStopPercent: 3.0,
        useTrailingStop: true,
        daysHeld: 11,
        trend: 'Bullish',
        rsi: 'Overbought (>70)',
        volume: 'High (Institutional)',
        niftyTrend: 'Bullish',
        upcomingEvent: false
      }
    },
    {
      id: 'bearish_warning',
      title: '⚠️ Breakdown Warning',
      subtitle: 'Heavy red volume breakdown',
      icon: '🚨',
      badge: 'Early Exit',
      badgeColor: 'bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/30',
      position: {
        symbol: 'HDFCBANK',
        stockName: 'HDFC Bank',
        entryPrice: 1650,
        currentPrice: 1622,
        quantity: 60,
        stopLossPercent: 2.5,
        target1Percent: 5.0,
        target2Percent: 10.0,
        highestPrice: 1665,
        trailingStopPercent: 3.0,
        useTrailingStop: false,
        daysHeld: 5,
        trend: 'Bearish',
        rsi: 'Neutral',
        volume: 'Distribution (Red Spike)',
        niftyTrend: 'Correction',
        upcomingEvent: true
      }
    }
  ];

  // Saved Positions Portfolio Watchlist
  myHoldings: HoldingPosition[] = [];

  // -------------------------------------------------------------
  // TAB 2: SWING SIMULATOR STATE (ENHANCED)
  // -------------------------------------------------------------
  startingCapital: number = 100000;
  profitTarget: number = 5;
  stopLoss: number = 2;
  winRate: number = 60;

  totalGrossProfit: string = "0.00";
  totalNetProfit: string = "0.00";
  totalTrades: string = "0";
  winningTrades: string = "0";
  losingTrades: string = "0";
  finalCapital: string = "0.00";
  expectedValuePerTrade: string = "0.00";

  ngOnInit() {
    this.initTheme();
    this.loadSavedHoldings();
    this.evaluatePosition();
    this.calculateSimulation();
  }

  // Theme Management (Light & Dark Mode)
  initTheme() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedTheme = localStorage.getItem('swing_calc_theme');
        if (savedTheme === 'light') {
          this.isDarkMode = false;
        } else if (savedTheme === 'dark') {
          this.isDarkMode = true;
        } else {
          this.isDarkMode = true;
        }
      }
    } catch (e) {
      this.isDarkMode = true;
    }
    this.applyTheme();
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
  }

  applyTheme() {
    if (typeof document !== 'undefined') {
      if (this.isDarkMode) {
        document.documentElement.classList.add('dark');
        try { localStorage.setItem('swing_calc_theme', 'dark'); } catch(e) {}
      } else {
        document.documentElement.classList.remove('dark');
        try { localStorage.setItem('swing_calc_theme', 'light'); } catch(e) {}
      }
    }
  }

  // -------------------------------------------------------------
  // RULE ENGINE FOR HOLD VS EXIT ADVISOR
  // -------------------------------------------------------------
  evaluatePosition() {
    // Sanitize inputs
    if (this.position.entryPrice <= 0) this.position.entryPrice = 1;
    if (this.position.currentPrice <= 0) this.position.currentPrice = this.position.entryPrice;
    if (this.position.quantity <= 0) this.position.quantity = 1;
    if (this.position.highestPrice < this.position.currentPrice || this.position.highestPrice > this.position.entryPrice * 3) {
      this.position.highestPrice = Math.max(this.position.currentPrice, this.position.entryPrice);
    }

    const entry = this.position.entryPrice;
    const current = this.position.currentPrice;
    const qty = this.position.quantity;
    const slPct = this.position.stopLossPercent;
    const t1Pct = this.position.target1Percent;
    const t2Pct = this.position.target2Percent;
    const trailPct = this.position.trailingStopPercent;

    const buyValue = entry * qty;
    const currentValue = current * qty;
    const grossPnL = currentValue - buyValue;
    const grossPnLPercent = ((current - entry) / entry) * 100;

    // Price Thresholds
    const stopLossPrice = entry * (1 - slPct / 100);
    const target1Price = entry * (1 + t1Pct / 100);
    const target2Price = entry * (1 + t2Pct / 100);
    const highest = Math.max(this.position.highestPrice, current, entry);
    const trailingStopPrice = highest * (1 - trailPct / 100);

    // Charges in INR (Delivery STT 0.1%, Brokerage ~0, Exchange 0.00345%, DP Charges 15.93 per sell, GST 18%)
    const sttBuy = buyValue * 0.001;
    const sttSell = currentValue * 0.001;
    const excBuy = buyValue * 0.0000345;
    const excSell = currentValue * 0.0000345;
    const dpCharges = 15.93;
    const gstAndFee = (excBuy + excSell) * 0.18 + 0.50; // SEBI + GST
    const totalCharges = sttBuy + sttSell + excBuy + excSell + dpCharges + gstAndFee;

    const netPnL = grossPnL - totalCharges;
    const netPnLPercent = (netPnL / buyValue) * 100;

    // Distance metrics
    const distanceToSLPercent = ((current - stopLossPrice) / entry) * 100;
    const distanceToTgt1Percent = ((target1Price - current) / entry) * 100;

    // Timeline Progress Calculation
    const totalSpan = target1Price - stopLossPrice;
    const currentOffset = current - stopLossPrice;
    const progressFromSLPercent = totalSpan > 0 ? Math.min(100, Math.max(0, (currentOffset / totalSpan) * 100)) : 50;
    const progressToTarget1Percent = target1Price > entry ? Math.min(100, Math.max(0, ((current - entry) / (target1Price - entry)) * 100)) : 0;

    // Risk-Reward calculation
    const potentialRisk = entry - stopLossPrice;
    const potentialReward = target1Price - entry;
    const rrVal = potentialRisk > 0 ? (potentialReward / potentialRisk).toFixed(2) : '1:1';
    const riskRewardRatio = `1:${rrVal}`;

    const rules: RuleTrigger[] = [];
    let action: AdviceResult['action'] = 'HOLD';

    // 1. HARD STOP LOSS RULE
    if (current <= stopLossPrice) {
      action = 'STOP_LOSS_EXIT';
      rules.push({
        ruleId: 'R_SL',
        title: 'Stop Loss Breached',
        description: `Current price (₹${current.toFixed(2)}) is at or below your planned stop loss (₹${stopLossPrice.toFixed(2)}).`,
        severity: 'red',
        icon: '🛑'
      });
    }

    // 2. TRAILING STOP LOSS RULE
    if (this.position.useTrailingStop && current <= trailingStopPrice && grossPnLPercent > 1.0) {
      if (action !== 'STOP_LOSS_EXIT') action = 'FULL_EXIT';
      rules.push({
        ruleId: 'R_TRAIL',
        title: 'Trailing Stop Triggered',
        description: `Price pulled back from peak ₹${highest.toFixed(2)} below your trailing stop (₹${trailingStopPrice.toFixed(2)}).`,
        severity: 'orange',
        icon: '🪂'
      });
    }

    // 3. TARGET 2 / EXTENDED PROFIT RULE
    if (current >= target2Price) {
      if (action === 'HOLD') action = 'FULL_EXIT';
      rules.push({
        ruleId: 'R_TGT2',
        title: 'Target 2 (+12%+) Reached',
        description: `Position reached extended profit target ₹${target2Price.toFixed(2)}. High probability of profit booking.`,
        severity: 'orange',
        icon: '🏆'
      });
    }
    // 4. TARGET 1 PROFIT BOOKING RULE
    else if (current >= target1Price) {
      if (action === 'HOLD') action = 'PARTIAL_EXIT';
      rules.push({
        ruleId: 'R_TGT1',
        title: 'Target 1 Reached (+5% to +8%)',
        description: `Reached initial target ₹${target1Price.toFixed(2)}. Standard rule: Book 50% profit & move SL to entry price (Breakeven).`,
        severity: 'green',
        icon: '🎯'
      });
    }

    // 5. TIME STAGNANCY RULE (Dead Money)
    if (this.position.daysHeld >= 15 && Math.abs(grossPnLPercent) < 2.0) {
      if (action === 'HOLD') action = 'TIME_EXIT';
      rules.push({
        ruleId: 'R_TIME',
        title: 'Stagnant Position (Time Stop)',
        description: `Held for ${this.position.daysHeld} trading days with minimal price movement (${grossPnLPercent > 0 ? '+' : ''}${grossPnLPercent.toFixed(2)}%). Swing momentum has faded.`,
        severity: 'yellow',
        icon: '⏳'
      });
    }

    // 6. TECHNICAL & MARKET CONTEXT RULES
    if (this.position.volume === 'Distribution (Red Spike)' && grossPnLPercent < 0) {
      rules.push({
        ruleId: 'R_VOL_RED',
        title: 'Institutional Distribution Warning',
        description: 'Heavy volume sell-off detected while position is in loss. Heightened risk of further decline.',
        severity: 'red',
        icon: '⚠️'
      });
      if (action === 'HOLD') action = 'PARTIAL_EXIT';
    }

    if (this.position.rsi === 'Overbought (>70)' && grossPnLPercent > 4.0) {
      rules.push({
        ruleId: 'R_RSI_OVER',
        title: 'RSI Overbought (>70)',
        description: 'Stock momentum is overstretched. Consider tightening trailing stop loss to protect profits.',
        severity: 'yellow',
        icon: '📈'
      });
    }

    if (this.position.trend === 'Bearish' && grossPnLPercent < -1.0) {
      rules.push({
        ruleId: 'R_TREND_BEAR',
        title: 'Broke Below 20 EMA Trend Line',
        description: 'Short-term trend structure has turned bearish. Strict adherence to stop loss is mandatory.',
        severity: 'orange',
        icon: '📉'
      });
    }

    if (this.position.upcomingEvent && grossPnLPercent < 2.0) {
      rules.push({
        ruleId: 'R_EVENT',
        title: 'Upcoming Earnings / Major Corporate Event',
        description: 'Binary event risk ahead. Reduce position size or trail stop loss very tightly.',
        severity: 'yellow',
        icon: '📅'
      });
    }

    // 7. DEFAULT HOLD CONDITIONS
    if (rules.length === 0 || (action === 'HOLD' && grossPnLPercent >= 0)) {
      if (grossPnLPercent > 3.0) {
        action = 'STRONG_HOLD';
        rules.push({
          ruleId: 'R_STRONG_HOLD',
          title: 'Strong Uptrend Momentum',
          description: 'Trade is working well (+ ' + grossPnLPercent.toFixed(2) + '%). Keep holding and let profits run toward Target 1.',
          severity: 'green',
          icon: '🚀'
        });
      } else {
        action = 'HOLD';
        rules.push({
          ruleId: 'R_HOLD_SL_SAFE',
          title: 'Normal Consolidation',
          description: `Price is within your planned risk parameters (SL @ ₹${stopLossPrice.toFixed(2)}). Avoid emotional early exit.`,
          severity: 'green',
          icon: '🟢'
        });
      }
    }

    // Build Action Badge & Guidance
    let badgeText = '🟢 HOLD POSITION';
    let badgeClass = 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/40 glow-green';
    let primaryAction = 'Keep holding position. Let the trade play out as planned.';
    let summary = 'Current position is healthy and within risk parameters.';

    switch (action) {
      case 'STOP_LOSS_EXIT':
        badgeText = '🔴 EXIT IMMEDIATELY (STOP LOSS HIT)';
        badgeClass = 'bg-rose-500/20 text-rose-700 dark:text-rose-400 border-rose-500/40 glow-red animate-pulse';
        primaryAction = `SELL ALL ${qty} SHARES AT MARKET PRICE NOW (₹${current.toFixed(2)}).`;
        summary = `Rule: Protect capital! Price fell below SL (₹${stopLossPrice.toFixed(2)}). Do NOT average down or hope.`;
        break;

      case 'FULL_EXIT':
        badgeText = '🔴 BOOK FULL PROFIT & EXIT';
        badgeClass = 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/40 glow-red';
        primaryAction = `Sell 100% position (${qty} shares) at ₹${current.toFixed(2)} to lock net ₹${netPnL.toFixed(2)} profit.`;
        summary = 'Target reached or trailing SL triggered. Capitalize on your gain and free up margin for next setup.';
        break;

      case 'PARTIAL_EXIT':
        const halfQty = Math.ceil(qty / 2);
        badgeText = '🟠 BOOK 50% PROFIT (PARTIAL EXIT)';
        badgeClass = 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40 glow-amber';
        primaryAction = `Sell ${halfQty} shares at ₹${current.toFixed(2)}. Move Stop Loss for remaining ${qty - halfQty} shares to entry price (₹${entry.toFixed(2)}).`;
        summary = 'Lock in profits on 50% shares to make this a risk-free trade while riding potential higher targets!';
        break;

      case 'TIME_EXIT':
        badgeText = '🟡 TIME EXIT (REALLOCATE CAPITAL)';
        badgeClass = 'bg-yellow-500/20 text-yellow-800 dark:text-yellow-300 border-yellow-500/40 glow-amber';
        primaryAction = `Exit position around ₹${current.toFixed(2)} and reallocate capital into fresh momentum breakout setups.`;
        summary = `Held for ${this.position.daysHeld} days with minimal progress. Opportunity cost exceeds potential reward.`;
        break;

      case 'STRONG_HOLD':
        badgeText = '🚀 STRONG HOLD (RIDE THE TREND)';
        badgeClass = 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 glow-green';
        primaryAction = `Hold position. Trail stop loss to breakeven (₹${entry.toFixed(2)}) as price advances toward ₹${target1Price.toFixed(2)}.`;
        summary = 'Uptrend structure is strong with healthy institutional support.';
        break;

      case 'HOLD':
      default:
        badgeText = '🟢 HOLD POSITION (STAY DISCIPLINED)';
        badgeClass = 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
        primaryAction = `Hold position with stop loss at ₹${stopLossPrice.toFixed(2)}. Target 1 is at ₹${target1Price.toFixed(2)}.`;
        summary = 'No exit rules triggered. Maintain trade plan without emotional intervention.';
        break;
    }

    this.adviceResult = {
      action,
      badgeText,
      badgeClass,
      primaryAction,
      summary,
      rulesTriggered: rules,
      metrics: {
        buyValue,
        currentValue,
        grossPnL,
        grossPnLPercent,
        netPnL,
        netPnLPercent,
        totalCharges,
        stt: sttBuy + sttSell,
        dpCharges,
        exchangeTxn: excBuy + excSell,
        gstAndFee,
        stopLossPrice,
        target1Price,
        target2Price,
        trailingStopPrice,
        riskRewardRatio,
        distanceToSLPercent,
        distanceToTgt1Percent,
        progressToTarget1Percent,
        progressFromSLPercent
      }
    };
  }

  // -------------------------------------------------------------
  // MINIMAL TYPING INTERACTION METHODS
  // -------------------------------------------------------------

  selectPresetScenario(preset: PresetScenario) {
    this.position = JSON.parse(JSON.stringify(preset.position));
    this.evaluatePosition();
  }

  selectQuickStock(stock: QuickStock) {
    this.position.symbol = stock.symbol;
    this.position.stockName = stock.name;
    this.position.entryPrice = stock.suggestedEntry;
    this.position.currentPrice = stock.suggestedEntry;
    this.position.highestPrice = stock.suggestedEntry;
    this.evaluatePosition();
  }

  setPriceDeltaPercent(pct: number) {
    const newPrice = this.position.entryPrice * (1 + pct / 100);
    this.position.currentPrice = Math.round(newPrice * 100) / 100;
    if (this.position.currentPrice > this.position.highestPrice) {
      this.position.highestPrice = this.position.currentPrice;
    }
    this.evaluatePosition();
  }

  setDaysHeld(days: number) {
    this.position.daysHeld = days;
    this.evaluatePosition();
  }

  adjustValue(field: keyof HoldingPosition, step: number) {
    if (typeof this.position[field] === 'number') {
      const cur = (this.position[field] as number) + step;
      (this.position[field] as any) = Math.max(0.1, Math.round(cur * 100) / 100);
      
      if (field === 'currentPrice' && this.position.currentPrice > this.position.highestPrice) {
        this.position.highestPrice = this.position.currentPrice;
      }
      this.evaluatePosition();
    }
  }

  // -------------------------------------------------------------
  // MY HOLDINGS PORTFOLIO WATCHLIST METHODS
  // -------------------------------------------------------------
  savePositionToHoldings() {
    const existingIndex = this.myHoldings.findIndex(h => h.symbol === this.position.symbol);
    const cloned = JSON.parse(JSON.stringify(this.position));
    cloned.id = Date.now().toString();

    if (existingIndex >= 0) {
      this.myHoldings[existingIndex] = cloned;
    } else {
      this.myHoldings.push(cloned);
    }
    this.persistHoldings();
  }

  removeHolding(symbol: string) {
    this.myHoldings = this.myHoldings.filter(h => h.symbol !== symbol);
    this.persistHoldings();
  }

  loadHoldingToAdvisor(holding: HoldingPosition) {
    this.position = JSON.parse(JSON.stringify(holding));
    this.evaluatePosition();
    this.activeTab = 'advisor';
  }

  getFilteredHoldings(): HoldingPosition[] {
    return this.myHoldings.filter(h => {
      const matchesSearch = !this.portfolioSearchTerm || 
        h.symbol.toLowerCase().includes(this.portfolioSearchTerm.toLowerCase()) || 
        h.stockName.toLowerCase().includes(this.portfolioSearchTerm.toLowerCase());
      
      if (!matchesSearch) return false;

      const slPrice = h.entryPrice * (1 - h.stopLossPercent / 100);
      const tgt1Price = h.entryPrice * (1 + h.target1Percent / 100);
      const needsAction = h.currentPrice <= slPrice || h.currentPrice >= tgt1Price;

      if (this.portfolioFilter === 'ACTION_REQUIRED') return needsAction;
      if (this.portfolioFilter === 'HOLDING') return !needsAction;
      return true;
    });
  }

  openAddModal() {
    this.newHolding = {
      symbol: '',
      stockName: '',
      entryPrice: 1000,
      currentPrice: 1000,
      quantity: 50,
      stopLossPercent: 2.5,
      target1Percent: 5.0,
      target2Percent: 12.0,
      highestPrice: 1000,
      trailingStopPercent: 3.0,
      useTrailingStop: true,
      daysHeld: 1,
      trend: 'Bullish',
      rsi: 'Bullish (50-65)',
      volume: 'Normal',
      niftyTrend: 'Bullish',
      upcomingEvent: false
    };
    this.isAddModalOpen = true;
  }

  saveNewHolding() {
    if (!this.newHolding.symbol) return;
    this.newHolding.symbol = this.newHolding.symbol.toUpperCase();
    if (!this.newHolding.stockName) this.newHolding.stockName = this.newHolding.symbol;
    if (!this.newHolding.highestPrice || this.newHolding.highestPrice < this.newHolding.currentPrice) {
      this.newHolding.highestPrice = Math.max(this.newHolding.entryPrice, this.newHolding.currentPrice);
    }
    const cloned = JSON.parse(JSON.stringify(this.newHolding));
    cloned.id = Date.now().toString();
    this.myHoldings.push(cloned);
    this.persistHoldings();
    this.isAddModalOpen = false;
  }

  closeAddModal() {
    this.isAddModalOpen = false;
  }

  persistHoldings() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('swing_calculator_holdings', JSON.stringify(this.myHoldings));
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  loadSavedHoldings() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem('swing_calculator_holdings');
        if (saved) {
          this.myHoldings = JSON.parse(saved);
        } else {
          // Default sample holdings for new user
          this.myHoldings = [
            {
              id: '1',
              symbol: 'RELIANCE',
              stockName: 'Reliance Industries',
              entryPrice: 2800,
              currentPrice: 2982,
              quantity: 50,
              stopLossPercent: 2.5,
              target1Percent: 5.0,
              target2Percent: 12.0,
              highestPrice: 2995,
              trailingStopPercent: 3.0,
              useTrailingStop: true,
              daysHeld: 7,
              trend: 'Bullish',
              rsi: 'Bullish (50-65)',
              volume: 'High (Institutional)',
              niftyTrend: 'Bullish',
              upcomingEvent: false
            },
            {
              id: '2',
              symbol: 'TATASTEEL',
              stockName: 'Tata Steel',
              entryPrice: 160,
              currentPrice: 155.5,
              quantity: 500,
              stopLossPercent: 2.5,
              target1Percent: 6.0,
              target2Percent: 12.0,
              highestPrice: 162,
              trailingStopPercent: 3.0,
              useTrailingStop: false,
              daysHeld: 3,
              trend: 'Bearish',
              rsi: 'Neutral',
              volume: 'Distribution (Red Spike)',
              niftyTrend: 'Correction',
              upcomingEvent: false
            }
          ];
        }
      }
    } catch (e) {
      console.warn('LocalStorage load error:', e);
    }
  }

  getPortfolioStats() {
    let totalInvested = 0;
    let totalCurrent = 0;
    let exitCount = 0;
    let holdCount = 0;

    for (const h of this.myHoldings) {
      const inv = h.entryPrice * h.quantity;
      const cur = h.currentPrice * h.quantity;
      totalInvested += inv;
      totalCurrent += cur;

      const slPrice = h.entryPrice * (1 - h.stopLossPercent / 100);
      const tgt1Price = h.entryPrice * (1 + h.target1Percent / 100);

      if (h.currentPrice <= slPrice || h.currentPrice >= tgt1Price) {
        exitCount++;
      } else {
        holdCount++;
      }
    }

    const totalPnL = totalCurrent - totalInvested;
    const totalPnDPct = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

    return {
      totalInvested,
      totalCurrent,
      totalPnL,
      totalPnDPct,
      exitCount,
      holdCount
    };
  }

  // -------------------------------------------------------------
  // TAB 2: SWING SIMULATOR LOGIC
  // -------------------------------------------------------------
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
      this.losingTrades = "N/A";
      this.finalCapital = "N/A";
      this.expectedValuePerTrade = "N/A";
    } else {
      this.totalGrossProfit = gross.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
      this.totalNetProfit = net.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
      this.totalTrades = trades.toString();
      this.winningTrades = wins.toString();
      this.losingTrades = (trades - wins).toString();
      this.finalCapital = currentCapital.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 });

      // Expected Value (EV) per trade formula: (WinRate % * ProfitTarget %) - (LossRate % * StopLoss %)
      const ev = (this.winRate / 100 * this.profitTarget) - ((100 - this.winRate) / 100 * this.stopLoss);
      this.expectedValuePerTrade = ev.toFixed(2) + '%';
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
