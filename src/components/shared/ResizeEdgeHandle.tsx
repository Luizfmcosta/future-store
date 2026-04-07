"use client";

import { cn } from "@/lib/utils";
import { useCallback, useRef } from "react";

type ResizeEdgeHandleTheme = "rail-light" | "rail-dark" | "window" | "window-light";

export type ResizeEdgeHandleProps = {
  /** Incremental horizontal delta in px (positive = pointer moved right). */
  onDelta: (dx: number) => void;
  disabled?: boolean;
  theme?: ResizeEdgeHandleTheme;
  className?: string;
  /** Accessible name (e.g. i18n). */
  ariaLabel?: string;
  /** Which side of the frame; left edge inverts delta so drag widens/narrows correctly. */
  edge?: "left" | "right";
  /** Hide the grip lines; keep an invisible drag strip. */
  visual?: "grip" | "none";
};

export function ResizeEdgeHandle({
  onDelta,
  disabled,
  theme = "rail-dark",
  className,
  ariaLabel = "Drag to resize width",
  edge = "right",
  visual = "grip",
}: ResizeEdgeHandleProps) {
  const onDeltaRef = useRef(onDelta);
  onDeltaRef.current = onDelta;

  const startDrag = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();

      const el = e.currentTarget;
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        /* older browsers */
      }

      let lastX = e.clientX;

      const onMove = (ev: PointerEvent) => {
        const raw = ev.clientX - lastX;
        lastX = ev.clientX;
        const dx = edge === "left" ? -raw : raw;
        if (dx !== 0) onDeltaRef.current(dx);
      };

      const onEnd = (ev: PointerEvent) => {
        try {
          el.releasePointerCapture(ev.pointerId);
        } catch {
          /* noop */
        }
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
    [disabled, edge],
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

  const edgePosition =
    edge === "right"
      ? "left-full ml-0"
      : "right-full mr-0";

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={ariaLabel}
      tabIndex={disabled ? -1 : 0}
      onPointerDown={startDrag}
      onKeyDown={(e) => {
        if (disabled) return;
        const step = e.shiftKey ? 32 : 8;
        const signed = edge === "left" ? -step : step;
        if (e.key === "ArrowRight") {
          e.preventDefault();
          onDelta(signed);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          onDelta(-signed);
        }
      }}
      className={cn(
        "absolute top-1/2 z-30 flex min-h-32 w-4 -translate-y-1/2 cursor-ew-resize items-center justify-center",
        edgePosition,
        visual === "none" && "w-5 bg-transparent",
        "touch-none select-none outline-none",
        focusRing,
        disabled && "pointer-events-none invisible",
        className
      )}
    >
      {visual === "grip" ? (
        <span
          className="pointer-events-none flex h-9 w-2 shrink-0 flex-col items-center justify-center gap-1"
          aria-hidden
        >
          <span className={cn("h-1.5 w-px rounded-full", gripLine)} />
          <span className={cn("h-1.5 w-px rounded-full", gripLine)} />
          <span className={cn("h-1.5 w-px rounded-full", gripLine)} />
        </span>
      ) : null}
    </div>
  );
}
