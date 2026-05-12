import React from "react";

const StepFollowCount = ({ form, onChangeNumber }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">Statistik Awal</h2>
        <p className="mt-2 text-sm text-slate-400">
          Tentukan angka awal followers dan following untuk profil kamu.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-300">Followers Awal</span>
          <input
            type="number"
            value={form.followers_count}
            onChange={onChangeNumber("followers_count")}
            min={0}
            className="mt-2 block w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-300">Following Awal</span>
          <input
            type="number"
            value={form.following_count}
            onChange={onChangeNumber("following_count")}
            min={0}
            className="mt-2 block w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </label>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 shadow-inner shadow-slate-900/20">
        <p className="text-sm font-semibold text-slate-100">Ringkasan Profil</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-3xl bg-slate-900/90 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Followers</p>
            <p className="mt-3 text-3xl font-bold text-white">{form.followers_count}</p>
          </div>
          <div className="rounded-3xl bg-slate-900/90 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Following</p>
            <p className="mt-3 text-3xl font-bold text-white">{form.following_count}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepFollowCount;
