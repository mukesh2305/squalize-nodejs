// const sequelize = require('../config/db.config.js');
// var Sequelize = require('sequelize');
const User = require('./user.model');
const Product = require('./product.model');

module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define("order", {
        id: {
            field: 'id',
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            unique: true,
            autoIncrement: true,
        },
        userId: {
            type: Sequelize.INTEGER,
            references: {
                model: User,
                key: 'id'
            }

        },
        productId: {
            type: Sequelize.INTEGER,
            references: {
                model: Product,
                key: 'id'
            }
        },
        quantity: {
            type: Sequelize.INTEGER
        },
        cost: {
            type: Sequelize.INTEGER
        }
    });

    // Order.belongsTo(User, { as: 'User', foreignKey: 'userId', targetKey: 'id' });
    // Order.belongsTo(Product, { as: 'Product', foreignKey: 'productId', targetKey: 'id' });
    return Order;
};