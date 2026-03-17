import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  description?: string;
  annotation?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function ChartCard({
  title,
  description,
  annotation,
  right,
  children,
  className
}: Props) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="space-y-1">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-base">{title}</CardTitle>
            {description ? <CardDescription>{description}</CardDescription> : null}
          </div>
          {right ? <div className="pt-0.5">{right}</div> : null}
        </div>
        {annotation ? (
          <div className="rounded-2xl border border-border/60 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            {annotation}
          </div>
        ) : null}
      </CardHeader>
      <CardContent className="pb-6">{children}</CardContent>
    </Card>
  );
}

