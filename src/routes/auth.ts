import express from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { UserRepository } from '../repositories/user.repository';

const router = express.Router();

const authService = new AuthService(new UserRepository());
const authController = new AuthController(authService);

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterDto'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/AuthUserDto'
 *       400:
 *         description: Validation error
 */
router.post('/register', authController.register.bind(authController));

/**
 * @openapi
 * /auth/confirm-email:
 *   get:
 *     summary: Confirm user email
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Email confirmation token
 *     responses:
 *       200:
 *         description: Email confirmed
 *       400:
 *         description: Invalid or expired token
 */
router.get('/confirm-email', authController.confirmEmail.bind(authController));

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginDto'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/AuthUserDto'
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', authController.login.bind(authController));

export default router;
