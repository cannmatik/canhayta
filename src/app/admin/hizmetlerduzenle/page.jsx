"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";
import {
  Box,
  Typography,
  TextField,
  Button,
  Modal,
  Grid,
  InputAdornment,
} from "@mui/material";
import * as Icons from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";

// TipTap editörü (SSR kapalı)
const RichTextEditor = dynamic(() => import("../../components/RichTextEditor"), {
  ssr: false,
});

// Türkçe karakterleri slug'a dönüştüren fonksiyon
const toSlug = (text) => {
  const turkishChars = {
    'İ': 'i',
    'ı': 'i',
    'Ş': 's',
    'ş': 's',
    'Ğ': 'g',
    'ğ': 'g',
    'Ü': 'u',
    'ü': 'u',
    'Ö': 'o',
    'ö': 'o',
    'Ç': 'c',
    'ç': 'c',
  };

  return text
    .toLowerCase()
    .replace(/[İıŞşĞğÜüÖöÇç]/g, (char) => turkishChars[char] || char)
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// Tüm ikonları listeye çeviriyoruz (memoized)
const ikonList = Object.keys(Icons).map((key) => ({
  name: key,
  Component: Icons[key],
}));

export default function HizmetlerDuzenle() {
  const [hizmetler, setHizmetler] = useState([]);
  const [baslik, setBaslik] = useState("");
  const [icerikHTML, setIcerikHTML] = useState("");
  const [anaOzet, setAnaOzet] = useState("");
  const [ikon, setIkon] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState(null);
  const [openIkonModal, setOpenIkonModal] = useState(false);
  const [ikonSearch, setIkonSearch] = useState("");

  const baseColor = "#6B4E31";
  const accentColor = "#D4A017";

  // Filtre edilmiş ikonlar (performans için memoized)
  const filteredIcons = useMemo(() => {
    if (!ikonSearch) return ikonList.slice(0, 100); // İlk 100 ikon göster
    return ikonList.filter((i) =>
      i.name.toLowerCase().includes(ikonSearch.toLowerCase())
    );
  }, [ikonSearch]);

  // Hizmetleri çek
  useEffect(() => {
    const fetchHizmetler = async () => {
      const { data, error } = await supabase
        .from("sayfalar")
        .select("id, baslik, icerik_html, ana_ozet, slug, ikon")
        .like("slug", "hizmetler/%");

      if (!error) setHizmetler(data);
    };
    fetchHizmetler();
  }, []);

  // Kaydet
  const handleSave = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!baslik.trim() || !anaOzet.trim() || !icerikHTML.trim()) {
      setStatus("Lütfen tüm alanları doldurun.");
      return;
    }

    const slug = `hizmetler/${toSlug(baslik)}`;
    const ikonName = ikon?.name || "";

    if (editingId) {
      const { error } = await supabase
        .from("sayfalar")
        .update({
          baslik,
          icerik_html: icerikHTML,
          ana_ozet: anaOzet,
          slug,
          ikon: ikonName,
          yayim_tarihi: new Date().toISOString(), // Güncelleme tarihi
        })
        .eq("id", editingId);

      if (error) setStatus("Hata: " + error.message);
      else {
        setStatus("Hizmet güncellendi ✅");
        setHizmetler(
          hizmetler.map((h) =>
            h.id === editingId
              ? { ...h, baslik, icerik_html: icerikHTML, ana_ozet: anaOzet, slug, ikon: ikonName, yayim_tarihi: new Date().toISOString() }
              : h
          )
        );
        resetForm();
      }
    } else {
      const { data, error } = await supabase
        .from("sayfalar")
        .insert({
          baslik,
          icerik_html: icerikHTML,
          ana_ozet: anaOzet,
          slug,
          ikon: ikonName,
          yayim_tarihi: new Date().toISOString(), // Oluşturma tarihi
        })
        .select()
        .single();

      if (error) setStatus("Hata: " + error.message);
      else {
        setStatus("Hizmet eklendi ✅");
        setHizmetler([...hizmetler, data]);
        resetForm();
      }
    }
  };

  // Düzenle
  const handleEdit = (h) => {
    setBaslik(h.baslik);
    setIcerikHTML(h.icerik_html || "");
    setAnaOzet(h.ana_ozet || "");
    setIkon(ikonList.find((i) => i.name === h.ikon) || null);
    setEditingId(h.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Sil
  const handleDelete = async (id) => {
    const { error } = await supabase.from("sayfalar").delete().eq("id", id);
    if (!error) setHizmetler(hizmetler.filter((h) => h.id !== id));
  };

  // Form reset
  const resetForm = () => {
    setBaslik("");
    setIcerikHTML("");
    setAnaOzet("");
    setIkon(null);
    setEditingId(null);
  };

  // İkon seçici modal aç/kapat
  const handleOpenIkonModal = () => setOpenIkonModal(true);
  const handleCloseIkonModal = () => {
    setOpenIkonModal(false);
    setIkonSearch("");
  };

  // İkon seç
  const handleIkonSelect = (icon) => {
    setIkon(icon);
    handleCloseIkonModal();
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#FDF6E3", px: 4, py: 8 }}>
      <Typography
        variant="h4"
        align="center"
        sx={{ color: baseColor, mb: 6, fontFamily: "'Georgia', serif", fontWeight: 600 }}
      >
        Hizmetleri Düzenle
      </Typography>

      {/* Form */}
      <Box
        component="form"
        onSubmit={handleSave}
        sx={{
          bgcolor: "#F9F1E0",
          p: 4,
          borderRadius: 2,
          maxWidth: 800,
          mx: "auto",
          mb: 6,
          border: `1px solid ${baseColor}20`,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <Typography
          variant="h5"
          sx={{ color: baseColor, mb: 3, fontFamily: "'Georgia', serif", fontWeight: 500 }}
        >
          {editingId ? "Hizmeti Düzenle" : "Yeni Hizmet Ekle"}
        </Typography>

        <TextField
          fullWidth
          label="Başlık"
          value={baslik}
          onChange={(e) => setBaslik(e.target.value)}
          sx={{ mb: 3, bgcolor: "white", borderRadius: 1 }}
        />
        <TextField
          fullWidth
          label="Ana Sayfa Özeti (1-2 cümle)"
          value={anaOzet}
          onChange={(e) => setAnaOzet(e.target.value)}
          sx={{ mb: 3, bgcolor: "white", borderRadius: 1 }}
        />
        <RichTextEditor
          key={editingId || "new"}
          initialHTML={icerikHTML}
          onChange={setIcerikHTML}
        />

        <TextField
          fullWidth
          label="İkon Seç"
          value={ikon?.name || ""}
          InputProps={{
            readOnly: true,
            startAdornment: ikon && (
              <InputAdornment position="start">
                <ikon.Component />
              </InputAdornment>
            ),
          }}
          onClick={handleOpenIkonModal}
          sx={{ mt: 3, bgcolor: "white", borderRadius: 1 }}
        />

        <Button
          type="submit"
          variant="contained"
          sx={{
            mt: 3,
            width: "100%",
            bgcolor: accentColor,
            color: "#FFF",
            fontFamily: "'Georgia', serif",
            "&:hover": { bgcolor: "#B88C14" },
          }}
        >
          {editingId ? "Güncelle" : "Ekle"}
        </Button>

        {status && (
          <Typography
            sx={{ mt: 2, color: baseColor, fontFamily: "'Georgia', serif" }}
          >
            {status}
          </Typography>
        )}
      </Box>

      {/* İkon Seçici Modal */}
      <Modal open={openIkonModal} onClose={handleCloseIkonModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "#F9F1E0",
            p: 4,
            borderRadius: 2,
            width: "80%",
            maxWidth: 800,
            maxHeight: "80vh",
            overflowY: "auto",
            border: `1px solid ${baseColor}20`,
          }}
        >
          <TextField
            fullWidth
            label="İkon Ara"
            value={ikonSearch}
            onChange={(e) => setIkonSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3, bgcolor: "white", borderRadius: 1 }}
          />
          <Grid container spacing={2}>
            {filteredIcons.map((icon) => (
              <Grid item xs={3} key={icon.name}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    p: 1,
                    cursor: "pointer",
                    borderRadius: 1,
                    "&:hover": { bgcolor: `${accentColor}10` },
                  }}
                  onClick={() => handleIkonSelect(icon)}
                >
                  <icon.Component sx={{ fontSize: 40, color: baseColor }} />
                  <Typography
                    variant="caption"
                    align="center"
                    sx={{ fontFamily: "'Georgia', serif" }}
                  >
                    {icon.name}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Modal>

      {/* Mevcut Hizmetler */}
      <Box sx={{ maxWidth: 800, mx: "auto" }}>
        {hizmetler.map((h) => {
          const IconComponent = ikonList.find((i) => i.name === h.ikon)?.Component;
          return (
            <Box
              key={h.id}
              sx={{
                bgcolor: "#F9F1E0",
                p: 2,
                mb: 2,
                borderRadius: 2,
                border: `1px solid ${baseColor}20`,
                display: "flex",
                alignItems: "center",
                gap: 2,
                "&:hover": { bgcolor: `${accentColor}10` },
              }}
            >
              {IconComponent && (
                <IconComponent sx={{ fontSize: 40, color: baseColor }} />
              )}
              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  variant="h6"
                  sx={{ fontFamily: "'Georgia', serif", color: baseColor }}
                >
                  {h.baslik}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: "'Georgia', serif", color: baseColor, opacity: 0.7 }}
                >
                  {h.ana_ozet}
                </Typography>
              </Box>
              <Button
                onClick={() => handleEdit(h)}
                sx={{ fontFamily: "'Georgia', serif", color: baseColor }}
              >
                Düzenle
              </Button>
              <Button
                onClick={() => handleDelete(h.id)}
                color="error"
                sx={{ fontFamily: "'Georgia', serif" }}
              >
                Sil
              </Button>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}