export type DataHealthMaturityLevel =
  | "Initial"
  | "Developing"
  | "Defined"
  | "Managed"
  | "Optimized";

export type DataHealthMaturityResult = {
  level: DataHealthMaturityLevel;
  levelNumber: number;
  minimumScore: number;
  maximumScore: number;
  description: string;
};

export const DATA_HEALTH_MATURITY_LEVELS: DataHealthMaturityResult[] = [
  {
    level: "Initial",
    levelNumber: 1,
    minimumScore: 0,
    maximumScore: 29.99,
    description:
      "Data practices are largely informal, reactive, or dependent on individuals.",
  },
  {
    level: "Developing",
    levelNumber: 2,
    minimumScore: 30,
    maximumScore: 49.99,
    description:
      "Foundational data practices exist, but adoption and consistency remain limited.",
  },
  {
    level: "Defined",
    levelNumber: 3,
    minimumScore: 50,
    maximumScore: 69.99,
    description:
      "Core data practices are documented and repeatable across important areas.",
  },
  {
    level: "Managed",
    levelNumber: 4,
    minimumScore: 70,
    maximumScore: 89.99,
    description:
      "Data practices are actively governed, measured, monitored, and used to support reliable decisions.",
  },
  {
    level: "Optimized",
    levelNumber: 5,
    minimumScore: 90,
    maximumScore: 100,
    description:
      "Data practices are mature, continuously improved, and positioned to support advanced analytics and AI.",
  },
];

export function getDataHealthMaturity(
  score: number | string | null | undefined,
): DataHealthMaturityResult | null {
  if (
    score === null ||
    score === undefined
  ) {
    return null;
  }

  const numericScore = Number(score);

  if (
    Number.isNaN(numericScore) ||
    numericScore < 0 ||
    numericScore > 100
  ) {
    return null;
  }

  if (numericScore < 30) {
    return DATA_HEALTH_MATURITY_LEVELS[0];
  }

  if (numericScore < 50) {
    return DATA_HEALTH_MATURITY_LEVELS[1];
  }

  if (numericScore < 70) {
    return DATA_HEALTH_MATURITY_LEVELS[2];
  }

  if (numericScore < 90) {
    return DATA_HEALTH_MATURITY_LEVELS[3];
  }

  return DATA_HEALTH_MATURITY_LEVELS[4];
}