import { motion } from "framer-motion";
import { useColors } from "@/context/ColorContext";
import { Download, Save, RefreshCw } from "lucide-react";

export default function GenerativePoster() {
  const { palette, activeColor, generateNewPalette, saveCurrentPalette } = useColors();

  // Deterministic but palette-based styles
  const bg = palette[0];
  const shape1 = palette[1];
  const shape2 = palette[2];
  const shape3 = palette[3] || palette[0];
  const text = palette[4] || "#000000";

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden p-4 md:p-8 relative bg-[#e8dfd0]">
      
      {/* Floating Controls */}
      <div className="absolute top-6 right-6 flex flex-col gap-4 z-50">
        <button onClick={generateNewPalette} className="glass-panel w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/60 transition-colors">
           <RefreshCw size={18} />
        </button>
        <button onClick={() => saveCurrentPalette("Poster Composition")} className="glass-panel w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/60 transition-colors">
           <Save size={18} />
        </button>
        <button className="glass-panel w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/60 transition-colors">
           <Download size={18} />
        </button>
      </div>

      <motion.div 
        layout
        className="relative w-full max-w-md aspect-[3/4] bg-white shadow-2xl p-4 flex flex-col border border-black/5"
      >
        {/* Poster Art */}
        <div 
          className="flex-1 relative overflow-hidden transition-colors duration-700"
          style={{ backgroundColor: bg }}
        >
           {/* Abstract Shapes */}
           <motion.div 
             className="absolute top-[-10%] -left-[10%] w-[60%] h-[60%] rounded-full mix-blend-multiply opacity-90"
             style={{ backgroundColor: shape1 }}
             animate={{ 
                x: [0, 20, 0], 
                y: [0, -10, 0],
                scale: [1, 1.1, 1]
             }}
             transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
           />
           
           {/* Diagonal Line */}
           <motion.div 
             className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-12 -rotate-45 mix-blend-overlay"
             style={{ backgroundColor: shape2 }}
             animate={{ rotate: [-45, -40, -45] }}
             transition={{ duration: 8, repeat: Infinity }}
           />

           <motion.div 
             className="absolute bottom-10 right-10 w-32 h-32 bg-black mix-blend-hard-light"
             style={{ backgroundColor: shape3 }}
             animate={{ 
                rotate: [0, 90, 180, 270, 360],
                borderRadius: ["0%", "50%", "0%"]
             }}
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
           />
           
           {/* Grid Lines (Bauhaus) */}
           <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `linear-gradient(${text} 1px, transparent 1px), linear-gradient(90deg, ${text} 1px, transparent 1px)`, backgroundSize: '20px 20px' }}></div>

        </div>
        
        {/* Poster Typography */}
        <div className="h-24 mt-4 flex flex-col justify-between">
           <h1 
             className="font-syne text-5xl font-bold leading-none uppercase tracking-tighter"
             style={{ color: text }}
           >
             {activeColor}
           </h1>
           <div className="flex justify-between text-xs font-mono text-black/60 border-t border-black/10 pt-2">
             <span>GENERATIVE SERIES</span>
             <span>NO. {Math.floor(Math.random() * 1000)}</span>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
