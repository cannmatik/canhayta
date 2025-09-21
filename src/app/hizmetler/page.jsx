"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Box,
  Container,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import * as MuiIcons from "@mui/icons-material";
import Link from "next/link";

// İkonu dinamik olarak çözen fonksiyon
const DynamicIcon = ({ ikonAdi, sx }) => {
  if (!ikonAdi) return <Typography variant="body2">İkon Yok</Typography>;
  const IconComponent = MuiIcons[ikonAdi];
  return IconComponent ? (
    <IconComponent sx={sx} />
  ) : (
    <Typography variant="body2">İkon Yok</Typography>
  );
};

export default function HizmetlerListesi() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [hizmetler, setHizmetler] = useState([]);
  const [loading, setLoading] = useState(true);

  const baseColor = "#6B4E31";
  const accentColor = "#D4A017";

  // Hizmetleri çek
  useEffect(() => {
    const fetchHizmetler = async () => {
      const { data, error } = await supabase
        .from("sayfalar")
        .select("baslik, ana_ozet, slug, ikon")
        .like("slug", "hizmetler/%");

      if (!error && data) {
        setHizmetler(data);
      }
      setLoading(false);
    };
    fetchHizmetler();
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F9F1E0", py: 8 }}>
      <Container maxWidth="md">
        <Typography
          variant={isMobile ? "h5" : "h4"}
          align="center"
          sx={{
            color: baseColor,
            mb: 6,
            fontWeight: 700,
            fontFamily: "'Montserrat', sans-serif",
            letterSpacing: 0.5,
            textTransform: "uppercase",
          }}
        >
          Hizmetlerimiz
        </Typography>

        {loading ? (
          <Typography
            variant="body1"
            color={baseColor}
            align="center"
            sx={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}
          >
            Yükleniyor...
          </Typography>
        ) : hizmetler.length === 0 ? (
          <Typography
            variant="body1"
            color={baseColor}
            align="center"
            sx={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}
          >
            Hizmet bulunamadı.
          </Typography>
        ) : (
          <List
            sx={{
              bgcolor: "#FDF6E3",
              borderRadius: 2,
              border: `1px solid ${baseColor}20`,
              p: 0,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            {hizmetler.map((hizmet, index) => (
              <Box key={hizmet.slug}>
                <ListItem
                  component={Link}
                  href={`/${hizmet.slug}`}
                  sx={{
                    py: 3,
                    px: 4,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor: `${accentColor}10`,
                      "& svg": { color: accentColor },
                    },
                    textDecoration: "none",
                  }}
                >
                  <ListItemIcon>
                    <DynamicIcon
                      ikonAdi={hizmet.ikon}
                      sx={{
                        fontSize: isMobile ? 28 : 36,
                        color: baseColor,
                        transition: "color 0.3s ease",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant={isMobile ? "h6" : "h5"}
                        sx={{
                          color: baseColor,
                          fontWeight: 700,
                          fontFamily: "'Montserrat', sans-serif",
                        }}
                      >
                        {hizmet.baslik}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        sx={{
                          color: baseColor,
                          opacity: 0.7,
                          mt: 0.5,
                          fontFamily: "'Montserrat', sans-serif",
                          maxWidth: "90%",
                        }}
                      >
                        {hizmet.ana_ozet || "Özet bulunamadı."}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < hizmetler.length - 1 && (
                  <Divider sx={{ bgcolor: `${baseColor}20` }} />
                )}
              </Box>
            ))}
          </List>
        )}
      </Container>
    </Box>
  );
}
