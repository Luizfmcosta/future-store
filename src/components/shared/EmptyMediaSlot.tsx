import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

/** Reserved frame for product / hero imagery — add URLs in `data/products` or hero when ready */
export function EmptyMediaSlot({ className }: Props) {
  return (
    <div
      className={cn(
        "bg-white/[0.02] ring-1 ring-inset ring-white/[0.06]",
        className
      )}
      aria-hidden
    />
  );
}
