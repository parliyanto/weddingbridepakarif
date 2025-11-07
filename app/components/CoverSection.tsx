"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";


type Wish = {
  id: string;
  guest_name: string;
  message: string;
  created_at: string;
};

export default function CoverSection() { 
  const [showCover, setShowCover] = useState<boolean>(false);
  const [guestName, setGuestName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
});

useEffect(() => {
  const targetDate = new Date("2025-12-07T08:00:00+07:00");

  const updateCountdown = () => {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();

    if (diff <= 0) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    setTimeLeft({ days, hours, minutes, seconds });
  };

  updateCountdown(); // Jalankan pertama kali
  const interval = setInterval(updateCountdown, 1000); // Update tiap detik

  return () => clearInterval(interval);
}, []);


  useEffect(() => {
    const init = async () => {
      await fetchWishes();

      const channel = supabase
        .channel("realtime-wishes")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "guest_wishes" },
          (payload: { new: Wish }) => {
            setWishes((prev: Wish[]) => [payload.new, ...prev]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    init();
  }, []);

  const fetchWishes = async () => {
    const { data, error } = await supabase
      .from("guest_wishes")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setWishes(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  const { error } = await supabase
    .from("guest_wishes")
    .insert([{ guest_name: guestName, message }]);

  setLoading(false);

  if (error) {
    alert("Gagal mengirim ucapan 😢");
  } else {
    alert("Ucapan terkirim 🥰");
    setGuestName("");
    setMessage("");
    fetchWishes(); // 🔁 Tambahkan baris ini biar langsung reload data
  }
};


  return (
    <main
    className={`h-screen grid grid-cols-1 md:grid-cols-[1.1fr_1.9fr] font-serif text-white transition-all duration-700 ${
      showCover ? "overflow-auto" : "overflow-hidden"
    }`}
  >
      {/* === LEFT SIDE === */}
      <section
      className={`relative h-full scrollbar-none transition-all duration-700 ${
        showCover ? "overflow-y-auto" : "overflow-hidden"
      }`}
    >
        {/* Background photo (colored) */}
        <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-90"
          style={{
            backgroundImage: "url('/Asset/bg-left.png')",
            backgroundSize: "cover",  // Memastikan gambar tidak terpotong
            backgroundPosition: "center",
 
          }}
        ></div>
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent"></div>
        </div>

        {/* === COVER / AYAT / BRIDE & GROOM === */}
        <div className="relative z-10 flex flex-col items-center justify-end text-center p-8 min-h-screen">
          <AnimatePresence mode="wait">
            {!showCover ? (
              // === Tampilan awal dengan tombol ===
              <motion.div
                key="intro"
                className="mb-16 max-w-sm"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 1 }}
              >
                <h4 className="uppercase tracking-widest text-gray-300 text-sm mb-2">
                  The Wedding Of
                </h4>
                <h1 className="font-script text-4xl md:text-6xl text-white mb-3">
                  Asri & Arief
                </h1>
                <p className="text-gray-200 text-sm mb-8">
                  Sabtu, 07 Desember 2025
                </p>

                <div className="border-t border-gray-600 w-10 mx-auto mb-8"></div>

                <p className="text-sm text-gray-300 mb-1">
                  Kepada Yth. Bapak/Ibu/Saudara/i:
                </p>
                <h3 className="text-lg font-semibold mb-1">Tamu Undangan</h3>
                <p className="text-xs text-gray-400 mb-5">
                  Mohon maaf jika ada kesalahan penulisan nama dan gelar
                </p>

                {/* Tombol buka undangan */}
                <motion.button
                  onClick={() => setShowCover(true)}
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
                    <span>BUKA UNDANGAN</span>
                  </div>
                </motion.button>
              </motion.div>
            ) : null}
            {showCover && (
              <motion.div
                key="cover"
                className="mb-32 max-w-sm"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              >
                <h4 className="uppercase tracking-widest text-gray-300 text-sm mb-2">
                  The Wedding Of
                </h4>
                <h1 className="font-script text-4xl md:text-6xl text-white mb-3">
                  Asri & Arief
                </h1>
                <p className="text-gray-200 text-sm mb-8">
                  Sabtu, 07 Desember 2025
                </p>

                <div className="border-t border-gray-600 w-10 mx-auto mb-8"></div>

                <p className="text-sm text-gray-300 mb-1">
                  Kepada Yth. Bapak/Ibu/Saudara/i:
                </p>
                <h3 className="text-lg font-semibold mb-1">Tamu Undangan</h3>
                <p className="text-xs text-gray-400">
                  Mohon maaf jika ada kesalahan penulisan nama dan gelar
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* === SECTION AYAT === */}
        {showCover && (
          <motion.section
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative z-10 bg-[#e9d7b8] text-[#3b2c1a] px-8 py-20 text-center"
          >
            <h3 className="uppercase tracking-widest mb-3 text-lg font-semibold">
              Q.S. Ar-Rum : 21
            </h3>
            <p className="italic mb-6 text-sm md:text-base">
              "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan
              untukmu istri-istri dari jenismu sendiri, supaya kamu merasa
              ketenangan dan ketentraman hatimu, dan dijadikan-Nya di antaramu
              rasa kasih sayang."
            </p>
            <div className="border-t border-[#3b2c1a]/50 w-24 mx-auto mb-6"></div>
            <p className="text-2xl md:text-3xl mb-8 text-[#3b2c1a]">
              وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا
              لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً
            </p>
            <p className="text-sm md:text-base leading-relaxed">
              Dengan memohon rahmat dan ridha Allah Subhanahu Wa Ta’ala, kami
              bermaksud mengundang Bapak/Ibu/Saudara/i untuk berkenan menghadiri
              acara pernikahan kami.
            </p>
          </motion.section>
        )}

        {/* === SECTION BRIDE & GROOM === */}
        {showCover && (
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative z-10 bg-[#f4ece0] text-[#3b2c1a] px-8 py-20"
          >
            <div className="flex flex-col gap-10">
              {/* Groom */}
              <motion.div
                className="flex flex-col md:flex-row items-center gap-6"
                initial={{ opacity: 0, x: -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
              >
                <img
                  src="/Asset/ariefgroom.png"
                  alt="Groom"
                  className="w-40 h-40 object-cover rounded-lg shadow-lg"
                />
                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-bold mb-1">Arief Rachman Nugraha, S.T.</h2>
                  {/* <p className="italic mb-1">Rama Putra Utama, S.H</p> */}
                  <p className="text-sm text-gray-700 mb-2">
                    The Son of <br /> Madih, S.Sos & Suminar, S.Pd
                    Yuni
                  </p>
                  <a
                    href="https://instagram.com/ramaputra"
                    target="_blank"
                    className="inline-block px-4 py-1 rounded-full text-white bg-[#b08b4f] text-xs font-semibold hover:bg-[#9b773c] transition"
                  >
                    @arief
                  </a>
                </div>
              </motion.div>

              {/* Bride */}
              <motion.div
                className="flex flex-col md:flex-row-reverse items-center gap-6"
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
              >
                <img
                  src="/Asset/AsriBride.png"
                  alt="Bride"
                  className="w-40 h-40 object-cover rounded-lg shadow-lg"
                />
                <div className="text-center md:text-right">
                  <h2 className="text-2xl font-bold mb-1">Asri Cikita Putri, S.Ds.</h2>
                  <p className="italic mb-1">Shinta Estianti, S.Pd</p>
                  <p className="text-sm text-gray-700 mb-2">
                    The Daughter of <br /> Drs. Agus Milad Jamal & Drg. Rita Febriyanti
                  </p>
                  <a
                    href="https://instagram.com/shintaest"
                    target="_blank"
                    className="inline-block px-4 py-1 rounded-full text-white bg-[#b08b4f] text-xs font-semibold hover:bg-[#9b773c] transition"
                  >
                    @asri
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* === SECTION OUR LOVE STORY === */}
        {showCover && (
          <motion.section
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative z-10 bg-[#f4e8d0] text-[#3b2c1a] px-8 md:px-16 py-24 text-center"
          >
            {/* Ornamen background halus */}
            <div className="absolute inset-0 bg-[url('/Asset/loveStory.png')] bg-repeat opacity-5"></div>

            {/* Judul */}
            <div className="relative mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-3xl md:text-5xl font-script text-[#b08b4f] mb-3"
              >
                Our Love Story
              </motion.h2>
              <p className="text-sm md:text-base text-gray-700">
                Perjalanan cinta kami dimulai dari sebuah pertemuan sederhana hingga menjadi takdir yang indah.
              </p>
              <div className="w-24 h-0.5 bg-[#b08b4f] mx-auto mt-4 rounded-full"></div>
            </div>

            {/* Card Love Story */}
            <div className="relative max-w-lg mx-auto bg-[#f9f3e8] border border-[#d6c5a5] rounded-3xl shadow-md px-6 py-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
              >
                {/* Foto dalam bingkai lengkung */}
                <div className="w-56 h-72 mx-auto mb-8 rounded-t-[120px] rounded-b-[20px] overflow-hidden border-[3px] border-[#b08b4f] shadow-lg">
                  <img
                    src="/Asset/loveStory.png"
                    alt="Love Story"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Tahun & Cerita */}
                <h3 className="text-[#b08b4f] text-2xl font-semibold mb-2 font-serif tracking-wide">
                  First Meeting
                </h3>
                <p className="text-sm leading-relaxed text-[#4a3b2a] px-2">
                  Kami bertemu di sebuah acara kampus. Meski singkat, kami merasa saling tertarik dan ingin mengenal
                  lebih jauh satu sama lain. Sejak itu, kami mulai menghabiskan waktu bersama dan semakin dekat.
                </p>

                <h3 className="text-[#b08b4f] text-2xl font-semibold mb-2 font-serif tracking-wide mt-10">
                  Together as One
                </h3>
                <p className="text-sm leading-relaxed text-[#4a3b2a] px-2">
                  As our hearts grew closer, we introduced each other to our families. It was our way of showing that this love was meant to be taken seriously.
                </p>

                <h3 className="text-[#b08b4f] text-2xl font-semibold mb-2 font-serif tracking-wide mt-10">
                  Our Promise
                </h3>
                <p className="text-sm leading-relaxed text-[#4a3b2a] px-2">
                  Despite our differences and challenges, we still choose to nurture this love together. Now we begin a new chapter filled with love, faith, purpose, and a life-long promise.
                </p>
              </motion.div>
            </div>

            {/* Ornamen bawah */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="relative mt-16 text-sm italic text-gray-600"
            >
              “Setiap kisah memiliki waktunya sendiri — dan waktu kami akhirnya tiba.”
            </motion.div>
          </motion.section>
        )}

        {/* === SECTION WEDDING SCHEDULE === */}
        {showCover && (
          <motion.section
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative z-10 bg-[#f8f3e9] text-[#3b2c1a] px-8 md:px-16 py-24 text-center min-h-screen overflow-hidden"
          >
            {/* Ornamen lembut */}
            <div className="absolute inset-0 bg-[url('/Asset/pattern-floral.png')] bg-repeat opacity-5"></div>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-script text-[#b08b4f] mb-3">
                Wedding Schedule
              </h2>
              <div className="flex justify-center gap-2 items-center text-gray-700 text-xs uppercase tracking-widest">
                <span className="w-10 h-px bg-[#b08b4f]"></span>
                <span>Countdown to Our Big Day</span>
                <span className="w-10 h-px bg-[#b08b4f]"></span>
              </div>
            </motion.div>

            {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex justify-center gap-6 mb-16"
        >
          {[
            { label: "Hari", value: timeLeft.days },
            { label: "Jam", value: timeLeft.hours.toString().padStart(2, "0") },
            { label: "Menit", value: timeLeft.minutes.toString().padStart(2, "0") },
            { label: "Detik", value: timeLeft.seconds.toString().padStart(2, "0") },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-[#efe6d4] border border-[#d6c5a5] w-20 h-20 rounded-lg flex flex-col justify-center items-center shadow-md transition-all duration-300"
            >
              <span className="text-3xl font-bold text-[#b08b4f]">{item.value}</span>
              <span className="text-xs tracking-widest text-gray-700 uppercase mt-1">
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>



          {/* Jadwal Acara */}
        <div className="relative max-w-2xl mx-auto bg-[#fffaf2] border border-[#d6c5a5] rounded-3xl shadow-md px-6 py-12">

          {/* Akad Nikah */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-10 text-center"
          >
            <h3 className="text-lg uppercase tracking-widest font-semibold text-[#b08b4f] mb-2">
              Wedding Ceremony
            </h3>
            <p className="text-sm font-medium">Sabtu, 07 Desember 2025</p>
            <p className="text-sm text-gray-700">AR-RODA Functional Hall Darussalam</p>
            <div className="border-t border-[#b08b4f]/50 w-24 mx-auto mt-6"></div>
          </motion.div>

          {/* Embed Google Maps */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-10 overflow-hidden rounded-2xl border border-[#d6c5a5]/50 shadow-sm"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.0534655755223!2d106.95895547380313!3d-6.256687393731815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e698d1c62f0a44b%3A0x3d6e710a4fa402a5!2sAr%20Roda%20Function%20Hall%20Darussalam!5e0!3m2!1sen!2sid!4v1762183176355!5m2!1sen!2sid"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </motion.div>

          {/* Akad Nikah */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-10 text-center"
          >
            <h3 className="text-lg uppercase tracking-widest font-semibold text-[#b08b4f] mb-2">
              Akad Nikah
            </h3>
            <p className="text-sm text-gray-700">08.00 - 10.00 WIB</p>
            <div className="border-t border-[#b08b4f]/50 w-24 mx-auto mt-6"></div>
          </motion.div>

          {/* Resepsi */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="text-center"
          >
            <h3 className="text-lg uppercase tracking-widest font-semibold text-[#b08b4f] mb-2">
              Resepsi
            </h3>
            <p className="text-sm text-gray-700 mb-3">13.00 - 15.00 WIB</p>

            {/* Tombol Aksi */}
            <div className="flex justify-center gap-4 mt-4">
              <a
                href="https://maps.app.goo.gl/BshsUwp68swqtQFCA"
                target="_blank"
                className="bg-[#b08b4f] hover:bg-[#9b773c] transition px-4 py-2 rounded-full text-white text-xs font-semibold flex items-center gap-2"
              >
                📍 Lihat Lokasi
              </a>
            </div>
          </motion.div>
        </div>
          </motion.section>
        )}

        {/* === SECTION OUR GALLERY === */}
        {showCover && (
          <motion.section
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative z-10 bg-[#f6f0e6] text-[#3b2c1a] px-8 md:px-16 py-24 text-center overflow-hidden"
          >
            {/* Ornamen lembut */}
            <div className="absolute inset-0 bg-[url('/Asset/pattern-floral.png')] bg-repeat opacity-5"></div>

            {/* Header */}
            <div className="relative mb-12">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-3xl md:text-5xl font-script text-[#b08b4f] mb-3"
              >
                Our Gallery
              </motion.h2>
              <div className="flex justify-center items-center gap-3 text-gray-700 text-xs uppercase tracking-widest">
                <span className="w-10 h-px bg-[#b08b4f]"></span>
                <span>Memori Bahagia Kami</span>
                <span className="w-10 h-px bg-[#b08b4f]"></span>
              </div>
            </div>

            {/* === Video Streaming === */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative max-w-3xl mx-auto rounded-3xl overflow-hidden shadow-lg border border-[#d6c5a5] mb-16"
            >
              <video
                src="/Asset/weddingvideo.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-[300px] object-cover"
              ></video>
              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-[#000000a0] via-transparent to-transparent text-white text-sm py-3">
                <p>“Highlight Pernikahan Rama & Shinta”</p>
              </div>
            </motion.div>

            {/* === Photo Slideshow === */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="relative max-w-5xl mx-auto overflow-hidden"
            >
              <motion.div
                className="flex gap-4 cursor-grab"
                drag="x"
                dragConstraints={{ left: -900, right: 0 }}
                animate={{
                  x: [0, -300, -600, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 20,
                  ease: "linear",
                }}
              >
                {[
                  "/Asset/gallery1.png",
                  "/Asset/gallery2.png",
                  "/Asset/gallery3.png",
                ].map((src, i) => (
                  <div
                    key={i}
                    className="relative min-w-[300px] sm:min-w-[400px] h-[500px] overflow-hidden rounded-3xl shadow-md border border-[#d6c5a5]"
                  >
                    <img
                      src={src}
                      alt={`Gallery ${i + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-700 flex items-end justify-center pb-4">
                      <p className="text-white text-xs italic">
                        Momen {i + 1} yang penuh cinta 💕
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Footer text */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="mt-16 text-sm italic text-gray-600"
            >
              “Setiap tawa, setiap pelukan, dan setiap tatapan — semuanya abadi dalam kenangan indah kami.”
            </motion.p>
          </motion.section>
        )}

 <motion.section
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="relative z-10 bg-[#f8f4ec] text-[#3b2c1a] px-8 md:px-16 py-24 text-center"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/Asset/pattern-floral.png')] bg-repeat opacity-5"></div>

      {/* Header */}
      <div className="relative mb-12">
        <h2 className="text-3xl md:text-5xl font-script text-[#b08b4f] mb-3">
          Send Your Wishes
        </h2>
        <div className="flex justify-center items-center gap-3 text-gray-700 text-xs uppercase tracking-widest">
          <span className="w-10 h-px bg-[#b08b4f]"></span>
          <span>Kirim Ucapan & Doa</span>
          <span className="w-10 h-px bg-[#b08b4f]"></span>
        </div>
      </div>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative max-w-lg mx-auto bg-[#fffaf2] border border-[#d6c5a5] rounded-3xl shadow-md p-6 text-left mb-16"
      >
        <label className="block text-sm font-semibold text-[#6b533b] mb-1">
          Nama Tamu:
        </label>
        <input
          type="text"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          placeholder="Masukkan nama Anda"
          className="w-full mb-4 border border-[#d6c5a5] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#b08b4f]/50"
        />

        <label className="block text-sm font-semibold text-[#6b533b] mb-1">
          Ucapan & Doa:
        </label>
        <textarea
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tulis ucapan dan doa terbaik Anda..."
          className="w-full border border-[#d6c5a5] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#b08b4f]/50"
        ></textarea>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          disabled={loading}
          className={`mt-4 w-full py-2 rounded-full font-semibold text-sm transition-all duration-300 shadow-sm ${
            loading
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-[#b08b4f] hover:bg-[#9b773c] text-white"
          }`}
        >
          {loading ? "Mengirim..." : "💌 Beri Ucapan"}
        </motion.button>
      </motion.form>

      {/* Daftar ucapan */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative max-w-2xl mx-auto bg-[#fffaf2] border border-[#d6c5a5] rounded-3xl shadow-md p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#b08b4f]">
            Ucapan dan Doa Para Tamu
          </h3>
          <span className="text-xs text-white bg-[#b08b4f] px-3 py-1 rounded-full">
            {wishes.length} Ucapan
          </span>
        </div>

        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#d6c5a5] scrollbar-track-[#f8f4ec]">
          {wishes.map((wish) => (
            <div
              key={wish.id}
              className="border border-[#e1d3b8] rounded-xl p-3 bg-[#fdfaf4] text-left shadow-sm"
            >
              <h4 className="font-semibold text-[#3b2c1a] text-sm">
                {wish.guest_name}
              </h4>
              <p className="text-sm text-[#5c4b3a] mt-1">{wish.message}</p>
              <p className="text-xs text-[#9b8871] mt-2 italic">
                {new Date(wish.created_at).toLocaleString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quote bawah */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
        className="mt-12 text-sm italic text-gray-600"
      >
        “Doa dan ucapan Anda sangat berarti bagi kami — terima kasih telah
        berbagi kebahagiaan di hari spesial ini.”
      </motion.p>
    </motion.section>

    {/* === SECTION PENUTUP === */}
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      viewport={{ once: true }}
      className="relative z-10 h-screen flex flex-col justify-center items-center text-center overflow-hidden"
    >
      {/* 🔹 Background foto */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/Asset/sectionakhir.png')",
          filter: "brightness(60%)",
        }}
      ></div>

      {/* 🔹 Overlay gradient bawah */}
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent"></div>

      {/* 🔹 Teks penutup */}
      <div className="relative z-10 px-6 max-w-2xl text-white">
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-sm md:text-base leading-relaxed mt-48 mb-6"
        >
          Menjadi sebuah kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i
          berkenan hadir dalam hari bahagia kami. Terima kasih atas segala
          ucapan, doa, dan perhatian yang diberikan.  
          <br />Sampai jumpa di hari bahagia kami 💕
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="font-script text-4xl md:text-5xl text-[#f5dcb2] mb-2"
        >
          Asri & Arief
        </motion.h2>

        <p className="text-xs text-gray-300 italic mb-8">beserta keluarga</p>

        <div className="border-t border-[#f5dcb2]/50 w-16 mx-auto mb-3"></div>
        <p className="text-[10px] tracking-widest uppercase text-[#f5dcb2]/70">
          All rights reserved © helloguest.id
        </p>
      </div>
    </motion.section>



      </section>
      

      {/* === RIGHT SIDE (tetap) === */}
      <section className="hidden relative md:flex flex-col justify-between items-end bg-black text-right pr-6 md:pr-16 py-10">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80"
          style={{
            backgroundImage: "url('/Asset/bg-right.png')",
            filter: "grayscale(100%) brightness(60%)",
          }}
        ></div>

        <motion.div
          className="z-10 text-right max-w-md"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2 }}
        >
          <h4 className="uppercase tracking-widest text-gray-300 text-xl mb-2">
            The Wedding Of
          </h4>
          <h1 className="font-script text-5xl md:text-6xl text-white">
            Asri & Arief
          </h1>
        </motion.div>

        <motion.div
          className="z-10 text-right max-w-md -translate-y-20"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 1.2 }}
        >
          <p className="text-gray-200 text-sm md:text-base leading-relaxed mb-12">
            Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan
            untukmu istri-istri dari jenismu sendiri, supaya kamu merasa
            ketenangan dan ketentraman hatimu, dan dijadikan-Nya di antaramu
            rasa kasih sayang.
          </p>
        </motion.div>

        <motion.div
          className="z-10 text-gray-400 text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          © All rights reserved by helloGuest
        </motion.div>
      </section>
    </main>
  );
}
