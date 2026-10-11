import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Siren,
  Users,
  CheckCircle2,
  Clock3,
  Phone,
  UserRound,
  Bell,
} from "lucide-react";
import { connectSocket } from "../../lib/socket";
import AdminLayout from "../../layouts/AdminLayout";

interface SosItem {
  _id: string;
  status: "pending" | "acknowledged" | "resolved";
  emergencyType: string;
  message: string;
  createdAt: string;
  student: {
    _id: string;
    name: string;
    studentId: string;
    program: string;
    phone: string;
  };
  medicalProfile?: {
    bloodGroup?: string;
    allergies?: string[];
    medicalConditions?: string[];
    currentMedications?: string[];
    emergencyContact?: { name?: string; relationship?: string; phone?: string };
    additionalNotes?: string;
  } | null;
}

interface Stats {
  totalStudents: number;
  sos: { pending: number; acknowledged: number; resolved: number };
}

export default function AdminDashboard() {
  const [sosList, setSosList] = useState<SosItem[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState<Record<string, string>>({});

  const token = localStorage.getItem("token");

  const loadData = async () => {
    try {
      const [sosRes, statsRes] = await Promise.all([
        fetch("http://localhost:5000/api/admin/sos", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const sosData = await sosRes.json();
      const statsData = await statsRes.json();
      if (sosData.success) setSosList(sosData.requests);
      if (statsData.success) setStats(statsData.stats);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const socket = connectSocket();

    socket.on("sos:new", () => loadData());
    socket.on("sos:updated", () => loadData());

    return () => {
      socket.off("sos:new");
      socket.off("sos:updated");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const acknowledge = async (id: string) => {
    await fetch(`http://localhost:5000/api/admin/sos/${id}/acknowledge`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  const resolve = async (id: string) => {
    await fetch(`http://localhost:5000/api/admin/sos/${id}/resolve`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ resolutionNote: note[id] || "" }),
    });
  };

  const active = sosList.filter((s) => s.status !== "resolved");
  const resolved = sosList.filter((s) => s.status === "resolved");

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080C0B]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#34E7A6] border-t-transparent" />
      </div>
    );
  }

  return (
    <AdminLayout pageTitle="Emergency Response Center">
      {/* Stats */}
      <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          {
            label: "Total Students",
            value: stats?.totalStudents ?? 0,
            icon: Users,
            color: "text-[#34E7A6] bg-[#34E7A6]/10",
          },
          {
            label: "Pending SOS",
            value: stats?.sos.pending ?? 0,
            icon: Siren,
            color: "text-[#E5484D] bg-[#E5484D]/10",
          },
          {
            label: "In Progress",
            value: stats?.sos.acknowledged ?? 0,
            icon: Clock3,
            color: "text-[#F0B429] bg-[#F0B429]/10",
          },
          {
            label: "Resolved",
            value: stats?.sos.resolved ?? 0,
            icon: CheckCircle2,
            color: "text-[#34E7A6] bg-[#34E7A6]/10",
          },
        ].map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5"
          >
            <div
              className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${c.color}`}
            >
              <c.icon size={18} />
            </div>
            <p className="mt-4 font-['Manrope'] text-3xl font-extrabold">
              {c.value}
            </p>
            <p className="mt-1 text-xs text-white/40">{c.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Active SOS */}
      <div className="mb-4 flex items-center gap-2">
        <Bell size={15} className="text-[#E5484D]" />
        <h2 className="text-sm font-semibold uppercase tracking-wide text-white/50">
          Active SOS Alerts ({active.length})
        </h2>
      </div>

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {active.map((s) => (
            <motion.div
              key={s._id}
              layout
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl border border-[#E5484D]/15 bg-gradient-to-br from-[#E5484D]/[0.05] to-white/[0.02] p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#34E7A6]/10 text-[#34E7A6]">
                    <UserRound size={17} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold">{s.student?.name}</p>
                    <p className="text-xs text-white/40">
                      {s.student?.studentId} · {s.student?.program}
                    </p>
                    {s.student?.phone && (
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-white/50">
                        <Phone size={12} /> {s.student.phone}
                      </p>
                    )}
                    <p className="mt-2 inline-block rounded-full bg-white/[0.05] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#FF7777]">
                      {s.emergencyType}
                    </p>
                    {s.message && (
                      <p className="mt-2 text-sm text-white/60">{s.message}</p>
                    )}
                    {s.medicalProfile ? (
                      <div className="mt-3 rounded-xl border border-[#F0B429]/20 bg-[#F0B429]/[0.05] p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#F0B429]">
                          Medical info
                        </p>
                        <div className="mt-2 space-y-1 text-xs text-white/60">
                          {s.medicalProfile.bloodGroup && (
                            <p>
                              <span className="text-white/35">
                                Blood group:
                              </span>{" "}
                              <span className="font-semibold text-white/80">
                                {s.medicalProfile.bloodGroup}
                              </span>
                            </p>
                          )}
                          {!!s.medicalProfile.allergies?.length && (
                            <p>
                              <span className="text-white/35">Allergies:</span>{" "}
                              {s.medicalProfile.allergies.join(", ")}
                            </p>
                          )}
                          {!!s.medicalProfile.medicalConditions?.length && (
                            <p>
                              <span className="text-white/35">Conditions:</span>{" "}
                              {s.medicalProfile.medicalConditions.join(", ")}
                            </p>
                          )}
                          {!!s.medicalProfile.currentMedications?.length && (
                            <p>
                              <span className="text-white/35">
                                Medications:
                              </span>{" "}
                              {s.medicalProfile.currentMedications.join(", ")}
                            </p>
                          )}
                          {s.medicalProfile.emergencyContact?.phone && (
                            <p>
                              <span className="text-white/35">
                                Emergency contact:
                              </span>{" "}
                              {s.medicalProfile.emergencyContact.name}
                              {s.medicalProfile.emergencyContact.relationship
                                ? ` (${s.medicalProfile.emergencyContact.relationship})`
                                : ""}{" "}
                              · {s.medicalProfile.emergencyContact.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="mt-3 text-xs text-white/30">
                        No medical profile on file.
                      </p>
                    )}
                    <p className="mt-2 text-[11px] text-white/25">
                      {new Date(s.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                    s.status === "pending"
                      ? "bg-[#E5484D]/10 text-[#FF7777]"
                      : "bg-[#F0B429]/10 text-[#F0B429]"
                  }`}
                >
                  {s.status}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-4">
                {s.status === "pending" && (
                  <button
                    onClick={() => acknowledge(s._id)}
                    className="rounded-lg border border-white/[0.08] px-3 py-1.5 text-xs font-medium hover:border-[#F0B429]/40 hover:text-[#F0B429]"
                  >
                    Acknowledge
                  </button>
                )}
                <input
                  placeholder="Resolution note (optional)"
                  value={note[s._id] || ""}
                  onChange={(e) =>
                    setNote((prev) => ({ ...prev, [s._id]: e.target.value }))
                  }
                  className="min-w-[180px] flex-1 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs outline-none focus:border-[#34E7A6]/40"
                />
                <button
                  onClick={() => resolve(s._id)}
                  className="flex items-center gap-1.5 rounded-lg bg-[#34E7A6] px-3 py-1.5 text-xs font-bold text-[#080C0B] hover:bg-[#5CFFC0]"
                >
                  <CheckCircle2 size={13} /> Mark Solved
                </button>
              </div>
            </motion.div>
          ))}

          {active.length === 0 && (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-8 text-center">
              <CheckCircle2 size={24} className="mx-auto mb-2 text-[#34E7A6]" />
              <p className="text-sm text-white/40">
                No active SOS requests right now.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Resolved */}
      <div className="mb-4 mt-10 flex items-center gap-2">
        <CheckCircle2 size={15} className="text-[#34E7A6]" />
        <h2 className="text-sm font-semibold uppercase tracking-wide text-white/50">
          Resolved ({resolved.length})
        </h2>
      </div>
      <div className="space-y-2">
        {resolved.slice(0, 5).map((s) => (
          <div
            key={s._id}
            className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.01] px-5 py-3.5 opacity-60"
          >
            <div>
              <p className="text-sm font-medium">{s.student?.name}</p>
              <p className="text-xs text-white/30">
                {new Date(s.createdAt).toLocaleString()}
              </p>
            </div>
            <span className="rounded-full bg-[#34E7A6]/10 px-3 py-1 text-xs font-semibold text-[#34E7A6]">
              Solved
            </span>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
