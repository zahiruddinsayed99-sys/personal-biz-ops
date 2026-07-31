# Technical Specifications, Functional Specifications & Production Sprint Plan

**Platform:** BusinessHub AI — Algorithmic Swing Trading Module

**Market Scope:** Indian Stocks & ETFs (NSE/BSE — Equity & Cash Segments)

**Broker Integration:** Zerodha Kite Connect API v3

**Architecture Style:** Modular Monolith | Clean Architecture | Lightweight DDD

**Tech Stack Baseline:** Python 3.12, FastAPI (Pydantic v2), PostgreSQL 17, Redis 8, SQLAlchemy 2.x, Angular 20+, Docker Compose

---

## 1. Indian Market Domain Architecture (NSE/BSE Equity & ETF Focus)

Swing trading Indian equities and ETFs requires specific adaptations to handle National Stock Exchange (NSE) and Bombay Stock Exchange (BSE) market microstructure, settlement cycles, and regulatory constraints.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                           EXCHANGE & REGULATORY BOUNDARY                         │
│  • NSE/BSE Market Hours (09:15 to 15:30 IST)  • Circuit Limits (2%, 5%, 10%, 20%)│
│  • T+1 Equity Settlement Cycle                • ASM / GSM Regulatory Surveillance│
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │
┌────────────────────────────────────────▼─────────────────────────────────────────┐
│                       ZERODHA KITE CONNECT API v3 BOUNDARY                       │
│  • Rate Limits: Orders (3/sec), Quotes (10/sec), Historical (3/sec)              │
│  • Order Types: AMO (After Market Orders), CNC (Cash n Carry), GTT (Long-lived)  │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │
┌────────────────────────────────────────▼─────────────────────────────────────────┐
│                    BUSINESSHUB AI — SWING TRADING CORE PLATFORM                  │
│  ├── Universe Screening: NIFTY 50/500, Liquid/Equity ETFs (NIFTYBEES, MON100)  │
│  ├── Signal Timing: End-of-Day (EOD) Daily/Weekly Candle Processing (15:45 IST)  │
│  ├── Execution Engine: Next-Day AMO Placement / Market-Open Limit Orders         │
│  └── Risk & P&L Engine: Real STT, Exchange Turnover, SEBI Fees & GST Accounting  │
└──────────────────────────────────────────────────────────────────────────────────┘

