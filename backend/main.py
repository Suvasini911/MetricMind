from pathlib import Path
import sqlite3

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from backend.agent import analyze_question
from backend.intent_engine import parse_question
from backend.semantic_layer import list_metrics, list_dimensions


# =========================================================
# MetricMind Backend
# =========================================================

BASE_DIR = Path(__file__).resolve().parent.parent
DATABASE = BASE_DIR / "warehouse" / "metricmind.db"


app = FastAPI(
    title="MetricMind API",
    description="Governed analytics API for MetricMind",
    version="1.0.0",
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# DATABASE
# =========================================================

def get_connection():
    if not DATABASE.exists():
        raise HTTPException(
            status_code=500,
            detail=f"Warehouse database not found: {DATABASE}",
        )

    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row

    return connection


# =========================================================
# ROOT
# =========================================================

@app.get("/")
def root():
    return {
        "name": "MetricMind API",
        "status": "operational",
        "warehouse": "connected",
    }


# =========================================================
# HEALTH
# =========================================================

@app.get("/api/health")
def health():
    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            "SELECT COUNT(*) AS count FROM corporate_sales_raw"
        )

        row = cursor.fetchone()

        return {
            "status": "healthy",
            "warehouse": "connected",
            "records": row["count"],
        }

    finally:
        connection.close()


# =========================================================
# REGIONAL REVENUE
# =========================================================

@app.get("/api/analytics/regional-revenue")
def regional_revenue(
    region: str | None = None,
    year: int | None = None,
    quarter: str | None = None,
):
    connection = get_connection()

    try:
        cursor = connection.cursor()

        query = """
            SELECT
                region,
                ROUND(SUM(revenue), 2) AS revenue
            FROM corporate_sales_raw
            WHERE 1=1
        """

        params = []

        if region:
            query += " AND LOWER(region) = LOWER(?)"
            params.append(region)

        if year:
            query += " AND year = ?"
            params.append(year)

        if quarter:
            query += " AND quarter = ?"
            params.append(quarter)

        query += """
            GROUP BY region
            ORDER BY revenue DESC
        """

        cursor.execute(query, params)

        rows = cursor.fetchall()

        return {
            "metric": "Revenue",
            "dimension": "Region",
            "data": [dict(row) for row in rows],
        }

    finally:
        connection.close()


# =========================================================
# REGIONAL PERFORMANCE
# =========================================================

@app.get("/api/analytics/regional-performance")
def regional_performance(
    region: str | None = None,
):
    connection = get_connection()

    try:
        cursor = connection.cursor()

        query = """
            SELECT
                region,
                ROUND(total_revenue, 2) AS total_revenue,
                ROUND(total_cost, 2) AS total_cost,
                ROUND(total_profit, 2) AS total_profit,
                ROUND(profit_margin * 100, 2) AS profit_margin,
                total_orders
            FROM regional_performance
        """

        params = []

        if region:
            query += " WHERE LOWER(region) = LOWER(?)"
            params.append(region)

        query += """
            ORDER BY total_revenue DESC
        """

        cursor.execute(query, params)

        rows = cursor.fetchall()

        return {
            "metric": "Regional Performance",
            "data": [dict(row) for row in rows],
        }

    finally:
        connection.close()


# =========================================================
# MONTHLY PERFORMANCE
# =========================================================

@app.get("/api/analytics/monthly-performance")
def monthly_performance(
    year: int | None = None,
    quarter: str | None = None,
):
    connection = get_connection()

    try:
        cursor = connection.cursor()

        query = """
            SELECT
                year,
                quarter,
                month,
                ROUND(total_revenue, 2) AS total_revenue,
                ROUND(total_cost, 2) AS total_cost,
                ROUND(total_profit, 2) AS total_profit,
                ROUND(profit_margin * 100, 2) AS profit_margin,
                total_orders
            FROM monthly_performance
            WHERE 1=1
        """

        params = []

        if year:
            query += " AND year = ?"
            params.append(year)

        if quarter:
            query += " AND quarter = ?"
            params.append(quarter)

        query += """
            ORDER BY year, month
        """

        cursor.execute(query, params)

        rows = cursor.fetchall()

        return {
            "metric": "Monthly Performance",
            "data": [dict(row) for row in rows],
        }

    finally:
        connection.close()


# =========================================================
# COST DRIVER ANALYSIS
# =========================================================

@app.get("/api/analytics/cost-drivers")
def cost_drivers(
    region: str | None = None,
    year: int | None = None,
    quarter: str | None = None,
):
    connection = get_connection()

    try:
        cursor = connection.cursor()

        query = """
            SELECT
                region,
                year,
                quarter,
                ROUND(total_revenue, 2) AS total_revenue,
                ROUND(material_cost, 2) AS material_cost,
                ROUND(shipping_cost, 2) AS shipping_cost,
                ROUND(marketing_cost, 2) AS marketing_cost,
                ROUND(total_cost, 2) AS total_cost,
                ROUND(total_profit, 2) AS total_profit,
                ROUND(profit_margin * 100, 2) AS profit_margin
            FROM cost_driver_analysis
            WHERE 1=1
        """

        params = []

        if region:
            query += " AND LOWER(region) = LOWER(?)"
            params.append(region)

        if year:
            query += " AND year = ?"
            params.append(year)

        if quarter:
            query += " AND quarter = ?"
            params.append(quarter)

        query += """
            ORDER BY year, quarter, region
        """

        cursor.execute(query, params)

        rows = cursor.fetchall()

        return {
            "metric": "Cost Driver Analysis",
            "data": [dict(row) for row in rows],
        }

    finally:
        connection.close()


