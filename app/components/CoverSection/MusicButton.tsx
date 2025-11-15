"use client";

import { motion } from "framer-motion";

export default function MusicButton({ toggle, isPlaying }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="fixed bottom-6 left-6 z-999"
    >
      <button
        onClick={toggle}
        className="w-12 h-12 rounded-full bg-[#d4af37]/80 hover:bg-[#b08b4f] 
                 flex items-center justify-center text-white shadow-lg transition"
      >
        {isPlaying ? "🔊" : "▶️"}
      </button>
    </motion.div>
  );
}
