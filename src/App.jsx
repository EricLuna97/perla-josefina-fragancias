import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { STORE_CONFIG } from './config';
import { MessageCircle, Search, Loader2 } from 'lucide-react';

export default function App() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Cargar categorías y productos desde Supabase
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // 1. Obtener categorías ordenadas
        const { data: catData, error: catError } = await supabase
          .from('categories')
          .select('*')
          .order('order', { ascending: true });

        if (catError) throw catError;
        setCategories(catData || []);

        // 2. Obtener productos activos
        const { data: prodData, error: prodError } = await supabase
          .from('products')
          .select('*, categories(name)')
          .eq('is_available', true)
          .order('created_at', { ascending: false });

        if (prodError) throw prodError;
        setProducts(prodData || []);
      } catch (err) {
        console.error('Error cargando el catálogo:', err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Enlace directo de consulta por artículo individual
  const getProductWhatsAppUrl = (productName) => {
    const message = `¡Hola! Estuve viendo el catálogo en la web y me interesa consultar por: *${productName}*. ¿Tienen stock disponible?`;
    return `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  // Enlace directo de consulta general para el footer
  const generalWhatsAppUrl = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    '¡Hola! Estuve viendo su catálogo web y quería hacerles una consulta.'
  )}`;

  // Filtrado reactivo (Categoría + Buscador)
  const filteredProducts = products.filter((item) => {
    const itemCategoryName = item.categories?.name || 'General';
    const matchesCategory = activeCategory === 'Todos' || itemCategoryName === activeCategory;
    
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-rose-100 selection:text-rose-900">
      
      {/* 1. NAVBAR SUPERIOR FIJO */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          
          <div className="shrink-0">
            <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 line-clamp-1">
              {STORE_CONFIG.name}
            </h1>
          </div>

          <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setActiveCategory('Todos')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                activeCategory === 'Todos'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todos
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat.name
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* 2. CONTENIDO PRINCIPAL */}
      <main className="max-w-6xl mx-auto px-4 pt-20 pb-28">
        
        {/* Buscador */}
        <div className="my-4 max-w-md mx-auto relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar fragancias, aromas, difusores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-slate-900"
          />
        </div>

        {/* Estado de Carga */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-slate-600" />
            <span className="text-xs">Cargando catálogo...</span>
          </div>
        )}

        {/* Grilla de Productos */}
        {!loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 mt-4">
            {filteredProducts.map((prod) => (
              <article
                key={prod.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="aspect-square w-full bg-slate-100 relative overflow-hidden">
                  {prod.image_url ? (
                    <img
                      src={prod.image_url}
                      alt={prod.name}
                      className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs font-medium">
                      Sin imagen
                    </div>
                  )}

                  <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-2xs">
                    {prod.categories?.name || 'Artículo'}
                  </span>
                </div>

                <div className="p-3 sm:p-4 flex flex-col grow justify-between">
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug line-clamp-2">
                      {prod.name}
                    </h3>
                    {prod.description && (
                      <p className="text-[11px] sm:text-xs text-slate-500 mt-1 line-clamp-2">
                        {prod.description}
                      </p>
                    )}
                  </div>

                  <a
                    href={getProductWhatsAppUrl(prod.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span className="line-clamp-1">Consultar</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Sin resultados */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-20 text-slate-400 text-xs sm:text-sm">
            No se encontraron fragancias ni artículos con ese criterio.
          </div>
        )}
      </main>

      {/* 3. FOOTER INFERIOR FLOTANTE */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2.5 px-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          
          <div className="hidden sm:block text-xs text-slate-500 font-medium">
            ¿Consultas sobre aromas o pedidos? Escribinos directo:
          </div>

          <div className="flex items-center justify-around sm:justify-end w-full sm:w-auto gap-3">
            {/* Instagram */}
            <a
              href={STORE_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-pink-600 hover:bg-pink-50 transition-colors"
              title="Instagram"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
              <span className="hidden xs:inline">Instagram</span>
            </a>

            {/* Facebook */}
            <a
              href={STORE_CONFIG.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
              title="Facebook"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
              <span className="hidden xs:inline">Facebook</span>
            </a>

            {/* WhatsApp General */}
            <a
              href={generalWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-md active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}