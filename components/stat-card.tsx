"use client";

import * as React from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AnimatedCounter } from "@/components/animated-counter";

type Props = {
  title: string;
  value: number | string;
  valueSuffix?: string;
  valueDecimals?: number;
  microcopy: string;
  icon: LucideIcon;
  tone?: "indigo" | "emerald" | "amber" | "rose" | "slate";
};

const toneStyles: Record<NonNullable<Props["tone"]>, string> = {
  indigo: "bg-indigo-50 text-indigo-700 border-indigo-200/70",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200/70",
  amber: "bg-amber-50 text-amber-800 border-amber-200/70",
  rose: "bg-rose-50 text-rose-700 border-rose-200/70",
  slate: "bg-slate-50 text-slate-700 border-slate-200/70"
};

export function StatCard({
  title,
  value,
  valueSuffix,
  valueDecimals,
  microcopy,
  icon: Icon,
  tone = "slate"
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
    >
      <Card className="transition-shadow hover:shadow-lift">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-slate-900">{title}</p>
              <div className="text-3xl font-semibold tracking-tight text-slate-900">
                {typeof value === "number" ? (
                  <AnimatedCounter
                    value={value}
                    decimals={valueDecimals}
                    suffix={valueSuffix}
                    className="tabular-nums"
                  />
                ) : (
                  <span className="leading-none">{value}</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{microcopy}</p>
            </div>
            <div
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-2xl border",
                toneStyles[tone]
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

