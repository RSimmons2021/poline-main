import { useColors } from "@/context/ColorContext";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";

export default function ColorDictionary() {
  const { setPalette, setActiveColor, savedPalettes, deletePalette } = useColors();

  const presetPalettes = [
    { name: "Sanzo Wada 1", colors: ["#E6C3C3", "#A84D4D", "#5C2828", "#F5E6CC", "#333333"] },
    { name: "Sanzo Wada 2", colors: ["#B8D8D8", "#7A9E9E", "#4F6D6D", "#E0F0F0", "#2C3E50"] },
    { name: "Sanzo Wada 3", colors: ["#E8D595", "#C9A66B", "#8C6D3B", "#FFFFF0", "#4A4A4A"] },
    { name: "Bauhaus Primary", colors: ["#FF0000", "#0000FF", "#FFFF00", "#FFFFFF", "#000000"] },
    { name: "Mondrian Classic", colors: ["#F0F0F0", "#111111", "#AA2222", "#2244AA", "#DDCC33"] },
    { name: "Kandinsky Composition", colors: ["#E63946", "#F1FAEE", "#A8DADC", "#457B9D", "#1D3557"] },
    { name: "Swiss Style", colors: ["#FF3333", "#FFFFFF", "#000000", "#CCCCCC", "#999999"] },
    { name: "Pop Art", colors: ["#FF00CC", "#3300FF", "#CCFF00", "#00FF33", "#000000"] },
  ];

  const handleSelect = (colors: string[]) => {
    setPalette(colors);
    setActiveColor(colors[0]);
  };

  return (
    <div className="w-full min-h-full p-6 pt-24 pb-32">
      
      {/* Saved Palettes Section */}
      {savedPalettes.length > 0 && (
        <div className="mb-12">
          <h2 className="font-syne text-2xl mb-6 ml-2 opacity-80">SAVED COLLECTION</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {savedPalettes.map((palette) => (
                <motion.div 
                  key={palette.id} 
                  className="group cursor-pointer relative"
                  onClick={() => handleSelect(palette.colors)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="aspect-video w-full flex shadow-md border border-black/5 overflow-hidden rounded-sm">
                    {palette.colors.map((c, i) => (
                      <div 
                        key={i} 
                        style={{ backgroundColor: c }} 
                        className="flex-1 h-full transition-all duration-500 group-hover:flex-[1.5]" 
                      />
                    ))}
                  </div>
                  <div className="mt-2 font-space text-sm font-medium flex justify-between items-center">
                    <div className="opacity-80">{palette.name}</div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePalette(palette.id);
                      }}
                      className="p-1 hover:bg-red-100 text-red-500 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="my-12 border-b border-black/5"></div>
        </div>
      )}

      {/* Library Section */}
      <h1 className="font-syne text-4xl mb-8 ml-2">LIBRARY</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {presetPalettes.map((palette, idx) => (
          <motion.div 
            key={idx} 
            className="group cursor-pointer"
            onClick={() => handleSelect(palette.colors)}
            whileHover={{ y: -5 }}
          >
            <div className="aspect-video w-full flex shadow-sm border border-black/5 overflow-hidden rounded-sm">
              {palette.colors.map((c, i) => (
                <div 
                  key={i} 
                  style={{ backgroundColor: c }} 
                  className="flex-1 h-full transition-all duration-500 group-hover:flex-[1.5]" 
                />
              ))}
            </div>
            <div className="mt-2 font-space text-sm font-medium opacity-60 flex justify-between group-hover:opacity-100 transition-opacity">
              <span>{palette.name}</span>
              <span className="text-xs border border-black/10 px-1 rounded">LOAD</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
