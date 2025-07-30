const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('custom_jewelry', {
    f_name: { type: DataTypes.STRING },
    l_name: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    country_code: { type: DataTypes.STRING },
    design: { type: DataTypes.STRING },

    stonetype: { type: DataTypes.STRING },
    shape: { type: DataTypes.STRING },
    carat: { type: DataTypes.STRING },
    metal: { type: DataTypes.STRING },

    budget: { type: DataTypes.STRING },
    order_note: { type: DataTypes.TEXT },
    images: { type: DataTypes.JSON },

    other_contain: { type: DataTypes.TEXT },
    other_contain_stone_type: { type: DataTypes.STRING },
    other_contain_shape: { type: DataTypes.STRING },
    other_contain_carat: { type: DataTypes.STRING },
    other_contain_metal: { type: DataTypes.STRING },
    other_contain_budget: { type: DataTypes.STRING },
  }, {
    timestamps: true,
    paranoid: true, // enables soft delete (deletedAt)
  });
};
