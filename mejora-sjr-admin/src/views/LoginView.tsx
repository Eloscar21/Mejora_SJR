"use client";

/**
 * LoginView — Vista tonta (Dumb View) del patrón MVVM.
 *
 * REGLAS ARQUITECTÓNICAS:
 * ✅ PROHIBIDO importar axios, fetch o cualquier lógica HTTP aquí.
 * ✅ PROHIBIDO gestionar estado propio más allá de lo que expone el ViewModel.
 * ✅ Sólo renderiza JSX y delega toda la lógica a useLoginViewModel.
 * ✅ Se redirige al dashboard cuando isSuccess === true.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLoginViewModel } from "@/viewModels/useLoginViewModel";

// ── Íconos inline (SVG) para no añadir dependencias extra ────────────────────

const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
    aria-hidden="true"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
    aria-hidden="true"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const SpinnerIcon = () => (
  <svg
    className="animate-spin w-5 h-5"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);

// ── Vista ─────────────────────────────────────────────────────────────────────

export default function LoginView() {
  const router = useRouter();

  // Toda la lógica vive en el ViewModel; aquí sólo desestructuramos
  const {
    formState,
    isLoading,
    errorMessage,
    isSuccess,
    handleChange,
    handleSubmit,
    clearError,
  } = useLoginViewModel();

  // Redirigir al dashboard cuando el login sea exitoso
  useEffect(() => {
    if (isSuccess) {
      router.push("/dashboard");
    }
  }, [isSuccess, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] px-4 py-12">
      {/* Fondo decorativo con gradiente radial */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-indigo-700/20 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-cyan-600/15 blur-[100px]" />
      </div>

      {/* Card principal */}
      <div className="relative w-full max-w-md">
        {/* Logo / Cabecera */}
        <header className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 shadow-lg shadow-indigo-500/30 mb-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8"
              aria-hidden="true"
            >
              <path d="M3 9.5 12 4l9 5.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5Z" />
              <path d="M9 21V12h6v9" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Mejora SJR
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Panel Administrativo — Acceso seguro
          </p>
        </header>

        {/* Formulario */}
        <div className="backdrop-blur-xl bg-white/[0.04] border border-white/10 rounded-2xl shadow-2xl p-8">
          <form
            id="login-form"
            onSubmit={handleSubmit}
            noValidate
            aria-label="Formulario de inicio de sesión"
          >
            {/* ── Alerta de error ── */}
            {errorMessage && (
              <div
                role="alert"
                id="login-error-alert"
                className="flex items-start gap-3 mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 mt-0.5 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span className="flex-1">{errorMessage}</span>
                <button
                  type="button"
                  onClick={clearError}
                  aria-label="Cerrar alerta"
                  id="login-close-error-btn"
                  className="text-red-400 hover:text-red-200 transition-colors"
                >
                  ✕
                </button>
              </div>
            )}

            {/* ── Campo: Correo ── */}
            <div className="mb-5">
              <label
                htmlFor="login-correo"
                className="block mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400"
              >
                Correo electrónico
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-500 pointer-events-none">
                  <MailIcon />
                </span>
                <input
                  id="login-correo"
                  name="correo"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="admin@mejorasjr.mx"
                  value={formState.correo}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="
                    w-full rounded-xl pl-11 pr-4 py-3
                    bg-white/[0.06] border border-white/10
                    text-white placeholder-slate-600 text-sm
                    outline-none ring-0
                    transition-all duration-200
                    hover:border-white/20
                    focus:border-indigo-500 focus:bg-white/[0.09] focus:ring-2 focus:ring-indigo-500/30
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                  aria-required="true"
                />
              </div>
            </div>

            {/* ── Campo: Contraseña ── */}
            <div className="mb-6">
              <label
                htmlFor="login-password"
                className="block mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400"
              >
                Contraseña
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-500 pointer-events-none">
                  <LockIcon />
                </span>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={formState.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="
                    w-full rounded-xl pl-11 pr-4 py-3
                    bg-white/[0.06] border border-white/10
                    text-white placeholder-slate-600 text-sm
                    outline-none ring-0
                    transition-all duration-200
                    hover:border-white/20
                    focus:border-indigo-500 focus:bg-white/[0.09] focus:ring-2 focus:ring-indigo-500/30
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                  aria-required="true"
                />
              </div>
            </div>

            {/* ── Botón principal ── */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="
                w-full flex items-center justify-center gap-2.5
                py-3 px-6 rounded-xl
                font-semibold text-sm tracking-wide text-white
                bg-gradient-to-r from-indigo-600 to-cyan-500
                shadow-lg shadow-indigo-600/30
                transition-all duration-200
                hover:from-indigo-500 hover:to-cyan-400 hover:shadow-indigo-500/40 hover:scale-[1.02]
                active:scale-[0.98]
                disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500
              "
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <SpinnerIcon />
                  Verificando credenciales…
                </>
              ) : (
                "Iniciar sesión"
              )}
            </button>
          </form>

          {/* Pie del card */}
          <p className="mt-6 text-center text-xs text-slate-600">
            ¿Olvidaste tu contraseña?{" "}
            <a
              href="/recuperar-acceso"
              id="login-forgot-password-link"
              className="text-indigo-400 hover:text-indigo-300 transition-colors underline-offset-2 hover:underline"
            >
              Solicitar restablecimiento
            </a>
          </p>
        </div>

        {/* Footer */}
        <footer className="mt-6 text-center text-xs text-slate-700">
          © {new Date().getFullYear()} Municipio de San Juan del Río, Querétaro.
          Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
}
