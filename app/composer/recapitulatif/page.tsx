"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface MonthlyBowl {
  week: string;
  name: string;
  items: string[];
  kcal: number;
  prot: number;
  gluc: number;
  lip: number;
  fibres: number;
}

interface Sel {
  objective: string;
  mode: string;
  skyr: string;
  flavor: string;
  crunchy: string;
  fruits: string[];
  customFruit: string;
  driedFruits: boolean | null;
  darkChoco: boolean | null;
}

interface BowlData {
  subscription?: boolean;
  month?: string;
  bowls?: MonthlyBowl[];
  sel?: Sel;
}

const LABELS: Record<string, string> = {
  // objectives
  poids: "Perdre du poids", muscle: "Prendre du muscle", mieux: "Manger mieux",
  // skyrs
  nature: "Nature", gourmande: "Gourmande", fruite: "Fruité",
  // crunchies
  avoine: "Flocons d'avoines", granola_pm: "Granola pomme-myrtilles", granola_choco: "Granola chocolat",
  // fruits
  pomme: "Pomme", myrtille: "Myrtille", framboise: "Framboise", fraise: "Fraise", autre: "Autre",
};

const COMPARISONS = [
  { name: "Croissant + jus d'orange", kcal: "360-370 kcal" },
  { name: "Pain au chocolat", kcal: "300-340 kcal" },
  { name: "2 tartines pâte à tartiner", kcal: "350-400 kcal" },
  { name: "Céréales sucrées avec lait", kcal: "350-420 kcal" },
];

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between py-3 border-b border-brown/10">
      <p className="font-body text-sm text-brown/50 uppercase tracking-wider">{label}</p>
      <p className="font-body font-medium text-brown text-right ml-4">{value}</p>
    </div>
  );
}

