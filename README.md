# MetricMind

> Governed business intelligence with natural-language analytics, explainable metrics, and executive decision intelligence.

MetricMind is a governed analytics platform that lets business users ask questions about corporate sales data in natural language and receive verified, traceable answers backed by a controlled warehouse and semantic layer.

Instead of treating an LLM as the source of truth, MetricMind separates **understanding** from **calculation**:

```text
Natural-language question
        ↓
Intent detection
        ↓
Semantic metric resolution
        ↓
Governance validation
        ↓
Controlled warehouse query
        ↓
Verified result
        ↓
Evidence + query transparency
        ↓
Visualization / executive insight
````

The system is designed around one core principle:

> **The model can interpret the question, but the warehouse calculates the answer.**

---

## 1. What MetricMind Does

MetricMind provides a single analytical workspace for exploring business performance across:

* Revenue
* Profit
* Profit Margin
* Orders
* Material Cost
* Shipping Cost
* Marketing Cost
* Region
* Year
* Quarter
* Month

Users can ask questions such as:

```text
What was Europe revenue in Q3 2025?

What was Europe profit margin in Q3 2025?

How many orders did Europe have in Q3 2025?

Show Europe revenue by quarter in 2025.

Show revenue by region in 2025 for Q3.

Why did Europe's margin decline?
```

MetricMind resolves the question, applies the appropriate analytical context, executes a governed warehouse calculation, and presents the result with supporting evidence.

---

# 2. Core Architecture

```text
                         ┌─────────────────────────┐
                         │       User Question     │
                         │  "What was Europe       │
                         │   revenue in Q3 2025?"  │
                         └────────────┬────────────┘
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │     Intent Engine       │
                         │ metric + dimensions +   │
                         │ filters + visualization │
                         └────────────┬────────────┘
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │    Semantic Layer       │
                         │ certified metrics and   │
                         │ business definitions    │
                         └────────────┬────────────┘
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │    Agent Governance     │
                         │ approved metrics        │
                         │ approved dimensions     │
                         │ query limits            │
                         │ parameterized filters   │
                         └────────────┬────────────┘
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │     SQLite Warehouse    │
                         │  corporate_sales_raw    │
                         └────────────┬────────────┘
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │    Verified Response    │
                         │ value + evidence +      │
                         │ governance + trace      │
                         └────────────┬────────────┘
                                      │
                         ┌────────────┴────────────┐
                         ▼                         ▼
                ┌─────────────────┐      ┌─────────────────┐
                │   Analytics UI  │      │ Visualization / │
                │   Next.js       │      │ Intelligence    │
                └─────────────────┘      └─────────────────┘
```

---

# 3. Architecture Layers

## Data Layer

The project includes a reproducible data pipeline:

```text
data/raw/
    ↓
data/processed/
    ↓
warehouse/metricmind.db
```

The primary governed warehouse table is:

```text
corporate_sales_raw
```

The dataset contains business dimensions and measures including:

* order ID
* order date
* year
* quarter
* month
* region
* country
* product category
* product
* customer segment
* revenue
* material cost
* shipping cost
* marketing cost
* total cost
* profit
* margin
* orders

The current warehouse contains:

```text
2,000 records
```

---

## Semantic Layer

MetricMind maintains certified metric definitions separately from application logic.

Key files:

```text
semantic_layer/
├── dimensions.json
├── metrics.json
└── semantic_layer.py
```

The semantic layer defines:

* business metric names
* descriptions
* source fields
* formulas
* supported dimensions
* output formats

Examples:

```text
Revenue
Profit
Profit Margin
Orders
Material Cost
Shipping Cost
Marketing Cost
```

This provides a consistent business vocabulary between the user interface, Agent, and warehouse.

---

# 4. Governed Agent

The main analytical Agent is implemented in:

```text
backend/agent.py
```

The Agent follows a controlled execution pipeline:

```text
Question
   ↓
Intent parsing
   ↓
Metric validation
   ↓
Dimension validation
   ↓
Filter construction
   ↓
Governance validation
   ↓
Parameterized SQL
   ↓
Warehouse execution
   ↓
Verified response
```

The Agent does not freely generate arbitrary database operations.

Instead, it works with an approved analytical vocabulary.

### Governance controls

Metric validation ensures that only certified MetricMind metrics can be executed.

Dimension validation limits analytical breakdowns to approved dimensions such as:

```text
region
quarter
month
```

Queries use parameterized filters rather than directly interpolating user values.

The Agent also applies execution safeguards including:

```text
Maximum result rows:       100
Maximum visualization points: 24
Query timeout:             5 seconds
```

---

# 5. Query Transparency

MetricMind does not hide how a verified answer was calculated.

The analytics interface exposes query transparency information including:

* generated SQL
* query parameters
* API request
* source information
* governance status

This makes the system easier to audit and demonstrate.

The user can therefore move from:

```text
"What is the answer?"
```

to:

```text
"Where did this answer come from?"
```

without leaving the analytical workflow.

---

# 6. Governed Analytics APIs

The FastAPI backend is implemented in:

```text
backend/main.py
```

Important endpoints include:

```text
GET /api/health

