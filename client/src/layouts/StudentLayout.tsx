import { useState, useEffect, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Bell,
  BookOpenText,
  Clock3,
  HeartPulse,
  Hospital,
  LogOut,
  Menu,
  MessageCircleHeart,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

interface StudentLayoutProps {
  children: ReactNode;
  pageTitle: string;
}

export default function StudentLayout({
  children,
  pageTitle,
}: StudentLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  useEffect(() => {
    const loadCount = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5000/api/notifications",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await response.json();
        if (data.success) setUnreadCount(data.unreadCount);
      } catch (err) {
        console.error("Failed to load notification count:", err);
      }
    };
    loadCount();
  }, [location.pathname]);

  const closeSidebar = () => setSidebarOpen(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const navItems = [
    { label: "Dashboard", icon: ShieldCheck, path: "/student" },

    { label: "First Aid", icon: BookOpenText, path: "/student/first-aid" },
    {
      label: "Mental Health",
      icon: MessageCircleHeart,
      path: "/student/mental-health",
    },
    { label: "Nearby Hospitals", icon: Hospital, path: "/student/hospitals" },
  ];

  return (
    <div className="min-h-screen bg-[#080C0B] font-sans text-[#F4F6F5]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/3 h-[500px] w-[500px] rounded-full bg-[#34E7A6]/[0.05] blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-[#E5484D]/[0.04] blur-[120px]" />
      </div>

      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/[0.07] bg-[#0A0F0D] transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/[0.07] px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#34E7A6]/10 text-[#34E7A6] ring-1 ring-[#34E7A6]/20">
              <HeartPulse size={17} />
            </div>
            <div>
              <p className="text-sm font-semibold">UIU Health Care</p>
              <p className="text-[10px] uppercase tracking-widest text-white/30">
                Student Portal
              </p>
            </div>
          </div>
          <button
            onClick={closeSidebar}
            className="text-white/40 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-white/25">
            Overview
          </p>
          {navItems.slice(0, 1).map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                location.pathname === item.path
                  ? "bg-[#34E7A6]/10 text-[#34E7A6]"
                  : "text-white/45 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}

          <button
            onClick={() => navigate("/student/history")}
            className={`mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
              location.pathname === "/student/history"
                ? "bg-[#34E7A6]/10 text-[#34E7A6]"
                : "text-white/45 hover:bg-white/[0.04] hover:text-white"
            }`}
          >
            <Clock3 size={18} />
            Emergency History
          </button>

          <p className="mb-3 mt-8 px-3 text-[10px] font-semibold uppercase tracking-widest text-white/25">
            Health & Support
          </p>
          {navItems.slice(1).map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                location.pathname === item.path
                  ? "bg-[#34E7A6]/10 text-[#34E7A6]"
                  : "text-white/45 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}

          <button
            onClick={() => navigate("/student/notifications")}
            className={`mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
              location.pathname === "/student/notifications"
                ? "bg-[#34E7A6]/10 text-[#34E7A6]"
                : "text-white/45 hover:bg-white/[0.04] hover:text-white"
            }`}
          >
            <Bell size={18} />
            Notifications
            {unreadCount > 0 && (
              <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-[#E5484D] px-1 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>
        </nav>

        <div className="border-t border-white/[0.07] p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/[0.03] p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#34E7A6]/10 text-[#34E7A6]">
              <UserRound size={17} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {user?.name || "Student"}
              </p>
              <p className="truncate text-[11px] text-white/30">
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/40 transition hover:bg-white/[0.04] hover:text-white"
          >
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </aside>

      <div className="relative lg:pl-64">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/[0.07] bg-[#080C0B]/80 px-5 backdrop-blur-xl sm:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-white/50 hover:bg-white/[0.05] hover:text-white lg:hidden"
          >
            <Menu size={21} />
          </button>

          <div className="hidden lg:block">
            <p className="text-xs text-white/30">Student Portal</p>
            <h1 className="text-sm font-semibold">{pageTitle}</h1>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button className="relative rounded-xl border border-white/[0.07] p-2.5 text-white/50 transition hover:border-white/15 hover:text-white">
              <Bell size={18} />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#E5484D]" />
            </button>
            <div className="hidden h-8 w-px bg-white/[0.08] sm:block" />
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#34E7A6]/10 text-[#34E7A6]">
                <UserRound size={17} />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-medium">{user?.name || "Student"}</p>
                <p className="text-[10px] text-white/30">UIU Student</p>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-4xl px-5 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
