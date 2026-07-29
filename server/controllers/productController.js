import Product from "../models/Product.js";
import {  successResponse, errorResponse, paginatedResponse  } from "../utils/apiResponse.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @desc    Get all products with search, filter, pagination
 * @route   GET /api/products
 * @access  Private
 */
const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      category = '',
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    // Build query filter
    const filter = {};

    // Search by name or SKU
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Sort configuration
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortConfig = { [sortBy]: sortOrder };

    // Execute query with pagination
    const [products, totalItems] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name')
        .sort(sortConfig)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalItems / limitNum);

    paginatedResponse(
      res,
      { products },
      {
        currentPage: pageNum,
        totalPages,
        totalItems,
        itemsPerPage: limitNum,
      },
      'Products retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single product
 * @route   GET /api/products/:id
 * @access  Private
 */
const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');

    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    successResponse(res, { product }, 'Product retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create product
 * @route   POST /api/products
 * @access  Private
 */
const createProduct = async (req, res, next) => {
  try {
    const { name, sku, category, purchasePrice, sellingPrice, quantity } = req.body;

    // Check for duplicate SKU
    const existingSku = await Product.findOne({
      sku: { $regex: new RegExp(`^${sku}$`, 'i') },
    });

    if (existingSku) {
      return errorResponse(res, 'Product with this SKU already exists', 409);
    }

    const productData = {
      name,
      sku,
      category,
      purchasePrice,
      sellingPrice,
      quantity,
    };

    // Handle image upload
    if (req.file) {
      productData.image = `/uploads/${req.file.filename}`;
    }

    const product = await Product.create(productData);
    const populatedProduct = await Product.findById(product._id).populate('category', 'name');

    successResponse(res, { product: populatedProduct }, 'Product created successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private
 */
const updateProduct = async (req, res, next) => {
  try {
    const { name, sku, category, purchasePrice, sellingPrice, quantity } = req.body;

    // Check if product exists
    const product = await Product.findById(req.params.id);
    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    // Check for duplicate SKU (exclude current product)
    if (sku && sku !== product.sku) {
      const existingSku = await Product.findOne({
        sku: { $regex: new RegExp(`^${sku}$`, 'i') },
        _id: { $ne: req.params.id },
      });

      if (existingSku) {
        return errorResponse(res, 'Product with this SKU already exists', 409);
      }
    }

    const updateData = { name, sku, category, purchasePrice, sellingPrice, quantity };

    // Handle image upload
    if (req.file) {
      // Delete old image if exists
      if (product.image) {
        const oldImagePath = path.join(__dirname, '..', product.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('category', 'name');

    successResponse(res, { product: updatedProduct }, 'Product updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private
 */
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    // Delete associated image if exists
    if (product.image) {
      const imagePath = path.join(__dirname, '..', product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    successResponse(res, null, 'Product deleted successfully');
  } catch (error) {
    next(error);
  }
};

export { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
