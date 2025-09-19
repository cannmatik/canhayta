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
  Paper,
  Dialog,
  Button,
} from "@mui/material";
import { Fullscreen, FullscreenExit, ArrowBack, ArrowForward } from "@mui/icons-material";
import { supabase } from "@/lib/supabase";
import { useRouter, useParams } from "next/navigation";

export default function MakaleGoruntuleClient() {
  const params = useParams();
  const seo_slug = params?.seo_slug;
  const router = useRouter();
  const [makale, setMakale] = useState(null);
  const [allMakaleler, setAllMakaleler] = useState([]); // Tüm makaleler için
  const [currentIndex, setCurrentIndex] = useState(-1); // Mevcut makale indeksi
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [typedText, setTypedText] = useState(""); // Daktilo efekti için state
  const [charIndex, setCharIndex] = useState(0); // Yazılan karakter indeksi

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const baseColor = "#6B4E31";

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Tüm makaleleri ve mevcut makaleyi çek
  useEffect(() => {
    let mounted = true;

    const fetchMakaleler = async () => {
      try {
        const { data: allData, error: allError } = await supabase
          .from("Makaleler")
          .select(
            `
            id, baslik, ozet, kapak_resmi_url, bucket_dosya_url,
            yayim_tarihi, seo_slug, makale_turleri ("Tur"), yazarlar (ad, soyad)
            `
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

    if (seo_slug) {
      fetchMakaleler();
    }

    return () => (mounted = false);
  }, [seo_slug]);

  // Daktilo efekti için useEffect
  useEffect(() => {
    if (makale?.ozet && charIndex < makale.ozet.length) {
      const timer = setTimeout(() => {
        setTypedText((prev) => prev + makale.ozet[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 50); // Her karakter için 50ms gecikme
      return () => clearTimeout(timer);
    }
  }, [makale, charIndex]);

  // Önceki/Sonraki makaleye geçiş
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

  if (!isClient) {
    return null;
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh", pt: 20 }}> {/* Navbar padding */}
        <CircularProgress sx={{ color: baseColor }} />
      </Box>
    );
  }

  if (!makale) {
    return (
      <Box sx={{ textAlign: "center", py: 8, pt: 20 }}> {/* Navbar padding */}
        <Typography variant="h6" color={baseColor}>
          Makale bulunamadı.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", bgcolor: "#FDF6E3", minHeight: "100vh", pt: 20 }}> {/* Navbar padding */}
      <Container maxWidth="lg" sx={{ py: isMobile ? 4 : 8 }}>
        <Typography
          variant={isMobile ? "h5" : "h4"}
          component="h1"
          color={baseColor}
          sx={{ mb: 4, textAlign: "center", fontWeight: "bold" }}
        >
          {makale.baslik}
        </Typography>

        <Grid container spacing={4} alignItems="center">
          {makale.kapak_resmi_url && (
            <Grid item xs={12} md={4}>
              <Box
                component="img"
                src={makale.kapak_resmi_url}
                alt={makale.baslik}
                sx={{
                  width: "100%",
                  height: "auto",
                  borderRadius: 2,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                }}
              />
            </Grid>
          )}

          {makale.ozet && (
            <Grid item xs={12} md={8}>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  textAlign: "justify",
                  lineHeight: 1.7,
                  whiteSpace: "pre-wrap", // Daktilo efekti için metnin formatını korur
                }}
              >
                {typedText}
                <span style={{ borderRight: "2px solid", animation: "blink 0.75s step-end infinite" }} />
              </Typography>
            </Grid>
          )}
        </Grid>

        {/* Navigasyon Okları */}
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

        {makale.bucket_dosya_url && (
          <Box sx={{ mt: 6 }}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                backgroundColor: 'transparent',
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                position: 'relative'
              }}
            >
              <IconButton 
                onClick={() => setFullscreen(true)}
                sx={{ 
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  zIndex: 10,
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  '&:hover': {
                    backgroundColor: 'white',
                  },
                }}
              >
                <Fullscreen />
              </IconButton>
              
              <Box sx={{ 
                width: '100%', 
                height: '70vh',
                border: 'none'
              }}>
                <iframe
                  src={makale.bucket_dosya_url}
                  width="100%"
                  height="100%"
                  style={{ border: 'none' }}
                  title="PDF Görüntüleyici"
                />
              </Box>
              
              <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                PDF'i tam ekranda görüntülemek için yukarıdaki butonu kullanın
              </Typography>
            </Paper>
          </Box>
        )}
      </Container>

      {/* Tam Ekran PDF Görüntüleyici */}
      <Dialog
        open={fullscreen}
        onClose={() => setFullscreen(false)}
        fullScreen
        sx={{
          '& .MuiDialog-paper': {
            overflow: 'hidden',
            backgroundColor: '#f5f5f5',
          },
        }}
      >
        <Box sx={{ position: 'relative', height: '100vh' }}>
          <IconButton 
            onClick={() => setFullscreen(false)}
            sx={{ 
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 10,
              backgroundColor: 'rgba(255,255,255,0.9)',
              '&:hover': {
                backgroundColor: 'white',
              },
            }}
          >
            <FullscreenExit />
          </IconButton>
          
          <iframe
            src={makale.bucket_dosya_url}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
            title="PDF Görüntüleyici (Tam Ekran)"
          />
        </Box>
      </Dialog>
    </Box>
  );
}