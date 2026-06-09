import { X, Printer, ShieldCheck, MapPin, Phone, Briefcase } from "lucide-react";

interface IdCardModalProps {
  user: any;
  workerProfile: any;
  onClose: () => void;
}

export default function IdCardModal({ user, workerProfile, onClose }: IdCardModalProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 print:bg-white print:p-0">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #id-card-printable, #id-card-printable * {
            visibility: visible;
          }
          #id-card-printable {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
        }
      `}</style>
      
      {/* Modal Actions */}
      <div className="absolute top-4 right-4 flex gap-2 print:hidden">
        <button onClick={handlePrint} className="p-2 bg-white rounded-full hover:bg-gray-100 shadow transition-transform hover:scale-105" title="Print ID Card">
          <Printer className="w-5 h-5 text-gray-700" />
        </button>
        <button onClick={onClose} className="p-2 bg-white rounded-full hover:bg-gray-100 shadow transition-transform hover:scale-105" title="Close">
          <X className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* ID Card Wrapper */}
      <div id="id-card-printable" className="w-[340px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 relative print:shadow-none print:border print:border-gray-200">
        {/* Header Gradient */}
        <div className="h-32 bg-gradient-to-br from-gray-900 to-black relative">
          <div className="absolute top-5 left-5">
            <span className="text-white font-black text-xl tracking-tighter">BrickOurHouse</span>
            <span className="block text-primary-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">Verified Partner</span>
          </div>
          <div className="absolute top-5 right-5 bg-white/10 px-2.5 py-1 rounded-md text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-md border border-white/10">
            ID CARD
          </div>
        </div>

        {/* Profile Info */}
        <div className="relative px-6 pt-16 pb-6 text-center bg-white">
          {/* Photo */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full border-[6px] border-white overflow-hidden bg-gray-100 shadow-xl">
            {workerProfile.photo ? (
              <img src={workerProfile.photo} alt={user.fullName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-5xl font-extrabold">
                {user.fullName?.charAt(0).toUpperCase()}
              </div>
            )}
            {workerProfile.verified && (
              <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-sm">
                <ShieldCheck className="w-7 h-7 text-green-500" />
              </div>
            )}
          </div>

          <h2 className="text-2xl font-extrabold text-gray-900 mb-1">{user.fullName}</h2>
          <p className="text-primary-600 font-bold text-sm uppercase tracking-wide mb-6">
            {workerProfile.workerType || "Professional Worker"}
          </p>

          <div className="space-y-3 text-left">
            <div className="flex items-center gap-3.5 p-3.5 bg-gray-50/80 rounded-2xl border border-gray-100">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Contact Number</p>
                <p className="text-sm font-bold text-gray-800">{user.phone || "Not Provided"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 bg-gray-50/80 rounded-2xl border border-gray-100">
              <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Service Area</p>
                <p className="text-sm font-bold text-gray-800 line-clamp-2 leading-tight">
                  {workerProfile.location || "Not Specified"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3.5 p-3.5 bg-gray-50/80 rounded-2xl border border-gray-100">
              <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Worker ID</p>
                <p className="text-sm font-mono font-bold text-gray-800">
                  {workerProfile.id ? workerProfile.id.split('-')[0].toUpperCase() : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 py-4 text-center border-t border-gray-100">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Official Worker Identification</p>
        </div>
      </div>
    </div>
  );
}
