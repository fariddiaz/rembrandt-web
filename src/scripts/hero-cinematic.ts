// Storytelling dimensional del hero (solo PC con movimiento permitido).
// La pista #hero mide 185svh y .hero-stage es sticky (ver Hero.astro), así que
// aquí solo se "frota" una línea de tiempo sobre ese recorrido:
//   0 – 0.6  Tensión: la escena se inclina en perspectiva y retrocede como un
//            lienzo que se aleja; el copy va hacia el fondo y el robot avanza.
//   0.6 – 1  Liberación: la escena se eleva y se apaga hacia el carbón, y la
//            página sigue su flujo normal cuando termina la pista.
// Solo transform/opacity. Con matchMedia de GSAP todo se revierte al cambiar
// de tamaño o activar "reducir movimiento".
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const QUERY = '(min-width: 768px) and (prefers-reduced-motion: no-preference)';
const SCRUB_SMOOTHING_S = 0.8;
const TENSION = 0.6;
const RELEASE = 1 - TENSION;

export function initHeroCinematic(): void {
  const track = document.querySelector<HTMLElement>('#hero');
  const canvas = track?.querySelector<HTMLElement>('[data-hero-canvas]');
  if (!track || !canvas) return;

  const copy = track.querySelector<HTMLElement>('[data-hero-copy]');
  const robot = track.querySelector<HTMLElement>('[data-hero-robot-layer]');
  const cue = track.querySelector<HTMLElement>('[data-hero-cue]');
  const dim = track.querySelector<HTMLElement>('[data-hero-dim]');

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
      { rotateX: 9, scale: 0.86, yPercent: -2, ease: 'power1.inOut', duration: TENSION },
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

    // ── Liberación ────────────────────────────────────────
    tl.to(
      canvas,
      { yPercent: -10, scale: 0.8, rotateX: 4, ease: 'power2.in', duration: RELEASE },
      TENSION,
    );
    if (dim) tl.to(dim, { opacity: 0.78, ease: 'power1.in', duration: RELEASE }, TENSION);

    return () => tl.scrollTrigger?.kill();
  });

  // Las fuentes cambian alturas: recalcular posiciones al terminar de cargar.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}
