import React, { useMemo } from 'react';
import { type Question, type QuizAnswer } from '../types';
import { playCorrect, playWrong } from '../utils/sounds';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: QuizAnswer) => void;
  selectedAnswer?: string;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  selectedAnswer,
}) => {
  // Shuffle options once per question (stable while question.id stays the same)
  const shuffledOptions = useMemo(
    () => [...question.options].sort(() => Math.random() - 0.5),
    [question.id]  // eslint-disable-line react-hooks/exhaustive-deps
  );
  const handleSelectOption = (option: string) => {
    if (selectedAnswer) return; // Already answered, ignore clicks
    const isCorrect = option === question.correct_answer;
    if (isCorrect) playCorrect(); else playWrong();
    onAnswer({
      user_id: '',
      question_id: question.id,
      selected_answer: option,
      is_correct: isCorrect,
    });
  };

  return (
    <div className="card mb-6">
      <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
        <div
          className="bg-primary h-2 rounded-full transition-all"
          style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
        ></div>
      </div>

      <h2 className="text-xl font-bold mb-6">{question.text}</h2>

      <div className="space-y-3">
        {shuffledOptions.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelectOption(option)}
            disabled={!!selectedAnswer}
            className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
              selectedAnswer === option
                ? 'border-primary bg-primary/20'
                : selectedAnswer
                ? 'border-gray-700 opacity-60 cursor-not-allowed'
                : 'border-gray-600 hover:border-primary cursor-pointer'
            }`}
          >
            <span className="font-semibold text-primary mr-3">
              {String.fromCharCode(65 + index)}.
            </span>
            {option}
          </button>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
        <p className="text-sm text-gray-400">
          <strong>Kategorija:</strong> {question.category} •{' '}
          <strong>Težina:</strong>{' '}
          {question.difficulty === 'easy'
            ? 'Lako'
            : question.difficulty === 'medium'
            ? 'Srednje'
            : 'Teško'}
        </p>
      </div>
    </div>
  );
};
