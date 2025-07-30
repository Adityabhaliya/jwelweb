const sequelize = require('../db/db');
 const Product = require('./product.model')(sequelize);
const User = require('./user.model')(sequelize);
const Category = require('./category.model')(sequelize);
const Setting = require('./setting.model')(sequelize);
const Daimond = require('./daimond.form.model')(sequelize);
const Banner = require('./banners.model')(sequelize);
const contactSchema = require('./contact.schema')(sequelize);
const customjwel = require('./customjwel.model')(sequelize);

module.exports = {
  sequelize,
  Product,
  User,
  Category,
  Setting,
  Daimond,
  Banner,
  contactSchema,
  customjwel

};
