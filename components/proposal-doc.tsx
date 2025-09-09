"use client";

import { DOC_COLORS } from "@/lib/doc-colors";
import { useEffect, useRef } from "react";
import * as THREE from "three";

type Rect = [x: number, top: number, w: number, h: number];

const PAGE_W = 2.3;
const PAGE_H = 3.25;

const M = 0.1;
const CW = 1 - M * 2;

const BLOCKS: Rect[][] = [];
const BOUNDS: Array<[top: number, height: number]> = [];

let cursor = 0.165;

function commit(rects: Rect[], start: number, end: number) {
  BLOCKS.push(rects);
  BOUNDS.push([start - 0.022, end - start + 0.038]);
  cursor = end + 0.024;
}

function textBlock(widths: number[]) {
  const start = cursor;
  const rects: Rect[] = [[M, start, 0.22, 0.018]];
  let y = start + 0.04;
  for (const w of widths) {
    rects.push([M, y, CW * w, 0.011]);
    y += 0.022;
  }
  commit(rects, start, y);
}

function listBlock(count: number) {
  const start = cursor;
  const rects: Rect[] = [[M, start, 0.22, 0.018]];
  let y = start + 0.04;
  for (let i = 0; i < count; i++) {
    rects.push([M, y, 0.02, 0.011]);
    rects.push([M + 0.042, y, CW * (0.6 - i * 0.06), 0.011]);
    y += 0.024;
  }
  commit(rects, start, y);
}

function timelineBlock(widths: number[]) {
  const start = cursor;
  const rects: Rect[] = [[M, start, 0.22, 0.018]];
  let y = start + 0.04;
  widths.forEach((w, i) => {
    rects.push([M, y, 0.15, 0.012]);
    rects.push([M + 0.2 + i * 0.11, y, CW * w, 0.012]);
    y += 0.028;
  });
  commit(rects, start, y);
}

function priceBlock() {
  const start = cursor;
  const rects: Rect[] = [
    [M, start, CW, 0.095],
    [M + 0.03, start + 0.018, 0.18, 0.012],
    [M + 0.03, start + 0.045, 0.3, 0.028],
  ];
  commit(rects, start, start + 0.095);
}

function signatureBlock() {
  const start = cursor;
  const rects: Rect[] = [
    [M, start, CW * 0.55, 0.011],
    [M, start + 0.05, 0.32, 0.006],
    [M, start + 0.07, 0.16, 0.01],
  ];
  commit(rects, start, start + 0.08);
}

textBlock([0.98, 0.92, 0.7]);
listBlock(4);
timelineBlock([0.28, 0.22, 0.18]);
priceBlock();
textBlock([0.86, 0.6]);
signatureBlock();

const CHROME: Rect[] = [
  [M, 0.055, 0.34, 0.026],
  [1 - M - 0.1, 0.05, 0.1, 0.036],
  [M, 0.115, CW, 0.004],
  [M, 0.955, 0.24, 0.009],
];

