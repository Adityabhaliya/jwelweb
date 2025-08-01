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
    const banners = await Banner.findAll({
      where: { deletedAt: null },
      order: [['createdAt', 'DESC']],
    });

    const bannersData = banners.map(b => b.toJSON());

    // Extract unique category_ids from banners
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

    res.json({ success: true, data: enrichedBanners });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch banners' });
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
