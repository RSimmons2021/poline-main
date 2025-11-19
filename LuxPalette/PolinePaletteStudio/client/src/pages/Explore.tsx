import { motion } from "framer-motion";
import GenerativeWheel from "@/components/generative/GenerativeWheel";

export default function Explore() {
  return (
    <div className="h-full w-full relative flex flex-col items-center justify-center">
      {/* Geometric Lines Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg width="100%" height="100%">
          <line x1="50%" y1="0" x2="50%" y2="100%" stroke="currentColor" strokeWidth="1" />
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="currentColor" strokeWidth="1" />
          <circle cx="50%" cy="50%" r="30%" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="z-10 w-full h-full flex items-center justify-center">
        <GenerativeWheel />
      </div>
      
      <div className="absolute top-12 font-syne text-4xl font-bold tracking-tighter opacity-80">
        EXPLORE
      </div>
    </div>
  );
}
