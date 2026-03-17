import type {
  ActivityType,
  AgreementLevel,
  ApplicationLevel,
  StrategicObjective,
  SurveyResponse
} from "@/types/survey";
import { extractThemes, normalize, topThemes, type CommentTheme } from "@/lib/theme-extractor";

export type Filters = {
  applied?: ApplicationLevel | "Todos";
  activity?: ActivityType | "Todos";
  clarity?: AgreementLevel | "Todos";
  impact?: AgreementLevel | "Todos";
  search?: string;
};

export const ORDER_APPLIED: ApplicationLevel[] = [
  "Sí, varias veces",
  "Sí, al menos una vez",
  "No, no he encontrado cómo aplicarlo"
];

export const ORDER_AGREEMENT: AgreementLevel[] = [
  "Totalmente de acuerdo",
  "De acuerdo",
  "En desacuerdo",
  "Totalmente en desacuerdo"
];

export function applyFilters(data: SurveyResponse[], filters: Filters) {
  const q = normalize(filters.search ?? "");
  return data.filter((r) => {
    if (filters.applied && filters.applied !== "Todos" && r.applied !== filters.applied)
      return false;
    if (filters.activity && filters.activity !== "Todos" && r.activity !== filters.activity)
      return false;
    if (filters.clarity && filters.clarity !== "Todos" && r.clarity !== filters.clarity)
      return false;
    if (filters.impact && filters.impact !== "Todos" && r.impact !== filters.impact)
      return false;
    if (q && !normalize(r.comment).includes(q)) return false;
    return true;
  });
}

export function countBy<T extends string>(
  values: T[],
  order?: T[]
): Array<{ name: T; value: number }> {
  const map = new Map<T, number>();
  for (const v of values) map.set(v, (map.get(v) ?? 0) + 1);
  const entries = Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  if (!order) return entries.sort((a, b) => b.value - a.value);
  const rank = new Map(order.map((k, i) => [k, i]));
  return entries.sort((a, b) => (rank.get(a.name) ?? 999) - (rank.get(b.name) ?? 999));
}

export function countStrategicObjectives(data: SurveyResponse[]) {
  const values: StrategicObjective[] = data.flatMap((r) => r.strategic_objectives);
  return countBy(values);
}

export function pct(part: number, total: number) {
  if (total <= 0) return 0;
  return (part / total) * 100;
}

export function isPositive(level: AgreementLevel) {
  return level === "Totalmente de acuerdo" || level === "De acuerdo";
}

export function topItem<T extends string>(counts: Array<{ name: T; value: number }>) {
  const sorted = [...counts].sort((a, b) => b.value - a.value);
  return sorted[0]?.name;
}

export type KpiMetrics = {
  total: number;
  appliedAtLeastOnce: number;
  appliedAtLeastOncePct: number;
  appliedSeveralTimes: number;
  appliedSeveralTimesPct: number;
  clarityPositive: number;
  clarityPositivePct: number;
  impactPositive: number;
  impactPositivePct: number;
  topStrategicObjective: StrategicObjective | "—";
};

export function computeKpis(filtered: SurveyResponse[]): KpiMetrics {
  const total = filtered.length;
  const appliedAtLeastOnce = filtered.filter((r) => r.applied !== "No, no he encontrado cómo aplicarlo").length;
  const appliedSeveralTimes = filtered.filter((r) => r.applied === "Sí, varias veces").length;
  const clarityPositive = filtered.filter((r) => isPositive(r.clarity)).length;
  const impactPositive = filtered.filter((r) => isPositive(r.impact)).length;
  const topStrategicObjective = topItem(countStrategicObjectives(filtered)) ?? "—";

  return {
    total,
    appliedAtLeastOnce,
    appliedAtLeastOncePct: pct(appliedAtLeastOnce, total),
    appliedSeveralTimes,
    appliedSeveralTimesPct: pct(appliedSeveralTimes, total),
    clarityPositive,
    clarityPositivePct: pct(clarityPositive, total),
    impactPositive,
    impactPositivePct: pct(impactPositive, total),
    topStrategicObjective
  };
}

export function computeCounts(filtered: SurveyResponse[]) {
  const application = countBy(filtered.map((r) => r.applied), ORDER_APPLIED);
  const clarity = countBy(filtered.map((r) => r.clarity), ORDER_AGREEMENT);
  const impact = countBy(filtered.map((r) => r.impact), ORDER_AGREEMENT);
  const activity = countBy(filtered.map((r) => r.activity));
  const strategic = countStrategicObjectives(filtered);
  return { application, clarity, impact, activity, strategic };
}

export type CrossCell = {
  applied: ApplicationLevel;
  quadrant: "Alta claridad + Alto impacto" | "Alta claridad + Bajo impacto" | "Baja claridad + Alto impacto" | "Baja claridad + Bajo impacto";
  value: number;
};

export function computePerceptionVsApplication(filtered: SurveyResponse[]): CrossCell[] {
  const cells: CrossCell[] = [];
  const byApplied = new Map<ApplicationLevel, SurveyResponse[]>();
  for (const r of filtered) {
    const arr = byApplied.get(r.applied) ?? [];
    arr.push(r);
    byApplied.set(r.applied, arr);
  }

  const quadrants: CrossCell["quadrant"][] = [
    "Alta claridad + Alto impacto",
    "Alta claridad + Bajo impacto",
    "Baja claridad + Alto impacto",
    "Baja claridad + Bajo impacto"
  ];

  for (const applied of ORDER_APPLIED) {
    const rows = byApplied.get(applied) ?? [];
    const qCounts = new Map<CrossCell["quadrant"], number>();
    for (const q of quadrants) qCounts.set(q, 0);
    for (const r of rows) {
      const cPos = isPositive(r.clarity);
      const iPos = isPositive(r.impact);
      const quadrant: CrossCell["quadrant"] =
        cPos && iPos
          ? "Alta claridad + Alto impacto"
          : cPos && !iPos
            ? "Alta claridad + Bajo impacto"
            : !cPos && iPos
              ? "Baja claridad + Alto impacto"
              : "Baja claridad + Bajo impacto";
      qCounts.set(quadrant, (qCounts.get(quadrant) ?? 0) + 1);
    }
    for (const quadrant of quadrants) {
      cells.push({ applied, quadrant, value: qCounts.get(quadrant) ?? 0 });
    }
  }
  return cells;
}

