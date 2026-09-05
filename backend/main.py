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
# GOVERNED REGIONAL PERFORMANCE
# =========================================================

# =========================================================
# GOVERNED REGIONAL PERFORMANCE
# =========================================================

@app.get("/api/analytics/regional-performance")
def regional_performance(
    region: str | None = None,
    year: int | None = None,
    quarter: str | None = None,
):
    """
    Governed regional performance.

    All selected dashboard filters are applied consistently.
    """

    connection = get_connection()

    try:
        cursor = connection.cursor()

        query = """
            SELECT
                region,

                ROUND(
                    COALESCE(SUM(profit), 0),
                    2
                ) AS profit,

                ROUND(
                    COALESCE(
                        SUM(profit) * 100.0 /
                        NULLIF(SUM(revenue), 0),
                        0
                    ),
                    2
                ) AS margin,

                ROUND(
                    COALESCE(SUM(revenue), 0),
                    2
                ) AS revenue

            FROM corporate_sales_raw

            WHERE 1 = 1
        """

        params = []

        if region:
            query += """
                AND LOWER(region) = LOWER(?)
            """
            params.append(region)

        if year:
            query += """
                AND year = ?
            """
            params.append(year)

        if quarter:
            query += """
                AND quarter = ?
            """
            params.append(quarter)

        query += """
            GROUP BY region
            ORDER BY profit DESC
        """

        cursor.execute(query, params)

        rows = cursor.fetchall()

        return {
            "status": "verified",

            "filters": {
                "region": region,
                "year": year,
                "quarter": quarter,
            },

            "data": [
                {
                    "region": row["region"],
                    "profit": float(
                        row["profit"] or 0
                    ),
                    "margin": float(
                        row["margin"] or 0
                    ),
                    "revenue": float(
                        row["revenue"] or 0
                    ),
                }
                for row in rows
            ],

            "governance": {
                "status": "passed",
                "source": "corporate_sales_raw",
                "calculation": (
                    "filtered regional warehouse aggregation"
                ),
            },
        }

    finally:
        connection.close()


# =========================================================
# GOVERNED MONTHLY PERFORMANCE
# =========================================================

# =========================================================
# GOVERNED MONTHLY PERFORMANCE
# =========================================================

@app.get("/api/analytics/monthly-performance")
def monthly_performance(
    region: str | None = None,
    year: int | None = None,
    quarter: str | None = None,
):
    """
    Governed monthly performance.

    Applies region, year and quarter consistently with
    the rest of the dashboard.
    """

    connection = get_connection()

    try:
        cursor = connection.cursor()

        query = """
            SELECT
                year,
                month,
                quarter,

                ROUND(
                    COALESCE(SUM(revenue), 0),
                    2
                ) AS revenue,

                ROUND(
                    COALESCE(SUM(profit), 0),
                    2
                ) AS profit,

                ROUND(
                    COALESCE(
                        SUM(profit) * 100.0 /
                        NULLIF(SUM(revenue), 0),
                        0
                    ),
                    2
                ) AS margin,

                COALESCE(
                    SUM(orders),
                    0
                ) AS orders

            FROM corporate_sales_raw

            WHERE 1 = 1
        """

        params = []

        if region:
            query += """
                AND LOWER(region) = LOWER(?)
            """
            params.append(region)

        if year:
            query += """
                AND year = ?
            """
            params.append(year)

        if quarter:
            query += """
                AND quarter = ?
            """
            params.append(quarter)

        query += """
            GROUP BY
                year,
                month,
                quarter

            ORDER BY
                year,
                month
        """

        cursor.execute(query, params)

        rows = cursor.fetchall()

        return {
            "status": "verified",

            "filters": {
                "region": region,
                "year": year,
                "quarter": quarter,
            },

            "data": [
                {
                    "year": int(
                        row["year"]
                    ),
                    "month": int(
                        row["month"]
                    ),
                    "quarter": row["quarter"],
                    "revenue": float(
                        row["revenue"] or 0
                    ),
                    "profit": float(
                        row["profit"] or 0
                    ),
                    "margin": float(
                        row["margin"] or 0
                    ),
                    "total_orders": int(
                        row["orders"] or 0
                    ),
                }
                for row in rows
            ],

            "governance": {
                "status": "passed",
                "source": "corporate_sales_raw",
                "calculation": (
                    "filtered monthly warehouse aggregation"
                ),
            },
        }

    finally:
        connection.close()


