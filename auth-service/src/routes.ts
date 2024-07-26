import { Router } from 'express';
import { AuthController } from './v1/controllers/auth.controllers';

const router = Router();

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user
 *     description: Registers a new user with the provided email, name, and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: User registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "activate your email"
 *       401:
 *         description: Email already exists or other errors
 *       500:
 *         description: Internal server error
 */
router.post('/signup', AuthController.signUp);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     description: Logs in a user with the provided email and password, sending an OTP if successful.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful and OTP sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OTP sent"
 *       401:
 *         description: Invalid credentials or user not found
 *       500:
 *         description: Internal server error
 */
router.post('/login', AuthController.login);

/**
 * @swagger
 * /verify-otp:
 *   post:
 *     summary: Verify OTP
 *     description: Verifies the OTP sent to the user and returns access and refresh tokens.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               OTP:
 *                 type: string
 *                 example: "12345678"
 *     responses:
 *       200:
 *         description: OTP verification successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 refreshToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Invalid OTP or expired OTP
 *       500:
 *         description: Internal server error
 */
router.post('/verify-otp', AuthController.verifyOTP);

/**
 * @swagger
 * /activate/{token}:
 *   get:
 *     summary: Activate user account
 *     description: Activates the user account using the provided activation token.
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "abcdef123456"
 *     responses:
 *       200:
 *         description: Account activation successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 activated:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid or expired activation token
 *       500:
 *         description: Internal server error
 */
router.get('/activate/:token', AuthController.activateAccount);

export default router;
