import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useQuizStore } from '../store/quizStore';
import { supabase } from '../services/supabase';
import { type QuizGame, type Question } from '../types';
import { playFinish, playStart, stopStart } from '../utils/sounds';
import logo from '../assets/logo.png';
import tabela from '../assets/tabela.png';
import gameover from '../assets/gameover.png';
import again from '../assets/again.png';

export const Results: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { resetGame } = useQuizStore();
  const game = location.state?.game as QuizGame | undefined;
  const questions = (location.state?.questions || []) as Question[];
  const remainingTime: number = location.state?.remainingTime ?? 0;
  const savedRef = useRef(false);


  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!game) {
      navigate('/quiz');
      return;
    }

    if (savedRef.current) return;
    savedRef.current = true;
    playFinish();
    playStart();

    const saveResults = async () => {
      try {
        const { error: gameError } = await supabase.from('quiz_games').insert({
          user_id: user.id,
          category: game.category,
          score: game.score,
          total_questions: game.total_questions,
          accuracy: game.accuracy,
          time_taken: game.time_taken,
          answers: game.answers,
        });
        if (gameError) console.error('quiz_games insert error:', gameError);
      } catch (error) {
        console.error('Greška pri čuvanju rezultata:', error);
      }
    };

    saveResults();

    return () => { stopStart(); };
  }, [user, game, navigate]);

  if (!game) return null;

  const correctAnswers = game.answers.filter((a) => a.is_correct).length;

  const pointsMap: Record<string, number> = { easy: 250, medium: 350, hard: 500 };
  const diffBreakdown = (['easy', 'medium', 'hard'] as const).map((d) => {
    const correct = game.answers.filter((a) => {
      if (!a.is_correct) return false;
      const q = questions.find((q) => q.id === a.question_id);
      return q?.difficulty === d;
    }).length;
    return { difficulty: d, correct, points: correct * pointsMap[d] };
  });

  return (
    <div className="min-h-screen py-8 px-4 flex items-center justify-center">
      <div className="card max-w-lg w-full text-center">
        <img
          src={logo}
          alt="Kviz Manija"
          className="w-64 mx-auto mb-4 cursor-pointer"
          onClick={() => { resetGame(); navigate('/'); }}
        />
        <img src={gameover} alt="Igra završena" className="w-64 mx-auto mb-4" />

        <div className="bg-gray-700/50 rounded-lg p-6 mb-6 space-y-4">
          <div>
            <p className="text-gray-400">Ukupan rezultat</p>
            <p className="text-4xl font-bold text-primary">{game.score}</p>
          </div>

          <div className="flex justify-around">
            <div>
              <p className="text-gray-400 text-sm">Tačnih</p>
              <p className="text-2xl font-bold">{correctAnswers}/{game.total_questions}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Tačnost</p>
              <p className="text-2xl font-bold">{game.accuracy.toFixed(0)}%</p>
            </div>
          </div>

          {questions.length > 0 && (
            <div className="border-t border-gray-600 pt-4 text-sm text-gray-400 space-y-1">
              {diffBreakdown.map((d) => (
                <div key={d.difficulty} className="flex justify-between">
                  <span>
                    {d.difficulty === 'easy' ? '⭐ Lako' : d.difficulty === 'medium' ? '⭐⭐ Srednje' : '⭐⭐⭐ Teško'}
                    {' '}({d.correct} x {pointsMap[d.difficulty]})
                  </span>
                  <span className="font-semibold">{d.points}</span>
                </div>
              ))}
              {remainingTime > 0 && (
                <div className="flex justify-between">
                  <span>Preostalo vreme ({remainingTime}s x 50)</span>
                  <span className="font-semibold text-green-400">+{remainingTime * 50}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              resetGame();
              navigate('/');
            }}
            className="hover:scale-105 transition-all cursor-pointer active:scale-95"
          >
            <img src={again} alt="Igraj opet" className="h-[60px] mx-auto" />
          </button>

          <button
            onClick={() => navigate('/leaderboard')}
            className="hover:scale-105 transition-all cursor-pointer active:scale-95"
          >
            <img src={tabela} alt="Leaderboard" className="h-[60px] mx-auto" />
          </button>
        </div>
      </div>
    </div>
  );
};
