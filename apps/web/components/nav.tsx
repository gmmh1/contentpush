import Link from "next/link";

const links = [
  ["/", "Dashboard"],
  ["/generator", "Generator"],
  ["/scheduler", "Scheduler"],
  ["/billing", "Billing"]
];

export function Nav() {
  return (
    <nav className="card" style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        {links.map(([href, label]) => (
          <Link key={href} href={href}>
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
