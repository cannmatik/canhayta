"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function Makaleler() {
  const [makaleler, setMakaleler] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p className="p-4">Yükleniyor...</p>;

  return (
    <section className="px-4 bg-gradient-to-b from-[#FDF6E3] to-[#F9F1E0] min-h-[calc(100vh-4rem)]">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-[#6B4E31] text-center">
          Tüm Makaleler
        </h1>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse text-[#6B4E31]">
            <thead>
              <tr className="bg-yellow-50 text-left">
                <th className="p-3 border-b">Başlık</th>
                <th className="p-3 border-b">Yazar</th>
                <th className="p-3 border-b">Tür</th>
                <th className="p-3 border-b">Yayın Tarihi</th>
                <th className="p-3 border-b">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {makaleler.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{m.baslik}</td>
                  <td className="p-3 border-b">{m.yazar_id}</td>
                  <td className="p-3 border-b">{m.makale_turu_id}</td>
                  <td className="p-3 border-b">
                    {new Date(m.yayim_tarihi).toLocaleDateString()}
                  </td>
                  <td className="p-3 border-b flex gap-2">
                    <Link
                      href={`/admin/makale-duzenle/${m.id}`}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
                    >
                      Düzenle
                    </Link>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition duration-300"
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