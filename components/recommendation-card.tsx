"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  rationale: string;
  icon: LucideIcon;
  tone?: "indigo" | "emerald" | "amber" | "slate";
};

const toneBg: Record<NonNullable<Props["tone"]>, string> = {
  indigo: "bg-indigo-50/70 border-indigo-200/70",
  emerald: "bg-emerald-50/70 border-emerald-200/70",
  amber: "bg-amber-50/70 border-amber-200/70",
  slate: "bg-slate-50/70 border-slate-200/70"
};

export function RecommendationCard({
  title,
  rationale,
  icon: Icon,
  tone = "slate"
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
    >
      <Card className={cn("overflow-hidden transition-shadow hover:shadow-lift", toneBg[tone])}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70">
              <Icon className="h-5 w-5 text-slate-900" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900">{title}</p>
              <p className="text-sm text-slate-700/80">{rationale}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

