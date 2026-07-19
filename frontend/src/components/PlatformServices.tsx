import { Link } from "react-router-dom";
import Title from "./Title";

export default function PlatformServices() {
  const services = [
    { title: "Construction Materials", path: "/materials", icon: "🧱", desc: "Cement, steel, bricks & more" },
    { title: "Full House Construction", path: "/full-house-construction", icon: "🏗️", desc: "End-to-end building services" },
    { title: "Posted Works", path: "/requests", icon: "💼", desc: "Find or post job requirements" },
    { title: "Expert Inspection", path: "/expert-inspection", icon: "🔎", desc: "Quality & product checks" },
    { title: "Bulk Orders", path: "/bulk-orders", icon: "🚚", desc: "Wholesale materials at discounts" },
  ];


  return (
    <div className="my-16">
      <div className="text-center mb-8">
        <Title text1={"Platform"} text2={"SERVICES"} />
        <p className="text-gray-500 mt-2">Everything you need for your construction projects</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <Link 
            key={index}
            to={service.path}
            className="group block bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/30 transition-all text-center"
          >
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 transition-colors">
              <span className="text-3xl">{service.icon}</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">{service.title}</h3>
            <p className="text-sm text-gray-500">{service.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
