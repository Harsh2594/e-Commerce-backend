const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const uploadImagesController = require("../controllers/uploadImages.controller");
const verifyToken = require("../middlewares/verifyToken");
const isAdmin = require("../middlewares/isAdmin");

//upload_image
/**
 * @swagger
 * /api/uploads/upload-product-images:
 *   post:
 *     summary: Upload product images (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - images
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 66c9f21a9f1e8c0012a4b123
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Product images uploaded successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Product not found
 */

router.post(
  "/upload-product-images",
  verifyToken,
  isAdmin,
  upload.array("images", 5),
  uploadImagesController.uploadImages
);

//update_image
/**
 * @swagger
 * /api/uploads/update-product-images/{id}:
 *   put:
 *     summary: Update product images (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *           example: 66c9f21a9f1e8c0012a4b123
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - images
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Product images updated successfully
 *       400:
 *         description: No images uploaded
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Product not found
 */

router.put(
  "/update-product-images/:id",
  verifyToken,
  isAdmin,
  upload.array("images", 5),
  uploadImagesController.updateImages
);

module.exports = router;
