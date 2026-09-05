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

  const [agentQuestion, setAgentQuestion] = useState("");
  const [agentResult, setAgentResult] = useState(null);
  const [agentLoading, setAgentLoading] = useState(false);
  const [agentError, setAgentError] = useState("");
  const [agentHistory, setAgentHistory] = useState([]);
  const [showQueryTrace, setShowQueryTrace] =
  useState(false);

  const [marginAnalysis, setMarginAnalysis] = useState(null);
  const [marginLoading, setMarginLoading] = useState(false);
  const [marginError, setMarginError] = useState("");
  const [kpiData, setKpiData] = useState(null);

  const [insights, setInsights] = useState(null);
const [insightsLoading, setInsightsLoading] = useState(false);
const [insightsError, setInsightsError] = useState("");

  /*
   * ---------------------------------------------------------
   * LOAD DASHBOARD ANALYTICS
   * ---------------------------------------------------------
   */

  useEffect(() => {
  async function loadMarginAnalysis() {
    const region = selectedRegion;
    const year = selectedYear;
    const quarter = selectedQuarter;

    if (!region || !year || !quarter) {
      setMarginAnalysis(null);
      setMarginError("");
      setMarginLoading(false);
      return;
    }

    try {
      setMarginLoading(true);
      setMarginError("");
      setMarginAnalysis(null);

      const params = new URLSearchParams({
        region: String(region),
        year: String(year),
        quarter: String(quarter),
      });

      const response = await fetch(
        `${API}/api/analytics/margin-root-cause?${params.toString()}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            "Margin analysis request failed"
        );
      }

      if (data.status !== "verified") {
        setMarginError(
          data.message ||
            "Margin analysis requires a complete comparison period."
        );

        setMarginAnalysis(null);
        return;
      }

      setMarginAnalysis(data);
    } catch (error) {
      console.error(
        "Margin analysis error:",
        error
      );

      setMarginAnalysis(null);

      setMarginError(
        error.message ||
          "Unable to load margin intelligence."
      );
    } finally {
      setMarginLoading(false);
    }
  }

  loadMarginAnalysis();
}, [
  selectedRegion,
  selectedYear,
  selectedQuarter,
]);

  /*
   * ---------------------------------------------------------
   * GOVERNED QUERY AGENT
   * ---------------------------------------------------------
   */

  async function runAgent(
  questionOverride = agentQuestion
) {
  const rawQuestion =
    questionOverride.trim();

  if (!rawQuestion) {
    setAgentError(
      "Enter a business question first."
    );

    setAgentResult(null);
    return;
  }

  /*
   * Resolve context in this order:
   *
   * 1. Explicit context in the question
   * 2. Previous Copilot question
   * 3. Current dashboard filters
   */
  const resolvedQuestion =
    resolveFollowUpQuestion(
      rawQuestion,
      agentHistory,
      {
        region: selectedRegion,
        year: selectedYear,
        quarter: selectedQuarter,
      }
    );

  try {
    setAgentLoading(true);
    setAgentError("");
    setAgentResult(null);

    const response = await fetch(
      `${API}/api/agent/analyze?question=${encodeURIComponent(
        resolvedQuestion
      )}`
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        "Agent request failed"
      );
    }

    if (data.status !== "verified") {
      setAgentError(
        data.message ||
          data.reason ||
          "This question could not be verified by the governance layer."
      );

      setAgentResult(data);
      return;
    }

    setAgentResult(data);

    setAgentHistory(
      (previous) => [
        {
          question: rawQuestion,
          resolvedQuestion,
          result: data,
        },

        ...previous.filter(
          (item) =>
            item.question !== rawQuestion
        ),
      ].slice(0, 5)
    );

  } catch (error) {
    console.error(
      "Agent error:",
      error
    );

    setAgentError(
      "Unable to analyze the question. Make sure the backend is running."
    );

  } finally {
    setAgentLoading(false);
  }
}

  /*
   * ---------------------------------------------------------
   * MARGIN INTELLIGENCE
   *
   * IMPORTANT:
   * This useEffect is NOT nested inside another useEffect.
   * ---------------------------------------------------------
   */

  useEffect(() => {
  async function loadAnalytics() {
    try {
      setLoading(true);
      setError("");

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

      const performanceParams =
  new URLSearchParams();

if (selectedRegion) {
  performanceParams.set(
    "region",
    selectedRegion
  );
}

if (selectedYear) {
  performanceParams.set(
    "year",
    selectedYear
  );
}

if (selectedQuarter) {
  performanceParams.set(
    "quarter",
    selectedQuarter
  );
}

const performanceSuffix =
  performanceParams.toString()
    ? `?${performanceParams.toString()}`
    : "";

      const monthlyParams =
  new URLSearchParams();

if (selectedRegion) {
  monthlyParams.set(
    "region",
    selectedRegion
  );
}

if (selectedYear) {
  monthlyParams.set(
    "year",
    selectedYear
  );
}

if (selectedQuarter) {
  monthlyParams.set(
    "quarter",
    selectedQuarter
  );
}

      const monthlySuffix =
        monthlyParams.toString()
          ? `?${monthlyParams.toString()}`
          : "";

      const driversParams =
        new URLSearchParams();

      if (selectedRegion) {
        driversParams.set(
          "region",
          selectedRegion
        );
      }

      if (selectedYear) {
        driversParams.set(
          "year",
          selectedYear
        );
      }

      if (selectedQuarter) {
        driversParams.set(
          "quarter",
          selectedQuarter
        );
      }

      const driversSuffix =
        driversParams.toString()
          ? `?${driversParams.toString()}`
          : "";

      /*
       * GOVERNED KPI QUERY
       *
       * This is the authoritative source for:
       * Revenue
       * Profit
       * Margin
       * Orders
       */
      const kpiSuffix =
        regionalParams.toString()
          ? `?${regionalParams.toString()}`
          : "";

      const [
        kpiResponse,
        regionalResponse,
        performanceResponse,
        monthlyResponse,
        driversResponse,
      ] = await Promise.all([
        fetch(
          `${API}/api/analytics/kpis${kpiSuffix}`
        ),

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
        !kpiResponse.ok ||
        !regionalResponse.ok ||
        !performanceResponse.ok ||
        !monthlyResponse.ok ||
        !driversResponse.ok
      ) {
        throw new Error(
          "Analytics API request failed"
        );
      }

      const kpiDataResponse =
        await kpiResponse.json();

      const regionalData =
        await regionalResponse.json();

      const performanceData =
        await performanceResponse.json();

      const monthlyData =
        await monthlyResponse.json();

      const driversData =
        await driversResponse.json();

      /*
       * Store governed KPI response separately.
       */
      setKpiData(
        kpiDataResponse?.status ===
          "verified"
          ? kpiDataResponse
          : null
      );

      setRegional(
        Array.isArray(regionalData)
          ? regionalData
          : regionalData?.data ||
              regionalData?.results ||
              []
      );

      setPerformance(
        Array.isArray(performanceData)
          ? performanceData
          : performanceData?.data ||
              performanceData?.results ||
              []
      );

      setMonthly(
        Array.isArray(monthlyData)
          ? monthlyData
          : monthlyData?.data ||
              monthlyData?.results ||
              []
      );

      setDrivers(
        Array.isArray(driversData)
          ? driversData
          : driversData?.data ||
              driversData?.results ||
              []
      );
    } catch (error) {
      console.error(
        "Analytics loading error:",
        error
      );

      setKpiData(null);
      setRegional([]);
      setPerformance([]);
      setMonthly([]);
      setDrivers([]);

      setError(
        "Unable to load analytics data."
      );
    } finally {
      setLoading(false);
    }
  }

  loadAnalytics();
}, [
  selectedRegion,
  selectedYear,
  selectedQuarter,
]);

/*
 * ---------------------------------------------------------
 * EXECUTIVE INSIGHT ENGINE
 * ---------------------------------------------------------
 */

useEffect(() => {
  async function loadInsights() {
    if (
      !selectedRegion ||
      !selectedYear ||
      !selectedQuarter
    ) {
      setInsights(null);
      setInsightsError("");
      return;
    }

    try {
      setInsightsLoading(true);
      setInsightsError("");

      const response = await fetch(
        `${API}/api/analytics/insights?region=${encodeURIComponent(
          selectedRegion
        )}&year=${encodeURIComponent(
          selectedYear
        )}&quarter=${encodeURIComponent(
          selectedQuarter
        )}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          "Insight request failed"
        );
      }

      if (data.status !== "verified") {
        setInsights(null);

        setInsightsError(
          data.message ||
            "Executive insights require a complete comparison period."
        );

        return;
      }

      setInsights(data);
    } catch (error) {
      console.error(
        "Insight engine error:",
        error
      );

      setInsights(null);

      setInsightsError(
        "Unable to load executive insights."
      );
    } finally {
      setInsightsLoading(false);
    }
  }

  loadInsights();
}, [
  selectedRegion,
  selectedYear,
  selectedQuarter,
]);


  /*
 * ---------------------------------------------------------
 * GOVERNED KPI VALUES
 * ---------------------------------------------------------
 */

