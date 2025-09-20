"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Switch, useMediaQuery } from "@mui/material";

export default function Makaleler() {
  const [makaleler, setMakaleler] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery("(max-width:768px)"); // Mobil kontrolü

  const baseColor = "#6B4E31"; // Temel renk
  const accentColor = "#D4A017"; // Hover vurgu rengi

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("Makaleler").select("*");
      if (error) console.error(error);
      else setMakaleler(data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Bu makaleyi silmek istediğine emin misin?")) return;
    const { error } = await supabase.from("Makaleler").delete().eq("id", id);
    if (error) console.error(error);
    else setMakaleler((prev) => prev.filter((m) => m.id !== id));
  };

  const toggleActive = async (id, currentStatus) => {
    const { error } = await supabase
      .from("Makaleler")
      .update({ aktif: !currentStatus })
      .eq("id", id);
    if (error) console.error(error);
    else {
      setMakaleler((prev) =>
        prev.map((m) => (m.id === id ? { ...m, aktif: !currentStatus } : m))
      );
    }
  };

  if (loading)
    return (
      <p className="p-4 text-center text-lg text-[#6B4E31]">Yükleniyor...</p>
    );

  return (
    <section className="px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FDF6E3] to-[#F9F1E0] min-h-[calc(100vh-4rem)]">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-[#6B4E31]">
          Tüm Makaleler
        </h1>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse text-[#6B4E31]">
            <thead>
              <tr className="bg-yellow-50 text-left">
                <th className="p-2 sm:p-3 border-b">Başlık</th>
                {!isMobile && <th className="p-2 sm:p-3 border-b">Yazar</th>}
                {!isMobile && <th className="p-2 sm:p-3 border-b">Tür</th>}
                {!isMobile && <th className="p-2 sm:p-3 border-b">Yayın Tarihi</th>}
                <th className="p-2 sm:p-3 border-b">Durum</th>
                <th className="p-2 sm:p-3 border-b">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {makaleler.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="p-2 sm:p-3 border-b">{m.baslik}</td>
                  {!isMobile && <td className="p-2 sm:p-3 border-b">{m.yazar_id}</td>}
                  {!isMobile && <td className="p-2 sm:p-3 border-b">{m.makale_turu_id}</td>}
                  {!isMobile && (
                    <td className="p-2 sm:p-3 border-b">
                      {new Date(m.yayim_tarihi).toLocaleDateString()}
                    </td>
                  )}
                  <td className="p-2 sm:p-3 border-b">
                    <Switch
                      checked={m.aktif}
                      onChange={() => toggleActive(m.id, m.aktif)}
                      color="success"
                    />
                  </td>
                  <td className="p-2 sm:p-3 border-b flex flex-col sm:flex-row gap-2">
                    <Link
                      href={`/admin/makale-duzenle/${m.id}`}
                      className={`px-3 py-1 rounded text-white text-center sm:text-sm transition duration-300`}
                      style={{ backgroundColor: baseColor }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = accentColor)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = baseColor)
                      }
                    >
                      Düzenle
                    </Link>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className={`px-3 py-1 rounded text-white text-center sm:text-sm transition duration-300`}
                      style={{ backgroundColor: "#D63434" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#FF4C4C")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#D63434")
                      }
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
