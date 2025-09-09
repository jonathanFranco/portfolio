"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";


type Rect = [x: number, y: number, w: number, h: number];

const SHEET_W = 3.6;
const SHEET_H = 2.25;
const GAP = 0.44;

const LAYERS: Rect[][] = [
  [[0, 0, 1, 1]],
  [
    [0, 0.855, 1, 0.145],
    [0, 0.15, 1, 0.705],
    [0, 0, 1, 0.15],
  ],
  [
    [0.045, 0.892, 0.075, 0.07],
    [0.53, 0.9, 0.075, 0.052],
    [0.63, 0.9, 0.075, 0.052],
    [0.73, 0.9, 0.075, 0.052],
    [0.85, 0.895, 0.105, 0.062],
    [0.055, 0.5, 0.5, 0.3],
    [0.61, 0.46, 0.335, 0.34],
    [0.055, 0.035, 0.35, 0.08],
  ],
  [
    [0.075, 0.6, 0.14, 0.17],
    [0.235, 0.6, 0.14, 0.17],
    [0.395, 0.6, 0.14, 0.17],
    [0.63, 0.62, 0.29, 0.15],
    [0.63, 0.48, 0.29, 0.1],
    [0.075, 0.29, 0.46, 0.24],
  ],
  [
    [0.09, 0.72, 0.11, 0.018],
    [0.09, 0.685, 0.085, 0.018],
    [0.25, 0.72, 0.11, 0.018],
    [0.25, 0.685, 0.07, 0.018],
    [0.41, 0.72, 0.11, 0.018],
    [0.41, 0.685, 0.095, 0.018],
    [0.645, 0.715, 0.26, 0.02],
    [0.645, 0.675, 0.21, 0.02],
    [0.645, 0.635, 0.24, 0.02],
    [0.09, 0.45, 0.42, 0.022],
    [0.09, 0.405, 0.38, 0.022],
    [0.09, 0.36, 0.3, 0.022],
  ],
  [
    [0.09, 0.055, 0.115, 0.042],
    [0.22, 0.055, 0.075, 0.042],
    [0.645, 0.5, 0.09, 0.038],
    [0.75, 0.5, 0.055, 0.038],
    [0.87, 0.055, 0.075, 0.042],
  ],
];

const NEAR = new THREE.Color("#f0359c");
const FAR = new THREE.Color("#5f8dff");

