import { supabase } from './supabase';
import type { QuestionSet, Question, JLPTLevel, AdminQuestion } from '../types';

export async function fetchAllSets(): Promise<QuestionSet[]> {
  const { data, error } = await supabase
    .from('question_sets')
    .select('id, title, level, status, question_count, created_at, updated_at')
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch sets: ${error.message}`);
  return (data || []) as QuestionSet[];
}

export async function createSet(title: string, level: JLPTLevel): Promise<string> {
  const { data, error } = await supabase
    .from('question_sets')
    .insert({ title, level, status: 'draft', question_count: 0 })
    .select('id')
    .single();

  if (error) throw new Error(`Failed to create set: ${error.message}`);
  return data.id;
}

export async function updateSetStatus(setId: string, status: string): Promise<void> {
  const { error } = await supabase
    .from('question_sets')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', setId);

  if (error) throw new Error(`Failed to update set status: ${error.message}`);
}

export async function fetchQuestionsForAdmin(setId: string): Promise<AdminQuestion[]> {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('set_id', setId)
    .order('question_number', { ascending: true });

  if (error) throw new Error(`Failed to fetch questions: ${error.message}`);
  return (data || []) as AdminQuestion[];
}

export async function createQuestion(question: Omit<Question, 'id' | 'created_at' | 'updated_at'>): Promise<void> {
  const { error } = await supabase.from('questions').insert({
    ...question,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  if (error) throw new Error(`Failed to create question: ${error.message}`);
}

export async function updateQuestion(questionId: string, updates: Partial<Question>): Promise<void> {
  const { error } = await supabase
    .from('questions')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', questionId);

  if (error) throw new Error(`Failed to update question: ${error.message}`);
}

export async function deleteQuestion(questionId: string): Promise<void> {
  const { error } = await supabase.from('questions').delete().eq('id', questionId);
  if (error) throw new Error(`Failed to delete question: ${error.message}`);
}
