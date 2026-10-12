import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Search, Phone, Mail } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { API_URL } from "../../lib/config";

interface Student {
  _id: string;
  name: string;
  email: string;
  studentId: string;
  program: string;
  phone?: string;
}

export default function AdminStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/api/admin/students`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) setStudents(data.students);
      } catch (err) {
        console.error("Failed to load students:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const q = search.toLowerCase();
  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.studentId?.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q),
  );

  return (
    <AdminLayout pageTitle="Students">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#34E7A6]/10 text-[#34E7A6] ring-1 ring-[#34E7A6]/20">
          <Users size={20} />
        </div>
        <div>
          <h1 className="font-['Manrope'] text-2xl font-extrabold tracking-tight">
            All Students
          </h1>
          <p className="text-sm text-white/40">
            {students.length} registered students
          </p>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5">
        <Search size={16} className="text-white/30" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, student ID, or email..."
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/25"
        />
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#34E7A6] border-t-transparent" />
        </div>
      )}

      <div className="space-y-2">
        {filtered.map((s, i) => (
          <motion.div
            key={s._id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.03, 0.4) }}
            className="flex items-center justify-between gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#34E7A6]/10 text-sm font-bold text-[#34E7A6]">
                {s.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{s.name}</p>
                <p className="text-xs text-white/40">
                  {s.studentId} · {s.program}
                </p>
              </div>
            </div>

            <div className="hidden min-w-0 flex-col items-end gap-1 sm:flex">
              <p className="flex items-center gap-1.5 truncate text-xs text-white/40">
                <Mail size={11} /> {s.email}
              </p>
              {s.phone && (
                <p className="flex items-center gap-1.5 text-xs text-white/40">
                  <Phone size={11} /> {s.phone}
                </p>
              )}
            </div>
          </motion.div>
        ))}

        {!loading && filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-white/40">
            No students found.
          </p>
        )}
      </div>
    </AdminLayout>
  );
}
