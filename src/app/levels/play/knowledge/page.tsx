'use client';

import { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import type { CSSProperties } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { allQuestions as questions } from '@/data/questions';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronLeft, Star, Calculator, Shapes, Globe, PenTool, Beaker, Heart } from 'lucide-react';
import { playClick, playCorrect, playWrong, playCombo } from '@/lib/sounds';

// 科目图标映射
const subjectIcons: Record<string, any> = {
  math: Calculator,
  shapes: Shapes,
  english: Globe,
  chinese: PenTool,
  science: Beaker,
  morality: Heart,
};

const subjectNames: Record<string, string> = {
  math: '数学',
  shapes: '图形',
  english: '英语',
  chinese: '语文',
  science: '科学',
  morality: '道德与法治',
};

const subjectColors: Record<string, string> = {
  math: 'from-sky-400 to-blue-500',
  shapes: 'from-purple-400 to-violet-500',
  english: 'from-green-400 to-emerald-500',
  chinese: 'from-pink-400 to-rose-500',
  science: 'from-cyan-400 to-teal-500',
  morality: 'from-amber-400 to-orange-500',
};

// 答对时的星星迸发特效
function StarBurst() {
  const stars = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => {
      const angle = (i / 10) * Math.PI * 2;
      const dist = 55 + (i % 3) * 28;
      return {
        id: i,
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist,
        emoji: ['⭐', '✨', '🌟', '💫'][i % 4],
        delay: i * 0.03,
        size: 0.8 + (i % 3) * 0.2,
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center overflow-visible">
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute animate-burst-star"
          style={{
            '--dx': `${s.dx}px`,
            '--dy': `${s.dy}px`,
            animationDelay: `${s.delay}s`,
            fontSize: `${s.size}rem`,
          } as CSSProperties}
        >
          {s.emoji}
        </span>
      ))}
    </div>
  );
}

