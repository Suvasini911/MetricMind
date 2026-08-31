"""
MetricMind Governed Semantic Layer

Central registry for certified business metrics and dimensions.
The conversational agent will use this registry instead of inventing
metric definitions or querying the warehouse directly.
"""

METRIC_REGISTRY = {
    "revenue": {
        "label": "Revenue",
        "description": "Total recognized revenue.",
        "source": "regional_revenue",
        "field": "revenue",
        "formula": "SUM(revenue)",
        "format": "currency",
        "dimensions": ["region", "year", "quarter"],
    },
    "profit": {
        "label": "Profit",
        "description": "Total profit after governed costs.",
        "source": "regional_performance",
        "field": "total_profit",
        "formula": "total_profit",
        "format": "currency",
        "dimensions": ["region"],
    },
    "profit_margin": {
        "label": "Profit Margin",
        "description": "Profit as a percentage of revenue.",
        "source": "regional_performance",
        "field": "profit_margin",
        "formula": "total_profit / total_revenue * 100",
        "format": "percentage",
        "dimensions": ["region"],
    },
    "orders": {
        "label": "Orders",
        "description": "Total recorded orders.",
        "source": "regional_performance",
        "field": "total_orders",
        "formula": "SUM(total_orders)",
        "format": "number",
        "dimensions": ["region"],
    },
    "material_cost": {
        "label": "Material Cost",
        "description": "Total material cost.",
        "source": "cost_driver_analysis",
        "field": "material_cost",
        "formula": "SUM(material_cost)",
        "format": "currency",
        "dimensions": ["region", "year", "quarter"],
    },
    "shipping_cost": {
        "label": "Shipping Cost",
        "description": "Total shipping cost.",
        "source": "cost_driver_analysis",
        "field": "shipping_cost",
        "formula": "SUM(shipping_cost)",
        "format": "currency",
        "dimensions": ["region", "year", "quarter"],
    },
    "marketing_cost": {
        "label": "Marketing Cost",
        "description": "Total marketing cost.",
        "source": "cost_driver_analysis",
        "field": "marketing_cost",
        "formula": "SUM(marketing_cost)",
        "format": "currency",
        "dimensions": ["region", "year", "quarter"],
    },
}


DIMENSIONS = {
    "region": {
        "label": "Region",
        "type": "string",
        "values": [
            "Asia",
            "Europe",
            "North America",
        ],
    },
    "year": {
        "label": "Year",
        "type": "integer",
        "values": [2025],
    },
    "quarter": {
        "label": "Quarter",
        "type": "string",
        "values": ["Q1", "Q2", "Q3", "Q4"],
    },
}


def get_metric(metric_name: str):
    """Return a certified metric definition."""
    return METRIC_REGISTRY.get(metric_name.lower())


def list_metrics():
    """Return all certified metrics."""
    return METRIC_REGISTRY


def list_dimensions():
    """Return all governed dimensions."""
    return DIMENSIONS