The document has been created.
[Technical Specs & Sprint Plan: Algorithmic Swing Trading (Zerodha Kite API)](https://docs.google.com/document/d/1c8j2vWvtTn1MSbhsuxDz6HABax01E1hht06UV7fN9_c/edit?usp=drive_web)

Below is the complete, self-contained Markdown content (`.md`) regarding **Algorithmic Swing Trading Strategy and Zerodha API Integration**. You can copy this Markdown block directly into an `.md` file on your local machine and upload it to **NotebookLM** as your central architectural and domain knowledge source.

---

```markdown
# Algorithmic Swing Trading Strategy and Zerodha API Integration
**Document Type:** Architectural Knowledge Base & Technical Specification  
**Target Platform:** BusinessHub AI (Algorithmic Swing Trading Module)  
**Market Scope:** Indian Stock Market (NSE/BSE Equity & Cash Delivery Segments, ETFs)  
**Broker Integration:** Zerodha Kite Connect API v3  
**Architecture Style:** Modular Monolith | Clean Architecture | Lightweight DDD  
**Tech Stack Baseline:** Python 3.12, FastAPI (Pydantic v2), PostgreSQL 17, Redis 8, SQLAlchemy 2.x, Angular 20+, Docker Compose

---

## 1. Executive Summary & Indian Market Domain Rules

Swing trading Indian equities and Exchange Traded Funds (ETFs) requires adaptations tailored to National Stock Exchange (NSE) and Bombay Stock Exchange (BSE) market microstructure, T+1 settlement cycles, circuit limits, and regulatory surveillance regimes.

### 1.1 Core Trading Principles
* **End-of-Day (EOD) Batch Processing:** Unlike intraday high-frequency trading, swing strategies evaluate Daily and Weekly OHLCV candles after the market close (15:30 IST). EOD data processing workflows run scheduled jobs between 15:45 and 16:30 IST to generate validated buy/sell signals for the next trading session.
* **Instrument Universe & Liquidity Protection:** The trading universe is restricted to NIFTY 100 / NIFTY 500 constituents with average daily turnover exceeding ₹10,00,000, alongside highly liquid index and cash ETFs (*NIFTYBEES, BANKBEES, CPSEETF, MON100, LIQUIDBEES*).
* **SEBI ASM/GSM Surveillance Filtering:** The Risk Service dynamically checks and excludes any instrument actively placed under SEBI's Additional Surveillance Measure (ASM) or Graded Surveillance Measure (GSM) frameworks to prevent capital lock-in.
* **Zero-Float Statutory Charge Accounting:** To maintain strict Historical Integrity, every simulated or live trade computes and stores exact Indian statutory tax snapshots using arbitrary-precision decimals (`decimal.Decimal` / `NUMERIC(18,4)`).

---

## 2. Functional Requirements Backlog (SRS-REQ-001 to SRS-REQ-008)

| REQ ID | Module | Feature Group | Functional Requirement & Acceptance Criteria | Priority |
|---|---|---|---|---|
| **SWG-REQ-001** | Data Ingestion | EOD Candle Sync | Ingest daily/weekly OHLCV candles for all NSE equity/ETF instruments daily at 15:45 IST via Kite Connect Historical API. Persist to PostgreSQL 17 with mandatory tenant scoping and publish `CANDLES_SYNCED` Redis 8 event. | Must |
| **SWG-REQ-002** | Universe Filter | Regulatory & Liquidity Screen | Filter out illiquid stocks and ASM/GSM category instruments before signal evaluation. Reject signals if 20-day ADV is < ₹10 Lakhs or symbol is on Zerodha's ban list. | Must |
| **SWG-REQ-003** | Strategy Engine | Technical Breakout Signal | Generate EOD swing signals using 20/50 EMA Crossover combined with 1.5x 20-day Volume Breakout. Produce validated `SwingSignal` entities with Entry, Stop-Loss (-3%), and Target (+9%) prices. | Must |
| **SWG-REQ-004** | Risk & Sizing | Capital Allocation & Margin Check | Restrict single-stock exposure to max 5% of tenant capital and ETF exposure to max 10%. Dynamically downsize order quantities to respect T+1 settled cash balance. | Must |
| **SWG-REQ-005** | Order Execution | AMO / Next-Day Execution | Place overnight approved signals as Zerodha After Market Orders (AMO) CNC or 09:15 IST Market-Open Limit Orders via Kite Connect API (`variety="amo"`, `product="CNC"`). | Must |
| **SWG-REQ-006** | Order Execution | GTT Bracket Management | Automatically submit a Zerodha GTT (Good Till Triggered) OCO bracket order for Stop-Loss and Target immediately after the primary entry order is filled. | Must |
| **SWG-REQ-007** | P&L Accounting | Indian Tax & Charges Audit | Snapshot exact Indian statutory charges (STT 0.1%, Stamp Duty 0.015%, Exchange Turnover, SEBI Fees, GST 18%) at trade time using `NUMERIC(18,4)` DB columns. | Must |
| **SWG-REQ-008** | Multi-Tenancy | Tenant Strategy Isolation | Enforce mandatory `tenant_id` UUID isolation across all database queries, custom strategy configurations, and Kite Connect API token stores. | Must |

---

## 3. Technical Specifications & SQLAlchemy 2.x Database Schema

All monetary fields enforce Python `decimal.Decimal` and PostgreSQL `NUMERIC(18, 4)`. Every persistent model incorporates mandatory UUID `tenant_id` indexing to ensure strict SaaS tenant isolation.

```python
# src/trading/models/swing_models.py
from datetime import datetime, timezone
from decimal import Decimal
from typing import Optional
from uuid import UUID, uuid4
import enum

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Index, Integer, Numeric, String, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from src.common.models.base import Base

class SignalDirection(str, enum.Enum):
    BUY = "BUY"
    SELL = "SELL"
    EXIT = "EXIT"

class SwingSignal(Base):
    __tablename__ = "swing_signals"

    id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid4)
    tenant_id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), nullable=False, index=True)
    instrument_id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("instruments.id"), nullable=False)
    strategy_name: Mapped[str] = mapped_column(String(50), nullable=False)
    direction: Mapped[SignalDirection] = mapped_column(Enum(SignalDirection), nullable=False)
    suggested_entry_price: Mapped[Decimal] = mapped_column(Numeric(18, 4), nullable=False)
    suggested_stop_loss: Mapped[Decimal] = mapped_column(Numeric(18, 4), nullable=False)
    suggested_target_price: Mapped[Decimal] = mapped_column(Numeric(18, 4), nullable=False)
    is_risk_approved: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    rejection_reason: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    signal_generated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        Index("ix_swing_signals_tenant_created", "tenant_id", "created_at"),
    )

