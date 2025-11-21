"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";
import { fetchWithAdminAuth } from "@/lib/adminAuth";

export default function AdminReviewsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchWithAdminAuth(`${API_URL}/reviews`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.message || "Lỗi tải đánh giá");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: number) => {
    if (!confirm("Xóa đánh giá này?")) return;
    const res = await fetchWithAdminAuth(`${API_URL}/reviews/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const t = await res.text();
      alert(t || 'Xóa thất bại');
      return;
    }
    await load();
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Quản lý đánh giá</h1>
      {error && <div className="mb-3 text-red-600">{error}</div>}
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <table className="w-full border-collapse border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">Sản phẩm</th>
              <th className="border p-2">Người dùng</th>
              <th className="border p-2">Sao</th>
              <th className="border p-2">Bình luận</th>
              <th className="border p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="border p-2">{r.id}</td>
                <td className="border p-2">{r.product_name}</td>
                <td className="border p-2">{r.user_name}</td>
                <td className="border p-2">{r.rating}★</td>
                <td className="border p-2">{r.comment}</td>
                <td className="border p-2">
                  <button onClick={() => remove(r.id)} className="px-3 py-1 bg-red-500 text-white rounded">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


