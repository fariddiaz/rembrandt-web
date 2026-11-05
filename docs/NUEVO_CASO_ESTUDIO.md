# Guía para Agregar un Nuevo Caso de Estudio

Esta guía explica cómo documentar e incorporar un nuevo caso de éxito en la web de **Rembrandt Studio** siguiendo la misma estructura y calidad que el caso de **Eventos Leymar**.

---

## 1. Estructura de un Caso de Éxito (`site.ts`)

Cada caso de estudio vive en `src/config/site.ts` dentro del arreglo `caseStudies`. Debe responder estrictamente a las 3 preguntas clave de negocio que generan conversión:

```typescript
export interface CaseStudy {
  id: string; // Identificador único (slug), ej: 'mi-cliente'
  client: string; // Nombre comercial de la empresa
  sector: string; // Industria o ciudad, ej: 'Restaurante de Autor · Medellín'
  url: string; // Ruta de preview interactiva interna o URL directa
  liveUrl?: string; // Enlace real al sitio web público en vivo
  image?: string; // (Opcional) Captura estática en /public para el poster
  challenge: string; // ¿Qué necesitaba el cliente? (El reto inicial)
  solution: string; // ¿Qué le construimos? (La solución diseñada)
  impact: string; // ¿Qué logramos para el cliente? (Resultados e impacto medible)
  metrics: {
    // 1 o 2 métricas contundentes
    value: string; // ej: '+60%' o '0.8 s' o '3x'
    label: string; // ej: 'Aumento en prospectos'
  }[];
  tint: [string, string]; // Dos colores hexadecimales para el degradado del poster
}
```

---

## 2. Ejemplo Plantilla (Copiar y Pegar)

```typescript
{
  id: 'nuevo-cliente',
  client: 'Nombre del Cliente',
  sector: 'Sector o Industria · Ciudad',
  url: '/preview/nuevo-cliente', // O su URL externa si permite iframes
  liveUrl: 'https://nuevocliente.com',
  challenge:
    'Explicar el problema o dolor del cliente: qué estaba fallando en su presencia anterior o qué meta comercial urgente necesitaban alcanzar.',
  solution:
    'Explicar la arquitectura y diseño entregados: landing express, catálogo interactivo, diseño de identidad o flujo de captación a WhatsApp.',
  impact:
    'Explicar los resultados alcanzados: velocidad de carga, duplicación de contactos, satisfacción del cliente o aumento de ventas.',
  metrics: [
    { value: '0.8 s', label: 'Tiempo de carga ultra rápido' },
    { value: '+50%', label: 'Crecimiento en cotizaciones' },
  ],
  tint: ['#3b82f6', '#8b5cf6'],
}
```

---

## 3. Manejo de la Preview Interactiva

Si el sitio del cliente cuenta con cabeceras `X-Frame-Options: SAMEORIGIN` (como ocurre con dominios que bloquean iframes externos):

1. Crea una página de preview dentro de `src/pages/preview/[cliente].astro`.
2. Asigna `url: '/preview/[cliente]'` en `site.ts`.
3. Asigna `liveUrl: 'https://dominiodelcliente.com'` para que el botón **"Visitar sitio en vivo ↗"** abra la web oficial en una nueva pestaña.
