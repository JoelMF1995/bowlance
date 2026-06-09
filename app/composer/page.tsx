"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ── Data ──────────────────────────────────────────────────────────────────────

const STEPS = [
  "Ton objectif",
  "Ton parcours",
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
  { id: "nature",   label: "Nature",   sub: "0% MG · goût neutre" },
  { id: "gourmande", label: "Gourmande", sub: "Légèrement sucrée" },
  { id: "fruite",   label: "Fruité",   sub: "Aux fruits" },
];

const GOURMANDE_FLAVORS = [
  "Vanille", "Noisette", "Cookie et crème", "Chocolat blanc",
  "Praliné", "Pastel de nata", "Crème anglaise", "Tarte au citron",
];

const FRUITE_FLAVORS = ["Banane", "Myrtille", "Cerise", "Fraise"];

const CRUNCHIES = [
  { id: "avoine",        label: "Flocons d'avoines" },
  { id: "granola_pm",    label: "Granola pomme-myrtilles" },
  { id: "granola_choco", label: "Granola chocolat" },
];

const FRUITS = [
  { id: "pomme",     label: "Pomme",     emoji: "🍎", img: "/images/matheus-cenali-wXuzS9xR49M-unsplash.jpg" },
  { id: "myrtille",  label: "Myrtille",  emoji: "🫐", img: "/images/melissa-belanger-usE0kpV_yLo-unsplash.jpg" },
  { id: "framboise", label: "Framboise", emoji: "🍇", img: "/images/anastasia-radio-RtTs9ytyZLg-unsplash.jpg" },
  { id: "fraise",    label: "Fraise",    emoji: "🍓", img: "/images/merve-aydin-bULD0lNVXOA-unsplash.jpg" },
  { id: "autre",     label: "Autre",     emoji: "✨", img: null },
];

interface MonthlyBowl {
  week: string;
  name: string;
  items: string[];
  kcal: number;
  prot: number;
}

const MONTHLY_BOWLS: Record<string, MonthlyBowl[]> = {
  poids: [
    { week: "Semaine 1", name: "Le Léger",        items: ["Skyr nature", "Vanille", "Granola maison", "Fraises", "Myrtilles"], kcal: 320, prot: 28 },
    { week: "Semaine 2", name: "Le Détox",        items: ["Skyr nature", "Fruits rouges", "Noix de coco", "Framboises", "Graines de chia"], kcal: 290, prot: 26 },
    { week: "Semaine 3", name: "Le Fruité Mince", items: ["Skyr fruité", "Mangue", "Muesli croustillant", "Kiwi", "Graines de courge"], kcal: 310, prot: 25 },
    { week: "Semaine 4", name: "Le Rassasiant",   items: ["Skyr nature", "Caramel", "Granola maison", "Banane", "Graines de chia"], kcal: 340, prot: 27 },
  ],
  muscle: [
    { week: "Semaine 1", name: "Le Powerhouse", items: ["Skyr gourmand", "Chocolat", "Muesli croustillant", "Banane", "Beurre de cacahuète"], kcal: 520, prot: 35 },
    { week: "Semaine 2", name: "Le Builder",    items: ["Skyr nature", "Vanille", "Granola maison", "Banane", "Fruits secs", "Beurre de cacahuète"], kcal: 490, prot: 33 },
    { week: "Semaine 3", name: "Le Masse",      items: ["Skyr gourmand", "Caramel", "Muesli croustillant", "Mangue", "Chocolat noir", "Fruits secs"], kcal: 540, prot: 32 },
    { week: "Semaine 4", name: "Le Complet",    items: ["Skyr fruité", "Fruits rouges", "Noix de coco", "Fraises", "Graines de chia", "Beurre de cacahuète"], kcal: 480, prot: 34 },
  ],
  mieux: [
    { week: "Semaine 1", name: "L'Équilibré", items: ["Skyr fruité", "Fruits rouges", "Noix de coco", "Framboises", "Graines de chia"], kcal: 380, prot: 24 },
    { week: "Semaine 2", name: "Le Doux",     items: ["Skyr gourmand", "Vanille", "Granola maison", "Fraises", "Chocolat noir"], kcal: 400, prot: 22 },
    { week: "Semaine 3", name: "Le Tropical", items: ["Skyr fruité", "Mangue", "Noix de coco", "Kiwi", "Graines de courge"], kcal: 370, prot: 23 },
    { week: "Semaine 4", name: "Le Classique",items: ["Skyr nature", "Caramel", "Muesli croustillant", "Myrtilles", "Fruits secs"], kcal: 390, prot: 24 },
  ],
};

