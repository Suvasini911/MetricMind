import csv
import random
from datetime import date, timedelta
from pathlib import Path

# ---------------------------------------------------------
# MetricMind - Corporate Sales Dataset Generator
# ---------------------------------------------------------

random.seed(42)

OUTPUT_FILE = Path(__file__).parent / "raw" / "corporate_sales.csv"

NUM_RECORDS = 2000

countries = {
    "Europe": ["Germany", "France", "Italy", "Spain", "Netherlands"],
    "Asia": ["India", "Japan", "Singapore", "South Korea", "Thailand"],
    "North America": ["USA", "Canada", "Mexico"]
}

products = {
    "Electronics": [
        "Laptop Pro",
        "Smartphone X",
        "Tablet Air",
        "Monitor Ultra"
    ],
    "Furniture": [
        "Office Desk",
        "Ergonomic Chair",
        "Conference Table",
        "Storage Cabinet"
    ],
    "Software": [
        "Analytics Suite",
        "Cloud Platform",
        "Security Pro",
        "CRM Enterprise"
    ],
    "Accessories": [
        "Wireless Mouse",
        "Keyboard Pro",
        "USB Hub",
        "Webcam HD"
    ]
}

customer_segments = [
    "Enterprise",
    "SMB",
    "Consumer"
]

regions = list(countries.keys())
categories = list(products.keys())

start_date = date(2025, 1, 1)
end_date = date(2025, 12, 31)

date_range = (end_date - start_date).days


def get_quarter(month):
    if month <= 3:
        return "Q1"
    elif month <= 6:
        return "Q2"
    elif month <= 9:
        return "Q3"
    return "Q4"


def generate_record(index):
    order_date = start_date + timedelta(
        days=random.randint(0, date_range)
    )

    year = order_date.year
    quarter = get_quarter(order_date.month)

    region = random.choice(regions)
    country = random.choice(countries[region])

    category = random.choice(categories)
    product = random.choice(products[category])

    customer_segment = random.choice(customer_segments)

    # ---------------------------------------------
    # Revenue generation
    # ---------------------------------------------

    base_revenue = random.uniform(500, 15000)

    # Enterprise customers generally generate
    # larger transaction values.
    if customer_segment == "Enterprise":
        base_revenue *= 1.8
    elif customer_segment == "SMB":
        base_revenue *= 1.2

    # ---------------------------------------------
    # Europe Q3 business scenario
    # ---------------------------------------------

    # We deliberately introduce a cost increase in
    # European Q3 transactions so MetricMind can
    # later identify a root cause for margin decline.
    europe_q3 = region == "Europe" and quarter == "Q3"

    # ---------------------------------------------
    # Cost generation
    # ---------------------------------------------

    material_rate = random.uniform(0.48, 0.58)

    shipping_rate = random.uniform(0.06, 0.09)

    marketing_rate = random.uniform(0.04, 0.07)

    # Intentional business anomaly:
    # European shipping costs increase during Q3.
    if europe_q3:
        shipping_rate *= 1.55

    material_cost = base_revenue * material_rate
    shipping_cost = base_revenue * shipping_rate
    marketing_cost = base_revenue * marketing_rate

    total_cost = (
        material_cost
        + shipping_cost
        + marketing_cost
    )

    profit = base_revenue - total_cost

    margin = profit / base_revenue

    # Approximate order quantity
    orders = random.randint(1, 15)

    return {
        "order_id": f"ORD-{index:05d}",
        "order_date": order_date.isoformat(),
        "year": year,
        "quarter": quarter,
        "month": order_date.month,
        "region": region,
        "country": country,
        "product_category": category,
        "product": product,
        "customer_segment": customer_segment,
        "revenue": round(base_revenue, 2),
        "material_cost": round(material_cost, 2),
        "shipping_cost": round(shipping_cost, 2),
        "marketing_cost": round(marketing_cost, 2),
        "total_cost": round(total_cost, 2),
        "profit": round(profit, 2),
        "margin": round(margin, 4),
        "orders": orders
    }


def main():
    OUTPUT_FILE.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    fieldnames = [
        "order_id",
        "order_date",
        "year",
        "quarter",
        "month",
        "region",
        "country",
        "product_category",
        "product",
        "customer_segment",
        "revenue",
        "material_cost",
        "shipping_cost",
        "marketing_cost",
        "total_cost",
        "profit",
        "margin",
        "orders"
    ]

    records = [
        generate_record(i)
        for i in range(1, NUM_RECORDS + 1)
    ]

    with open(
        OUTPUT_FILE,
        "w",
        newline="",
        encoding="utf-8"
    ) as file:

        writer = csv.DictWriter(
            file,
            fieldnames=fieldnames
        )

        writer.writeheader()
        writer.writerows(records)

    print("=" * 60)
    print("MetricMind Dataset Generated Successfully")
    print("=" * 60)
    print(f"Records : {NUM_RECORDS}")
    print(f"Output  : {OUTPUT_FILE}")
    print("=" * 60)


if __name__ == "__main__":
    main()