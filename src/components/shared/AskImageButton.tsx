"use client";

import { focusStorefrontPromptInput } from "@/lib/promptProductRefs";
import { useT } from "@/lib/useT";
import { cn } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import { MousePointer2 } from "lucide-react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type ProductAskFloatingButtonProps = {
  productLabel: string;
  productId?: string;
  /** Position + z-index; default includes hover visibility tied to `group/ask-img` */
  className?: string;
  /** When true, the control stays visible (no hover fade on desktop). */
  alwaysVisible?: boolean;
};

/**
 * Floating “Ask” pill — adds {@link PromptProductRef} and focuses the storefront prompt.
 * Used inside {@link AskImageButton} and standalone on layered heroes (above gradients).
 */
export function ProductAskFloatingButton({
  productLabel,
  productId,
  className,
  alwaysVisible = false,
}: ProductAskFloatingButtonProps) {
  const t = useT();
  const pathname = usePathname();
  const addRef = useDemoStore((s) => s.addPromptProductRef);

  const onAsk = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!productLabel.trim()) return;
    addRef({ productId, label: productLabel.trim() });
    if (pathname?.startsWith("/product/")) {
      window.setTimeout(() => focusStorefrontPromptInput(), 0);
    } else {
      focusStorefrontPromptInput();
    }
  };

  return (
    <button
      type="button"
      onClick={onAsk}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-full border border-stone-200/90 bg-white px-3",
        "text-[12px] font-medium text-stone-800 shadow-[0_4px_14px_rgba(15,23,42,0.12)]",
        "transition hover:bg-stone-50",
        alwaysVisible
          ? "opacity-100"
          : cn(
              "max-md:opacity-100",
              "md:opacity-0 md:transition-opacity md:duration-200 md:group-hover/ask-img:opacity-100",
              "md:group-focus-within/ask-img:opacity-100",
            ),
        className,
      )}
    >
      <MousePointer2 className="size-[15px] text-stone-600" strokeWidth={2} aria-hidden />
      {t("common.askProduct")}
    </button>
  );
}

type AskImageButtonProps = {
  /** Localized product title shown in the prompt chip */
  productLabel: string;
  productId?: string;
  children: ReactNode;
  className?: string;
};

/**
 * Wraps a product image region: on hover, shows a floating “Ask” control that
 * adds the product name as a prompt chip (see {@link PromptContextBadges}).
 */
export function AskImageButton({ productLabel, productId, children, className }: AskImageButtonProps) {
  return (
    <div className={cn("group/ask-img relative", className)}>
      {children}
      <ProductAskFloatingButton
        productLabel={productLabel}
        productId={productId}
        className="absolute bottom-2 right-2 z-10 sm:bottom-2.5 sm:right-2.5"
      />
    </div>
  );
}
