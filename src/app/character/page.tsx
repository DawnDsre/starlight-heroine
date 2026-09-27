'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameState } from '@/hooks/useGameState';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Star, Award, Zap, Shield, Heart, Sparkles, Sword, Flame, Snowflake, Sun, Moon, Wind } from 'lucide-react';
import { weapons, skills, titles } from '@/data/levels';

const skillIcons: Record<string, any> = {
  'knowledge-power': Sparkles,
  'courage-light': Zap,
  'shield-shield': Shield,
  'wisdom-heart': Heart,
  'starlight-blessing': Sun,
  'rainbow-heal': Flame,
  'moon-guard': Moon,
  'wind-dance': Wind,
  'ice-shield': Snowflake,
  'thunder-strike': Zap,
  'nature-heal': Heart,
  'light-blast': Sun,
  'shadow-dodge': Wind,
  'holy-shield': Shield,
  'star-rain': Sparkles,
};

const skillColors: Record<string, string> = {
  'knowledge-power': 'from-amber-400 to-orange-400',
  'courage-light': 'from-pink-400 to-rose-400',
  'shield-shield': 'from-sky-400 to-blue-400',
  'wisdom-heart': 'from-purple-400 to-violet-400',
  'starlight-blessing': 'from-yellow-400 to-amber-400',
  'rainbow-heal': 'from-pink-400 to-rose-400',
  'moon-guard': 'from-slate-300 to-gray-400',
  'wind-dance': 'from-teal-400 to-emerald-400',
  'ice-shield': 'from-sky-400 to-blue-400',
  'thunder-strike': 'from-violet-400 to-purple-400',
  'nature-heal': 'from-green-400 to-lime-400',
  'light-blast': 'from-orange-400 to-red-400',
  'shadow-dodge': 'from-gray-400 to-slate-400',
  'holy-shield': 'from-cyan-400 to-blue-400',
  'star-rain': 'from-yellow-400 to-amber-400',
};

