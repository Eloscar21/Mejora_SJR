import { Platform } from 'react-native';
import { ReporteApiService } from '../services/api/ReporteApiService';
import { defaultTokenStorage } from '../services/storage/TokenStorage';
import { conUsuarioTemporal } from '../services/mocks/conUsuarioTemporal';

declare const process: { env: { EXPO_PUBLIC_API_URL?: string } };

// La composición es el único lugar que conoce la implementación concreta.
const baseUrl = process.env.EXPO_PUBLIC_API_URL ||
  (Platform.OS === 'android' ? 'http://10.0.2.2:3000/api' : 'http://localhost:3000/api');
// TODO HU-12: retirar conUsuarioTemporal cuando el backend valide el JWT.
export const reporteApiService = conUsuarioTemporal(new ReporteApiService(baseUrl, defaultTokenStorage));
