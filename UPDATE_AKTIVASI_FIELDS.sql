-- SQL Update untuk menyesuaikan data existing dengan fitur edit Aktivasi
-- Hanya update beberapa kolom yang diperlukan untuk testing fitur edit

-- Update sample data untuk testing fitur edit Aktivasi
UPDATE format_order 
SET 
  -- Pastikan workorder tidak null untuk testing edit
  workorder = CASE 
    WHEN workorder IS NULL OR workorder = '' THEN 'WO-' || LPAD(CAST(ROW_NUMBER() OVER (ORDER BY order_id) AS TEXT), 6, '0')
    ELSE workorder
  END,
  
  -- Pastikan uic ada nilai untuk testing edit
  uic = CASE 
    WHEN uic IS NULL OR uic = '' THEN 'UIC-' || LPAD(CAST(ROW_NUMBER() OVER (ORDER BY order_id) AS TEXT), 3, '0')
    ELSE uic
  END,
  
  -- Pastikan keterangan_uic ada nilai untuk testing edit  
  keterangan_uic = CASE 
    WHEN keterangan_uic IS NULL OR keterangan_uic = '' THEN 
      CASE (ROW_NUMBER() OVER (ORDER BY order_id)) % 5
        WHEN 0 THEN 'Aktivasi selesai'
        WHEN 1 THEN 'Pending dokumen'
        WHEN 2 THEN 'Menunggu teknisi'
        WHEN 3 THEN 'Ready untuk aktivasi'
        WHEN 4 THEN 'Perlu koordinasi'
      END
    ELSE keterangan_uic
  END,
  
  -- Pastikan status_bima ada nilai dan sesuai dengan dropdown options
  status_bima = CASE 
    WHEN status_bima IS NULL OR status_bima = '' OR status_bima NOT IN ('Pending', 'In Progress', 'Completed', 'Failed', 'Cancelled') THEN
      CASE (ROW_NUMBER() OVER (ORDER BY order_id)) % 5
        WHEN 0 THEN 'Completed'
        WHEN 1 THEN 'Pending'
        WHEN 2 THEN 'In Progress'
        WHEN 3 THEN 'Pending'
        WHEN 4 THEN 'In Progress'
      END
    ELSE status_bima
  END,
  
  -- Update timestamp
  updated_at = NOW()
WHERE 
  -- Hanya update data yang memerlukan penyesuaian
  workorder IS NULL OR workorder = '' OR
  uic IS NULL OR uic = '' OR
  keterangan_uic IS NULL OR keterangan_uic = '' OR
  status_bima IS NULL OR status_bima = '' OR 
  status_bima NOT IN ('Pending', 'In Progress', 'Completed', 'Failed', 'Cancelled');

-- Verify hasil update
SELECT 
  order_id,
  workorder,
  service_no,
  mitra,
  uic,
  keterangan_uic,
  status_bima
FROM format_order 
ORDER BY order_id 
LIMIT 10;
