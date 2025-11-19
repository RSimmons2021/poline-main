import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface GlassDropdownProps {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}

export default function GlassDropdown({ options, selected, onSelect }: GlassDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-panel px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-space hover:bg-white/40 transition-colors"
      >
        {selected}
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown size={14} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full mt-2 left-0 w-48 glass-panel rounded-lg overflow-hidden shadow-xl flex flex-col py-1"
          >
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onSelect(option);
                  setIsOpen(false);
                }}
                className={`px-4 py-2 text-left text-sm font-space hover:bg-black/5 transition-colors ${
                  selected === option ? "font-bold bg-black/5" : ""
                }`}
              >
                {option}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
