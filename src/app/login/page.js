"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Giriş başarısız: " + error.message);
    } else {
      router.push("/admin");
    }
  };

  return (
    <section className="bg-gradient-to-b from-[#FDF6E3] to-[#F9F1E0] min-h-screen flex justify-center items-center px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-[#6B4E31] mb-6 text-center">
          Admin Girişi
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded bg-gray-50 text-gray-800 focus:ring-2 focus:ring-[#6B4E31] focus:outline-none"
            required
          />
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded bg-gray-50 text-gray-800 focus:ring-2 focus:ring-[#6B4E31] focus:outline-none"
            required
          />
          <button
            type="submit"
            className="w-full bg-yellow-400 text-white p-3 rounded hover:bg-yellow-500 transition duration-300 font-semibold"
          >
            Giriş Yap
          </button>
        </form>
      </div>
    </section>
  );
}
