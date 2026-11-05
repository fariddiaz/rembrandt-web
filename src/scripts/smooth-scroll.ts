// ─────────────────────────────────────────────────────────────
// Lenis (inercia) + GSAP ScrollTrigger (scrollytelling)
// Un único reloj: gsap.ticker mueve a Lenis → no hay doble rAF ni "jitter".
// ─────────────────────────────────────────────────────────────
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initCursor } from './cursor';
import { initWhatsApp } from './whatsapp';

gsap.registerPlugin(ScrollTrigger);

export let lenis: Lenis | null = null;

export function initMotion() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduce) {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // En táctil se deja el scroll nativo (más natural y sin lag)
      syncTouch: false,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis?.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    (window as unknown as { lenis: Lenis }).lenis = lenis;
  }

  bindAnchors();
  initStackCards(reduce);
  initCursor();
  initWhatsApp();

  // Recalcular cuando las fuentes terminan de cargar (cambian alturas)
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

/** Los enlaces #ancla usan Lenis para desplazarse con la misma inercia. */
function bindAnchors() {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id.length < 2) return;
      const target = document.querySelector<HTMLElement>(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -16, duration: 1.4 });
      else target.scrollIntoView({ behavior: 'smooth' });
      history.replaceState(null, '', id);
    });
  });
}

/** Apilamiento con profundidad: cada tarjeta se hunde cuando la siguiente la cubre. */
function initStackCards(reduce: boolean) {
  const cards = gsap.utils.toArray<HTMLElement>('.stack-card');
  if (reduce || cards.length < 2 || !matchMedia('(min-width: 768px)').matches) return;

  cards.forEach((card, i) => {
    const next = cards[i + 1];
    if (!next) return;
    const depth = cards.length - 1 - i; // las primeras se hunden más
    gsap.to(card, {
      scale: 1 - depth * 0.045,
      '--dim': 0.62,
      ease: 'none',
      scrollTrigger: {
        trigger: next,
        start: 'top bottom',
        end: 'top 18%',
        scrub: true,
      },
    });
  });
}
