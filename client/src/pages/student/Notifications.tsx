import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, Siren, CheckCircle2, Info } from "lucide-react";
import StudentLayout from "../../layouts/StudentLayout";

interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: "sos" | "system" | "health-tip";
  read: boolean;
  createdAt: string;
}

const typeIcon: Record<string, any> = {
  sos: Siren,
  system: Info,
  "health-tip": CheckCircle2,
};

export default function Notifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) setNotifications(data.notifications);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markAllRead = async () => {
    const token = localStorage.getItem("token");
    await fetch("http://localhost:5000/api/notifications/read-all", {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markOneRead = async (id: string) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n)),
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <StudentLayout pageTitle="Notifications">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#34E7A6]/10 text-[#34E7A6] ring-1 ring-[#34E7A6]/20">
            <Bell size={20} />
          </div>
          <div>
            <h1 className="font-['Manrope'] text-2xl font-extrabold tracking-tight">
              Notifications
            </h1>
            <p className="text-sm text-white/40">
              {unreadCount > 0
                ? `${unreadCount} unread`
                : "You're all caught up"}
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="rounded-lg border border-white/[0.08] px-3 py-2 text-xs font-medium text-white/60 hover:border-[#34E7A6]/30 hover:text-[#34E7A6]"
          >
            Mark all read
          </button>
        )}
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#34E7A6] border-t-transparent" />
        </div>
      )}

      <div className="space-y-2">
        {notifications.map((n, i) => {
          const Icon = typeIcon[n.type] || Info;
          return (
            <motion.div
              key={n._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => !n.read && markOneRead(n._id)}
              className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                n.read
                  ? "border-white/[0.06] bg-white/[0.01]"
                  : "border-[#34E7A6]/20 bg-[#34E7A6]/[0.04]"
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                  n.type === "sos"
                    ? "bg-[#E5484D]/10 text-[#FF7777]"
                    : "bg-[#34E7A6]/10 text-[#34E7A6]"
                }`}
              >
                <Icon size={16} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold">{n.title}</p>
                  {!n.read && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#34E7A6]" />
                  )}
                </div>
                <p className="mt-1 text-sm text-white/50">{n.message}</p>
                <p className="mt-2 text-[11px] text-white/25">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            </motion.div>
          );
        })}

        {!loading && notifications.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.015] py-16">
            <Bell size={22} className="text-white/20" />
            <p className="text-sm text-white/40">No notifications yet.</p>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
