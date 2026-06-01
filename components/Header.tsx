"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Mon histoire", href: "/histoire" },
  { label: "Composer mon bowl", href: "/composer", highlight: true },
  { label: "Commander", href: "/commander" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-offwhite shadow-[0_2px_12px_rgba(61,43,31,0.08)]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-tight">
            <span className="font-display text-2xl font-bold text-brown">
              Bowlance
            </span>
            <span className="text-xs text-brown/50 font-body tracking-wide">
              Le bowl qui te ressemble
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) =>
              link.highlight ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-5 py-2 rounded-full bg-terracotta text-white font-body font-medium text-sm hover:bg-[#a85d49] transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 font-body text-sm text-brown hover:text-terracotta transition-colors duration-200"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 text-brown"
            onClick={() => setMenuOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <span className="block w-6 h-0.5 bg-brown rounded" />
            <span className="block w-6 h-0.5 bg-brown rounded" />
            <span className="block w-6 h-0.5 bg-brown rounded" />
          </button>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 flex"
          onClick={() => setMenuOpen(false)}
        >
          <div className="absolute inset-0 bg-brown/40" />
          {/* Drawer */}
          <div
            className="relative ml-auto w-72 h-full bg-offwhite flex flex-col px-8 py-10 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="self-end text-brown text-2xl mb-8 leading-none"
              onClick={() => setMenuOpen(false)}
              aria-label="Fermer le menu"
            >
              ×
            </button>
            <Link href="/" className="mb-8">
              <span className="font-display text-2xl font-bold text-brown">
                Bowlance
              </span>
            </Link>
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) =>
                link.highlight ? (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="px-5 py-3 rounded-full bg-terracotta text-white font-body font-medium text-center hover:bg-[#a85d49] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-body text-brown text-lg hover:text-terracotta transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
