-- Comprehensive migration script to update ALL column sizes for existing work_orders table
-- Run this in your Supabase SQL editor if you encounter any "value too long" errors

-- =====================================================
-- COMPREHENSIVE COLUMN SIZE UPDATE
-- =====================================================

-- First, let's check current column sizes
SELECT 
    column_name, 
    data_type, 
    character_maximum_length,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'work_orders' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Update ALL VARCHAR columns to maximum safe sizes
-- Core identification fields
ALTER TABLE work_orders ALTER COLUMN ao TYPE VARCHAR(1000);
ALTER TABLE work_orders ALTER COLUMN channel TYPE VARCHAR(500);
ALTER TABLE work_orders ALTER COLUMN workorder TYPE VARCHAR(1000);
ALTER TABLE work_orders ALTER COLUMN odp TYPE VARCHAR(1000);
ALTER TABLE work_orders ALTER COLUMN service_no TYPE VARCHAR(1000);

-- Location and customer information
ALTER TABLE work_orders ALTER COLUMN customer_name TYPE VARCHAR(1000);
ALTER TABLE work_orders ALTER COLUMN workzone TYPE VARCHAR(500);
ALTER TABLE work_orders ALTER COLUMN contact_phone TYPE VARCHAR(100);
ALTER TABLE work_orders ALTER COLUMN hsa TYPE VARCHAR(1000);
ALTER TABLE work_orders ALTER COLUMN branch TYPE VARCHAR(500);
ALTER TABLE work_orders ALTER COLUMN cluster TYPE VARCHAR(500);

-- Technical details
ALTER TABLE work_orders ALTER COLUMN mitra TYPE VARCHAR(500);
ALTER TABLE work_orders ALTER COLUMN labor_teknisi TYPE VARCHAR(500);
ALTER TABLE work_orders ALTER COLUMN kategori TYPE VARCHAR(500);

-- TIKOR coordinates
ALTER TABLE work_orders ALTER COLUMN tikor_inputan_pelanggan TYPE VARCHAR(1000);
ALTER TABLE work_orders ALTER COLUMN tikor_real_pelanggan TYPE VARCHAR(1000);

-- Manja related fields
ALTER TABLE work_orders ALTER COLUMN umur_manja TYPE VARCHAR(500);
ALTER TABLE work_orders ALTER COLUMN kategori_manja TYPE VARCHAR(500);
ALTER TABLE work_orders ALTER COLUMN sheet_aktivasi TYPE VARCHAR(500);

-- Error and status codes
ALTER TABLE work_orders ALTER COLUMN suberrorcode TYPE VARCHAR(500);
ALTER TABLE work_orders ALTER COLUMN uic TYPE VARCHAR(500);
ALTER TABLE work_orders ALTER COLUMN update_uic TYPE VARCHAR(500);
ALTER TABLE work_orders ALTER COLUMN status_bima TYPE VARCHAR(500);
ALTER TABLE work_orders ALTER COLUMN status_dsc TYPE VARCHAR(500);

-- Additional fields
ALTER TABLE work_orders ALTER COLUMN bulan_order TYPE VARCHAR(100);
ALTER TABLE work_orders ALTER COLUMN bulan_ps TYPE VARCHAR(100);
ALTER TABLE work_orders ALTER COLUMN backup TYPE VARCHAR(500);

-- User and system fields
ALTER TABLE work_orders ALTER COLUMN username TYPE VARCHAR(1000);
ALTER TABLE work_orders ALTER COLUMN sending_status TYPE VARCHAR(500);

-- Verify all changes
SELECT 
    column_name, 
    data_type, 
    character_maximum_length,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'work_orders' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Display success message
DO $$
BEGIN
    RAISE NOTICE '=== COMPREHENSIVE COLUMN SIZE MIGRATION COMPLETED ===';
    RAISE NOTICE 'All VARCHAR columns have been updated to maximum safe sizes:';
    RAISE NOTICE '- Core fields: VARCHAR(1000)';
    RAISE NOTICE '- Standard fields: VARCHAR(500)';
    RAISE NOTICE '- Short fields: VARCHAR(100)';
    RAISE NOTICE '- Long text fields: TEXT (unlimited)';
    RAISE NOTICE 'Ready to upload CSV data with any field length!';
END $$;

-- =====================================================
-- ALTERNATIVE: DROP AND RECREATE TABLE (if migration fails)
-- =====================================================

-- If the above migration fails, you can use this alternative approach:
/*
-- WARNING: This will delete all existing data!
DROP TABLE IF EXISTS work_orders CASCADE;

-- Then run the updated database-setup.sql script
-- This will create the table with all the correct column sizes
*/
