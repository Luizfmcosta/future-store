import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

/** Reserved frame for product / hero imagery — add URLs in `data/products` or hero when ready */
export function EmptyMediaSlot({ className, variant = "dark" }: Props & { variant?: "dark" | "light" }) {
  return (
    <div
      className={cn(
        variant === "light"
          ? "bg-stone-100 ring-1 ring-inset ring-stone-200/80"
          : "bg-white/[0.02] ring-1 ring-inset ring-white/[0.06]",
        className
      )}
      aria-hidden
    />
  );
}
