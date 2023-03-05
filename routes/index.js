const express = require('express');
const router = express.Router();


module.exports = function() {
    router.get('/',(req,res) => {res.render('home')})

    /** Crear y confirmar cuentas */
    router.get('/crear-cuenta',(req,res) => {res.render('crear-cuenta')})

    return router;

}