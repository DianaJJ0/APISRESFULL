const mongoose =require('./config/database.js')
const SchemaCliente = new mongoose.Schema({

documento:{
        type: String,
        required:[true, "El documento es obligatorio"],
        minLength: 7 ["El documento no tiene el tamaño minimo"],
        maxLength: 10 ["El documento es demasiado largo"],
    },
    nombreCompleto:{
        type:String,
        minLength: 3,
        maxLength:150
    },
    fechaNacimiento:{
        type:Date,
        max: Date.new
 }
 
});
const cliente =mongoose.model("clientes", SchemaCliente);
modelNames.exports=cliente;