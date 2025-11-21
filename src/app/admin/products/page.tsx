"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";
import { fetchWithAdminAuth } from "@/lib/adminAuth";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
  brand: string | null;
  images: string | string[] | null;
};

type Category = {
  id: number;
  name: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);

  const [showForm, setShowForm] = useState<boolean>(false);
  const [formData, setFormData] = useState<{
    id: number | null;
    name: string;
    description: string;
    price: string;
    stock: string;
    category_id: string;
    brand: string;
    images: string;
  }>({
    id: null,
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
    brand: "",
    images: "",
  });

  const getAuthHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchWithAdminAuth(`${API_URL}/products?page=${page}&limit=${limit}`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.message || "Lỗi tải sản phẩm");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/categories`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (e: any) {
      console.error("Lỗi tải danh mục:", e);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const openCreate = () => {
    setFormData({ id: null, name: "", description: "", price: "", stock: "", category_id: "", brand: "", images: "" });
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setFormData({
      id: p.id,
      name: p.name,
      description: p.description || "",
      price: String(p.price ?? ""),
      stock: String(p.stock ?? ""),
      category_id: String(p.category_id ?? ""),
      brand: p.brand || "",
      images: Array.isArray(p.images) ? p.images.join(", ") : typeof p.images === "string" ? p.images : "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        stock: Number(formData.stock),
        category_id: Number(formData.category_id),
        brand: formData.brand || null,
        images: formData.images
          ? formData.images
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
      };

      let res;
      if (formData.id) {
        res = await fetchWithAdminAuth(`${API_URL}/products/${formData.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetchWithAdminAuth(`${API_URL}/products`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      setShowForm(false);
      await fetchProducts();
    } catch (e: any) {
      setError(e?.message || "Lỗi khi lưu sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    setLoading(true);
    try {
      const res = await fetchWithAdminAuth(`${API_URL}/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      await fetchProducts();
    } catch (e: any) {
      setError(e?.message || "Lỗi khi xóa sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🛒 Quản lý sản phẩm</h1>

      <div className="mb-4 flex justify-between items-center">
        <button onClick={openCreate} className="bg-green-600 text-white px-4 py-2 rounded">
          ➕ Thêm sản phẩm
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <>
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">ID</th>
                <th className="border p-2">Tên</th>
                <th className="border p-2">Giá</th>
                <th className="border p-2">Kho</th>
                <th className="border p-2">Danh mục</th>
                <th className="border p-2">Thương hiệu</th>
                <th className="border p-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="border p-2">{p.id}</td>
                  <td className="border p-2">{p.name}</td>
                  <td className="border p-2">{p.price?.toLocaleString()} ₫</td>
                  <td className="border p-2">{p.stock}</td>
                  <td className="border p-2">{categories.find((c) => c.id === p.category_id)?.name || p.category_id}</td>
                  <td className="border p-2">{p.brand || "-"}</td>
                  <td className="border p-2 space-x-2">
                    <button onClick={() => openEdit(p)} className="bg-yellow-500 text-white px-3 py-1 rounded">
                      Sửa
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="bg-red-600 text-white px-3 py-1 rounded">
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end items-center gap-2 mt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={page === 1}
            >
              « Trước
            </button>
            <span>Trang {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 border rounded"
            >
              Sau »
            </button>
          </div>
        </>
      )}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-full max-w-xl">
            <h2 className="text-xl font-bold mb-4">{formData.id ? "✏️ Sửa sản phẩm" : "➕ Thêm sản phẩm"}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
                name="name"
          placeholder="Tên sản phẩm"
                value={formData.name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
              <textarea
                name="description"
                placeholder="Mô tả"
                value={formData.description}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  name="price"
                  placeholder="Giá"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
                  name="stock"
                  placeholder="Số lượng kho"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
          required
        />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  name="brand"
                  placeholder="Thương hiệu (tùy chọn)"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </div>
        <input
          type="text"
                name="images"
                placeholder="Ảnh (URL, phân tách bởi dấu phẩy)"
                value={formData.images}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowForm(false)} className="bg-gray-400 text-white px-4 py-2 rounded">
                  Hủy
                </button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                  {formData.id ? "Cập nhật" : "Thêm"}
        </button>
              </div>
      </form>
          </div>
        </div>
      )}
    </div>
  );
}
