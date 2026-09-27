'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameState } from '@/hooks/useGameState';
import { playClick, playLevelUp, isSoundEnabled, setSoundEnabled } from '@/lib/sounds';

export default function Home() {
  const { gameState, saveSlots, isLoading, startNewGame, avatarOptions, saveToSlot, loadFromSlot, deleteSaveSlot, weapons, titles } = useGameState();
  const router = useRouter();
  const [showTutorial, setShowTutorial] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [playerName, setPlayerName] = useState('星月');
  const [selectedAvatar, setSelectedAvatar] = useState('👧');
  const [soundOn, setSoundOn] = useState(true);

  const heroTitle = (titles || []).find(t => t.id === gameState.player.title) || (titles || [])[0] || { name: '初出茅庐', icon: '⭐' };
  const heroWeapon = (weapons || []).find(w => w.id === gameState.player.weapon) || (weapons || [])[0] || { name: '知识手环', icon: '📿', attack: 10 };
  const clearedLevels = Math.max(0, (gameState.currentLevel || 1) - 1);

  useEffect(() => {
    setSoundOn(isSoundEnabled());
  }, []);

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundEnabled(next);
    setSoundOn(next);
    if (next) playClick();
  };

  const handleStartGame = () => {
    playLevelUp();
    startNewGame(playerName, selectedAvatar);
    router.push('/levels');
  };

  const handleContinueGame = () => {
    playClick();
    router.push('/levels');
  };

  const handleSaveSlot = (slotId: number) => {
    saveToSlot(slotId);
    setShowSaveDialog(false);
  };

  const handleLoadSlot = (slotId: number) => {
    const slot = saveSlots.find(s => s.id === slotId);
    if (slot?.used && slot.gameState) {
      loadFromSlot(slotId);
      router.push('/levels');
    }
  };

  // 更多星星，覆盖全屏
  const starPositions = [
    { left: '5%', top: '8%', delay: '0s', size: 'text-xl' },
    { left: '15%', top: '22%', delay: '1.2s', size: 'text-2xl' },
    { left: '25%', top: '5%', delay: '0.5s', size: 'text-lg' },
    { left: '35%', top: '15%', delay: '1.8s', size: 'text-2xl' },
    { left: '50%', top: '3%', delay: '0.8s', size: 'text-xl' },
    { left: '62%', top: '12%', delay: '2.1s', size: 'text-lg' },
    { left: '75%', top: '7%', delay: '1.5s', size: 'text-2xl' },
    { left: '88%', top: '18%', delay: '0.3s', size: 'text-xl' },
    { left: '95%', top: '5%', delay: '2.5s', size: 'text-lg' },
    { left: '8%', top: '55%', delay: '0.7s', size: 'text-lg' },
    { left: '20%', top: '70%', delay: '1.9s', size: 'text-xl' },
    { left: '78%', top: '65%', delay: '0.4s', size: 'text-2xl' },
    { left: '85%', top: '80%', delay: '1.6s', size: 'text-lg' },
    { left: '45%', top: '88%', delay: '2.3s', size: 'text-xl' },
    { left: '60%', top: '75%', delay: '0.9s', size: 'text-lg' },
    { left: '10%', top: '90%', delay: '1.1s', size: 'text-xl' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-pink-200 to-purple-200 p-4 flex flex-col items-center justify-center relative overflow-hidden watercolor-bg">
      {/* 星星装饰 */}
      {starPositions.map((pos, i) => (
        <div
          key={i}
          className={`absolute ${pos.size} animate-sparkle`}
          style={{ left: pos.left, top: pos.top, animationDelay: pos.delay }}
        >
          {i % 3 === 0 ? '✨' : i % 3 === 1 ? '⭐' : '💫'}
        </div>
      ))}

      {/* 彩虹光带装饰 */}
      <div className="absolute top-0 left-0 right-0 h-2 rainbow-bg opacity-60" />
      <div className="absolute bottom-0 left-0 right-0 h-2 rainbow-bg opacity-60" />

      <div className="z-10 max-w-md w-full animate-pop-in">
        {/* 游戏标题 */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-pink-600 mb-2 animate-float title-sparkle drop-shadow-lg">
            🌟 星月小女侠 🌟
          </h1>
          <p className="text-xl text-purple-500 font-medium" style={{ fontFamily: 'var(--font-comic)' }}>
            用智慧守护和平！
          </p>
        </div>

        {/* 角色预览 */}
        <div className="text-center mb-8">
          <div className="avatar-stage">
            <div className="avatar-halo" />
            <div className="avatar-ring" />
            <div className="avatar-orbit"><b>✨</b></div>
            <div className="avatar-orbit orbit-2"><b>⭐</b></div>
            <div className="avatar-core">
              <span className="avatar-emoji">{selectedAvatar}</span>
              <span className="avatar-shine" />
            </div>
          </div>

          <div className="mb-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border-2 border-pink-200 shadow-sm">
              <span className="text-base">{heroTitle.icon}</span>
              <span className="text-sm font-bold text-purple-600">{heroTitle.name}</span>
            </div>
            <h2 className="text-2xl font-bold text-pink-600 mt-4">{playerName || '星月'}</h2>
            <p className="text-sm text-purple-500 mt-2">
              {gameState.gameStarted ? '已踏上星光之旅，继续用智慧守护和平吧！' : '输入名字、挑一个喜欢的头像，开启你的星光冒险吧！'}
            </p>
          </div>

          <div className="hero-stats mb-3">
            <div className="bg-white/85 backdrop-blur-sm rounded-2xl border-2 border-pink-200 py-2 shadow-sm">
              <p className="text-xs text-gray-500">⭐ 等级</p>
              <p className="text-lg font-bold text-purple-600">{gameState.player.level}</p>
            </div>
            <div className="bg-white/85 backdrop-blur-sm rounded-2xl border-2 border-green-200 py-2 shadow-sm">
              <p className="text-xs text-gray-500">🏆 已通关</p>
              <p className="text-lg font-bold text-green-600">{clearedLevels} 关</p>
            </div>
            <div className="bg-white/85 backdrop-blur-sm rounded-2xl border-2 border-sky-200 py-2 shadow-sm">
              <p className="text-xs text-gray-500">❤️ 生命</p>
              <p className="text-lg font-bold text-sky-600">{gameState.player.health}/{gameState.player.maxHealth}</p>
            </div>
          </div>

          <p className="text-xs text-purple-400 mb-4">
            随身装备：{heroWeapon.icon} {heroWeapon.name} · 攻击力 +{heroWeapon.attack}
          </p>

          {/* 自定义角色 */}
          <div className="bg-white/85 backdrop-blur-sm rounded-3xl p-5 shadow-xl border-2 border-pink-200 mb-4 hover-glow">
            <h3 className="text-lg font-bold text-pink-600 mb-4">✨ 创建你的小女侠</h3>
            
            <div className="mb-4">
              <label className="block text-sm text-purple-500 mb-2 font-medium">名字</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border-2 border-pink-300 focus:border-purple-400 focus:outline-none text-center text-lg bg-pink-50/50 transition-colors duration-300"
                placeholder="输入名字"
              />
            </div>
            
            <div>
              <label className="block text-sm text-purple-500 mb-2 font-medium">选择头像</label>
              <div className="grid grid-cols-4 gap-2">
                {avatarOptions.map((avatar, i) => (
                  <button
                    key={i}
                    onClick={() => { playClick(); setSelectedAvatar(avatar); }}
                    className={`text-3xl p-2 rounded-2xl transition-all duration-300 btn-elastic ${
                      selectedAvatar === avatar
                        ? 'bg-gradient-to-br from-pink-200 to-purple-200 ring-2 ring-pink-400 scale-110 shadow-md'
                        : 'bg-pink-50/50 hover:bg-pink-100 hover:shadow-sm'
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 游戏按钮 */}
        <div className="space-y-4">
          <button
            onClick={handleStartGame}
            className="w-full py-4 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 text-white text-xl font-bold rounded-2xl shadow-lg btn-elastic animate-glow"
          >
            🎮 开始新游戏
          </button>

          {saveSlots.some(s => s.used) && (
            <button
              onClick={handleContinueGame}
              className="w-full py-4 bg-gradient-to-r from-green-400 to-teal-400 text-white text-xl font-bold rounded-2xl shadow-lg btn-elastic"
            >
              ⭐ 继续游戏
            </button>
          )}

          <button
            onClick={() => setShowSaveDialog(true)}
            className="w-full py-3 bg-gradient-to-r from-sky-400 to-blue-400 text-white font-bold rounded-2xl shadow-md btn-elastic"
          >
            💾 存档管理
          </button>

          <button
            onClick={() => setShowTutorial(true)}
            className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-400 text-white font-bold rounded-2xl shadow-md btn-elastic"
          >
            📖 游戏说明
          </button>
        </div>
      </div>

      {/* 游戏说明对话框 */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-pop-in">
          <div className="bg-white/95 backdrop-blur rounded-3xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto border-2 border-pink-200 shadow-2xl">
            <h2 className="text-2xl font-bold text-pink-600 mb-5 text-center title-sparkle">🎮 游戏说明</h2>
            
            <div className="space-y-4 text-gray-700">
              <div className="bg-gradient-to-br from-pink-50 to-pink-100/50 rounded-2xl p-4 border border-pink-200">
                <h3 className="font-bold text-pink-600 mb-2">📚 知识答题</h3>
                <p>每关有知识房间，回答题目获得经验！题目包括数学、图形、英语、语文、科学、道德与法治。</p>
              </div>
              
              <div className="bg-gradient-to-br from-sky-50 to-blue-100/50 rounded-2xl p-4 border border-sky-200">
                <h3 className="font-bold text-sky-600 mb-2">⚔️ 回合制战斗</h3>
                <p>使用技能卡净化坏人！选择攻击、护盾、暴击或治愈来战胜敌人。</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-100/50 rounded-2xl p-4 border border-green-200">
                <h3 className="font-bold text-green-600 mb-2">🦸 角色成长</h3>
                <p>升级获得技能点，解锁新武器和称号！变得更强来挑战更高的关卡！</p>
              </div>
              
              <div className="bg-gradient-to-br from-amber-50 to-yellow-100/50 rounded-2xl p-4 border border-amber-200">
                <h3 className="font-bold text-amber-600 mb-2">💾 存档功能</h3>
                <p>随时保存进度，下次可以继续游玩！有5个存档槽可用。</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowTutorial(false)}
              className="w-full mt-6 py-3 bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold rounded-2xl btn-elastic shadow-md"
            >
              知道了！✨
            </button>
          </div>
        </div>
      )}

      {/* 存档对话框 */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-pop-in">
          <div className="bg-white/95 backdrop-blur rounded-3xl p-6 max-w-md w-full border-2 border-pink-200 shadow-2xl">
            <h2 className="text-2xl font-bold text-pink-600 mb-5 text-center">💾 存档管理</h2>
            
            <div className="space-y-3">
              {saveSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="bg-gradient-to-r from-pink-50/80 to-purple-50/80 rounded-2xl p-4 flex items-center justify-between border border-pink-100"
                >
                  <div>
                    <span className="font-bold text-purple-600">存档 {slot.id}</span>
                    {slot.used ? (
                      <p className="text-sm text-gray-500">
                        {slot.gameState?.player.name || '小女侠'} - Lv.{slot.gameState?.player.level || 1}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400">空</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {slot.used ? (
                      <>
                        <button
                          onClick={() => handleLoadSlot(slot.id)}
                          className="px-3 py-1.5 bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-xl text-sm btn-elastic shadow-sm"
                        >
                          读取
                        </button>
                        <button
                          onClick={() => handleSaveSlot(slot.id)}
                          className="px-3 py-1.5 bg-gradient-to-r from-sky-400 to-blue-400 text-white rounded-xl text-sm btn-elastic shadow-sm"
                        >
                          覆盖
                        </button>
                        <button
                          onClick={() => deleteSaveSlot(slot.id)}
                          className="px-3 py-1.5 bg-gradient-to-r from-orange-300 to-amber-400 text-white rounded-xl text-sm btn-elastic shadow-sm"
                        >
                          删除
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleSaveSlot(slot.id)}
                        className="px-3 py-1.5 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-xl text-sm btn-elastic shadow-sm"
                      >
                        保存
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <button
              onClick={() => setShowSaveDialog(false)}
              className="w-full mt-6 py-3 bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700 font-bold rounded-2xl btn-elastic"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
