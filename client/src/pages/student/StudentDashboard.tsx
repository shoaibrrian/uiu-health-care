import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Hospital,
  MapPin,
  MessageCircleHeart,
  Navigation,
  ShieldCheck,
  Siren,
  X,
  Loader2,
  BookOpenText,
} from "lucide-react";
import { connectSocket } from "../../lib/socket";
import { useNavigate } from "react-router-dom";
import StudentLayout from "../../layouts/StudentLayout";

const quickActions = [
  {
    title: "First Aid",
    description: "Immediate guidance",
    icon: BookOpenText,
    path: "/student/first-aid",
  },
  {
    title: "Mental Health",
    description: "Support & resources",
    icon: MessageCircleHeart,
    path: "/student/mental-health",
  },
  {
    title: "Find Hospital",
    description: "Nearby healthcare",
    icon: Hospital,
    path: "/student/hospitals",
  },
];

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [student, setStudent] = useState<any>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [sosStatus, setSOSStatus] = useState<
    "idle" | "sending" | "active" | "resolved"
  >("idle");
  const [recentAlerts, setRecentAlerts] = useState<any[]>([]);
  const [emergencyType, setEmergencyType] = useState("medical");
  const [message, setMessage] = useState("");
  const [locationEnabled, setLocationEnabled] = useState(false);

  const openSOSModal = () => {
    if (sosStatus === "active") return;
    setShowSOSModal(true);
  };

  const enableLocation = () => setLocationEnabled(true);

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
      const response = await fetch("http://localhost:5000/api/students/sos", {
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
      if (!response.ok) throw new Error(data.message || "Failed to send SOS");
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
          "http://localhost:5000/api/students/dashboard",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Failed to load dashboard");
        setStudent(data.student);
        setRecentAlerts(data.sos.recent || []);
        if (data.sos.active) setSOSStatus("active");
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setDashboardLoading(false);
      }
    };

    loadDashboard();

    const socket = connectSocket();
    const studentUser = localStorage.getItem("user");
    const studentId = studentUser ? JSON.parse(studentUser).id : null;
    if (studentId) socket.emit("join-student-room", studentId);

    socket.on("sos:resolved", () => {
      setSOSStatus("resolved");
      loadDashboard();
    });
    socket.on("sos:updated", (updated: any) => {
      if (updated.status === "acknowledged") {
        // stays "active" UI-wise
      }
    });

    return () => {
      socket.off("sos:resolved");
      socket.off("sos:updated");
    };
  }, []);

  const resetSOS = () => {
    setSOSStatus("idle");
    setMessage("");
    setLocationEnabled(false);
  };

  return (
    <StudentLayout pageTitle="Health & Emergency Center">
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
              Stay safe, {student?.name?.split(" ")[0] || "Student"}.
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
                Send your current location and emergency alert directly to the
                campus response team.
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
                  Your SOS alert has been received by the campus response team.
                  Please stay where you are if it is safe to do so.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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
              onClick={() => navigate(action.path)}
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

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_0.8fr]">
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
          </div>
          <div className="divide-y divide-white/[0.06]">
            {recentAlerts.length === 0 && (
              <p className="px-5 py-6 text-center text-sm text-white/30">
                No emergency alerts yet.
              </p>
            )}
            {recentAlerts.map((alert) => (
              <div
                key={alert._id}
                className="flex items-center gap-4 px-5 py-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#34E7A6]/[0.07] text-[#34E7A6]">
                  <ShieldCheck size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium capitalize">
                    {alert.emergencyType}
                  </p>
                  <p className="mt-1 text-xs text-white/30">
                    {new Date(alert.createdAt).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ${
                    alert.status === "resolved"
                      ? "bg-[#34E7A6]/10 text-[#34E7A6]"
                      : "bg-[#F0B429]/10 text-[#F0B429]"
                  }`}
                >
                  {alert.status}
                </span>
              </div>
            ))}
          </div>
        </section>

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
                className={`h-2 w-2 rounded-full ${locationEnabled ? "bg-[#34E7A6]" : "bg-white/20"}`}
              />
              <span className="text-xs font-medium text-white/60">
                {locationEnabled
                  ? "Location ready"
                  : "Location services available"}
              </span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-white/30">
              Your precise location will only be shared with authorized campus
              responders when an emergency SOS is activated.
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

      <div className="mt-8 flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.015] p-4">
        <ShieldCheck size={17} className="mt-0.5 shrink-0 text-[#34E7A6]" />
        <p className="text-xs leading-relaxed text-white/30">
          <span className="font-medium text-white/50">Safety notice:</span> UIU
          Health Care provides emergency support and health resources for
          students. In a life-threatening situation, contact your local
          emergency service immediately.
        </p>
      </div>

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

                <div>
                  <label className="mb-2 block text-xs font-medium text-white/50">
                    Emergency type
                  </label>
                  <select
                    value={emergencyType}
                    onChange={(e) => setEmergencyType(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-[#34E7A6]/40"
                  >
                    <option value="medical" className="bg-[#0C1210]">
                      Medical emergency
                    </option>
                    <option value="accident" className="bg-[#0C1210]">
                      Accident
                    </option>
                    <option value="injury" className="bg-[#0C1210]">
                      Injury
                    </option>
                    <option value="mental-health" className="bg-[#0C1210]">
                      Mental health crisis
                    </option>
                    <option value="other" className="bg-[#0C1210]">
                      Other
                    </option>
                  </select>
                </div>

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
    </StudentLayout>
  );
}
