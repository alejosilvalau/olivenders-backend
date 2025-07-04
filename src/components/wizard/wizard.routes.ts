import { Router } from 'express';
import {
  findAll,
  findOneById,
  findOneByEmailOrUsername,
  checkUsername,
  checkEmail,
  add,
  update,
  resetPasswordWithoutToken,
  remove,
  sanitizeUsuarioInput,
  login,
  validatePassword,
  findOneByUser,
} from './wizard.controller.js';
// import { verificarRol, verificarToken } from '../../middleware/authMiddleware.js';

export const wizardRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Wizard:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the wizard
 *         username:
 *           type: string
 *           description: Wizard's username
 *         password:
 *           type: string
 *           description: Wizard's password
 *         name:
 *           type: string
 *           description: Wizard's first name
 *         last_name:
 *           type: string
 *           description: Wizard's last name
 *         email:
 *           type: string
 *           description: Wizard's email address
 *         phone:
 *           type: string
 *           description: Wizard's phone number
 *         address:
 *           type: string
 *           description: Wizard's address
 *         role:
 *           type: string
 *           description: Wizard's role
 *       required:
 *         - username
 *         - email
 *         - password
 *         - name
 *         - last_name
 *         - phone
 *         - address
 *         - role
 */

/**
 * @swagger
 * /api/wizards:
 *   get:
 *     summary: Get a list of all wizards
 *     tags: [Wizard]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Wizard'
 *       500:
 *         description: Error al obtener los usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener los usuarios
 *                 error:
 *                   type: string
 *                   example: Detalles del error
 */
wizardRouter.get('/', findAll);

// Endpoint GET /:id
/**
 * @swagger
 * /api/wizards/{id}:
 *   get:
 *     summary: Get a wizard by ID
 *     tags: [Wizard]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario no encontrado
 *       500:
 *         description: Error al obtener el usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener el usuario
 *                 error:
 *                   type: string
 *                   example: Detalles del error
 */
wizardRouter.get('/:id', findOneById);

/**
 * @swagger
 * /api/usuarios/checkusername/:username:
 *   get:
 *     summary: Verifica disponibilidad de nombre de usuario
 *     tags: [Usuario]
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre de usuario
 *     responses:
 *       200:
 *         description: Resultado de disponibilidad
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 available:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Error en la verificación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al verificar el nombre de usuario
 *                 error:
 *                   type: string
 *                   example: Detalles del error
 */
wizardRouter.get('/checkusername/:username', checkUsername);

/**
 * @swagger
 * /api/usuarios/checkemail/{email}:
 *   get:
 *     summary: Verifica disponibilidad de correo electrónico
 *     tags: [Usuario]
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: Correo electrónico
 *     responses:
 *       200:
 *         description: Resultado de disponibilidad
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 available:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Error en la verificación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al verificar el correo electrónico
 *                 error:
 *                   type: string
 *                   example: Detalles del error
 */
wizardRouter.get('/checkemail/:email', checkEmail);

// Endpoint GET /:user/:mail
/**
 * @swagger
 * /api/usuarios/{user}/{mail}:
 *   get:
 *     summary: Obtiene usuario por nombre de usuario o correo
 *     tags: [Usuario]
 *     parameters:
 *       - in: path
 *         name: user
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre de usuario
 *       - in: path
 *         name: mail
 *         schema:
 *           type: string
 *         required: true
 *         description: Correo electrónico
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario no encontrado
 *       500:
 *         description: Error al obtener el usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener el usuario
 *                 error:
 *                   type: string
 *                   example: Detalles del error
 */
wizardRouter.get('/:user/:mail', findOneByEmailOrUsername);

/**
 * @swagger
 * /api/usuarios/reset:
 *   post:
 *     summary: Restablecer la contraseña del usuario
 *     tags: [Usuario]
 *     description: Permite restablecer la contraseña del usuario utilizando un token de restablecimiento.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token de restablecimiento de contraseña
 *               newPassword:
 *                 type: string
 *                 description: Nueva contraseña del usuario
 *     responses:
 *       200:
 *         description: Contraseña actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Contraseña actualizada exitosamente"
 *       400:
 *         description: Solicitud incorrecta (contraseña corta o token inválido/expirado)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "La contraseña debe tener al menos 6 caracteres"
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Usuario no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error
 */
//wizardRouter.post('/reset', resetPassword); // Removed since resetPassword is not implemented

/**
 * @swagger
 * /api/usuarios/login:
 *   post:
 *     summary: Inicio de sesión de usuario
 *     tags: [Usuario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nombre de usuario
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token de autenticación
 *       401:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Credenciales inválidas
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario no encontrado
 *       500:
 *         description: Error al iniciar sesión
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al iniciar sesión
 *                 error:
 *                   type: string
 *                   example: Detalles del error
 */
wizardRouter.post('/login', login);

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags: [Usuario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       201:
 *         description: Usuario creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Error de validación o usuario ya existente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ya existe un usuario con ese nombre de usuario o correo electrónico.
 *       500:
 *         description: Error al crear el usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al crear el usuario
 *                 error:
 *                   type: string
 *                   example: Detalles del error
 */
wizardRouter.post('/', sanitizeUsuarioInput, add);

/**
 * @swagger
 * /api/usuarios/validate/:id:
 *   post:
 *     summary: Validar la contraseña del usuario
 *     tags: [Usuario]
 *     description: Verifica si la contraseña proporcionada coincide con la contraseña actual del usuario.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: Contraseña actual del usuario
 *     responses:
 *       200:
 *         description: Contraseña validada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 *               example: true
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error
 */
wizardRouter.post('/validate/:id', validatePassword);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Actualiza un usuario
 *     tags: [Usuario]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Usuario no encontrado
 *       500:
 *         description: Error en el servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al actualizar el usuario
 *                 error:
 *                   type: string
 *                   example: Detalles del error
 */
wizardRouter.put('/:id', sanitizeUsuarioInput, update);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   patch:
 *     summary: Restablece contraseña sin token
 *     tags: [Usuario]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: Contraseña actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario no encontrado
 *       500:
 *         description: Error al actualizar la contraseña
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al actualizar la contraseña
 */
wizardRouter.patch('/:id', sanitizeUsuarioInput, resetPasswordWithoutToken);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Elimina un usuario existente
 *     tags: [Usuario]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado con exito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario no encontrado
 *       500:
 *         description: Error al eliminar el usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al eliminar el usuario
 */
wizardRouter.delete('/:id', remove);

export default wizardRouter;