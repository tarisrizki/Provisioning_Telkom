-- Database setup script for Provisioning Telkom application
-- Run this in your Supabase SQL editor

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS uploads CASCADE;
DROP TABLE IF EXISTS work_orders CASCADE;

-- Create work_orders table with AO as primary key
CREATE TABLE work_orders (
    ao VARCHAR(255) PRIMARY KEY,
    channel VARCHAR(255) NOT NULL,
    date_created VARCHAR(255) NOT NULL,
    workorder VARCHAR(255) NOT NULL,
    hsa VARCHAR(255) NOT NULL,
    branch VARCHAR(255) NOT NULL,
    update_lapangan TEXT,
    symptom TEXT,
    tinjut_hd_oplang TEXT,
    kategori_manja VARCHAR(255),
    status_bima VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create uploads table
CREATE TABLE uploads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    total_rows INTEGER NOT NULL,
    total_columns INTEGER NOT NULL,
    upload_date VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('processing', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_work_orders_status ON work_orders(status_bima);
CREATE INDEX idx_work_orders_branch ON work_orders(branch);
CREATE INDEX idx_work_orders_date ON work_orders(date_created);
CREATE INDEX idx_work_orders_channel ON work_orders(channel);

CREATE INDEX idx_uploads_status ON uploads(status);
CREATE INDEX idx_uploads_date ON uploads(upload_date);

-- Enable Row Level Security (RLS)
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for anonymous access
CREATE POLICY "Allow anonymous read access" ON work_orders
    FOR SELECT USING (true);

CREATE POLICY "Allow anonymous read access" ON uploads
    FOR SELECT USING (true);

-- Allow anonymous users to insert data
CREATE POLICY "Allow anonymous insert access" ON work_orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous insert access" ON uploads
    FOR INSERT WITH CHECK (true);

-- Allow anonymous users to update data
CREATE POLICY "Allow anonymous update access" ON work_orders
    FOR UPDATE USING (true);

CREATE POLICY "Allow anonymous update access" ON uploads
    FOR UPDATE USING (true);

-- Allow anonymous users to delete data
CREATE POLICY "Allow anonymous delete access" ON work_orders
    FOR DELETE USING (true);

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Display success message
DO $$
BEGIN
    RAISE NOTICE '=== DATABASE SETUP COMPLETED ===';
    RAISE NOTICE 'Tables created: work_orders, uploads';
    RAISE NOTICE 'RLS policies enabled for anonymous access';
    RAISE NOTICE 'Ready to upload CSV data!';
END $$;
