-- =========================================================
-- MetricMind - Analytics Layer
-- =========================================================

CREATE OR REPLACE VIEW METRICMIND.ANALYTICS.SALES_ANALYTICS AS

SELECT

    ORDER_ID,

    ORDER_DATE,

    YEAR,

    QUARTER,

    MONTH,

    REGION,

    COUNTRY,

    PRODUCT_CATEGORY,

    PRODUCT,

    CUSTOMER_SEGMENT,

    REVENUE,

    MATERIAL_COST,

    SHIPPING_COST,

    MARKETING_COST,

    TOTAL_COST,

    PROFIT,

    MARGIN,

    ORDERS,

    SHIPPING_COST / NULLIF(REVENUE, 0)
        AS SHIPPING_COST_PCT,

    MATERIAL_COST / NULLIF(REVENUE, 0)
        AS MATERIAL_COST_PCT,

    MARKETING_COST / NULLIF(REVENUE, 0)
        AS MARKETING_COST_PCT

FROM METRICMIND.RAW.CORPORATE_SALES_RAW;

-- =========================================================
-- Regional Performance
-- =========================================================

CREATE OR REPLACE VIEW METRICMIND.ANALYTICS.REGIONAL_PERFORMANCE AS

SELECT

    REGION,

    SUM(REVENUE) AS TOTAL_REVENUE,

    SUM(TOTAL_COST) AS TOTAL_COST,

    SUM(PROFIT) AS TOTAL_PROFIT,

    SUM(PROFIT)
        / NULLIF(SUM(REVENUE), 0)
        AS PROFIT_MARGIN,

    SUM(ORDERS) AS TOTAL_ORDERS

FROM METRICMIND.RAW.CORPORATE_SALES_RAW

GROUP BY REGION;

-- =========================================================
-- Monthly Performance
-- =========================================================

CREATE OR REPLACE VIEW METRICMIND.ANALYTICS.MONTHLY_PERFORMANCE AS

SELECT

    YEAR,

    QUARTER,

    MONTH,

    SUM(REVENUE) AS TOTAL_REVENUE,

    SUM(TOTAL_COST) AS TOTAL_COST,

    SUM(PROFIT) AS TOTAL_PROFIT,

    SUM(PROFIT)
        / NULLIF(SUM(REVENUE), 0)
        AS PROFIT_MARGIN,

    SUM(ORDERS) AS TOTAL_ORDERS

FROM METRICMIND.RAW.CORPORATE_SALES_RAW

GROUP BY
    YEAR,
    QUARTER,
    MONTH;

    -- =========================================================
-- Cost Driver Analysis
-- =========================================================

CREATE OR REPLACE VIEW METRICMIND.ANALYTICS.COST_DRIVER_ANALYSIS AS

SELECT

    REGION,

    YEAR,

    QUARTER,

    SUM(REVENUE) AS TOTAL_REVENUE,

    SUM(MATERIAL_COST) AS MATERIAL_COST,

    SUM(SHIPPING_COST) AS SHIPPING_COST,

    SUM(MARKETING_COST) AS MARKETING_COST,

    SUM(TOTAL_COST) AS TOTAL_COST,

    SUM(PROFIT) AS TOTAL_PROFIT,

    SUM(PROFIT)
        / NULLIF(SUM(REVENUE), 0)
        AS PROFIT_MARGIN

FROM METRICMIND.RAW.CORPORATE_SALES_RAW

GROUP BY
    REGION,
    YEAR,
    QUARTER;