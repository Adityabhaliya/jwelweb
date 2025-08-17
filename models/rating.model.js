const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('ratings', {
    name: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING },
    review_count: { type: DataTypes.STRING },
      
    }, {
      timestamps: true,   
      paranoid: true,    
    });
   
};
    