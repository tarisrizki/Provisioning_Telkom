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

      // Convert CSV rows to work orders with better column mapping
      const workOrders: WorkOrder[] = csvData.rows.map((row, index) => {
        // More specific column mapping based on actual CSV structure
        const aoIndex = this.findColumnIndex(csvData.headers, ['ao', 'ao_number', 'ao_id'])
        const channelIndex = this.findColumnIndex(csvData.headers, ['channel', 'channel_type', 'sales_channel'])
        const dateIndex = this.findColumnIndex(csvData.headers, ['date_created', 'date', 'created_date', 'order_date'])
        const workOrderIndex = this.findColumnIndex(csvData.headers, ['workorder', 'work_order', 'wo', 'order_number'])
        const hsaIndex = this.findColumnIndex(csvData.headers, ['hsa', 'hsa_id', 'hsa_number'])
        const branchIndex = this.findColumnIndex(csvData.headers, ['branch', 'branch_name', 'location'])
        const updateLapanganIndex = this.findColumnIndex(csvData.headers, ['update_lapangan', 'field_update', 'update', 'status_update'])
        const symptomIndex = this.findColumnIndex(csvData.headers, ['symptom', 'issue', 'problem', 'description'])
        const tinjutIndex = this.findColumnIndex(csvData.headers, ['tinjut_hd_oplang', 'tinjut', 'hd_oplang', 'handling'])
        
        // Specific mapping for KATEGORI_MANJA - look for exact column names
        const kategoriIndex = this.findColumnIndex(csvData.headers, [
          'kategori_manja', 
          'kategori manja', 
          'kategori', 
          'category', 
          'type',
          'manja'
        ])
        
        // Specific mapping for STATUS_BIMA - look for exact column names
        const statusIndex = this.findColumnIndex(csvData.headers, [
          'status_bima', 
          'status bima', 
          'bima_status', 
          'bima status', 
          'status', 
          'order_status'
        ])

        // Log column mapping for debugging
        if (index === 0) {
          console.log('CSV Headers:', csvData.headers)
          console.log('Column mapping for first row:', {
            ao: { index: aoIndex, value: row[aoIndex], header: csvData.headers[aoIndex] },
            channel: { index: channelIndex, value: row[channelIndex], header: csvData.headers[channelIndex] },
            date: { index: dateIndex, value: row[dateIndex], header: csvData.headers[dateIndex] },
            workorder: { index: workOrderIndex, value: row[workOrderIndex], header: csvData.headers[workOrderIndex] },
            hsa: { index: hsaIndex, value: row[hsaIndex], header: csvData.headers[hsaIndex] },
            branch: { index: branchIndex, value: row[branchIndex], header: csvData.headers[branchIndex] },
            update_lapangan: { index: updateLapanganIndex, value: row[updateLapanganIndex], header: csvData.headers[updateLapanganIndex] },
            symptom: { index: symptomIndex, value: row[symptomIndex], header: csvData.headers[symptomIndex] },
            tinjut: { index: tinjutIndex, value: row[tinjutIndex], header: csvData.headers[tinjutIndex] },
            kategori_manja: { index: kategoriIndex, value: row[kategoriIndex], header: csvData.headers[kategoriIndex] },
            status_bima: { index: statusIndex, value: row[statusIndex], header: csvData.headers[statusIndex] }
          })
        }

        // Validate that we found the correct columns
        if (kategoriIndex === -1) {
          console.warn(`Warning: KATEGORI_MANJA column not found. Available headers:`, csvData.headers)
        }
        if (statusIndex === -1) {
          console.warn(`Warning: STATUS_BIMA column not found. Available headers:`, csvData.headers)
        }

        return {
          ao: row[aoIndex] || `AO_${index + 1}`,
          channel: row[channelIndex] || 'Unknown',
          date_created: row[dateIndex] || new Date().toISOString().split('T')[0],
          workorder: row[workOrderIndex] || `WO_${index + 1}`,
          hsa: row[hsaIndex] || `HSA_${index + 1}`,
          branch: row[branchIndex] || 'Unknown',
          update_lapangan: row[updateLapanganIndex] || 'No update',
          symptom: row[symptomIndex] || 'Unknown symptom',
          tinjut_hd_oplang: row[tinjutIndex] || 'No tinjut',
          kategori_manja: row[kategoriIndex] || 'Unknown category',
          status_bima: row[statusIndex] || 'Pending'
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
      'channel', 
      'date_created',
      'workorder',
      'hsa',
      'branch',
      'update_lapangan',
      'symptom',
      'tinjut_hd_oplang',
      'kategori_manja',
      'status_bima'
    ]

    const missingColumns: string[] = []
    
    for (const requiredCol of requiredColumns) {
      // More flexible column detection
      const found = headers.some(header => {
        const headerLower = header.toLowerCase().replace(/[^a-z0-9]/g, '')
        const requiredLower = requiredCol.toLowerCase().replace(/[^a-z0-9]/g, '')
        
        // Check exact match first
        if (headerLower === requiredLower) return true
        
        // Check if header contains the required column name
        if (headerLower.includes(requiredLower)) return true
        
        // Check common variations
        const variations = this.getColumnVariations(requiredCol)
        return variations.some(variation => headerLower.includes(variation.toLowerCase().replace(/[^a-z0-9]/g, '')))
      })
      
      if (!found) {
        missingColumns.push(requiredCol)
      }
    }

    return {
      isValid: missingColumns.length === 0,
      missingColumns
    }
  }

  // Get common variations for column names
  private static getColumnVariations(columnName: string): string[] {
    const variations: { [key: string]: string[] } = {
      'date_created': ['date', 'created', 'created_date', 'order_date', 'tanggal', 'tgl'],
      'update_lapangan': ['update', 'field_update', 'status_update', 'lapangan', 'field'],
      'tinjut_hd_oplang': ['tinjut', 'hd_oplang', 'handling', 'tinjauan', 'review'],
      'kategori_manja': ['kategori', 'category', 'type', 'manja', 'jenis'],
      'status_bima': ['status', 'bima_status', 'bima', 'order_status', 'keadaan']
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

      // Calculate distributions
      const statusDistribution: { [key: string]: number } = {}
      const branchDistribution: { [key: string]: number } = {}

      statusData?.forEach(item => {
        const status = item.status_bima || 'Unknown'
        statusDistribution[status] = (statusDistribution[status] || 0) + 1
      })

      branchData?.forEach(item => {
        const branch = item.branch || 'Unknown'
        branchDistribution[branch] = (branchDistribution[branch] || 0) + 1
      })

      return {
        success: true,
        data: {
          total_work_orders: totalCount || 0,
          status_distribution: statusDistribution,
          branch_distribution: branchDistribution
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
      const { data, error } = await supabase
        .from(TABLES.WORK_ORDERS)
        .select('*')
        .limit(100)

      if (error) {
        return { success: false, error: error.message }
      }

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
      const { data, error } = await supabase
        .from(TABLES.UPLOADS)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data: data || [] }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
}
