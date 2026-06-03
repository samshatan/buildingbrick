import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      // Prevent the default mini-infobar from appearing
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI to notify the user they can install the PWA
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    window.addEventListener("appinstalled", () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the actual browser install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    
    // We can't use the prompt again
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-96 bg-white border border-gray-100 shadow-2xl rounded-2xl p-5 z-[9999] animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden shadow-inner border border-primary/20">
            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="font-extrabold text-gray-900 leading-tight">Install BrickOurHouse</h3>
            <p className="text-sm text-gray-500 font-medium mt-0.5">Add to home screen for faster access</p>
          </div>
        </div>
        <button 
          onClick={() => setShowPrompt(false)} 
          className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full p-1.5 transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <button 
        onClick={handleInstallClick}
        className="mt-5 w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl shadow-md shadow-primary/20 hover:shadow-lg transition-all"
      >
        <Download className="w-4 h-4" /> Install App Now
      </button>
    </div>
  );
}
