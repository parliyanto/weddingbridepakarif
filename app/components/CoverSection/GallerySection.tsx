"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const IMAGES = Array.from({ length: 9 }).map(
  (_, i) => `/Asset/gallery${i + 1}.png`
);

export default function GallerySection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="relative bg-[#f6f0e6] text-[#3b2c1a] px-8 md:px-16 py-24"
    >
      <h2 className="text-3xl md:text-5xl font-script text-[#b08b4f] mb-10 text-center">
        Galeri Kami
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {IMAGES.map((src, i) => (
          <div
            key={i}
            className="relative w-full h-48 md:h-72 rounded-2xl overflow-hidden shadow"
          >
            <Image
              src={src}
              alt={`Gallery ${i + 1}`}
              fill
              className="object-cover hover:scale-110 transition-transform duration-700"
            />
          </div>
        ))}
      </div>

      <p className="text-sm text-gray-600 mt-10 italic text-center">
        “Memori indah yang akan selalu dikenang.”
      </p>
    </motion.section>
  );
}