function rectsToGeometry(rects: Rect[]): THREE.BufferGeometry {
  const points: number[] = [];
  for (const [x, y, w, h] of rects) {
    const x0 = (x - 0.5) * SHEET_W;
    const x1 = (x + w - 0.5) * SHEET_W;
    const y0 = (y - 0.5) * SHEET_H;
    const y1 = (y + h - 0.5) * SHEET_H;
    points.push(x0, y0, 0, x1, y0, 0);
    points.push(x1, y0, 0, x1, y1, 0);
    points.push(x1, y1, 0, x0, y1, 0);
    points.push(x0, y1, 0, x0, y0, 0);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(points, 3)
  );
  return geometry;
}

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export default function DomLayers() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      return; 
    }

    const compact = window.matchMedia("(max-width: 767px)").matches;
    const layers = compact ? LAYERS.slice(0, 5) : LAYERS;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight, false);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      38,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.1,
      100
    );
    camera.position.set(0, 0, compact ? 5.4 : 7.9);

    const stack = new THREE.Group();
    stack.rotation.set(0.16, -0.62, 0.04);
    scene.add(stack);

    const disposables: Array<THREE.BufferGeometry | THREE.Material> = [];
    const sheetGeometry = new THREE.PlaneGeometry(SHEET_W, SHEET_H);
    disposables.push(sheetGeometry);

    type Sheet = {
      group: THREE.Group;
      lines: THREE.LineBasicMaterial;
      fill: THREE.MeshBasicMaterial;
      edge: THREE.LineBasicMaterial;
      baseZ: number;
    };

    const sheets: Sheet[] = layers.map((rects, i) => {
      const t = layers.length > 1 ? i / (layers.length - 1) : 0;
      const color = NEAR.clone().lerp(FAR, t);

      const group = new THREE.Group();
      const baseZ = (i - (layers.length - 1) / 2) * GAP;
      group.position.z = 0;

      const lineGeometry = rectsToGeometry(rects);
      const lines = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0,
      });
      group.add(new THREE.LineSegments(lineGeometry, lines));
      disposables.push(lineGeometry, lines);

      const edgeGeometry = rectsToGeometry([[0, 0, 1, 1]]);
      const edge = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0,
      });
      group.add(new THREE.LineSegments(edgeGeometry, edge));
      disposables.push(edgeGeometry, edge);

      const fill = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(sheetGeometry, fill);
      mesh.position.z = -0.004;
      group.add(mesh);
      disposables.push(fill);

      stack.add(group);
      return { group, lines, fill, edge, baseZ };
    });

    const pointer = { x: 0, y: 0 };
    const smoothed = { x: 0, y: 0 };
    let flatten = 0;
    let smoothFlatten = 0;
    let visible = true;
    let raf = 0;
    const start = performance.now();

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
    };

    const WHEEL_TRAVEL = 900;
    let pinned = 0;
    let hovering = false;

    const rectProgress = () => {
      const rect = container.getBoundingClientRect();
      const travel = Math.max(rect.height * 0.9, 1);
      return clamp01(-rect.top / travel);
    };

    const readProgress = () => {
      const base = rectProgress();
      if (!hovering && base <= 0.001) pinned += (0 - pinned) * 0.06;
      flatten = clamp01(base + pinned);
    };

    const onWheel = (event: WheelEvent) => {
      const base = rectProgress();
      const consuming =
        event.deltaY > 0 ? base + pinned < 1 : pinned > 0;
      if (!consuming) return;
      event.preventDefault();
      pinned = clamp01(pinned + event.deltaY / WHEEL_TRAVEL);
    };

    const onEnter = () => {
      hovering = true;
    };
    const onLeave = () => {
      hovering = false;
    };

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    const frame = (now: number) => {
      const elapsed = (now - start) / 1000;
      readProgress();
      smoothFlatten += (flatten - smoothFlatten) * 0.08;
      const spread = 1 - smoothFlatten * 0.88;
      const dim = 1 - smoothFlatten * 0.75;

      sheets.forEach((sheet, i) => {
        const enter = reduceMotion
          ? 1
          : easeOutExpo(clamp01((elapsed - i * 0.11) / 1.25));

        sheet.group.position.z = sheet.baseZ * spread * enter;

        const scan = reduceMotion
          ? 0
          : Math.sin(elapsed * 0.55 - i * 0.7) ** 8;
        sheet.lines.opacity = (0.44 + scan * 0.48) * enter * dim;
        sheet.edge.opacity = (0.62 + scan * 0.36) * enter * dim;
        sheet.fill.opacity = (0.03 + scan * 0.055) * enter * dim;
      });

      if (!reduceMotion) {
        smoothed.x += (pointer.x - smoothed.x) * 0.045;
        smoothed.y += (pointer.y - smoothed.y) * 0.045;
        const settle = 1 - smoothFlatten;
        stack.rotation.y =
          -0.62 * settle + Math.sin(elapsed * 0.16) * 0.07 - smoothed.x * 0.2;
        stack.rotation.x =
          0.16 * settle + Math.cos(elapsed * 0.21) * 0.04 + smoothed.y * 0.12;
        stack.rotation.z = 0.04 * settle;
      }

      renderer.render(scene, camera);
      if (visible) raf = requestAnimationFrame(frame);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = visible;
        visible = entry.isIntersecting;
        if (visible && !wasVisible && !reduceMotion) {
          raf = requestAnimationFrame(frame);
        }
      },
      { threshold: 0 }
    );
    intersectionObserver.observe(container);

    if (reduceMotion) {
      frame(start + 2000); 
    } else {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      container.addEventListener("wheel", onWheel, { passive: false });
      container.addEventListener("pointerenter", onEnter);
      container.addEventListener("pointerleave", onLeave);
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      visible = false;
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("pointerenter", onEnter);
      container.removeEventListener("pointerleave", onLeave);
      disposables.forEach((item) => item.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);


  return (
    <div
      ref={containerRef}
      className="pointer-events-auto h-full w-full"
      aria-hidden="true"
    />
  );
}
