/** Contrato exacto de creación definido por HU-12. */
export interface CrearReportePayload {
  Titulo: string;
  Descripcion: string;
  UbicacionLatitud: number;
  UbicacionLongitud: number;
  DireccionFisica: string;
  EvidenciaUrl: string;
  IdCategoria: number;
}

export interface CategoriaReporte {
  IdCategoria: number;
  Nombre: string;
}

/** TextInput conserva texto, incluso mientras se escribe un signo o decimal. */
export type ReporteFormulario = {
  [K in keyof CrearReportePayload]: K extends 'IdCategoria' ? number | null : string;
};

export type ErroresReporte = Partial<Record<keyof CrearReportePayload, string>>;
