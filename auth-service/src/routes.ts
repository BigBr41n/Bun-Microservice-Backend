import { AuthController } from './v1/controllers/auth.controllers';
import { Router } from 'express';

const router = Router() 

router
    .post('/signup', AuthController.signUp)
    .post('/login', AuthController.login)
    .post('/verify-otp', AuthController.verifyOTP)
    .get('/activate/:token', AuthController.activateAccount)

    

export default router;