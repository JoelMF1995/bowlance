import Link from "next/link";

const quickLinks = [
  { label: "Accueil", href: "/" },
  { label: "Mon histoire", href: "/histoire" },
  { label: "Composer mon bowl", href: "/composer" },
  { label: "Commander", href: "/commander" },
];

export default function Footer() {
  return (
    <footer className="bg-brown text-cream">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left — brand */}
        <div className="flex flex-col gap-3">
          <span className="font-display text-2xl font-bold">Bowlance</span>
          <p className="font-body text-cream/70 text-sm leading-relaxed max-w-xs">
            Manger mieux, avec plaisir.
          </p>
          <p className="font-body text-cream/50 text-xs mt-2">
            Fait avec ♥ et du skyr
          </p>
        </div>

        {/* Right — links */}
        <div className="flex flex-col gap-3">
          <span className="font-body text-xs font-semibold uppercase tracking-widest text-cream/40">
            Navigation
          </span>
          <nav className="flex flex-col gap-2">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-body text-sm text-cream/70 hover:text-cream transition-colors duration-200 w-fit"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-cream/10">
        <p className="max-w-6xl mx-auto px-6 py-4 font-body text-xs text-cream/30">
          © 2025 Bowlance — Tous droits réservés
        </p>
      </div>
    </footer>
  );
}
