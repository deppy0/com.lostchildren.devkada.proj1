# MoniMed

MoniMed is a medication management web app designed to help users track prescriptions, medicine inventory, intake schedules, and health vitals, with OCR-assisted prescription parsing and notification support.

## Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database/Auth/Storage: Supabase
- OCR: Google Gemini (`@google/genai`)
- Notifications:
	- Web Push (`web-push`)
	- Guardian Email Alerts (`nodemailer`)

## Current Features

- User authentication (register, login, logout, token check)
- User profile retrieval and update
- Prescription management
	- add prescription
	- attach prescription image
	- fetch all/active prescriptions
	- remove prescription
- Medicine management
	- add medicine and schedule
	- get medicines (all, active, OTC, active OTC)
	- intake logging / missed dose logging
	- stock add/subtract
	- low-stock warnings
	- remove medicine
- Daily schedule retrieval
- Vitals logging (systolic, diastolic, heart rate)
- OCR route for extracting structured data from prescription images
- Notification system
	- push subscription endpoint
	- per-minute cron checks for upcoming doses and overdue alerts
	- guardian email alerts for overdue doses

## Future Roadmap

These are known product limitations and planned improvements:

1. Allow Add Medication to support multiple schedules in one add flow (currently only 1 schedule is supported).
2. Allow Add Prescription to support multiple medicines per prescription in the finalized flow (currently restricted in parts of the app).
3. Improve OCR accuracy for handwritten prescription notes.

## Known Constraints

- Some backend flows are dependent on Supabase RPC functions being present and correctly configured.
- Notification delivery requires proper external setup (VAPID keys, email app password).
- Certain frontend forms are still evolving and may not yet expose every backend capability.
- Prescription scanning is currently inconsistent in some cases and may return incomplete fields, which can prevent saving the prescription reliably.

## Project Structure

```text
devkada-proj/
	client/      # React + Vite frontend
	server/      # Express backend, routes, services, DB scripts
	README.md
```

## Prerequisites

- Node.js 18+
- npm 9+
- Supabase project (URL + service key/anon key depending on usage)
- (Optional) Google Gemini API key(s) for OCR
- (Optional) VAPID keys for push notifications
- (Optional) Gmail app credentials for guardian email alerts

## Installation

1. Install root dependencies:

```bash
npm install
```

2. Install frontend dependencies:

```bash
cd client
npm install
cd ..
```

3. Install backend dependencies:

```bash
cd server
npm install
cd ..
```

## Running the App

### Development (frontend + backend)

From project root:

```bash
npm start
```

Or use the batch helper:

```bash
run.development.bat
```

### Production Build + Run

```bash
npm run prod
```

## API Overview

All backend routes are under:

```text
/server
```

Main route groups:

- `/server/auth`
- `/server/user`
- `/server/prescription`
- `/server/medicine`
- `/server/schedule`
- `/server/vitals`
- `/server/ocr`
- `/server/notifications`

For detailed request/response documentation, refer to:

- `server/API_GUIDE.md`

## Notification System

The backend runs a per-minute cron job (`* * * * *`) that checks:

- `upcoming_notifications` view for push notifications
- `guardian_alerts_pending` view for email escalation

To avoid duplicates, sent `schedule_id`s are tracked in-memory and reset daily at midnight UTC.

## OCR Notes

- OCR endpoint accepts base64 image payloads.
- Service attempts parsing using primary Gemini client first, then retries using backup client on failure.

## Team Notes

This README is intended to be a living document. Update it whenever a major endpoint, feature flow, or deployment requirement changes.