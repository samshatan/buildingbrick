import { useState, useEffect } from "react";
import { Search, UserCheck, Printer, CheckCircle2, Store, Clock, Activity } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

interface WorkerProfile {
  id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
  };
  displayName: string;
  workerType: string;
  verified: boolean;
  verifiedAt?: string;
  cafePaymentStatus?: string;
}

function CafeDashboard() {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState<"pending" | "verified">("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<WorkerProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [unverifiedQueue, setUnverifiedQueue] = useState<WorkerProfile[]>([]);
  const [verifiedHistory, setVerifiedHistory] = useState<WorkerProfile[]>([]);
  const [queueLoading, setQueueLoading] = useState(true);
  
  // Selection state for payment
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  
  // For printing the certificate
  const [printWorker, setPrintWorker] = useState<WorkerProfile | null>(null);

  useEffect(() => {
    setSelectedWorkers([]);
    if (activeTab === "pending") {
      fetchUnverifiedQueue();
    } else {
      fetchVerifiedHistory();
    }
  }, [activeTab]);

  const fetchUnverifiedQueue = async () => {
    try {
      const res = await fetch(`/api/v1/cafes/workers/unverified`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUnverifiedQueue(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setQueueLoading(false);
    }
  };

  const fetchVerifiedHistory = async () => {
    setQueueLoading(true);
    try {
      const res = await fetch(`/api/v1/cafes/workers/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setVerifiedHistory(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setQueueLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/v1/cafes/workers/search?query=${encodeURIComponent(searchQuery)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      } else {
        const err = await res.json();
        toast.error(err.message || "No workers found.");
        setSearchResults([]);
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while searching.");
    } finally {
      setLoading(false);
    }
  };

  const verifyWorker = async (workerId: string) => {
    if (!window.confirm("Are you sure you have collected Rs 118 and verified their documents?")) return;

    const loadingToast = toast.loading("Verifying worker...");
    try {
      const res = await fetch(`/api/v1/cafes/workers/verify/${workerId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        toast.update(loadingToast, { render: "Worker verified successfully!", type: "success", isLoading: false, autoClose: 3000 });
        
        // Update local state
        setSearchResults(prev => prev.map(w => w.id === workerId ? data.worker : w));
        setUnverifiedQueue(prev => prev.filter(w => w.id !== workerId)); // Remove from queue
        setPrintWorker(data.worker); // Open print view
      } else {
        const err = await res.json();
        toast.update(loadingToast, { render: err.message || "Verification failed.", type: "error", isLoading: false, autoClose: 3000 });
      }
    } catch (err) {
      console.error(err);
      toast.update(loadingToast, { render: "An error occurred.", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleWorkerSelection = (workerId: string) => {
    setSelectedWorkers(prev => 
      prev.includes(workerId) ? prev.filter(id => id !== workerId) : [...prev, workerId]
    );
  };

  const handlePayOnline = async () => {
    if (selectedWorkers.length === 0) return;
    setProcessingPayment(true);
    const toastId = toast.loading("Processing payment...");
    
    try {
      const res = await fetch(`/api/v1/cafes/workers/pay-online`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ workerIds: selectedWorkers })
      });
      
      const data = await res.json();
      if (res.ok) {
        toast.update(toastId, { render: data.message || "Payment successful!", type: "success", isLoading: false, autoClose: 3000 });
        setShowPaymentModal(false);
        setSelectedWorkers([]);
        fetchVerifiedHistory(); // Refresh history
      } else {
        toast.update(toastId, { render: data.message || "Payment failed.", type: "error", isLoading: false, autoClose: 3000 });
      }
    } catch (err) {
      console.error(err);
      toast.update(toastId, { render: "An error occurred.", type: "error", isLoading: false, autoClose: 3000 });
    } finally {
      setProcessingPayment(false);
    }
  };

  // Compute Recent Activity
  const recentActivity = [...verifiedHistory.map(w => ({
    id: w.id,
    title: `Worker Verified`,
    desc: w.userId?.name || 'Unknown User',
    date: new Date(w.verifiedAt || Date.now()).getTime(),
    icon: <CheckCircle2 className="w-4 h-4 text-green-500" />
  }))].sort((a, b) => b.date - a.date).slice(0, 8);

  if (printWorker) {

    return (
      <div className="min-h-screen bg-gray-100 p-8 sm:p-12 font-sans flex flex-col items-center justify-center gap-8">
        {/* Page 1: Registration Form */}
        <div className="relative w-full max-w-[210mm] mx-auto bg-white p-12 min-h-[297mm] shadow-2xl print:shadow-none print:w-[210mm] print:h-[297mm] print:min-h-0 print:m-0 print:p-8">
          
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-red-700 tracking-wide uppercase">Brick Our House</h1>
            <p className="text-lg font-bold text-gray-600 uppercase tracking-widest mt-1">Building Your Home</p>
            <h2 className="text-xl font-bold text-gray-900 underline underline-offset-4 mt-4">Worker Onboarding & Registration Form</h2>
          </div>

          <div className="space-y-6">
            {/* Section 1 */}
            <div>
              <div className="bg-red-700 text-white font-bold p-2 mb-4 border border-black">
                1. WORKER PERSONAL PROFILE & FAMILY DETAILS
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1 space-y-5">
                  <div className="flex items-end">
                    <span className="font-bold text-sm whitespace-nowrap">पूरा नाम (Full Name):</span>
                    <span className="flex-1 border-b border-dashed border-gray-500 mx-2 text-lg font-semibold px-2">{printWorker.userId?.name || ''}</span>
                  </div>
                  
                  <div className="flex items-end">
                    <span className="font-bold text-sm whitespace-nowrap">मोबाइल नं. (Mobile No):</span>
                    <span className="w-40 border-b border-dashed border-gray-500 mx-2 text-lg font-semibold px-2">{printWorker.userId?.phone || printWorker.userId?.email || ''}</span>
                    <span className="font-bold text-sm whitespace-nowrap ml-4">व्हाट्सएप नं. (WhatsApp No):</span>
                    <span className="flex-1 border-b border-dashed border-gray-500 mx-2"></span>
                  </div>

                  <div className="flex items-end">
                    <span className="font-bold text-sm whitespace-nowrap">आधार/पहचान पत्र नं. (Aadhaar/ID No):</span>
                    <span className="flex-1 border-b border-dashed border-gray-500 mx-2"></span>
                  </div>

                  <div className="flex items-end">
                    <span className="font-bold text-sm whitespace-nowrap">ब्लड ग्रुप (Blood Group):</span>
                    <span className="w-24 border-b border-dashed border-gray-500 mx-2"></span>
                    <span className="font-bold text-sm whitespace-nowrap ml-2">आपातकालीन संपर्क:</span>
                    <span className="flex-1 border-b border-dashed border-gray-500 mx-2"></span>
                    <span className="font-bold text-sm whitespace-nowrap ml-2">संबंध:</span>
                    <span className="w-32 border-b border-dashed border-gray-500 mx-2"></span>
                  </div>

                  <div className="flex items-end">
                    <span className="font-bold text-sm whitespace-nowrap">वर्तमान पता (Current Address):</span>
                    <span className="flex-1 border-b border-dashed border-gray-500 mx-2"></span>
                  </div>
                  <div className="flex items-end">
                    <span className="flex-1 border-b border-dashed border-gray-500 mx-2 mt-4"></span>
                  </div>

                  <div className="flex items-end">
                    <span className="font-bold text-sm whitespace-nowrap">स्थायी पता (Permanent Address):</span>
                    <span className="flex-1 border-b border-dashed border-gray-500 mx-2"></span>
                  </div>
                  <div className="flex items-end">
                    <span className="flex-1 border-b border-dashed border-gray-500 mx-2 mt-4"></span>
                  </div>
                </div>

                <div className="w-[35mm] h-[45mm] border-2 border-gray-800 flex flex-col items-center justify-center p-2 text-center relative mt-2 shrink-0">
                  <span className="text-[10px] font-bold absolute top-2 w-full">APPLICATION ID/SL NO:<br/>{printWorker.id.slice(-6).toUpperCase()}</span>
                  <span className="text-xs text-gray-400 mt-8">PASTE<br/>PASSPORT SIZE<br/>PHOTO HERE</span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <p className="font-bold text-sm">परिवार का विवरण (आश्रितों के नाम और संबंध) / Family Details:</p>
                {[1, 2, 3, 4].map(num => (
                  <div key={num} className="flex items-end">
                    <span className="text-sm mr-2">{num}.</span>
                    <span className="flex-1 border-b border-dashed border-gray-500"></span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2 */}
            <div className="pt-2">
              <div className="bg-red-700 text-white font-bold p-2 mb-4 border border-black">
                2. WORK PROFILE & EXPECTED DAILY WAGES
              </div>
              <div className="space-y-5">
                <div className="flex items-end">
                  <span className="font-bold text-sm whitespace-nowrap">प्राथमिक कौशल / पेशा (Primary Skill / Profession):</span>
                  <span className="flex-1 border-b border-dashed border-gray-500 mx-2 text-lg font-semibold px-2">{printWorker.workerType}</span>
                </div>
                <div className="flex items-end">
                  <span className="font-bold text-sm whitespace-nowrap">माँगी गई कार्य दर (Expected Daily Wage / Job Rate):</span>
                  <span className="font-bold mx-2">₹</span>
                  <span className="flex-1 border-b border-dashed border-gray-500"></span>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="pt-2">
              <div className="bg-red-700 text-white font-bold p-2 mb-4 border border-black">
                3. REGISTRATION INTERNET CAFE DETAILS
              </div>
              <div className="space-y-5">
                <div className="flex items-end">
                  <span className="font-bold text-sm whitespace-nowrap">इंटरनेट कैफे का नाम (Internet Cafe Name):</span>
                  <span className="flex-1 border-b border-dashed border-gray-500 mx-2 text-lg font-semibold px-2">{user?.fullName || ''}</span>
                </div>
                <div className="flex items-end">
                  <span className="font-bold text-sm whitespace-nowrap">कैफे ऑपरेटर का नाम (Cafe Operator Name):</span>
                  <span className="flex-1 border-b border-dashed border-gray-500 mx-2"></span>
                </div>
                <div className="flex items-end">
                  <span className="font-bold text-sm whitespace-nowrap">कैफे का पूरा पता (Cafe Full Address):</span>
                  <span className="flex-1 border-b border-dashed border-gray-500 mx-2"></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page 2: Undertaking Form */}
        <div className="relative w-full max-w-[210mm] mx-auto bg-white p-12 min-h-[297mm] shadow-2xl print:shadow-none print:w-[210mm] print:h-[297mm] print:min-h-0 print:m-0 print:p-8 print:break-before-page">
          
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-red-700 tracking-wide uppercase">Brick Our House</h1>
            <p className="text-lg font-bold text-gray-600 uppercase tracking-widest mt-1">Building Your Home</p>
            <h2 className="text-xl font-bold text-gray-900 underline underline-offset-4 mt-4">Official Letter of Undertaking & Binding Policy</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-red-700 text-white font-bold p-2 border border-black">
              4. TERMS OF UNDERTAKING & BINDING DECLARATION
            </div>

            <div className="text-xs text-justify space-y-3 leading-relaxed">
              <p><strong>1. Accuracy & Personal Responsibility:</strong> मैं एतद्द्वारा प्रमाणित करता हूँ कि इस ऑनबोर्डिंग आवेदन में मेरे द्वारा प्रस्तुत की गई सभी जानकारी- जिसमें व्यक्तिगत विवरण, पहचान रिकॉर्ड, वर्तमान पता, स्थायी पता, पारिवारिक आश्रितों का विवरण और ब्लड ग्रुप डेटा शामिल है- पूरी तरह से सटीक, पूर्ण और तथ्यात्मक है। मैं इस पूरे डेटासेट की वैधता के लिए पूर्ण, एकमात्र और कानूनी जिम्मेदारी लेता हूँ।</p>
              
              <p><strong>2. Onboarding Processing Fee & Non-Refundability:</strong> मैं पूरी तरह से अपनी स्वतंत्र इच्छा और मर्जी से ठीक 118/- (केवल एक सौ अठारह रुपये) का ऑनबोर्डिंग प्रोसेसिंग शुल्क अदा कर रहा हूँ। मैं स्पष्ट रूप से समझता हूँ, स्वीकार करता हूँ और सहमत हूँ कि एक बार भुगतान संसाधित या रिकॉर्ड हो जाने के बाद, यह भुगतान किसी भी परिस्थिति में वापस नहीं किया जाएगा।</p>
              
              <p><strong>3. Scope of Provided Portal Services:</strong> सफलतापूर्वक संसाधित पंजीकरण शुल्क के सीधे बदले में, BRICK OUR HOUSE मेरे कुशल वर्कर प्रोफ़ाइल को डिजिटल करेगा और उसे अपने सार्वजनिक ऑनलाइन पोर्टल पर प्रकाशित करेगा। यह प्रकाशन विशेष रूप से कई परिचालन स्थानों पर सीधे ग्राहकों तक पहुँच और रोजगार खोजने की सुविधा के लिए डिज़ाइन किया गया है। इसके अलावा, कंपनी मुझे एक टिकाऊ मुद्रित (प्रिंटेड) प्लास्टिक पहचान पत्र (ID कार्ड) प्रदान करेगी।</p>

              <p><strong>4. Localized ID Card Delivery & Collection:</strong> अलग से शिपिंग, डाक या कूरियर के खर्च से बचने के लिए, मेरे मुद्रित प्लास्टिक पहचान पत्र को एक साथ पैक करके सीधे इस दस्तावेज़ के खंड 3 में निर्दिष्ट पंजीकृत इंटरनेट कैफे में पहुँचाया जाएगा। मैं अलग से लॉजिस्टिक या आवासीय डिलीवरी की मांग किए बिना सीधे उस कैफे ऑपरेटर से अपना भौतिक (फिजिकल) कार्ड प्राप्त करूँगा।</p>

              <p><strong>5. Complete Wage and Rate Discretion:</strong> खंड 2 के अंतर्गत निर्दिष्ट माँगी गई कार्य दर, दैनिक मजदूरी की अपेक्षा, या प्रोजेक्ट शुल्क पूरी तरह से और स्वतंत्र रूप से मेरे द्वारा निर्धारित किया गया है। मैं यह स्वीकार करता हूँ कि BRICK OUR HOUSE सख्ती से एक इलेक्ट्रॉनिक कनेक्टिविटी चैनल के रूप में कार्य करता है और निश्चित रोजगार, निरंतर क्लाइंट अनुबंध मिलान, या क्लाइंट-पक्ष से वेतन अनुपालन की गारंटी नहीं देता है।</p>

              <p><strong>6. Safety, Work Site Hazard & Incident Liability Waiver:</strong> मैं स्पष्ट रूप से स्वीकार करता हूँ और घोषणा करता हूँ कि BRICK OUR HOUSE केवल स्वतंत्र पेशेवरों और बाहरी काम पर रखने वाले ग्राहकों के बीच एक कनेक्टिंग मैचमेकिंग प्लेटफ़ॉर्म के रूप में कार्य करता है। संगठन एक नियोक्ता (employer) नहीं है और यह सुनिश्चित किए गए कार्य कार्यों के निष्पादन के दौरान होने वाले निर्माण स्थल के खतरों, शारीरिक चोटों, चिकित्सा आपात स्थितियों, आकस्मिक क्षतियों, या व्यवहार संबंधी विवादों के लिए बिल्कुल कोई दायित्व नहीं लेता है। मैं सभी कार्य स्थलों पर स्वतंत्र रूप से मानक संरचनात्मक सुरक्षा सावधानियों का पालन करने की पूरी जिम्मेदारी लेता हूँ।</p>
            </div>

            <div className="border border-black p-4 mt-6">
              <p className="text-xs text-justify"><strong>सत्यनिष्ठा से पुष्टि (Solemn Affirmation):</strong> मैंने इस पूरे दस्तावेज़ को ध्यान से सुना है, पढ़ा है, या अपनी स्थानीय भाषा में इसका पूरी तरह से अनुवाद करवाकर समझा है। मैं प्लेटफ़ॉर्म के नियमों, कानूनी देनदारियों, परिचालन छूट और गैर-वापसी योग्य शुल्क नीतियों को पूरी तरह से समझता हूँ, और मैं बिना किसी बाहरी दबाव या गलत बयानी के स्वेच्छा से इस बाध्यकारी वचन पत्र को निष्पादित करता हूँ।</p>
            </div>

            <div className="grid grid-cols-2 gap-8 mt-12 mb-8">
              <div>
                <div className="border-b border-dashed border-black w-full mb-2 h-8"></div>
                <p className="text-sm font-bold">Worker's Signature / Thumb Impression</p>
                <p className="text-xs text-gray-600">(कार्यकर्ता के हस्ताक्षर / अंगूठे का निशान)</p>
              </div>
              <div className="space-y-6">
                <div className="flex items-end">
                  <span className="font-bold text-sm w-24">Date (दिनांक):</span>
                  <span className="flex-1 border-b border-dashed border-black mx-2 h-5"></span>
                  <span className="font-bold text-sm">/ 2026</span>
                </div>
                <div className="flex items-end">
                  <span className="font-bold text-sm w-24">Place (स्थान):</span>
                  <span className="flex-1 border-b border-dashed border-black mx-2 h-5"></span>
                </div>
              </div>
            </div>

            <div className="bg-red-700 text-white font-bold p-2 border border-black text-center mt-8">
              FOR CAFE OPERATOR / OFFICE VERIFICATION ONLY
            </div>
            
            <div className="border-x border-b border-black p-6">
              <p className="font-bold text-sm mb-4">Payment Collection Verification:</p>
              <div className="flex justify-between items-end">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-black flex items-center justify-center"></div>
                    <span className="text-sm">Cash Collected (118)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-black flex items-center justify-center">
                      {printWorker.cafePaymentStatus === 'PAID_ONLINE_BY_CAFE' && '✓'}
                    </div>
                    <span className="text-sm">Online Paid</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="border-b border-dashed border-black w-64 mb-2 h-8"></div>
                  <p className="text-sm font-bold">Authorized Cafe Stamp & Signature</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Action Buttons (Hidden on print) */}
        <div className="flex justify-center gap-4 print:hidden font-sans w-full max-w-3xl">
           <button 
             onClick={() => setPrintWorker(null)}
             className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
           >
             Close Certificate
           </button>
           <button 
             onClick={handlePrint}
             className="px-8 py-4 bg-primary text-white font-bold rounded-xl flex items-center gap-3 hover:bg-primary-600 shadow-xl shadow-primary/20 transition-colors text-lg"
           >
             <Printer className="w-6 h-6" />
             Print Official Forms
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Cafe Verification Portal</h1>
            <p className="text-gray-500 font-medium">Verify worker documents, collect fees, and print certificates.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-6">
            {/* Navigation Tabs */}
            <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("pending")}
            className={`pb-4 px-2 font-bold text-sm transition-colors relative ${
              activeTab === "pending" ? "text-primary" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Pending Verification
            </div>
            {activeTab === "pending" && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab("verified")}
            className={`pb-4 px-2 font-bold text-sm transition-colors relative ${
              activeTab === "verified" ? "text-primary" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Verified Workers
            </div>
            {activeTab === "verified" && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full"></div>
            )}
          </button>
        </div>

        {activeTab === "pending" ? (
          <>
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-8">
           <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Enter worker's email or phone number..."
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-600 transition-all shadow-md disabled:opacity-70"
              >
                {loading ? "Searching..." : "Search Worker"}
              </button>
           </form>
        </div>

        {searchResults.length > 0 && (
          <div className="space-y-4">
             <h2 className="text-xl font-bold text-gray-900 mb-4">Search Results</h2>
             {searchResults.map((worker) => (
               <div key={worker.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                 <div className="flex items-center gap-4">
                   <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-xl font-extrabold text-primary">
                     {worker.userId?.name?.charAt(0) || '?'}
                   </div>
                   <div>
                     <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                       {worker.userId?.name || 'Unknown User'}
                       {worker.verified && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                     </h3>
                     <p className="text-gray-500 text-sm font-medium">{worker.userId?.email || 'No Email'} • {worker.workerType}</p>
                   </div>
                 </div>

                 <div>
                   {worker.verified ? (
                     <button 
                       onClick={() => setPrintWorker(worker)}
                       className="w-full sm:w-auto px-6 py-3 bg-gray-900 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-black transition-all"
                     >
                       <Printer className="w-4 h-4" />
                       Reprint Certificate
                     </button>
                   ) : (
                     <button 
                       onClick={() => verifyWorker(worker.id)}
                       className="w-full sm:w-auto px-6 py-3 bg-green-500 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-green-600 transition-all shadow-md shadow-green-500/20"
                     >
                       <UserCheck className="w-4 h-4" />
                       Verify & Collect Rs 118
                     </button>
                   )}
                 </div>
               </div>
             ))}
          </div>
        )}

        {/* Pending Verification Queue */}
        {searchResults.length === 0 && !loading && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary" />
              Pending Verifications Queue
            </h2>
            
            {queueLoading ? (
              <div className="py-12 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary/20 border-t-primary"></div>
              </div>
            ) : unverifiedQueue.length > 0 ? (
              <div className="space-y-4">
                {unverifiedQueue.map((worker) => (
                  <div key={worker.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-xl font-extrabold text-amber-600">
                        {worker.userId?.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                          {worker.userId?.name || 'Unknown User'}
                        </h3>
                        <p className="text-gray-500 text-sm font-medium">{worker.userId?.email || 'No Email'} • {worker.workerType}</p>
                      </div>
                    </div>
                    <div>
                      <button 
                        onClick={() => verifyWorker(worker.id)}
                        className="w-full sm:w-auto px-6 py-3 bg-green-500 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-green-600 transition-all shadow-md shadow-green-500/20"
                      >
                        <UserCheck className="w-4 h-4" />
                        Verify & Collect Rs 118
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Queue is empty</h3>
                <p className="text-gray-500">There are no unverified workers waiting at the moment.</p>
              </div>
            )}
          </div>
        )}
          </>
        ) : (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Verified History
            </h2>
            
            {queueLoading ? (
              <div className="py-12 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary/20 border-t-primary"></div>
              </div>
            ) : verifiedHistory.length > 0 ? (
              <div className="space-y-4">
                {verifiedHistory.map((worker) => (
                  <div key={worker.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:shadow-md transition-shadow relative">
                    {worker.cafePaymentStatus === 'PENDING_ADMIN_COLLECTION' && (
                      <div className="absolute top-4 left-4 sm:static sm:top-auto sm:left-auto">
                        <input 
                          type="checkbox" 
                          checked={selectedWorkers.includes(worker.id)}
                          onChange={() => toggleWorkerSelection(worker.id)}
                          className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer"
                        />
                      </div>
                    )}
                    <div className={`flex items-center gap-4 ${worker.cafePaymentStatus === 'PENDING_ADMIN_COLLECTION' ? 'ml-8 sm:ml-0' : ''}`}>
                      <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-xl font-extrabold text-green-600">
                        {worker.userId?.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                          {worker.userId?.name || 'Unknown User'}
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        </h3>
                        <p className="text-gray-500 text-sm font-medium">{worker.userId?.email || 'No Email'} • {worker.workerType}</p>
                        <p className="text-xs text-gray-400 mt-1">Verified on: {new Date(worker.verifiedAt || Date.now()).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                      <div className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Status: <span className={
                          worker.cafePaymentStatus === 'PENDING_ADMIN_COLLECTION' ? 'text-amber-600' : 
                          worker.cafePaymentStatus === 'PAID_ONLINE_BY_CAFE' ? 'text-blue-600' : 
                          'text-green-600'
                        }>
                          {worker.cafePaymentStatus?.replace(/_/g, ' ') || 'COLLECTED'}
                        </span>
                      </div>
                      <button 
                        onClick={() => setPrintWorker(worker)}
                        className="w-full sm:w-auto px-6 py-2 bg-gray-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-black transition-all"
                      >
                        <Printer className="w-4 h-4" />
                        Reprint Certificate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Printer className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">No verified workers yet</h3>
                <p className="text-gray-500">Workers you verify will appear here for your records.</p>
              </div>
            )}
          </div>
        )}
          </div>

        {/* Recent Activity Sidebar */}
        <div className="space-y-6 hidden xl:block">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-8">
            <h3 className="font-extrabold text-gray-900 mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" /> Recent Activity
            </h3>
            
            <div className="space-y-5">
              {recentActivity.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No recent activity.</p>
              ) : (
                recentActivity.map((activity, idx) => (
                  <div key={activity.id + idx} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                      {activity.icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.desc}</p>
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        <Clock className="w-3 h-3" />
                        {new Date(activity.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        </div>

        {/* Floating Action Bar for Payment */}
        {selectedWorkers.length > 0 && activeTab === "verified" && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-4 px-6 z-40 animate-in slide-in-from-bottom-10">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Selected for Payment</p>
                <p className="text-xl font-black text-gray-900">{selectedWorkers.length} Workers <span className="text-gray-400 font-medium">|</span> <span className="text-primary">Rs {selectedWorkers.length * 118}</span></p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setSelectedWorkers([])}
                  className="px-6 py-3 font-bold text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setShowPaymentModal(true)}
                  className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-600 transition-colors shadow-lg shadow-primary/30"
                >
                  Pay Online
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Online Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
              <div className="p-6 border-b border-gray-100 bg-gray-50 text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-extrabold text-2xl">₹</span>
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-1">Secure Online Payment</h2>
                <p className="text-gray-500 font-medium text-sm">Pay verification fees directly to Admin</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-500 font-bold text-sm">Total Workers</span>
                    <span className="text-gray-900 font-bold">{selectedWorkers.length}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-500 font-bold text-sm">Fee per Worker</span>
                    <span className="text-gray-900 font-bold">Rs 118</span>
                  </div>
                  <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-center">
                    <span className="text-gray-900 font-black text-lg">Total Amount</span>
                    <span className="text-primary font-black text-2xl">Rs {selectedWorkers.length * 118}</span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
                  <p className="font-bold mb-1 flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Admin Bank Details</p>
                  <p>Bank Name: Punjab National Bank</p>
                  <p>Account No: 4021002100025313</p>
                  <p>IFSC Code: PUNB0402100</p>
                  <p>Account Holder Name: fusion services</p>
                </div>
                
                <p className="text-xs text-gray-500 text-center font-medium">
                  By clicking confirm, you acknowledge that you have transferred the amount to the Admin's account. This will update the status immediately.
                </p>

                <div className="flex gap-4 pt-2">
                  <button 
                    onClick={() => setShowPaymentModal(false)}
                    disabled={processingPayment}
                    className="flex-1 py-3.5 rounded-xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handlePayOnline}
                    disabled={processingPayment}
                    className="flex-1 py-3.5 rounded-xl bg-primary text-white font-bold hover:bg-primary-600 shadow-md shadow-primary/20 transition-all disabled:opacity-50"
                  >
                    {processingPayment ? "Processing..." : "Confirm Payment"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default CafeDashboard;
