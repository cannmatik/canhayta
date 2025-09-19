"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  useMediaQuery,
  useTheme,
  IconButton,
  CircularProgress,
  Button,
  Dialog,
} from "@mui/material";
import { FullscreenExit, ArrowBack, ArrowForward, PictureAsPdf, Palette } from "@mui/icons-material";
import { supabase } from "@/lib/supabase";
import { useRouter, useParams } from "next/navigation";

export default function MakaleGoruntuleClient() {
  const params = useParams();
  const seo_slug = params?.seo_slug;
  const router = useRouter();

  const [makale, setMakale] = useState(null);
  const [allMakaleler, setAllMakaleler] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  // Tema / yazı ayarları
  const [fontColor, setFontColor] = useState("#6B4E31");
  const [bgColor, setBgColor] = useState("#FDF6E3");
  const [fontSize, setFontSize] = useState("1.125rem");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const baseColor = "#6B4E31";

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    let mounted = true;

    const fetchMakaleler = async () => {
      try {
        const { data: allData, error: allError } = await supabase
          .from("Makaleler")
          .select(
            `id, baslik, ozet, icerik_html, kapak_resmi_url, bucket_dosya_url,
             yayim_tarihi, seo_slug, makale_turleri ("Tur"), yazarlar (ad, soyad)`
          )
          .order("yayim_tarihi", { ascending: false });

        if (allError) throw allError;

        if (mounted) {
          setAllMakaleler(allData || []);
          const currentMakale = allData?.find((m) => m.seo_slug === seo_slug);
          if (currentMakale) {
            setMakale(currentMakale);
            setCurrentIndex(allData.indexOf(currentMakale));
          }
        }
      } catch (err) {
        console.error("Makale çekme hatası:", err?.message || err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (seo_slug) fetchMakaleler();
    return () => (mounted = false);
  }, [seo_slug]);

  useEffect(() => {
    if (makale?.ozet && charIndex < makale.ozet.length) {
      const timer = setTimeout(() => {
        setTypedText((prev) => prev + makale.ozet[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [makale, charIndex]);

  const goToPrevious = () => {
    if (currentIndex > 0) {
      const prevMakale = allMakaleler[currentIndex - 1];
      router.push(`/makaleler/${prevMakale.seo_slug}`);
    }
  };

  const goToNext = () => {
    if (currentIndex < allMakaleler.length - 1) {
      const nextMakale = allMakaleler[currentIndex + 1];
      router.push(`/makaleler/${nextMakale.seo_slug}`);
    }
  };

  const toggleTheme = () => {
    if (bgColor === "#FDF6E3") {
      setBgColor("#333");
      setFontColor("#f5f5f5");
    } else {
      setBgColor("#FDF6E3");
      setFontColor("#6B4E31");
    }
  };

  if (!isClient) return null;

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh", pt: 16 }}>
        <CircularProgress sx={{ color: baseColor }} />
      </Box>
    );
  }

  if (!makale) {
    return (
      <Box sx={{ textAlign: "center", py: 8, pt: 16 }}>
        <Typography variant="h6" color={baseColor}>
          Makale bulunamadı.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: bgColor,
        minHeight: "100vh",
        pt: 0, // Navbar padding main layout’ta zaten var
        color: fontColor,
        transition: "all 0.3s",
      }}
    >
      <Container maxWidth="lg" sx={{ py: isMobile ? 4 : 8 }}>
        {/* Tema Butonu navbarın altında */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 4 }}>
          <Button
            variant="contained"
            startIcon={<Palette />}
            sx={{ bgcolor: baseColor, "&:hover": { bgcolor: "#5a3c26" } }}
            onClick={toggleTheme}
          >
            Tema
          </Button>
        </Box>

        {/* Başlık */}
        <Typography
          variant={isMobile ? "h5" : "h4"}
          component="h1"
          sx={{ mb: 4, textAlign: "center", fontWeight: "bold", color: fontColor }}
        >
          {makale.baslik}
        </Typography>

        <Grid container spacing={4} alignItems="flex-start">
          {makale.kapak_resmi_url && (
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  width: 300,
                  height: 300,
                  borderRadius: 2,
                  border: `1px solid ${baseColor}40`,
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "white",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                }}
              >
                <Box
                  component="img"
                  src={makale.kapak_resmi_url}
                  alt={makale.baslik}
                  sx={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </Box>
            </Grid>
          )}

          <Grid item xs={12} md={makale.kapak_resmi_url ? 8 : 12}>
            {makale.ozet && (
              <Typography
                variant="body1"
                sx={{
                  textAlign: "justify",
                  lineHeight: 1.7,
                  whiteSpace: "pre-wrap",
                  mb: 2,
                  fontSize: fontSize,
                  color: fontColor,
                }}
              >
                {typedText}
                <span
                  style={{
                    borderRight: "2px solid",
                    animation: "blink 0.75s step-end infinite",
                    color: fontColor,
                  }}
                />
              </Typography>
            )}

            {makale.icerik_html && (
              <Box
                sx={{
                  mt: 2,
                  p: 3,
                  bgcolor: bgColor,
                  borderRadius: 2,
                  border: `1px solid ${baseColor}40`,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                  transition: "all 0.3s",
                  "& *": {
                    color: fontColor + " !important",
                    fontSize: fontSize,
                  },
                }}
                dangerouslySetInnerHTML={{ __html: makale.icerik_html }}
              />
            )}

            {makale.bucket_dosya_url && (
              <Box sx={{ mt: 4, textAlign: "center" }}>
                <Button
                  variant="contained"
                  startIcon={<PictureAsPdf />}
                  sx={{ bgcolor: baseColor, "&:hover": { bgcolor: "#5a3c26" } }}
                  onClick={() => setFullscreen(true)}
                >
                  PDF Görüntüle
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>

        {/* Navigasyon */}
        {(currentIndex > 0 || currentIndex < allMakaleler.length - 1) && (
          <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <IconButton
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              sx={{ color: baseColor, "&:disabled": { color: "text.disabled" } }}
            >
              <ArrowBack />
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              {currentIndex + 1} / {allMakaleler.length}
            </Typography>
            <IconButton
              onClick={goToNext}
              disabled={currentIndex === allMakaleler.length - 1}
              sx={{ color: baseColor, "&:disabled": { color: "text.disabled" } }}
            >
              <ArrowForward />
            </IconButton>
          </Box>
        )}
      </Container>

      {/* PDF Popup */}
      <Dialog
        open={fullscreen}
        onClose={() => setFullscreen(false)}
        fullScreen
        sx={{ "& .MuiDialog-paper": { overflow: "hidden", backgroundColor: "#f5f5f5" } }}
      >
        <Box sx={{ position: "relative", height: "100vh" }}>
          <IconButton
            onClick={() => setFullscreen(false)}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 10,
              backgroundColor: "rgba(255,255,255,0.9)",
              "&:hover": { backgroundColor: "white" },
            }}
          >
            <FullscreenExit />
          </IconButton>

          <iframe
            src={makale.bucket_dosya_url}
            width="100%"
            height="100%"
            style={{ border: "none" }}
            title="PDF Görüntüleyici (Tam Ekran)"
          />
        </Box>
      </Dialog>
    </Box>
  );
}
