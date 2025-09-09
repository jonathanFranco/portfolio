"use client";

import { initScenes } from "@/lib/scenes";
import { type CSSProperties, type ReactNode, useEffect } from "react";

interface SceneProps {
  children: ReactNode;
  length: number;
  backdrop?: string;

}

export function Scene({ children, length, backdrop }: SceneProps) {
  const style = { "--len": length } as CSSProperties;

  return (
    <div data-scene="" style={style}>
      <div className="scene-pin">
        <div className="scene-body">{children}</div>
        {backdrop && (
          <span aria-hidden="true" className="scene-backdrop">
            {backdrop}
          </span>
        )}
      </div>
    </div>
  );
}

export function SceneController() {
  useEffect(() => initScenes(), []);
  return null;
}
