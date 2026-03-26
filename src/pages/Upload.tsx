import { useState, useRef, ChangeEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { Upload as UploadIcon, CheckCircle2 } from "lucide-react";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [memory, setMemory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !memory) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("memory", memory);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setIsSuccess(true);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  if (isSuccess) {
    return (
      <main className="h-screen w-full flex flex-col items-center justify-center bg-black">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-8"
        >
          <CheckCircle2 size={80} className="mx-auto text-green-500" />
          <h2 className="text-3xl font-bold tracking-widest uppercase">上传成功</h2>
          <div className="flex gap-6 justify-center">
            <Link to="/" className="px-8 py-3 border border-white hover:bg-white hover:text-black transition-all uppercase text-xs tracking-widest">
              返回首页
            </Link>
            <button onClick={() => { setIsSuccess(false); setFile(null); setPreview(null); setMemory(""); }} className="px-8 py-3 bg-white text-black hover:bg-transparent hover:text-white border border-white transition-all uppercase text-xs tracking-widest">
              继续上传
            </button>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen w-full pt-24 pb-12 px-6 bg-[#0a0a0a]">
      {/* Film Background Effect */}
      <div className="fixed inset-0 opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full border-x-[40px] border-dashed border-white/20" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <h2 className="text-3xl font-bold tracking-[0.2em] mb-12 text-center uppercase">上传记忆作品</h2>
        
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left: Upload Area */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="aspect-[3/4] border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-white/50 transition-colors group relative overflow-hidden"
          >
            {preview ? (
              file?.type.startsWith("video") ? (
                <video src={preview} className="w-full h-full object-cover" autoPlay muted loop />
              ) : (
                <img src={preview} className="w-full h-full object-cover" alt="Preview" referrerPolicy="no-referrer" />
              )
            ) : (
              <>
                <UploadIcon size={48} className="mb-4 opacity-30 group-hover:opacity-100 transition-opacity" />
                <p className="text-xs uppercase tracking-widest opacity-50">点击或拖拽上传照片/视频</p>
              </>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*,video/*"
            />
          </div>

          {/* Right: Memory Text */}
          <div className="flex flex-col gap-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest opacity-50">作品记忆</label>
              <textarea
                value={memory}
                onChange={(e) => setMemory(e.target.value)}
                rows={10}
                className="w-full bg-white/5 border border-white/20 p-6 rounded-xl focus:outline-none focus:border-white transition-colors resize-none font-serif italic text-lg leading-relaxed"
                placeholder="写下关于这个作品的记忆..."
              />
            </div>

            <button
              onClick={handleUpload}
              disabled={!file || !memory || isUploading}
              className="w-full py-5 bg-white text-black font-bold uppercase tracking-[0.3em] hover:bg-opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              {isUploading ? "正在上传..." : "确认上传"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
