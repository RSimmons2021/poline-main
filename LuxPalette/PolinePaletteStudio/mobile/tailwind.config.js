/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all of your component files.
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                background: "hsl(38 30% 94%)",
                foreground: "hsl(0 0% 10%)",
                card: "hsl(38 30% 96%)",
                "card-foreground": "hsl(0 0% 10%)",
                popover: "hsl(38 30% 96% / 0.8)",
                "popover-foreground": "hsl(0 0% 10%)",
                primary: "hsl(0 0% 10%)",
                "primary-foreground": "hsl(38 30% 94%)",
                secondary: "hsl(38 10% 85%)",
                "secondary-foreground": "hsl(0 0% 10%)",
                muted: "hsl(38 10% 90%)",
                "muted-foreground": "hsl(0 0% 40%)",
                accent: "hsl(0 0% 10% / 0.05)",
                "accent-foreground": "hsl(0 0% 10%)",
                destructive: "hsl(0 84% 60%)",
                "destructive-foreground": "hsl(0 0% 98%)",
                border: "hsl(0 0% 10% / 0.1)",
                input: "hsl(0 0% 10% / 0.1)",
                ring: "hsl(0 0% 10% / 0.2)",
            },
            fontFamily: {
                syne: ["Syne_400Regular", "sans-serif"],
                space: ["SpaceGrotesk_400Regular", "sans-serif"],
                serif: ["DMSerifDisplay_400Regular", "serif"],
                sans: ["Inter_400Regular", "sans-serif"],
            },
        },
    },
    plugins: [],
}
