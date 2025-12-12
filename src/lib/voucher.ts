// types/voucher.ts
export interface Voucher {
  id: string;
  code: string;
  name: string;
  description: string;
  discountType: "fixed" | "percentage";
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  expiryDate?: string;
  isActive: boolean;
}

export interface VoucherSelectorProps {
  selectedVoucher: Voucher | null;
  onSelectVoucher: (voucher: Voucher | null) => void;
  productPrice: number;
  availableVouchers?: Voucher[];
}