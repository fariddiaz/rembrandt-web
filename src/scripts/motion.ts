import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const reduce = typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

let lenis: Lenis | null = null;

if (!reduce && typeof window !== 'undefined') {
  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

let ctx: gsap.Context | null = null;

function initReveals() {
  if (reduce) return;

  // Animaciones de revelado suave al hacer scroll
  gsap.utils.toArray<HTMLElement>('[data-reveal="fade"]').forEach((el) => {
    gsap.from(el, {
      autoAlpha: 0,
      y: 35,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  // Animación de tarjetas apiladas (Plan Stack)
  const cards = gsap.utils.toArray<HTMLElement>('.plan-card');
  cards.forEach((card, i) => {
    const next = cards[i + 1];
    if (!next) return;
    gsap.to(card, {
      scale: 0.94,
      autoAlpha: 0.5,
      ease: 'none',
      scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 30%', scrub: true },
    });
  });
}

if (typeof document !== 'undefined') {
  const init = () => {
    ctx = gsap.context(() => {
      initReveals();
    });
    lenis?.resize();
    ScrollTrigger.refresh();
  };

  document.addEventListener('astro:page-load', init);
  document.addEventListener('DOMContentLoaded', init);
  document.addEventListener('astro:before-swap', () => ctx?.revert());
  document.addEventListener('astro:after-swap', () => lenis?.scrollTo(0, { immediate: true }));
}
