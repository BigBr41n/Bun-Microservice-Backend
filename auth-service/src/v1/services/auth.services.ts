import User, { type IUserDocument } from "../models/user.model";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import {
    sendOTP,
    sendActivationEmail,
} from "../../../utils/mailer";
import { signJwt, signRefreshToken } from "../../../utils/jwt.utils";
import logger from "../../../utils/logger";
import { generateOTP } from "../../../utils/generateOTP";

class AuthService {



  /**
   * Service to register a new user
   * @param {Partial<IUserDocument>} userData - user data needed to register
   * @returns {Promise<string>} - The created user document
   * @throws {ApiError} - if the user registration failed
   */
  static async signUp(userData: {email:string , name : string , password: string}): Promise< string > {
    try {
      const user = await User.findOne({ email: userData.email! });
      if (user) throw new ApiError("Email already exists", 401);

      const activationToken = crypto.randomBytes(32).toString("hex");
      const activeExpires = Date.now() + 1000 * 60 * 60;

      await User.create({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        activationToken,
        activeExpires,
      });

      await sendActivationEmail(userData.email!, userData.name!, activationToken);

      return "activate your email";
    } catch (err: any) {
      logger.error("Error during sign up service:");
      await User.findOneAndDelete({ email: userData.email });
      throw err;
    }
  }





  /**
   * Service to login a registered user
   * @param {{email : string , password : string}} userData - user data needed to login
   * @returns {Promise<LOGIN>} - the logged-in user with the access token & refresh token
   * @throws {ApiError} - if the user login operation failed
   */
  static async login(userData: {email : string , password : string}): Promise<string> {
    try {
      const user = await User.findOne({ email: userData.email });
      if (!user) throw new ApiError("User not found!", 404);

      const isMatch = await bcrypt.compare(userData.password, user.password);
      if (!isMatch) throw new ApiError("Invalid credentials!", 401);

      if (!user.verified) {
        throw new ApiError("Please verify your account, we sent you an email!", 401);
      }

      user.OTP = generateOTP(8);
      await user.save();

      return "OTP sent"
    } catch (err: any) {
        logger.error("Error during login service:");
        throw err;
    }
  }







  /**
   * Service to activate the new registered user account
   * @param {string} OTP - user token that got from the sent email
   * @returns {Promise<{}>} - if the account activated send true
   * @throws {ApiError} - if the user activation operation failed
   */
  static async verifyOTP(OTP: string): Promise<{}> {
    try {
      const user = await User.findOne({
        OTP,
        OTPEx: { $gt: new Date() },
      }).lean();

      if (!user) throw new ApiError('OTP invalid; please Login Again', 401);

      // Generate tokens
      const accessToken = signJwt({ id: user._id.toString() });
      const refreshToken = signRefreshToken({ id: user._id.toString() });

      if (!accessToken || !refreshToken) throw new ApiError('Error creating tokens', 500);

      // Clear OTP and OTPEx fields
      await User.updateOne({ _id: user._id }, { $unset: { OTP: "", OTPEx: "" } });

      const { password, ...data } = user;
      return { data, accessToken, refreshToken };
    } catch (err: any) {
      logger.error('Error during verifyOTP:', err);
      throw err;
    }
  }







  /**
   * Service to activate the new registered user account
   * @param {string} token - user token that got from the sent email
   * @returns {Promise<boolean>} - if the account activated send true
   * @throws {ApiError} - if the user activation operation failed
   */
  static async activateAccount(token: string): Promise<boolean> {
    try {
      const user = await User.findOne({
        activationToken: token,
        activeExpires: { $gt: Date.now() },
      });

      if (!user) throw new ApiError("Invalid or expired activation token", 400);
      if (user.verified) throw new ApiError("Account is already activated", 400);

      user.verified = true;
      await user.save();

      return user.verified;
    } catch (err: any) {
      logger.error("Error during activate account service:", err);

      if (err instanceof ApiError) throw err;
      throw new ApiError("Internal server Error", 500);
    }
  }



}

export default AuthService;
