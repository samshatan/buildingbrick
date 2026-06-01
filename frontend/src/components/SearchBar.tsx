import { ShopContext } from "@/context/ShopContext";
import { useContext } from "react";
// import { useLocation } from "react-router-dom";

function SearchBar(){

  const shop = useContext(ShopContext);
  if(!shop) return null;
  const { search, setSearch, showSearch } = shop;
  // const location = useLocation();
  // const [visible, setVisible] = useState(false);

  // useEffect(()=>{
  //   if(location.pathname.includes('collection')){
  //     setVisible(true);
  //   }
  //   else{
  //     setVisible(false);
  //   }
  // },[location])

  return showSearch /* && visible */ ? (
    <div className="hidden sm:flex text-center">
      <div className="inline-flex items-center justify-center border border-white px-5 py-2">
      <input value={search} onChange={(e)=>setSearch(e.target.value)} type="text" className="flex-1 outline-none bg-inherit text-sm" placeholder="Search" />
      </div>
    </div>
  ) : null
}
export default SearchBar;