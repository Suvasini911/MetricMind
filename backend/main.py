from pathlib import Path
import sqlite3

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Query


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
    region: str | None = None,
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
def margin_root_cause(region: str = "Europe"):

    connection = get_connection()

    try:

        cursor = connection.cursor()

        cursor.execute("""
            SELECT
                quarter,
                SUM(total_revenue) AS revenue,
                SUM(material_cost) AS material_cost,
                SUM(shipping_cost) AS shipping_cost,
                SUM(marketing_cost) AS marketing_cost,
                SUM(total_cost) AS total_cost,
                SUM(total_profit) AS profit
            FROM cost_driver_analysis
            WHERE LOWER(region) = LOWER(?)
              AND quarter IN ('Q2', 'Q3')
            GROUP BY quarter
            ORDER BY quarter
        """, (region,))

        rows = cursor.fetchall()

        if len(rows) < 2:

            return {
                "status": "insufficient_data",
                "region": region,
                "message": (
                    "Not enough quarterly data is available "
                    "for a Q2 versus Q3 comparison."
                ),
            }

        data = {
            row["quarter"]: dict(row)
            for row in rows
        }

        q2 = data.get("Q2")
        q3 = data.get("Q3")

        if not q2 or not q3:

            return {
                "status": "insufficient_data",
                "region": region,
                "message": "Q2 and Q3 data are required.",
            }

        # -------------------------------------------------
        # Calculate margins
        # -------------------------------------------------

        q2_margin = (
            q2["profit"] / q2["revenue"]
            if q2["revenue"]
            else 0
        )

        q3_margin = (
            q3["profit"] / q3["revenue"]
            if q3["revenue"]
            else 0
        )

        margin_change = q3_margin - q2_margin

        # -------------------------------------------------
        # Cost changes
        # -------------------------------------------------

        material_change = (
            q3["material_cost"]
            - q2["material_cost"]
        )

        shipping_change = (
            q3["shipping_cost"]
            - q2["shipping_cost"]
        )

        marketing_change = (
            q3["marketing_cost"]
            - q2["marketing_cost"]
        )

        drivers = [
            {
                "name": "Material cost",
                "change": material_change,
            },
            {
                "name": "Shipping cost",
                "change": shipping_change,
            },
            {
                "name": "Marketing cost",
                "change": marketing_change,
            },
        ]

        drivers.sort(
            key=lambda item: item["change"],
            reverse=True
        )

        top_driver = drivers[0]

        # -------------------------------------------------
        # Explanation
        # -------------------------------------------------

        if margin_change < 0:

            summary = (
                f"{region} margin declined from "
                f"{q2_margin * 100:.2f}% in Q2 to "
                f"{q3_margin * 100:.2f}% in Q3. "
                f"The largest increase among tracked "
                f"cost drivers was {top_driver['name']}."
            )

        else:

            summary = (
                f"{region} margin did not decline between "
                f"Q2 and Q3. Margin changed from "
                f"{q2_margin * 100:.2f}% to "
                f"{q3_margin * 100:.2f}%."
            )

        return {

            "status": "verified",

            "region": region,

            "comparison": {
                "previous_period": "Q2",
                "current_period": "Q3",
            },

            "metrics": {
                "q2_margin": round(
                    q2_margin * 100,
                    2
                ),
                "q3_margin": round(
                    q3_margin * 100,
                    2
                ),
                "margin_change": round(
                    margin_change * 100,
                    2
                ),
            },

            "cost_drivers": [
                {
                    "name": driver["name"],
                    "change": round(
                        driver["change"],
                        2
                    ),
                }
                for driver in drivers
            ],

            "summary": summary,
        }

    finally:

        connection.close()