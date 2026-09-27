'use client';


import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { BookOpen, Sword, ChevronLeft, Sparkles, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function LevelContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const levelId = Number(searchParams.get('levelId') || '1');
  const { gameState, weapons } = useGameState();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !gameState.gameStarted) {
      router.push('/');
    }
  }, [mounted, gameState.gameStarted, router]);

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

  const levelThemes = [
    '星光镇广场',
    '星光图书馆', 
    '星光公园',
    '星光大河畔',
    '暗影城堡外',
    '暗影城堡顶'
  ];
  
  const cycle = Math.floor((levelId - 1) / levelThemes.length) + 1;
  const themeIndex = (levelId - 1) % levelThemes.length;
  const levelName = cycle > 1 
    ? `${levelThemes[themeIndex]} · 第${cycle}轮` 
    : levelThemes[themeIndex];

  const currentWeapon = weapons.find(w => w.id === gameState.player.weapon) || weapons[0];

  const handleEnterKnowledge = () => {
    router.push(`/levels/play/knowledge?levelId=${levelId}`);
  };

  const handleEnterBattle = () => {
    router.push(`/levels/play/battle?levelId=${levelId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-pink-200 to-purple-200 p-4 pt-20 watercolor-bg">
      <div className="max-w-4xl mx-auto animate-pop-in">
        {/* 返回按钮 */}
        <Button
          onClick={() => router.push('/levels')}
          className="mb-6 bg-white/80 backdrop-blur-sm hover:bg-white text-purple-600 rounded-2xl btn-elastic shadow-md"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          返回关卡选择
        </Button>

        {/* 关卡标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-600 mb-2 title-sparkle">
            第 {levelId} 关
          </h1>
          <h2 className="text-2xl font-semibold text-pink-500">
            {levelName}
          </h2>
          {levelId < (gameState.currentLevel || 1) && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border-2 border-green-300 text-green-600 font-bold shadow-sm">
              ✅ 本关已通关
            </div>
          )}
        </div>

        {/* 房间选择 */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* 知识房间 */}
          <Card className="p-6 bg-white/90 backdrop-blur-sm rounded-3xl border-2 border-sky-200 hover-lift cursor-pointer shadow-lg" onClick={handleEnterKnowledge}>
            <div className="text-center">
              <div className="text-6xl mb-4 animate-bounce-soft">📚</div>
              <h3 className="text-2xl font-bold text-purple-700 mb-2">知识房间</h3>
              <p className="text-gray-600 mb-4">用智慧获取力量！</p>
              <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-sky-100 to-blue-100 rounded-full text-sm text-sky-600 font-medium">
                8道题目 · 获得经验
              </div>
            </div>
          </Card>

          {/* 战斗房间 */}
          <Card className="p-6 bg-white/90 backdrop-blur-sm rounded-3xl border-2 border-pink-200 hover-lift cursor-pointer shadow-lg" onClick={handleEnterBattle}>
            <div className="text-center">
              <div className="text-6xl mb-4 animate-bounce-soft">⚔️</div>
              <h3 className="text-2xl font-bold text-purple-700 mb-2">战斗房间</h3>
              <p className="text-gray-600 mb-4">用勇气守护和平！</p>
              <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-pink-100 to-rose-100 rounded-full text-sm text-pink-600 font-medium">
                净化敌人 · 获得奖励
              </div>
            </div>
          </Card>
        </div>

        {/* 当前装备 */}
        <Card className="p-6 bg-white/90 backdrop-blur-sm rounded-3xl border-2 border-amber-200 shadow-lg hover-glow">
          <h3 className="text-xl font-bold text-purple-700 mb-4 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-amber-500" />
            当前装备
          </h3>
          <div className="flex items-center">
            <div className="text-4xl mr-4 animate-breathe">{currentWeapon.icon}</div>
            <div>
              <h4 className="text-lg font-semibold text-purple-700">{currentWeapon.name}</h4>
              <p className="text-gray-500">{currentWeapon.description}</p>
              <p className="text-amber-600 font-semibold">攻击力 +{currentWeapon.attack}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function LevelPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-3xl text-purple-500">⭐ 加载中...</div>}>
      <LevelContent />
    </Suspense>
  );
}
