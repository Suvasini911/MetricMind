# MetricMind Architecture

## 1. Overview

MetricMind is a governed business intelligence platform that combines natural-language interaction with controlled analytical computation.

The architecture deliberately separates:

1. Question understanding
2. Business metric definition
3. Governance validation
4. Warehouse computation
5. Business intelligence presentation

The central design principle is:

> The AI layer interprets the question; the warehouse determines the numerical answer.

---

## 2. High-Level Architecture

```text
                         ┌──────────────────────────┐
                         │          User            │
                         │ Natural-language question│
                         └────────────┬─────────────┘
                                      │
                                      ▼
                         ┌──────────────────────────┐
                         │      Next.js Frontend    │
                         │ Analytics + Copilot UI   │
                         └────────────┬─────────────┘
                                      │
                                      ▼
                         ┌──────────────────────────┐
                         │       FastAPI API        │
                         │      backend/main.py     │
                         └────────────┬─────────────┘
                                      │
                         ┌────────────┴─────────────┐
                         │                          │
                         ▼                          ▼
              ┌───────────────────┐     ┌────────────────────┐
              │   Intent Engine   │     │   Semantic Layer   │
              │                   │     │                    │
              │ metric            │     │ certified metrics  │
              │ dimensions        │     │ formulas           │
              │ filters           │     │ dimensions         │
              │ breakdowns        │     │ business meaning   │
              └─────────┬─────────┘     └──────────┬─────────┘
                        │                          │
                        └────────────┬─────────────┘
                                     ▼
                         ┌──────────────────────────┐
                         │    Governed Agent        │
                         │      agent.py            │
                         │                          │
                         │ validation               │
                         │ approved metrics         │
                         │ approved dimensions      │
                         │ parameterized queries    │
                         │ execution limits         │
                         └────────────┬─────────────┘
                                      │
                                      ▼
                         ┌──────────────────────────┐
                         │      SQLite Warehouse    │
                         │                          │
                         │   corporate_sales_raw    │
                         └────────────┬─────────────┘
                                      │
                                      ▼
                         ┌──────────────────────────┐
                         │     Verified Result      │
                         │                          │
                         │ value                    │
                         │ filters                  │
                         │ evidence                 │
                         │ governance               │
                         │ query trace              │
                         └────────────┬─────────────┘
                                      │
                         ┌────────────┴─────────────┐
                         │                          │
                         ▼                          ▼
                ┌──────────────────┐      ┌──────────────────┐
                │ Visualization    │      │ Executive        │
                │                  │      │ Intelligence     │
                │ regional         │      │                  │
                │ quarterly        │      │ margin signals   │
                │ monthly          │      │ cost pressure    │
                │ trends           │      │ growth signals   │
                └──────────────────┘      └──────────────────┘
````

---

# 3. Layer Responsibilities

## 3.1 Frontend Layer

Location:

```text
frontend/src/app/
frontend/src/lib/
```

Technology:

```text
Next.js
React
```

Responsibilities:

* dashboard presentation
* KPI cards
* analytical filters
* natural-language copilot
* verified result presentation
* visualizations
* query transparency
* follow-up context
* executive intelligence presentation

The frontend does not independently calculate business KPIs.

It requests governed results from the backend.

---

## 3.2 API Layer

Location:

```text
backend/main.py
```

Technology:

```text
FastAPI
```

Responsibilities:

* HTTP API
* warehouse connectivity
* analytics endpoints
* Agent endpoint
* semantic endpoints
* executive intelligence
* margin root-cause analysis
* health monitoring

Important endpoints include:

```text
/api/health

/api/semantic/metrics
/api/semantic/parse

/api/agent/analyze

/api/analytics/kpis
/api/analytics/regional-revenue
/api/analytics/regional-performance
/api/analytics/monthly-performance
/api/analytics/cost-drivers
/api/analytics/margin-root-cause
/api/analytics/insights
```

---

# 4. Data Architecture

## 4.1 Source and Processing Flow

```text
Raw corporate sales data
          │
          ▼
data/raw/
          │
          ▼
Transformation
          │
          ▼
data/processed/
          │
          ▼
Warehouse loading
          │
          ▼
warehouse/metricmind.db
```

The project includes scripts for:

```text
data/generate_dataset.py
data/transform_data.py
data/load_to_warehouse.py
```

---

## 4.2 Warehouse

The primary governed warehouse table is:

```text
corporate_sales_raw
```

The table contains business dimensions and measures including:

```text
order_id
order_date
year
quarter
month
region
country
product_category
product
customer_segment
revenue
material_cost
shipping_cost
marketing_cost
total_cost
profit
margin
orders
```

The current validated warehouse contains:

```text
2,000 records
```

---

# 5. Semantic Layer

Location:

```text
semantic_layer/
```

Key artifacts:

```text
dimensions.json
metrics.json
semantic_layer.py
```

The semantic layer provides a controlled business vocabulary.

It defines:

* metric names
* descriptions
* source fields
* formulas
* supported dimensions
* formatting expectations

Certified metrics include:

```text
Revenue
Profit
Profit Margin
Orders
Material Cost
Shipping Cost
Marketing Cost
```

The semantic layer prevents different parts of the application from using inconsistent definitions for the same business concept.

---

# 6. Intent Engine

Location:

```text
backend/intent_engine.py
```

The intent engine converts natural-language questions into structured analytical intent.

Conceptually:

```text
"What was Europe revenue in Q3 2025?"

             ↓

