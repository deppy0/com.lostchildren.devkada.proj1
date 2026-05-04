--CREATE EXTENSION citext;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    email CITEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    guardian_name TEXT,
    guardian_contact TEXT,
    -- Stats to monitor (e.g., {"target_bp": "120/80", "weight_kg": 55}). Not sure how to track this.
    vitals_baseline JSONB DEFAULT '{}'::jsonb, 
    -- Meal time anchors (e.g., {"breakfast": "07:00", "lunch": "12:00", "dinner": "18:00"})
    meal_times JSONB DEFAULT '{"breakfast": "06:00", "lunch": "12:00", "dinner": "18:00"}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE prescriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    doctor_name TEXT,
    date_issued DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE medicines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prescription_id UUID REFERENCES prescriptions(id) ON DELETE CASCADE,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    start_time_per_day TIME DEFAULT '08:00:00',
    name TEXT NOT NULL, -- e.g., "Biogesic"
    strength TEXT, -- e.g., "5mg"
    hourly_gap INTEGER,
    max_per_day INTEGER,
    total_amount_prescribed INTEGER NOT NULL
);

CREATE TABLE schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    medicine_id UUID REFERENCES medicines(id) ON DELETE CASCADE,
    -- For 'twice a day', create two rows with different time_of_day
    time_of_day TIME NOT NULL, 
    -- If true, logic shifts time based on users.meal_times e.g +30 mins after meal
    is_after_meal BOOLEAN DEFAULT false, 
    -- 'daily', 'mon,wed,fri', 'every_8_hours'
    frequency TEXT DEFAULT 'daily', 
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    medicine_id UUID REFERENCES medicines(id) ON DELETE CASCADE,
    pills_remaining INTEGER NOT NULL DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 5,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE intake_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    schedule_id UUID REFERENCES schedules(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('taken', 'missed', 'skipped')),
    logged_at TIMESTAMPTZ DEFAULT NOW(),
    -- Snapshot of vitals at time of intake if monitored
    vitals_snapshot JSONB DEFAULT '{}'::jsonb 
);