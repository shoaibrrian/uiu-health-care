import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Siren,
  Users,
  CheckCircle2,
  Clock3,
  LogOut,
  HeartPulse,
  Phone,
  MapPin,
} from "lucide-react";
import { connectSocket } from "../../lib/socket";

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
    socket.emit("join-admin-room");

    socket.on("sos:new", (newSos: SosItem) => {
      setSosList((prev) => [newSos, ...prev]);
      setStats((prev) =>
        prev
          ? { ...prev, sos: { ...prev.sos, pending: prev.sos.pending + 1 } }
          : prev,
      );
    });

    socket.on("sos:updated", (updated: SosItem) => {
      setSosList((prev) =>
        prev.map((s) => (s._id === updated._id ? updated : s)),
      );
    });

    return () => {
      socket.off("sos:new");
      socket.off("sos:updated");
    };
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

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const active = sosList.filter((s) => s.status !== "resolved");
  const resolved = sosList.filter((s) => s.status === "resolved");

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080C0B] text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080C0B] font-sans text-[#F4F6F5]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/3 h-[500px] w-[500px] rounded-full bg-[#34E7A6]/[0.05] blur-[120px]" />
      </div>

      <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/[0.07] bg-[#080C0B]/80 px-8 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#34E7A6]/10 text-[#34E7A6] ring-1 ring-[#34E7A6]/20">
            <HeartPulse size={17} />
          </div>
          <div>
            <p className="text-sm font-semibold">UIU Health Care</p>
            <p className="text-[10px] uppercase tracking-widest text-white/30">
              Admin Dashboard
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 rounded-xl border border-white/[0.08] px-4 py-2 text-sm text-white/50 hover:border-[#E5484D]/30 hover:text-[#E5484D]"
        >
          <LogOut size={15} /> Log out
        </button>
      </header>

      <main className="relative mx-auto max-w-6xl px-6 py-8">
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
          ].map((c) => (
            <div
              key={c.label}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5"
            >
              <div
                className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${c.color}`}
              >
                <c.icon size={17} />
              </div>
              <p className="mt-4 text-2xl font-bold">{c.value}</p>
              <p className="mt-1 text-xs text-white/40">{c.label}</p>
            </div>
          ))}
        </div>

        {/* Active SOS */}
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/40">
          Active SOS Alerts ({active.length})
        </h2>
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {active.map((s) => (
              <motion.div
                key={s._id}
                layout
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{s.student?.name}</p>
                    <p className="text-xs text-white/40">
                      {s.student?.studentId} · {s.student?.program}
                    </p>
                    {s.student?.phone && (
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-white/50">
                        <Phone size={12} /> {s.student.phone}
                      </p>
                    )}
                    <p className="mt-2 text-xs uppercase tracking-wide text-[#E5484D]">
                      {s.emergencyType}
                    </p>
                    {s.message && (
                      <p className="mt-1 text-sm text-white/60">{s.message}</p>
                    )}
                    <p className="mt-2 text-[11px] text-white/25">
                      {new Date(s.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                      s.status === "pending"
                        ? "bg-[#E5484D]/10 text-[#FF7777]"
                        : "bg-[#F0B429]/10 text-[#F0B429]"
                    }`}
                  >
                    {s.status}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
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
              <p className="text-sm text-white/40">
                No active SOS requests right now.
              </p>
            )}
          </AnimatePresence>
        </div>

        {/* Resolved */}
        <h2 className="mb-4 mt-10 text-sm font-semibold uppercase tracking-wide text-white/40">
          Resolved ({resolved.length})
        </h2>
        <div className="space-y-2">
          {resolved.map((s) => (
            <div
              key={s._id}
              className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.01] px-5 py-3 opacity-60"
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
      </main>
    </div>
  );
}
