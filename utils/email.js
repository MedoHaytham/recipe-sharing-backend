const nodemailer = require('nodemailer');

const sendEmail = async options => {
  console.log('EMAIL_HOST', process.env.EMAIL_HOST);
  console.log('EMAIL_PORT', process.env.EMAIL_PORT);
  console.log('EMAIL_USERNAME', process.env.EMAIL_USERNAME);

  console.log('Before transporter');

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    family: 4,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000
  });

  const mailOptions = {
    from: 'Mohamed Haytham <medo@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  console.log('Before sendMail');

  const info = await transporter.sendMail(mailOptions);

  console.log('Email sent:', info.messageId);
};

module.exports = sendEmail;