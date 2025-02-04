const nodemailer = require("nodemailer");

module.exports = async (email, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    secure: true,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.PASS,
    },
  });

  await transporter.sendMail({
    to: email,
    subject,
    text,
  });
};
