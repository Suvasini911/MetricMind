"""
MetricMind Agent

Executes validated semantic requests through approved
warehouse queries.

The agent never accepts raw SQL from the user.
"""

from backend.intent_engine import parse_question
from pathlib import Path
import sqlite3

from backend.intent_engine import parse_question
from backend.semantic_layer import list_metrics, list_dimensions


DB_PATH = Path(__file__).resolve().parent.parent / "warehouse" / "metricmind.db"


def get_connection():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


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


def analyze_question(question: str):
    """
    Parse, validate and execute a natural-language
    MetricMind question.
    """

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

    return {
        "status": "validated",
        "question": question,
        "intent": intent,
        "message": (
            f"Metric '{metric}' is certified but "
            "execution is not implemented yet."
        ),
    }