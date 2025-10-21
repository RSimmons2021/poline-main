export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return [255 * f(0), 255 * f(8), 255 * f(4)];
}

export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    r /= 255, g /= 255, b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h * 360, s, l];
}

function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function getContrastRatio(color1: [number, number, number], color2: [number, number, number]): number {
  const lum1 = getLuminance(color1[0], color1[1], color1[2]);
  const lum2 = getLuminance(color2[0], color2[1], color2[2]);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

export function mixHslColors(color1: number[], color2: number[], ratio: number): number[] {
  const h = color1[0] * (1 - ratio) + color2[0] * ratio;
  const s = color1[1] * (1 - ratio) + color2[1] * ratio;
  const l = color1[2] * (1 - ratio) + color2[2] * ratio;
  return [h, s, l];
}

export function getMaterialSuggestion(hsl: number[]): string {
  const lightness = hsl[2];
  if (lightness < 0.2) {
    return 'Dark Wood, Slate';
  } else if (lightness < 0.5) {
    return 'Concrete, Leather';
  } else if (lightness < 0.8) {
    return 'Light Wood, Fabric';
  } else {
    return 'Marble, Linen';
  }
}