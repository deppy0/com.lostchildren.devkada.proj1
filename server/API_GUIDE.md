# DevKada Server API Guide

Base path: All routes are mounted under `/server` (see `server/app.js`). Example full base URL: `http://localhost:4000/server`.

Auth: many endpoints require JWT bearer authentication via middleware `auth`. Send header: `Authorization: Bearer <token>`.

---

## Authentication (`/server/auth`)

- POST `/server/auth/login`
  - Body (JSON): `{ "username": string, "password": string }`
  - Response: `{ data: { /* auth info, token */ } }`

- POST `/server/auth/register`
  - Body (JSON): `{ "email": string, "password": string, "first_name": string, "last_name": string, "guardian_name": string, "guardian_contact": string }`
  - Response: `{ data: { /* created user info */ } }`

- POST `/server/auth/change-password` (auth required)
  - Body (JSON): `{ "new_password": string }`
  - Response: `{ success: true }`

- POST `/server/auth/logout` (auth required)
  - No body. Uses bearer token from `Authorization` header.
  - Response: `{ success: true }`

---

## User (`/server/user`)

- GET `/server/user/information`
  - No body. Typically expects auth middleware at higher level (check client). Returns user profile data.

- POST `/server/user/update`
  - Body: profile fields to update (handled by `userService.updateProfile`). Example: `{ "first_name": "Alice", "last_name": "B" }`

---

## Example (`/server/example`)

- GET `/server/example/port`
  - Returns `{ port: <value> }` useful for debugging environment.

---

## Medicine (`/server/medicine`) (all routes require auth)

- POST `/server/medicine/add`
  - Body: `{ "medicine_json": object }` — structured medicine data.
  - Response: `{ success: true, medicine_id: <id> }`

- POST `/server/medicine/get`
  - Body: none required. Returns `{ success: true, medicines: [] }`

- POST `/server/medicine/get-otc`
  - Returns OTC medicines.

- POST `/server/medicine/get-active`
  - Returns active medicines.

- POST `/server/medicine/get-active-otc`
  - Returns active OTC medicines.

- POST `/server/medicine/get-warn`
  - Returns low-stock or warned medicines.

- POST `/server/medicine/intake`
  - Body: `{ "schedule_id": string, "intake_type": string, "date_scheduled": string }`
  - Response: `{ success: true, intake_log_id: <id> }`

- POST `/server/medicine/missed`
  - Body: `{ "schedule_id": string }`

- POST `/server/medicine/add-stocks`
  - Body: `{ "medicine_id": string, "add_amount": number }`
  - Response: `{ success: true, new_total: number }`

- POST `/server/medicine/subtract-stocks`
  - Body: `{ "medicine_id": string, "subtract_amount": number }`
  - Response: `{ success: true, new_total: number }`

- POST `/server/medicine/remove`
  - Body: `{ "medicine_id": string }`
  - Response: `{ success: true }`

---

## OCR (`/server/ocr`)

- POST `/server/ocr/parse`
  - Body (JSON): `{ "image_base64": "<base64string>" }` or `{ "image": "<base64string>" }`
  - Response: `{ parsed: { /* parsed prescription structure */ } }`
  - Error 400 if `image_base64` is missing.

---

## Prescription (`/server/prescription`) (auth required for most endpoints)

- POST `/server/prescription/add`
  - Body: `{ "doctor_name": string, "doc_specialization": string, "date_issued": string, "meds_list": [ ... ] }`
  - `meds_list` must be a non-empty array.
  - Response: `{ success: true, prescription_id: <id> }`

- PATCH `/server/prescription/:id/image` (multipart/form-data, auth)
  - Form field: `image` (file). Uses `multer` memory storage.
  - Response: `{ success: true, image_url: "<public url>" }`

- POST `/server/prescription/remove`
  - Body: `{ "prescription_id": string }`

- POST `/server/prescription/get`
  - Returns: `{ success: true, prescriptions: [] }`

- POST `/server/prescription/get-active`
  - Returns active prescriptions.

---

## Schedule (`/server/schedule`) (auth required)

- POST `/server/schedule/today`
  - Returns today's schedule: `{ success: true, schedule: [...] }`

---

## Vitals (`/server/vitals`) (auth required)

- POST `/server/vitals/record`
  - Body (JSON):
    - `systolic` (number)
    - `diastolic` (number)
    - `heart_bpm` (number)
    - `temperature_celsius` (number)
    - `weight_kg` (number)
    - `blood_sugar_mmol` (number)
  - Response: `{ success: true, vitals_log_id: <id> }`

---

## Errors & responses

- Most routes return JSON with either `{ success: true, ... }` or `{ error: "message" }`.
- Server errors typically respond with status 500 and `{ error: 'Unexpected error' }`.

---

## Quick cURL examples

- Login:

```
curl -X POST http://localhost:4000/server/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"me","password":"secret"}'
```

- OCR parse:

```
curl -X POST http://localhost:4000/server/ocr/parse \
  -H "Content-Type: application/json" \
  -d '{"image_base64":"<BASE64>"}'
```

---

If you want, I can:
- include example request/response bodies for each endpoint,
- generate TypeScript or OpenAPI (Swagger) spec for this API,
- or add this guide as `docs/API_GUIDE.md` instead.