```

### Key Domain Principles for India Swing Trading

1. **End-of-Day (EOD) Batch vs. Live Intraday:** Unlike high-frequency intraday trading, Indian swing trading strategies evaluate Daily/Weekly OHLCV candles after market close (15:30 IST). EOD data processing runs scheduled jobs between 15:45 and 16:30 IST to generate buy/sell signals for the next trading session.
2. **Instrument Universe & Liquidity Protection:**
* **Equities:** NIFTY 100 / NIFTY 500 constituents with average daily volume (ADV) > ₹10,00,000.
* **ETFs:** Liquid & Index ETFs (`NIFTYBEES`, `BANKBEES`, `CPSEETF`, `MON100`, `LIQUIDBEES`).
* **ASM/GSM Exclusion:** The system must reject trade signals for instruments actively placed under SEBI's Additional Surveillance Measure (ASM) or Graded Surveillance Measure (GSM).


3. **Indian Statutory Charges & P&L Calculation Engine:**
To maintain **Historical Integrity**, every simulated or live executed trade must calculate and snapshot exact statutory charges:
* **STT (Securities Transaction Tax):** 0.1% on buy and sell for Equity Delivery (CNC).
* **Exchange Turnover Fees:** NSE (~0.00297%) / BSE (~0.00375%).
* **SEBI Turnover Charges:** ₹10 per crore (0.0001%).
* **Stamp Duty:** 0.015% or ₹1500/crore on Buy side only.
* **GST:** 18% on (Brokerage + Exchange Turnover Fees + SEBI Charges).



---

## 2. Functional Specifications (SRS Backlog)

### 2.1 Order & Signal Lifecycle State Machines

#### A. Swing Signal State Machine

`DRAFT` → `VALIDATED` → `APPROVED_BY_RISK` → `ORDER_GENERATED` *(or `REJECTED_BY_RISK`, `EXPIRED` if not triggered within N days)*

#### B. Execution Order State Machine (Zerodha CNC / AMO / GTT)

`CREATED` → `PENDING_BROKER_SUBMISSION` → `OPEN_AT_EXCHANGE` → `PARTIALLY_FILLED` → `FILLED` *(or `CANCELLED`, `REJECTED_BY_EXCHANGE`, `CIRCUIT_LIMIT_HIT`)*

---

### 2.2 Functional Requirements Backlog

| REQ ID | Module | Feature Group | User Story & Functional Requirement | Mandatory Acceptance Criteria (Gherkin / Testable) | Priority |
| --- | --- | --- | --- | --- | --- |
| **SWG-REQ-001** | Data Ingestion | EOD Candle Sync | **As a Strategy Engine**, I want to ingest daily and weekly OHLCV candles for all NSE equity/ETF instruments at 15:45 IST daily via Kite Connect Historical API. | **Given** market is closed (>=15:45 IST), **When** candle sync job triggers, **Then** fetch `day` candles, validate missing bars, store in PostgreSQL 17 with `tenant_id` scoping, and publish `CANDLES_SYNCED` event to Redis 8. | Must |
| **SWG-REQ-002** | Universe Filter | Regulatory & Liquidity Screen | **As a Risk Service**, I want to filter out illiquid stocks and ASM/GSM category stocks before signal evaluation. | **Given** an instrument in NIFTY 500, **When** its 20-day average daily turnover is < ₹10 Lakhs OR is listed in Zerodha's ASM/GSM ban list, **Then** mark instrument as `INELIGIBLE_FOR_SWING` for that tenant. | Must |
| **SWG-REQ-003** | Strategy Engine | Technical Breakout Signal | **As a Trader**, I want to generate EOD swing signals using 20/50 EMA Crossover combined with 1.5x 20-day Volume Breakout. | **Given** updated daily candles, **When** EMA(20) crosses above EMA(50) AND current day volume > 1.5 * SMA(Volume, 20), **Then** generate a `BUY` SwingSignal with Entry Price = Close Price. | Must |
| **SWG-REQ-004** | Risk & Sizing | Capital Allocation & Margin Check | **As a Risk Manager**, I want to restrict single-stock exposure to max 5% of tenant equity and ETF exposure to max 10%. | **Given** a validated `BUY` signal, **When** calculating position size, **Then** ensure `(Quantity * Price) <= 0.05 * Tenant_Available_Capital`, otherwise downsize or reject the signal. | Must |
| **SWG-REQ-005** | Order Execution | AMO / Next-Day Execution | **As a Trader**, I want signals approved overnight to be placed as Zerodha After Market Orders (AMO) CNC or 09:15 IST Market-Open Limit Orders. | **Given** an approved `SwingSignal`, **When** execution mode is AMO, **Then** submit order payload to Kite Connect with `variety="amo"`, `product="CNC"`, and `order_type="LIMIT"`. | Must |
| **SWG-REQ-006** | Order Execution | GTT Bracket Management | **As a Risk Manager**, I want an automated Zerodha GTT (Good Till Triggered) OCO (One-Cancels-Other) placed for stop-loss and profit target immediately after entry order fill. | **Given** a `FILLED` entry order, **When** position is created, **Then** invoke Kite Connect GTT API to place an OCO bracket with Stop-Loss (-3%) and Target (+9%) linked to the underlying instrument. | Must |
| **SWG-REQ-007** | P&L Accounting | Indian Tax & Charges Audit | **As a Platform Auditor**, I want every trade to snapshot exact Indian statutory charges (STT, Stamp Duty, SEBI, Exchange, GST) at trade time. | **Given** an execution report from Zerodha, **When** recording `ExecutedTrade`, **Then** calculate and store individual tax fields as immutable snapshots using `decimal.Decimal` (zero floating point). | Must |
| **SWG-REQ-008** | Multi-Tenancy | Tenant Strategy Isolation | **As a Platform Architect**, I want different tenants to configure their own capital limits, universe watchlists, and strategy parameters without cross-leakage. | **Given** Tenant A and Tenant B, **When** Tenant A updates EMA parameters from 20/50 to 10/30, **Then** Tenant B's strategy execution remains strictly at 20/50 via mandatory `tenant_id` DB scoping. | Must |

---

## 3. Technical Specifications (System Blueprint)

### 3.1 SQLAlchemy 2.x Database Schema (PostgreSQL 17)

All monetary fields use `NUMERIC(18, 4)` and Python `decimal.Decimal`. Every table includes mandatory `tenant_id` UUID indexing.

```python
# src/trading/models/swing_models.py
from datetime import datetime, timezone
from decimal import Decimal
from typing import Optional
from uuid import UUID, uuid4

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    String,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from src.common.models.base import Base
import enum


