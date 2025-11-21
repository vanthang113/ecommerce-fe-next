
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setAuth } from "@/lib/auth";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Đăng ký thất bại");
        return;
      }

      setAuth(data.token, data.user);
      window.dispatchEvent(new Event("authChange"));
      router.push("/");
    } catch (err) {
      setError("Lỗi kết nối server");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f53d2d]">
      {/* Banner bên trái */}
      <div className="hidden md:flex flex-1 items-center justify-center">
        <img
          src="/account/final-sale-banner.png"
          className="max-h-[90%] object-contain"
        />
      </div>

      {/* Form đăng ký */}
      <div className="flex items-center justify-center flex-1 bg-white">
        <form
          onSubmit={handleRegister}
          className="bg-white shadow-lg rounded-xl p-10 w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-[#f53d2d]">
            Đăng ký
          </h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <input
            type="text"
            placeholder="Tên của bạn"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:border-[#f53d2d]"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:border-[#f53d2d]"
            required
          />

          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:border-[#f53d2d]"
            required
          />

          <button
            type="submit"
            className="w-full bg-[#f53d2d] text-white p-3 rounded-md hover:bg-[#e73626] transition"
          >
            Đăng ký
          </button>

          <p className="text-center mt-4 text-gray-600">
            Đã có tài khoản?{" "}
            <a
              href="/auth/login"
              className="text-[#f53d2d] hover:underline font-semibold"
            >
              Đăng nhập
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
