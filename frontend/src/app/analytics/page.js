"use client";

import { useEffect, useState } from "react";

const API = "http://127.0.0.1:8000";

export default function AnalyticsPage() {
  const [regional, setRegional] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedQuarter, setSelectedQuarter] = useState("");

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

        if (selectedRegion) {
          params.set("region", selectedRegion);
        }

        if (selectedYear) {
          params.set("year", selectedYear);
        }

        if (selectedQuarter) {
          params.set("quarter", selectedQuarter);
        }

        const regionalParams = new URLSearchParams();

if (selectedRegion) {
  regionalParams.set("region", selectedRegion);
}

if (selectedYear) {
  regionalParams.set("year", selectedYear);
}

if (selectedQuarter) {
  regionalParams.set("quarter", selectedQuarter);
}

const regionalSuffix = regionalParams.toString()
  ? `?${regionalParams.toString()}`
  : "";


const performanceSuffix = selectedRegion
  ? `?region=${encodeURIComponent(selectedRegion)}`
  : "";


const monthlyParams = new URLSearchParams();

if (selectedYear) {
  monthlyParams.set("year", selectedYear);
}

if (selectedQuarter) {
  monthlyParams.set("quarter", selectedQuarter);
}

const monthlySuffix = monthlyParams.toString()
  ? `?${monthlyParams.toString()}`
  : "";


const driversParams = new URLSearchParams();

if (selectedRegion) {
  driversParams.set("region", selectedRegion);
}

if (selectedYear) {
  driversParams.set("year", selectedYear);
}

if (selectedQuarter) {
  driversParams.set("quarter", selectedQuarter);
}

const driversSuffix = driversParams.toString()
  ? `?${driversParams.toString()}`
  : "";


