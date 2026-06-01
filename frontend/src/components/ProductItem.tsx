import { ShopContext } from "@/context/ShopContext";
import { useContext } from "react";
import { Link } from "react-router-dom";

function ProductItem({id,image,name,price}:{id: string, image: string[], name: string, price: number}){
  const shop = useContext(ShopContext);
  if (!shop) return null;
  const { currency } = shop;
  return(
    <Link className="text-gray-700 cursor-pointer" to={`/product/${id}`}>
      <div className="overflow-hidden">
        <img loading="lazy" src={image[0]} className="hover:scale-110 transition:ease-in-out" alt={name + " product image"} />
      </div>
      <p className="pt-3 pb-1 text-sm">{name}</p>
      <p className="text-sm font-medium">{currency}{price}</p>
    </Link>
  )
}
export default ProductItem;