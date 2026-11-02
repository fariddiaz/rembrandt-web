# Plantilla de Caso de Estudio · Rembrandt Studio

Esta plantilla define la estructura exacta para registrar un nuevo cliente en el portafolio de Rembrandt Studio (`src/components/Work.astro` y `src/config/site.ts`), manteniendo la misma calidad, diseño interactivo y desglose de negocio que tiene **Eventos Leymar**.

---

## 1. Configuración del Cliente en `src/config/site.ts`

Agrega el nuevo objeto dentro del array `caseStudies`:

```typescript
{
  id: 'nombre-cliente', // Identificador en minúsculas sin espacios
  client: 'Nombre de la Marca o Empresa',
  sector: 'Categoría o Nicho · Ubicación geográfica',
  url: '/preview/nombre-cliente', // Ruta a la preview interactiva interna
  liveUrl: 'https://dominiodelcliente.com', // URL real en producción para "Abrir en vivo"
  challenge:
    '¿Qué necesitaba el cliente? (Redactado en 2-3 líneas: problema comercial, necesidad de estatus, captación de prospectos o automatización).',
  solution:
    '¿Qué le construimos? (Explicación técnica y de diseño: web express o corporativa, catálogo interactivo, 3D, integración a WhatsApp o pagos).',
  impact:
    '¿Qué logramos para el cliente? (Resultados tangibles: velocidad de carga, porcentaje de incremento en cotizaciones, conversión de clientes internacionales).',
  metrics: [
    { value: '0.6 s', label: 'Velocidad de carga en celular' },
    { value: '+60%', label: 'Aumento en prospectos calificados' },
  ],
  tint: ['#colorPrimario', '#colorAcento'], // Duotono para el marco interactivo
},
```

---

## 2. Creación de la Preview Interactiva

Crea el archivo correspondiente en `src/pages/preview/[id].astro`:

1. Utiliza la estructura base de `src/pages/preview/eventosleymar.astro`.
2. Estilos CSS completamente autocontenidos (sin dependencias de CDN que puedan fallar en iframe o sandbox).
3. Asegura que el logo tenga dimensiones restringidas:
   ```css
   .client-logo {
     height: 38px;
     max-height: 38px;
     width: auto;
     max-width: 140px;
     object-fit: contain;
     display: block;
   }
   ```
4. Los botones de acción deben redirigir al WhatsApp del cliente con mensaje preconfigurado.

---

## 3. Checklist de Lanzamiento
- [ ] Logotipo del cliente guardado en SVG en `public/preview-assets/` y en `public/logos/` si se incluye en el marquee.
- [ ] Foto o avatar del fundador/directivo en `public/preview-assets/`.
- [ ] Comprobación del modal interactivo en escritorio y celular.
- [ ] Botón "Abrir en vivo" verificado hacia la URL real.
- [ ] Cero datos falsos o números no verificados.
