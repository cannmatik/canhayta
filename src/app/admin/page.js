"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArticleIcon from "@mui/icons-material/Article";
import InfoIcon from "@mui/icons-material/Info";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import WorkIcon from "@mui/icons-material/Work";

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      } else {
        router.push("/login");
      }
    };
    getUser();
  }, []);

  if (!user)
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        sx={{ bgcolor: "#F9F1E0" }}
      >
        <Typography
          variant="h6"
          color="#6B4E31"
          sx={{ fontFamily: "'Georgia', serif" }}
        >
          Yükleniyor...
        </Typography>
      </Box>
    );

  const cardStyle = {
    cursor: "pointer",
    borderRadius: 12,
    padding: 3,
    textAlign: "center",
    width: 280,
    background: "linear-gradient(135deg, #FDF6E3 0%, #F9F1E0 100%)",
    border: `1px solid #6B4E3120`,
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "linear-gradient(135deg, #F9F1E0 0%, #FDF6E3 100%)",
      transform: "translateY(-4px)",
      boxShadow: "0 6px 16px rgba(107,78,49,0.15)",
      "& svg": {
        color: "#D4A017",
      },
    },
  };

  const iconStyle = {
    fontSize: 50,
    mb: 2,
    color: "#6B4E31",
    transition: "color 0.3s ease",
  };

  const cards = [
    {
      icon: AddCircleIcon,
      title: "Makale Ekle",
      desc: "Yeni makaleler oluştur ve siteye ekle.",
      path: "/admin/makale-ekle",
    },
    {
      icon: ContactMailIcon,
      title: "Mesajlar",
      desc: "Gönderilen iletişim mesajlarını görüntüle ve sil.",
      path: "/admin/iletisim-mesajlari",
    },
    {
      icon: ArticleIcon,
      title: "Tüm Makaleler",
      desc: "Mevcut makaleleri görüntüle ve düzenle.",
      path: "/admin/makaleler",
    },
    {
      icon: InfoIcon,
      title: "Hakkında Sayfası",
      desc: "Site hakkında içeriği görüntüle ve düzenle.",
      path: "/admin/hakkinda",
    },
    {
      icon: ContactMailIcon,
      title: "İletişim Sayfası",
      desc: "İletişim sayfası içeriğini görüntüle ve düzenle.",
      path: "/admin/contact",
    },
    {
      icon: WorkIcon,
      title: "Hizmetleri Düzenle",
      desc: "Hizmetleri ekle, düzenle veya sil.",
      path: "/admin/hizmetlerduzenle",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #F9F1E0, #FDF6E3)",
        pt: 10,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{
            color: "#6B4E31",
            fontWeight: 600,
            mb: 6,
            fontFamily: "'Georgia', serif",
          }}
        >
          Admin Paneli
        </Typography>
        <Typography
          variant="h6"
          align="center"
          sx={{
            mb: 6,
            color: "#6B4E31",
            fontFamily: "'Georgia', serif",
          }}
        >
          Hoş geldin, <strong>{user.email}</strong>
        </Typography>

        <Grid
          container
          spacing={4}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "stretch",
          }}
        >
          {cards.map((card) => (
            <Grid
              item
              key={card.title}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Card
                sx={cardStyle}
                onClick={() => router.push(card.path)}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <card.icon sx={iconStyle} />
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      fontFamily: "'Georgia', serif",
                      color: "#6B4E31",
                    }}
                  >
                    {card.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Georgia', serif",
                      color: "#6B4E31",
                      opacity: 0.7,
                      textAlign: "center",
                    }}
                  >
                    {card.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
