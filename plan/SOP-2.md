# Google AI Agent & IDE Operations Playbook: Algorithmic Swing Trading Platform

**System Architecture & Agent Controller:** Principal Architect

**Domain Target:** Algo Swing Trading Platform (Zerodha Kite Connect integration, Tick/Candle ingestion, Multi-strategy engine, Automated execution)

**Agentic & Editor Tooling Stack:** Google Antigravity 2.0 (Manager, CLI, IDE/SDK), Jules (Asynchronous Cloud VM Coding Agent), VS Code (Synchronous Local Engineering via Google Coding features), NotebookLM (Architectural Knowledge Base & Documentation Context)

---

## Section 1: The Google AI Agent Tooling Allocation & Strategy Matrix

To prevent context collisions and ensure predictable output across a high-concurrency trading system, assign every engineering task to a specific tool based on its runtime execution model.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        NOTEBOOKLM ARCHITECT                            │
│  (Central Source of Truth: Zerodha Docs, Strategy Math, Architecture)  │
└───────────┬────────────────────────────────────────────────┬───────────┘
            │                                                │
┌───────────▼────────────────────────────────────┐ ┌─────────▼───────────┐
│              GOOGLE ANTIGRAVITY 2.0            │ │        JULES        │
│    (Local Cross-Surface & Multi-Agent Work)    │ │ (Async Cloud CI/PR) │
├────────────────────────────────────────────────┤ ├─────────────────────┤
│ • Multi-Agent Orchestration (Broker vs Engine) │ │ • CI Bug Fixes      │
│ • Local Terminal Execution & Backtest Play     │ │ • Coverage Upgrades │
│ • Cross-Folder Clean Architecture Refactoring  │ │ • Docs & Typing PRs │
└───────────────────────────┬────────────────────┘ └─────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────────────────────┐
│                             VS CODE LOCAL                              │
│       (Synchronous Precision Engineering, Hot-Path Debugging)          │
└────────────────────────────────────────────────────────────────────────┘

```

| Tool & Version | Primary Responsibility & Allocation Scope | When to Assign (Trigger Condition) | Explicit Exclusion (When NOT to Use) |
| --- | --- | --- | --- |
| **Google Antigravity 2.0**<br>

<br>*(Manager, CLI & IDE)* | • Multi-folder feature development across Clean Architecture layers.<br>

<br>• Parallel subagent orchestration (e.g., Backtest engine + Broker adapter).<br>

<br>• Local terminal execution of `pytest`, `alembic`, and backtest runners. | When a task spans >2 files, requires shell commands, local database access, or end-to-end strategy verification. | **Do NOT use** for minor single-line syntax edits or routine dependency updates without structural changes. |
| **Jules**<br>

<br>*(Async Cloud Agent)* | • Asynchronous PR generation via secure Google Cloud VM.<br>

<br>• Background bug fixing, CI/CD pipeline repairs, and test coverage upgrades.<br>

<br>• Boilerplate CRUD API generation and typing remediation. | When you want to assign a task and disconnect while it clones the GitHub repo, executes tests, and opens a Pull Request. | **Do NOT use** for tasks needing local Redis/Postgres access, live Zerodha broker credentials, or real-time IDE interaction. |
| **VS Code + Google Coding**<br>

<br>*(Synchronous IDE)* | • Precision engineering on hot-path algorithms (e.g., indicator math, order matching).<br>

<br>• Live breakpoint debugging of WebSocket tick processors.<br>

<br>• Instant inline code completion and interactive chat refactoring. | When debugging race conditions, writing latency-critical logic, or inspecting active memory profiles. | **Do NOT use** for multi-hour autonomous refactors or background test generation across 20+ files. |
| **NotebookLM**<br>

<br>*(Principal Architect)* | • Central knowledge repository for domain math, broker rules, and technical specs.<br>

<br>• Architecture validation and documentation generation.<br>

<br>• Architectural decision records (ADRs) and design reviews. | When verifying Zerodha Kite Connect API rate limits, indicator formulas, or compliance rules before coding. | **Do NOT use** for generating executable production code or directly editing local repository files. |

---

## Section 2: Step-by-Step Tool Utilization Guide (Trading Domain Specific)

### 1. Google Antigravity 2.0 — Orchestrating Full-Stack Trading Workflows

Antigravity 2.0 operates as an agentic command center that interacts with your filesystem, terminal, and browser.

```
[Antigravity 2.0 Manager Surface]
   ├── Subagent 1: Strategy Layer (Validates MACD/RSI math in Python)
   ├── Subagent 2: Broker Adapter (Scaffolds Kite Connect OAuth flow)
   └── Subagent 3: Test Runner (Executes Pytest against Postgres container)

