'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function seedDefaultHabits() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const defaultCategories = [
    'Health & Fitness',
    'Diet & Nutrition',
    'Mental & Spiritual',
    'Skills & Learning'
  ]

  // Insert categories
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .insert(defaultCategories.map(name => ({ name, user_id: user.id })))
    .select()

  if (catError || !categories) return { error: catError?.message }

  const catMap = categories.reduce((acc, cat) => ({ ...acc, [cat.name]: cat.id }), {} as Record<string, string>)

  // Default habits
  const defaultHabits = [
    { category_id: catMap['Health & Fitness'], user_id: user.id, name: 'Plank', description: 'Beat or maintain benchmark', type: 'value', unit: 'minutes' },
    { category_id: catMap['Health & Fitness'], user_id: user.id, name: 'Morning Sun', description: '10 mins walk in the sun', type: 'boolean' },
    { category_id: catMap['Health & Fitness'], user_id: user.id, name: 'Post-Meal Walk', description: 'Walk after lunch or big meals', type: 'boolean' },
    { category_id: catMap['Health & Fitness'], user_id: user.id, name: 'Stretching / Yoga', description: '15 mins of mobility work', type: 'boolean' },
    
    { category_id: catMap['Diet & Nutrition'], user_id: user.id, name: 'Vitamin D', type: 'boolean' },
    { category_id: catMap['Diet & Nutrition'], user_id: user.id, name: 'Hydration', description: 'Drink 8 glasses of water', type: 'value', unit: 'glasses' },
    { category_id: catMap['Diet & Nutrition'], user_id: user.id, name: 'Eat Greens', description: 'At least one serving of vegetables', type: 'boolean' },
    
    { category_id: catMap['Mental & Spiritual'], user_id: user.id, name: 'Wim Hof breathing', type: 'boolean' },
    { category_id: catMap['Mental & Spiritual'], user_id: user.id, name: 'Cold shower', type: 'boolean' },
    { category_id: catMap['Mental & Spiritual'], user_id: user.id, name: 'Meditation', type: 'boolean' },
    { category_id: catMap['Mental & Spiritual'], user_id: user.id, name: 'Gratitude Journal', description: 'Write down 3 things you are grateful for', type: 'boolean' },
    
    { category_id: catMap['Skills & Learning'], user_id: user.id, name: 'Practice Spanish', type: 'boolean' },
    { category_id: catMap['Skills & Learning'], user_id: user.id, name: 'Learn a new topic', description: 'e.g., Wealth of Nations', type: 'boolean' },
    { category_id: catMap['Skills & Learning'], user_id: user.id, name: 'Read a Book', description: 'Daily reading habit', type: 'value', unit: 'pages' },
  ]

  const { error: habError } = await supabase.from('habits').insert(defaultHabits)
  
  if (habError) return { error: habError.message }

  revalidatePath('/')
  return { success: true }
}

export async function toggleHabitLog(habitId: string, date: string, completed: boolean, value?: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Upsert the log
  const { error } = await supabase
    .from('daily_logs')
    .upsert({ 
      habit_id: habitId, 
      user_id: user.id, 
      date, 
      completed, 
      value 
    }, { onConflict: 'habit_id, date' })

  if (error) return { error: error.message }

  revalidatePath('/')
  return { success: true }
}

export async function addCategory(name: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase.from('categories').insert({ name, user_id: user.id })
  if (error) return { error: error.message }
  revalidatePath('/habits')
  return { success: true }
}

export async function addHabit(categoryId: string, name: string, description: string, type: 'boolean' | 'value', unit?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase.from('habits').insert({
    category_id: categoryId,
    user_id: user.id,
    name,
    description,
    type,
    unit
  })
  if (error) return { error: error.message }
  revalidatePath('/habits')
  revalidatePath('/')
  return { success: true }
}

export async function deleteHabit(habitId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('habits').delete().eq('id', habitId)
  if (error) return { error: error.message }
  revalidatePath('/habits')
  revalidatePath('/')
  return { success: true }
}
