// product.routes.js
import { Router } from 'express';
import { ProductController } from './v1/controllers/product.controllers';

const router = Router();

router.post('/create', ProductController.createProduct);
router.post('/buy', ProductController.buyProducts);

export default router;
