/**
 * page.tsx — Ruta raíz `/`
 *
 * Esta página es el punto de entrada del panel administrativo.
 * Delega toda la presentación a LoginView (patrón MVVM).
 * La lógica de autenticación vive en useLoginViewModel.
 */

import LoginView from "@/views/LoginView";

export default function HomePage() {
  return <LoginView />;
}
