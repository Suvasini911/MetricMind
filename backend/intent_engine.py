"""
MetricMind Intent Engine

Converts natural-language business questions into
validated semantic requests.

No SQL is generated here.
The engine only identifies certified metrics and
approved dimensions.
"""

import re

from backend.semantic_layer import (
    get_metric,
    list_dimensions,
)


METRIC_ALIASES = {
    "revenue": [
        "revenue",
        "sales",
        "selling",
        "sell",
    ],
    "profit": [
        "profit",
        "earnings",
    ],
    "profit_margin": [
        "margin",
        "margins",
        "profit margin",
        "profitability",
    ],
    "orders": [
        "orders",
        "order count",
        "number of orders",
    ],
    "material_cost": [
        "material cost",
        "material costs",
    ],
    "shipping_cost": [
        "shipping cost",
        "shipping costs",
        "delivery cost",
    ],
    "marketing_cost": [
        "marketing cost",
        "marketing costs",
    ],
}


def detect_metric(question: str):
    """
    Identify a certified metric from the question.
    """

    normalized = question.lower()

    matches = []

    for metric, aliases in METRIC_ALIASES.items():
        for alias in aliases:
            if alias in normalized:
                matches.append(metric)
                break

    # Prefer the most specific metric.
    if "profit margin" in normalized:
        return "profit_margin"

    if matches:
        return matches[0]

    return None


def detect_region(question: str):
    normalized = question.lower()

    for region in list_dimensions()["region"]["values"]:
        if region.lower() in normalized:
            return region

    return None


def detect_year(question: str):
    match = re.search(r"\b(20\d{2})\b", question)

    if not match:
        return None

    year = int(match.group(1))

    allowed_years = list_dimensions()["year"]["values"]

    if year in allowed_years:
        return year

    return None


def detect_quarter(question: str):
    normalized = question.lower()

    patterns = {
        "Q1": [
            "q1",
            "first quarter",
        ],
        "Q2": [
            "q2",
            "second quarter",
        ],
        "Q3": [
            "q3",
            "third quarter",
        ],
        "Q4": [
            "q4",
            "fourth quarter",
        ],
    }

    for quarter, aliases in patterns.items():
        for alias in aliases:
            if alias in normalized:
                return quarter

    return None


def validate_dimensions(metric_name, filters):
    """
    Ensure requested filters are allowed for the metric.
    """

    metric = get_metric(metric_name)

    if not metric:
        return {
            "valid": False,
            "reason": "Metric is not certified.",
        }

    allowed_dimensions = metric["dimensions"]

    for dimension in filters:
        if dimension not in allowed_dimensions:
            return {
                "valid": False,
                "reason": (
                    f"Metric '{metric_name}' does not support "
                    f"the '{dimension}' dimension."
                ),
            }

    return {
        "valid": True,
        "reason": None,
    }


def parse_question(question: str):
    """
    Convert a natural-language question into a
    governed semantic request.
    """

    if not question or not question.strip():
        return {
            "status": "rejected",
            "reason": "Question is empty.",
        }

    metric_name = detect_metric(question)

    if not metric_name:
        return {
            "status": "rejected",
            "reason": (
                "No certified MetricMind metric "
                "was detected."
            ),
        }

    filters = {}

    region = detect_region(question)
    year = detect_year(question)
    quarter = detect_quarter(question)

    if region:
        filters["region"] = region

    if year:
        filters["year"] = year

    if quarter:
        filters["quarter"] = quarter

    validation = validate_dimensions(
        metric_name,
        filters,
    )

    if not validation["valid"]:
        return {
            "status": "rejected",
            "metric": metric_name,
            "filters": filters,
            "reason": validation["reason"],
        }

    metric = get_metric(metric_name)

    return {
        "status": "validated",
        "metric": metric_name,
        "metric_label": metric["label"],
        "filters": filters,
        "source": metric["source"],
        "formula": metric["formula"],
        "format": metric["format"],
    }