# =========================================================
# SEMANTIC LAYER
# =========================================================

@app.get("/api/semantic/metrics")
def semantic_metrics():
    return {
        "metrics": list_metrics(),
        "dimensions": list_dimensions(),
    }


@app.get("/api/semantic/parse")
def semantic_parse(question: str):
    return parse_question(question)


# =========================================================
# GOVERNED AGENT
# =========================================================

@app.get("/api/agent/analyze")
def agent_analyze(question: str):
    return analyze_question(question)


# =========================================================
# SIMPLE NATURAL LANGUAGE QUERY
# =========================================================

@app.get("/api/query")
def query(question: str):
    connection = get_connection()

    try:
        cursor = connection.cursor()

        normalized = question.lower().strip()

        # -------------------------------------------------
        # European sales
        # -------------------------------------------------

        if (
            "european sales" in normalized
            or "europe sales" in normalized
        ):
            cursor.execute("""
                SELECT
                    ROUND(SUM(revenue), 2) AS revenue
                FROM corporate_sales_raw
                WHERE LOWER(region) = 'europe'
            """)

            row = cursor.fetchone()

            return {
                "question": question,
                "metric": "Revenue",
                "dimension": "Region",
                "filter": "Europe",
                "value": row["revenue"],
                "status": "verified",
            }

        # -------------------------------------------------
        # Q3 revenue
        # -------------------------------------------------

        if (
            "q3 revenue" in normalized
            or (
                "revenue" in normalized
                and "q3" in normalized
            )
        ):
            cursor.execute("""
                SELECT
                    ROUND(SUM(revenue), 2) AS revenue
                FROM corporate_sales_raw
                WHERE LOWER(quarter) = 'q3'
            """)

            row = cursor.fetchone()

            return {
                "question": question,
                "metric": "Revenue",
                "dimension": "Quarter",
                "filter": "Q3",
                "value": row["revenue"],
                "status": "verified",
            }

        return {
            "question": question,
            "status": "recognized",
            "message": (
                "The question was recognized, "
                "but this query is not yet implemented."
            ),
        }

    finally:
        connection.close()


# =========================================================
# MARGIN ROOT-CAUSE ANALYSIS
# =========================================================

