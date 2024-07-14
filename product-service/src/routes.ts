// product.routes.js
import { Router } from 'express';
import { ProductController } from './v1/controllers/product.controllers';
import { isAuth } from './v1/midllewares/isAuthenticated';
const router = Router();

router.post('/create', isAuth ,ProductController.createProduct);
router.post('/buy', isAuth , ProductController.buyProducts);

export default router;
