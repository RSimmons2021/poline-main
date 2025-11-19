import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useColors } from "@/context/ColorContext";
import GlassDropdown from "@/components/ui/glass-dropdown";
import { RefreshCw, Shuffle, Save } from "lucide-react";

const WHEEL_STYLES = [
  "Copic Wheel",
  "Poline Wheel",
  "Kandinsky Spiral",
  "Mondrian Block",
  "Bauhaus Grid"
];

export default function GenerativeWheel() {
  const { palette, activeColor, setActiveColor, generateNewPalette, saveCurrentPalette } = useColors();
  const [wheelStyle, setWheelStyle] = useState("Copic Wheel");
  const [rotation, setRotation] = useState(0);

  // Rotate slowly on idle
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(r => r + 0.2);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
       {/* Controls */}
       <div className="absolute top-24 md:top-10 z-50 flex gap-4 items-center">
          <GlassDropdown 
            options={WHEEL_STYLES} 
            selected={wheelStyle} 
            onSelect={setWheelStyle} 
          />
          <button 
            onClick={() => saveCurrentPalette(`${wheelStyle} Exploration`)}
            className="glass-panel p-2 rounded-lg hover:bg-white/40 transition-colors group"
            title="Save Palette"
          >
             <Save size={18} className="opacity-60 group-hover:opacity-100" />
          </button>
          <button 
            onClick={generateNewPalette}
            className="glass-panel p-2 rounded-lg hover:bg-white/40 transition-colors group"
            title="Shuffle Colors"
          >
            <Shuffle size={18} className="group-hover:rotate-180 transition-transform duration-500" />
          </button>
       </div>

       {/* The Wheel */}
       <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] flex items-center justify-center">
         
         <AnimatePresence mode="wait">
           {wheelStyle === "Copic Wheel" && (
             <motion.div 
               key="copic"
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1, rotate: rotation }}
               exit={{ opacity: 0, scale: 0.8 }}
               className="w-full h-full relative"
             >
               <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
                  {palette.map((color, i) => {
                    return null;
                  })}
               </svg>
               {/* HTML implementation of segments for easier click handling */}
               {palette.map((color, i) => (
                 <motion.div
                   key={i}
                   className="absolute inset-0 rounded-full"
                   style={{ 
                     background: `conic-gradient(from ${i * (360 / palette.length)}deg, ${color} 0deg, ${color} ${360 / palette.length}deg, transparent ${360 / palette.length}deg, transparent 360deg)`,
                     maskImage: "radial-gradient(transparent 40%, black 41%)",
                     WebkitMaskImage: "radial-gradient(transparent 40%, black 41%)"
                   }}
                   whileHover={{ scale: 1.05, zIndex: 10 }}
                   onClick={() => setActiveColor(color)}
                 />
               ))}
             </motion.div>
           )}

           {wheelStyle === "Poline Wheel" && (
             <motion.div 
                key="poline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, rotate: -rotation }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex items-center justify-center"
             >
               {/* Abstract Poline representation - flowing lines */}
               <div className="flex gap-2 h-64 items-end">
                 {palette.map((color, i) => (
                   <motion.div
                     key={i}
                     className="w-8 md:w-12 rounded-t-full shadow-lg cursor-pointer border border-white/20"
                     style={{ backgroundColor: color, height: `${40 + Math.random() * 60}%` }}
                     animate={{ height: ["40%", "80%", "40%"] }}
                     transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
                     onClick={() => setActiveColor(color)}
                   />
                 ))}
               </div>
             </motion.div>
           )}

           {wheelStyle === "Kandinsky Spiral" && (
             <motion.div 
               key="kandinsky"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="relative w-full h-full flex items-center justify-center"
             >
               {palette.map((color, i) => (
                 <motion.div
                   key={i}
                   className="absolute rounded-full border border-black/5 shadow-sm cursor-pointer"
                   style={{ 
                     width: `${(palette.length - i) * 15}%`, 
                     height: `${(palette.length - i) * 15}%`,
                     backgroundColor: color,
                     zIndex: i
                   }}
                   animate={{ 
                     x: Math.sin(i) * 20, 
                     y: Math.cos(i) * 20,
                     scale: [1, 1.05, 1]
                   }}
                   transition={{ duration: 5, repeat: Infinity, delay: i * 0.5 }}
                   onClick={() => setActiveColor(color)}
                 />
               ))}
             </motion.div>
           )}

           {(wheelStyle === "Mondrian Block" || wheelStyle === "Bauhaus Grid") && (
             <motion.div 
               key="mondrian"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="w-3/4 h-3/4 bg-white border-4 border-black shadow-2xl grid grid-cols-3 grid-rows-3 gap-1 p-1"
             >
                {/* Simple grid filling with palette */}
                <div className="col-span-2 row-span-2 bg-black" style={{ backgroundColor: palette[0] }} onClick={() => setActiveColor(palette[0])} />
                <div className="col-span-1 row-span-1 bg-black" style={{ backgroundColor: palette[1] }} onClick={() => setActiveColor(palette[1])} />
                <div className="col-span-1 row-span-2 bg-black" style={{ backgroundColor: palette[2] }} onClick={() => setActiveColor(palette[2])} />
                <div className="col-span-2 row-span-1 bg-black" style={{ backgroundColor: palette[3] }} onClick={() => setActiveColor(palette[3])} />
                <div className="col-span-1 row-span-1 bg-black" style={{ backgroundColor: palette[4] || palette[0] }} onClick={() => setActiveColor(palette[4] || palette[0])} />
             </motion.div>
           )}
         </AnimatePresence>
         
         {/* Center Active Color Indicator */}
         <motion.div 
           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-32 md:h-32 rounded-full bg-white shadow-inner flex items-center justify-center border border-black/5 z-20 backdrop-blur-xl bg-opacity-50"
           animate={{ scale: [1, 1.05, 1] }}
           transition={{ duration: 4, repeat: Infinity }}
         >
            <div 
              className="w-12 h-12 md:w-20 md:h-20 rounded-full shadow-lg transition-colors duration-500"
              style={{ backgroundColor: activeColor }}
            />
         </motion.div>

       </div>
    </div>
  );
}
