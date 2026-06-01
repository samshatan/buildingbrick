import { useEffect, useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import Title from "@/components/Title";
import WorkerCard, { type WorkerProfileResponse } from "@/components/WorkerCard";
import { workerCategories } from "@/data/marketplaceData";
import { Filter, Search, ChevronDown, Check, X } from "lucide-react";

function Collection() {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("recommended");

  const [workers, setWorkers] = useState<WorkerProfileResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/workers')
      .then(res => res.json())
      .then(data => {
        setWorkers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch workers:", err);
        setLoading(false);
      });
  }, []);

  const allWorkerTypes = useMemo(
    () => workerCategories.flatMap((category) => category.types),
    []
  );

  const filteredWorkers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    let results = workers.slice();

    if (normalizedSearch) {
      results = results.filter(
        (worker) =>
          worker.displayName.toLowerCase().includes(normalizedSearch) ||
          worker.workerType.toLowerCase().includes(normalizedSearch) ||
          worker.location.toLowerCase().includes(normalizedSearch)
      );
    }

    if (selectedCategories.length > 0) {
      results = results.filter((worker) => selectedCategories.includes(worker.categoryId));
    }

    if (selectedTypes.length > 0) {
      results = results.filter((worker) => {
        // If workerType is comma separated, check if any matches
        const workerTypes = worker.workerType.split(',').map(t => t.trim());
        return selectedTypes.some(type => workerTypes.includes(type));
      });
    }

    switch (sortType) {
      case "rate-low-high":
        return results.sort((a, b) => a.dailyRate - b.dailyRate);
      case "rate-high-low":
        return results.sort((a, b) => b.dailyRate - a.dailyRate);
      case "rating-high-low":
        return results.sort((a, b) => b.rating - a.rating);
      default:
        return results.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.rating - a.rating;
        });
    }
  }, [search, selectedCategories, selectedTypes, sortType, workers]);

  const toggleSelection = (
    value: string,
    current: string[],
    setter: Dispatch<SetStateAction<string[]>>
  ) => {
    if (current.includes(value)) {
      setter(current.filter((item) => item !== value));
    } else {
      setter([...current, value]);
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedTypes([]);
    setSearch("");
  };

  const activeFilterCount = selectedCategories.length + selectedTypes.length;

  return (
    <div className="min-h-screen bg-gray-50/30 py-8 px-4 sm:px-6 lg:px-8">
      
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Title text1={"Worker"} text2={"DIRECTORY"} />
          <p className="text-sm text-gray-500 font-medium mt-2 max-w-2xl">
            Find and hire the best professionals for your construction, agricultural, and domestic needs.
          </p>
        </div>
        
        {/* Search & Sort Container */}
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search className="h-5 w-5" />
            </div>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, skill..."
              className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm outline-none font-medium"
            />
          </div>
          <div className="relative min-w-[200px]">
             <select
              value={sortType}
              onChange={(event) => setSortType(event.target.value)}
              className="block w-full appearance-none px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm outline-none font-semibold text-gray-700 cursor-pointer"
            >
              <option value="recommended">Recommended First</option>
              <option value="rating-high-low">Highest Rated</option>
              <option value="rate-low-high">Daily Rate: Low to High</option>
              <option value="rate-high-low">Daily Rate: High to Low</option>
            </select>
            <ChevronDown className="absolute right-4 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <div className="lg:w-72 shrink-0">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 lg:sticky lg:top-24">
            
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </h2>
              
              <button 
                onClick={() => setShowFilter(!showFilter)}
                className="lg:hidden p-2 bg-gray-50 rounded-lg text-gray-500 hover:text-gray-900"
              >
                {showFilter ? <X className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            <div className={`space-y-8 ${showFilter ? "block" : "hidden"} lg:block`}>
              
              {/* Categories Filter */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Categories</h3>
                <div className="space-y-3">
                  {workerCategories.map((category) => (
                    <label key={category.id} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => toggleSelection(category.id, selectedCategories, setSelectedCategories)}
                        />
                        <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-primary peer-checked:border-primary peer-hover:border-primary/50 transition-all"></div>
                        <Check className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" strokeWidth={3} />
                      </div>
                      <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="h-px bg-gray-100 w-full"></div>

              {/* Worker Types Filter */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Professions</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  {allWorkerTypes.map((type) => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                       <div className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={selectedTypes.includes(type)}
                          onChange={() => toggleSelection(type, selectedTypes, setSelectedTypes)}
                        />
                        <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-secondary peer-checked:border-secondary peer-hover:border-secondary/50 transition-all"></div>
                        <Check className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" strokeWidth={3} />
                      </div>
                      <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                        {type}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {activeFilterCount > 0 && (
                <button 
                  onClick={clearFilters}
                  className="w-full py-2.5 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-bold rounded-xl transition-colors border border-gray-200"
                >
                  Clear All Filters
                </button>
              )}

            </div>
          </div>
        </div>

        {/* Worker Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-gray-100 shadow-sm h-full min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary mb-4"></div>
              <p className="text-gray-500 font-medium">Loading professionals...</p>
            </div>
          ) : filteredWorkers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-gray-100 shadow-sm h-full min-h-[400px] text-center px-4">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No workers found</h3>
              <p className="text-gray-500 font-medium max-w-sm">
                We couldn't find any professionals matching your current filters. Try adjusting your search or clearing filters.
              </p>
              <button 
                onClick={clearFilters}
                className="mt-8 px-6 py-2.5 bg-primary/10 text-primary hover:bg-primary/20 font-bold rounded-full transition-colors text-sm"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredWorkers.map((worker) => (
                <WorkerCard key={worker.id} worker={worker} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Collection;
