import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { products } from "../assets/frontend_assets/assets";

export interface ShopContextType {
  products: typeof products;
  currency: string;
  delivery_fee: number;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  showSearch: boolean;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
  cartItems: CartItem[];
  addToCart : (productId: string, size: string) => void;
  removeFromCart : (productId : string, size: string) => void;
  updateQuantity : (productId : string, size: string, newQuantity: number) => void;
  getTotalCartAmount: () => number;
  getTotalCartItems: () => number;
  // getTotalWishListItems: () => number;
  clearCart: () => void;
}

export interface CartItem{
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
}

export const ShopContext = createContext<ShopContextType | undefined>(undefined);

interface ShopContextProviderProps {
  children: ReactNode;
}

const ShopContextProvider = (props: ShopContextProviderProps) => {
  const currency = "Rs ";
  const delivery_fee = 10;
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(true);
  const [wishList] = useState<number>(()=>{
    try{
      const local = localStorage.getItem('wishList');
      return local? JSON.parse(local): [];
    }
    catch(error){
      console.error("Failed to fetch wishList from local storage", error);
      return [];
    }
  });

  useEffect(()=>{
    try{
      localStorage.setItem('wishList', JSON.stringify(wishList));
    }
    catch(error){
      console.error("Failed to save wishList to local storage", error);
    }
  },[wishList]);
  const [cartItems, setCartItems] = useState<CartItem[]>(()=>{
    try{
      const localCart = localStorage.getItem('cartItems');
      return localCart ? JSON.parse(localCart): [];
    }catch(error){
      console.error("Failed to fetcg", error);
      return [];
    }
  });

  useEffect(()=>{
    try{
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }catch(error){
      console.error("Failed to save the cart to local storage");
    }
  },[cartItems]);

  const addToCart = (productId: string, size: string) => {
    setCartItems((prevItems) =>{
      const existingItems = prevItems.findIndex((item) => item.id === productId && item.size === size);

      if (existingItems > -1) {
        return prevItems.map((item, index) =>
          index === existingItems
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      else{
        const productToAdd = products.find((item) => item.id ===productId);
        if(productToAdd){
          const imageUrl: string = Array.isArray(productToAdd.image)
          ? productToAdd.image[0]
          : productToAdd.image;
          return [...prevItems,{
            id: productToAdd.id,
            name: productToAdd.name,
            price: productToAdd.price,
            image: imageUrl,
            quantity: 1,
            size: size
          }];
        }
        return prevItems;
      }
    });
  };

  const removeFromCart = (productId: string, size: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => !(item.id === productId && item.size === size)));
  };

  const updateQuantity = (productId: string, size: string, newQuantity: number) => {
    setCartItems((prevItems) => {
      const itemToUpdateIndex = prevItems.findIndex(
        (item) => item.id === productId && item.size === size
      );

      if (itemToUpdateIndex === -1) {
        return prevItems;
      }
      const updatedItems = [...prevItems];
      const itemToUpdate = updatedItems[itemToUpdateIndex];

      if (newQuantity < 1) {
        return prevItems.filter((_item, index) => index !== itemToUpdateIndex);
      } else {
        updatedItems[itemToUpdateIndex] = {
          ...itemToUpdate,
          quantity: newQuantity,
        };
        return updatedItems;
      }
    });
  };

  // const AddWishList = (productId: string) =>{
  //   SetWishList((prevItems) =>{
  //     const existingItems = prevItems.findIndex((item) => item.id === productId);
  //     if (existingItems > -1) {
  //       return prevItems.map((item, index) =>
  //         index === existingItems
  //           ? { ...item, quantity: item.quantity + 1 }
  //           : item
  //       );
  //     }
  //     else{
  //       const productToAdd = products.find((item) => item.id ===productId);

         
  // };

  // const getTotalWishListItems = (): number =>{
  //   return wishList.reduce((total: number,item: any) => total+item.quantity,0);
  // }

  const getTotalCartAmount = (): number =>{
    return cartItems.reduce((total: number, item: any) => total+ item.price*item.quantity, 0);
  };

  const getTotalCartItems =(): number =>{
    return cartItems.reduce((total: number, item: any) => total + item.quantity , 0);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const value: ShopContextType = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalCartAmount,
    // getTotalWishListItems,
    getTotalCartItems,
    clearCart,
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;