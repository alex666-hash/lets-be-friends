const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

const sendVerificationEmail = async (email, verificationLink) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: "Let's Be Friends - Email Verification",
    html: `
      <h2>Email Verification</h2>
      <p>Thank you for signing up! Please verify your email address by clicking the link below:</p>
      <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Verify Email
      </a>
      <p>Or copy and paste this link:</p>
      <p>${verificationLink}</p>
      <p>This link will expire in 24 hours.</p>
    `
  };
  
  return transporter.sendMail(mailOptions);
};

const sendWelcomeEmail = async (email, firstName) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: "Welcome to Let's Be Friends!",
    html: `
      <h2>Welcome, ${firstName || 'Friend'}!</h2>
      <p>We're excited to have you join our community. Here are some tips to get started:</p>
      <ul>
        <li>Complete your profile with photos and bio</li>
        <li>Verify your identity with face verification</li>
        <li>Set your location preferences</li>
        <li>Start exploring and making connections!</li>
      </ul>
      <p>Happy dating!</p>
      <p>The Let's Be Friends Team</p>
    `
  };
  
  return transporter.sendMail(mailOptions);
};

const sendBanNotificationEmail = async (email, reason) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: "Account Suspension Notice",
    html: `
      <h2>Account Suspension</h2>
      <p>Your account has been suspended due to:</p>
      <p><strong>${reason}</strong></p>
      <p>For more information or to appeal, please contact our support team.</p>
    `
  };
  
  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendBanNotificationEmail
};
