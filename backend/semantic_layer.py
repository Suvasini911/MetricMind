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
    "description": "Total profit.",
    "source": "corporate_sales_raw",
    "field": "profit",
    "formula": "SUM(profit)",
    "format": "currency",
    "dimensions": ["region", "year", "quarter"],
},
    "profit_margin": {
    "label": "Profit Margin",
    "description": "Profit as a percentage of revenue.",
    "source": "corporate_sales_raw",
    "field": "profit",
    "formula": "SUM(profit) / SUM(revenue) * 100",
    "format": "percentage",
    "dimensions": ["region", "year", "quarter"],
},
    "orders": {
    "label": "Orders",
    "description": "Total recorded orders.",
    "source": "corporate_sales_raw",
    "field": "orders",
    "formula": "SUM(orders)",
    "format": "number",
    "dimensions": ["region", "year", "quarter"],
},
    "material_cost": {
    "label": "Material Cost",
    "description": "Total material cost.",
    "source": "corporate_sales_raw",
    "field": "material_cost",
    "formula": "SUM(material_cost)",
    "format": "currency",
    "dimensions": ["region", "year", "quarter"],
},
    "shipping_cost": {
    "label": "Shipping Cost",
    "description": "Total shipping cost.",
    "source": "corporate_sales_raw",
    "field": "shipping_cost",
    "formula": "SUM(shipping_cost)",
    "format": "currency",
    "dimensions": ["region", "year", "quarter"],
},
    "marketing_cost": {
    "label": "Marketing Cost",
    "description": "Total marketing cost.",
    "source": "corporate_sales_raw",
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