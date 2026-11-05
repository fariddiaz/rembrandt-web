// Claroscuro dinámico de RembrandtArtBorders.astro.
// - Releva las 4 obras de cada lado según el progreso de scroll de la página.
// - En cada relevo, un barrido de luz ámbar cruza el cuadro (Web Animations API).
// - En PC con puntero fino, las capas siguen al cursor con inercia (paralaje AR).
// - Oculta los rótulos al llegar al footer.
// Solo transform/opacity en el bucle; todo se detiene con prefers-reduced-motion.

const STATES = 4;
const SCROLL_SHIFT_PERCENT = 8;
const POINTER_SHIFT_PX = 14;
const POINTER_EASE = 0.06;
const SWEEP_MS = 1800;
const FOOTER_SCROLL_MIN = 150;
const FOOTER_MARGIN_PX = 80;

interface ParallaxLayer {
  el: HTMLElement;
  /** Los lados se mueven en espejo para dar profundidad al centro. */
  direction: 1 | -1;
}

function sweep(el: HTMLElement): void {
  el.animate(
    [
      { opacity: 0, transform: 'translate3d(-60%, 0, 0)' },
      { opacity: 1, offset: 0.35 },
      { opacity: 0, transform: 'translate3d(60%, 0, 0)' },
    ],
    { duration: SWEEP_MS, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' },
  );
}

export function initArtBorders(): void {
  const captions = document.querySelector<HTMLElement>('[data-art-captions]');
  const mobileCaptions = document.querySelector<HTMLElement>('[data-art-mobile-captions]');
  const footer = document.querySelector<HTMLElement>('footer');

  const layers: ParallaxLayer[] = [
    ...document.querySelectorAll<HTMLElement>('[data-art-parallax]'),
  ].map((el) => ({
    el,
    direction: el.dataset.artParallax === 'right' ? -1 : 1,
  }));
  const sweeps = [...document.querySelectorAll<HTMLElement>('[data-art-sweep]')];
  const desktopItems = document.querySelectorAll<HTMLElement>(
    '[data-art-borders] [data-art-state], [data-art-captions] [data-art-state]',
  );
  const mobileItems = document.querySelectorAll<HTMLElement>(
    '[data-art-mobile-backdrop] [data-art-mobile-state], [data-art-mobile-captions] [data-art-mobile-state]',
  );

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const desktop = matchMedia('(min-width: 1280px)');
  const finePointer = matchMedia('(pointer: fine)').matches;

  let current = 0;
  let scrollShift = 0;
  let pointerX = 0;
  let pointerY = 0;
  let targetX = 0;
  let targetY = 0;
  let raf = 0;

  const setState = (state: number): void => {
    if (state === current) return;
    current = state;
    desktopItems.forEach((el) =>
      el.classList.toggle('is-active', Number(el.dataset.artState) === state),
    );
    mobileItems.forEach((el) =>
      el.classList.toggle('is-active', Number(el.dataset.artMobileState) === state),
    );
    if (!reduceMotion && desktop.matches) sweeps.forEach(sweep);
  };

  const paint = (): void => {
    for (const { el, direction } of layers) {
      const x = pointerX * POINTER_SHIFT_PX * direction;
      const y = pointerY * POINTER_SHIFT_PX;
      el.style.transform = `translate3d(${x.toFixed(2)}px, calc(${scrollShift.toFixed(2)}% + ${y.toFixed(2)}px), 0)`;
    }
  };

  const frame = (): void => {
    raf = 0;
    const maxScroll = document.documentElement.scrollHeight - innerHeight || 1;
    const ratio = Math.min(Math.max(scrollY / maxScroll, 0), 0.999);
    setState(Math.min(Math.floor(ratio * STATES), STATES - 1));

    if (footer) {
      const atFooter =
        scrollY > FOOTER_SCROLL_MIN &&
        footer.getBoundingClientRect().top < innerHeight - FOOTER_MARGIN_PX;
      captions?.classList.toggle('at-footer', atFooter);
      mobileCaptions?.classList.toggle('at-footer', atFooter);
    }

    if (reduceMotion || !desktop.matches) return;

    scrollShift = (ratio - 0.5) * -SCROLL_SHIFT_PERCENT;
    pointerX += (targetX - pointerX) * POINTER_EASE;
    pointerY += (targetY - pointerY) * POINTER_EASE;
    paint();

    // Sigue animando solo mientras el paralaje del puntero no ha convergido.
    if (Math.abs(targetX - pointerX) + Math.abs(targetY - pointerY) > 0.002) schedule();
  };

  const schedule = (): void => {
    if (!raf) raf = requestAnimationFrame(frame);
  };

  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });

  if (finePointer && !reduceMotion) {
    addEventListener(
      'pointermove',
      (e) => {
        // Normalizado a [-0.5, 0.5] desde el centro del viewport.
        targetX = e.clientX / innerWidth - 0.5;
        targetY = e.clientY / innerHeight - 0.5;
        schedule();
      },
      { passive: true },
    );
  }

  frame();
}
