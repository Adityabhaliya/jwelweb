const { Product } = require('../models');
const slugify = require('../config/slugify');
const { getPagination, getPagingData } = require('../config/common');

// CREATE Product
exports.createProduct = async (req, res) => {
  try {
    const data = req.body;
    if (data.name) data.slug = slugify(data.name);

    const product = await Product.create(data);

    return res.status(200).json({
      success: true,
      status: 200,
      message: 'Product created successfully',
      data: product,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Failed to create product',
    });
  }
};

// GET All Products
exports.getAllProducts = async (req, res) => {
  try {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);

    const data = await Product.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    const response = getPagingData(data, page, limit);

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Products fetched successfully',
      data:response,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Failed to get products',
    });
  }
};

// GET Product by Slug
exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ where: { slug: req.params.slug } });

    if (!product) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Product fetched successfully',
      data: product,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Failed to fetch product',
    });
  }
};

// UPDATE Product by Slug
exports.updateProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const data = req.body;

    if (data.name) data.slug = slugify(data.name);

    const product = await Product.findOne({ where: { slug } });

    if (!product) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'Product not found',
      });
    }

    await product.update(data);

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Failed to update product',
    });
  }
};

// DELETE Product by Slug (soft delete)
exports.deleteProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({ where: { slug } });

    if (!product) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'Product not found',
      });
    }

    await product.update({ deletedAt: new Date() });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Product deleted successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Failed to delete product',
    });
  }
};
