"""
MetricMind Agent

Executes validated semantic requests through approved
warehouse queries.

The agent never accepts raw SQL from the user.
"""

from pathlib import Path
import sqlite3
import time
from urllib.parse import quote

from backend.intent_engine import parse_question


# =========================================================
# DATABASE + QUERY GOVERNANCE
# =========================================================

DB_PATH = (
    Path(__file__).resolve().parent.parent
    / "warehouse"
    / "metricmind.db"
)

MAX_RESULT_ROWS = 100
MAX_VISUALIZATION_POINTS = 24
QUERY_TIMEOUT_SECONDS = 5

APPROVED_METRICS = {
    "revenue",
    "profit",
    "profit_margin",
    "orders",
    "material_cost",
    "shipping_cost",
    "marketing_cost",
}

APPROVED_DIMENSIONS = {
    "region",
    "quarter",
    "month",
}


def get_connection():
    """Create a governed SQLite connection."""

    connection = sqlite3.connect(
        DB_PATH,
        timeout=QUERY_TIMEOUT_SECONDS,
    )

    connection.row_factory = sqlite3.Row

    started_at = time.monotonic()

    def progress_handler():
        if (
            time.monotonic() - started_at
            > QUERY_TIMEOUT_SECONDS
        ):
            return 1

        return 0

    connection.set_progress_handler(
        progress_handler,
        10000,
    )

    return connection


def validate_query_governance(
    metric,
    dimension=None,
):
    """
    Validate that the requested metric/dimension
    is allowed by MetricMind governance policy.
    """

    if metric not in APPROVED_METRICS:
        return {
            "status": "rejected",
            "reason": (
                "Metric is not approved by the "
                "semantic governance layer."
            ),
        }

    if (
        dimension is not None
        and dimension not in APPROVED_DIMENSIONS
    ):
        return {
            "status": "rejected",
            "reason": (
                "Requested dimension is not approved "
                "by the semantic governance layer."
            ),
        }

    return {
        "status": "passed",
        "metric_allowed": True,
        "dimension_allowed": (
            True
            if dimension is None
            else dimension in APPROVED_DIMENSIONS
        ),
        "max_result_rows": MAX_RESULT_ROWS,
        "max_visualization_points": (
            MAX_VISUALIZATION_POINTS
        ),
        "query_timeout_seconds": (
            QUERY_TIMEOUT_SECONDS
        ),
    }


# =========================================================
# SHARED FILTER BUILDER
# =========================================================

def build_filter_sql(filters):
    """
    Build approved WHERE clauses using bound parameters.

    User values are never interpolated into SQL.
    """

    clauses = []
    parameters = []

    if filters.get("region"):
        clauses.append(
            "LOWER(region) = LOWER(?)"
        )
        parameters.append(
            filters["region"]
        )

    if filters.get("year"):
        clauses.append("year = ?")
        parameters.append(
            filters["year"]
        )

    if filters.get("quarter"):
        clauses.append("quarter = ?")
        parameters.append(
            filters["quarter"]
        )

    return clauses, parameters


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

        clauses, params = build_filter_sql(
            filters
        )

        for clause in clauses:
            query += f"\nAND {clause}"

        cursor.execute(
            query,
            params,
        )

        row = cursor.fetchone()

        return float(
            row["value"] or 0
        )

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

        clauses, params = build_filter_sql(
            filters
        )

        for clause in clauses:
            query += f"\nAND {clause}"

        cursor.execute(
            query,
            params,
        )

        row = cursor.fetchone()

        return float(
            row["value"] or 0
        )

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

        clauses, params = build_filter_sql(
            filters
        )

        for clause in clauses:
            query += f"\nAND {clause}"

        cursor.execute(
            query,
            params,
        )

        row = cursor.fetchone()

        return float(
            row["value"] or 0
        )

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
                COALESCE(
                    SUM(orders),
                    0
                ) AS value
            FROM corporate_sales_raw
            WHERE 1=1
        """

        clauses, params = build_filter_sql(
            filters
        )

        for clause in clauses:
            query += f"\nAND {clause}"

        cursor.execute(
            query,
            params,
        )

        row = cursor.fetchone()

        return int(
            row["value"] or 0
        )

    finally:
        connection.close()


# =========================================================
# COST DRIVER EXECUTION
# =========================================================

def execute_cost_metric(
    filters,
    field,
):
    """Execute a governed cost metric."""

    allowed_fields = {
        "material_cost",
        "shipping_cost",
        "marketing_cost",
    }

    if field not in allowed_fields:
        raise ValueError(
            "Unsupported cost metric."
        )

    connection = get_connection()

    try:
        cursor = connection.cursor()

        query = f"""
            SELECT
                ROUND(
                    SUM({field}),
                    2
                ) AS value
            FROM corporate_sales_raw
            WHERE 1=1
        """

        clauses, params = build_filter_sql(
            filters
        )

        for clause in clauses:
            query += f"\nAND {clause}"

        cursor.execute(
            query,
            params,
        )

        row = cursor.fetchone()

        return float(
            row["value"] or 0
        )

    finally:
        connection.close()


# =========================================================
# GOVERNED QUERY TRACE
# =========================================================

def build_query_trace(
    metric,
    filters,
):
    """
    Build the governed SQL representation
    used for auditability.

    User input is represented only through
    bound parameters.
    """

    metric_queries = {
        "revenue": """
