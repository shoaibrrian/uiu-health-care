import { useEffect, useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Megaphone, Trash2, Loader2 } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { API_URL } from "../../lib/config";

interface Post {
  _id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

const categories = [
  "general",
  "nutrition",
  "fitness",
  "hygiene",
  "seasonal",
  "campaign",
];

const inputClass =
  "w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#34E7A6]/40";

export default function AdminContent() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("general");

  const token = localStorage.getItem("token");

  const loadPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/health-posts`, {
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

  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const publish = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setPublishing(true);

    try {
      const response = await fetch(`${API_URL}/api/health-posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, category }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to publish");

      setTitle("");
      setContent("");
      setCategory("general");
      await loadPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPublishing(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this post?")) return;
    await fetch(`http://localhost:5000/api/health-posts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setPosts((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <AdminLayout pageTitle="Content Management">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#34E7A6]/10 text-[#34E7A6] ring-1 ring-[#34E7A6]/20">
          <Megaphone size={20} />
        </div>
        <div>
          <h1 className="font-['Manrope'] text-2xl font-extrabold tracking-tight">
            Health Awareness Posts
          </h1>
          <p className="text-sm text-white/40">
            Publish tips and campaigns for students
          </p>
        </div>
      </div>

      <form
        onSubmit={publish}
        className="mb-8 space-y-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6"
      >
        {error && (
          <div className="rounded-xl border border-[#E5484D]/20 bg-[#E5484D]/10 px-4 py-3 text-sm text-[#FF7777]">
            {error}
          </div>
        )}

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
          maxLength={150}
          required
          className={inputClass}
        />

        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition ${
                category === c
                  ? "bg-[#34E7A6] text-[#080C0B]"
                  : "border border-white/[0.08] text-white/50 hover:text-white"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          required
          placeholder="Write the post content..."
          className={`${inputClass} resize-none`}
        />

        <button
          type="submit"
          disabled={publishing}
          className="flex items-center gap-2 rounded-xl bg-[#34E7A6] px-6 py-3 text-sm font-bold text-[#080C0B] transition hover:bg-[#5CFFC0] disabled:opacity-60"
        >
          {publishing && <Loader2 size={16} className="animate-spin" />}
          {publishing ? "Publishing..." : "Publish post"}
        </button>
      </form>

      <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/40">
        Published ({posts.length})
      </p>

      {loading && (
        <div className="flex justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#34E7A6] border-t-transparent" />
        </div>
      )}

      <div className="space-y-3">
        {posts.map((p) => (
          <motion.div
            key={p._id}
            layout
            className="flex items-start justify-between gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4"
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold">{p.title}</p>
              <p className="mt-0.5 text-[11px] capitalize text-white/30">
                {p.category} · {new Date(p.createdAt).toLocaleDateString()}
              </p>
              <p className="mt-2 line-clamp-2 text-xs text-white/50">
                {p.content}
              </p>
            </div>
            <button
              onClick={() => remove(p._id)}
              className="shrink-0 rounded-lg p-2 text-white/30 transition hover:bg-[#E5484D]/10 hover:text-[#E5484D]"
              aria-label="Delete post"
            >
              <Trash2 size={16} />
            </button>
          </motion.div>
        ))}

        {!loading && posts.length === 0 && (
          <p className="py-8 text-center text-sm text-white/40">
            No posts yet.
          </p>
        )}
      </div>
    </AdminLayout>
  );
}
