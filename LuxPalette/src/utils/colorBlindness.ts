import { hslToRgb, rgbToHsl } from './colors';

const protanopiaMatrix = [
  [0.567, 0.433, 0.000],
  [0.558, 0.442, 0.000],
  [0.000, 0.242, 0.758]
];

const deuteranopiaMatrix = [
  [0.625, 0.375, 0.000],
  [0.700, 0.300, 0.000],
  [0.000, 0.300, 0.700]
];

function applyColorMatrix(rgb: [number, number, number], matrix: number[][]): [number, number, number] {
  const [r, g, b] = rgb;
  const newR = r * matrix[0][0] + g * matrix[0][1] + b * matrix[0][2];
  const newG = r * matrix[1][0] + g * matrix[1][1] + b * matrix[1][2];
  const newB = r * matrix[2][0] + g * matrix[2][1] + b * matrix[2][2];
  return [newR, newG, newB];
}

export function toProtanopia(hsl: number[]): number[] {
  const rgb = hslToRgb(hsl[0], hsl[1], hsl[2]);
  const newRgb = applyColorMatrix(rgb, protanopiaMatrix);
  return rgbToHsl(newRgb[0], newRgb[1], newRgb[2]);
}

export function toDeuteranopia(hsl: number[]): number[] {
  const rgb = hslToRgb(hsl[0], hsl[1], hsl[2]);
  const newRgb = applyColorMatrix(rgb, deuteranopiaMatrix);
  return rgbToHsl(newRgb[0], newRgb[1], newRgb[2]);
}
