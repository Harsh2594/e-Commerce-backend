/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order Management APIs
 */

const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const verifyToken = require("../middlewares/verifyToken");
const notAnAdmin = require("../middlewares/notAnAdmin");

//create_order_routes
/**
 * @swagger
 * /api/orders/create:
 *   post:
 *     summary: Create order from cart
 *     description: Creates a new order from the user's cart after validating stock and applying reward points.
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentMethod
 *               - shippingAddress
 *             properties:
 *               paymentMethod:
 *                 type: string
 *                 enum:
 *                   - COD
 *                   - CARD
 *                   - UPI
 *                 example: COD
 *               shippingAddress:
 *                 type: string
 *                 example: "123 Main Street, Delhi, India"
 *     responses:
 *       201:
 *         description: Order placed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Order placed successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "664abc123def456789012345"
 *                     publicId:
 *                       type: string
 *                       example: "ORD-1001"
 *                     user:
 *                       type: string
 *                       description: MongoDB User ID reference
 *                       example: "663fff000aaa111222333444"
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           product:
 *                             type: string
 *                             example: "662aaa111bbb222333444555"
 *                           price:
 *                             type: number
 *                             example: 500.00
 *                           quantity:
 *                             type: integer
 *                             example: 3
 *                           sourcePost:
 *                             type: string
 *                             nullable: true
 *                             example: null
 *                     totalAmount:
 *                       type: number
 *                       example: 1500
 *                     redeemedPoints:
 *                       type: number
 *                       example: 150
 *                     finalAmount:
 *                       type: number
 *                       example: 1350
 *                     paymentMethod:
 *                       type: string
 *                       enum:
 *                         - COD
 *                         - CARD
 *                         - UPI
 *                       example: COD
 *                     paymentStatus:
 *                       type: string
 *                       enum:
 *                         - pending
 *                         - paid
 *                         - failed
 *                       example: pending
 *                     shippingAddress:
 *                       type: string
 *                       example: "123 Main Street, Delhi, India"
 *                     orderStatus:
 *                       type: string
 *                       enum:
 *                         - pending
 *                         - confirmed
 *                         - shipped
 *                         - delivered
 *                         - cancelled
 *                       example: pending
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       400:
 *         description: Validation error or insufficient stock
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                 data:
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   nullable: true
 *                   example: null
 *             examples:
 *               payment_method_required:
 *                 summary: Missing payment method
 *                 value:
 *                   success: false
 *                   message: "Payment method is required"
 *                   data: null
 *                   error: null
 *               payment_method_invalid:
 *                 summary: Invalid payment method
 *                 value:
 *                   success: false
 *                   message: "Invalid payment method. Allowed values: COD, CARD, UPI"
 *                   data: null
 *                   error: null
 *               shipping_address_required:
 *                 summary: Missing shipping address
 *                 value:
 *                   success: false
 *                   message: "Shipping address is required"
 *                   data: null
 *                   error: null
 *               cart_empty:
 *                 summary: Cart is empty
 *                 value:
 *                   success: false
 *                   message: "Cart is Empty"
 *                   data: []
 *                   error: null
 *               product_unavailable:
 *                 summary: Product inactive or deleted
 *                 value:
 *                   success: false
 *                   message: "Product \"Wireless Headphones\" is unavailable"
 *                   data: null
 *                   error: null
 *               insufficient_stock:
 *                 summary: Not enough stock
 *                 value:
 *                   success: false
 *                   message: "Insufficient stock for \"Wireless Headphones\""
 *                   data: null
 *                   error: null
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to create order
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Failed to create order"
 *                 data:
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   type: string
 *                   example: "Unexpected error occurred"
 */

router.post("/create", verifyToken, notAnAdmin, orderController.createOrder);

