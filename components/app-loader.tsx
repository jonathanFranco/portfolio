"use client";

import { useI18n } from "@/components/i18n-provider";
import { BOOTED_ATTR, booted, heroReady } from "@/lib/boot";
import { useEffect, useRef, useState } from "react";

type Phase = "loading" | "leaving" | "gone";
type Rect = [x: number, y: number, w: number, h: number];

const MIN_FILL_S = 1.1;
const HOLD_MS = 180;
const LEAVE_MS = 650;
const MAX_WAIT_MS = 7000;

const SHEET_W = 1.7;
const SHEET_H = 1.06;
const GAP = 0.26;

const SHEETS: Array<{ color: string; rects: Rect[] }> = [
  { color: "--layer-margin", rects: [[0, 0, 1, 1]] },
  {
    color: "--layer-border",
    rects: [
      [0, 0.84, 1, 0.16],
      [0, 0.14, 1, 0.7],
      [0, 0, 1, 0.14],
    ],
  },
  {
    color: "--layer-padding",
    rects: [
      [0.06, 0.48, 0.5, 0.3],
      [0.62, 0.44, 0.32, 0.34],
      [0.06, 0.2, 0.36, 0.18],
    ],
  },
  {
    color: "--layer-content",
    rects: [
      [0.09, 0.7, 0.3, 0.03],
      [0.09, 0.64, 0.24, 0.03],
      [0.09, 0.58, 0.36, 0.03],
      [0.66, 0.68, 0.24, 0.03],
      [0.66, 0.62, 0.18, 0.03],
      [0.09, 0.3, 0.26, 0.03],
    ],
  },
  {
    color: "--layer-grid",
    rects: [
      [0.06, 0.89, 0.08, 0.06],
      [0.6, 0.89, 0.09, 0.05],
      [0.72, 0.89, 0.09, 0.05],
      [0.84, 0.89, 0.1, 0.05],
      [0.06, 0.04, 0.14, 0.06],
    ],
  },
];

const SCATTER: Array<[x: number, y: number, z: number, spin: number]> = [
  [-1.4, 0.9, -2.2, -0.6],
  [1.5, -0.8, -1.6, 0.5],
  [-1.2, -1.0, -1.2, 0.4],
  [1.3, 1.0, -1.8, -0.5],
  [0.2, -1.3, -2.6, 0.7],
];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
const easeInCubic = (t: number) => t ** 3;

type Render3D = (progress: number, now: number, leave: number) => void;

