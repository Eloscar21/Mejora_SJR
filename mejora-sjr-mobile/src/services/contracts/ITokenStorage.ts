/**
 * ITokenStorage — Contrato para la persistencia del token de autenticación.
 * 
 * Cumple con el Principio de Inversión de Dependencias (DIP):
 * El servicio de red depende de esta abstracción y no de una implementación
 * concreta como SecureStore o AsyncStorage.
 */
export interface ITokenStorage {
  /**
   * Obtiene el token JWT persistido.
   * @returns El token como string o null si no existe.
   */
  getToken(): Promise<string | null>;

  /**
   * Guarda o actualiza el token JWT en el almacenamiento persistente.
   * @param token Cadena con el token de sesión.
   */
  setToken(token: string): Promise<void>;

  /**
   * Elimina el token guardado (por ejemplo, al cerrar sesión).
   */
  removeToken(): Promise<void>;
}
