import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { databases, DATABASE_ID, COLLECTION_ID_USERS } from "../../data/appwriteconfig";
import { Query } from "appwrite";
import StepProfileName from "./steps/StepProfileName";
import StepProfileMedia from "./steps/StepProfileMedia";
import StepPublicMetadata from "./steps/StepPublicMetadata";
import StepFollowCount from "./steps/StepFollowCount";

const stepLabels = [
  { title: "Profil Lengkap", subtitle: "Nama lengkap" },
  { title: "Media Profil", subtitle: "Foto & header" },
  { title: "Bio Publik", subtitle: "Metadata & sosial media" },
  { title: "Statistik", subtitle: "Followers & following" },
];

const Onboarding = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    email: "",
    userId: "",
    firstName: "",
    lastName: "",
    user_image_url: "",
    header_url: "",
    publicMetadata: {
      bio: "",
      website: "",
    },
    followers_count: 0,
    following_count: 0,
    socialLinks: {},
  });

  useEffect(() => {
    if (!isLoaded || !user) return;

    if (user.publicMetadata?.onboardingComplete) {
      navigate("/", { replace: true });
      return;
    }

    setForm((prev) => ({
      ...prev,
      email: user.emailAddresses?.[0]?.emailAddress || prev.email,
      userId: user.id || prev.userId,
      firstName: user.firstName || prev.firstName,
      lastName: user.lastName || prev.lastName,
      user_image_url: user.profileImageUrl || prev.user_image_url,
      publicMetadata: {
        ...prev.publicMetadata,
        ...(typeof user.publicMetadata === "object" ? user.publicMetadata : {}),
      },
    }));
  }, [isLoaded, user, navigate]);

  const handleInputChange = (key) => (e) => {
    setForm((current) => ({ ...current, [key]: e.target.value }));
  };

  const handleImageChange = (key) => (value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleMetadataChange = (key) => (e) => {
    setForm((current) => ({
      ...current,
      publicMetadata: {
        ...current.publicMetadata,
        [key]: e.target.value,
      },
    }));
  };

  const handleNumberChange = (key) => (e) => {
    const value = Number(e.target.value);
    setForm((current) => ({
      ...current,
      [key]: Number.isNaN(value) ? 0 : value,
    }));
  };

  const handleNext = () => setStep((current) => Math.min(stepLabels.length, current + 1));
  const handleBack = () => setStep((current) => Math.max(1, current - 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("Data pengguna belum siap. Coba lagi.");
      return;
    }

    setIsSaving(true);
    setError("");

    const metadataPayload = {
      ...form.publicMetadata,
      header_url: form.header_url,
      followers_count: form.followers_count,
      following_count: form.following_count,
      socialLinks: form.socialLinks,
      onboardingComplete: true,
    };

    const payload = {
      email: form.email,
      firstName: form.firstName,
      lastName: form.lastName,
      user_image_url: form.user_image_url,
      header_url: form.header_url,
      publicMetadata: metadataPayload,
      followers_count: form.followers_count,
      following_count: form.following_count,
      socialLinks: form.socialLinks,
      onboardingComplete: true,
    };

    try {
      if (user.update) {
        const updatePayload = {
          firstName: form.firstName,
          lastName: form.lastName,
          publicMetadata: metadataPayload,
        };

        if (typeof form.user_image_url === "string" && form.user_image_url.startsWith("http")) {
          updatePayload.profileImageUrl = form.user_image_url;
        }

        await user.update(updatePayload);
      }

      const existing = await databases.listDocuments(DATABASE_ID, COLLECTION_ID_USERS, [
        Query.equal("userId", user.id),
      ]);

      if (existing.total > 0) {
        await databases.updateDocument(
          DATABASE_ID,
          COLLECTION_ID_USERS,
          existing.documents[0].$id,
          {
            ...payload,
            userId: user.id,
          },
        );
      } else {
        await databases.createDocument(
          DATABASE_ID,
          COLLECTION_ID_USERS,
          "unique()",
          {
            ...payload,
            userId: user.id,
          },
        );
      }

      navigate("/");
    } catch (err) {
      console.error("Onboarding save error:", err);
      setError("Gagal menyimpan data onboarding. Silakan coba lagi.");
    } finally {
      setIsSaving(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <StepProfileName form={form} onChange={handleInputChange} />;
      case 2:
        return (
          <StepProfileMedia
            form={form}
            onChange={handleInputChange}
            onImageChange={handleImageChange}
          />
        );
      case 3:
        return <StepPublicMetadata form={form} onChange={handleMetadataChange} />;
      case 4:
        return <StepFollowCount form={form} onChangeNumber={handleNumberChange} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950/95 py-10 text-slate-100">
      <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-4xl border border-white/10 bg-slate-900/90 shadow-[0_35px_120px_rgba(15,23,42,0.5)] backdrop-blur-xl p-6 sm:p-8">
        <div className="mb-8 space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Onboarding Akun</p>
              <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Lengkapi profil NonnesX-mu</h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
                Ikuti langkah-langkah berikut untuk menyiapkan akun kamu dengan cepat dan rapi.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-full border border-slate-800 bg-slate-950/80 px-4 py-2 text-sm text-slate-300">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-400" />
              Step {step} of {stepLabels.length}
            </div>
          </div>

          <div className="rounded-full bg-slate-800 py-2">
            <div
              className="h-2 rounded-full bg-linear-to-r from-blue-500 to-cyan-400 transition-all duration-500"
              style={{ width: `${(step / stepLabels.length) * 100}%` }}
            />
          </div>

          <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
            {stepLabels.map((item, index) => (
              <div
                key={item.title}
                className={`rounded-3xl border p-4 text-center text-sm transition ${
                  step === index + 1
                    ? "border-blue-500 bg-blue-500/10 text-white shadow-[0_15px_35px_rgba(59,130,246,0.18)]"
                    : "border-slate-800 bg-slate-950/80 text-slate-400"
                }`}
              >
                <p className="font-semibold">Langkah {index + 1}</p>
                <p className="mt-2 leading-tight text-xs sm:text-sm">{item.subtitle}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-4xl border border-slate-800 bg-slate-950/80 p-6 shadow-inner shadow-slate-950/20">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Step {step}</p>
            <h2 className="mt-2 text-2xl font-bold text-white">{stepLabels[step - 1].title}</h2>
            <p className="mt-2 text-sm text-slate-400">{stepLabels[step - 1].subtitle}</p>
          </div>

          <form onSubmit={step === 4 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
            <div className="space-y-6">
              {renderStep()}
            </div>

            {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleBack}
                disabled={step === 1}
                className="rounded-3xl border border-slate-800 bg-slate-900/90 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-blue-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Kembali
              </button>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {step < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="rounded-3xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
                  >
                    Selanjutnya
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-3xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSaving ? "Menyimpan..." : "Simpan dan Lanjutkan"}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
