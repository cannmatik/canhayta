"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";
import { Box, Typography, Button } from "@mui/material";

// TipTap editörü
const RichTextEditor = dynamic(() => import("../../components/RichTextEditor"), {
  ssr: false,
});

export default function HakkindaDuzenle() {
  const [baslik, setBaslik] = useState("");
  const [icerikHTML, setIcerikHTML] = useState("");
  const [ozetBaslik, setOzetBaslik] = useState("");
  const [ozetIcerikHTML, setOzetIcerikHTML] = useState("");
  const [loading, setLoading] = useState(true);
  const [hakkindaStatus, setHakkindaStatus] = useState(null);
  const [ozetStatus, setOzetStatus] = useState(null);

  const baseColor = "#6B4E31";
  const accentColor = "#D4A017";

  useEffect(() => {
    const fetchPages = async () => {
      // Hakkında sayfasını çek
      const { data: hakkindaData, error: hakkindaError } = await supabase
        .from("sayfalar")
        .select("baslik, icerik_html")
        .eq("slug", "hakkinda")
        .single();

      if (!hakkindaError && hakkindaData) {
        setBaslik(hakkindaData.baslik);
        setIcerikHTML(hakkindaData.icerik_html || "");
      } else {
        setHakkindaStatus("Hakkında sayfası bulunamadı.");
      }

      // Hakkında özet sayfasını çek
      const { data: ozetData, error: ozetError } = await supabase
        .from("sayfalar")
        .select("baslik, icerik_html")
        .eq("slug", "hakkinda_ozet")
        .single();

      if (!ozetError && ozetData) {
        setOzetBaslik(ozetData.baslik);
        setOzetIcerikHTML(ozetData.icerik_html || "");
      } else {
        setOzetStatus("Hakkında özet sayfası bulunamadı.");
      }

      setLoading(false);
    };
    fetchPages();
  }, []);

  const handleHakkindaSave = async (e) => {
    e.preventDefault();
    setHakkindaStatus(null);

    const { error } = await supabase
      .from("sayfalar")
      .update({
        baslik,
        icerik_html: icerikHTML,
        yayim_tarihi: new Date().toISOString(),
      })
      .eq("slug", "hakkinda");

    if (error) {
      setHakkindaStatus("Hata: " + error.message);
    } else {
      setHakkindaStatus("Hakkında sayfası güncellendi ✅");
    }
  };

  const handleOzetSave = async (e) => {
    e.preventDefault();
    setOzetStatus(null);

    const { error } = await supabase
      .from("sayfalar")
      .update({
        baslik: ozetBaslik,
        icerik_html: ozetIcerikHTML,
        yayim_tarihi: new Date().toISOString(),
      })
      .eq("slug", "hakkinda_ozet");

    if (error) {
      setOzetStatus("Hata: " + error.message);
    } else {
      setOzetStatus("Hakkında özet sayfası güncellendi ✅");
    }
  };

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#FDF6E3", px: 4, py: 8 }}>
      <Typography
        variant="h4"
        align="center"
        sx={{ color: baseColor, mb: 6, fontWeight: 700 }}
      >
        Hakkında Sayfalarını Düzenle
      </Typography>

      {/* Hakkında Sayfası Düzenleme */}
      <Box
        component="form"
        onSubmit={handleHakkindaSave}
        sx={{
          bgcolor: "white",
          p: 4,
          borderRadius: 2,
          boxShadow: "0 6px 18px rgba(0,0,0,0.07)",
          maxWidth: "800px",
          mx: "auto",
          mb: 6,
        }}
      >
        <Typography
          variant="h5"
          sx={{ color: baseColor, mb: 3, fontWeight: 600 }}
        >
          Hakkında Sayfası
        </Typography>

        <Box sx={{ mb: 3 }}>
          <label className="block text-sm font-semibold mb-1" style={{ color: baseColor }}>
            Başlık
          </label>
          <input
            type="text"
            value={baslik}
            onChange={(e) => setBaslik(e.target.value)}
            className="w-full border p-3 rounded"
            style={{ borderColor: baseColor }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <label className="block text-sm font-semibold mb-1" style={{ color: baseColor }}>
            İçerik
          </label>
          <RichTextEditor initialHTML={icerikHTML} onChange={setIcerikHTML} />
        </Box>

        <Button
          type="submit"
          variant="contained"
          sx={{
            width: "100%",
            bgcolor: accentColor,
            color: "#FFF",
            "&:hover": { bgcolor: "#B88C14" },
            borderRadius: 2,
            py: 1.5,
            fontWeight: 600,
          }}
        >
          Hakkında Sayfasını Kaydet
        </Button>

        {hakkindaStatus && (
          <Typography sx={{ textAlign: "center", mt: 2, color: baseColor }}>
            {hakkindaStatus}
          </Typography>
        )}
      </Box>

      {/* Hakkında Özet Sayfası Düzenleme */}
      <Box
        component="form"
        onSubmit={handleOzetSave}
        sx={{
          bgcolor: "white",
          p: 4,
          borderRadius: 2,
          boxShadow: "0 6px 18px rgba(0,0,0,0.07)",
          maxWidth: "800px",
          mx: "auto",
        }}
      >
        <Typography
          variant="h5"
          sx={{ color: baseColor, mb: 3, fontWeight: 600 }}
        >
          Hakkında Özet Sayfası
        </Typography>

        <Box sx={{ mb: 3 }}>
          <label className="block text-sm font-semibold mb-1" style={{ color: baseColor }}>
            Özet Başlık
          </label>
          <input
            type="text"
            value={ozetBaslik}
            onChange={(e) => setOzetBaslik(e.target.value)}
            className="w-full border p-3 rounded"
            style={{ borderColor: baseColor }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <label className="block text-sm font-semibold mb-1" style={{ color: baseColor }}>
            Özet İçerik
          </label>
          <RichTextEditor initialHTML={ozetIcerikHTML} onChange={setOzetIcerikHTML} />
        </Box>

        <Button
          type="submit"
          variant="contained"
          sx={{
            width: "100%",
            bgcolor: accentColor,
            color: "#FFF",
            "&:hover": { bgcolor: "#B88C14" },
            borderRadius: 2,
            py: 1.5,
            fontWeight: 600,
          }}
        >
          Hakkında Özet Sayfasını Kaydet
        </Button>

        {ozetStatus && (
          <Typography sx={{ textAlign: "center", mt: 2, color: baseColor }}>
            {ozetStatus}
          </Typography>
        )}
      </Box>
    </Box>
  );
}