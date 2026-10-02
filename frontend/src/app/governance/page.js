"use client";

import Link from "next/link";

export default function GovernancePage() {
  return (
    <main className="min-h-screen bg-[#06080c] text-white">
      <div className="flex min-h-screen">

        <Sidebar active="Governance" />

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