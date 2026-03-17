"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  body: string;
  icon: LucideIcon;
  tone?: "positive" | "value" | "caution" | "neutral";
};

const toneMap: Record<NonNullable<Props["tone"]>, string> = {
  positive: "border-indigo-200/70 bg-white",
  value: "border-emerald-200/70 bg-white",
  caution: "border-amber-200/70 bg-white",
  neutral: "border-slate-200/70 bg-white"
};

const iconTone: Record<NonNullable<Props["tone"]>, string> = {
  positive: "bg-indigo-50 text-indigo-700 border-indigo-200/70",
  value: "bg-emerald-50 text-emerald-700 border-emerald-200/70",
  caution: "bg-amber-50 text-amber-800 border-amber-200/70",
  neutral: "bg-slate-50 text-slate-700 border-slate-200/70"
};

export function InsightCard({ title, body, icon: Icon, tone = "neutral" }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className={cn("transition-shadow hover:shadow-lift", toneMap[tone])}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-2xl border",
                iconTone[tone]
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900">{title}</p>
              <p className="text-sm text-muted-foreground">{body}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

