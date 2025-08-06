const { Op, where } = require("sequelize");
const { faqs } = require("../models");
const { getPagination } = require("../config/common");

exports.createFaq = async (req, res) => {
    try {
        const { question, answer, is_block } = req.body;

        const faq = await faqs.create({ question, answer, is_block: false });

        res.status(201).json({
            success: true,
            message: 'FAQ created successfully',
            data: faq
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to create FAQ' });
    }
};

// Update FAQ
exports.updateFaq = async (req, res) => {
    try {
        const { id } = req.params;
        const { question, answer, is_block } = req.body;

        const faq = await faqs.findByPk(id);
        if (!faq) {
            return res.status(404).json({ success: false, message: 'FAQ not found' });
        }

        await faq.update({ question, answer, is_block });

        res.json({ success: true, message: 'FAQ updated successfully', data: faq });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to update FAQ' });
    }
};

// Get All FAQs (with pagination & search)
exports.getAllFaqs = async (req, res) => {
    try {
        const { page = 1, size = 10, s = '' } = req.query;
        const { limit, offset } = getPagination(page, size);

        const data = await faqs.findAndCountAll({
            limit,
            offset,
            order: [['createdAt', 'DESC']],
        });

        const faqsData = data.rows.map(faq => faq.toJSON());

        const filteredFaqs = s
            ? faqsData.filter(faq =>
                JSON.stringify(faq).toLowerCase().includes(s.toLowerCase())
            )
            : faqsData;

        const pagedData = filteredFaqs.slice(0, limit);

        const response = {
            totalItems: filteredFaqs.length,
            totalPages: Math.ceil(filteredFaqs.length / limit),
            currentPage: Number(page),
            data: pagedData
        };

        res.status(200).json({
            success: true,
            status: 200,
            message: 'FAQs fetched successfully',
            data: response,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            status: 500,
            message: 'Failed to fetch FAQs',
        });
    }
};

// Get FAQ by ID
exports.getFaqById = async (req, res) => {
    try {
        const { id } = req.params;
        const faq = await faqs.findByPk(id);

        if (!faq) {
            return res.status(404).json({ success: false, message: 'FAQ not found' });
        }

        res.json({ success: true, data: faq });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch FAQ' });
    }
};

// Soft Delete FAQ
exports.deleteFaq = async (req, res) => {
    try {
        const { id } = req.params;
        const faq = await faqs.findByPk(id);

        if (!faq) {
            return res.status(404).json({ success: false, message: 'FAQ not found' });
        }

        await faq.destroy(); // Soft delete because paranoid: true

        res.json({ success: true, message: 'FAQ deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to delete FAQ' });
    }
};


exports.getAllFaqsUser = async (req, res) => {
    try {

        const data = await faqs.findAll({
            where: { is_block: false },

            order: [['createdAt', 'DESC']],
        });
        res.status(200).json({
            success: true,
            status: 200,
            message: 'FAQs fetched successfully',
            data: data,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            status: 500,
            message: 'Failed to fetch FAQs',
        });
    }
};