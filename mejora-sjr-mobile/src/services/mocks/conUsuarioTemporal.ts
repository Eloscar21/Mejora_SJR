import type { IReporteApiService } from '../contracts/IReporteApiService';

/**
 * Acuerdo temporal HU-12: atribuye los reportes al usuario de prueba 1.
 * TODO: retirar este adaptador de reporteDependencies cuando el backend
 * resuelva IdUsuario desde el JWT verificado. No representa al usuario logueado.
 */
export function conUsuarioTemporal(apiService: IReporteApiService): IReporteApiService {
  return {
    crearReporte(payload) {
      const payloadTemporal = { ...payload, IdUsuario: 1 };
      return apiService.crearReporte(payloadTemporal);
    },
  };
}
