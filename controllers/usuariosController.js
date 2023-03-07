const Usuarios = require('../models/Usuarios');

exports.formCrearCuenta = (req, res) => {
    res.render('crear-cuenta', {
        nombrePagina : 'Crea tu cuenta'
    })
}

exports.crearNuevaCuenta = async (req, res) => {
    const usuario = req.body;

    try {
        await Usuarios.create(usuario);
    } catch (error) {
        
        // extraer el message de los errores
        const erroresSequelize = error.errors.map(err => err.message);
        console.log(erroresSequelize);

        req.flash('error', erroresSequelize);
        res.redirect('/crear-cuenta');
    }

   

}