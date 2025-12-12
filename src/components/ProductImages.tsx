"use client";

interface ProductImagesProps {
  images: string[];
  selectedImage: number;
  onSelectImage: (index: number) => void;
  productName: string;
}

export default function ProductImages({
  images,
  selectedImage,
  onSelectImage,
  productName
}: ProductImagesProps) {
  return (
    <div className="space-y-4">
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={images?.[selectedImage] || "/placeholder.png"}
          alt={productName}
          className="w-full h-full object-cover"
        />
      </div>
      
      {images?.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img: string, index: number) => (
            <button
              key={index}
              onClick={() => onSelectImage(index)}
              className={`w-16 h-16 rounded border-2 ${
                selectedImage === index
                  ? "border-orange-500"
                  : "border-gray-200"
              } overflow-hidden`}
            >
              <img src={img} className="w-full h-full object-cover" alt={`${productName} - ảnh ${index + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}