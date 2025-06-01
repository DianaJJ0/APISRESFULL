const mongoose = require('./config/connection')

const esquemaUsuario = mongoose.Schema({
    nombre: String,
    edad: Number,
    correo: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
});

const Usuario = mongoose.model('Usuario', esquemaUsuario);

module.exports = Usuario;
