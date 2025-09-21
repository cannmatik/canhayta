"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
} from "@mui/material";

// Sık kullanılan ikonlar
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// İkon listesi
const ikonList = [
  { name: "Add", Component: AddIcon },
  { name: "Edit", Component: EditIcon },
  { name: "Delete", Component: DeleteIcon },
];

// Türkçe karakterleri slug’a dönüştüren fonksiyon
const toSlug = (text) => {
  const turkishChars = {
    İ: "i",
    ı: "i",
    Ş: "s",
    ş: "s",
    Ğ: "g",
    ğ: "g",
    Ü: "u",
    ü: "u",
    Ö: "o",
    ö: "o",
    Ç: "c",
    ç: "c",
  };
  return text
    .toLowerCase()
    .replace(/[İıŞşĞğÜüÖöÇç]/g, (char) => turkishChars[char] || char)
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

// TipTap editörü (SSR kapalı)
const RichTextEditor = dynamic(
  () => import("../../components/RichTextEditor"),
  { ssr: false }
);

export default function HizmetlerDuzenle() {
  const [hizmetler, setHizmetler] = useState([]);
  const [baslik, setBaslik] = useState("");
  const [icerikHTML, setIcerikHTML] = useState("");
  const [anaOzet, setAnaOzet] = useState("");
  const [ikon, setIkon] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState(null);

  const baseColor = "#6B4E31";
  const accentColor = "#D4A017";

  // Dinamik component render helper
  const getIconComponent = (name) => {
    const found = ikonList.find((i) => i.name === name);
    return found ? found.Component : null;
  };

  // Hizmetleri çek
  useEffect(() => {
    const fetchHizmetler = async () => {
      try {
        const { data, error } = await supabase
          .from("sayfalar")
          .select("id, baslik, icerik_html, ana_ozet, slug, ikon")
          .like("slug", "hizmetler/%");

        if (error) throw error;
        setHizmetler(data);
      } catch (error) {
        console.error("Hizmetler çekilirken hata:", error.message);
        setStatus("Hata: Hizmetler yüklenemedi.");
      }
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
    const ikonName = ikon?.trim() || "";

    try {
      if (editingId) {
        const { error } = await supabase
          .from("sayfalar")
          .update({
            baslik,
            icerik_html: icerikHTML,
            ana_ozet: anaOzet,
            slug,
            ikon: ikonName,
            yayim_tarihi: new Date().toISOString(),
          })
          .eq("id", editingId);

        if (error) throw error;
        setStatus("Hizmet güncellendi ✅");
        setHizmetler(
          hizmetler.map((h) =>
            h.id === editingId
              ? { ...h, baslik, icerik_html: icerikHTML, ana_ozet: anaOzet, slug, ikon: ikonName }
              : h
          )
        );
      } else {
        const { data, error } = await supabase
          .from("sayfalar")
          .insert({
            baslik,
            icerik_html: icerikHTML,
            ana_ozet: anaOzet,
            slug,
            ikon: ikonName,
            yayim_tarihi: new Date().toISOString(),
          })
          .select()
          .single();
        if (error) throw error;
        setStatus("Hizmet eklendi ✅");
        setHizmetler([...hizmetler, data]);
      }
      resetForm();
    } catch (error) {
      setStatus("Hata: " + error.message);
    }
  };

  // Düzenle
  const handleEdit = (h) => {
    setBaslik(h.baslik);
    setIcerikHTML(h.icerik_html || "");
    setAnaOzet(h.ana_ozet || "");
    setIkon(h.ikon || "");
    setEditingId(h.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Sil
  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from("sayfalar").delete().eq("id", id);
      if (error) throw error;
      setHizmetler(hizmetler.filter((h) => h.id !== id));
    } catch (error) {
      setStatus("Hata: " + error.message);
    }
  };

  // Form reset
  const resetForm = () => {
    setBaslik("");
    setIcerikHTML("");
    setAnaOzet("");
    setIkon("");
    setEditingId(null);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#FDF6E3", px: 4, py: 8 }}>
      <Typography variant="h4" align="center" sx={{ color: baseColor, mb: 6, fontFamily: "'Georgia', serif", fontWeight: 600 }}>
        Hizmetleri Düzenle
      </Typography>

      {/* Form */}
      <Box component="form" onSubmit={handleSave} sx={{ bgcolor: "#F9F1E0", p: 4, borderRadius: 2, maxWidth: 800, mx: "auto", mb: 6, border: `1px solid ${baseColor}20`, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <Typography variant="h5" sx={{ color: baseColor, mb: 3, fontFamily: "'Georgia', serif", fontWeight: 500 }}>
          {editingId ? "Hizmeti Düzenle" : "Yeni Hizmet Ekle"}
        </Typography>

        <TextField fullWidth label="Başlık" value={baslik} onChange={(e) => setBaslik(e.target.value)} sx={{ mb: 3, bgcolor: "white", borderRadius: 1 }} />
        <TextField fullWidth label="Ana Sayfa Özeti (1-2 cümle)" value={anaOzet} onChange={(e) => setAnaOzet(e.target.value)} sx={{ mb: 3, bgcolor: "white", borderRadius: 1 }} />
        <RichTextEditor key={editingId || "new"} initialHTML={icerikHTML} onChange={setIcerikHTML} />

        <TextField
          fullWidth
          label="İkon İsmi (MUI ikon adı)"
          value={ikon}
          InputProps={{
            startAdornment: ikon ? (
              <InputAdornment position="start">
                {(() => {
                  const IconComp = getIconComponent(ikon);
                  return IconComp ? <IconComp /> : null;
                })()}
              </InputAdornment>
            ) : null,
          }}
          onChange={(e) => setIkon(e.target.value)}
          sx={{ mt: 3, bgcolor: "white", borderRadius: 1 }}
          helperText="İkon ismini https://mui.com/material-ui/material-icons/ adresinden bulabilirsiniz"
        />

        <Button type="submit" variant="contained" sx={{ mt: 3, width: "100%", bgcolor: accentColor, color: "#FFF", fontFamily: "'Georgia', serif", "&:hover": { bgcolor: "#B88C14" } }}>
          {editingId ? "Güncelle" : "Ekle"}
        </Button>

        {status && <Typography sx={{ mt: 2, color: baseColor, fontFamily: "'Georgia', serif" }}>{status}</Typography>}
      </Box>

      {/* Mevcut Hizmetler */}
      <Box sx={{ maxWidth: 800, mx: "auto" }}>
        {hizmetler.map((h) => {
          const IconComp = getIconComponent(h.ikon);
          return (
            <Box key={h.id} sx={{ bgcolor: "#F9F1E0", p: 2, mb: 2, borderRadius: 2, border: `1px solid ${baseColor}20`, display: "flex", alignItems: "center", gap: 2, "&:hover": { bgcolor: `${accentColor}10` } }}>
              {IconComp && <IconComp sx={{ fontSize: 40, color: baseColor }} />}
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" sx={{ fontFamily: "'Georgia', serif", color: baseColor }}>{h.baslik}</Typography>
                <Typography variant="body2" sx={{ fontFamily: "'Georgia', serif", color: baseColor, opacity: 0.7 }}>{h.ana_ozet}</Typography>
              </Box>
              <Button onClick={() => handleEdit(h)} sx={{ fontFamily: "'Georgia', serif", color: baseColor }}>Düzenle</Button>
              <Button onClick={() => handleDelete(h.id)} color="error" sx={{ fontFamily: "'Georgia', serif" }}>Sil</Button>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
