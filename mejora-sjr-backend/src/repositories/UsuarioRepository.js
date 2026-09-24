const sql = require('mssql');

class UsuarioRepository {
    constructor(dbPool) {
        this.dbPool = dbPool;
    }

    async findByCorreo(correo) {
        const result = await this.dbPool.request()
            .input('Correo', sql.VarChar, correo)
            .query('SELECT * FROM Usuarios WHERE Correo = @Correo');
        return result.recordset[0];
    }

    async createUsuario(usuario) {
        const result = await this.dbPool.request()
            .input('NombreCompleto', sql.VarChar, usuario.NombreCompleto)
            .input('Correo', sql.VarChar, usuario.Correo)
            .input('PasswordHash', sql.VarChar, usuario.PasswordHash)
            .input('Telefono', sql.VarChar, usuario.Telefono || null)
            .input('IdRol', sql.Int, usuario.IdRol) // Debe ser 1 por defecto (Ciudadano)
            .query(`
                INSERT INTO Usuarios (NombreCompleto, Correo, PasswordHash, Telefono, IdRol, FechaRegistro, Activo)
                OUTPUT INSERTED.IdUsuario, INSERTED.FechaRegistro, INSERTED.Activo
                VALUES (@NombreCompleto, @Correo, @PasswordHash, @Telefono, @IdRol, GETDATE(), 1)
            `);
        return result.recordset[0];
    }
}

module.exports = UsuarioRepository;
