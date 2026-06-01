import { useEffect, useState } from "react";
import Title from "./Title";
import WorkerCard, { type WorkerProfileResponse } from "./WorkerCard";

function FeaturedWorkers() {
  const [featuredWorkers, setFeaturedWorkers] = useState<WorkerProfileResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/workers')
      .then(res => res.json())
      .then((data: WorkerProfileResponse[]) => {
        // Just take the first 4 for now as "featured"
        setFeaturedWorkers(data.slice(0, 4));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="my-20 text-center py-12">
        <div className="inline-block mb-4">
           <Title text1={"Featured"} text2={"WORKERS"} />
        </div>
        <div className="flex justify-center mt-6">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (featuredWorkers.length === 0) {
    return (
      <div className="my-20 text-center py-12">
        <div className="inline-block mb-4">
           <Title text1={"Featured"} text2={"WORKERS"} />
        </div>
        <p className="text-gray-500 mt-4 font-medium text-lg">No workers available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="my-20">
      <div className="text-center mb-12">
        <div className="inline-block mb-4">
           <Title text1={"Featured"} text2={"WORKERS"} />
        </div>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-600 font-medium">
          Discover top-rated workers across construction, agriculture, and domestic services. Highly recommended professionals ready to help.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 gap-y-6">
        {featuredWorkers.map((worker) => (
          <WorkerCard key={worker.id} worker={worker} />
        ))}
      </div>
    </div>
  );
}

export default FeaturedWorkers;
