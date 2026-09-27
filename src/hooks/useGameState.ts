'use client';

import { useState, useEffect, useCallback } from 'react';
import { GameState, Player, SaveSlot, Question } from '@/types/game';
import { getRandomQuestions } from '@/data/questions';
import { weapons, skills, titles, generateLevel, getEnemyForLevel } from '@/data/levels';

const STORAGE_KEY = 'starlight-game-state';
const SAVE_SLOTS_KEY = 'starlight-save-slots';

// 计算武器攻击加成
function getWeaponAttackBonus(weaponId: string): number {
  const weapon = weapons.find(w => w.id === weaponId);
  return weapon?.attack || 10;
}

const initialPlayer: Player = {
  name: '星月',
  avatar: '👧',
  level: 1,
  exp: 0,
  maxExp: 100,
  health: 150,
  maxHealth: 150,
  weapon: 'knowledge-bracelet',
  attack: 15 + getWeaponAttackBonus('knowledge-bracelet'), // 基础攻击 + 武器加成
  defense: 10,
  skillPoints: 3,
  skillLevels: {},
  title: 'beginner',
  totalQuestions: 0,
  correctQuestions: 0,
  battlesWon: 0,
  levelsCompleted: 0,
};

const initialGameState: GameState = {
  gameStarted: false,
  player: initialPlayer,
  currentLevel: 1,
  currentSubLevel: 1,
  subLevelsCompleted: 0,
};

const initialSaveSlots: SaveSlot[] = [
  { id: 1, used: false, gameState: null, timestamp: 0 },
  { id: 2, used: false, gameState: null, timestamp: 0 },
  { id: 3, used: false, gameState: null, timestamp: 0 },
  { id: 4, used: false, gameState: null, timestamp: 0 },
  { id: 5, used: false, gameState: null, timestamp: 0 },
];

