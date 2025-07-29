const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('ContactMessage', {
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    email_address: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    contact_subject: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'contact_messages',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
};
