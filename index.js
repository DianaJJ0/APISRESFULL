require('dotenv').config();

const exp = require('express');
const app = exp();

const logger = require('morgan');
app.use(logger('dev'));

app.use(exp.urlencoded({ extended: false }));
app.use(exp.json());

const modeloCliente = require('./backend/models/cliente.model');

app.get('./cliente', async (req,res)=>{
    let listaClientes= await modeloCliente.find();
    console.log(listaClientes)
    res.jsn(listaClientes)
});

app.post('/cliente', async (req,res))
const nuevoCliente = new modeloCliente({
    nombre: 'Juan',
    edad: 33,
    correo: 'juanito.perez@ejemplo.com'
});

nuevoCliente.save()
    .then(usuario => {
        console.log('Usuario creado:', usuario);
    })
    .catch(err => {
        console.error('Error al crear usuario:', err);
    });

app.listen(process.env.PORT, () => {
    console.log('Server is running: 9091');
} );