export function useGameState() {
  // mounted 状态：确保 SSR 和 CSR 第一次渲染完全一致
  const [mounted, setMounted] = useState(false);
  
  // 使用 useState 替代 useLocalStorage，完全控制 SSR/CSR 行为
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [saveSlots, setSaveSlots] = useState<SaveSlot[]>(initialSaveSlots);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);

  // 客户端挂载后读取 localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          // 确保数据结构完整
          setGameState({
            ...initialGameState,
            ...parsed,
            player: {
              ...initialPlayer,
              ...(parsed.player || {}),
            },
          });
        }
        const savedSlots = localStorage.getItem(SAVE_SLOTS_KEY);
        if (savedSlots) {
          setSaveSlots(JSON.parse(savedSlots));
        }
      } catch (e) {
        console.error('Failed to load game state:', e);
      }
    }
    setMounted(true);
  }, []);

  // 保存 gameState 到 localStorage
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    }
  }, [gameState, mounted]);

  // 保存 saveSlots 到 localStorage
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      localStorage.setItem(SAVE_SLOTS_KEY, JSON.stringify(saveSlots));
    }
  }, [saveSlots, mounted]);

  // 开始新游戏
  const startNewGame = useCallback((playerName?: string, playerAvatar?: string) => {
    const newPlayer = { 
      ...initialPlayer,
      name: playerName || initialPlayer.name,
      avatar: playerAvatar || initialPlayer.avatar,
    };
    
    const newState: GameState = {
      ...initialGameState,
      gameStarted: true,
      player: newPlayer,
    };
    
    setGameState(newState);
  }, []);

  // 继续游戏
  const continueGame = useCallback(() => {
    // 已经有存档，直接继续
  }, []);

  // 选择关卡
  const selectLevel = useCallback((levelId: number) => {
    setGameState(prev => ({
      ...prev,
      currentLevel: levelId,
      currentSubLevel: 1,
    }));
  }, []);

  // 生成题目
  const generateQuestions = useCallback((count: number = 8) => {
    const questions = getRandomQuestions('all', count);
    setCurrentQuestions(questions);
    return questions;
  }, []);

  // 答题正确
  const answerQuestionCorrect = useCallback((expGain: number = 10) => {
    setGameState(prev => {
      const newExp = prev.player.exp + expGain;
      let newLevel = prev.player.level;
      let newMaxExp = prev.player.maxExp;
      let remainingExp = newExp;
      let skillPointsGained = 0;
      let levelsGained = 0;
      
      while (remainingExp >= newMaxExp) {
        remainingExp -= newMaxExp;
        newLevel++;
        newMaxExp = Math.floor(newMaxExp * 1.3); // 更平滑的经验增长曲线
        skillPointsGained++;
        levelsGained++;
      }
      
      // 角色升级时增加属性：每级+10生命、+5攻击、+3防御
      const healthGain = levelsGained * 10;
      const attackGain = levelsGained * 5;
      const defenseGain = levelsGained * 3;
      
      return {
        ...prev,
        player: {
          ...prev.player,
          level: newLevel,
          exp: remainingExp,
          maxExp: newMaxExp,
          maxHealth: prev.player.maxHealth + healthGain,
          health: Math.min(prev.player.maxHealth + healthGain, prev.player.health + healthGain),
          attack: prev.player.attack + attackGain,
          defense: prev.player.defense + defenseGain,
          skillPoints: prev.player.skillPoints + skillPointsGained,
          totalQuestions: prev.player.totalQuestions + 1,
          correctQuestions: prev.player.correctQuestions + 1,
        },
      };
    });
  }, []);

  // 答题错误
  const answerQuestionWrong = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        totalQuestions: prev.player.totalQuestions + 1,
      },
    }));
  }, []);

  // 完成子关卡（答题房间完成后调用）
  const completeSubLevel = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      subLevelsCompleted: prev.subLevelsCompleted + 1,
    }));
  }, []);

  // 完成战斗并推进关卡
  const completeBattle = useCallback((victory: boolean) => {
    if (victory) {
      setGameState(prev => {
        const nextSubLevel = prev.currentSubLevel + 1;
        let newCurrentLevel = prev.currentLevel;
        let newCurrentSubLevel = nextSubLevel;
        
        if (nextSubLevel > 3) {
          // 完成大关，进入下一关的第1个子关卡
          newCurrentLevel = prev.currentLevel + 1;
          newCurrentSubLevel = 1;
        }
        
        return {
          ...prev,
          currentLevel: newCurrentLevel,
          currentSubLevel: newCurrentSubLevel,
          subLevelsCompleted: prev.subLevelsCompleted + 1,
          player: {
            ...prev.player,
            battlesWon: prev.player.battlesWon + 1,
            levelsCompleted: prev.player.levelsCompleted + 1,
          },
        };
      });
    }
  }, []);

  // 升级技能
  const upgradeSkill = useCallback((skillId: string) => {
    setGameState(prev => {
      if (prev.player.skillPoints <= 0) return prev;
      
      const currentLevel = prev.player.skillLevels[skillId] || 0;
      const skillDef = skills.find(s => s.id === skillId);
      const maxLevel = skillDef?.maxLevel ?? 999;
      if (currentLevel >= maxLevel) return prev;
      
      // 技能升级消耗随等级增加
      const cost = skillDef ? skillDef.cost + Math.floor(currentLevel / 5) : 1;
      if (prev.player.skillPoints < cost) return prev;
      
      // 根据技能类型增加对应属性
      let healthGain = 0;
      let attackGain = 0;
      let defenseGain = 0;
      
      if (skillDef) {
        // 不同技能给予不同属性加成
        if (skillDef.type === 'attack' || skillDef.type === 'critical') {
          attackGain = 3 + Math.floor(currentLevel / 3);
        } else if (skillDef.type === 'defense' || skillDef.type === 'heal') {
          defenseGain = 3 + Math.floor(currentLevel / 3);
          healthGain = 5 + Math.floor(currentLevel / 2);
        } else {
          // 通用技能：小幅度全属性提升
          attackGain = 1;
          defenseGain = 1;
          healthGain = 2;
        }
      }
      
      return {
        ...prev,
        player: {
          ...prev.player,
          skillPoints: prev.player.skillPoints - cost,
          maxHealth: prev.player.maxHealth + healthGain,
          health: Math.min(prev.player.maxHealth + healthGain, prev.player.health + healthGain),
          attack: prev.player.attack + attackGain,
          defense: prev.player.defense + defenseGain,
          skillLevels: {
            ...prev.player.skillLevels,
            [skillId]: currentLevel + 1,
          },
        },
      };
    });
  }, []);

  // 设置武器
  const setWeapon = useCallback((weaponId: string) => {
    setGameState(prev => {
      const oldWeapon = weapons.find(w => w.id === prev.player.weapon);
      const newWeapon = weapons.find(w => w.id === weaponId);
      const oldBonus = oldWeapon?.attack || 0;
      const newBonus = newWeapon?.attack || 0;
      
      return {
        ...prev,
        player: {
          ...prev.player,
          weapon: weaponId,
          attack: prev.player.attack - oldBonus + newBonus,
        },
      };
    });
  }, []);

  // 恢复生命
  const healPlayer = useCallback((amount: number) => {
    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        health: Math.min(prev.player.maxHealth, prev.player.health + amount),
      },
    }));
  }, []);

  // 受到伤害
  const takeDamage = useCallback((amount: number) => {
    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        health: Math.max(0, prev.player.health - amount),
      },
    }));
  }, []);

  // 保存到存档槽
  const saveToSlot = useCallback((slotId: number) => {
    setSaveSlots(prev => prev.map(slot => {
      if (slot.id === slotId) {
        return {
          ...slot,
          used: true,
          gameState: gameState,
          timestamp: Date.now(),
        };
      }
      return slot;
    }));
  }, [gameState]);

  // 从存档槽加载
  const loadFromSlot = useCallback((slotId: number) => {
    const slot = saveSlots.find(s => s.id === slotId);
    if (slot?.used && slot.gameState) {
      setGameState(slot.gameState);
    }
  }, [saveSlots]);

  // 删除存档
  const deleteSaveSlot = useCallback((slotId: number) => {
    setSaveSlots(prev => prev.map(slot => {
      if (slot.id === slotId) {
        return {
          ...slot,
          used: false,
          gameState: null,
          timestamp: 0,
        };
      }
      return slot;
    }));
  }, []);

  // 头像选项
  const avatarOptions = ['👧', '👦', '🧒', '👶', '🦸', '🧙', '🦹', '🧝', '👸', '🤴', '🧛', '🧟', '🧜', '🧚', '🦄', '🐱', '🐶', '🐰', '🦊', '🐼', '🦋', '🌸', '⭐', '🌙', '🌟', '💫', '✨', '🎀', '👑', '💎', '🔮', '🎭'];

  return {
    gameState,
    currentQuestions,
    saveSlots,
    isLoading: !mounted,
    mounted,
    avatarOptions,
    weapons,
    skills,
    titles,
    startNewGame,
    continueGame,
    selectLevel,
    generateQuestions,
    answerQuestionCorrect,
    answerQuestionWrong,
    completeSubLevel,
    completeBattle,
    upgradeSkill,
    setWeapon,
    healPlayer,
    takeDamage,
    saveToSlot,
    loadFromSlot,
    deleteSaveSlot,
    generateLevel,
    getEnemyForLevel,
  };
}
