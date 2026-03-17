"use client";

import { motion } from "framer-motion";
import { MessageSquareText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { CommentItem } from "@/lib/analytics";

type Props = {
  item: CommentItem;
  compact?: boolean;
  className?: string;
};

const sentimentTone: Record<CommentItem["sentiment"], string> = {
  positivo: "border-emerald-200/70 bg-white",
  mixto: "border-slate-200/70 bg-white",
  cautela: "border-amber-200/70 bg-white"
};

export function CommentCard({ item, compact, className }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      <Card className={cn("transition-shadow hover:shadow-soft", sentimentTone[item.sentiment])}>
        <CardContent className={cn("p-5", compact && "p-4")}>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-50 text-slate-700">
              <MessageSquareText className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1 space-y-3">
              <p className={cn("text-sm text-slate-900", compact && "line-clamp-3")}>
                {item.comment}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="slate">{item.applied}</Badge>
                <Badge
                  variant={
                    item.sentiment === "positivo"
                      ? "emerald"
                      : item.sentiment === "cautela"
                        ? "amber"
                        : "default"
                  }
                >
                  {item.sentiment === "positivo"
                    ? "Percepción positiva"
                    : item.sentiment === "cautela"
                      ? "Señales de fricción"
                      : "Mixto"}
                </Badge>
                {item.themes.slice(0, 4).map((t) => (
                  <Badge key={t} variant="secondary" className="bg-slate-100 text-slate-700">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

