const ON_CLASS = "scenes-on";
const ENABLE_QUERY = "(min-width: 1024px) and (min-height: 640px)";
const MIN_FIT = 0.74;
const SWITCH = 0.3;
/** Viewport heights past a scene's top where it lands (navigation and snap). */
const LAND_INSET = 0.02;

type State = "before" | "in" | "after";

interface Window {
  el: HTMLElement;
  at: number;
  until: number;
}

interface SceneState {
  el: HTMLElement;
  sectionId: string | undefined;
  top: number;
  len: number;
  current: number;
  state: State | null;
  windows: Window[];
}

const enabled = () => document.documentElement.classList.contains(ON_CLASS);

export const SCENE_CHANGE_EVENT = "scenechange";

export function stackWindow(index: number, count: number, step: number) {
  const at = index === 0 ? -1 : index * step;
  const isLast = index === count - 1;
  return { at, until: isLast ? undefined : (index + 1) * step };
}

export const STACK_STEP = 0.6;

export const stackSceneLength = (count: number, step = STACK_STEP) =>
  1.3 + count * step;

export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  const scene = target.closest<HTMLElement>("[data-scene]");
  if (!enabled() || !scene) {
    target.scrollIntoView({ behavior: "smooth" });
    return;
  }
  const first = scene === document.querySelector("[data-scene]");
  const top = scene.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({
    top: first ? 0 : top + window.innerHeight * LAND_INSET,
    behavior: "smooth",
  });
}

