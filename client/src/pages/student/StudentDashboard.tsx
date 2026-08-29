import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Bell,
  BookOpenText,
  CheckCircle2,
  ChevronRight,
  Clock3,
  HeartPulse,
  Hospital,
  LogOut,
  MapPin,
  Menu,
  MessageCircleHeart,
  Navigation,
  Phone,
  ShieldCheck,
  Siren,
  UserRound,
  X,
  Loader2,
} from "lucide-react";

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
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [student, setStudent] = useState<any>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [sosStatus, setSOSStatus] = useState<
    "idle" | "sending" | "active" | "resolved"
  >("idle");

  const [emergencyType, setEmergencyType] = useState("Medical emergency");
  const [message, setMessage] = useState("");
  const [locationEnabled, setLocationEnabled] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  const openSOSModal = () => {
    if (sosStatus === "active") return;
    setShowSOSModal(true);
  };

  const enableLocation = () => {
    setLocationEnabled(true);
  };

  const sendSOS = async () => {
    setSOSStatus("sending");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      let latitude = null;
      let longitude = null;

      if (locationEnabled && navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>(
            (resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject);
            },
          );

          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
        } catch {
          console.log("Location permission denied.");
        }
      }

      const response = await fetch("http://localhost:5000/api/student/sos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          emergencyType,
          message,
          latitude,
          longitude,
          address: "",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send SOS");
      }

      setSOSStatus("active");
      setShowSOSModal(false);
    } catch (error) {
      console.error("SOS error:", error);

      setSOSStatus("idle");

      alert(error instanceof Error ? error.message : "Failed to send SOS.");
    }
  };

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          window.location.href = "/login";
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/student/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load dashboard");
        }

        setStudent(data.student);

        if (data.sos.active) {
          setSOSStatus("active");
        }
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setDashboardLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const resolveSOS = () => {
    setSOSStatus("resolved");
  };

  const resetSOS = () => {
    setSOSStatus("idle");
    setMessage("");
    setLocationEnabled(false);
  };

  return (
    <div className="min-h-screen bg-[#080C0B] font-sans text-[#F4F6F5]">
      {/* Background */}
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

          {/* SOS Section */}
          <motion.section
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.08 }}
            className={`relative mb-8 overflow-hidden rounded-3xl border p-6 sm:p-8 ${
              sosStatus === "active"
                ? "border-[#F0B429]/20 bg-[#F0B429]/[0.05]"
                : sosStatus === "resolved"
                  ? "border-[#34E7A6]/20 bg-[#34E7A6]/[0.04]"
                  : "border-[#E5484D]/15 bg-gradient-to-br from-[#E5484D]/[0.08] to-white/[0.02]"
            }`}
          >
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#E5484D]/[0.06] blur-[70px]" />

            {sosStatus === "idle" && (
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
                    Send your current location and emergency alert directly to
                    the campus response team.
                  </p>
                </div>

                <button
                  onClick={openSOSModal}
                  className="group relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-[#D33A32] text-white shadow-[0_20px_50px_-15px_rgba(229,72,77,0.6)] transition hover:scale-[1.03] active:scale-95 sm:h-36 sm:w-36"
                >
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
            )}

            {sosStatus === "active" && (
              <div className="relative">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#F0B429]/20 bg-[#F0B429]/[0.08] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#F0B429]">
                      <Loader2 size={13} className="animate-spin" />
                      Response in progress
                    </div>

                    <h3 className="font-['Manrope'] text-2xl font-bold">
                      Help is on the way
                    </h3>

                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/40">
                      Your SOS alert has been received by the campus response
                      team. Please stay where you are if it is safe to do so.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/[0.07] bg-black/10 p-4">
                      <p className="text-[10px] uppercase tracking-wider text-white/25">
                        Alert ID
                      </p>
                      <p className="mt-2 text-sm font-semibold">SOS-2026-021</p>
                    </div>

                    <div className="rounded-2xl border border-white/[0.07] bg-black/10 p-4">
                      <p className="text-[10px] uppercase tracking-wider text-white/25">
                        Status
                      </p>
                      <p className="mt-2 text-sm font-semibold text-[#F0B429]">
                        Responding
                      </p>
                    </div>

                    <div className="col-span-2 rounded-2xl border border-white/[0.07] bg-black/10 p-4 sm:col-span-1">
                      <p className="text-[10px] uppercase tracking-wider text-white/25">
                        Location
                      </p>
                      <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold">
                        <MapPin size={13} className="text-[#34E7A6]" />
                        Shared
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 border-t border-white/[0.07] pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 text-xs text-white/30">
                    <ShieldCheck size={15} className="text-[#34E7A6]" />
                    Campus response team has been notified
                  </div>

                  <button
                    onClick={resolveSOS}
                    className="rounded-xl border border-white/[0.08] px-4 py-2.5 text-xs font-medium text-white/40 transition hover:border-[#34E7A6]/20 hover:text-[#34E7A6]"
                  >
                    Simulate resolution
                  </button>
                </div>
              </div>
            )}

            {sosStatus === "resolved" && (
              <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#34E7A6]/10 text-[#34E7A6]">
                    <CheckCircle2 size={24} />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">Emergency resolved</h3>
                      <span className="rounded-full bg-[#34E7A6]/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#34E7A6]">
                        Resolved
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-white/35">
                      The campus response team has marked your emergency as
                      resolved.
                    </p>

                    <p className="mt-2 text-xs text-white/20">
                      Alert ID: SOS-2026-021
                    </p>
                  </div>
                </div>

                <button
                  onClick={resetSOS}
                  className="rounded-xl border border-white/[0.08] px-4 py-2.5 text-xs font-medium text-white/50 transition hover:border-white/15 hover:text-white"
                >
                  New emergency
                </button>
              </div>
            )}
          </motion.section>

          {/* Quick Actions */}
          <section className="mb-10">
            <div className="mb-4">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#34E7A6]">
                Quick access
              </p>

              <h3 className="mt-1 text-lg font-semibold">Health & Support</h3>
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

            {/* Location */}
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
                  <span
                    className={`h-2 w-2 rounded-full ${
                      locationEnabled ? "bg-[#34E7A6]" : "bg-white/20"
                    }`}
                  />

                  <span className="text-xs font-medium text-white/60">
                    {locationEnabled
                      ? "Location ready"
                      : "Location services available"}
                  </span>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-white/30">
                  Your precise location will only be shared with authorized
                  campus responders when an emergency SOS is activated.
                </p>
              </div>

              <button
                onClick={enableLocation}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.07] py-2.5 text-xs font-medium text-white/50 transition hover:border-[#34E7A6]/20 hover:text-[#34E7A6]"
              >
                <Navigation size={14} />
                {locationEnabled ? "Location enabled" : "Enable location"}
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

      {/* SOS Confirmation Modal */}
      <AnimatePresence>
        {showSOSModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-5 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/[0.09] bg-[#0C1210] shadow-2xl"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#E5484D]">
                    Emergency alert
                  </p>

                  <h3 className="mt-1 text-lg font-semibold">
                    Send SOS alert?
                  </h3>
                </div>

                <button
                  onClick={() => setShowSOSModal(false)}
                  className="rounded-lg p-2 text-white/30 transition hover:bg-white/[0.05] hover:text-white"
                >
                  <X size={19} />
                </button>
              </div>

              <div className="space-y-5 p-6">
                {/* Warning */}
                <div className="flex gap-3 rounded-2xl border border-[#E5484D]/15 bg-[#E5484D]/[0.05] p-4">
                  <AlertTriangle
                    size={18}
                    className="mt-0.5 shrink-0 text-[#E5484D]"
                  />

                  <p className="text-xs leading-relaxed text-white/45">
                    This will immediately notify the authorized campus response
                    team and share your current location.
                  </p>
                </div>

                {/* Emergency type */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-white/50">
                    Emergency type
                  </label>

                  <select
                    value={emergencyType}
                    onChange={(e) => setEmergencyType(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-[#34E7A6]/40"
                  >
                    <option className="bg-[#0C1210]">Medical emergency</option>
                    <option className="bg-[#0C1210]">Accident / Injury</option>
                    <option className="bg-[#0C1210]">Severe illness</option>
                    <option className="bg-[#0C1210]">
                      Mental health crisis
                    </option>
                    <option className="bg-[#0C1210]">Security emergency</option>
                    <option className="bg-[#0C1210]">Other</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-white/50">
                    Additional details{" "}
                    <span className="text-white/20">(optional)</span>
                  </label>

                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    placeholder="Briefly describe what happened..."
                    className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#34E7A6]/40"
                  />
                </div>

                {/* Location */}
                <button
                  onClick={enableLocation}
                  className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${
                    locationEnabled
                      ? "border-[#34E7A6]/20 bg-[#34E7A6]/[0.05]"
                      : "border-white/[0.07] bg-white/[0.02] hover:border-white/15"
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      locationEnabled
                        ? "bg-[#34E7A6]/10 text-[#34E7A6]"
                        : "bg-white/[0.05] text-white/40"
                    }`}
                  >
                    <MapPin size={17} />
                  </div>

                  <div className="flex-1">
                    <p className="text-xs font-medium">
                      {locationEnabled
                        ? "Location ready to share"
                        : "Share current location"}
                    </p>

                    <p className="mt-1 text-[11px] text-white/25">
                      Only authorized responders can access this information.
                    </p>
                  </div>

                  {locationEnabled && (
                    <CheckCircle2 size={17} className="text-[#34E7A6]" />
                  )}
                </button>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse gap-3 border-t border-white/[0.07] bg-white/[0.015] p-5 sm:flex-row sm:justify-end">
                <button
                  onClick={() => setShowSOSModal(false)}
                  className="rounded-xl border border-white/[0.08] px-5 py-3 text-sm font-medium text-white/45 transition hover:border-white/15 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  onClick={sendSOS}
                  disabled={sosStatus === "sending"}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#D33A32] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#E5484D] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {sosStatus === "sending" ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Sending alert...
                    </>
                  ) : (
                    <>
                      <Siren size={16} />
                      Send SOS Alert
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
