import nodemailer from "nodemailer";
import User from "@/models/userModels";
import bcryptjs from "bcryptjs";

export const sendEmail = async ({
  email,
  emailType,
  userId,
  username,
}: any) => {
  try {
    //Creat a Hashed Token
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(
        userId,
        {
          verifyToken: hashedToken,
          verifyTokenExpiry: Date.now() + 15 * 60 * 1000,
        }
        //   { new: true, runValidators: true }
      );
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(
        userId,
        {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: Date.now() + 15 * 60 * 1000,
        }
        //   { new: true, runValidators: true }
      );
    }

    const transport = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your Email" : "Reset Your Password",

      html: `<p>Click <a href="${process.env.DOMAIN}${
        emailType === "VERIFY" ? `/verifyemail` : `/reset-password`
      }?token=${hashedToken}&username=${encodeURIComponent(
        username
      )}&email=${encodeURIComponent(email)}">Here</a> to ${
        emailType === "VERIFY" ? "Verify your Email" : "Reset Your Password"
      }</p>`,
    };

    const mailResponse = await transport.sendMail(mailOptions);

    return mailResponse;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};
