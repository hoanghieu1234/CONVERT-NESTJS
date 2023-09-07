import * as nodemailer from 'nodemailer';


require('dotenv').config();

interface EmailData {
  to: string;
  text: string;
  subject: string;
  html: string;
}

// Cấu hình transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Hàm gửi email
export const sendEmail = async (emailData: EmailData):Promise<void> => {
  try {
    await transporter.sendMail(emailData);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
