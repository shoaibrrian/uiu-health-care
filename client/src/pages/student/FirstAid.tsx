import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeartPulse, ChevronDown, AlertTriangle } from "lucide-react";
import StudentLayout from "../../layouts/StudentLayout";

interface Guide {
  _id: string;
  title: string;
  category: string;
  severity: "low" | "moderate" | "critical";
  steps: string[];
}

const severityStyles: Record<string, string> = {
  low: "bg-[#34E7A6]/10 text-[#34E7A6]",
  moderate: "bg-[#F0B429]/10 text-[#F0B429]",
  critical: "bg-[#E5484D]/10 text-[#FF7777]",
};

export default function FirstAid() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/first-aid", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) setGuides(data.guides);
      } catch (err) {
        console.error("Failed to load guides:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <StudentLayout pageTitle="First Aid Guidelines">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#34E7A6]/10 text-[#34E7A6] ring-1 ring-[#34E7A6]/20">
          <HeartPulse size={20} />
        </div>
        <div>
          <h1 className="font-['Manrope'] text-2xl font-extrabold tracking-tight">
            First Aid Guidelines
          </h1>
          <p className="text-sm text-white/40">
            Step-by-step guidance for common emergencies
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#34E7A6] border-t-transparent" />
        </div>
      )}

      <div className="space-y-3">
        {guides.map((guide) => (
          <motion.div
            key={guide._id}
            layout
            className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02]"
          >
            <button
              onClick={() => setOpenId(openId === guide._id ? null : guide._id)}
              className="flex w-full items-center justify-between gap-4 p-5 text-left"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${severityStyles[guide.severity]}`}
                >
                  {guide.severity}
                </span>
                <div>
                  <p className="font-semibold">{guide.title}</p>
                  <p className="text-xs text-white/35">{guide.category}</p>
                </div>
              </div>
              <motion.div animate={{ rotate: openId === guide._id ? 180 : 0 }}>
                <ChevronDown size={18} className="shrink-0 text-white/30" />
              </motion.div>
            </button>

            <AnimatePresence>
              {openId === guide._id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-white/[0.06] px-5 pb-5"
                >
                  <ol className="mt-4 space-y-3">
                    {guide.steps.map((step, i) => (
                      <li key={i} className="flex gap-3 text-sm text-white/60">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#34E7A6]/10 text-[10px] font-bold text-[#34E7A6]">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {!loading && guides.length === 0 && (
        <p className="py-12 text-center text-sm text-white/40">
          No first aid guides available yet.
        </p>
      )}

      <div className="mt-8 flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.015] p-4">
        <AlertTriangle size={17} className="mt-0.5 shrink-0 text-[#F0B429]" />
        <p className="text-xs leading-relaxed text-white/30">
          <span className="font-medium text-white/50">Important:</span> These
          guidelines are for immediate assistance only and do not replace
          professional medical care. Always call emergency services for serious
          situations.
        </p>
      </div>
    </StudentLayout>
  );
}
