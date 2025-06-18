const mongoose =require('../config/database.js')
const schemaCliente = new mongoose.Schema({
    documento: {
        type: String,
        minlength: [7,"El documento debe tener al menos 7 caracteres"],
        maxlength: [10,"el documento debe tener como máximo 10 caracteres"],
        required: true,
        unique: true
    },
    nombreCompleto: {
        type: String,
        required: true,
        maxlength: 150
    },
    fechaNacimiento: {
        type: Date,
        required: true
    },
    correo: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'El correo debe ser válido, vuelva a intentarlo']
    },
}, {
    // Configuración de opciones del esquema
    timestamps: true, // Agrega campos de fecha de creación y actualización
    versionKey: false
});

const clientes = mongoose.model('clientes', schemaCliente);
module.exports = clientes;