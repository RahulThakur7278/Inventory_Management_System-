import express from "express";
import {  getStats  } from "../controllers/dashboardController.js";
import {  auth  } from "../middleware/auth.js";

const router = express.Router();

// All dashboard routes require authentication
router.use(auth);

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get dashboard statistics
 *     description: Returns total products, categories, low stock count and products
 *     responses:
 *       200:
 *         description: Dashboard stats retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardStats'
 */
router.get('/stats', getStats);

export default router;
