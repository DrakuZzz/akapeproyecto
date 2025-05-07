import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "akape.ent@gmail.com",
    pass: "ablijbramloflryd"
  }
});

export default transporter;
