"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";
import slugify from "slugify";
import { useParams, useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

const RichTextEditor = dynamic(() => import("../../../components/RichTextEditor"), { ssr: false });

export default function MakaleDuzenle() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [form, setForm] = useState({
    baslik: "",
    ozet: "",
    makale_turu_id: "",
    yazar_id: "",
    kapak_resmi: null,
    pdf_dosya: null,
    aktif: true,
  });
  const [icerikHTML, setIcerikHTML] = useState("");
  const [turler, setTurler] = useState([]);
  const [yazarlar, setYazarlar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [mevcutKapak, setMevcutKapak] = useState(null);
  const [mevcutPDF, setMevcutPDF] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data: turData } = await supabase.from("makale_turleri").select('id, "Tur"');
        setTurler(turData || []);

        const { data: yazarData } = await supabase.from("yazarlar").select("id, ad, soyad");
        setYazarlar(yazarData || []);

        const { data: makale } = await supabase.from("Makaleler").select("*").eq("id", id).single();
        if (makale) {
          setForm({
            baslik: makale.baslik,
            ozet: makale.ozet,
            makale_turu_id: makale.makale_turu_id,
            yazar_id: makale.yazar_id,
            kapak_resmi: null,
            pdf_dosya: null,
            aktif: makale.aktif,
          });
          setIcerikHTML(makale.icerik_html || "");
          setMevcutKapak(makale.kapak_resmi_url || null);
          setMevcutPDF(makale.bucket_dosya_url || null);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploadStatus(null);
    try {
      let kapakUrl = mevcutKapak;
      let pdfUrl = mevcutPDF;

      // Kapak resmi yükleme
      if (form.kapak_resmi) {
        const ext = form.kapak_resmi.name.split(".").pop();
        const filename = `${uuidv4()}.${ext}`;
        const { error: kapakError } = await supabase.storage
          .from("Makaleler")
          .upload(`kapak_resimleri/${filename}`, form.kapak_resmi, { upsert: true });
        if (kapakError) throw kapakError;

        const { data: kapakData } = supabase.storage
          .from("Makaleler")
          .getPublicUrl(`kapak_resimleri/${filename}`);
        kapakUrl = kapakData.publicUrl;
      }

      // PDF yükleme
      if (form.pdf_dosya) {
        const ext = form.pdf_dosya.name.split(".").pop();
        const filename = `${uuidv4()}.${ext}`;
        const { error: pdfError } = await supabase.storage
          .from("Makaleler")
          .upload(`pdf_dosyalar/${filename}`, form.pdf_dosya, { upsert: true });
        if (pdfError) throw pdfError;

        const { data: pdfData } = supabase.storage
          .from("Makaleler")
          .getPublicUrl(`pdf_dosyalar/${filename}`);
        pdfUrl = pdfData.publicUrl;
      }

      const seoSlug = slugify(form.baslik, { lower: true, strict: true, locale: "tr" });

      const { error } = await supabase.from("Makaleler").update({
        baslik: form.baslik,
        ozet: form.ozet,
        makale_turu_id: form.makale_turu_id,
        yazar_id: form.yazar_id,
        icerik_html: icerikHTML,
        kapak_resmi_url: kapakUrl,
        bucket_dosya_url: pdfUrl,
        seo_slug: seoSlug,
        aktif: form.aktif,
      }).eq("id", id);

      if (error) throw error;

      setUploadStatus("Makale başarıyla güncellendi!");
      router.push("/admin/makaleler");
    } catch (error) {
      console.error(error);
      setUploadStatus("Güncelleme hatası: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-4">Yükleniyor...</p>;

  const inputClass = "w-full p-3 border border-gray-300 rounded bg-white text-[#6B4E31] focus:ring-2 focus:ring-[#6B4E31] focus:outline-none";

  return (
    <section className="bg-gradient-to-b from-[#FDF6E3] to-[#F9F1E0] min-h-screen flex flex-col justify-center items-center px-4 py-12">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl space-y-6">
        <h2 className="text-2xl font-bold text-[#6B4E31] text-center">Makale Düzenle</h2>

        <input type="text" name="baslik" value={form.baslik} onChange={handleChange} placeholder="Başlık" className={inputClass} required />
        <textarea name="ozet" value={form.ozet} onChange={handleChange} placeholder="Özet" className={inputClass} rows={4} />
        <select name="makale_turu_id" value={form.makale_turu_id} onChange={handleChange} className={inputClass}>
          <option value="">Seçiniz</option>
          {turler.map((t) => <option key={t.id} value={t.id}>{t.Tur}</option>)}
        </select>
        <select name="yazar_id" value={form.yazar_id} onChange={handleChange} className={inputClass}>
          <option value="">Seçiniz</option>
          {yazarlar.map((y) => <option key={y.id} value={y.id}>{y.ad} {y.soyad}</option>)}
        </select>

        <div>
          <label className="block mb-1 text-[#6B4E31] font-semibold">Kapak Resmi</label>
          {mevcutKapak && (
            <img src={mevcutKapak} alt="Kapak" className="w-32 h-auto mb-2 border" />
          )}
          <input type="file" name="kapak_resmi" accept="image/*" onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label className="block mb-1 text-[#6B4E31] font-semibold">PDF Dosya</label>
          {mevcutPDF && (
            <p className="mb-1">
              Mevcut PDF: <a href={mevcutPDF} target="_blank" className="text-blue-600 underline">Göster</a>
            </p>
          )}
          <input type="file" name="pdf_dosya" accept=".pdf" onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label className="block mb-1 text-[#6B4E31] font-semibold">İçerik</label>
          <button type="button" onClick={() => setIsModalOpen(true)} className={inputClass + " mt-1"}>
            {icerikHTML ? "İçeriği Düzenle" : "İçerik Ekle"}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="aktif" name="aktif" checked={form.aktif} onChange={handleChange} />
          <label htmlFor="aktif" className="text-[#6B4E31] font-semibold">Aktif / Pasif</label>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition duration-300">
          Güncelle
        </button>

        {uploadStatus && (
          <p className={`text-center mt-2 ${uploadStatus.toLowerCase().includes("hata") ? "text-red-600" : "text-green-600"}`}>
            {uploadStatus}
          </p>
        )}
      </form>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between mb-4">
              <h3 className="text-xl font-bold text-[#6B4E31]">İçerik Düzenleyici</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-2xl">×</button>
            </div>
            <RichTextEditor initialHTML={icerikHTML} onChange={setIcerikHTML} />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded">Kapat</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
