function signal(eventName: string) {
  let fired = false;

  return {
    get fired() {
      return fired;
    },
    fire() {
      if (fired) return;
      fired = true;
      window.dispatchEvent(new Event(eventName));
    },
    on(callback: () => void): () => void {
      if (fired) {
        callback();
        return () => {};
      }
      window.addEventListener(eventName, callback, { once: true });
      return () => window.removeEventListener(eventName, callback);
    },
  };
}

export const booted = signal("app:booted");

export const heroReady = signal("app:hero-ready");

export const BOOTED_ATTR = "data-booted";
