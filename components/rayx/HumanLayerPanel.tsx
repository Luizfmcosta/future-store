"use client";

export function HumanLayerPanel() {
  const items = [
    "Personalized hero and continue journey",
    "Comparison support on results",
    "Curated merchandising strips",
    "Proof signals matched to profile",
    "Contextual bundles in cart",
  ];
  return (
    <ul className="space-y-2 text-[13px] text-[#c5ccdf]">
      {items.map((t) => (
        <li key={t} className="flex gap-2">
          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/45" />
          {t}
        </li>
      ))}
    </ul>
  );
}
