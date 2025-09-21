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
  ButtonGroup,
} from "@mui/material";
import {
  FullscreenExit,
  ArrowBack,
  ArrowForward,
  PictureAsPdf,
  Palette,
  Close,
  ArrowBackIos,
  TextDecrease,
  TextIncrease,
} from "@mui/icons-material";
import { supabase } from "@/lib/supabase";
import { useRouter, useParams } from "next/navigation";
import Typewriter from "typewriter-effect";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isExiting, setIsExiting] = useState(false);

  const [fontColor, setFontColor] = useState("#6B4E31");
  const [bgColor, setBgColor] = useState("#FDF6E3");
  const [fontSize, setFontSize] = useState("1.125rem");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const baseColor = "#6B4E31";

  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    let mounted = true;
    const fetchMakaleler = async () => {
      try {
        const { data: allData, error } = await supabase
          .from("Makaleler")
          .select(
            `id, baslik, ozet, icerik_html, kapak_resmi_url, bucket_dosya_url,
             yayim_tarihi, seo_slug, makale_turleri ("Tur"), yazarlar (ad, soyad)`
          )
          .order("yayim_tarihi", { ascending: false });
        if (error) throw error;

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

  const handleBack = () => {
    setIsExiting(true);
    setTimeout(() => {
      router.push("/makaleler");
    }, 300);
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setIsExiting(true);
      setTimeout(() => {
        const prevMakale = allMakaleler[currentIndex - 1];
        router.push(`/makaleler/${prevMakale.seo_slug}`);
        setIsExiting(false);
      }, 300);
    }
  };

  const goToNext = () => {
    if (currentIndex < allMakaleler.length - 1) {
      setIsExiting(true);
      setTimeout(() => {
        const nextMakale = allMakaleler[currentIndex + 1];
        router.push(`/makaleler/${nextMakale.seo_slug}`);
        setIsExiting(false);
      }, 300);
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

  const increaseFontSize = () => {
    setFontSize((current) => {
      if (current === "1rem") return "1.125rem";
      if (current === "1.125rem") return "1.25rem";
      return "1.25rem";
    });
  };

  const decreaseFontSize = () => {
    setFontSize((current) => {
      if (current === "1.25rem") return "1.125rem";
      if (current === "1.125rem") return "1rem";
      return "1rem";
    });
  };

  if (!isClient) return null;

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          pt: 16,
        }}
      >
        <CircularProgress sx={{ color: baseColor }} />
      </Box>
    );
  }

  if (!makale) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h6" color={baseColor}>
          Makale bulunamadı.
        </Typography>
      </Box>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {!isExiting && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <Box
            sx={{
              width: "100%",
              bgcolor: bgColor,
              minHeight: "100vh",
              pt: 4,
              pb: 8,
              color: fontColor,
              transition: "all 0.3s",
            }}
          >
            <Container maxWidth="lg" sx={{ px: 2 }}>
              {/* Üst Kontrol Çubuğu */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: { xs: 2, md: 4 },
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIos />}
                  sx={{
                    color: fontColor,
                    borderColor: fontColor,
                    borderRadius: "999px",
                    px: 3,
                    "&:hover": {
                      borderColor: fontColor,
                      bgcolor: `${fontColor}10`,
                    },
                    fontSize: { xs: "0.8rem", md: "1rem" },
                  }}
                  onClick={handleBack}
                >
                  Geri Dön
                </Button>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <ButtonGroup
                    variant="outlined"
                    size="small"
                    sx={{ borderColor: fontColor }}
                  >
                    <IconButton
                      onClick={decreaseFontSize}
                      disabled={fontSize === "1rem"}
                      sx={{ 
                        color: fontColor, 
                        borderColor: fontColor,
                        "&:disabled": { color: "text.disabled" },
                        px: 1
                      }}
                    >
                      <TextDecrease />
                    </IconButton>
                    <IconButton
                      onClick={increaseFontSize}
                      disabled={fontSize === "1.25rem"}
                      sx={{ 
                        color: fontColor, 
                        borderColor: fontColor,
                        "&:disabled": { color: "text.disabled" },
                        px: 1
                      }}
                    >
                      <TextIncrease />
                    </IconButton>
                  </ButtonGroup>

                  <Button
                    variant="contained"
                    startIcon={<Palette />}
                    sx={{
                      bgcolor: fontColor,
                      color: bgColor,
                      borderRadius: "999px",
                      px: 3,
                      "&:hover": { 
                        bgcolor: fontColor,
                        opacity: 0.9
                      },
                      fontSize: { xs: "0.8rem", md: "1rem" },
                    }}
                    onClick={toggleTheme}
                  >
                    Tema
                  </Button>
                </Box>
              </Box>

              {/* Başlık */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <Typography
                  variant={isMobile ? "h5" : "h4"}
                  component="h1"
                  sx={{
                    mb: 4,
                    textAlign: "center",
                    fontWeight: "bold",
                    color: fontColor,
                  }}
                >
                  {makale.baslik}
                </Typography>
              </motion.div>

              <Grid container spacing={4} alignItems="flex-start">
                {/* Kapak Resmi */}
                {makale.kapak_resmi_url && (
                  <Grid
                    item
                    xs={12}
                    md={4}
                    sx={{
                      display: "flex",
                      justifyContent: { xs: "center", md: "flex-start" },
                      mb: { xs: 2, md: 0 },
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                    >
                      <Box
                        sx={{
                          width: 300,
                          height: 300,
                          borderRadius: 2,
                          border: `1px solid ${fontColor}40`,
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: bgColor === "#FDF6E3" ? "white" : "#444",
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
                    </motion.div>
                  </Grid>
                )}

                {/* İçerik */}
                <Grid
                  item
                  xs={12}
                  md={makale.kapak_resmi_url ? 8 : 12}
                  sx={{
                    maxWidth: {
                      md: makale.kapak_resmi_url
                        ? `calc(100% - 300px - 32px)`
                        : "100%",
                    },
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                  >
                    {/* Özet */}
                    {makale.ozet && (
                      <Box sx={{ mb: 2, fontSize: fontSize }}>
                        <Typewriter
                          onInit={(typewriter) => {
                            typewriter.typeString(makale.ozet).start();
                          }}
                          options={{
                            delay: 5,
                            autoStart: true,
                            loop: false,
                          }}
                        />
                      </Box>
                    )}

                    {/* HTML içerik */}
                    {makale.icerik_html && (
                      <Box
                        sx={{
                          mt: 2,
                          p: 3,
                          bgcolor: bgColor,
                          borderRadius: 2,
                          border: `1px solid ${fontColor}40`,
                          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                          transition: "all 0.3s",
                          fontSize: fontSize,
                          "& *": {
                            color: `${fontColor} !important`,
                            fontSize: "inherit !important",
                          },
                          "& h1, & h2, & h3, & h4, & h5, & h6": {
                            color: `${fontColor} !important`,
                          },
                        }}
                        dangerouslySetInnerHTML={{ __html: makale.icerik_html }}
                      />
                    )}

                    {/* PDF Butonu */}
                    {makale.bucket_dosya_url && (
                      <Box sx={{ mt: 4, textAlign: "center" }}>
                        <Button
                          variant="contained"
                          startIcon={<PictureAsPdf />}
                          sx={{ 
                            bgcolor: fontColor, 
                            color: bgColor,
                            "&:hover": { 
                              bgcolor: fontColor,
                              opacity: 0.9
                            } 
                          }}
                          onClick={() => setFullscreen(true)}
                        >
                          PDF Görüntüle
                        </Button>
                      </Box>
                    )}
                  </motion.div>
                </Grid>
              </Grid>

              {/* Navigasyon */}
              {(currentIndex > 0 || currentIndex < allMakaleler.length - 1) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  <Box
                    sx={{
                      mt: 4,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <IconButton
                      onClick={goToPrevious}
                      disabled={currentIndex === 0}
                      sx={{ 
                        color: fontColor, 
                        "&:disabled": { color: "text.disabled" } 
                      }}
                    >
                      <ArrowBack />
                    </IconButton>
                    <Typography variant="body2" sx={{ color: fontColor }}>
                      {currentIndex + 1} / {allMakaleler.length}
                    </Typography>
                    <IconButton
                      onClick={goToNext}
                      disabled={currentIndex === allMakaleler.length - 1}
                      sx={{ 
                        color: fontColor, 
                        "&:disabled": { color: "text.disabled" } 
                      }}
                    >
                      <ArrowForward />
                    </IconButton>
                  </Box>
                </motion.div>
              )}
            </Container>

            {/* PDF Dialog */}
            <Dialog
              open={fullscreen}
              onClose={() => setFullscreen(false)}
              fullScreen
              sx={{
                "& .MuiDialog-paper": {
                  overflow: "hidden",
                  backgroundColor: "#f5f5f5",
                },
              }}
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
                  <Close />
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}