export function initScenes() {
  const root = document.documentElement;
  const query = window.matchMedia(ENABLE_QUERY);
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const scenes: SceneState[] = Array.from(
    document.querySelectorAll<HTMLElement>("[data-scene]")
  ).map((el) => ({
    el,
    sectionId: el.querySelector("section[id]")?.id,
    top: 0,
    len: Number(el.style.getPropertyValue("--len")) || 2,
    current: 0,
    state: null,
    windows: Array.from(
      el.querySelectorAll<HTMLElement>("[data-reveal][data-window]")
    ).map((block) => ({
      el: block,
      at: Number(block.style.getPropertyValue("--at")) || 0,
      until: Number(block.style.getPropertyValue("--until")) || Infinity,
    })),
  }));

  let raf = 0;
  let last = 0;

  let stops: number[] = [];
  let stepping = false;
  let lastWheel = 0;
  let stepTimer = 0;

  const computeStops = () => {
    const max = root.scrollHeight - window.innerHeight;
    const vh = window.innerHeight;
    const points = scenes.flatMap((scene, index) => {
      const offsets = scene.windows.length
        ? scene.windows.map((w) => Math.max(w.at, 0))
        : [0];
      return offsets.map((at) =>
        index === 0 && at === 0 ? 0 : scene.top + (at + LAND_INSET) * vh
      );
    });
    points.push(max);
    stops = Array.from(
      new Set(points.map((y) => Math.round(Math.min(y, max))))
    ).sort((a, b) => a - b);
  };

  const releaseStep = () => {
    // Stay locked while a gesture (trackpad inertia) is still emitting events.
    const quiet = 200 - (performance.now() - lastWheel);
    if (quiet > 0) {
      stepTimer = window.setTimeout(releaseStep, quiet);
      return;
    }
    stepping = false;
  };

  const step = (direction: 1 | -1) => {
    const y = window.scrollY;
    const target =
      direction > 0
        ? stops.find((stop) => stop > y + 2)
        : [...stops].reverse().find((stop) => stop < y - 2);
    if (target === undefined) return;

    stepping = true;
    clearTimeout(stepTimer);
    const done = () => {
      clearTimeout(stepTimer);
      releaseStep();
    };
    if ("onscrollend" in window) {
      window.addEventListener("scrollend", done, { once: true });
    }
    stepTimer = window.setTimeout(done, 1000);
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  const canScrollInside = (target: EventTarget | null, deltaY: number) => {
    for (
      let el = target instanceof Element ? target : null;
      el && el !== document.body;
      el = el.parentElement
    ) {
      const { overflowY } = getComputedStyle(el);
      if (overflowY !== "auto" && overflowY !== "scroll") continue;
      if (el.scrollHeight <= el.clientHeight) continue;
      const atTop = el.scrollTop <= 0;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
      if ((deltaY < 0 && !atTop) || (deltaY > 0 && !atBottom)) return true;
    }
    return false;
  };

  const onWheel = (event: WheelEvent) => {
    if (!enabled() || event.defaultPrevented || event.ctrlKey) return;
    if (canScrollInside(event.target, event.deltaY)) return;
    event.preventDefault();
    lastWheel = performance.now();
    if (stepping || Math.abs(event.deltaY) < 4) return;
    step(event.deltaY > 0 ? 1 : -1);
  };

  const STEP_KEYS: Record<string, 1 | -1> = {
    ArrowDown: 1,
    PageDown: 1,
    ArrowUp: -1,
    PageUp: -1,
  };

  const onKey = (event: KeyboardEvent) => {
    if (!enabled() || event.defaultPrevented || event.altKey) return;
    if (event.ctrlKey || event.metaKey) return;
    const target = event.target as HTMLElement | null;
    if (
      target?.closest(
        "input, textarea, select, [contenteditable], [role=dialog]"
      )
    ) {
      return;
    }
    const direction =
      event.key === " " ? (event.shiftKey ? -1 : 1) : STEP_KEYS[event.key];
    if (!direction) return;
    if (event.key === " " && target?.closest("button, a")) return;
    event.preventDefault();
    if (!stepping) step(direction);
  };

  const disable = () => {
    root.classList.remove(ON_CLASS);
    for (const scene of scenes) {
      scene.state = null;
      scene.el.removeAttribute("data-state");
      scene.el.style.removeProperty("--s");
      scene.el.style.removeProperty("--fit");
      for (const block of scene.windows) {
        block.el.removeAttribute("data-shown");
        block.el.removeAttribute("data-past");
      }
    }
  };

  const progress = (scene: SceneState) =>
    (window.scrollY - scene.top) / window.innerHeight;

  const updateStates = () => {
    scenes.forEach((scene, index) => {
      const s = progress(scene);
      const isLast = index === scenes.length - 1;
      const state: State =
        s < 0 && index > 0
          ? "before"
          : isLast || s < scene.len - 1 - SWITCH
            ? "in"
            : "after";

      if (state !== scene.state) {
        scene.state = state;
        scene.el.dataset.state = state;
        if (state === "in" && scene.sectionId) {
          window.dispatchEvent(
            new CustomEvent(SCENE_CHANGE_EVENT, { detail: scene.sectionId })
          );
        }
      }

      for (const block of scene.windows) {
        block.el.toggleAttribute("data-shown", s >= block.at && s < block.until);
        block.el.toggleAttribute("data-past", s >= block.until);
      }
    });
  };

  const frame = (now: number) => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const follow = 1 - Math.exp(-dt * 5);
    let moving = false;
    for (const scene of scenes) {
      const goal = progress(scene);
      const diff = goal - scene.current;
      scene.current =
        Math.abs(diff) < 0.0005 ? goal : scene.current + diff * follow;
      if (scene.current !== goal) moving = true;
      scene.el.style.setProperty("--s", scene.current.toFixed(4));
    }
    raf = moving ? requestAnimationFrame(frame) : 0;
  };

  const onScroll = () => {
    if (!enabled()) return;
    updateStates();
    if (!raf) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  };

  const layout = () => {
    if (!query.matches || motion.matches) {
      disable();
      return;
    }
    root.classList.add(ON_CLASS);
    const header = document.querySelector("header");
    root.style.setProperty("--header-h", `${header?.offsetHeight ?? 72}px`);

    let tightest = 1;
    for (const scene of scenes) {
      const pin = scene.el.firstElementChild as HTMLElement | null;
      const body = pin?.firstElementChild as HTMLElement | null;
      if (!pin || !body) continue;
      const style = getComputedStyle(pin);
      const room =
        pin.clientHeight -
        parseFloat(style.paddingTop) -
        parseFloat(style.paddingBottom);
      const fit = Math.min(1, room / Math.max(body.offsetHeight, 1));
      tightest = Math.min(tightest, fit);
      scene.el.style.setProperty("--fit", fit.toFixed(3));
    }

    if (tightest < MIN_FIT) {
      disable();
      return;
    }

    for (const scene of scenes) {
      scene.top = scene.el.getBoundingClientRect().top + window.scrollY;
      scene.current = progress(scene);
      scene.el.style.setProperty("--s", scene.current.toFixed(4));
    }
    computeStops();
    updateStates();
  };

  let layoutQueued = 0;
  const queueLayout = () => {
    cancelAnimationFrame(layoutQueued);
    layoutQueued = requestAnimationFrame(layout);
  };

  layout();
  document.fonts?.ready.then(queueLayout);

  const resizeObserver = new ResizeObserver(queueLayout);
  resizeObserver.observe(document.body);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("keydown", onKey);
  window.addEventListener("resize", queueLayout, { passive: true });
  query.addEventListener("change", queueLayout);
  motion.addEventListener("change", queueLayout);

  return () => {
    cancelAnimationFrame(raf);
    cancelAnimationFrame(layoutQueued);
    resizeObserver.disconnect();
    clearTimeout(stepTimer);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("wheel", onWheel);
    window.removeEventListener("keydown", onKey);
    window.removeEventListener("resize", queueLayout);
    query.removeEventListener("change", queueLayout);
    motion.removeEventListener("change", queueLayout);
    disable();
  };
}
