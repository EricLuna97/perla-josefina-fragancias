export default function Hero() {
  const whatsappUrl =
    "https://wa.me/5492944793890?text=Hola%20Josefina,%20estuve%20viendo%20el%20catálogo%20y%20quería%20hacerte%20una%20consulta.";

  return (
    <section
      className="relative overflow-hidden bg-[#FBFBF9] border-b border-stone-200 py-14 sm:py-24 bg-cover bg-center"
      style={{ backgroundImage: "url('/background-hero.jpg')" }}
    >
    
      <div
        className="absolute inset-0 bg-[#FBFBF9]/60 backdrop-blur-[1px]"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Nuevo logo centrado y grande */}
        <div className="flex justify-center mb-6">
          <img
            src="/LogoJosefina.png"
            alt="Josefina Fragancias Naturales"
            className="w-56 h-56 sm:w-64 sm:h-64 object-contain drop-shadow-sm select-none"
          />
        </div>

        <span className="text-xs font-semibold tracking-widest text-rose-600 uppercase">
          Comarca Andina · Patagonia Argentina
        </span>

        <h1 className="mt-3 text-3xl sm:text-5xl font-serif text-stone-900 tracking-tight font-normal">
          Josefina Fragancias Naturales
        </h1>

        <p className="mt-4 text-base sm:text-lg text-stone-700 max-w-2xl mx-auto leading-relaxed">
          Desde la naturaleza, para tu bienestar.
        </p>

        {/* Badges de confianza */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs text-stone-800">
          <span className="px-3 py-1 rounded-full bg-white/90 border border-rose-200 shadow-2xs">
            ✨ 100% Artesanal y Natural
          </span>
          <span className="px-3 py-1 rounded-full bg-white/90 border border-rose-200 shadow-2xs">
            📦 Envíos a todo el país
          </span>
          <span className="px-3 py-1 rounded-full bg-white/90 border border-rose-200 shadow-2xs">
            🤝 Elaboración a pedido
          </span>
        </div>

        {/* Botón WhatsApp */}
        <div className="mt-8 flex justify-center">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-medium text-sm transition-all shadow-sm hover:shadow-md"
          >
            <span>💬</span>
            <span>Consultas y Pedidos por WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}