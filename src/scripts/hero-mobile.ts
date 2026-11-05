// "Lienzo de bolsillo" del hero móvil (HeroMobile.astro).
// - Dibuja el boceto del robot cuando la tarjeta entra en pantalla.
// - Paralaje AR: la inclinación del teléfono (deviceorientation) mueve los
//   planos a distinta profundidad. En iOS se pide permiso con un botón; sin
//   giroscopio, el arrastre del dedo hace lo mismo.
// - Solo escribe variables CSS (--rx, --ry, --px, --py) una vez por frame y
//   solo mientras la tarjeta es visible: no drena batería fuera de pantalla.

const MAX_TILT_DEG = 8;
const TILT_RANGE_DEG = 25;
const BETA_REST_DEG = 45; // inclinación natural al sostener el teléfono
const RELEASE_MS = 600;

type PermissionFn = () => Promise<'granted' | 'denied'>;

const clamp = (v: number) => Math.max(-1, Math.min(1, v));

export function initHeroMobile(): void {
  const root = document.querySelector<HTMLElement>('[data-hero-mobile]');
  const card = root?.querySelector<HTMLElement>('[data-hm-card]');
  if (!root || !card) return;

  let visible = false;
  new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (visible) root.classList.add('is-visible');
    },
    { threshold: 0.2 },
  ).observe(root);

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let nx = 0;
  let ny = 0;
  let raf = 0;
  const apply = () => {
    raf = 0;
    card.style.setProperty('--px', nx.toFixed(3));
    card.style.setProperty('--py', ny.toFixed(3));
    card.style.setProperty('--ry', `${(nx * MAX_TILT_DEG).toFixed(2)}deg`);
    card.style.setProperty('--rx', `${(-ny * MAX_TILT_DEG).toFixed(2)}deg`);
  };
  const set = (x: number, y: number) => {
    if (!visible) return;
    nx = clamp(x);
    ny = clamp(y);
    if (!raf) raf = requestAnimationFrame(apply);
  };

  const onOrientation = (e: DeviceOrientationEvent) => {
    if (e.gamma === null || e.beta === null) return;
    card.classList.add('is-live');
    set(e.gamma / TILT_RANGE_DEG, (e.beta - BETA_REST_DEG) / TILT_RANGE_DEG);
  };

  // Arrastre: alternativa sin giroscopio (o antes de conceder permiso en iOS).
  card.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'touch' && e.buttons === 0) return;
      const r = card.getBoundingClientRect();
      card.classList.add('is-live');
      set(((e.clientX - r.left) / r.width - 0.5) * 2, ((e.clientY - r.top) / r.height - 0.5) * 2);
    },
    { passive: true },
  );
  const release = () => {
    card.classList.remove('is-live');
    set(0, 0);
    setTimeout(() => card.classList.remove('is-live'), RELEASE_MS);
  };
  card.addEventListener('pointerup', release);
  card.addEventListener('pointercancel', release);
  card.addEventListener('pointerleave', release);

  // Se invoca como método de DeviceOrientationEvent: Safari rechaza la llamada suelta.
  if (typeof DeviceOrientationEvent === 'undefined') return; // queda el arrastre
  const orientationApi = DeviceOrientationEvent as unknown as { requestPermission?: PermissionFn };

  if (typeof orientationApi.requestPermission === 'function') {
    // iOS 13+: el permiso exige un gesto explícito del usuario.
    const button = root.querySelector<HTMLButtonElement>('[data-hm-permission]');
    if (!button) return;
    button.classList.remove('hidden');
    button.addEventListener('click', async () => {
      try {
        if ((await orientationApi.requestPermission?.()) === 'granted') {
          addEventListener('deviceorientation', onOrientation, { passive: true });
        }
      } catch (err) {
        console.warn('[HeroMobile] Permiso de orientación no disponible:', err);
      } finally {
        button.classList.add('hidden');
      }
    });
  } else {
    addEventListener('deviceorientation', onOrientation, { passive: true });
  }
}
