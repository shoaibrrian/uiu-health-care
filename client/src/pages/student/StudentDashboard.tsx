import { motion } from "framer-motion";
import {
  AlertTriangle,
  Bell,
  BookOpenText,
  ChevronRight,
  Clock3,
  HeartPulse,
  Hospital,
  LogOut,
  MapPin,
  Menu,
  MessageCircleHeart,
  ShieldCheck,
  Siren,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";

const quickActions = [
  {
    title: "First Aid",
    description: "Immediate guidance",
    icon: BookOpenText,
  },
  {
    title: "Mental Health",
    description: "Support & resources",
    icon: MessageCircleHeart,
  },
  {
    title: "Find Hospital",
    description: "Nearby healthcare",
    icon: Hospital,
  },
];

const recentAlerts = [
  {
    id: "SOS-2026-014",
    type: "Emergency SOS",
    date: "Today, 10:42 AM",
    status: "Resolved",
  },
  {
    id: "SOS-2026-009",
    type: "Medical Assistance",
    date: "Aug 24, 3:18 PM",
    status: "Resolved",
  },
];

export default function StudentDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-[#080C0B] font-sans text-[#F4F6F5]">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/3 h-[500px] w-[500px] rounded-full bg-[#34E7A6]/[0.05] blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-[#E5484D]/[0.04] blur-[120px]" />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
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

          <button className="flex w-full items-center gap-3 rounded-xl bg-[#34E7A6]/10 px-3 py-3 text-sm font-medium text-[#34E7A6]">
            <ShieldCheck size={18} />
            Dashboard
          </button>

          <button className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/45 transition hover:bg-white/[0.04] hover:text-white">
            <Clock3 size={18} />
            Emergency History
          </button>

          <p className="mb-3 mt-8 px-3 text-[10px] font-semibold uppercase tracking-widest text-white/25">
            Health & Support
          </p>

          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/45 transition hover:bg-white/[0.04] hover:text-white">
            <BookOpenText size={18} />
            First Aid
          </button>

          <button className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/45 transition hover:bg-white/[0.04] hover:text-white">
            <MessageCircleHeart size={18} />
            Mental Health
          </button>

          <button className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/45 transition hover:bg-white/[0.04] hover:text-white">
            <Hospital size={18} />
            Nearby Hospitals
          </button>

          <button className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/45 transition hover:bg-white/[0.04] hover:text-white">
            <Bell size={18} />
            Notifications
            <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-[#E5484D] px-1 text-[10px] font-bold text-white">
              2
            </span>
          </button>
        </nav>

        <div className="border-t border-white/[0.07] p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/[0.03] p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#34E7A6]/10 text-[#34E7A6]">
              <UserRound size={17} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium">Student User</p>
              <p className="truncate text-[11px] text-white/30">
                student@uiu.ac.bd
              </p>
            </div>
          </div>

          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/40 transition hover:bg-white/[0.04] hover:text-white">
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="relative lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/[0.07] bg-[#080C0B]/80 px-5 backdrop-blur-xl sm:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-white/50 hover:bg-white/[0.05] hover:text-white lg:hidden"
          >
            <Menu size={21} />
          </button>

          <div className="hidden lg:block">
            <p className="text-xs text-white/30">Student Portal</p>
            <h1 className="text-sm font-semibold">Health & Emergency Center</h1>
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
                <p className="text-xs font-medium">Student User</p>
                <p className="text-[10px] text-white/30">UIU Student</p>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
          {/* Welcome */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <p className="text-xs font-medium uppercase tracking-widest text-[#34E7A6]">
              Good morning
            </p>

            <div className="mt-2 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <h2 className="font-['Manrope'] text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Stay safe, Student.
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/40">
                  Your campus health support is always within reach. If you need
                  immediate assistance, use the emergency SOS.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-white/30">
                <span className="h-2 w-2 rounded-full bg-[#34E7A6]" />
                Support system online
              </div>
            </div>
          </motion.section>

          {/* SOS */}
          <motion.section
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.08 }}
            className="relative mb-8 overflow-hidden rounded-3xl border border-[#E5484D]/15 bg-gradient-to-br from-[#E5484D]/[0.08] to-white/[0.02] p-6 sm:p-8"
          >
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#E5484D]/[0.06] blur-[70px]" />

            <div className="relative flex flex-col items-center justify-between gap-8 sm:flex-row">
              <div className="max-w-xl text-center sm:text-left">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#E5484D]/20 bg-[#E5484D]/[0.08] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#FF7777]">
                  <Siren size={13} />
                  Emergency assistance
                </div>

                <h3 className="font-['Manrope'] text-2xl font-bold">
                  Need immediate help?
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-white/40">
                  Send your current location and emergency alert directly to the
                  campus response team.
                </p>
              </div>

              <button className="group relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-[#D33A32] text-white shadow-[0_20px_50px_-15px_rgba(229,72,77,0.6)] transition hover:scale-[1.03] active:scale-95 sm:h-36 sm:w-36">
                <span className="absolute inset-[-8px] rounded-full border border-[#E5484D]/20" />

                <span className="flex flex-col items-center gap-1">
                  <AlertTriangle size={25} />
                  <span className="text-lg font-extrabold tracking-wide">
                    SOS
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-white/60">
                    Tap to alert
                  </span>
                </span>
              </button>
            </div>
          </motion.section>

          {/* Quick Actions */}
          <section className="mb-10">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#34E7A6]">
                  Quick access
                </p>
                <h3 className="mt-1 text-lg font-semibold">Health & Support</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {quickActions.map((action, index) => (
                <motion.button
                  key={action.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + index * 0.06 }}
                  className="group flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 text-left transition hover:border-[#34E7A6]/20 hover:bg-[#34E7A6]/[0.04]"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-[#34E7A6] transition group-hover:bg-[#34E7A6] group-hover:text-[#080C0B]">
                    <action.icon size={19} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{action.title}</p>
                    <p className="mt-1 text-xs text-white/35">
                      {action.description}
                    </p>
                  </div>

                  <ChevronRight
                    size={17}
                    className="ml-auto text-white/20 transition group-hover:translate-x-0.5 group-hover:text-[#34E7A6]"
                  />
                </motion.button>
              ))}
            </div>
          </section>

          {/* Lower grid */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_0.8fr]">
            {/* Recent alerts */}
            <section className="rounded-2xl border border-white/[0.07] bg-white/[0.02]">
              <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25">
                    Activity
                  </p>
                  <h3 className="mt-1 text-sm font-semibold">
                    Recent emergency alerts
                  </h3>
                </div>

                <button className="text-xs font-medium text-[#34E7A6] hover:text-[#5CFFC0]">
                  View all
                </button>
              </div>

              <div className="divide-y divide-white/[0.06]">
                {recentAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center gap-4 px-5 py-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#34E7A6]/[0.07] text-[#34E7A6]">
                      <ShieldCheck size={18} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{alert.type}</p>
                      <p className="mt-1 text-xs text-white/30">
                        {alert.id} · {alert.date}
                      </p>
                    </div>

                    <span className="rounded-full bg-[#34E7A6]/10 px-2.5 py-1 text-[10px] font-semibold text-[#34E7A6]">
                      {alert.status}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Location card */}
            <section className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#34E7A6]/[0.07] text-[#34E7A6]">
                  <MapPin size={18} />
                </div>

                <div>
                  <p className="text-sm font-semibold">Your location</p>
                  <p className="text-xs text-white/30">
                    Used only during emergency alerts
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-white/[0.06] bg-black/10 p-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#34E7A6]" />
                  <span className="text-xs font-medium text-white/60">
                    Location services available
                  </span>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-white/30">
                  Your precise location will only be shared with authorized
                  campus responders when an emergency SOS is activated.
                </p>
              </div>

              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.07] py-2.5 text-xs font-medium text-white/50 transition hover:border-[#34E7A6]/20 hover:text-[#34E7A6]">
                <MapPin size={14} />
                Find nearby hospitals
              </button>
            </section>
          </div>

          {/* Safety notice */}
          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.015] p-4">
            <ShieldCheck size={17} className="mt-0.5 shrink-0 text-[#34E7A6]" />

            <p className="text-xs leading-relaxed text-white/30">
              <span className="font-medium text-white/50">Safety notice:</span>{" "}
              UIU Health Care provides emergency support and health resources
              for students. In a life-threatening situation, contact your local
              emergency service immediately.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