function rectsToGeometry(rects: Rect[]): THREE.BufferGeometry {
  const points: number[] = [];
  for (const [x, top, w, h] of rects) {
    const x0 = (x - 0.5) * PAGE_W;
    const x1 = (x + w - 0.5) * PAGE_W;
    const y0 = (0.5 - top) * PAGE_H;
    const y1 = (0.5 - top - h) * PAGE_H;
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

interface ProposalDocProps {
  active?: number | null;
}

export default function ProposalDoc({ active = null }: ProposalDocProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<number | null>(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

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

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight, false);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      36,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.1,
      100
    );
    camera.position.set(0, 0, compact ? 6.6 : 6.2);

    const doc = new THREE.Group();
    doc.rotation.set(0.08, -0.5, 0.03);
    scene.add(doc);

    const disposables: Array<THREE.BufferGeometry | THREE.Material> = [];

    const stackGeometry = rectsToGeometry([[0, 0, 1, 1]]);
    disposables.push(stackGeometry);
    const stackSheets = [0.14, 0.28].map((offset, i) => {
      const material = new THREE.LineBasicMaterial({
        color: new THREE.Color(DOC_COLORS[DOC_COLORS.length - 1]),
        transparent: true,
        opacity: 0,
      });
      const line = new THREE.LineSegments(stackGeometry, material);
      line.position.set(offset * 0.5, -offset * 0.35, -offset);
      line.rotation.z = -0.012 * (i + 1);
      doc.add(line);
      disposables.push(material);
      return { material, base: 0.22 - i * 0.08 };
    });

    const sheetGeometry = new THREE.PlaneGeometry(PAGE_W, PAGE_H);
    const sheetFill = new THREE.MeshBasicMaterial({
      color: new THREE.Color(DOC_COLORS[0]),
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const sheetMesh = new THREE.Mesh(sheetGeometry, sheetFill);
    sheetMesh.position.z = -0.01;
    doc.add(sheetMesh);
    disposables.push(sheetGeometry, sheetFill);

    const chromeGeometry = rectsToGeometry([[0, 0, 1, 1], ...CHROME]);
    const chromeMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(DOC_COLORS[0]),
      transparent: true,
      opacity: 0,
    });
    doc.add(new THREE.LineSegments(chromeGeometry, chromeMaterial));
    disposables.push(chromeGeometry, chromeMaterial);

    type Block = {
      group: THREE.Group;
      lines: THREE.LineBasicMaterial;
      frame: THREE.LineBasicMaterial;
      base: THREE.Color;
    };

    const blocks: Block[] = BLOCKS.map((rects, i) => {
      const group = new THREE.Group();
      const base = new THREE.Color(DOC_COLORS[i % DOC_COLORS.length]);

      const lineGeometry = rectsToGeometry(rects);
      const lines = new THREE.LineBasicMaterial({
        color: base.clone(),
        transparent: true,
        opacity: 0,
      });
      group.add(new THREE.LineSegments(lineGeometry, lines));
      disposables.push(lineGeometry, lines);

      const [top, height] = BOUNDS[i];
      const frameGeometry = rectsToGeometry([[M - 0.035, top, CW + 0.07, height]]);
      const frame = new THREE.LineBasicMaterial({
        color: base.clone(),
        transparent: true,
        opacity: 0,
      });
      const frameLines = new THREE.LineSegments(frameGeometry, frame);
      frameLines.position.z = 0.012;
      group.add(frameLines);
      disposables.push(frameGeometry, frame);

      doc.add(group);
      return { group, lines, frame, base };
    });

    const pointer = { x: 0, y: 0 };
    const smoothed = { x: 0, y: 0 };
    const lift = blocks.map(() => 0);
    let progress = 0;
    let smoothProgress = 0;
    let visible = false;
    let entered = 0;
    let raf = 0;
    let last = performance.now();

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
    };

    const readProgress = () => {
      const rect = container.getBoundingClientRect();
      const travel = window.innerHeight + rect.height;
      progress = clamp01((window.innerHeight - rect.top) / Math.max(travel, 1));
    };

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    const highlight = new THREE.Color("#ffffff");
    const tint = new THREE.Color();

    const frame = (now: number) => {
      const delta = Math.min((now - last) / 1000, 0.05);
      last = now;
      entered += delta;
      readProgress();
      smoothProgress += (progress - smoothProgress) * 0.06;

      const activeIndex = activeRef.current;

      const chromeEnter = reduceMotion
        ? 1
        : easeOutExpo(clamp01(entered / 0.9));
      chromeMaterial.opacity = 0.72 * chromeEnter;
      sheetFill.opacity = 0.028 * chromeEnter;
      stackSheets.forEach((sheet) => {
        sheet.material.opacity = sheet.base * chromeEnter;
      });

      blocks.forEach((block, i) => {
        const enter = reduceMotion
          ? 1
          : easeOutExpo(clamp01((entered - 0.45 - i * 0.16) / 1.1));

        const isActive = activeIndex === i;
        const target = isActive ? 1 : 0;
        lift[i] += (target - lift[i]) * (reduceMotion ? 1 : 0.14);
        const pop = lift[i];

        const scan = reduceMotion
          ? 0
          : Math.sin(entered * 0.6 - i * 0.55) ** 8;

        block.group.position.z = pop * 0.3;
        block.group.position.x = pop * 0.06;
        block.group.position.y = (1 - enter) * -0.12;

        tint.copy(block.base).lerp(highlight, pop * 0.45);
        block.lines.color.copy(tint);
        block.frame.color.copy(tint);

        block.lines.opacity = (0.5 + scan * 0.32 + pop * 0.4) * enter;
        block.frame.opacity = pop * 0.55 * enter;
      });

      if (!reduceMotion) {
        smoothed.x += (pointer.x - smoothed.x) * 0.05;
        smoothed.y += (pointer.y - smoothed.y) * 0.05;
        doc.rotation.y =
          -0.5 +
          smoothProgress * 0.5 +
          Math.sin(entered * 0.2) * 0.05 -
          smoothed.x * 0.16;
        doc.rotation.x =
          0.08 + Math.cos(entered * 0.26) * 0.03 + smoothed.y * 0.1;
        doc.position.y = Math.sin(entered * 0.4) * 0.05;
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
        if (visible && !wasVisible) {
          last = performance.now();
          if (reduceMotion) frame(last);
          else raf = requestAnimationFrame(frame);
        }
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    if (!reduceMotion) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    return () => {
      cancelAnimationFrame(raf);
      visible = false;
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      disposables.forEach((item) => item.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={containerRef} className="h-full w-full" aria-hidden="true" />;
}
