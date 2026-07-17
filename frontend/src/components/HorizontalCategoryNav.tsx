import { useNavigate } from "react-router-dom";
import constructionWorker from "../assets/construction_worker.png";
import domesticWorker from "../assets/domestic_worker.png";
import utilitiesWorker from "../assets/utilities_worker.png";
import interiorWorker from "../assets/interior_worker.png";

const categories = [
  { id: "construction", name: "Construction", image: constructionWorker, bgColor: "bg-pink-100" },
  { id: "domestic", name: "Domestic", image: domesticWorker, bgColor: "bg-blue-100" },
  { id: "utilities", name: "Utilities", image: utilitiesWorker, bgColor: "bg-green-100" },
  { id: "interior", name: "Interior", image: interiorWorker, bgColor: "bg-purple-100" },
];

function HorizontalCategoryNav() {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-white py-4 mt-2 border-b border-gray-100">
      <div className="flex overflow-x-auto gap-4 md:gap-8 px-4 justify-start md:justify-center">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => navigate(`/workers?category=${category.id}`)}
            className="flex flex-col items-center cursor-pointer min-w-[76px] md:min-w-[90px] shrink-0 group"
          >
            <div className={`w-[70px] h-[76px] md:w-[84px] md:h-[90px] ${category.bgColor} rounded-t-full rounded-b-xl flex justify-center items-end overflow-hidden pt-2 transition-transform group-hover:scale-105`}>
              <img 
                src={category.image} 
                alt={category.name} 
                className="w-[90%] h-auto object-contain drop-shadow-md"
              />
            </div>
            <span className="text-xs md:text-sm font-medium text-gray-700 mt-2 text-center group-hover:text-primary transition-colors">
              {category.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HorizontalCategoryNav;
