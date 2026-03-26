import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

export default function UploadAuth() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (password === "121720030") {
      navigate("/upload");
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <main className="relative h-screen w-full flex items-center justify-center bg-[#1a1a1a]">
      {/* Background - Old Dial Phone feel */}
      <div className="absolute inset-0 opacity-20 grayscale pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1520923642038-b4259ace9439?auto=format&fit=crop&q=80&w=1920" 
          alt="Vintage Phone"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md p-12 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl"
      >
        <h2 className="text-2xl font-bold tracking-widest mb-8 text-center uppercase">身份验证</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest opacity-50">输入访问密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-white/5 border ${error ? 'border-red-500' : 'border-white/20'} p-4 rounded-lg focus:outline-none focus:border-white transition-colors text-center tracking-[1em]`}
              placeholder="•••••••••"
            />
          </div>
          
          <button 
            type="submit"
            className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-opacity-90 transition-opacity"
          >
            进入
          </button>
        </form>

        {error && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-xs text-center mt-4 uppercase tracking-widest"
          >
            密码错误，请重新输入
          </motion.p>
        )}
      </motion.div>
    </main>
  );
}
