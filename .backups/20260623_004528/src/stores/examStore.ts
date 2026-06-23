import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ExamSession, Question, ScoringResult } from '../types';

interface ExamStoreState {
  currentSession: ExamSession | null;
  currentQuestions: Question[];
  scoringResult: ScoringResult | null;
}

interface ExamStoreActions {
  initSession: (setId: string) => void;
  resumeSession: () => void;
  abandonSession: () => void;
  setCurrentQuestion: (index: number) => void;
  recordAnswer: (questionId: string, optionId: string, timeSpentMs: number) => void;
  markSessionComplete: (resultId: string) => void;
  clearSession: () => void;
  setScoringResult: (result: ScoringResult) => void;
  setQuestions: (questions: Question[]) => void;
}

const createFreshSession = (setId: string): ExamSession => ({
  id: crypto.randomUUID(),
  set_id: setId,
  user_type: 'guest',
  current_question_index: 0,
  answers: {},
  is_completed: false,
  is_abandoned: false,
  started_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

export const useExamStore = create<ExamStoreState & ExamStoreActions>()(
  persist(
    (set, get) => ({
      currentSession: null,
      currentQuestions: [],
      scoringResult: null,

      initSession: (setId: string) => {
        const session = createFreshSession(setId);
        set({ currentSession: session, scoringResult: null, currentQuestions: [] });
      },

      resumeSession: () => {
        const { currentSession } = get();
        if (!currentSession) return;
        set({
          currentSession: {
            ...currentSession,
            updated_at: new Date().toISOString(),
          },
        });
      },

      abandonSession: () => {
        const { currentSession } = get();
        if (currentSession) {
          set({
            currentSession: {
              ...currentSession,
              is_abandoned: true,
              updated_at: new Date().toISOString(),
            },
          });
        }
      },

      setCurrentQuestion: (index: number) => {
        const { currentSession } = get();
        if (!currentSession) return;
        set({
          currentSession: {
            ...currentSession,
            current_question_index: index,
            updated_at: new Date().toISOString(),
          },
        });
      },

      recordAnswer: (questionId: string, optionId: string, timeSpentMs: number) => {
        const { currentSession } = get();
        if (!currentSession) return;
        const updatedAnswers = {
          ...currentSession.answers,
          [questionId]: {
            question_id: questionId,
            selected_option_id: optionId,
            time_spent_ms: timeSpentMs,
          },
        };
        set({
          currentSession: {
            ...currentSession,
            answers: updatedAnswers,
            updated_at: new Date().toISOString(),
          },
        });
      },

      markSessionComplete: (resultId: string) => {
        const { currentSession } = get();
        if (!currentSession) return;
        set({
          currentSession: {
            ...currentSession,
            is_completed: true,
            result_id: resultId,
            updated_at: new Date().toISOString(),
          },
        });
      },

      clearSession: () => {
        set({ currentSession: null, scoringResult: null, currentQuestions: [] });
      },

      setScoringResult: (result: ScoringResult) => {
        set({ scoringResult: result });
      },

      setQuestions: (questions: Question[]) => {
        set({ currentQuestions: questions });
      },
    }),
    {
      name: 'nihonsync-exam-session',
      partialize: (state) => ({
        currentSession: state.currentSession,
      }),
    }
  )
);
