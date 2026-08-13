import nodemailer from 'nodemailer';

export const sendEscalationEmail = async (report) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const acceptLink = `${process.env.CLIENT_URL || 'http://localhost:5173'}/report?acceptEscalation=${report._id}`;
    
    // The user requested to send it to this specific email
    const targetEmail = 'sonishivanshu7898163335@gmail.com';

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: targetEmail,
      subject: `🚨 URGENT ESCALATION: Unresolved Report - ${report.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-w-2xl mx-auto p-4 border rounded-lg bg-gray-50">
          <h2 style="color: #dc2626;">🚨 7-Day SLA Breached: Escalation to CM Help</h2>
          <p>The following report has not been resolved within the 7-day SLA window and requires immediate attention.</p>
          
          <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
            <h3 style="margin-top: 0; color: #1f2937;">${report.title}</h3>
            <p style="color: #4b5563;"><strong>Category:</strong> ${report.category}</p>
            <p style="color: #4b5563;"><strong>Location:</strong> ${report.location?.address}</p>
            <p style="color: #4b5563;"><strong>Reported On:</strong> ${new Date(report.createdAt).toLocaleString()}</p>
            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 15px 0;" />
            <p style="color: #4b5563;">${report.description}</p>
          </div>

          <p>Please review and accept this escalation to take charge of the issue.</p>
          
          <a href="${acceptLink}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px;">
            Accept Escalated Report
          </a>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Escalation email sent successfully for report: ${report._id}`);
  } catch (error) {
    console.error('Error sending escalation email:', error);
  }
};
