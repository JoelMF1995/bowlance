"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ── Data ──────────────────────────────────────────────────────────────────────

const STEPS = [
  "Ton objectif",
  "Ton skyr",
  "Le goût",
  "Topping croustillant",
  "Les fruits",
  "Les bonus",
];

const OBJECTIVES = [
  { id: "poids",  icon: "🔥", title: "Perdre du poids",   desc: "Contrôlé en calories, riche en protéines." },
  { id: "muscle", icon: "💪", title: "Prendre du muscle", desc: "Plus complet, plus calorique." },
  { id: "mieux",  icon: "🥗", title: "Manger mieux",      desc: "Équilibré, sans objectif chiffré." },
];

const SKYRS = [
  { id: "nature",   label: "Nature",   sub: "0% MG · goût neutre",     kcal: 67, prot: 11, gluc: 5,  lip: 0 },
  { id: "gourmand", label: "Gourmand", sub: "Légèrement sucré",         kcal: 80, prot: 10, gluc: 8,  lip: 1 },
  { id: "fruite",   label: "Fruité",   sub: "Aux fruits rouges",        kcal: 90, prot: 9,  gluc: 11, lip: 1 },
];

const FLAVORS = ["Vanille", "Chocolat", "Fruits rouges", "Mangue", "Nature", "Caramel"];

const CRUNCHIES = [
  { id: "granola", label: "Granola maison",         kcal: 120, prot: 3, gluc: 18, lip: 4 },
  { id: "muesli",  label: "Muesli croustillant",    kcal: 110, prot: 3, gluc: 16, lip: 3 },
  { id: "coco",    label: "Noix de coco torréfiée", kcal: 90,  prot: 1, gluc: 5,  lip: 8 },
  { id: "courge",  label: "Graines de courge",      kcal: 80,  prot: 4, gluc: 4,  lip: 6 },
];

const FRUITS = [
  { id: "fraises",    label: "Fraises",    emoji: "🍓", kcal: 30 },
  { id: "myrtilles",  label: "Myrtilles",  emoji: "🫐", kcal: 40 },
  { id: "banane",     label: "Banane",     emoji: "🍌", kcal: 65 },
  { id: "mangue",     label: "Mangue",     emoji: "🥭", kcal: 50 },
  { id: "framboises", label: "Framboises", emoji: "🍇", kcal: 25 },
  { id: "kiwi",       label: "Kiwi",       emoji: "🥝", kcal: 35 },
];

const BONUSES = [
  { id: "chocolat",  label: "Chocolat noir 70%",   kcal: 40, prot: 1, gluc: 4, lip: 2 },
  { id: "cacahuete", label: "Beurre de cacahuète", kcal: 90, prot: 3, gluc: 3, lip: 8 },
  { id: "fruitsecs", label: "Fruits secs",          kcal: 60, prot: 1, gluc: 9, lip: 1 },
  { id: "chia",      label: "Graines de chia",      kcal: 50, prot: 2, gluc: 4, lip: 3 },
];

// ── Types & helpers ───────────────────────────────────────────────────────────

interface Sel {
  objective: string;
  skyr: string;
  flavor: string;
  crunchy: string;
  fruits: string[];
  bonus: string[];
}

function computeMacros(sel: Sel) {
  let kcal = 0, prot = 0, gluc = 0, lip = 0;
  const skyr = SKYRS.find(s => s.id === sel.skyr);
  if (skyr) { kcal += skyr.kcal; prot += skyr.prot; gluc += skyr.gluc; lip += skyr.lip; }
  const crunchy = CRUNCHIES.find(c => c.id === sel.crunchy);
  if (crunchy) { kcal += crunchy.kcal; prot += crunchy.prot; gluc += crunchy.gluc; lip += crunchy.lip; }
  sel.fruits.forEach(fid => {
    const f = FRUITS.find(fr => fr.id === fid);
    if (f) { kcal += f.kcal; }
  });
  sel.bonus.forEach(bid => {
    const b = BONUSES.find(bo => bo.id === bid);
    if (b) { kcal += b.kcal; prot += b.prot; gluc += b.gluc; lip += b.lip; }
  });
  return { kcal, prot, gluc, lip };
}