```

#### Step-by-Step Workflow:

1. **Launch Project Workspace:** Open Antigravity 2.0 and point it to the root of your multi-tenant workspace (`/businesshub-ai/`).
2. **Configure Scoped Permissions:** Grant Antigravity read/write access to `src/trading/` and execution permissions for `pytest` and `alembic`, while restricting access to `.env` or production credentials.
3. **Spawn Dynamic Subagents:**
* In the **Manager Surface**, assign a composite task: *"Implement the Zerodha Kite Connect WebSocket Tick Consumer and persist ticks to Postgres tables using SQLAlchemy 2.x async session."*
* Antigravity will automatically instantiate parallel subagents: one for the Pydantic v2 schema validation, one for the repository data access layer, and one to run the test suite.


4. **Use Antigravity CLI for Headless Backtesting:**
* Open your terminal and invoke `antigravity run "Execute backtest for SwingStrategy_V1 across NIFTY50 historical candles for 2025 and generate a Markdown performance report."`


5. **Verify Deliverables via Artifacts:** Review the output artifacts (test coverage logs, latency profiles, and backtest equity curves) directly within the Antigravity command center before merging.

---

### 2. Jules — Offloading Asynchronous PR Tasks

Jules runs in an isolated Google Cloud VM, cloning your repository to solve bounded tasks autonomously.

```
[Developer assigns Task via Jules Web/GitHub]
       │
       ▼
[Jules Cloud VM: Clones Repo -> Reads AGENTS.md -> Runs Pytest]
       │
       ▼
[Jules Opens GitHub Pull Request -> Developer Reviews & Merges]

```

#### Step-by-Step Workflow:

1. **Configure Repository Knowledge (`AGENTS.md`):** Place an `AGENTS.md` file in your repository root so Jules understands your architecture and coding rules:
```markdown
# AGENTS.md - Trading Platform Instructions
- Stack: Python 3.12, FastAPI, Pydantic v2, SQLAlchemy 2.x Async.
- Domain Rules: Never use floating-point types for currency or prices; always use `decimal.Decimal`.
- Testing: Run `pytest src/trading/tests -v` before finalizing changes.

```


2. **Assign Async Tasks via Web or CLI (`Jules Tools`):**
* Submit a clear, bounded prompt in the Jules interface: *"Add Pytest unit tests for the Risk Management Service (`src/trading/services/risk_service.py`). Ensure 100% branch coverage for maximum drawdown and margin-shortage rejection rules."*


3. **Review Plan & Approve PR:**
* Jules will generate an execution plan. Once approved, it clones the repo in its Cloud VM, writes the tests, executes `pytest`, and opens a clean GitHub PR.


4. **Leverage Environment Snapshots:** Save your project’s dependency setup as a reusable Environment Snapshot in Jules so subsequent tasks execute instantly without reinstalling heavy quantitative libraries.

---

### 3. VS Code + Google Coding — Precision Debugging & Latency Engineering

Use VS Code for synchronous tasks where human intuition and real-time step debugging are critical.

```
[VS Code Editor] <─── WebSocket Stream (Live Ticks)
   ├── Step Breakpoint in Strategy Engine
   ├── Google Coding Inline Assist (Refactor to O(1) buffer)
   └── Immediate Local Memory & Performance Profile

```

#### Step-by-Step Workflow:

1. **Interactive Hot-Path Refactoring:**
* Highlight the live indicator calculation loop in `src/trading/services/indicators.py`.
* Use Google Coding inline prompt (`Cmd+I` / `Ctrl+I`): *"Optimize this moving average crossover loop to use numpy vectorized operations instead of iterative Python loops to reduce execution latency below 2ms."*


2. **Live Broker Integration Debugging:**
* Run the FastAPI server locally in debug mode against the Zerodha sandbox API.
* Set breakpoints inside the WebSocket payload parser (`src/trading/routers/kite_stream.py`) to inspect tick packet unpacking and detect data-race conditions in real time.



---

### 4. NotebookLM — The Principal Architect Knowledge Base

NotebookLM serves as your offline architectural brain and compliance validator.

```
[NotebookLM Workspace: "Algo Trading Architecture & Specs"]
   ├── Source 1: Zerodha Kite Connect API Official Documentation (PDF/URL)
   ├── Source 2: Clean Architecture & DDD Blueprint Specs (SOP Document)
   ├── Source 3: SEBI / Broker Algorithmic Trading Compliance Guidelines
   └── Query: "Validate if OrderService design violates rate limits."

