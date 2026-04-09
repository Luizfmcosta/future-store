"use client";

import { FloatingPromptDock } from "@/components/search/FloatingPromptDock";
import {
  storefrontSheetBackdropExitTransition,
  storefrontSheetBackdropTransition,
} from "@/lib/storefrontSheetMotion";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

const panelTransition = { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const };
const panelExitTransition = { duration: 0.22, ease: [0.4, 0, 1, 1] as const };

const MODAL_TO_PROMPT_GAP_PX = 32;

/**
 * Cart modal + floating prompt in one `z-[75]` stacking context (same z-index layer; 32px gap in layout).
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
  children: ReactNode;
  role?: React.AriaRole;
  "aria-modal"?: boolean | "true" | "false";
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  id?: string;
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
              <motion.div
                key={`${modalKey}-stack`}
                role="presentation"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: storefrontSheetBackdropExitTransition }}
                transition={storefrontSheetBackdropTransition}
                className="pointer-events-none absolute inset-0 z-10 flex min-h-0 flex-col overflow-hidden"
              >
                <div className="flex min-h-0 min-w-0 flex-1 flex-col px-4 sm:px-6">
                  <div
                    className="flex min-h-0 flex-1 flex-col items-center justify-end overflow-y-auto overflow-x-hidden"
                    style={{ paddingTop: MODAL_TO_PROMPT_GAP_PX }}
                  >
                    <motion.div
                      layout={false}
                      initial={{ opacity: 0, scale: 0.96, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98, y: 6, transition: panelExitTransition }}
                      transition={panelTransition}
                      style={{ marginBottom: MODAL_TO_PROMPT_GAP_PX }}
                      className={cn(
                        "pointer-events-auto flex max-h-full min-h-0 w-full max-w-md flex-col overflow-hidden rounded-2xl border border-stone-200/60 bg-white/86 text-stone-900 shadow-[0_12px_40px_rgba(15,23,42,0.1)] backdrop-blur-md backdrop-saturate-150 md:w-[80vw] md:max-w-[720px]",
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
                    </motion.div>
                  </div>
                </div>
                <div className="pointer-events-none relative z-10 shrink-0">
                  <FloatingPromptDock />
                </div>
              </motion.div>,
            ]
          : null}
      </AnimatePresence>
    </div>
  );
}
