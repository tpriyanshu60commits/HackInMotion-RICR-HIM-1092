import nodemailer from 'nodemailer';

let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'placeholder@gmail.com',
        pass: process.env.EMAIL_PASS || 'placeholder_pass',
      },
    });
  }
  return transporter;
};

export const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"VerdantX" <${process.env.EMAIL_USER || 'noreply@verdantx.com'}>`,
    to,
    subject,
    html,
  };

  try {
    if (process.env.NODE_ENV !== 'test') {
      const mailTransporter = getTransporter();
      await mailTransporter.sendMail(mailOptions);
    } else {
      console.log('Test env - simulated email send to:', to);
    }
  } catch (error) {
    console.error('Email send failed:', error.message);
    throw new Error('Could not send email. Please try again later.');
  }
};
