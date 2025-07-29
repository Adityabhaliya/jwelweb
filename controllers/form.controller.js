const { Daimond, contactSchema } = require('../models');
const slugify = require('../config/slugify');
const { getPagination, getPagingData } = require('../config/common');

exports.createform = async (req, res) => {
    try {
        if (req.query.type === 'daimond') {

            const data = req.body;

            const form = await Daimond.create(data);

            return res.status(200).json({
                success: true,
                status: 200,
                message: 'form submit successfully',
                data: form,
            });
        } else {

            const data = req.body;

            const form = await contactSchema.create(data);

            return res.status(200).json({
                success: true,
                status: 200,
                message: 'form submit successfully',
                data: form,
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            status: 500,
            message: 'Failed to create form',
        });
    }
};


exports.getAllform = async (req, res) => {
    try {
        const { page, size } = req.query;
        const { limit, offset } = getPagination(page, size);

        const data = await Daimond.findAndCountAll({
            limit,
            offset,
            order: [['id', 'DESC']],
        });

        const response = getPagingData(data, page, limit);

        res.status(200).json({
            success: true,
            status: 200,
            message: 'form fetched successfully',
            data: response,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            status: 500,
            message: 'Failed to get form',
        });
    }
};