SELECT
    ROUND(SUM(revenue), 2) AS value
FROM corporate_sales_raw
WHERE 1=1
""",

        "profit": """
SELECT
    ROUND(SUM(profit), 2) AS value
FROM corporate_sales_raw
WHERE 1=1
""",

        "profit_margin": """
SELECT
    ROUND(
        SUM(profit) * 100.0 /
        NULLIF(SUM(revenue), 0),
        2
    ) AS value
FROM corporate_sales_raw
WHERE 1=1
""",

        "orders": """
SELECT
    COALESCE(SUM(orders), 0) AS value
FROM corporate_sales_raw
WHERE 1=1
""",

        "material_cost": """
SELECT
    ROUND(SUM(material_cost), 2) AS value
FROM corporate_sales_raw
WHERE 1=1
""",

        "shipping_cost": """
SELECT
    ROUND(SUM(shipping_cost), 2) AS value
FROM corporate_sales_raw
WHERE 1=1
""",

        "marketing_cost": """
SELECT
    ROUND(SUM(marketing_cost), 2) AS value
FROM corporate_sales_raw
WHERE 1=1
""",
    }

    query = metric_queries.get(
        metric
    )

    if not query:
        return {
            "sql": None,
            "parameters": [],
        }

    clauses, parameters = build_filter_sql(
        filters
    )

    for clause in clauses:
        query += f"\nAND {clause}"

    return {
        "sql": query.strip(),
        "parameters": parameters,
    }


# =========================================================
# GOVERNED VISUALIZATION ENGINE
# =========================================================

def build_visualization(
    question,
    metric,
    filters,
):
    """
    Build a governed visualization when the
    question asks for a supported breakdown.

    Supported dimensions:
    - region
    - quarter
    - month
    """

    normalized = question.lower()

    # -----------------------------------------------------
    # Detect requested dimension
    # -----------------------------------------------------

    if (
        "by quarter" in normalized
        or "per quarter" in normalized
        or "quarterly" in normalized
    ):
        dimension = "quarter"

    elif (
        "by month" in normalized
        or "per month" in normalized
        or "monthly" in normalized
        or "over time" in normalized
        or "trend" in normalized
    ):
        dimension = "month"

    elif (
        "by region" in normalized
        or "per region" in normalized
        or "regional" in normalized
    ):
        dimension = "region"

    else:
        return None

    # -----------------------------------------------------
    # Governance validation
    # -----------------------------------------------------

    governance = validate_query_governance(
        metric,
        dimension,
    )

    if governance["status"] != "passed":
        return None

    # -----------------------------------------------------
    # Governed metric fields
    # -----------------------------------------------------

    metric_fields = {
        "revenue": "revenue",
        "profit": "profit",
        "orders": "orders",
        "material_cost": "material_cost",
        "shipping_cost": "shipping_cost",
        "marketing_cost": "marketing_cost",
    }

    if metric == "profit_margin":

        aggregation = """
            ROUND(
                SUM(profit) * 100.0 /
                NULLIF(SUM(revenue), 0),
                2
            )
        """

    else:

        field = metric_fields.get(
            metric
        )

        if not field:
            return None

        aggregation = f"""
            ROUND(
                SUM({field}),
                2
            )
        """

    # -----------------------------------------------------
    # Dimension SQL
    # -----------------------------------------------------

    if dimension == "region":

        select_dimension = "region"

        group_by = "region"

        order_by = "value DESC"

        label_name = "Region"

        chart_title = (
            f"{metric.replace('_', ' ').title()} "
            "by Region"
        )

    elif dimension == "quarter":

        if filters.get("year"):

            select_dimension = "quarter"

            group_by = "quarter"

            order_by = """
                CASE quarter
                    WHEN 'Q1' THEN 1
                    WHEN 'Q2' THEN 2
                    WHEN 'Q3' THEN 3
                    WHEN 'Q4' THEN 4
                END
            """

        else:

            select_dimension = """
                CAST(year AS TEXT)
                || ' '
                || quarter
            """

            group_by = "year, quarter"

            order_by = """
                year,
                CASE quarter
                    WHEN 'Q1' THEN 1
                    WHEN 'Q2' THEN 2
                    WHEN 'Q3' THEN 3
                    WHEN 'Q4' THEN 4
                END
            """

        label_name = "Quarter"

        chart_title = (
            f"{metric.replace('_', ' ').title()} "
            "by Quarter"
        )

    else:

        select_dimension = """
            CAST(year AS TEXT)
            || '-'
            || printf('%02d', month)
        """

        group_by = "year, month"

        order_by = "year, month"

        label_name = "Month"

        chart_title = (
            f"{metric.replace('_', ' ').title()} "
            "by Month"
        )

    # -----------------------------------------------------
    # Build governed SQL
    # -----------------------------------------------------

    query = f"""
        SELECT
            {select_dimension} AS label,
            {aggregation} AS value
        FROM corporate_sales_raw
        WHERE 1=1
    """

    clauses, parameters = build_filter_sql(
        filters
    )

    for clause in clauses:
        query += f"\nAND {clause}"

    query += f"""
        GROUP BY {group_by}
        ORDER BY {order_by}
        LIMIT {MAX_VISUALIZATION_POINTS}
    """

    # -----------------------------------------------------
    # Execute
    # -----------------------------------------------------

    connection = get_connection()

    try:

        cursor = connection.cursor()

        cursor.execute(
            query,
            parameters,
        )

        rows = cursor.fetchmany(
            MAX_VISUALIZATION_POINTS
        )

        data = [
            {
                "label": row["label"],
                "value": float(
                    row["value"] or 0
                ),
            }
            for row in rows
        ]

    finally:

        connection.close()

    if not data:
        return None

    return {
        "type": "bar",
        "title": chart_title,
        "dimension": label_name,
        "metric": metric,
        "data": data,
        "governance": "passed",
        "source": "corporate_sales_raw",
        "limits": {
            "max_points": (
                MAX_VISUALIZATION_POINTS
            ),
            "returned_points": len(data),
        },
        "query_trace": {
            "sql": query.strip(),
            "parameters": parameters,
        },
    }


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

    intent = parse_question(
        question
    )

    if intent["status"] != "validated":

        return {
            "status": "rejected",
            "question": question,
            "reason": intent.get(
                "reason",
                "Question could not be validated.",
            ),
            "governance": "rejected",
        }

    metric = intent["metric"]

    filters = intent["filters"]

    # -----------------------------------------------------
    # Governance validation
    # -----------------------------------------------------

    governance = validate_query_governance(
        metric
    )

    if governance["status"] != "passed":

        return {
            "status": "rejected",
            "question": question,
            "reason": governance["reason"],
            "governance": "rejected",
        }

    # -----------------------------------------------------
    # Execute governed metric
    # -----------------------------------------------------

    if metric == "revenue":

        value = execute_revenue(
            filters
        )

    elif metric == "profit":

        value = execute_profit(
            filters
        )

    elif metric == "profit_margin":

        value = execute_profit_margin(
            filters
        )

    elif metric == "orders":

        value = execute_orders(
            filters
        )

    elif metric == "material_cost":

        value = execute_cost_metric(
            filters,
            "material_cost",
        )

    elif metric == "shipping_cost":

        value = execute_cost_metric(
            filters,
            "shipping_cost",
        )

    elif metric == "marketing_cost":

        value = execute_cost_metric(
            filters,
            "marketing_cost",
        )

    else:

        return {
            "status": "rejected",
            "question": question,
            "reason": "Unsupported metric.",
            "governance": "rejected",
        }

    # -----------------------------------------------------
    # Query transparency
    # -----------------------------------------------------

    query_trace = build_query_trace(
        metric,
        filters,
    )

    api_call = (
        "/api/agent/analyze"
        f"?question={quote(question)}"
    )

    # -----------------------------------------------------
    # Automatic visualization
    # -----------------------------------------------------

    visualization = build_visualization(
        question,
        metric,
        filters,
    )

    # -----------------------------------------------------
    # Metric labels
    # -----------------------------------------------------

    metric_labels = {
        "revenue": "Revenue",
        "profit": "Profit",
        "profit_margin": "Profit Margin",
        "orders": "Orders",
        "material_cost": "Material Cost",
        "shipping_cost": "Shipping Cost",
        "marketing_cost": "Marketing Cost",
    }

    # -----------------------------------------------------
    # Final governed response
    # -----------------------------------------------------

    return {
        "status": "verified",
        "question": question,
        "metric": metric_labels[metric],
        "value": value,
        "filters": filters,
        "source": intent["source"],
        "formula": intent["formula"],
        "governance": "passed",
        "governance_policy": {
            "status": "passed",
            "max_result_rows": MAX_RESULT_ROWS,
            "max_visualization_points": (
                MAX_VISUALIZATION_POINTS
            ),
            "query_timeout_seconds": (
                QUERY_TIMEOUT_SECONDS
            ),
            "metric_allowed": True,
        },
        "query_trace": query_trace,
        "api_call": api_call,
        "visualization": visualization,
    }