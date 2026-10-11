import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Siren, Search, Phone, FileText } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";

interface SosRecord {
  _id: string;
  status: "pending" | "acknowledged" | "resolved";
  emergencyType: string;
  message?: string;
  resolutionNote?: string;
  createdAt: string;
  resolvedAt?: string;
  student: {
    name: string;
    studentId: string;
    program: string;
    phone?: string;
  };
  resolvedBy?: { name: string };
}

type Filter = "all" | "pending" | "acknowledged" | "resolved";

const statusStyles: Record<string, string> = {
  pending: "bg-[#E5484D]/10 text-[#FF7777]",
  acknowledged: "bg-[#F0B429]/10 text-[#F0B429]",
  resolved: "bg-[#34E7A6]/10 text-[#34E7A6]",
};

const filters: { label: string; value: Filter }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "In Progress", value: "acknowledged" },
  { label: "Resolved", value: "resolved" },
];

export default function AdminSosHistory() {
  const [records, setRecords] = useState<SosRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/admin/sos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) setRecords(data.requests);
      } catch (err) {
        console.error("Failed to load SOS history:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const q = search.toLowerCase();
  const filtered = records.filter((r) => {
    const matchesFilter = filter === "all" || r.status === filter;
    const matchesSearch =
      !q ||
      r.student?.name?.toLowerCase().includes(q) ||
      r.student?.studentId?.toLowerCase().includes(q) ||
      r.emergencyType.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  return (
    <AdminLayout pageTitle="SOS History">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#34E7A6]/10 text-[#34E7A6] ring-1 ring-[#34E7A6]/20">
          <Siren size={20} />
        </div>
        <div>
          <h1 className="font-['Manrope'] text-2xl font-extrabold tracking-tight">
            SOS History
          </h1>
          <p className="text-sm text-white/40">
            {records.length} total requests
          </p>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5">
        <Search size={16} className="text-white/30" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by student name, ID, or emergency type..."
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/25"
        />
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
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.03, 0.4) }}
            className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold">{r.student?.name}</p>
                <p className="text-xs text-white/40">
                  {r.student?.studentId} · {r.student?.program}
                </p>
                {r.student?.phone && (
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-white/50">
                    <Phone size={12} /> {r.student.phone}
                  </p>
                )}
                <p className="mt-2 inline-block rounded-full bg-white/[0.05] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#FF7777]">
                  {r.emergencyType}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[r.status]}`}
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
                  Resolution note{r.resolvedBy ? ` — ${r.resolvedBy.name}` : ""}
                </p>
                <p className="mt-1 text-xs text-white/50">{r.resolutionNote}</p>
              </div>
            )}

            <p className="mt-3 text-[11px] text-white/25">
              Reported: {new Date(r.createdAt).toLocaleString()}
              {r.resolvedAt &&
                ` · Resolved: ${new Date(r.resolvedAt).toLocaleString()}`}
            </p>
          </motion.div>
        ))}

        {!loading && filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-white/40">
            No records found.
          </p>
        )}
      </div>
    </AdminLayout>
  );
}
