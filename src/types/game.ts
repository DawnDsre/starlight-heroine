// 科目类型
export type Subject = 'math' | 'shapes' | 'english' | 'chinese' | 'science' | 'morality';

// 题目难度
export type Difficulty = 1 | 2 | 3;

// 题目类型
export interface Question {
  id: number;
  subject: Subject;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correctAnswer: number;
  /** 答案解释：说明答案的依据与相关知识 */
  explanation: string;
  answerExplain: string;
  /** 答案启发：延伸提示或启发性信息 */
  answerInspire: string;
}

// 技能类型
export interface Skill {
  id: string;
  name: string;
  description: string;
  effect: string;
  maxLevel: number;
  cost: number;
  type?: 'attack' | 'defense' | 'heal' | 'critical';
}

// 武器类型
export interface Weapon {
  id: string;
  name: string;
  description: string;
  attack: number;
  unlockLevel: number;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// 称号类型
export interface Title {
  id: string;
  name: string;
  icon: string;
  unlockLevel: number;
}

// 敌人类型
export interface Enemy {
  id: string;
  name: string;
  description: string;
  icon: string;
  health: number;
  attack: number;
  purifiedForm: string;
}

// 房间类型
export type RoomType = 'knowledge' | 'battle';

// 子关卡类型
export interface SubLevel {
  id: number;
  rooms: RoomType[];
  completed: boolean;
}

// 关卡类型
export interface Level {
  id: number;
  name: string;
  description: string;
  subLevels: SubLevel[];
  enemy: Enemy;
  theme: string;
}

// 玩家类型
export interface Player {
  name: string;
  avatar: string;
  level: number;
  exp: number;
  maxExp: number;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  weapon: string;
  skillPoints: number;
  skillLevels: { [key: string]: number };
  title: string;
  totalQuestions: number;
  correctQuestions: number;
  battlesWon: number;
  levelsCompleted: number;
}

// 存档类型
export interface SaveSlot {
  id: number;
  used: boolean;
  gameState: GameState | null;
  timestamp: number;
}

// 游戏状态类型
export interface GameState {
  gameStarted: boolean;
  player: Player;
  currentLevel: number;
  currentSubLevel: number;
  subLevelsCompleted: number;
}

// 战斗行动类型
export interface BattleAction {
  id: string;
  name: string;
  description: string;
  baseDamage: number;
  icon: string;
}