function KnowledgeContent() {
  const { gameState, answerQuestionCorrect, completeSubLevel } = useGameState();
  const searchParams = useSearchParams();
  const router = useRouter();
  const levelId = parseInt(searchParams.get('levelId') || '1', 10);
  const [mounted, setMounted] = useState(false);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [roomQuestions, setRoomQuestions] = useState<any[]>([]);
  const [totalExpGained, setTotalExpGained] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  // 连击与反馈状态
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [isWrong, setIsWrong] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !gameState.gameStarted) {
      router.push('/');
    }
  }, [mounted, gameState.gameStarted, router]);

  const generateRoomQuestions = useCallback(() => {
    const questionsBySubject: Record<string, any[]> = {};
    questions.forEach(q => {
      if (!questionsBySubject[q.subject]) {
        questionsBySubject[q.subject] = [];
      }
      questionsBySubject[q.subject].push(q);
    });

    const selectedQuestions: any[] = [];
    const subjects = Object.keys(questionsBySubject);

    subjects.forEach(subject => {
      const subjectQuestions = questionsBySubject[subject].sort(() => Math.random() - 0.5);
      const count = Math.min(2, subjectQuestions.length);
      selectedQuestions.push(...subjectQuestions.slice(0, count));
    });

    return selectedQuestions.sort(() => Math.random() - 0.5).slice(0, 10);
  }, []);

  useEffect(() => {
    if (mounted) {
      const selected = generateRoomQuestions();
      setRoomQuestions(selected);
      setIsLoading(false);
    }
  }, [mounted, generateRoomQuestions]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-200 via-pink-200 to-purple-200 flex items-center justify-center watercolor-bg">
        <div className="text-center animate-pop-in">
          <div className="text-4xl animate-bounce-soft mb-4">🌟</div>
          <p className="text-xl text-pink-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!gameState.gameStarted) {
    return null;
  }

  if (isLoading || roomQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-200 via-pink-200 to-purple-200 flex items-center justify-center watercolor-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-300 border-t-pink-500 mb-4 mx-auto"></div>
          <p className="text-pink-600">正在加载题目...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = roomQuestions[currentQuestionIndex];
  const IconComponent = subjectIcons[currentQuestion.subject] || Star;
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
  const isLastQuestion = currentQuestionIndex === roomQuestions.length - 1;

  const handleSelectAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);

    const correct = index === currentQuestion.correctAnswer;
    const expGain = correct ? 10 + currentQuestion.difficulty * 5 : 0;

    if (correct) {
      answerQuestionCorrect(expGain);
      setTotalExpGained(prev => prev + expGain);
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setMaxCombo(m => Math.max(m, nextCombo));
      playCorrect();
      if (nextCombo >= 2) {
        playCombo(nextCombo);
      }
      setIsWrong(false);
    } else {
      setCombo(0);
      playWrong();
      setIsWrong(true);
      setShakeKey(k => k + 1);
    }
  };

  const handleNextQuestion = () => {
    playClick();
    if (currentQuestionIndex < roomQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setIsWrong(false);
    } else {
      if (!completed) {
        completeSubLevel();
        setCompleted(true);
      }
      router.push(`/levels/play?levelId=${levelId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-pink-200 to-purple-200 p-4 pt-20 watercolor-bg">
      <div className="max-w-3xl mx-auto">
        {/* 顶部导航 */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => { playClick(); router.push(`/levels/play?levelId=${levelId}`); }}
            className="rounded-full p-2 hover:bg-pink-100 btn-elastic"
          >
            <ChevronLeft className="w-6 h-6 text-pink-500" />
          </Button>
        </div>

        {/* 进度条 - 彩虹渐变 */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-purple-600 mb-2">
            <span>题目 {currentQuestionIndex + 1}/{roomQuestions.length}</span>
            <span className="flex items-center gap-2">
              {combo >= 2 && (
                <span key={combo} className="animate-combo-pop font-bold text-orange-500">
                  🔥 连击 x{combo}
                </span>
              )}
              <span>✨ 已获得经验：{totalExpGained}</span>
            </span>
          </div>
          <div className="flex gap-1.5">
            {roomQuestions.map((_, index) => (
              <div
                key={index}
                className={`h-2.5 flex-1 rounded-full transition-all duration-300 ${
                  index < currentQuestionIndex
                    ? 'bg-gradient-to-r from-green-400 to-emerald-400'
                    : index === currentQuestionIndex
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-400 animate-pulse'
                    : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 题目卡片 - key 触发切题入场动画 */}
        <Card key={currentQuestionIndex} className="p-6 bg-white/90 backdrop-blur-sm border-2 border-pink-200 rounded-3xl mb-6 shadow-xl hover-glow animate-pop-in">
          <div key={shakeKey} className={isWrong && showResult ? 'animate-shake' : ''}>
            {/* 科目标签 */}
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-12 h-12 bg-gradient-to-br ${subjectColors[currentQuestion.subject]} rounded-2xl flex items-center justify-center text-white shadow-md`}>
                <IconComponent className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold text-purple-700">
                  {subjectNames[currentQuestion.subject]}
                </div>
                <div className="text-sm text-amber-600">
                  难度 {'⭐'.repeat(currentQuestion.difficulty)}
                </div>
              </div>
            </div>

            {/* 题目内容 */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-purple-800 mb-5 leading-relaxed">
                {currentQuestion.question}
              </h2>

              {/* 选项 */}
              <div className="space-y-3">
                {currentQuestion.options.map((option: string, index: number) => {
                  let buttonClass = 'w-full p-4 text-left rounded-2xl border-2 transition-all duration-300 text-base font-medium ';

                  if (!showResult) {
                    buttonClass += selectedAnswer === index
                      ? 'bg-amber-50 border-amber-400 scale-[1.02]'
                      : 'bg-white/80 border-pink-200 hover:bg-pink-50 hover:border-pink-300 hover:scale-[1.02] btn-elastic';
                  } else {
                    if (index === currentQuestion.correctAnswer) {
                      buttonClass += 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-400 scale-[1.02]';
                    } else if (index === selectedAnswer && !isCorrect) {
                      buttonClass += 'bg-gradient-to-r from-red-50 to-orange-50 border-red-400';
                    } else {
                      buttonClass += 'bg-gray-50/50 border-gray-200 opacity-40';
                    }
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleSelectAnswer(index)}
                      className={buttonClass}
                      disabled={showResult}
                    >
                      <span className="font-bold mr-3 text-purple-500">{['A', 'B', 'C', 'D'][index]}.</span>
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 答案反馈 - 星星迸发特效 */}
          {showResult && (
            <div className={`relative p-4 rounded-2xl mb-4 border animate-pop-in ${
              isCorrect
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300'
                : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-300'
            }`}>
              {isCorrect && <StarBurst />}
              <p className={`font-bold mb-2 text-lg ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {isCorrect ? (combo >= 3 ? `✅ 回答正确！连击 x${combo}！` : '✅ 回答正确！') : '❌ 回答错误'}
              </p>
              <p className="text-gray-600 leading-relaxed">{currentQuestion.explanation}</p>
              {isCorrect && (
                <p className="text-amber-600 mt-2 font-medium animate-pop-in">
                  +{10 + currentQuestion.difficulty * 5} ✨ 经验值
                </p>
              )}
              {isLastQuestion && maxCombo >= 3 && (
                <p className="text-pink-600 mt-2 font-medium animate-combo-pop">
                  🔥 本轮最高连击 x{maxCombo}，太厉害啦！
                </p>
              )}
            </div>
          )}

          {/* 下一题按钮 */}
          {showResult && (
            <Button
              onClick={handleNextQuestion}
              className="w-full bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 text-white font-bold py-4 rounded-2xl btn-elastic shadow-lg"
            >
              {isLastQuestion ? '完成 ✅' : '下一题 ➡️'}
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
}

export default function KnowledgePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-3xl text-purple-500">⭐ 加载中...</div>}>
      <KnowledgeContent />
    </Suspense>
  );
}
