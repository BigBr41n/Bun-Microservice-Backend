import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import AuthService from '../services/auth.services';


export class AuthController {
  static signUp = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const message = await AuthService.signUp({ name, email, password });
    res.json({ message });
  });

  static login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const message = await AuthService.login({ email, password });
    res.json({ message });
  });

  static verifyOTP = asyncHandler(async (req: Request, res: Response) => {
    const { OTP } = req.body;
    const result = await AuthService.verifyOTP(OTP);
    res.json(result);
  });

  static activateAccount = asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.params;
    const activated = await AuthService.activateAccount(token);
    res.json({ activated });
  });
}
