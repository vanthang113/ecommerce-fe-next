"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCategories } from "@/lib/categories";

// Mapping từ tên category sang icon (case-insensitive)
const categoryIconMap: { [key: string]: string } = {
  "thời trang": "/categories/thoitrang.webp",
  "điện thoại": "/categories/dienthoai.webp",
  "laptop": "/categories/laptop.webp",
  "đồng hồ": "/categories/dongho.webp",
  "giày dép": "/categories/giaydep.webp",
  "mỹ phẩm": "/categories/mypham.webp",
  "máy ảnh": "/categories/mayanh.webp",
  "sách": "/categories/sach.webp",
  "PC": "/categories/PC.webp",
  // "....": "/categories/........",
  // "......": "/categories/........
};

export default function CategoryGrid() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategories();
        console.log("Categories fetched:", data); // Debug log
        setCategories(data);
      } catch (error) {
        console.error("Lỗi tải danh mục:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId: number, categoryName: string) => {
    router.push(`/products?category=${categoryId}`);
  };

  // Function để tìm icon cho category
  const getCategoryIcon = (categoryName: string) => {
    const normalizedName = categoryName.toLowerCase().trim();
    return categoryIconMap[normalizedName] || "/categories/laptop.webp"; // fallback về laptop icon
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto mt-6 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 text-center">
        {[...Array(8)].map((_, idx) => (
          <div key={idx} className="flex flex-col items-center p-3 rounded-lg">
            <div className="w-16 h-16 bg-gray-200 rounded animate-pulse"></div>
            <div className="mt-2 h-4 bg-gray-200 rounded animate-pulse w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto mt-6 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 text-center">
      {categories.map((cat, idx) => (
        <div
          key={cat.id}
          onClick={() => handleCategoryClick(cat.id, cat.name)}
          className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition"
        >
          <div className="w-16 h-16 relative bg-gray-100 rounded-lg flex items-center justify-center">
            <Image
              src={getCategoryIcon(cat.name)}
              alt={cat.name}
              width={48}
              height={48}
              className="object-contain"
              onError={(e) => {
                console.log(`Error loading image for category: ${cat.name}`);
                // Fallback to a default icon
                e.currentTarget.src = "/categories/laptop.webp";
              }}
            />
          </div>
          <p className="mt-2 text-sm font-medium">{cat.name}</p>
        </div>
      ))}
    </div>
  );
}
