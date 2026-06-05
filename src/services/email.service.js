import nodemailer from 'nodemailer'
import dotenv from 'dotenv';
dotenv.config();


//transporter is used to send email, it is a service that is used to send email, it is a wrapper around the nodemailer library, it is used to send email using the gmail service, it uses OAuth2 authentication, it uses the credentials from the .env file, it is verified before sending email to check if the connection is successful or not

// export const transporter = nodemailer.createTransport({
//  service: 'gmail',
//  auth: {
//   type: 'OAuth2',
//   user: process.env.EMAIL_USER,
//   clientId: process.env.CLIENT_ID,
//   clientSecret: process.env.CLIENT_SECRET,
//   refreshToken: process.env.REFRESH_TOKEN,
//  },
// });

// It communicates with SMTP server of google to send email, it uses the credentials from the .env file to authenticate the connection.

export const transporter = nodemailer.createTransport({
 host: "smtp.gmail.com",
 port: 465,
 secure: true,
 auth: {
  user: process.env.EMAIL_USER,
  pass: process.env.APP_PASSWORD,
 },
});

// Verify the connection configuration
transporter.verify((error, success) => {
 if (error) {
  console.error('Error connecting to email server:', error);
 } else {
  console.log('Email server is ready to send messages');
 }
});

export const sendEmail = async (to, subject, text, html) => {
 try {
  const info = await transporter.sendMail({
   from: `"Backend Transaction System" <${process.env.EMAIL_USER}>`, // sender address
   to, // list of receivers
   subject, // Subject line
   text, // plain text body
   html, // html body
  });

  console.log('Message sent: %s', info.messageId);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
 } catch (error) {
  console.error('Error sending email:', error);
 }
};


export const sendRegisterationEmail = async (userEmail, name) => {
 const subject = 'Welcome to Backend Transaction System';
 const text = `Hello ${name}, \n\nThank you for registering in the Banking transaction system. We are exited to have ou onboard. \n\nBest regards, \nBackend Transaction system Team`;
 const html = `<p>Hello ${name},</p><p>Thank you for registering in the Banking transaction system. We are exited to have ou onboard.</p><p>Best regards,</p><p>Backend Transaction system Team</p>`;

 await sendEmail(userEmail, subject, text, html);
}

export const sendTransactionEmail = async (userEmail, name, amount, toAmount) => {
 const subject = 'Transaction Completed';
 const text = `Dear ${name},\n\nYour transaction of amount ${amount} has been completed successfully. The recipient's account has been credited with ${toAmount}.\n\nThank you for using our service.\n\nBest regards,\nBackend Transaction System Team`;
 const html = `<p>Dear ${name},</p><p>Your transaction of amount ${amount} has been completed successfully. The recipient's account has been credited with ${toAmount}.</p><p>Thank you for using our service.</p><p>Best regards,</p><p>Backend Transaction System Team</p>`;

 await sendEmail(userEmail, subject, text, html);
}

export const sendTransactionFailedEmail = async (userEmail, name, amount) => {
 const subject = 'Transaction Failed';
 const text = `Dear ${name},\n\nYour transaction of amount ${amount} has failed. Please try again later.\n\nBest regards,\nBackend Transaction System Team`;
 const html = `<p>Dear ${name},</p><p>Your transaction of amount ${amount} has failed. Please try again later.</p><p>Best regards,</p><p>Backend Transaction System Team</p>`;

 await sendEmail(userEmail, subject, text, html);
}