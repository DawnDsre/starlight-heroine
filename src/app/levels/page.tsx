'use client';

import { useEffect, useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useRouter } from 'next/navigation';
import { User, Star, ChevronRight, Save, Sparkles, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function LevelsPage() {
  const { gameState, saveToSlot, loadFromSlot, deleteSaveSlot, saveSlots } = useGameState();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

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

  const healthPercent = gameState.player.maxHealth > 0 
    ? Math.min(100, Math.max(0, (gameState.player.health / gameState.player.maxHealth) * 100))
    : 0;
  const expPercent = gameState.player.maxExp > 0
    ? Math.min(100, Math.max(0, (gameState.player.exp / gameState.player.maxExp) * 100))
    : 0;

  const currentLevel = gameState.currentLevel || 1;
  const maxVisibleLevel = Math.max(12, currentLevel + 3);
  const levelIds = Array.from({ length: maxVisibleLevel }, (_, i) => i + 1);

  const levelThemes = [
    { name: '星光镇广场', icon: '🏠', color: 'from-pink-100 to-pink-200' },
    { name: '星光图书馆', icon: '📚', color: 'from-sky-100 to-sky-200' },
    { name: '星光公园', icon: '🌳', color: 'from-green-100 to-green-200' },
    { name: '星光大河畔', icon: '🌊', color: 'from-cyan-100 to-cyan-200' },
    { name: '暗影城堡外', icon: '🏰', color: 'from-purple-100 to-purple-200' },
    { name: '暗影城堡顶', icon: '⚔️', color: 'from-amber-100 to-amber-200' },
  ];

  const getLevelInfo = (levelId: number) => {
    const themeIndex = (levelId - 1) % levelThemes.length;
    const cycle = Math.floor((levelId - 1) / levelThemes.length) + 1;
    const theme = levelThemes[themeIndex];
    return {
      name: cycle > 1 ? `${theme.name} · 第${cycle}轮` : theme.name,
      icon: theme.icon,
      color: theme.color,
    };
  };

  const maxUnlockedLevel = (gameState.subLevelsCompleted || 0) + 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-pink-200 to-purple-200 p-4 pt-32 watercolor-bg">
      {/* 角色信息面板 */}
      <div className="fixed top-4 left-4 z-40">
        <Card className="w-72 bg-white/95 backdrop-blur shadow-xl border-2 border-pink-200 p-4 hover-glow">
          <div className="flex items-center space-x-3 mb-3">
            <div className="text-4xl animate-bounce-soft">
              {gameState.player.avatar}
            </div>
            <div>
              <h3 className="font-bold text-purple-600 text-lg">
                {gameState.player.name || '星光小女侠'}
              </h3>
              <p className="text-gray-600 text-sm">
                等级 {gameState.player.level}
              </p>
            </div>
          </div>
          
          {/* 生命值 */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-pink-500 font-medium flex items-center gap-1">
                <Heart className="w-4 h-4" /> 生命
              </span>
              <span className="text-gray-600 font-bold">
                {gameState.player.health}/{gameState.player.maxHealth}
              </span>
            </div>
            <div className="h-3 bg-pink-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-pink-400 to-rose-400 transition-all duration-500"
                style={{ width: `${healthPercent}%` }}
              />
            </div>
          </div>
          
          {/* 经验值 */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-amber-600 font-medium flex items-center gap-1">
                <Star className="w-4 h-4" /> 经验
              </span>
              <span className="text-gray-600">
                {gameState.player.exp}/{gameState.player.maxExp}
              </span>
            </div>
            <div className="h-3 bg-amber-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-yellow-400 transition-all duration-500"
                style={{ width: `${expPercent}%` }}
              />
            </div>
          </div>

          {/* 技能点和关卡进度 */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-pink-100">
            <div className="text-center">
              <p className="text-xs text-gray-500">🌟 技能点</p>
              <p className="text-lg font-bold text-amber-600">{gameState.player.skillPoints}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">📍 当前关卡</p>
              <p className="text-lg font-bold text-purple-600">第{gameState.currentLevel}-{gameState.currentSubLevel}关</p>
            </div>
          </div>
        </Card>
      </div>

      {/* 快捷按钮面板 */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 space-y-3">
        <Button 
          onClick={() => router.push('/character')}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 shadow-lg btn-elastic flex items-center justify-center animate-glow"
          title="角色信息"
        >
          <User className="w-7 h-7 text-white" />
        </Button>
        <Button 
          onClick={() => setShowSaveDialog(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-sky-400 to-purple-400 shadow-lg btn-elastic flex items-center justify-center"
          title="存档管理"
        >
          <Save className="w-7 h-7 text-white" />
        </Button>
        <Button 
          onClick={() => router.push('/')}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-300 to-pink-400 shadow-lg btn-elastic flex items-center justify-center"
          title="返回首页"
        >
          <ChevronRight className="w-7 h-7 text-white rotate-180" />
        </Button>
      </div>
      
      {/* 存档对话框 */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-pop-in">
          <Card className="w-full max-w-md bg-white/95 backdrop-blur p-6 border-2 border-pink-200 shadow-2xl rounded-3xl">
            <h2 className="text-2xl font-bold text-purple-600 mb-4 text-center">
              💾 存档管理
            </h2>
            
            <div className="space-y-3 mb-6">
              {saveSlots.map((slot) => (
                <div key={slot.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-pink-50/80 to-purple-50/80 rounded-2xl border border-pink-100">
                  <div>
                    <div className="font-medium text-purple-600">存档 {slot.id}</div>
                    {slot.used && slot.gameState && (
                      <div className="text-sm text-gray-500">
                        等级 {slot.gameState.player.level} · {new Date(slot.timestamp).toLocaleString()}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!slot.used ? (
                      <Button onClick={() => { saveToSlot(slot.id); setShowSaveDialog(false); }} className="bg-gradient-to-r from-green-400 to-emerald-400 btn-elastic rounded-xl">
                        保存
                      </Button>
                    ) : (
                      <>
                        <Button onClick={() => { loadFromSlot(slot.id); setShowSaveDialog(false); }} className="bg-gradient-to-r from-sky-400 to-blue-400 btn-elastic rounded-xl">
                          读取
                        </Button>
                        <Button onClick={() => deleteSaveSlot(slot.id)} className="bg-gradient-to-r from-orange-300 to-amber-400 btn-elastic rounded-xl">
                          删除
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <Button onClick={() => setShowSaveDialog(false)} className="w-full bg-gradient-to-r from-gray-300 to-gray-400 btn-elastic rounded-2xl">
              关闭
            </Button>
          </Card>
        </div>
      )}
      
      {/* 关卡选择 - 地图式布局 */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-600 text-center mb-8 title-sparkle">
          <Sparkles className="inline-block mr-2" />
          选择冒险之路
          <Sparkles className="inline-block ml-2" />
        </h1>
        
        {/* 当前进度提示 */}
        <div className="text-center mb-8 bg-white/80 backdrop-blur-sm rounded-3xl p-4 max-w-md mx-auto border border-pink-200 shadow-lg hover-glow">
          <p className="text-purple-600 font-medium">
            当前进度：第 {gameState.currentLevel} 关 · 第 {gameState.currentSubLevel} 小节
          </p>
          <p className="text-sm text-gray-500 mt-1">
            已完成 {gameState.subLevelsCompleted || 0} 个小节
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {levelIds.map((levelId) => {
            const levelInfo = getLevelInfo(levelId);
            const isUnlocked = levelId <= maxUnlockedLevel;
            const isCurrent = levelId === currentLevel;
            
            return (
              <Card 
                key={levelId}
                className={`p-5 border-3 transition-all duration-300 cursor-pointer rounded-3xl ${
                  isCurrent
                    ? 'border-amber-400 bg-white/95 shadow-xl animate-glow'
                    : isUnlocked
                      ? levelId < currentLevel
                        ? 'border-green-300 bg-white/90 hover-lift hover:border-green-400'
                        : 'border-pink-200 bg-white/85 hover-lift hover:border-amber-300'
                      : 'border-gray-200 bg-white/50 opacity-60'
                }`}
                onClick={() => isUnlocked && router.push(`/levels/play?levelId=${levelId}`)}
              >
                <div className="text-center">
                  <div className={`text-5xl mb-3 ${isCurrent ? 'animate-bounce-soft' : isUnlocked ? 'animate-breathe' : ''}`}>
                    {levelInfo.icon}
                  </div>
                  <h3 className="text-xl font-bold text-purple-600 mb-1">
                    {levelInfo.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-3">
                    第 {levelId} 关
                  </p>
                  
                  {/* 彩虹桥进度指示 */}
                  {isUnlocked && (
                    <div className="h-1.5 rainbow-bridge rounded-full opacity-70" />
                  )}
                  
                  {!isUnlocked ? (
                    <div className="text-amber-600 text-sm mt-2">
                      🔒 完成前一关解锁
                    </div>
                  ) : isCurrent ? (
                    <div className="text-green-600 text-sm font-medium mt-2">
                      ⭐ 当前关卡
                    </div>
                  ) : levelId < currentLevel ? (
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-600 text-sm font-bold mt-2">
                      ✅ 已通关
                    </div>
                  ) : (
                    <div className="text-sky-600 text-sm mt-2">
                      ✨ 已解锁
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
        
        <div className="text-center mt-8">
          <p className="text-purple-400 text-sm">
            🌟 完成关卡后将解锁更多内容！冒险永无止境！
          </p>
        </div>
      </div>
    </div>
  );
}
