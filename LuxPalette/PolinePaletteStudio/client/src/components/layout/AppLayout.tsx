import { Link, useLocation } from "wouter";
import { Disc, Palette, LayoutTemplate, BookOpen, Shirt } from "lucide-react";
import { motion } from "framer-motion";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const tabs = [
    { name: "Explore", path: "/", icon: Disc },
    { name: "Painting", path: "/painting", icon: Palette },
    { name: "Fashion", path: "/fashion", icon: Shirt },
    { name: "Interior", path: "/interior", icon: LayoutTemplate },
    { name: "Library", path: "/library", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-black selection:text-white overflow-hidden flex flex-col">
      <main className="flex-1 relative overflow-hidden">
        {children}
      </main>

      {/* Floating Glass Dock */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="glass-panel rounded-full px-6 py-3 flex items-center gap-8 shadow-2xl shadow-black/5">
          {tabs.map((tab) => {
            const isActive = location === tab.path;
            return (
              <Link key={tab.name} href={tab.path}>
                <div className="relative group cursor-pointer flex flex-col items-center gap-1">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2 rounded-full transition-colors duration-300 ${
                      isActive ? "text-black bg-black/5" : "text-black/40 hover:text-black/70"
                    }`}
                  >
                    <tab.icon size={24} strokeWidth={1.5} />
                  </motion.div>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-1 w-1 h-1 bg-black rounded-full"
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
