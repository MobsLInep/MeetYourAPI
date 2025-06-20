import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import Report from '@/models/Report';
import Chat from '@/models/Chat';
import { sendAdminReportEmail } from '@/lib/resend';

export async function GET() {
  try {
    const { userId } = auth();

    // Check if user is admin
    if (userId !== process.env.ADMIN_USER_IDS) {
      console.log('Unauthorized access attempt:', { userId, adminId: process.env.ADMIN_USER_IDS });
      return new NextResponse('Unauthorized', { status: 401 });
    }

    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected successfully');

    // Get all reports
    console.log('Fetching reports...');
    const reports = await Report.find().sort({ createdAt: -1 });
    console.log(`Found ${reports.length} reports`);

    // Return reports with their stored messages
    const reportsWithMessages = reports.map(report => ({
      _id: report._id,
      chatId: report.chatId,
      reason: report.reason,
      description: report.description,
      createdAt: report.createdAt,
      reportedBy: report.reportedBy,
      status: report.status || 'pending',
      messages: report.messages || [], // Use the stored messages from the report
    }));

    console.log('Successfully fetched all reports with stored messages');
    return NextResponse.json(reportsWithMessages);
  } catch (error: unknown) {
    console.error('Error in reports API:', error instanceof Error ? error.message : String(error));
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { chatId, reason, description } = await req.json();
    if (!chatId || !reason || !description) {
      return new NextResponse('Missing required fields', { status: 400 });
    }
    if (description.trim().split(/\s+/).length < 5 || description.length > 2000) {
      return new NextResponse('Description must be at least 5 words and at most 2000 characters.', { status: 400 });
    }

    await connectDB();

    // Fetch the chat to get its messages
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return new NextResponse('Chat not found', { status: 404 });
    }

    // Get user details from Clerk
    const user = await clerkClient.users.getUser(userId);
    const userEmail = user.emailAddresses[0]?.emailAddress;
    
    if (!userEmail) {
      return new NextResponse('User email not found', { status: 400 });
    }

    // Create a deep copy of the messages array to store in the report
    const messagesSnapshot = JSON.parse(JSON.stringify(chat.messages));

    // Create report with the message snapshot
    const report = await Report.create({
      chatId,
      reportedBy: userEmail,
      reason,
      description,
      messages: messagesSnapshot, // Store the snapshot of messages
    });

    // Send email with formal boxed ticket details
    await sendAdminReportEmail({
      subject: 'New Ticket Submitted',
      text: `A new ticket has been submitted.\n\nTicket Details:\n- Reported By: ${userEmail}\n- Reason: ${reason}\n- Description: ${description}\n- Chat ID: ${chatId}\n- Status: Pending`,
      html: `<div style='font-family:sans-serif;max-width:600px;margin:auto;padding:24px;background:#f9f9f9;border-radius:8px;'>
        <h2 style='color:#222;text-align:center;margin-bottom:24px;'>New Ticket Submitted</h2>
        <p style='margin-bottom:16px;'>A new ticket has been submitted. The details are as follows:</p>
        <table style='width:100%;border-collapse:collapse;background:#fff;border:1px solid #ddd;border-radius:8px;overflow:hidden;'>
          <tr><th style='text-align:left;padding:8px 12px;border-bottom:1px solid #eee;background:#f3f3f3;'>Field</th><th style='text-align:left;padding:8px 12px;border-bottom:1px solid #eee;background:#f3f3f3;'>Value</th></tr>
          <tr><td style='padding:8px 12px;border-bottom:1px solid #eee;'>Reported By</td><td style='padding:8px 12px;border-bottom:1px solid #eee;'>${userEmail}</td></tr>
          <tr><td style='padding:8px 12px;border-bottom:1px solid #eee;'>Reason</td><td style='padding:8px 12px;border-bottom:1px solid #eee;'>${reason}</td></tr>
          <tr><td style='padding:8px 12px;border-bottom:1px solid #eee;'>Description</td><td style='padding:8px 12px;border-bottom:1px solid #eee;'>${description}</td></tr>
          <tr><td style='padding:8px 12px;border-bottom:1px solid #eee;'>Chat ID</td><td style='padding:8px 12px;border-bottom:1px solid #eee;'>${chatId}</td></tr>
          <tr><td style='padding:8px 12px;'>Status</td><td style='padding:8px 12px;'>Pending</td></tr>
        </table>
        <p style='color:#888;font-size:13px;margin-top:24px;'>This is an automated notification. Please do not reply to this email.</p>
      </div>`
    });

    return NextResponse.json(report);
  } catch (error: unknown) {
    console.error('Error creating report:', error instanceof Error ? error.message : String(error));
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 