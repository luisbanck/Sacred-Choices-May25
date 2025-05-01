-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create weeks table
CREATE TABLE weeks (
    id SERIAL PRIMARY KEY,
    week_identifier VARCHAR NOT NULL UNIQUE,
    guiding_principles TEXT,
    daily_affirmations TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create blocks table
CREATE TABLE blocks (
    id SERIAL PRIMARY KEY,
    week_id INTEGER NOT NULL REFERENCES weeks(id) ON DELETE CASCADE,
    name VARCHAR NOT NULL,
    description VARCHAR,
    original_index INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create choices table
CREATE TABLE choices (
    id SERIAL PRIMARY KEY,
    block_id INTEGER NOT NULL REFERENCES blocks(id) ON DELETE CASCADE,
    text VARCHAR NOT NULL,
    original_index INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create completions table
CREATE TABLE completions (
    id SERIAL PRIMARY KEY,
    choice_id INTEGER NOT NULL REFERENCES choices(id) ON DELETE CASCADE,
    day_index INTEGER NOT NULL CHECK (day_index >= 0 AND day_index <= 6),
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(choice_id, day_index)
);

-- Create daily_inputs table
CREATE TABLE daily_inputs (
    id SERIAL PRIMARY KEY,
    week_id INTEGER NOT NULL REFERENCES weeks(id) ON DELETE CASCADE,
    day_index INTEGER NOT NULL CHECK (day_index >= 0 AND day_index <= 6),
    value_creation TEXT,
    meditation TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(week_id, day_index)
);

-- Create indexes for better query performance
CREATE INDEX idx_weeks_identifier ON weeks(week_identifier);
CREATE INDEX idx_blocks_week_id ON blocks(week_id);
CREATE INDEX idx_choices_block_id ON choices(block_id);
CREATE INDEX idx_completions_choice_id ON completions(choice_id);
CREATE INDEX idx_daily_inputs_week_id ON daily_inputs(week_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to all tables
CREATE TRIGGER update_weeks_updated_at
    BEFORE UPDATE ON weeks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blocks_updated_at
    BEFORE UPDATE ON blocks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_choices_updated_at
    BEFORE UPDATE ON choices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_completions_updated_at
    BEFORE UPDATE ON completions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_inputs_updated_at
    BEFORE UPDATE ON daily_inputs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create RLS (Row Level Security) Policies
ALTER TABLE weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE choices ENABLE ROW LEVEL SECURITY;
ALTER TABLE completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_inputs ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON weeks
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON blocks
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON choices
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON completions
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON daily_inputs
    FOR ALL USING (auth.role() = 'authenticated'); 