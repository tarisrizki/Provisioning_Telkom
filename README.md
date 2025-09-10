# Provisioning Telkom Application

A comprehensive web application for managing Telkom provisioning work orders with real-time dashboard analytics and CSV data upload capabilities.

## 🚀 Features

- **Real-time Dashboard**: Live analytics and metrics from Supabase database
- **CSV Data Upload**: Process large CSV files with automatic column mapping
- **Work Order Management**: Complete CRUD operations for provisioning data
- **BIMA Status Tracking**: Live status distribution and monitoring
- **Performance Analytics**: Branch performance and channel statistics
- **Responsive Design**: Mobile-friendly modern UI

## 🛠️ Quick Setup

### 1. Environment Configuration
Create `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 2. Install & Run
```bash
npm install
npm run dev
```

### 3. Database Setup
The application requires a Supabase database with `format_order` table. Contact the development team for database schema.

## 📊 CSV Upload Format

### Required Columns
- `AO` - Account Officer number
- `WORKORDER` - Work order number

### Key Columns (Auto-mapped)
- `CHANNEL`, `DATE CREATED`, `HSA`, `BRANCH`
- `UPDATE LAPANGAN`, `SYMPTOM`, `STATUS BIMA`
- `CUSTOMER NAME`, `ADDRESS`, `SERVICE NO`
- And 40+ other columns with flexible naming support

## 🔧 Technical Stack

- **Frontend**: Next.js 15.4.6 with TypeScript
- **Backend**: Supabase PostgreSQL
- **UI**: Modern responsive design with charts
- **Data Processing**: Streaming CSV parser with pagination
- **Performance**: Optimized for 10,000+ records

## 📝 Key Pages

- `/dashboard` - Real-time analytics and KPI monitoring
- `/format-order` - CSV upload and data management
- `/laporan` - Comprehensive reporting and filtering
- `/monitoring` - System performance monitoring

## 🐛 Common Issues & Solutions

### CSV Upload Errors
- **"Value too long"**: Database column size limit reached
- **"Invalid date format"**: Date fields now support any format
- **Solution**: Contact admin for database migration

### Connection Issues
- Verify Supabase credentials in `.env.local`
- Check network connectivity and database access

## 📞 Support

For technical support or access to database schema, contact the development team.

## 📄 License

Proprietary software developed for Telkom Indonesia.
