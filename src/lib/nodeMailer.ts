 
import * as nodemailer from "nodemailer";
import * as dotenv from 'dotenv';
dotenv.config();

export const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,  
    auth: {
        user: 'dhakane020@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD || '',
    }
});

 