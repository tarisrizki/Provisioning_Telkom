# Provisioning Telkom Application

A comprehensive application for managing Telkom provisioning work orders with CSV data upload capabilities.

## Features

- **CSV Data Upload**: Upload and process large CSV files with comprehensive data mapping
- **Dashboard Analytics**: Real-time monitoring of work order statistics and performance metrics
- **Data Management**: Complete CRUD operations for work orders and upload history
- **Performance Optimization**: Streaming CSV parsing and batch database operations
- **Responsive Design**: Modern UI with mobile-friendly interface

## Database Structure

### Work Orders Table
The application now supports a comprehensive work order structure based on the actual CSV data format:

#### Core Fields
- `ao` - Account Officer number (required)
- `workorder` - Work order number (required)
- `channel` - Sales channel
- `date_created` - Order creation date (flexible format support)
- `hsa` - HSA number
- `branch` - Branch location

#### Customer & Location
- `customer_name` - Customer name
- `address` - Customer address
- `workzone` - Work zone
- `contact_phone` - Contact phone number
- `booking_date` - Booking date (flexible format support)
- `status_date` - Status update date (flexible format support)

#### Technical Details
- `odp` - ODP information
- `service_no` - Service number
- `description` - Work description
- `symptom` - Problem symptoms
- `engineering_memo` - Engineering notes
- `update_lapangan` - Field updates

#### Coordinates & GPS
- `tikor_inputan_pelanggan` - Input coordinates
- `tikor_real_pelanggan` - Real coordinates
- `lat_inputan` / `long_inputan` - Input latitude/longitude
- `lat_real` / `long_real` - Real latitude/longitude
- `selisih` - Coordinate difference

#### Manja Management
- `umur_manja` - Manja age
- `kategori_manja` - Manja category
- `sheet_aktivasi` - Activation sheet
- `tanggal_ps` - PS date (flexible format support)
- `sisa_manja` - Remaining manja

#### Status & Tracking
- `status_bima` - BIMA status
- `status_dsc` - DSC status
- `sending_status` - Sending status
- `username` - Operator username
- `timestamp` - Processing timestamp

## Setup Instructions

### 1. Database Setup

#### **Option A: Fresh Installation**
Run the SQL script in your Supabase SQL editor:

```sql
-- Copy and paste the contents of database-setup.sql
-- This will create all necessary tables, indexes, and views
```

#### **Option B: Update Existing Table**
If you already have the table and encounter "value too long" errors:

**🚨 EMERGENCY SOLUTION (Recommended for immediate fix)**
```sql
-- Copy and paste the contents of migration-emergency-fix.sql
-- This updates ALL VARCHAR columns to maximum safe sizes (VARCHAR(2000))
-- Converts critical fields to TEXT (unlimited length)
-- Use this if you're getting errors right now!
```

**Solution 1: Comprehensive Update**
```sql
-- Copy and paste the contents of migration-comprehensive-update.sql
-- This updates ALL VARCHAR columns to maximum safe sizes
```

**Solution 2: Basic Update**
```sql
-- Copy and paste the contents of migration-update-column-sizes.sql
-- This updates standard VARCHAR columns to larger sizes
```

**Last Resort: Drop and Recreate**
```sql
-- If migration fails, drop the table and run database-setup.sql
-- WARNING: This will delete all existing data!
```

### 2. Environment Variables

Create a `.env.local` file with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

## CSV Upload Format

The application automatically maps CSV columns to database fields. Supported column names include:

### Required Columns
- `AO` - Account Officer
- `WORKORDER` - Work Order Number

### Important Columns (Auto-mapped)
- `CHANNEL` - Sales Channel
- `DATE CREATED` - Creation Date
- `HSA` - HSA Number
- `BRANCH` - Branch Location
- `UPDATE LAPANGAN` - Field Updates
- `SYMPTOM` - Problem Symptoms
- `TINJUT HD OPLANG` - HD/OPLANG Review
- `KATEGORI MANJA` - Manja Category
- `STATUS BIMA` - BIMA Status

### Additional Supported Columns
- `ODP`, `SERVICE NO.`, `DESCRIPTION`
- `ADDRESS`, `CUSTOMER NAME`, `WORKZONE`
- `STATUS DATE`, `CONTACT PHONE`, `BOOKING DATE`
- `CLUSTER`, `MITRA`, `LABOR TEKNISI`
- `ENGINEERING MEMO`, `TIKOR INPUTAN PELANGGAN`
- `SHEET AKTIVASI`, `TANGGAL PS`, `KETERANGAN HD OPLANG`
- `UIC`, `UPDATE UIC`, `KETERANGAN UIC`
- `STATUS DSC`, `SISA MANJA`, `BULAN ORDER`
- `BULAN PS`, `BACKUP`, `LAT INPUTAN`, `LONG INPUTAN`
- `LAT REAL`, `LONG REAL`, `USERNAME`, `SENDING STATUS`

## Data Processing Features

