"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

export default function MakaleEkle() {
  const [turler, setTurler] = useState([]);
  const [yazarlar, setYazarlar] = useState([]);
  const [form, setForm] = useState({
    baslik: "",
    ozet: "",
    makale_turu_id: "",
    yazar_id: "",
    kapak_resmi: null,
    icerik_html: "",
    pdf_dosya: null,
  });
  const [loading, setLoading] = useState(true);
  const [uploadStatus, setUploadStatus] = useState(null);

  // Tür ve yazar verilerini çek
  useEffect(() => {
    const fetchData = async () => {
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
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadStatus(null);
    setLoading(true);

    try {
      let kapakResmiUrl = null;
      let pdfDosyaUrl = null;

      // Kapak resmi yükleme
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

      // PDF dosya yükleme
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

      // SEO slug oluştur
      const seoSlug = form.baslik
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      // Makale verisini kaydet
      const { data, error } = await supabase.from("Makaleler").insert([
        {
          baslik: form.baslik,
          ozet: form.ozet,
          makale_turu_id: form.makale_turu_id,
          yazar_id: form.yazar_id,
          kapak_resmi_url: kapakResmiUrl,
          icerik_html: form.icerik_html,
          bucket_dosya_url: pdfDosyaUrl,
          yayim_tarihi: new Date().toISOString(),
          seo_slug: seoSlug,
        },
      ]);

      if (error) throw error;
      setUploadStatus("Makale başarıyla yüklendi!");
      setForm({
        baslik: "",
        ozet: "",
        makale_turu_id: "",
        yazar_id: "",
        kapak_resmi: null,
        icerik_html: "",
        pdf_dosya: null,
      });
    } catch (error) {
      console.error("Yükleme hatası:", error.message);
      setUploadStatus("Yükleme hatası: " + error.message);
    } finally {
      setLoading(false);
    }
  };

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

        {/* Başlık */}
        <div>
          <label className="block text-[#6B4E31] font-semibold mb-1">Başlık</label>
          <input
            type="text"
            name="baslik"
            value={form.baslik}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded bg-gray-50 text-gray-800 focus:ring-2 focus:ring-[#6B4E31] focus:outline-none"
            required
          />
        </div>

        {/* Özet */}
        <div>
          <label className="block text-[#6B4E31] font-semibold mb-1">Özet</label>
          <textarea
            name="ozet"
            value={form.ozet}
            onChange={handleChange}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded bg-gray-50 text-gray-800 focus:ring-2 focus:ring-[#6B4E31] focus:outline-none"
          />
        </div>

        {/* Makale Türü */}
        <div>
          <label className="block text-[#6B4E31] font-semibold mb-1">Makale Türü</label>
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

        {/* Yazar */}
        <div>
          <label className="block text-[#6B4E31] font-semibold mb-1">Yazar</label>
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

        {/* Kapak Resmi */}
        <div>
          <label className="block text-[#6B4E31] font-semibold mb-1">Kapak Resmi</label>
          <input
            type="file"
            name="kapak_resmi"
            accept="image/*"
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded bg-gray-50 text-gray-800"
          />
        </div>

        {/* PDF Dosyası */}
        <div>
          <label className="block text-[#6B4E31] font-semibold mb-1">Makale PDF</label>
          <input
            type="file"
            name="pdf_dosya"
            accept=".pdf"
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded bg-gray-50 text-gray-800"
            required
          />
        </div>

        {/* İçerik (HTML) - Opsiyonel */}
        <div>
          <label className="block text-[#6B4E31] font-semibold mb-1">İçerik (HTML, Opsiyonel)</label>
          <textarea
            name="icerik_html"
            value={form.icerik_html}
            onChange={handleChange}
            rows={6}
            className="w-full p-3 border border-gray-300 rounded bg-gray-50 text-gray-800 focus:ring-2 focus:ring-[#6B4E31] focus:outline-none"
          />
        </div>

        {/* Gönder */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition duration-300 disabled:bg-gray-400"
        >
          {loading ? "Yükleniyor..." : "Makaleyi Yayınla"}
        </button>

        {/* Yükleme Durumu */}
        {uploadStatus && (
          <p
            className={`text-center mt-4 ${
              uploadStatus.includes("hata") ? "text-red-600" : "text-green-600"
            }`}
          >
            {uploadStatus}
          </p>
        )}
      </form>
    </section>
  );
}