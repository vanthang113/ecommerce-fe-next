"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";
import ProductCard from "@/components/ProductCard";

export default function HomeNewProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_URL}/products?limit=8`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError(e?.message || "Lỗi tải sản phẩm");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Sản phẩm mới</h2>
        <a href="/products" className="text-blue-600 hover:underline">Xem tất cả</a>
      </div>
      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">{error}</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}


