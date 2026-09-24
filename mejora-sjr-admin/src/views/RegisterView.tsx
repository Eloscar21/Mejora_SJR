"use client";

import React from "react";
import { useRegisterViewModel } from "@/viewModels/useRegisterViewModel";

export function RegisterView() {
  // Inyección de dependencias (Cumple MVVM y SOLID)
  const vm = useRegisterViewModel();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-slate-900 p-8 shadow-2xl">
        <h1 className="mb-6 text-2xl font-semibold text-white">Alta de Ciudadano</h1>

        {vm.success ? (
          <div className="rounded-lg bg-green-500/20 p-4 text-green-400">
            ¡Usuario registrado con éxito!
          </div>
        ) : (
          <form onSubmit={vm.handleSubmit} className="space-y-4">
            {vm.error && (
              <div className="rounded-lg bg-red-500/20 p-3 text-sm text-red-400">
                {vm.error}
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">
                Nombre Completo *
              </label>
              <input
                type="text"
                value={vm.formData.NombreCompleto}
                onChange={(e) => vm.handleChange("NombreCompleto", e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white focus:border-blue-500 focus:outline-none"
                placeholder="Ej. Juan Pérez"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">
                Correo Electrónico *
              </label>
              <input
                type="email"
                value={vm.formData.Correo}
                onChange={(e) => vm.handleChange("Correo", e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white focus:border-blue-500 focus:outline-none"
                placeholder="juan@ejemplo.com"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">
                Contraseña *
              </label>
              <input
                type="password"
                value={vm.formData.PasswordHash}
                onChange={(e) => vm.handleChange("PasswordHash", e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white focus:border-blue-500 focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">
                Teléfono
              </label>
              <input
                type="tel"
                value={vm.formData.Telefono}
                onChange={(e) => vm.handleChange("Telefono", e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white focus:border-blue-500 focus:outline-none"
                placeholder="427..."
              />
            </div>

            <button
              type="submit"
              disabled={vm.isLoading}
              className="mt-6 w-full rounded-lg bg-blue-600 p-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {vm.isLoading ? "Registrando..." : "Registrar Ciudadano"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
