class ReporteService {
    constructor(reporteRepository) {
        this.reporteRepository = reporteRepository;
    }

    async crearReporte(datosReporte) {
        const {
            Titulo,
            Descripcion,
            UbicacionLatitud,
            UbicacionLongitud,
            DireccionFisica,
            EvidenciaUrl,
            IdUsuario,
            IdCategoria
        } = datosReporte;

        // 1. Validar que las llaves foráneas realmente existan antes de insertar
        const usuarioValido = await this.reporteRepository.existeUsuario(IdUsuario);
        if (!usuarioValido) {
            throw new Error('El IdUsuario proporcionado no existe (llave foránea inválida)');
        }

        const categoriaValida = await this.reporteRepository.existeCategoria(IdCategoria);
        if (!categoriaValida) {
            throw new Error('El IdCategoria proporcionado no existe (llave foránea inválida)');
        }

        // 2. Preparar entidad: IdEstado siempre 1 ('Recibido') al crear un reporte nuevo
        const nuevoReporte = {
            Titulo,
            Descripcion,
            UbicacionLatitud,
            UbicacionLongitud,
            DireccionFisica: DireccionFisica || null,
            EvidenciaUrl: EvidenciaUrl || null,
            IdUsuario,
            IdCategoria,
            IdEstado: 1
        };

        // 3. Ejecutar creación
        const resultado = await this.reporteRepository.createReporte(nuevoReporte);

        return { ...nuevoReporte, ...resultado };
    }
}

module.exports = ReporteService;