export default function CharacterPage() {
  const { gameState, upgradeSkill, setWeapon } = useGameState();
  const router = useRouter();
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
      <div className="min-h-screen bg-gradient-to-b from-amber-100 via-pink-200 to-purple-200 flex items-center justify-center watercolor-bg">
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

  const expProgress = gameState.player.maxExp > 0 
    ? (gameState.player.exp / gameState.player.maxExp) * 100 
    : 0;
  const expToNext = gameState.player.maxExp - gameState.player.exp;

  const currentTitle = titles.find(t => t.id === gameState.player.title) || titles[0];
  const currentWeapon = weapons.find(w => w.id === gameState.player.weapon) || weapons[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-100 via-pink-200 to-purple-200 p-4 pt-20 watercolor-bg">
      <Button 
        onClick={() => router.push('/levels')}
        className="fixed top-4 left-4 z-50 bg-white/80 backdrop-blur-sm hover:bg-white text-purple-600 rounded-2xl btn-elastic shadow-md"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        返回
      </Button>

      <div className="max-w-4xl mx-auto space-y-6 animate-pop-in">
        {/* 角色基本信息 */}
        <Card className="shadow-xl border-2 border-pink-200 rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-pink-100 to-purple-100">
            <CardTitle className="text-2xl flex items-center gap-2 text-pink-700">
              <User className="w-6 h-6" />
              角色信息
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-center gap-6 mb-6">
              <div className="text-6xl bg-white rounded-2xl p-4 shadow-lg animate-breathe">{gameState.player.avatar}</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-pink-600 mb-1">{gameState.player.name}</h3>
                <p className="text-purple-500 font-medium">Lv.{gameState.player.level}</p>
                <p className="text-sm text-gray-500 mt-1">称号: {currentTitle?.icon} {currentTitle?.name}</p>
              </div>
            </div>

            {/* 经验条 */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-purple-500 font-medium">⭐ 经验值</span>
                <span className="text-gray-600">{gameState.player.exp}/{gameState.player.maxExp}</span>
              </div>
              <div className="h-4 bg-purple-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-400 to-pink-500 transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, expProgress))}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">还需 {expToNext} 经验升级</p>
            </div>

            {/* 统计数据 */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-gradient-to-br from-pink-50 to-pink-100/50 rounded-2xl p-4 border border-pink-100">
                <p className="text-sm text-gray-500">❤️ 生命值</p>
                <p className="text-2xl font-bold text-pink-600">{gameState.player.health}/{gameState.player.maxHealth}</p>
                <p className="text-xs text-gray-400 mt-1">每级+10生命</p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-100/50 rounded-2xl p-4 border border-amber-100">
                <p className="text-sm text-gray-500">⚔️ 总攻击力</p>
                <p className="text-2xl font-bold text-amber-600">{gameState.player.attack}</p>
                <p className="text-xs text-gray-400 mt-1">基础15 + 武器+{currentWeapon?.attack || 10}</p>
              </div>
              <div className="bg-gradient-to-br from-sky-50 to-blue-100/50 rounded-2xl p-4 border border-sky-100">
                <p className="text-sm text-gray-500">🛡️ 防御力</p>
                <p className="text-2xl font-bold text-sky-600">{gameState.player.defense || 10}</p>
                <p className="text-xs text-gray-400 mt-1">每级+3防御</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-amber-100/50 rounded-2xl p-4 border border-yellow-100">
                <p className="text-sm text-gray-500">🌟 技能点</p>
                <p className="text-2xl font-bold text-amber-600">{gameState.player.skillPoints}</p>
                <p className="text-xs text-gray-400 mt-1">升级+1技能点</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-violet-100/50 rounded-2xl p-4 border border-purple-100">
                <p className="text-sm text-gray-500">🏆 称号</p>
                <p className="text-xl font-bold text-purple-600">{currentTitle?.name || '初出茅庐'}</p>
                <p className="text-xs text-gray-400 mt-1">{currentTitle?.icon}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-100/50 rounded-2xl p-4 border border-green-100">
                <p className="text-sm text-gray-500">📊 统计</p>
                <p className="text-xl font-bold text-green-600">答题{gameState.player.correctQuestions}/{gameState.player.totalQuestions}</p>
                <p className="text-xs text-gray-400 mt-1">战斗{gameState.player.battlesWon}次</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 武器装备 */}
        <Card className="shadow-xl border-2 border-amber-200 rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100">
            <CardTitle className="text-xl flex items-center gap-2 text-amber-700">
              <Sword className="w-5 h-5" />
              武器装备
            </CardTitle>
            <CardDescription>当前装备: {currentWeapon?.name || '知识手环'}</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {weapons.map((weapon) => {
                const isUnlocked = gameState.player.level >= weapon.unlockLevel;
                const isEquipped = gameState.player.weapon === weapon.id;
                
                return (
                  <button 
                    key={weapon.id}
                    onClick={() => {
                      if (isUnlocked && !isEquipped) {
                        setWeapon(weapon.id);
                      }
                    }}
                    disabled={!isUnlocked || isEquipped}
                    className={`p-4 rounded-2xl border-2 text-center transition-all duration-300 ${
                      isEquipped 
                        ? 'border-amber-400 bg-gradient-to-br from-amber-50 to-yellow-50 shadow-lg cursor-default animate-glow' 
                        : isUnlocked 
                          ? 'border-pink-100 bg-white hover-lift cursor-pointer' 
                          : 'border-gray-200 bg-gray-50/50 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="text-3xl mb-2">{weapon.icon}</div>
                    <p className="font-medium text-sm">{weapon.name}</p>
                    <p className="text-xs text-amber-600">攻击力+{weapon.attack}</p>
                    {isEquipped && (
                      <p className="text-xs text-amber-600 font-bold mt-1">✓ 已装备</p>
                    )}
                    {isUnlocked && !isEquipped && (
                      <p className="text-xs text-sky-500 mt-1">点击装备</p>
                    )}
                    {!isUnlocked && (
                      <p className="text-xs text-gray-400 mt-1">Lv.{weapon.unlockLevel}解锁</p>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* 技能树 */}
        <Card className="shadow-xl border-2 border-purple-200 rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100">
            <CardTitle className="text-xl flex items-center gap-2 text-purple-700">
              <Star className="w-5 h-5" />
              技能树
            </CardTitle>
            <CardDescription>消耗技能点升级技能（技能等级无上限！）</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.map((skill) => {
                const currentLevel = gameState.player.skillLevels[skill.id] || 0;
                const maxLevel = skill.maxLevel;
                const actualCost = skill.cost + Math.floor(currentLevel / 5);
                const canUpgrade = gameState.player.skillPoints >= actualCost && (maxLevel === 999 || currentLevel < maxLevel);
                const IconComponent = skillIcons[skill.id] || Sparkles;
                const isMaxed = maxLevel !== 999 && currentLevel >= maxLevel;
                
                return (
                  <Card 
                    key={skill.id} 
                    className={`overflow-hidden border-0 shadow-md rounded-2xl transition-all duration-300 ${
                      !canUpgrade ? 'opacity-60 grayscale' : 'hover-lift'
                    }`}
                  >
                    <CardHeader className={`bg-gradient-to-r ${skillColors[skill.id] || 'from-gray-400 to-gray-500'} text-white pb-3 rounded-t-2xl`}>
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-5 h-5" />
                        <CardTitle className="text-lg">{skill.name}</CardTitle>
                      </div>
                      <CardDescription className="text-white/80">{skill.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium">等级: {currentLevel}/{maxLevel === 999 ? '∞' : maxLevel}</span>
                        <span className={`text-sm font-bold ${canUpgrade ? 'text-green-600' : 'text-gray-400'}`}>
                          消耗: {actualCost}点
                        </span>
                      </div>
                      
                      {/* 等级进度条 */}
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                        <div 
                          className={`h-full bg-gradient-to-r ${skillColors[skill.id] || 'from-gray-400 to-gray-500'} transition-all duration-300`}
                          style={{ width: `${maxLevel === 999 ? Math.min(100, currentLevel * 5) : (currentLevel / maxLevel) * 100}%` }}
                        />
                      </div>

                      <p className="text-xs text-gray-500 mb-3">
                        {skill.effect}
                      </p>

                      <Button
                        onClick={() => upgradeSkill(skill.id)}
                        disabled={!canUpgrade}
                        className={`w-full transition-all duration-300 rounded-xl ${
                          canUpgrade 
                            ? `bg-gradient-to-r ${skillColors[skill.id] || 'from-gray-400 to-gray-500'} btn-elastic shadow-md` 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed hover:bg-gray-100'
                        }`}
                        variant={canUpgrade ? 'default' : 'secondary'}
                      >
                        {isMaxed ? '✓ 已满级' : canUpgrade ? `⬆️ 升级 (${actualCost}点)` : `💰 需要 ${actualCost}点`}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* 称号收藏 */}
        <Card className="shadow-xl border-2 border-purple-200 rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-violet-100 to-purple-100">
            <CardTitle className="text-xl flex items-center gap-2 text-purple-700">
              <Award className="w-5 h-5" />
              称号收藏
            </CardTitle>
            <CardDescription>
              当前称号: {currentTitle?.icon} {currentTitle?.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {titles.map((title) => {
                const isUnlocked = gameState.player.level >= title.unlockLevel;
                
                return (
                  <div 
                    key={title.id}
                    className={`p-4 rounded-2xl border-2 text-center transition-all duration-300 ${
                      isUnlocked 
                        ? 'border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50 shadow-sm hover-lift' 
                        : 'border-gray-200 bg-gray-50/50 opacity-50'
                    }`}
                  >
                    <div className="text-2xl mb-2">{title.icon}</div>
                    <p className="font-medium text-sm">{title.name}</p>
                    {!isUnlocked && (
                      <p className="text-xs text-gray-400 mt-1">Lv.{title.unlockLevel}解锁</p>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* 冒险统计 */}
        <Card className="shadow-xl border-2 border-sky-200 rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-sky-100 to-cyan-100">
            <CardTitle className="text-xl text-sky-700 flex items-center gap-2">📊 冒险统计</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-sky-50 rounded-2xl p-3 border border-sky-100">
                <p className="text-3xl font-bold text-sky-500">{gameState.player.totalQuestions}</p>
                <p className="text-sm text-gray-500">总答题数</p>
              </div>
              <div className="bg-green-50 rounded-2xl p-3 border border-green-100">
                <p className="text-3xl font-bold text-green-500">
                  {gameState.player.totalQuestions > 0 
                    ? Math.round((gameState.player.correctQuestions / gameState.player.totalQuestions) * 100)
                    : 0}%
                </p>
                <p className="text-sm text-gray-500">正确率</p>
              </div>
              <div className="bg-pink-50 rounded-2xl p-3 border border-pink-100">
                <p className="text-3xl font-bold text-pink-500">{gameState.player.battlesWon}</p>
                <p className="text-sm text-gray-500">战斗胜利</p>
              </div>
              <div className="bg-purple-50 rounded-2xl p-3 border border-purple-100">
                <p className="text-3xl font-bold text-purple-500">{gameState.player.levelsCompleted}</p>
                <p className="text-sm text-gray-500">通关数</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
