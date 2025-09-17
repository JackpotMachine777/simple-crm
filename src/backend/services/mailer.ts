import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_ADDR,
        pass: process.env.EMAIL_PASS
    }
});

export async function sendEmail(email: string, name: string){
    const info = {
        from: `${process.env.EMAIL_OWNER} <${process.env.EMAIL_ADDR}>`,
        to: email,
        subject: "Thanks for contacting us!",
        text: `Hi ${name}, \nThanks for messaging us. We will contact with you soon`,
        html: `<p>Hi <b>${name}</b>,</p><p>Thanks for messaging us. We will contact with you soon.</p>`
    };

    try{
        const sent = await transporter.sendMail(info);
        console.log(`Email sent: ${sent.response}`);
    } catch(err){
        console.error(`Error sending email: ${err}`);
    }
}