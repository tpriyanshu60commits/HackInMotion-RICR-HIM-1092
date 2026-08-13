import { sendEscalationEmail } from './email.js';

export const checkEscalation = async (report) => {
  if (!report) return report;
  
  if (report.status !== 'Resolved' && report.status !== 'Escalated' && report.status !== 'CM Accepted') {
    if (Date.now() > new Date(report.deadline).getTime()) {
      report.status = 'Escalated';
      await report.save();
      // Send automated email when escalated
      await sendEscalationEmail(report);
    }
  }
  return report;
};

export const checkEscalations = async (reports) => {
  if (!reports || !Array.isArray(reports)) return reports;
  
  const updatedReports = [];
  
  for (let report of reports) {
    if (report.status !== 'Resolved' && report.status !== 'Escalated' && report.status !== 'CM Accepted') {
      if (Date.now() > new Date(report.deadline).getTime()) {
        report.status = 'Escalated';
        await report.save();
        // Send automated email when escalated
        await sendEscalationEmail(report);
      }
    }
    updatedReports.push(report);
  }
  
  return updatedReports;
};
