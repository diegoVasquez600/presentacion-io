import { supabase } from './supabase'

export type GameAttempt = {
  id: string
  session_id: string
  player_name: string
  score: number
  hits: number
  false_positives: number
  missed: number
  hints_used: number
  visited_pct: number
  marked_nodes: string[]
  created_at: string
}

export async function submitGameAttempt(
  sessionId: string | null,
  playerName: string,
  score: number,
  hits: number,
  falsePositives: number,
  missed: number,
  hintsUsed: number,
  visitedPct: number,
  markedNodes: string[],
): Promise<GameAttempt> {
  const { data, error } = await supabase
    .from('game_attempts')
    .insert({
      session_id: sessionId || null,
      player_name: playerName,
      score,
      hits,
      false_positives: falsePositives,
      missed,
      hints_used: hintsUsed,
      visited_pct: visitedPct,
      marked_nodes: markedNodes,
    })
    .select()
    .single()

  if (error) throw new Error(`Failed to submit attempt: ${error.message}`)
  return data
}

export async function getLeaderboard(limit: number = 50): Promise<GameAttempt[]> {
  const { data, error } = await supabase
    .from('game_attempts')
    .select('*')
    .order('score', { ascending: false })
    .limit(limit)

  if (error) throw new Error(`Failed to fetch leaderboard: ${error.message}`)
  return data || []
}

export async function deleteAttempt(attemptId: string, adminPassword: string): Promise<void> {
  if (adminPassword !== import.meta.env.VITE_ADMIN_PASSWORD) {
    throw new Error('Invalid admin password')
  }

  const { error } = await supabase
    .from('game_attempts')
    .delete()
    .eq('id', attemptId)

  if (error) throw new Error(`Failed to delete attempt: ${error.message}`)
}

export async function deleteMultipleAttempts(attemptIds: string[], adminPassword: string): Promise<void> {
  if (adminPassword !== import.meta.env.VITE_ADMIN_PASSWORD) {
    throw new Error('Invalid admin password')
  }

  const { error } = await supabase
    .from('game_attempts')
    .delete()
    .in('id', attemptIds)

  if (error) throw new Error(`Failed to delete attempts: ${error.message}`)
}

export async function deleteAllAttempts(adminPassword: string): Promise<void> {
  if (adminPassword !== import.meta.env.VITE_ADMIN_PASSWORD) {
    throw new Error('Invalid admin password')
  }

  const { error } = await supabase
    .from('game_attempts')
    .delete()
    .gt('id', '')  // Delete all rows (any id > empty string)

  if (error) throw new Error(`Failed to delete all attempts: ${error.message}`)
}


