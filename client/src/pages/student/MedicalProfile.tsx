import { useEffect, useState, FormEvent } from "react";
import { HeartPulse, Loader2, CheckCircle2 } from "lucide-react";
import StudentLayout from "../../layouts/StudentLayout";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const inputClass =
  "w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#34E7A6]/40";

const toList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export default function MedicalProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [bloodGroup, setBloodGroup] = useState("");
  const [allergies, setAllergies] = useState("");
  const [conditions, setConditions] = useState("");
  const [medications, setMedications] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactRelation, setContactRelation] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5000/api/students/medical-profile",
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const data = await response.json();

        if (data.success && data.medicalProfile) {
          const p = data.medicalProfile;
          setBloodGroup(p.bloodGroup || "");
          setAllergies((p.allergies || []).join(", "));
          setConditions((p.medicalConditions || []).join(", "));
          setMedications((p.currentMedications || []).join(", "));
          setContactName(p.emergencyContact?.name || "");
          setContactRelation(p.emergencyContact?.relationship || "");
          setContactPhone(p.emergencyContact?.phone || "");
          setNotes(p.additionalNotes || "");
        }
      } catch (err) {
        console.error("Failed to load medical profile:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/students/medical-profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bloodGroup,
            allergies: toList(allergies),
            medicalConditions: toList(conditions),
            currentMedications: toList(medications),
            emergencyContact: {
              name: contactName,
              relationship: contactRelation,
              phone: contactPhone,
            },
            additionalNotes: notes,
          }),
        },
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save");
      }
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <StudentLayout pageTitle="Medical Profile">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#34E7A6]/10 text-[#34E7A6] ring-1 ring-[#34E7A6]/20">
          <HeartPulse size={20} />
        </div>
        <div>
          <h1 className="font-['Manrope'] text-2xl font-extrabold tracking-tight">
            Medical Profile
          </h1>
          <p className="text-sm text-white/40">
            Shared with the response team only when you send an SOS
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#34E7A6] border-t-transparent" />
        </div>
      ) : (
        <form
          onSubmit={handleSave}
          className="space-y-5 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6"
        >
          {error && (
            <div className="rounded-xl border border-[#E5484D]/20 bg-[#E5484D]/10 px-4 py-3 text-sm text-[#FF7777]">
              {error}
            </div>
          )}

          <div>
            <label className="mb-2 block text-xs font-medium text-white/60">
              Blood group
            </label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className={inputClass}
            >
              <option value="" className="bg-[#0C1210]">
                Not set
              </option>
              {bloodGroups.map((g) => (
                <option key={g} value={g} className="bg-[#0C1210]">
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-white/60">
              Allergies <span className="text-white/25">(comma separated)</span>
            </label>
            <input
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="e.g. Penicillin, Peanuts"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-white/60">
              Medical conditions{" "}
              <span className="text-white/25">(comma separated)</span>
            </label>
            <input
              value={conditions}
              onChange={(e) => setConditions(e.target.value)}
              placeholder="e.g. Asthma, Diabetes"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-white/60">
              Current medications{" "}
              <span className="text-white/25">(comma separated)</span>
            </label>
            <input
              value={medications}
              onChange={(e) => setMedications(e.target.value)}
              placeholder="e.g. Inhaler, Metformin"
              className={inputClass}
            />
          </div>

          <div className="border-t border-white/[0.06] pt-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#34E7A6]">
              Emergency contact
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <input
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Name"
                className={inputClass}
              />
              <input
                value={contactRelation}
                onChange={(e) => setContactRelation(e.target.value)}
                placeholder="Relationship"
                className={inputClass}
              />
              <input
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="Phone"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-white/60">
              Additional notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              maxLength={1000}
              placeholder="Anything else the responders should know..."
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-[#34E7A6] px-6 py-3 text-sm font-bold text-[#080C0B] transition hover:bg-[#5CFFC0] disabled:opacity-60"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              {saving ? "Saving..." : "Save profile"}
            </button>
            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-[#34E7A6]">
                <CheckCircle2 size={16} /> Saved
              </span>
            )}
          </div>
        </form>
      )}
    </StudentLayout>
  );
}
