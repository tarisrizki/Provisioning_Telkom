import { createSupabaseClient, TABLES, type WorkOrder, type Upload, type DashboardMetrics, type WorkOrderStats } from './supabase'

interface DataIntegrityReport {
  totalRecords: number
  missingData: number
  dataQuality: string
}

interface UploadHistoryRecord {
  id: string
  filename: string
  total_rows: number
  total_columns: number
  upload_date: string
  status: string
  created_at: string
}

export class DatabaseService {
  // Work Orders
  static async insertWorkOrders(workOrders: WorkOrder[]): Promise<{ success: boolean; error?: string; insertedCount?: number }> {
    try {
      const supabase = createSupabaseClient()
      const { data, error } = await supabase
        .from(TABLES.WORK_ORDERS)
        .insert(workOrders)
        .select()

      if (error) {
        console.error('Error inserting work orders:', error)
        return { success: false, error: error.message }
      }

      return { success: true, insertedCount: data?.length || 0 }
    } catch (error) {
      console.error('Exception inserting work orders:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  static async getWorkOrders(filters?: {
    ao?: string
    channel?: string
    branch?: string
    date_from?: string
    date_to?: string
    status?: string
    limit?: number
    offset?: number
  }): Promise<{ success: boolean; data?: WorkOrder[]; error?: string; count?: number }> {
    try {
      const supabase = createSupabaseClient()
      let query = supabase
        .from(TABLES.WORK_ORDERS)
        .select('*', { count: 'exact' })

      // Apply filters
      if (filters?.ao) {
        query = query.ilike('ao', `%${filters.ao}%`)
      }
      if (filters?.channel) {
        query = query.ilike('channel', `%${filters.channel}%`)
      }
      if (filters?.branch) {
        query = query.ilike('branch', `%${filters.branch}%`)
      }
      if (filters?.status) {
        query = query.ilike('status_bima', `%${filters.status}%`)
      }
      if (filters?.date_from) {
        query = query.gte('date_created', filters.date_from)
      }
      if (filters?.date_to) {
        query = query.lte('date_created', filters.date_to)
      }

      // Apply pagination
      if (filters?.limit) {
        query = query.limit(filters.limit)
      }
      if (filters?.offset) {
        query = query.range(filters.offset, (filters.offset + (filters.limit || 50)) - 1)
      }

      const { data, error, count } = await query

      if (error) {
        console.error('Error fetching work orders:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data: data || [], count: count || 0 }
    } catch (error) {
      console.error('Exception fetching work orders:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  static async getWorkOrdersCount(): Promise<{ success: boolean; count?: number; error?: string }> {
    try {
      const supabase = createSupabaseClient()
      const { count, error } = await supabase
        .from(TABLES.WORK_ORDERS)
        .select('*', { count: 'exact', head: true })

      if (error) {
        console.error('Error counting work orders:', error)
        return { success: false, error: error.message }
      }

      return { success: true, count: count || 0 }
    } catch (error) {
      console.error('Exception counting work orders:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  static async deleteAllWorkOrders(): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = createSupabaseClient()
      const { error } = await supabase
        .from(TABLES.WORK_ORDERS)
        .delete()
        .neq('id', '') // Delete all records

      if (error) {
        console.error('Error deleting work orders:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Exception deleting work orders:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Uploads
  static async createUpload(upload: Omit<Upload, 'id' | 'created_at'>): Promise<{ success: boolean; data?: Upload; error?: string }> {
    try {
      const supabase = createSupabaseClient()
      const { data, error } = await supabase
        .from(TABLES.UPLOADS)
        .insert(upload)
        .select()
        .single()

      if (error) {
        console.error('Error creating upload:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data: data || undefined }
    } catch (error) {
      console.error('Exception creating upload:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  static async getUploads(): Promise<{ success: boolean; data?: Upload[]; error?: string }> {
    try {
      const supabase = createSupabaseClient()
      const { data, error } = await supabase
        .from(TABLES.UPLOADS)
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching uploads:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data: data || [] }
    } catch (error) {
      console.error('Exception fetching uploads:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  static async deleteUpload(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = createSupabaseClient()
      const { error } = await supabase
        .from(TABLES.UPLOADS)
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting upload:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Exception deleting upload:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Dashboard Metrics
  static async createDashboardMetrics(metrics: Omit<DashboardMetrics, 'id' | 'created_at'>): Promise<{ success: boolean; data?: DashboardMetrics; error?: string }> {
    try {
      const supabase = createSupabaseClient()
      const { data, error } = await supabase
        .from(TABLES.DASHBOARD_METRICS)
        .insert(metrics)
        .select()
        .single()

      if (error) {
        console.error('Error creating dashboard metrics:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data: data || undefined }
    } catch (error) {
      console.error('Exception creating dashboard metrics:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  static async getLatestDashboardMetrics(): Promise<{ success: boolean; data?: DashboardMetrics; error?: string }> {
    try {
      const supabase = createSupabaseClient()
      const { data, error } = await supabase
        .from(TABLES.DASHBOARD_METRICS)
        .select('*')
        .order('calculated_at', { ascending: false })
        .limit(1)
        .single()

      if (error) {
        console.error('Error fetching latest dashboard metrics:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data: data || undefined }
    } catch (error) {
      console.error('Exception fetching latest dashboard metrics:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // CSV Processing
  static async processCSVData(csvData: { headers: string[]; rows: string[][] }, filename: string): Promise<{ success: boolean; error?: string; insertedCount?: number }> {
    try {
      console.log('Processing CSV data:', { filename, rows: csvData.rows.length, columns: csvData.headers.length })
      console.log('CSV Headers:', csvData.headers)

      // Validate CSV structure first
      const validationResult = this.validateCSVStructure(csvData.headers)
      if (!validationResult.isValid) {
        return { success: false, error: `CSV structure validation failed: ${validationResult.missingColumns.join(', ')}` }
      }

      // Create upload record
      const uploadResult = await this.createUpload({
        filename,
        total_rows: csvData.rows.length,
        total_columns: csvData.headers.length,
        upload_date: new Date().toISOString(),
        status: 'processing'
      })

      if (!uploadResult.success) {
        return { success: false, error: `Failed to create upload record: ${uploadResult.error}` }
      }

      // Convert CSV rows to work orders with comprehensive column mapping
      const workOrders: WorkOrder[] = csvData.rows.map((row, index) => {
        // Comprehensive column mapping based on actual CSV structure
        const aoIndex = this.findColumnIndex(csvData.headers, ['ao', 'ao_number', 'ao_id'])
        const channelIndex = this.findColumnIndex(csvData.headers, ['channel', 'channel_type', 'sales_channel'])
        const dateIndex = this.findColumnIndex(csvData.headers, ['date created', 'date_created', 'date', 'created_date', 'order_date'])
        const workOrderIndex = this.findColumnIndex(csvData.headers, ['workorder', 'work_order', 'wo', 'order_number'])
        const odpIndex = this.findColumnIndex(csvData.headers, ['odp', 'odp_id', 'odp_number'])
        const serviceNoIndex = this.findColumnIndex(csvData.headers, ['service no.', 'service_no', 'service_number', 'service'])
        const descriptionIndex = this.findColumnIndex(csvData.headers, ['description', 'desc', 'deskripsi'])
        const addressIndex = this.findColumnIndex(csvData.headers, ['address', 'alamat', 'location'])
        const customerNameIndex = this.findColumnIndex(csvData.headers, ['customer name', 'customer_name', 'nama_pelanggan', 'pelanggan'])
        const workzoneIndex = this.findColumnIndex(csvData.headers, ['workzone', 'work_zone', 'zone'])
        const statusDateIndex = this.findColumnIndex(csvData.headers, ['status date', 'status_date', 'tanggal_status'])
        const contactPhoneIndex = this.findColumnIndex(csvData.headers, ['contact phone', 'contact_phone', 'phone', 'telepon'])
        const bookingDateIndex = this.findColumnIndex(csvData.headers, ['booking date', 'booking_date', 'tanggal_booking'])
        const hsaIndex = this.findColumnIndex(csvData.headers, ['hsa', 'hsa_id', 'hsa_number'])
        const branchIndex = this.findColumnIndex(csvData.headers, ['branch', 'branch_name', 'location', 'cabang'])
        const clusterIndex = this.findColumnIndex(csvData.headers, ['cluster', 'klaster'])
        const mitraIndex = this.findColumnIndex(csvData.headers, ['mitra', 'partner'])
        const laborTeknisiIndex = this.findColumnIndex(csvData.headers, ['labor teknisi', 'labor_teknisi', 'teknisi'])
        const kategoriIndex = this.findColumnIndex(csvData.headers, ['kategori', 'category', 'type'])
        const updateLapanganIndex = this.findColumnIndex(csvData.headers, ['update lapangan', 'update_lapangan', 'field_update', 'update', 'status_update'])
        const symptomIndex = this.findColumnIndex(csvData.headers, ['symptom', 'issue', 'problem', 'gejala'])
        const engineeringMemoIndex = this.findColumnIndex(csvData.headers, ['engineering memo', 'engineering_memo', 'memo'])
        const tikorInputanIndex = this.findColumnIndex(csvData.headers, ['tikor inputan pelanggan', 'tikor_inputan_pelanggan', 'tikor_input'])
        const tikorRealIndex = this.findColumnIndex(csvData.headers, ['tikor real pelanggan', 'tikor_real_pelanggan', 'tikor_real'])
        const selisihIndex = this.findColumnIndex(csvData.headers, ['selisih', 'difference'])
        const umurManjaIndex = this.findColumnIndex(csvData.headers, ['umur manja', 'umur_manja', 'umur'])
        const kategoriManjaIndex = this.findColumnIndex(csvData.headers, ['kategori manja', 'kategori_manja', 'kategori manja', 'category', 'type', 'manja'])
        const sheetAktivasiIndex = this.findColumnIndex(csvData.headers, ['sheet aktivasi', 'sheet_aktivasi', 'aktivasi'])
        const tanggalPsIndex = this.findColumnIndex(csvData.headers, ['tanggal ps', 'tanggal_ps', 'ps_date'])
        const tinjutIndex = this.findColumnIndex(csvData.headers, ['tinjut hd oplang', 'tinjut_hd_oplang', 'tinjut', 'hd_oplang', 'handling'])
        const keteranganHdIndex = this.findColumnIndex(csvData.headers, ['keterangan hd oplang', 'keterangan_hd_oplang', 'keterangan_hd'])
        const suberrorcodeIndex = this.findColumnIndex(csvData.headers, ['suberrorcode', 'error_code', 'error'])
        const uicIndex = this.findColumnIndex(csvData.headers, ['uic', 'uic_id'])
        const updateUicIndex = this.findColumnIndex(csvData.headers, ['update uic', 'update_uic'])
        const keteranganUicIndex = this.findColumnIndex(csvData.headers, ['keterangan uic', 'keterangan_uic'])
        const statusBimaIndex = this.findColumnIndex(csvData.headers, ['status bima', 'status_bima', 'bima_status', 'bima status', 'status', 'order_status'])
        const statusDscIndex = this.findColumnIndex(csvData.headers, ['status dsc', 'status_dsc', 'dsc_status'])
        const sisaManjaIndex = this.findColumnIndex(csvData.headers, ['sisa manja', 'sisa_manja', 'sisa'])
        const bulanOrderIndex = this.findColumnIndex(csvData.headers, ['bulan order', 'bulan_order', 'order_month'])
        const bulanPsIndex = this.findColumnIndex(csvData.headers, ['bulan ps', 'bulan_ps', 'ps_month'])
        const backupIndex = this.findColumnIndex(csvData.headers, ['backup', 'backup_data'])
        const latInputanIndex = this.findColumnIndex(csvData.headers, ['lat inputan', 'lat_inputan', 'latitude_input'])
        const longInputanIndex = this.findColumnIndex(csvData.headers, ['long inputan', 'long_inputan', 'longitude_input'])
        const latRealIndex = this.findColumnIndex(csvData.headers, ['lat real', 'lat_real', 'latitude_real'])
        const longRealIndex = this.findColumnIndex(csvData.headers, ['long real', 'long_real', 'longitude_real'])
        const usernameIndex = this.findColumnIndex(csvData.headers, ['username', 'user', 'operator'])
        const sendingStatusIndex = this.findColumnIndex(csvData.headers, ['sending status', 'sending_status', 'status_sending'])

        // Log column mapping for debugging
        if (index === 0) {
          console.log('CSV Headers:', csvData.headers)
          console.log('Column mapping for first row:', {
            ao: { index: aoIndex, value: row[aoIndex], header: csvData.headers[aoIndex] },
            channel: { index: channelIndex, value: row[channelIndex], header: csvData.headers[channelIndex] },
            date_created: { index: dateIndex, value: row[dateIndex], header: csvData.headers[dateIndex] },
            workorder: { index: workOrderIndex, value: row[workOrderIndex], header: csvData.headers[workOrderIndex] },
            odp: { index: odpIndex, value: row[odpIndex], header: csvData.headers[odpIndex] },
            service_no: { index: serviceNoIndex, value: row[serviceNoIndex], header: csvData.headers[serviceNoIndex] },
            description: { index: descriptionIndex, value: row[descriptionIndex], header: csvData.headers[descriptionIndex] },
            address: { index: addressIndex, value: row[addressIndex], header: csvData.headers[addressIndex] },
            customer_name: { index: customerNameIndex, value: row[customerNameIndex], header: csvData.headers[customerNameIndex] },
            workzone: { index: workzoneIndex, value: row[workzoneIndex], header: csvData.headers[workzoneIndex] },
            status_date: { index: statusDateIndex, value: row[statusDateIndex], header: csvData.headers[statusDateIndex] },
            contact_phone: { index: contactPhoneIndex, value: row[contactPhoneIndex], header: csvData.headers[contactPhoneIndex] },
            booking_date: { index: bookingDateIndex, value: row[bookingDateIndex], header: csvData.headers[bookingDateIndex] },
            hsa: { index: hsaIndex, value: row[hsaIndex], header: csvData.headers[hsaIndex] },
            branch: { index: branchIndex, value: row[branchIndex], header: csvData.headers[branchIndex] },
            cluster: { index: clusterIndex, value: row[clusterIndex], header: csvData.headers[clusterIndex] },
            mitra: { index: mitraIndex, value: row[mitraIndex], header: csvData.headers[mitraIndex] },
            labor_teknisi: { index: laborTeknisiIndex, value: row[laborTeknisiIndex], header: csvData.headers[laborTeknisiIndex] },
            kategori: { index: kategoriIndex, value: row[kategoriIndex], header: csvData.headers[kategoriIndex] },
            update_lapangan: { index: updateLapanganIndex, value: row[updateLapanganIndex], header: csvData.headers[updateLapanganIndex] },
            symptom: { index: symptomIndex, value: row[symptomIndex], header: csvData.headers[symptomIndex] },
            engineering_memo: { index: engineeringMemoIndex, value: row[engineeringMemoIndex], header: csvData.headers[engineeringMemoIndex] },
            tikor_inputan_pelanggan: { index: tikorInputanIndex, value: row[tikorInputanIndex], header: csvData.headers[tikorInputanIndex] },
            tikor_real_pelanggan: { index: tikorRealIndex, value: row[tikorRealIndex], header: csvData.headers[tikorRealIndex] },
            selisih: { index: selisihIndex, value: row[selisihIndex], header: csvData.headers[selisihIndex] },
            umur_manja: { index: umurManjaIndex, value: row[umurManjaIndex], header: csvData.headers[umurManjaIndex] },
            kategori_manja: { index: kategoriManjaIndex, value: row[kategoriManjaIndex], header: csvData.headers[kategoriManjaIndex] },
            sheet_aktivasi: { index: sheetAktivasiIndex, value: row[sheetAktivasiIndex], header: csvData.headers[sheetAktivasiIndex] },
            tanggal_ps: { index: tanggalPsIndex, value: row[tanggalPsIndex], header: csvData.headers[tanggalPsIndex] },
            tinjut_hd_oplang: { index: tinjutIndex, value: row[tinjutIndex], header: csvData.headers[tinjutIndex] },
            keterangan_hd_oplang: { index: keteranganHdIndex, value: row[keteranganHdIndex], header: csvData.headers[keteranganHdIndex] },
            suberrorcode: { index: suberrorcodeIndex, value: row[suberrorcodeIndex], header: csvData.headers[suberrorcodeIndex] },
            uic: { index: uicIndex, value: row[uicIndex], header: csvData.headers[uicIndex] },
            update_uic: { index: updateUicIndex, value: row[updateUicIndex], header: csvData.headers[updateUicIndex] },
            keterangan_uic: { index: keteranganUicIndex, value: row[keteranganUicIndex], header: csvData.headers[keteranganUicIndex] },
            status_bima: { index: statusBimaIndex, value: row[statusBimaIndex], header: csvData.headers[statusBimaIndex] },
            status_dsc: { index: statusDscIndex, value: row[statusDscIndex], header: csvData.headers[statusDscIndex] },
            sisa_manja: { index: sisaManjaIndex, value: row[sisaManjaIndex], header: csvData.headers[sisaManjaIndex] },
            bulan_order: { index: bulanOrderIndex, value: row[bulanOrderIndex], header: csvData.headers[bulanOrderIndex] },
            bulan_ps: { index: bulanPsIndex, value: row[bulanPsIndex], header: csvData.headers[bulanPsIndex] },
            backup: { index: backupIndex, value: row[backupIndex], header: csvData.headers[backupIndex] },
            lat_inputan: { index: latInputanIndex, value: row[latInputanIndex], header: csvData.headers[latInputanIndex] },
            long_inputan: { index: longInputanIndex, value: row[longInputanIndex], header: csvData.headers[longInputanIndex] },
            lat_real: { index: latRealIndex, value: row[latRealIndex], header: csvData.headers[latRealIndex] },
            long_real: { index: longRealIndex, value: row[longRealIndex], header: csvData.headers[longRealIndex] },
            username: { index: usernameIndex, value: row[usernameIndex], header: csvData.headers[usernameIndex] },
            sending_status: { index: sendingStatusIndex, value: row[sendingStatusIndex], header: csvData.headers[sendingStatusIndex] }
          })
        }

        // Helper function to parse coordinates
        const parseCoordinate = (coordStr: string): number | undefined => {
          if (!coordStr) return undefined
          const coord = coordStr.split(',')[0]?.trim()
          return coord ? parseFloat(coord) : undefined
        }

        // Helper function to parse decimal values
        const parseDecimal = (value: string): number | undefined => {
          if (!value) return undefined
          const parsed = parseFloat(value)
          return isNaN(parsed) ? undefined : parsed
        }

        // Helper function to parse date - Now returns original string for flexible format support
        const parseDate = (dateStr: string): string | undefined => {
          if (!dateStr) return undefined
          
          // Return the original date string as-is for flexible format support
          // The database now uses TEXT fields that can handle any date format
          // This includes formats like "02/07/2025 15.00", "01/07/2025 15:55", etc.
          return dateStr.trim()
        }

        return {
          order_id: row[aoIndex] || `AO_${index + 1}`, // Primary key for format_order table
          ao: row[aoIndex] || `AO_${index + 1}`, // Legacy compatibility
          channel: row[channelIndex] || 'Unknown',
          date_created: parseDate(row[dateIndex]) || new Date().toISOString().split('T')[0],
          workorder: row[workOrderIndex] || `WO_${index + 1}`,
          odp: row[odpIndex] || undefined,
          service_no: row[serviceNoIndex] || undefined,
          description: row[descriptionIndex] || undefined,
          address: row[addressIndex] || undefined,
          customer_name: row[customerNameIndex] || undefined,
          workzone: row[workzoneIndex] || undefined,
          status_date: parseDate(row[statusDateIndex]) || undefined,
          contact_phone: row[contactPhoneIndex] || undefined,
          booking_date: parseDate(row[bookingDateIndex]) || undefined,
          service_area: row[hsaIndex] || undefined, // Maps to service_area in format_order table
          branch: row[branchIndex] || undefined,
          cluster: row[clusterIndex] || undefined,
          mitra: row[mitraIndex] || undefined,
          labor_teknisi: row[laborTeknisiIndex] || undefined,
          kategori: row[kategoriIndex] || undefined,
          update_lapangan: row[updateLapanganIndex] || undefined,
          symptom: row[symptomIndex] || undefined,
          engineering_memo: row[engineeringMemoIndex] || undefined,
          tikor_inputan_pelanggan: row[tikorInputanIndex] || undefined,
          tikor_real_pelanggan: row[tikorRealIndex] || undefined,
          selisih: parseDecimal(row[selisihIndex]),
          umur_manja: row[umurManjaIndex] || undefined,
          kategori_manja: row[kategoriManjaIndex] || undefined,
          sheet_aktivasi: row[sheetAktivasiIndex] || undefined,
          tanggal_ps: parseDate(row[tanggalPsIndex]) || undefined,
          tinjut_hd_oplang: row[tinjutIndex] || undefined,
          keterangan_hd_oplang: row[keteranganHdIndex] || undefined,
          suberrorcode: row[suberrorcodeIndex] || undefined,
          uic: row[uicIndex] || undefined,
          update_uic: row[updateUicIndex] || undefined,
          keterangan_uic: row[keteranganUicIndex] || undefined,
          status_bima: row[statusBimaIndex] || 'Pending',
          status_dsc: row[statusDscIndex] || undefined,
          sisa_manja: parseDecimal(row[sisaManjaIndex]),
          bulan_order: row[bulanOrderIndex] || undefined,
          bulan_ps: row[bulanPsIndex] || undefined,
          backup: row[backupIndex] || undefined,
          lat_inputan: parseCoordinate(row[latInputanIndex]),
          long_inputan: parseCoordinate(row[longInputanIndex]),
          lat_real: parseCoordinate(row[latRealIndex]),
          long_real: parseCoordinate(row[longRealIndex]),
          username: row[usernameIndex] || undefined,
          sending_status: row[sendingStatusIndex] || undefined
        }
      })

      console.log(`Processed ${workOrders.length} work orders from CSV`)

      // Insert work orders in batches to avoid timeout
      const batchSize = 100
      let totalInserted = 0
      
      for (let i = 0; i < workOrders.length; i += batchSize) {
        const batch = workOrders.slice(i, i + batchSize)
        console.log(`Inserting batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(workOrders.length / batchSize)} (${batch.length} records)`)
        
        const insertResult = await this.insertWorkOrders(batch)
        
        if (!insertResult.success) {
          // Update upload status to failed
          if (uploadResult.data?.id) {
            await this.updateUploadStatus(uploadResult.data.id, 'failed')
          }
          return { success: false, error: `Failed to insert work orders batch ${Math.floor(i / batchSize) + 1}: ${insertResult.error}` }
        }
        
        totalInserted += insertResult.insertedCount || 0
      }

      // Update upload status to completed
      if (uploadResult.data?.id) {
        await this.updateUploadStatus(uploadResult.data.id, 'completed')
      }

      console.log('CSV processing completed successfully:', {
        filename,
        insertedCount: totalInserted,
        totalRows: csvData.rows.length
      })

      return { success: true, insertedCount: totalInserted }
    } catch (error) {
      console.error('Exception processing CSV data:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Validate CSV structure before processing
  private static validateCSVStructure(headers: string[]): { isValid: boolean; missingColumns: string[] } {
    const requiredColumns = [
      'ao',
      'workorder'
    ]

    const importantColumns = [
      'channel', 
      'date created',
      'hsa',
      'branch',
      'update lapangan',
      'symptom',
      'tinjut hd oplang',
      'kategori manja',
      'status bima'
    ]

    const missingColumns: string[] = []
    
    // Check required columns (must exist)
    for (const requiredCol of requiredColumns) {
      const found = this.findColumnInHeaders(headers, requiredCol)
      if (!found) {
        missingColumns.push(requiredCol)
      }
    }

    // Check important columns (warn if missing but don't fail)
    const missingImportantColumns: string[] = []
    for (const importantCol of importantColumns) {
      const found = this.findColumnInHeaders(headers, importantCol)
      if (!found) {
        missingImportantColumns.push(importantCol)
      }
    }

    if (missingImportantColumns.length > 0) {
      console.warn('Missing important columns (upload will continue):', missingImportantColumns)
    }

    return {
      isValid: missingColumns.length === 0,
      missingColumns
    }
  }

  // Helper method to find column in headers with flexible matching
  private static findColumnInHeaders(headers: string[], columnName: string): boolean {
    return headers.some(header => {
      const headerLower = header.toLowerCase().replace(/[^a-z0-9]/g, '')
      const columnLower = columnName.toLowerCase().replace(/[^a-z0-9]/g, '')
      
      // Check exact match first
      if (headerLower === columnLower) return true
      
      // Check if header contains the column name
      if (headerLower.includes(columnLower)) return true
      
      // Check common variations
      const variations = this.getColumnVariations(columnName)
      return variations.some(variation => headerLower.includes(variation.toLowerCase().replace(/[^a-z0-9]/g, '')))
    })
  }

  // Get common variations for column names
  private static getColumnVariations(columnName: string): string[] {
    const variations: { [key: string]: string[] } = {
      'date created': ['date', 'created', 'created_date', 'order_date', 'tanggal', 'tgl', 'date_created'],
      'update lapangan': ['update', 'field_update', 'status_update', 'lapangan', 'field', 'update_lapangan'],
      'tinjut hd oplang': ['tinjut', 'hd_oplang', 'handling', 'tinjauan', 'review', 'tinjut_hd_oplang'],
      'kategori manja': ['kategori', 'category', 'type', 'manja', 'jenis', 'kategori_manja'],
      'status bima': ['status', 'bima_status', 'bima', 'order_status', 'keadaan', 'status_bima'],
      'service no.': ['service', 'service_no', 'service_number', 'service_number'],
      'customer name': ['customer', 'customer_name', 'nama_pelanggan', 'pelanggan', 'nama'],
      'contact phone': ['contact', 'phone', 'contact_phone', 'telepon', 'hp'],
      'booking date': ['booking', 'booking_date', 'tanggal_booking', 'tanggal_booking'],
      'status date': ['status', 'status_date', 'tanggal_status', 'tanggal_status'],
      'engineering memo': ['engineering', 'memo', 'engineering_memo', 'catatan'],
      'tikor inputan pelanggan': ['tikor', 'inputan', 'pelanggan', 'tikor_inputan_pelanggan', 'koordinat_input'],
      'tikor real pelanggan': ['tikor', 'real', 'pelanggan', 'tikor_real_pelanggan', 'koordinat_real'],
      'sheet aktivasi': ['sheet', 'aktivasi', 'sheet_aktivasi', 'aktivasi_sheet'],
      'tanggal ps': ['tanggal', 'ps', 'tanggal_ps', 'ps_date', 'tanggal_ps'],
      'keterangan hd oplang': ['keterangan', 'hd', 'oplang', 'keterangan_hd_oplang', 'catatan_hd'],
      'update uic': ['update', 'uic', 'update_uic', 'uic_update'],
      'keterangan uic': ['keterangan', 'uic', 'keterangan_uic', 'catatan_uic'],
      'status dsc': ['status', 'dsc', 'status_dsc', 'dsc_status'],
      'sisa manja': ['sisa', 'manja', 'sisa_manja', 'sisa_manja'],
      'bulan order': ['bulan', 'order', 'bulan_order', 'order_month', 'bulan_order'],
      'bulan ps': ['bulan', 'ps', 'bulan_ps', 'ps_month', 'bulan_ps'],
      'lat inputan': ['lat', 'inputan', 'lat_inputan', 'latitude_input', 'latitude'],
      'long inputan': ['long', 'inputan', 'long_inputan', 'longitude_input', 'longitude'],
      'lat real': ['lat', 'real', 'lat_real', 'latitude_real', 'latitude'],
      'long real': ['long', 'real', 'long_real', 'longitude_real', 'longitude'],
      'sending status': ['sending', 'status', 'sending_status', 'status_sending', 'status_kirim']
    }
    
    return variations[columnName] || [columnName]
  }

  // Helper method to find column index with multiple possible names
  private static findColumnIndex(headers: string[], possibleNames: string[]): number {
    // First try exact match
    for (const name of possibleNames) {
      const exactIndex = headers.findIndex(h => h.toLowerCase() === name.toLowerCase())
      if (exactIndex !== -1) return exactIndex
    }
    
    // Then try contains match
    for (const name of possibleNames) {
      const containsIndex = headers.findIndex(h => h.toLowerCase().includes(name.toLowerCase()))
      if (containsIndex !== -1) return containsIndex
    }
    
    // Then try pattern matching (remove special characters)
    for (const name of possibleNames) {
      const patternIndex = headers.findIndex(h => {
        const cleanHeader = h.toLowerCase().replace(/[^a-z0-9]/g, '')
        const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '')
        return cleanHeader.includes(cleanName)
      })
      if (patternIndex !== -1) return patternIndex
    }
    
    // Finally try fuzzy matching for common variations
    for (const name of possibleNames) {
      const fuzzyIndex = headers.findIndex(h => {
        const headerLower = h.toLowerCase()
        const nameLower = name.toLowerCase()
        
        // Check if header contains any part of the name
        const nameParts = nameLower.split(/[_\s]/)
        return nameParts.some(part => part.length > 2 && headerLower.includes(part))
      })
      if (fuzzyIndex !== -1) return fuzzyIndex
    }
    
    return -1
  }

  // Helper method to update upload status
  private static async updateUploadStatus(id: string, status: 'processing' | 'completed' | 'failed'): Promise<void> {
    try {
      const supabase = createSupabaseClient()
      await supabase
        .from(TABLES.UPLOADS)
        .update({ status })
        .eq('id', id)
    } catch (error) {
      console.error('Failed to update upload status:', error)
    }
  }

  // Get work order statistics
  static async getWorkOrderStats(): Promise<{ success: boolean; data?: WorkOrderStats; error?: string }> {
    try {
      const supabase = createSupabaseClient()
      
      // Get total count
      const { count: totalCount, error: countError } = await supabase
        .from(TABLES.WORK_ORDERS)
        .select('*', { count: 'exact', head: true })

      if (countError) {
        console.error('Error counting work orders:', countError)
        return { success: false, error: countError.message }
      }

      // Get status distribution
      const { data: statusData, error: statusError } = await supabase
        .from(TABLES.WORK_ORDERS)
        .select('status_bima')

      if (statusError) {
        console.error('Error fetching status data:', statusError)
        return { success: false, error: statusError.message }
      }

      // Get branch distribution
      const { data: branchData, error: branchError } = await supabase
        .from(TABLES.WORK_ORDERS)
        .select('branch')

      if (branchError) {
        console.error('Error fetching branch data:', branchError)
        return { success: false, error: branchError.message }
      }

      // Get channel distribution
      const { data: channelData, error: channelError } = await supabase
        .from(TABLES.WORK_ORDERS)
        .select('channel')

      if (channelError) {
        console.error('Error fetching channel data:', channelError)
        return { success: false, error: channelError.message }
      }

      // Get manja statistics
      const { data: manjaData, error: manjaError } = await supabase
        .from(TABLES.WORK_ORDERS)
        .select('kategori_manja, umur_manja')

      if (manjaError) {
        console.error('Error fetching manja data:', manjaError)
        return { success: false, error: manjaError.message }
      }

      // Calculate distributions
      const statusDistribution: { [key: string]: number } = {}
      const branchDistribution: { [key: string]: number } = {}
      const channelDistribution: { [key: string]: number } = {}

      statusData?.forEach(item => {
        const status = item.status_bima || 'Unknown'
        statusDistribution[status] = (statusDistribution[status] || 0) + 1
      })

      branchData?.forEach(item => {
        const branch = item.branch || 'Unknown'
        branchDistribution[branch] = (branchDistribution[branch] || 0) + 1
      })

      channelData?.forEach(item => {
        const channel = item.channel || 'Unknown'
        channelDistribution[channel] = (channelDistribution[channel] || 0) + 1
      })

      // Calculate manja statistics
      let lewatManjaCount = 0
      let overdueManjaCount = 0

      manjaData?.forEach(item => {
        if (item.kategori_manja === 'LEWAT MANJA') {
          lewatManjaCount++
        }
        if (item.umur_manja && item.umur_manja.includes('>')) {
          overdueManjaCount++
        }
      })

      return {
        success: true,
        data: {
          total_work_orders: totalCount || 0,
          status_distribution: statusDistribution,
          branch_distribution: branchDistribution,
          channel_distribution: channelDistribution,
          manja_stats: {
            lewat_manja_count: lewatManjaCount,
            overdue_manja_count: overdueManjaCount
          }
        }
      }
    } catch (error) {
      console.error('Exception getting work order stats:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Get data integrity report
  static async getDataIntegrityReport(): Promise<{ success: boolean; data?: DataIntegrityReport; error?: string }> {
    try {
      const supabase = createSupabaseClient()
      
      // Fetch all data using pagination for comprehensive integrity check
      let allData: Array<Record<string, unknown>> = []
      let page = 0
      let hasMore = true
      const pageSize = 1000

      while (hasMore) {
        const { data: pageData, error } = await supabase
          .from(TABLES.WORK_ORDERS)
          .select('*')
          .range(page * pageSize, (page + 1) * pageSize - 1)

        if (error) {
          return { success: false, error: error.message }
        }

        if (pageData && pageData.length > 0) {
          allData = [...allData, ...pageData]
          hasMore = pageData.length === pageSize
          page++
        } else {
          hasMore = false
        }
      }

      const data = allData

      if (!data || data.length === 0) {
        return { success: false, error: 'No data found' }
      }

      // Analyze data integrity
      const totalRecords = data.length
      const columns = Object.keys(data[0])
      let missingData = 0
      let totalFields = 0

      data.forEach(record => {
        columns.forEach(column => {
          totalFields++
          if (!record[column as keyof typeof record] || record[column as keyof typeof record] === '') {
            missingData++
          }
        })
      })

      const dataQualityScore = Math.round(((totalFields - missingData) / totalFields) * 100)

      return {
        success: true,
        data: {
          totalRecords,
          missingData,
          dataQuality: `${dataQualityScore}%`
        }
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Get upload history
  static async getUploadHistory(): Promise<{ success: boolean; data?: UploadHistoryRecord[]; error?: string }> {
    try {
      const supabase = createSupabaseClient()
      
      // Fetch all upload history using pagination
      let allData: UploadHistoryRecord[] = []
      let page = 0
      let hasMore = true
      const pageSize = 1000

      while (hasMore) {
        const { data: pageData, error } = await supabase
          .from(TABLES.UPLOADS)
          .select('*')
          .order('created_at', { ascending: false })
          .range(page * pageSize, (page + 1) * pageSize - 1)

        if (error) {
          return { success: false, error: error.message }
        }

        if (pageData && pageData.length > 0) {
          allData = [...allData, ...pageData]
          hasMore = pageData.length === pageSize
          page++
        } else {
          hasMore = false
        }
      }

      const data = allData

      return { success: true, data: data || [] }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
}
