"use client";


import dynamic from "next/dynamic";
import Image from "next/image";
import { Suspense, useEffect, useState, useRef } from "react";
import { supabase } from "../../lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation"; // Import useSearchParams



type Wish = {
  id: string;
  guest_name: string;
  message: string;
  created_at: string;
};

// Gunakan dynamic import dengan ssr: false untuk menonaktifkan SSR
const CoverSectionComponent = dynamic(() => import('./CoverSection'), {
  ssr: false,
});


export default function CoverSectionWrapper() { 
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CoverSection />
    </Suspense>
  );
}

  function CoverSection() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
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



// 🎵 Musik & Control
const [isPlaying, setIsPlaying] = useState(false);
const audioRef = useRef<HTMLAudioElement | null>(null);

useEffect(() => {
  const audio = new Audio("/Asset/backsound.mp3");
  audio.loop = true;
  audio.volume = 0.5;
  audio.currentTime = 48;
  audioRef.current = audio;

  return () => {
    audio.pause();
  };
}, []);

// fungsi umum play/pause
const togglePlay = () => {
  if (!audioRef.current) return;
  if (isPlaying) {
    audioRef.current.pause();
  } else {
    if (audioRef.current.currentTime < 48) {
      audioRef.current.currentTime = 48;
    }
    audioRef.current.play();
  }
  setIsPlaying(!isPlaying);
};

// fungsi khusus untuk tombol "Buka Undangan"
const handleOpenInvitation = () => {
  if (!audioRef.current) return;
  audioRef.current.play().then(() => {
    setIsPlaying(true);
  }).catch((err: unknown) => {
  console.warn("Autoplay diblokir browser:", err);
});
};




  // Gunakan useSearchParams() di dalam useEffect() untuk memastikan hanya di client-side
  const [guestNameParam, setGuestNameParam] = useState<string | null>(null);
  const [isPartner, setIsPartner] = useState<boolean>(false);


 const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const guestNameParam = searchParams.get("guest_name");
      const isPartner = searchParams.get("partner") === "true"; 

      // Pastikan guestNameParam ada sebelum diproses
      const formattedName = guestNameParam
        ? guestNameParam.split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
        : "";  // Jika guestNameParam null, set ke string kosong
      
      const finalName = isPartner ? `${formattedName} & Partner` : formattedName;
      setGuestName(finalName);  // Set nama tamu
    }
  }, [searchParams]);


  const [isDragging, setIsDragging] = useState(false);
 // 🖼️ Gambar
  const images: string[] = [
    "/Asset/gallery1.png",
    "/Asset/gallery2.png",
    "/Asset/gallery3.png",
    "/Asset/gallery4.png",
    "/Asset/gallery5.png",
    "/Asset/gallery6.png",
    "/Asset/gallery7.png",
    "/Asset/gallery8.png",
    "/Asset/gallery9.png",
  ];

// 📱 Deteksi ukuran layar
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

useEffect(() => {
  const targetDate = new Date("2025-12-14T13:00:00+07:00");

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

const [scrollDownHidden, setScrollDownHidden] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    if (window.scrollY > 20) setScrollDownHidden(true);
  };
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);



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
          <Image
            src="/Asset/cover.png"
            alt="Cover"
            fill
            priority
            className="object-cover object-center opacity-90"
          />
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
                  UNDUH MANTU
                </h4>
                <h1 className="font-script text-4xl md:text-6xl text-white mb-3">
                  Arief & Asri
                </h1>
                <p className="text-gray-200 text-sm mb-8">
                  Minggu, 14 Desember 2025
                </p>

                <div className="border-t border-gray-600 w-10 mx-auto mb-8"></div>

                <p className="text-sm text-gray-300 mb-1">
                  Kepada Yth. Bapak/Ibu/Saudara/i:
                </p>
                <h3 className="text-lg font-semibold mb-1">{guestName}</h3>
                <p className="text-xs text-gray-400 mb-5">
                  Mohon maaf jika ada kesalahan penulisan nama dan gelar
                </p>

                {/* Tombol buka undangan */}
                <motion.button
                  onClick={() => {
                    handleOpenInvitation(); // 🔊 mulai musik saat klik
                    setShowCover(true);     // 🎬 lanjut buka undangan
                  }}
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
                  UNDUH MANTU
                </h4>
                <h1 className="font-script text-4xl md:text-6xl text-white mb-3">
                  Arief & Asri
                </h1>
                <p className="text-gray-200 text-sm mb-8">
                  Minggu, 14 Desember 2025
                </p>

                <div className="border-t border-gray-600 w-10 mx-auto mb-8"></div>

                <p className="text-sm text-gray-300 mb-1">
                  Kepada Yth. Bapak/Ibu/Saudara/i:
                </p>
                <h3 className="text-lg font-semibold mb-1">{guestName}</h3>
                <p className="text-xs text-gray-400">
                  Mohon maaf jika ada kesalahan penulisan nama dan gelar
                </p>
                {showCover && (
 <motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 1 }}
  className={`absolute bottom-24 md:bottom-10 left-1/2 -translate-x-1/2 z-20 ${
    scrollDownHidden ? "opacity-0" : "opacity-100"
  } transition-opacity duration-700`}
