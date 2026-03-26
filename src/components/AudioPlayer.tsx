import { useState, useRef, ChangeEvent, useEffect } from "react";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.05); // Initial volume at 5%
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set initial volume
    audio.volume = 0.05;

    const attemptPlay = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.log("Autoplay blocked. Waiting for user interaction.");
        
        // Fallback: Play on first user interaction with the document
        const handleFirstInteraction = async () => {
          try {
            await audio.play();
            setIsPlaying(true);
            document.removeEventListener("click", handleFirstInteraction);
            document.removeEventListener("touchstart", handleFirstInteraction);
          } catch (e) {
            console.error("Playback failed even after interaction:", e);
          }
        };

        document.addEventListener("click", handleFirstInteraction);
        document.addEventListener("touchstart", handleFirstInteraction);
      }
    };

    attemptPlay();

    return () => {
      // Cleanup is not strictly necessary for document listeners here but good practice
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-4 bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20">
      <audio
        ref={audioRef}
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" // Slower, more contemplative track
        loop
      />
      
      <button onClick={togglePlay} className="hover:scale-110 transition-transform">
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
      </button>

      <div className="flex items-center gap-2">
        {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-white"
        />
      </div>
    </div>
  );
}
