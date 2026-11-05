// Portafolio con preview real (Work.astro, LiveWindow.astro, PreviewDialog.astro).
// 1. Ventanas en vivo: en PC con puntero fino, cada iframe se carga cuando su
//    tarjeta se acerca al viewport; se escala a 1440 px "reales" y se calcula
//    cuánto recorrer al hover. Si no carga en LOAD_TIMEOUT_MS queda el póster.
// 2. Inclinación 3D de las tarjetas hacia el puntero ([data-tilt]).
// 3. Modal de preview interactiva con selector de dispositivo y skeleton.

type LenisLike = { stop: () => void; start: () => void };
type NetInfo = { saveData?: boolean };

const VIRTUAL_WIDTH = 1440;
const VIRTUAL_HEIGHT = 2700;
const LOAD_MARGIN = '400px 0px';
const LOAD_TIMEOUT_MS = 12000;
const MAX_TILT_DEG = 5;
const DEVICES = ['desktop', 'tablet', 'mobile'] as const;
type Device = (typeof DEVICES)[number];

const getLenis = () => (window as unknown as { lenis?: LenisLike }).lenis;

const domainOf = (url: string) => {
  try {
    return new URL(url, location.href).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

function canLoadLiveWindows(): boolean {
  const saveData =
    (navigator as Navigator & { connection?: NetInfo }).connection?.saveData === true;
  return !saveData && matchMedia('(min-width: 1024px) and (pointer: fine)').matches;
}

function fitFrame(win: HTMLElement, stage: HTMLElement): void {
  const scale = stage.clientWidth / VIRTUAL_WIDTH;
  const travel = Math.max(0, VIRTUAL_HEIGHT * scale - stage.clientHeight);
  win.style.setProperty('--s', scale.toFixed(4));
  win.style.setProperty('--travel', `${travel.toFixed(1)}px`);
}

function loadLiveWindow(win: HTMLElement): void {
  const stage = win.querySelector<HTMLElement>('.lw-stage');
  const frame = win.querySelector<HTMLIFrameElement>('iframe[data-lw-src]');
  const skeleton = win.querySelector<HTMLElement>('[data-site-skeleton]');
  if (!stage || !frame?.dataset.lwSrc) return;

  fitFrame(win, stage);
  new ResizeObserver(() => fitFrame(win, stage)).observe(stage);

  skeleton?.classList.remove('is-hidden');
  const timeout = window.setTimeout(() => skeleton?.classList.add('is-hidden'), LOAD_TIMEOUT_MS);
  frame.addEventListener(
    'load',
    () => {
      window.clearTimeout(timeout);
      win.classList.add('is-loaded');
      skeleton?.classList.add('is-hidden');
    },
    { once: true },
  );
  frame.src = frame.dataset.lwSrc;
}

function initLiveWindows(): void {
  const windows = document.querySelectorAll<HTMLElement>('[data-live-window]');
  if (!windows.length || !canLoadLiveWindows()) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        loadLiveWindow(entry.target as HTMLElement);
      });
    },
    { rootMargin: LOAD_MARGIN },
  );
  windows.forEach((w) => io.observe(w));
}

function initTilt(): void {
  if (
    !matchMedia('(pointer: fine)').matches ||
    matchMedia('(prefers-reduced-motion: reduce)').matches
  )
    return;

  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
    let raf = 0;
    let x = 0;
    let y = 0;
    const apply = () => {
      raf = 0;
      el.style.setProperty('--tilt-y', `${(x * MAX_TILT_DEG).toFixed(2)}deg`);
      el.style.setProperty('--tilt-x', `${(-y * MAX_TILT_DEG).toFixed(2)}deg`);
    };
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      x = (e.clientX - r.left) / r.width - 0.5;
      y = (e.clientY - r.top) / r.height - 0.5;
      el.classList.add('is-tilting');
      if (!raf) raf = requestAnimationFrame(apply);
    });
    el.addEventListener('pointerleave', () => {
      el.classList.remove('is-tilting');
      x = 0;
      y = 0;
      if (!raf) raf = requestAnimationFrame(apply);
    });
  });
}

function initDialog(): void {
  const dialog = document.querySelector<HTMLDialogElement>('#case-preview');
  if (!dialog) return;

  const frame = dialog.querySelector<HTMLIFrameElement>('[data-preview-frame]');
  const wrap = dialog.querySelector<HTMLElement>('[data-preview-wrap]');
  const name = dialog.querySelector<HTMLElement>('[data-preview-name]');
  const domain = dialog.querySelector<HTMLElement>('[data-preview-domain]');
  const live = dialog.querySelector<HTMLAnchorElement>('[data-preview-live]');
  const close = dialog.querySelector<HTMLButtonElement>('[data-preview-close]');
  const skeleton = dialog.querySelector<HTMLElement>('[data-site-skeleton]');
  const deviceButtons = dialog.querySelectorAll<HTMLButtonElement>('[data-device]');
  if (!frame || !wrap || !name || !domain || !live || !close) return;

  frame.addEventListener('load', () => {
    if (frame.src && frame.src !== 'about:blank') skeleton?.classList.add('is-hidden');
  });

  const setDevice = (device: Device) => {
    DEVICES.forEach((d) => wrap.classList.toggle(`is-${d}`, d === device && d !== 'desktop'));
    deviceButtons.forEach((b) =>
      b.setAttribute('aria-pressed', String(b.dataset.device === device)),
    );
  };

  const open = (url: string, title: string, liveUrl: string) => {
    skeleton?.classList.remove('is-hidden');
    frame.src = url;
    name.textContent = title;
    domain.textContent = domainOf(liveUrl);
    live.href = liveUrl;
    setDevice(innerWidth < 768 ? 'mobile' : 'desktop');
    dialog.showModal();
    getLenis()?.stop();
  };

  document.querySelectorAll<HTMLElement>('[data-preview]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const url = trigger.dataset.preview;
      if (url) open(url, trigger.dataset.previewTitle ?? '', trigger.dataset.previewLive || url);
    });
  });

  deviceButtons.forEach((b) =>
    b.addEventListener('click', () => {
      const device = DEVICES.find((d) => d === b.dataset.device) ?? 'desktop';
      setDevice(device);
    }),
  );
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    frame.src = 'about:blank'; // libera memoria y red del sitio embebido
    getLenis()?.start();
  });
}

export function initWorkPreview(): void {
  initLiveWindows();
  initTilt();
  initDialog();
}
