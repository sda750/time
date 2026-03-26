import { Link, useLocation } from "react-router-dom";
import { motion } from "motion/react";

export default function Navbar() {
  const location = useLocation();
  
  return (
    <nav className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center mix-blend-difference">
      <Link to="/" className="text-xl font-bold tracking-tighter uppercase">
        时间记忆
      </Link>
      <div className="flex gap-8">
        <Link to="/explore" className={`text-sm uppercase tracking-widest hover:opacity-50 transition-opacity ${location.pathname === '/explore' ? 'underline underline-offset-8' : ''}`}>
          记忆探索
        </Link>
        <Link to="/upload-auth" className={`text-sm uppercase tracking-widest hover:opacity-50 transition-opacity ${location.pathname === '/upload-auth' ? 'underline underline-offset-8' : ''}`}>
          记忆上传
        </Link>
      </div>
    </nav>
  );
}
