-- Test data script for Provisioning Telkom application
-- Run this AFTER running database-setup.sql

-- Insert test work orders
INSERT INTO work_orders (ao, channel, date_created, workorder, hsa, branch, update_lapangan, symptom, tinjut_hd_oplang, kategori_manja, status_bima) VALUES
('AO001', 'CHANNEL_A', '2024-01-15', 'WO001', 'HSA001', 'BRANCH_A', 'Kendala Pelanggan', 'Network issue', 'Tinjut 1', 'lewat manja', 'COMPLETE'),
('AO002', 'CHANNEL_B', '2024-01-16', 'WO002', 'HSA002', 'BRANCH_B', 'Kendala Teknik (UNSC)', 'Hardware issue', 'Tinjut 2', 'lewat manja', 'WORKFAIL'),
('AO003', 'CHANNEL_C', '2024-01-17', 'WO003', 'HSA003', 'BRANCH_C', 'Salah Segmen', 'Configuration issue', 'Tinjut 3', 'lewat manja', 'CANCLWORK'),
('AO004', 'CHANNEL_D', '2024-01-18', 'WO004', 'HSA004', 'BRANCH_D', 'Force Majuere', 'Software issue', 'Tinjut 4', 'lewat manja', 'COMPLETE'),
('AO005', 'CHANNEL_E', '2024-01-19', 'WO005', 'HSA005', 'BRANCH_E', 'Kendala Pelanggan', 'Performance issue', 'Tinjut 5', 'lewat manja', 'PROGRESS')
ON CONFLICT (ao) DO NOTHING;

-- Insert test upload record
INSERT INTO uploads (filename, total_rows, total_columns, upload_date, status) VALUES
('test-data.csv', 5, 11, '2024-01-15', 'completed')
ON CONFLICT DO NOTHING;

-- Display test data message
DO $$
BEGIN
    RAISE NOTICE '=== TEST DATA INSERTED ===';
    RAISE NOTICE '5 test work orders inserted';
    RAISE NOTICE '1 test upload record inserted';
    RAISE NOTICE 'Ready to test application!';
END $$;
