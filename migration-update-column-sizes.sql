-- Migration script to update column sizes for existing work_orders table
-- Run this in your Supabase SQL editor if you already have the table

-- =====================================================
-- UPDATE COLUMN SIZES FOR EXISTING TABLE
-- =====================================================

-- Update column sizes to accommodate longer data
ALTER TABLE work_orders ALTER COLUMN ao TYPE VARCHAR(1000);
ALTER TABLE work_orders ALTER COLUMN channel TYPE VARCHAR(500);
ALTER TABLE work_orders ALTER COLUMN workorder TYPE VARCHAR(1000);
ALTER TABLE work_orders ALTER COLUMN odp TYPE VARCHAR(1000);
ALTER TABLE work_orders ALTER COLUMN service_no TYPE VARCHAR(1000);
ALTER TABLE work_orders ALTER COLUMN customer_name TYPE VARCHAR(1000);
ALTER TABLE work_orders ALTER COLUMN workzone TYPE VARCHAR(500);
ALTER TABLE work_orders ALTER COLUMN contact_phone TYPE VARCHAR(100);
ALTER TABLE work_orders ALTER COLUMN hsa TYPE VARCHAR(1000);
ALTER TABLE work_orders ALTER COLUMN branch TYPE VARCHAR(500);
ALTER TABLE work_orders ALTER COLUMN cluster TYPE VARCHAR(500);
ALTER TABLE work_orders ALTER COLUMN mitra TYPE VARCHAR(500);
ALTER TABLE work_orders ALTER COLUMN labor_teknisi TYPE VARCHAR(500);
ALTER TABLE work_orders ALTER COLUMN kategori TYPE VARCHAR(500);
ALTER TABLE work_orders ALTER COLUMN tikor_inputan_pelanggan TYPE VARCHAR(1000);
ALTER TABLE work_orders ALTER COLUMN tikor_real_pelanggan TYPE VARCHAR(1000);
ALTER TABLE work_orders ALTER COLUMN umur_manja TYPE VARCHAR(500);
ALTER TABLE work_orders ALTER COLUMN kategori_manja TYPE VARCHAR(500);
ALTER TABLE work_orders ALTER COLUMN sheet_aktivasi TYPE VARCHAR(500);
ALTER TABLE work_orders ALTER COLUMN suberrorcode TYPE VARCHAR(500);
ALTER TABLE work_orders ALTER COLUMN uic TYPE VARCHAR(500);
ALTER TABLE work_orders ALTER COLUMN update_uic TYPE VARCHAR(500);
ALTER TABLE work_orders ALTER COLUMN status_bima TYPE VARCHAR(500);
ALTER TABLE work_orders ALTER COLUMN status_dsc TYPE VARCHAR(500);
ALTER TABLE work_orders ALTER COLUMN bulan_order TYPE VARCHAR(100);
ALTER TABLE work_orders ALTER COLUMN bulan_ps TYPE VARCHAR(100);
ALTER TABLE work_orders ALTER COLUMN backup TYPE VARCHAR(500);
ALTER TABLE work_orders ALTER COLUMN username TYPE VARCHAR(1000);
ALTER TABLE work_orders ALTER COLUMN sending_status TYPE VARCHAR(500);

-- Verify the changes
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
    RAISE NOTICE '=== COLUMN SIZE MIGRATION COMPLETED ===';
    RAISE NOTICE 'All VARCHAR columns have been updated to accommodate longer data';
    RAISE NOTICE 'Ready to upload CSV data with longer field values!';
END $$;
