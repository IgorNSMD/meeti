const Categorias = require('../models/Categorias');
const Grupos = require('../models/Grupos');

const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');

//const uuid = require('uuid');
const { v4: uuidv4 } = require('uuid');
uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'



const configuracionMulter = {
    limits : { fileSize : 100000 },
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, next) => {
            next(null, __dirname+'/../public/uploads/grupos/');
        },
        filename : (req, file, next) => {
            const extension = file.mimetype.split('/')[1];
            next(null, `${shortid.generate()}.${extension}`);
        }
    }), 
    fileFilter(req, file, next) {
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            //el formato es valido
            next(null, true);
        } else {
            // el formato no es valido
            next(new Error('Formato no válido'), false);
        }
    }
}

const upload = multer(configuracionMulter).single('imagen');

// sube imagen en el servidor
exports.subirImagen = (req, res, next) => {
    upload(req, res, function(error) {
        if(error) {
            if(error instanceof multer.MulterError) {
                if(error.code === 'LIMIT_FILE_SIZE') {
                    req.flash('error', 'El Archivo es muy grande')
                } else {
                    req.flash('error', error.message);
                }
            } else if(error.hasOwnProperty('message')) {
                req.flash('error', error.message);
            }
            res.redirect('back');
            return;
        } else {
            next();
        }
    })
}


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

exports.formEditarGrupo = async (req, res) => {
    const consultas = [];
    consultas.push( Grupos.findByPk(req.params.grupoId) );
    consultas.push( Categorias.findAll() );

    // Promise con await
    const [grupo, categorias] = await Promise.all(consultas);    
    
    res.render('editar-grupo', {
        nombrePagina : `Editar Grupo : ${grupo.nombre}`,
        grupo,
        categorias
    })

    // const consultas = [];
    // consultas.push( Grupos.findByPk(req.params.grupoId) );
    // consultas.push( Categorias.findAll() );

    // // Promise con await
    // const [grupo, categorias] = await Promise.all(consultas);

    // res.render('editar-grupo', {
    //     nombrePagina : `Editar Grupo : ${grupo.nombre}`,
    //     grupo,
    //     categorias
    // })
}

// guarda los cambios en la BD
exports.editarGrupo = async (req, res, next) => {
    const grupo = await Grupos.findOne({ where : { id : req.params.grupoId, usuarioId : req.user.id }});

    // si no existe ese grupo o no es el dueño
    if(!grupo) {
        req.flash('error', 'Operación no válida');
        res.redirect('/administracion');
        return next();
    }

    // todo bien, leer los valores
    const {nombre, descripcion, categoriaId, url } = req.body;

    // asignar los valores
    grupo.nombre = nombre;
    grupo.descripcion = descripcion;
    grupo.categoriaId = categoriaId;
    grupo.url = url;

    // guardamos en la base de datos
    await grupo.save();
    req.flash('exito', 'Cambios Almacenados Correctamente');
    res.redirect('/administracion');

}