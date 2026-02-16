/**
 * @swagger
 * tags:
 *   name: Wallet
 *   description: Wallet Management APIs
 */

const express = require("express");
const router = express.Router();
const walletController = require("../controllers/wallet.controller");
const verifyToken = require("../middlewares/verifyToken");
const notAnAdmin = require("../middlewares/notAnAdmin");

//get_wallet_history
/**
 * @swagger
 * /api/wallet/history:
 *   get:
 *     summary: Get wallet transaction history
 *     description: Fetch all reward point transactions of the logged-in user. Requires JWT authentication.
 *     tags:
 *       - Wallet
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wallet history fetched successfully
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
 *                   example: Wallet history found successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 64txn123456
 *                       user:
 *                         type: string
 *                         example: 64user123456
 *                       points:
 *                         type: number
 *                         example: 100
 *                       type:
 *                         type: string
 *                         example: REDEEM_REFUND
 *                       source:
 *                         type: string
 *                         example: ORDER_CANCEL
 *                       referenceId:
 *                         type: string
 *                         example: 64order123456
 *                       createdAt:
 *                         type: string
 *                         example: 2025-01-23T10:30:00Z
 *                 error:
 *                   type: string
 *                   example: null
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to fetch wallet history
 */
router.get(
  "/history",
  verifyToken,
  notAnAdmin,
  walletController.getWalletHistory,
);

//get_wallet_balance
/**
 * @swagger
 * /api/wallet/balance:
 *   get:
 *     summary: Get wallet balance
 *     description: Fetch the reward points balance of the logged-in user. Requires JWT authentication.
 *     tags:
 *       - Wallet
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wallet balance fetched successfully
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
 *                   example: Wallet balance fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     balance:
 *                       type: number
 *                       example: 250
 *                 error:
 *                   type: string
 *                   example: null
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to fetch wallet balance
 */

router.get(
  "/balance",
  verifyToken,
  notAnAdmin,
  walletController.getWalletbalance,
);

//get_wallet_summary
/**
 * @swagger
 * /api/wallet/summary:
 *   get:
 *     summary: Get wallet summary
 *     description: Fetch aggregated wallet summary including total earned, redeemed, refunded points and current balance. Requires JWT authentication.
 *     tags:
 *       - Wallet
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wallet summary fetched successfully
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
 *                   example: Wallet summary found successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalEarned:
 *                       type: number
 *                       example: 1000
 *                     totalRedeemed:
 *                       type: number
 *                       example: 300
 *                     totalRefunded:
 *                       type: number
 *                       example: 100
 *                     currentBalance:
 *                       type: number
 *                       example: 800
 *                 error:
 *                   type: string
 *                   example: null
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to fetch wallet summary
 */

router.get(
  "/summary",
  verifyToken,
  notAnAdmin,
  walletController.getWalletSummary,
);

module.exports = router;
