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
 * Site footer — winauth.net-inspired obsidian/emerald design.
 * Multi-column link groups, top hairline border-white/10, high-contrast links.
 */
export function Footer() {
  return (
    <footer
      className="mt-auto border-t border-white/10 bg-[#050a08] text-neutral-400"
      role="contentinfo"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-white">
              <span>🏛️</span>
              <span>cabanatuan.gov.ph</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-neutral-500">
              Lungsod ng Cabanatuan, Nueva Ecija
              <br />
              Official Digital Ordinance Portal & AI Citizen Assistant
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[10px] text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>RLS SECURED • 75 BARANGAYS</span>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-mono text-xs font-semibold tracking-wider text-white uppercase mb-3">
                {title}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs text-neutral-400 hover:text-emerald-400 transition-colors"
                      {...("external" in link && link.external
                        ? {
                            target: "_blank",
                            rel: "noopener noreferrer",
                          }
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

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-white/10 pt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} Cabanatuan City LGU. All rights
            reserved.
          </p>
          <div className="flex items-center gap-4 font-mono text-xs text-neutral-500">
            <span>WCAG 2.2 AA</span>
            <span>•</span>
            <span>Tagalog / English</span>
            <span>•</span>
            <span>RLS Enforced</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
