"use client";

import { motion } from "framer-motion";

export default function CoverIntro({
  guestName,
  onOpen,
}: {
  guestName: string;
  onOpen: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="absolute bottom-20 w-full text-center text-white px-6"
    >
      <h4 className="uppercase tracking-widest text-gray-300 text-sm mb-2">
        Unduh Mantu
      </h4>

      <h1 className="font-script text-4xl md:text-6xl mb-4">Arief & Asri</h1>

      <p className="text-sm text-gray-300 mb-5">
        Kepada Yth. Bapak/Ibu/Saudara/i:
      </p>

      <h3 className="text-lg font-semibold mb-1">{guestName}</h3>
      <p className="text-xs text-gray-400 mb-8">
        Mohon maaf jika ada kesalahan penulisan nama dan gelar
      </p>

      <motion.button
        onClick={onOpen}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className="relative group overflow-hidden rounded-full px-8 py-3 font-semibold tracking-wide text-black bg-[#d4af37] shadow-md hover:shadow-gold/40 transition-all duration-700 cursor-pointer"
      >
        <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/60 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-out"></span>

        <div className="relative z-10 flex items-center gap-2">
          <motion.span
            className="text-lg"
            animate={{ y: [0, -3, 0] }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              ease: "easeInOut",
            }}
          >
            💌
          </motion.span>
          <span>Buka Undangan</span>
        </div>
      </motion.button>
    </motion.div>
  );
}
