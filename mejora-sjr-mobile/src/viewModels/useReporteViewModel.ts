import { useEffect, useRef, useState } from 'react';
import type { CategoriaReporte, CrearReportePayload, ErroresReporte, ReporteFormulario } from '../models/Reporte';
import type { IReporteApiService } from '../services/contracts/IReporteApiService';

const nuevoFormulario = (): ReporteFormulario => ({
  Titulo: '', Descripcion: '', UbicacionLatitud: '', UbicacionLongitud: '',
  DireccionFisica: '', EvidenciaUrl: '', IdCategoria: null,
});

/** Validación y transformación pertenecen al ViewModel, nunca a la Vista. */
export function validarReporte(formulario: ReporteFormulario, categorias: readonly CategoriaReporte[]): {
  errores: ErroresReporte;
  payload: CrearReportePayload | null;
} {
  const errores: ErroresReporte = {};
  if (!formulario.Titulo.trim()) errores.Titulo = 'Escribe un título.';
  if (!formulario.Descripcion.trim()) errores.Descripcion = 'Describe la incidencia.';
  const coordenada = (campo: 'UbicacionLatitud' | 'UbicacionLongitud', limite: number) => {
    const texto = formulario[campo].trim().replace(',', '.');
    const valor = Number(texto);
    if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(texto) || !Number.isFinite(valor) || Math.abs(valor) > limite) {
      errores[campo] = `Ingresa un número entre -${limite} y ${limite}.`;
    }
    return valor;
  };
  const UbicacionLatitud = coordenada('UbicacionLatitud', 90);
  const UbicacionLongitud = coordenada('UbicacionLongitud', 180);
  if (!Number.isInteger(formulario.IdCategoria) || (formulario.IdCategoria ?? 0) <= 0 ||
      !categorias.some(categoria => categoria.IdCategoria === formulario.IdCategoria)) {
    errores.IdCategoria = 'Selecciona una categoría disponible.';
  }
  const EvidenciaUrl = formulario.EvidenciaUrl.trim();
  if (EvidenciaUrl) {
    try {
      const url = new URL(EvidenciaUrl);
      if (!['http:', 'https:'].includes(url.protocol) || !url.hostname) throw new Error();
    } catch {
      errores.EvidenciaUrl = 'Usa una URL válida que comience con http:// o https://.';
    }
  }
  if (Object.keys(errores).length) return { errores, payload: null };
  return {
    errores,
    payload: {
      Titulo: formulario.Titulo.trim(), Descripcion: formulario.Descripcion.trim(),
      UbicacionLatitud, UbicacionLongitud,
      DireccionFisica: formulario.DireccionFisica.trim(), EvidenciaUrl,
      IdCategoria: formulario.IdCategoria!,
    },
  };
}

/** DIP: servicio obligatorio inyectado; no conoce fetch, Axios ni clases HTTP. */
export function useReporteViewModel(apiService: IReporteApiService, categorias: readonly CategoriaReporte[]) {
  const [formulario, setFormulario] = useState(nuevoFormulario);
  const [errores, setErrores] = useState<ErroresReporte>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const enviando = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  function cambiarCampo<K extends keyof ReporteFormulario>(campo: K, valor: ReporteFormulario[K]) {
    if (enviando.current) return;
    setFormulario(actual => ({ ...actual, [campo]: valor }));
    setErrores(actual => ({ ...actual, [campo]: undefined }));
    setError(null);
    setIsSuccess(false);
  }

  async function enviarReporte(): Promise<void> {
    if (enviando.current || isSuccess) return;
    const resultado = validarReporte(formulario, categorias);
    setErrores(resultado.errores);
    setError(null);
    if (!resultado.payload) return;
    enviando.current = true;
    setIsLoading(true);
    try {
      await apiService.crearReporte(resultado.payload);
      if (mounted.current) setIsSuccess(true);
    } catch (cause) {
      if (mounted.current) setError(cause instanceof Error ? cause.message : 'No se pudo enviar el reporte. Intenta de nuevo.');
    } finally {
      enviando.current = false;
      if (mounted.current) setIsLoading(false);
    }
  }

  function reiniciarFormulario() {
    if (enviando.current) return;
    setFormulario(nuevoFormulario());
    setErrores({});
    setError(null);
    setIsSuccess(false);
  }

  return { formulario, categorias, errores, isLoading, error, isSuccess, cambiarCampo, enviarReporte, reiniciarFormulario };
}