class ExecutedTrade(Base):
    __tablename__ = "executed_trades"

    id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid4)
    tenant_id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), nullable=False, index=True)
    order_id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), nullable=False, index=True)
    zerodha_exchange_order_id: Mapped[str] = mapped_column(String(64), nullable=False)
    tradingsymbol: Mapped[str] = mapped_column(String(30), nullable=False)
    fill_quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    fill_price: Mapped[Decimal] = mapped_column(Numeric(18, 4), nullable=False)

    # Immutable Indian Statutory Charge Snapshots (Zero Float Calculation)
    stt_tax: Mapped[Decimal] = mapped_column(Numeric(18, 4), nullable=False)
    exchange_turnover_fee: Mapped[Decimal] = mapped_column(Numeric(18, 4), nullable=False)
    sebi_turnover_fee: Mapped[Decimal] = mapped_column(Numeric(18, 4), nullable=False)
    stamp_duty: Mapped[Decimal] = mapped_column(Numeric(18, 4), nullable=False)
    gst_tax: Mapped[Decimal] = mapped_column(Numeric(18, 4), nullable=False)
    total_transaction_charges: Mapped[Decimal] = mapped_column(Numeric(18, 4), nullable=False)

    executed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        Index("ix_executed_trades_tenant_symbol", "tenant_id", "tradingsymbol"),
    )

```

---

## 4. Zerodha Kite Connect v3 Integration Blueprint

The Kite Connect API integration adheres to Clean Architecture by abstracting raw SDK dictionaries into Pydantic v2 Domain DTOs within the infrastructure adapter layer.

### 4.1 Integration Pattern & Constraints

* **Token Bucket Rate Limiting:** Enforces an async token-bucket rate limiter that restricts order placement to a maximum of 3 requests per second per Kite API session, preventing HTTP 429 throttling errors.
* **AMO (After Market Order) Placement:** Swing orders generated post-market (after 15:45 IST) are submitted using `variety="amo"`, `product="CNC"`, and `order_type="LIMIT"` for automated routing at the 09:15 IST opening bell.
* **GTT OCO Bracket Orders:** Upon receiving a fill notification via postback webhook, the adapter invokes the GTT Trigger API (`/gtt/triggers`) to place a linked One-Cancels-Other bracket order (-3% Stop-Loss / +9% Target).

---

## 5. Production Sprint Plan & AI Tool Allocation (8-Week Roadmap)

| Sprint | Timeline | Core Focus & Deliverables | Assigned Google AI Tool |
| --- | --- | --- | --- |
| **Sprint 0** | Weeks 1–2 | Clean Architecture Scaffolding, Multi-Tenant Database Specs, Alembic Migrations, Docker Compose baseline. | **NotebookLM** (Architecture & Spec Review) + **Antigravity 2.0** (Folder Scaffolding) |
| **Sprint 1** | Weeks 3–4 | EOD Candle Sync via Kite Connect Historical API, NSE/BSE Watchlist Management, ASM/GSM Surveillance Filter Service. | **Jules** (Async API Sync & CRUD Test Suites) + **Antigravity 2.0** (Worker Integration) |
| **Sprint 2** | Weeks 5–6 | EMA Crossover / Volume Breakout Strategy Engine, SwingSignal State Machine, Backtesting Replay Service. | **VS Code + Google Coding** (Precision Numerical Math) + **Jules** (Pytest Unit Coverage) |
| **Sprint 3** | Weeks 7–8 | Zerodha AMO / CNC / GTT Execution Adapter, Risk Capital Sizing Engine, Indian Statutory Tax Calculation Store. | **Antigravity 2.0** (Multi-Agent Broker Testing) + **VS Code** (Live Webhook Debugging) |

---

## 6. Definition of Done (DoD) Quality Gates

* **Static & Type Safety:** 100% compliance with `mypy --strict`. Zero warnings on `ruff check` and `black --check`.
* **Financial Precision:** Zero floating-point types (`float`) permitted across monetary, price, quantity, or tax calculations; must use `decimal.Decimal`.
* **Indian Statutory Tax Audit:** Verified calculation and DB snapshotting of STT (0.1% CNC), Stamp Duty (0.015%), Exchange Turnover, SEBI Fees, and GST (18%) on every executed trade.
* **Multi-Tenant Isolation:** Mandatory `.where(Model.tenant_id == current_tenant_id)` verified via integration tests against PostgreSQL 17 test containers.
* **Test Coverage Minimums:** >= 85% branch coverage on Service/Domain layers; 100% coverage on Risk and Statutory Tax Calculation engines.

```

<FollowUp label="Want me to generate an initial Python script to test the Zerodha Kite Connect rate limiter?" query="Write a Python asyncio script to test and verify the 3 req/sec TokenBucket rate limiter for Zerodha Kite Connect order placement."/>

```
