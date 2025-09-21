"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Box, Container, Typography, Skeleton } from "@mui/material";
import Head from "next/head";

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

export default function HizmetDetay() {
  const params = useParams();
  const router = useRouter();
  const [hizmet, setHizmet] = useState(null);
  const [loading, setLoading] = useState(true);
  const baseColor = "#6B4E31";

  useEffect(() => {
    if (!params || !params.slug) return;

    const normalizedSlug = toSlug(params.slug);
    const fetchHizmet = async () => {
      const { data, error } = await supabase
        .from("sayfalar")
        .select("baslik, icerik_html, yayim_tarihi, ana_ozet")
        .ilike("slug", `hizmetler/${normalizedSlug}`)
        .single();

      if (error) {
        console.error("Hizmet çekme hatası:", error.message);
      }
      if (data) {
        setHizmet(data);
      }
      setLoading(false);
    };
    fetchHizmet();

    // Eğer slug normalize edilmiş haliyle farklıysa, yönlendir
    if (params.slug !== normalizedSlug) {
      router.replace(`/hizmetler/${normalizedSlug}`);
    }
  }, [params, router]);

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#F9F1E0", py: 8 }}>
        <Container maxWidth="md">
          <Skeleton
            variant="text"
            width="60%"
            height={40}
            sx={{ mx: "auto", mb: 4 }}
          />
          <Skeleton variant="rectangular" height={200} />
          <Skeleton variant="text" width="20%" sx={{ mt: 4, ml: "auto" }} />
        </Container>
      </Box>
    );
  }

  if (!hizmet) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#F9F1E0", py: 8 }}>
        <Container maxWidth="md">
          <Typography
            variant="h6"
            align="center"
            sx={{
              color: baseColor,
              fontFamily: "'Georgia', serif",
              py: 4,
            }}
          >
            Hizmet bulunamadı. Lütfen doğru bir hizmet seçtiğinizden emin olun.
          </Typography>
        </Container>
      </Box>
    );
  }

  return (
    <>
      <Head>
        <title>{hizmet.baslik} - Av. Can Hayta</title>
        <meta
          name="description"
          content={hizmet.ana_ozet || "Av. Can Hayta'nın profesyonel hukuk hizmetleri."}
        />
        <meta
          name="keywords"
          content="hukuk, avukat, hizmet, ticaret hukuku, aile hukuku, iş hukuku"
        />
      </Head>
      <Box sx={{ minHeight: "100vh", bgcolor: "#F9F1E0", py: 8 }}>
        <Container maxWidth="md">
          <Typography
            variant="h4"
            align="center"
            sx={{
              color: baseColor,
              mb: 4,
              fontWeight: 600,
              fontFamily: "'Georgia', serif",
            }}
          >
            {hizmet.baslik}
          </Typography>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: hizmet.icerik_html }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            align="right"
            sx={{ mt: 4, fontFamily: "'Georgia', serif" }}
          >
            Güncelleme: {new Date(hizmet.yayim_tarihi).toLocaleDateString("tr-TR")}
          </Typography>
        </Container>
      </Box>
    </>
  );
}