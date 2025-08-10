const { getPagination } = require('../config/common');
const { Banner, Category } = require('../models');

// CREATE Banner
exports.createBanner = async (req, res) => {
  try {
    const data = req.body;
    const banner = await Banner.create(data);
    res.status(201).json({ success: true, message: 'Banner created', data: banner });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Banner creation failed' });
  }
};

// GET All Banners
exports.getAllBanners = async (req, res) => {
  try {
    const { page = 1, size = 10, s = '' } = req.query;
    const { limit, offset } = getPagination(page, size);

    // Fetch banners with pagination
    const data = await Banner.findAndCountAll({
      where: { deletedAt: null },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    const bannersData = data.rows.map(b => b.toJSON());

    // Extract unique category_ids
    const categoryIds = [...new Set(bannersData.map(b => b.category_id).filter(Boolean))];

    // Fetch category names
    const categories = await Category.findAll({
      where: { id: categoryIds },
      attributes: ['id', 'name'],
    });

    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.id] = cat.name;
    });

    // Add category_name to each banner
    const enrichedBanners = bannersData.map(banner => ({
      ...banner,
      category_name: banner.category_id ? categoryMap[banner.category_id] || null : null,
    }));

    // Search filter (case-insensitive, full object search)
    const filteredBanners = s
      ? enrichedBanners.filter(banner =>
        JSON.stringify(banner).toLowerCase().includes(s.toLowerCase())
      )
      : enrichedBanners;

    // Paginate after search
    const pagedData = filteredBanners.slice(0, limit);

    // Prepare paginated response
    const response = {
      totalItems: data.count,
      totalPages: Math.ceil(filteredBanners.length / limit),
      currentPage: Number(page),
      data: pagedData
    };

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Banners fetched successfully',
      data: response,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Failed to fetch banners',
    });
  }
};


// GET Banner by ID
exports.getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findByPk(req.params.id);

    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    const bannerData = banner.toJSON();
    let categoryName = null;

    if (bannerData.category_id) {
      const category = await Category.findOne({
        where: { id: bannerData.category_id },
        attributes: ['name'],
      });

      categoryName = category ? category.name : null;
    }

    res.json({
      success: true,
      data: {
        ...bannerData,
        category_name: categoryName,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch banner' });
  }
};

// UPDATE Banner by ID
exports.updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByPk(id);

    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });

    await banner.update(req.body);
    res.json({ success: true, message: 'Updated successfully', data: banner });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Update failed' });
  }
};

// DELETE Banner by ID (soft delete)
exports.deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByPk(id);

    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });

    await banner.destroy();
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Delete failed' });
  }
};




exports.getAllBannersUser = async (req, res) => {
  try {
    const { s = '' } = req.query;

    // Fetch all banners (no pagination)
    const bannersData = await Banner.findAll({
      where: { deletedAt: null, is_block: false },
      order: [['createdAt', 'DESC']],
    }).then(banners => banners.map(b => b.toJSON()));

    // Extract unique category_ids
    const categoryIds = [...new Set(bannersData.map(b => b.category_id).filter(Boolean))];

    // Fetch category names
    const categories = await Category.findAll({
      where: { id: categoryIds },
      attributes: ['id', 'name'],
    });

    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.id] = cat.name;
    });

    // Add category_name to each banner
    const enrichedBanners = bannersData.map(banner => ({
      ...banner,
      category_name: banner.category_id ? categoryMap[banner.category_id] || null : null,
    }));

    // Search filter (case-insensitive, full object search)
    const filteredBanners = s
      ? enrichedBanners.filter(banner =>
          JSON.stringify(banner).toLowerCase().includes(s.toLowerCase())
        )
      : enrichedBanners;

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Banners fetched successfully',
      data: filteredBanners,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Failed to fetch banners',
    });
  }
};



// GET Banner by ID
exports.getBannerByIdUser = async (req, res) => {
  try {
    const banner = await Banner.findByPk(req.params.id);

    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    const bannerData = banner.toJSON();
    let categoryName = null;

    if (bannerData.category_id) {
      const category = await Category.findOne({
        where: { id: bannerData.category_id },
        attributes: ['name'],
      });

      categoryName = category ? category.name : null;
    }

    res.json({
      success: true,
      data: {
        ...bannerData,
        category_name: categoryName,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch banner' });
  }
};