```

#### Step-by-Step Workflow:

1. **Ingest Core Documentation Sources:**
* Upload the official **Zerodha Kite Connect API Documentation**, your **BusinessHub AI SOP**, and your strategy mathematical whitepapers into a dedicated NotebookLM workspace.


2. **Architectural Querying & Verification:**
* Ask NotebookLM: *"Based on the Zerodha API rate limits (3 requests/second for orders) and our SOP's Clean Architecture blueprint, design an asynchronous Redis-backed order queue that prevents API throttling during market-open volatility."*


3. **Generate Engineering Specs:**
* Instruct NotebookLM to generate the exact OpenAPI markdown specification or Pydantic v2 DTO structure required for the new feature, then paste that output directly into your Antigravity or Jules prompt.



---

## Section 3: The Universal AI Implementation Prompt (Copy-Paste Ready)

Use this standardized prompt when instructing **Antigravity 2.0** or **Jules** to build any trading feature.

```markdown
### TASK
Implement the [MODULE_NAME] -> [FEATURE_NAME] feature (e.g., TradingEngine -> MovingAverageCrossoverStrategy) adhering strictly to Clean Architecture and Domain-Driven Design (DDD).

### CONTEXT & PLATFORM BASELINE
- System: Algo Swing Trading Platform (Integrated with Zerodha Kite Connect API).
- Architecture: Modular Monolith (Routers -> Services -> Repositories -> Models).
- Backend Stack: Python 3.12, FastAPI, Pydantic v2, SQLAlchemy 2.x (AsyncSession), PostgreSQL 17, Redis 8.
- Multi-Tenancy: Mandatory UUID `tenant_id` filtering on all persistent repository queries.

### NON-NEGOTIABLE PRINCIPLES
1. **No Floating-Point Prices:** All monetary values, stock prices, and order quantities must use `decimal.Decimal` (Python) and `NUMERIC(18, 4)` (PostgreSQL).
2. **Strict Type Safety:** Must pass `mypy --strict`. No `Any` typing is permitted.
3. **SQLAlchemy 2.x Async:** Exclusively use async `select()`, `update()`, and `delete()` statements via `AsyncSession`.
4. **Historical Immutability:** Executed trade records and order snapshots must never be modified once committed.

### TECHNICAL REQUIREMENTS
1. **Database Schema (`src/trading/models/[file].py`):**
   - Create SQLAlchemy 2.x model `[TABLE_NAME]` with UUID primary key, `tenant_id` index, `created_at`, `updated_at`, and domain fields: [SPECIFY FIELDS, e.g., symbol, order_type, trigger_price, decimal_quantity].
2. **Repository Layer (`src/trading/repositories/[file].py`):**
   - Implement async methods: `create_order`, `get_open_orders_by_tenant`, `update_order_status`.
   - Ensure every query appends `.where(Model.tenant_id == current_tenant_id)`.
3. **Service Layer (`src/trading/services/[file].py`):**
   - Implement domain logic: [SPECIFY BUSINESS RULE, e.g., "Verify sufficient margin balance before releasing order payload to Zerodha Kite Connect adapter"].
   - Emit a Redis Pub/Sub event `ORDER_CREATED` upon successful transaction commit.
4. **Router Layer (`src/trading/routers/[file].py`):**
   - Create REST endpoint `POST /api/v1/trading/orders` using Pydantic v2 schemas for request validation and response serialization (`ConfigDict(from_attributes=True)`).

### VERIFICATION & QA EXPECTATIONS
- Write a standalone `pytest-asyncio` test suite covering:
  1. Success path: Order creation and calculation accuracy.
  2. Edge case: Negative margin or invalid price tick rejection.
- Ensure all code compiles cleanly against `ruff check` and `black --check`.

```

---

## Section 4: Standard Operating Procedure (SOP) Google Doc Template

Copy and paste the markdown below directly into a Google Document (`BusinessHub_AI_Trading_SOP.gdoc`). Use the checkbox format (`[ ]`) to track execution across every module.

```markdown
# [SOP] Feature Engineering & Execution Tracker: Algo Swing Trading Platform

**Feature Name:** ___________________________   **Target Release:** _________
**Assigned AI Tool:** [ ] Antigravity 2.0   [ ] Jules   [ ] VS Code   [ ] NotebookLM

---

