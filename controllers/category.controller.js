const { Category, Product } = require('../models');
const slugify = require('../config/slugify');
const { getPagination, getPagingData } = require('../config/common');
// Create Category
exports.createCategory = async (req, res) => {
  try {
    const data = req.body;
    if (data.name) data.slug = slugify(data.name);

    await Category.create(data);
    res.status(201).json({
      success: true,
      status: 201,
      message: 'Category created successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Failed to create category',
    });
  }
};

exports.getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({
      where: { slug: req.params.slug },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'Category not found',
      });
    }

    res.json({
      success: true,
      status: 200,
      data: category,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Failed to fetch category',
    });
  }
};

exports.getCategorydropdwon = async (req, res) => {
  try {
    const { type } = req.query;

    let whereCondition = { deletedAt: null, parent_category_id: null };
    if (type === 'banner') {
      whereCondition.is_block = false;
    }

     const parent = await Category.findOne({
      where: whereCondition,
      attributes: ['id', 'name', 'slug', 'image'],
      order: [['createdAt', 'ASC']]
    });

    if (!parent) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'Parent category not found',
      });
    }

    // Step 2: Get children of this parent
    const children = await Category.findAll({
      where: {
        deletedAt: null,
        parent_category_id: parent.id
      },
      attributes: ['id', 'name', 'slug', 'image', 'parent_category_id']
    });

    // Step 3: Merge parent + children into one array
    const finalData = [
      parent.toJSON(),
      ...children.map(c => c.toJSON())
    ];

    return res.status(200).json({
      success: true,
      status: 200,
      data: finalData
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Failed to fetch category dropdown'
    });
  }
};

exports.deleteCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ where: { slug: req.params.slug } });

    if (!category) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'Category not found',
      });
    }

    await category.destroy(); // Soft delete (sets deletedAt automatically)

    res.json({
      success: true,
      status: 200,
      message: 'Category deleted successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Failed to delete category',
    });
  }
};

exports.updateCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const data = req.body;

    if (data.name) data.slug = slugify(data.name);

    const category = await Category.findOne({ where: { slug } });
    let oldName = category.name
    // If the name changed, update all products that reference this category
    if (data.name && data.name !== oldName) {
      // Find all products that have this category in their category field
      const products = await Product.findAll({
        where: {
          category: oldName // Look for products with the old category name
        }
      });

      // Update each product's category to the new name
      await Promise.all(products.map(product =>
        Product.update(
          { category: data.name },
          { where: { id: product.id } }
        )
      ));
    }
    if (!category) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'Category not found',
      });
    }

    await category.update(data);

    res.json({
      success: true,
      status: 200,
      message: 'Category updated successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Failed to update category',
    });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const { page = 1, size = 10, s = '' } = req.query;
    const { limit, offset } = getPagination(page, size);

    // Build search condition
    const whereCondition = { deletedAt: null  ,parent_category_id:null};
    if (s) {
      whereCondition[Op.or] = [
        { name: { [Op.like]: `%${s}%` } },
        { slug: { [Op.like]: `%${s}%` } }
      ];
    }

    // Fetch with pagination
    const data = await Category.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    // Format paginated data
    const response = getPagingData(data, page, limit);

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Categories fetched successfully',
      data: response,
    });
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Failed to get categories',
    });
  }
};


// exports.getAllCategories = async (req, res) => {
//   try {
//     const { page, size, s = '' } = req.query;
//     const { limit, offset } = getPagination(page, size);

//     // Step 1: Fetch all categories (with pagination and soft-delete check)
//     const data = await Category.findAndCountAll({
//       where: { deletedAt: null },
//       limit,
//       offset,
//       order: [['createdAt', 'DESC']],
//     });

//     const categories = data.rows.map(cat => cat.toJSON());

//     // Step 2: Extract unique parent_category_ids
//     const parentCategoryIds = [...new Set(
//       categories.map(cat => cat.parent_category_id).filter(id => id !== null)
//     )];

//     // Step 3: Fetch parent category names in one query
//     const parentCategories = await Category.findAll({
//       where: { id: parentCategoryIds },
//       attributes: ['id', 'name']
//     });

//     const parentMap = {};
//     parentCategories.forEach(cat => {
//       parentMap[cat.id] = cat.name;
//     });

//     // Step 4: Add parent_category_name to each category
//     const result = categories.map(cat => ({
//       ...cat,
//       parent_category_name: cat.parent_category_id ? parentMap[cat.parent_category_id] || null : null
//     }));

//     // Step 5: Apply global search (if `s` is passed)
//     const filteredResults = s
//       ? result.filter(category => {
//           const stringified = JSON.stringify(category).toLowerCase();
//           return stringified.includes(s.toLowerCase());
//         })
//       : result;

//     // Step 6: Format paginated response manually (because search applies after DB fetch)
//     const pagedData = filteredResults.slice(0, limit);
//     const response = {
//       totalItems: filteredResults.length,
//       totalPages: Math.ceil(filteredResults.length / limit),
//       currentPage: Number(page) || 1,
//       data: pagedData
//     };

//     res.status(200).json({
//       success: true,
//       status: 200,
//       message: 'Categories fetched successfully',
//       data: response,
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       success: false,
//       status: 500,
//       message: 'Failed to get categories',
//     });
//   }
// };
// exports.getAllCategories = async (req, res) => {
//   try {
//     const { page, size } = req.query;
//     const { limit, offset } = getPagination(page, size);

//     // Step 1: Fetch all categories (with pagination)
//     const data = await Category.findAndCountAll({
//       where: { deletedAt: null },
//       limit,
//       offset,
//       order: [['createdAt', 'DESC']],
//     });
    

//     const categories = data.rows.map(cat => cat.toJSON());

//     // Step 2: Extract unique parent_category_ids
//     const parentCategoryIds = [...new Set(
//       categories.map(cat => cat.parent_category_id).filter(id => id !== null)
//     )];

//     // Step 3: Fetch parent category names in one query
//     const parentCategories = await Category.findAll({
//       where: { id: parentCategoryIds },
//       attributes: ['id', 'name']
//     });

//     const parentMap = {};
//     parentCategories.forEach(cat => {
//       parentMap[cat.id] = cat.name;
//     });

//     // Step 4: Add parent_category_name to each category
//     const result = categories.map(cat => ({
//       ...cat,
//       parent_category_name: cat.parent_category_id ? parentMap[cat.parent_category_id] || null : null
//     }));

//     // Step 5: Format response
//     const response = getPagingData({ ...data, rows: result }, page, limit);

//     res.status(200).json({
//       success: true,
//       status: 200,
//       message: 'Categories fetched successfully',
//       data: response,
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       success: false,
//       status: 500,
//       message: 'Failed to get categories',
//     });
//   }
// };

