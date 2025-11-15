"use client";

import { motion } from "framer-motion";

export default function AyatSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="relative bg-[#e9d7b8] text-[#3b2c1a] px-8 py-20 text-center"
    >
      <h3 className="uppercase tracking-widest mb-3 text-lg font-semibold">
        Q.S. Ar-Rum : 21
      </h3>

      <p className="italic mb-6 text-sm md:text-base">
        "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu
        istri-istri dari jenismu sendiri…"
      </p>

      <div className="border-t border-[#3b2c1a]/50 w-24 mx-auto mb-6"></div>

      <p className="text-2xl md:text-3xl mb-8 text-[#3b2c1a] leading-relaxed">
        وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا
        إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً
      </p>

      <p className="text-sm md:text-base leading-relaxed">
        Dengan memohon rahmat dan ridha Allah Subhanahu Wa Ta’ala, kami bermaksud
        mengundang Bapak/Ibu/Saudara/i untuk berkenan menghadiri acara pernikahan kami.
      </p>
    </motion.section>
  );
}
