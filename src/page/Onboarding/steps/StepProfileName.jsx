import React from "react";

const StepProfileName = ({ form, onChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">Identitas Profil</h2>
        <p className="mt-2 text-sm text-slate-400">
          Tambahkan nama yang akan tampil sebagai identitas kamu di NonnesX.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-300">Nama Depan</span>
          <input
            value={form.firstName}
            onChange={onChange("firstName")}
            placeholder="Nama Depan"
            className="mt-2 block w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-300">Nama Belakang</span>
          <input
            value={form.lastName}
            onChange={onChange("lastName")}
            placeholder="Nama Belakang"
            className="mt-2 block w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </label>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4 text-sm text-slate-400">
        <p className="font-semibold text-slate-200">Email terdaftar</p>
        <p className="mt-2 break-all text-slate-300">{form.email || "Belum tersedia"}</p>
      </div>
    </div>
  );
};

export default StepProfileName;
