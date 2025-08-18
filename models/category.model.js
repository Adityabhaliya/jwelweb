const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Category = sequelize.define('Category', {
    name: { type: DataTypes.STRING },
    image: { type: DataTypes.STRING },
    slug: { type: DataTypes.STRING },
    parent_category_id: { type: DataTypes.INTEGER },
    deletedAt: { type: DataTypes.DATE },
    is_block: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_home: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_header: { type: DataTypes.BOOLEAN, defaultValue: false },
  }, {
    timestamps: true,
    paranoid: true,
  });

  // ✅ Self-referencing associations
  Category.belongsTo(Category, {
    as: 'parentCategory',
    foreignKey: 'parent_category_id'
  });

  Category.hasMany(Category, {
    as: 'subCategories',
    foreignKey: 'parent_category_id'
  });

  return Category;
};
