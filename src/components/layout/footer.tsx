import Link from "next/link";

const footerLinks = {
  "Mga Serbisyo": [
    { href: "/ordinances", label: "Mga Ordinansa" },
    { href: "/chatbot", label: "AI Assistant" },
    { href: "/report", label: "Community Report" },
    { href: "/news", label: "Balita" },
  ],
  "Pamamahala": [
    { href: "/admin/barangay", label: "Barangay Portal" },
    { href: "/admin/lgu", label: "LGU Admin" },
    { href: "/login", label: "Mag-login" },
  ],
  "Impormasyon": [
    {
      href: "https://www.facebook.com/CabanatuanCityGovernment",
      label: "Facebook",
      external: true,
    },
    { href: "tel:911", label: "Emergency: 911" },
  ],
};

/**
 * Site footer — Geist footer spec.
 * Multi-column link groups, top hairline, body-grey text.
 */
export function Footer() {
  return (
    <footer
      className="mt-auto border-t border-[var(--border-hairline)] bg-[var(--bg-canvas)]"
      role="contentinfo"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-sm font-semibold text-[var(--text-ink)]">
              Cabanatuan City Ordinance Portal
            </p>
            <p className="mt-2 text-xs text-[var(--text-mute)]">
              Lungsod ng Kabanatuan, Nueva Ecija
              <br />
              Sagisag ng Lungsod ng Kabanatuan 1950
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-mono-eyebrow text-[var(--text-mute)] mb-3">
                {title}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--text-body)] hover:text-[var(--text-ink)] transition-colors"
                      {...("external" in link && link.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-[var(--border-hairline)] pt-6">
          <p className="text-xs text-[var(--text-faint)] text-center">
            © {new Date().getFullYear()} Lungsod ng Kabanatuan. Lahat ng
            karapatan ay nakalaan.
          </p>
        </div>
      </div>
    </footer>
  );
}
