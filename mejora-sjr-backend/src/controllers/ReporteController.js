const CAMPOS_REQUERIDOS = [
    'Titulo',
    'Descripcion',
    'UbicacionLatitud',
    'UbicacionLongitud',
    'IdUsuario',
    'IdCategoria'
];

class ReporteController {
    constructor(reporteService) {
        this.reporteService = reporteService;
    }

    async crearReporte(req, res) {
        try {
            // El controlador SOLO valida la forma del payload y enruta (SRP)
            const payload = req.body;

            const camposFaltantes = CAMPOS_REQUERIDOS.filter(
                (campo) => payload[campo] === undefined || payload[campo] === null || payload[campo] === ''
            );

            if (camposFaltantes.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Faltan campos requeridos: ${camposFaltantes.join(', ')}`
                });
            }

            if (typeof payload.UbicacionLatitud !== 'number' || typeof payload.UbicacionLongitud !== 'number') {
                return res.status(400).json({
                    success: false,
                    message: 'UbicacionLatitud y UbicacionLongitud deben ser valores numéricos'
                });
            }

            if (!Number.isInteger(payload.IdUsuario) || !Number.isInteger(payload.IdCategoria)) {
                return res.status(400).json({
                    success: false,
                    message: 'IdUsuario e IdCategoria deben ser números enteros'
                });
            }

            const resultado = await this.reporteService.crearReporte(payload);

            return res.status(201).json({
                success: true,
                message: 'Reporte creado con éxito',
                data: resultado
            });
        } catch (error) {
            const isClientError = error.message.includes('no existe') || error.message.includes('requeridos');
            return res.status(isClientError ? 400 : 500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = ReporteController;
