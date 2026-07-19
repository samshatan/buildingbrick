import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Building2, CheckCircle2, XCircle, Clock, ChevronRight, Landmark } from "lucide-react";

const BANK_OPTIONS = [
  "No Preference",
  "State Bank of India (SBI)",
  "Punjab National Bank (PNB)",
  "Bank of Baroda",
  "Canara Bank",
  "Union Bank of India",
  "Bank of India",
  "Indian Bank",
  "Central Bank of India",
  "UCO Bank",
  "Kotak Mahindra Bank",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
];

interface VBankRequest {
  id: string;
  status: "pending" | "approved" | "rejected";
  workerName: string;
  aadhaarNumber: string;
  panNumber: string;
  bankPreference: string;
  adminNotes: string;
  createdAt: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  if (status === "approved")
    return (
      <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-full text-sm">
        <CheckCircle2 size={14} /> Approved
      </span>
    );
  if (status === "rejected")
    return (
      <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-700 font-semibold px-3 py-1 rounded-full text-sm">
        <XCircle size={14} /> Rejected
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 bg-yellow-100 text-yellow-700 font-semibold px-3 py-1 rounded-full text-sm">
      <Clock size={14} /> Pending Review
    </span>
  );
};

export default function VBankAccount() {
  const { user, token } = useAuth();
  const [existing, setExisting] = useState<VBankRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    aadhaarNumber: "",
    panNumber: "",
    bankPreference: "No Preference",
  });

  useEffect(() => {
    fetchMyRequest();
  }, []);

  const fetchMyRequest = async () => {
    if (!token) { setLoading(false); return; }
    try {
      const res = await fetch("/api/v1/vbank/my-request", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setExisting(data);
      }
    } catch (err) {
      // no existing request
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.aadhaarNumber.trim()) {
      toast.error("Aadhaar number is required.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/vbank/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Application submitted! Admin & cafe owners have been notified.");
        setExisting(data.request);
      } else {
        toast.error(data.message || "Failed to submit application.");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Landmark size={36} className="text-purple-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">Virtual Bank Account</h1>
          <p className="text-gray-500 mt-2 text-sm max-w-md mx-auto">
            Apply for a free virtual bank account through our platform. Your request will be reviewed by an admin or cafe partner.
          </p>
        </div>

        {/* Benefits Strip */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: "🆓", label: "100% Free" },
            { icon: "⚡", label: "Quick Setup" },
            { icon: "🔒", label: "Secure & Safe" },
          ].map((b) => (
            <div key={b.label} className="bg-white rounded-2xl p-4 text-center shadow-sm border border-purple-100">
              <div className="text-2xl mb-1">{b.icon}</div>
              <p className="text-xs font-semibold text-gray-600">{b.label}</p>
            </div>
          ))}
        </div>

        {/* Existing Request Status */}
        {existing ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Your Application</h2>
              <StatusBadge status={existing.status} />
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-2xl p-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-1">Aadhaar</p>
                  <p className="font-semibold text-gray-800">••••  ••••  {existing.aadhaarNumber.slice(-4)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-1">PAN</p>
                  <p className="font-semibold text-gray-800">{existing.panNumber || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-1">Bank Preference</p>
                  <p className="font-semibold text-gray-800">{existing.bankPreference}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-1">Applied On</p>
                  <p className="font-semibold text-gray-800">{new Date(existing.createdAt).toLocaleDateString("en-IN")}</p>
                </div>
              </div>

              {existing.adminNotes && (
                <div className={`rounded-2xl p-4 text-sm ${existing.status === "approved" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                  <p className="font-semibold text-gray-700 mb-1">Admin Note:</p>
                  <p className="text-gray-600">{existing.adminNotes}</p>
                </div>
              )}

              {existing.status === "pending" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-start gap-3 text-sm text-yellow-800">
                  <Clock size={18} className="mt-0.5 shrink-0" />
                  <p>Your application is under review. We typically respond within 2–3 business days.</p>
                </div>
              )}
            </div>
          </div>

        ) : (

          /* Application Form */
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            {!user ? (
              <div className="text-center py-8">
                <Building2 size={40} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">Please log in as a worker to apply.</p>
              </div>
            ) : user.userType !== "WORKER" ? (
              <div className="text-center py-8">
                <Building2 size={40} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">Only workers can apply for a vBank account.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Apply for vBank Account</h2>

                {/* Aadhaar */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Aadhaar Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={12}
                    placeholder="Enter 12-digit Aadhaar number"
                    value={form.aadhaarNumber}
                    onChange={(e) => setForm({ ...form, aadhaarNumber: e.target.value.replace(/\D/g, "") })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                    required
                  />
                </div>

                {/* PAN */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    PAN Number <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="e.g. ABCDE1234F"
                    value={form.panNumber}
                    onChange={(e) => setForm({ ...form, panNumber: e.target.value.toUpperCase() })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                  />
                </div>

                {/* Bank Preference */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Bank Preference
                  </label>
                  <select
                    value={form.bankPreference}
                    onChange={(e) => setForm({ ...form, bankPreference: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition bg-white"
                  >
                    {BANK_OPTIONS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                {/* Disclaimer */}
                <p className="text-xs text-gray-400 bg-gray-50 rounded-xl p-3">
                  Your information is securely stored and only shared with verified admin and cafe partners for processing your account request.
                </p>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-60"
                >
                  {submitting ? (
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  ) : (
                    <>Submit Application <ChevronRight size={18} /></>
                  )}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
