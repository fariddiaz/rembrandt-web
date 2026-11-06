// Storytelling dimensional del hero (solo PC con movimiento permitido).
// La pista #hero mide 185svh y .hero-stage es sticky (ver Hero.astro), así que
// aquí solo se "frota" una línea de tiempo sobre ese recorrido:
//   0 – 0.55   Tensión: la escena se inclina en perspectiva, el cuadro de lienzo
//              se revela, el copy retrocede y el robot avanza.
//   0.55 – 1   Liberación: el cuadro se retira primero y luego texto, robot y luz
//              se desvanecen con curvas suaves. En 1.0 no queda nada encima del
//              fondo: carbón y obras laterales son los mismos que en la sección
//              siguiente, así que la unión no tiene salto de luminosidad.
// Las opacidades van en cada capa y no en el lienzo: opacity < 1 en un padre con
// preserve-3d aplana el 3D y el robot "saltaría" al empezar la salida.
// Solo transform/opacity. Con matchMedia de GSAP todo se revierte al cambiar
// de tamaño o activar "reducir movimiento".
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const QUERY = '(min-width: 768px) and (prefers-reduced-motion: no-preference)';
const SCRUB_SMOOTHING_S = 0.8;
const TENSION = 0.55;
const RELEASE = 1 - TENSION;
/** Las capas terminan de desvanecerse un poco antes del final de la pista. */
const FADE_END = 0.96;

export function initHeroCinematic(): void {
  const track = document.querySelector<HTMLElement>('#hero');
  const canvas = track?.querySelector<HTMLElement>('[data-hero-canvas]');
  if (!track || !canvas) return;

  const copy = track.querySelector<HTMLElement>('[data-hero-copy]');
  const robot = track.querySelector<HTMLElement>('[data-hero-robot-layer]');
  const cue = track.querySelector<HTMLElement>('[data-hero-cue]');
  const frame = track.querySelector<HTMLElement>('[data-hero-frame]');
  const light = track.querySelector<HTMLElement>('[data-hero-light]');

  const mm = gsap.matchMedia();
  mm.add(QUERY, () => {
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: track,
        start: 'top top',
        end: 'bottom bottom',
        scrub: SCRUB_SMOOTHING_S,
      },
    });

    // ── Tensión ───────────────────────────────────────────
    tl.to(
      canvas,
      { rotateX: 8, scale: 0.9, yPercent: -2, ease: 'power1.inOut', duration: TENSION },
      0,
    );
    if (copy) tl.to(copy, { z: -90, y: -36, ease: 'power1.inOut', duration: TENSION }, 0);
    if (robot) {
      tl.to(
        robot,
        { z: 70, xPercent: -6, rotateY: -10, scale: 1.06, ease: 'power1.inOut', duration: TENSION },
        0,
      );
    }
    if (cue) tl.to(cue, { opacity: 0, duration: 0.12 }, 0);
    // El cuadro se revela con la inclinación (sale en la liberación).
    if (frame)
      tl.fromTo(frame, { opacity: 0 }, { opacity: 1, ease: 'sine.out', duration: 0.3 }, 0.08);

    // ── Liberación ────────────────────────────────────────
    tl.to(
      canvas,
      { yPercent: -8, scale: 0.86, rotateX: 3, ease: 'power1.in', duration: RELEASE },
      TENSION,
    );
    // Orden de salida: cuadro → texto → robot → luz. Cada capa usa una curva
    // suave (sine/power2) para que la luminosidad caiga sin escalones.
    if (frame) tl.to(frame, { opacity: 0, ease: 'sine.inOut', duration: 0.22 }, TENSION);
    if (copy) {
      tl.to(
        copy,
        { opacity: 0, ease: 'power2.in', duration: FADE_END - TENSION - 0.05 },
        TENSION + 0.05,
      );
    }
    if (robot) {
      tl.to(
        robot,
        { opacity: 0, ease: 'power2.in', duration: FADE_END - TENSION - 0.08 },
        TENSION + 0.08,
      );
    }
    if (light) {
      tl.to(
        light,
        { opacity: 0, ease: 'sine.inOut', duration: FADE_END - TENSION - 0.1 },
        TENSION + 0.1,
      );
    }
    // Relleno hasta 1.0 para que FADE_END quede antes del final de la pista.
    tl.to({}, { duration: 1 - FADE_END }, FADE_END);

    return () => tl.scrollTrigger?.kill();
  });

  // Las fuentes cambian alturas: recalcular posiciones al terminar de cargar.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}
