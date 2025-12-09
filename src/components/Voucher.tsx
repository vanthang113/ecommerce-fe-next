// /components/Voucher.tsx
"use client";

import { useState } from "react";
import { Voucher, VoucherSelectorProps } from "@/lib/voucher";

export default function VoucherSelector({
  selectedVoucher,
  onSelectVoucher,
  productPrice,
  availableVouchers = []
}: VoucherSelectorProps) {
  const [showModal, setShowModal] = useState(false);

  // Hardcode tạm như cũ nếu không truyền từ ngoài
  const defaultVouchers: Voucher[] = [
    {
      id: "1",
      code: "NEWUSER50",
      name: "Giảm 50K cho đơn từ 500K",
      description: "Giảm 50.000đ cho đơn hàng từ 500.000đ",
      discountType: "fixed",
      discountValue: 50000,
      minOrderAmount: 500000,
      expiryDate: "2024-12-31",
      isActive: true
    },
    {
      id: "2",
      code: "FREESHIP30",
      name: "Miễn phí vận chuyển 30K",
      description: "Miễn phí vận chuyển lên đến 30.000đ",
      discountType: "fixed",
      discountValue: 30000,
      minOrderAmount: 200000,
      expiryDate: "2024-12-31",
      isActive: true
    },
    {
      id: "3",
      code: "FLASHSALE20",
      name: "Giảm 20% tối đa 100K",
      description: "Giảm 20% giá trị đơn hàng, tối đa 100.000đ",
      discountType: "percentage",
      discountValue: 20,
      minOrderAmount: 300000,
      maxDiscount: 100000,
      expiryDate: "2024-12-31",
      isActive: true
    },
    {
      id: "4",
      code: "SUMMER10",
      name: "Giảm 10K mọi đơn hàng",
      description: "Giảm 10.000đ cho mọi đơn hàng",
      discountType: "fixed",
      discountValue: 10000,
      minOrderAmount: 100000,
      expiryDate: "2024-12-31",
      isActive: true
    }
  ];

  const vouchers = availableVouchers.length > 0 ? availableVouchers : defaultVouchers;

  const calculateDiscount = (voucher: Voucher) => {
    if (productPrice < voucher.minOrderAmount) return 0;
    if (voucher.discountType === "fixed") return voucher.discountValue;
    const amount = (productPrice * voucher.discountValue) / 100;
    return voucher.maxDiscount ? Math.min(amount, voucher.maxDiscount) : amount;
  };

  return (
    <>
      {/* Voucher Section */}
      <div>
        <div className="flex items-center justify-between">
          <label className="font-medium">Voucher</label>
          <button
            onClick={() => setShowModal(true)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Xem tất cả voucher
          </button>
        </div>

        <div className="mt-2 space-y-2">
          {selectedVoucher ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-green-700">{selectedVoucher.name}</p>
                  <p className="text-sm text-green-600">{selectedVoucher.description}</p>
                  <p className="text-sm text-green-600">
                    Mã: <span className="font-mono">{selectedVoucher.code}</span>
                  </p>
                </div>
                <button
                  onClick={() => onSelectVoucher(null)}
                  className="text-sm text-red-600 hover:text-red-800 ml-2"
                >
                  Bỏ chọn
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowModal(true)}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col items-center justify-center">
                <span className="text-gray-500 mb-1">Gift</span>
                <span className="text-sm text-gray-600">
                  Chọn hoặc nhập mã voucher
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  Bạn có thể chọn 1 voucher
                </span>
              </div>
            </button>
          )}

          {selectedVoucher && (
            <p className="text-sm text-green-600 mt-1">
              Đã áp dụng voucher: -{calculateDiscount(selectedVoucher).toLocaleString()}₫
            </p>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Chọn Voucher</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Chọn 1 voucher để áp dụng cho đơn hàng này
              </p>
              <div className="mt-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nhập mã voucher..."
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                    Áp dụng
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <h3 className="font-medium mb-4">Voucher có sẵn</h3>
              <div className="space-y-4">
                {vouchers.map((voucher) => {
                  const canUse = productPrice >= voucher.minOrderAmount;
                  return (
                    <div
                      key={voucher.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedVoucher?.id === voucher.id
                          ? "border-green-500 bg-green-50"
                          : canUse
                          ? "border-gray-200 hover:border-gray-300"
                          : "border-gray-200 opacity-60"
                      }`}
                      onClick={() => {
                        if (canUse) {
                          onSelectVoucher(voucher);
                          setShowModal(false);
                        }
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">Gift</span>
                            <h4 className="font-semibold text-gray-900">{voucher.name}</h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{voucher.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div>Đơn tối thiểu: {voucher.minOrderAmount.toLocaleString()}₫</div>
                            {voucher.expiryDate && (
                              <div>HSD: {new Date(voucher.expiryDate).toLocaleDateString('vi-VN')}</div>
                            )}
                          </div>
                          <div className="mt-2">
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                              {voucher.code}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          {voucher.discountType === "fixed" ? (
                            <span className="text-lg font-bold text-red-600">
                              -{voucher.discountValue.toLocaleString()}₫
                            </span>
                          ) : (
                            <span className="text-lg font-bold text-red-600">
                              -{voucher.discountValue}%
                              {voucher.maxDiscount && (
                                <div className="text-sm text-gray-500">
                                  Tối đa {voucher.maxDiscount.toLocaleString()}₫
                                </div>
                              )}
                            </span>
                          )}
                          <button className="text-sm text-blue-600 hover:text-blue-800 mt-2 block">
                            {selectedVoucher?.id === voucher.id ? "Đã chọn" : canUse ? "Chọn" : "Không đủ điều kiện"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 border-t">
              <div className="flex justify-between items-center">
                <div>
                  {selectedVoucher && (
                    <p className="text-sm text-gray-600">
                      Đã chọn: <span className="font-medium">{selectedVoucher.name}</span>
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Đóng
                  </button>
                  <button
                    onClick={() => {
                      onSelectVoucher(null);
                      setShowModal(false);
                    }}
                    className="px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
                  >
                    Bỏ chọn
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}