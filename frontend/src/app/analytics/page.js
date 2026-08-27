"use client";

import { useEffect, useState } from "react";

const API = "http://127.0.0.1:8000";

export default function AnalyticsPage() {
  const [regional, setRegional] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const [
          regionalResponse,
          performanceResponse,
          monthlyResponse,
          driversResponse,
        ] = await Promise.all([
          fetch(`${API}/api/analytics/regional-revenue`),
          fetch(`${API}/api/analytics/regional-performance`),
          fetch(`${API}/api/analytics/monthly-performance`),
          fetch(`${API}/api/analytics/cost-drivers`),
        ]);

        const regionalData = await regionalResponse.json();
        const performanceData = await performanceResponse.json();
        const monthlyData = await monthlyResponse.json();
        const driversData = await driversResponse.json();

        setRegional(
          Array.isArray(regionalData)
            ? regionalData
            : regionalData.data || regionalData.results || []
        );

        setPerformance(
          Array.isArray(performanceData)
            ? performanceData
            : performanceData.data || performanceData.results || []
        );

        setMonthly(
          Array.isArray(monthlyData)
            ? monthlyData
            : monthlyData.data || monthlyData.results || []
        );

        setDrivers(
          Array.isArray(driversData)
            ? driversData
            : driversData.data || driversData.results || []
        );
      } catch (error) {
        console.error("Analytics loading error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  const totalRevenue = regional.reduce(
    (sum, item) =>
      sum + Number(item.revenue ?? item.total_revenue ?? 0),
    0
  );

  const totalProfit = performance.reduce(
    (sum, item) =>
      sum + Number(item.profit ?? item.total_profit ?? 0),
    0
  );

  const totalOrders = performance.reduce(
    (sum, item) =>
      sum + Number(item.orders ?? item.total_orders ?? 0),
    0
  );

  const averageMargin =
    totalRevenue > 0
      ? (totalProfit / totalRevenue) * 100
      : 0;

  return (
    <main className="analytics-page">

      {/* HEADER */}

      <header className="analytics-header">
        <div>
          <div className="eyebrow">METRICMIND / ANALYTICS</div>

          <h1>
            Business
            <span> intelligence.</span>
          </h1>

          <p>
            Explore governed performance metrics across regions,
            periods and cost drivers.
          </p>
        </div>

        <div className="status-pill">
          <span></span>
          LIVE DATA
        </div>
      </header>


      {/* KPI GRID */}

      <section className="kpi-grid">

        <KPI
          label="Total Revenue"
          value={formatMoney(totalRevenue)}
          detail="Across all regions"
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


      {/* MAIN GRID */}

      <section className="dashboard-grid">

        {/* REGIONAL REVENUE */}

        <Panel
          title="Regional revenue"
          subtitle="Revenue contribution by business region"
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
                  <div className="bar-row" key={name}>

                    <div className="bar-label">
                      <span>{name}</span>
                      <strong>{formatMoney(value)}</strong>
                    </div>

                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{ width: `${width}%` }}
                      />
                    </div>

                  </div>
                );
              })}

            </div>
          )}
        </Panel>


        {/* PERFORMANCE */}

        <Panel
          title="Regional performance"
          subtitle="Profitability and operating health"
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


        {/* MONTHLY PERFORMANCE */}

        <Panel
          title="Performance timeline"
          subtitle="Monthly governed performance"
          wide
        >
          {loading ? (
            <Loading />
          ) : monthly.length === 0 ? (
            <Empty />
          ) : (
            <div className="timeline">

              {monthly.map((item, index) => {

                const label =
                  item.month ??
                  item.period ??
                  item.date ??
                  `Period ${index + 1}`;

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

                return (
                  <div
                    className="timeline-item"
                    key={`${label}-${index}`}
                  >
                    <div className="timeline-top">
                      <span>{label}</span>
                      <strong>{formatMoney(revenue)}</strong>
                    </div>

                    <div className="timeline-track">
                      <div
                        className="timeline-revenue"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(
                              8,
                              (revenue /
                                Math.max(totalRevenue, revenue, 1)) *
                                100
                            )
                          )}%`,
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


        {/* COST DRIVERS */}

        <Panel
          title="Cost driver monitor"
          subtitle="Tracked operating cost movements"
        >
          {loading ? (
            <Loading />
          ) : drivers.length === 0 ? (
            <Empty />
          ) : (
            <div className="driver-list">

              {drivers.map((item, index) => {

                const name =
                  item.name ??
                  item.driver ??
                  item.cost_driver ??
                  `Driver ${index + 1}`;

                const value = Number(
                  item.change ??
                  item.cost_change ??
                  item.value ??
                  0
                );

                return (
                  <div
                    className="driver"
                    key={`${name}-${index}`}
                  >

                    <div>
                      <span className="driver-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span>{name}</span>
                    </div>

                    <strong>
                      {formatMoney(value)}
                    </strong>

                  </div>
                );
              })}

            </div>
          )}
        </Panel>

      </section>


      {/* GOVERNANCE FOOTER */}

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


/* ---------------- COMPONENTS ---------------- */

function KPI({ label, value, detail }) {
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


function Panel({ title, subtitle, children, wide }) {
  return (
    <section className={`panel ${wide ? "wide" : ""}`}>

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


function Loading() {
  return (
    <div className="loading">
      Loading governed data...
    </div>
  );
}


function Empty() {
  return (
    <div className="empty">
      No analytics data available.
    </div>
  );
}


/* ---------------- HELPERS ---------------- */

function formatMoney(value) {
  if (!Number.isFinite(value)) return "$0";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}


function formatNumber(value) {
  if (!Number.isFinite(value)) return "0";

  return new Intl.NumberFormat("en-US").format(
    Math.round(value)
  );
}