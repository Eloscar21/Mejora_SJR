import { Platform } from 'react-native';
import { ITokenStorage } from '../contracts/ITokenStorage';

const TOKEN_KEY = 'sjr_auth_token';

/**
 * Implementación de almacenamiento de token adaptable a la plataforma.
 * - En Web: utiliza localStorage de forma segura con fallback a memoria.
 * - En Android / iOS: almacena en memoria con fallback seguro.
 * 
 * Cumple con ITokenStorage para permitir Dependency Inversion (SOLID).
 */
export class TokenStorage implements ITokenStorage {
  private inMemoryToken: string | null = null;

  async getToken(): Promise<string | null> {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(TOKEN_KEY) ?? this.inMemoryToken;
      }
      return this.inMemoryToken;
    } catch {
      return this.inMemoryToken;
    }
  }

  async setToken(token: string): Promise<void> {
    try {
      this.inMemoryToken = token;
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(TOKEN_KEY, token);
      }
    } catch {
      this.inMemoryToken = token;
    }
  }

  async removeToken(): Promise<void> {
    try {
      this.inMemoryToken = null;
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(TOKEN_KEY);
      }
    } catch {
      this.inMemoryToken = null;
    }
  }
}

export const defaultTokenStorage = new TokenStorage();
