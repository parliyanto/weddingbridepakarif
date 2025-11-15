"use client";

import { motion } from "framer-motion";

export default function ScheduleSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="relative bg-[#f8f3e9] text-[#3b2c1a] px-8 md:px-16 py-24 text-center"
    >
      <h2 className="text-3xl md:text-5xl font-script text-[#b08b4f]">
        Jadwal Acara
      </h2>

      <div className="mt-12 max-w-xl mx-auto bg-[#fffaf2] rounded-3xl border border-[#d6c5a5] shadow p-6">
        <h3 className="text-lg font-semibold text-[#b08b4f]">
          Unduh Mantu
        </h3>

        <p className="text-sm mt-1">Minggu, 14 Desember 2025</p>
        <p className="font-semibold text-sm">11:00 - 16:00 WIB</p>
        <p className="text-sm text-gray-700">PT Mustika Ratu</p>

        <div className="mt-6 overflow-hidden rounded-xl border">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253879.6217361549!2d106.58073806744822!3d-6.148278420914985"
            width="100%"
            height="250"
            loading="lazy"
          />
        </div>

        <a
          href="https://maps.app.goo.gl/HJUQ6oRAfDdQthBL8"
          target="_blank"
          className="mt-4 inline-block bg-[#b08b4f] hover:bg-[#9b773c] text-white text-sm px-4 py-2 rounded-full"
        >
          📍 Lihat Lokasi
        </a>
      </div>
    </motion.section>
  );
}
