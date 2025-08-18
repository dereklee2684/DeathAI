import { createClient } from '@/lib/supabase'
import { University } from '@/types'

export async function getUniversities(): Promise<University[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('universities')
    .select('*')
    .order('name')
  
  if (error) {
    console.error('Error fetching universities:', error)
    return []
  }
  
  return data || []
}

export async function getUniversityById(id: string): Promise<University | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('universities')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching university:', error)
    return null
  }
  
  return data
}

export async function createUniversity(university: Omit<University, 'id' | 'created_at' | 'updated_at'>): Promise<University | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('universities')
    .insert([university])
    .select()
    .single()
  
  if (error) {
    console.error('Error creating university:', error)
    return null
  }
  
  return data
}

export async function updateUniversity(id: string, updates: Partial<Omit<University, 'id' | 'created_at' | 'updated_at'>>): Promise<University | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('universities')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating university:', error)
    return null
  }
  
  return data
}

export async function deleteUniversity(id: string): Promise<boolean> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('universities')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting university:', error)
    return false
  }
  
  return true
} 