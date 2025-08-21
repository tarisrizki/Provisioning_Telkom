-- Database setup script for Provisioning Telkom application
-- Based on the actual CSV structure provided

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create work_orders table with all the columns from CSV
CREATE TABLE IF NOT EXISTS work_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Core identification fields
    ao VARCHAR(2000) NOT NULL,
    channel VARCHAR(1000),
    date_created TEXT, -- Flexible date format support
    workorder VARCHAR(2000) NOT NULL,
    odp VARCHAR(2000),
    service_no VARCHAR(2000),
    description TEXT,
    
    -- Location and customer information
    address TEXT,
    customer_name VARCHAR(2000),
    workzone VARCHAR(1000),
    status_date TEXT, -- Flexible date format support
    contact_phone VARCHAR(200),
    booking_date TEXT, -- Flexible date format support
    hsa VARCHAR(2000),
    branch VARCHAR(1000),
    cluster VARCHAR(1000),
    
    -- Technical details
    mitra VARCHAR(1000),
    labor_teknisi VARCHAR(1000),
    kategori VARCHAR(1000),
    update_lapangan TEXT,
    symptom TEXT,
    engineering_memo TEXT,
    
    -- TIKOR coordinates
    tikor_inputan_pelanggan VARCHAR(2000),
    tikor_real_pelanggan VARCHAR(2000),
    selisih DECIMAL(10,2),
    
    -- Manja related fields
    umur_manja VARCHAR(1000),
    kategori_manja VARCHAR(1000),
    sheet_aktivasi VARCHAR(1000),
    tanggal_ps TEXT, -- Flexible date format support
    tinjut_hd_oplang TEXT,
    keterangan_hd_oplang TEXT,
    
    -- Error and status codes
    suberrorcode VARCHAR(1000),
    uic VARCHAR(1000),
    update_uic VARCHAR(1000),
    keterangan_uic TEXT,
    status_bima VARCHAR(1000),
    status_dsc VARCHAR(1000),
    
    -- Additional fields
    sisa_manja DECIMAL(10,2),
    bulan_order VARCHAR(200),
    bulan_ps VARCHAR(200),
    backup VARCHAR(1000),
    
    -- GPS coordinates
    lat_inputan DECIMAL(10,6),
    long_inputan DECIMAL(10,6),
    lat_real DECIMAL(10,6),
    long_real DECIMAL(10,6),
    
    -- User and system fields
    username VARCHAR(2000),
    sending_status VARCHAR(1000),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create uploads table for tracking file uploads
CREATE TABLE IF NOT EXISTS uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename VARCHAR(255) NOT NULL,
    total_rows INTEGER NOT NULL,
    total_columns INTEGER NOT NULL,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create dashboard_metrics table for analytics
CREATE TABLE IF NOT EXISTS dashboard_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    total_work_orders INTEGER DEFAULT 0,
    avg_provisioning_time INTERVAL,
    success_rate DECIMAL(5,2),
    failure_rate DECIMAL(5,2),
    in_progress_rate DECIMAL(5,2),
    monthly_data JSONB,
    bima_status_data JSONB,
    field_update_data JSONB,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_work_orders_ao ON work_orders(ao);
CREATE INDEX IF NOT EXISTS idx_work_orders_workorder ON work_orders(workorder);
CREATE INDEX IF NOT EXISTS idx_work_orders_date_created ON work_orders(date_created);
CREATE INDEX IF NOT EXISTS idx_work_orders_status_bima ON work_orders(status_bima);
CREATE INDEX IF NOT EXISTS idx_work_orders_branch ON work_orders(branch);
CREATE INDEX IF NOT EXISTS idx_work_orders_hsa ON work_orders(hsa);
CREATE INDEX IF NOT EXISTS idx_work_orders_kategori_manja ON work_orders(kategori_manja);
CREATE INDEX IF NOT EXISTS idx_work_orders_uploaded_at ON work_orders(created_at);

