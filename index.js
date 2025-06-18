// Cargar variables de entorno desde el archivo .env
require('dotenv').config();

// Importar las librerías necesarias
const express = require('express'); // Framework para crear el servidor web
const morgan = require('morgan');   // Middleware para ver logs de las peticiones

const app = express(); // Inicializar la aplicación

// ----------- Middlewares -----------
// Morgan muestra información de las peticiones en la consola
app.use(morgan('dev'));
// Permite recibir datos desde formularios HTML
app.use(express.urlencoded({ extended: false }));
// Permite recibir y entender datos en formato JSON en las peticiones
app.use(express.json());

// ----------- Modelos -----------
// Importa los modelos de Mongoose para interactuar con MongoDB
const modeloCliente = require('./backend/models/cliente.model');
const modeloProducto = require('./backend/models/producto.model');

// ----------- RUTAS PARA CLIENTES -----------

// Obtener la lista de todos los clientes
app.get('/clientes', async (req, res) => {
    // Busca todos los clientes en la base de datos
    const listaClientes = await modeloCliente.find();
    // Devuelve la lista como respuesta en formato JSON
    res.json(listaClientes);
});

// Crear un nuevo cliente
app.post('/clientes', async (req, res) => {
    // Crea un nuevo objeto cliente con los datos enviados en el body
    const nuevoCliente = new modeloCliente({
        documento: req.body.documento,               // Documento del cliente
        nombreCompleto: req.body.nombreCompleto,     // Nombre completo del cliente
        fechaNacimiento: req.body.fechaNacimiento,   // Fecha de nacimiento
        correo: req.body.correo                      // Correo electrónico
    });

    try {
        // Intenta guardar el nuevo cliente en la base de datos
        const clienteGuardado = await nuevoCliente.save();
        // Si se guarda correctamente, responde con éxito y el cliente creado
        res.status(201).json({ 'mensaje': "Cliente creado exitosamente", cliente: clienteGuardado });
    } catch (err) {
        // Si hay error, muestra el error en consola y responde con mensaje de error
        console.error("Error al guardar el cliente:", err);
        res.status(400).json({ 'mensaje': "Error al crear el cliente", error: err.message });
    }
});

// Actualizar los datos de un cliente por su correo electrónico
app.put('/clientes/:email', async (req, res) => {
    // Toma todos los datos nuevos del body
    const clienteEditado = req.body;
    try {
        // Busca el cliente por su correo y actualízalo con los nuevos datos
        const resultado = await modeloCliente.findOneAndUpdate({ correo: req.params.email }, clienteEditado, { new: true });
        if (resultado) {
            // Si lo encuentra y actualiza, responde con éxito y el cliente actualizado
            res.status(200).json({ 'mensaje': "Cliente actualizado exitosamente", cliente: resultado });
        } else {
            // Si no encuentra el cliente, responde con mensaje de no encontrado
            res.status(404).json({ 'mensaje': "Cliente no encontrado" });
        }
    } catch (err) {
        // Si hay error al actualizar, muestra el error en consola y responde con mensaje de error
        console.error("Error al actualizar el cliente:", err);
        res.status(400).json({ 'mensaje': "Error al actualizar el cliente", error: err.message });
    }
});

// Eliminar un cliente usando su correo electrónico
app.delete('/clientes/:email', async (req, res) => {
    try {
        // Busca el cliente por su correo y elimínalo
        const resultado = await modeloCliente.findOneAndDelete({ correo: req.params.email });
        if (resultado) {
            // Si lo elimina, responde con mensaje de éxito
            res.status(200).json({ 'mensaje': "Cliente eliminado exitosamente" });
        } else {
            // Si no lo encuentra, responde con mensaje de no encontrado
            res.status(404).json({ 'mensaje': "Cliente no encontrado" });
        }
    } catch (err) {
        // Si hay error al eliminar, muestra el error en consola y responde con mensaje de error
        console.error("Error al eliminar el cliente:", err);
        res.status(500).json({ 'mensaje': "Error al eliminar el cliente", error: err.message });
    }
});

// ----------- RUTAS PARA PRODUCTOS -----------

