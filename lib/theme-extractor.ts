export type CommentTheme =
  | "eficiencia"
  | "análisis"
  | "automatización"
  | "documentos"
  | "decisiones"
  | "innovación"
  | "barreras"
  | "comunicación"
  | "procesos";

const themeRules: Array<{
  theme: CommentTheme;
  keywords: string[];
}> = [
  { theme: "eficiencia", keywords: ["eficien", "tiempo", "rápid", "agiliz"] },
  { theme: "análisis", keywords: ["análisis", "sintet", "patron", "hallazg"] },
  { theme: "automatización", keywords: ["automat", "repetit"] },
  { theme: "documentos", keywords: ["document", "informe", "papers", "lectura"] },
  { theme: "decisiones", keywords: ["decisi", "alternativ", "escenar", "prioriz"] },
  { theme: "innovación", keywords: ["innov", "ideas", "propuest", "enfoq"] },
  {
    theme: "barreras",
    keywords: [
      "no se permiten",
      "no me resultó",
      "limitacion",
      "limitaciones",
      "no he visto",
      "no he encontrado",
      "acceso",
      "herramient"
    ]
  },
  { theme: "comunicación", keywords: ["correo", "mensaj", "redacción", "present"] },
  { theme: "procesos", keywords: ["proces", "estandar", "procedim", "entregables"] }
];

export function extractThemes(comment: string): CommentTheme[] {
  const text = normalize(comment);
  const themes = new Set<CommentTheme>();
  for (const rule of themeRules) {
    if (rule.keywords.some((k) => text.includes(normalize(k)))) {
      themes.add(rule.theme);
    }
  }
  return Array.from(themes);
}

export function normalize(input: string) {
  return input
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export function topThemes(
  comments: string[],
  { limit = 7 }: { limit?: number } = {}
) {
  const counts = new Map<CommentTheme, number>();
  for (const c of comments) {
    for (const t of extractThemes(c)) {
      counts.set(t, (counts.get(t) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([theme, count]) => ({ theme, count }));
}

