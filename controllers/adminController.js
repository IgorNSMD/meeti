const Grupos = require('../models/Grupos');

exports.panelAdministracion = async (req, res) => {

    const grupos = await Grupos.findAll({where:{ usuarioId : req.user.id }});

    res.render('administracion', {
        nombrePagina : 'Panel de Administracion', 
        grupos, 
        // meeti,
        // anteriores,
        // moment
    })

    return;

    // consultas
    //     const consultas = [];
    //     consultas.push( Grupos.findAll({ where: { usuarioId : req.user.id }}) );
    //     consultas.push( Meeti.findAll({ where : { usuarioId : req.user.id, 
    //                                               fecha : { [Op.gte] : moment(new Date()).format("YYYY-MM-DD") }
    //                                             },
    //                                     order : [
    //                                         ['fecha', 'ASC']
    //                                     ] 


    //     }) );
    //     consultas.push( Meeti.findAll({ where : { usuarioId : req.user.id, 
    //                                             fecha : { [Op.lt] : moment(new Date()).format("YYYY-MM-DD") }
    //     }}) );
    //     // array destructuring
    //     const [grupos, meeti, anteriores] = await Promise.all(consultas);
        
    //     res.render('administracion', {
    //         nombrePagina : 'Panel de Administracion', 
    //         grupos, 
    //         meeti,
    //         anteriores,
    //         moment
    //     })

    }