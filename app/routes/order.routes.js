module.exports = app => {
    const orders = require("../controllers/order.controller.js");
    var router = require("express").Router();

    // Create a new Order
    router.post("/", orders.create);

    // Retrieve all orders
    router.get("/", orders.findAll);

    // Retrieve a single Order with id
    router.get("/:id", orders.findOne);

    // Update a Order with id
    router.put("/:id", orders.update);

    // Delete a Order with id
    router.delete("/:id", orders.delete);

    // Delete all orders
    router.delete("/", orders.deleteAll);
    // Order Report by Product for a given duration (Summary - Product, Total Qty, Cost)
    router.post("/report", orders.reportByProduct);
    router.post("/reportUser", orders.reportByUser);

    app.use('/api/orders', router);
};