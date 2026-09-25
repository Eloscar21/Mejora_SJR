const bcrypt = require('bcrypt');

class UsuarioService {
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    async registrarCiudadano(datosUsuario) {
        const { NombreCompleto, Correo, Password, Telefono } = datosUsuario;

        // Validaciones básicas de negocio
        if (!NombreCompleto || !Correo || !Password) {
            throw new Error('Faltan datos requeridos (NombreCompleto, Correo, Password)');
        }

        // 1. Validar que el correo sea único en la BD
        const usuarioExistente = await this.usuarioRepository.findByCorreo(Correo);
        if (usuarioExistente) {
            throw new Error('El correo ya está registrado en el sistema');
        }

        // 2. Encriptar la contraseña
        const saltRounds = 10;
        const PasswordHash = await bcrypt.hash(Password, saltRounds);

        // 3. Preparar entidad (IdRol = 1 para Ciudadano)
        const nuevoUsuario = {
            NombreCompleto,
            Correo,
            PasswordHash,
            Telefono,
            IdRol: 1
        };

        // 4. Ejecutar creación
        const resultado = await this.usuarioRepository.createUsuario(nuevoUsuario);
        return resultado;
    }
}

module.exports = UsuarioService;
