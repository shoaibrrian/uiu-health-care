import { Link } from "react-router-dom";
import { ArrowLeft, HeartPulse, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#080C0B] font-sans text-[#F4F6F5]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[550px] w-[550px] -translate-x-1/2 rounded-full bg-[#34E7A6]/[0.06] blur-[120px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-6">
        <Link
          to="/"
          className="flex w-fit items-center gap-2 text-sm text-white/45 transition-colors hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>

        <div className="flex flex-1 items-center justify-center py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <div className="mb-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#34E7A6]/10 text-[#34E7A6] ring-1 ring-[#34E7A6]/20">
                <HeartPulse size={22} />
              </div>

              <h1 className="mt-6 font-['Manrope'] text-3xl font-extrabold tracking-tight">
                Welcome back
              </h1>

              <p className="mt-2 text-sm text-white/40">
                Sign in to your UIU Health Care account
              </p>
            </div>

            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-7 backdrop-blur-xl sm:p-8">
              <form className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/70">
                    University Email
                  </label>
                  <input
                    type="email"
                    placeholder="yourname@student.uiu.ac.bd"
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#34E7A6]/50 focus:ring-2 focus:ring-[#34E7A6]/10"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-medium text-white/70">
                      Password
                    </label>

                    <button
                      type="button"
                      className="text-xs text-[#34E7A6] hover:text-[#5CFFC0]"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#34E7A6]/50 focus:ring-2 focus:ring-[#34E7A6]/10"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#34E7A6] py-3.5 text-sm font-bold text-[#080C0B] transition hover:bg-[#5CFFC0]"
                >
                  Sign in
                </button>
              </form>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/[0.08]" />
                <span className="text-xs text-white/25">or</span>
                <div className="h-px flex-1 bg-white/[0.08]" />
              </div>

              <Link
                to="/admin/login"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] py-3 text-sm font-medium text-white/60 transition hover:border-white/20 hover:text-white"
              >
                <ShieldCheck size={16} />
                Admin login
              </Link>

              <p className="mt-7 text-center text-sm text-white/35">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-[#34E7A6] hover:text-[#5CFFC0]"
                >
                  Create account
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
