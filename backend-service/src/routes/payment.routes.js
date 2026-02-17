/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment Management APIs
 */

const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const verifyToken = require("../middlewares/verifyToken");
const notAnAdmin = require("../middlewares/notAnAdmin");

/**
 * @swagger
 * /api/payment/mockPayment:
 *   post:
 *     summary: Mock payment for an order
 *     description: Simulate payment for an order. Used for testing purposes. User access only.
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - paymentStatus
 *             properties:
 *               orderId:
 *                 type: string
 *                 example: 64order123456
 *               paymentStatus:
 *                 type: string
 *                 enum:
 *                   - success
 *                   - failed
 *                 example: success
 *     responses:
 *       200:
 *         description: Payment processed successfully
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
 *                   example: Payment processed
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64pay123456
 *                     order:
 *                       type: string
 *                       example: 64order123456
 *                     amount:
 *                       type: number
 *                       example: 79999
 *                     paymentStatus:
 *                       type: string
 *                       example: success
 *                     transactionId:
 *                       type: string
 *                       example: SBI-1705839200000
 *                 error:
 *                   type: string
 *                   example: null
 *       400:
 *         description: Invalid payment status or order already processed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin not allowed
 *       404:
 *         description: Order not found
 *       500:
 *         description: Payment failed
 */

router.post(
  "/mockPayment",
  verifyToken,
  notAnAdmin,
  paymentController.mockPayment,
);

module.exports = router;
