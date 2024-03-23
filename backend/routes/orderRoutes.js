const express = require('express');
const router = express.Router();
const orderController = require('../controllers/ordersController');

router.route('/')
    .get(orderController.getOrders)
    .post(orderController.addOrder);

router.route('/pos/:id')
    .get(orderController.getOrdersByPosId);

router.route('/:id')
    .get(orderController.getOrderById)
    .patch(orderController.updateOrder)
    .delete(orderController.deleteOrder);

module.exports = router;