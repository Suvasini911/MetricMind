"use client";

import Link from "next/link";
import Sidebar from "../../components/Sidebar";

const metrics = [
  {
    name: "Revenue",
    formula: "SUM(revenue)",
    format: "Currency",
    source: "corporate_sales_raw",
  },
  {
    name: "Profit",
    formula: "SUM(profit)",
    format: "Currency",
    source: "corporate_sales_raw",
  },
  {
    name: "Profit Margin",
    formula: "SUM(profit) / SUM(revenue) × 100",
    format: "Percentage",
    source: "corporate_sales_raw",
  },
  {
    name: "Orders",
    formula: "SUM(orders)",
    format: "Count",
    source: "corporate_sales_raw",
  },
];

const dimensions = [
  "Region",
  "Year",
  "Quarter",
  "Month",
];

export default function SemanticCatalogPage() {
  return (
    <main className="min-h-screen bg-[#06080c] text-white">
      <div className="flex min-h-screen">

        <Sidebar />

        <section className="min-w-0 flex-1">

          <header className="border-b border-white/[0.07] px-6 py-5 lg:px-10">
            <p className="text-xs text-white/30">
              Workspace
            </p>
            <h2 className="text-sm font-medium">
              Semantic Catalog
            </h2>
          </header>

          <div className="mx-auto max-w-6xl px-6 py-10 lg:px-10">

            <p className="text-[10px] uppercase tracking-[0.2em] text-indigo-300">
              GOVERNED BUSINESS DEFINITIONS
            </p>

            <h1 className="mt-3 text-4xl font-semibold">
              Semantic Catalog
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/40">
              The semantic layer defines the approved business
              metrics and dimensions used by MetricMind.
            </p>

            <div className="mt-10">

              <h2 className="mb-4 text-sm font-medium">
                Governed Metrics
              </h2>

              <div className="grid gap-4 md:grid-cols-2">

                {metrics.map((metric) => (
                  <div
                    key={metric.name}
                    className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">
                        {metric.name}
                      </h3>

                      <span className="rounded-full border border-emerald-400/10 px-2 py-1 text-[9px] text-emerald-300">
                        GOVERNED
                      </span>
                    </div>

                    <p className="mt-5 text-[10px] uppercase tracking-[0.15em] text-white/25">
                      Formula
                    </p>

                    <p className="mt-2 text-sm text-indigo-200">
                      {metric.formula}
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[9px] text-white/25">
                          FORMAT
                        </p>
                        <p className="mt-1 text-xs text-white/50">
                          {metric.format}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] text-white/25">
                          SOURCE
                        </p>
                        <p className="mt-1 text-xs text-white/50">
                          {metric.source}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

              </div>
            </div>

            <div className="mt-10">

              <h2 className="mb-4 text-sm font-medium">
                Semantic Dimensions
              </h2>

              <div className="grid gap-3 md:grid-cols-4">
                {dimensions.map((dimension) => (
                  <div
                    key={dimension}
                    className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5"
                  >
                    <p className="text-sm">
                      {dimension}
                    </p>

                    <p className="mt-2 text-[10px] text-emerald-300">
                      APPROVED DIMENSION
                    </p>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </section>
      </div>
    </main>
  );
}

