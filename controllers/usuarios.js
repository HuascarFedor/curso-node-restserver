const { response } = require('express');

const usuariosGet = (req, res) => {
    const { id, nombre = 'No Name' } = req.query;
    res.json({
        msg: 'get API - controlador',
        id,
        nombre
    });
}

const usuariosPost = (req, res) => {
    const { nombre, edad } = req.body;
    res.json({
        msg: 'post API - controlador con JSON',
        nombre,
        edad
    });
}

const usuariosPut = (req, res) => {
    const { id } = req.params;
    res.json({
        msg: 'put API - controlador',
        id
    });
}

const usuariosPatch = (req, res) => {
    res.json({
        msg: 'patch API - controlador'
    });
}

const usuariosDelete = (req, res) => {
    res.json({
        msg: 'delete API - controlador'
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}