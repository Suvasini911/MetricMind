"use client";

import { useState } from "react";

import { analyzeQuestion } from "../lib/mockEngine";

import {
  Activity,
  ArrowRight,
  BarChart3,
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
  "What was Q3 revenue?",
  "Show European sales",
  "Which region has the highest margin?",
  "Why did European margins drop?",
];

const metrics = [
  {
    label: "Revenue",
    value: "$12.48M",
    change: "+12.8%",
    icon: TrendingUp,
  },
  {
    label: "Profit",
    value: "$3.21M",
    change: "+8.4%",
    icon: BarChart3,
  },
  {
    label: "Margin",
    value: "25.7%",
    change: "+2.1pp",
    icon: Gauge,
  },
  {
    label: "Orders",
    value: "18.4K",
    change: "+6.9%",
    icon: Activity,
  },
];

export default function Home() {

  const [query, setQuery] = useState(
    "Why did European margins drop in Q3?"
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
      setTimeout(resolve, 600)
    );

    setStage(2);

    await new Promise((resolve) =>
      setTimeout(resolve, 700)
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
        <div className="absolute left-1/3 top-[-180px] h-[500px] w-[500px] rounded-full bg-indigo-500/[0.07] blur-[140px]" />
        <div className="absolute right-[-100px] top-1/3 h-[450px] w-[450px] rounded-full bg-cyan-500/[0.04] blur-[140px]" />
      </div>

      <div className="relative flex min-h-screen">

        {/* ================================================= */}
        {/* SIDEBAR */}
        {/* ================================================= */}

        <aside className="hidden w-[250px] shrink-0 border-r border-white/[0.07] bg-[#090b10] lg:flex lg:flex-col">

          {/* Brand */}
          <div className="border-b border-white/[0.07] p-6">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black shadow-lg shadow-white/10">
                <BarChart3 size={20} strokeWidth={2.2} />
              </div>

              <div>
                <h1 className="text-[15px] font-semibold tracking-tight">
                  MetricMind
                </h1>

                <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-white/30">
                  Intelligence OS
                </p>
              </div>

            </div>

          </div>

          {/* Navigation */}
          <div className="flex-1 p-4">

            <p className="mb-3 px-3 text-[10px] font-medium uppercase tracking-[0.18em] text-white/25">
              Workspace
            </p>

            <nav className="space-y-1">

              <NavItem
                icon={<Sparkles size={16} />}
                label="Command Center"
                active
              />

              <NavItem
                icon={<MessageSquare size={16} />}
                label="Ask MetricMind"
              />

              <NavItem
                icon={<BarChart3 size={16} />}
                label="Analytics"
              />

              <NavItem
                icon={<Network size={16} />}
                label="Semantic Catalog"
              />

            </nav>

            <p className="mb-3 mt-8 px-3 text-[10px] font-medium uppercase tracking-[0.18em] text-white/25">
              System
            </p>

            <nav className="space-y-1">

              <NavItem
                icon={<ShieldCheck size={16} />}
                label="Governance"
              />

              <NavItem
                icon={<Database size={16} />}
                label="Data Sources"
              />

            </nav>

          </div>

          {/* System status */}
          <div className="border-t border-white/[0.07] p-4">

            <div className="rounded-xl border border-emerald-400/10 bg-emerald-400/[0.025] p-3">

              <div className="flex items-center gap-2">

                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>

                <span className="text-xs text-emerald-300">
                  Systems operational
                </span>

              </div>

              <p className="mt-2 text-[10px] text-white/25">
                Semantic engine connected
              </p>

            </div>

          </div>

        </aside>

        {/* ================================================= */}
        {/* MAIN CONTENT */}
        {/* ================================================= */}

        <section className="min-w-0 flex-1">

          {/* Header */}
          <header className="flex h-[72px] items-center justify-between border-b border-white/[0.07] px-6 lg:px-10">

            <div className="flex items-center gap-3">

              <div className="lg:hidden">
                <BarChart3 size={20} />
              </div>

              <div>
                <p className="text-xs text-white/30">
                  Workspace
                </p>

                <h2 className="text-sm font-medium">
                  Command Center
                </h2>
              </div>

            </div>

            <div className="flex items-center gap-3">

              <div className="hidden items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.025] px-3 py-2 md:flex">

                <Search size={14} className="text-white/25" />

                <span className="text-xs text-white/25">
                  Search workspace
                </span>

                <kbd className="ml-5 rounded border border-white/10 px-1.5 py-0.5 text-[9px] text-white/25">
                  ⌘ K
                </kbd>

              </div>

              <div className="flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/[0.04] px-3 py-1.5">

                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                <span className="text-[10px] text-emerald-300">
                  LIVE
                </span>

              </div>

            </div>

          </header>

          {/* Dashboard */}
          <div className="mx-auto max-w-[1450px] px-6 py-8 lg:px-10">

            {/* Hero */}
            <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-end">

              <div>

                <div className="mb-4 flex items-center gap-2">

                  <span className="rounded-md border border-indigo-400/10 bg-indigo-400/[0.06] px-2 py-1 text-[10px] uppercase tracking-wider text-indigo-300">
                    AI Analytics
                  </span>

                  <span className="text-[10px] text-white/20">
                    •
                  </span>

                  <span className="text-[10px] text-white/30">
                    Semantic layer v1.0
                  </span>

                </div>

                <h1 className="max-w-3xl text-3xl font-semibold tracking-[-0.03em] sm:text-4xl lg:text-5xl">

                  Understand your business
                  <span className="text-white/30">
                    {" "}at the speed of thought.
                  </span>

                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-white/35">
                  Ask questions in natural language. MetricMind translates
                  them into governed business metrics and turns the results
                  into actionable intelligence.
                </p>

              </div>

              <div className="hidden text-right xl:block">

                <p className="text-[10px] uppercase tracking-[0.2em] text-white/20">
                  Last synchronized
                </p>

                <p className="mt-1 text-xs text-white/45">
                  Just now
                </p>

              </div>

            </div>

            {/* ================================================= */}
            {/* QUERY EXPERIENCE */}
            {/* ================================================= */}

            <div className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-1 shadow-2xl shadow-black/20">

              <div className="rounded-[14px] border border-white/[0.05] bg-[#0b0e14]">

                <div className="flex items-start gap-4 p-5 lg:p-6">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-400/[0.08] text-indigo-300">

                    <Sparkles size={18} />

                  </div>

                  <div className="flex-1">

                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/25">
                      Ask MetricMind
                    </p>

                    <input
  value={query}
  onChange={(event) => setQuery(event.target.value)}
  onKeyDown={(event) => {
    if (event.key === "Enter") {
      handleAnalyze();
    }
  }}
  className="mt-3 w-full bg-transparent text-base text-white outline-none placeholder:text-white/20"
  placeholder="Ask a business question..."
/>

                  </div>

                  <button
  onClick={handleAnalyze}
  disabled={isAnalyzing || !query.trim()}
  className="hidden items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40 sm:flex"
>

  {isAnalyzing ? "Analyzing..." : "Analyze"}

  <ArrowRight size={14} />

</button>

                </div>

                <div className="border-t border-white/[0.05] px-5 py-4 lg:px-6">

                  <div className="flex flex-wrap gap-2">

                    {suggestions.map((item) => (
  <button
    key={item}
    onClick={() => handleSuggestion(item)}
                        className="rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2 text-[11px] text-white/35 transition hover:border-white/15 hover:bg-white/[0.05] hover:text-white/70"
                      >
                        {item}
                      </button>
                    ))}

                  </div>

                </div>

              </div>

            </div>

            {/* ================================================= */}
{result && (
  <div className="mt-6 overflow-hidden rounded-2xl border border-indigo-400/10 bg-[#090c12] shadow-2xl shadow-indigo-950/10">

    {/* Result Header */}
    <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4 lg:px-6">

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

        <span className="hidden rounded-full border border-white/[0.07] bg-white/[0.025] px-2.5 py-1 text-[9px] text-white/35 sm:block">
          WAREHOUSE
        </span>

        <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/10 bg-emerald-400/[0.04] px-2.5 py-1">

          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

          <span className="text-[9px] text-emerald-300">
            VERIFIED
          </span>

        </div>

      </div>

    </div>


    {/* Insight Summary */}
    <div className="border-b border-white/[0.05] px-5 py-5 lg:px-6">

      <div className="flex gap-3">

        <div className="mt-1 h-8 w-1 shrink-0 rounded-full bg-indigo-400/50" />

        <p className="max-w-4xl text-sm leading-6 text-white/65">
          {result.summary}
        </p>

      </div>

    </div>


    {/* Result Metrics */}
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


    {/* Cost Driver Analysis */}
    {result.drivers.length > 0 && (

      <div className="border-b border-white/[0.05] p-5 lg:p-6">

        <div className="flex items-end justify-between">

          <div>

            <p className="text-[9px] uppercase tracking-[0.18em] text-white/25">
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
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="text-[11px] text-white/50">
                      {parsed.name}
                    </span>

                  </div>

                  <span className="text-[10px] font-medium text-white/55">
                    {parsed.value}
                  </span>

                </div>


                {/* Driver bar */}

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


    {/* Analytical Trace */}

    <div className="p-5 lg:p-6">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-[9px] uppercase tracking-[0.18em] text-white/25">
            Analytical Trace
          </p>

          <p className="mt-1 text-xs text-white/30">
            How MetricMind arrived at this result
          </p>

        </div>

        <span className="rounded-md border border-indigo-400/10 bg-indigo-400/[0.05] px-2 py-1 text-[9px] text-indigo-300">
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
              text="Compared Q2 and Q3 performance"
            />

            <TraceItem
              number="03"
              text="Calculated margin movement and cost changes"
            />

            <TraceItem
              number="04"
              text="Ranked cost drivers by increase"
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
            {/* KPI STRIP */}
            {/* ================================================= */}

            <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">

              {metrics.map((metric) => (
                <MetricCard
                  key={metric.label}
                  {...metric}
                />
              ))}

            </div>

            {/* ================================================= */}
            {/* LOWER GRID */}
            {/* ================================================= */}

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">

              {/* Intelligence panel */}
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025]">

                <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">

                  <div>
                    <p className="text-sm font-medium">
                      Intelligence Pipeline
                    </p>

                    <p className="mt-1 text-[11px] text-white/25">
                      How MetricMind processes a question
                    </p>
                  </div>

                  <Zap size={16} className="text-indigo-300" />

                </div>

                <div className="p-5">

                  <div className="grid gap-3 md:grid-cols-4">

                    <PipelineStep
  number="01"
  title="Understand"
  text="Natural language intent"
  active={stage >= 1}
/>

<PipelineStep
  number="02"
  title="Govern"
  text="Validate metric"
  active={stage >= 2}
/>

<PipelineStep
  number="03"
  title="Analyze"
  text="Query governed data"
  active={stage >= 3}
/>

<PipelineStep
  number="04"
  title="Explain"
  text="Generate insight"
  active={stage >= 4}
/>

                  </div>

                </div>

              </div>

              {/* Trust panel */}
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025]">

                <div className="border-b border-white/[0.06] px-5 py-4">

                  <div className="flex items-center gap-2">

                    <ShieldCheck
                      size={16}
                      className="text-emerald-300"
                    />

                    <p className="text-sm font-medium">
                      Trust Layer
                    </p>

                  </div>

                  <p className="mt-1 text-[11px] text-white/25">
                    Governance status
                  </p>

                </div>

                <div className="space-y-3 p-5">

                  <TrustRow
                    label="Governed metrics"
                    value="8"
                  />

                  <TrustRow
                    label="Semantic dimensions"
                    value="4"
                  />

                  <TrustRow
                    label="Raw SQL generation"
                    value="Blocked"
                  />

                  <TrustRow
                    label="Data connection"
                    value="Healthy"
                  />

                </div>

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

function NavItem({ icon, label, active = false }) {
  return (
    <div
      className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-xs transition ${
        active
          ? "bg-white/[0.08] text-white"
          : "text-white/35 hover:bg-white/[0.04] hover:text-white/70"
      }`}
    >
      {icon}
      {label}
    </div>
  );
}


function MetricCard({
  label,
  value,
  change,
  icon: Icon,
}) {
  return (
    <div className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition hover:border-white/[0.12] hover:bg-white/[0.035]">

      <div className="flex items-start justify-between">

        <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">
          {label}
        </p>

        <Icon
          size={15}
          className="text-white/20 transition group-hover:text-white/50"
        />

      </div>

      <p className="mt-4 text-2xl font-semibold tracking-tight">
        {value}
      </p>

      <p className="mt-2 text-[10px] text-emerald-300/70">
        {change} vs previous period
      </p>

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
      className={`rounded-xl border p-4 ${
        active
          ? "border-indigo-400/20 bg-indigo-400/[0.05]"
          : "border-white/[0.06] bg-white/[0.02]"
      }`}
    >

      <p className="text-[9px] font-medium tracking-[0.15em] text-white/20">
        {number}
      </p>

      <p className="mt-3 text-xs font-medium">
        {title}
      </p>

      <p className="mt-1 text-[10px] leading-5 text-white/25">
        {text}
      </p>

    </div>
  );
}


function TrustRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2.5">

      <span className="text-[11px] text-white/35">
        {label}
      </span>

      <span className="text-[10px] text-white/60">
        {value}
      </span>

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


function TraceItem({ number, text }) {
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