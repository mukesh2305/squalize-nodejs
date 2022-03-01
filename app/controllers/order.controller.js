const db = require("../model");
// const Joi = require('@hapi/joi');
const { createOrderValidation, reportByUserAndProductValidation } = require('../validate/validate')

const Order = db.orders;
const Product = db.products;
const User = db.users;
const sequelize = require('sequelize');
// const Product = require("../model/product.model");
// const Product = db.products;
const Op = db.Sequelize.Op;
// Create and Save a new order
exports.create = (req, res) => {
    const { quantity, cost, productId, userId } = req.body
    const order = {
        quantity, cost, productId, userId,
    };

    response = createOrderValidation(order)
    console.log(response)
    if (response.error) {
        return res.status(400).send({ errorMessage: response.error.details[0].message });

    } else {
        Order.create(order)
            .then(data => {
                res.send(
                    {
                        message: "success",
                        data
                    });
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while creating the order."
                });
            });
    }

}

// Retrieve all orders from the database
exports.findAll = async (req, res) => {

    // const title = req.query.title;
    // var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
    await Order.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Orders."
            });
        });
};
// Find a single Order with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Order.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find order with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving order with id=" + id
            });
        });

};
// Update a Order by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    Order.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            console.log(">>>>>>>>>>>>>>>>>>>>>", num)
            if (num == 1) {
                res.send({
                    message: "order was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update order with id=${id}. Maybe order was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating order with id=" + id
            });
        });
};
// Delete a Order with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Order.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "order was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete order with id=${id}. Maybe order was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete order with id=" + id
            });
        });
};
// Delete all Orders from the database.
exports.deleteAll = (req, res) => {
    Order.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} orders were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all orders."
            });
        });
};



exports.reportByProduct = (req, res) => {
    var { startDate, endDate } = req.body
    console.log("startDate", startDate)
    const dates = {
        startDate, endDate
    }
    let response = reportByUserAndProductValidation(dates)


    if (response.error) {
        return res.status(400).send({ errorMessage: response.error.details[0].message });
    } else {
        var startDate = new Date(startDate);
        var endDate = new Date(endDate);
        const condition = {
            attributes: [
                [sequelize.fn("sum", sequelize.col("quantity")), "total_quantity"],
                [sequelize.fn("sum", sequelize.col("order.cost")), "total_cost"],
                "productId",
            ],
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate]
                },
            },
            include: { model: Product, as: 'Product' },

            group: ["productId"],
        };
        Order.findAll(condition)
            .then(data => {
                res.send(data);

            }).catch(err => {
                console.log("error", err)
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while fetching all data."
                });
            });
    }
};

exports.reportByUser = (req, res) => {
    var { startDate, endDate } = req.body
    const dates = {
        startDate,
        endDate
    }

    let response = reportByUserAndProductValidation(dates)
    if (response.error) {
        return res.status(400).send({ errorMessage: response.error.details[0].message });
    } else {
        var startDate = new Date(startDate);
        var endDate = new Date(endDate);
        const condition = {
            attributes: [
                [sequelize.fn("sum", sequelize.col("quantity")), "total_quantity"],
                [sequelize.fn("count", sequelize.col("order.id")), "total_product_count"],
                "userId",
            ],
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate]
                },
            },
            include: { model: User, as: 'User' },

            group: ["userId"],
        };
        Order.findAll(condition)
            .then(data => {
                res.send(data);

            }).catch(err => {
                console.log("error", err)
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while fetching all data."
                });
            });
    }
};
