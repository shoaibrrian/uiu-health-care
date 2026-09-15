import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, HeartPulse, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [program, setProgram] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
          email,
          password,
          studentId,
          program,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Auto-login after successful registration
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/student");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080C0B] font-sans text-[#F4F6F5]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[550px] w-[550px] -translate-x-1/2 rounded-full bg-[#34E7A6]/[0.06] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-6">
        <Link
          to="/"
          className="flex w-fit items-center gap-2 text-sm text-white/45 transition-colors hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>

        <div className="flex justify-center py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg"
          >
            <div className="mb-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#34E7A6]/10 text-[#34E7A6] ring-1 ring-[#34E7A6]/20">
                <HeartPulse size={22} />
              </div>
              <h1 className="mt-6 font-['Manrope'] text-3xl font-extrabold tracking-tight">
                Create your account
              </h1>
              <p className="mt-2 text-sm text-white/40">
                Join UIU Health Care as a student
              </p>
            </div>

            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-7 backdrop-blur-xl sm:p-8">
              <form onSubmit={handleRegister} className="space-y-5">
                {error && (
                  <div className="rounded-xl border border-[#E5484D]/20 bg-[#E5484D]/10 px-4 py-3 text-sm text-[#FF7777]">
                    {error}
                  </div>
                )}

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/70">
                      First name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      placeholder="First name"
                      className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm outline-none transition placeholder:text-white/20 focus:border-[#34E7A6]/50"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/70">
                      Last name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      placeholder="Last name"
                      className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm outline-none transition placeholder:text-white/20 focus:border-[#34E7A6]/50"
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/70">
                      Student ID
                    </label>
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      required
                      placeholder="e.g. 0112 33024"
                      className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm outline-none transition placeholder:text-white/20 focus:border-[#34E7A6]/50"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/70">
                      Program code
                    </label>
                    <input
                      type="text"
                      value={program}
                      onChange={(e) => setProgram(e.target.value)}
                      required
                      placeholder="e.g. bsds, bscse"
                      className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm outline-none transition placeholder:text-white/20 focus:border-[#34E7A6]/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/70">
                    University Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="yourname233024@bsds.uiu.ac.bd"
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm outline-none transition placeholder:text-white/20 focus:border-[#34E7A6]/50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/70">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Create a strong password"
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm outline-none transition placeholder:text-white/20 focus:border-[#34E7A6]/50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/70">
                    Confirm password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm your password"
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm outline-none transition placeholder:text-white/20 focus:border-[#34E7A6]/50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#34E7A6] py-3.5 text-sm font-bold text-[#080C0B] transition hover:bg-[#5CFFC0] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create student account"
                  )}
                </button>
              </form>

              <p className="mt-7 text-center text-sm text-white/35">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-[#34E7A6] hover:text-[#5CFFC0]"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