export type Insight = {
  key: string;
  title: string;
  body: string;
  tone: "positive" | "value" | "caution" | "neutral";
};

export function buildInsights(filtered: SurveyResponse[]): Insight[] {
  const kpi = computeKpis(filtered);
  const counts = computeCounts(filtered);
  const topActivity = topItem(counts.activity) ?? "—";
  const barrierMentions = filtered.filter((r) => extractThemes(r.comment).includes("barreras")).length;
  const maturityMix = countBy(filtered.map((r) => r.applied), ORDER_APPLIED);
  const maturitySummary =
    maturityMix.length > 0
      ? maturityMix
          .map((x) => `${x.name === "Sí, varias veces" ? "uso recurrente" : x.name === "Sí, al menos una vez" ? "uso inicial" : "sin aplicación"}: ${x.value}`)
          .join(" · ")
      : "—";

  return [
    {
      key: "adopcion",
      title: "La adopción real es muy alta",
      body:
        kpi.total === 0
          ? "No hay datos con los filtros actuales."
          : `${kpi.appliedAtLeastOncePct.toFixed(1)}% reporta haber aplicado lo aprendido al menos una vez (${kpi.appliedAtLeastOnce}/${kpi.total}).`,
      tone: "positive"
    },
    {
      key: "uso",
      title: "El principal caso de uso es análisis de información",
      body:
        kpi.total === 0
          ? "No hay datos con los filtros actuales."
          : `El uso más frecuente reportado es “${topActivity}”, marcando dónde se captura valor inmediato.`,
      tone: "value"
    },
    {
      key: "estrategia",
      title: "Eficiencia domina como valor estratégico",
      body:
        kpi.topStrategicObjective === "—"
          ? "No hay suficientes menciones con los filtros actuales."
          : `El objetivo más mencionado es “${kpi.topStrategicObjective}”, reforzando el foco en productividad y velocidad de decisión.`,
      tone: "value"
    },
    {
      key: "barreras",
      title: "Existen barreras de habilitación y acceso a herramientas",
      body:
        kpi.total === 0
          ? "No hay datos con los filtros actuales."
          : barrierMentions === 0
            ? "En esta vista filtrada no aparecen señales relevantes de fricción o acceso."
            : `${barrierMentions} comentario(s) reflejan fricción (acceso, permisos o lineamientos), una palanca clara de mejora para escalar adopción.`,
      tone: "caution"
    },
    {
      key: "madurez",
      title: "Hay distintos niveles de madurez de uso",
      body:
        kpi.total === 0
          ? "No hay datos con los filtros actuales."
          : `La distribución sugiere madurez heterogénea: ${maturitySummary}.`,
      tone: "neutral"
    }
  ];
}

export type CommentItem = {
  id: number;
  comment: string;
  applied: ApplicationLevel;
  clarity: AgreementLevel;
  impact: AgreementLevel;
  activity: ActivityType;
  themes: CommentTheme[];
  sentiment: "positivo" | "mixto" | "cautela";
};

export function buildCommentItems(filtered: SurveyResponse[]): CommentItem[] {
  return filtered
    .map((r) => {
      const themes = extractThemes(r.comment);
      const pos = isPositive(r.clarity) && isPositive(r.impact);
      const caution = themes.includes("barreras") || (!isPositive(r.impact) && r.applied !== "No, no he encontrado cómo aplicarlo");
      const sentiment: CommentItem["sentiment"] = pos ? "positivo" : caution ? "cautela" : "mixto";
      return {
        id: r.id,
        comment: r.comment,
        applied: r.applied,
        clarity: r.clarity,
        impact: r.impact,
        activity: r.activity,
        themes,
        sentiment
      };
    })
    .sort((a, b) => b.id - a.id);
}

export function pickFeaturedQuotes(items: CommentItem[]) {
  if (items.length === 0) return [];
  const scored = items.map((it) => {
    const len = it.comment.length;
    const themeBoost = it.themes.length * 12;
    const cautionBoost = it.sentiment === "cautela" ? 10 : 0;
    const positiveBoost = it.sentiment === "positivo" ? 6 : 0;
    const lengthScore = Math.max(0, Math.min(30, (len - 60) / 8));
    const score = themeBoost + cautionBoost + positiveBoost + lengthScore;
    return { it, score };
  });

  const picks: CommentItem[] = [];
  const usedThemes = new Set<CommentTheme>();
  for (const { it } of scored.sort((a, b) => b.score - a.score)) {
    const overlap = it.themes.some((t) => usedThemes.has(t));
    if (picks.length < 3 && (!overlap || picks.length === 0)) {
      picks.push(it);
      it.themes.forEach((t) => usedThemes.add(t));
    }
    if (picks.length >= 3) break;
  }
  return picks;
}

export function buildThemeStrip(items: CommentItem[]) {
  const comments = items.map((i) => i.comment);
  return topThemes(comments, { limit: 7 });
}

