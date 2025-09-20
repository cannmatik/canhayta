"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";

// TipTap editörü
const RichTextEditor = dynamic(() => import("../../components/RichTextEditor"), {
  ssr: false,
});

export default function HakkindaDuzenle() {
  const [baslik, setBaslik] = useState("");
  const [icerikHTML, setIcerikHTML] = useState("");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      const { data, error } = await supabase
        .from("sayfalar")
        .select("baslik, icerik_html")
        .eq("slug", "hakkinda")
        .single();

      if (!error && data) {
        setBaslik(data.baslik);
        setIcerikHTML(data.icerik_html || "");
      }
      setLoading(false);
    };
    fetchPage();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setStatus(null);

    const { error } = await supabase
      .from("sayfalar")
      .update({
        baslik,
        icerik_html: icerikHTML,
        yayim_tarihi: new Date().toISOString(),
      })
      .eq("slug", "hakkinda");

    if (error) setStatus("Hata: " + error.message);
    else setStatus("Hakkında sayfası güncellendi ✅");
  };

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <section className="min-h-screen flex justify-center items-center bg-gray-50 px-4 py-8">
      <form
        onSubmit={handleSave}
        className="bg-white p-6 rounded shadow-md w-full max-w-2xl space-y-6"
      >
        <h2 className="text-xl font-bold text-center text-[#6B4E31]">
          Hakkında Sayfasını Düzenle
        </h2>

        <div>
          <label className="block text-sm font-semibold mb-1">Başlık</label>
          <input
            type="text"
            value={baslik}
            onChange={(e) => setBaslik(e.target.value)}
            className="w-full border p-3 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">İçerik</label>
          <RichTextEditor initialHTML={icerikHTML} onChange={setIcerikHTML} />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
        >
          Kaydet
        </button>

        {status && <p className="text-center mt-2">{status}</p>}
      </form>
    </section>
  );
}
