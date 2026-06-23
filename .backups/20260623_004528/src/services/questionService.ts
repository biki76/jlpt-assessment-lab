import { supabase } from './supabase';
import type { QuestionSet, Question } from '../types';

export async function fetchPublishedSets(level?: string): Promise<QuestionSet[]> {
  let query = supabase
    .from('question_sets')
    .select('id, title, level, status, question_count, created_at, updated_at')
    .eq('status', 'published');

  if (level) {
    query = query.eq('level', level);
  }

  const { data, error } = await query.order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch sets: ${error.message}`);
  }

  return (data || []) as QuestionSet[];
}

export async function fetchQuestionsForSet(setId: string): Promise<Question[]> {
  const { data, error } = await supabase
    .from('questions')
    .select('id, set_id, question_number, question_text, japanese_text, options, section, difficulty, created_at, updated_at')
    .eq('set_id', setId)
    .order('question_number', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch questions: ${error.message}`);
  }

  return (data || []) as Question[];
}
