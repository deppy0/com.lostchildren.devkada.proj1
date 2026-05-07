# DevKada Server API Guide

Updated: May 7, 2026

Base path: all routes are mounted under `/server`.
Example base URL: `http://localhost:4000/server`

Authentication: protected routes require JWT bearer auth header.

```
Authorization: Bearer <token>
```

Most handlers return either:

- success payloads: `{ success: true, ... }` or `{ data: ... }`
- error payloads: `{ error: "..." }` or `{ message: "..." }`

---

## Authentication (`/server/auth`)

- POST `/server/auth/check`
  - Body: none
  - Header: `Authorization: Bearer <token>`
  - Response: `{ success: boolean }`

- POST `/server/auth/login`
  - Body:

    ```json
    {
      "email": "test@example.com",
      "password": "TestPass123!"
    }
    ```

  - Response: `{ data: { ...supabase auth session/user payload... } }`

- POST `/server/auth/register`
  - Body:

    ```json
    {
      "email": "test@example.com",
      "password": "TestPass123!",
      "first_name": "Test",
      "last_name": "User",
      "guardian_name": "Guardian",
      "guardian_contact": "guardian@example.com"
    }
    ```

  - Response: `{ data: { ...supabase sign up payload... } }`

- POST `/server/auth/change-password`
  - Body:

    ```json
    {
      "new_password": "NewStrongPassword123!"
    }
    ```

  - Response: `{ success: true }`
  - Note: this route currently does not attach `auth` middleware in `routes/auth.js`, but still reads `req.user.id`.

- POST `/server/auth/logout` (auth required)
  - Body: none
  - Header: `Authorization: Bearer <token>`
  - Response: `{ success: true }`

---

## User (`/server/user`)

- GET `/server/user/information`
  - Returns user profile data (handled by `userService.getUserInformation`).

- POST `/server/user/update`
  - Body: profile fields to update.
  - Example:

    ```json
    {
      "first_name": "Alice",
      "last_name": "B"
    }
    ```

---

## Example (`/server/example`)

- GET `/server/example/port`
  - Response:

    ```json
    {
      "port": 13928
    }
    ```

---

## Prescription (`/server/prescription`) (auth required)

- POST `/server/prescription/add`
  - Body:

    ```json
    {
      "doctor_name": "Dr. Santos",
      "doc_specialization": "Internal Medicine",
      "date_issued": "2026-05-07",
      "document_url": "https://...",
      "meds_list": [
        {
          "name": "Amoxicillin",
          "strength": "500mg"
        }
      ]
    }
    ```

  - `meds_list` is required and must contain at least 1 item.
  - Response: `{ success: true, prescription_id: "..." }`

- PATCH `/server/prescription/:id/image` (auth + multipart/form-data)
  - Form field: `image`
  - Response: `{ success: true, image_url: "<public url>" }`

- POST `/server/prescription/remove`
  - Body:

    ```json
    {
      "prescription_id": "..."
    }
    ```

  - Response: `{ success: true }`

- POST `/server/prescription/get`
  - Response: `{ success: true, prescriptions: [...] }`

- POST `/server/prescription/get-active`
  - Response: `{ success: true, prescriptions: [...] }`

---

## Medicine (`/server/medicine`) (auth required)

- POST `/server/medicine/add`
  - Body: `{ "medicine_json": { ... } }`
  - Response: `{ success: true, medicine_id: "..." }`

- POST `/server/medicine/get`
  - Response: `{ success: true, medicines: [...] }`

- POST `/server/medicine/get-otc`
  - Response: `{ success: true, otc_medicines: [...] }`

- POST `/server/medicine/get-active`
  - Response: `{ success: true, active_medicines: [...] }`

- POST `/server/medicine/get-active-otc`
  - Response: `{ success: true, active_otc_medicines: [...] }`

- POST `/server/medicine/get-warn`
  - Response: `{ success: true, warned_stocks: [...] }`

- POST `/server/medicine/intake`
  - Body:

    ```json
    {
      "schedule_id": "...",
      "intake_type": "taken",
      "date_scheduled": "2026-05-07"
    }
    ```

  - Response: `{ success: true, intake_log_id: "..." }`

- POST `/server/medicine/missed`
  - Body: `{ "schedule_id": "..." }`
  - Response: `{ success: true, json_result: { ... } }`

- POST `/server/medicine/add-stocks`
  - Body:

    ```json
    {
      "medicine_id": "...",
      "add_amount": 10
    }
    ```

  - Response: `{ success: true, new_total: number }`

- POST `/server/medicine/subtract-stocks`
  - Body:

    ```json
    {
      "medicine_id": "...",
      "subtract_amount": 3
    }
    ```

  - Response: `{ success: true, new_total: number }`

- POST `/server/medicine/remove`
  - Body: `{ "medicine_id": "..." }`
  - Response: `{ success: true }`

---

## Schedule (`/server/schedule`) (auth required)

- POST `/server/schedule/today`
  - Current behavior:
    - Route calls `get_today_schedule(param_user_id, param_date)` RPC.
    - `param_date` is passed from `req.params.date`.
    - Because the route path is `/today` (no `:date` segment), `param_date` is currently `undefined` unless route implementation changes.
  - Response: `{ success: true, schedule: [...] }`

---

## Vitals (`/server/vitals`) (auth required)

- POST `/server/vitals/record`
  - Body:

    ```json
    {
      "systolic": 120,
      "diastolic": 80,
      "heart_bpm": 72
    }
    ```

  - Response: `{ success: true, vitals_log_id: "..." }`

---

## OCR (`/server/ocr`)

- POST `/server/ocr/parse`
  - Body accepts either key:

    ```json
    {
      "image_base64": "<base64>"
    }
    ```

    or

    ```json
    {
      "image": "<base64>"
    }
    ```

  - Success response: `{ parsed: { ... } }`
  - Error response (missing image):

    ```json
    {
      "message": "image_base64 (base64 string) is required in JSON body as `image_base64` or `image`."
    }
    ```

---

## Notifications (`/server/notifications`)

### API endpoint

- POST `/server/notifications/subscribe` (auth required)
  - Body:

    ```json
    {
      "subscription": {
        "endpoint": "https://...",
        "keys": {
          "p256dh": "...",
          "auth": "..."
        }
      }
    }
    ```

  - Response:

    ```json
    {
      "success": true,
      "message": "Push subscription registered"
    }
    ```

### Background scheduler behavior (in `app.js`)

- A cron task runs every minute (`* * * * *`) when `node-cron` is installed.
- The scheduler reads:
  - `upcoming_notifications` view for push notifications
  - `guardian_alerts_pending` view for guardian email alerts
- New behavior:
  - in-memory dedup is tracked per `schedule_id` for push and email to avoid duplicate sends in the same day
  - dedup sets are reset daily at midnight UTC

### Required environment variables

- Push:
  - `PUBLIC_VAPID_KEY`
  - `PRIVATE_VAPID_KEY`
- Email:
  - `EMAIL_USER`
  - `EMAIL_PASS`

If these are missing, send functions are skipped and warnings are logged.

---

## Quick cURL examples

### Login

```bash
curl -X POST http://localhost:4000/server/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123!"}'
```

### Register push subscription

```bash
curl -X POST http://localhost:4000/server/notifications/subscribe \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"subscription":{"endpoint":"https://...","keys":{"p256dh":"...","auth":"..."}}}'
```

### Get today schedule

```bash
curl -X POST http://localhost:4000/server/schedule/today \
  -H "Authorization: Bearer <TOKEN>"
```
