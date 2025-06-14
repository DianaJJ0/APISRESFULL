const mongoose = require('mongoose');
require('dotenv').config();

const URI = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@adso2873441.e4hnh5b.mongodb.net/${process.env.BASEDATOS}`;
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.connection.on('connected', () => {
    console.log('Conexión exitosa a la base de datos');
});
mongoose.connection.on('error', (err) => {
    console.error('Error de conexión a la base de datos:', err);
});

module.exports = mongoose;