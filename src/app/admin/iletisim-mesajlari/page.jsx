"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Box, Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, IconButton, CircularProgress, Alert } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function IletisimMesajlari() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("iletisim_mesajlari").select("*").order("created_at", { ascending: false });
    if (error) {
      setError("Mesajlar yüklenirken hata oluştu.");
    } else {
      setMessages(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Bu mesajı silmek istediğinize emin misiniz?")) return;
    const { error } = await supabase.from("iletisim_mesajlari").delete().eq("id", id);
    if (error) {
      setError("Mesaj silinirken hata oluştu.");
    } else {
      setSuccessMsg("Mesaj başarıyla silindi!");
      fetchMessages();
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h4" gutterBottom sx={{ color: "#6B4E31", fontFamily: "'Georgia', serif", mb: 4 }}>
        Gönderilen Mesajlar
      </Typography>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {successMsg && <Alert severity="success" onClose={() => setSuccessMsg("")}>{successMsg}</Alert>}

      {!loading && messages.length === 0 && <Typography>Hiç mesaj bulunamadı.</Typography>}

      {!loading && messages.length > 0 && (
        <Table sx={{ minWidth: 650, bgcolor: "#FDF6E3", borderRadius: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>Ad Soyad</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefon</TableCell>
              <TableCell>Konu</TableCell>
              <TableCell>Mesaj</TableCell>
              <TableCell>Gönderim Tarihi</TableCell>
              <TableCell>İşlem</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {messages.map((msg) => (
              <TableRow key={msg.id}>
                <TableCell>{msg.ad_soyad}</TableCell>
                <TableCell>{msg.email}</TableCell>
                <TableCell>{msg.telefon}</TableCell>
                <TableCell>{msg.konu}</TableCell>
                <TableCell>{msg.mesaj}</TableCell>
                <TableCell>{new Date(msg.created_at).toLocaleString()}</TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => handleDelete(msg.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Container>
  );
}
