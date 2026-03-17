"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  BadgeCheck,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  Layers3,
  MessageSquareQuote,
  Repeat2,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
  Users
} from "lucide-react";

import { surveyData } from "@/lib/data";
import {
  buildCommentItems,
  buildInsights,
  buildThemeStrip,
  computeCounts,
  computeKpis,
  computePerceptionVsApplication,
  ORDER_APPLIED,
  pickFeaturedQuotes,
  type Filters
} from "@/lib/analytics";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SectionHeader } from "@/components/section-header";
import { StatCard } from "@/components/stat-card";
import { ChartCard } from "@/components/chart-card";
import { InsightCard } from "@/components/insight-card";
import { RecommendationCard } from "@/components/recommendation-card";
import { CommentCard } from "@/components/comment-card";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.04 }
  }
};

const sectionVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } }
};

function formatPct(v: number) {
  return `${v.toFixed(1)}%`;
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <Card className="border-border/70 bg-white/70">
      <CardContent className="p-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{body}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ChartTooltip({
  active,
  payload,
  label
}: {
  active?: boolean;
  payload?: Array<{ value?: number; name?: string; payload?: any }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl border border-border/70 bg-white px-3 py-2 shadow-soft">
      {label ? <div className="text-xs font-medium text-slate-900">{label}</div> : null}
      <div className="mt-1 space-y-0.5">
        {payload.map((p, idx) => (
          <div key={idx} className="flex items-center justify-between gap-4 text-xs">
            <span className="text-muted-foreground">{p.name ?? "Valor"}</span>
            <span className="font-semibold text-slate-900 tabular-nums">{p.value ?? 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function toneForAgreement(name: string) {
  if (name === "Totalmente de acuerdo") return "#4338ca"; // indigo-700
  if (name === "De acuerdo") return "#0284c7"; // sky-600 (más distinto que indigo)
  if (name === "En desacuerdo") return "#d97706"; // amber-600
  return "#e11d48"; // rose-600
}

function toneForApplied(name: string) {
  if (name === "Sí, varias veces") return "#4338ca"; // indigo-700
  if (name === "Sí, al menos una vez") return "#0284c7"; // sky-600
  return "#e11d48";
}

function toneForObjective(name: string) {
  if (name === "Eficiencia") return "#059669"; // emerald-600
  if (name === "Innovación") return "#4338ca"; // indigo-700
  if (name === "Toma de decisiones") return "#1d4ed8"; // blue-700
  return "#d97706"; // amber-600
}

function toneForActivity(name: string) {
  if (name.includes("Análisis")) return "#4338ca"; // indigo
  if (name.includes("ideas")) return "#0284c7"; // sky
  if (name.includes("procesos")) return "#059669";
  if (name.includes("decisiones")) return "#0f766e"; // teal-700
  if (name.includes("Comunicación")) return "#6d28d9"; // violet-700
  return "#475569"; // slate-600
}

export function Dashboard() {
  const filters: Filters = React.useMemo(
    () => ({
      applied: "Todos",
      activity: "Todos",
      clarity: "Todos",
      impact: "Todos",
      search: ""
    }),
    []
  );

  const filtered = surveyData;
  const kpis = React.useMemo(() => computeKpis(surveyData), []);
  const counts = React.useMemo(() => computeCounts(surveyData), []);
  const cross = React.useMemo(() => computePerceptionVsApplication(surveyData), []);
  const insights = React.useMemo(() => buildInsights(surveyData), []);
  const comments = React.useMemo(() => buildCommentItems(surveyData), []);
  const themeStrip = React.useMemo(() => buildThemeStrip(comments), [comments]);
  const featured = React.useMemo(() => pickFeaturedQuotes(comments), [comments]);

  const adoptionCallout = kpis.total
    ? formatPct(kpis.appliedAtLeastOncePct)
    : "—";
  const positivePerception = kpis.total
    ? `${formatPct(kpis.clarityPositivePct)} claridad positiva · ${formatPct(
        kpis.impactPositivePct
      )} impacto positivo`
    : "—";

  const hasResults = filtered.length > 0;

  return (
    <TooltipProvider delayDuration={150}>
      <div className="min-h-screen">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            <motion.header variants={sectionVariants} className="space-y-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="indigo" className="gap-1">
                      <GraduationCap className="h-3.5 w-3.5" />
                      52 respuestas analizadas
                    </Badge>
                    <Badge variant="slate" className="gap-1">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      Datos consolidados
                    </Badge>
                  </div>
                  <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                    Dashboard de Impacto del Curso de IA 2025
                  </h1>
                  <p className="max-w-3xl text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
                    Resumen ejecutivo de adopción, percepción de valor, aplicación
                    práctica y alineación estratégica a partir de los resultados del
                    curso.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 md:justify-end">
                  <div className="rounded-2xl border border-border/70 bg-white/70 px-4 py-3 shadow-soft backdrop-blur">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
                        <BarChart3 className="h-5 w-5" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-medium text-muted-foreground">
                          Vista actual
                        </p>
                        <p className="text-sm font-semibold text-slate-900">
                          {hasResults ? `${filtered.length} respuesta(s)` : "Sin resultados"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-white/70 px-4 py-3 shadow-soft backdrop-blur">
                    <div className="space-y-0.5">
                      <p className="text-xs font-medium text-muted-foreground">
                        Señal ejecutiva
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        Adopción: {adoptionCallout}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.header>

            <motion.div variants={sectionVariants}>
              <Card className="border-border/70 bg-white/70">
                <CardContent className="p-5">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold text-slate-900">
                        Filtros deshabilitados
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Vista ejecutiva consolidada sobre el total de respuestas.
                      </p>
                    </div>
                    <Badge variant="slate" className="w-fit">
                      Base completa · {surveyData.length} respuestas
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.section variants={sectionVariants} className="space-y-4">
              <SectionHeader
                title="KPIs ejecutivos"
                description="Indicadores recalculados dinámicamente según los filtros."
                right={
                  <Badge variant="slate" className="gap-1">
                    <ClipboardList className="h-3.5 w-3.5" />
                    {positivePerception}
                  </Badge>
                }
              />

              {hasResults ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <StatCard
                    title="Total respuestas"
                    value={kpis.total}
                    microcopy="Base analizada en la vista actual."
                    icon={Users}
                    tone="slate"
                  />
                  <StatCard
                    title="% aplicó al menos una vez"
                    value={kpis.appliedAtLeastOncePct}
                    valueSuffix="%"
                    valueDecimals={1}
                    microcopy={`${kpis.appliedAtLeastOnce}/${kpis.total} participantes.`}
                    icon={CheckCircle2}
                    tone="indigo"
                  />
                  <StatCard
                    title="% aplicó varias veces"
                    value={kpis.appliedSeveralTimesPct}
                    valueSuffix="%"
                    valueDecimals={1}
                    microcopy={`${kpis.appliedSeveralTimes}/${kpis.total} con uso recurrente.`}
                    icon={Repeat2}
                    tone="indigo"
                  />
                  <StatCard
                    title="% percepción positiva de claridad"
                    value={kpis.clarityPositivePct}
                    valueSuffix="%"
                    valueDecimals={1}
                    microcopy={`${kpis.clarityPositive}/${kpis.total} con acuerdo.`}
                    icon={Sparkles}
                    tone="emerald"
                  />
                  <StatCard
                    title="% percepción positiva de impacto"
                    value={kpis.impactPositivePct}
                    valueSuffix="%"
                    valueDecimals={1}
                    microcopy={`${kpis.impactPositive}/${kpis.total} con impacto percibido.`}
                    icon={TrendingUp}
                    tone="emerald"
                  />
                  <StatCard
                    title="Objetivo estratégico más mencionado"
                    value={kpis.topStrategicObjective}
                    microcopy="Dominante en el discurso de valor."
                    icon={Target}
                    tone="emerald"
                  />
                </div>
              ) : (
                <EmptyState
                  title="Sin resultados con los filtros actuales"
                  body="Ajusta los filtros o limpia la búsqueda para recuperar la vista completa."
                />
              )}
            </motion.section>

            <motion.section variants={sectionVariants} className="space-y-4">
              <SectionHeader
                title="Análisis cuantitativo"
                description="Adopción, percepción, tipos de uso y alineación estratégica."
              />

              {hasResults ? (
                <div className="grid gap-4 lg:grid-cols-2">
                  <ChartCard
                    title="Adopción"
                    description="Nivel de aplicación posterior al curso."
                    annotation="La adopción posterior al curso es alta: la gran mayoría reporta haber aplicado lo aprendido al menos una vez."
                    right={
                      <Badge variant="indigo" className="gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {formatPct(kpis.appliedAtLeastOncePct)} al menos una vez
                      </Badge>
                    }
                  >
                    <div className="grid gap-4 md:grid-cols-5 md:items-center">
                      <div className="h-[220px] md:col-span-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <RechartsTooltip content={<ChartTooltip />} />
                            <Pie
                              data={counts.application}
                              dataKey="value"
                              nameKey="name"
                              innerRadius={62}
                              outerRadius={88}
                              paddingAngle={2}
                              stroke="rgba(15, 23, 42, 0.06)"
                            >
                              {counts.application.map((e) => (
                                <Cell key={e.name} fill={toneForApplied(e.name)} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-2 md:col-span-3">
                        {counts.application.map((e) => (
                          <div
                            key={e.name}
                            className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-white/70 px-4 py-3"
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: toneForApplied(e.name) }}
                              />
                              <span className="text-sm font-medium text-slate-900">
                                {e.name}
                              </span>
                            </div>
                            <span className="text-sm font-semibold text-slate-900 tabular-nums">
                              {e.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </ChartCard>

                  <ChartCard
                    title="Percepción del curso"
                    description="Claridad e impacto percibido en el trabajo/decisiones."
                    right={
                      <Badge variant="emerald" className="gap-1">
                        <Sparkles className="h-3.5 w-3.5" />
                        {positivePerception}
                      </Badge>
                    }
                  >
                    <div className="grid gap-4">
                      <div className="rounded-2xl border border-border/60 bg-white/70 p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <p className="text-sm font-semibold text-slate-900">Claridad</p>
                          <p className="text-xs text-muted-foreground">
                            {formatPct(kpis.clarityPositivePct)} positiva
                          </p>
                        </div>
                        <div className="h-[150px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={counts.clarity}
                              layout="vertical"
                              margin={{ left: 8, right: 10, top: 0, bottom: 0 }}
                            >
                              <RechartsTooltip content={<ChartTooltip />} />
                              <XAxis type="number" hide />
                              <YAxis
                                type="category"
                                dataKey="name"
                                width={155}
                                tick={{ fontSize: 12, fill: "#334155" }}
                              />
                              <Bar dataKey="value" radius={[10, 10, 10, 10]}>
                                {counts.clarity.map((e) => (
                                  <Cell key={e.name} fill={toneForAgreement(e.name)} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-border/60 bg-white/70 p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <p className="text-sm font-semibold text-slate-900">Impacto</p>
                          <p className="text-xs text-muted-foreground">
                            {formatPct(kpis.impactPositivePct)} positiva
                          </p>
                        </div>
                        <div className="h-[150px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={counts.impact}
                              layout="vertical"
                              margin={{ left: 8, right: 10, top: 0, bottom: 0 }}
                            >
                              <RechartsTooltip content={<ChartTooltip />} />
                              <XAxis type="number" hide />
                              <YAxis
                                type="category"
                                dataKey="name"
                                width={155}
                                tick={{ fontSize: 12, fill: "#334155" }}
                              />
                              <Bar dataKey="value" radius={[10, 10, 10, 10]}>
                                {counts.impact.map((e) => (
                                  <Cell key={e.name} fill={toneForAgreement(e.name)} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </ChartCard>

                  <ChartCard
                    title="Tipos de uso"
                    description="Actividad principal reportada (ordenado desc.)."
                    annotation="El principal caso de uso es análisis de información, muy por encima de otras aplicaciones."
                  >
                    <div className="h-[320px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[...counts.activity].sort((a, b) => b.value - a.value)}
                          layout="vertical"
                          margin={{ left: 8, right: 10, top: 0, bottom: 0 }}
                        >
                          <RechartsTooltip content={<ChartTooltip />} />
                          <XAxis type="number" hide />
                          <YAxis
                            type="category"
                            dataKey="name"
                            width={210}
                            tick={{ fontSize: 12, fill: "#334155" }}
                          />
                          <Bar dataKey="value" radius={[10, 10, 10, 10]}>
                            {[...counts.activity]
                              .sort((a, b) => b.value - a.value)
                              .map((e) => (
                                <Cell key={e.name} fill={toneForActivity(e.name)} />
                              ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </ChartCard>

                  <ChartCard
                    title="Alineación estratégica"
                    description="Objetivos estratégicos asociados por los participantes."
                    annotation="Eficiencia es la asociación estratégica más fuerte reportada por los participantes."
                  >
                    <div className="h-[320px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[...counts.strategic].sort((a, b) => b.value - a.value)}
                          layout="vertical"
                          margin={{ left: 8, right: 10, top: 0, bottom: 0 }}
                        >
                          <RechartsTooltip content={<ChartTooltip />} />
                          <XAxis type="number" hide />
                          <YAxis
                            type="category"
                            dataKey="name"
                            width={160}
                            tick={{ fontSize: 12, fill: "#334155" }}
                          />
                          <Bar dataKey="value" radius={[10, 10, 10, 10]}>
                            {[...counts.strategic]
                              .sort((a, b) => b.value - a.value)
                              .map((e) => (
                                <Cell key={e.name} fill={toneForObjective(e.name)} />
                              ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </ChartCard>
                </div>
              ) : (
                <EmptyState
                  title="No hay gráficos para mostrar"
                  body="Con cero respuestas filtradas, los gráficos y métricas no se pueden calcular."
                />
              )}
            </motion.section>

            <motion.section variants={sectionVariants} className="space-y-4">
              <SectionHeader
                title="Cruce de percepción vs aplicación"
                description="Matriz derivada: combina nivel de aplicación con cuadrantes de claridad/impacto."
                right={
                  <Badge variant="slate" className="gap-1">
                    <Layers3 className="h-3.5 w-3.5" />
                    Lectura de patrones
                  </Badge>
                }
              />

              {hasResults ? (
                <Card className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="grid gap-4">
                      <div className="rounded-2xl border border-border/60 bg-white/70 px-4 py-3 text-sm text-slate-700">
                        Esta matriz revela combinaciones “contraintuitivas” (por ejemplo, adopción con percepción mixta), ayudando a priorizar habilitación y casos de uso.
                      </div>

                      <div className="overflow-x-auto">
                        <div className="min-w-[720px]">
                          <div className="grid grid-cols-[260px_repeat(4,1fr)] gap-2">
                            <div />
                            {[
                              "Alta claridad + Alto impacto",
                              "Alta claridad + Bajo impacto",
                              "Baja claridad + Alto impacto",
                              "Baja claridad + Bajo impacto"
                            ].map((h) => (
                              <div
                                key={h}
                                className="rounded-2xl border border-border/60 bg-slate-50 px-4 py-3 text-xs font-medium text-slate-700"
                              >
                                {h}
                              </div>
                            ))}

                            {ORDER_APPLIED.map((row) => {
                              const rowCells = cross.filter((c) => c.applied === row);
                              const rowTotal = rowCells.reduce((s, c) => s + c.value, 0);
                              return (
                                <React.Fragment key={row}>
                                  <div className="rounded-2xl border border-border/60 bg-white/70 px-4 py-3">
                                    <div className="flex items-center justify-between gap-3">
                                      <div>
                                        <p className="text-sm font-semibold text-slate-900">
                                          {row}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          {rowTotal} respuesta(s)
                                        </p>
                                      </div>
                                      <Badge
                                        variant={
                                          row === "No, no he encontrado cómo aplicarlo"
                                            ? "rose"
                                            : "indigo"
                                        }
                                      >
                                        {row === "Sí, varias veces"
                                          ? "Uso recurrente"
                                          : row === "Sí, al menos una vez"
                                            ? "Uso inicial"
                                            : "No aplicado"}
                                      </Badge>
                                    </div>
                                  </div>
                                  {rowCells.map((c) => {
                                    const intensity =
                                      rowTotal === 0 ? 0 : Math.min(1, c.value / rowTotal);
                                    const bg =
                                      c.quadrant === "Alta claridad + Alto impacto"
                                        ? "rgba(16, 185, 129, 0.10)"
                                        : c.quadrant === "Alta claridad + Bajo impacto"
                                          ? "rgba(245, 158, 11, 0.10)"
                                          : c.quadrant === "Baja claridad + Alto impacto"
                                            ? "rgba(14, 165, 233, 0.10)"
                                            : "rgba(251, 113, 133, 0.10)";
                                    const border =
                                      c.quadrant === "Alta claridad + Alto impacto"
                                        ? "rgba(16, 185, 129, 0.25)"
                                        : c.quadrant === "Alta claridad + Bajo impacto"
                                          ? "rgba(245, 158, 11, 0.25)"
                                          : c.quadrant === "Baja claridad + Alto impacto"
                                            ? "rgba(14, 165, 233, 0.25)"
                                            : "rgba(251, 113, 133, 0.25)";
                                    return (
                                      <div
                                        key={`${c.applied}-${c.quadrant}`}
                                        className="rounded-2xl border px-4 py-3"
                                        style={{
                                          backgroundColor: bg,
                                          borderColor: border
                                        }}
                                      >
                                        <div className="flex items-baseline justify-between gap-3">
                                          <span className="text-sm font-semibold text-slate-900 tabular-nums">
                                            {c.value}
                                          </span>
                                          <span className="text-xs text-muted-foreground">
                                            {rowTotal === 0 ? "—" : formatPct(intensity * 100)}
                                          </span>
                                        </div>
                                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/70">
                                          <div
                                            className="h-full rounded-full"
                                            style={{
                                              width: `${Math.round(intensity * 100)}%`,
                                              backgroundColor: "rgba(15, 23, 42, 0.22)"
                                            }}
                                          />
                                        </div>
                                      </div>
                                    );
                                  })}
                                </React.Fragment>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="rounded-2xl border border-border/60 bg-white/70 px-4 py-3 text-sm text-slate-700">
                          <span className="font-semibold text-slate-900">Lectura rápida:</span>{" "}
                          incluso en cuadrantes de percepción más baja, puede existir aplicación (señal de necesidad de habilitación y casos de uso guiados).
                        </div>
                        <div className="rounded-2xl border border-border/60 bg-white/70 px-4 py-3 text-sm text-slate-700">
                          <span className="font-semibold text-slate-900">Acción sugerida:</span>{" "}
                          priorizar herramientas, lineamientos y ejemplos por área para convertir uso inicial en uso recurrente.
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <EmptyState
                  title="Sin datos para la matriz"
                  body="Ajusta filtros para reconstruir el cruce de percepción y aplicación."
                />
              )}
            </motion.section>

            <motion.section variants={sectionVariants} className="space-y-4">
              <SectionHeader
                title="Hallazgos clave"
                description="Insights derivados del comportamiento cuantitativo y cualitativo en esta vista."
              />

              {hasResults ? (
                <div className="grid gap-4 lg:grid-cols-2">
                  <InsightCard
                    title={insights[0].title}
                    body={insights[0].body}
                    icon={CheckCircle2}
                    tone={insights[0].tone}
                  />
                  <InsightCard
                    title={insights[1].title}
                    body={insights[1].body}
                    icon={BarChart3}
                    tone={insights[1].tone}
                  />
                  <InsightCard
                    title={insights[2].title}
                    body={insights[2].body}
                    icon={Target}
                    tone={insights[2].tone}
                  />
                  <InsightCard
                    title={insights[3].title}
                    body={insights[3].body}
                    icon={ShieldAlert}
                    tone={insights[3].tone}
                  />
                  <div className="lg:col-span-2">
                    <InsightCard
                      title={insights[4].title}
                      body={insights[4].body}
                      icon={Layers3}
                      tone={insights[4].tone}
                    />
                  </div>
                </div>
              ) : (
                <EmptyState
                  title="No hay hallazgos con los filtros actuales"
                  body="Los insights se calculan sobre la vista filtrada; vuelve a incluir más respuestas."
                />
              )}
            </motion.section>

            <motion.section variants={sectionVariants} className="space-y-4">
              <SectionHeader
                title="Voz de los participantes"
                description="Explorador cualitativo: temas, citas representativas y comentarios."
                right={
                  <Badge variant="slate" className="gap-1">
                    <MessageSquareQuote className="h-3.5 w-3.5" />
                    {comments.length} comentario(s)
                  </Badge>
                }
              />

              {hasResults ? (
                <div className="grid gap-4">
                  <Card className="border-border/70 bg-white/70">
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-slate-900">
                            Temas recurrentes
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Extraídos automáticamente a partir de palabras clave.
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {themeStrip.length ? (
                            themeStrip.map((t) => (
                              <Badge key={t.theme} variant="secondary" className="bg-slate-100 text-slate-700">
                                {t.theme} · {t.count}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="slate">—</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid gap-4 lg:grid-cols-3">
                    {featured.map((c) => (
                      <Card key={c.id} className="overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <p className="text-xs font-medium text-muted-foreground">
                                Cita destacada
                              </p>
                              <p className="text-sm font-semibold text-slate-900">
                                Participante #{c.id}
                              </p>
                            </div>
                            <Badge
                              variant={
                                c.sentiment === "positivo"
                                  ? "emerald"
                                  : c.sentiment === "cautela"
                                    ? "amber"
                                    : "slate"
                              }
                            >
                              {c.sentiment}
                            </Badge>
                          </div>
                          <p className="mt-4 text-sm leading-relaxed text-slate-900">
                            “{c.comment}”
                          </p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <Badge variant="slate">{c.activity}</Badge>
                            {c.themes.slice(0, 3).map((t) => (
                              <Badge key={t} variant="secondary" className="bg-slate-100 text-slate-700">
                                {t}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <ChartCard
                      title="Distribución cualitativa por sentimiento (heurístico)"
                      description="Agrupación ligera para lectura ejecutiva."
                    >
                      <div className="h-[260px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              {
                                name: "Positivo",
                                value: comments.filter((c) => c.sentiment === "positivo").length
                              },
                              {
                                name: "Mixto",
                                value: comments.filter((c) => c.sentiment === "mixto").length
                              },
                              {
                                name: "Cautela",
                                value: comments.filter((c) => c.sentiment === "cautela").length
                              }
                            ]}
                            margin={{ left: 10, right: 10, top: 10, bottom: 0 }}
                          >
                            <RechartsTooltip content={<ChartTooltip />} />
                            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#334155" }} />
                            <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
                            <Bar dataKey="value" radius={[10, 10, 10, 10]}>
                              {["Positivo", "Mixto", "Cautela"].map((k) => (
                                <Cell
                                  key={k}
                                  fill={
                                    k === "Positivo"
                                      ? "#10b981"
                                      : k === "Mixto"
                                        ? "#64748b"
                                        : "#f59e0b"
                                  }
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </ChartCard>

                    <ChartCard
                      title="Comentarios"
                      description="Lista compacta; la búsqueda en la barra de filtros aplica aquí."
                      right={
                        <Badge variant="slate" className="gap-1">
                          <MessageSquareQuote className="h-3.5 w-3.5" />
                          {comments.length}
                        </Badge>
                      }
                    >
                      <div className="grid gap-3">
                        {comments.slice(0, 10).map((c) => (
                          <CommentCard key={c.id} item={c} compact />
                        ))}
                        {comments.length > 10 ? (
                          <div className="rounded-2xl border border-border/60 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                            Mostrando 10 de {comments.length} comentarios. Ajusta filtros/búsqueda para refinar.
                          </div>
                        ) : null}
                      </div>
                    </ChartCard>
                  </div>
                </div>
              ) : (
                <EmptyState
                  title="No hay comentarios para explorar"
                  body="La búsqueda y filtros pueden dejar la vista sin resultados."
                />
              )}
            </motion.section>

            <motion.section variants={sectionVariants} className="space-y-4">
              <SectionHeader
                title="Recomendaciones"
                description="Siguientes pasos de alto impacto para escalar adopción y captura de valor."
              />

              <div className="grid gap-4 md:grid-cols-2">
                <RecommendationCard
                  title="Segmentar futuras formaciones por nivel de madurez"
                  rationale="Acelera el paso de uso inicial a uso recurrente con rutas diferenciadas (fundamentos vs automatización avanzada)."
                  icon={Layers3}
                  tone="indigo"
                />
                <RecommendationCard
                  title="Aterrizar casos de uso por área"
                  rationale="Conecta necesidades específicas con plantillas, prompts y ejemplos para maximizar adopción y consistencia."
                  icon={BarChart3}
                  tone="emerald"
                />
                <RecommendationCard
                  title="Mejorar habilitación de herramientas y lineamientos"
                  rationale="Reduce fricción (acceso, permisos y gobernanza) para escalar el uso de forma segura."
                  icon={ShieldAlert}
                  tone="amber"
                />
                <RecommendationCard
                  title="Medir impacto con casos antes / después"
                  rationale="Cuantifica ahorro de tiempo, calidad de entregables y velocidad de decisión para sostener inversión."
                  icon={TrendingUp}
                  tone="slate"
                />
              </div>
            </motion.section>

            <motion.footer variants={sectionVariants} className="pt-6">
              <div className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-white/70 px-6 py-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-slate-700" />
                  <span>Datos hardcoded a partir de resultados del curso.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-slate-700" />
                  <span>Diseño interactivo para análisis ejecutivo.</span>
                </div>
              </div>
            </motion.footer>
          </motion.div>
        </div>
      </div>
    </TooltipProvider>
  );
}