metric:
    revenue

filters:
    region = Europe
    year = 2025
    quarter = Q3

breakdown:
    none
```

For a breakdown question:

```text
"Show Europe revenue by quarter in 2025."

             ↓

metric:
    revenue

filters:
    region = Europe
    year = 2025

dimension:
    quarter
```

This structured representation gives the Agent a controlled analytical input instead of requiring unrestricted SQL generation.

---

# 7. Governed Agent

Location:

```text
backend/agent.py
```

The Agent is responsible for controlled analytical execution.

The execution pipeline is:

```text
Natural-language question
          │
          ▼
Intent parsing
          │
          ▼
Certified metric validation
          │
          ▼
Approved dimension validation
          │
          ▼
Filter construction
          │
          ▼
Governance checks
          │
          ▼
Parameterized SQL
          │
          ▼
Warehouse execution
          │
          ▼
Verified result
```

---

# 8. Governance Model

MetricMind uses explicit execution controls.

## Certified Metrics

Only approved metrics can be executed.

For example:

```text
Revenue
Profit
Profit Margin
Orders
```

are valid.

An unsupported request such as:

```text
Show customer sentiment for Europe
```

is rejected because no certified MetricMind metric exists for that concept.

---

## Approved Dimensions

The Agent supports controlled analytical dimensions such as:

```text
region
quarter
month
```

This prevents unrestricted query generation.

---

## Parameterized Filters

User-supplied filter values are passed as query parameters rather than directly concatenated into SQL.

Conceptually:

```text
WHERE region = ?
  AND year = ?
  AND quarter = ?
```

with values supplied separately.

---

## Execution Limits

The governed Agent applies execution safeguards:

```text
Maximum result rows:          100
Maximum visualization points: 24
Query timeout:                5 seconds
```

These controls reduce the risk of uncontrolled analytical queries.

---

# 9. Query Transparency

MetricMind provides analytical traceability.

A verified Agent response can expose:

```text
Metric
Value
Filters
SQL
Parameters
API request
Source
Governance status
Visualization metadata
```

This allows a user to understand not only the answer but also how the system obtained it.

The transparency model is:

```text
Answer
  ↓
Evidence
  ↓
Query
  ↓
Warehouse
```

---

# 10. Analytics Architecture

The dashboard analytics are calculated from the governed warehouse.

## KPI Aggregation

The KPI endpoint calculates:

```text
Revenue
Profit
Profit Margin
Orders
Material Cost
Shipping Cost
Marketing Cost
```

using filtered warehouse aggregation.

---

## Regional Performance

Regional performance groups warehouse data by:

```text
region
```

and calculates:

```text
revenue
profit
margin
```

---

## Monthly Performance

Monthly performance groups data by:

```text
year
month
quarter
```

and calculates:

```text
revenue
profit
margin
orders
```

---

## Cost Drivers

Cost-driver analysis evaluates:

```text
Material Cost
Shipping Cost
Marketing Cost
```

and their share of revenue.

---

# 11. Margin Root-Cause Architecture

Margin root-cause analysis compares sequential quarters.

Example:

```text
Q2 2025
    ↓
Q3 2025
```

The analysis calculates:

```text
previous margin
current margin
margin change
revenue change
profit change
cost changes
cost rates
cost-rate changes
```

Cost drivers are ranked according to their movement as a percentage of revenue.

For the validated Europe example:

```text
Q2 margin: 33.75%
Q3 margin: 30.24%

Margin change:
-3.51 percentage points
```

The largest tracked cost-rate movement was:

```text
Shipping Cost
+4.11 percentage points
```

This allows MetricMind to move from:

```text
"What is margin?"
```

to:

```text
"Why did margin change?"
```

---

# 12. Executive Intelligence

The Executive Intelligence endpoint converts governed warehouse movements into deterministic business signals.

Example signals include:

```text
Margin declined
Cost pressure detected
Revenue growth
Profit growth
Volume expanded
```

For Europe Q3 2025, the system identifies:

```text
Margin:
-3.51 pp

Shipping Cost rate:
+4.11 pp

Revenue:
+24.61% quarter over quarter

Profit:
+11.64% quarter over quarter

Orders:
+23.91% quarter over quarter
```

The intelligence layer explicitly records that these signals are deterministic calculations rather than free-form LLM-generated claims.

---

# 13. Visualization Architecture

When a question requests a breakdown, the Agent can produce visualization metadata alongside the verified result.

Examples:

```text
Revenue by Region
Revenue by Quarter
Revenue by Month
```

The visualization pipeline is:

```text
Question
   ↓
Breakdown detected
   ↓
