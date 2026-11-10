import { useEffect } from 'react';
import { X, MessageCircle, Sparkles, Leaf } from 'lucide-react';

export default function ProductDetailModal({ product, onClose, whatsappNumber }) {
  useEffect(() => {
    if (!product) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Bloquear scroll de fondo mientras el modal esté visible
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [product, onClose]);

  if (!product) return null;

  const categoryName = product.categories?.name || 'Fitopreparado';

  const whatsappMessage = `¡Hola Josefina! Estuve viendo el catálogo web y quisiera consultar por el preparado: *${product.name}*. ¿Podrías brindarme más información sobre su disponibilidad y modo de uso?`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div className="relative w-full max-w-lg bg-[#FBFBF9] rounded-3xl border border-stone-200/90 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Botón flotante de cierre */}
        <button
          onClick={onClose}
          aria-label="Cerrar ventana"
          className="absolute top-3.5 right-3.5 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-stone-600 hover:text-stone-900 shadow-md border border-stone-200/80 flex items-center justify-center transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Contenedor scrolleable del contenido */}
        <div className="overflow-y-auto flex-1">
          {/* Cabecera / Imagen */}
          <div className="w-full bg-stone-100 relative aspect-4/3 sm:aspect-16/10 flex items-center justify-center overflow-hidden">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full bg-linear-to-b from-rose-50/70 via-stone-100 to-[#FBFBF9] flex flex-col items-center justify-center text-center p-6 gap-2">
                <span className="text-5xl select-none filter drop-shadow-xs">🪷</span>
                <span className="text-xs font-serif text-stone-500 tracking-wide">
                  Josefina Fragancias Naturales
                </span>
                <span className="text-[11px] text-stone-400">
                  Preparado artesanal de la Comarca Andina
                </span>
              </div>
            )}
          </div>

          {/* Cuerpo de la información */}
          <div className="p-5 sm:p-7 space-y-4">
            
            {/* Badges de Categoría y Disponibilidad */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-stone-200/70 text-stone-700 border border-stone-300/50">
                <Leaf className="w-3 h-3 text-emerald-800" />
                {categoryName}
              </span>

              {product.is_available !== false ? (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  Disponible
                </span>
              ) : (
                <span className="inline-flex items-center text-[11px] font-medium px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                  Elaboración a pedido
                </span>
              )}
            </div>

            {/* Título del producto */}
            <div>
              <h2
                id="modal-product-title"
                className="text-xl sm:text-2xl font-serif text-stone-900 font-normal tracking-tight leading-snug"
              >
                {product.name}
              </h2>

              {product.price && Number(product.price) > 0 && (
                <p className="mt-1 text-base sm:text-lg font-medium text-stone-800">
                  ${Number(product.price).toLocaleString('es-AR', { minimumFractionDigits: 0 })}
                </p>
              )}
            </div>

            {/* Separador sutil */}
            <div className="h-px bg-stone-200/80 my-2"></div>

            {/* Descripción detallada: propiedades, ingredientes o modo de uso */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Propiedades y detalles terapéuticos
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed whitespace-pre-line">
                {product.description ||
                  'Preparado natural elaborado artesanalmente en la Comarca Andina con ingredientes puros y plantas seleccionadas del bosque patagónico. Consulta con Josefina para conocer su modo de uso y propiedades específicas.'}
              </p>
            </div>

            {/* Nota de confianza artesanal */}
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/60 flex items-start gap-2.5 text-xs text-stone-600">
              <Sparkles className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Cada formulación se elabora en pequeñas tandas respetando los ciclos naturales. Hacemos envíos directos a todo el país.
              </p>
            </div>
          </div>
        </div>

        {/* Pie de modal con botón directo de WhatsApp */}
        <div className="p-4 sm:p-5 bg-white border-t border-stone-200/70 flex flex-col sm:flex-row items-center gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-rose-400 hover:bg-rose-500 text-white font-medium text-xs sm:text-sm shadow-sm hover:shadow-md transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Consultar por este preparado</span>
          </a>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-medium text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
          >
            Volver al catálogo
          </button>
        </div>

      </div>
    </div>
  );
}

