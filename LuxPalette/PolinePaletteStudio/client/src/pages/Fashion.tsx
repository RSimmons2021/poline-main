import { motion } from "framer-motion";
import { useColors } from "@/context/ColorContext";
import { Shirt, RefreshCw, Share2, Save } from "lucide-react";
import GlassDropdown from "@/components/ui/glass-dropdown";
import { useState } from "react";
import { getColorName } from "@/lib/colorNames";

const FASHION_STYLES = [
  "Streetwear",
  "Formal / Business",
  "Avant Garde",
  "Casual Chic",
  "Techwear"
];

const SEASONS = [
  "Spring / Summer",
  "Autumn / Winter",
  "Resort",
  "Pre-Fall"
];

export default function Fashion() {
  const { palette, activeColor, generateNewPalette, saveCurrentPalette } = useColors();
  const [style, setStyle] = useState("Streetwear");
  const [season, setSeason] = useState("Spring / Summer");

  return (
    <div className="h-full w-full relative flex flex-col items-center bg-[#f5f0e8]">
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute -right-20 top-20 w-96 h-96 rounded-full blur-3xl opacity-30"
            style={{ backgroundColor: palette[0] }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute -left-20 bottom-20 w-96 h-96 rounded-full blur-3xl opacity-30"
            style={{ backgroundColor: palette[2] }}
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
       </div>

       <div className="w-full max-w-5xl p-6 pt-24 flex justify-between items-end z-10">
          <div>
            <h1 className="font-syne text-5xl md:text-7xl font-bold tracking-tighter opacity-90">ATELIER</h1>
            <div className="flex gap-4 mt-4">
               <GlassDropdown options={FASHION_STYLES} selected={style} onSelect={setStyle} />
               <GlassDropdown options={SEASONS} selected={season} onSelect={setSeason} />
            </div>
          </div>
          
          <div className="flex gap-2">
             <button onClick={() => saveCurrentPalette(`${style} Fashion`)} className="glass-panel p-3 rounded-full hover:bg-white/50 transition-colors group" title="Save Palette">
                <Save size={20} className="opacity-60 group-hover:opacity-100" />
             </button>
             <button onClick={generateNewPalette} className="glass-panel p-3 rounded-full hover:bg-white/50 transition-colors">
                <RefreshCw size={20} />
             </button>
          </div>
       </div>

       <div className="w-full max-w-6xl flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 p-6 z-10 overflow-y-auto">
          
          <motion.div 
            className="md:col-span-5 bg-white shadow-xl p-2 pb-12 relative group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-full h-full bg-gray-100 relative overflow-hidden">
               <div className="absolute inset-0 flex flex-col">
                  <div className="flex-1 bg-neutral-100" style={{ backgroundColor: palette[0] }}></div>
                  <div className="h-1/3 flex">
                     <div className="flex-1" style={{ backgroundColor: palette[1] }}></div>
                     <div className="flex-1" style={{ backgroundColor: palette[2] }}></div>
                  </div>
               </div>
               
               <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 text-xs font-mono uppercase tracking-widest">
                 Primary Look
               </div>
            </div>
          </motion.div>

          <div className="md:col-span-7 grid grid-cols-2 gap-6 content-start">
             
             <div className="col-span-2 glass-panel p-6 rounded-xl">
                <h3 className="font-space text-sm uppercase tracking-widest opacity-60 mb-4">Color Story</h3>
                <div className="flex h-24 w-full rounded-lg overflow-hidden shadow-sm">
                  {palette.map((c, i) => (
                    <motion.div 
                      key={i} 
                      className="flex-1 h-full relative group cursor-pointer" 
                      style={{ backgroundColor: c }}
                      whileHover={{ flex: 2 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="absolute bottom-2 left-2 bg-white/80 backdrop-blur px-1.5 py-0.5 text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity rounded whitespace-nowrap">
                        {getColorName(c)}
                      </div>
                    </motion.div>
                  ))}
                </div>
             </div>

             <div className="col-span-1 aspect-square bg-white shadow-lg p-2 relative">
                <div 
                  className="w-full h-full"
                  style={{ 
                    backgroundColor: palette[3] || palette[1],
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.05' fill-rule='evenodd'%3E%3Cpath d='M0 20L20 0H40L20 40H0zM20 40L40 20V40zM0 20H20V0z'/%3E%3C/g%3E%3C/svg%3E")`
                  }}
                ></div>
                <div className="absolute bottom-2 right-2 font-syne text-4xl font-bold text-white mix-blend-difference opacity-50">
                   01
                </div>
             </div>

             <div className="col-span-1 aspect-square bg-white shadow-lg p-2 relative">
                <div 
                  className="w-full h-full"
                  style={{ 
                    backgroundColor: palette[4] || palette[0],
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.05' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")`
                  }}
                ></div>
                <div className="absolute bottom-2 right-2 font-syne text-4xl font-bold text-white mix-blend-difference opacity-50">
                   02
                </div>
             </div>

             <div className="col-span-2 mt-4">
                <p className="font-serif text-2xl leading-relaxed italic opacity-80">
                  "Combine {getColorName(palette[0])} accents with a structured {getColorName(palette[2])} base for a modern {style.toLowerCase()} silhouette."
                </p>
             </div>

          </div>

       </div>
    </div>
  );
}
