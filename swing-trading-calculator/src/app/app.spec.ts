import '@angular/compiler';
import { describe, it, expect, beforeEach } from 'vitest';
import { App } from './app';

describe('App Component Unit Tests', () => {
  let app: App;

  beforeEach(() => {
    app = new App();
    app.ngOnInit();
  });

  it('should create the app instance', () => {
    expect(app).toBeTruthy();
  });

  it('should advise STOP LOSS EXIT when price is below SL price', () => {
    app.position.entryPrice = 100;
    app.position.currentPrice = 96; // -4% drop
    app.position.stopLossPercent = 2.5; // SL at 97.5
    app.evaluatePosition();

    expect(app.adviceResult.action).toBe('STOP_LOSS_EXIT');
    expect(app.adviceResult.badgeText).toContain('EXIT IMMEDIATELY');
    expect(app.adviceResult.rulesTriggered.some(r => r.ruleId === 'R_SL')).toBe(true);
  });

  it('should advise PARTIAL EXIT when Target 1 is reached', () => {
    app.position.entryPrice = 100;
    app.position.currentPrice = 106; // +6% gain
    app.position.highestPrice = 106;
    app.position.target1Percent = 5.0; // T1 at 105
    app.position.target2Percent = 12.0; // T2 at 112
    app.position.useTrailingStop = false;
    app.evaluatePosition();

    expect(app.adviceResult.action).toBe('PARTIAL_EXIT');
    expect(app.adviceResult.badgeText).toContain('PARTIAL EXIT');
    expect(app.adviceResult.rulesTriggered.some(r => r.ruleId === 'R_TGT1')).toBe(true);
  });

  it('should advise TIME EXIT for stagnant positions held >= 15 days', () => {
    app.position.entryPrice = 100;
    app.position.currentPrice = 100.5; // +0.5% move
    app.position.daysHeld = 18;
    app.evaluatePosition();

    expect(app.adviceResult.action).toBe('TIME_EXIT');
    expect(app.adviceResult.badgeText).toContain('TIME EXIT');
    expect(app.adviceResult.rulesTriggered.some(r => r.ruleId === 'R_TIME')).toBe(true);
  });

  it('should calculate Indian brokerage and STT charges correctly', () => {
    app.position.entryPrice = 1000;
    app.position.currentPrice = 1100; // +10% gain
    app.position.quantity = 100; // 1,00,000 buy value
    app.evaluatePosition();

    const metrics = app.adviceResult.metrics;
    expect(metrics.buyValue).toBe(100000);
    expect(metrics.currentValue).toBe(110000);
    expect(metrics.grossPnL).toBe(10000);
    expect(metrics.stt).toBeCloseTo(210, 1); // STT 0.1% buy + 0.1% sell = 100 + 110 = 210
    expect(metrics.dpCharges).toBe(15.93);
    expect(metrics.netPnL).toBeLessThan(10000);
  });

  it('should toggle light and dark mode state', () => {
    expect(app.isDarkMode).toBe(true);
    app.toggleDarkMode();
    expect(app.isDarkMode).toBe(false);
    app.toggleDarkMode();
    expect(app.isDarkMode).toBe(true);
  });

  it('should filter portfolio holdings by search term and status', () => {
    app.myHoldings = [
      {
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
        symbol: 'TATASTEEL',
        stockName: 'Tata Steel',
        entryPrice: 160,
        currentPrice: 155, // SL Hit
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

    app.portfolioSearchTerm = 'tata';
    expect(app.getFilteredHoldings().length).toBe(1);
    expect(app.getFilteredHoldings()[0].symbol).toBe('TATASTEEL');

    app.portfolioSearchTerm = '';
    app.portfolioFilter = 'ACTION_REQUIRED';
    // TATASTEEL hit SL (155 <= 156) and RELIANCE hit T1 (2982 >= 2940)
    expect(app.getFilteredHoldings().length).toBe(2);

    app.portfolioFilter = 'ALL';
    expect(app.getFilteredHoldings().length).toBe(2);
  });

  it('should add a new position via modal', () => {
    const initialCount = app.myHoldings.length;
    app.openAddModal();
    expect(app.isAddModalOpen).toBe(true);

    app.newHolding.symbol = 'wipro';
    app.newHolding.stockName = 'Wipro Ltd';
    app.newHolding.entryPrice = 500;
    app.newHolding.currentPrice = 520;
    app.saveNewHolding();

    expect(app.myHoldings.length).toBe(initialCount + 1);
    expect(app.myHoldings[app.myHoldings.length - 1].symbol).toBe('WIPRO');
    expect(app.isAddModalOpen).toBe(false);
  });
});
