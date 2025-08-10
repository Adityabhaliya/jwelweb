const { Product, Category } = require('../models');
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
// exports.getAllProducts = async (req, res) => {
//   try {
//     const { page, size } = req.query;
//     const { limit, offset } = getPagination(page, size);

//     const data = await Product.findAndCountAll({
//       limit,
//       offset,
//       order: [['createdAt', 'DESC']],
//     });

//     const response = getPagingData(data, page, limit);

//     res.status(200).json({
//       success: true,
//       status: 200,
//       message: 'Products fetched successfully',
//       data:response,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       success: false,
//       status: 500,
//       message: 'Failed to get products',
//     });
//   }
// };
exports.getAllProducts = async (req, res) => {
  try {
    const { page, size, s = '' } = req.query;
    const { limit, offset } = getPagination(page, size);

    // Step 1: Fetch all products first (pagination applied initially)
    const data = await Product.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    // Step 2: Convert all products to plain JSON
    const products = data.rows.map(product => product.toJSON());

    // Step 3: Apply search filter if `s` is provided
    const filteredProducts = s
      ? products.filter(product => {
          const productString = JSON.stringify(product).toLowerCase();
          return productString.includes(s.toLowerCase());
        })
      : products;

    // Step 4: Manually paginate after filtering
    const pagedData = filteredProducts.slice(0, limit);

    const response = {
      totalItems: data.count,
      totalPages: Math.ceil(filteredProducts.length / limit),
      currentPage: Number(page) || 1,
      data: pagedData
    };

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Products fetched successfully',
      data: response,
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

    await product.destroy();

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


exports.getAllProductsUser = async (req, res) => {
  try {
    const { page, size, s = '' } = req.query;
    const { limit, offset } = getPagination(page, size);

    // Step 1: Fetch all products first (pagination applied initially)
    const data = await Product.findAndCountAll({
      where:{deletedAt:null ,is_new:true},
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    // Step 2: Convert all products to plain JSON
    const products = data.rows.map(product => product.toJSON());

    // Step 3: Apply search filter if `s` is provided
    const filteredProducts = s
      ? products.filter(product => {
          const productString = JSON.stringify(product).toLowerCase();
          return productString.includes(s.toLowerCase());
        })
      : products;

    // Step 4: Manually paginate after filtering
    const pagedData = filteredProducts.slice(0, limit);

    const response = {
      totalItems: filteredProducts.length,
      totalPages: Math.ceil(filteredProducts.length / limit),
      currentPage: Number(page) || 1,
      data: pagedData
    };

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Products fetched successfully',
      data: response,
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

exports.getAllProductsUserNew = async (req, res) => {
  try {
    const { s = '' } = req.query;

    // Step 1: Fetch all products without pagination
    const products = await Product.findAll({
      where: { deletedAt: null, is_new: true },
      order: [['createdAt', 'DESC']],
    });

    // Step 2: Convert to plain JSON
    const productList = products.map(product => product.toJSON());

    // Step 3: Apply search filter if `s` is provided
    const filteredProducts = s
      ? productList.filter(product => {
          const productString = JSON.stringify(product).toLowerCase();
          return productString.includes(s.toLowerCase());
        })
      : productList;

    // Step 4: Send response
    res.status(200).json({
      success: true,
      status: 200,
      message: 'Products fetched successfully',
      data: filteredProducts,
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

exports.getAllProductsUserFeatured = async (req, res) => {
  try {
    const { s = '' } = req.query;

    // Step 1: Fetch all products without pagination
    const products = await Product.findAll({
      where: { deletedAt: null, is_featured: true },
      order: [['createdAt', 'DESC']],
    });

    // Step 2: Convert to plain JSON
    const productList = products.map(product => product.toJSON());

    // Step 3: Apply search filter if `s` is provided
    const filteredProducts = s
      ? productList.filter(product => {
          const productString = JSON.stringify(product).toLowerCase();
          return productString.includes(s.toLowerCase());
        })
      : productList;

    // Step 4: Send response
    res.status(200).json({
      success: true,
      status: 200,
      message: 'Products fetched successfully',
      data: filteredProducts,
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


exports.getAllProductsUserGlobel = async (req, res) => {
  try {
    const { page, size, s = '' } = req.query;
    const { limit, offset } = getPagination(page, size);

    // Step 1: Fetch all products first (pagination applied initially)
    const data = await Product.findAndCountAll({
      where:{deletedAt:null },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    // Step 2: Convert all products to plain JSON
    const products = data.rows.map(product => product.toJSON());

    // Step 3: Apply search filter if `s` is provided
    const filteredProducts = s
      ? products.filter(product => {
          const productString = JSON.stringify(product).toLowerCase();
          return productString.includes(s.toLowerCase());
        })
      : products;

    // Step 4: Manually paginate after filtering
    const pagedData = filteredProducts.slice(0, limit);

    const response = {
      totalItems: filteredProducts.length,
      totalPages: Math.ceil(filteredProducts.length / limit),
      currentPage: Number(page) || 1,
      data: pagedData
    };

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Products fetched successfully',
      data: response,
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

exports.getAllProductsUserCatSlug = async (req, res) => {
  try {
    const { page = 1, size = 10, s = '', slug } = req.query;
    const { limit, offset } = getPagination(page, size);

    if (!slug) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Category slug is required',
      });
    }

    // Step 1: Find category by slug
    const category = await Category.findOne({
      where: { slug, deletedAt: null },
      attributes: ['name']
    });

    if (!category) {
      return res.status(200).json({
        success: false,
        status: 404,
        message: 'Category not found',
      });
    }

    // Step 2: Search condition
    let whereCondition = {
      deletedAt: null,
      category: category.name
    };

    // Step 3: Fetch products with pagination
    const data = await Product.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    // Step 4: Convert to plain objects
    let products = data.rows.map(product => product.toJSON());

    // Step 5: Search filter on JSON
    if (s) {
      products = products.filter(product =>
        JSON.stringify(product).toLowerCase().includes(s.toLowerCase())
      );
    }

    // Step 6: Manual pagination after search
    const pagedData = products.slice(0, limit);

    // Step 7: Response
    const response = {
      totalItems: products.length,
      totalPages: Math.ceil(products.length / limit),
      currentPage: Number(page),
      data: pagedData
    };

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Products fetched successfully',
      data: response
    });

  } catch (err) {
    console.error('Error fetching products by category slug:', err);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Failed to get products',
    });
  }
};

exports.getAllProductsUserRecommand = async (req, res) => {
  try {
    const { s = '', slug } = req.query;

    if (!slug) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Category slug is required',
      });
    }

    // Step 1: Find category by slug
    const category = await Category.findOne({
      where: { slug, deletedAt: null },
      attributes: ['name']
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'Category not found',
      });
    }

    // Step 2: Search condition
    let whereCondition = {
      deletedAt: null,
      category: category.name
    };

    // Step 3: Fetch all products (no pagination)
    let products = await Product.findAll({
      where: whereCondition,
      order: [['createdAt', 'DESC']]
    });

    // Step 4: Convert to plain objects
    products = products.map(product => product.toJSON());

    // Step 5: Search filter on JSON
    if (s) {
      products = products.filter(product =>
        JSON.stringify(product).toLowerCase().includes(s.toLowerCase())
      );
    }

    // Step 6: Response (all products, no pagination)
    res.status(200).json({
      success: true,
      status: 200,
      message: 'Products fetched successfully',
      data: products
    });

  } catch (err) {
    console.error('Error fetching products by category slug:', err);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Failed to get products',
    });
  }
};


exports.getProductBySlugUser = async (req, res) => {
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