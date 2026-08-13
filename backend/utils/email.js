export const sendEscalationEmail = async (report) => {
  try {
    const acceptLink = `${process.env.CLIENT_URL || 'http://localhost:5173'}/report?acceptEscalation=${report._id}`;
    
    // The user requested to send it to this specific email
    const targetEmail = 'sonishivanshu7898163335@gmail.com';

    const payload = {
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id: process.env.EMAILJS_PUBLIC_KEY,
      accessToken: process.env.EMAILJS_PRIVATE_KEY,
      template_params: {
        to_email: targetEmail,
        reportTitle: report.title,
        category: report.category,
        location: report.location?.address || 'Unknown',
        date: new Date(report.createdAt).toLocaleString(),
        description: report.description,
        acceptLink: acceptLink
      }
    };

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`EmailJS responded with ${response.status}: ${errorText}`);
    }

    console.log(`Escalation email sent successfully via EmailJS for report: ${report._id}`);
  } catch (error) {
    console.error('Error sending escalation email:', error);
  }
};