// Obtener todos los productos registrados en la base de datos
app.get('/productos', async (req, res) => {
    try {
        // Busca todos los productos
        const productos = await modeloProducto.find();
        // Devuelve la lista de productos
        res.status(200).json(productos);
    } catch (err) {
        // Si hay error, muestra el error en consola y responde con 
        console.error("Error al obtener los productos:", err);
        res.status(500).json({ 'mensaje': "Error al obtener los productos" });
    }
});

// Obtener un producto específico por su referencia (ID personalizado)
app.get('/productos/:ref', async (req, res) => {
    // Busca el producto por su campo referencia
    let productoEncontrado = await modeloProducto.findOne({ referencia: req.params.ref });
    if (productoEncontrado) {
        // Si lo encuentra, lo devuelve como respuesta
        res.status(200).json(productoEncontrado);
    } else {
        // Si no lo encuentra, responde con 
        res.status(404).json({ "error": 'No se encontró el producto' });
    }
});

// Crear un nuevo producto en la base de datos
app.post('/productos', async (req, res) => {
    try {
        // Crea un objeto nuevo con los datos recibidos
        const nuevoProducto = {
            referencia: req.body.referenciaProducto,       // Referencia única del producto
            nombre: req.body.nombreProducto,               // Nombre del producto
            descripcion: req.body.descripcionProducto,     // Descripción
            precio: req.body.precioProducto,               // Precio
            stock: req.body.stockProducto,                 // Unidades disponibles
            imagen: req.body.imagenProducto,               // URL de la imagen
            habilitado: true                               // Estado habilitado por defecto
        };

        // Guarda el nuevo producto en la base de datos
        const insercion = await modeloProducto.create(nuevoProducto);

        // Devuelve el producto creado como respuesta
        res.status(201).json(insercion);

    } catch (err) {
        // Si hay error, muestra el error en consola y responde con mensaje de error
        console.error('Error al crear el producto:', err.message);
        res.status(400).json({ mensaje: 'Error al crear el producto', error: err.message });
    }
});

// Actualizar los datos de un producto usando su referencia
app.put('/productos/:ref', async (req, res) => {
    // Crea un objeto con los nuevos datos del producto
    const productoEditado = {
        referencia: req.params.ref,
        nombre: req.body.nombreProducto,
        descripcion: req.body.descripcionProducto,
        precio: req.body.precioProducto,
        stock: req.body.stockProducto,
        imagen: req.body.imagenProducto,
        habilitado: true,
    };

    try {
        // Busca el producto por su referencia y actualízado
        const actualizacion = await modeloProducto.findOneAndUpdate({ referencia: req.params.ref }, productoEditado, { new: true });
        if (actualizacion) {
            // Si lo actualiza, responde con mensaje de éxito y el producto actualizado
            res.status(200).json({ 'mensaje': "Actualización exitosa", producto: actualizacion });
        } else {
            // Si no lo encuentra, responde con mensaje de no encontrado
            res.status(404).json({ 'mensaje': "Producto no encontrado" });
        }
    } catch (err) {
        // Si hay error, muestra el error en consola y responde con
        console.error("Error al actualizar el producto:", err);
        res.status(400).json({ 'mensaje': "Error al actualizar el producto" });
    }
});                        

// Eliminar un producto 
app.delete('/productos/:ref', async (req, res) => {
    // Busca y elimina el producto por su referencia
    const eliminacion = await modeloProducto.findOneAndDelete({ referencia: req.params.ref });
    if (eliminacion) {
        // Si lo elimina, responde con mensaje de éxito
        res.status(200).json({ "mensaje": "Producto eliminado exitosamente" });
    } else {
        // Si no encuentra el producto, responde con mensaje de error
        res.status(404).json({ "mensaje": "Producto no encontrado" });
    }
});

// ----------- INICIAR EL SERVIDOR -----------
// El servidor escucha en el puerto definido en .env o el 9090 por defecto
app.listen(process.env.PORT || 9090, () => {
    console.log(`Servidor corriendo en el puerto: ${process.env.PORT || 9090}`);
});