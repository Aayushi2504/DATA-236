'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    static associate(models) {
      // Define associations here (if any)
    }
  }
  Book.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false, // Title cannot be null
      },
      author: {
        type: DataTypes.STRING,
        allowNull: false, // Author cannot be null
      },
    },
    {
      sequelize,
      modelName: 'Book', // Name of the model
    }
  );
  return Book;
};
