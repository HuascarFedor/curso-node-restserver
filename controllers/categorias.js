const { response } = require("express");
const { Categoria } = require("../models")

const obtenerCategorias = async(req, res = response) => {
    let {limite = 5, desde =0 } = req.query;
    const query = { estado: true };
    /*const populate = {
        path: 'usuario', 
        select: 'nombre'
    }*/
    const [ total, categorias ] = await Promise.all([
        await Categoria.countDocuments( query ),
        await Categoria.find( query )
            //.populate( populate )
            .populate('usuario', 'nombre')
            .skip ( Number( desde ) )
            .limit( Number( limite ) )
    ]);
    res.json({
        total,
        categorias
    })
}

const obtenerCategoria = async(req, res = response) => {
    const { id } = req.params;
    const populate = {
        path: 'usuario', 
        select: 'nombre'
    }
    const categoria = await Categoria.findById(id).populate( populate );
    res.json( categoria );
}

const crearCategoria = async(req, res = response) => {
    const nombre = req.body.nombre.toUpperCase();
    const categoriaDB = await Categoria.findOne({ nombre });
    if( categoriaDB ){
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre } ya existe`
        });
    }
    //generar la data a guardar
    const data  = {
        nombre,
        usuario: req.usuario._id
    }
    const categoria = await Categoria( data );
    //Guardar en DB
    await categoria.save();
    res.status(201).json( categoria );
}

const actualizarCategoria = async(req, res = response) => {
    const { estado, usuario, ...data } = req.body;
    const nombre = data.nombre = data.nombre.toUpperCase();
    const categoriaDB = await Categoria.findOne({ nombre });
    if( categoriaDB ){
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre } ya existe`
        });
    }
    const { id } = req.params;
    data.usuario = req.usuario._id;
    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });
    res.status(201).json( categoria );
}

const borrarCategoria = async(req, res = response) => {
    const { id } = req.params;
    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });
    res.status(201).json( categoria );
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}