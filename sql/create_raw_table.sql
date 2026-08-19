-- =========================================================
-- MetricMind - Raw Corporate Sales Table
-- =========================================================

CREATE OR REPLACE TABLE METRICMIND.RAW.CORPORATE_SALES_RAW (

    ORDER_ID VARCHAR(50),

    ORDER_DATE DATE,

    YEAR NUMBER(4),

    QUARTER VARCHAR(2),

    MONTH NUMBER(2),

    REGION VARCHAR(50),

    COUNTRY VARCHAR(100),

    PRODUCT_CATEGORY VARCHAR(100),

    PRODUCT VARCHAR(150),

    CUSTOMER_SEGMENT VARCHAR(50),

    REVENUE NUMBER(18,2),

    MATERIAL_COST NUMBER(18,2),

    SHIPPING_COST NUMBER(18,2),

    MARKETING_COST NUMBER(18,2),

    TOTAL_COST NUMBER(18,2),

    PROFIT NUMBER(18,2),

    MARGIN NUMBER(10,4),

    ORDERS NUMBER(10)

);