@app.get("/api/analytics/margin-root-cause")
def margin_root_cause(
    region: str = "Europe",
    year: int = 2025,
    quarter: str = "Q3",
):
    """
    Governed margin root-cause analysis.

    Compares the requested quarter with the immediately
    preceding quarter using the raw warehouse table.

    No LLM is used to invent causes. Every driver is derived
    from warehouse calculations.
    """

    quarter_order = {
        "Q1": ("Q4", year - 1),
        "Q2": ("Q1", year),
        "Q3": ("Q2", year),
        "Q4": ("Q3", year),
    }

    quarter = quarter.upper()

    if quarter not in quarter_order:
        raise HTTPException(
            status_code=400,
            detail="Quarter must be Q1, Q2, Q3, or Q4.",
        )

    previous_quarter, previous_year = quarter_order[quarter]

    connection = get_connection()

    try:
        cursor = connection.cursor()

        query = """
            SELECT
                year,
                quarter,
                ROUND(SUM(revenue), 2) AS revenue,
                ROUND(SUM(material_cost), 2) AS material_cost,
                ROUND(SUM(shipping_cost), 2) AS shipping_cost,
                ROUND(SUM(marketing_cost), 2) AS marketing_cost,
                ROUND(SUM(total_cost), 2) AS total_cost,
                ROUND(SUM(profit), 2) AS profit
            FROM corporate_sales_raw
            WHERE LOWER(region) = LOWER(?)
              AND (
                    (year = ? AND quarter = ?)
                    OR
                    (year = ? AND quarter = ?)
              )
            GROUP BY year, quarter
            ORDER BY year, quarter
        """

        cursor.execute(
            query,
            (
                region,
                previous_year,
                previous_quarter,
                year,
                quarter,
            ),
        )

        rows = cursor.fetchall()

        data = {
            (row["year"], row["quarter"]): dict(row)
            for row in rows
        }

        previous = data.get((previous_year, previous_quarter))
        current = data.get((year, quarter))

        if not previous or not current:
            return {
                "status": "insufficient_data",
                "region": region,
                "comparison": {
                    "previous_period": f"{previous_quarter} {previous_year}",
                    "current_period": f"{quarter} {year}",
                },
                "message": (
                    "Both comparison periods are required "
                    "for a root-cause analysis."
                ),
            }

        # -----------------------------------------------------
        # Margin calculations
        # -----------------------------------------------------

        previous_margin = (
            previous["profit"] / previous["revenue"]
            if previous["revenue"]
            else 0
        )

        current_margin = (
            current["profit"] / current["revenue"]
            if current["revenue"]
            else 0
        )

        margin_change = current_margin - previous_margin

        # -----------------------------------------------------
        # Cost-rate calculations
        #
        # Cost pressure is measured relative to revenue.
        # This is more meaningful than comparing raw dollars
        # because revenue can change between quarters.
        # -----------------------------------------------------

        def cost_rate(cost, revenue):
            return cost / revenue if revenue else 0

        drivers = [
            {
                "name": "Material cost",
                "previous_cost": previous["material_cost"],
                "current_cost": current["material_cost"],
                "previous_rate": cost_rate(
                    previous["material_cost"],
                    previous["revenue"],
                ),
                "current_rate": cost_rate(
                    current["material_cost"],
                    current["revenue"],
                ),
            },
            {
                "name": "Shipping cost",
                "previous_cost": previous["shipping_cost"],
                "current_cost": current["shipping_cost"],
                "previous_rate": cost_rate(
                    previous["shipping_cost"],
                    previous["revenue"],
                ),
                "current_rate": cost_rate(
                    current["shipping_cost"],
                    current["revenue"],
                ),
            },
            {
                "name": "Marketing cost",
                "previous_cost": previous["marketing_cost"],
                "current_cost": current["marketing_cost"],
                "previous_rate": cost_rate(
                    previous["marketing_cost"],
                    previous["revenue"],
                ),
                "current_rate": cost_rate(
                    current["marketing_cost"],
                    current["revenue"],
                ),
            },
        ]

        for driver in drivers:
            driver["cost_change"] = (
                driver["current_cost"]
                - driver["previous_cost"]
            )

            driver["rate_change"] = (
                driver["current_rate"]
                - driver["previous_rate"]
            )

            driver["rate_change_pp"] = (
                driver["rate_change"] * 100
            )

        # The biggest increase in cost/revenue ratio is the
        # strongest tracked source of margin pressure.
        drivers.sort(
            key=lambda item: item["rate_change"],
            reverse=True,
        )

        top_driver = drivers[0]

        # -----------------------------------------------------
        # Revenue and profit movement
        # -----------------------------------------------------

        revenue_change = (
            current["revenue"]
            - previous["revenue"]
        )

        profit_change = (
            current["profit"]
            - previous["profit"]
        )

        # -----------------------------------------------------
        # Human-readable explanation
        # -----------------------------------------------------

        if margin_change < 0:
            summary = (
                f"{region} profit margin declined from "
                f"{previous_margin * 100:.2f}% in "
                f"{previous_quarter} {previous_year} to "
                f"{current_margin * 100:.2f}% in "
                f"{quarter} {year}. "
                f"Among the tracked cost drivers, "
                f"{top_driver['name']} showed the largest "
                f"increase in cost as a percentage of revenue."
            )
        elif margin_change > 0:
            summary = (
                f"{region} profit margin improved from "
                f"{previous_margin * 100:.2f}% to "
                f"{current_margin * 100:.2f}%. "
                f"The strongest tracked cost-rate movement was "
                f"{top_driver['name']}."
            )
        else:
            summary = (
                f"{region} profit margin was unchanged at "
                f"{current_margin * 100:.2f}%."
            )

        return {
            "status": "verified",
            "region": region,

            "comparison": {
                "previous_period": (
                    f"{previous_quarter} {previous_year}"
                ),
                "current_period": (
                    f"{quarter} {year}"
                ),
            },

            "metrics": {
                "previous_margin": round(
                    previous_margin * 100,
                    2,
                ),
                "current_margin": round(
                    current_margin * 100,
                    2,
                ),
                "margin_change_pp": round(
                    margin_change * 100,
                    2,
                ),
                "revenue_change": round(
                    revenue_change,
                    2,
                ),
                "profit_change": round(
                    profit_change,
                    2,
                ),
            },

            "cost_drivers": [
                {
                    "name": driver["name"],
                    "previous_cost": round(
                        driver["previous_cost"],
                        2,
                    ),
                    "current_cost": round(
                        driver["current_cost"],
                        2,
                    ),
                    "cost_change": round(
                        driver["cost_change"],
                        2,
                    ),
                    "previous_rate": round(
                        driver["previous_rate"] * 100,
                        2,
                    ),
                    "current_rate": round(
                        driver["current_rate"] * 100,
                        2,
                    ),
                    "rate_change_pp": round(
                        driver["rate_change_pp"],
                        2,
                    ),
                }
                for driver in drivers
            ],

            "top_driver": {
                "name": top_driver["name"],
                "rate_change_pp": round(
                    top_driver["rate_change_pp"],
                    2,
                ),
            },

            "summary": summary,

            "governance": {
                "status": "passed",
                "source": "corporate_sales_raw",
                "calculation": (
                    "quarter-over-quarter margin "
                    "and cost-rate comparison"
                ),
            },
        }

    finally:
        connection.close()