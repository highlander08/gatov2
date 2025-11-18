// types.ts
export const COLORS = ['blue', 'red', 'green', 'yellow'] as const;

export type Color = typeof COLORS[number];

export enum AppState {
  PRE_SIMULATION,
  SUPERPOSITION,
  REVEALING,
  DECAYED,
}

export enum CatState {
  SUPERPOSITION,
  ALIVE,
  DEAD,
}