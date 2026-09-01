"""
MetricMind Agent

Executes validated semantic requests through approved
warehouse queries.

The agent never accepts raw SQL from the user.
"""

from pathlib import Path
import sqlite3

from backend.intent_engine import parse_question


# =========================================================
# DATABASE
# =========================================================

DB_PATH = (
    Path(__file__).resolve().parent.parent
    / "warehouse"
    / "metricmind.db"
)


def get_connection():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


# =========================================================
# REVENUE EXECUTION
# =========================================================

def execute_revenue(filters):
    """Execute the governed Revenue metric."""

    connection = get_connection()

    try:
        cursor = connection.cursor()

        query = """
            SELECT
                ROUND(SUM(revenue), 2) AS value
            FROM corporate_sales_raw
            WHERE 1=1
        """

        params = []

        if filters.get("region"):
            query += " AND LOWER(region) = LOWER(?)"
            params.append(filters["region"])

        if filters.get("year"):
            query += " AND year = ?"
            params.append(filters["year"])

        if filters.get("quarter"):
            query += " AND quarter = ?"
            params.append(filters["quarter"])

        cursor.execute(query, params)
        row = cursor.fetchone()

        return float(row["value"] or 0)

    finally:
        connection.close()


# =========================================================
# PROFIT EXECUTION
# =========================================================

def execute_profit(filters):
    """Execute the governed Profit metric."""

    connection = get_connection()

    try:
        cursor = connection.cursor()

        query = """
            SELECT
                ROUND(SUM(profit), 2) AS value
            FROM corporate_sales_raw
            WHERE 1=1
        """

        params = []

        if filters.get("region"):
            query += " AND LOWER(region) = LOWER(?)"
            params.append(filters["region"])

        if filters.get("year"):
            query += " AND year = ?"
            params.append(filters["year"])

        if filters.get("quarter"):
            query += " AND quarter = ?"
            params.append(filters["quarter"])

        cursor.execute(query, params)
        row = cursor.fetchone()

        return float(row["value"] or 0)

    finally:
        connection.close()


# =========================================================
# PROFIT MARGIN EXECUTION
# =========================================================

def execute_profit_margin(filters):
    """Execute the governed Profit Margin metric."""

    connection = get_connection()

    try:
        cursor = connection.cursor()

        query = """
            SELECT
                ROUND(
                    SUM(profit) * 100.0 /
                    NULLIF(SUM(revenue), 0),
                    2
                ) AS value
            FROM corporate_sales_raw
            WHERE 1=1
        """

        params = []

        if filters.get("region"):
            query += " AND LOWER(region) = LOWER(?)"
            params.append(filters["region"])

        if filters.get("year"):
            query += " AND year = ?"
            params.append(filters["year"])

        if filters.get("quarter"):
            query += " AND quarter = ?"
            params.append(filters["quarter"])

        cursor.execute(query, params)
        row = cursor.fetchone()

        return float(row["value"] or 0)

    finally:
        connection.close()


# =========================================================
# ORDERS EXECUTION
# =========================================================

def execute_orders(filters):
    """Execute the governed Orders metric."""

    connection = get_connection()

    try:
        cursor = connection.cursor()

        query = """
            SELECT
                COALESCE(SUM(orders), 0) AS value
            FROM corporate_sales_raw
            WHERE 1=1
        """

        params = []

        if filters.get("region"):
            query += " AND LOWER(region) = LOWER(?)"
            params.append(filters["region"])

        if filters.get("year"):
            query += " AND year = ?"
            params.append(filters["year"])

        if filters.get("quarter"):
            query += " AND quarter = ?"
            params.append(filters["quarter"])

        cursor.execute(query, params)
        row = cursor.fetchone()

        return int(row["value"] or 0)

    finally:
        connection.close()


# =========================================================
# COST DRIVER EXECUTION
# =========================================================