//get_orders_routes
/**
 * @swagger
 * /api/orders/my-orders:
 *   get:
 *     summary: Get my orders
 *     description: Fetch all orders placed by the logged-in user. Requires JWT authentication.
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Orders found
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 64order123456
 *                       items:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             product:
 *                               type: object
 *                               properties:
 *                                 _id:
 *                                   type: string
 *                                   example: 64prod123456
 *                                 name:
 *                                   type: string
 *                                   example: iPhone 14
 *                                 price:
 *                                   type: number
 *                                   example: 79999
 *                                 images:
 *                                   type: array
 *                                   items:
 *                                     type: string
 *                                     example: iphone.jpg
 *                             quantity:
 *                               type: integer
 *                               example: 1
 *                             price:
 *                               type: number
 *                               example: 79999
 *                       totalAmount:
 *                         type: number
 *                         example: 79999
 *                       paymentMethod:
 *                         type: string
 *                         example: COD
 *                       paymentStatus:
 *                         type: string
 *                         example: pending
 *                       status:
 *                         type: string
 *                         example: pending
 *                       createdAt:
 *                         type: string
 *                         example: 2025-01-21T10:30:00Z
 *                 error:
 *                   type: string
 *                   example: null
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to fetch orders
 */

router.get("/my-orders", verifyToken, notAnAdmin, orderController.getOrders);

//get_order_by_id
/**
 * @swagger
 * /api/orders/{orderId}:
 *   get:
 *     summary: Get order by ID
 *     description: Fetch a single order by its order ID. Requires JWT authentication.
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Orders found
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64order123456
 *                     user:
 *                       type: string
 *                       example: 64user123456
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           product:
 *                             type: string
 *                             example: 64prod123456
 *                           price:
 *                             type: number
 *                             example: 79999
 *                           quantity:
 *                             type: integer
 *                             example: 1
 *                     totalAmount:
 *                       type: number
 *                       example: 79999
 *                     paymentMethod:
 *                       type: string
 *                       example: COD
 *                     paymentStatus:
 *                       type: string
 *                       example: pending
 *                     status:
 *                       type: string
 *                       example: pending
 *                     createdAt:
 *                       type: string
 *                       example: 2025-01-21T10:30:00Z
 *                 error:
 *                   type: string
 *                   example: null
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: No orders found
 *                 data:
 *                   type: array
 *                   example: []
 *                 error:
 *                   type: string
 *                   example: null
 *       500:
 *         description: Failed to fetch orders
 */

router.get("/:orderId", verifyToken, notAnAdmin, orderController.getOrdersById);

//Cancel_order_by_id
/**
 * @swagger
 * /api/orders/{orderId}/cancel:
 *   patch:
 *     summary: Cancel order
 *     description: Cancel an order placed by the logged-in user. Cannot cancel shipped or delivered orders. Rewards will be refunded if applicable.
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID to cancel
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Order cancelled successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64order123456
 *                     orderStatus:
 *                       type: string
 *                       example: cancelled
 *                     paymentStatus:
 *                       type: string
 *                       example: refunded
 *                     redeemedPoints:
 *                       type: number
 *                       example: 100
 *                     rewardDeducted:
 *                       type: boolean
 *                       example: false
 *                 error:
 *                   type: string
 *                   example: null
 *       400:
 *         description: Order cannot be cancelled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Order can not be canceled
 *                 data:
 *                   type: null
 *                 error:
 *                   type: string
 *                   example: null
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 *       500:
 *         description: Cancel failed
 */

router.patch(
  "/:orderId/cancel",
  verifyToken,
  notAnAdmin,
  orderController.cancelOrderById,
);

//Return_Order
/**
 * @swagger
 * /api/orders/{orderId}/return:
 *   patch:
 *     summary: Return delivered order
 *     description: Return a delivered order. Refunds payment and restores redeemed reward points. Also reverses influencer rewards if applicable.
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID to return
 *     responses:
 *       200:
 *         description: Order returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Order returned successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64order123456
 *                     orderStatus:
 *                       type: string
 *                       example: returned
 *                     paymentStatus:
 *                       type: string
 *                       example: refunded
 *                     redeemedPoints:
 *                       type: number
 *                       example: 100
 *                     rewardProcessed:
 *                       type: boolean
 *                       example: false
 *                 error:
 *                   type: string
 *                   example: null
 *       400:
 *         description: Order cannot be returned before delivery
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 *       500:
 *         description: Return failed
 */

router.patch(
  "/:orderId/return",
  verifyToken,
  notAnAdmin,
  orderController.returnOrder,
);

module.exports = router;
