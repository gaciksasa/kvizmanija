import { create } from 'zustand';
import { type Question, type QuizAnswer, type QuizGame } from '../types';

const POINTS: Record<string, number> = { easy: 250, medium: 350, hard: 500 };

interface QuizState {
  currentGame: QuizGame | null;
  questions: Question[];
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  startTime: number | null;
  startGame: (questions: Question[], userId: string, category: string) => void;
  answerQuestion: (answer: QuizAnswer) => void;
  nextQuestion: () => void;
  endGame: (remainingSeconds?: number) => QuizGame | null;
  resetGame: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  currentGame: null,
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  startTime: null,

  startGame: (questions, userId, category) => {
    set({
      questions,
      currentGame: {
        user_id: userId,
        category,
        score: 0,
        total_questions: questions.length,
        accuracy: 0,
        time_taken: 0,
        answers: [],
      },
      currentQuestionIndex: 0,
      answers: [],
      startTime: Date.now(),
    });
  },

  answerQuestion: (answer) => {
    const state = get();
    if (state.answers.find((a) => a.question_id === answer.question_id)) return;
    set({ answers: [...state.answers, answer] });
  },

  nextQuestion: () => {
    const state = get();
    if (state.currentQuestionIndex < state.questions.length - 1) {
      set({ currentQuestionIndex: state.currentQuestionIndex + 1 });
    }
  },

  endGame: (remainingSeconds?: number) => {
    const state = get();
    if (!state.currentGame || !state.startTime) return null;

    const timeTaken = Math.round((Date.now() - state.startTime) / 1000);
    const correctAnswers = state.answers.filter((a) => a.is_correct).length;
    const totalAnswered = state.answers.length;
    const accuracy = totalAnswered > 0 ? (correctAnswers / totalAnswered) * 100 : 0;

    // Score based on difficulty: easy=250, medium=350, hard=500
    let score = 0;
    state.answers.forEach((a) => {
      if (a.is_correct) {
        const question = state.questions.find((q) => q.id === a.question_id);
        if (question) {
          score += POINTS[question.difficulty] || 250;
        }
      }
    });

    // Time bonus: 50 points per remaining second (only if all questions answered)
    const allAnswered = totalAnswered >= state.questions.length;
    const timeBonus = allAnswered && remainingSeconds ? remainingSeconds * 50 : 0;
    score += timeBonus;

    const game: QuizGame = {
      ...state.currentGame,
      score,
      accuracy,
      time_taken: timeTaken,
      total_questions: totalAnswered,
      answers: state.answers,
    };

    set({ currentGame: game });
    return game;
  },

  resetGame: () => {
    set({
      currentGame: null,
      questions: [],
      currentQuestionIndex: 0,
      answers: [],
      startTime: null,
    });
  },
}));
