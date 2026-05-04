CREATE EXTENSION IF NOT EXISTS citext;

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS prescriptions CASCADE;
DROP TABLE IF EXISTS medicines CASCADE;
DROP TABLE IF EXISTS schedules CASCADE;
DROP TABLE IF EXISTS intake_logs CASCADE;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email CITEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    guardian_name TEXT,
    guardian_contact TEXT,
    -- Stats to monitor (e.g., {"target_bp": "120/80", "weight_kg": 55}). Not sure how to track this.
    vitals_baseline JSONB DEFAULT '{}'::jsonb, 
    -- Meal time anchors (e.g., {"breakfast": "07:00", "lunch": "12:00", "dinner": "18:00"})
    meal_times JSONB DEFAULT '{"breakfast": "06:00", "lunch": "12:00", "dinner": "18:00"}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS prescriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    doctor_name TEXT,
    date_issued DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS medicines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    prescription_id UUID REFERENCES prescriptions(id) ON DELETE CASCADE,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    start_time_per_day TIME DEFAULT '08:00:00',
    -- If true, logic shifts time based on users.meal_times e.g +30 mins after meal
    taken_after_meals BOOLEAN DEFAULT true,
    name TEXT NOT NULL, -- e.g., "Biogesic"
    strength TEXT, -- e.g., "5mg"
    hourly_gap INTEGER,
    max_per_day INTEGER,
    -- defaults to daily
    days_taken TEXT[] DEFAULT ARRAY['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']::text[],
    total_amount_prescribed INTEGER NOT NULL,
    stock_remaining INTEGER NOT NULL DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 5,
    is_active BOOLEAN DEFAULT true,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    medicine_id UUID REFERENCES medicines(id) ON DELETE CASCADE,
    -- For 'twice a day', create two rows with different time_of_day
    time_of_day TIME NOT NULL,
	deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS intake_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    schedule_id UUID REFERENCES schedules(id) ON DELETE RESTRICT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('taken', 'missed', 'pending')),
    date_scheduled DATE NOT NULL,
    logged_at TIMESTAMPTZ DEFAULT NOW(),
    -- Snapshot of vitals at time of intake if monitored
    vitals_snapshot JSONB DEFAULT '{}'::jsonb 
);
