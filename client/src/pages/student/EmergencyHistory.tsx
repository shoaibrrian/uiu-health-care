import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock3, MapPin, FileText } from "lucide-react";
import StudentLayout from "../../layouts/StudentLayout";

interface SosRecord {
  _id: string;
  emergencyType: string;
  status: "pending" | "acknowledged" | "resolved";
  message?: string;
  resolutionNote?: string;
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: { name: string };
}

const statusStyles: Record<string, string> = {
  pending: "bg-[#E5484D]/10 text-[#FF7777]",
  acknowledged: "bg-[#F0B429]/10 text-[#F0B429]",
  resolved: "bg-[#34E7A6]/10 text-[#34E7A6]",
};

export default function EmergencyHistory() {
  const [records, setRecords] = useState<SosRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "pending" | "acknowledged" | "resolved"
  >("all");

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5000/api/students/sos/history",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await response.json();
        if (data.success) setRecords(data.requests);
      } catch (err) {
        console.error("Failed to load history:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered =
    filter === "all" ? records : records.filter((r) => r.status === filter);

  const filters: { label: string; value: typeof filter }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "In Progress", value: "acknowledged" },
    { label: "Resolved", value: "resolved" },
  ];

  return (
    <StudentLayout pageTitle="Emergency History">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#34E7A6]/10 text-[#34E7A6] ring-1 ring-[#34E7A6]/20">
          <Clock3 size={20} />
        </div>
        <div>
          <h1 className="font-['Manrope'] text-2xl font-extrabold tracking-tight">
            Emergency History
          </h1>
          <p className="text-sm text-white/40">
            All your past and active SOS requests
          </p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              filter === f.value
                ? "bg-[#34E7A6] text-[#080C0B]"
                : "border border-white/[0.08] text-white/50 hover:border-white/20 hover:text-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#34E7A6] border-t-transparent" />
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((r, i) => (
          <motion.div
            key={r._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold capitalize">{r.emergencyType}</p>
                <p className="mt-1 text-xs text-white/40">
                  {new Date(r.createdAt).toLocaleString()}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[r.status]}`}
              >
                {r.status === "resolved" ? "Solved" : r.status}
              </span>
            </div>

            {r.message && (
              <p className="mt-3 flex items-start gap-2 text-sm text-white/55">
                <FileText size={14} className="mt-0.5 shrink-0 text-white/30" />
                {r.message}
              </p>
            )}

            {r.resolutionNote && (
              <div className="mt-3 rounded-xl border border-[#34E7A6]/15 bg-[#34E7A6]/[0.05] p-3">
                <p className="text-xs font-medium text-[#34E7A6]">
                  Response note{r.resolvedBy ? ` — ${r.resolvedBy.name}` : ""}
                </p>
                <p className="mt-1 text-xs text-white/50">{r.resolutionNote}</p>
              </div>
            )}
          </motion.div>
        ))}

        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.015] py-16">
            <MapPin size={22} className="text-white/20" />
            <p className="text-sm text-white/40">
              No records found for this filter.
            </p>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
