const Product = require('../models/Product');
const Category = require('../models/Category');
const { successResponse } = require('../utils/apiResponse');

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/dashboard/stats
 * @access  Private
 */
const getStats = async (req, res, next) => {
  try {
    const [totalProducts, totalCategories, lowStockProducts] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      Product.find({ quantity: { $lt: 10 } })
        .populate('category', 'name')
        .sort({ quantity: 1 })
        .lean(),
    ]);

    successResponse(res, {
      totalProducts,
      totalCategories,
      lowStockCount: lowStockProducts.length,
      lowStockProducts,
    }, 'Dashboard stats retrieved successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats };
