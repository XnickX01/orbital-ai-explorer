-- Orbital AI Explorer Database Schema

-- Create database (if needed)
-- CREATE DATABASE orbital_explorer;

-- Connect to the database
-- \c orbital_explorer;

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Launches Table
CREATE TABLE IF NOT EXISTS launches (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(500) NOT NULL,
    date TIMESTAMP NOT NULL,
    rocket VARCHAR(255),
    success BOOLEAN DEFAULT false,
    details TEXT,
    launchpad VARCHAR(255),
    crew JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rockets Table
CREATE TABLE IF NOT EXISTS rockets (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255),
    active BOOLEAN DEFAULT true,
    stages INTEGER,
    boosters INTEGER,
    cost_per_launch BIGINT,
    success_rate_pct DECIMAL(5,2) DEFAULT 0,
    first_flight VARCHAR(50),
    country VARCHAR(255),
    company VARCHAR(255),
    height DECIMAL(10,2),
    diameter DECIMAL(10,2),
    mass BIGINT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Missions Table
CREATE TABLE IF NOT EXISTS missions (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(500) NOT NULL,
    description TEXT,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    spacecraft VARCHAR(255),
    objectives JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_launches_date ON launches(date DESC);
CREATE INDEX IF NOT EXISTS idx_launches_rocket ON launches(rocket);
CREATE INDEX IF NOT EXISTS idx_launches_success ON launches(success);
CREATE INDEX IF NOT EXISTS idx_rockets_active ON rockets(active);
CREATE INDEX IF NOT EXISTS idx_rockets_company ON rockets(company);
CREATE INDEX IF NOT EXISTS idx_missions_start_date ON missions(start_date DESC);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_launches_name_text ON launches USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_rockets_name_text ON rockets USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_missions_name_text ON missions USING gin(to_tsvector('english', name));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_launches_updated_at BEFORE UPDATE ON launches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rockets_updated_at BEFORE UPDATE ON rockets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_missions_updated_at BEFORE UPDATE ON missions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing
INSERT INTO launches (id, name, date, rocket, success, details) VALUES
('sample-1', 'Test Launch 1', '2024-01-15 10:00:00', 'Falcon 9', true, 'Successful test launch of satellite deployment system'),
('sample-2', 'Test Launch 2', '2024-02-20 14:30:00', 'Falcon Heavy', true, 'Mars mission supplies deployment'),
('sample-3', 'Test Launch 3', '2024-03-10 08:15:00', 'Starship', false, 'Experimental flight test')
ON CONFLICT (id) DO NOTHING;

INSERT INTO rockets (id, name, type, active, stages, boosters, cost_per_launch, success_rate_pct, first_flight, country, company, height, diameter, mass, description) VALUES
('falcon9', 'Falcon 9', 'Orbital', true, 2, 0, 62000000, 98.5, '2010-06-04', 'USA', 'SpaceX', 70.0, 3.7, 549054, 'Two-stage reusable rocket designed for reliable and safe transport'),
('falconheavy', 'Falcon Heavy', 'Orbital', true, 2, 2, 90000000, 100.0, '2018-02-06', 'USA', 'SpaceX', 70.0, 12.2, 1420788, 'Worlds most powerful operational rocket by a factor of two')
ON CONFLICT (id) DO NOTHING;

INSERT INTO missions (id, name, description, start_date, objectives) VALUES
('artemis-1', 'Artemis I', 'First integrated test of NASA Space Launch System and Orion spacecraft', '2022-11-16 06:47:00', '["Test deep space navigation", "Evaluate spacecraft systems", "Demonstrate heat shield performance"]'),
('mars-2020', 'Mars 2020 Perseverance', 'Mars rover mission to search for signs of ancient microbial life', '2020-07-30 11:50:00', '["Search for biosignatures", "Collect rock samples", "Test oxygen production"]')
ON CONFLICT (id) DO NOTHING;
