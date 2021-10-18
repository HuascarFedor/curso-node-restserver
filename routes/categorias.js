const { Router } = require('express');
const { check } = require('express-validator');

const {
    existeCategoriaPorId
} = require('../helpers/db-validators');

const { 
    crearCategoria, 
    obtenerCategorias, 
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
} = require('../controllers/categorias');
const { 
    validarJWT, 
    validarCampos, 
    tieneRole
} = require('../middlewares');

const router = Router();

//obtener todas las categorias - publico
router.get('/', obtenerCategorias );

//obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], obtenerCategoria);

//crear categoria - privado - cualquier persona con token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

//actualizar categoria por id - privado - cualquiera con token valido
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], actualizarCategoria);

//borrar una categoria - admin
router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    validarCampos, //se detiene si hay error
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], borrarCategoria);

module.exports = router;