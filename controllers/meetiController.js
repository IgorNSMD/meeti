
const Grupos = require('../models/Grupos');
const Meeti = require('../models/Meeti');

const { v4: uuidv4 } = require('uuid');
uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'

// Muestra el formulario para nuevos Meeti
exports.formNuevoMeeti = async (req, res) => {
    const grupos = await Grupos.findAll({ where : { usuarioId : req.user.id }});

    res.render('nuevo-meeti', {
        nombrePagina : 'Crear Nuevo Meeti',
        grupos
    })
}

// Inserta nuevos Meeti en la BD
exports.crearMeti = async (req, res) => {
    // obtener los datos
    const meeti = req.body;

    // asignar el usuario
    meeti.usuarioId = req.user.id;
    
    // almacena la ubicación con un point
    const point = { type : 'Point', coordinates : [ parseFloat(req.body.lat), parseFloat(req.body.lng) ] };
    meeti.ubicacion = point;

    // cupo opcional
    if(req.body.cupo === '') {
        meeti.cupo = 0;
    }

    meeti.id = uuidv4();

    // almacenar en la BD
    try {
        await Meeti.create(meeti);
        req.flash('exito', 'Se ha creado el Meeti Correctamente');
        res.redirect('/administracion');
    } catch (error) {
        // extraer el message de los errores
        const erroresSequelize = error.errors.map(err => err.message);
        req.flash('error', erroresSequelize);
        res.redirect('/nuevo-meeti');
    }

}

// sanitiza los meeti
exports.sanitizarMeeti = (req, res, next) => {
    req.sanitizeBody('titulo');
    req.sanitizeBody('invitado');
    req.sanitizeBody('cupo');
    req.sanitizeBody('fecha');
    req.sanitizeBody('hora');
    req.sanitizeBody('direccion');
    req.sanitizeBody('ciudad');
    req.sanitizeBody('estado');
    req.sanitizeBody('pais');
    req.sanitizeBody('lat');
    req.sanitizeBody('lng');
    req.sanitizeBody('grupoId');

    next();
}