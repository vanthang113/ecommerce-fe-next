"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "@/lib/order";

export default function CheckoutPage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState(""); 
  const [addressDetail, setAddressDetail] = useState("");
  const [addressType, setAddressType] = useState<"home" | "office">("home");
  const [isDefault, setIsDefault] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [payment, setPayment] = useState("COD");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = "Vui lòng nhập họ và tên";
    if (!phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
    if (!region.trim())
      newErrors.region = "Vui lòng nhập Tỉnh/Thành phố, Quận/Huyện, Phường/Xã";
    if (!addressDetail.trim())
      newErrors.addressDetail = "Vui lòng nhập địa chỉ cụ thể";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = async () => {
    if (!validate()) {
      alert("Vui lòng điền đầy đủ thông tin địa chỉ");
      return;
    }

    if (!token) {
      alert("Bạn cần đăng nhập để đặt hàng!");
      router.push("/auth/login");
      return;
    }

    setLoading(true);

    try {
      const order = await createOrder(
        token,
        {
          full_name: fullName.trim(),
          phone: phone.trim(),
          region: region.trim(),
          address_line: addressDetail.trim(),
          type: addressType,
          is_default: isDefault,
        },
        payment
      );

      alert("Đặt hàng thành công!");
      router.push("/account/orders");
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra khi đặt hàng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Thanh toán</h1>

      <div className="space-y-4">
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-3">
            Địa chỉ mới (dùng thông tin trước sắp nhập)
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Để đặt hàng, vui lòng thêm địa chỉ nhận hàng
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <input
                type="text"
                placeholder="Họ và tên"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full border p-3 rounded ${
                  errors.fullName ? "border-red-500" : ""
                }`}
              />
              {errors.fullName && (
                <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>

            <div>
              <input
                type="tel"
                placeholder="Số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full border p-3 rounded ${
                  errors.phone ? "border-red-500" : ""
                }`}
              />
              {errors.phone && (
                <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
          </div>

          <div className="mt-3">
            <input
              type="text"
              placeholder="Tỉnh/ Thành phố, Quận/Huyện, Phường/Xã"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className={`w-full border p-3 rounded ${
                errors.region ? "border-red-500" : ""
              }`}
            />
            {errors.region && (
              <p className="text-red-600 text-sm mt-1">{errors.region}</p>
            )}
          </div>

          <div className="mt-3">
            <input
              type="text"
              placeholder="Địa chỉ cụ thể"
              value={addressDetail}
              onChange={(e) => setAddressDetail(e.target.value)}
              className={`w-full border p-3 rounded ${
                errors.addressDetail ? "border-red-500" : ""
              }`}
            />
            {errors.addressDetail && (
              <p className="text-red-600 text-sm mt-1">
                {errors.addressDetail}
              </p>
            )}
          </div>

          <div className="mt-4">
            <div className="h-32 w-full border rounded bg-gray-50 flex items-center justify-center text-gray-400">
              + Thêm vị trí
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Loại địa chỉ:</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAddressType("home")}
                className={`px-3 py-2 rounded border ${
                  addressType === "home"
                    ? "bg-gray-800 text-white"
                    : "bg-white"
                }`}
              >
                Nhà Riêng
              </button>

              <button
                type="button"
                onClick={() => setAddressType("office")}
                className={`px-3 py-2 rounded border ${
                  addressType === "office"
                    ? "bg-gray-800 text-white"
                    : "bg-white"
                }`}
              >
                Văn Phòng
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <input
              id="isDefault"
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
            />
            <label htmlFor="isDefault" className="text-sm">
              Đặt làm địa chỉ mặc định
            </label>
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1">
            Phương thức thanh toán
          </label>
          <select
            className="w-full border p-2 rounded"
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
          >
            <option value="COD">Thanh toán khi nhận hàng</option>
            <option value="CreditCard">Thẻ tín dụng</option>
            <option value="PayPal">PayPal</option>
          </select>
        </div>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Đang xử lý..." : "Xác nhận đặt hàng"}
        </button>
      </div>
    </div>
  );
}
