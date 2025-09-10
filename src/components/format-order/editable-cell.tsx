"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Check, X, Edit } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface EditableCellProps {
  value: string
  orderId: string
  field: string
  type?: 'text' | 'select'
  options?: { value: string; label: string }[]
  isAdmin: boolean
  onUpdate?: (orderId: string, field: string, value: string) => void
}

export function EditableCell({ 
  value, 
  orderId, 
  field, 
  type = 'text', 
  options = [],
  isAdmin,
  onUpdate 
}: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value || '')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setEditValue(value || '')
  }, [value])

  const handleSave = async () => {
    if (editValue === value) {
      setIsEditing(false)
      return
    }

    setIsLoading(true)
    console.log('EditableCell: Saving to database...', {
      orderId,
      field,
      oldValue: value,
      newValue: editValue
    })
    
    try {
      const { error } = await supabase
        .from('format_order')
        .update({ 
          [field]: editValue,
          updated_at: new Date().toISOString()
        })
        .eq('order_id', orderId)

      if (error) {
        console.error('EditableCell: Database update error:', error)
        setEditValue(value || '') // Reset to original value
      } else {
        console.log('EditableCell: Successfully updated database')
        onUpdate?.(orderId, field, editValue)
      }
    } catch (err) {
      console.error('EditableCell: Update error:', err)
      setEditValue(value || '') // Reset to original value
    } finally {
      setIsLoading(false)
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditValue(value || '')
    setIsEditing(false)
  }

  if (!isAdmin) {
    return (
      <span className="text-gray-300">
        {value || '-'}
      </span>
    )
  }

  if (!isEditing) {
    return (
      <div 
        className="group flex items-center gap-2 min-h-[32px]"
        onClick={(e) => e.stopPropagation()} // Prevent parent row click
      >
        <span className="text-gray-300 flex-1">
          {value || '-'}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 transition-opacity"
          onClick={(e) => {
            e.stopPropagation()
            setIsEditing(true)
          }}
        >
          <Edit className="h-3 w-3" />
        </Button>
      </div>
    )
  }

  return (
    <div 
      className="flex items-center gap-1 min-h-[32px]"
      onClick={(e) => e.stopPropagation()} // Prevent parent row click
    >
      {type === 'select' ? (
        <Select value={editValue} onValueChange={setEditValue}>
          <SelectTrigger 
            className="h-8 text-xs bg-[#1e293b] border-gray-600"
            onClick={(e) => e.stopPropagation()}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="h-8 text-xs bg-[#1e293b] border-gray-600"
          disabled={isLoading}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave()
            if (e.key === 'Escape') handleCancel()
          }}
          autoFocus
        />
      )}
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-green-400 hover:text-green-300"
          onClick={(e) => {
            e.stopPropagation()
            handleSave()
          }}
          disabled={isLoading}
        >
          <Check className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
          onClick={(e) => {
            e.stopPropagation()
            handleCancel()
          }}
          disabled={isLoading}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}
