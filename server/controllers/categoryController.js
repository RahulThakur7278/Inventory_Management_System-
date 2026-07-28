const Category = require('../models/Category');
const Product = require('../models/Product');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Private
 */
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    successResponse(res, { categories }, 'Categories retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single category
 * @route   GET /api/categories/:id
 * @access  Private
 */
const getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return errorResponse(res, 'Category not found', 404);
    }

    successResponse(res, { category }, 'Category retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create category
 * @route   POST /api/categories
 * @access  Private
 */
const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    // Check for duplicate name
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') },
    });

    if (existingCategory) {
      return errorResponse(res, 'Category with this name already exists', 409);
    }

    const category = await Category.create({ name, description });
    successResponse(res, { category }, 'Category created successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update category
 * @route   PUT /api/categories/:id
 * @access  Private
 */
const updateCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    // Check if category exists
    const category = await Category.findById(req.params.id);
    if (!category) {
      return errorResponse(res, 'Category not found', 404);
    }

    // Check for duplicate name (exclude current category)
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: req.params.id },
      });

      if (existingCategory) {
        return errorResponse(res, 'Category with this name already exists', 409);
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    );

    successResponse(res, { category: updatedCategory }, 'Category updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete category
 * @route   DELETE /api/categories/:id
 * @access  Private
 */
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return errorResponse(res, 'Category not found', 404);
    }

    // Check if any products use this category
    const productsCount = await Product.countDocuments({ category: req.params.id });
    if (productsCount > 0) {
      return errorResponse(
        res,
        `Cannot delete category. ${productsCount} product(s) are using this category.`,
        400
      );
    }

    await Category.findByIdAndDelete(req.params.id);
    successResponse(res, null, 'Category deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, getCategory, createCategory, updateCategory, deleteCategory };
