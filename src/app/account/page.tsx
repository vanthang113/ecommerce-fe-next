"use client";

import { useEffect, useState } from "react";
import { getUser, logoutUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { FaUser, FaShoppingBag, FaMapMarkerAlt, FaSignOutAlt, FaEdit } from "react-icons/fa";

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const u = getUser();
    if (!u) router.push("/auth/login");
    else setUser(u);
  }, [router]);

  const handleLogout = () => {
    logoutUser();
    router.push("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-4">
        
        {/* ✅ SIDEBAR */}
        <aside className="border-r p-6 space-y-5">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar || "/default-avatar.png"}
              alt="avatar"
              className="w-14 h-14 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>
          </div>

          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition"
                onClick={() => router.push("/account")}>
              <FaUser /> Hồ sơ của tôi
            </li>
            <li className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition">
              <FaShoppingBag /> Đơn mua
            </li>
            <li className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition">
              <FaMapMarkerAlt /> Địa chỉ nhận hàng
            </li>
            <li className="flex items-center gap-2 cursor-pointer hover:text-red-500 transition"
                onClick={handleLogout}>
              <FaSignOutAlt /> Đăng xuất
            </li>
          </ul>
        </aside>

        {/* ✅ NỘI DUNG */}
        <main className="p-8 col-span-3">
          <h2 className="text-xl font-bold mb-6">Thông tin tài khoản</h2>

          <div className="space-y-4 text-gray-700">
            <div><span className="font-medium">Họ và tên:</span> {user.name}</div>
            <div><span className="font-medium">Email:</span> {user.email}</div>
            <div><span className="font-medium">Mật khẩu:</span> [có cái nịt nhé :v]</div>
          </div>

          <button
            onClick={() => router.push("/account/edit")}
            className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <FaEdit /> Chỉnh sửa thông tin
          </button>
        </main>
      </div>
    </div>
  );
}
