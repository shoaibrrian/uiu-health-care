import { motion } from "framer-motion";
import {
  Siren,
  HeartPulse,
  BookOpenText,
  MapPin,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";

const features = [
  {
    icon: Siren,
    title: "Emergency SOS",
    desc: "One tap sends an instant, real-time alert straight to campus admin.",
  },
  {
    icon: HeartPulse,
    title: "First Aid Guidelines",
    desc: "Step-by-step guidance for common emergencies, written for students.",
  },
  {
    icon: BookOpenText,
    title: "Mental Health Support",
    desc: "Confidential resources, helplines and counselor access, always available.",
  },
  {
    icon: MapPin,
    title: "Nearby Hospital Finder",
    desc: "Locate the closest hospitals around campus with live directions.",
  },
];

const stats = [
  { value: "24/7", label: "Emergency response coverage" },
  { value: "<30s", label: "Average SOS alert delivery" },
  { value: "100%", label: "Confidential student records" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080C0B] font-sans text-[#F4F6F5] selection:bg-[#34E7A6]/25">
      {/* ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#34E7A6]/[0.07] blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#E5484D]/[0.05] blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-20 border-b border-white/[0.06] bg-[#080C0B]/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#34E7A6]/10 text-[#34E7A6] ring-1 ring-[#34E7A6]/20">
              <HeartPulse size={16} />
            </div>
            <span className="text-[15px] font-semibold tracking-tight">
              UIU Health Care
            </span>
          </div>
          <div className="hidden items-center gap-8 text-sm text-white/50 sm:flex">
            <a href="#features" className="hover:text-white">
              Features
            </a>
            <a href="#about" className="hover:text-white">
              About
            </a>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-sm font-medium text-white/60 hover:text-white">
              Log in
            </button>
            <button className="rounded-full bg-[#F4F6F5] px-5 py-2.5 text-sm font-semibold text-[#080C0B] transition-transform hover:scale-[1.03]">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative mx-auto flex max-w-6xl flex-col items-center px-6 pb-32 pt-24 text-center">
        <motion.span
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-widest text-white/50"
        >
          United International University
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-3xl font-['Manrope'] text-[3.1rem] font-extrabold leading-[1.08] tracking-tight sm:text-6xl"
        >
          Real help,
          <br />
          <span className="text-[#34E7A6]">in seconds.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 max-w-md text-[15px] leading-relaxed text-white/45"
        >
          Tap the SOS button in an emergency — campus admin is alerted
          instantly, in real time, wherever they are.
        </motion.p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <button className="group flex items-center justify-center gap-2 rounded-full bg-[#34E7A6] px-7 py-3.5 text-sm font-semibold text-[#080C0B] transition-all hover:bg-[#5CFFC0]">
            Create your account
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </button>
          <button className="rounded-full border border-white/12 px-7 py-3.5 text-sm font-semibold text-white/70 hover:border-white/25 hover:text-white">
            Admin login
          </button>
        </div>

        {/* Signature SOS panel */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="relative mt-20 flex w-full max-w-sm flex-col items-center rounded-3xl border border-white/[0.08] bg-white/[0.03] px-10 py-12 backdrop-blur-sm"
        >
          <div className="relative flex h-44 w-44 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E5484D]/15 [animation-duration:2.4s]" />
            <span className="absolute inline-flex h-[80%] w-[80%] rounded-full bg-[#E5484D]/10" />
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative z-10 flex h-28 w-28 flex-col items-center justify-center gap-1 rounded-full bg-gradient-to-b from-[#F0564D] to-[#D33A32] text-white shadow-[0_25px_50px_-12px_rgba(229,72,77,0.5)]"
            >
              <AlertTriangle size={24} strokeWidth={2.3} />
              <span className="text-sm font-bold tracking-wide">SOS</span>
            </motion.div>
          </div>
          <p className="mt-6 text-xs font-medium uppercase tracking-widest text-white/35">
            Emergency alert system
          </p>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="relative mx-auto max-w-6xl px-6 py-28">
        <div className="mb-16 flex flex-col items-start">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#34E7A6]">
            Core features
          </span>
          <h2 className="mt-3 font-['Manrope'] text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need, in one place
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group bg-[#0B0F0E] p-7 transition-colors hover:bg-[#0F1512]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.05] text-[#34E7A6] transition-colors group-hover:bg-[#34E7A6] group-hover:text-[#080C0B]">
                <f.icon size={19} />
              </div>
              <h3 className="mt-5 font-semibold">{f.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-white/40">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section id="about" className="mx-auto max-w-6xl px-6 py-8 pb-28">
        <div className="grid grid-cols-1 gap-10 border-t border-white/[0.08] pt-16 sm:grid-cols-3">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <p className="font-['Manrope'] text-5xl font-extrabold text-[#34E7A6]">
                {s.value}
              </p>
              <p className="mt-2 text-sm text-white/40">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 text-center">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} UIU Health Care — Student Healthcare
            Support System
          </p>
          <p className="text-xs text-white/20">
            United International University
          </p>
        </div>
      </footer>
    </div>
  );
}
