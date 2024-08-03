import nodemailer, { type Transporter } from "nodemailer";
import logger from "./logger";
import dotenv from "dotenv";
dotenv.config();


interface EmailTemplateProps {
  orders: any;
  email: string;
}



const transporter: Transporter = nodemailer.createTransport({
  service: process.env.SERVICE_EMAIL,
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: true, //
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
  //debug: true, // Enable debug output
  //logger: true, // Log information to console
});




export const inform = async (email: string, orders: any) => {
  const emailTemplate = ({ orders, email }: EmailTemplateProps) => {
    return `
        <h1>Welcome to ${process.env.DOMAIN}, ${email}!</h1>
          return <p>Your Orders : ${orders}</p>
      `;
  };

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Your New Products",
    html: emailTemplate({ orders, email }),
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Message sent to  ${email}`);
  } catch (err) {
    logger.error(err);
    throw new ApiError("Internal server Error", 500);
  }
};
