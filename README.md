<h1 align="center">MeetYourAPI</h1>
<p align="center">
  <a href="https://meet-your-api.vercel.app/">
    <img src="https://img.shields.io/badge/Live%20App-https%3A%2F%2Fmeet--your--api.vercel.app-blue?logo=vercel&logoColor=white" alt="Live App">
  </a>
</p>

<p align="center">
  <img src="https://socialify.git.ci/MobsLInep/MeetYourAPI/image?font=Source+Code+Pro&language=1&name=1&owner=1&pattern=Circuit+Board&theme=Dark" alt="MeetYourAPI Banner" width="700">
</p>

<p align="center">
  A modern, AI-powered platform for API support — featuring real-time chat, intelligent ticketing, and powerful admin tools.
</p>

---

## Table of Contents
- [Overview](#overview)
- [Quickstart](#quickstart)
- [Features](#features)
- [Project Structure](#project-structure)
- [Project Index](#project-index)
- [License](#license)
- [Acknowledgements](#acknowledgements)

---

## Overview
MeetYourAPI is a smart API support chat application. Users can interact with an AI assistant (powered by Google Gemini) for API-related queries, manage chat sessions, report issues, and handle tickets. Admins can review and resolve reports, with automated email notifications for new and pending issues. The app is secure, extensible, and designed for a seamless user experience.

---

## Quickstart

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd meet-your-api-chat-app
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   - `MONGODB_URI` (MongoDB connection string)
   - `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY` (Clerk authentication)
   - `GOOGLE_GEMINI_API_KEY` (Google Gemini API)
   - `RESEND_API_KEY`, `ADMIN_EMAIL` (Resend email notifications)
   - `ADMIN_USER_IDS` (comma-separated admin user IDs)
4. **Run the development server:**
   ```bash
   npm run dev
   ```
5. **Access the app:**
   - Visit [http://localhost:3000](http://localhost:3000)

---

## Features
- **AI-Powered Chat:** Real-time, streaming responses from a Gemini-powered assistant, focused on API topics.
- **Authentication:** Secure sign-in/sign-up with Clerk.
- **Chat Management:** Start, view, and delete chat sessions. Supports markdown, code, and image uploads.
- **Reporting & Ticketing:** Report issues with chats, view your reports, and track their status.
- **Admin Panel:** Admins can view and manage all reports/tickets.
- **Automated Email Notifications:** New and pending reports trigger formal, boxed email notifications to admins.
- **Modern UI/UX:** Responsive design, custom markdown styling, hidden scrollbars, and smooth transitions.
- **Image Uploads:** Attach images to chat messages and reports.
- **Automation:** Cron job for pending report reminders.

---

## Project Structure
```
meet-your-api-chat-app/
├── public/                # Static assets (images, icons)
├── scripts/               # Automation scripts (reminders, cron jobs)
├── src/
│   ├── app/               # Next.js app directory (pages, API routes, styles)
│   ├── components/        # React UI components
│   ├── lib/               # Utility libraries (db, AI, email, uploads)
│   └── models/            # Mongoose data models
├── package.json           # Project metadata and dependencies
├── tailwind.config.ts     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── ...
```

---

## Project Index
- **/src/app**
  - `layout.tsx`, `globals.css`: Global layout and styles
  - `/dashboard/`, `/admin/`: Main user and admin pages
  - `/api/`: RESTful endpoints for chats, reports, tickets, uploads, users, and AI
- **/src/components**
  - `ChatInterface.tsx`: Main chat UI
  - `Sidebar.tsx`: Navigation and user info
  - `ReportPopup.tsx`, `MyReportsSlider.tsx`: Reporting and ticket UI
- **/src/lib**
  - `gemini.ts`: Google Gemini AI integration
  - `resend.ts`: Email notifications
  - `mongodb.ts`: MongoDB connection
  - `imagekit.ts`: Image uploads
- **/src/models**
  - `Chat.ts`, `Report.ts`, `Ticket.ts`: Database schemas
- **/scripts**
  - `remind-pending-reports.ts`: Automated reminders for pending reports


---

## License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Acknowledgements
- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Clerk](https://clerk.com/)
- [Google Gemini](https://ai.google.dev/gemini-api)
- [MongoDB](https://mongodb.com/)
- [Resend](https://resend.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
- [ImageKit](https://imagekit.io/) 
