/**
 * IAuthService — Contrato (interfaz) del servicio de autenticación.
 *
 * El ViewModel SÓLO conoce esta interfaz; nunca importa axios ni fetch.
 * Cualquier implementación concreta (Axios, Fetch, Mock) puede ser
 * inyectada sin modificar el ViewModel ni la Vista.
 *
 * Payload: PascalCase requerido por el backend Mejora SJR.
 */

export interface LoginPayload {
  /** Correo electrónico del administrador */
  Correo: string;
  /** Contraseña ya hasheada (SHA-256 o lo que defina el backend) */
  PasswordHash: string;
}

export interface LoginResponse {
  /** JWT o token de sesión devuelto por el backend */
  token: string;
  /** Nombre visible del usuario autenticado */
  nombreUsuario?: string;
  /** Rol del usuario para control de acceso */
  rol?: string;
}

export interface IAuthService {
  /**
   * Envía las credenciales al endpoint POST /auth/login.
   * @throws {Error} con mensaje legible si las credenciales son inválidas
   *                 o si hay un error de red.
   */
  login(payload: LoginPayload): Promise<LoginResponse>;
}
