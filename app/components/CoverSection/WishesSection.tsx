"use client";

import { motion } from "framer-motion";
import { supabase } from "@lib/supabaseClient";
import { useEffect, useState } from "react";

type Wish = {
  id: string;
  guest_name: string;
  message: string;
  created_at: string;
};

export default function WishesSection({ guestName }: { guestName: string }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [wishes, setWishes] = useState<Wish[]>([]);

  // ------------------------------------
  // FETCH DATA + REALTIME
  // ------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      await fetchWishes();
    };
    fetchData();

    const channel = supabase
      .channel("wishes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "guest_wishes" },
        (payload) => {
          setWishes((prev) => [payload.new as Wish, ...prev]);
        }
      )
      .subscribe();

    // cleanup
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ------------------------------------
  // FETCH FUNCTION
  // ------------------------------------
  const fetchWishes = async () => {
    const { data } = await supabase
      .from("guest_wishes")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setWishes(data);
  };

  // ------------------------------------
  // SUBMIT FORM
  // ------------------------------------
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await supabase.from("guest_wishes").insert([
      {
        guest_name: guestName,
        message,
      },
    ]);

    setMessage("");
    setLoading(false);
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative bg-[#f8f4ec] px-8 md:px-16 py-24 text-center"
    >
      <h2 className="text-3xl md:text-5xl font-script text-[#b08b4f]">
        Kirim Ucapan & Doa
      </h2>

      <form
        onSubmit={submit}
        className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow mt-10"
      >
        <input
          type="text"
          value={guestName}
          readOnly
          className="w-full mb-3 border px-3 py-2 rounded-md"
        />

        <textarea
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border px-3 py-2 rounded-md"
          placeholder="Tulis ucapan Anda"
        />

        <button
          type="submit"
          className="w-full mt-4 bg-[#b08b4f] text-white py-2 rounded-full"
        >
          {loading ? "Mengirim..." : "💌 Kirim Ucapan"}
        </button>
      </form>

      <div className="max-w-2xl mx-auto mt-12 space-y-4">
        {wishes.map((w) => (
          <div key={w.id} className="bg-white p-4 rounded-xl shadow text-left">
            <h4 className="font-semibold">{w.guest_name}</h4>
            <p>{w.message}</p>
            <p className="text-xs text-gray-500 mt-2">
              {new Date(w.created_at).toLocaleString("id-ID")}
            </p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