export default function RecapPage() {
  const [data, setData] = useState<BowlData | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("bowlance_bowl");
    if (raw) setData(JSON.parse(raw));
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-6">
        <p className="font-body text-brown/60">Aucun bowl composé.</p>
        <Link href="/composer" className="font-body text-sm text-terracotta underline underline-offset-4">
          Composer mon bowl →
        </Link>
      </div>
    );
  }

  const { sel, subscription, month, bowls } = data;

  // ── Subscription view (4 bowls / month) ──────────────────────────────────
  if (subscription && bowls) {
    const avgKcal = Math.round(bowls.reduce((s, b) => s + b.kcal, 0) / bowls.length);
    const avgProt = Math.round(bowls.reduce((s, b) => s + b.prot, 0) / bowls.length);
    const avgFibres = Math.round(bowls.reduce((s, b) => s + b.fibres, 0) / bowls.length);

    return (
      <div className="min-h-screen bg-cream">
        <header className="sticky top-0 z-50 bg-offwhite border-b border-brown/10 shadow-sm">
          <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="font-display text-xl font-bold text-brown">Bowlance</Link>
            <Link href="/composer" className="font-body text-sm text-brown/50 hover:text-brown transition-colors">
              ← Modifier
            </Link>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-12 flex flex-col gap-10">
          <div className="text-center">
            <p className="font-body text-xs text-brown/40 uppercase tracking-widest mb-2">Ton abonnement est prêt</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-brown capitalize">
              Tes 4 bowls de {month}
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {bowls.map(b => (
              <div key={b.week} className="relative bg-white rounded-2xl shadow-sm border border-sage/20 p-6 flex flex-col gap-3">
                <span className="self-start bg-terracotta text-white text-xs font-body font-semibold px-4 py-1 rounded-full">
                  {b.week}
                </span>
                <p className="font-display text-2xl font-bold text-brown">{b.name}</p>
                <ul className="flex flex-col gap-1.5">
                  {b.items.map(item => (
                    <li key={item} className="font-body text-sm text-brown/60 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-sage shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 pt-3 border-t border-brown/10">
                  <p className="font-display text-xl font-bold text-terracotta">{b.kcal} <span className="text-sm font-normal text-brown/40">kcal</span></p>
                  <p className="font-display text-xl font-bold text-terracotta">{b.prot}g <span className="text-sm font-normal text-brown/40">protéines</span></p>
                  <p className="font-display text-xl font-bold text-terracotta">🌿 {b.fibres}g <span className="text-sm font-normal text-brown/40">fibres</span></p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-terracotta rounded-2xl px-8 py-6">
            <p className="font-body text-xs text-white/60 uppercase tracking-widest mb-5 text-center">
              Moyenne par bowl
            </p>
            <div className="grid grid-cols-3 gap-6 text-center max-w-md mx-auto">
              <div>
                <p className="font-display text-3xl font-bold text-white">
                  {avgKcal}<span className="text-lg font-normal ml-1 opacity-75">kcal</span>
                </p>
                <p className="font-body text-xs text-white/60 uppercase tracking-wider mt-1">Calories</p>
              </div>
              <div>
                <p className="font-display text-3xl font-bold text-white">
                  {avgProt}<span className="text-lg font-normal ml-1 opacity-75">g</span>
                </p>
                <p className="font-body text-xs text-white/60 uppercase tracking-wider mt-1">Protéines</p>
              </div>
              <div>
                <p className="font-display text-3xl font-bold text-white">
                  🌿 {avgFibres}<span className="text-lg font-normal ml-1 opacity-75">g</span>
                </p>
                <p className="font-body text-xs text-white/60 uppercase tracking-wider mt-1">Fibres</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/commander"
              className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-terracotta text-white font-body font-semibold text-lg hover:bg-[#a85d49] transition-colors duration-200 shadow-sm"
            >
              Confirmer mon abonnement
            </Link>
            <Link
              href="/composer"
              className="inline-flex items-center justify-center px-10 py-4 rounded-full border border-sage text-sage font-body font-semibold text-lg hover:bg-sage hover:text-white transition-colors duration-200"
            >
              Recommencer
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // ── Custom bowl view ──────────────────────────────────────────────────────
  if (!sel) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-6">
        <p className="font-body text-brown/60">Aucun bowl composé.</p>
        <Link href="/composer" className="font-body text-sm text-terracotta underline underline-offset-4">
          Composer mon bowl →
        </Link>
      </div>
    );
  }

  const lipidesChoix: string[] = [];
  if (sel.driedFruits) lipidesChoix.push("Fruits secs");
  if (sel.darkChoco) lipidesChoix.push("Chocolat noir");

  return (
    <div className="min-h-screen bg-cream">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-offwhite border-b border-brown/10 shadow-sm">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-display text-xl font-bold text-brown">Bowlance</Link>
          <Link href="/composer" className="font-body text-sm text-brown/50 hover:text-brown transition-colors">
            ← Modifier
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 flex flex-col gap-10">

        {/* Title */}
        <div className="text-center">
          <p className="font-body text-xs text-brown/40 uppercase tracking-widest mb-2">Ton bowl est prêt</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-brown">
            Récapitulatif
          </h1>
        </div>

        {/* Selections */}
        <div className="bg-white rounded-2xl shadow-sm border border-sage/20 px-8 py-4">
          <Row label="Objectif"  value={LABELS[sel.objective] ?? sel.objective} />
          <Row label="Skyr"      value={LABELS[sel.skyr] ?? sel.skyr} />
          {sel.flavor && <Row label="Goût" value={sel.flavor} />}
          <Row label="Croustillant" value={LABELS[sel.crunchy] ?? sel.crunchy} />
          <Row label="Fruits"    value={sel.fruits.map(f => f === "autre" && sel.customFruit ? sel.customFruit : (LABELS[f] ?? f)).join(", ")} />
          {lipidesChoix.length > 0 && (
            <Row label="Lipides" value={lipidesChoix.join(", ")} />
          )}
        </div>

        {/* Conclusion */}
        <div className="bg-terracotta rounded-2xl px-8 py-8 flex flex-col gap-4">
          <p className="font-display text-2xl font-bold text-white text-center">
            ~320 à 355 kcal
          </p>
          <p className="font-body text-sm text-white/85 leading-relaxed">
            Ton bowl représente environ 320 à 355 kcal selon les ingrédients choisis.
            La vraie différence, ce n&apos;est pas seulement le nombre de calories.
            Ton bowl apporte des protéines (Skyr), des glucides (avoine et fruits)
            et des lipides (fruits secs ou chocolat noir). Ce mélange est plus
            équilibré et plus rassasiant — ce qui aide à tenir la matinée sans
            coup de fatigue ni fringale.
          </p>
        </div>

        {/* Comparison table */}
        <div className="bg-white rounded-2xl shadow-sm border border-sage/20 px-8 py-6">
          <p className="font-body text-xs text-brown/40 uppercase tracking-widest mb-4 text-center">
            Comparé à un petit-déjeuner classique
          </p>
          <div className="flex flex-col">
            {COMPARISONS.map(c => (
              <div key={c.name} className="flex items-baseline justify-between py-3 border-b border-brown/10 last:border-b-0">
                <p className="font-body text-sm text-brown/70">{c.name}</p>
                <p className="font-body font-medium text-brown text-right ml-4">{c.kcal}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/commander"
            className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-terracotta text-white font-body font-semibold text-lg hover:bg-[#a85d49] transition-colors duration-200 shadow-sm"
          >
            S&apos;abonner pour recevoir ce bowl chaque semaine →
          </Link>
          <Link
            href="/composer"
            className="inline-flex items-center justify-center px-10 py-4 rounded-full border border-sage text-sage font-body font-semibold text-lg hover:bg-sage hover:text-white transition-colors duration-200"
          >
            Recommencer
          </Link>
        </div>

      </main>
    </div>
  );
}
