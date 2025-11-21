"use client";

import { useEffect, useState } from "react";
import { getUser, setAuth, logoutUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function EditAccountPage() {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.push("/auth/login");
    } else {
      setName(u.name || "");
      setAvatar(u.avatar || "");
    }
  }, [router]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const user = getUser();
    if (!user) return;

    const updatedUser = {
      ...user,
      name,
      avatar,
      password: password || user.password,
    };

    setAuth(localStorage.getItem("token") || "", updatedUser);

    alert("✅ Cập nhật thông tin thành công!");
    router.push("/account");
  };

  const handleLogout = () => {
    logoutUser();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <form
        onSubmit={handleSave}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-gray-200"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Chỉnh sửa hồ sơ cá nhân
        </h2>

        {/* Avatar */}
        <div className="mb-6 text-center">
          <img
            src={avatar || "/default-avatar.png"}
            alt="Avatar"
            className="w-28 h-28 mx-auto rounded-full object-cover border-4 border-white shadow-md"
          />
          <label className="block text-sm font-medium text-gray-600 mt-3 mb-1">
            URL ảnh đại diện
          </label>
          <input
            type="text"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="https://example.com/avatar.jpg"
          />
        </div>

        {/* Name */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Họ và tên
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Mật khẩu mới (tùy chọn)
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="Nhập mật khẩu mới..."
          />
        </div>

        {/* Save button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition font-semibold shadow-md"
        >
          💾 Lưu thay đổi
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition font-semibold shadow-md mt-3"
        >
          🚪 Đăng xuất
        </button>
      </form>
    </div>
  );
}
