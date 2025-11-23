// export const API_URL = process.env.NEXT_PUBLIC_API_URL!;

// async function fetchAPI(endpoint: string, options: RequestInit = {}) {
//   if (!API_URL) {
//     throw new Error("NEXT_PUBLIC_API_URL is not defined in .env");
//   }

//   const url = `${API_URL}${endpoint}`;
//   console.log("Fetching URL:", url); // Debug: xem URL đang gọi

//   const res = await fetch(url, {
//     headers: {
//       "Content-Type": "application/json",
//       ...(options.headers || {}),
//     },
//     ...options,
//   });

//   // Nếu response không phải JSON, log ra body để debug
//   const text = await res.text();
//   try {
//     const data = JSON.parse(text);
//     if (!res.ok) {
//       throw new Error(data.message || "API Error");
//     }
//     return data;
//   } catch {
//     console.error("Expected JSON but got:", text);
//     throw new Error(`API did not return JSON: ${text}`);
//   }
// }

// export default fetchAPI;
export const API_URL = process.env.NEXT_PUBLIC_API_URL!;

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL is not defined in .env");

  const url = `${API_URL}${endpoint}`;
  console.log("Fetching URL:", url);

  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      ...options,
    });

    const text = await res.text();
    try {
      const data = JSON.parse(text);
      if (!res.ok) throw new Error(data.message || "API Error");
      return data;
    } catch {
      console.error("Expected JSON but got:", text);
      throw new Error(`API did not return JSON: ${text}`);
    }
  } catch (err: any) {
    console.error("Network or fetch error:", err.message);
    throw new Error(`Failed to connect to API: ${err.message}`);
  }
}

export default fetchAPI;

