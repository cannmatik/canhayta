"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Box, Container, Typography, TextField, Button, Paper } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Giriş başarısız: " + error.message);
    } else {
      router.push("/admin");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom, #FDF6E3, #F9F1E0)",
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: 5,
            borderRadius: 3,
            textAlign: "center",
            background: "#fff",
            boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
            transition: "transform 0.25s ease, box-shadow 0.25s ease",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 14px 32px rgba(107,78,49,0.22)",
            },
          }}
        >
          <LockIcon sx={{ fontSize: 60, color: "#6B4E31", mb: 2 }} />
          <Typography variant="h4" sx={{ color: "#6B4E31", fontWeight: "bold", mb: 4 }}>
            Admin Girişi
          </Typography>

          <form onSubmit={handleLogin}>
            <TextField
              label="E-posta"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              sx={{
                "& .MuiInputBase-root": {
                  backgroundColor: "#F5F5F5",
                  borderRadius: 1,
                },
                "& .Mui-focused": {
                  "& fieldset": {
                    borderColor: "#6B4E31",
                  },
                },
              }}
            />

            <TextField
              label="Şifre"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              sx={{
                "& .MuiInputBase-root": {
                  backgroundColor: "#F5F5F5",
                  borderRadius: 1,
                },
                "& .Mui-focused": {
                  "& fieldset": {
                    borderColor: "#6B4E31",
                  },
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                backgroundColor: "#D4A017",
                color: "#fff",
                py: 1.5,
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#6B4E31" },
                transition: "all 0.3s ease",
              }}
            >
              Giriş Yap
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
