# Rembrandt Studio — Dirección de arte: Rembrandt en clave digital

Nov 1, 2026 · @Farid

## 1. Filosofía: Rembrandt como sistema de diseño

Rembrandt no pintaba todo el cuadro con la misma luz: decidía qué merecía ser visto y dejaba el resto en penumbra. Esa decisión es el principio de diseño del estudio. **La oscuridad no es fondo; es edición.**

### El método, traducido

| Técnica de Rembrandt | Qué hacía en el lienzo | Traducción en la web | Regla para Rembrandt Studio |
| --- | --- | --- | --- |
| Claroscuro | Contraste extremo entre luz y sombra para dar volumen y drama | Jerarquía visual: un solo punto brillante por pantalla sobre un campo oscuro | Un CTA violeta por vista. Todo lo demás, en grises de bajo contraste |
| Luz focal | Luz de una sola fuente (ventana, vela) que lleva la mirada a la cara o las manos | Conversión: guiar el ojo del titular al botón | El brillo #8b5cf6 se reserva para la acción; nunca para decorar |
| Empaste (impasto) | Pintura gruesa solo en las zonas de luz: la textura atrapa la luz real | Microinteracción y relieve solo donde hay interacción | Las texturas y el 3D aparecen donde el usuario toca, no en todas partes |
| Veladuras | Capas finas y translúcidas sobre capas oscuras | Capas de UI con transparencia, blur y ruido | Superficies de cristal oscuro (#0a0a0d al 70–85 %) sobre texturas |
| Penumbra significativa | Fondos casi negros que no están vacíos: tienen tono, aire y grano | Espacio negativo con vida (ruido, gradiente sutil) | Nunca #000 puro: negro carbón con grano al 3–5 % |
| Verdad antes que belleza | Arrugas, piel envejecida, autorretratos sin halago | Honestidad: rendimiento real, datos reales, casos sin maquillaje | Métricas verificables y código que se mide, no se promete |

---

### Paleta de intervención

| Token | Hex | Rol en la imagen | Rango de luminancia |
| --- | --- | --- | --- |
| carbon | `#0a0a0d` | Sombras y fondo (se funde con la web) | 0–35 % |
| velo | `#1c1530` | Medios tonos oscuros, volumen | 35–60 % |
| violet-neon | `#8b5cf6` | Luces: foco interactivo, botones y CTAs | 60–90 % |
| destello | `#ede9fe` | Brillo máximo, puntos de empaste | 90–100 % |

---

### Manifiesto

> Rembrandt pintaba con oscuridad para que la luz significara algo. Nos llamamos así porque creemos lo mismo del software: cada píxel, cada línea de código y cada animación tienen que ganarse su luz. Construimos sitios rápidos, honestos y precisos, donde el 3D y la interacción no son adorno sino foco: aparecen donde importan y se apartan cuando estorban. Somos un taller, no una fábrica. Firmamos solo lo que resiste la mirada de cerca.

**Claim de cabecera:** "Oscuridad para que la luz importe."
