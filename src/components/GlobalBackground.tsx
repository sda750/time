import { motion } from "motion/react";
import { useLocation } from "react-router-dom";

export default function GlobalBackground() {
  const location = useLocation();
  const isExplore = location.pathname === "/explore";
  const isHome = location.pathname === "/";

  // Only show the special transition background for Home and Explore
  const showSpecialBg = isHome || isExplore;

  if (!showSpecialBg) {
    return (
      <div className="fixed inset-0 z-0 bg-[#050505] pointer-events-none" />
    );
  }

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-black">
      {/* Deep Space Stars Layer */}
      <div className="absolute inset-0 opacity-60">
        <img
          src="https://images.unsplash.com/photo-1464802686167-b939a67e06a1?auto=format&fit=crop&q=80&w=1920"
          className="w-full h-full object-cover"
          alt="Stars"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Magnificent Planets & Earth Layer */}
      <motion.div
        initial={false}
        animate={{
          scale: isExplore ? 2.8 : 1,
          x: isExplore ? "-18%" : "0%",
          y: isExplore ? "-8%" : "0%",
          rotate: isExplore ? -2 : 0,
        }}
        transition={{
          duration: 3,
          ease: [0.22, 1, 0.36, 1], // Cinematic smooth ease
        }}
        className="absolute inset-0 w-full h-full"
      >
        <img
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2560"
          alt="Magnificent Space"
          className="w-full h-full object-cover brightness-90 contrast-110"
          referrerPolicy="no-referrer"
        />
      </motion.div>

      {/* Floating Nebula Overlay for Depth */}
      <motion.div
        animate={{
          opacity: isExplore ? 0.4 : 0.2,
          scale: isExplore ? 1.2 : 1,
        }}
        transition={{ duration: 4 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(60,20,100,0.3)_0%,transparent_60%)]"
      />

      {/* Dark Overlays for readability */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${isExplore ? 'bg-black/50' : 'bg-black/30'}`} />
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />

      {/* Subtle Grain for Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}
