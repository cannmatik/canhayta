"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      } else {
        router.push("/login");
      }
    };
    getUser();
  }, []);

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-700 text-lg">Yükleniyor...</p>
      </div>
    );

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#FDF6E3] to-[#F9F1E0] pt-28 px-4">
      {/* pt-28 ile navbar altından boşluk verdik */}
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-8 text-[#6B4E31] text-center">
          Admin Paneli
        </h1>
        <p className="text-gray-700 mb-8 text-center">
          Hoş geldin, <span className="font-semibold">{user.email}</span>
        </p>

        {/* Butonlar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          <a
            href="/admin/makale-ekle"
            className="block p-6 bg-yellow-400 text-white rounded-lg text-center font-semibold hover:bg-yellow-500 transition"
          >
            Makale Ekle
          </a>
          <a
            href="/admin/makaleler"
            className="block p-6 bg-blue-600 text-white rounded-lg text-center font-semibold hover:bg-blue-700 transition"
          >
            Tüm Makaleler
          </a>
        </div>
      </div>
    </section>
  );
}