function isComplete(step: number, sel: Sel) {
  switch (step) {
    case 0: return !!sel.objective;
    case 1: return !!sel.skyr;
    case 2: return !!sel.flavor;
    case 3: return !!sel.crunchy;
    case 4: return sel.fruits.length >= 1;
    case 5: return true;
    default: return false;
  }
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Card({
  selected, onClick, children, className = "",
}: {
  selected: boolean; onClick: () => void; children: React.ReactNode; className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "w-full text-left rounded-2xl border-2 p-5 shadow-sm transition-all duration-200 cursor-pointer",
        selected
          ? "border-terracotta bg-cream shadow-md"
          : "border-sage/20 bg-white hover:border-sage/50 hover:shadow-md",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function Pill({
  selected, onClick, children,
}: {
  selected: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "px-5 py-2.5 rounded-full border font-body font-medium text-sm transition-all duration-200 cursor-pointer",
        selected
          ? "bg-terracotta border-terracotta text-white shadow-sm"
          : "border-sage/40 text-brown hover:border-sage hover:bg-sage/10",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function ComposerPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [sel, setSel] = useState<Sel>({
    objective: "", skyr: "", flavor: "", crunchy: "", fruits: [], bonus: [],
  });

  const macros = computeMacros(sel);
  const canNext = isComplete(step, sel);

  function goTo(s: number) {
    // Allow going back to any already-visited step
    if (s < step || isComplete(s - 1, sel)) setStep(s);
  }

  function handleNext() {
    if (step < 5) {
      setStep(step + 1);
    } else {
      localStorage.setItem("bowlance_bowl", JSON.stringify({ sel, macros }));
      router.push("/composer/recapitulatif");
    }
  }

  function toggleFruit(id: string) {
    setSel(prev => {
      if (prev.fruits.includes(id)) return { ...prev, fruits: prev.fruits.filter(f => f !== id) };
      if (prev.fruits.length >= 3) return prev;
      return { ...prev, fruits: [...prev.fruits, id] };
    });
  }

  function toggleBonus(id: string) {
    setSel(prev => ({
      ...prev,
      bonus: prev.bonus.includes(id)
        ? prev.bonus.filter(b => b !== id)
        : [...prev.bonus, id],
    }));
  }

  // ── Step content ────────────────────────────────────────────────────────────

  function renderStep() {
    switch (step) {
      case 0:
        return (
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-3xl font-bold text-brown mb-2">
              Quel est ton objectif ?
            </h2>
            {OBJECTIVES.map(o => (
              <Card key={o.id} selected={sel.objective === o.id} onClick={() => setSel(p => ({ ...p, objective: o.id }))}>
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{o.icon}</span>
                  <div>
                    <p className="font-display text-xl font-bold text-brown">{o.title}</p>
                    <p className="font-body text-sm text-brown/60 mt-0.5">{o.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );

      case 1:
        return (
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-3xl font-bold text-brown mb-2">
              Choisis ton style de skyr
            </h2>
            {SKYRS.map(s => (
              <Card key={s.id} selected={sel.skyr === s.id} onClick={() => setSel(p => ({ ...p, skyr: s.id }))}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display text-xl font-bold text-brown">{s.label}</p>
                    <p className="font-body text-sm text-brown/60 mt-0.5">{s.sub}</p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="font-body text-base font-semibold text-terracotta">{s.kcal} kcal</p>
                    <p className="font-body text-xs text-brown/50">{s.prot}g protéines</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );

      case 2:
        return (
          <div className="flex flex-col gap-6">
            <h2 className="font-display text-3xl font-bold text-brown mb-2">
              Quel parfum ?
            </h2>
            <div className="flex flex-wrap gap-3">
              {FLAVORS.map(f => (
                <Pill key={f} selected={sel.flavor === f} onClick={() => setSel(p => ({ ...p, flavor: f }))}>
                  {f}
                </Pill>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-3xl font-bold text-brown mb-2">
              Ton topping croustillant
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CRUNCHIES.map(c => (
                <Card key={c.id} selected={sel.crunchy === c.id} onClick={() => setSel(p => ({ ...p, crunchy: c.id }))}>
                  <p className="font-display text-lg font-bold text-brown">{c.label}</p>
                  <p className="font-body text-sm text-terracotta font-medium mt-1">{c.kcal} kcal</p>
                  <p className="font-body text-xs text-brown/50">{c.prot}g protéines</p>
                </Card>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="font-display text-3xl font-bold text-brown mb-1">
                Choisis tes fruits
              </h2>
              <p className="font-body text-sm text-brown/50">
                Minimum 1, maximum 3 — {sel.fruits.length}/3 sélectionné{sel.fruits.length > 1 ? "s" : ""}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {FRUITS.map(f => {
                const selected = sel.fruits.includes(f.id);
                const maxed = sel.fruits.length >= 3 && !selected;
                return (
                  <button
                    key={f.id}
                    onClick={() => !maxed && toggleFruit(f.id)}
                    disabled={maxed}
                    className={[
                      "rounded-2xl border-2 p-5 flex flex-col items-center gap-2 transition-all duration-200 cursor-pointer",
                      selected
                        ? "border-terracotta bg-cream shadow-md"
                        : maxed
                        ? "border-sage/10 bg-white opacity-40 cursor-not-allowed"
                        : "border-sage/20 bg-white hover:border-sage/50 hover:shadow-md",
                    ].join(" ")}
                  >
                    <span className="text-3xl">{f.emoji}</span>
                    <p className="font-display font-bold text-brown text-base">{f.label}</p>
                    <p className="font-body text-xs text-brown/50">{f.kcal} kcal</p>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="font-display text-3xl font-bold text-brown mb-1">
                Un petit bonus ?
              </h2>
              <p className="font-body text-sm text-brown/50">Optionnel — sélection multiple</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BONUSES.map(b => (
                <Card key={b.id} selected={sel.bonus.includes(b.id)} onClick={() => toggleBonus(b.id)}>
                  <div className="flex items-center justify-between">
                    <p className="font-display text-lg font-bold text-brown">{b.label}</p>
                    <p className="font-body text-sm font-semibold text-terracotta ml-4 shrink-0">+{b.kcal} kcal</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-cream flex flex-col">

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-offwhite border-b border-brown/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-display text-xl font-bold text-brown">Bowlance</Link>
          <p className="font-body text-sm font-medium text-brown/60 hidden sm:block">Compose ton bowl</p>
          <div className="text-right">
            <p className="font-body text-xs text-brown/40 uppercase tracking-widest">Calories</p>
            <p className="font-display text-lg font-bold text-terracotta">{macros.kcal} kcal</p>
          </div>
        </div>

        {/* Mobile step bar */}
        <div className="flex md:hidden border-t border-brown/10 overflow-x-auto">
          {STEPS.map((s, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={[
                "flex-1 min-w-[60px] py-2 text-center font-body text-xs transition-colors",
                i === step
                  ? "text-terracotta border-b-2 border-terracotta font-semibold"
                  : i < step
                  ? "text-sage font-medium"
                  : "text-brown/30",
              ].join(" ")}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-8 gap-8">

        {/* Sidebar */}
        <aside className="hidden md:flex flex-col gap-2 w-64 shrink-0">
          <p className="font-body text-xs font-semibold uppercase tracking-widest text-brown/40 mb-2">
            Étapes
          </p>
          {STEPS.map((s, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={[
                "flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 font-body text-sm",
                i === step
                  ? "bg-terracotta/10 text-terracotta font-semibold"
                  : i < step
                  ? "text-sage hover:bg-sage/10 cursor-pointer"
                  : "text-brown/30 cursor-default",
              ].join(" ")}
            >
              <span className={[
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors",
                i === step
                  ? "bg-terracotta text-white"
                  : i < step
                  ? "bg-sage text-white"
                  : "bg-brown/10 text-brown/30",
              ].join(" ")}>
                {i < step ? "✓" : i + 1}
              </span>
              {s}
            </button>
          ))}
        </aside>

        {/* Step content */}
        <main className="flex-1 min-w-0 pb-32">
          {renderStep()}
        </main>
      </div>

      {/* ── Bottom bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-offwhite border-t border-brown/10 shadow-[0_-2px_12px_rgba(61,43,31,0.06)]">
        {/* Macros */}
        <div className="max-w-7xl mx-auto px-6 pt-3 pb-1 flex justify-center gap-6 md:gap-10">
          {[
            { label: "Calories", val: `${macros.kcal} kcal` },
            { label: "Protéines", val: `${macros.prot}g` },
            { label: "Glucides", val: `${macros.gluc}g` },
            { label: "Lipides", val: `${macros.lip}g` },
          ].map(m => (
            <div key={m.label} className="text-center">
              <p className="font-body text-xs text-brown/40 uppercase tracking-wider">{m.label}</p>
              <p className="font-body text-sm font-semibold text-brown">{m.val}</p>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
            className="font-body text-sm text-brown/60 hover:text-brown disabled:opacity-0 transition-colors"
          >
            ← Retour
          </button>
          <button
            onClick={handleNext}
            disabled={!canNext}
            className={[
              "px-8 py-3 rounded-full font-body font-semibold text-sm transition-all duration-200",
              canNext
                ? "bg-terracotta text-white hover:bg-[#a85d49] shadow-sm"
                : "bg-brown/10 text-brown/30 cursor-not-allowed",
            ].join(" ")}
          >
            {step < 5 ? "Suivant →" : "Voir mon bowl →"}
          </button>
        </div>
      </div>
    </div>
  );
}