const [
  regionalResponse,
  performanceResponse,
  monthlyResponse,
  driversResponse,
] = await Promise.all([
  fetch(
    `${API}/api/analytics/regional-revenue${regionalSuffix}`
  ),

  fetch(
    `${API}/api/analytics/regional-performance${performanceSuffix}`
  ),

  fetch(
    `${API}/api/analytics/monthly-performance${monthlySuffix}`
  ),

  fetch(
    `${API}/api/analytics/cost-drivers${driversSuffix}`
  ),
]);

        if (
          !regionalResponse.ok ||
          !performanceResponse.ok ||
          !monthlyResponse.ok ||
          !driversResponse.ok
        ) {
          throw new Error("Analytics API request failed");
        }

        const regionalData = await regionalResponse.json();
        const performanceData = await performanceResponse.json();
        const monthlyData = await monthlyResponse.json();
        const driversData = await driversResponse.json();

        setRegional(
          Array.isArray(regionalData)
            ? regionalData
            : regionalData?.data || regionalData?.results || []
        );

        setPerformance(
          Array.isArray(performanceData)
            ? performanceData
            : performanceData?.data || performanceData?.results || []
        );

        setMonthly(
          Array.isArray(monthlyData)
            ? monthlyData
            : monthlyData?.data || monthlyData?.results || []
        );

        setDrivers(
          Array.isArray(driversData)
            ? driversData
            : driversData?.data || driversData?.results || []
        );
      } catch (error) {
        console.error("Analytics loading error:", error);

        setRegional([]);
        setPerformance([]);
        setMonthly([]);
        setDrivers([]);

        setError("Unable to load analytics data.");
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, [selectedRegion, selectedYear, selectedQuarter]);

  /*
   * ---------------------------------------------------------
   * FILTERED KPI CALCULATIONS
   * ---------------------------------------------------------
   *
   * Cost-driver data is the correct source for the selected
   * region/year/quarter because it contains:
   *
   * region
   * year
   * quarter
   * revenue
   * costs
   * profit
   * margin
   */

  const totalRevenue = drivers.reduce(
    (sum, item) => sum + Number(item.total_revenue ?? 0),
    0
  );

  const totalProfit = drivers.reduce(
    (sum, item) => sum + Number(item.total_profit ?? 0),
    0
  );

  const totalOrders = monthly.reduce(
  (sum, item) => sum + Number(item.total_orders ?? 0),
  0
);

  const averageMargin =
    totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  /*
   * ---------------------------------------------------------
   * COST DRIVERS
   * ---------------------------------------------------------
   */

  const costTotals = drivers.reduce(
    (acc, item) => {
      acc.material += Number(item.material_cost ?? 0);
      acc.shipping += Number(item.shipping_cost ?? 0);
      acc.marketing += Number(item.marketing_cost ?? 0);

      return acc;
    },
    {
      material: 0,
      shipping: 0,
      marketing: 0,
    }
  );

  const costDrivers = [
    {
      name: "Material Cost",
      value: costTotals.material,
    },
    {
      name: "Shipping Cost",
      value: costTotals.shipping,
    },
    {
      name: "Marketing Cost",
      value: costTotals.marketing,
    },
  ];

  /*
   * ---------------------------------------------------------
   * FILTER DESCRIPTION
   * ---------------------------------------------------------
   */

  const filterDescription = [
    selectedRegion || "All regions",
    selectedYear || "All years",
    selectedQuarter || "All quarters",
  ].join(" • ");

  return (
    <main className="analytics-page">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="analytics-header">
        <div>
          <div className="eyebrow">
            METRICMIND / ANALYTICS
          </div>

          <h1>
            Business
            <span> intelligence.</span>
          </h1>

          <p>
            Explore governed performance metrics across
            regions, periods and cost drivers.
          </p>
        </div>

        <div className="status-pill">
          <span></span>
          LIVE DATA
        </div>
      </header>


      {/* =====================================================
          FILTER BAR
      ====================================================== */}

      <section className="analytics-filters">

        <div className="filter-group">
          <label>REGION</label>

          <select
            value={selectedRegion}
            onChange={(event) =>
              setSelectedRegion(event.target.value)
            }
          >
            <option value="">All regions</option>
            <option value="Asia">Asia</option>
            <option value="Europe">Europe</option>
            <option value="North America">
              North America
            </option>
          </select>
        </div>


        <div className="filter-group">
          <label>YEAR</label>

          <select
            value={selectedYear}
            onChange={(event) =>
              setSelectedYear(event.target.value)
            }
          >
            <option value="">All years</option>
            <option value="2025">2025</option>
          </select>
        </div>


        <div className="filter-group">
          <label>QUARTER</label>

          <select
            value={selectedQuarter}
            onChange={(event) =>
              setSelectedQuarter(event.target.value)
            }
          >
            <option value="">All quarters</option>
            <option value="Q1">Q1</option>
            <option value="Q2">Q2</option>
            <option value="Q3">Q3</option>
            <option value="Q4">Q4</option>
          </select>
        </div>


        <button
          className="filter-reset"
          onClick={() => {
            setSelectedRegion("");
            setSelectedYear("");
            setSelectedQuarter("");
          }}
        >
          Reset
        </button>

      </section>


      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <div
          style={{
            marginBottom: "16px",
            padding: "12px 14px",
            border: "1px solid rgba(255,80,80,0.25)",
            borderRadius: "10px",
            color: "#ff7b7b",
            fontSize: "12px",
          }}
        >
          {error}
        </div>
      )}


      {/* =====================================================
          KPI GRID
      ====================================================== */}

      <section className="kpi-grid">

        <KPI
          label="Total Revenue"
          value={formatMoney(totalRevenue)}
          detail={filterDescription}
        />

        <KPI
          label="Total Profit"
          value={formatMoney(totalProfit)}
          detail="Governed warehouse"
        />

        <KPI
          label="Average Margin"
          value={`${averageMargin.toFixed(1)}%`}
          detail="Profit / Revenue"
        />

        <KPI
          label="Total Orders"
          value={formatNumber(totalOrders)}
          detail="Recorded orders"
        />

      </section>


      {/* =====================================================
          DASHBOARD
      ====================================================== */}

      <section className="dashboard-grid">


        {/* ===================================================
            REGIONAL REVENUE
        ==================================================== */}

        <Panel
          title="Regional revenue"
          subtitle={
            selectedRegion
              ? `Revenue for ${selectedRegion}`
              : "Revenue contribution by business region"
          }
        >
          {loading ? (
            <Loading />
          ) : regional.length === 0 ? (
            <Empty />
          ) : (
            <div className="bar-list">

              {regional.map((item, index) => {
                const name =
                  item.region ??
                  item.name ??
                  `Region ${index + 1}`;

                const value = Number(
                  item.revenue ??
                  item.total_revenue ??
                  0
                );

                const max = Math.max(
                  ...regional.map((x) =>
                    Number(
                      x.revenue ??
                      x.total_revenue ??
                      0
                    )
                  ),
                  1
                );

                const width = (value / max) * 100;

                return (
                  <div
                    className="bar-row"
                    key={`${name}-${index}`}
                  >

                    <div className="bar-label">
                      <span>{name}</span>

                      <strong>
                        {formatMoney(value)}
                      </strong>
                    </div>

                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${width}%`,
                        }}
                      />
                    </div>

                  </div>
                );
              })}

            </div>
          )}
        </Panel>


        {/* ===================================================
            REGIONAL PERFORMANCE
        ==================================================== */}

        <Panel
          title="Regional performance"
          subtitle={
            selectedRegion
              ? `Overall performance for ${selectedRegion}`
              : "Profitability and operating health"
          }
        >
          {loading ? (
            <Loading />
          ) : performance.length === 0 ? (
            <Empty />
          ) : (
            <div className="table">

              <div className="table-head">
                <span>REGION</span>
                <span>PROFIT</span>
                <span>MARGIN</span>
              </div>


              {performance.map((item, index) => {
                const region =
                  item.region ??
                  item.name ??
                  `Region ${index + 1}`;

                const profit = Number(
                  item.profit ??
                  item.total_profit ??
                  0
                );

                const margin = Number(
                  item.margin ??
                  item.profit_margin ??
                  0
                );

                return (
                  <div
                    className="table-row"
                    key={`${region}-${index}`}
                  >

                    <span>{region}</span>

                    <strong>
                      {formatMoney(profit)}
                    </strong>

                    <span className="margin">
                      {margin > 1
                        ? `${margin.toFixed(1)}%`
                        : `${(margin * 100).toFixed(1)}%`}
                    </span>

                  </div>
                );
              })}

            </div>
          )}
        </Panel>


        {/* ===================================================
            PERFORMANCE TIMELINE
        ==================================================== */}

        <Panel
          title="Performance timeline"
          subtitle={
            selectedYear || selectedQuarter
              ? `Monthly governed performance • ${
                  selectedYear || "All years"
                } • ${selectedQuarter || "All quarters"}`
              : "Monthly governed performance"
          }
          wide
        >
          {loading ? (
            <Loading />
          ) : monthly.length === 0 ? (
            <Empty />
          ) : (
            <div className="timeline">

              {monthly.map((item, index) => {
                const monthNumber = Number(
                  item.month ?? index + 1
                );

                const quarter =
                  item.quarter ??
                  getQuarterFromMonth(monthNumber);

                const year =
                  item.year ??
                  "";

                const label = `${year} ${quarter} / M${monthNumber}`;

                const revenue = Number(
                  item.revenue ??
                  item.total_revenue ??
                  0
                );

                const profit = Number(
                  item.profit ??
                  item.total_profit ??
                  0
                );

                const maxRevenue = Math.max(
                  ...monthly.map((x) =>
                    Number(
                      x.revenue ??
                      x.total_revenue ??
                      0
                    )
                  ),
                  1
                );

                const width =
                  (revenue / maxRevenue) * 100;

                return (
                  <div
                    className="timeline-item"
                    key={`${year}-${monthNumber}-${index}`}
                  >

                    <div className="timeline-top">

                      <span>{label}</span>

                      <strong>
                        {formatMoney(revenue)}
                      </strong>

                    </div>


                    <div className="timeline-track">

                      <div
                        className="timeline-revenue"
                        style={{
                          width: `${width}%`,
                        }}
                      />

                    </div>


                    <small>
                      Profit {formatMoney(profit)}
                    </small>

                  </div>
                );
              })}

            </div>
          )}
        </Panel>


        {/* ===================================================
            COST DRIVERS
        ==================================================== */}

        <Panel
          title="Cost driver monitor"
          subtitle={
            selectedRegion ||
            selectedYear ||
            selectedQuarter
              ? `Tracked costs • ${filterDescription}`
              : "Tracked operating cost movements"
          }
        >
          {loading ? (
            <Loading />
          ) : drivers.length === 0 ? (
            <Empty />
          ) : (
            <div className="driver-list">

              {costDrivers.map((driver, index) => (
                <div
                  className="driver"
                  key={driver.name}
                >

                  <div>

                    <span className="driver-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span>
                      {driver.name}
                    </span>

                  </div>

                  <strong>
                    {formatMoney(driver.value)}
                  </strong>

                </div>
              ))}

            </div>
          )}
        </Panel>

      </section>


      {/* =====================================================
          GOVERNANCE
      ====================================================== */}

      <section className="governance-strip">

        <div>
          <span className="green-dot"></span>
          Governed analytics
        </div>

        <div>
          Semantic layer <strong>v1.0</strong>
        </div>

        <div>
          Warehouse <strong>Connected</strong>
        </div>

        <div>
          Data status <strong>Verified</strong>
        </div>

      </section>

    </main>
  );
}


/* ===========================================================
   KPI
=========================================================== */

function KPI({
  label,
  value,
  detail,
}) {
  return (
    <div className="kpi">

      <div className="kpi-label">
        {label}
      </div>

      <div className="kpi-value">
        {value}
      </div>

      <div className="kpi-detail">
        {detail}
      </div>

    </div>
  );
}


/* ===========================================================
   PANEL
=========================================================== */

function Panel({
  title,
  subtitle,
  children,
  wide,
}) {
  return (
    <section
      className={`panel ${
        wide ? "wide" : ""
      }`}
    >

      <div className="panel-header">

        <div>

          <h2>{title}</h2>

          <p>{subtitle}</p>

        </div>

        <span className="panel-dot"></span>

      </div>

      <div className="panel-content">
        {children}
      </div>

    </section>
  );
}


/* ===========================================================
   LOADING
=========================================================== */

function Loading() {
  return (
    <div className="loading">
      Loading governed data...
    </div>
  );
}


/* ===========================================================
   EMPTY
=========================================================== */

function Empty() {
  return (
    <div className="empty">
      No analytics data available.
    </div>
  );
}


/* ===========================================================
   FORMAT MONEY
=========================================================== */

function formatMoney(value) {
  if (!Number.isFinite(Number(value))) {
    return "$0";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value));
}


/* ===========================================================
   FORMAT NUMBER
=========================================================== */

function formatNumber(value) {
  if (!Number.isFinite(Number(value))) {
    return "0";
  }

  return new Intl.NumberFormat("en-US").format(
    Math.round(Number(value))
  );
}


/* ===========================================================
   QUARTER FROM MONTH
=========================================================== */

function getQuarterFromMonth(month) {
  const value = Number(month);

  if (value <= 3) {
    return "Q1";
  }

  if (value <= 6) {
    return "Q2";
  }

  if (value <= 9) {
    return "Q3";
  }

  return "Q4";
}