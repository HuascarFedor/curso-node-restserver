const { Router } = require('express');
const { check } = require('express-validator');

const { 
    crearProducto, 
    obtenrProductos, 
    obtenerProducto, 
    actualizarProducto,
    borrarProducto
} = require('../controllers/productos');
const { 
    existeCategoriaPorId, 
    existeProductoPorId 
} = require('../helpers/db-validators');
const { 
    validarJWT, 
    validarCampos,
    tieneRole
} = require('../middlewares');

const router = Router();

// Obtener productos
router.get('/', obtenrProductos);

// Obtener producto
router.get('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], obtenerProducto)

// Crear producto
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'Categoria debe ser un Mongo ID').isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos
], crearProducto );

// Actualizar producto
router.put('/:id', [
    validarJWT,
    //check('categoria', 'Categoria debe ser un Mongo ID').isMongoId(),
    //check('categoria').custom( existeCategoriaPorId ),
    check('id').custom( existeProductoPorId ),
    validarCampos
], actualizarProducto);

// Borrar producto
router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    validarCampos, //se detiene si hay error
    check('id').custom( existeProductoPorId ),
    validarCampos
], borrarProducto);

module.exports = router;