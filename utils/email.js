const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // 1) create transporter with connection & socket timeouts
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    connectionTimeout: 10000,   // 10s to establish connection
    greetingTimeout:  10000,    // 10s for server greeting
    socketTimeout:    15000,    // 15s for socket inactivity
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // 2) Define email options
  const mailOptions = {
    from: 'Mohamed Haytham <medo@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  // 3) Send with a hard 20-second timeout
  await Promise.race([
    transporter.sendMail(mailOptions),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Email sending timed out after 20 seconds')), 20000)
    )
  ]);
};

module.exports = sendEmail;
