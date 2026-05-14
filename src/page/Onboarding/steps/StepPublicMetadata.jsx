import React, { useState } from "react";

const StepPublicMetadata = ({ form, onChange }) => {
  const [socialLinks, setSocialLinks] = useState(form.socialLinks || {});

  const socialMediaPlatforms = [
    { key: "twitter", label: "Twitter/X", placeholder: "https://twitter.com/username", icon: "🐦" },
    { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/username", icon: "📘" },
    { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/username", icon: "📷" },
    { key: "whatsapp", label: "WhatsApp", placeholder: "https://wa.me/1234567890", icon: "💬" },
    { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/username", icon: "💼" },
    { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@username", icon: "📺" },
    { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@username", icon: "🎵" },
    { key: "discord", label: "Discord", placeholder: "https://discord.gg/invite", icon: "🎮" },
  ];

  const handleLinkChange = (platform, value) => {
    const updatedLinks = { ...socialLinks, [platform]: value };
    setSocialLinks(updatedLinks);
    onChange("socialLinks")(updatedLinks);
  };
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">Metadata Publik</h2>
        <p className="mt-2 text-sm text-slate-400">
          Tambahkan bio singkat dan tautan publik yang orang lain
          bi;'l,';g,b;'rsdlgfsa lihat.
        </p>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-slate-300">Bio Singkat</span>
        <textarea
          value={form.publicMetadata.bio}
          onChange={onChange("bio")}
          rows={4}
          placeholder="Contoh: Penulis konten, pecinta berita teknologi..."
          className="mt-2 block w-full rounded-3xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-slate-300">
          Website / Kontak
        </span>
        <input
          value={form.publicMetadata.website}
          onChange={onChange("website")}
          placeholder="https://..."
          className="mt-2 block w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </label>

      <div>
        <span className="text-sm font-medium text-slate-300">
          Link Sosial Media
        </span>
        <p className="mt-1 text-xs text-slate-400">
          Tambahkan link sosial media kamu untuk memudahkan orang lain
          menghubungi atau mengikuti kamu.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {socialMediaPlatforms.map((platform) => (
            <div key={platform.key} className="space-y-1">
              <label className="block text-xs font-medium text-slate-400">
                {platform.icon} {platform.label}
              </label>
              <input
                type="url"
                placeholder={platform.placeholder}
                value={socialLinks[platform.key] || ""}
                onChange={(e) => handleLinkChange(platform.key, e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4 text-slate-300">
        <p className="text-sm font-semibold text-slate-100">
          Preview hal. publik
        </p>
        <div className="mt-3 space-y-2 text-sm leading-relaxed">
          <p>{form.publicMetadata.bio || "Bio belum diisi"}</p>
          <p className="text-blue-300 underline decoration-slate-500/40">
            {form.publicMetadata.website || "Website belum diisi"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StepPublicMetadata;
