const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');

const usuariosGet = async(req = request, res = response) => {
    let { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };
    limite = Number.isInteger(limite) ? Number.isInteger(limite) : 5;
    desde = Number.isInteger(desde) ? Number.isInteger(desde) : 0;
    const [ total, usuarios ] = await Promise.all([
        await Usuario.countDocuments(query),
        await Usuario.find(query)
            .skip( Number( desde ) )
            .limit( Number( limite ) )
    ]);
    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async(req, res = response) => {
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });
    
    //encriptar la constraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt);
    
    //guardar en la base de datos
    await usuario.save();
    
    res.json( usuario );
}

const usuariosPut = async(req, res =  response) => {
    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    if( password ){
        //encriptar la constraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt);
    }

    //actualizar en la base de datos
    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json( usuario );
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - controlador'
    });
}

const usuariosDelete = async(req, res = response) => {
    const { id } = req.params;
    //borrar fisicamente
    //const usuario = await Usuario.findByIdAndDelete( id );

    const usuario  = await Usuario.findByIdAndUpdate( id, { estado: false } );

    res.json( usuario );
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}