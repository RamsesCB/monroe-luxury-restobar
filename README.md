# 👑 MONROE LUXURY RESTOBAR — Web Oficial & Carta Digital Interactiva 3D/AR

> **Alta Cocina de Autor, Pastas Artesanales & Coctelería Contemporánea en Chimbote, Perú.**

Plataforma digital de vanguardia desarrollada con arquitectura *Dark Luxury*, diseñada para ofrecer una experiencia inmersiva tanto en web de escritorio como en servicio de mesa móvil (mediante escaneo de código QR).

---

## 🌟 Características Principales

### 1. Sistema de Diseño Dark Luxury (Awwwards-Tier)
- **Paleta Cromática:** Obsidianas profundas (`#0A0A0B`, `#121214`), acentos en oro champaña/bronce pulido (`#D4AF37`, `#C5A059`) y superficies de cristal ahumado (*glassmorphism*).
- **Tipografía Editorial:** Encabezados en *Cormorant Garamond / Cinzel* combinados con controles limpios en *Plus Jakarta Sans*.
- **Microinteracciones Hápticas:** Arquitectura de doble bisel (*Doppelrand*), transiciones fluidas con curvas cúbicas Bézier y aceleración por GPU.

### 2. Carta Gastronómica Interactiva & Storytelling
- **Categorías de Autor:** Pastas Artesanales (*Fatta a Mano*), Cortes Prime & Fuego (*Dry-Aged 45 Días* en horno Josper a 400°C), Coctelería Contemporánea, Entradas & Crudos, Postres de Autor y Cava de Vinos.
- **Ficha Detallada de Plato:** Historia culinaria, notas del Chef Ejecutivo, maridaje sugerido por el Sommelier, radar sensorial de sabor (Umami, Ahumado, Intensidad, Frescura) y desglose de alérgenos.

### 3. Visor Tridimensional & Realidad Aumentada (AR Ready)
- **Motor Híbrido 3D:** Integración con Three.js y soporte nativo para `@google/model-viewer`.
- **Proyección en Mesa 1:1:** Compatible con **Google Scene Viewer / WebXR** (Android) y **Apple AR Quick Look** (`.usdz` en iOS) para visualizar platos a escala milimétrica en la mesa antes de ordenar.
- **Turntable 360° Studio:** Rotación interactiva con iluminación personalizable (Candelita Íntima, Salón Obsidian, Fuego Josper).
- **Rendimiento Óptimo:** Lazy loading estricto, skeleton shimmer y preservación de Core Web Vitals (LCP < 2.5s, CLS = 0).

### 4. Servicio de Mesa "Mi Selección" & Despacho WhatsApp
- Selector de zona (*Salón Principal Obsidian, Cava Privada VIP, Terraza Lounge Bahía, Barra de Autor, Mesa del Chef*).
- Cálculo en tiempo real en Soles peruanos (S/.) con desglose de propina sugerida (10%) y notas personalizadas para cocina.
- Generación y despacho automático de comanda formateada con emojis al WhatsApp del Sommelier & Concierge.

### 5. Reservas VIP & Experiencias Privadas
- Sistema interactivo para reserva de mesas por fecha, turno, número de comensales y ocasión especial (Cena Romántica, Aniversario, Negocios).

### 6. Atmósfera Inmersiva & Soporte QR
- **Atmósfera Sonora Procedural:** Generador de soundscape lounge con síntesis Web Audio API sin consumo de ancho de banda.
- **Modo Pantalla Completa (`Fullscreen API`):** Emula una aplicación nativa al ser escaneada desde los códigos QR de las mesas.

---

## 🛠️ Stack Tecnológico

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/) + [React 19](https://react.dev/)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/) con tokens Dark Luxury propietarios
- **Animaciones:** [Framer Motion](https://www.framer.com/motion/)
- **Gráficos 3D:** [Three.js](https://threejs.org/) + [Google Model Viewer](https://modelviewer.dev/)
- **Iconografía:** [Lucide React](https://lucide.dev/) (Ultra-fine strokes)
- **Efectos:** Canvas Confetti & Web Audio API
- **Despliegue:** [Vercel Edge Network](https://vercel.com/)

---

## 🚀 Instalación y Desarrollo Local

```bash
# Clonar el repositorio
git clone https://github.com/RamsesCB/monroe-luxury-restobar.git
cd monroe-luxury-restobar

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado.

---

## 📦 Especificaciones para Archivos 3D (`.glb` / `.usdz`)

Consulta la guía técnica completa en [`public/models3d/README_3D_SPECS.md`](file:///home/ramsescb/.gemini/antigravity/scratch/monroe-restobar/public/models3d/README_3D_SPECS.md) para conocer las pautas de poligonaje (< 60k tris), peso (< 3.5 MB) y escala 1:1.

---

## 📍 Ubicación
**MONROE Luxury Restobar**  
Av. Francisco Bolognesi 640 (Malecón Grau), Chimbote — Perú  
*Atención: Martes a Domingo*
