import { Router } from 'express';
import { ProductController } from './v1/controllers/product.controllers';
import { isAuth } from './v1/midllewares/isAuthenticated';

const router = Router();

/**
 * @swagger
 * /create:
 *   post:
 *     summary: Create a new product
 *     description: Creates a new product with the specified name, description, and price.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Product Name"
 *               description:
 *                 type: string
 *                 example: "Product Description"
 *               price:
 *                 type: number
 *                 example: 99.99
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60c72b2f9b1e8c0a5f5f6e2d"
 *                 name:
 *                   type: string
 *                   example: "Product Name"
 *                 description:
 *                   type: string
 *                   example: "Product Description"
 *                 price:
 *                   type: number
 *                   example: 99.99
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/create', isAuth, ProductController.createProduct);

/**
 * @swagger
 * /buy:
 *   post:
 *     summary: Buy products
 *     description: Simulates a purchase of products by sending their IDs and the user's email to an AMQP queue and returns the order details.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["60c72b2f9b1e8c0a5f5f6e2d", "60c72b2f9b1e8c0a5f5f6e2e"]
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Purchase successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order:
 *                   type: object
 *                   properties:
 *                     products:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "60c72b2f9b1e8c0a5f5f6e2d"
 *                           name:
 *                             type: string
 *                             example: "Product Name"
 *                           description:
 *                             type: string
 *                             example: "Product Description"
 *                           price:
 *                             type: number
 *                             example: 99.99
 *                     userEmail:
 *                       type: string
 *                       example: "user@example.com"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/buy', isAuth, ProductController.buyProducts);

export default router;
