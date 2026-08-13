import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Report from './models/Report.js';
import { checkEscalation } from './utils/escalation.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB Connected');

    // Create a mock report with a deadline in the past
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 10); // 10 days ago

    const testReport = new Report({
      category: 'garbage',
      title: 'TEST ESCALATION - Unresolved Dump',
      description: 'This is a test report to trigger the CM Help email escalation.',
      location: { lat: 28.7, lng: 77.1, address: 'Test Escalation Location' },
      createdBy: 'test_user_id',
      status: 'Pending',
      deadline: pastDate // Deadline passed!
    });

    await testReport.save();
    console.log('Test report created with past deadline:', testReport._id);

    // This will trigger the email since deadline passed and status is Pending
    await checkEscalation(testReport);
    
    console.log('Check escalation triggered email (hopefully).');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
