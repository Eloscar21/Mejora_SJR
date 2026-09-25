class UsuarioController {
    constructor(usuarioService) {
        this.usuarioService = usuarioService;
    }

    async registrarCiudadano(req, res) {
        try {
            // El controlador SOLO extrae el body y enruta (SRP)
            const datosUsuario = req.body;
            const resultado = await this.usuarioService.registrarCiudadano(datosUsuario);
            
            res.status(201).json({
                success: true,
                message: 'Ciudadano registrado con éxito',
                data: resultado
            });
        } catch (error) {
            // Manejo de errores básicos (400 si es validación, 500 si es servidor)
            const isClientError = error.message.includes('requeridos') || error.message.includes('registrado');
            res.status(isClientError ? 400 : 500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = UsuarioController;
