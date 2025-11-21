"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";
import { fetchWithAdminAuth } from "@/lib/adminAuth";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    email: "",
    role: "user",
  });
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetchWithAdminAuth(`${API_URL}/users`);
      
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.");
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      
      // Kiểm tra và xử lý dữ liệu trả về
      if (Array.isArray(data)) {
        setUsers(data);
      } else if (data && Array.isArray(data.users)) {
        setUsers(data.users);
      } else if (data && Array.isArray(data.data)) {
        setUsers(data.data);
      } else {
        console.warn("Dữ liệu trả về không phải mảng:", data);
        setUsers([]);
      }
    } catch (err: any) {
      console.error("Lỗi khi fetch users:", err);
      setError(err.message || "Có lỗi xảy ra khi tải dữ liệu");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e: any) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setSaving(true);
      let res;
      if (formData.id) {
        res = await fetchWithAdminAuth(`${API_URL}/users/${formData.id}`, {
          method: "PUT",
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetchWithAdminAuth(`${API_URL}/users`, {
          method: "POST",
          body: JSON.stringify(formData),
        });
      }

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      setShowForm(false);
      setFormData({ id: null, name: "", email: "", role: "user" });
      await fetchUsers();
    } catch (err: any) {
      console.error("Lỗi khi submit form:", err);
      setError(err?.message || "Có lỗi xảy ra khi lưu dữ liệu");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa user này?")) return;

    try {
      const res = await fetchWithAdminAuth(`${API_URL}/users/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      await fetchUsers();
    } catch (err: any) {
      console.error("Lỗi khi xóa user:", err);
      setError(err?.message || "Có lỗi xảy ra khi xóa user");
    }
  };

  // Xử lý khi người dùng chưa đăng nhập
  const handleLoginRedirect = () => {
    window.location.href = "/login";
  };

  // Hiển thị lỗi nếu có
  if (error && error.includes("đăng nhập")) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">👤 Quản lý người dùng</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Lỗi xác thực: </strong> {error}
        </div>
        <button
          onClick={handleLoginRedirect}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Đăng nhập
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">👤 Quản lý người dùng</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Lỗi: </strong> {error}
        </div>
        <button
          onClick={fetchUsers}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">👤 Quản lý người dùng</h1>

      <button
        onClick={() => {
          setFormData({ id: null, name: "", email: "", role: "user" });
          setShowForm(true);
        }}
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded"
      >
        ➕ Thêm user
      </button>

      {loading ? (
        <p>Đang tải...</p>
      ) : users.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Không có user nào
        </div>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">Tên</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Vai trò</th>
              <th className="border p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="border p-2">{u.id}</td>
                <td className="border p-2">{u.name}</td>
                <td className="border p-2">{u.email}</td>
                <td className="border p-2">{u.role}</td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => {
                      setFormData(u);
                      setShowForm(true);
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(u.id)}
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

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-xl font-bold mb-4">
              {formData.id ? "✏️ Sửa user" : "➕ Thêm user"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Tên"
                value={formData.name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className={`text-white px-4 py-2 rounded ${saving ? "bg-blue-300" : "bg-blue-600"}`}
                >
                  {saving ? "Đang lưu..." : formData.id ? "Cập nhật" : "Thêm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}