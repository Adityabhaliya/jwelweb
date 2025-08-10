const { Op } = require('sequelize');
const { Daimond, contactSchema, customjwel } = require('../models');
const slugify = require('../config/slugify');
const { getPagination, getPagingData } = require('../config/common');

exports.createform = async (req, res) => {
    try {
        if (req.query.type === 'diamond') {

            const data = req.body;

            const form = await Daimond.create(data);

            return res.status(200).json({
                success: true,
                status: 200,
                message: 'form submit successfully',
                data: form,
            });
        }else if(req.query.type === 'custom-jewelry'){
          const data = req.body;

          const form = await customjwel.create(data);

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
    const { page = 1, size = 10, type, s = '' } = req.query;
    const { limit, offset } = getPagination(page, size);

    let model, modelName;

    if (type === 'diamond') {
      model = Daimond;
      modelName = 'Diamond';
    }else if(type === 'custom-jewelry'){
      model = customjwel;
      modelName = 'custom-jewelry';
    } else {
      model = contactSchema;
      modelName = 'Contact';
    }

    // Fetch all data without search filter first
    const data = await model.findAndCountAll({
      limit,
      offset,
      order: [['id', 'DESC']],
    });

    // Convert rows to JSON
    const records = data.rows.map(row => row.toJSON());

    // Apply search on JSON string (case-insensitive)
    const filtered = s
      ? records.filter(item => JSON.stringify(item).toLowerCase().includes(s.toLowerCase()))
      : records;

    // Paginate manually after search
    const paginated = filtered.slice(0, limit);
    const response = {
      totalItems: data.count,
      totalPages: Math.ceil(filtered.length / limit),
      currentPage: Number(page),
      data: paginated
    };

    res.status(200).json({
      success: true,
      status: 200,
      message: `${modelName} form fetched successfully`,
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


// exports.getAllform = async (req, res) => {
//     try {
//         const { page, size, type } = req.query;
//         if (type === 'daimond') {

//             const { limit, offset } = getPagination(page, size);

//             const data = await Daimond.findAndCountAll({
//                 limit,
//                 offset,
//                 order: [['id', 'DESC']],
//             });

//             const response = getPagingData(data, page, limit);

//             res.status(200).json({
//                 success: true,
//                 status: 200,
//                 message: 'form fetched successfully',
//                 data: response,
//             });
//         } else {
//             const { limit, offset } = getPagination(page, size);

//             const data = await contactSchema.findAndCountAll({
//                 limit,
//                 offset,
//                 order: [['id', 'DESC']],
//             });

//             const response = getPagingData(data, page, limit);

//             res.status(200).json({
//                 success: true,
//                 status: 200,
//                 message: 'form fetched successfully',
//                 data: response,
//             });
//         }
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({
//             success: false,
//             status: 500,
//             message: 'Failed to get form',
//         });
//     }
// };

exports.delete = async (req, res) => {
    try {
      const { id } = req.params;
      const { type } = req.query;
  
      if (!id || !type) {
        return res.status(400).json({
          success: false,
          message: 'ID and type are required',
        });
      }
  
      let model;
  
      if (type === 'diamond') {
        model = Daimond; // your Sequelize model for diamond_orders
      } else if (type === 'custom-jewelry') {
        model = customjwel; // your Sequelize model for contact_messages
      }  else if (type === 'contactus') {
        model = contactSchema; // your Sequelize model for contact_messages
      }else {
        return res.status(400).json({
          success: false,
          message: 'Invalid form type',
        });
      }
  
      const record = await model.findByPk(id);
  
      if (!record) {
        return res.status(404).json({
          success: false,
          message: 'Form not found',
        });
      }
  
      await record.destroy(); // Sequelize soft delete with paranoid
  
      res.status(200).json({
        success: true,
        message: 'Form deleted successfully',
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: 'Failed to delete form',
      });
    }
  };
  