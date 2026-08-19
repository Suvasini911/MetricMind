import csv
import sqlite3
from pathlib import Path


# =========================================================
# MetricMind - Local Warehouse Loader
# =========================================================

BASE_DIR = Path(__file__).parent

CSV_FILE = BASE_DIR / "raw" / "corporate_sales.csv"

DATABASE_DIR = BASE_DIR.parent / "warehouse"

DATABASE_FILE = DATABASE_DIR / "metricmind.db"


def create_database():
    """Create the local MetricMind warehouse."""

    DATABASE_DIR.mkdir(
        parents=True,
        exist_ok=True
    )

    connection = sqlite3.connect(DATABASE_FILE)

    cursor = connection.cursor()

    print("=" * 60)
    print("METRICMIND LOCAL WAREHOUSE")
    print("=" * 60)

    # -----------------------------------------------------
    # Raw table
    # -----------------------------------------------------

    cursor.execute("""
        DROP TABLE IF EXISTS corporate_sales_raw
    """)

    cursor.execute("""
        CREATE TABLE corporate_sales_raw (

            order_id TEXT PRIMARY KEY,

            order_date TEXT,

            year INTEGER,

            quarter TEXT,

            month INTEGER,

            region TEXT,

            country TEXT,

            product_category TEXT,

            product TEXT,

            customer_segment TEXT,

            revenue REAL,

            material_cost REAL,

            shipping_cost REAL,

            marketing_cost REAL,

            total_cost REAL,

            profit REAL,

            margin REAL,

            orders INTEGER

        )
    """)

    print("✓ Raw warehouse table created")

    # -----------------------------------------------------
    # Load CSV
    # -----------------------------------------------------

    with open(
        CSV_FILE,
        "r",
        encoding="utf-8"
    ) as file:

        reader = csv.DictReader(file)

        rows = []

        for row in reader:

            rows.append((
                row["order_id"],
                row["order_date"],
                int(row["year"]),
                row["quarter"],
                int(row["month"]),
                row["region"],
                row["country"],
                row["product_category"],
                row["product"],
                row["customer_segment"],
                float(row["revenue"]),
                float(row["material_cost"]),
                float(row["shipping_cost"]),
                float(row["marketing_cost"]),
                float(row["total_cost"]),
                float(row["profit"]),
                float(row["margin"]),
                int(row["orders"])
            ))

    cursor.executemany("""
        INSERT INTO corporate_sales_raw (

            order_id,
            order_date,
            year,
            quarter,
            month,
            region,
            country,
            product_category,
            product,
            customer_segment,
            revenue,
            material_cost,
            shipping_cost,
            marketing_cost,
            total_cost,
            profit,
            margin,
            orders

        )

        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, rows)

    print(f"✓ Loaded {len(rows):,} records")

    # -----------------------------------------------------
    # Analytics View
    # -----------------------------------------------------

    cursor.execute("""
        DROP VIEW IF EXISTS sales_analytics
    """)

    cursor.execute("""
        CREATE VIEW sales_analytics AS

        SELECT

            order_id,
            order_date,
            year,
            quarter,
            month,
            region,
            country,
            product_category,
            product,
            customer_segment,

            revenue,

            material_cost,

            shipping_cost,

            marketing_cost,

            total_cost,

            profit,

            margin,

            orders,

            shipping_cost / NULLIF(revenue, 0)
                AS shipping_cost_pct,

            material_cost / NULLIF(revenue, 0)
                AS material_cost_pct,

            marketing_cost / NULLIF(revenue, 0)
                AS marketing_cost_pct

        FROM corporate_sales_raw
    """)

    print("✓ Sales analytics view created")

    # -----------------------------------------------------
    # Regional Performance
    # -----------------------------------------------------

    cursor.execute("""
        DROP VIEW IF EXISTS regional_performance
    """)

    cursor.execute("""
        CREATE VIEW regional_performance AS

        SELECT

            region,

            SUM(revenue)
                AS total_revenue,

            SUM(total_cost)
                AS total_cost,

            SUM(profit)
                AS total_profit,

            SUM(profit)
                / NULLIF(SUM(revenue), 0)
                AS profit_margin,

            SUM(orders)
                AS total_orders

        FROM corporate_sales_raw

        GROUP BY region
    """)

    print("✓ Regional performance view created")

    # -----------------------------------------------------
    # Monthly Performance
    # -----------------------------------------------------

    cursor.execute("""
        DROP VIEW IF EXISTS monthly_performance
    """)

    cursor.execute("""
        CREATE VIEW monthly_performance AS

        SELECT

            year,

            quarter,

            month,

            SUM(revenue)
                AS total_revenue,

            SUM(total_cost)
                AS total_cost,

            SUM(profit)
                AS total_profit,

            SUM(profit)
                / NULLIF(SUM(revenue), 0)
                AS profit_margin,

            SUM(orders)
                AS total_orders

        FROM corporate_sales_raw

        GROUP BY
            year,
            quarter,
            month
    """)

    print("✓ Monthly performance view created")

    # -----------------------------------------------------
    # Cost Driver Analysis
    # -----------------------------------------------------

    cursor.execute("""
        DROP VIEW IF EXISTS cost_driver_analysis
    """)

    cursor.execute("""
        CREATE VIEW cost_driver_analysis AS

        SELECT

            region,

            year,

            quarter,

            SUM(revenue)
                AS total_revenue,

            SUM(material_cost)
                AS material_cost,

            SUM(shipping_cost)
                AS shipping_cost,

            SUM(marketing_cost)
                AS marketing_cost,

            SUM(total_cost)
                AS total_cost,

            SUM(profit)
                AS total_profit,

            SUM(profit)
                / NULLIF(SUM(revenue), 0)
                AS profit_margin

        FROM corporate_sales_raw

        GROUP BY
            region,
            year,
            quarter
    """)

    print("✓ Cost driver analysis view created")

    connection.commit()

    # -----------------------------------------------------
    # Validation
    # -----------------------------------------------------

    cursor.execute("""
        SELECT COUNT(*)
        FROM corporate_sales_raw
    """)

    record_count = cursor.fetchone()[0]

    print()
    print(f"Warehouse records : {record_count:,}")

    cursor.execute("""
        SELECT
            region,
            ROUND(SUM(revenue), 2) AS revenue
        FROM corporate_sales_raw
        GROUP BY region
        ORDER BY revenue DESC
    """)

    print()
    print("Regional Revenue")
    print("-" * 40)

    for region, revenue in cursor.fetchall():

        print(
            f"{region:<20} "
            f"{revenue:,.2f}"
        )

    connection.close()

    print()
    print("=" * 60)
    print("WAREHOUSE CREATED SUCCESSFULLY")
    print("=" * 60)
    print(f"Database: {DATABASE_FILE}")


if __name__ == "__main__":
    create_database()