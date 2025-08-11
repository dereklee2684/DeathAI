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