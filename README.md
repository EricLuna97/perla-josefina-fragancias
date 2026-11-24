# 🪷 Josefina Fragancias Naturales — Catálogo Web

Preparados terapéuticos artesanales y cosmética natural elaborados con plantas medicinales del bosque patagónico (Comarca Andina, Patagonia Argentina).

---

## 🚀 Despliegue en Vercel (Paso a Paso)

Este proyecto está preconfigurado para un despliegue sin fricciones en **[Vercel](https://vercel.com)**.

### 1. Conectar el Repositorio en Vercel
1. Ingresa a tu panel en [vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.
2. Haz clic en **"Add New..."** → **"Project"**.
3. Busca e importa el repositorio: `perla-josefina-fragancias` (o `EricLuna97/perla-josefina-fragancias`).

### 2. Configuración del Proyecto (Build and Output Settings)
Vercel detectará automáticamente que es un proyecto **Vite**:
- **Framework Preset**: `Vite`
- **Root Directory**: `./` (directorio raíz)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

*(Todos los valores por defecto son correctos, no es necesario modificarlos).*

### 3. Variables de Entorno (Environment Variables)
En la sección **"Environment Variables"** antes de presionar Deploy (o luego en *Settings > Environment Variables*), puedes agregar las siguientes variables:

| Variable | Descripción | Valor de Ejemplo |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | URL de tu proyecto en Supabase | `https://xxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Llave anónima pública de Supabase | `eyJhbGciOi...` |
| `VITE_WHATSAPP_PHONE` | Número de WhatsApp para pedidos (sin signos) | `5492944793890` |

> 💡 **Nota de Resiliencia**: El catálogo incluye un sistema de respaldo automático (`fallbackProducts.js`) con los **94 productos oficiales, imágenes de packshot y categorías completas**. Si aún no configuraste Supabase, la página funcionará de inmediato mostrando el catálogo completo y permitiendo realizar pedidos por WhatsApp.

### 4. Desplegar
Haz clic en **"Deploy"**. En ~1 minuto tu sitio estará online con HTTPS, CDN global y compresión optimizada.

---

## 🛠️ Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción localmente
npm run build

# Previsualizar la compilación de producción
npm run preview
```

---

## ✨ Características Principales

- **94 Packshots Branded**: Fotografías personalizadas de alta calidad para cada producto con la etiqueta oficial de la marca.
- **Categorización Intuitiva**: Tinturas madre, cremas terapéuticas, brumas áuricas, óleos macerados, higiene capilar, etc.
- **Buscador y Filtro en Tiempo Real**: Búsqueda por nombre y filtrado por categoría.
- **Integración con WhatsApp**: Generación automática de mensajes personalizados para consultar o encargar productos.
- **Botón de Scroll to Top**: Navegación ágil en dispositivos móviles y de escritorio.
- **Cache CDN Optimizado**: Reglas en `vercel.json` para servir imágenes y bundles a máxima velocidad.
- **SEO & OpenGraph**: Tarjetas de vista previa listas para compartir en redes sociales y mensajería.