const totalRevenue = Number(
  kpiData?.kpis?.revenue ?? 0
);

const totalProfit = Number(
  kpiData?.kpis?.profit ?? 0
);

const averageMargin = Number(
  kpiData?.kpis?.margin ?? 0
);

const totalOrders = Number(
  kpiData?.kpis?.orders ?? 0
);

  /*
   * ---------------------------------------------------------
   * COST DRIVERS
   * ---------------------------------------------------------
   */

  const costTotals =
    drivers.reduce(
      (acc, item) => {
        acc.material += Number(
          item.material_cost ?? 0
        );

        acc.shipping += Number(
          item.shipping_cost ?? 0
        );

        acc.marketing += Number(
          item.marketing_cost ?? 0
        );

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

  const filterDescription = [
    selectedRegion ||
      "All regions",

    selectedYear ||
      "All years",

    selectedQuarter ||
      "All quarters",
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
            <span>
              {" "}intelligence.
            </span>
          </h1>

          <p>
            Explore governed performance
            metrics across regions, periods
            and cost drivers.
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

          <label>
            REGION
          </label>

          <select
            value={selectedRegion}
            onChange={(event) =>
              setSelectedRegion(
                event.target.value
              )
            }
          >

            <option value="">
              All regions
            </option>

            <option value="Asia">
              Asia
            </option>

            <option value="Europe">
              Europe
            </option>

            <option value="North America">
              North America
            </option>

          </select>

        </div>


        <div className="filter-group">

          <label>
            YEAR
          </label>

          <select
            value={selectedYear}
            onChange={(event) =>
              setSelectedYear(
                event.target.value
              )
            }
          >

            <option value="">
              All years
            </option>

            <option value="2025">
              2025
            </option>

          </select>

        </div>


        <div className="filter-group">

          <label>
            QUARTER
          </label>

          <select
            value={selectedQuarter}
            onChange={(event) =>
              setSelectedQuarter(
                event.target.value
              )
            }
          >

            <option value="">
              All quarters
            </option>

            <option value="Q1">
              Q1
            </option>

            <option value="Q2">
              Q2
            </option>

            <option value="Q3">
              Q3
            </option>

            <option value="Q4">
              Q4
            </option>

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
          GOVERNED QUERY COPILOT
      ====================================================== */}

      <section className="copilot-panel">

        <div className="copilot-header">

          <div>

            <div className="copilot-eyebrow">
              GOVERNED QUERY COPILOT
            </div>

            <h2>
              Ask MetricMind.
            </h2>

            <p>
              Ask a business question in
              natural language. MetricMind
              validates the metric, filters and
              calculation before returning an
              answer.
            </p>

          </div>

          <div className="copilot-status">
            <span className="green-dot"></span>
            CERTIFIED AGENT
          </div>

        </div>

        <div className="copilot-context-bar">
  <span className="copilot-context-dot"></span>

  <span>
    CONTEXT
  </span>

  <strong>
    {selectedRegion ||
      "All regions"}
  </strong>

  <span>•</span>

  <strong>
    {selectedYear ||
      "All years"}
  </strong>

  <span>•</span>

  <strong>
    {selectedQuarter ||
      "All quarters"}
  </strong>

  <span className="copilot-context-hint">
    Follow-up questions inherit this context
  </span>
</div>


        <div className="copilot-input-row">

          <input
            type="text"
            value={agentQuestion}
            onChange={(event) =>
              setAgentQuestion(
                event.target.value
              )
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                runAgent();
              }
            }}
            placeholder="e.g. What was Europe profit margin in Q3 2025?"
          />

          <button
            className="copilot-button"
            onClick={() =>
              runAgent()
            }
            disabled={agentLoading}
          >
            {agentLoading
              ? "Analyzing..."
              : "Analyze"}
          </button>

        </div>


        <div className="copilot-examples">

          <button
            onClick={() =>
              setAgentQuestion(
                "What was Europe revenue in Q3 2025?"
              )
            }
          >
            Europe revenue
          </button>

          <button
            onClick={() =>
              setAgentQuestion(
                "What was Europe profit margin in Q3 2025?"
              )
            }
          >
            Europe margin
          </button>

          <button
            onClick={() =>
              setAgentQuestion(
                "What was Europe material cost in Q3 2025?"
              )
            }
          >
            Material cost
          </button>

          <button
            onClick={() =>
              setAgentQuestion(
                "How many orders did Europe have in Q3 2025?"
              )
            }
          >
            Europe orders
          </button>

        </div>


        {agentError && (
          <div className="copilot-error">
            {agentError}
          </div>
        )}


        {agentHistory.length > 0 && (
          <div className="copilot-history">

            <div className="copilot-history-title">
              RECENT QUESTIONS
            </div>

            <button
              className="copilot-history-clear"
              onClick={() =>
                setAgentHistory([])
              }
            >
              Clear
            </button>

            {agentHistory.map(
              (item, index) => (
                <button
                  key={`${item.question}-${index}`}
                  className="copilot-history-item"
                  onClick={() => {
                    setAgentQuestion(
                      item.question
                    );

                    setAgentResult(
                      item.result
                    );

                    setAgentError("");

                    runAgent(
                      item.question
                    );
                  }}
                >

                  <span>
                    {item.question}
                  </span>

                  <strong>
                    {formatAgentValue(
                      item.result.value,
                      item.result.metric
                    )}
                  </strong>

                </button>
              )
            )}

          </div>
        )}


        {agentResult?.status ===
          "verified" && (
          <div className="copilot-result">

            <div className="copilot-answer">

              <span className="copilot-result-label">
                VERIFIED ANSWER
              </span>

              <strong>
                {formatAgentValue(
                  agentResult.value,
                  agentResult.metric
                )}
              </strong>

              <p>
                {agentResult.metric} for{" "}
                {formatAgentFilters(
                  agentResult.filters
                )}
              </p>

            </div>


            <div className="copilot-evidence">

              <div className="evidence-item">
                <span>
                  METRIC
                </span>

                <strong>
                  {agentResult.metric}
                </strong>
              </div>


              <div className="evidence-item">
                <span>
                  SOURCE
                </span>

                <strong>
                  {agentResult.source}
                </strong>
              </div>


              <div className="evidence-item">
                <span>
                  FORMULA
                </span>

                <strong>
                  {agentResult.formula}
                </strong>
              </div>


              <div className="evidence-item">
                <span>
                  GOVERNANCE
                </span>

                <strong className="verified-text">
                  ✓{" "}
                  {agentResult.governance}
                </strong>
              </div>

            </div>

            {/* =====================================================
    AUTOMATIC AGENT VISUALIZATION
====================================================== */}

{agentResult.visualization?.data?.length > 0 && (
  <div className="copilot-visualization">

    <div className="copilot-visualization-header">

      <div>
        <div className="copilot-trace-title">
          GOVERNED VISUALIZATION
        </div>

        <strong>
          {agentResult.visualization.title}
        </strong>
      </div>

      <span className="copilot-visualization-badge">
        ✓ VERIFIED
      </span>

    </div>

    <div className="copilot-chart">

      {agentResult.visualization.data.map(
        (item, index) => {

          const values =
            agentResult.visualization.data.map(
              (entry) =>
                Number(entry.value ?? 0)
            );

          const maxValue =
            Math.max(...values, 1);

          const width =
            (Number(item.value ?? 0) /
              maxValue) *
            100;

          const isPercentage =
            agentResult.metric ===
            "Profit Margin";

          return (
            <div
              className="copilot-chart-row"
              key={`${item.label}-${index}`}
            >

              <div className="copilot-chart-label">
                <span>
                  {item.label}
                </span>

                <strong>
                  {isPercentage
                    ? `${Number(
                        item.value ?? 0
                      ).toFixed(2)}%`
                    : formatAgentValue(
                        item.value,
                        agentResult.metric
                      )}
                </strong>
              </div>

              <div className="copilot-chart-track">

                <div
                  className="copilot-chart-fill"
                  style={{
                    width: `${Math.max(
                      width,
                      2
                    )}%`,
                  }}
                />

              </div>

            </div>
          );
        }
      )}

    </div>

    <div className="copilot-visualization-footer">

      <span>
        DIMENSION
      </span>

      <strong>
        {agentResult.visualization.dimension}
      </strong>

      <span>
        SOURCE
      </span>

      <strong>
        {agentResult.visualization.source}
      </strong>

    </div>

  </div>
)}

            {agentResult.query_trace?.sql && (
  <div className="copilot-trace">

    <div className="copilot-trace-actions">

      <button
        type="button"
        className="copilot-trace-button"
        onClick={() =>
          setShowQueryTrace(
            !showQueryTrace
          )
        }
      >
        {showQueryTrace
          ? "HIDE SQL"
          : "VIEW SQL"}
      </button>

      <button
        type="button"
        className="copilot-trace-button"
        onClick={() =>
          setShowQueryTrace(
            "api"
          )
        }
      >
        VIEW API CALL
      </button>

    </div>

    {showQueryTrace === true && (
      <div className="copilot-trace-content">

        <div className="copilot-trace-title">
          GOVERNED SQL
        </div>

        <pre>
          {agentResult.query_trace.sql}
        </pre>

        <div className="copilot-trace-title">
          BOUND PARAMETERS
        </div>

        <pre>
          {JSON.stringify(
            agentResult.query_trace.parameters,
            null,
            2
          )}
        </pre>

      </div>
    )}

    {showQueryTrace === "api" && (
      <div className="copilot-trace-content">

        <div className="copilot-trace-title">
          API CALL
        </div>

        <pre>
          GET {agentResult.api_call}
        </pre>

      </div>
    )}

  </div>
)}

          </div>
        )}

      </section>


      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <div
          style={{
            marginBottom: "16px",
            padding: "12px 14px",
            border:
              "1px solid rgba(255,80,80,0.25)",
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
          value={formatMoney(
            totalRevenue
          )}
          detail={filterDescription}
        />

        <KPI
          label="Total Profit"
          value={formatMoney(
            totalProfit
          )}
          detail="Governed warehouse"
        />

        <KPI
          label="Average Margin"
          value={`${averageMargin.toFixed(
            1
          )}%`}
          detail="Profit / Revenue"
        />

        <KPI
          label="Total Orders"
          value={formatNumber(
            totalOrders
          )}
          detail="Recorded orders"
        />

      </section>


      {/* =====================================================
          MARGIN INTELLIGENCE
      ====================================================== */}

      {selectedRegion &&
        selectedYear &&
        selectedQuarter && (

        <section className="margin-intelligence-panel">

          <div className="margin-intelligence-header">

            <div>

              <div className="margin-intelligence-eyebrow">
                MARGIN INTELLIGENCE
              </div>

              <h2>
                Why did margin move?
              </h2>

              <p>
                Governed
                quarter-over-quarter
                analysis for{" "}
                {selectedRegion} •{" "}
                {selectedQuarter}{" "}
                {selectedYear}.
              </p>

            </div>

            <div className="margin-governance-badge">
              <span></span>
              VERIFIED
            </div>

          </div>


          {marginLoading ? (

            <div className="margin-loading">
              Analyzing margin movement...
            </div>

          ) : marginError ? (

            <div className="margin-error">
              {marginError}
            </div>

          ) : marginAnalysis ? (

            <>

              <div className="margin-summary">

                <div className="margin-summary-main">

                  <span className="margin-label">
                    MARGIN CHANGE
                  </span>

                  <strong
                    className={
                      marginAnalysis
                        .metrics
                        .margin_change_pp < 0
                        ? "margin-negative"
                        : "margin-positive"
                    }
                  >
                    {marginAnalysis
                      .metrics
                      .margin_change_pp > 0
                      ? "+"
                      : ""}

                    {marginAnalysis
                      .metrics
                      .margin_change_pp
                      .toFixed(2)}{" "}
                    pp
                  </strong>

                  <p>
                    {
                      marginAnalysis
                        .comparison
                        .previous_period
                    }{" "}
                    {
                      marginAnalysis
                        .metrics
                        .previous_margin
                    .toFixed(2)
                    }%
                    {" → "}
                    {
                      marginAnalysis
                        .comparison
                        .current_period
                    }{" "}
                    {
                      marginAnalysis
                        .metrics
                        .current_margin
                    .toFixed(2)
                    }%
                  </p>

                </div>


                <div className="margin-summary-driver">

                  <span className="margin-label">
                    TOP COST PRESSURE
                  </span>

                  <strong>
                    {
                      marginAnalysis
                        .top_driver
                        .name
                    }
                  </strong>

                  <p>
                    {
                      marginAnalysis
                        .top_driver
                        .rate_change_pp > 0
                      ? "+"
                      : ""
                    }

                    {
                      marginAnalysis
                        .top_driver
                        .rate_change_pp
                        .toFixed(2)
                    }{" "}
                    pp cost-rate movement
                  </p>

                </div>

              </div>


              <div className="margin-driver-grid">

                {marginAnalysis
                  .cost_drivers
                  .map((driver) => (

                  <div
                    className="margin-driver-card"
                    key={driver.name}
                  >

                    <div className="margin-driver-top">

                      <span>
                        {driver.name}
                      </span>

                      <strong
                        className={
                          driver.rate_change_pp >
                          0
                            ? "driver-pressure"
                            : "driver-improvement"
                        }
                      >
                        {driver.rate_change_pp >
                        0
                          ? "+"
                          : ""}

                        {
                          driver.rate_change_pp
                            .toFixed(2)
                        }{" "}
                        pp
                      </strong>

                    </div>


                    <div className="margin-rate-row">

                      <span>
                        {
                          driver.previous_rate
                            .toFixed(2)
                        }%
                      </span>

                      <span>
                        →
                      </span>

                      <span>
                        {
                          driver.current_rate
                            .toFixed(2)
                        }%
                      </span>

                    </div>


                    <div className="margin-cost-change">

                      Cost change{" "}

                      <strong>
                        {formatMoney(
                          driver.cost_change
                        )}
                      </strong>

                    </div>

                  </div>

                ))}

              </div>


              <div className="margin-explanation">

                <span>
                  GOVERNED FINDING
                </span>

                <p>
                  {marginAnalysis.summary}
                </p>

              </div>


              <div className="margin-evidence">

                <span>
                  SOURCE:{" "}
                  {
                    marginAnalysis
                      .governance
                      .source
                  }
                </span>

                <span>
                  CALCULATION:{" "}
                  {
                    marginAnalysis
                      .governance
                      .calculation
                  }
                </span>

                <span>
                  ✓ Governance passed
                </span>

              </div>

            </>

          ) : (

  <div className="margin-loading">
    Select a region, year and
    quarter to analyze margin
    movement.
  </div>

)}

        </section>
      )}


      {/* =====================================================
          DASHBOARD
      ====================================================== */}

      <section className="dashboard-grid">

      {/* =====================================================
    EXECUTIVE INTELLIGENCE
====================================================== */}

{selectedRegion &&
  selectedYear &&
  selectedQuarter && (
    <section className="executive-intelligence-panel">

      <div className="executive-intelligence-header">

        <div>
          <div className="executive-eyebrow">
            EXECUTIVE INTELLIGENCE
          </div>

          <h2>
            What changed?
          </h2>

          <p>
            Deterministic business signals derived from
            governed warehouse data.
          </p>
        </div>

        <div className="executive-governance">
          <span className="green-dot"></span>
          VERIFIED SIGNALS
        </div>

      </div>

      {insightsLoading ? (

        <div className="executive-loading">
          Analyzing business signals...
        </div>

      ) : insightsError ? (

        <div className="executive-error">
          {insightsError}
        </div>

      ) : insights ? (

        <>

          <div className="executive-summary">

            <div className="executive-summary-label">
              EXECUTIVE SUMMARY
            </div>

            <p>
              {insights.summary}
            </p>

          </div>


          <div className="executive-insight-grid">

            {insights.insights.map(
              (insight, index) => (

                <div
                  className={`executive-insight-card ${insight.type}`}
                  key={`${insight.title}-${index}`}
                >

                  <div className="executive-insight-top">

                    <span className="executive-insight-number">
                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    <span className="executive-insight-priority">
                      {insight.priority}
                    </span>

                  </div>

                  <h3>
                    {insight.title}
                  </h3>

                  <p>
                    {insight.message}
                  </p>

                </div>

              )
            )}

          </div>


          <div className="executive-driver-strip">

            <div>

              <span>
                PRIMARY COST SIGNAL
              </span>

              <strong>
                {insights.top_driver.name}
              </strong>

            </div>


            <div>

              <span>
                COST-RATE MOVEMENT
              </span>

              <strong>
                {insights.top_driver.rate_change_pp > 0
                  ? "+"
                  : ""}
                {insights.top_driver.rate_change_pp.toFixed(
                  2
                )}
                pp
              </strong>

            </div>


            <div>

              <span>
                MARGIN MOVEMENT
              </span>

              <strong>
                {insights.metrics.margin_change_pp > 0
                  ? "+"
                  : ""}
                {insights.metrics.margin_change_pp.toFixed(
                  2
                )}
                pp
              </strong>

            </div>


            <div>

              <span>
                REVENUE MOVEMENT
              </span>

              <strong>
                {insights.metrics.revenue_change_pct > 0
                  ? "+"
                  : ""}
                {insights.metrics.revenue_change_pct.toFixed(
                  1
                )}
                %
              </strong>

            </div>

          </div>


          <div className="executive-evidence">

            <span>
              SOURCE:{" "}
              {insights.governance.source}
            </span>

            <span>
              METHOD:{" "}
              {insights.governance.calculation}
            </span>

            <span>
              ✓ Governance passed
            </span>

          </div>

        </>

      ) : (

        <div className="executive-loading">
          Select a complete period to generate
          executive insights.
        </div>

      )}

    </section>
  )}


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

              {regional.map(
                (item, index) => {

                  const name =
                    item.region ??
                    item.name ??
                    `Region ${
                      index + 1
                    }`;

                  const value =
                    Number(
                      item.revenue ??
                        item.total_revenue ??
                        0
                    );

                  const max =
                    Math.max(
                      ...regional.map(
                        (x) =>
                          Number(
                            x.revenue ??
                              x.total_revenue ??
                              0
                          )
                      ),
                      1
                    );

                  const width =
                    (value / max) * 100;

                  return (

                    <div
                      className="bar-row"
                      key={`${name}-${index}`}
                    >

                      <div className="bar-label">

                        <span>
                          {name}
                        </span>

                        <strong>
                          {formatMoney(
                            value
                          )}
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
                }
              )}

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

                <span>
                  REGION
                </span>

                <span>
                  PROFIT
                </span>

                <span>
                  MARGIN
                </span>

              </div>


              {performance.map(
                (item, index) => {

                  const region =
                    item.region ??
                    item.name ??
                    `Region ${
                      index + 1
                    }`;

                  const profit =
                    Number(
                      item.profit ??
                        item.total_profit ??
                        0
                    );

                  const margin =
                    Number(
                      item.margin ??
                        item.profit_margin ??
                        0
                    );

                  return (

                    <div
                      className="table-row"
                      key={`${region}-${index}`}
                    >

                      <span>
                        {region}
                      </span>

                      <strong>
                        {formatMoney(
                          profit
                        )}
                      </strong>

                      <span className="margin">
                        {margin > 1
                          ? `${margin.toFixed(
                              1
                            )}%`
                          : `${(
                              margin * 100
                            ).toFixed(
                              1
                            )}%`}
                      </span>

                    </div>

                  );
                }
              )}

            </div>

          )}

        </Panel>


        {/* ===================================================
            PERFORMANCE TIMELINE
        ==================================================== */}

        <Panel
          title="Performance timeline"
          subtitle={
            selectedYear ||
            selectedQuarter
              ? `Monthly governed performance • ${
                  selectedYear ||
                  "All years"
                } • ${
                  selectedQuarter ||
                  "All quarters"
                }`
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

              {monthly.map(
                (item, index) => {

                  const monthNumber =
                    Number(
                      item.month ??
                        index + 1
                    );

                  const quarter =
                    item.quarter ??
                    getQuarterFromMonth(
                      monthNumber
                    );

                  const year =
                    item.year ?? "";

                  const label =
                    `${year} ${quarter} / M${monthNumber}`;

                  const revenue =
                    Number(
                      item.revenue ??
                        item.total_revenue ??
                        0
                    );

                  const profit =
                    Number(
                      item.profit ??
                        item.total_profit ??
                        0
                    );

                  const maxRevenue =
                    Math.max(
                      ...monthly.map(
                        (x) =>
                          Number(
                            x.revenue ??
                              x.total_revenue ??
                              0
                          )
                      ),
                      1
                    );

                  const width =
                    (revenue /
                      maxRevenue) *
                    100;

                  return (

                    <div
                      className="timeline-item"
                      key={`${year}-${monthNumber}-${index}`}
                    >

                      <div className="timeline-top">

                        <span>
                          {label}
                        </span>

                        <strong>
                          {formatMoney(
                            revenue
                          )}
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
                        Profit{" "}
                        {formatMoney(
                          profit
                        )}
                      </small>

                    </div>

                  );
                }
              )}

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

              {costDrivers.map(
                (driver, index) => (

                  <div
                    className="driver"
                    key={driver.name}
                  >

                    <div>

                      <span className="driver-number">
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <span>
                        {driver.name}
                      </span>

                    </div>

                    <strong>
                      {formatMoney(
                        driver.value
                      )}
                    </strong>

                  </div>

                )
              )}

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
          Semantic layer{" "}
          <strong>
            v1.0
          </strong>
        </div>


        <div>
          Warehouse{" "}
          <strong>
            Connected
          </strong>
        </div>


        <div>
          Data status{" "}
          <strong>
            Verified
          </strong>
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

          <h2>
            {title}
          </h2>

          <p>
            {subtitle}
          </p>

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
  if (
    !Number.isFinite(
      Number(value)
    )
  ) {
    return "$0";
  }

  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }
  ).format(Number(value));
}


