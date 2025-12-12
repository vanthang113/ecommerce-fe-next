"use client";

interface BreadcrumbProps {
  productName: string;
  category?: string;
  subCategory?: string;
}

export default function Breadcrumb({ 
  productName, 
  category = "Điện Thoại & Phụ Kiện", 
  subCategory = "Điện thoại" 
}: BreadcrumbProps) {
  return (
    <nav className="text-sm text-gray-500 mb-4">
      <span className="hover:text-orange-500 cursor-pointer">MyShop</span> &gt;
      <span className="hover:text-orange-500 cursor-pointer ml-1">{category}</span> &gt;
      <span className="hover:text-orange-500 cursor-pointer ml-1">{subCategory}</span> &gt;
      <span className="ml-1 text-gray-800 font-medium">{productName}</span>
    </nav>
  );
}