'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import type { CSSProperties } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useGameState } from '@/hooks/useGameState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, Shield, Zap, Activity, Sparkles } from 'lucide-react';
import { getEnemyForLevel } from '@/data/levels';
import { playClick, playAttack, playCritical, playDefense, playHeal, playVictory, playDefeat } from '@/lib/sounds';

// 星星粒子组件
function StarParticles() {
  const stars = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: 10 + i * 10,
      top: 20 + (i % 3) * 25,
      delay: i * 0.2,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <span
          key={star.id}
          className="absolute text-lg animate-sparkle"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            animationDelay: `${star.delay}s`,
            opacity: 0.5,
          }}
        >
          ✨
        </span>
      ))}
    </div>
  );
}

// 胜利彩带雨
function ConfettiRain() {
  const pieces = useMemo(() => {
    return Array.from({ length: 16 }, (_, i) => ({
      id: i,
      left: 3 + ((i * 5.8) % 94),
      delay: (i % 5) * 0.18,
      r: 360 + ((i * 137) % 720),
      emoji: ['🎉', '🎊', '✨', '⭐', '🌟', '💖'][i % 6],
      size: 0.9 + (i % 3) * 0.25,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 animate-confetti-fall"
          style={{
            left: `${p.left}%`,
            '--r': `${p.r}deg`,
            animationDelay: `${p.delay}s`,
            fontSize: `${p.size}rem`,
          } as CSSProperties}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}

// 伤害/治愈飘字
interface FloatText {
  text: string;
  key: number;
  color: 'damage' | 'heal';
}

function BattleContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { gameState, completeBattle, takeDamage, healPlayer } = useGameState();
  const levelId = parseInt(searchParams.get('levelId') || '1', 10);
  const [mounted, setMounted] = useState(false);

  const [enemyHealth, setEnemyHealth] = useState(100);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [playerMaxHealth, setPlayerMaxHealth] = useState(100);
  const [message, setMessage] = useState('战斗开始！选择你的技能！');
  const [isAnimating, setIsAnimating] = useState(false);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [battleOver, setBattleOver] = useState(false);
  const [victory, setVictory] = useState(false);
  const [lastAction, setLastAction] = useState<string>('');

  // 受击抖动与飘字
  const [enemyHitKey, setEnemyHitKey] = useState(0);
  const [playerHitKey, setPlayerHitKey] = useState(0);
  const [enemyFloat, setEnemyFloat] = useState<FloatText | null>(null);
  const [playerFloat, setPlayerFloat] = useState<FloatText | null>(null);
  const floatKeyRef = useMemo(() => ({ current: 0 }), []);
  const pushFloat = (side: 'enemy' | 'player', text: string, color: 'damage' | 'heal') => {
    floatKeyRef.current += 1;
    const ft: FloatText = { text, key: floatKeyRef.current, color };
    if (side === 'enemy') setEnemyFloat(ft);
    else setPlayerFloat(ft);
  };

  const enemy = useMemo(() => getEnemyForLevel(levelId), [levelId]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !gameState.gameStarted) {
      router.push('/');
    }
  }, [mounted, gameState.gameStarted, router]);

  useEffect(() => {
    if (mounted && gameState.gameStarted) {
      setEnemyHealth(enemy.health);
      setPlayerHealth(gameState.player.health);
      setPlayerMaxHealth(gameState.player.maxHealth);
    }
  }, [mounted, gameState.gameStarted, enemy.health, gameState.player.health, gameState.player.maxHealth]);

  const addLog = (text: string) => {
    setBattleLog(prev => [...prev, text]);
  };

  const handleAction = async (action: 'attack' | 'defense' | 'critical' | 'heal') => {
    if (isAnimating || battleOver) return;

    setIsAnimating(true);
    setIsPlayerTurn(false);

    let playerDefense = false;
    let damageDealt = 0;

    switch (action) {
      case 'attack': {
        damageDealt = 15 + Math.floor(Math.random() * 10);
        setEnemyHealth(prev => Math.max(0, prev - damageDealt));
        setMessage(`星光攻击！造成 ${damageDealt} 点伤害！`);
        addLog(`⚡ 星光攻击 -${damageDealt}`);
        setLastAction('attack');
        playAttack();
        setEnemyHitKey(k => k + 1);
        pushFloat('enemy', `-${damageDealt}`, 'damage');
        break;
      }
      case 'defense': {
        playerDefense = true;
        setMessage('星光护盾！减少受到的伤害！');
        addLog('🛡️ 防御姿态（伤害减半）');
        setLastAction('defense');
        playDefense();
        break;
      }
      case 'critical': {
        damageDealt = 30 + Math.floor(Math.random() * 15);
        setEnemyHealth(prev => Math.max(0, prev - damageDealt));
        setMessage(`智慧暴击！造成 ${damageDealt} 点暴击伤害！`);
        addLog(`✨ 暴击 -${damageDealt}`);
        setLastAction('critical');
        playCritical();
        setEnemyHitKey(k => k + 1);
        pushFloat('enemy', `-${damageDealt}!`, 'damage');
        break;
      }
      case 'heal': {
        const healing = 20 + Math.floor(Math.random() * 15);
        setPlayerHealth(prev => Math.min(playerMaxHealth, prev + healing));
        setMessage(`彩虹治愈！恢复 ${healing} 点生命值！`);
        addLog(`💗 治愈 +${healing}`);
        setLastAction('heal');
        playHeal();
        pushFloat('player', `+${healing}`, 'heal');
        break;
      }
    }

    await new Promise(resolve => setTimeout(resolve, 800));

    const currentEnemyHealth = enemyHealth - damageDealt;

    if (currentEnemyHealth <= 0 || enemyHealth <= 0) {
      setEnemyHealth(0);
      setVictory(true);
      setBattleOver(true);
      setMessage(`🎉 ${enemy.name}被净化了！变成了${enemy.purifiedForm}！`);
      addLog(`🎊 胜利！${enemy.name}被净化！`);
      completeBattle(true);
      healPlayer(9999);
      playVictory();
      setIsAnimating(false);
      return;
    }

    let enemyDamage = enemy.attack + Math.floor(Math.random() * 8);
    if (playerDefense) {
      enemyDamage = Math.floor(enemyDamage / 2);
    }

    setPlayerHealth(prev => {
      const newHealth = Math.max(0, prev - enemyDamage);
      if (newHealth <= 0) {
        setBattleOver(true);
        setVictory(false);
        setMessage('战斗失败...不要气馁，再试一次吧！');
        addLog('💔 战斗失败');
        playDefeat();
      }
      return newHealth;
    });

    setMessage(`${enemy.name}发动攻击！造成 ${enemyDamage} 点伤害！`);
    addLog(`👾 ${enemy.name}攻击 -${enemyDamage}`);
    setPlayerHitKey(k => k + 1);
    pushFloat('player', `-${enemyDamage}`, 'damage');

    await new Promise(resolve => setTimeout(resolve, 600));

    setIsPlayerTurn(true);
    setIsAnimating(false);
  };

  const handleRetry = () => {
    playClick();
    setEnemyHealth(enemy.health);
    setPlayerHealth(gameState.player.health);
    setMessage('战斗开始！选择你的技能！');
    setBattleLog([]);
    setBattleOver(false);
    setVictory(false);
    setIsPlayerTurn(true);
    setIsAnimating(false);
    setLastAction('');
    setEnemyHitKey(0);
    setPlayerHitKey(0);
    setEnemyFloat(null);
    setPlayerFloat(null);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-200 via-pink-200 to-amber-100 flex items-center justify-center watercolor-bg">
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-200 via-pink-200 to-amber-100 p-4 pt-20 relative watercolor-bg">
      <StarParticles />
      {battleOver && victory && <ConfettiRain />}

      <Button
        onClick={() => { playClick(); router.push(`/levels/play?levelId=${levelId}`); }}
        className="fixed top-4 left-4 z-50 bg-white/80 backdrop-blur-sm hover:bg-white text-purple-600 rounded-2xl btn-elastic shadow-md"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        返回
      </Button>

      <div className="max-w-4xl mx-auto">
        {/* 战斗区域 - 柔和渐变背景 */}
        <div className="relative bg-gradient-to-b from-sky-100/80 via-pink-50/60 to-green-100/80 backdrop-blur-sm rounded-3xl p-6 mb-4 min-h-[380px] border-2 border-white/60 shadow-xl">

          {/* 敌人区域 */}
          <div className={`text-center mb-6 transition-all duration-300 ${isAnimating && !isPlayerTurn ? 'animate-bounce-soft' : ''}`}>
            <div className="relative inline-block">
              <div
                key={enemyHitKey}
                className={`text-8xl mb-2 inline-block ${
                  enemyHealth <= 0
                    ? 'opacity-50 grayscale'
                    : enemyHitKey > 0 && isAnimating && !isPlayerTurn
                    ? 'animate-shake'
                    : 'animate-breathe'
                }`}
              >
                {enemy.icon}
              </div>
              {enemyFloat && (
                <span
                  key={enemyFloat.key}
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 animate-damage-float text-4xl font-black pointer-events-none ${
                    enemyFloat.color === 'damage' ? 'text-red-500' : 'text-green-500'
                  } drop-shadow-md`}
                >
                  {enemyFloat.text}
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-purple-700">{enemy.name}</h3>
            <p className="text-sm text-gray-500 mb-2">{enemy.description}</p>

            {/* 敌人血条 */}
            <div className="max-w-xs mx-auto">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-pink-600 font-medium">敌方HP</span>
                <span className="font-bold text-gray-600">{Math.max(0, enemyHealth)}/{enemy.health}</span>
              </div>
              <div className="h-4 bg-pink-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-400 to-rose-500 transition-all duration-500"
                  style={{ width: `${Math.max(0, (enemyHealth / enemy.health) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* VS分隔 - 彩虹光晕 */}
          <div className="text-center my-3">
            <span className="text-3xl font-bold text-amber-500 rainbow-bg bg-clip-text text-transparent inline-block px-6 py-1 rounded-full">
              ⚔️ VS ⚔️
            </span>
          </div>

          {/* 玩家区域 */}
          <div className={`text-center transition-all duration-300 ${isAnimating && isPlayerTurn ? 'animate-bounce-soft' : ''}`}>
            <div className="relative inline-block">
              <div
                key={playerHitKey}
                className={`text-6xl mb-2 inline-block ${
                  battleOver && !victory
                    ? 'opacity-50'
                    : victory
                    ? 'animate-winner-glow'
                    : playerHitKey > 0 && isAnimating
                    ? 'animate-shake'
                    : 'animate-breathe'
                }`}
              >
                {gameState.player.avatar}
              </div>
              {playerFloat && (
                <span
                  key={playerFloat.key}
                  className={`absolute -top-2 left-1/2 -translate-x-1/2 animate-damage-float text-3xl font-black pointer-events-none ${
                    playerFloat.color === 'damage' ? 'text-red-500' : 'text-green-500'
                  } drop-shadow-md`}
                >
                  {playerFloat.text}
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-pink-600">{gameState.player.name}</h3>
            <p className="text-sm text-purple-400 mb-2">星光小女侠</p>

            {/* 玩家血条 */}
            <div className="max-w-xs mx-auto">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-pink-500 font-medium">我方HP</span>
                <span className="font-bold text-gray-600">{Math.max(0, playerHealth)}/{playerMaxHealth}</span>
              </div>
              <div className="h-4 bg-pink-100 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r from-pink-400 via-purple-400 to-pink-500 transition-all duration-500 ${
                    playerHealth <= playerMaxHealth * 0.25 && !battleOver ? 'animate-hp-flash' : ''
                  }`}
                  style={{ width: `${Math.max(0, (playerHealth / playerMaxHealth) * 100)}%` }}
                />
              </div>
              {playerHealth <= playerMaxHealth * 0.25 && !battleOver && (
                <p className="text-xs text-red-500 mt-1 font-bold animate-pulse">⚠️ 生命值低，小心！</p>
              )}
            </div>
          </div>
        </div>

        {/* 战斗信息 */}
        <Card className="mb-4 bg-white/85 backdrop-blur-sm border-2 border-pink-200 rounded-2xl shadow-md">
          <CardContent className="p-4">
            <p className="text-center text-lg font-medium text-purple-700">{message}</p>
          </CardContent>
        </Card>

        {/* 技能按钮 - 柔和圆润 */}
        {!battleOver && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <Button
              onClick={() => handleAction('attack')}
              disabled={isAnimating || !isPlayerTurn}
              className="h-20 bg-gradient-to-br from-pink-400 to-rose-500 hover:shadow-lg btn-elastic rounded-2xl text-white font-bold text-lg shadow-md"
            >
              <Zap className="w-6 h-6 mr-2" />
              攻击
            </Button>
            <Button
              onClick={() => handleAction('defense')}
              disabled={isAnimating || !isPlayerTurn}
              className="h-20 bg-gradient-to-br from-sky-400 to-blue-500 hover:shadow-lg btn-elastic rounded-2xl text-white font-bold text-lg shadow-md"
            >
              <Shield className="w-6 h-6 mr-2" />
              护盾
            </Button>
            <Button
              onClick={() => handleAction('critical')}
              disabled={isAnimating || !isPlayerTurn}
              className="h-20 bg-gradient-to-br from-amber-400 to-orange-500 hover:shadow-lg btn-elastic rounded-2xl text-white font-bold text-lg shadow-md"
            >
              <Activity className="w-6 h-6 mr-2" />
              暴击
            </Button>
            <Button
              onClick={() => handleAction('heal')}
              disabled={isAnimating || !isPlayerTurn}
              className="h-20 bg-gradient-to-br from-green-400 to-emerald-500 hover:shadow-lg btn-elastic rounded-2xl text-white font-bold text-lg shadow-md"
            >
              <Heart className="w-6 h-6 mr-2" />
              治愈
            </Button>
          </div>
        )}

        {/* 战斗结束 */}
        {battleOver && (
          <div className="text-center space-y-4 animate-pop-in">
            <div className={`text-5xl font-bold ${victory ? 'text-green-500' : 'text-pink-500'}`}>
              {victory ? '🎉 胜利！' : '💪 不要放弃！'}
            </div>
            {victory && (
              <div className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border-2 font-bold shadow-sm animate-pop-in ${gameState.currentLevel > levelId ? 'bg-green-50 border-green-300 text-green-600' : 'bg-white/85 border-pink-200 text-purple-600'}`}>
                {gameState.currentLevel > levelId
                  ? `✅ 第 ${levelId} 关 已通关！已解锁第 ${gameState.currentLevel} 关，生命值已恢复！`
                  : '✅ 已通关！生命值已恢复，继续加油！'}
              </div>
            )}
            {!victory && (
              <div className="text-gray-500">再试一次，你一定可以的！</div>
            )}
            <div className="flex gap-4 justify-center">
              {!victory && (
                <Button
                  onClick={handleRetry}
                  className="bg-gradient-to-r from-amber-400 to-orange-400 text-white font-bold px-8 py-6 text-lg btn-elastic rounded-2xl shadow-lg"
                >
                  🔄 重新挑战
                </Button>
              )}
              <Button
                onClick={() => { playClick(); router.push(victory ? `/levels/play?levelId=${gameState.currentLevel}` : '/levels'); }}
                className="bg-gradient-to-r from-sky-400 to-purple-400 text-white font-bold px-8 py-6 text-lg btn-elastic rounded-2xl shadow-lg"
              >
                {victory ? '✨ 继续冒险' : '🏠 返回关卡'}
              </Button>
            </div>
          </div>
        )}

        {/* 战斗日志 - 浅色主题 */}
        <Card className="bg-white/70 backdrop-blur-sm border border-pink-200 rounded-2xl mt-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-purple-600 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> 战斗记录
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm max-h-28 overflow-y-auto">
              {battleLog.length === 0 ? (
                <p className="text-gray-400">战斗开始...</p>
              ) : (
                battleLog.map((log, index) => (
                  <p key={index} className="text-gray-600">{log}</p>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function BattlePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-3xl text-purple-500">⭐ 加载中...</div>}>
      <BattleContent />
    </Suspense>
  );
}
