declare module 'culori' {
    export function formatHex(color: any): string;
    export function interpolate(colors: any[], mode?: string): (t: number) => any;
    export function samples(count: number): number[];
    export function wcagContrast(color1: any, color2: any): number;
    export function random(): any;
    export function formatHsl(color: any): string;
}
