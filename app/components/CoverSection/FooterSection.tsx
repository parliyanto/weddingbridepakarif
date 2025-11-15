"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function FooterSection() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="relative h-screen flex flex-col justify-center items-center text-center"
    >
      <Image
        src="/Asset/footer.png"
        alt="Footer"
        fill
        className="object-cover brightness-50"
      />

      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent"></div>

      <div className="z-10 px-6 max-w-2xl text-white">
        <p className="text-sm md:text-base leading-relaxed mb-6">
          Menjadi kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir…
        </p>

        <h2 className="font-script text-5xl text-[#f5dcb2]">Arief & Asri</h2>
      </div>
    </motion.section>
  );
}
