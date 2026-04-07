"use client";

import { cn } from "@/lib/utils";
import { useCallback, useRef } from "react";

type ResizeEdgeHandleTheme = "rail-light" | "rail-dark" | "window" | "window-light";

export type ResizeEdgeHandleProps = {
  /** Incremental horizontal delta in px (positive widens when handle is on the right edge). */
  onDelta: (dx: number) => void;
  disabled?: boolean;
  theme?: ResizeEdgeHandleTheme;
  className?: string;
};

export function ResizeEdgeHandle({ onDelta, disabled, theme = "rail-dark", className }: ResizeEdgeHandleProps) {
  const onDeltaRef = useRef(onDelta);
  onDeltaRef.current = onDelta;

  const startDrag = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();

      let lastX = e.clientX;

      const onMove = (ev: PointerEvent) => {
        const dx = ev.clientX - lastX;
        lastX = ev.clientX;
        if (dx !== 0) onDeltaRef.current(dx);
      };

      const onEnd = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onEnd);
        window.removeEventListener("pointercancel", onEnd);
        document.body.style.removeProperty("cursor");
        document.body.style.removeProperty("user-select");
      };

      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onEnd);
      window.addEventListener("pointercancel", onEnd);
    },
    [disabled]
  );

  const gripLine =
    theme === "rail-light"
      ? "bg-slate-500/65"
      : theme === "rail-dark"
        ? "bg-white/[0.32]"
        : theme === "window-light"
          ? "bg-stone-400/50"
          : "bg-white/[0.22]";

  const focusRing =
    theme === "rail-light"
      ? "focus-visible:ring-2 focus-visible:ring-slate-400/60 focus-visible:ring-offset-0"
      : theme === "window"
        ? "focus-visible:ring-2 focus-visible:ring-sky-500/45 focus-visible:ring-offset-0"
        : theme === "window-light"
          ? "focus-visible:ring-2 focus-visible:ring-stone-400/45 focus-visible:ring-offset-0"
          : "focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-0";

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Drag to resize width"
      tabIndex={disabled ? -1 : 0}
      onPointerDown={startDrag}
      onKeyDown={(e) => {
        if (disabled) return;
        const step = e.shiftKey ? 16 : 4;
        if (e.key === "ArrowRight") {
          e.preventDefault();
          onDelta(step);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          onDelta(-step);
        }
      }}
      className={cn(
        /* Outside the right edge (left: 100% + slight gap); narrow strip, thin grip */
        "absolute left-full top-1/2 z-30 ml-0.5 flex min-h-10 w-2 -translate-y-1/2 cursor-ew-resize items-center justify-center",
        "touch-none select-none outline-none",
        focusRing,
        disabled && "pointer-events-none invisible",
        className
      )}
    >
      <span className={cn("pointer-events-none h-7 w-px shrink-0 rounded-full", gripLine)} aria-hidden />
    </div>
  );
}
