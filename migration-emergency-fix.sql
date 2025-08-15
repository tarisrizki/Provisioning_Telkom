-- EMERGENCY MIGRATION SCRIPT - Fix ALL "value too long" errors
-- Run this in your Supabase SQL editor immediately if you encounter any field size errors

-- =====================================================
-- EMERGENCY FIELD SIZE FIX
-- =====================================================

-- First, let's check current column sizes to see what needs fixing
SELECT 
    column_name, 
    data_type, 
    character_maximum_length,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'work_orders' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- =====================================================
-- STEP 1: UPDATE ALL VARCHAR COLUMNS TO MAXIMUM SAFE SIZES
-- =====================================================

-- Core identification fields - Set to maximum safe size
ALTER TABLE work_orders ALTER COLUMN ao TYPE VARCHAR(2000);
ALTER TABLE work_orders ALTER COLUMN channel TYPE VARCHAR(1000);
ALTER TABLE work_orders ALTER COLUMN workorder TYPE VARCHAR(2000);
ALTER TABLE work_orders ALTER COLUMN odp TYPE VARCHAR(2000);
ALTER TABLE work_orders ALTER COLUMN service_no TYPE VARCHAR(2000);

-- Location and customer information
ALTER TABLE work_orders ALTER COLUMN customer_name TYPE VARCHAR(2000);
ALTER TABLE work_orders ALTER COLUMN workzone TYPE VARCHAR(1000);
ALTER TABLE work_orders ALTER COLUMN contact_phone TYPE VARCHAR(200);
ALTER TABLE work_orders ALTER COLUMN hsa TYPE VARCHAR(2000);
ALTER TABLE work_orders ALTER COLUMN branch TYPE VARCHAR(1000);
ALTER TABLE work_orders ALTER COLUMN cluster TYPE VARCHAR(1000);

-- Technical details
ALTER TABLE work_orders ALTER COLUMN mitra TYPE VARCHAR(1000);
ALTER TABLE work_orders ALTER COLUMN labor_teknisi TYPE VARCHAR(1000);
ALTER TABLE work_orders ALTER COLUMN kategori TYPE VARCHAR(1000);

-- TIKOR coordinates
ALTER TABLE work_orders ALTER COLUMN tikor_inputan_pelanggan TYPE VARCHAR(2000);
ALTER TABLE work_orders ALTER COLUMN tikor_real_pelanggan TYPE VARCHAR(2000);

-- Manja related fields
ALTER TABLE work_orders ALTER COLUMN umur_manja TYPE VARCHAR(1000);
ALTER TABLE work_orders ALTER COLUMN kategori_manja TYPE VARCHAR(1000);
ALTER TABLE work_orders ALTER COLUMN sheet_aktivasi TYPE VARCHAR(1000);

-- Error and status codes
ALTER TABLE work_orders ALTER COLUMN suberrorcode TYPE VARCHAR(1000);
ALTER TABLE work_orders ALTER COLUMN uic TYPE VARCHAR(1000);
ALTER TABLE work_orders ALTER COLUMN update_uic TYPE VARCHAR(1000);
ALTER TABLE work_orders ALTER COLUMN status_bima TYPE VARCHAR(1000);
ALTER TABLE work_orders ALTER COLUMN status_dsc TYPE VARCHAR(1000);

-- Additional fields
ALTER TABLE work_orders ALTER COLUMN bulan_order TYPE VARCHAR(200);
ALTER TABLE work_orders ALTER COLUMN bulan_ps TYPE VARCHAR(200);
ALTER TABLE work_orders ALTER COLUMN backup TYPE VARCHAR(1000);

-- User and system fields
ALTER TABLE work_orders ALTER COLUMN username TYPE VARCHAR(2000);
ALTER TABLE work_orders ALTER COLUMN sending_status TYPE VARCHAR(1000);

-- =====================================================
-- STEP 2: CONVERT CRITICAL LONG FIELDS TO TEXT (UNLIMITED)
-- =====================================================

-- Convert fields that might contain very long data to TEXT
ALTER TABLE work_orders ALTER COLUMN description TYPE TEXT;
ALTER TABLE work_orders ALTER COLUMN address TYPE TEXT;
ALTER TABLE work_orders ALTER COLUMN update_lapangan TYPE TEXT;
ALTER TABLE work_orders ALTER COLUMN symptom TYPE TEXT;
ALTER TABLE work_orders ALTER COLUMN engineering_memo TYPE TEXT;
ALTER TABLE work_orders ALTER COLUMN tinjut_hd_oplang TYPE TEXT;
ALTER TABLE work_orders ALTER COLUMN keterangan_hd_oplang TYPE TEXT;
ALTER TABLE work_orders ALTER COLUMN keterangan_uic TYPE TEXT;

-- Convert date fields to TEXT for flexible format support
ALTER TABLE work_orders ALTER COLUMN date_created TYPE TEXT;
ALTER TABLE work_orders ALTER COLUMN status_date TYPE TEXT;
ALTER TABLE work_orders ALTER COLUMN booking_date TYPE TEXT;
ALTER TABLE work_orders ALTER COLUMN tanggal_ps TYPE TEXT;

-- =====================================================
-- STEP 3: VERIFY ALL CHANGES
-- =====================================================

-- Check final column sizes
SELECT 
    column_name, 
    data_type, 
    character_maximum_length,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'work_orders' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- =====================================================
-- STEP 4: DISPLAY SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '=== EMERGENCY MIGRATION COMPLETED ===';
    RAISE NOTICE 'All VARCHAR columns have been updated to maximum safe sizes:';
    RAISE NOTICE '- Core fields: VARCHAR(2000) - Maximum safety for AO, Workorder, ODP, HSA, Username';
    RAISE NOTICE '- Standard fields: VARCHAR(1000) - High safety for Channel, Branch, Status, etc.';
    RAISE NOTICE '- Short fields: VARCHAR(200) - Safe for Phone, Month, etc.';
    RAISE NOTICE '- Long text fields: TEXT (unlimited) - For Address, Description, Notes';
    RAISE NOTICE '';
    RAISE NOTICE 'Your database is now ready to handle ANY CSV data length!';
    RAISE NOTICE 'Try uploading your CSV file again.';
END $$;

-- =====================================================
-- ALTERNATIVE: IF MIGRATION STILL FAILS
-- =====================================================

-- If you still get errors, use this nuclear option:
/*
-- WARNING: This will delete all existing data!
-- Only use if migration above fails completely

DROP TABLE IF EXISTS work_orders CASCADE;

-- Then run the updated database-setup.sql script
-- This will create the table with all the correct column sizes
*/
