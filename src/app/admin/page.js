"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Box, Container, Typography, Grid, Card, CardContent, Button } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArticleIcon from "@mui/icons-material/Article";

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
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
        <Typography variant="h6" color="textSecondary">Yükleniyor...</Typography>
      </Box>
    );

  const cardStyle = {
    cursor: "pointer",
    borderRadius: 12,
    padding: 3,
    textAlign: "center",
    background: "linear-gradient(135deg, #FDF6E3 0%, #F9F1E0 100%)",
    boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
    "&:hover": {
      transform: "translateY(-6px)",
      boxShadow: "0 14px 32px rgba(107,78,49,0.22)",
    },
  };

  const iconStyle = {
    fontSize: 50,
    mb: 2,
    color: "#6B4E31",
    transition: "transform 0.25s ease",
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(to bottom, #FDF6E3, #F9F1E0)", pt: 10 }}>
      <Container maxWidth="md">
        <Typography variant="h3" align="center" gutterBottom sx={{ color: "#6B4E31", fontWeight: "bold", mb: 6 }}>
          Admin Paneli
        </Typography>
        <Typography variant="h6" align="center" sx={{ mb: 6 }}>
          Hoş geldin, <strong>{user.email}</strong>
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6}>
            <Card sx={cardStyle} onClick={() => router.push("/admin/makale-ekle")}>
              <AddCircleIcon sx={iconStyle} />
              <Typography variant="h6" gutterBottom>
                Makale Ekle
              </Typography>
              <Typography variant="body2">
                Yeni makaleler oluştur ve siteye ekle.
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card sx={cardStyle} onClick={() => router.push("/admin/makaleler")}>
              <ArticleIcon sx={iconStyle} />
              <Typography variant="h6" gutterBottom>
                Tüm Makaleler
              </Typography>
              <Typography variant="body2">
                Mevcut makaleleri görüntüle ve düzenle.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
