import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';

function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r: any) {
      console.log('SW Registered:', r);
    },
    onRegisterError(error: any) {
      console.log('SW registration error', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!offlineReady && !needRefresh) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-96 bg-white border border-gray-200 shadow-xl rounded-2xl p-4 z-[9999] animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-bold text-gray-900 mb-1">
            {offlineReady ? 'App ready to work offline' : 'New update available!'}
          </h3>
          <p className="text-sm text-gray-500 font-medium">
            {offlineReady 
              ? 'You can now use this app without an internet connection.'
              : 'A new version of BrickOurHouse is available. Reload to update.'}
          </p>
        </div>
        <button onClick={close} className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full p-1 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {needRefresh && (
        <button 
          onClick={() => updateServiceWorker(true)}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-600 transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Reload and Update
        </button>
      )}
    </div>
  );
}

export default ReloadPrompt;
