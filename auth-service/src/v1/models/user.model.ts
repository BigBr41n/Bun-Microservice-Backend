import mongoose, { type Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
  name: string;
  email: string;
  password: string;
  verified?: boolean;
  activationToken?: string;
  activeExpires?: number;
  OTP?: string;
  OTPEx?: number;
}

export interface IUserDocument extends IUser, Document {
  _id: mongoose.Schema.Types.ObjectId;
}

const userSchema = new mongoose.Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    verified: { type: Boolean, default: false },
    activationToken: { type: String },
    activeExpires: { type: Number },
    OTP: { type: String },
    OTPEx : { type: Number},
  },
  {
    timestamps: true,
  }
);


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error: any) {
    next(error);
  }
});


const User = mongoose.model<IUserDocument>("User", userSchema);
export default User;
