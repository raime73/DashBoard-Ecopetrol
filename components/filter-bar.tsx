"use client";

import * as React from "react";
import { FilterX, Search } from "lucide-react";

import type { Filters } from "@/lib/analytics";
import { ORDER_APPLIED, ORDER_AGREEMENT } from "@/lib/analytics";
import type { ActivityType, AgreementLevel, ApplicationLevel } from "@/types/survey";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

type Props = {
  value: Filters;
  activities: ActivityType[];
  onChange: (next: Filters) => void;
  onReset: () => void;
};

function toSelectValue(v: string | undefined) {
  return v ?? "Todos";
}

export function FilterBar({ value, activities, onChange, onReset }: Props) {
  const appliedOptions: Array<ApplicationLevel | "Todos"> = ["Todos", ...ORDER_APPLIED];
  const agreementOptions: Array<AgreementLevel | "Todos"> = ["Todos", ...ORDER_AGREEMENT];
  const activityOptions: Array<ActivityType | "Todos"> = ["Todos", ...activities];

  return (
    <div className="sticky top-0 z-40 -mx-4 border-b border-border/60 bg-background/80 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/65">
      <div className="mx-auto max-w-6xl">
        <Card className="rounded-2xl border-border/60 bg-white/70 shadow-soft backdrop-blur">
          <div className="grid gap-3 p-4 md:grid-cols-12 md:items-end">
            <div className="md:col-span-3">
              <Label>Nivel de aplicación</Label>
              <Select
                value={toSelectValue(value.applied)}
                onValueChange={(v) =>
                  onChange({ ...value, applied: v as ApplicationLevel | "Todos" })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  {appliedOptions.map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-3">
              <Label>Actividad principal</Label>
              <Select
                value={toSelectValue(value.activity)}
                onValueChange={(v) =>
                  onChange({ ...value, activity: v as ActivityType | "Todos" })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  {activityOptions.map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label>Acuerdo en claridad</Label>
              <Select
                value={toSelectValue(value.clarity)}
                onValueChange={(v) =>
                  onChange({ ...value, clarity: v as AgreementLevel | "Todos" })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  {agreementOptions.map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label>Acuerdo en impacto</Label>
              <Select
                value={toSelectValue(value.impact)}
                onValueChange={(v) =>
                  onChange({ ...value, impact: v as AgreementLevel | "Todos" })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  {agreementOptions.map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label>Buscar en comentarios</Label>
              <div className="relative mt-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Palabra clave…"
                  value={value.search ?? ""}
                  onChange={(e) => onChange({ ...value, search: e.target.value })}
                />
              </div>
            </div>

            <div className="md:col-span-12 md:flex md:justify-end">
              <Button variant="outline" onClick={onReset} className="w-full md:w-auto">
                <FilterX className="h-4 w-4" />
                Limpiar filtros
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

