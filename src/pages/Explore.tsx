import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

interface Work {
  id: string;
  url: string;
  type: "image" | "video";
  memory: string;
  clicks: number;
}

export default function Explore() {
  const [works, setWorks] = useState<Work[]>([]);
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWorks();
  }, []);

  const fetchWorks = async () => {
    try {
      const response = await fetch("/api/works");
      const data = await response.json();
      setWorks(data);
    } catch (error) {
      console.error("Failed to fetch works:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWorkClick = async (work: Work) => {
    if (work.clicks >= 5) return;

    try {
      const response = await fetch(`/api/works/${work.id}/click`, {
        method: "POST",
      });
      const updatedWork = await response.json();
      
      setWorks(prev => prev.map(w => w.id === updatedWork.id ? updatedWork : w));
      setSelectedWork(updatedWork);
    } catch (error) {
      console.error("Failed to update click:", error);
    }
  };

  const getBlurAmount = (clicks: number) => {
    if (clicks === 0) return "blur(10px)"; // Initial blurred
    if (clicks === 1) return "blur(0px)";  // Clear (100%)
    if (clicks === 2) return "blur(3px)";  // 95% clarity (decreased by 1/20)
    if (clicks === 3) return "blur(7px)";  // 90% clarity (decreased by 2/20)
    if (clicks === 4) return "blur(12px)"; // 85% clarity (decreased by 3/20)
    return "blur(100px)"; // Disappear
  };

  const getOpacity = (clicks: number) => {
    if (clicks >= 5) return 0;
    return 1;
  };

  return (
    <main className="relative min-h-screen w-full pt-24 pb-12 px-6 bg-transparent">
      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-4xl font-bold tracking-[0.3em] mb-16 text-center uppercase">记忆探索</h2>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {works.map((work) => (
              <motion.div
                key={work.id}
                layoutId={work.id}
                onClick={() => handleWorkClick(work)}
                className="relative aspect-square cursor-pointer group overflow-hidden bg-white/5 rounded-lg border border-white/10"
              >
                {work.clicks < 5 ? (
                  <div 
                    className="w-full h-full transition-all duration-700 ease-in-out"
                    style={{ 
                      filter: getBlurAmount(work.clicks),
                      opacity: getOpacity(work.clicks)
                    }}
                  >
                    {work.type === "video" ? (
                      <video src={work.url} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                    ) : (
                      <img src={work.url} className="w-full h-full object-cover" alt="Work" referrerPolicy="no-referrer" />
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-6 bg-white/5 backdrop-blur-sm">
                    <div className="text-center font-serif italic text-sm leading-relaxed opacity-60">
                      <p className="mb-4 text-xs uppercase tracking-widest not-italic opacity-40">记忆信笺</p>
                      {work.memory}
                    </div>
                  </div>
                )}
                
                {/* Click Counter Indicator */}
                {work.clicks < 5 && (
                  <div className="absolute top-4 right-4 text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-40 transition-opacity">
                    重构次数: {work.clicks}/5
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedWork && selectedWork.clicks < 5 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl"
          >
            <button 
              onClick={() => setSelectedWork(null)}
              className="absolute top-8 right-8 text-white hover:opacity-50 transition-opacity"
            >
              <X size={32} />
            </button>

            <motion.div 
              layoutId={selectedWork.id}
              className="max-w-5xl w-full aspect-video md:aspect-auto md:h-[80vh] flex flex-col items-center justify-center"
            >
              <div 
                className="w-full h-full transition-all duration-1000 ease-in-out"
                style={{ filter: getBlurAmount(selectedWork.clicks) }}
              >
                {selectedWork.type === "video" ? (
                  <video src={selectedWork.url} className="w-full h-full object-contain" controls autoPlay />
                ) : (
                  <img src={selectedWork.url} className="w-full h-full object-contain" alt="Work" referrerPolicy="no-referrer" />
                )}
              </div>
              
              <div className="mt-8 text-center space-y-4">
                <p className="text-xs uppercase tracking-[0.4em] opacity-40">
                  {selectedWork.clicks === 1 ? "记忆已重构为最清晰状态" : `记忆正在消散 (${selectedWork.clicks}/5)`}
                </p>
                {selectedWork.clicks === 4 && (
                  <p className="text-red-500/50 text-[10px] uppercase tracking-widest animate-pulse">
                    最后一次观看，记忆即将消失
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
