"use client";

import { useState, useEffect } from "react";
import { API_URL } from "@/lib/api";

export default function ProductDebug() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/products?limit=5`);
      if (res.ok) {
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Lỗi fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-4 border rounded bg-green-50">
      <h3 className="font-bold mb-2">🔍 Product Debug</h3>
      
      <button 
        onClick={fetchProducts}
        disabled={loading}
        className="mb-3 bg-green-500 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
      >
        {loading ? "Loading..." : "Refresh Products"}
      </button>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {products.map((product) => (
          <div key={product.id} className="p-2 bg-white border rounded text-xs">
            <div><strong>ID:</strong> {product.id}</div>
            <div><strong>Name:</strong> {product.name}</div>
            <div><strong>Images:</strong> {JSON.stringify(product.images)}</div>
            <div><strong>Images Type:</strong> {typeof product.images}</div>
            <div><strong>Is Array:</strong> {Array.isArray(product.images) ? "Yes" : "No"}</div>
            {product.images && (
              <div className="mt-1">
                <strong>First Image URL:</strong> 
                <br />
                <code className="text-xs break-all">{Array.isArray(product.images) ? product.images[0] : product.images}</code>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
