"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function BrideGroomSection() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative z-10 bg-linear-to-b from-[#f8f4ec] to-[#f2e5c9] text-[#3b2c1a] px-6 md:px-16 py-24 overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/Asset/pattern-floral.png')] bg-repeat opacity-5"></div>

      <div className="relative flex flex-col items-center justify-center gap-16 md:gap-24">
        {/* Groom */}
        <motion.div
          initial={{ opacity: 0, y: -60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center text-center max-w-[350px]"
        >
          <div className="relative w-56 h-80 md:w-72 md:h-[400px] rounded-3xl overflow-hidden shadow-lg border-4 border-[#d6c5a5]">
            <Image
              src="/Asset/ariefgroom.png"
              alt="Groom"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent"></div>
          </div>

          <h2 className="text-2xl font-bold mt-4">Arief Rachman Nugraha, S.T.</h2>
          <p className="text-sm text-gray-700">
            Anak laki-laki dari <br />
            <span className="italic text-[#6b533b]">
              Madih, S.Sos & Suminar, S.Pd
            </span>
          </p>
        </motion.div>

        {/* Bride */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center text-center max-w-[350px]"
        >
          <div className="relative w-56 h-80 md:w-72 md:h-[400px] rounded-3xl overflow-hidden shadow-lg border-4 border-[#d6c5a5]">
            <Image
              src="/Asset/AsriBride.png"
              alt="Bride"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent"></div>
          </div>

          <h2 className="text-2xl font-bold mt-4">Asri Cikita Putri, S.Ds.</h2>
          <p className="text-sm text-gray-700">
            Anak perempuan dari <br />
            <span className="italic text-[#6b533b]">
              Drs. Agus Milad Jamal & Drg. Rita Febriyanti
            </span>
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}
