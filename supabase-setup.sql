-- ==============================================================================
-- JOSEFINA FRAGANCIAS NATURALES - CONFIGURACIÓN SUPABASE & SEMILLAS
-- ==============================================================================
-- Este script realiza:
-- 1. Creación de tablas base (categories, products) con sus relaciones e índices.
-- 2. Configuración del Storage Bucket público `product-images` y sus límites.
-- 3. Políticas de Seguridad por Fila (RLS) para base de datos y Supabase Storage.
--    - Lectura pública ('anon', 'authenticated') para ver el catálogo sin login.
--    - Escritura protegida ('authenticated') para panel de administración.
-- 4. Semillas con fitopreparados reales del bosque patagónico (Comarca Andina).
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. TABLAS DEL CATÁLOGO
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2),
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para optimizar consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_available ON public.products(is_available);
CREATE INDEX IF NOT EXISTS idx_categories_order ON public.categories("order");

-- ------------------------------------------------------------------------------
-- 2. CONFIGURACIÓN DEL STORAGE BUCKET (`product-images`)
-- ------------------------------------------------------------------------------

-- Creamos el bucket 'product-images' si no existe o lo actualizamos a público
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880, -- Límite de 5 MB por imagen
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/avif'];

-- ------------------------------------------------------------------------------
-- 3. POLÍTICAS ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------------------------

-- A. RLS para la tabla public.categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura publica de categorias" ON public.categories;
CREATE POLICY "Permitir lectura publica de categorias"
ON public.categories FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Permitir escritura solo a autenticados en categorias" ON public.categories;
CREATE POLICY "Permitir escritura solo a autenticados en categorias"
ON public.categories FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- B. RLS para la tabla public.products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura publica de productos" ON public.products;
CREATE POLICY "Permitir lectura publica de productos"
ON public.products FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Permitir escritura solo a autenticados en productos" ON public.products;
CREATE POLICY "Permitir escritura solo a autenticados en productos"
ON public.products FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- C. RLS para storage.objects (Imágenes en el bucket 'product-images')
DROP POLICY IF EXISTS "Lectura publica de imagenes de productos" ON storage.objects;
CREATE POLICY "Lectura publica de imagenes de productos"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Subida de imagenes solo autenticados" ON storage.objects;
CREATE POLICY "Subida de imagenes solo autenticados"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Modificacion de imagenes solo autenticados" ON storage.objects;
CREATE POLICY "Modificacion de imagenes solo autenticados"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Eliminacion de imagenes solo autenticados" ON storage.objects;
CREATE POLICY "Eliminacion de imagenes solo autenticados"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');

-- ------------------------------------------------------------------------------
-- 4. SEMILLAS (CATEGORÍAS Y FITOPREPARADOS PATAGÓNICOS)
-- ------------------------------------------------------------------------------

-- Insertar Categorías Principales
INSERT INTO public.categories (name, description, "order")
VALUES
  ('Tinturas Madre', 'Extractos hidroalcohólicos concentrados de plantas medicinales patagónicas', 1),
  ('Cremas Terapéuticas', 'Emulsiones naturales a base de cera de abejas, mantecas y principios activos vegetales', 2),
  ('Óleos Macerados', 'Aceites vegetales puros infusionados al sol con hierbas cordilleranas', 3),
  ('Brumas Áuricas', 'Elixires aromaterapéuticos con hidrolatos puros y aceites esenciales de la Comarca', 4)
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  "order" = EXCLUDED."order";

-- Insertar Productos (Preparados Naturales)
-- Usamos un bloque anónimo para enlazar con las categorías de forma dinámica
DO $$
DECLARE
  cat_tinturas UUID;
  cat_cremas UUID;
  cat_oleos UUID;
  cat_brumas UUID;
