import pandas as pd
from pathlib import Path


# =========================================================
# MetricMind - Data Transformation Pipeline
# =========================================================

BASE_DIR = Path(__file__).parent

RAW_FILE = BASE_DIR / "raw" / "corporate_sales.csv"
PROCESSED_DIR = BASE_DIR / "processed"

CLEAN_FILE = PROCESSED_DIR / "clean_sales.csv"
REGION_FILE = PROCESSED_DIR / "regional_sales.csv"
PRODUCT_FILE = PROCESSED_DIR / "product_sales.csv"
MONTHLY_FILE = PROCESSED_DIR / "monthly_sales.csv"


def load_data():
    """Load the raw corporate sales dataset."""

    print("Loading raw dataset...")

    df = pd.read_csv(RAW_FILE)

    print(f"Loaded {len(df):,} records.")

    return df


def clean_data(df):
    """Clean and validate the raw dataset."""

    print("\nStarting data cleaning...")

    # -----------------------------------------------------
    # Remove duplicate records
    # -----------------------------------------------------

    duplicates = df.duplicated().sum()

    print(f"Duplicate rows found: {duplicates}")

    df = df.drop_duplicates()

    # -----------------------------------------------------
    # Convert date column
    # -----------------------------------------------------

    df["order_date"] = pd.to_datetime(
        df["order_date"],
        errors="coerce"
    )

    # -----------------------------------------------------
    # Check missing values
    # -----------------------------------------------------

    missing_before = df.isnull().sum().sum()

    print(
        f"Missing values before cleaning: "
        f"{missing_before}"
    )

    # Remove rows with critical missing values
    critical_columns = [
        "order_date",
        "region",
        "country",
        "product",
        "revenue",
        "total_cost"
    ]

    df = df.dropna(subset=critical_columns)

    # -----------------------------------------------------
    # Validate numerical values
    # -----------------------------------------------------

    numeric_columns = [
        "revenue",
        "material_cost",
        "shipping_cost",
        "marketing_cost",
        "total_cost",
        "profit",
        "margin",
        "orders"
    ]

    for column in numeric_columns:
        df[column] = pd.to_numeric(
            df[column],
            errors="coerce"
        )

    # Remove invalid revenue/cost records
    df = df[
        (df["revenue"] >= 0)
        & (df["total_cost"] >= 0)
        & (df["orders"] > 0)
    ]

    # -----------------------------------------------------
    # Recalculate important business metrics
    # -----------------------------------------------------

    df["total_cost"] = (
        df["material_cost"]
        + df["shipping_cost"]
        + df["marketing_cost"]
    )

    df["profit"] = (
        df["revenue"]
        - df["total_cost"]
    )

    df["margin"] = (
        df["profit"]
        / df["revenue"]
    )

    # -----------------------------------------------------
    # Add useful analytical fields
    # -----------------------------------------------------

    df["year"] = df["order_date"].dt.year

    df["month"] = df["order_date"].dt.month

    df["month_name"] = (
        df["order_date"]
        .dt.strftime("%B")
    )

    df["quarter"] = (
        "Q"
        + df["order_date"]
        .dt.quarter.astype(str)
    )

    # Cost contribution percentages

    df["shipping_cost_pct"] = (
        df["shipping_cost"]
        / df["revenue"]
    )

    df["material_cost_pct"] = (
        df["material_cost"]
        / df["revenue"]
    )

    df["marketing_cost_pct"] = (
        df["marketing_cost"]
        / df["revenue"]
    )

    # -----------------------------------------------------
    # Round calculated metrics
    # -----------------------------------------------------

    percentage_columns = [
        "margin",
        "shipping_cost_pct",
        "material_cost_pct",
        "marketing_cost_pct"
    ]

    for column in percentage_columns:
        df[column] = df[column].round(4)

    money_columns = [
        "revenue",
        "material_cost",
        "shipping_cost",
        "marketing_cost",
        "total_cost",
        "profit"
    ]

    for column in money_columns:
        df[column] = df[column].round(2)

    print(f"Records after cleaning: {len(df):,}")

    return df


def create_aggregations(df):
    """Create analytical tables for the transformed layer."""

    print("\nCreating analytical tables...")

    # -----------------------------------------------------
    # Regional sales
    # -----------------------------------------------------

    regional = (
        df.groupby("region")
        .agg(
            revenue=("revenue", "sum"),
            total_cost=("total_cost", "sum"),
            profit=("profit", "sum"),
            orders=("orders", "sum")
        )
        .reset_index()
    )

    regional["margin"] = (
        regional["profit"]
        / regional["revenue"]
    )

    # -----------------------------------------------------
    # Product sales
    # -----------------------------------------------------

    product = (
        df.groupby(
            ["product_category", "product"]
        )
        .agg(
            revenue=("revenue", "sum"),
            total_cost=("total_cost", "sum"),
            profit=("profit", "sum"),
            orders=("orders", "sum")
        )
        .reset_index()
    )

    product["margin"] = (
        product["profit"]
        / product["revenue"]
    )

    # -----------------------------------------------------
    # Monthly sales
    # -----------------------------------------------------

    monthly = (
        df.groupby(
            ["year", "quarter", "month"]
        )
        .agg(
            revenue=("revenue", "sum"),
            total_cost=("total_cost", "sum"),
            profit=("profit", "sum"),
            orders=("orders", "sum")
        )
        .reset_index()
    )

    monthly["margin"] = (
        monthly["profit"]
        / monthly["revenue"]
    )

    return regional, product, monthly


def save_data(df, regional, product, monthly):
    """Save transformed datasets."""

    PROCESSED_DIR.mkdir(
        parents=True,
        exist_ok=True
    )

    df.to_csv(
        CLEAN_FILE,
        index=False
    )

    regional.to_csv(
        REGION_FILE,
        index=False
    )

    product.to_csv(
        PRODUCT_FILE,
        index=False
    )

    monthly.to_csv(
        MONTHLY_FILE,
        index=False
    )

    print("\nFiles created:")

    print(f"✓ {CLEAN_FILE}")
    print(f"✓ {REGION_FILE}")
    print(f"✓ {PRODUCT_FILE}")
    print(f"✓ {MONTHLY_FILE}")


def main():

    print("=" * 60)
    print("METRICMIND DATA TRANSFORMATION PIPELINE")
    print("=" * 60)

    df = load_data()

    df = clean_data(df)

    regional, product, monthly = create_aggregations(df)

    save_data(
        df,
        regional,
        product,
        monthly
    )

    print("\n" + "=" * 60)
    print("TRANSFORMATION COMPLETED SUCCESSFULLY")
    print("=" * 60)


if __name__ == "__main__":
    main()