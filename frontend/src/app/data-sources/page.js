"use client";

import Link from "next/link";

export default function DataSourcesPage() {
  return (
    <main className="min-h-screen bg-[#06080c] text-white">
      <div className="flex min-h-screen">

        <Sidebar active="Data Sources" />

        <section className="min-w-0 flex-1">

          <header className="border-b border-white/[0.07] px-6 py-5 lg:px-10">
            <p className="text-xs text-white/30">
              System
            </p>

            <h2 className="text-sm font-medium">
              Data Sources
            </h2>
          </header>

          <div className="mx-auto max-w-6xl px-6 py-10 lg:px-10">

            <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-300">
              WAREHOUSE
            </p>

            <h1 className="mt-3 text-4xl font-semibold">
              Data Sources
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/40">
              The governed warehouse source used by MetricMind
              for analytical calculations.
            </p>

            <div className="mt-10 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.025] p-6">

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    MetricMind Warehouse
                  </p>

                  <p className="mt-1 text-xs text-white/30">
                    SQLite analytical warehouse
                  </p>
                </div>

                <span className="rounded-full border border-emerald-400/10 px-3 py-1 text-[10px] text-emerald-300">
                  CONNECTED
                </span>
              </div>

            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">

              <Info
                title="Primary table"
                value="corporate_sales_raw"
              />

              <Info
                title="Warehouse records"
                value="2,000"
              />

              <Info
                title="Business data"
                value="Corporate sales"
              />

              <Info
                title="Calculation model"
                value="Governed aggregation"
              />

            </div>

            <div className="mt-8 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6">

              <h2 className="text-sm font-medium">
                Data flow
              </h2>

              <p className="mt-4 text-sm text-white/40">
                User question → governed metric → controlled
                query → corporate_sales_raw → verified result
              </p>

            </div>

          </div>
        </section>
      </div>
    </main>
  );
}

function Info({ title, value }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-5">
      <p className="text-[10px] uppercase tracking-[0.15em] text-white/25">
        {title}
      </p>

      <p className="mt-2 text-sm text-white/70">
        {value}
      </p>
    </div>
  );
}

function Sidebar({ active }) {
  const items = [
    ["/", "Command Center"],
    ["/ask", "Ask MetricMind"],
    ["/analytics", "Analytics"],
    ["/semantic-catalog", "Semantic Catalog"],
    ["/governance", "Governance"],
    ["/data-sources", "Data Sources"],
  ];

  return (
    <aside className="hidden w-[250px] shrink-0 border-r border-white/[0.07] bg-[#090b10] lg:flex lg:flex-col">

      <div className="border-b border-white/[0.07] p-6">
        <h1 className="text-[15px] font-semibold">
          MetricMind
        </h1>

        <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
          Intelligence OS
        </p>
      </div>

      <nav className="flex-1 p-4">

        <p className="mb-3 px-3 text-[10px] uppercase tracking-[0.18em] text-white/25">
          Workspace
        </p>

        {items.slice(0, 4).map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className={`mb-1 block rounded-lg px-3 py-2 text-xs ${
              active === label
                ? "bg-white/[0.08] text-white"
                : "text-white/40 hover:bg-white/[0.04]"
            }`}
          >
            {label}
          </Link>
        ))}

        <p className="mb-3 mt-8 px-3 text-[10px] uppercase tracking-[0.18em] text-white/25">
          System
        </p>

        {items.slice(4).map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className={`mb-1 block rounded-lg px-3 py-2 text-xs ${
              active === label
                ? "bg-white/[0.08] text-white"
                : "text-white/40 hover:bg-white/[0.04]"
            }`}
          >
            {label}
          </Link>
        ))}

      </nav>

    </aside>
  );
}