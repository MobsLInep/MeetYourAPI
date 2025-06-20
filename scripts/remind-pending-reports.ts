import connectDB from '../src/lib/mongodb';
import Report from '../src/models/Report';
import { sendAdminReportEmail } from '../src/lib/resend';

async function remindPendingReports() {
  await connectDB();
  const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
  const pendingReports = await Report.find({ status: 'pending', createdAt: { $lte: threeHoursAgo } });

  for (const report of pendingReports) {
    await sendAdminReportEmail({
      subject: 'Reminder: Pending Report',
      text: `A report is still pending.\n\nReport Details:\n- Report ID: ${report._id}\n- Reported By: ${report.reportedBy}\n- Reason: ${report.reason}\n- Status: pending\n- Created At: ${report.createdAt}`,
      html: `<div style='font-family:sans-serif;max-width:600px;margin:auto;padding:24px;background:#f9f9f9;border-radius:8px;'>
        <h2 style='color:#222;text-align:center;margin-bottom:24px;'>Pending Report Reminder</h2>
        <p style='margin-bottom:16px;'>A report is still pending. The details are as follows:</p>
        <table style='width:100%;border-collapse:collapse;background:#fff;border:1px solid #ddd;border-radius:8px;overflow:hidden;'>
          <tr><th style='text-align:left;padding:8px 12px;border-bottom:1px solid #eee;background:#f3f3f3;'>Field</th><th style='text-align:left;padding:8px 12px;border-bottom:1px solid #eee;background:#f3f3f3;'>Value</th></tr>
          <tr><td style='padding:8px 12px;border-bottom:1px solid #eee;'>Report ID</td><td style='padding:8px 12px;border-bottom:1px solid #eee;'>${report._id}</td></tr>
          <tr><td style='padding:8px 12px;border-bottom:1px solid #eee;'>Reported By</td><td style='padding:8px 12px;border-bottom:1px solid #eee;'>${report.reportedBy}</td></tr>
          <tr><td style='padding:8px 12px;border-bottom:1px solid #eee;'>Reason</td><td style='padding:8px 12px;border-bottom:1px solid #eee;'>${report.reason}</td></tr>
          <tr><td style='padding:8px 12px;border-bottom:1px solid #eee;'>Status</td><td style='padding:8px 12px;border-bottom:1px solid #eee;'>pending</td></tr>
          <tr><td style='padding:8px 12px;'>Created At</td><td style='padding:8px 12px;'>${report.createdAt}</td></tr>
        </table>
        <p style='color:#888;font-size:13px;margin-top:24px;'>This is an automated notification. Please do not reply to this email.</p>
      </div>`
    });
  }
}

remindPendingReports().then(() => {
  console.log('Pending report reminders sent.');
  process.exit(0);
}).catch((err) => {
  console.error('Error sending pending report reminders:', err);
  process.exit(1);
}); 