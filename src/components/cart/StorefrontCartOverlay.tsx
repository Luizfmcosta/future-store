"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * Cart bottom sheet: panel is `absolute` with `bottom-0` flush to the storefront window frame.
 * The floating prompt stays in {@link FloatingSearchDock} (`z-[85]`) so it never remounts or
 * slides with this overlay. {@link FloatingSearchDock} still hides on PDP chat (own composer).
 *
 * CSS `translateY` (not Framer `y` / clip-path): the panel stays mounted off-screen while closed,
 * so the first open frame is already `translateY(100%)` and the slide cannot pop at rest position.
 * `overflow-clip` (not `hidden`) so focusing the dialog cannot scroll this layer and cancel the slide.
 */
export function StorefrontCartOverlay({
  open,
  onDismiss,
  backdropLabel,
  backdropClassName,
  panelClassName,
  role,
  "aria-modal": ariaModal,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  id,
  children,
}: {
  open: boolean;
  modalKey?: string;
  onDismiss: () => void;
  backdropLabel: string;
  backdropClassName?: string;
  panelClassName?: string;
  role?: React.AriaRole;
  "aria-modal"?: boolean | "true" | "false";
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  id?: string;
  children: ReactNode;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[75] overflow-clip">
      <button
        type="button"
        tabIndex={open ? 0 : -1}
        aria-hidden={!open}
        aria-label={backdropLabel}
        className={cn(
          "absolute inset-0 z-0 bg-black/55 transition-opacity duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:duration-150",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
          backdropClassName,
        )}
        onClick={onDismiss}
      />
      <div
        role="presentation"
        aria-hidden={!open}
        {...(!open ? { inert: true } : {})}
        style={{ transform: open ? "translate3d(0,0,0)" : "translate3d(0,100%,0)" }}
        className={cn(
          "absolute inset-x-[20px] bottom-0 top-[20px] z-[1] flex min-h-0 flex-col overflow-hidden rounded-t-[1.5rem] border-x border-t border-stone-200/60 bg-white/88 text-stone-900 shadow-[0_-12px_48px_-18px_rgba(15,23,42,0.2)] backdrop-blur-xl backdrop-saturate-150 sm:rounded-t-[1.75rem]",
          "transition-transform motion-reduce:transition-none",
          open
            ? "pointer-events-auto duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
            : "pointer-events-none duration-[380ms] ease-[cubic-bezier(0.4,0,1,1)]",
          panelClassName,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {role ? (
          <div
            role={role}
            aria-modal={open ? ariaModal : undefined}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
            id={id}
            className="flex min-h-0 flex-1 flex-col outline-none"
          >
            {children}
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
