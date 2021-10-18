const { response, request } = require('express');
const { Producto, Categoria } = require('../models');

const obtenrProductos = async(req, res = response) => {
    let { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, productos ] = await Promise.all([
        await Producto.countDocuments( query ),
        await Producto.find( query )
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip( Number( desde ))
            .limit( Number(limite) )
    ]);
    res.json({
        total,
        productos
    });
}

const obtenerProducto = async(req = request, res = response) => {
    const { id } = req.params;
    const producto = await Producto.findById(id).populate('usuario', 'nombre').populate('categoria', 'nombre');
    res.json( producto );
}

const crearProducto = async(req, res = response) => {
    const { estado, usuario, ...body } = req.body;
    const nombre = req.body.nombre.toUpperCase();
    const productoDB = await Producto.findOne({ nombre });
    if( productoDB ){
        return res.status(400).json({
            msg: `El producto ${ productoDB.nombre } ya existe`
        });
    }
    const data = {
        ...body,
        nombre,
        usuario: req.usuario._id,
    };
    const producto = await Producto( data );
    await producto.save();
    res.status(201). json( producto );
}

const actualizarProducto =  async( req = request, res = response) => {
    const  {estado, usuario, ...data}  = req.body;
    if( data.nombre ){
        data.nombre = data.nombre.toUpperCase();
    }
    const { id } = req.params;
    data.usuario = req.usuario._id;
    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });
    res.status(201).json( producto );
}

const borrarProducto = async(req = request, res = response) => {
    const { id } = req.params;
    const producto = await Producto.findByIdAndUpdate( id, { estado:false});
    res.status(201).json( producto );
}

module.exports = {
    crearProducto,
    obtenrProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}