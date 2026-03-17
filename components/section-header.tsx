import { cn } from "@/lib/utils";

type Props = {
  title: string;
  description?: string;
  right?: React.ReactNode;
  className?: string;
};

export function SectionHeader({ title, description, right, className }: Props) {
  return (
    <div className={cn("flex items-start justify-between gap-6", className)}>
      <div className="space-y-1">
        <h2 className="text-base font-semibold tracking-tight text-slate-900">
          {title}
        </h2>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {right ? <div className="pt-0.5">{right}</div> : null}
    </div>
  );
}

