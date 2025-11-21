"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";
import { fetchWithAdminAuth } from "@/lib/adminAuth";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchWithAdminAuth(`${API_URL}/orders`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.message || "Lỗi tải đơn hàng");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getAuthHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetchWithAdminAuth(`${API_URL}/orders/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      await fetchOrders();
    } catch (e: any) {
      setError(e?.message || "Lỗi khi cập nhật trạng thái đơn hàng");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa đơn hàng này?")) return;
    try {
      const res = await fetchWithAdminAuth(`${API_URL}/orders/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      await fetchOrders();
    } catch (e: any) {
      setError(e?.message || "Lỗi khi xóa đơn hàng");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">📦 Quản lý đơn hàng</h1>

      <div className="mb-4 flex items-center gap-3">
        <label className="font-medium">Lọc trạng thái:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Tất cả</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
      )}

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">Người dùng</th>
              <th className="border p-2">Tổng tiền</th>
              <th className="border p-2">Trạng thái</th>
              <th className="border p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders
              .filter((o) => (statusFilter ? String(o.status).toLowerCase() === statusFilter.toLowerCase() : true))
              .map((o) => (
              <tr key={o.id}>
                <td className="border p-2">{o.id}</td>
                <td className="border p-2">{o.user_id}</td>
                <td className="border p-2">{o.total_amount} ₫</td>
                <td className="border p-2">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className="border p-1 rounded"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => handleDelete(o.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
