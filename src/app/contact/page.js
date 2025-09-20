"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PhoneIcon from "@mui/icons-material/Phone";
import BusinessIcon from "@mui/icons-material/Business";

// Hero component
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
  const [error, setError] = useState(null);

  const baseColor = "#6B4E31";
  const accentColor = "#D4A017";

  const cardSx = {
    maxWidth: 345,
    mx: "auto",
    backgroundColor: "#F5E8B7",
    color: baseColor,
    textAlign: "center",
    borderRadius: 12,
    p: 2.5,
    boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
    transition: "transform 220ms ease, box-shadow 220ms ease",
    cursor: "pointer",
    "&:hover": {
      transform: "translateY(-6px)",
      boxShadow: "0 14px 32px rgba(107,78,49,0.22)",
    },
    "&:hover svg": {
      color: accentColor,
      transform: "scale(1.06)",
    },
  };

  const iconSx = {
    fontSize: 60,
    mb: 2,
    color: baseColor,
    transition: "color 200ms ease, transform 200ms ease",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from("sayfalar")
          .select("*")
          .eq("slug", "contact")
          .single();
        if (error) {
          console.error("Supabase error:", error);
          setError("Veri yüklenirken bir hata oluştu.");
          return;
        }
        setPageData(data);
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("Beklenmedik bir hata oluştu.");
      }
    };
    fetchData();
  }, []);

  if (error) {
    return <p style={{ textAlign: "center", marginTop: 50 }}>{error}</p>;
  }

  if (!pageData) {
    return <p style={{ textAlign: "center", marginTop: 50 }}>Yükleniyor...</p>;
  }

  // WhatsApp link revize edildi
  const whatsappLink = pageData.whatsapp
    ? `https://wa.me/${pageData.whatsapp.replace(/\D/g, "")}`
    : null;

  return (
    <Box component="main" sx={{ width: "100%", overflowX: "hidden" }}>
      {/* Hero Bölümü */}
      <Hero />

      {/* İletişim Bilgileri Bölümü */}
      <Box sx={{ width: "100%", bgcolor: "#FDF6E3" }}>
        <Container
          maxWidth={false}
          disableGutters
          sx={{
            py: isMobile ? 4 : 8,
            px: 0,
            mx: 0,
            textAlign: "center",
          }}
        >
          <Typography
            variant={isMobile ? "h5" : "h4"}
            align="center"
            gutterBottom
            color={baseColor}
            sx={{ mx: "auto", maxWidth: "90%", mb: isMobile ? 2 : 4 }}
          >
            Bize Ulaşın
          </Typography>

          <div
            dangerouslySetInnerHTML={{ __html: pageData.icerik_html }}
            style={{ color: baseColor, marginBottom: isMobile ? 20 : 30, fontSize: isMobile ? 15 : 16 }}
          />

          <Grid
            container
            spacing={isMobile ? 2 : 4}
            sx={{ mt: isMobile ? 2 : 4, justifyContent: "center", width: "100%", m: 0 }}
          >
            {pageData.adres && (
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={cardSx}>
                  <CardContent>
                    <BusinessIcon sx={iconSx} />
                    <Typography gutterBottom variant="h5" component="div">
                      Adres
                    </Typography>
                    <Typography variant="body2">{pageData.adres}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {pageData.telefon && (
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={cardSx}>
                  <CardContent>
                    <PhoneIcon sx={iconSx} />
                    <Typography gutterBottom variant="h5" component="div">
                      Telefon
                    </Typography>
                    <Button
                      variant="outlined"
                      color="inherit"
                      sx={{
                        color: baseColor,
                        borderColor: baseColor,
                        "&:hover": { borderColor: accentColor, color: accentColor },
                        mt: 1,
                      }}
                      onClick={() => window.open(`tel:${pageData.telefon}`)}
                    >
                      {pageData.telefon}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {whatsappLink && (
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={cardSx}>
                  <CardContent>
                    <WhatsAppIcon sx={iconSx} />
                    <Typography gutterBottom variant="h5" component="div">
                      WhatsApp
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: accentColor,
                        "&:hover": { backgroundColor: "#b58900" },
                        color: "#fff",
                        mt: 1,
                      }}
                      component="a"
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Mesaj Gönder
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>

          {/* Google Maps Bölümü */}
          {pageData.google_maps_link && (
            <Box
              sx={{
                mt: isMobile ? 6 : 10,
                textAlign: "center",
                px: isMobile ? 3 : 6,
                py: 6,
                borderRadius: 2,
                background: "linear-gradient(180deg, #FDF6E3 0%, #F9F1E0 100%)",
                boxShadow: "0 6px 18px rgba(0,0,0,0.07)",
              }}
            >
              <Typography
                variant={isMobile ? "h5" : "h4"}
                gutterBottom
                color={baseColor}
                sx={{ mx: "auto", maxWidth: "90%", mb: 3, fontWeight: 700 }}
              >
                Ofisimizin Konumu
              </Typography>
              <Box
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
                  maxWidth: isMobile ? "100%" : "800px",
                  mx: "auto",
                }}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: pageData.google_maps_link }}
                  style={{ width: "100%", height: isMobile ? "250px" : "450px" }}
                />
              </Box>
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
}
