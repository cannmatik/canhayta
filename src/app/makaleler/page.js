"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Pagination,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  CardMedia,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { Masonry } from "@mui/lab";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Makaleler() {
  const theme = useTheme();
  const isMobileQuery = useMediaQuery(theme.breakpoints.down("md"));
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  const [makaleler, setMakaleler] = useState([]);
  const [filteredMakaleler, setFilteredMakaleler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  const [turler, setTurler] = useState([]);
  const [yazarlar, setYazarlar] = useState([]);
  const [selectedTur, setSelectedTur] = useState("");
  const [selectedYazar, setSelectedYazar] = useState("");

  const baseColor = "#6B4E31";
  const accentColor = "#D4A017";

  const cardSx = {
    width: "100%",
    backgroundColor: "#F5E8B7",
    color: baseColor,
    textAlign: "center",
    borderRadius: 2,
    p: 2.5,
    boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
    transition: "transform 220ms ease, box-shadow 220ms ease",
    cursor: "pointer",
    "&:hover": {
      transform: "translateY(-6px)",
      boxShadow: "0 14px 32px rgba(107,78,49,0.22)",
    },
  };

  useEffect(() => {
    setIsMobile(isMobileQuery);
    setItemsPerPage(isMobileQuery ? 6 : 9);
  }, [isMobileQuery]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: makaleData, error: makaleError } = await supabase
          .from("Makaleler")
          .select(`
            id,
            baslik,
            ozet,
            kapak_resmi_url,
            yayim_tarihi,
            seo_slug,
            makale_turleri (id, Tur),
            yazarlar (id, ad, soyad)
          `)
          .eq("aktif", true)
          .order("yayim_tarihi", { ascending: false });
        if (makaleError) throw makaleError;
        setMakaleler(makaleData || []);
        setFilteredMakaleler(makaleData || []);

        const { data: turData } = await supabase.from("makale_turleri").select("*");
        setTurler(turData || []);

        const { data: yazarData } = await supabase.from("yazarlar").select("*");
        setYazarlar(yazarData || []);
      } catch (error) {
        console.error("Veri çekme hatası:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = makaleler.filter((makale) => {
      const matchesSearch =
        makale.baslik.toLowerCase().includes(searchQuery.toLowerCase()) ||
        makale.ozet?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${makale.yazarlar?.ad || ""} ${makale.yazarlar?.soyad || ""}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        makale.makale_turleri?.Tur?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTur = selectedTur ? makale.makale_turleri?.id === selectedTur : true;
      const matchesYazar = selectedYazar ? makale.yazarlar?.id === selectedYazar : true;

      return matchesSearch && matchesTur && matchesYazar;
    });
    setFilteredMakaleler(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedTur, selectedYazar, makaleler]);

  const totalPages = Math.ceil(filteredMakaleler.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMakaleler = filteredMakaleler.slice(startIndex, endIndex);

  const handlePageChange = (event, page) => setCurrentPage(page);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography
          variant="h6"
          color={baseColor}
          sx={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}
        >
          Yükleniyor...
        </Typography>
      </Box>
    );
  }

  return (
    <Box component="main" sx={{ width: "100%", overflowX: "hidden", pt: 2, bgcolor: "#FDF6E3" }}>
      <Container
        maxWidth="lg"
        sx={{
          py: isMobile ? 4 : 8,
          px: isMobile ? 2 : 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          align="center"
          gutterBottom
          color={baseColor}
          sx={{ mb: 4, width: "100%", fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}
        >
          Makaleler
        </Typography>

        {/* Filtreler */}
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 2,
            mb: 4,
            width: "100%",
            justifyContent: "center",
          }}
        >
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
          />

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id="tur-select-label">Makale Türü</InputLabel>
            <Select
              labelId="tur-select-label"
              value={selectedTur}
              label="Makale Türü"
              onChange={(e) => setSelectedTur(e.target.value)}
            >
              <MenuItem value="">Tümü</MenuItem>
              {turler.map((tur) => (
                <MenuItem key={tur.id} value={tur.id}>
                  {tur.Tur}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id="yazar-select-label">Yazar</InputLabel>
            <Select
              labelId="yazar-select-label"
              value={selectedYazar}
              label="Yazar"
              onChange={(e) => setSelectedYazar(e.target.value)}
            >
              <MenuItem value="">Tümü</MenuItem>
              {yazarlar.map((yazar) => (
                <MenuItem key={yazar.id} value={yazar.id}>
                  {yazar.ad} {yazar.soyad}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Makale Kartları */}
        <Box sx={{ width: "100%" }}>
          {currentMakaleler.length === 0 ? (
            <Typography
              variant="body1"
              color={baseColor}
              align="center"
              sx={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}
            >
              Arama kriterlerinize uygun makale bulunamadı.
            </Typography>
          ) : (
            <Masonry
              columns={{ xs: 1, sm: 2, md: 3 }}
              spacing={isMobile ? 2 : 4}
              sx={{ width: "100%", m: 0 }}
            >
              {currentMakaleler.map((makale) => (
                <Card
                  key={makale.id}
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
                  <CardContent sx={{ p: 1, "&:last-child": { pb: 2 } }}>
                    <Typography
                      gutterBottom
                      variant="h6"
                      sx={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}
                    >
                      {makale.baslik}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2, fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {makale.ozet?.substring(0, 100) +
                        (makale.ozet?.length > 100 ? "..." : "") || "Özet mevcut değil."}
                    </Typography>
                    <Typography
                      variant="caption"
                      color={baseColor}
                      sx={{ display: "block", fontFamily: "'Montserrat', sans-serif" }}
                    >
                      Yazar: {makale.yazarlar?.ad || ""} {makale.yazarlar?.soyad || ""}
                    </Typography>
                    <Typography
                      variant="caption"
                      color={baseColor}
                      sx={{ display: "block", fontFamily: "'Montserrat', sans-serif" }}
                    >
                      Tür: {makale.makale_turleri?.["Tur"] || "Bilinmiyor"}
                    </Typography>
                    <Typography
                      variant="caption"
                      color={baseColor}
                      sx={{ display: "block", mt: 0.5, fontFamily: "'Montserrat', sans-serif" }}
                    >
                      Yayın: {new Date(makale.yayim_tarihi).toLocaleDateString("tr-TR")}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Masonry>
          )}
        </Box>

        {totalPages > 1 && (
          <Box sx={{ mt: 6, display: "flex", justifyContent: "center", width: "100%" }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              sx={{
                "& .MuiPaginationItem-root": { color: baseColor },
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
  );
}
