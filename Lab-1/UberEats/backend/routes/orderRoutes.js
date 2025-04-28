const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Place Order
router.post('/', orderController.placeOrder);

// Update Order Status
router.put('/:order_id/status', orderController.updateOrderStatus);

// Update Order (same as above but separately kept)
router.put('/:order_id', orderController.updateOrder);

// Get Order by ID
router.get('/:order_id', orderController.getOrderById);

// Get Customer for Order
router.get('/:order_id/customer', orderController.getCustomerForOrder);

module.exports = router;