class SignalDirection(str, enum.Enum):
    BUY = "BUY"
    SELL = "SELL"
    EXIT = "EXIT"


class OrderStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    PENDING = "PENDING"
    OPEN = "OPEN"
    FILLED = "FILLED"
    CANCELLED = "CANCELLED"
    REJECTED = "REJECTED"


class Instrument(Base):
    __tablename__ = "instruments"

    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid4
    )
    tenant_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), nullable=False, index=True
    )
    exchange_token: Mapped[int] = mapped_column(
        Integer, nullable=False
    )  # Zerodha instrument_token
    tradingsymbol: Mapped[str] = mapped_column(
        String(30), nullable=False
    )  # e.g., "RELIANCE", "NIFTYBEES"
    exchange: Mapped[str] = mapped_column(
        String(10), nullable=False, default="NSE"
    )  # NSE / BSE
    instrument_type: Mapped[str] = mapped_column(
        String(10), nullable=False
    )  # EQ, ETF
    is_active_for_swing: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=False
    )
    is_asm_gsm_restricted: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    __table_args__ = (
        UniqueConstraint(
            "tenant_id",
            "exchange",
            "tradingsymbol",
            name="uq_tenant_exchange_symbol",
        ),
        Index("ix_instruments_tenant_symbol", "tenant_id", "tradingsymbol"),
    )


class SwingSignal(Base):
    __tablename__ = "swing_signals"

    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid4
    )
    tenant_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), nullable=False, index=True
    )
    instrument_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("instruments.id"), nullable=False
    )
    strategy_name: Mapped[str] = mapped_column(String(50), nullable=False)
    direction: Mapped[SignalDirection] = mapped_column(
        Enum(SignalDirection), nullable=False
    )
    suggested_entry_price: Mapped[Decimal] = mapped_column(
        Numeric(18, 4), nullable=False
    )
    suggested_stop_loss: Mapped[Decimal] = mapped_column(
        Numeric(18, 4), nullable=False
    )
    suggested_target_price: Mapped[Decimal] = mapped_column(
        Numeric(18, 4), nullable=False
    )
    is_risk_approved: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False
    )
    rejection_reason: Mapped[Optional[str]] = mapped_column(
        String(255), nullable=True
    )
    signal_generated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    __table_args__ = (
        Index("ix_swing_signals_tenant_created", "tenant_id", "created_at"),
    )


class ExecutedTrade(Base):
    __tablename__ = "executed_trades"

    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid4
    )
    tenant_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), nullable=False, index=True
    )
    order_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), nullable=False, index=True
    )
    zerodha_exchange_order_id: Mapped[str] = mapped_column(
        String(64), nullable=False
    )
    tradingsymbol: Mapped[str] = mapped_column(String(30), nullable=False)
    fill_quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    fill_price: Mapped[Decimal] = mapped_column(Numeric(18, 4), nullable=False)

    # Immutable Indian Statutory Charge Snapshots (Zero Float Calculation)
    stt_tax: Mapped[Decimal] = mapped_column(Numeric(18, 4), nullable=False)
    exchange_turnover_fee: Mapped[Decimal] = mapped_column(
        Numeric(18, 4), nullable=False
    )
    sebi_turnover_fee: Mapped[Decimal] = mapped_column(
        Numeric(18, 4), nullable=False
    )
    stamp_duty: Mapped[Decimal] = mapped_column(Numeric(18, 4), nullable=False)
    gst_tax: Mapped[Decimal] = mapped_column(Numeric(18, 4), nullable=False)
    total_transaction_charges: Mapped[Decimal] = mapped_column(
        Numeric(18, 4), nullable=False
    )

    executed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    __table_args__ = (
        Index("ix_executed_trades_tenant_symbol", "tenant_id", "tradingsymbol"),
    )