Approved dimension
   ↓
Governed aggregation
   ↓
Limited result set
   ↓
Visualization metadata
   ↓
Frontend chart
```

Visualization results are constrained to a maximum of:

```text
24 points
```

---

# 14. Conversational Context

MetricMind supports analytical follow-up questions.

Dashboard context can contain:

```text
Region
Year
Quarter
```

For example:

```text
Selected context:

Europe
2025
Q3
```

A follow-up question can inherit applicable context.

However, explicit breakdown requests are handled differently.

For example:

```text
Show revenue by region.
```

should not incorrectly inherit:

```text
region = Europe
```

because the user is asking for Region as the analytical dimension.

This distinction is important for conversational BI.

---

# 15. Verification Strategy

MetricMind uses cross-layer consistency validation.

The same business question can be checked through:

```text
Agent
   ↓
KPI API
   ↓
Regional API
   ↓
Performance API
   ↓
Warehouse
```

For example, Europe Q3 2025 consistently returns:

```text
Revenue       1,839,323.15
Profit          556,232.82
Margin              30.24%
Orders              1,420
```

This reduces the risk of dashboard components silently using different calculations.

---

# 16. Failure and Rejection Model

Unsupported analytical concepts should not produce fabricated results.

Example:

```text
Question:
Show customer sentiment for Europe
```

Expected behavior:

```text
status:
rejected

reason:
No certified MetricMind metric was detected.

governance:
rejected
```

The system therefore prefers an explicit rejection over a plausible but unsupported answer.

---

# 17. Security and Control Boundaries

MetricMind's primary analytical control boundaries are:

```text
User input
    ↓
Intent structure
    ↓
Certified metrics
    ↓
Approved dimensions
    ↓
Parameterized filters
    ↓
Controlled SQL
    ↓
Warehouse
```

Important controls include:

* certified metric validation
* approved dimension validation
* parameterized filters
* query timeout
* result limits
* visualization point limits
* explicit governance status
* deterministic executive calculations

---

# 18. Repository Structure

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
│   ├── ARCHITECTURE.md
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

# 19. Runtime Architecture

Backend:

```text
FastAPI
127.0.0.1:8000
```

Frontend:

```text
Next.js
localhost:3000
```

Communication:

```text
Browser
   ↓
Next.js frontend
   ↓
FastAPI
   ↓
Agent / Analytics services
   ↓
SQLite warehouse
```

---

# 20. Design Principles

## Principle 1 — Separate interpretation from computation

Natural language is useful for interaction.

It should not replace governed numerical computation.

---

## Principle 2 — Define metrics once

The semantic layer provides a consistent definition of business metrics.

---

## Principle 3 — Govern before execution

The system validates the analytical request before executing the warehouse query.

---

## Principle 4 — Make answers traceable

A user should be able to understand where a verified answer came from.

---

## Principle 5 — Prefer rejection to fabrication

Unsupported questions should produce a governed rejection rather than an invented answer.

---

## Principle 6 — Explain business movement

A useful BI system should answer both:

```text
What happened?
```

and:

```text
Why did it happen?
```

MetricMind addresses this through margin root-cause analysis and Executive Intelligence.

---

# 21. End-to-End Example

Question:

```text
Why did Europe's margin decline in Q3 2025?
```

Processing:

```text
User
 ↓
Intent Engine
 ↓
Metric = Profit Margin
Region = Europe
Current period = Q3 2025
 ↓
Semantic Layer
 ↓
Governance
 ↓
Warehouse
 ↓
Quarter-over-quarter analysis
 ↓
Cost-rate comparison
 ↓
Executive Intelligence
```

Result:

```text
Q2 margin: 33.75%
Q3 margin: 30.24%

Change:
-3.51 pp

Largest tracked cost-rate pressure:
Shipping Cost

Change:
+4.11 pp
```

The result is therefore not simply a dashboard number. It is a governed analytical explanation.

---

# 22. Architecture Summary

MetricMind combines:

```text
                    ┌──────────────────┐
                    │ Natural Language │
                    └────────┬─────────┘
                             ↓
                    ┌──────────────────┐
                    │ Intent Engine    │
                    └────────┬─────────┘
                             ↓
                    ┌──────────────────┐
                    │ Semantic Layer   │
                    └────────┬─────────┘
                             ↓
                    ┌──────────────────┐
                    │ Governance       │
                    └────────┬─────────┘
                             ↓
                    ┌──────────────────┐
                    │ Warehouse        │
                    └────────┬─────────┘
                             ↓
              ┌──────────────┴──────────────┐
              ↓                             ↓
      ┌───────────────┐             ┌────────────────┐
      │ Verified BI   │             │ Intelligence   │
      │ + Charts      │             │ + Root Cause   │
      └───────────────┘             └────────────────┘
```

The resulting system is designed to be:

* governed
* explainable
* traceable
* testable
* context-aware
* business-oriented
* extensible

The key architectural boundary remains:

> **AI interprets. Governance controls. The warehouse calculates. Intelligence explains.**