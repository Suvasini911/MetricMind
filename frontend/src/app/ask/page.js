"use client";

import Link from "next/link";
import Sidebar from "../../components/Sidebar";

const API = "http://127.0.0.1:8000";

export default function AskMetricMindPage() {
  return (
    <main className="min-h-screen bg-[#06080c] text-white">
      <div className="flex min-h-screen">

         <Sidebar />

        {/* CONTENT */}
        <section className="min-w-0 flex-1">

          <header className="border-b border-white/[0.07] px-6 py-5 lg:px-10">
            <p className="text-xs text-white/30">
              Workspace
            </p>

            <h2 className="text-sm font-medium">
              Ask MetricMind
            </h2>
          </header>

          <div className="mx-auto max-w-5xl px-6 py-12 lg:px-10">

            <div className="mb-8">
              <p className="text-[10px] uppercase tracking-[0.2em] text-indigo-300">
                GOVERNED QUERY COPILOT
              </p>

              <h1 className="mt-3 text-4xl font-semibold">
                Ask MetricMind.
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/40">
                Ask business questions in natural language.
                MetricMind maps the request to governed metrics
                and returns verified analytical results.
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">

              <div className="mb-5">
                <p className="text-xs uppercase tracking-[0.15em] text-white/30">
                  Example questions
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">

                <Example>
                  What was Europe revenue in Q3 2025?
                </Example>

                <Example>
                  What was Europe profit margin in Q3 2025?
                </Example>

                <Example>
                  Show revenue by quarter in 2025.
                </Example>

                <Example>
                  Why did Europe's margin decline in Q3 2025?
                </Example>

              </div>

            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">

              <Info
                title="Understand"
                text="Identify the business intent and requested metric."
              />

              <Info
                title="Govern"
                text="Validate the request against approved metrics and dimensions."
              />

              <Info
                title="Analyze"
                text="Retrieve the governed result from the warehouse."
              />

            </div>

            <div className="mt-6 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.025] p-5">
              <p className="text-xs text-emerald-300">
                Certified analytical path
              </p>

              <p className="mt-2 text-sm text-white/50">
                Natural language → Intent → Semantic metric →
                Governance → Warehouse → Verified result
              </p>
            </div>

            <div className="mt-8">
              <Link
                href="/analytics"
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/70 hover:bg-white/5"
              >
                Open Live Analytics →
              </Link>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
}

function Nav({ href, label, active }) {
  return (
    <Link
      href={href}
      className={`block rounded-lg px-3 py-2 text-xs transition ${
        active
          ? "bg-white/[0.08] text-white"
          : "text-white/40 hover:bg-white/[0.04] hover:text-white"
      }`}
    >
      {label}
    </Link>
  );
}

function Example({ children }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 text-sm text-white/60">
      “{children}”
    </div>
  );
}

function Info({ title, text }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
      <p className="text-sm font-medium">
        {title}
      </p>

      <p className="mt-2 text-xs leading-5 text-white/35">
        {text}
      </p>
    </div>
  );
}
