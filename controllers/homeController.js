exports.home = async (req, res) => {
    res.render('home', {
        nombrePagina : 'Inicio'
    })
}