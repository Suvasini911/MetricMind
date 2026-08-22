from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import pandas as pd


app = FastAPI(
    title="MetricMind Analytics API",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


BASE_DIR = Path(__file__).resolve().parent.parent

DATA_FILE = (
    BASE_DIR
    / "data"
    / "processed"
    / "clean_sales.csv"
)

df = pd.read_csv(DATA_FILE)


@app.get("/")
def health_check():
    return {
        "status": "healthy",
        "service": "MetricMind Analytics API",
        "records_loaded": len(df)
    }


@app.get("/api/query")
def query_metricmind(question: str = Query(...)):

    normalized = question.lower()

    # Q3 Revenue
    if "q3" in normalized and "revenue" in normalized:

        result = df[
            df["quarter"] == "Q3"
        ]["revenue"].sum()

        return {
            "status": "verified",
            "metric": "Revenue",
            "dimension": "Quarter",
            "filter": "Q3",
            "value": round(float(result), 2)
        }

    # European Sales
    if (
        "europe" in normalized
        and ("sales" in normalized or "revenue" in normalized)
    ):

        result = df[
            df["region"] == "Europe"
        ]["revenue"].sum()

        return {
            "status": "verified",
            "metric": "Revenue",
            "dimension": "Region",
            "filter": "Europe",
            "value": round(float(result), 2)
        }

    # Highest Margin Region
    if "highest margin" in normalized:

        grouped = df.groupby("region").agg(
            revenue=("revenue", "sum"),
            profit=("profit", "sum")
        )

        grouped["margin"] = (
            grouped["profit"] / grouped["revenue"]
        )

        region = grouped["margin"].idxmax()
        value = grouped.loc[region, "margin"]

        return {
            "status": "verified",
            "metric": "Margin",
            "dimension": "Region",
            "filter": region,
            "value": round(float(value), 4)
        }

        # European Margin Root-Cause Analysis
    if (
        "european" in normalized
        or "europe" in normalized
    ) and (
        "margin" in normalized
        or "margins" in normalized
    ) and (
        "drop" in normalized
        or "why" in normalized
    ):

        europe = df[df["region"] == "Europe"].copy()

        if "quarter" in europe.columns:
            europe_q3 = europe[europe["quarter"] == "Q3"]
        else:
            europe_q3 = europe

        revenue = europe_q3["revenue"].sum()
        profit = europe_q3["profit"].sum()

        margin = profit / revenue if revenue else 0

        return {
            "status": "verified",
            "metric": "Margin",
            "dimension": "Region / Quarter",
            "filter": "Europe / Q3",
            "value": round(float(margin), 4),
            "analysis": {
                "revenue": round(float(revenue), 2),
                "profit": round(float(profit), 2),
                "margin": round(float(margin * 100), 2),
            }
        }

    return {
        "status": "recognized",
        "message": (
            "MetricMind recognized this question, "
            "but this governed query is not implemented yet."
        )
    }