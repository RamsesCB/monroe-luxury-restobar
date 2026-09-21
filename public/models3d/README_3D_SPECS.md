# Especificaciones Técnicas para Modelos 3D & Realidad Aumentada (AR) — MONROE Restobar

Este documento establece los estándares de optimización y empaquetado para la entrega de modelos tridimensionales de platos gastronómicos para la carta digital interactiva de **MONROE Luxury Restobar**.

---

## 1. Formatos Requeridos

Cada plato debe disponer de dos archivos optimizados:
1. **`.glb` (GL Transmission Format Binary):**
   - Empleado para la visualización web 3D interactiva en navegadores de escritorio/móvil y para **Google Scene Viewer / WebXR** en dispositivos Android.
   - Debe incorporar texturas empaquetadas internamente.
2. **`.usdz` (Universal Scene Description Zipped):**
   - Empleado para **Apple AR Quick Look** en dispositivos iOS (iPhone / iPad) con detección de planos horizontales (mesas) y escala real 1:1.

---

## 2. Parámetros de Optimización y Rendimiento

Para preservar los **Core Web Vitals** (LCP < 2.5s, CLS = 0, INP óptimo) y garantizar 60 FPS fluidos en smartphones:

| Parámetro | Límite Recomendado | Máximo Absoluto |
| :--- | :--- | :--- |
| **Peso del Archivo** | `< 2.5 MB` | `4.0 MB` |
| **Poligonaje (Triángulos)** | `35,000 – 60,000 tris` | `80,000 tris` |
| **Resolución de Texturas** | `2048 × 2048 px (2K)` | `2048 × 2048 px` |
| **Mapas PBR** | BaseColor, Normal, Roughness, Metallic, Ambient Occlusion | 1 Material Set |
| **Compresión de Geometría** | Draco Compression / Meshopt | Recomendado |
| **Pivote y Origen** | Centrado en la base del plato `(0, 0, 0)` | Obligatorio |
| **Unidades de Escala** | Metros `(1 unidad = 1 metro)` | Obligatorio |

---

## 3. Dimensiones en Escala Real 1:1 por Categoría

| Categoría | Plato Ejemplo | Dimensiones (Ancho × Largo × Alto) |
| :--- | :--- | :--- |
| **Pastas Artesanales** | *Ravioli di Ossobuco al Tartufo* | `0.28m × 0.28m × 0.08m` (28cm × 28cm × 8cm) |
| **Cortes Prime** | *Tomahawk Monroe Gold Edition* | `0.45m × 0.30m × 0.15m` (45cm × 30cm × 15cm) |
| **Coctelería de Autor** | *Obsidiana de Humo (Copa Ahumada)* | `0.10m × 0.10m × 0.18m` (10cm × 10cm × 18cm) |
| **Postres de Autor** | *Esfera de Chocolate Valrhona* | `0.15m × 0.15m × 0.12m` (15cm × 15cm × 12cm) |

---

## 4. Nomenclatura de Archivos

Al exportar assets para su integración en `public/models3d/`:
- `ravioli-ossobuco-tartufo.glb` / `ravioli-ossobuco-tartufo.usdz`
- `tomahawk-monroe-gold.glb` / `tomahawk-monroe-gold.usdz`
- `obsidiana-de-humo.glb` / `obsidiana-de-humo.usdz`
- `esfera-chocolate-valrhona-oro.glb` / `esfera-chocolate-valrhona-oro.usdz`
