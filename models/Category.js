const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection.js');

class Category extends Model {}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    category_name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    //Turns off auto-generated Timestamps. (By default, Sequelize automatically adds the attributes createdAt and updatedAt to every model, using the data type DataTypes.)
    timestamps: false,
    //doesn't pluralize table name
    freezeTableName: true,
    underscored: true,
    modelName: 'category',
  }
);

module.exports = Category;
