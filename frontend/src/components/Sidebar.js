
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  MessageSquare,
  Network,
  ShieldCheck,
  Database,
} from "lucide-react";

const navigation = [
  { label: "Command Center", href: "/", icon: Activity },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Ask MetricMind", href: "/ask", icon: MessageSquare },
  { label: "Semantic Catalog", href: "/semantic-catalog", icon: Network },
  { label: "Governance", href: "/governance", icon: ShieldCheck },
  { label: "Data Sources", href: "/data-sources", icon: Database },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="mm-sidebar">
      <Link href="/" className="mm-brand">
        <span className="mm-brand-icon">
          <Activity size={22} />
        </span>
        <span>
          <strong>MetricMind</strong>
          <small>SEMANTIC BI PLATFORM</small>
        </span>
      </Link>

      <div className="mm-nav-label">WORKSPACE</div>

      <nav className="mm-nav">
        {navigation.map(({ label, href, icon: Icon }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname === href ||
                pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              className={`mm-nav-link${active ? " active" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mm-sidebar-footer">
        <span className="mm-connection-dot" />
        <span>Analytics workspace</span>
      </div>
    </aside>
  );
}