def execute_cost_metric(filters, field):
    """Execute a governed cost metric from the warehouse."""

    allowed_fields = {
        "material_cost",
        "shipping_cost",
        "marketing_cost",
    }

    if field not in allowed_fields:
        raise ValueError("Unsupported cost metric.")

    connection = get_connection()

    try:
        cursor = connection.cursor()

        query = f"""
            SELECT
                ROUND(SUM({field}), 2) AS value
            FROM corporate_sales_raw
            WHERE 1=1
        """

        params = []

        if filters.get("region"):
            query += " AND LOWER(region) = LOWER(?)"
            params.append(filters["region"])

        if filters.get("year"):
            query += " AND year = ?"
            params.append(filters["year"])

        if filters.get("quarter"):
            query += " AND quarter = ?"
            params.append(filters["quarter"])

        cursor.execute(query, params)
        row = cursor.fetchone()

        return float(row["value"] or 0)

    finally:
        connection.close()


# =========================================================
# AGENT
# =========================================================

def analyze_question(question: str):
    """
    Parse, validate and execute a natural-language
    MetricMind question.
    """

    # -----------------------------------------------------
    # Parse and validate
    # -----------------------------------------------------

    intent = parse_question(question)

    if intent["status"] != "validated":
        return {
            "status": "rejected",
            "question": question,
            "reason": intent.get(
                "reason",
                "Question could not be validated.",
            ),
        }

    metric = intent["metric"]
    filters = intent["filters"]


    # -----------------------------------------------------
    # Revenue
    # -----------------------------------------------------

    if metric == "revenue":

        value = execute_revenue(filters)

        return {
            "status": "verified",
            "question": question,
            "metric": "Revenue",
            "value": value,
            "filters": filters,
            "source": intent["source"],
            "formula": intent["formula"],
            "governance": "passed",
        }


    # -----------------------------------------------------
    # Profit
    # -----------------------------------------------------

    if metric == "profit":

        value = execute_profit(filters)

        return {
            "status": "verified",
            "question": question,
            "metric": "Profit",
            "value": value,
            "filters": filters,
            "source": intent["source"],
            "formula": intent["formula"],
            "governance": "passed",
        }


    # -----------------------------------------------------
    # Profit Margin
    # -----------------------------------------------------

    if metric == "profit_margin":

        value = execute_profit_margin(filters)

        return {
            "status": "verified",
            "question": question,
            "metric": "Profit Margin",
            "value": value,
            "filters": filters,
            "source": intent["source"],
            "formula": intent["formula"],
            "governance": "passed",
        }


    # -----------------------------------------------------
    # Orders
    # -----------------------------------------------------

    if metric == "orders":

        value = execute_orders(filters)

        return {
            "status": "verified",
            "question": question,
            "metric": "Orders",
            "value": value,
            "filters": filters,
            "source": intent["source"],
            "formula": intent["formula"],
            "governance": "passed",
        }


    # -----------------------------------------------------
    # Material Cost
    # -----------------------------------------------------

    if metric == "material_cost":

        value = execute_cost_metric(
            filters,
            "material_cost",
        )

        return {
            "status": "verified",
            "question": question,
            "metric": "Material Cost",
            "value": value,
            "filters": filters,
            "source": intent["source"],
            "formula": intent["formula"],
            "governance": "passed",
        }


    # -----------------------------------------------------
    # Shipping Cost
    # -----------------------------------------------------

    if metric == "shipping_cost":

        value = execute_cost_metric(
            filters,
            "shipping_cost",
        )

        return {
            "status": "verified",
            "question": question,
            "metric": "Shipping Cost",
            "value": value,
            "filters": filters,
            "source": intent["source"],
            "formula": intent["formula"],
            "governance": "passed",
        }


    # -----------------------------------------------------
    # Marketing Cost
    # -----------------------------------------------------

    if metric == "marketing_cost":

        value = execute_cost_metric(
            filters,
            "marketing_cost",
        )

        return {
            "status": "verified",
            "question": question,
            "metric": "Marketing Cost",
            "value": value,
            "filters": filters,
            "source": intent["source"],
            "formula": intent["formula"],
            "governance": "passed",
        }


    # -----------------------------------------------------
    # Certified but not yet executable
    # -----------------------------------------------------

    return {
        "status": "validated",
        "question": question,
        "intent": intent,
        "message": (
            f"Metric '{metric}' is certified but "
            "execution is not implemented yet."
        ),
    }