GET /api/semantic/metrics
GET /api/semantic/parse

GET /api/agent/analyze

GET /api/analytics/kpis
GET /api/analytics/regional-revenue
GET /api/analytics/regional-performance
GET /api/analytics/monthly-performance
GET /api/analytics/cost-drivers
GET /api/analytics/margin-root-cause
GET /api/analytics/insights
```

The analytics endpoints use the governed warehouse aggregation model.

---

# 7. Executive Intelligence

MetricMind goes beyond displaying KPIs.

The Executive Intelligence layer identifies deterministic business signals from warehouse data.

Example signals include:

### Margin decline

```text
Europe margin:
Q2 2025 → 33.75%
Q3 2025 → 30.24%

Change:
-3.51 percentage points
```

### Cost pressure

Shipping cost increased from:

```text
7.51% of revenue
```

to:

```text
11.63% of revenue
```

representing:

```text
+4.11 percentage points
```

### Revenue growth

Europe revenue increased quarter over quarter.

### Profit growth

Profit also increased, although margin declined because cost pressure increased faster than profitability.

### Volume expansion

Recorded orders increased alongside revenue.

These signals are deterministic calculations from the warehouse rather than free-form LLM claims.

---

# 8. Margin Root-Cause Analysis

MetricMind includes a dedicated margin intelligence endpoint:

```text
/api/analytics/margin-root-cause
```

The analysis compares the current quarter with the immediately preceding quarter.

It evaluates:

* previous margin
* current margin
* margin change
* revenue change
* profit change
* material cost rate
* shipping cost rate
* marketing cost rate

Drivers are ranked according to their movement as a percentage of revenue.

For Europe Q3 2025, the system identified:

```text
Top driver:
Shipping Cost

Rate movement:
+4.11 percentage points
```

while material cost rate decreased.

This turns a simple KPI:

```text
Margin = 30.24%
```

into a business explanation:

```text
Margin declined primarily because shipping cost
represented a materially larger share of revenue.
```

---

# 9. Dynamic Visualization

The Agent can determine when a question requests a breakdown.

Examples:

```text
Show Europe revenue by quarter in 2025.
```

produces a quarterly visualization.

```text
Show Europe revenue by month in 2025.
```

produces a monthly visualization.

```text
Show revenue by region in 2025 for Q3.
```

produces a regional visualization.

Visualization output is also governed by a maximum point limit to prevent uncontrolled result expansion.

---

# 10. Context-Aware Follow-Up Questions

MetricMind supports conversational analytical context.

Dashboard selections can provide context for follow-up questions.

For example:

```text
Dashboard context:
Region = Europe
Year = 2025
Quarter = Q3
```

Then:

```text
What was revenue?
```

can inherit the relevant analytical context.

At the same time, explicit analytical requests such as:

```text
Show revenue by region.
```

are treated as breakdown requests rather than incorrectly inheriting the selected region as a filter.

This allows the interface to behave more like an analytical copilot than a collection of disconnected API calls.

---

# 11. Frontend

The frontend is built with:

```text
Next.js
React
```

Main application areas include:

```text
frontend/src/app/
├── page.js
├── analytics/
│   └── page.js
├── globals.css
└── layout.js
```

Supporting API and analytical logic lives under:

```text
frontend/src/lib/
```

The analytics experience includes:

* KPI cards
* filters
* regional analysis
* monthly performance
* cost drivers
* margin intelligence
* Executive Intelligence
* Ask MetricMind
* verified answer states
* query transparency
* dynamic visualizations
* conversational follow-up context
* recent analytical history

---

# 12. Data Pipeline

The project includes scripts for generating, transforming, and loading the dataset.

```text
data/
├── generate_dataset.py
├── transform_data.py
├── load_to_warehouse.py
├── raw/
└── processed/
```

The SQL layer contains schema and warehouse definitions:

```text
sql/
├── create_schema.sql
├── create_raw_tables.sql
└── create_analytics_views.sql
```

The pipeline is designed to make the analytical environment reproducible rather than relying on manually created dashboard values.

---

# 13. Project Structure

```text
MetricMind/
│
├── backend/
│   ├── agent.py
│   ├── intent_engine.py
│   ├── main.py
│   ├── semantic_layer.py
│   └── requirements.txt
│
├── data/
│   ├── generate_dataset.py
│   ├── transform_data.py
│   ├── load_to_warehouse.py
│   ├── raw/
│   └── processed/
│
├── docs/
│   └── data_dictionary.md
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   └── lib/
│   ├── public/
│   ├── package.json
│   └── next.config.*
│
├── semantic_layer/
│   ├── dimensions.json
│   ├── metrics.json
│   └── semantic_layer.py
│
├── sql/
│   ├── create_schema.sql
│   ├── create_raw_tables.sql
│   └── create_analytics_views.sql
│
├── screenshots/
│
├── .gitignore
└── README.md
```

---

# 14. Running MetricMind

## Backend

From the project root:

```powershell
cd C:\Users\suvasini\Desktop\MetricMind

