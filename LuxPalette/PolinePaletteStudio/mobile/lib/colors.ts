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

export function getContrastTextColor(hsl: number[]): string {
    const [h, s, l] = hsl;
    // Simple logic: if lightness is high, return black, else white
    // Adjust threshold as needed
    return l > 0.5 ? '#000000' : '#FFFFFF';
}

export function hslToRgb(h: number, s: number, l: number): number[] {
    let r, g, b;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
