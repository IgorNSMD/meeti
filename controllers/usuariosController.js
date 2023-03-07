const Usuarios = require('../models/Usuarios');

exports.formCrearCuenta = (req, res) => {
    res.render('crear-cuenta', {
        nombrePagina : 'Crea tu cuenta'
    })
}

exports.crearNuevaCuenta = async (req, res) => {
    const usuario = req.body;

    req.checkBody('confirmar', 'El password confirmado no puede ir vacio' ).notEmpty();
    req.checkBody('confirmar', 'El password es diferente').equals(req.body.password);

    // Leer los errores de express
    const erroresExpress = req.validationErrors();

    try {
        await Usuarios.create(usuario);
    } catch (error) {
        
        // extraer el message de los errores
        const erroresSequelize = error.errors.map(err => err.message);
        //console.log(erroresSequelize);

        // extraer unicamente el msg de los errores
        const errExp = erroresExpress.map(err => err.msg);

        //unirlos
        const listaErrores = [...erroresSequelize, ...errExp];

        req.flash('error', listaErrores);
        res.redirect('/crear-cuenta');
    }

   

}