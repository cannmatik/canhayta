"use client";

import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Hero from "./components/hero";
import BusinessIcon from "@mui/icons-material/Business";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import WorkIcon from "@mui/icons-material/Work";
import GavelIcon from "@mui/icons-material/Gavel";
import BalanceIcon from "@mui/icons-material/Balance";
import InfoIcon from "@mui/icons-material/Info";
import ContactMailIcon from "@mui/icons-material/ContactMail";

export default function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Renkler (JS sabitleri)
  const baseColor = "#6B4E31";   // Hero başlığı ile aynı
  const accentColor = "#D4A017"; // Hover vurgu rengi

  // TS YOK: Normal JS nesneleri
  const cardSx = {
    maxWidth: 345,
    mx: "auto",
    backgroundColor: "#F5E8B7",
    color: baseColor, // Yazılar/ikonlar default rengi
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
    "&:hover svg": {
      color: accentColor,
      transform: "scale(1.06)",
    },
  };

  const iconSx = {
    fontSize: 60,
    mb: 2,
    color: baseColor,
    transition: "color 200ms ease, transform 200ms ease",
  };

  return (
    <Box component="main" sx={{ width: "100%", overflowX: "hidden" }}>
      <Hero />

      {/* Arka planlı bölüm tam genişlik */}
      <Box sx={{ width: "100%", bgcolor: "#FDF6E3" }}>
        <Container
          maxWidth={false}
          disableGutters
          sx={{
            py: isMobile ? 4 : 8,
            px: 0,
            mx: 0,
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
            Hizmetlerimiz
          </Typography>

          <Grid
            container
            spacing={isMobile ? 2 : 4}
            sx={{ mt: isMobile ? 2 : 4, justifyContent: "center", width: "100%", m: 0 }}
          >
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={cardSx}>
                <CardContent>
                  <BusinessIcon sx={iconSx} />
                  <Typography gutterBottom variant="h5" component="div">
                    Ticaret Hukuku
                  </Typography>
                  <Typography variant="body2">
                    Uzman kadromuzla ticari anlaşmazlıklarınızı çözüyoruz.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card sx={cardSx}>
                <CardContent>
                  <FamilyRestroomIcon sx={iconSx} />
                  <Typography gutterBottom variant="h5" component="div">
                    Aile Hukuku
                  </Typography>
                  <Typography variant="body2">
                    Ailevi konularda profesyonel destek sunuyoruz.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card sx={cardSx}>
                <CardContent>
                  <WorkIcon sx={iconSx} />
                  <Typography gutterBottom variant="h5" component="div">
                    İş Hukuku
                  </Typography>
                  <Typography variant="body2">
                    İşçi-işveren uyuşmazlıklarında yanınızdayız.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card sx={cardSx}>
                <CardContent>
                  <GavelIcon sx={iconSx} />
                  <Typography gutterBottom variant="h5" component="div">
                    Ceza Hukuku
                  </Typography>
                  <Typography variant="body2">
                    Ceza davalarında güçlü savunma sağlıyoruz.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card sx={cardSx}>
                <CardContent>
                  <BalanceIcon sx={iconSx} />
                  <Typography gutterBottom variant="h5" component="div">
                    Miras Hukuku
                  </Typography>
                  <Typography variant="body2">
                    Miras davalarında adil çözümler sunuyoruz.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mt: isMobile ? 4 : 8, textAlign: "center" }}>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              gutterBottom
              color={baseColor}
              sx={{ mx: "auto", maxWidth: "90%" }}
            >
              Hakkımızda
            </Typography>
            <Typography variant="body1" color="text.secondary" maxWidth="md" sx={{ mx: "auto" }}>
              Av. Can Hayta liderliğinde, 10 yılı aşkın deneyimle hukuki çözümler sunuyoruz.
              Müşteri memnuniyeti ve güven ilkemizdir.
            </Typography>
            <Button
              variant="contained"
              sx={{
                mt: 4,
                backgroundColor: baseColor,
                "&:hover": { backgroundColor: accentColor },
              }}
              href="/about"
              startIcon={<InfoIcon />}
            >
              Daha Fazla Bilgi
            </Button>
          </Box>

          <Box sx={{ mt: isMobile ? 4 : 8, textAlign: "center" }}>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              gutterBottom
              color={baseColor}
              sx={{ mx: "auto", maxWidth: "90%" }}
            >
              İletişim
            </Typography>
            <Button
              variant="contained"
              startIcon={<ContactMailIcon />}
              sx={{
                mt: 2,
                backgroundColor: baseColor,
                "&:hover": { backgroundColor: accentColor },
              }}
              href="/contact"
            >
              Bize Ulaşın
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}