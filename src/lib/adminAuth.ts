// Helper functions for admin authentication

export const getAdminAuthHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

export const isAdminTokenValid = async (): Promise<boolean> => {
  try {
    const token = localStorage.getItem("adminToken");
    if (!token) return false;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/users`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    return res.ok;
  } catch {
    return false;
  }
};

export const refreshAdminToken = async (): Promise<boolean> => {
  try {
    const adminUser = localStorage.getItem("adminUser");
    if (!adminUser) return false;

    const user = JSON.parse(adminUser);
    const password = prompt(`Nhập mật khẩu cho ${user.email} để refresh token:`);
    if (!password) return false;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, password }),
    });

    if (!res.ok) return false;

    const data = await res.json();
    if (data.token && data.user) {
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.user));
      return true;
    }

    return false;
  } catch {
    return false;
  }
};

export const fetchWithAdminAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("adminToken");
  if (!token) {
    throw new Error("Chưa đăng nhập admin");
  }

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
    ...options.headers,
  };

  let res = await fetch(url, { ...options, headers });

  // Nếu token hết hạn, thử refresh
  if (res.status === 401) {
    const refreshed = await refreshAdminToken();
    if (refreshed) {
      // Thử lại với token mới
      const newToken = localStorage.getItem("adminToken");
      const newHeaders = {
        ...headers,
        "Authorization": `Bearer ${newToken}`,
      };
      res = await fetch(url, { ...options, headers: newHeaders });
    }
  }

  return res;
};
