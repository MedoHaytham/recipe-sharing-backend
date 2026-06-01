const nodemailer = require('nodemailer');

// const sendEmail = async options => {
//   // 1) Create a transporterT
//   const transporter = nodemailer.createTransport({
//     // service: 'Gmail',
//     // auth: {
//     //   user: process.env.EMAIL_USERNAME,
//     //   pass: process.env.EMAIL_PASSWORD
//     // },
//     // activate a less secure app to send email
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD
//     }
//   })

//   // 2) Define email options
//   const mailOptions = {
//     from: 'Mohamed Gamal <medo@gmail.com>',
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//     // html:,
//   }

//   // 3) send the email
//   await transporter.sendMail(mailOptions);
// }

// module.exports = sendEmail;


const sendEmail = async options => {
  // 1) create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
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
  }
  // 3) send the email
  await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;