### PHASE 1: Architectural Blueprint & Compliance (NotebookLM)
- [ ] 1.1 Ingest target strategy rules and Zerodha Kite Connect API endpoints into NotebookLM.
- [ ] 1.2 Verify API rate limits and regulatory constraints (e.g., order frequency, bracket order rules).
- [ ] 1.3 Draft the Clean Architecture data flow (Router -> Service -> Repository -> Model).
- [ ] 1.4 Review and sign off on database schema changes and historical snapshot fields.

### PHASE 2: Context Preparation & Prompt Engineering
- [ ] 2.1 Copy the Universal AI Implementation Prompt template.
- [ ] 2.2 Populate specific domain columns, Pydantic DTO rules, and decimal precision limits.
- [ ] 2.3 Verify `AGENTS.md` is updated in the repo root with the latest architectural guidelines.

### PHASE 3: AI Tool Execution
#### Option A: Deep Architecture / Multi-File Feature (Google Antigravity 2.0)
- [ ] 3.A1 Open project workspace in Antigravity 2.0 Manager and set scoped permissions.
- [ ] 3.A2 Assign the prompt to spawn dynamic subagents for Domain, DB, and Test layers.
- [ ] 3.A3 Run local backtest or integration test suites via Antigravity CLI.
- [ ] 3.A4 Review verification artifacts (test logs, diffs) within the Manager surface.

#### Option B: Async Bug Fix / Refactoring / Unit Test Generation (Jules)
- [ ] 3.B1 Select repository and target branch in the Jules web dashboard or CLI.
- [ ] 3.B2 Paste the structured prompt into Jules and request an execution plan.
- [ ] 3.B3 Review and approve the generated step-by-step plan.
- [ ] 3.B4 Inspect the automated GitHub Pull Request, verify CI/CD checks, and merge.

#### Option C: High-Precision Algorithm & Latency Engineering (VS Code + Google Coding)
- [ ] 3.C1 Implement hot-path calculations (e.g., live WebSocket tick processing) in VS Code.
- [ ] 3.C2 Use Google Coding inline prompt to optimize loops and memory allocations.
- [ ] 3.C3 Execute local step-debugging against live/sandbox broker streaming endpoints.

### PHASE 4: Mandatory Definition of Done (DoD) Quality Gate
- [ ] 4.1 **Static Analysis:** `ruff check .` and `black --check .` pass with zero violations.
- [ ] 4.2 **Type Checking:** `mypy --strict .` passes with zero unannotated or `Any` types.
- [ ] 4.3 **Unit Coverage:** `pytest` achieves >= 85% coverage on Service/Domain layers.
- [ ] 4.4 **Integration QA:** Repository layer verified against PostgreSQL test container.
- [ ] 4.5 **Multi-Tenant Audit:** Verified that no database query can leak data across `tenant_id`.

```

---

## Section 5: Trading Domain Reference — Zerodha Kite Connect Integration Pattern

When prompting Antigravity or VS Code to implement Zerodha Kite Connect communications, enforce this standardized Clean Architecture boundary:

```
┌────────────────────────────────────────────────────────┐
│               TradingService (Domain Layer)            │
│  • Calculates Swing Signals   • Enforces Risk Limits   │
└───────────────────────────┬────────────────────────────┘
                            │
                            │ 1. Orders / Signals (Internal Domain Model)
                            ▼
┌────────────────────────────────────────────────────────┐
│            BrokerAdapterInterface (Abstract Base)      │
│  • place_order()   • fetch_positions()   • subscribe() │
└───────────────────────────┬────────────────────────────┘
                            │
                            │ 2. Implementation
                            ▼
┌────────────────────────────────────────────────────────┐
│                 ZerodhaKiteConnectAdapter              │
│  • Handles OAuth / API Tokens                          │
│  • Translates Domain DTOs to Kite API Payloads         │
│  • Manages 3 Req/Sec Throttling & Reconnection Logic   │
└────────────────────────────────────────────────────────┘

```

### Critical Implementation Rules for Your Prompts:

* **Never leak Kite SDK types into Service Layers:** The `ZerodhaKiteConnectAdapter` must convert raw Kite dictionary responses into internal Pydantic v2 Domain Models before returning them to `TradingService`.
* **Throttling & Retry Resiliency:** Instruct Antigravity to wrap API HTTP calls in an asynchronous rate-limiter with exponential backoff to handle network drops without crashing the trading engine.
* **WebSocket Isolation:** Live market data streams from `KiteTicker` must run in an isolated `asyncio` background task, pushing normalized `TickEvent` objects into a Redis Stream or `asyncio.Queue` for non-blocking consumption by your strategy evaluators.
