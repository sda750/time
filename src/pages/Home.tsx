import { motion } from "motion/react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      <div className="relative z-10 text-center px-6">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-6xl md:text-9xl font-bold tracking-tighter mb-4 uppercase"
        >
          时间记忆
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-lg md:text-2xl font-light tracking-widest opacity-80 mb-12 italic"
        >
          “记忆不是被保存的，而是不断被重构的”
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="flex flex-col md:flex-row gap-6 justify-center items-center"
        >
          <Link 
            to="/explore"
            className="px-12 py-4 border border-white hover:bg-white hover:text-black transition-all duration-500 tracking-widest uppercase text-sm"
          >
            记忆探索
          </Link>
          <Link 
            to="/upload-auth"
            className="px-12 py-4 bg-white text-black hover:bg-transparent hover:text-white border border-white transition-all duration-500 tracking-widest uppercase text-sm"
          >
            记忆上传
          </Link>
        </motion.div>
      </div>

      {/* Retro Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
    </main>
  );
}