CREATE INDEX IF NOT EXISTS idx_uploads_filename ON uploads(filename);
CREATE INDEX IF NOT EXISTS idx_uploads_status ON uploads(status);
CREATE INDEX IF NOT EXISTS idx_uploads_upload_date ON uploads(upload_date);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_work_orders_updated_at 
    BEFORE UPDATE ON work_orders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_uploads_updated_at 
    BEFORE UPDATE ON uploads 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create view for work order statistics
CREATE OR REPLACE VIEW work_order_stats AS
SELECT 
    COUNT(*) as total_work_orders,
    COUNT(CASE WHEN status_bima = 'COMPLETED' THEN 1 END) as completed_orders,
    COUNT(CASE WHEN status_bima = 'IN_PROGRESS' THEN 1 END) as in_progress_orders,
    COUNT(CASE WHEN status_bima = 'CANCELLED' THEN 1 END) as cancelled_orders,
    COUNT(CASE WHEN status_bima = 'PENDING' THEN 1 END) as pending_orders,
    COUNT(CASE WHEN kategori_manja = 'LEWAT MANJA' THEN 1 END) as lewat_manja_count,
    COUNT(CASE WHEN umur_manja LIKE '%>%' THEN 1 END) as overdue_manja_count
FROM work_orders;

-- Create view for branch statistics
CREATE OR REPLACE VIEW branch_stats AS
SELECT 
    branch,
    COUNT(*) as total_orders,
    COUNT(CASE WHEN status_bima = 'COMPLETED' THEN 1 END) as completed_orders,
    COUNT(CASE WHEN status_bima = 'IN_PROGRESS' THEN 1 END) as in_progress_orders,
    COUNT(CASE WHEN kategori_manja = 'LEWAT MANJA' THEN 1 END) as lewat_manja_count
FROM work_orders 
WHERE branch IS NOT NULL 
GROUP BY branch 
ORDER BY total_orders DESC;

-- Create view for channel statistics
CREATE OR REPLACE VIEW channel_stats AS
SELECT 
    channel,
    COUNT(*) as total_orders,
    COUNT(CASE WHEN status_bima = 'COMPLETED' THEN 1 END) as completed_orders,
    COUNT(CASE WHEN status_bima = 'IN_PROGRESS' THEN 1 END) as in_progress_orders
FROM work_orders 
WHERE channel IS NOT NULL 
GROUP BY channel 
ORDER BY total_orders DESC;

-- Insert sample data for testing (optional)
-- INSERT INTO work_orders (ao, channel, date_created, workorder, odp, service_no, description, address, customer_name, workzone, status_date, contact_phone, booking_date, hsa, branch, cluster, mitra, labor_teknisi, kategori, update_lapangan, symptom, engineering_memo, tikor_inputan_pelanggan, tikor_real_pelanggan, selisih, umur_manja, kategori_manja, sheet_aktivasi, tanggal_ps, tinjut_hd_oplang, keterangan_hd_oplang, suberrorcode, uic, update_uic, keterangan_uic, status_bima, status_dsc, sisa_manja, bulan_order, bulan_ps, backup, lat_inputan, long_inputan, lat_real, long_real, username, sending_status) VALUES 
-- ('AOb02506260417312688665d0', 'DIGIPOS', '2025-07-01 15:55:00', 'WO024972162', 'WEC250626161731064404323-AOb02506260417312688665d0_35153285-255153779~2025070115552817403228~17403228~57624569~3~WSA', '111133104832', 'Pull Drop Core', 'Keude dua WQM5+CQQ, Keude Dua, Kec. Darul Ihsan, Kabupaten Aceh Timur, Aceh 24454, Indone Kabupaten Aceh Timur 24454', 'MAULIDA SANTI', 'IDI', '2025-07-04 18:37:00', '6285222313047', '2025-07-02 15:00:00', 'LANGSA', 'BINJAI', 'LANGSA', NULL, 'ATM', NULL, '> 9 hari', 'C.KENDALA TEKNIK (UNSC)', 'TIDAK ADA ODP', 'DI LOKASI PELANGGAN TIDAK ADA ALPRO', NULL, NULL, 'umur > 3 hari', 'LEWAT MANJA', NULL, NULL, 'FU AGEN IPO (UNSC)', '4.931536,97.760587', NULL, 'ASO', 'UPDATE UIC', NULL, 'CANCLWORK', NULL, -976.5, 'July', NULL, NULL, 4.931536, 97.760587, NULL, NULL, '@andika0207 @Bayuazhary', 'SENT');

