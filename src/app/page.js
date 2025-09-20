"use client";

import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import WorkIcon from "@mui/icons-material/Work";
import GavelIcon from "@mui/icons-material/Gavel";
import BalanceIcon from "@mui/icons-material/Balance";

// Hero component
function Hero() {
  return (
    <section
      className="bg-gradient-to-b from-[#FDF6E3] to-[#F9F1E0] flex flex-col justify-center items-center text-center px-4"
      style={{ minHeight: "60vh" }}
    >
      <h1 className="text-4xl md:text-5xl font-bold text-[#6B4E31] mb-4 md:mb-6 transition-all duration-200 hover:scale-[1.01] hover:drop-shadow-md">
        Hukukta Güven ve Profesyonellik
      </h1>
      <p className="text-base md:text-lg text-[#6B4E31] mb-6 max-w-xl">
        Av. Can Hayta, ticaret hukuku, aile hukuku ve iş hukuku alanlarında uzman danışmanlık hizmeti sunar.
      </p>
    </section>
  );
}

export default function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const baseColor = "#6B4E31"; // Hero ve tema renkleriyle uyumlu
  const accentColor = "#D4A017";

  const cardSx = {
    maxWidth: 345,
    mx: "auto",
    backgroundColor: "#F5E8B7",
    color: baseColor,
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
      {/* Hero Bölümü */}
      <Hero />

      {/* Hizmetlerimiz Bölümü */}
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

          {/* Hakkımızda Bölümü */}
          <Box
            sx={{
              mt: isMobile ? 6 : 10,
              textAlign: "center",
              px: isMobile ? 3 : 6,
              py: 6,
              borderRadius: 2,
              background: "linear-gradient(180deg, #FDF6E3 0%, #F9F1E0 100%)",
              boxShadow: "0 6px 18px rgba(0,0,0,0.07)",
            }}
          >
            <Typography
              variant={isMobile ? "h5" : "h4"}
              gutterBottom
              color={baseColor}
              sx={{ mx: "auto", maxWidth: "90%", mb: 3, fontWeight: 700 }}
            >
              Hakkımızda
            </Typography>

            <Typography
              variant="body1"
              color={baseColor}
              maxWidth="md"
              sx={{ mx: "auto", mb: 2, lineHeight: 1.7, fontSize: isMobile ? 15 : 16 }}
            >
              Av. Can Hayta liderliğinde, 10 yılı aşkın deneyimle ticaret, aile, iş, ceza ve miras hukuku alanlarında
              profesyonel danışmanlık hizmeti sunuyoruz. Müşteri memnuniyeti, güven ve şeffaflık temel ilkelerimizdir.
              Her dava ve danışmanlık süreci için kişiye özel çözümler üretiyor, hukuki süreçleri anlaşılır ve yönetilebilir kılıyoruz.
            </Typography>

            <Typography
              variant="body1"
              color={baseColor}
              maxWidth="md"
              sx={{ mx: "auto", lineHeight: 1.7, fontSize: isMobile ? 15 : 16 }}
            >
              Ekibimiz alanında uzman avukatlardan oluşmakta olup, hukuki süreçlerde etkin ve hızlı çözümler sağlamaktadır.
              Bizimle çalışarak, karmaşık hukuki konuları güvenle yönetebilir ve profesyonel destek alabilirsiniz.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
