import fetchAPI from "./api";

// Đăng ký
export async function registerUser(name: string, email: string, password: string) {
  return fetchAPI("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

// Đăng nhập
export async function loginUser(email: string, password: string) {
  const data = await fetchAPI("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (typeof window !== "undefined" && data?.token) {
    setAuth(data.token, data.user);
  }

  return data;
}

// Đăng nhập ADMIN (lưu khóa riêng, không ảnh hưởng user)
export async function loginAdmin(email: string, password: string) {
  const data = await fetchAPI("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (typeof window !== "undefined" && data?.token) {
    setAdminAuth(data.token, data.user);
  }

  return data;
}

// Đăng xuất
export function logoutUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authChange"));
  }
}

// Đăng xuất ADMIN
export function logoutAdmin() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    window.dispatchEvent(new Event("adminAuthChange"));
  }
}

// Lưu auth
export function setAuth(token: string, user: any) {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    window.dispatchEvent(new Event("authChange"));
  }
}

// Lưu auth ADMIN
export function setAdminAuth(token: string, user: any) {
  if (typeof window !== "undefined") {
    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminUser", JSON.stringify(user));
    window.dispatchEvent(new Event("adminAuthChange"));
  }
}

// Lấy user hiện tại
export function getUser() {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem("user");
  return data ? JSON.parse(data) : null;
}

export function getAdminUser() {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem("adminUser");
  return data ? JSON.parse(data) : null;
}

// Lấy token hiện tại
export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function getAdminToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("adminToken");
}
