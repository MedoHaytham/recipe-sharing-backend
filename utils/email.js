const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // 1) create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000
  });
  // 2) Define email options
  const mailOptions = {
    from: 'Mohamed Haytham <medo@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
  }
  // 3) send the email
  await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;

