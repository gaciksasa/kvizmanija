import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useQuizStore } from '../store/quizStore';
import { supabase } from '../services/supabase';
import { type Question, type QuizAnswer } from '../types';
import { QuestionCard } from '../components/QuestionCard';
import { stopStart, playClock, stopClock } from '../utils/sounds';

const TOTAL_TIME = 90; // seconds

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const Quiz: React.FC = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const category = (location.state as { category?: string })?.category || 'sve';
  const {
    currentGame,
    questions,
    currentQuestionIndex,
    answers,
    startGame,
    answerQuestion,
    nextQuestion,
    endGame,
  } = useQuizStore();
  const [loading, setLoading] = useState(true);
  const [remaining, setRemaining] = useState(TOTAL_TIME);
  const navigate = useNavigate();
  const finishedRef = useRef(false);
  const remainingRef = useRef(TOTAL_TIME);
  const startTsRef = useRef<number | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadAndStart = async () => {
      try {
        let query = supabase.from('questions').select('*');
        if (category !== 'sve') {
          query = query.eq('category', category);
        }
        const { data } = await query;

        if (data && data.length > 0) {
          // Deduplicate by question text
          const unique = [...new Map(data.map((q) => [q.text, q])).values()];

          // Split by difficulty
          const easy = shuffle(unique.filter((q) => q.difficulty === 'easy')).slice(0, 5);
          const medium = shuffle(unique.filter((q) => q.difficulty === 'medium')).slice(0, 10);
          const hard = shuffle(unique.filter((q) => q.difficulty === 'hard')).slice(0, 15);

          // Order: easy first, then medium, then hard
          const selected = [...easy, ...medium, ...hard] as Question[];

          if (selected.length === 0) {
            navigate('/');
            return;
          }

          stopStart();
          playClock();
          startGame(selected, user.id, category);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Greška pri učitavanju pitanja:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadAndStart();
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const handleFinishGame = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    stopClock();
    const gameResult = endGame(remainingRef.current);
    if (gameResult) {
      navigate('/results', { state: { game: gameResult, questions, remainingTime: remainingRef.current } });
    }
  }, [endGame, navigate, questions]);

  // Countdown timer
  useEffect(() => {
    if (!currentGame) return;

    if (!startTsRef.current) {
      startTsRef.current = Date.now();
    }

    const timer = setInterval(() => {
      const elapsed = Math.round((Date.now() - startTsRef.current!) / 1000);
      const left = Math.max(0, TOTAL_TIME - elapsed);
      remainingRef.current = left;
      setRemaining(left);

      if (left <= 0) {
        clearInterval(timer);
        handleFinishGame();
      }
    }, 200);

    return () => clearInterval(timer);
  }, [currentGame, handleFinishGame]);

  const handleSubmitAnswer = useCallback((answer: QuizAnswer) => {
    answer.user_id = user?.id || '';
    answerQuestion(answer);

    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    if (isLastQuestion) {
      setTimeout(() => handleFinishGame(), 400);
    } else {
      setTimeout(() => { playClock(); nextQuestion(); }, 300);
    }
  }, [user?.id, answerQuestion, currentQuestionIndex, questions.length, nextQuestion, handleFinishGame]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getDifficultyLabel = () => {
    if (!questions[currentQuestionIndex]) return '';
    const d = questions[currentQuestionIndex].difficulty;
    if (d === 'easy') return '⭐ Lako';
    if (d === 'medium') return '⭐⭐ Srednje';
    return '⭐⭐⭐ Teško';
  };

  if (!user) return null;

  if (loading || !currentGame || questions.length === 0) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <p className="text-gray-400">Učitavam pitanja...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers.find((a) => a.question_id === currentQuestion.id);

  return (
    <div className="min-h-screen py-4 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 px-2">
          <span className="text-sm font-semibold text-gray-400">
            {currentQuestionIndex + 1} / {questions.length}
          </span>
          <span className="text-xs font-semibold text-gray-400">
            {getDifficultyLabel()}
          </span>
          <span className={`text-lg font-mono font-bold px-4 py-1 rounded-full ${
            remaining <= 10 ? 'bg-red-900/50 text-red-400' :
            remaining <= 30 ? 'bg-yellow-900/50 text-yellow-400' :
            'bg-green-900/50 text-green-400'
          }`}>
            {formatTime(remaining)}
          </span>
        </div>

        <QuestionCard
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          onAnswer={handleSubmitAnswer}
          selectedAnswer={currentAnswer?.selected_answer}
        />
      </div>
    </div>
  );
};
