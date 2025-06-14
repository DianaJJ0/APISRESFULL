require('dotenv').config();

const express = require('express');
const morgan = require('morgan');

const app = express();

//Middlewares 
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Modelos. Conexión a la base de datos
const modeloCliente = require('./backend/models/cliente.model');
const modeloProducto = require('./backend/models/producto.model');

// Rutas
app.get('/clientes', async (req, res) => {
    // Validación de campos requeridos
    const listaClientes = await modeloCliente.find();
    res.json(listaClientes);
});

app.post('/clientes', async (req, res) => {
    // Validación de campos requeridos
    const nuevoCliente = new modeloCliente({
        documento : req.body.documento,
        nombreCompleto : req.body.nombre,
        fechaNacimiento : req.body.fecha,
    });

    try {
        const clienteGuardado = await nuevoCliente.save();
        // Verificar si el cliente fue guardado exitosamente
        res.status(201).json({ "mensaje": "Cliente creado exitosamente", cliente: clienteGuardado });
    } catch (err) {
        console.error("Error al guardar el cliente:", err);
        res.status(400).json({ "mensaje": "Error al crear el cliente" });
    }
});

app.get('/productos/:ref', async (req, res) => {
    let productoEncontrado = await modeloProducto.findOne({ referencia: req.params.ref });
    if (productoEncontrado) {
        res.status(200).json(productoEncontrado);
    } else {
        res.status(404).json({ "error": 'No se encontró el producto' });
    }
});

app.post('/productos', async (req, res) => {
    // Validación de campos requeridos
    const nuevoProducto = {
        referencia: req.body.referenciaProducto,
        nombre: req.body.nombreProducto,
        descripcion: req.body.descripcionProducto,
        precio: req.body.precioProducto,
        stock: req.body.stockProducto,
        imagen: req.body.imagenProducto,
        habilitado: true,
    };
    
    let Insercion = await modeloProducto.create(nuevoProducto);
    // Verificar si la inserción fue exitosa
    if (Insercion) {
        res.status(201).json({ "mensaje": "Producto creado exitosamente", producto: Insercion });
    } else {
        res.status(400).json({ "mensaje": "Error al crear el producto" });
    }
});

app.put('/productos/:ref', async (req, res) => {
    // Validación de campos requeridos
    const productoEditado = {
        referencia: req.params.ref,
        nombre: req.body.nombreProducto,
        descripcion: req.body.descripcionProducto,
        precio: req.body.precioProducto,
        stock: req.body.stockProducto,
        imagen: req.body.imagenProducto,
        habilitado: true,
    };
    
    try { // Actualización del producto
        const actualizacion = await modeloProducto.findOneAndUpdate(
            {referencia: req.params.ref}, 
            productoEditado,
            {new: true}
        );
        
        if (actualizacion) { // Si la actualización fue exitosa, devolver el producto actualizado
            res.status(200).json({ "mensaje": "Actualización exitosa", producto: actualizacion });
        } else {
            res.status(404).json({ "mensaje": "Producto no encontrado" });
        }
    } catch (err) {// Manejo de errores
        // Si ocurre un error durante la actualización, devolver un mensaje de error
        console.error("Error al actualizar el producto:", err);
        res.status(400).json({ "mensaje": "Error al actualizar el producto" });
    }
});

app.delete('/productos/:ref', async (req, res) => {
    // Validación de campos requeridos
    const eliminacion = await modeloProducto.findOneAndDelete({ referencia: req.params.ref });
    if (eliminacion) {
        res.status(200).json({ "mensaje": "Producto eliminado exitosamente" });
    } else {
        res.status(404).json({ "mensaje": "Producto no encontrado" });
    }
});

// Servidor
const PORT = process.env.PORT || 9090;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto: ${PORT}`);
});