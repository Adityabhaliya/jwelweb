const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('User', {

    name: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: true },
    lastname: { type: DataTypes.STRING, allowNull: true },
    password: { type: DataTypes.STRING, allowNull: true },
    profile: { type: DataTypes.STRING, allowNull: true },
    reset_token: { type: DataTypes.STRING, allowNull: true },
    role: { type: DataTypes.INTEGER, allowNull: false },
    last_login: { type: DataTypes.DATE, allowNull: true },
    is_block: { type: DataTypes.BOOLEAN },
    is_sub_admin: { type: DataTypes.BOOLEAN, default: false },
    access_json: { type: DataTypes.JSON, allowNull: true },
    deletedAt: { type: DataTypes.DATE },

  });
}; 
 