uvicorn backend.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Health check:

```powershell
Invoke-RestMethod "http://127.0.0.1:8000/api/health"
```

Expected result:

```text
status: healthy
warehouse: connected
records: 2000
```

---

## Frontend

Open a second PowerShell terminal:

```powershell
cd C:\Users\suvasini\Desktop\MetricMind\frontend

npm install
npm run dev
```

Frontend:

```text
http://localhost:3000
```

---

# 15. Example API Queries

### KPI query

```powershell
Invoke-RestMethod `
  "http://127.0.0.1:8000/api/analytics/kpis?region=Europe&year=2025&quarter=Q3"
```

Expected governed KPI result:

```text
Revenue:        1,839,323.15
Profit:           556,232.82
Margin:               30.24%
Orders:               1,420
```

### Agent query

```powershell
Invoke-RestMethod `
  "http://127.0.0.1:8000/api/agent/analyze?question=What%20was%20Europe%20revenue%20in%20Q3%202025%3F"
```

### Regional breakdown

```powershell
Invoke-RestMethod `
  "http://127.0.0.1:8000/api/agent/analyze?question=Show%20Europe%20revenue%20by%20quarter%20in%202025"
```

---

# 16. Validation and Testing

MetricMind has been tested against the core analytical workflow.

Verified metrics include:

| Metric         | Europe Q3 2025 |
| -------------- | -------------: |
| Revenue        |  $1,839,323.15 |
| Profit         |    $556,232.82 |
| Profit Margin  |         30.24% |
| Orders         |          1,420 |
| Material Cost  |    $965,622.36 |
| Shipping Cost  |    $213,835.34 |
| Marketing Cost |    $103,632.56 |

The Agent was also tested with:

* single-metric questions
* regional filters
* year filters
* quarter filters
* quarterly breakdowns
* monthly breakdowns
* regional breakdowns
* cost metrics
* rejection of uncertified metrics

Example rejected request:

```text
Show customer sentiment for Europe
```

Result:

```text
status: rejected
reason: No certified MetricMind metric was detected.
governance: rejected
```

This demonstrates that unsupported analytical concepts are rejected rather than fabricated.

---

# 17. Governance Philosophy

MetricMind follows four principles.

## 1. Certified metrics

Only metrics defined in the semantic layer are eligible for governed execution.

## 2. Warehouse-backed truth

Numerical answers are calculated from the warehouse rather than invented by a language model.

## 3. Transparent computation

Users can inspect the query/API trace supporting a result.

## 4. Deterministic intelligence

Executive signals and margin explanations are calculated from measurable business movements.

The goal is not simply:

> "Ask an AI about your data."

The goal is:

> **Ask an AI to navigate a governed analytical system.**

---

# 18. Why This Architecture Matters

A conventional chatbot can produce plausible answers.

A governed analytical copilot must provide:

```text
Interpretation
      +
Semantic consistency
      +
Controlled computation
      +
Traceability
      +
Governance
      +
Business explanation
```

MetricMind is designed around this model.

The LLM-style interaction layer improves usability, while the semantic layer, Agent controls, and warehouse remain responsible for analytical truth.

---

# 19. Current Project Status

MetricMind currently includes:

* [x] Corporate sales warehouse
* [x] Reproducible data pipeline
* [x] Semantic metric layer
* [x] Intent parsing
* [x] Governed analytical Agent
* [x] Parameterized warehouse queries
* [x] Query execution limits
* [x] Query timeout protection
* [x] KPI API
* [x] Regional analytics
* [x] Monthly analytics
* [x] Cost-driver analysis
* [x] Margin root-cause analysis
* [x] Executive Intelligence
* [x] Dynamic Agent visualizations
* [x] Context-aware follow-up questions
* [x] Query/API transparency
* [x] Governance rejection handling
* [x] Next.js analytics dashboard
* [x] End-to-end consistency validation

---

# 20. Future Extensions

Potential future work includes:

* additional certified metrics
* product-level and customer-segment analysis
* anomaly detection
* forecasting
* scenario modeling
* automated executive reports
* role-based governance
* richer lineage metadata
* persistent analytical sessions
* production database deployment
* authentication and access control

These extensions can be added without changing the fundamental architecture:

```text
User
 ↓
Intent
 ↓
Semantic Layer
 ↓
Governance
 ↓
Warehouse
 ↓
Verified Intelligence
```

---

# 21. Final Design Principle

MetricMind is built around a simple distinction:

```text
AI should understand the question.
The data platform should determine the answer.
```

That separation is what makes the system explainable, testable, and suitable for business analytics.

````

### After pasting

Save with:

```text
Ctrl + S