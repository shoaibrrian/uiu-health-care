import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MessageCircleHeart,
  Phone,
  Link as LinkIcon,
  BookOpen,
  Wind,
  UserRound,
} from "lucide-react";
import StudentLayout from "../../layouts/StudentLayout";

interface Resource {
  _id: string;
  title: string;
  description: string;
  type: "article" | "helpline" | "exercise" | "counselor";
  contact?: string;
  link?: string;
}

const typeConfig: Record<string, { icon: any; color: string }> = {
  helpline: { icon: Phone, color: "text-[#E5484D] bg-[#E5484D]/10" },
  exercise: { icon: Wind, color: "text-[#34E7A6] bg-[#34E7A6]/10" },
  article: { icon: BookOpen, color: "text-[#2D9CDB] bg-[#2D9CDB]/10" },
  counselor: { icon: UserRound, color: "text-[#F0B429] bg-[#F0B429]/10" },
};

export default function MentalHealth() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5000/api/mental-health",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await response.json();
        if (data.success) setResources(data.resources);
      } catch (err) {
        console.error("Failed to load resources:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <StudentLayout pageTitle="Mental Health Support">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#34E7A6]/10 text-[#34E7A6] ring-1 ring-[#34E7A6]/20">
          <MessageCircleHeart size={20} />
        </div>
        <div>
          <h1 className="font-['Manrope'] text-2xl font-extrabold tracking-tight">
            Mental Health Support
          </h1>
          <p className="text-sm text-white/40">
            You're not alone — resources, helplines and exercises for your
            wellbeing
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#34E7A6] border-t-transparent" />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {resources.map((r, i) => {
          const config = typeConfig[r.type] || typeConfig.article;
          const Icon = config.icon;

          return (
            <motion.div
              key={r._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5"
            >
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${config.color}`}
                >
                  <Icon size={16} />
                </div>
                <span className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/40">
                  {r.type}
                </span>
              </div>

              <p className="mt-4 font-semibold">{r.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-white/50">
                {r.description}
              </p>

              {r.contact && (
                <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-[#34E7A6]">
                  <Phone size={13} /> {r.contact}
                </div>
              )}

              {r.link && (
                <a
                  href={r.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 flex items-center gap-1.5 text-sm font-medium text-[#2D9CDB] hover:underline"
                >
                  <LinkIcon size={13} /> Learn more
                </a>
              )}
            </motion.div>
          );
        })}
      </div>

      {!loading && resources.length === 0 && (
        <p className="py-12 text-center text-sm text-white/40">
          No resources available yet.
        </p>
      )}

      <div className="mt-8 rounded-2xl border border-[#E5484D]/15 bg-[#E5484D]/[0.05] p-4">
        <p className="text-xs leading-relaxed text-white/50">
          <span className="font-semibold text-[#FF7777]">
            In crisis right now?
          </span>{" "}
          If you or someone you know is in immediate danger, please call the
          National Mental Health Helpline or campus emergency services
          immediately — don't wait.
        </p>
      </div>
    </StudentLayout>
  );
}
