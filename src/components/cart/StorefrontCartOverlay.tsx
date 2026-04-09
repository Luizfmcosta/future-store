"use client";

import { FloatingPromptDock } from "@/components/search/FloatingPromptDock";
import {
  storefrontSheetBackdropExitTransition,
  storefrontSheetBackdropTransition,
} from "@/lib/storefrontSheetMotion";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

/** Gentle slide: ease-out into place (no y>1 control points — avoids overshoot “snap”). */
const sheetEnterTransition = {
  type: "tween" as const,
  duration: 0.5,
  ease: [0.32, 0.72, 0, 1] as const,
};
const sheetExitTransition = {
  type: "tween" as const,
  duration: 0.42,
  ease: [0.4, 0, 0.55, 1] as const,
};

/** Slide down on close — viewport-based, not `%` of element height (see storefrontSheetMotion). */
const SHEET_EXIT_Y = "100dvh" as const;

/**
 * Enter: clip from the top so the sheet reveals bottom → top (anchored to the bottom edge).
 * `translateY` on a `top`+`bottom` panel reads like the sheet grows downward; clip-path avoids that.
 */
const sheetEnterClip = {
  initial: { clipPath: "inset(100% 0 0 0)" },
  animate: { clipPath: "inset(0% 0 0 0)" },
} as const;

/**
 * Cart bottom sheet: panel is `absolute` with `bottom-0` flush to the storefront window frame;
 * {@link FloatingPromptDock} is `z-[20]` on the same bottom edge so it stacks above the sheet.
 * {@link FloatingSearchDock} hides its pill while this is open.
 */
export function StorefrontCartOverlay({
  open,
  modalKey,
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
  modalKey: string;
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
    <div className="pointer-events-none absolute inset-0 z-[75] overflow-hidden">
      <AnimatePresence>
        {open
          ? [
              <motion.button
                key={`${modalKey}-backdrop`}
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
              /* Direct child of AnimatePresence so exit slide runs reliably. */
              <motion.div
                key={`${modalKey}-sheet`}
                role="presentation"
                layout={false}
                initial={{ y: 0, ...sheetEnterClip.initial }}
                animate={{ y: 0, ...sheetEnterClip.animate }}
                exit={{ y: SHEET_EXIT_Y, transition: sheetExitTransition }}
                transition={sheetEnterTransition}
                className={cn(
                  "pointer-events-auto absolute inset-x-[20px] bottom-0 top-3 z-[1] flex min-h-0 flex-col overflow-hidden rounded-t-[1.5rem] border-x border-t border-stone-200/60 bg-white/88 text-stone-900 shadow-[0_-12px_48px_-18px_rgba(15,23,42,0.2)] backdrop-blur-xl backdrop-saturate-150 sm:rounded-t-[1.75rem] will-change-transform",
                  panelClassName,
                )}
                onClick={(e) => e.stopPropagation()}
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
              </motion.div>,
              <motion.div
                key={`${modalKey}-prompt`}
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } }}
                className="pointer-events-none absolute inset-x-0 bottom-0 z-[20] px-[20px]"
              >
                <FloatingPromptDock className="px-0 sm:px-0" />
              </motion.div>,
            ]
          : null}
      </AnimatePresence>
    </div>
  );
}