-- Grant necessary permissions (adjust according to your Supabase setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authenticated;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO authenticated;
-- GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- =====================================================
-- MIGRATION SCRIPT FOR EXISTING TABLES
-- Run this if you already have the table and need to update column sizes
-- =====================================================

-- Uncomment and run these ALTER statements if you need to update existing table
/*
-- Update column sizes for existing work_orders table
ALTER TABLE work_orders ALTER COLUMN ao TYPE VARCHAR(500);
ALTER TABLE work_orders ALTER COLUMN channel TYPE VARCHAR(200);
ALTER TABLE work_orders ALTER COLUMN workorder TYPE VARCHAR(500);
ALTER TABLE work_orders ALTER COLUMN odp TYPE VARCHAR(500);
ALTER TABLE work_orders ALTER COLUMN service_no TYPE VARCHAR(500);
ALTER TABLE work_orders ALTER COLUMN customer_name TYPE VARCHAR(500);
ALTER TABLE work_orders ALTER COLUMN workzone TYPE VARCHAR(200);
ALTER TABLE work_orders ALTER COLUMN contact_phone TYPE VARCHAR(50);
ALTER TABLE work_orders ALTER COLUMN hsa TYPE VARCHAR(500);
ALTER TABLE work_orders ALTER COLUMN branch TYPE VARCHAR(200);
ALTER TABLE work_orders ALTER COLUMN cluster TYPE VARCHAR(200);
ALTER TABLE work_orders ALTER COLUMN mitra TYPE VARCHAR(200);
ALTER TABLE work_orders ALTER COLUMN labor_teknisi TYPE VARCHAR(200);
ALTER TABLE work_orders ALTER COLUMN kategori TYPE VARCHAR(200);
ALTER TABLE work_orders ALTER COLUMN tikor_inputan_pelanggan TYPE VARCHAR(500);
ALTER TABLE work_orders ALTER COLUMN tikor_real_pelanggan TYPE VARCHAR(500);
ALTER TABLE work_orders ALTER COLUMN umur_manja TYPE VARCHAR(200);
ALTER TABLE work_orders ALTER COLUMN kategori_manja TYPE VARCHAR(200);
ALTER TABLE work_orders ALTER COLUMN sheet_aktivasi TYPE VARCHAR(200);
ALTER TABLE work_orders ALTER COLUMN suberrorcode TYPE VARCHAR(200);
ALTER TABLE work_orders ALTER COLUMN uic TYPE VARCHAR(200);
ALTER TABLE work_orders ALTER COLUMN update_uic TYPE VARCHAR(200);
ALTER TABLE work_orders ALTER COLUMN status_bima TYPE VARCHAR(200);
ALTER TABLE work_orders ALTER COLUMN status_dsc TYPE VARCHAR(200);
ALTER TABLE work_orders ALTER COLUMN bulan_order TYPE VARCHAR(50);
ALTER TABLE work_orders ALTER COLUMN bulan_ps TYPE VARCHAR(50);
ALTER TABLE work_orders ALTER COLUMN backup TYPE VARCHAR(200);
ALTER TABLE work_orders ALTER COLUMN username TYPE VARCHAR(500);
ALTER TABLE work_orders ALTER COLUMN sending_status TYPE VARCHAR(200);

-- Verify the changes
SELECT column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'work_orders' 
AND table_schema = 'public'
ORDER BY ordinal_position;
*/