### Smart Column Mapping
- Automatic detection of column variations
- Flexible matching for different naming conventions
- Support for Indonesian and English column names

### Flexible Date Format Support
- **Date fields now use TEXT type** for maximum compatibility
- **Supported formats**:
  - `DD/MM/YYYY HH.MM` (e.g., "02/07/2025 15.00")
  - `DD/MM/YYYY HH:MM` (e.g., "01/07/2025 15:55")
  - `DD/MM/YYYY` (e.g., "02/07/2025")
  - `YYYY-MM-DD` (e.g., "2025-07-02")
  - Any other date format your CSV contains
- **Affected fields**: `date_created`, `status_date`, `booking_date`, `tanggal_ps`
- **No more timestamp parsing errors** - dates are stored as-is

### Data Validation
- CSV structure validation
- Data integrity checks
- Automatic data type conversion

### Performance Optimization
- Streaming CSV parsing for large files
- Batch database operations
- IndexedDB and localStorage for temporary storage
- Progress tracking and cancellation support

## API Endpoints

### Work Orders
- `GET /api/work-orders` - Fetch work orders with filtering
- `POST /api/work-orders` - Create new work orders
- `PUT /api/work-orders/:id` - Update work order
- `DELETE /api/work-orders/:id` - Delete work order

### Uploads
- `GET /api/uploads` - Fetch upload history
- `POST /api/uploads` - Create upload record

### Analytics
- `GET /api/stats` - Get work order statistics
- `GET /api/metrics` - Get dashboard metrics

## Dashboard Features

### Real-time Metrics
- Total work orders count
- Status distribution charts
- Branch performance analysis
- Channel statistics
- Manja management insights

### Data Visualization
- Interactive charts and graphs
- Performance trend analysis
- Geographic data mapping
- Status tracking dashboard

## Browser Support

- **Modern Browsers**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Mobile**: iOS Safari 13+, Chrome Mobile 80+
- **Storage**: IndexedDB, localStorage, sessionStorage

## Performance Considerations

- **File Size Limit**: Up to 50MB CSV files
- **Memory Usage**: Optimized for large datasets
- **Processing Speed**: Streaming parsing with progress tracking
- **Database**: Batch operations for optimal performance

## Troubleshooting

### Common Issues

1. **CSV Upload Fails**
   - Check file format (must be CSV)
   - Verify column headers match expected format
   - Ensure file size is under 50MB

2. **Database Connection Issues**
   - Verify Supabase credentials in `.env.local`
   - Check network connectivity
   - Ensure database tables are created

3. **Performance Issues**
   - Use smaller CSV files for testing
   - Check browser console for errors
   - Verify database indexes are created

4. **"Value too long for type character varying" Error**
   - This error occurs when CSV data is longer than the database column limit
   - **EMERGENCY SOLUTION**: Run the emergency migration script immediately
     - Copy and paste `migration-emergency-fix.sql` to your Supabase SQL editor
     - This updates ALL VARCHAR columns to maximum safe sizes (VARCHAR(2000))
     - Converts critical fields to TEXT (unlimited length)
   - **Solution 1**: Run the comprehensive migration script
     - Copy and paste `migration-comprehensive-update.sql` to your Supabase SQL editor
     - This updates ALL VARCHAR columns to maximum safe sizes
   - **Solution 2**: Run the basic migration script
     - Copy and paste `migration-update-column-sizes.sql` to your Supabase SQL editor
     - This updates standard VARCHAR columns to larger sizes
   - **Solution 3**: Drop and recreate the table (if no important data)
     - Use the updated `database-setup.sql` with larger column sizes
   - **Column sizes after emergency update**:
     - Core fields: `VARCHAR(2000)` (AO, Workorder, ODP, HSA, Username) - Maximum safety
     - Standard fields: `VARCHAR(1000)` (Channel, Branch, Status, etc.) - High safety
     - Short fields: `VARCHAR(200)` (Phone, Month, etc.) - Safe
     - Long text: `TEXT` (Address, Description, Notes - unlimited)

5. **"Invalid input syntax for type timestamp with time zone" Error**
   - This error occurs when date formats in CSV don't match PostgreSQL timestamp format
   - **SOLUTION**: Run the emergency migration script to convert date fields to TEXT
   - **What it fixes**:
     - `date_created` - Now supports any date format
     - `status_date` - Now supports any date format  
     - `booking_date` - Now supports any date format (e.g., "02/07/2025 15.00")
     - `tanggal_ps` - Now supports any date format
   - **Supported date formats**:
     - `DD/MM/YYYY HH.MM` (e.g., "02/07/2025 15.00")
     - `DD/MM/YYYY HH:MM` (e.g., "01/07/2025 15:55")
     - `DD/MM/YYYY` (e.g., "02/07/2025")
     - Any other format your CSV contains

### Support

For technical support or feature requests, please refer to the project documentation or contact the development team.

## License

This project is proprietary software developed for Telkom Indonesia.
