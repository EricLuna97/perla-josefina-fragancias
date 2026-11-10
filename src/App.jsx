import { useState, useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { STORE_CONFIG } from './config';
import { MessageCircle, Search, Loader2, RotateCcw, AlertCircle } from 'lucide-react';
import Hero from './components/Hero';
import ProductDetailModal from './components/ProductDetailModal';

export default function App() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const catalogSectionRef = useRef(null);

  // 1. Cargar categorías y productos desde Supabase
  useEffect(() => {
    let isCancelled = false;

    async function loadCatalog() {
      try {
        if (!isSupabaseConfigured) {
          console.warn('Supabase no está configurado con credenciales válidas en .env');
        }

        const { data: catData, error: catError } = await supabase
          .from('categories')
          .select('*')
          .order('order', { ascending: true });

        if (catError) throw catError;

        const { data: prodData, error: prodError } = await supabase
          .from('products')
          .select('*, categories(name)')
          .eq('is_available', true)
          .order('created_at', { ascending: false });

        if (prodError) throw prodError;

        if (!isCancelled) {
          setCategories(catData || []);
          setProducts(prodData || []);
          setError(null);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Error cargando el catálogo:', err.message || err);
          setError(
            'Tuvimos un inconveniente al conectar con el catálogo natural. Por favor, verifica tu conexión e inténtalo nuevamente.'
          );
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadCatalog();

    return () => {
      isCancelled = true;
    };
  }, [reloadKey]);

  // Manejador del botón Reintentar (evento de usuario)
  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setReloadKey((prev) => prev + 1);
  };

  // 2. Scroll suave hacia el inicio de la grilla si el usuario está scrolleando abajo
  const scrollToCatalog = () => {
    if (catalogSectionRef.current) {
      const rect = catalogSectionRef.current.getBoundingClientRect();
      // Si la parte superior de la grilla quedó arriba de la vista (usuario scrolleó hacia abajo)
      if (rect.top < 60) {
        const yOffset = -75; // Compensación por la barra superior sticky
        const y = rect.top + window.pageYOffset + yOffset;
        window.scrollTo({
          top: Math.max(0, y),
          behavior: 'smooth',
        });
      }
    }
  };

  const handleCategoryChange = (categoryName) => {
    setActiveCategory(categoryName);
    scrollToCatalog();
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    scrollToCatalog();
  };

  // 3. Generadores de enlaces de WhatsApp
  const getProductWhatsAppUrl = (productName) => {
    const message = `¡Hola Josefina! Estuve viendo el catálogo web y quisiera consultar por: *${productName}*. ¿Está disponible?`;
    return `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  const generalWhatsAppUrl = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    '¡Hola Josefina! Estuve viendo el catálogo de preparados naturales y quería hacerte una consulta.'
  )}`;

  // 4. Filtrado de productos (Categoría + Buscador de texto)
  const filteredProducts = products.filter((item) => {
    const itemCategoryName = item.categories?.name || 'General';
    const matchesCategory = activeCategory === 'Todos' || itemCategoryName === activeCategory;

    const query = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !query ||
      item.name.toLowerCase().includes(query) ||
      (item.description && item.description.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-stone-800 font-sans selection:bg-rose-100 selection:text-rose-900 flex flex-col">
      {/* BARRA SUPERIOR ELEGANTE */}
      <header className="sticky top-0 z-30 bg-[#FBFBF9]/90 backdrop-blur-md border-b border-stone-200/70">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="text-rose-400 text-sm shrink-0">🪷</span>
            <span className="font-serif font-medium text-xs sm:text-base tracking-wide text-stone-900 truncate">
              {STORE_CONFIG.name}
            </span>
          </div>

          <a
            href={generalWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-rose-400 hover:text-rose-500 flex items-center gap-1 transition-colors shrink-0"
          >
            <span className="hidden sm:inline">Consultar pedidos</span>
            <span className="sm:hidden">Consultas</span>
            <span>→</span>
          </a>
        </div>
      </header>

      {/* COMPONENTE HERO CON LA FLOR EN MARCA DE AGUA */}
      <Hero />

      {/* CONTENIDO PRINCIPAL: CATÁLOGO */}
      <main
        ref={catalogSectionRef}
        className="max-w-6xl mx-auto px-4 py-8 pb-32 flex-1 w-full"
      >
        {/* BUSCADOR Y SELECTOR DE CATEGORÍAS */}
        <div className="space-y-4 mb-8">
          {/* Buscador */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-400/80" />
            <input
              type="text"
              placeholder="Buscar producto o propiedad terapéutica..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-rose-200/80 rounded-full text-xs sm:text-sm placeholder-stone-400 text-stone-800 shadow-xs focus:outline-hidden focus:ring-1 focus:ring-rose-400 focus:border-rose-400 transition-all"
            />
          </div>

          {/* Pastillas de Categorías */}
          <nav className="flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto no-scrollbar py-2 px-1">
            <button
              onClick={() => handleCategoryChange('Todos')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === 'Todos'
                  ? 'bg-rose-400 hover:bg-rose-500 text-white shadow-xs border border-rose-400'
                  : 'bg-rose-50 text-stone-700 border border-rose-200 hover:bg-rose-500 hover:text-white hover:border-rose-500'
              }`}
            >
              Todos los preparados
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.name)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat.name
                    ? 'bg-rose-400 hover:bg-rose-500 text-white shadow-xs border border-rose-400'
                    : 'bg-rose-50 text-stone-700 border border-rose-200 hover:bg-rose-500 hover:text-white hover:border-rose-500'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </nav>
        </div>

        {/* ESTADO DE CARGA */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 text-stone-400 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-rose-400" />
            <span className="text-xs text-stone-500">Cargando catálogo natural...</span>
          </div>
        )}

        {/* ESTADO DE ERROR AMIGABLE */}
        {!loading && error && (
          <div className="max-w-md mx-auto my-12 p-6 sm:p-8 bg-white border border-rose-200 rounded-3xl text-center shadow-xs">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-medium text-stone-900 mb-2">
              No pudimos cargar el catálogo
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mb-6 leading-relaxed">
              {error}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleRetry}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-rose-400 hover:bg-rose-500 text-stone-50 text-xs font-medium transition-all shadow-xs cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reintentar conexión</span>
              </button>
              <a
                href={generalWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-rose-400 hover:bg-rose-500 text-stone-50 text-xs font-medium transition-all shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Consultar por WhatsApp</span>
              </a>
            </div>
          </div>
        )}

        {/* GRILLA DE PRODUCTOS */}
        {!loading && !error && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map((prod) => (
              <article
                key={prod.id}
                onClick={() => setSelectedProduct(prod)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedProduct(prod);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Ver detalles de ${prod.name}`}
                className="bg-white rounded-2xl border border-rose-200/70 overflow-hidden shadow-xs flex flex-col justify-between hover:shadow-md hover:shadow-rose-100/70 hover:border-rose-400 transition-all group cursor-pointer text-left focus:outline-hidden focus:ring-2 focus:ring-rose-400/60"
              >
                {/* Imagen del Producto */}
                <div className="aspect-square w-full bg-rose-50/50 relative overflow-hidden">
                  {prod.image_url ? (
                    <img
                      src={prod.image_url}
                      alt={prod.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-rose-300 gap-1.5 p-4 text-center group-hover:bg-rose-50 transition-colors">
                      <span className="text-2xl opacity-55 group-hover:scale-110 transition-transform">🪷</span>
                      <span className="text-[11px] font-medium text-rose-400/80">Preparado artesanal</span>
                    </div>
                  )}

                  <span className="absolute top-2 left-2 bg-white/95 backdrop-blur-xs text-rose-700 text-[10px] font-medium px-2 py-0.5 rounded-full border border-rose-200/80 shadow-xs">
                    {prod.categories?.name || 'Fitopreparado'}
                  </span>
                </div>

                {/* Contenido / Descripción */}
                <div className="p-3 sm:p-4 flex flex-col grow justify-between">
                  <div>
                    <h3 className="font-serif font-medium text-xs sm:text-sm text-stone-900 leading-snug line-clamp-2">
                      {prod.name}
                    </h3>
                    {prod.description && (
                      <p className="text-[11px] sm:text-xs text-stone-500 mt-1.5 leading-relaxed line-clamp-3">
                        {prod.description}
                      </p>
                    )}
                  </div>

                  <a
                    href={getProductWhatsAppUrl(prod.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="mt-4 w-full bg-rose-400 hover:bg-rose-500 text-white font-medium text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Consultar</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* SIN RESULTADOS */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-20 text-stone-400 text-xs sm:text-sm max-w-sm mx-auto">
            <span className="text-2xl block mb-2 opacity-50">🍃</span>
            No se encontraron preparados ni variedades con ese criterio.
          </div>
        )}
      </main>

      {/* MODAL DE DETALLE DE PRODUCTO */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        whatsappNumber={STORE_CONFIG.whatsappNumber}
      />

      {/* FOOTER INFERIOR FLOTANTE CON ENLACES */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/80 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] px-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="hidden sm:block text-xs text-stone-500">
            Envíos a todo el país desde la Comarca Andina · Pedidos directos:
          </div>

          <div className="flex items-center justify-around sm:justify-end w-full sm:w-auto gap-2 sm:gap-3">
            {/* Instagram */}
            <a
              href={STORE_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              <span className="hidden sm:inline">Instagram</span>
            </a>

            {/* Facebook */}
            <a
              href={STORE_CONFIG.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
              <span className="hidden sm:inline">Facebook</span>
            </a>

            {/* WhatsApp */}
            <a
              href={generalWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium bg-rose-400 hover:bg-rose-500 text-stone-50 transition-colors shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
