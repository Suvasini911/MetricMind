"use client";

import Link from "next/link";
import Sidebar from "../../components/Sidebar";

export default function GovernancePage() {
  return (
    <main className="min-h-screen bg-[#06080c] text-white">
      <div className="flex min-h-screen">

        <Sidebar />

        <section className="min-w-0 flex-1">

          <header className="border-b border-white/[0.07] px-6 py-5 lg:px-10">
            <p className="text-xs text-white/30">
              System
            </p>
            <h2 className="text-sm font-medium">
              Governance
            </h2>
          </header>

          <div className="mx-auto max-w-6xl px-6 py-10 lg:px-10">

            <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-300">
              TRUST LAYER
            </p>

            <h1 className="mt-3 text-4xl font-semibold">
              Governance
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/40">
              Controls that keep MetricMind analytical requests
              aligned with governed business definitions.
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-2">

              <Status
                title="Governed metrics"
                value="8"
                description="Approved business measures are available to the analytical agent."
              />

              <Status
                title="Semantic dimensions"
                value="4"
                description="Approved dimensions provide controlled analytical breakdowns."
              />

              <Status
                title="Raw SQL generation"
                value="Blocked"
                description="Unrestricted AI-generated SQL is not used as the analytical interface."
              />

              <Status
                title="Data connection"
                value="Healthy"
                description="MetricMind is connected to the warehouse."
              />

            </div>

            <div className="mt-8 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6">

              <h2 className="text-sm font-medium">
                Governance principle
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/40">
                AI interprets the business question. The semantic
                layer defines the metric. Governance controls the
                request. The warehouse calculates the result.
              </p>

            </div>

          </div>
        </section>
      </div>
    </main>
  );
}

function Status({ title, value, description }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6">

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium">
          {title}
        </h2>

        <span className="text-sm text-emerald-300">
          {value}
        </span>
      </div>

      <p className="mt-4 text-xs leading-5 text-white/35">
        {description}
      </p>

    </div>
  );
}

