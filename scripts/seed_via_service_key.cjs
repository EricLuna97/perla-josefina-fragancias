// Script opcional para insertar directamente los 104 productos en Supabase usando la service_role key
// Uso: node catalogo-web/scripts/seed_via_service_key.cjs <SERVICE_ROLE_KEY>

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://ilxkiajrhpnfjiczcrma.supabase.co';
const SERVICE_KEY = process.argv[2] || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_KEY) {
  console.log('ℹ️ Para ejecutar la carga directa desde la terminal:');
  console.log('node catalogo-web/scripts/seed_via_service_key.cjs <TU_SERVICE_ROLE_KEY>\n');
  console.log('O simplemente copia y pega el contenido de "catalogo-web/seed_catalogo_completo.sql"');
  console.log('en el SQL Editor del panel web de Supabase y haz clic en "Run".');
  process.exit(0);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function runSeed() {
  console.log('Conectando con Supabase con credenciales de administrador...');
  
  // 1. Limpiar productos anteriores
  const { error: delError } = await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (delError) {
    console.error('Error al limpiar productos:', delError);
    return;
  }
  console.log('Productos anteriores limpiados.');

  // 2. Cargar datos del catálogo
  const fallbackPath = path.join(__dirname, '..', 'src', 'data', 'fallbackProducts.js');
  const fileContent = fs.readFileSync(fallbackPath, 'utf8');
  const match = fileContent.match(/export const FALLBACK_PRODUCTS = (\[[\s\S]*?\]);/);
  if (!match) {
    console.error('No se pudo leer fallbackProducts.js');
    return;
  }
  const products = JSON.parse(match[1]).map(p => ({
    name: p.name,
    description: p.description,
    image_url: p.image_url,
    category_id: p.category_id,
    is_available: true
  }));

  console.log(`Insertando ${products.length} productos oficiales...`);
  
  // Insertar en lotes de 25
  for (let i = 0; i < products.length; i += 25) {
    const batch = products.slice(i, i + 25);
    const { error: insError } = await supabase.from('products').insert(batch);
    if (insError) {
      console.error(`Error en lote ${i} - ${i + 25}:`, insError);
      return;
    }
    console.log(`Insertados ${Math.min(i + 25, products.length)} de ${products.length}...`);
  }

  console.log('🎉 ¡Carga completada con éxito en Supabase!');
}

runSeed();
