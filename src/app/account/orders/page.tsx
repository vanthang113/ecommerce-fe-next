"use client";

import { useEffect, useState } from "react";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://ecommerce-online-8r1c.onrender.com/api";
export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Bạn cần đăng nhập để xem đơn hàng");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`${API_URL}/orders/my`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Orders data:", data);
        setOrders(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setError("Không thể tải danh sách đơn hàng: " + error.message);
        setOrders([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const tabs: { key: string; label: string; match?: (s: string) => boolean }[] = [
    { key: "ALL", label: "Tất cả" },
    { key: "PENDING", label: "Chờ xác nhận", match: (s) => s?.toLowerCase() === "pending" },
    { key: "PROCESSING", label: "Vận chuyển", match: (s) => s?.toLowerCase() === "processing" },
    { key: "COMPLETED", label: "Hoàn thành", match: (s) => s?.toLowerCase() === "completed" },
    { key: "CANCELLED", label: "Đã hủy", match: (s) => s?.toLowerCase() === "cancelled" },
    { key: "REFUND", label: "Trả hàng/Hoàn tiền" },
  ];

  const filtered = orders
    .filter((o) => {
      if (activeTab === "ALL" || activeTab === "REFUND") return true;
      const tab = tabs.find((t) => t.key === activeTab);
      return tab?.match ? tab.match(String(o.status || "")) : true;
    })
    .filter((o) => {
      if (!query.trim()) return true;
      const q = query.trim().toLowerCase();
      const idMatch = String(o.id).includes(q);
      const itemsText = Array.isArray(o.items)
        ? o.items.map((i: any) => String(i.product_name || "").toLowerCase()).join(" ")
        : "";
      return idMatch || itemsText.includes(q);
    });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar giống Shopee */}
        <aside className="col-span-3 bg-white rounded-lg border h-fit">
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-200" />
              <div>
                <p className="font-semibold text-gray-800">Tài khoản của tôi</p>
                <button className="text-sm text-orange-500 hover:underline">Sửa Hồ Sơ</button>
              </div>
            </div>
          </div>
          <nav className="p-2 text-sm">
            <div className="px-4 py-3">Thông Báo</div>
            <div className="px-4 py-3">Tài Khoản Của Tôi</div>
            <div className="px-4 py-3 bg-orange-50 text-orange-600 font-medium rounded-r-full">Đơn Mua</div>
            <div className="px-4 py-3">Kho Voucher</div>
            <div className="px-4 py-3">Shop xu</div>
          </nav>
        </aside>

        {/* Nội dung đơn hàng */}
        <section className="col-span-9">
          {/* Tabs */}
          <div className="bg-white rounded-lg border">
            <div className="flex items-center gap-6 px-4">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`py-4 border-b-2 -mb-px ${
                    activeTab === t.key
                      ? "border-orange-500 text-orange-600 font-semibold"
                      : "border-transparent text-gray-700 hover:text-orange-600"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            {/* Search bar */}
            <div className="px-4 pb-4">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Bạn có thể tìm kiếm theo tên Shop, ID đơn hàng hoặc Tên Sản phẩm"
                className="w-full bg-gray-100 rounded px-4 py-2 text-sm outline-none"
              />
            </div>
          </div>

          {/* List */}
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <p className="mt-2">Đang tải đơn hàng...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
              <p className="font-bold">Lỗi:</p>
              <p>{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg border mt-4">
              <p className="text-gray-500 text-lg">Chưa có đơn hàng</p>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {filtered.map((order) => (
                <div key={order.id} className="border rounded bg-white">
                  <div className="flex items-center justify-between px-4 py-3 border-b">
                    <div className="text-gray-700">Mã đơn: #{order.id}</div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      String(order.status).toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      String(order.status).toLowerCase() === 'processing' ? 'bg-blue-100 text-blue-800' :
                      String(order.status).toLowerCase() === 'completed' ? 'bg-green-100 text-green-800' :
                      String(order.status).toLowerCase() === 'cancelled' ? 'bg-gray-200 text-gray-700' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {String(order.status)}
                    </span>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-gray-600 mb-1">
                      Ngày tạo: {order.created_at ? new Date(order.created_at).toLocaleString('vi-VN') : '-'}
                    </p>
                    <p className="text-lg font-bold text-orange-600">
                      Tổng tiền: {Number(order.total_amount || 0).toLocaleString('vi-VN')} ₫
                    </p>
                    {Array.isArray(order.items) && order.items.length > 0 && (
                      <div className="mt-3 border-t pt-3">
                        <div className="space-y-3">
                          {order.items.map((item: any) => {
                            const img = Array.isArray(item.product_images)
                              ? item.product_images[0]
                              : typeof item.product_images === 'string' && item.product_images?.startsWith('[')
                              ? (() => { try { const arr = JSON.parse(item.product_images); return Array.isArray(arr) ? arr[0] : null; } catch { return item.product_images; } })()
                              : item.product_images;
                            return (
                              <div key={item.id} className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                                  {img ? (
                                    <img src={img} alt={item.product_name} className="w-full h-full object-cover" />
                                  ) : (
                                    <span className="text-xs text-gray-400">No image</span>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">{item.product_name}</p>
                                  <p className="text-sm text-gray-500">Số lượng: {item.qty} × {Number(item.price).toLocaleString('vi-VN')} ₫</p>
                                  {String(order.status).toLowerCase() === 'completed' && (
                                    <ReviewInline productId={item.product_id} productName={item.product_name} />
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {order.shipping_address && (
                      <p className="text-sm text-gray-500 mt-2">
                        {(() => {
                          const raw = order.shipping_address;
                          // Hỗ trợ cả chuỗi đã stringify hoặc object
                          let addr: any = raw;
                          if (typeof raw === 'string') {
                            try {
                              addr = JSON.parse(raw);
                            } catch {
                              return `Địa chỉ: ${raw}`;
                            }
                          }
                          if (addr && (addr.address || addr.address_line || addr.region)) {
                            const name = addr.full_name ? `${addr.full_name} — ` : '';
                            const phone = addr.phone ? ` (${addr.phone})` : '';
                            const line = addr.address || addr.address_line || '';
                            const region = addr.region ? `, ${addr.region}` : '';
                            const type = addr.type ? ` — ${addr.type === 'office' ? 'Văn phòng' : 'Nhà riêng'}` : '';
                            return `Địa chỉ: ${name}${line}${region}${phone}${type}`;
                          }
                          return 'Địa chỉ: Không có địa chỉ';
                        })()}
                      </p>
                    )}
                    {String(order.status).toLowerCase() === 'pending' && (
                      <div className="mt-3">
                        <button
                          onClick={async () => {
                            const token = localStorage.getItem('token');
                            if (!token) return;
                            if (!confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;
                            try {
                              const res = await fetch(`${API_URL}/orders/${order.id}/cancel`, {
                                method: 'PUT',
                                headers: { Authorization: `Bearer ${token}` },
                              });
                              if (!res.ok) {
                                const t = await res.text();
                                throw new Error(t || 'Hủy đơn thất bại');
                              }
                              // refresh list
                              const r = await fetch(`${API_URL}/orders/my`, { headers: { Authorization: `Bearer ${token}` } });
                              const data = await r.json();
                              setOrders(Array.isArray(data) ? data : []);
                            } catch (e) {
                              alert((e as any)?.message || 'Có lỗi xảy ra');
                            }
                          }}
                          className="px-4 py-2 rounded bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                        >
                          Hủy đơn hàng
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function ReviewInline({ productId, productName }: { productId: number; productName: string }) {
  const [show, setShow] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const submit = async () => {
    if (!token) return alert('Bạn cần đăng nhập');
    if (!rating) return alert('Vui lòng chọn số sao');
    const res = await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ product_id: productId, rating, comment }),
    });
    if (!res.ok) {
      const t = await res.text();
      alert(t || 'Gửi đánh giá thất bại');
      return;
    }
    alert('Cảm ơn bạn đã đánh giá!');
    setShow(false);
    setComment("");
  };

  return (
    <div className="mt-2">
      {!show ? (
        <button onClick={() => setShow(true)} className="text-sm text-blue-600 hover:underline">Đánh giá sản phẩm</button>
      ) : (
        <div className="mt-2 p-3 border rounded bg-gray-50">
          <p className="text-sm mb-2">Đánh giá cho: <span className="font-medium">{productName}</span></p>
          <div className="flex items-center gap-2 mb-2">
            {[1,2,3,4,5].map((s) => (
              <button
                key={s}
                onClick={() => setRating(s)}
                className={`w-8 h-8 rounded-full border ${rating >= s ? 'bg-yellow-400' : 'bg-white'}`}
                aria-label={`${s} sao`}
              />
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Chia sẻ cảm nhận của bạn..."
            className="w-full border rounded p-2 text-sm"
          />
          <div className="mt-2 flex gap-2">
            <button onClick={submit} className="px-3 py-1 bg-green-600 text-white rounded text-sm">Gửi</button>
            <button onClick={() => setShow(false)} className="px-3 py-1 border rounded text-sm">Hủy</button>
          </div>
        </div>
      )}
    </div>
  );
}


