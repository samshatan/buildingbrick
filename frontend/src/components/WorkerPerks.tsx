import { Link } from "react-router-dom";
import Title from "./Title";

export default function WorkerPerks() {
  const perks = [
    { title: "Worker Insurance", path: "/insurance", icon: "🛡️", desc: "Worker Health/ Life Insurance" },
    { title: "Micro-Loans", path: "/loans", icon: "💰", desc: "Quick and Easy Loans" },
    { title: "Open for Work / vBank", path: "/vbank-account", icon: "🏦", desc: "Easy to open Bank Account" },
  ];


  return (
    <div className="my-16 bg-purple-50 rounded-3xl p-8 border border-purple-100">
      <div className="text-center mb-8">
        <Title text1={"Worker"} text2={"PERKS"} />
        <p className="text-gray-600 mt-2">Exclusive benefits for our platform professionals</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {perks.map((perk, index) => (
          <Link 
            key={index}
            to={perk.path}
            className="group block bg-white rounded-2xl p-6 shadow-sm border border-purple-100 hover:shadow-md hover:border-purple-300 transition-all text-center"
          >
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
              <span className="text-3xl">{perk.icon}</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-purple-700 transition-colors">{perk.title}</h3>
            <p className="text-sm text-gray-500">{perk.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
