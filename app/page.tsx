"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

function useFadeIn() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useFadeIn();
  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`fade-section ${className}`}
    >
      {children}
    </section>
  );
}

const profiles = [
  {
    icon: "🔥",
    title: "Perdre du poids",
    text: "Un bowl rassasiant, riche en protéines, contrôlé en calories. Tu tiens dans la durée parce que tu n'as pas l'impression de te priver.",
    popular: false,
  },
  {
    icon: "💪",
    title: "Prendre du muscle",
    text: "Des glucides utiles, des bons lipides, plus de toppings. Un bowl complet qui soutient tes efforts sans te faire manger n'importe quoi.",
    popular: true,
  },
  {
    icon: "🥗",
    title: "Manger mieux",
    text: "Pas d'objectif chiffré, juste un petit-déjeuner plus qualitatif. Équilibré, agréable, et infiniment meilleur qu'une tartine Nutella.",
    popular: false,
  },
];

const steps = [
  { n: "1", label: "Tu choisis ton objectif" },
  { n: "2", label: "Tu composes ton bowl étape par étape" },
  { n: "3", label: "On prépare tout pour toi" },
  { n: "4", label: "Tu reçois ton bowl, prêt à déguster" },
];

export default function Home() {
  return (
    <>
      <style>{`
        .fade-section {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .fade-section.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      {/* ── SECTION 1 — Hero ───────────────────────────────────────── */}
      <Section className="bg-gradient-to-b from-cream to-offwhite py-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12">
          {/* Texte */}
          <div className="flex-1 flex flex-col gap-6">
            <h1 className="font-display text-5xl md:text-6xl font-bold text-brown leading-tight">
              Le petit-déjeuner<br />qui change tout.
            </h1>
            <p className="font-body text-lg text-brown/70 max-w-md leading-relaxed">
              Un bowl de skyr composé selon tes objectifs. Gourmand,
              rassasiant, construit pour toi.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/composer"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-terracotta text-white font-body font-medium text-lg hover:bg-[#a85d49] transition-colors duration-200"
              >
                Composer mon bowl
              </Link>
              <Link
                href="/histoire"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl border border-sage text-sage font-body font-medium text-lg hover:bg-sage hover:text-white transition-colors duration-200"
              >
                Découvrir le concept
              </Link>
            </div>
          </div>
          {/* Image */}
          <div className="flex-1 flex justify-center">
            <img
              src="https://placehold.co/600x500/F5E6D3/3D2B1F?text=Bowl+Bowlance"
              alt="Un bowl Bowlance appétissant"
              className="rounded-3xl shadow-lg w-full max-w-xs md:max-w-sm object-cover"
            />
          </div>
        </div>
      </Section>

      {/* ── SECTION 2 — Les 3 profils ──────────────────────────────── */}
      <Section className="py-24 px-6 bg-offwhite">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-4xl font-bold text-brown text-center mb-14">
            Quel est ton objectif ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {profiles.map((p) => (
              <div
                key={p.title}
                className={[
                  "relative bg-white border border-sage/30 rounded-2xl p-8 flex flex-col gap-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md",
                  p.popular
                    ? "md:-translate-y-3 ring-2 ring-sage/50 shadow-md"
                    : "",
                ].join(" ")}
              >
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sage text-white text-xs font-body font-semibold px-4 py-1 rounded-full">
                    Populaire
                  </span>
                )}
                <span className="text-4xl">{p.icon}</span>
                <h3 className="font-display text-2xl font-bold text-brown">
                  {p.title}
                </h3>
                <p className="font-body text-brown/70 text-sm leading-relaxed flex-1">
                  {p.text}
                </p>
                <Link
                  href="/composer"
                  className="font-body text-sm font-medium text-terracotta hover:underline underline-offset-4 mt-2 w-fit"
                >
                  Voir ce bowl →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── SECTION 3 — Accroche personnelle ──────────────────────── */}
      <Section className="py-28 px-6 bg-terracotta">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-8">
          <blockquote className="font-display text-3xl md:text-4xl italic text-white leading-snug">
            "J'ai perdu plus de 40 kg. Et j'ai compris qu'on ne tient jamais
            dans la durée avec des repas qui nous rendent tristes."
          </blockquote>
          <p className="font-body text-white/70 text-sm tracking-wide">
            — La fondatrice de Bowlance
          </p>
          <Link
            href="/histoire"
            className="font-body text-sm text-white border border-white/50 rounded-xl px-6 py-2.5 hover:bg-white/10 transition-colors duration-200"
          >
            Lire mon histoire →
          </Link>
        </div>
      </Section>

      {/* ── SECTION 4 — Comment ça marche ─────────────────────────── */}
      <Section className="py-24 px-6 bg-cream">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-4xl font-bold text-brown text-center mb-16">
            Comment ça marche ?
          </h2>
          <div className="relative flex flex-col md:flex-row items-start gap-10">
            {/* Ligne de connexion desktop */}
            <div className="hidden md:block absolute top-7 left-16 right-16 h-px bg-sage/30" />
            {steps.map((step) => (
              <div
                key={step.n}
                className="relative flex-1 flex flex-col items-center text-center gap-4"
              >
                <div className="w-14 h-14 rounded-full bg-terracotta text-white font-display text-xl font-bold flex items-center justify-center z-10 shadow-sm">
                  {step.n}
                </div>
                <p className="font-body text-brown/80 text-sm leading-relaxed max-w-[160px]">
                  {step.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── SECTION 5 — CTA final ─────────────────────────────────── */}
      <Section className="py-28 px-6 bg-offwhite">
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-6">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-brown leading-tight">
            Prêt(e) à te faire plaisir, vraiment ?
          </h2>
          <p className="font-body text-brown/60 text-lg">
            Compose ton bowl en 2 minutes. Sans prise de tête.
          </p>
          <Link
            href="/composer"
            className="inline-flex items-center justify-center px-10 py-4 rounded-xl bg-terracotta text-white font-body font-medium text-lg hover:bg-[#a85d49] transition-colors duration-200"
          >
            Composer mon bowl maintenant
          </Link>
        </div>
      </Section>
    </>
  );
}
