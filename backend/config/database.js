const mongoose = require('mongoose');
require('dotenv').config();

const URI =`mongobd+srv://${process.env.USER_BD}:${process.env.PASS_BD}@adso2873441.e4hnh5b.mongodb.net/)${process.env.BASEDATOS}`

mongoose.connect(URI);

module.exports = mongoose;