// constants.ts
import { Color, COLORS } from './types';

export { COLORS }; // Re-export para manter compatibilidade

export const COLOR_MAP: Record<string, Color> = {
  '1': 'blue',
  '2': 'red',
  '3': 'green',
  '4': 'yellow',
};

export const KEY_MAP: Record<string, string> = {
  '1': '1', 'Numpad1': '1',
  '2': '2', 'Numpad2': '2',
  '3': '3', 'Numpad3': '3',
  '4': '4', 'Numpad4': '4',
};

export const COLOR_STYLES: Record<Color, string> = {
  green: 'bg-green-600/80 border-2 border-green-400/20',
  red: 'bg-red-600/80 border-2 border-red-400/20',
  yellow: 'bg-yellow-500/80 border-2 border-yellow-300/20',
  blue: 'bg-blue-600/80 border-2 border-blue-400/20',
};

export const ACTIVE_COLOR_STYLES: Record<Color, string> = {
  green: 'bg-green-400 scale-105 shadow-[0_0_30px_8px] shadow-green-400/70 border-2 border-green-300',
  red: 'bg-red-400 scale-105 shadow-[0_0_30px_8px] shadow-red-400/70 border-2 border-red-300',
  yellow: 'bg-yellow-300 scale-105 shadow-[0_0_30px_8px] shadow-yellow-300/70 border-2 border-yellow-200',
  blue: 'bg-blue-400 scale-105 shadow-[0_0_30px_8px] shadow-blue-400/70 border-2 border-blue-300',
};

export const SEQUENCE_INTERVAL = 1000;
export const HIGHLIGHT_DURATION = 600;
export const TOTAL_TIME = 30000; // 30 seconds