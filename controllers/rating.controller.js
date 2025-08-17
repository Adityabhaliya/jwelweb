const { getPagination } = require('../config/common');
const { Rating } = require('../models');

// CREATE
exports.createRating = async (req, res) => {
    try {
        const rating = await Rating.create(req.body);
        res.status(201).json({ success: true, message: 'Rating created', data: rating });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Creation failed' });
    }
};

// GET ALL
exports.getAllRatings = async (req, res) => {
    try {
        const { page = 1, size = 10, s = '' } = req.query;
        const { limit, offset } = getPagination(page, size);

        // Fetch with pagination
        const data = await Rating.findAndCountAll({
            limit,
            offset,
            order: [['id', 'DESC']],
        });

        // Convert rows to JSON
        const records = data.rows.map(r => r.toJSON());

        // Apply search (case-insensitive, full object search)
        const filtered = s
            ? records.filter(item =>
                JSON.stringify(item).toLowerCase().includes(s.toLowerCase())
            )
            : records;

        // Paginate manually after search
        const paginated = filtered.slice(0, limit);

        // Prepare response
        const response = {
            totalItems: data.count,
            totalPages: Math.ceil(filtered.length / limit),
            currentPage: Number(page),
            data: paginated,
        };

        res.status(200).json({
            success: true,
            status: 200,
            message: 'Ratings fetched successfully',
            data: response,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Fetch failed' });
    }
};

exports.getAllRatingsUser = async (req, res) => {
    try {
      const ratings = await Rating.findAll({
        where: { deletedAt: null }, 
        order: [['id', 'DESC']],
      });
  
      res.status(200).json({
        success: true,
        status: 200,
        message: 'Ratings fetched successfully',
        data: ratings,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        status: 500,
        message: 'Failed to fetch ratings',
      });
    }
  };
  

// GET BY ID
exports.getRatingById = async (req, res) => {
    try {
        const rating = await Rating.findByPk(req.params.id);
        if (!rating) return res.status(404).json({ success: false, message: 'Rating not found' });

        res.status(200).json({ success: true, data: rating });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Fetch failed' });
    }
};

// UPDATE
exports.updateRating = async (req, res) => {
    try {
        const { id } = req.params;
        const rating = await Rating.findByPk(id);
        if (!rating) return res.status(404).json({ success: false, message: 'Rating not found' });

        await rating.update(req.body);
        res.json({ success: true, message: 'Updated successfully', data: rating });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Update failed' });
    }
};

// DELETE (soft delete)
exports.deleteRating = async (req, res) => {
    try {
        const { id } = req.params;
        const rating = await Rating.findByPk(id);
        if (!rating) return res.status(404).json({ success: false, message: 'Rating not found' });

        await rating.destroy();
        res.json({ success: true, message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Delete failed' });
    }
};
