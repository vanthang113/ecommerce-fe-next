"use client";

import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">📊 Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Link
          href="/admin/categories"
          className="p-6 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600"
        >
          Quản lý danh mục
        </Link>
        <Link
          href="/admin/products"
          className="p-6 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
        >
          Quản lý sản phẩm
        </Link>
        <Link
          href="/admin/orders"
          className="p-6 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
        >
          Quản lý đơn hàng
        </Link>
        <Link
          href="/admin/users"
          className="p-6 bg-purple-500 text-white rounded-lg shadow hover:bg-purple-600"
        >
          Quản lý người dùng
        </Link>
        <Link
          href="/admin/charts"
          className="p-6 bg-gray-700 text-white rounded-lg shadow hover:bg-gray-800"
        >
          Biểu đồ đơn hàng
        </Link>
      </div>
    </div>
  );
}
