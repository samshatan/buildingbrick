import { ShopContext } from "@/context/ShopContext";
import { useContext, useState } from "react";
import type { ProductType } from "./ProductInterface";

interface ProductCardProps{
  product: ProductType;
}

function ProductCard({product}: ProductCardProps){

  const shop = useContext(ShopContext);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes && product.sizes.length > 0 ? product.sizes[0] : "One Size");
  
  if (!shop) return null;
  const { currency } = shop;

  return (
    <div className="product-card">
      <img loading="lazy" src={Array.isArray(product.image) ? product.image[0] : product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{currency}{product.price.toFixed(2)}</p>
      {product.sizes && product.sizes.length > 1 && ( // Only show if there's more than one size
        <div className="mb-4">
          <label htmlFor={`size-select-${product.id}`} className="block text-sm font-medium text-gray-700 mb-1">Select Size:</label>
          <select
            id={`size-select-${product.id}`}
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            {product.sizes.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      )}
      {/* <button onClick={handleAddToCart} disabled={!!itemInCart && itemInCart.quantity >= 10}>
        {itemInCart ? `Add More (${itemInCart.quantity})` : 'Add to Cart'}
      </button>
      <button onClick={}> */}

      {/* </button> */}
    </div>
  );
};
export default ProductCard;