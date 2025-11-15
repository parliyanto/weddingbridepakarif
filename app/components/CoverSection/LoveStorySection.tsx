"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function LoveStorySection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="relative bg-[#f4e8d0] text-[#3b2c1a] px-8 md:px-16 py-24 text-center"
    >
      <div className="absolute inset-0 bg-[url('/Asset/loveStory.png')] bg-repeat opacity-5"></div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-3xl md:text-5xl font-script text-[#b08b4f]"
      >
        Kisah Cinta Arief & Asri
      </motion.h2>

      <p className="text-sm text-gray-700 mb-12">
        Perjalanan cinta kami dimulai dari sebuah pertemuan yang tak disangka…
      </p>

      <div className="relative max-w-lg mx-auto bg-[#f9f3e8] border border-[#d6c5a5] rounded-3xl shadow px-6 py-10">
        <div className="w-56 h-72 mx-auto rounded-t-[120px] rounded-b-[20px] overflow-hidden border-[3px] border-[#b08b4f] shadow-lg mb-6">
          <Image
            src="/Asset/loveStory.png"
            alt="Love Story"
            fill
            className="object-cover"
          />
        </div>

        <h3 className="text-[#b08b4f] text-xl font-semibold">
          Pertemuan Pertama
        </h3>
        <p className="text-sm text-[#4a3b2a] mt-2">
          Kami bertemu dari dating apps…
        </p>

        <h3 className="text-[#b08b4f] text-xl font-semibold mt-8">
          Menuju Satu Tujuan
        </h3>
        <p className="text-sm text-[#4a3b2a] mt-2">
          Kami semakin serius lalu mempertemukan orang tua…
        </p>

        <h3 className="text-[#b08b4f] text-xl font-semibold mt-8">
          Janji Setia
        </h3>
        <p className="text-sm text-[#4a3b2a] mt-2">
          Saling belajar, tumbuh, dan akhirnya yakin untuk menikah…
        </p>
      </div>

      <p className="mt-16 text-sm italic text-gray-600">
        “Setiap kisah memiliki waktunya sendiri — dan waktu kami akhirnya tiba.”
      </p>
    </motion.section>
  );
}