```

---

### 3.2 Clean Architecture Flow: Order Placement & GTT Bracket

```
┌────────────────────────────────────────────────────────────────────────┐
│                   FASTAPI ROUTER / REDIS EVENT CONSUMER                │
│             (Triggered via EOD Approved SwingSignal Event)             │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                  TradingExecutionService (Domain Layer)                │
│  • Validates T+1 settlement balance via RiskService                    │
│  • Calculates position size & stop-loss / target intervals             │
│  • Invokes broker adapter contract                                     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│             ZerodhaKiteConnectAdapter (Infrastructure Layer)           │
│  • Enforces 3 requests/second token-bucket rate limiter                │
│  • Posts AMO Limit Order: `/orders/amo`                                │
│  • Places linked GTT OCO Bracket: `/gtt/triggers`                      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                    TradingRepository (SQLAlchemy 2.x)                  │
│  • Persists Order & GTT records scoped by `tenant_id`                  │
└────────────────────────────────────────────────────────────────────────┘

```

---

### 3.3 Redis 8 Pub/Sub & Event Stream Contracts

* **Stream Key:** `businesshub:events:trading:candles_synced`
* **Payload (JSON DTO):**
```json
{
  "event_id": "a1b2c3d4-...",
  "tenant_id": "8f9d0e1b-...",
  "exchange": "NSE",
  "candle_timeframe": "DAY",
  "instruments_processed": 500,
  "timestamp": "2026-07-31T15:45:00Z"
}

```




* **Stream Key:** `businesshub:events:trading:signal_generated`
* **Payload (JSON DTO):**
```json
{
  "signal_id": "f8a9b0c1-...",
  "tenant_id": "8f9d0e1b-...",
  "tradingsymbol": "NIFTYBEES",
  "direction": "BUY",
  "suggested_entry": "275.45",
  "suggested_stop_loss": "268.00",
  "suggested_target": "295.00",
  "strategy": "EMA20_50_VOLUME_BREAKOUT",
  "timestamp": "2026-07-31T15:46:12Z"
}

```





---

## 4. Production Development Workflow & Sprint Plan (8-Week Roadmap)

We execute in **2-Week Sprints**, mapping each functional domain to specific AI tool workflows from your SOP.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   SPRINT 0: PLATFORM BASELINE (WEEKS 1-2)              │
│  • Architecture Setup, Multi-Tenant Database Specs, Alembic Migrations │
│  • Tooling: NotebookLM (Spec Review) + Antigravity 2.0 (Scaffolding)   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                 SPRINT 1: UNIVERSE & DATA INGESTION (WEEKS 3-4)        │
│  • EOD Daily/Weekly Candle Sync, NSE/BSE Watchlist & ASM/GSM Filtering │
│  • Tooling: Jules (Async API Sync) + Antigravity 2.0 (DB Integration)  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                  SPRINT 2: SWING STRATEGY ENGINE (WEEKS 5-6)           │
│  • EMA Crossover / Breakout Engine, Signal State Machine, Backtest API │
│  • Tooling: VS Code (Hot-Path Indicator Math) + Jules (Pytest Suites)  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│               SPRINT 3: EXECUTION, GTT & INDIAN TAXES (WEEKS 7-8)      │
│  • Zerodha AMO/GTT Adapter, Risk Capital Sizing, Indian P&L Audit Store│
│  • Tooling: Antigravity 2.0 (Multi-Agent Broker Test) + VS Code        │
└────────────────────────────────────────────────────────────────────────┘

```

### Sprint 0: Platform Foundation & Core Domain Modeling (Weeks 1–2)

* **Goal:** Implement clean architecture boundaries, multi-tenant SQLAlchemy 2.x models, and baseline FastAPI/Pydantic validation.
* **Key Deliverables:**
* `Tenant` and `Instrument` schema with mandatory UUID `tenant_id` indexing.
* Base repository abstraction enforcing multi-tenant `.where(Model.tenant_id == current_tenant_id)`.
* Alembic migration pipeline and containerized PostgreSQL 17 + Redis 8 setup via Docker Compose.


* **AI Tool Assignment:**
* **NotebookLM:** Upload SOP and Zerodha Kite API docs; validate database schema and rate limit rules.
* **Google Antigravity 2.0:** Generate multi-file folder hierarchy (`src/trading/routers`, `services`, `repositories`, `models`).



### Sprint 1: Indian Market Universe & EOD Candle Ingestion (Weeks 3–4)

* **Goal:** Automate ingestion of NSE/BSE instruments and daily OHLCV candles from Zerodha Kite Connect Historical API.
* **Key Deliverables:**
* `KiteInstrumentSyncService` to load and classify equities vs ETFs (`NIFTYBEES`, `LIQUIDBEES`).
* `CandleIngestionService` for daily EOD batch processing (15:45 IST) with Redis 8 event publication.
* ASM/GSM exclusion filter service.