/* ===========================================================
   FORMAT NUMBER
=========================================================== */

function formatNumber(value) {
  if (
    !Number.isFinite(
      Number(value)
    )
  ) {
    return "0";
  }

  return new Intl.NumberFormat(
    "en-US"
  ).format(
    Math.round(
      Number(value)
    )
  );
}


/* ===========================================================
   QUARTER FROM MONTH
=========================================================== */

function getQuarterFromMonth(
  month
) {
  const value =
    Number(month);

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


/* ===========================================================
   FORMAT AGENT VALUE
=========================================================== */

function formatAgentValue(
  value,
  metric
) {
  const numericValue =
    Number(value);

  if (
    !Number.isFinite(
      numericValue
    )
  ) {
    return "—";
  }

  if (
    metric ===
    "Profit Margin"
  ) {
    return `${numericValue.toFixed(
      2
    )}%`;
  }

  if (
    metric === "Orders"
  ) {
    return formatNumber(
      numericValue
    );
  }

  return formatMoney(
    numericValue
  );
}


/* ===========================================================
   FORMAT AGENT FILTERS
=========================================================== */

function formatAgentFilters(
  filters = {}
) {
  const parts = [];

  if (filters.region) {
    parts.push(
      filters.region
    );
  }

  if (filters.year) {
    parts.push(
      filters.year
    );
  }

  if (filters.quarter) {
    parts.push(
      filters.quarter
    );
  }

  return parts.length > 0
    ? parts.join(" • ")
    : "selected period";
}


/* ===========================================================
   FOLLOW-UP QUESTION CONTEXT
=========================================================== */

/* ===========================================================
   CONTEXT-AWARE QUESTION RESOLUTION
=========================================================== */

function resolveFollowUpQuestion(
  question,
  history,
  dashboardContext = {}
) {
  const trimmed = question.trim();

  if (!trimmed) {
    return trimmed;
  }

  const lower = trimmed.toLowerCase();

  /*
   * ---------------------------------------------------------
   * Detect explicit context in the user's question
   * ---------------------------------------------------------
   */

  const hasRegion =
    lower.includes("asia") ||
    lower.includes("europe") ||
    lower.includes("north america");

  const hasYear =
    /\b20\d{2}\b/.test(trimmed);

  const hasQuarter =
    /\bq[1-4]\b/i.test(trimmed) ||
    lower.includes("first quarter") ||
    lower.includes("second quarter") ||
    lower.includes("third quarter") ||
    lower.includes("fourth quarter");

  /*
   * ---------------------------------------------------------
   * Detect breakdown requests.
   *
   * A breakdown dimension should not inherit the same
   * dimension as a restrictive filter.
   *
   * Example:
   *
   * Dashboard:
   * Europe / 2025 / Q3
   *
   * Question:
   * "Show revenue by region in 2025"
   *
   * Result:
   * "Show revenue by region in 2025 for quarter Q3"
   *
   * Region is intentionally NOT inherited because the user
   * explicitly asked for a regional breakdown.
   * ---------------------------------------------------------
   */

  const asksByRegion =
    lower.includes("by region") ||
    lower.includes("per region") ||
    lower.includes("regional");

  const asksByQuarter =
    lower.includes("by quarter") ||
    lower.includes("per quarter") ||
    lower.includes("quarterly");

  const asksByMonth =
    lower.includes("by month") ||
    lower.includes("per month") ||
    lower.includes("monthly") ||
    lower.includes("over time") ||
    lower.includes("trend");

  /*
   * ---------------------------------------------------------
   * Build the best available context.
   *
   * Priority:
   *
   * 1. Explicit value in current question
   * 2. Latest verified Copilot result
   * 3. Current dashboard filters
   * ---------------------------------------------------------
   */

  const latest = history?.[0];

  const historyFilters =
    latest?.result?.filters || {};

  const context = {
    region:
      dashboardContext.region ||
      historyFilters.region ||
      "",

    year:
      dashboardContext.year ||
      historyFilters.year ||
      "",

    quarter:
      dashboardContext.quarter ||
      historyFilters.quarter ||
      "",
  };

  const contextParts = [];

  /*
   * ---------------------------------------------------------
   * Region
   *
   * Do not inherit the selected region when the user asks
   * for a regional breakdown.
   * ---------------------------------------------------------
   */

  if (
    context.region &&
    !hasRegion &&
    !asksByRegion
  ) {
    contextParts.push(
      `region ${context.region}`
    );
  }

  /*
   * ---------------------------------------------------------
   * Year
   *
   * Explicit year always wins.
   * If absent, inherit dashboard/history year.
   * ---------------------------------------------------------
   */

  if (
    !hasYear &&
    context.year
  ) {
    contextParts.push(
      `year ${context.year}`
    );
  }

  /*
   * ---------------------------------------------------------
   * Quarter
   *
   * Explicit quarter always wins.
   *
   * If the user asks for a quarter breakdown, don't force
   * the current quarter.
   *
   * Otherwise inherit the current dashboard/history quarter.
   * ---------------------------------------------------------
   */

  if (
    !hasQuarter &&
    context.quarter &&
    !asksByQuarter
  ) {
    contextParts.push(
      `quarter ${context.quarter}`
    );
  }

  /*
   * ---------------------------------------------------------
   * If no context is available, return the question unchanged.
   * ---------------------------------------------------------
   */

  if (
    contextParts.length === 0
  ) {
    return trimmed;
  }

  return `${trimmed} for ${contextParts.join(
    ", "
  )}`;
}