import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'placeholder@gmail.com',
      pass: process.env.EMAIL_PASS || 'placeholder_pass',
    },
  });

  const mailOptions = {
    from: `"VerdantX" <${process.env.EMAIL_USER || 'noreply@verdantx.com'}>`,
    to,
    subject,
    html,
  };

  try {
    if (process.env.NODE_ENV !== 'test') {
      await transporter.sendMail(mailOptions);
    } else {
      console.log('Test env - simulated email send to:', to);
    }
  } catch (error) {
    console.error('Email send failed:', error);
    // don't throw to prevent breaking flow if email fails
  }
};
