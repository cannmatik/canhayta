"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Container, Typography } from "@mui/material";

export default function Hakkinda() {
  const [sayfa, setSayfa] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("sayfalar")
        .select("baslik, icerik_html, yayim_tarihi")
        .eq("slug", "hakkinda")
        .single();

      if (!error) setSayfa(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <p>Yükleniyor...</p>;
  if (!sayfa) return <p>Hakkında içeriği bulunamadı.</p>;

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h4" gutterBottom align="center" color="#6B4E31">
        {sayfa.baslik}
      </Typography>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: sayfa.icerik_html }}
      />
      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        align="right"
        sx={{ mt: 4 }}
      >
        Güncelleme: {new Date(sayfa.yayim_tarihi).toLocaleDateString("tr-TR")}
      </Typography>
    </Container>
  );
}
