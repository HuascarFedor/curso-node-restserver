const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarArchivoSubir } = require('../middlewares');
const { coleccionesPermitidas } = require('../helpers');
const { 
    cargarArchivo, 
    //actualizarImagen, 
    //mostrarImagen,
    actualizarImagenCloudinary,
    mostrarImagenCloudinary
} = require('../controllers/uploads');


const router = Router();

router.post( '/', validarArchivoSubir, cargarArchivo );

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos']) ),
    validarCampos
], actualizarImagenCloudinary );
//actualizarImagen);

router.get('/:coleccion/:id', [
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos']) ),
    validarCampos
], mostrarImagenCloudinary );

//mostrarImagen);

module.exports = router;