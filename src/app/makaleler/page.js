"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  useMediaQuery,
  useTheme,
  TextField,
  Pagination,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Makaleler() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const [makaleler, setMakaleler] = useState([]);
  const [filteredMakaleler, setFilteredMakaleler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(isMobile ? 6 : 9); // Mobil için daha az, desktop için 9

  // Renkler
  const baseColor = "#6B4E31";
  const accentColor = "#D4A017";

  // Kart stili (HomePage.jsx'ten uyarlandı)
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
  };

  // Makaleleri çek
  useEffect(() => {
    const fetchMakaleler = async () => {
      try {
        const { data, error } = await supabase
          .from("Makaleler")
          .select(
            `
            id,
            baslik,
            ozet,
            kapak_resmi_url,
            yayim_tarihi,
            seo_slug,
            makale_turleri ("Tur"),
            yazarlar (ad, soyad)
          `
          )
          .order("yayim_tarihi", { ascending: false });

        if (error) throw error;
        setMakaleler(data || []);
        setFilteredMakaleler(data || []);
      } catch (error) {
        console.error("Makale çekme hatası:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMakaleler();
  }, []);

  // Arama filtreleme
  useEffect(() => {
    const filtered = makaleler.filter((makale) =>
      makale.baslik.toLowerCase().includes(searchQuery.toLowerCase()) ||
      makale.ozet?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${makale.yazarlar?.ad} ${makale.yazarlar?.soyad}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      makale.makale_turleri?.["Tur"]?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMakaleler(filtered);
    setCurrentPage(1); // Arama yapınca sayfayı sıfırla
  }, [searchQuery, makaleler]);

  // Pagination hesaplamaları
  const totalPages = Math.ceil(filteredMakaleler.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMakaleler = filteredMakaleler.slice(startIndex, endIndex);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h6" color={baseColor}>
          Yükleniyor...
        </Typography>
      </Box>
    );
  }

  return (
    <Box component="main" sx={{ width: "100%", overflowX: "hidden", pt: 2 }}> {/* Navbar için top padding: 20 (h-16 ~4rem + ekstra) */}
      <Box sx={{ width: "100%", bgcolor: "#FDF6E3" }}>
        <Container
          maxWidth={false}
          disableGutters
          sx={{
            py: isMobile ? 4 : 8,
            px: 0,
            textAlign: "center",
          }}
        >
          <Typography
            variant={isMobile ? "h5" : "h4"}
            align="center"
            gutterBottom
            color={baseColor}
            sx={{ mx: "auto", maxWidth: "90%" }}
          >
            Makaleler
          </Typography>

          {/* Arama Alanı */}
          <Box sx={{ mb: 4, maxWidth: 600, mx: "auto" }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Makale, yazar veya tür ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: baseColor }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2, backgroundColor: "white" },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
          </Box>

          <Grid
            container
            spacing={isMobile ? 2 : 4}
            sx={{ mt: isMobile ? 2 : 4, justifyContent: "center", width: "100%", m: 0 }}
          >
            {currentMakaleler.length === 0 ? (
              <Typography variant="body1" color={baseColor} sx={{ gridColumn: "1 / -1" }}>
                Arama kriterlerinize uygun makale bulunamadı.
              </Typography>
            ) : (
              currentMakaleler.map((makale) => (
                <Grid item xs={12} sm={6} md={4} key={makale.id}>
                  <Card
                    sx={cardSx}
                    onClick={() => router.push(`/makaleler/${makale.seo_slug}`)}
                  >
                    {makale.kapak_resmi_url && (
                      <CardMedia
                        component="img"
                        height="140"
                        image={makale.kapak_resmi_url}
                        alt={makale.baslik}
                        sx={{ borderRadius: 2, mb: 2 }}
                      />
                    )}
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="div">
                        {makale.baslik}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {makale.ozet || "Özet mevcut değil."}
                      </Typography>
                      <Typography variant="caption" color={baseColor} sx={{ mt: 1, display: "block" }}>
                        Yazar: {makale.yazarlar?.ad || ""} {makale.yazarlar?.soyad || ""}
                      </Typography>
                      <Typography variant="caption" color={baseColor}>
                        Tür: {makale.makale_turleri?.["Tur"] || "Bilinmiyor"}
                      </Typography>
                      <Typography variant="caption" color={baseColor} sx={{ display: "block" }}>
                        Yayın: {new Date(makale.yayim_tarihi).toLocaleDateString("tr-TR")}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ mt: 6, display: "flex", justifyContent: "center" }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: baseColor,
                  },
                  "& .MuiPaginationItem-root.Mui-selected": {
                    backgroundColor: accentColor,
                    color: "white",
                  },
                }}
              />
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
}