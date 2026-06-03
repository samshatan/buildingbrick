import { useState, useEffect } from "react";
import { WifiOff, RefreshCw } from "lucide-react";

function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
      <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
        <WifiOff className="w-12 h-12 text-red-500" />
      </div>
      <h2 className="text-2xl font-extrabold text-gray-900 mb-2">You're Offline</h2>
      <p className="text-gray-500 font-medium max-w-sm mb-8">
        It looks like you've lost your internet connection. Check your network settings and try again.
      </p>
      <button 
        onClick={() => window.location.reload()}
        className="flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-colors"
      >
        <RefreshCw className="w-4 h-4" /> Try Again
      </button>
    </div>
  );
}

export default OfflineIndicator;
