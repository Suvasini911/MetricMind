"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";

const API_BASE = "http://127.0.0.1:8000";

import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Database,
  Gauge,
  MessageSquare,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";

const suggestions = [
  "What was Europe revenue in Q3 2025?",
  "Show revenue by region in Q3 2025.",
  "Which region has the highest margin?",
  "Why did Europe's margin decline?",
];

const platformStats = [
  {
    label: "Warehouse",
    value: "Connected",
    detail: "Corporate sales data",
    icon: Database,
    status: "healthy",
  },
  {
  label: "Certified Metrics",
  value: "7",
  detail: "Governed business measures",
  icon: Gauge,
  status: "healthy",
},
{
  label: "Dimensions",
  value: "3",
  detail: "Region, year and quarter filters",
  icon: Network,
  status: "healthy",
},
  {
    label: "Governance",
    value: "Passed",
    detail: "Controlled analytical execution",
    icon: ShieldCheck,
    status: "healthy",
  },
];

export default function Home() {
  const [query, setQuery] = useState(
    "Why did Europe's margin decline?"
  );

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [stage, setStage] = useState(0);

  
  async function handleAnalyze() {
    const question = query.trim();

    if (!question || isAnalyzing) {
      return;
    }

    setIsAnalyzing(true);
    setResult(null);
    setStage(1);

    try {
      setStage(2);

      const response = await fetch(
        `${API_BASE}/api/agent/analyze?question=${encodeURIComponent(question)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "The backend could not process your question."
        );
      }

      setStage(3);

      if (data.status !== "verified") {
        setResult({
          title: "Question not verified",
          summary:
            data.reason ||
            "The question could not pass MetricMind's validation rules. Try asking about a supported metric, region, year, or quarter.",
          metrics: [],
          drivers: [],
        });

        setStage(4);
        return;
      }

      const formattedValue =
        data.metric === "Profit Margin"
          ? `${Number(data.value).toFixed(2)}%`
          : data.metric === "Orders"
            ? Number(data.value).toLocaleString("en-US")
            : new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 2,
              }).format(Number(data.value));

      const filterText =
        data.filters && Object.keys(data.filters).length
          ? Object.entries(data.filters)
              .map(([key, value]) => `${key}: ${value}`)
              .join(", ")
          : "No additional filters";

      
setResult({
  title: `${data.metric} · Verified result`,
  summary: `${data.metric} is ${formattedValue}. Scope: ${filterText}. Source: ${data.source || "Governed warehouse"}. Formula: ${data.formula || "Certified metric definition"}.`,
  metrics: [
    {
      label: data.metric,
      value: formattedValue,
    },
    {
      label: "Governance",
      value: "Passed",
    },
    {
      label: "Data source",
      value: data.source || "Warehouse",
    },
  ],
  drivers: [],
  visualization: data.visualization || null,
queryTrace: data.query_trace || null,
visualizationQueryTrace:
  data.visualization?.query_trace || null,
apiCall: data.api_call || null,
});


      setStage(4);
    } catch (error) {
      setResult({
        title: "Analysis unavailable",
        summary:
          error.message ||
          "Unable to connect to MetricMind's backend. Check that FastAPI is running on port 8000.",
        metrics: [],
        drivers: [],
      });

      setStage(0);
    } finally {
      setIsAnalyzing(false);
    }
  }


  return (
    <div className="mm-app-shell">
  <Sidebar />
  <main className="mm-main-content min-h-screen bg-[#06080c] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[28%] top-[-220px] h-[600px] w-[600px] rounded-full bg-indigo-500/[0.055] blur-[150px]" />
        <div className="absolute right-[-180px] top-[35%] h-[500px] w-[500px] rounded-full bg-cyan-500/[0.035] blur-[150px]" />
      </div>

      <div className="relative flex min-h-screen">
        {/* ================================================= */}
        {/* SIDEBAR */}
        {/* ================================================= */}

        

        {/* ================================================= */}
        {/* MAIN CONTENT */}
        {/* ================================================= */}

        <section className="min-w-0 flex-1">
          {/* Top bar */}
          <header className="flex h-[72px] items-center justify-between border-b border-white/[0.07] px-5 lg:px-10">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.025] lg:hidden">
                <BarChart3 size={16} />
              </div>

              <div>
                <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/25">
                  Workspace
                </p>

                <h2 className="mt-0.5 text-sm font-medium">
                  Command Center
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2 md:flex">
                <Search size={13} className="text-white/25" />

                <span className="text-[10px] text-white/25">
                  Search workspace
                </span>

                <kbd className="ml-5 rounded border border-white/10 px-1.5 py-0.5 text-[8px] text-white/20">
                  âŒ˜ K
                </kbd>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/[0.04] px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                <span className="text-[9px] font-medium uppercase tracking-wider text-emerald-300">
                  Live
                </span>
              </div>
            </div>
          </header>

          {/* Dashboard */}
          <div className="mx-auto max-w-[1600px] px-5 py-8 lg:px-12 lg:py-11">
            {/* ================================================= */}
            {/* EXECUTIVE HERO */}
            {/* ================================================= */}

            <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div className="max-w-4xl">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-md border border-indigo-400/15 bg-indigo-400/[0.06] px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.16em] text-indigo-300">
                    Governed Business Intelligence
                  </span>

                  <span className="text-[10px] text-white/15">
                    /
                  </span>

                  <span className="text-[10px] text-white/30">
                    Corporate Sales
                  </span>
                </div>

                <h1 className="max-w-4xl text-4xl font-semibold leading-[1.04] tracking-[-0.045em] sm:text-5xl lg:text-[64px] xl:text-[72px]">
                  From business questions
                  <span className="text-white/30">
                    {" "}to verified intelligence.
                  </span>
                </h1>

                <p className="mt-6 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
                  MetricMind turns natural-language business questions into
                  governed analysis, warehouse-backed answers, transparent
                  calculations, and actionable executive insight.
                </p>
              </div>

              <div className="xl:min-w-[220px] xl:text-right">
                <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/20">
                  Analytical environment
                </p>

                <div className="mt-2 flex items-center gap-2 xl:justify-end">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                  <span className="text-xs text-white/50">
                    Warehouse connected
                  </span>
                </div>

                <p className="mt-1 text-[10px] text-white/20">
                  2,000 records available
                </p>
              </div>
            </div>

            {/* ================================================= */}
            {/* PLATFORM TRUST STRIP */}
            {/* ================================================= */}

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {platformStats.map((stat) => (
                <PlatformStat
                  key={stat.label}
                  {...stat}
                />
              ))}
            </div>

            {/* ================================================= */}
            {/* ASK METRICMIND */}
            {/* ================================================= */}

            <div className="mt-7 rounded-3xl border border-indigo-300/[0.16] bg-gradient-to-br from-indigo-400/[0.07] via-white/[0.025] to-cyan-300/[0.025] p-1 shadow-2xl shadow-indigo-950/20 transition duration-300 hover:border-indigo-300/[0.24]">
              <div className="rounded-[14px] border border-white/[0.05] bg-[#0b0e14]">
                <div className="flex flex-col gap-5 p-5 lg:p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-400/[0.08] text-indigo-300">
                      <Sparkles size={17} />
                    </div>

                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-indigo-300/70">
                        Ask MetricMind
                      </p>

                      <p className="mt-1 text-[11px] text-white/30">
                        Ask a business question and receive a governed answer.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <input
                      value={query}
                      onChange={(event) =>
                        setQuery(event.target.value)
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          handleAnalyze();
                        }
                      }}
                      className="min-w-0 flex-1 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-4 text-base text-white outline-none transition placeholder:text-white/25 focus:border-indigo-300/35 focus:bg-white/[0.04] focus:ring-4 focus:ring-indigo-400/[0.06] sm:text-lg"
                      placeholder="Ask a business question..."
                    />

                    <button
                      onClick={handleAnalyze}
                      disabled={
                        isAnalyzing || !query.trim()
                      }
                      className="flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-[#070910] shadow-lg shadow-white/[0.06] transition duration-200 hover:-translate-y-0.5 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                    >
                      {isAnalyzing
                        ? "Analyzing..."
                        : "Analyze"}

                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                <div className="border-t border-white/[0.05] px-5 py-4 lg:px-6">
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((item) => (
                      <button
                        key={item}
                        onClick={() =>
                          handleSuggestion(item)
                        }
                        className="rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2 text-[10px] text-white/35 transition hover:border-indigo-400/20 hover:bg-indigo-400/[0.04] hover:text-white/70"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ================================================= */}
            {/* ANALYSIS RESULT */}
            {/* ================================================= */}

            {result && (
              <div className="mt-6 overflow-hidden rounded-2xl border border-indigo-400/10 bg-[#090c12] shadow-2xl shadow-indigo-950/10">
                {/* Header */}
                <div className="flex flex-col gap-3 border-b border-white/[0.06] px-5 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-400/[0.08]">
                        <Sparkles
                          size={14}
                          className="text-indigo-300"
                        />
                      </div>

                      <p className="text-sm font-medium">
                        {result.title}
                      </p>
                    </div>

                    <p className="mt-1 text-[10px] text-white/25">
                      Governed analytical response
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-white/[0.07] bg-white/[0.025] px-2.5 py-1 text-[9px] text-white/35">
                      WAREHOUSE
                    </span>

                    <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/10 bg-emerald-400/[0.04] px-2.5 py-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                      <span className="text-[9px] font-medium text-emerald-300">
                        VERIFIED
                      </span>
                    </div>
                  </div>
                </div>

                {/* Insight */}
                <div className="border-b border-white/[0.05] px-5 py-5 lg:px-6">
                  <div className="flex gap-3">
                    <div className="mt-1 h-8 w-1 shrink-0 rounded-full bg-indigo-400/50" />

                    <p className="max-w-4xl text-sm leading-6 text-white/65">
                      {result.summary}
                    </p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid gap-px border-b border-white/[0.05] bg-white/[0.04] sm:grid-cols-3">
                  {result.metrics.map((metric, index) => (
                    <div
                      key={metric.label}
                      className="bg-[#090c12] p-5 transition hover:bg-white/[0.02]"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-[9px] uppercase tracking-[0.16em] text-white/25">
                          {metric.label}
                        </p>

                        <span className="text-[9px] text-white/15">
                          0{index + 1}
                        </span>
                      </div>

                      <p className="mt-3 text-xl font-semibold tracking-tight text-white">
                        {metric.value}
                      </p>
                    </div>
                  ))}
                </div>

                
{/* Governed visualization from FastAPI */}
{result.visualization?.data?.length > 0 && (
  <div className="border-b border-white/[0.06] p-5 lg:p-6">
    <div className="mb-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-200">
        Warehouse visualization
      </p>
      <h3 className="mt-2 text-base font-semibold text-white">
        {result.visualization.title || "Metric breakdown"}
      </h3>
      <p className="mt-1 text-xs text-white/40">
        {result.visualization.dimension} · {result.visualization.metric}
      </p>
    </div>

    <div className="space-y-4">
      {result.visualization.data.map((point, index) => {
        const values = result.visualization.data.map(
          (item) => Math.abs(Number(item.value) || 0)
        );
        const maxValue = Math.max(...values, 1);
        const value = Number(point.value) || 0;
        const width = Math.max(
          2,
          (Math.abs(value) / maxValue) * 100
        );

        return (
          <div key={`${point.label}-${index}`}>
            <div className="mb-2 flex items-center justify-between gap-4">
              <span className="text-sm text-white/65">
                {point.label}
              </span>
              <span className="text-sm font-medium tabular-nums text-white">
                {result.visualization.metric.toLowerCase().includes("revenue") ||
result.visualization.metric.toLowerCase().includes("profit") ||
result.visualization.metric.toLowerCase().includes("cost")
  ? new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(value)
  : value.toLocaleString("en-US", {
      maximumFractionDigits: 2,
    })}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-cyan-300 transition-all duration-700"
                style={{ width: `${width}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>

    <p className="mt-4 text-[11px] text-emerald-300/70">
      Source: {result.visualization.source || "Governed warehouse"}
    </p>
  </div>
)}


                {/* Cost drivers */}
                {result.drivers.length > 0 && (
                  <div className="border-b border-white/[0.05] p-5 lg:p-6">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-white/25">
                          Cost Driver Impact
                        </p>

                        <p className="mt-1 text-xs text-white/35">
                          Ranked contribution to the observed movement
                        </p>
                      </div>

                      <BarChart3
                        size={15}
                        className="text-indigo-300/60"
                      />
                    </div>

                    <div className="mt-5 space-y-4">
                      {result.drivers.map((driver, index) => {
                        const parsed = parseDriver(driver);

                        return (
                          <div key={index}>
                            <div className="mb-2 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-400/[0.08] text-[9px] text-indigo-300">
                                  {String(index + 1).padStart(
                                    2,
                                    "0"
                                  )}
                                </span>

                                <span className="text-[11px] text-white/50">
                                  {parsed.name}
                                </span>
                              </div>

                              <span className="text-[10px] font-medium text-white/55">
                                {parsed.value}
                              </span>
                            </div>

                            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.04]">
                              <div
                                className="h-full rounded-full bg-indigo-400/60 transition-all duration-700"
                                style={{
                                  width: `${Math.max(
                                    8,
                                    parsed.percentage
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Analytical trace */}
                <div className="p-5 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-white/25">
                        Analytical Trace
                      </p>

                      <p className="mt-1 text-xs text-white/30">
                        How MetricMind arrived at this result
                      </p>
                    </div>

                    <span className="rounded-md border border-indigo-400/10 bg-indigo-400/[0.05] px-2 py-1 text-[9px] font-medium text-indigo-300">
                      GOVERNED
                    </span>
                  </div>

                  <div className="mt-4 grid gap-2 md:grid-cols-2">
                    {result.drivers.length > 0 ? (
                      <>
                        <TraceItem
                          number="01"
                          text="Retrieved governed metrics from the warehouse"
                        />

                        <TraceItem
                          number="02"
                          text="Compared the relevant performance periods"
                        />

                        <TraceItem
                          number="03"
                          text="Calculated margin movement and cost changes"
                        />

                        <TraceItem
                          number="04"
                          text="Ranked cost drivers by observed movement"
                        />
                      </>
                    ) : (
                      <>
                        <TraceItem
                          number="01"
                          text="Natural-language intent identified"
                        />

                        <TraceItem
                          number="02"
                          text="Governed metric selected"
                        />

                        <TraceItem
                          number="03"
                          text="Warehouse result retrieved"
                        />

                        <TraceItem
                          number="04"
                          text="Result formatted for explanation"
                        />
                      </>
                    )}
                  
                  </div>
                </div>

                {/* Actual backend query trace */}
                {result.queryTrace && (
                  <div className="border-t border-white/[0.06] p-5 lg:p-6">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-200">
                          Query Transparency
                        </p>
                        <p className="mt-1 text-xs text-white/40">
                          SQL and parameters returned by the governed agent
                        </p>
                      </div>

                      <span className="rounded-lg border border-emerald-400/15 bg-emerald-400/[0.06] px-2 py-1 text-[10px] text-emerald-300">
                        Governed
                      </span>
                    </div>

                    <div className="mt-4 overflow-x-auto rounded-xl border border-white/[0.07] bg-black/30 p-4">
                      <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-6 text-cyan-100/80">
                        {result.queryTrace.sql || "No SQL trace returned."}
                      </pre>
                    </div>

                    <p className="mt-4 text-xs font-medium text-white/55">
                      Bound parameters
                    </p>

                    <pre className="mt-2 overflow-x-auto rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 font-mono text-xs text-white/55">
                      {JSON.stringify(
                        result.queryTrace.parameters ?? [],
                        null,
                        2
                      )}
                    </pre>

                    {result.apiCall && (
                      <>
                        <p className="mt-4 text-xs font-medium text-white/55">
                          API endpoint
                        </p>
                        <p className="mt-2 break-all rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 font-mono text-xs text-white/45">
                          {result.apiCall}
                        </p>
                      </>
                    )}
                  
                  </div>
                )}

                {/* Visualization SQL trace */}
                {result.visualizationQueryTrace && (
                  <div className="border-t border-white/[0.06] p-5 lg:p-6">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-200">
                      Visualization Query
                    </p>
                    <p className="mt-1 text-xs text-white/40">
                      SQL used to calculate the chart breakdown
                    </p>

                    <div className="mt-4 overflow-x-auto rounded-xl border border-white/[0.07] bg-black/30 p-4">
                      <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-6 text-cyan-100/80">
                        {result.visualizationQueryTrace.sql ||
                          "No visualization SQL returned."}
                      </pre>
                    </div>

                    <p className="mt-4 text-xs font-medium text-white/55">
                      Chart query parameters
                    </p>

                    <pre className="mt-2 overflow-x-auto rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 font-mono text-xs text-white/55">
                      {JSON.stringify(
                        result.visualizationQueryTrace.parameters ?? [],
                        null,
                        2
                      )}
                    </pre>
                  </div>
                )}
              </div>
            )}



            {/* ================================================= */}
            {/* EXECUTIVE SNAPSHOT */}
            {/* ================================================= */}

            <div className="mt-6">
              <div className="mb-3">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/25">
                  Platform Snapshot
                </p>

                <p className="mt-1 text-xs text-white/30">
                  Current analytical capabilities and controls
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {platformStats.map((stat) => (
                  <PlatformStat
                    key={`snapshot-${stat.label}`}
                    {...stat}
                    compact
                  />
                ))}
              </div>
            </div>

            {/* ================================================= */}
            {/* LOWER BUSINESS INTELLIGENCE GRID */}
            {/* ================================================= */}

            <div className="mt-7 grid items-start gap-5 xl:grid-cols-[1.45fr_1fr]">
              {/* Intelligence pipeline */}
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025]">
                <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
                  <div>
                    <p className="text-sm font-medium">
                      Intelligence Pipeline
                    </p>

                    <p className="mt-1 text-[11px] text-white/25">
                      From natural language to verified business insight
                    </p>
                  </div>

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-400/[0.06]">
                    <Zap
                      size={15}
                      className="text-indigo-300"
                    />
                  </div>
                </div>

                <div className="p-5">
                  <div className="grid gap-3 md:grid-cols-4">
                    <PipelineStep
                      number="01"
                      title="Understand"
                      text="Interpret the business question"
                      active={stage >= 1}
                    />

                    <PipelineStep
                      number="02"
                      title="Govern"
                      text="Validate metrics and dimensions"
                      active={stage >= 2}
                    />

                    <PipelineStep
                      number="03"
                      title="Analyze"
                      text="Query governed warehouse data"
                      active={stage >= 3}
                    />

                    <PipelineStep
                      number="04"
                      title="Explain"
                      text="Return verified insight"
                      active={stage >= 4}
                    />
                  </div>
                </div>
              </div>

              {/* Trust layer */}
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025]">
                <div className="border-b border-white/[0.06] px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/[0.06]">
                      <ShieldCheck
                        size={15}
                        className="text-emerald-300"
                      />
                    </div>

                    <div>
                      <p className="text-sm font-medium">
                        Trust Layer
                      </p>

                      <p className="mt-1 text-[10px] text-white/25">
                        Analytical controls and system health
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 p-5">
                  <TrustRow
  label="Governed metrics"
  value="7"
  positive
/>

<TrustRow
  label="Semantic dimensions"
  value="3"
  positive
/>

                  <TrustRow
                    label="Raw SQL generation"
                    value="Blocked"
                    positive
                  />

                  <TrustRow
                    label="Warehouse connection"
                    value="Healthy"
                    positive
                  />

                  <TrustRow
                    label="Query transparency"
                    value="Enabled"
                    positive
                  />
                </div>
              </div>
            </div>

            {/* ================================================= */}
            {/* EXECUTIVE PRINCIPLE */}
            {/* ================================================= */}

            <div className="mt-6 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02]">
              <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between lg:p-7">
                <div className="max-w-2xl">
                  <div className="mb-3 flex items-center gap-2">
                    <CheckCircle2
                      size={15}
                      className="text-emerald-300"
                    />

                    <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-300/70">
                      MetricMind Principle
                    </span>
                  </div>

                  <p className="text-lg font-medium tracking-tight text-white/85">
                    The intent engine interprets the question.
                    <span className="text-white/35">
                      {" "}The data platform determines the answer.
                    </span>
                  </p>

                  <p className="mt-2 text-xs leading-5 text-white/25">
                    Semantic definitions, governance controls, and
                    warehouse-backed calculations keep business answers
                    explainable and auditable.
                  </p>
                </div>

                <a
                  href="/analytics"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.025] px-4 py-2.5 text-xs font-medium text-white/60 transition hover:border-white/[0.15] hover:bg-white/[0.05] hover:text-white"
                >
                  Explore Analytics
                  <ArrowRight size={13} />
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
        </main>
  </div>
  );
}

/* ========================================================= */
/* COMPONENTS */
/* ========================================================= */

function NavItem({
  icon,
  label,
  active = false,
  href,
}) {
  const className = `flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-xs transition ${
    active
      ? "bg-white/[0.08] font-medium text-white shadow-sm"
      : "text-white/35 hover:bg-white/[0.04] hover:text-white/70"
  }`;

  if (href) {
    return (
      <a href={href} className={className}>
        {icon}
        {label}
      </a>
    );
  }

  return (
    <div className={className}>
      {icon}
      {label}
    </div>
  );
}

function PlatformStat({
  label,
  value,
  detail,
  icon: Icon,
  compact = false,
}) {
  return (
    <div
      className={`group rounded-2xl border border-white/[0.07] bg-white/[0.025] transition hover:border-white/[0.12] hover:bg-white/[0.035] ${
        compact ? "p-4" : "p-4 lg:p-5"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/25">
            {label}
          </p>

          <p className="mt-2 text-lg font-semibold tracking-tight text-white">
            {value}
          </p>

          <p className="mt-1 text-[10px] text-white/25">
            {detail}
          </p>
        </div>

        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.025]">
          <Icon
            size={14}
            className="text-white/30 transition group-hover:text-white/60"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

        <span className="text-[9px] font-medium uppercase tracking-wider text-emerald-300/70">
          Operational
        </span>
      </div>
    </div>
  );
}

function PipelineStep({
  number,
  title,
  text,
  active = false,
}) {
  return (
    <div
      className={`rounded-xl border p-4 transition ${
        active
          ? "border-indigo-400/20 bg-indigo-400/[0.05]"
          : "border-white/[0.06] bg-white/[0.02]"
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-[9px] font-medium tracking-[0.15em] text-white/20">
          {number}
        </p>

        {active && (
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-300" />
        )}
      </div>

      <p className="mt-3 text-xs font-medium">
        {title}
      </p>

      <p className="mt-1 text-[10px] leading-5 text-white/25">
        {text}
      </p>
    </div>
  );
}

function TrustRow({
  label,
  value,
  positive = false,
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2.5">
      <span className="text-[10px] text-white/35">
        {label}
      </span>

      <div className="flex items-center gap-1.5">
        {positive && (
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
        )}

        <span className="text-[10px] font-medium text-white/60">
          {value}
        </span>
      </div>
    </div>
  );
}

function parseDriver(driver) {
  const match = driver.match(
    /^(.*?):\s*\$?([\d,]+(?:\.\d+)?)\s*change$/i
  );

  if (!match) {
    return {
      name: driver,
      value: "",
      percentage: 30,
    };
  }

  const numericValue = Number(
    match[2].replace(/,/g, "")
  );

  const percentage = Math.min(
    100,
    Math.max(
      10,
      (numericValue / 180000) * 100
    )
  );

  return {
    name: match[1],
    value: `$${numericValue.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    percentage,
  };
}

function TraceItem({
  number,
  text,
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-indigo-400/[0.08] text-[9px] text-indigo-300">
        {number}
      </span>

      <span className="text-[10px] leading-5 text-white/35">
        {text}
      </span>

      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400/60" />
    </div>
  );
}