BEGIN
  SELECT id INTO cat_tinturas FROM public.categories WHERE name = 'Tinturas Madre';
  SELECT id INTO cat_cremas FROM public.categories WHERE name = 'Cremas Terapéuticas';
  SELECT id INTO cat_oleos FROM public.categories WHERE name = 'Óleos Macerados';
  SELECT id INTO cat_brumas FROM public.categories WHERE name = 'Brumas Áuricas';

  -- 1. TINTURAS MADRE
  IF NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Tintura Madre de Jarilla') THEN
    INSERT INTO public.products (category_id, name, description, price, is_available)
    VALUES (
      cat_tinturas,
      'Tintura Madre de Jarilla',
      'Arbusto sagrado de la estepa andina (Larrea divaricata). Potente antiinflamatorio natural, depurativo orgánico y aliado en dolores articulares, reuma y afecciones de las vías respiratorias. Tomar de 15 a 20 gotas en medio vaso de agua.',
      7500.00,
      true
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Tintura Madre de Llantén') THEN
    INSERT INTO public.products (category_id, name, description, price, is_available)
    VALUES (
      cat_tinturas,
      'Tintura Madre de Llantén',
      'Elaborada con hojas frescas de Llantén mayor (Plantago major). Excelente protector y cicatrizante de mucosas gástricas, suavizante para la tos seca y afecciones de garganta. Propiedades antibacterianas y descongestivas.',
      7200.00,
      true
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Tintura Madre de Melisa') THEN
    INSERT INTO public.products (category_id, name, description, price, is_available)
    VALUES (
      cat_tinturas,
      'Tintura Madre de Melisa',
      'Melisa cordillerana (Melissa officinalis). Sedante suave, ansiolítico natural y antiespasmódico. Calma el estrés, favorece un sueño reparador y aquieta las palpitaciones nerviosas y digestiones difíciles.',
      7200.00,
      true
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Tintura Madre de Ortiga') THEN
    INSERT INTO public.products (category_id, name, description, price, is_available)
    VALUES (
      cat_tinturas,
      'Tintura Madre de Ortiga',
      'Reconstituyente mineral silvestre (Urtica dioica). Rica en hierro, calcio, sílice y oligoelementos. Indicada para decaimiento físico, caída del cabello, anemias estacionales y purificación de la sangre.',
      7200.00,
      true
    );
  END IF;

  -- 2. CREMAS TERAPÉUTICAS
  IF NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Crema de Caléndula y Manzanilla') THEN
    INSERT INTO public.products (category_id, name, description, price, is_available)
    VALUES (
      cat_cremas,
      'Crema de Caléndula y Manzanilla',
      'Bálsamo ultra calmante elaborado con cera pura de abejas y flores cosechadas a mano. Regenera pieles agrietadas por el viento patagónico, calma quemaduras solares, dermatitis, paspaduras y sarpullidos infantiles.',
      8900.00,
      true
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Crema de Árnica y Enebro') THEN
    INSERT INTO public.products (category_id, name, description, price, is_available)
    VALUES (
      cat_cremas,
      'Crema de Árnica y Enebro',
      'Pomada calorífica y descontracturante. Con flores de Árnica montana y bayas de Enebro andino. Ideal para masajes luego de actividad física o caminatas, calma dolores musculares, lumbalgias y rigidez articular.',
      9400.00,
      true
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Crema de Rosa Mosqueta y Lavanda') THEN
    INSERT INTO public.products (category_id, name, description, price, is_available)
    VALUES (
      cat_cremas,
      'Crema de Rosa Mosqueta y Lavanda',
      'Nutrición facial y corporal intensiva con aceite virgen de rosa mosqueta prensado en frío. Atenúa marcas, estrías y líneas de expresión. Aroma sutil a lavanda andina que relaja los sentidos.',
      9200.00,
      true
    );
  END IF;

  -- 3. ÓLEOS MACERADOS
  IF NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Óleo de Hipérico (Hierba de San Juan)') THEN
    INSERT INTO public.products (category_id, name, description, price, is_available)
    VALUES (
      cat_oleos,
      'Óleo de Hipérico (Hierba de San Juan)',
      'El ancestral óleo bermellón macerado durante 40 días bajo el sol cordillerano. Analgésico tópico por excelencia para golpes, contracturas neurálgicas, ciática, quemaduras superficiales y hematomas.',
      8500.00,
      true
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Óleo de Lavanda Silvestre') THEN
    INSERT INTO public.products (category_id, name, description, price, is_available)
    VALUES (
      cat_oleos,
      'Óleo de Lavanda Silvestre',
      'Maceración lenta de sumidades florales de lavanda en aceite de almendras dulces. Hidratación sedosa para después de la ducha o masajes relajantes nocturnos que inducen a la serenidad y disipan la tensión.',
      8200.00,
      true
    );
  END IF;

  -- 4. BRUMAS ÁURICAS
  IF NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Bruma de Bosque Andino') THEN
    INSERT INTO public.products (category_id, name, description, price, is_available)
    VALUES (
      cat_brumas,
      'Bruma de Bosque Andino',
      'Aromaterapia ambiental y personal con hidrolatos puros y aceites esenciales de Ciprés de la Cordillera, Coihue y Pino Oregón. Limpieza energética de ambientes, arraigo a la tierra y despeje mental.',
      7800.00,
      true
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Bruma de Rosas y Cedro') THEN
    INSERT INTO public.products (category_id, name, description, price, is_available)
    VALUES (
      cat_brumas,
      'Bruma de Rosas y Cedro',
      'Sinergia armonizadora que conecta con el chakra cardíaco. Destilado de rosas de jardín patagónico con notas profundas de cedro. Brinda contención emocional, calma el corazón y reconforta el espíritu.',
      7800.00,
      true
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Bruma de Lavanda y Salvia Blanca') THEN
    INSERT INTO public.products (category_id, name, description, price, is_available)
    VALUES (
      cat_brumas,
      'Bruma de Lavanda y Salvia Blanca',
      'Elixir purificador del campo áurico. Ideal para rociar en sábanas y almohadas antes del descanso nocturno, consultorios terapéuticos o espacios de meditación. Promueve paz y purificación vibracional.',
      7800.00,
      true
    );
  END IF;

END $$;