export function AppLoader() {
  const { t } = useI18n();
  const [phase, setPhase] = useState<Phase>(() =>
    booted.fired ? "gone" : "loading"
  );
  const canvasRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (booted.fired) {
      root.setAttribute(BOOTED_ATTR, "");
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const pending = new Set(["hydrate", "fonts", "load", "hero"]);
    const total = pending.size;
    const done = (step: string) => pending.delete(step);

    done("hydrate");
    if (document.fonts) document.fonts.ready.then(() => done("fonts"));
    else done("fonts");
    const onLoad = () => done("load");
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    const offHero = heroReady.on(() => done("hero"));
    const cap = setTimeout(() => pending.clear(), MAX_WAIT_MS);

    let render3d: Render3D | null = null;
    let cleanup3d: (() => void) | null = null;
    let disposed = false;
    let shown = 0;
    let finishedAt = 0;
    let leaveStart = 0;
    let last = performance.now();
    let raf = 0;

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const goal = (total - pending.size) / total;
      shown = reduceMotion ? goal : Math.min(goal, shown + dt / MIN_FILL_S);

      if (percentRef.current) {
        percentRef.current.textContent = `${Math.round(shown * 100)}%`;
      }
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${shown})`;
      }

      if (shown >= 1 && !finishedAt) finishedAt = now;
      if (finishedAt && !leaveStart && now - finishedAt >= HOLD_MS) {
        leaveStart = now;
        root.setAttribute(BOOTED_ATTR, "");
        booted.fire();
        setPhase("leaving");
      }

      const leave = leaveStart ? clamp01((now - leaveStart) / LEAVE_MS) : 0;
      render3d?.(shown, now, leave);

      if (leave < 1) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    import("three").then((THREE) => {
      const container = canvasRef.current;
      if (disposed || !container) return;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      } catch {
        return;
      }

      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.display = "block";
      container.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        34,
        width / Math.max(height, 1),
        0.1,
        50
      );
      camera.position.set(0, 0, 4.6);

      const stack = new THREE.Group();
      scene.add(stack);

      const styles = getComputedStyle(root);
      const disposables: Array<{ dispose: () => void }> = [];

      const toGeometry = (rects: Rect[]) => {
        const points: number[] = [];
        for (const [x, y, w, h] of rects) {
          const x0 = (x - 0.5) * SHEET_W;
          const x1 = (x + w - 0.5) * SHEET_W;
          const y0 = (y - 0.5) * SHEET_H;
          const y1 = (y + h - 0.5) * SHEET_H;
          points.push(x0, y0, 0, x1, y0, 0, x1, y0, 0, x1, y1, 0);
          points.push(x1, y1, 0, x0, y1, 0, x0, y1, 0, x0, y0, 0);
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(points, 3)
        );
        disposables.push(geometry);
        return geometry;
      };

      const plane = new THREE.PlaneGeometry(SHEET_W, SHEET_H);
      disposables.push(plane);
      const outline = toGeometry([[0, 0, 1, 1]]);

      const sheets = SHEETS.map(({ color, rects }, i) => {
        const tint = new THREE.Color(
          styles.getPropertyValue(color).trim() || "#c4136f"
        );
        const lines = new THREE.LineBasicMaterial({
          color: tint,
          transparent: true,
          opacity: 0,
        });
        const fill = new THREE.MeshBasicMaterial({
          color: tint,
          transparent: true,
          opacity: 0,
          side: THREE.DoubleSide,
          depthWrite: false,
        });
        disposables.push(lines, fill);

        const group = new THREE.Group();
        group.add(new THREE.LineSegments(outline, lines));
        if (i > 0) group.add(new THREE.LineSegments(toGeometry(rects), lines));
        const mesh = new THREE.Mesh(plane, fill);
        mesh.position.z = -0.003;
        group.add(mesh);
        stack.add(group);

        return { group, lines, fill, baseZ: (i - (SHEETS.length - 1) / 2) * GAP };
      });

      const start = performance.now();

      render3d = (progress, now, leave) => {
        const time = (now - start) / 1000;
        const out = easeInCubic(leave);

        sheets.forEach((sheet, i) => {
          const local = reduceMotion
            ? 1
            : easeOutCubic(clamp01(progress * SHEETS.length - i));
          const [sx, sy, sz, spin] = SCATTER[i];
          const away = 1 - local;
          const spread = 1 + out * 4;

          sheet.group.position.set(
            sx * away,
            sy * away,
            sheet.baseZ * spread + sz * away
          );
          sheet.group.rotation.z = spin * away;

          const scan = reduceMotion ? 0 : Math.sin(time * 2.2 - i * 0.8) ** 8;
          const fade = 1 - out;
          sheet.lines.opacity = (0.55 + scan * 0.4) * local * fade;
          sheet.fill.opacity = (0.035 + scan * 0.06) * local * fade;
        });

        if (!reduceMotion) {
          stack.rotation.set(
            0.22 + Math.cos(time * 0.9) * 0.04,
            -0.62 + Math.sin(time * 0.7) * 0.1 + out * 0.5,
            0.03
          );
          stack.position.z = out * 2.2;
        } else {
          stack.rotation.set(0.22, -0.62, 0.03);
        }

        renderer.render(scene, camera);
      };

      cleanup3d = () => {
        disposables.forEach((item) => item.dispose());
        renderer.dispose();
        renderer.domElement.remove();
      };
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      clearTimeout(cap);
      offHero();
      window.removeEventListener("load", onLoad);
      cleanup3d?.();
    };
  }, []);

  useEffect(() => {
    if (phase !== "leaving") return;
    const timer = setTimeout(() => setPhase("gone"), LEAVE_MS + 50);
    return () => clearTimeout(timer);
  }, [phase]);

  if (phase === "gone") return null;

  return (
    <div
      className="app-loader"
      data-phase={phase}
      role="status"
      aria-live="polite"
      aria-label={t.loader.label}
    >
      <div className="flex flex-col items-center">
        <div
          ref={canvasRef}
          aria-hidden="true"
          className="h-[150px] w-[240px] sm:h-[190px] sm:w-[300px]"
        />

        <p aria-hidden="true" className="brand mt-4 text-[0.95em]">
          <span className="brand-bracket">{"<"}</span>
          <span className="brand-name">
            jonathan<span className="text-primary">.</span>franco
          </span>
          <span className="brand-bracket">{"/>"}</span>
        </p>

        <div aria-hidden="true" className="mt-6 w-44">
          <span className="block h-px w-full overflow-hidden bg-rule">
            <span
              ref={barRef}
              className="block h-full w-full origin-left bg-primary"
              style={{ transform: "scaleX(0)" }}
            />
          </span>
          <span className="mono-label mt-2.5 flex justify-between text-muted-foreground">
            <span>{t.loader.status}</span>
            <span ref={percentRef} className="tabular-nums text-foreground">
              0%
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
