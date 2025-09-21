"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PhoneIcon from "@mui/icons-material/Phone";
import BusinessIcon from "@mui/icons-material/Business";

function Hero() {
  return (
    <section
      className="bg-gradient-to-b from-[#FDF6E3] to-[#F9F1E0] flex flex-col justify-center items-center text-center px-4"
      style={{ minHeight: "60vh" }}
    >
      <h1 className="text-4xl md:text-5xl font-bold text-[#6B4E31] mb-4 md:mb-6 transition-all duration-200 hover:scale-[1.01] hover:drop-shadow-md">
        İletişim
      </h1>
      <p className="text-base md:text-lg text-[#6B4E31] mb-6 max-w-xl">
        Bize ulaşarak hukuki sorularınıza profesyonel çözümler bulabilirsiniz.
      </p>
    </section>
  );
}

export default function ContactPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [pageData, setPageData] = useState(null);
  const [form, setForm] = useState({
    ad_soyad: "",
    email: "",
    telefon: "",
    konu: "",
    mesaj: "",
  });
  const [formStatus, setFormStatus] = useState({ success: null, message: "" });

  const baseColor = "#6B4E31";
  const accentColor = "#D4A017";

  const cardSx = {
    width: "100%",
    maxWidth: 800,
    mx: "auto",
    minHeight: 300,
    backgroundColor: "#F5E8B7",
    color: baseColor,
    textAlign: "center",
    borderRadius: 12,
    p: 4,
    boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
  };

  const iconSx = { fontSize: 50, mb: 2, color: baseColor };
  const buttonSx = {
    backgroundColor: accentColor,
    color: "#fff",
    width: "100%",
    py: 1.5,
    mb: 1,
    "&:hover": { backgroundColor: "#b58900" },
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
    textTransform: "none",
    fontSize: 16,
    borderRadius: 2,
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("sayfalar").select("*").eq("slug", "contact").single();
      setPageData(data);
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ success: null, message: "" });

    if (!form.ad_soyad || !form.email || !form.mesaj || form.mesaj.length < 10) {
      setFormStatus({
        success: false,
        message: "Lütfen tüm zorunlu alanları doldurun ve mesaj en az 10 karakter olsun.",
      });
      return;
    }

    try {
      const { error } = await supabase.from("iletisim_mesajlari").insert([
        {
          ad_soyad: form.ad_soyad,
          email: form.email,
          telefon: form.telefon,
          konu: form.konu,
          mesaj: form.mesaj,
          ip: "",
          user_agent: navigator.userAgent,
        },
      ]);
      if (error) throw error;
      setFormStatus({ success: true, message: "Mesajınız başarıyla gönderildi!" });
      setForm({ ad_soyad: "", email: "", telefon: "", konu: "", mesaj: "" });
    } catch (err) {
      console.error(err);
      setFormStatus({ success: false, message: "Mesaj gönderilirken hata oluştu." });
    }
  };

  if (!pageData) return <p style={{ textAlign: "center", marginTop: 50 }}>Yükleniyor...</p>;

  const whatsappLink = pageData.whatsapp
    ? `https://wa.me/${pageData.whatsapp.replace(/\D/g, "")}`
    : null;

  return (
    <Box component="main" sx={{ width: "100%", overflowX: "hidden" }}>
      <Hero />

      <Container maxWidth="md" sx={{ py: 8 }}>
        {/* Tek Kartta İletişim Bilgileri */}
        <Card sx={cardSx}>
          <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <BusinessIcon sx={iconSx} />
            <Typography variant="h5" gutterBottom>
              Bize Ulaşın
            </Typography>
            {pageData.adres && (
              <Typography variant="body1" sx={{ textAlign: "center", mb: 1 }}>
                {pageData.adres}
              </Typography>
            )}

            {pageData.telefon && (
              <Button
                component="a"
                href={`tel:${pageData.telefon.replace(/\s/g, "")}`}
                sx={buttonSx}
                startIcon={<PhoneIcon />}
              >
                {pageData.telefon}
              </Button>
            )}

            {whatsappLink && (
              <Button
                component="a"
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                sx={buttonSx}
                startIcon={<WhatsAppIcon />}
              >
                WhatsApp Mesaj Gönder
              </Button>
            )}
          </CardContent>
        </Card>

        {/* İletişim Formu */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom color={baseColor}>
            İletişim Formu
          </Typography>

          {formStatus.message && (
            <Alert severity={formStatus.success ? "success" : "error"} sx={{ mb: 3 }}>
              {formStatus.message}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Ad Soyad *"
              name="ad_soyad"
              value={form.ad_soyad}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email *"
              name="email"
              value={form.email}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Telefon"
              name="telefon"
              value={form.telefon}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Konu"
              name="konu"
              value={form.konu}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Mesaj *"
              name="mesaj"
              multiline
              rows={4}
              value={form.mesaj}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: accentColor,
                color: "#fff",
                "&:hover": { backgroundColor: "#b58900" },
                width: isMobile ? "100%" : "auto",
              }}
              size="large"
            >
              Gönder
            </Button>
          </form>
        </Box>

        {/* Google Maps */}
        {pageData.google_maps_link && (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              mt: 8,
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: 800,
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  position: "relative",
                  paddingTop: isMobile ? "35%" : "56.25%", // 16:9 oranı
                }}
              >
                <iframe
                  src={pageData.google_maps_link.match(/src="([^"]+)"/)[1]}
                  style={{
                    border: 0,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                  }}
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </Box>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}
