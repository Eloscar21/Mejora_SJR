import type { CrearReportePayload } from '../../models/Reporte';
import type { IReporteApiService } from '../contracts/IReporteApiService';
import type { ITokenStorage } from '../contracts/ITokenStorage';

export class ReporteApiService implements IReporteApiService {
  constructor(
    private readonly baseUrl: string,
    private readonly tokenStorage: Pick<ITokenStorage, 'getToken'>,
  ) {}

  async crearReporte(payload: CrearReportePayload): Promise<void> {
    const token = await this.tokenStorage.getToken();
    let response: Response;
    try {
      response = await fetch(`${this.baseUrl.replace(/\/$/, '')}/reportes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
    } catch {
      throw new Error('No se pudo conectar con el servidor. Revisa tu conexión.');
    }
    const result: unknown = await response.json().catch(() => null);
    const body = result !== null && typeof result === 'object' ? result : {};
    if (!response.ok || !('success' in body) || body.success !== true) {
      const message = 'message' in body && typeof body.message === 'string'
        ? body.message
        : 'No se pudo confirmar la creación del reporte.';
      throw new Error(message);
    }
  }
}
