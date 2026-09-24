const { Router } = require('express');
const UsuarioRepository = require('../repositories/UsuarioRepository');
const UsuarioService = require('../services/UsuarioService');
const UsuarioController = require('../controllers/UsuarioController');
const { getPool } = require('../config/db');

const router = Router();

// ==========================================
// INYECCIÓN DE DEPENDENCIAS (Fábrica)
// ==========================================
let usuarioControllerInstance = null;

async function inyectarDependencias(req, res, next) {
    if (!usuarioControllerInstance) {
        try {
            // Obtener el Pool inyectable
            const dbPool = await getPool();
            
            // Inyectar Pool al Repositorio
            const usuarioRepository = new UsuarioRepository(dbPool);
            
            // Inyectar Repositorio al Servicio
            const usuarioService = new UsuarioService(usuarioRepository);
            
            // Inyectar Servicio al Controlador
            usuarioControllerInstance = new UsuarioController(usuarioService);
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Fallo al inicializar base de datos' });
        }
    }
    next();
}

// ==========================================
// RUTAS
// ==========================================
router.post('/usuarios', inyectarDependencias, (req, res) => {
    // Delegamos al controlador ya inyectado
    usuarioControllerInstance.registrarCiudadano(req, res);
});

module.exports = router;
