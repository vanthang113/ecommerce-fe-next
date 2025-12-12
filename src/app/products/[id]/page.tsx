"use client";

import { Suspense } from "react";
import VoucherSelector from "@/components/Voucher";
import ProductImages from "@/components/ProductImages";
import ProductInfo from "@/components/ProductInfo";
import ProductActions from "@/components/ProductActions";
import ProductReviews from "@/components/ProductReviews";
import RelatedProducts from "@/components/RelatedProducts";
import Breadcrumb from "@/components/Breadcrumb";
import { useProductDetail } from "@/hooks/useProductDetail";
import { useCartActions } from "@/hooks/useCartActions";

function ProductDetailContent() {
  const {
    product,
    loading,
    selectedImage,
    selectedColor,
    quantity,
    reviews,
    relatedProducts,
    addingToCart,
    redirectingToLogin,
    selectedVoucher,
    userToken,
    setSelectedImage,
    setSelectedColor,
    setQuantity,
    setAddingToCart,
    setRedirectingToLogin,
    setSelectedVoucher,
    isOutOfStock,
    maxQuantity,
    averageRating,
    voucherDiscount,
    finalPrice,
    productId,
  } = useProductDetail();

  const cartActions = useCartActions({
    product,
    quantity,
    finalPrice,
    isOutOfStock,
    setQuantity,
    setAddingToCart,
    setRedirectingToLogin,
    userToken,
    productId,
  });

  if (loading) return <LoadingSpinner />;
  if (!product) return <p className="text-center mt-10">Không tìm thấy sản phẩm</p>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <Breadcrumb productName={product.name} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <ProductImages
          images={product.images || []}
          selectedImage={selectedImage}
          onSelectImage={setSelectedImage}
          productName={product.name}
        />

        <div className="space-y-6">
          <ProductInfo
            product={product}
            averageRating={averageRating}
            reviewsCount={reviews.length}
            voucherDiscount={voucherDiscount}
            finalPrice={finalPrice}
          />

          <ProductActions
            product={product}
            quantity={quantity}
            setQuantity={setQuantity}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            isOutOfStock={isOutOfStock()}
            maxQuantity={maxQuantity}
            userToken={userToken}
            addingToCart={addingToCart}
            redirectingToLogin={redirectingToLogin}
            onAddToCart={cartActions.handleAddToCart}
            onBuyNow={cartActions.handleBuyNow}
            onAddToCartAndLogin={cartActions.handleAddToCartAndLogin}
          />

          <VoucherSelector
            selectedVoucher={selectedVoucher}
            onSelectVoucher={setSelectedVoucher}
            productPrice={product ? Number(product.price) : 0}
          />
        </div>
      </div>

      <ProductReviews
        productId={productId}
        reviews={reviews}
        averageRating={averageRating}
        productName={product.name}
        selectedColor={selectedColor}
      />

      <RelatedProducts products={relatedProducts} />
    </div>
  );
}

// Thêm component LoadingSpinner nếu chưa có
function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProductDetailContent />
    </Suspense>
  );
}