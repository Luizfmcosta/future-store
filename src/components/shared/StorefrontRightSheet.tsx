"use client";

import { StorefrontOverlayPortal } from "@/components/shared/StorefrontOverlayPortal";
import {
  STOREFRONT_SHEET_PANEL_MAX_SLIDE_PX,
  storefrontSheetBackdropExitTransition,
  storefrontSheetBackdropTransition,
  storefrontSheetPanelExitTransition,
  storefrontSheetPanelTransition,
} from "@/lib/storefrontSheetMotion";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { type ReactNode } from "react";

export type StorefrontRightSheetProps = {
  open: boolean;
  /** Stable key for AnimatePresence (e.g. `"cart"`, `"refine"`). */
  sheetKey: string;
  onDismiss: () => void;
  backdropLabel: string;
  /** Stacking vs other in-frame overlays (portal host is z-[100]). */
  zClass?: string;
  backdropClassName?: string;
  panelClassName?: string;
  children: ReactNode;
  role?: React.AriaRole;
  "aria-modal"?: boolean | "true" | "false";
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  id?: string;
};

const panelSlidePx = STOREFRONT_SHEET_PANEL_MAX_SLIDE_PX;

/**
 * Backdrop + panel are **sibling** `motion` nodes under `AnimatePresence`, not nested in a
 * `motion` shell. Nesting made the panel’s enter animation unreliable for heavier trees (cart).
 */
export function StorefrontRightSheet({
  open,
  sheetKey,
  onDismiss,
  backdropLabel,
  zClass = "z-[60]",
  backdropClassName,
  panelClassName,
  children,
  role,
  "aria-modal": ariaModal,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  id,
}: StorefrontRightSheetProps) {
  return (
    <StorefrontOverlayPortal>
      <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", zClass)}>
        <AnimatePresence>
          {open
            ? [
                <motion.button
                  key={`${sheetKey}-backdrop`}
                  type="button"
                  aria-label={backdropLabel}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: storefrontSheetBackdropExitTransition }}
                  transition={storefrontSheetBackdropTransition}
                  className={cn(
                    "pointer-events-auto absolute inset-0 z-0 bg-black/55 backdrop-blur-md",
                    backdropClassName,
                  )}
                  onClick={onDismiss}
                />,
                <motion.aside
                  key={`${sheetKey}-panel`}
                  layout={false}
                  initial={{ x: panelSlidePx }}
                  animate={{ x: 0 }}
                  exit={{
                    x: panelSlidePx,
                    transition: storefrontSheetPanelExitTransition,
                  }}
                  transition={storefrontSheetPanelTransition}
                  className={cn(
                    "pointer-events-auto absolute right-0 top-0 z-10 flex h-full w-full max-w-md flex-col border-l border-stone-200/90 bg-white/98 text-stone-900 shadow-2xl backdrop-blur-2xl",
                    panelClassName,
                  )}
                >
                  {role ? (
                    <div
                      role={role}
                      aria-modal={ariaModal}
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
                </motion.aside>,
              ]
            : null}
        </AnimatePresence>
      </div>
    </StorefrontOverlayPortal>
  );
}