# =========================================================
# GOVERNED COST DRIVERS
# =========================================================

@app.get("/api/analytics/cost-drivers")
def cost_drivers(
    region: str | None = None,
    year: int | None = None,
    quarter: str | None = None,
):
    """
    Governed cost-driver analysis calculated directly
    from the raw warehouse.
    """

    connection = get_connection()

    try:
        cursor = connection.cursor()

        query = """
            SELECT
                ROUND(
                    COALESCE(SUM(material_cost), 0),
                    2
                ) AS material_cost,
                ROUND(
                    COALESCE(SUM(shipping_cost), 0),
                    2
                ) AS shipping_cost,
                ROUND(
                    COALESCE(SUM(marketing_cost), 0),
                    2
                ) AS marketing_cost,
                ROUND(
                    COALESCE(SUM(revenue), 0),
                    2
                ) AS revenue
            FROM corporate_sales_raw
            WHERE 1 = 1
        """

        params = []

        if region:
            query += """
                AND LOWER(region) = LOWER(?)
            """
            params.append(region)

        if year:
            query += """
                AND year = ?
            """
            params.append(year)

        if quarter:
            query += """
                AND quarter = ?
            """
            params.append(quarter)

        cursor.execute(query, params)

        row = cursor.fetchone()

        revenue = float(
            row["revenue"] or 0
        )

        material = float(
            row["material_cost"] or 0
        )

        shipping = float(
            row["shipping_cost"] or 0
        )

        marketing = float(
            row["marketing_cost"] or 0
        )

        return {
            "status": "verified",

            "data": [
                {
                    "name": "Material Cost",
                    "material_cost": material,
                    "value": material,
                    "share_of_revenue": (
                        round(
                            material * 100 / revenue,
                            2
                        )
                        if revenue
                        else 0
                    ),
                },
                {
                    "name": "Shipping Cost",
                    "shipping_cost": shipping,
                    "value": shipping,
                    "share_of_revenue": (
                        round(
                            shipping * 100 / revenue,
                            2
                        )
                        if revenue
                        else 0
                    ),
                },
                {
                    "name": "Marketing Cost",
                    "marketing_cost": marketing,
                    "value": marketing,
                    "share_of_revenue": (
                        round(
                            marketing * 100 / revenue,
                            2
                        )
                        if revenue
                        else 0
                    ),
                },
            ],

            "governance": {
                "status": "passed",
                "source": "corporate_sales_raw",
                "calculation": (
                    "filtered warehouse cost aggregation"
                ),
            },
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
# GOVERNED KPI SUMMARY
# =========================================================

@app.get("/api/analytics/kpis")
def analytics_kpis(
    region: str | None = None,
    year: int | None = None,
    quarter: str | None = None,
):
    """
    Governed KPI summary calculated directly from the raw warehouse.

    Revenue, profit, margin and orders all use the same filtered
    source and therefore remain mathematically consistent.
    """

    connection = get_connection()

    try:
        cursor = connection.cursor()

        query = """
            SELECT
                ROUND(COALESCE(SUM(revenue), 0), 2) AS revenue,
                ROUND(COALESCE(SUM(profit), 0), 2) AS profit,
                ROUND(
                    COALESCE(
                        SUM(profit) * 100.0 /
                        NULLIF(SUM(revenue), 0),
                        0
                    ),
                    2
                ) AS margin,
                COALESCE(SUM(orders), 0) AS orders,
                ROUND(COALESCE(SUM(material_cost), 0), 2)
                    AS material_cost,
                ROUND(COALESCE(SUM(shipping_cost), 0), 2)
                    AS shipping_cost,
                ROUND(COALESCE(SUM(marketing_cost), 0), 2)
                    AS marketing_cost,
                COUNT(*) AS records
            FROM corporate_sales_raw
            WHERE 1 = 1
        """

        params = []

        if region:
            query += """
                AND LOWER(region) = LOWER(?)
            """
            params.append(region)

        if year:
            query += """
                AND year = ?
            """
            params.append(year)

        if quarter:
            query += """
                AND quarter = ?
            """
            params.append(quarter)

        cursor.execute(query, params)

        row = cursor.fetchone()

        return {
            "status": "verified",

            "filters": {
                "region": region,
                "year": year,
                "quarter": quarter,
            },

            "kpis": {
                "revenue": float(
                    row["revenue"] or 0
                ),
                "profit": float(
                    row["profit"] or 0
                ),
                "margin": float(
                    row["margin"] or 0
                ),
                "orders": int(
                    row["orders"] or 0
                ),
            },

            "costs": {
                "material": float(
                    row["material_cost"] or 0
                ),
                "shipping": float(
                    row["shipping_cost"] or 0
                ),
                "marketing": float(
                    row["marketing_cost"] or 0
                ),
            },

            "records": int(
                row["records"] or 0
            ),

            "governance": {
                "status": "passed",
                "source": "corporate_sales_raw",
                "calculation": (
                    "filtered warehouse aggregation"
                ),
            },
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


        # =========================================================
# EXECUTIVE INSIGHT ENGINE
# =========================================================

@app.get("/api/analytics/insights")
def analytics_insights(
    region: str = "Europe",
    year: int = 2025,
    quarter: str = "Q3",
):
    """
    Governed executive insight engine.

    Generates deterministic business insights from the raw
    warehouse. No LLM is used to invent explanations.

    The engine compares the requested quarter against the
    immediately preceding quarter and evaluates:

        - Revenue movement
        - Profit movement
        - Margin movement
        - Cost-rate movement
        - Material / shipping / marketing pressure

    Every insight is backed by warehouse calculations.
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

    previous_quarter, previous_year = (
        quarter_order[quarter]
    )

    connection = get_connection()

    try:
        cursor = connection.cursor()

        query = """
            SELECT
                year,
                quarter,

                SUM(revenue) AS revenue,
                SUM(profit) AS profit,
                SUM(orders) AS orders,

                SUM(material_cost) AS material_cost,
                SUM(shipping_cost) AS shipping_cost,
                SUM(marketing_cost) AS marketing_cost

            FROM corporate_sales_raw

            WHERE LOWER(region) = LOWER(?)

              AND (
                    (year = ? AND quarter = ?)
                    OR
                    (year = ? AND quarter = ?)
              )

            GROUP BY
                year,
                quarter

            ORDER BY
                year,
                quarter
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

        periods = {
            (row["year"], row["quarter"]): dict(row)
            for row in rows
        }

        previous = periods.get(
            (previous_year, previous_quarter)
        )

        current = periods.get(
            (year, quarter)
        )

        if not previous or not current:
            return {
                "status": "insufficient_data",
                "region": region,
                "period": f"{quarter} {year}",
                "message": (
                    "Both comparison periods are required "
                    "to generate executive insights."
                ),
            }

        def safe_rate(
            numerator,
            denominator,
        ):
            if not denominator:
                return 0

            return numerator / denominator

        previous_revenue = float(
            previous["revenue"] or 0
        )

        current_revenue = float(
            current["revenue"] or 0
        )

        previous_profit = float(
            previous["profit"] or 0
        )

        current_profit = float(
            current["profit"] or 0
        )

        previous_orders = int(
            previous["orders"] or 0
        )

        current_orders = int(
            current["orders"] or 0
        )

        previous_margin = safe_rate(
            previous_profit,
            previous_revenue,
        )

        current_margin = safe_rate(
            current_profit,
            current_revenue,
        )

        revenue_change = (
            current_revenue -
            previous_revenue
        )

        profit_change = (
            current_profit -
            previous_profit
        )

        order_change = (
            current_orders -
            previous_orders
        )

        margin_change_pp = (
            current_margin -
            previous_margin
        ) * 100

        revenue_change_pct = (
            safe_rate(
                revenue_change,
                previous_revenue,
            ) * 100
        )

        profit_change_pct = (
            safe_rate(
                profit_change,
                previous_profit,
            ) * 100
            if previous_profit
            else 0
        )

        order_change_pct = (
            safe_rate(
                order_change,
                previous_orders,
            ) * 100
            if previous_orders
            else 0
        )

        cost_definitions = [
            (
                "Material Cost",
                "material_cost",
            ),
            (
                "Shipping Cost",
                "shipping_cost",
            ),
            (
                "Marketing Cost",
                "marketing_cost",
            ),
        ]

        cost_drivers = []

        for label, field in cost_definitions:

            previous_cost = float(
                previous[field] or 0
            )

            current_cost = float(
                current[field] or 0
            )

            previous_rate = safe_rate(
                previous_cost,
                previous_revenue,
            )

            current_rate = safe_rate(
                current_cost,
                current_revenue,
            )

            rate_change_pp = (
                current_rate -
                previous_rate
            ) * 100

            cost_drivers.append(
                {
                    "name": label,
                    "previous_cost": round(
                        previous_cost,
                        2,
                    ),
                    "current_cost": round(
                        current_cost,
                        2,
                    ),
                    "cost_change": round(
                        current_cost -
                        previous_cost,
                        2,
                    ),
                    "previous_rate": round(
                        previous_rate * 100,
                        2,
                    ),
                    "current_rate": round(
                        current_rate * 100,
                        2,
                    ),
                    "rate_change_pp": round(
                        rate_change_pp,
                        2,
                    ),
                }
            )

        cost_drivers.sort(
            key=lambda item:
                item["rate_change_pp"],
            reverse=True,
        )

        top_driver = cost_drivers[0]

        insights = []

        # -------------------------------------------------
        # MARGIN INSIGHT
        # -------------------------------------------------

        if margin_change_pp <= -0.5:

            insights.append(
                {
                    "type": "risk",
                    "priority": "high",
                    "title": "Margin declined",
                    "message": (
                        f"{region} margin fell "
                        f"{abs(margin_change_pp):.2f}pp "
                        f"from "
                        f"{previous_margin * 100:.2f}% "
                        f"to "
                        f"{current_margin * 100:.2f}%."
                    ),
                    "metric": round(
                        margin_change_pp,
                        2,
                    ),
                    "unit": "pp",
                }
            )

        elif margin_change_pp >= 0.5:

            insights.append(
                {
                    "type": "positive",
                    "priority": "high",
                    "title": "Margin improved",
                    "message": (
                        f"{region} margin improved "
                        f"by {margin_change_pp:.2f}pp "
                        f"to "
                        f"{current_margin * 100:.2f}%."
                    ),
                    "metric": round(
                        margin_change_pp,
                        2,
                    ),
                    "unit": "pp",
                }
            )

        else:

            insights.append(
                {
                    "type": "neutral",
                    "priority": "low",
                    "title": "Margin stable",
                    "message": (
                        f"{region} margin moved "
                        f"{margin_change_pp:+.2f}pp "
                        f"to "
                        f"{current_margin * 100:.2f}%."
                    ),
                    "metric": round(
                        margin_change_pp,
                        2,
                    ),
                    "unit": "pp",
                }
            )

        # -------------------------------------------------
        # COST PRESSURE
        # -------------------------------------------------

        if top_driver["rate_change_pp"] >= 0.5:

            insights.append(
                {
                    "type": "risk",
                    "priority": "high",
                    "title": "Cost pressure detected",
                    "message": (
                        f"{top_driver['name']} increased "
                        f"by "
                        f"{top_driver['rate_change_pp']:.2f}pp "
                        f"as a percentage of revenue."
                    ),
                    "metric": top_driver[
                        "rate_change_pp"
                    ],
                    "unit": "pp",
                }
            )

        elif top_driver["rate_change_pp"] <= -0.5:

            insights.append(
                {
                    "type": "positive",
                    "priority": "medium",
                    "title": "Cost efficiency improved",
                    "message": (
                        f"{top_driver['name']} "
                        f"declined by "
                        f"{abs(top_driver['rate_change_pp']):.2f}pp "
                        f"of revenue."
                    ),
                    "metric": top_driver[
                        "rate_change_pp"
                    ],
                    "unit": "pp",
                }
            )

        # -------------------------------------------------
        # REVENUE INSIGHT
        # -------------------------------------------------

        if revenue_change_pct >= 2:

            insights.append(
                {
                    "type": "positive",
                    "priority": "medium",
                    "title": "Revenue growth",
                    "message": (
                        f"Revenue increased "
                        f"{revenue_change_pct:.1f}% "
                        f"quarter over quarter."
                    ),
                    "metric": round(
                        revenue_change_pct,
                        1,
                    ),
                    "unit": "%",
                }
            )

        elif revenue_change_pct <= -2:

            insights.append(
                {
                    "type": "risk",
                    "priority": "high",
                    "title": "Revenue contraction",
                    "message": (
                        f"Revenue decreased "
                        f"{abs(revenue_change_pct):.1f}% "
                        f"quarter over quarter."
                    ),
                    "metric": round(
                        revenue_change_pct,
                        1,
                    ),
                    "unit": "%",
                }
            )

        # -------------------------------------------------
        # PROFIT INSIGHT
        # -------------------------------------------------

        if profit_change_pct <= -2:

            insights.append(
                {
                    "type": "risk",
                    "priority": "high",
                    "title": "Profit declined",
                    "message": (
                        f"Profit decreased by "
                        f"{abs(profit_change):,.0f} "
                        f"({abs(profit_change_pct):.1f}%)."
                    ),
                    "metric": round(
                        profit_change,
                        2,
                    ),
                    "unit": "USD",
                }
            )

        elif profit_change_pct >= 2:

            insights.append(
                {
                    "type": "positive",
                    "priority": "medium",
                    "title": "Profit growth",
                    "message": (
                        f"Profit increased by "
                        f"{profit_change:,.0f} "
                        f"({profit_change_pct:.1f}%)."
                    ),
                    "metric": round(
                        profit_change,
                        2,
                    ),
                    "unit": "USD",
                }
            )

        # -------------------------------------------------
        # VOLUME / ORDER SIGNAL
        # -------------------------------------------------

        if (
            order_change_pct <= -5
            and revenue_change_pct <= 0
        ):

            insights.append(
                {
                    "type": "risk",
                    "priority": "medium",
                    "title": "Demand signal weakened",
                    "message": (
                        f"Recorded orders declined "
                        f"{abs(order_change_pct):.1f}% "
                        f"while revenue also declined."
                    ),
                    "metric": round(
                        order_change_pct,
                        1,
                    ),
                    "unit": "%",
                }
            )

        elif (
            order_change_pct >= 5
            and revenue_change_pct >= 0
        ):

            insights.append(
                {
                    "type": "positive",
                    "priority": "medium",
                    "title": "Volume expanded",
                    "message": (
                        f"Recorded orders increased "
                        f"{order_change_pct:.1f}% "
                        f"alongside revenue movement."
                    ),
                    "metric": round(
                        order_change_pct,
                        1,
                    ),
                    "unit": "%",
                }
            )

        # -------------------------------------------------
        # EXECUTIVE SUMMARY
        # -------------------------------------------------

        if margin_change_pp < -0.5:

            summary = (
                f"{region} entered {quarter} {year} "
                f"with margin pressure. "
                f"The largest tracked cost-rate pressure "
                f"came from {top_driver['name']}, "
                f"while profit changed by "
                f"{profit_change:,.0f}."
            )

        elif margin_change_pp > 0.5:

            summary = (
                f"{region} delivered improving economics "
                f"in {quarter} {year}. "
                f"Margin increased "
                f"by {margin_change_pp:.2f}pp, "
                f"with {top_driver['name']} showing "
                f"the largest tracked cost-rate improvement or pressure."
            )

        else:

            summary = (
                f"{region} maintained broadly stable "
                f"margin performance in {quarter} {year}. "
                f"The largest tracked cost-rate movement "
                f"came from {top_driver['name']}."
            )

        return {
            "status": "verified",

            "region": region,

            "period": {
                "current": (
                    f"{quarter} {year}"
                ),
                "previous": (
                    f"{previous_quarter} "
                    f"{previous_year}"
                ),
            },

            "metrics": {
                "revenue": round(
                    current_revenue,
                    2,
                ),
                "profit": round(
                    current_profit,
                    2,
                ),
                "orders": current_orders,
                "margin": round(
                    current_margin * 100,
                    2,
                ),

                "revenue_change": round(
                    revenue_change,
                    2,
                ),

                "revenue_change_pct": round(
                    revenue_change_pct,
                    2,
                ),

                "profit_change": round(
                    profit_change,
                    2,
                ),

                "profit_change_pct": round(
                    profit_change_pct,
                    2,
                ),

                "order_change": order_change,

                "order_change_pct": round(
                    order_change_pct,
                    2,
                ),

                "margin_change_pp": round(
                    margin_change_pp,
                    2,
                ),
            },

            "top_driver": top_driver,

            "cost_drivers": cost_drivers,

            "insights": insights,

            "summary": summary,

            "governance": {
                "status": "passed",
                "source": "corporate_sales_raw",
                "calculation": (
                    "deterministic quarter-over-quarter "
                    "business signal analysis"
                ),
                "llm_generated": False,
            },
        }

    finally:
        connection.close()