import { Link } from "react-router-dom";
import { BadgeCheck, MapPin, Star } from "lucide-react";

export interface WorkerProfileResponse {
  id: string;
  userId: string;
  displayName: string;
  categoryId: string;
  workerType: string;
  location: string;
  dailyRate: number;
  experienceYears: number;
  bio: string;
  skills: string;
  availabilityStatus: string;
  verified: boolean;
  featured: boolean;
  rating: number;
  jobsCompleted: number;
  photo?: string;
  distance?: number;
  insuranceStatus?: 'NOT_ENROLLED' | 'PENDING' | 'ACTIVE';
  insuranceOptInDate?: string;
}

function WorkerCard({ worker }: { worker: WorkerProfileResponse }) {
  return (
    <div className="border border-gray-150 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md hover:border-primary-200 hover:scale-[1.02] transition-all duration-300 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-lg font-bold text-gray-900 flex items-center gap-1.5">
            {worker.displayName}
            {worker.verified && <BadgeCheck className="w-5 h-5 text-green-600" />}
          </p>
          <p className="text-xs font-semibold text-secondary">{worker.workerType}</p>
        </div>
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
            worker.availabilityStatus === "AVAILABLE"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-amber-50 text-amber-700 border border-amber-200"
          }`}
        >
          {worker.availabilityStatus === "AVAILABLE" ? "Available" : "Busy"}
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
        <MapPin className="w-4 h-4 text-secondary-500 shrink-0" />
        <span className="truncate">{worker.location}</span>
        {worker.distance !== undefined && (
          <span className="text-primary bg-primary/10 px-2 py-0.5 rounded-full text-xs font-bold shrink-0 ml-auto">
            {(worker.distance / 1000).toFixed(1)} km
          </span>
        )}
      </div>
      <div className="flex items-center justify-between text-sm text-gray-600 font-medium">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span>{worker.rating?.toFixed(1) || "0.0"}</span>
          <span className="text-gray-400 font-normal">({worker.jobsCompleted} jobs)</span>
        </div>
        <p className="font-extrabold text-primary text-base">Rs {worker.dailyRate}/day</p>
      </div>
      <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
        <span className="font-medium">Experience: {worker.experienceYears} years</span>
        <span className="font-semibold text-gray-700 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">Priority: Dynamic</span>
      </div>
      <Link
        to={`/worker/${worker.id}`}
        className="mt-auto inline-flex items-center justify-center border-2 border-primary text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 cursor-pointer"
      >
        View Profile
      </Link>
    </div>
  );
}

export default WorkerCard;
