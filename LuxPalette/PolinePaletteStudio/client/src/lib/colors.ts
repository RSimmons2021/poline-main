import { formatHex, interpolate, samples, wcagContrast, random, formatHsl } from "culori";

export type Color = string;

export function generateRandomColor(): Color {
  return formatHex(random());
}

export function generatePolinePalette(color1: Color, color2: Color, steps: number = 5): Color[] {
  const interpolator = interpolate([color1, color2], 'lch');
  return samples(steps).map(interpolator).map(formatHex);
}

export function getContrastColor(hexColor: string): string {
  // Simple YIQ brightness check for black/white text
  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return yiq >= 128 ? '#000000' : '#FFFFFF';
}
