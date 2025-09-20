"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";
import { Box, TextField, Button, Typography } from "@mui/material";

// TipTap editörü
const RichTextEditor = dynamic(() => import("../../components/RichTextEditor"), {
  ssr: false,
});

export default function IletisimDuzenle() {
  const [baslik, setBaslik] = useState("");
  const [icerikHTML, setIcerikHTML] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [telefon, setTelefon] = useState("");
  const [adres, setAdres] = useState("");
  const [googleMapsLink, setGoogleMapsLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);

  const baseColor = "#6B4E31";
  const accentColor = "#D4A017";

  useEffect(() => {
    const fetchPage = async () => {
      const { data, error } = await supabase
        .from("sayfalar")
        .select("baslik, icerik_html, whatsapp, telefon, adres, google_maps_link")
        .eq("slug", "contact")
        .single();

      if (!error && data) {
        setBaslik(data.baslik || "");
        setIcerikHTML(data.icerik_html || "");
        setWhatsapp(data.whatsapp || "");
        setTelefon(data.telefon || "");
        setAdres(data.adres || "");
        setGoogleMapsLink(data.google_maps_link || "");
      } else {
        console.error("Supabase error:", error);
        setStatus("Veri yüklenirken hata oluştu.");
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
        whatsapp,
        telefon,
        adres,
        google_maps_link: googleMapsLink,
        yayim_tarihi: new Date().toISOString(),
      })
      .eq("slug", "contact");

    if (error) {
      console.error("Update error:", error);
      setStatus("Hata: " + error.message);
    } else {
      setStatus("İletişim sayfası güncellendi ✅");
    }
  };

  if (loading) {
    return (
      <Typography sx={{ textAlign: "center", mt: 10, color: baseColor }}>
        Yükleniyor...
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#FDF6E3",
        px: { xs: 2, sm: 4 },
        py: 8,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSave}
        sx={{
          bgcolor: "#F5E8B7",
          p: { xs: 4, sm: 6 },
          borderRadius: 2,
          boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "800px",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{ fontWeight: 700, color: baseColor, mb: 2 }}
        >
          İletişim Sayfasını Düzenle
        </Typography>

        <Box>
          <Typography sx={{ fontWeight: 600, color: baseColor, mb: 1 }}>
            Başlık
          </Typography>
          <TextField
            fullWidth
            value={baslik}
            onChange={(e) => setBaslik(e.target.value)}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: baseColor },
                "&:hover fieldset": { borderColor: accentColor },
                "&.Mui-focused fieldset": { borderColor: accentColor },
              },
              "& .MuiInputBase-input": { color: baseColor },
            }}
          />
        </Box>

        <Box>
          <Typography sx={{ fontWeight: 600, color: baseColor, mb: 1 }}>
            İçerik
          </Typography>
          <RichTextEditor initialHTML={icerikHTML} onChange={setIcerikHTML} />
        </Box>

        <Box>
          <Typography sx={{ fontWeight: 600, color: baseColor, mb: 1 }}>
            WhatsApp Numarası
          </Typography>
          <TextField
            fullWidth
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            variant="outlined"
            placeholder="Örn: 905455191199"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: baseColor },
                "&:hover fieldset": { borderColor: accentColor },
                "&.Mui-focused fieldset": { borderColor: accentColor },
              },
              "& .MuiInputBase-input": { color: baseColor },
            }}
          />
        </Box>

        <Box>
          <Typography sx={{ fontWeight: 600, color: baseColor, mb: 1 }}>
            Telefon Numarası
          </Typography>
          <TextField
            fullWidth
            value={telefon}
            onChange={(e) => setTelefon(e.target.value)}
            variant="outlined"
            placeholder="Örn: +90 216 123 45 67"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: baseColor },
                "&:hover fieldset": { borderColor: accentColor },
                "&.Mui-focused fieldset": { borderColor: accentColor },
              },
              "& .MuiInputBase-input": { color: baseColor },
            }}
          />
        </Box>

        <Box>
          <Typography sx={{ fontWeight: 600, color: baseColor, mb: 1 }}>
            Adres
          </Typography>
          <TextField
            fullWidth
            value={adres}
            onChange={(e) => setAdres(e.target.value)}
            variant="outlined"
            multiline
            rows={3}
            placeholder="Örn: Toraman İş Hanı, Osmanağa, Kuşdili Cd. No:43 Kat:1 Büro:1, 34714 Kadıköy/İstanbul"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: baseColor },
                "&:hover fieldset": { borderColor: accentColor },
                "&.Mui-focused fieldset": { borderColor: accentColor },
              },
              "& .MuiInputBase-input": { color: baseColor },
            }}
          />
        </Box>

        <Box>
          <Typography sx={{ fontWeight: 600, color: baseColor, mb: 1 }}>
            Google Maps iframe Kodu
          </Typography>
          <TextField
            fullWidth
            value={googleMapsLink}
            onChange={(e) => setGoogleMapsLink(e.target.value)}
            variant="outlined"
            multiline
            rows={4}
            placeholder="Örn: <iframe src='https://www.google.com/maps/embed?pb=...' width='600' height='450' style='border:0;' allowfullscreen='' loading='lazy' referrerpolicy='no-referrer-when-downgrade'></iframe>"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: baseColor },
                "&:hover fieldset": { borderColor: accentColor },
                "&.Mui-focused fieldset": { borderColor: accentColor },
              },
              "& .MuiInputBase-input": { color: baseColor },
            }}
          />
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            bgcolor: accentColor,
            "&:hover": { bgcolor: "#b58900" },
            color: "#fff",
            py: 1.5,
            fontWeight: 600,
            borderRadius: 1,
          }}
        >
          Kaydet
        </Button>

        {status && (
          <Typography sx={{ textAlign: "center", mt: 2, color: baseColor }}>
            {status}
          </Typography>
        )}
      </Box>
    </Box>
  );
}