>
  <motion.div
    animate={{ y: [0, 12, 0] }}
    transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
    className="cursor-pointer"
    onClick={() => {
  const next = document.getElementById("section-ayat");
  next?.scrollIntoView({ behavior: "smooth" });
}}

  >
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M6 7l6 6 6-6"
        stroke="#d8b86b"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 13l6 6 6-6"
        stroke="#d8b86b"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </motion.div>
</motion.div>

)}

              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* === SECTION AYAT === */}
        {showCover && (
          <motion.section
            id="section-ayat"
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
              className="relative z-10 bg-linear-to-b from-[#f8f4ec] to-[#f2e5c9] text-[#3b2c1a] px-6 md:px-16 py-24 overflow-hidden"
            >

              {/* Ornamen lembut */}
              <div className="absolute inset-0 bg-[url('/Asset/pattern-floral.png')] bg-repeat opacity-5"></div>

              {/* Layout */}
              <div className="relative flex flex-col items-center justify-center gap-16 md:gap-24">
                
                {/* === Groom === */}
                <motion.div
                  initial={{ opacity: 0, y: -100 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className="flex flex-col items-center text-center max-w-[350px] sm:max-w-[400px]"
                >
                  <div className="relative w-56 h-72 mx-auto overflow-hidden rounded-full border border-gray-400 shadow-lg mt-10">
                        <Image
                          src="/Asset/ariefbridge.png"
                          alt="Groom"
                          fill
                          quality={60}
                          loading="lazy"
                          className="object-cover"
                        />
                      </div>

                  <div className="mt-6">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-2">Arief Rachman Nugraha, S.T.</h2>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                      Anak laki-laki dari <br />
                      <span className="italic text-[#6b533b]">
                        Madih, S.Sos & Suminar, S.Pd
                      </span>
                    </p>
                  </div>
                </motion.div>

                {/* === Bride === */}
                <motion.div
                  initial={{ opacity: 0, y: 100 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className="flex flex-col items-center text-center max-w-[350px] sm:max-w-[400px]"
                >
                  {/* === BRIDE PHOTO === */}
                      <div className="relative w-56 h-72 mx-auto overflow-hidden rounded-full border border-gray-400 shadow-lg">
                        <Image
                          src="/Asset/AsriBride.png"
                          alt="Bride"
                          fill
                          loading="lazy"
                          quality={60}
                          className="object-cover object-top"
                        />
                      </div>

                  <div className="mt-6">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-2">Asri Cikita Putri, S.Ds.</h2>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                      Anak perempuan dari <br />
                      <span className="italic text-[#6b533b]">
                        Drs. Agus Milad Jamal & Drg. Rita Febriyanti
                      </span>
                    </p>
                  </div>
                </motion.div>

              </div>

              {/* Caption bawah */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 1 }}
                className="text-center mt-16 text-sm sm:text-base text-gray-600 italic"
              >
                “Dua hati yang saling mencintai, kini bersatu dalam satu janji suci.”
              </motion.p>

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
                Kisah Cinta Arief & Asri
              </motion.h2>
              <p className="text-sm md:text-base text-gray-700">
                Perjalanan cinta kami dimulai dari sebuah pertemuan yang tak disangka-sangka hingga menjadi takdir yang indah.
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
                <div className="relative w-56 h-72 mx-auto mb-8 rounded-t-[120px] rounded-b-[20px] overflow-hidden border-[3px] border-[#b08b4f] shadow-lg">
                <Image
                  src="/Asset/loveStory.png"
                  alt="Love Story"
                  fill
                  quality={100}
                  className="object-cover"
                />
                </div>

                {/* Tahun & Cerita */}
                <h3 className="text-[#b08b4f] text-2xl font-semibold mb-2 font-serif tracking-wide">
                  Pertemuan Pertama
                </h3>
                <p className="text-sm leading-relaxed text-[#4a3b2a] px-2">
                  Kami mengetahui satu sama lain dari dating apps dan memutuskan untuk bertemu. Berawal dari doa, sedikit keberanian, dan waktu yang tepat. Awalnya kami tak berharap banyak, tapi semakin sering berbincang, semuanya terasa natural. Dari obrolan sederhana, perlahan tumbuh rasa yang nyata dan hangat.
                </p>

                <h3 className="text-[#b08b4f] text-2xl font-semibold mb-2 font-serif tracking-wide mt-10">
                  Menuju Satu Tujuan
                </h3>
                <p className="text-sm leading-relaxed text-[#4a3b2a] px-2">
                  Semakin kami terasa dekat, kami memutuskan untuk melangkah lebih serius dengan saling mempertemukan orang tua. Bukan sekadar perkenalan, tapi bentuk kesungguhan bahwa kami siap berkomitmen dan membangun masa depan bersama.
                </p>

                <h3 className="text-[#b08b4f] text-2xl font-semibold mb-2 font-serif tracking-wide mt-10">
                  Janji Setia
                </h3>
                <p className="text-sm leading-relaxed text-[#4a3b2a] px-2">
                  Seiring berjalannya waktu, kami belajar, bertumbuh, dan terbentuk bersama setiap kali melewati berbagai cerita dan pengalaman. Di antara segala perubahan dan tantangan, kami menemukan keyakinan satu sama lain. Kini kami siap memulai babak baru. Kisah cinta yang semoga abadi, di dunia dan di akhirat nanti.
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
                Jadwal Acara
              </h2>
              <div className="flex justify-center gap-2 items-center text-gray-700 text-xs uppercase tracking-widest">
                <span className="w-10 h-px bg-[#b08b4f]"></span>
                <span>Menuju Momen Indah</span>
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
              Acara Unduh Mantu
            </h3>
            <p className="text-sm font-medium">Minggu, 14 Desember 2025</p>
            <p className="text-sm font-semibold">11:00 - 16:00 WIB</p>
            <p className="text-sm text-gray-700">PT Mustika Ratu</p>
            <div className="border-t border-[#b08b4f]/50 w-24 mx-auto mt-2"></div>
          </motion.div>

          {/* Embed Google Maps */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-10 overflow-hidden rounded-2xl border border-[#d6c5a5]/50 shadow-sm"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253790.94395135355!2d106.8720327343022!3d-6.331347268848439!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ed8bc493e541%3A0xc08cc4ec2412a8e7!2sPT.%20Mustika%20Ratu%2C%20Tbk%20-%20Head%20Office!5e0!3m2!1sid!2sid!4v1763223672937!5m2!1sid!2sid"
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
          </motion.div>

          {/* Resepsi */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="text-center"
          >

            {/* Tombol Aksi */}
            <div className="flex justify-center gap-4 mt-4">
              <a
                href="https://maps.app.goo.gl/vBMknDszpMDFakPD7"
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
                Galeri Kami
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
              className="relative max-w-3xl mx-auto rounded-3xl overflow-hidden shadow-lg border-2 border-[#d6c5a5] mb-16"
            >
              <video
                src="/Asset/weddingvideo.mp4"
                controls       // 🎬 Tambahkan kontrol play/pause
                muted
                loop
                playsInline
                className="w-full h-[300px] object-cover"
              ></video>
              
              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-[#000000a0] via-transparent to-transparent text-white text-sm py-3">
                <p>“Cuplikan Momen Arief & Asri”</p>
              </div>
            </motion.div>

            <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative max-w-6xl mx-auto overflow-hidden px-4"
    >
      {/* 🎞️ SLIDESHOW */}
      <motion.div
  className="flex gap-4 cursor-grab"
  drag="x"
  dragConstraints={{ left: -((images.length * 400) + (images.length * 16)), right: 0 }}
  animate={
    !isDragging
      ? { x: [0, -((images.length - 4) * 420), 0] }
      : { x: 0 }
  }
  onDragStart={() => setIsDragging(true)}
  onDragEnd={() => setTimeout(() => setIsDragging(false), 300)}
  transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
>
  {images.map((src, i) => (
    <div
      key={i}
      className="relative min-w-[200px] sm:min-w-[300px] md:min-w-[400px] 
                 h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden rounded-3xl 
                 shadow-md border border-[#d6c5a5]"
    >
      <Image
        src={src}
        alt=""
        fill
        className="object-cover"
      />
    </div>
  ))}

  {/* Pembatas anti ruang kosong */}
  <div className="min-w-[420px] h-[300px] sm:h-[400px] md:h-[500px]" />

</motion.div>


      {/* 💡 LIGHTBOX (aktif hanya di mobile) */}
      {isMobile && selectedIndex !== null && (
        <div className="fixed inset-0 z-9999 bg-black/95 flex flex-col items-center justify-center px-4 backdrop-blur-sm">
          <img
            src={images[selectedIndex]}
            alt="Preview"
            className="max-w-[90%] max-h-[80%] rounded-2xl shadow-2xl object-contain transition-all duration-500"
          />

          {/* ❌ CLOSE */}
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-6 right-6 bg-white/20 hover:bg-white/40 text-white text-2xl font-bold w-10 h-10 rounded-full flex items-center justify-center transition-all"
          >
            ✕
          </button>

          {/* ⬅️ PREV */}
          <button
            onClick={() =>
              setSelectedIndex((prev) =>
                prev === 0 ? images.length - 1 : (prev ?? 0) - 1
              )
            }
            className="absolute left-6 text-white bg-[#ffffff1a] hover:bg-white/30 rounded-full p-3 text-2xl transition-all select-none"
          >
            ⬅️
          </button>

          {/* ➡️ NEXT */}
          <button
            onClick={() =>
              setSelectedIndex((prev) =>
                prev === images.length - 1 ? 0 : (prev ?? 0) + 1
              )
            }
            className="absolute right-6 text-white bg-[#ffffff1a] hover:bg-white/30 rounded-full p-3 text-2xl transition-all select-none"
          >
            ➡️
          </button>
        </div>
      )}
    </motion.div>

            {/* Footer text */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="mt-16 text-sm italic text-gray-600"
            >
              “Setiap tatapan, setiap tawa, setiap cerita, dan setiap kebersamaan, semuanya kan abadi dalam kenangan indah kami.”
            </motion.p>
          </motion.section>
    )}

    {/* === SECTION WISHES === */}
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
          Kirim Ucapan dan Doa
        </h2>
        <div className="flex justify-center items-center gap-3 text-gray-700 text-xs uppercase tracking-widest">
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
          readOnly={!!guestName} // Jika nama tamu sudah ada, buat field ini hanya baca
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
        “Doa dan ucapan Bapak/Ibu/Saudara/i, dan teman-teman sekalian, sangat berarti bagi kami.
          Terima kasih telah berbagi kebahagiaan di hari yang indah ini.”
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
          backgroundImage: "url('/Asset/footer.png')",
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
          Arief & Asri
        </motion.h2>

        {/* <p className="text-xs text-gray-300 italic mb-8">beserta keluarga</p> */}

        <div className="border-t border-[#f5dcb2]/50 w-16 mx-auto mb-3"></div>
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
          <p className="text-gray-200 text-sm md:text-base leading-relaxed mb-40">
            Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan
            untukmu istri-istri dari jenismu sendiri, supaya kamu merasa
            ketenangan dan ketentraman hatimu, dan dijadikan-Nya di antaramu
            rasa kasih sayang.
          </p>
        </motion.div>
      </section>

      {/* 🎵 Floating Music Control */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="fixed bottom-6 left-6 z-9999"
      >
        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-[#d4af37]/80 hover:bg-[#b08b4f] 
                    flex items-center justify-center text-white shadow-lg
                    backdrop-blur-sm border border-white/30 transition-all duration-300"
        >
          {isPlaying ? (
            // 🎶 Animasi equalizer
            <motion.div
              className="flex gap-0.5"
              animate={{ scaleY: [1, 1.4, 1] }}
              transition={{ repeat: Infinity, duration: 0.7, ease: "easeInOut" }}
            >
              <div className="w-[3px] h-2.5 bg-white rounded"></div>
              <div className="w-[3px] h-4 bg-white rounded"></div>
              <div className="w-[3px] h-2 bg-white rounded"></div>
            </motion.div>
          ) : (
            // ▶️ Icon Play
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-0 h-0 border-t-8 border-b-8 border-l-12 border-l-white"
            ></motion.div>
          )}
        </button>
      </motion.div>
    </main>
  );
}
