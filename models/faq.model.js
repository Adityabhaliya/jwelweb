const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('faqs', {
    question: { type: DataTypes.STRING },
    answer: { type: DataTypes.STRING },
    is_block: { type: DataTypes.BOOLEAN ,default:false},
      
    }, {
      timestamps: true,   
      paranoid: true,    
    });
   
};
    