import { ShopContext } from "@/context/ShopContext";
import { useContext } from "react";

function SearchBar(){

  const shop = useContext(ShopContext);
  if(!shop) return null;
  const { search, setSearch, showSearch } = shop;

  return showSearch ? (
    <div className="hidden sm:flex text-center">
      <div className="inline-flex items-center justify-center border border-white px-5 py-2">
      <input value={search} onChange={(e)=>setSearch(e.target.value)} type="text" className="flex-1 outline-none bg-inherit text-sm" placeholder="Search" />
      </div>
    </div>
  ) : null
}
export default SearchBar;