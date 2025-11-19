import { useColors } from "@/context/ColorContext";
import { motion, AnimatePresence } from "framer-motion";
import GlassDropdown from "@/components/ui/glass-dropdown";
import { RefreshCw, Save } from "lucide-react";
import { useState } from "react";
import { getColorName } from "@/lib/colorNames";
import { getContrastColor } from "@/lib/colors";

const INTERIOR_STYLES = [
  "Japandi",
  "Mid-Century Modern",
  "Industrial Loft",
  "Bohemian",
  "Minimalist",
  "Art Deco"
];

export default function GenerativeHarmonies() {
  const { palette, generateNewPalette, saveCurrentPalette } = useColors();
  const [style, setStyle] = useState("Japandi");

  const gradientBackground = `
    radial-gradient(circle at 20% 20%, ${palette[0]}40 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, ${palette[1]}40 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, ${palette[2]}20 0%, transparent 60%),
    linear-gradient(135deg, ${palette[0]}10 0%, ${palette[4]}10 100%)
  `;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden transition-all duration-1000 bg-white">
       
       <motion.div 
         className="absolute inset-0 w-full h-full"
         initial={false}
         animate={{ background: gradientBackground }}
         transition={{ duration: 1.5 }}
       />

       <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}></div>

       <div className="absolute top-6 md:top-12 z-50 flex gap-4 items-center w-full max-w-2xl px-6 justify-between">
          <div className="flex items-center gap-4">
             <h1 className="font-syne text-2xl font-bold hidden md:block">INTERIOR</h1>
             <div className="h-6 w-[1px] bg-black/10 hidden md:block"></div>
             <GlassDropdown options={INTERIOR_STYLES} selected={style} onSelect={setStyle} />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => saveCurrentPalette(`${style} Interior`)}
              className="glass-panel p-2 rounded-lg hover:bg-white/40 transition-colors group"
              title="Save Palette"
            >
              <Save size={18} className="opacity-60 group-hover:opacity-100" />
            </button>
            <button 
              onClick={generateNewPalette}
              className="glass-panel p-2 rounded-lg hover:bg-white/40 transition-colors group"
              title="Generate New"
            >
              <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
            </button>
          </div>
       </div>

       <motion.div 
         layout
         className="relative z-10 w-full max-w-md mx-6 shadow-2xl rounded-sm overflow-hidden backdrop-blur-xl bg-white/30 border border-white/40"
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5 }}
       >
          <div className="p-4 border-b border-white/20 flex justify-between items-center bg-white/10">
             <div className="font-mono text-xs uppercase tracking-widest opacity-60">Whole House Palette</div>
             <div className="font-syne text-sm font-bold">{style}</div>
          </div>

          <div className="flex flex-col">
             {palette.map((color, i) => {
               const textColor = getContrastColor(color);
               return (
                 <motion.div 
                   key={i}
                   className="h-20 w-full flex items-center justify-between px-6 group cursor-pointer transition-colors relative overflow-hidden"
                   style={{ backgroundColor: color }}
                   whileHover={{ scale: 1.02, zIndex: 10 }}
                 >
                    <div 
                      className="relative z-10 font-space text-sm font-medium px-2 py-1 rounded flex flex-col"
                      style={{ color: textColor }}
                    >
                       <span>{getColorName(color)}</span>
                       <span className="opacity-50 text-xs uppercase">{color}</span>
                    </div>
                    
                    <div 
                      className="relative z-10 text-xs font-serif italic px-2 py-1 rounded hidden md:block opacity-80"
                      style={{ color: textColor }}
                    >
                      {i === 0 && "Primary Wall Color"}
                      {i === 1 && "Secondary / Trim"}
                      {i === 2 && "Furniture / Upholstery"}
                      {i === 3 && "Textiles / Curtains"}
                      {i >= 4 && "Accent Pieces"}
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
                 </motion.div>
               );
             })}
          </div>

          <div className="p-4 bg-white/80 flex justify-between items-center">
             <div className="text-[10px] opacity-40 font-mono">
               GENERATED {new Date().toLocaleDateString()}
             </div>
             <div className="flex gap-1">
               {palette.map((c, i) => (
                 <div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }}></div>
               ))}
             </div>
          </div>
       </motion.div>

    </div>
  );
}
