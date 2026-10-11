import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Megaphone } from "lucide-react";
import StudentLayout from "../../layouts/StudentLayout";

interface Post {
  _id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  createdBy?: { name: string };
}

const categoryStyles: Record<string, string> = {
  nutrition: "bg-[#34E7A6]/10 text-[#34E7A6]",
  fitness: "bg-[#2D9CDB]/10 text-[#2D9CDB]",
  hygiene: "bg-[#F0B429]/10 text-[#F0B429]",
  seasonal: "bg-[#E5484D]/10 text-[#FF7777]",
  campaign: "bg-[#A78BFA]/10 text-[#A78BFA]",
  general: "bg-white/[0.06] text-white/60",
};

export default function HealthAwareness() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/health-posts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) setPosts(data.posts);
      } catch (err) {
        console.error("Failed to load posts:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <StudentLayout pageTitle="Health Awareness">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#34E7A6]/10 text-[#34E7A6] ring-1 ring-[#34E7A6]/20">
          <Megaphone size={20} />
        </div>
        <div>
          <h1 className="font-['Manrope'] text-2xl font-extrabold tracking-tight">
            Health Awareness
          </h1>
          <p className="text-sm text-white/40">
            Tips and campaigns from the campus health team
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#34E7A6] border-t-transparent" />
        </div>
      )}

      <div className="space-y-4">
        {posts.map((p, i) => (
          <motion.article
            key={p._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.05, 0.4) }}
            className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6"
          >
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                  categoryStyles[p.category] || categoryStyles.general
                }`}
              >
                {p.category}
              </span>
              <span className="text-[11px] text-white/30">
                {new Date(p.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h2 className="mt-3 text-lg font-semibold">{p.title}</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-white/55">
              {p.content}
            </p>
          </motion.article>
        ))}

        {!loading && posts.length === 0 && (
          <p className="py-12 text-center text-sm text-white/40">
            No health posts published yet.
          </p>
        )}
      </div>
    </StudentLayout>
  );
}