const MONTH_NAMES = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

// ── Types & helpers ───────────────────────────────────────────────────────────

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

function isComplete(step: number, sel: Sel) {
  switch (step) {
    case 0: return !!sel.objective;
    case 1: return !!sel.mode;
    case 2: return !!sel.skyr;
    case 3: return sel.skyr === "nature" ? true : !!sel.flavor;
    case 4: return !!sel.crunchy;
    case 5: return sel.fruits.length >= 1;
    case 6: return sel.driedFruits !== null && sel.darkChoco !== null;
    default: return false;
  }
}

function nextStep(step: number, sel: Sel) {
  let n = step + 1;
  if (n === 3 && sel.skyr === "nature") n = 4;
  return n;
}

function prevStep(step: number, sel: Sel) {
  let n = step - 1;
  if (n === 3 && sel.skyr === "nature") n = 2;
  return n;
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

function YesNo({
  question, sub, value, onChange,
}: {
  question: string; sub: string; value: boolean | null; onChange: (v: boolean) => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-sage/20 p-6 flex flex-col gap-4">
      <div>
        <p className="font-display text-lg font-bold text-brown">{question}</p>
        <p className="font-body text-sm text-brown/50 mt-1">{sub}</p>
      </div>
      <div className="flex gap-3">
        <Pill selected={value === true} onClick={() => onChange(true)}>Oui</Pill>
        <Pill selected={value === false} onClick={() => onChange(false)}>Non</Pill>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function ComposerPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [sel, setSel] = useState<Sel>({
    objective: "", mode: "", skyr: "", flavor: "", crunchy: "", fruits: [], customFruit: "",
    driedFruits: null, darkChoco: null,
  });

  const canNext = isComplete(step, sel);
  const showRecommended = sel.mode === "guided" && step >= 1;
  const visibleStepIndices = sel.skyr === "nature" ? [0, 1, 2, 4, 5, 6] : [0, 1, 2, 3, 4, 5, 6];

  function goTo(s: number) {
    if (s < step) { setStep(s); return; }
    if (s === nextStep(step, sel) && canNext) setStep(s);
  }

  function handleNext() {
    if (step < 6) {
      setStep(nextStep(step, sel));
    } else {
      localStorage.setItem("bowlance_bowl", JSON.stringify({ sel }));
      router.push("/composer/recapitulatif");
    }
  }

  function handleSubscribe() {
    const bowls = MONTHLY_BOWLS[sel.objective];
    const monthName = MONTH_NAMES[new Date().getMonth()];
    localStorage.setItem("bowlance_bowl", JSON.stringify({
      subscription: true,
      objective: sel.objective,
      month: monthName,
      bowls,
    }));
    router.push("/composer/recapitulatif");
  }

  function toggleFruit(id: string) {
    setSel(prev => {
      if (prev.fruits.includes(id)) return { ...prev, fruits: prev.fruits.filter(f => f !== id) };
      return { ...prev, fruits: [...prev.fruits, id] };
    });
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
              Comment tu veux procéder ?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Card
                selected={sel.mode === "guided"}
                onClick={() => setSel(p => ({ ...p, mode: "guided" }))}
                className="relative p-7"
              >
                <span className="absolute -top-3 left-6 bg-sage text-white text-xs font-body font-semibold px-4 py-1 rounded-full">
                  Recommandé
                </span>
                <span className="text-4xl">⚡</span>
                <p className="font-display text-xl font-bold text-brown mt-3">
                  Je fais confiance à Bowlance
                </p>
                <p className="font-body text-sm text-brown/60 mt-2 leading-relaxed">
                  On te propose le bowl parfait selon ton objectif. Équilibré,
                  gourmand, prêt en 2 clics.
                </p>
              </Card>
              <Card
                selected={sel.mode === "custom"}
                onClick={() => setSel(p => ({ ...p, mode: "custom" }))}
                className="p-7"
              >
                <span className="text-4xl">🎨</span>
                <p className="font-display text-xl font-bold text-brown mt-3">
                  Je compose mon bowl
                </p>
                <p className="font-body text-sm text-brown/60 mt-2 leading-relaxed">
                  Tu choisis chaque ingrédient étape par étape. Tu contrôles tout.
                </p>
              </Card>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="font-display text-3xl font-bold text-brown mb-2">
                Quelle base de Skyr veux-tu ?
              </h2>
              <p className="font-body text-sm text-brown/50 leading-relaxed">
                Le Skyr est naturellement riche en protéines, ce qui aide à rester
                rassasié plus longtemps et apporte un bon soutien pour l&apos;énergie du matin.
              </p>
            </div>
            {SKYRS.map(s => (
              <Card
                key={s.id}
                selected={sel.skyr === s.id}
                onClick={() => setSel(p => ({ ...p, skyr: s.id, flavor: "" }))}
              >
                <p className="font-display text-xl font-bold text-brown">{s.label}</p>
                <p className="font-body text-sm text-brown/60 mt-0.5">{s.sub}</p>
              </Card>
            ))}
          </div>
        );

      case 3: {
        const flavors = sel.skyr === "gourmande" ? GOURMANDE_FLAVORS : FRUITE_FLAVORS;
        const title = sel.skyr === "gourmande" ? "Choisis ton goût gourmand" : "Choisis ton goût fruité";
        return (
          <div className="flex flex-col gap-6">
            <h2 className="font-display text-3xl font-bold text-brown mb-2">
              {title}
            </h2>
            <div className="flex flex-wrap gap-3">
              {flavors.map(f => (
                <Pill key={f} selected={sel.flavor === f} onClick={() => setSel(p => ({ ...p, flavor: f }))}>
                  {f}
                </Pill>
              ))}
            </div>
          </div>
        );
      }

      case 4:
        return (
          <div className="flex flex-col gap-4">
            <div>
              <p className="font-body text-sm text-brown/50 leading-relaxed mb-2">
                Les flocons d&apos;avoine et le granola apportent des glucides complexes
                et des fibres. Ces glucides sont digérés plus lentement et fournissent
                une énergie progressive.
              </p>
              <h2 className="font-display text-3xl font-bold text-brown">
                Choisis ton topping croustillant
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CRUNCHIES.map(c => (
                <Card key={c.id} selected={sel.crunchy === c.id} onClick={() => setSel(p => ({ ...p, crunchy: c.id }))}>
                  <p className="font-display text-lg font-bold text-brown">{c.label}</p>
                </Card>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="flex flex-col gap-6">
            <div>
              <p className="font-body text-sm text-brown/50 leading-relaxed mb-2">
                Les fruits apportent des glucides naturels (fructose), des fibres,
                des vitamines et des antioxydants.
              </p>
              <h2 className="font-display text-3xl font-bold text-brown">
                Choisis ton/tes fruit(s) !
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {FRUITS.map(f => {
                const selected = sel.fruits.includes(f.id);
                return (
                  <button
                    key={f.id}
                    onClick={() => toggleFruit(f.id)}
                    className={[
                      "rounded-2xl border-2 p-5 flex flex-col items-center gap-2 transition-all duration-200 cursor-pointer overflow-hidden",
                      selected
                        ? "border-terracotta bg-cream shadow-md"
                        : "border-sage/20 bg-white hover:border-sage/50 hover:shadow-md",
                    ].join(" ")}
                  >
                    {f.img ? (
                      <img src={f.img} alt={f.label} className="w-16 h-16 object-cover rounded-full" />
                    ) : (
                      <span className="text-3xl">{f.emoji}</span>
                    )}
                    <p className="font-display font-bold text-brown text-base">{f.label}</p>
                  </button>
                );
              })}
            </div>
            {sel.fruits.includes("autre") && (
              <input
                type="text"
                value={sel.customFruit}
                onChange={e => setSel(p => ({ ...p, customFruit: e.target.value }))}
                placeholder="Écris ton fruit ici..."
                className="w-full rounded-2xl border-2 border-sage/20 bg-white px-5 py-3 font-body text-brown placeholder:text-brown/30 focus:outline-none focus:border-terracotta"
              />
            )}
          </div>
        );

      case 6:
        return (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="font-display text-3xl font-bold text-brown mb-1">
                Un peu de lipides ?
              </h2>
              <p className="font-body text-sm text-brown/50 leading-relaxed">
                Les lipides sont un macronutriment essentiel. Ils participent à la
                satiété, ralentissent la digestion des glucides et aident à maintenir
                une énergie plus stable dans la matinée. Je te conseille de choisir
                soit les fruits secs soit le chocolat noir.
              </p>
            </div>
            <YesNo
              question="Est-ce que tu souhaites des fruits secs ?"
              sub="Riches en lipides insaturés, en fibres et en minéraux comme le magnésium."
              value={sel.driedFruits}
              onChange={v => setSel(p => ({ ...p, driedFruits: v }))}
            />
            <YesNo
              question="Est-ce que tu souhaites du chocolat noir ?"
              sub="Apporte des lipides issus du beurre de cacao et des polyphénols antioxydants."
              value={sel.darkChoco}
              onChange={v => setSel(p => ({ ...p, darkChoco: v }))}
            />
          </div>
        );
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  if (showRecommended) {
    const bowls = MONTHLY_BOWLS[sel.objective];
    const monthName = MONTH_NAMES[new Date().getMonth()];
    const avgKcal = Math.round(bowls.reduce((s, b) => s + b.kcal, 0) / bowls.length);
    const avgProt = Math.round(bowls.reduce((s, b) => s + b.prot, 0) / bowls.length);

    return (
      <div className="min-h-screen bg-cream flex flex-col">
        <header className="sticky top-0 z-50 bg-offwhite border-b border-brown/10 shadow-sm">
          <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="font-display text-xl font-bold text-brown">Bowlance</Link>
            <button
              onClick={() => setSel(p => ({ ...p, mode: "" }))}
              className="font-body text-sm text-brown/50 hover:text-brown transition-colors"
            >
              ← Changer de parcours
            </button>
          </div>
        </header>

        <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-16 flex flex-col gap-12">

          {/* Bandeau */}
          <div className="text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-brown capitalize">
              Tes 4 bowls de {monthName}
            </h1>
            <p className="font-body text-brown/60 mt-3 max-w-xl mx-auto">
              Avec ton abonnement, tu reçois 1 bowl par semaine. Ce mois-ci, on a
              sélectionné ces 4 bowls pour toi selon ton objectif.
            </p>
          </div>

          {/* 4 cartes bowls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {bowls.map(b => (
              <div
                key={b.week}
                className="relative bg-white rounded-2xl shadow-sm border border-sage/20 p-6 flex flex-col gap-3"
              >
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
                <div className="flex gap-6 mt-2 pt-3 border-t border-brown/10">
                  <div>
                    <p className="font-display text-xl font-bold text-terracotta">{b.kcal} <span className="text-sm font-normal text-brown/40">kcal</span></p>
                  </div>
                  <div>
                    <p className="font-display text-xl font-bold text-terracotta">{b.prot}g <span className="text-sm font-normal text-brown/40">protéines</span></p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Récap abonnement */}
          <div className="bg-terracotta rounded-2xl px-8 py-8 flex flex-col items-center text-center gap-5">
            <p className="font-display text-2xl font-bold text-white">
              📦 Ton abonnement {monthName} — 4 bowls · 1 par semaine
            </p>
            <div className="flex gap-10">
              <div>
                <p className="font-display text-3xl font-bold text-white">
                  {avgKcal}<span className="text-lg font-normal ml-1 opacity-75">kcal</span>
                </p>
                <p className="font-body text-xs text-white/60 uppercase tracking-wider mt-1">Moyenne / bowl</p>
              </div>
              <div>
                <p className="font-display text-3xl font-bold text-white">
                  {avgProt}<span className="text-lg font-normal ml-1 opacity-75">g</span>
                </p>
                <p className="font-body text-xs text-white/60 uppercase tracking-wider mt-1">Protéines moy.</p>
              </div>
            </div>
            <button
              onClick={handleSubscribe}
              className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-white text-brown font-body font-semibold text-lg hover:bg-white/85 transition-colors duration-200 shadow-sm"
            >
              S&apos;abonner pour {monthName} →
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-offwhite border-b border-brown/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-display text-xl font-bold text-brown">Bowlance</Link>
          <p className="font-body text-sm font-medium text-brown/60">Compose ton bowl</p>
        </div>

        {/* Mobile step bar */}
        <div className="flex md:hidden border-t border-brown/10 overflow-x-auto">
          {visibleStepIndices.map((i, pos) => (
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
              {pos + 1}
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
          {visibleStepIndices.map((i, pos) => (
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
                {i < step ? "✓" : pos + 1}
              </span>
              {STEPS[i]}
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
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setStep(s => prevStep(s, sel))}
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
            {step < 6 ? "Suivant →" : "Voir mon bowl →"}
          </button>
        </div>
      </div>
    </div>
  );
}
