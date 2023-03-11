const Categorias = require('../models/Categorias');
const Grupos = require('../models/Grupos');

//const uuid = require('uuid');
const { v4: uuidv4 } = require('uuid');
uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'

exports.formNuevoGrupo = async (req, res) => {
    
    const categorias = await Categorias.findAll();

    res.render('nuevo-grupo', {
        nombrePagina : 'Crea un nuevo grupo',
        categorias

    })
}

// Almacena los grupos en la BD
exports.crearGrupo = async (req, res) => {
    
    // sanitizar
    req.sanitizeBody('nombre');
    req.sanitizeBody('url');

    const grupo = req.body;

    // console.log(grupo);
    // return;

    // almacena el usuario autenticado como el creador del grupo
    grupo.usuarioId = req.user.id;

    // leer la imagen
    if(req.file) {
        grupo.imagen = req.file.filename;
    }

    grupo.id = uuidv4();
    

    try {
        // almacenar en la bD
        await Grupos.create(grupo);
        req.flash('exito', 'Se ha creado el Grupo Correctamente');
        res.redirect('/administracion');
    } catch (error) {
        // extraer el message de los errores
        const erroresSequelize = error.errors.map(err => err.message);
        req.flash('error', erroresSequelize);
        res.redirect('/nuevo-grupo');
    }
}