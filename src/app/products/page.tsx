"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getProducts } from "@/lib/products";
import { getCategoryById } from "@/lib/categories";
import ProductCard from "@/components/ProductCard";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState<string>("");
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search");
  const categoryId = searchParams.get("category");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch category name if categoryId exists
        if (categoryId) {
          try {
            const category = await getCategoryById(categoryId);
            setCategoryName(category.name);
          } catch (error) {
            console.error("Lỗi tải thông tin danh mục:", error);
            setCategoryName("");
          }
        } else {
          setCategoryName("");
        }
        
        // Build query parameters
        const queryParams = new URLSearchParams();
        if (searchQuery) queryParams.append("q", searchQuery);
        if (categoryId) queryParams.append("category", categoryId);
        
        const queryString = queryParams.toString();
        
        const data = await getProducts(queryString);
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [searchQuery, categoryId]);


  if (loading) return <p className="text-center mt-10">Đang tải...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        {searchQuery 
          ? `Kết quả tìm kiếm cho "${searchQuery}"` 
          : categoryId 
            ? `Sản phẩm ${categoryName}`
            : "Danh sách sản phẩm"
        }
      </h1>
      {(searchQuery || categoryId) && (
        <p className="text-gray-600 mb-6">
          Tìm thấy {filteredProducts.length} sản phẩm
        </p>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào</p>
        </div>
      )}
    </div>
  );
}
