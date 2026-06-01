import Title from "./Title";
import { workerCategories } from "@/data/marketplaceData";
import { CheckCircle } from "lucide-react";

function WorkerCategories() {
  return (
    <div className="my-20">
      <div className="text-center mb-12">
        <div className="inline-block mb-4">
           <Title text1={"Worker"} text2={"CATEGORIES"} />
        </div>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-600 font-medium">
          Choose the worker type you need from our extensive categories. Whether building a house or managing a farm, we have the right professionals.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {workerCategories.map((category) => (
          <div
            key={category.id}
            className="group relative bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full"
          >
            {/* Subtle background decoration */}
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

            <div className="relative z-10 flex-1">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight group-hover:text-primary transition-colors">{category.name}</h3>
                <span className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full bg-secondary-50 text-secondary-700 border border-secondary-200">
                  Dynamic Priority
                </span>
              </div>
              
              <ul className="space-y-4">
                {category.types.map((type) => (
                  <li key={type} className="flex items-start gap-3 text-sm text-gray-600 font-medium">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0 opacity-70" />
                    <span className="leading-tight">{type}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="relative z-10 mt-8 pt-6 border-t border-gray-100">
               <button className="w-full text-center text-sm font-bold text-gray-900 bg-gray-50 hover:bg-primary hover:text-white py-3 rounded-xl transition-colors duration-200">
                  Explore {category.name}
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorkerCategories;
