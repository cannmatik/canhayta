// app/(...senin admin yolu...)/page.js
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import slugify from "slugify";

// TipTap editörü ssr:false ile yükleyelim
const RichTextEditor = dynamic(() => import("../../components/RichTextEditor"), {
  ssr: false,
});

export default function MakaleEkle() {
  const [turler, setTurler] = useState([]);
  const [yazarlar, setYazarlar] = useState([]);
  const [form, setForm] = useState({
    baslik: "",
    ozet: "",
    makale_turu_id: "",
    yazar_id: "",
    kapak_resmi: null,
    pdf_dosya: null,
  });
  const [icerikHTML, setIcerikHTML] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploadStatus, setUploadStatus] = useState(null);
  // ← YENİ: Modal state'leri
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data: turData, error: turError } = await supabase
          .from("makale_turleri")
          .select('id, "Tur"');
        if (turError) throw turError;
        setTurler(turData || []);

        const { data: yazarData, error: yazarError } = await supabase
          .from("yazarlar")
          .select("id, ad, soyad");
        if (yazarError) throw yazarError;
        setYazarlar(yazarData || []);
      } catch (error) {
        console.error("Veri çekme hatası:", error.message);
        setUploadStatus("Veri çekme hatası: " + error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const toSlug = (text) =>
    slugify(text, { lower: true, strict: true, locale: "tr" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadStatus(null);
    setLoading(true);

    try {
      let kapakResmiUrl = null;
      let pdfDosyaUrl = null;

      // Kapak resmi (opsiyonel)
      if (form.kapak_resmi) {
        const kapakFileExt = form.kapak_resmi.name.split(".").pop();
        const kapakFileName = `${uuidv4()}.${kapakFileExt}`;
        const { error: kapakError } = await supabase.storage
          .from("Makaleler")
          .upload(`kapak_resimleri/${kapakFileName}`, form.kapak_resmi);
        if (kapakError) throw kapakError;

        const { data: kapakUrlData } = supabase.storage
          .from("Makaleler")
          .getPublicUrl(`kapak_resimleri/${kapakFileName}`);
        kapakResmiUrl = kapakUrlData.publicUrl;
      }

      // PDF (opsiyonel)
      if (form.pdf_dosya) {
        const pdfFileExt = form.pdf_dosya.name.split(".").pop();
        const pdfFileName = `${uuidv4()}.${pdfFileExt}`;
        const { error: pdfError } = await supabase.storage
          .from("Makaleler")
          .upload(`pdf_dosyalar/${pdfFileName}`, form.pdf_dosya);
        if (pdfError) throw pdfError;

        const { data: pdfUrlData } = supabase.storage
          .from("Makaleler")
          .getPublicUrl(`pdf_dosyalar/${pdfFileName}`);
        pdfDosyaUrl = pdfUrlData.publicUrl;
      }

      const seoSlug = toSlug(form.baslik);

      const { error } = await supabase.from("Makaleler").insert([
        {
          baslik: form.baslik,
          ozet: form.ozet,
          makale_turu_id: form.makale_turu_id,
          yazar_id: form.yazar_id,
          kapak_resmi_url: kapakResmiUrl,
          icerik_html: icerikHTML,
          bucket_dosya_url: pdfDosyaUrl,
          yayim_tarihi: new Date().toISOString(),
          seo_slug: seoSlug,
        },
      ]);

      if (error) throw error;

      setUploadStatus("Makale başarıyla yayınlandı!");
      setForm({
        baslik: "",
        ozet: "",
        makale_turu_id: "",
        yazar_id: "",
        kapak_resmi: null,
        pdf_dosya: null,
      });
      setIcerikHTML("");
      setIsModalOpen(false); // Modal'ı kapat
    } catch (error) {
      console.error("Yükleme hatası:", error.message);
      setUploadStatus("Yükleme hatası: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ← YENİ: Modal açma/kapama
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (loading) return <p className="p-4">Yükleniyor...</p>;

  return (
    <section className="bg-gradient-to-b from-[#FDF6E3] to-[#F9F1E0] min-h-screen flex flex-col justify-center items-center px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl space-y-6 text-left"
      >
        <h2 className="text-2xl font-bold text-[#6B4E31] text-center">
          Makale Ekle
        </h2>

        {/* Mevcut form alanları (değişmedi) */}
        <div>
          <label className="block text-[#6B4E31] font-semibold mb-1">
            Başlık
          </label>
          <input
            type="text"
            name="baslik"
            value={form.baslik}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded bg-gray-50 text-gray-800 focus:ring-2 focus:ring-[#6B4E31] focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-[#6B4E31] font-semibold mb-1">
            Özet
          </label>
          <textarea
            name="ozet"
            value={form.ozet}
            onChange={handleChange}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded bg-gray-50 text-gray-800 focus:ring-2 focus:ring-[#6B4E31] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[#6B4E31] font-semibold mb-1">
            Makale Türü
          </label>
          <select
            name="makale_turu_id"
            value={form.makale_turu_id}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded bg-gray-50 text-gray-800 focus:ring-2 focus:ring-[#6B4E31] focus:outline-none"
            required
          >
            <option value="">Seçiniz</option>
            {turler.map((tur) => (
              <option key={tur.id} value={tur.id}>
                {tur["Tur"]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[#6B4E31] font-semibold mb-1">
            Yazar
          </label>
          <select
            name="yazar_id"
            value={form.yazar_id}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded bg-gray-50 text-gray-800 focus:ring-2 focus:ring-[#6B4E31] focus:outline-none"
            required
          >
            <option value="">Seçiniz</option>
            {yazarlar.map((yazar) => (
              <option key={yazar.id} value={yazar.id}>
                {yazar.ad} {yazar.soyad}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[#6B4E31] font-semibold mb-1">
            Kapak Resmi
          </label>
          <input
            type="file"
            name="kapak_resmi"
            accept="image/*"
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded bg-gray-50 text-gray-800"
          />
        </div>

        {/* ← DEĞİŞTİ: Editör butonu (modal tetikleyici) */}
        <div>
          <label className="block text-[#6B4E31] font-semibold mb-2">
            İçerik (Metin Editörü)
          </label>
          <button
            type="button"
            onClick={openModal}
            className="w-full p-3 border border-gray-300 rounded bg-gray-50 text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-[#6B4E31] focus:outline-none flex items-center justify-center gap-2"
          >
            {icerikHTML ? "İçeriği Düzenle" : "İçerik Ekle"}
          </button>
          {icerikHTML && (
            <p className="text-xs text-gray-500 mt-1">İçerik yüklendi ({icerikHTML.length} karakter)</p>
          )}
        </div>

        <div>
          <label className="block text-[#6B4E31] font-semibold mb-1">
            Makale PDF (opsiyonel)
          </label>
          <input
            type="file"
            name="pdf_dosya"
            accept=".pdf"
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded bg-gray-50 text-gray-800"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !icerikHTML} // İçerik zorunlu hale getirildi
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition duration-300 disabled:bg-gray-400"
        >
          {loading ? "Yükleniyor..." : "Makaleyi Yayınla"}
        </button>

        {uploadStatus && (
          <p
            className={`text-center mt-4 ${
              uploadStatus.toLowerCase().includes("hata")
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {uploadStatus}
          </p>
        )}
      </form>

      {/* ← YENİ: Modal (Popup) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#6B4E31]">İçerik Düzenleyici</h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <RichTextEditor
              initialHTML={icerikHTML}
              onChange={setIcerikHTML}
              isInModal={true} // Modal stilini tetikle
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 border rounded text-sm bg-gray-200 hover:bg-gray-300"
              >
                İptal
              </button>
              <button
                onClick={() => {
                  closeModal();
                  // Opsiyonel: Form submit'i tetikle
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Kaydet ve Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}