const { Router } = require('express');
const ReporteRepository = require('../repositories/ReporteRepository');
const ReporteService = require('../services/ReporteService');
const ReporteController = require('../controllers/ReporteController');
const { getPool } = require('../config/db');

const router = Router();

// ==========================================
// INYECCIÓN DE DEPENDENCIAS (Fábrica)
// ==========================================
let reporteControllerInstance = null;

async function inyectarDependencias(req, res, next) {
    if (!reporteControllerInstance) {
        try {
            // Obtener el Pool inyectable
            const dbPool = await getPool();

            // Inyectar Pool al Repositorio
            const reporteRepository = new ReporteRepository(dbPool);

            // Inyectar Repositorio al Servicio
            const reporteService = new ReporteService(reporteRepository);

            // Inyectar Servicio al Controlador
            reporteControllerInstance = new ReporteController(reporteService);
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Fallo al inicializar base de datos' });
        }
    }
    next();
}

// ==========================================
// RUTAS
// ==========================================
router.post('/reportes', inyectarDependencias, (req, res) => {
    reporteControllerInstance.crearReporte(req, res);
});

module.exports = router;
