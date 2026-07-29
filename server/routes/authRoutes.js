import express from "express";
import {  body  } from "express-validator";
import {  login, getMe  } from "../controllers/authController.js";
import validate from "../middleware/validate.js";
import {  auth  } from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Login user
 *     description: Authenticate user with email and password, returns JWT token
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ],
  validate,
  login
);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags: [Authentication]
 *     summary: Get current user profile
 *     description: Returns the authenticated user's profile
 *     responses:
 *       200:
 *         description: User profile retrieved
 *       401:
 *         description: Not authenticated
 */
router.get('/me', auth, getMe);

export default router;
