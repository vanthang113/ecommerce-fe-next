"use client";

import { useEffect, useMemo, useState } from "react";
import { loginAdmin } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { isAdminTokenValid } from "@/lib/adminAuth";

export default function AdminLoginPage() {
  const router = useRouter();
  const allowedEmail = useMemo(
    () => process.env.NEXT_PUBLIC_SEED_ADMIN_EMAIL || "admin@example.com",
    []
  );
  const [email, setEmail] = useState(allowedEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Không tự động rời khỏi trang login, chỉ dọn dẹp token cũ nếu có
  useEffect(() => {
    (async () => {
      try {
        const valid = await isAdminTokenValid();
        if (!valid) {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminUser");
          window.dispatchEvent(new Event("adminAuthChange"));
        }
      } catch {}
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (email !== allowedEmail) {
        setError(`Chỉ cho phép đăng nhập bằng tài khoản admin: ${allowedEmail}`);
        return;
      }
      const res = await loginAdmin(email, password);
      if (res?.user?.role !== "admin") {
        setError("Tài khoản không có quyền admin");
        return;
      }
      const redirect = typeof window !== "undefined" ? sessionStorage.getItem("redirectAfterLogin") : null;
      const target = redirect && !redirect.startsWith("/admin/login") ? redirect : "/admin/dashboard";
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("redirectAfterLogin");
      }
      // push để đảm bảo tạo history và render lại, tránh stuck
      router.push(target);
    } catch (err: any) {
      setError(err?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-sm bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">Đăng nhập Admin</h1>
        {error && (
          <div className="mb-3 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu"
            className="w-full border p-2 rounded"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white p-2 rounded ${loading ? "bg-blue-300" : "bg-blue-600"}`}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}


