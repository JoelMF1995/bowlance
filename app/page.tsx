export default function Home() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <img
        src="/images/eiliv-aceron-NI8MeJiAN3I-unsplash.jpg"
        alt="Bowl de skyr garni de fruits frais et granola"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/85" />
      <div className="absolute top-[62%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center text-center gap-6 max-w-2xl px-6">
        <h1 className="font-display text-6xl font-bold text-white leading-tight">
          Commence ta transformation
        </h1>
        <p className="font-body text-xl text-white/75">
          Et deviens la meilleure version de toi-même
        </p>
        <a
          href="/composer"
          className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-white text-brown font-body font-medium text-lg hover:bg-white/80 transition-colors duration-200"
        >
          Commencer ma transformation
        </a>
      </div>
    </section>
  );
}
