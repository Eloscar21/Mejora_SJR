import type { CrearReportePayload } from '../../models/Reporte';

/** ISP: este consumidor únicamente necesita crear reportes. */
export interface IReporteApiService {
  crearReporte(payload: CrearReportePayload): Promise<void>;
}
