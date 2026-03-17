export type AgreementLevel =
  | "Totalmente de acuerdo"
  | "De acuerdo"
  | "En desacuerdo"
  | "Totalmente en desacuerdo";

export type ApplicationLevel =
  | "Sí, varias veces"
  | "Sí, al menos una vez"
  | "No, no he encontrado cómo aplicarlo";

export type ActivityType =
  | "Análisis de información"
  | "Generación de ideas o soluciones"
  | "Mejora de procesos"
  | "Toma de decisiones"
  | "Comunicación"
  | "Análisis de información y mejora de procesos";

export type StrategicObjective =
  | "Eficiencia"
  | "Innovación"
  | "Transformación"
  | "Toma de decisiones";

export type SurveyResponse = {
  id: number;
  clarity: AgreementLevel;
  impact: AgreementLevel;
  applied: ApplicationLevel;
  activity: ActivityType;
  strategic_objectives: StrategicObjective[];
  comment: string;
};

