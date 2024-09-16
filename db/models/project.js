const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

module.exports = sequelize.define('project', {

  id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Title cannot be null"
          },
          notEmpty: {
            msg: "Title cannot be Empty"
          }
        }
      },
      isFeatured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        validate: {
          isIn: {
            args: [[true, false]],
            msg: "Is Featured value must be True or False"
          }
        }
      },
      productImage: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        validate: {
          notNull: {
            msg: "Product images cannot be null"
          }
        }
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Price cannot be null"
          },
          isDecimal: {
            msg: "price value must be in decimal"
          }
        }
      },
      shortDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Short Description cannot be null"
          },
          notEmpty: {
            msg: "Short Description cannot be Empty"
          }
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Description cannot be null"
          },
          notEmpty: {
            msg: "Description cannot be Empty"
          }
        }
      },
      productUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Short Description cannot be null"
          },
          notEmpty: {
            msg: "Short Description cannot be Empty"
          },
          isUrl: {
            msg: "Invalid product URL string"
          }
        }
      },
      category: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        validate: {
          notNull: {
            msg: "Short Description cannot be null"
          },
          notEmpty: {
            msg: "Short Description cannot be Empty"
          }
        }
      },
      tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        validate: {
          notNull: {
            msg: "Tags cannot be null"
          },
          notEmpty: {
            msg: "Tags cannot be Empty"
          }
        }
      },
      createdBy: {
        type: DataTypes.INTEGER,
        references: {
          model: "user", // Ensure the model name is correct
          key: "id",
        },
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      }
}, {
  paranoid: true,
  freezeTableName: true
})