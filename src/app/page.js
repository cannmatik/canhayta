"use client";

import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
  Button,
  CardActionArea,
} from "@mui/material";
import * as MuiIcons from "@mui/icons-material"; // ✅ tüm ikonlar
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

// İkonu dinamik resolve eden fonksiyon
const DynamicIcon = ({ ikonAdi, sx }) => {
  if (!ikonAdi) return <Typography variant="body2">İkon Yok</Typography>;
  const IconComponent = MuiIcons[ikonAdi];
  return IconComponent ? (
    <IconComponent sx={sx} />
  ) : (
    <Typography variant="body2">İkon Yok</Typography>
  );
};

// Hero component
function Hero() {
  return (
    <section
      className="bg-gradient-to-b from-[#FDF6E3] to-[#F9F1E0] flex flex-col justify-center items-center text-center px-4"
      style={{ minHeight: "60vh" }}
    >
      <h1 className="text-4xl md:text-5xl font-bold text-[#6B4E31] mb-4 md:mb-6 transition-all duration-200 hover:scale-[1.01] hover:drop-shadow-md">
        Hukukta Güven ve Profesyonellik
      </h1>
      <p className="text-base md:text-lg text-[#6B4E31] mb-6 max-w-xl">
        Av. Can Hayta, ticaret hukuku, aile hukuku ve iş hukuku alanlarında
        uzman danışmanlık hizmeti sunar.
      </p>
    </section>
  );
}

export default function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [hizmetler, setHizmetler] = useState([]);
  const [aboutSummary, setAboutSummary] = useState("");
  const [loading, setLoading] = useState(true);

  const baseColor = "#6B4E31";
  const accentColor = "#D4A017";

  const cardSx = {
    width: "100%",
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
    display: "flex",
    flexDirection: "column",
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
      // Hizmetleri çek
      const { data: hizmetlerData, error: hizmetlerError } = await supabase
        .from("sayfalar")
        .select("baslik, ana_ozet, slug, ikon")
        .like("slug", "hizmetler/%");

      if (!hizmetlerError && hizmetlerData) {
        setHizmetler(hizmetlerData);
      }

      // Hakkında özet sayfasını çek
      const { data: ozetData, error: ozetError } = await supabase
        .from("sayfalar")
        .select("icerik_html")
        .eq("slug", "hakkinda_ozet")
        .single();

      if (!ozetError && ozetData) {
        const plainText = ozetData.icerik_html.replace(/<[^>]+>/g, "");
        setAboutSummary(plainText);
      }

      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <Box component="main" sx={{ width: "100%", overflowX: "hidden" }}>
      {/* Hero Bölümü */}
      <Hero />

      {/* Hizmetlerimiz Bölümü */}
      <Box sx={{ width: "100%", bgcolor: "#FDF6E3" }}>
        <Container
          maxWidth={false}
          disableGutters
          sx={{
            py: isMobile ? 4 : 8,
            px: isMobile ? 2 : 4,
            mx: 0,
            textAlign: "center",
          }}
        >
          <Typography
            variant={isMobile ? "h5" : "h4"}
            align="center"
            gutterBottom
            color={baseColor}
            sx={{ mx: "auto", maxWidth: "90%", mb: 4 }}
          >
            Hizmetlerimiz
          </Typography>

          {loading ? (
            <Typography variant="body1" color={baseColor}>
              Yükleniyor...
            </Typography>
          ) : hizmetler.length === 0 ? (
            <Typography variant="body1" color={baseColor}>
              Hizmet bulunamadı.
            </Typography>
          ) : (
            <Grid
              container
              spacing={isMobile ? 2 : 4}
              sx={{
                mt: isMobile ? 2 : 4,
                justifyContent: "center",
                alignItems: "stretch",
              }}
            >
              {hizmetler.map((hizmet) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={hizmet.slug}
                  sx={{ display: "flex" }}
                >
                  <Card sx={cardSx}>
                    <CardActionArea
                      component={Link}
                      href={`/${hizmet.slug}`}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textDecoration: "none",
                        height: "100%",
                      }}
                    >
                      <CardContent
                        sx={{
                          flexGrow: 1,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <DynamicIcon ikonAdi={hizmet.ikon} sx={iconSx} />
                        <Typography
                          gutterBottom
                          variant="h5"
                          component="div"
                          sx={{ mt: 1 }}
                        >
                          {hizmet.baslik}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: "90%",
                            wordBreak: "break-word",
                            mt: 1,
                          }}
                        >
                          {hizmet.ana_ozet || "Özet bulunamadı."}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Hakkımızda Bölümü */}
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
              sx={{
                mx: "auto",
                maxWidth: "90%",
                mb: 3,
                fontWeight: 700,
              }}
            >
              Hakkımızda
            </Typography>

            {loading ? (
              <Typography variant="body1" color={baseColor}>
                Yükleniyor...
              </Typography>
            ) : aboutSummary ? (
              <>
                <Typography
                  variant="body1"
                  color={baseColor}
                  maxWidth="md"
                  sx={{
                    mx: "auto",
                    mb: 3,
                    lineHeight: 1.7,
                    fontSize: isMobile ? 15 : 16,
                  }}
                >
                  {aboutSummary}
                </Typography>
                <Button
                  variant="contained"
                  component={Link}
                  href="/hakkinda"
                  sx={{
                    mt: 3,
                    backgroundColor: accentColor,
                    color: "#FFF",
                    "&:hover": { backgroundColor: "#B88C14" },
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                  }}
                >
                  Detaylı Bilgi
                </Button>
              </>
            ) : (
              <Typography variant="body1" color={baseColor}>
                Hakkında özet içeriği bulunamadı.
              </Typography>
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
