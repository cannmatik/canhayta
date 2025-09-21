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
import SearchIcon from "@mui/icons-material/Search";

// Örnek import: Sık kullanılan ikonlar
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// İkon listesi (modalda sadece DB’de kullanılanlar gösterilecek)
const ikonList = [
  { name: "Add", Component: AddIcon },
  { name: "Edit", Component: EditIcon },
  { name: "Delete", Component: DeleteIcon },
];

// Türkçe karakterleri slug’a dönüştüren fonksiyon
const toSlug = (text) => {
  const turkishChars = {
    'İ': 'i','ı': 'i','Ş': 's','ş': 's',
    'Ğ': 'g','ğ': 'g','Ü': 'u','ü': 'u',
    'Ö': 'o','ö': 'o','Ç': 'c','ç': 'c',
  };
  return text
    .toLowerCase()
    .replace(/[İıŞşĞğÜüÖöÇç]/g, (char) => turkishChars[char] || char)
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// TipTap editörü (SSR kapalı)
const RichTextEditor = dynamic(() => import("../../components/RichTextEditor"), { ssr: false });

export default function HizmetlerDuzenle() {
  const [hizmetler, setHizmetler] = useState([]);
  const [baslik, setBaslik] = useState("");
  const [icerikHTML, setIcerikHTML] = useState("");
  const [anaOzet, setAnaOzet] = useState("");
  const [ikon, setIkon] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState(null);
  const [openIkonModal, setOpenIkonModal] = useState(false);
  const [ikonSearch, setIkonSearch] = useState("");

  const baseColor = "#6B4E31";
  const accentColor = "#D4A017";

  // DB’deki aktif ikon isimlerini al
  const activeIcons = useMemo(() => {
    const usedIconNames = [...new Set(hizmetler.map((h) => h.ikon).filter(Boolean))];
    return ikonList.filter((icon) => usedIconNames.includes(icon.name));
  }, [hizmetler]);

  // Arama ile filtreleme
  const filteredIcons = useMemo(() => {
    if (!ikonSearch) return activeIcons;
    return activeIcons.filter((i) =>
      i.name.toLowerCase().includes(ikonSearch.toLowerCase())
    );
  }, [ikonSearch, activeIcons]);

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
          .update({ baslik, icerik_html: icerikHTML, ana_ozet: anaOzet, slug, ikon: ikonName, yayim_tarihi: new Date().toISOString() })
          .eq("id", editingId);

        if (error) throw error;
        setStatus("Hizmet güncellendi ✅");
        setHizmetler(hizmetler.map(h => h.id === editingId ? { ...h, baslik, icerik_html: icerikHTML, ana_ozet: anaOzet, slug, ikon: ikonName } : h));
      } else {
        const { data, error } = await supabase
          .from("sayfalar")
          .insert({ baslik, icerik_html: icerikHTML, ana_ozet: anaOzet, slug, ikon: ikonName, yayim_tarihi: new Date().toISOString() })
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
      setHizmetler(hizmetler.filter(h => h.id !== id));
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

  // Modal aç/kapat
  const handleOpenIkonModal = () => setOpenIkonModal(true);
  const handleCloseIkonModal = () => {
    setOpenIkonModal(false);
    setIkonSearch("");
  };

  const handleIkonSelect = (icon) => {
    setIkon(icon.name);
    handleCloseIkonModal();
  };

  // Dinamik component render için helper
  const getIconComponent = (name) => {
    const found = ikonList.find(i => i.name === name);
    return found ? found.Component : null;
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
          label="İkon Seç / Yazın (MUI ikon ismi)"
          value={ikon}
          InputProps={{
            readOnly: false,
            startAdornment: ikon && (() => {
              const IconComp = getIconComponent(ikon);
              return IconComp ? <InputAdornment position="start"><IconComp /></InputAdornment> : null;
            })(),
          }}
          onClick={handleOpenIkonModal}
          onChange={(e) => setIkon(e.target.value)}
          sx={{ mt: 3, bgcolor: "white", borderRadius: 1 }}
          helperText="Yeni ikon eklemek için https://mui.com/material-ui/material-icons/ adresinden ismini bulup yazabilirsiniz"
        />

        <Button type="submit" variant="contained" sx={{ mt: 3, width: "100%", bgcolor: accentColor, color: "#FFF", fontFamily: "'Georgia', serif", "&:hover": { bgcolor: "#B88C14" } }}>
          {editingId ? "Güncelle" : "Ekle"}
        </Button>

        {status && <Typography sx={{ mt: 2, color: baseColor, fontFamily: "'Georgia', serif" }}>{status}</Typography>}
      </Box>

      {/* İkon Modal */}
      <Modal open={openIkonModal} onClose={handleCloseIkonModal}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", bgcolor: "#F9F1E0", p: 4, borderRadius: 2, width: "80%", maxWidth: 800, maxHeight: "80vh", overflowY: "auto", border: `1px solid ${baseColor}20` }}>
          <TextField
            fullWidth
            label="İkon İsmini Yaz"
            value={ikonSearch}
            onChange={(e) => setIkonSearch(e.target.value)}
            InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }}
            sx={{ mb: 3, bgcolor: "white", borderRadius: 1 }}
          />
          <Grid container spacing={2}>
            {filteredIcons.map((icon) => (
              <Grid item xs={3} key={icon.name}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 1, cursor: "pointer", borderRadius: 1, "&:hover": { bgcolor: `${accentColor}10` } }}
                  onClick={() => handleIkonSelect(icon)}
                >
                  <icon.Component sx={{ fontSize: 40, color: baseColor }} />
                  <Typography variant="caption" align="center" sx={{ fontFamily: "'Georgia', serif" }}>{icon.name}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Modal>

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