* **AI Tool Assignment:**
* **Jules (Async Cloud CI):** Generate boilerplate SQLAlchemy 2.x CRUD methods for candle storage and write 100% test-coverage fixtures.
* **Antigravity 2.0:** Implement the scheduled EOD cron/worker using Redis streams and verify against test containers.



### Sprint 2: EOD Swing Strategy & Breakout Signal Engine (Weeks 5–6)

* **Goal:** Build the swing signal generator and risk validation pipeline.
* **Key Deliverables:**
* Vectorized EMA(20/50) and Volume Breakout calculation engine.
* `SwingSignal` domain service and state machine (`DRAFT` -> `VALIDATED` -> `APPROVED_BY_RISK`).
* Risk Engine: Single-stock (5%) and ETF (10%) capital allocation validator.


* **AI Tool Assignment:**
* **VS Code + Google Coding:** Write and optimize numerical indicator math using `decimal.Decimal` to prevent floating-point drift.
* **NotebookLM:** Verify indicator mathematics against strategy whitepapers.



### Sprint 3: Zerodha Execution, GTT Brackets & Statutory Tax P&L (Weeks 7–8)

* **Goal:** Implement live execution adapters for Zerodha Kite Connect and Indian tax accounting.
* **Key Deliverables:**
* `ZerodhaKiteConnectAdapter` with token-bucket rate limiter (3 orders/sec).
* Automated GTT OCO (One-Cancels-Other) bracket order placement for Stop-Loss and Target.
* Indian Statutory Tax Calculator (STT, Stamp Duty, Exchange Fees, SEBI, GST) with immutable DB snapshots.


* **AI Tool Assignment:**
* **Antigravity 2.0:** Orchestrate multi-agent testing across the Trading Execution Service and simulated Kite Connect mock server.
* **VS Code:** Step-debug WebSocket stream reconnection and GTT payload formatting.



---

## 5. Updated Indian Market Definition of Done (DoD) Matrix

Every Pull Request across Sprints 0–3 must satisfy these verified quality gates before merging into `main`:

| Category | Requirement Check | Tooling / Script Verification |
| --- | --- | --- |
| **Static & Type Safety** | 100% compliance with `mypy --strict`. Zero warnings on `ruff check` and `black --check`. | Automated in GitHub Actions CI pipeline (`.github/workflows/ci.yml`). |
| **Financial Precision** | **Zero Float Rule:** No floating-point types (`float`) used anywhere in price, quantity, tax, or P&L calculations. Must use `decimal.Decimal`. | Custom AST ruff lint rule / MyPy check enforcing `Decimal` on money fields. |
| **Indian Statuary Audit** | All executed trade records must successfully compute STT (0.1% CNC), Stamp Duty (0.015%), Exchange Turnover, SEBI, and GST (18%). | Verified via automated unit tests in `tests/trading/test_statutory_taxes.py`. |
| **Multi-Tenant Scoping** | Every repository query must explicitly include `.where(Model.tenant_id == current_tenant_id)`. Zero cross-tenant data leakage. | Verified via `pytest-asyncio` integration tests running against PostgreSQL 17 testcontainers. |
| **Broker Rate Limits** | API client calls to Zerodha must pass rate-limit concurrency tests (max 3 order requests per second) without throwing HTTP 429 errors. | Simulated under load using `pytest-benchmark` and mock Kite API server. |
| **Test Coverage** | Minimum **85% branch coverage** on Domain/Service layers; **100% coverage** on statutory tax and risk calculation services. | Reported via `pytest --cov=src.trading --cov-report=term-missing`. |

---

## 6. Execution Command Checklist for Daily Development

When starting a sprint task, copy this prompt checklist into your development terminal or AI tool:

```bash
# 1. Verify Clean Working Tree & Type Baseline
ruff check . && black --check . && mypy --strict src/trading

# 2. Run Domain & Statutory Charge Unit Tests
pytest src/trading/tests/unit -v --cov=src/trading/services

# 3. Execute Multi-Tenant PostgreSQL Integration Tests (Docker Container Required)
pytest src/trading/tests/integration -v --db-tenant-isolation-check

# 4. Check Alembic Migrations for Schema Drift
alembic check && alembic upgrade head

```
