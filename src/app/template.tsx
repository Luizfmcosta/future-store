"use client";

import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

/** Route-level enter transition — template remounts on client navigations. */
export default function AppTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="flex min-h-0 min-w-0 flex-1 flex-col"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease }}
    >
      {children}
    </motion.div>
  );
}
