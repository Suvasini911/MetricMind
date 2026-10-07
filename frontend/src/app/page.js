"use client";

import { useState } from "react";

import { analyzeQuestion } from "../lib/mockEngine";

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
    value: "8",
    detail: "Governed business measures",
    icon: Gauge,
    status: "healthy",
  },
  {
    label: "Dimensions",
    value: "4",
    detail: "Approved analytical dimensions",
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
    if (!query.trim() || isAnalyzing) {
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    setStage(1);

    await new Promise((resolve) =>
      setTimeout(resolve, 500)
    );

    setStage(2);

    await new Promise((resolve) =>
      setTimeout(resolve, 600)
    );

    setStage(3);

    const analysis = await analyzeQuestion(query);

    setStage(4);
    setResult(analysis);
    setIsAnalyzing(false);
  }

  function handleSuggestion(question) {
    setQuery(question);
    setResult(null);
    setStage(0);
  }

  return (
    <main className="min-h-screen bg-[#06080c] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[28%] top-[-220px] h-[600px] w-[600px] rounded-full bg-indigo-500/[0.055] blur-[150px]" />
        <div className="absolute right-[-180px] top-[35%] h-[500px] w-[500px] rounded-full bg-cyan-500/[0.035] blur-[150px]" />
      </div>

      <div className="relative flex min-h-screen">
        {/* ================================================= */}
        {/* SIDEBAR */}
        {/* ================================================= */}

        <aside className="hidden w-[255px] shrink-0 border-r border-white/[0.07] bg-[#090b10] lg:flex lg:flex-col">
          {/* Brand */}
          <div className="border-b border-white/[0.07] px-5 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black shadow-lg shadow-white/10">
                <BarChart3 size={20} strokeWidth={2.2} />
              </div>

              <div>
                <h1 className="text-[15px] font-semibold tracking-tight">
                  MetricMind
                </h1>

                <p className="mt-0.5 text-[9px] uppercase tracking-[0.2em] text-white/30">
                  Executive Intelligence
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-3 py-5">
            <p className="mb-3 px-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/25">
              Workspace
            </p>

            <nav className="space-y-1">
              <NavItem
                icon={<Sparkles size={16} />}
                label="Command Center"
                active
                href="/"
              />

              <NavItem
                icon={<MessageSquare size={16} />}
                label="Ask MetricMind"
                href="/ask"
              />

              <NavItem
                icon={<BarChart3 size={16} />}
                label="Analytics"
                href="/analytics"
              />
            </nav>

            <p className="mb-3 mt-8 px-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/25">
              Trust & Governance
            </p>

            <nav className="space-y-1">
              <NavItem
                icon={<Network size={16} />}
                label="Semantic Catalog"
                href="/semantic-catalog"
              />

              <NavItem
                icon={<ShieldCheck size={16} />}
                label="Governance"
                href="/governance"
              />

              <NavItem
                icon={<Database size={16} />}
                label="Data Sources"
                href="/data-sources"
              />
            </nav>
          </div>

          {/* System status */}
          <div className="border-t border-white/[0.07] p-4">
            <div className="rounded-xl border border-emerald-400/10 bg-emerald-400/[0.025] p-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>

                <span className="text-xs font-medium text-emerald-300">
                  Platform operational
                </span>
              </div>

              <p className="mt-2 text-[10px] leading-4 text-white/25">
                Warehouse, semantic layer and governance services connected.
              </p>
            </div>
          </div>
        </aside>

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
                  ⌘ K
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
          <div className="mx-auto max-w-[1480px] px-5 py-7 lg:px-10 lg:py-9">
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

                <h1 className="max-w-4xl text-3xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-4xl lg:text-[52px]">
                  From business questions
                  <span className="text-white/30">
                    {" "}to verified intelligence.
                  </span>
                </h1>

                <p className="mt-5 max-w-2xl text-sm leading-6 text-white/40">
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

            <div className="mt-8 grid grid-cols-2 gap-3 xl:grid-cols-4">
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

            <div className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-1 shadow-2xl shadow-black/20">
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
                      className="min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-white/20"
                      placeholder="Ask a business question..."
                    />

                    <button
                      onClick={handleAnalyze}
                      disabled={
                        isAnalyzing || !query.trim()
                      }
                      className="flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-xs font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
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

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_1fr]">
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
                    value="8"
                    positive
                  />

                  <TrustRow
                    label="Semantic dimensions"
                    value="4"
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
                    AI interprets the question.
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