import express from "express";
import {  body  } from "express-validator";
import { 
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
 } from "../controllers/productController.js";
import validate from "../middleware/validate.js";
import {  auth  } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// All product routes require authentication
router.use(auth);

/**
 * @swagger
 * /api/products:
 *   get:
 *     tags: [Products]
 *     summary: Get all products
 *     description: Retrieve products with search, filter, and pagination
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or SKU
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Products retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedProducts'
 */
router.get('/', getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Get single product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product retrieved
 *       404:
 *         description: Product not found
 */
router.get('/:id', getProduct);

/**
 * @swagger
 * /api/products:
 *   post:
 *     tags: [Products]
 *     summary: Create a new product
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, sku, category, purchasePrice, sellingPrice, quantity]
 *             properties:
 *               name:
 *                 type: string
 *               sku:
 *                 type: string
 *               category:
 *                 type: string
 *               purchasePrice:
 *                 type: number
 *               sellingPrice:
 *                 type: number
 *               quantity:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Product created
 *       409:
 *         description: Duplicate SKU
 */
router.post(
  '/',
  upload.single('image'),
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Product name is required')
      .isLength({ max: 200 })
      .withMessage('Product name cannot exceed 200 characters'),
    body('sku')
      .trim()
      .notEmpty()
      .withMessage('SKU is required')
      .isLength({ max: 50 })
      .withMessage('SKU cannot exceed 50 characters'),
    body('category')
      .notEmpty()
      .withMessage('Category is required')
      .isMongoId()
      .withMessage('Invalid category ID'),
    body('purchasePrice')
      .notEmpty()
      .withMessage('Purchase price is required')
      .isFloat({ min: 0 })
      .withMessage('Purchase price must be >= 0'),
    body('sellingPrice')
      .notEmpty()
      .withMessage('Selling price is required')
      .isFloat({ min: 0 })
      .withMessage('Selling price must be >= 0'),
    body('quantity')
      .notEmpty()
      .withMessage('Quantity is required')
      .isInt({ min: 0 })
      .withMessage('Quantity must be >= 0'),
  ],
  validate,
  createProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     tags: [Products]
 *     summary: Update a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               sku:
 *                 type: string
 *               category:
 *                 type: string
 *               purchasePrice:
 *                 type: number
 *               sellingPrice:
 *                 type: number
 *               quantity:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Product not found
 *       409:
 *         description: Duplicate SKU
 */
router.put(
  '/:id',
  upload.single('image'),
  [
    body('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Product name cannot be empty'),
    body('sku')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('SKU cannot be empty'),
    body('category')
      .optional()
      .isMongoId()
      .withMessage('Invalid category ID'),
    body('purchasePrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Purchase price must be >= 0'),
    body('sellingPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Selling price must be >= 0'),
    body('quantity')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Quantity must be >= 0'),
  ],
  validate,
  updateProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     tags: [Products]
 *     summary: Delete a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */
router.delete('/:id', deleteProduct);

export default router;
