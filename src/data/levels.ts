import { Weapon, Skill, Title, Enemy, Level } from '@/types/game';

// 武器系统 - 30种武器，支持无限等级解锁
export const weapons: Weapon[] = [
  { id: 'knowledge-bracelet', name: '知识手环', description: '基础武器，蕴含知识的力量', attack: 10, unlockLevel: 1, icon: '📿', rarity: 'common' },
  { id: 'starlight-bracelet', name: '星光手环', description: '升级后的手环，星光闪耀', attack: 15, unlockLevel: 3, icon: '✨', rarity: 'common' },
  { id: 'starlight-sword', name: '星光剑', description: '正义之剑，斩破黑暗', attack: 25, unlockLevel: 5, icon: '⚔️', rarity: 'rare' },
  { id: 'rainbow-bow', name: '彩虹弓', description: '射出彩虹光芒的神弓', attack: 35, unlockLevel: 7, icon: '🏹', rarity: 'rare' },
  { id: 'wisdom-staff', name: '智慧法杖', description: '汇聚无穷智慧的法杖', attack: 50, unlockLevel: 10, icon: '🪄', rarity: 'epic' },
  { id: 'flame-dagger', name: '烈焰匕首', description: '燃烧着正义火焰的匕首', attack: 65, unlockLevel: 13, icon: '🗡️', rarity: 'epic' },
  { id: 'ice-wand', name: '冰霜魔杖', description: '能冻结邪恶的冰霜魔杖', attack: 80, unlockLevel: 16, icon: '❄️', rarity: 'epic' },
  { id: 'thunder-hammer', name: '雷霆战锤', description: '召唤雷电之力的战锤', attack: 100, unlockLevel: 20, icon: '🔨', rarity: 'legendary' },
  { id: 'nature-spear', name: '自然长矛', description: '蕴含自然之力的长矛', attack: 120, unlockLevel: 25, icon: '🔱', rarity: 'legendary' },
  { id: 'holy-blade', name: '圣光之刃', description: '散发神圣光芒的利刃', attack: 150, unlockLevel: 30, icon: '🗡️', rarity: 'legendary' },
  { id: 'shadow-claw', name: '暗影爪', description: '能穿透黑暗之影的爪', attack: 180, unlockLevel: 35, icon: '🐾', rarity: 'legendary' },
  { id: 'dragon-slayer', name: '屠龙剑', description: '传说中能净化一切邪恶的神剑', attack: 220, unlockLevel: 40, icon: '⚔️', rarity: 'legendary' },
  { id: 'phoenix-feather', name: '凤凰羽扇', description: '浴火重生的凤凰羽毛制成的扇子', attack: 260, unlockLevel: 45, icon: '🪶', rarity: 'legendary' },
  { id: 'cosmic-orb', name: '星辰宝珠', description: '蕴含着宇宙星辰力量的宝珠', attack: 310, unlockLevel: 50, icon: '🔮', rarity: 'legendary' },
  { id: 'infinity-gauntlet', name: '无限手环', description: '传说中的终极武器，拥有无穷力量', attack: 400, unlockLevel: 60, icon: '💫', rarity: 'legendary' },
  { id: 'angel-wings', name: '天使之翼', description: '纯洁天使的羽翼，散发治愈之光', attack: 500, unlockLevel: 75, icon: '🕊️', rarity: 'legendary' },
  { id: 'time-sword', name: '时之剑', description: '能够操控时间的神秘之剑', attack: 650, unlockLevel: 90, icon: '⏳', rarity: 'legendary' },
  { id: 'galaxy-whip', name: '银河鞭', description: '由银河星光编织而成的神鞭', attack: 800, unlockLevel: 110, icon: '🌌', rarity: 'legendary' },
  { id: 'universe-shield', name: '宇宙盾', description: '守护整个宇宙的终极盾牌', attack: 1000, unlockLevel: 130, icon: '🛡️', rarity: 'legendary' },
  { id: 'god-sword', name: '神之剑', description: '传说中的创世神剑，拥有毁灭与净化之力', attack: 1500, unlockLevel: 150, icon: '✨', rarity: 'legendary' },
  { id: 'void-blade', name: '虚空之刃', description: '来自虚空的神秘利刃', attack: 2000, unlockLevel: 180, icon: '🌀', rarity: 'legendary' },
  { id: 'dream-staff', name: '梦境法杖', description: '能操控梦境的神奇法杖', attack: 2500, unlockLevel: 210, icon: '💭', rarity: 'legendary' },
  { id: 'chaos-sword', name: '混沌之剑', description: '蕴含混沌之力的终极武器', attack: 3000, unlockLevel: 250, icon: '💥', rarity: 'legendary' },
  { id: 'harmony-bow', name: '和谐之弓', description: '能带来和平的神圣之弓', attack: 3500, unlockLevel: 300, icon: '🎶', rarity: 'legendary' },
  { id: 'eternal-spear', name: '永恒之矛', description: '永不磨损的传说之矛', attack: 4000, unlockLevel: 350, icon: '♾️', rarity: 'legendary' },
  { id: 'light-sword', name: '光明神剑', description: '散发着永恒光明的神剑', attack: 5000, unlockLevel: 400, icon: '☀️', rarity: 'legendary' },
  { id: 'dark-blade', name: '暗影刃', description: '能吞噬一切的暗影之刃', attack: 6000, unlockLevel: 450, icon: '🌑', rarity: 'legendary' },
  { id: 'star-sword', name: '星辰之剑', description: '由星辰之力凝聚的神剑', attack: 7000, unlockLevel: 500, icon: '🌟', rarity: 'legendary' },
  { id: 'creation-staff', name: '创世法杖', description: '能创造万物的神圣法杖', attack: 8000, unlockLevel: 600, icon: '🌍', rarity: 'legendary' },
  { id: 'infinity-sword', name: '无限神剑', description: '拥有无限可能性的终极武器', attack: 10000, unlockLevel: 750, icon: '♾️', rarity: 'legendary' },
];

// 技能系统 - 25种技能，支持无限等级（maxLevel设为999表示无限）
export const skills: Skill[] = [
  { id: 'knowledge-power', name: '知识之力', description: '答题时获得额外经验', effect: '每级经验+10%', maxLevel: 999, cost: 1, type: 'attack' },
  { id: 'courage-light', name: '勇气之光', description: '提升攻击力', effect: '每级攻击+5', maxLevel: 999, cost: 1, type: 'attack' },
  { id: 'shield-shield', name: '守护之盾', description: '提升防御力', effect: '每级防御+5，减少受到伤害', maxLevel: 999, cost: 1, type: 'defense' },
  { id: 'wisdom-heart', name: '智慧之心', description: '战斗中可获得提示', effect: '每级提示概率+10%', maxLevel: 10, cost: 2, type: 'critical' },
  { id: 'starlight-blessing', name: '星光祝福', description: '增加最大生命值', effect: '每级最大生命+20', maxLevel: 999, cost: 2, type: 'defense' },
  { id: 'rainbow-heal', name: '彩虹治愈', description: '战斗中自动回复', effect: '每级每回合回复+3', maxLevel: 999, cost: 2, type: 'heal' },
  { id: 'moon-guard', name: '月光守护', description: '夜间战斗能力提升', effect: '每级夜间攻击+8', maxLevel: 999, cost: 2, type: 'defense' },
  { id: 'wind-dance', name: '风之舞', description: '提升闪避率', effect: '每级闪避率+5%', maxLevel: 20, cost: 3, type: 'defense' },
  { id: 'ice-shield', name: '冰霜护甲', description: '有几率冰冻敌人', effect: '每级冰冻概率+3%', maxLevel: 30, cost: 3, type: 'defense' },
  { id: 'thunder-strike', name: '雷霆一击', description: '暴击时额外伤害', effect: '每级暴击伤害+15%', maxLevel: 999, cost: 3, type: 'critical' },
  { id: 'nature-heal', name: '自然治愈', description: '战斗结束后恢复生命', effect: '每级恢复+10%', maxLevel: 999, cost: 2, type: 'heal' },
  { id: 'light-blast', name: '光明爆破', description: '攻击有几率造成双倍伤害', effect: '每级双倍概率+2%', maxLevel: 50, cost: 4, type: 'critical' },
  { id: 'shadow-dodge', name: '影遁', description: '受到致命伤害时有几率闪避', effect: '每级闪避概率+2%', maxLevel: 50, cost: 5, type: 'defense' },
  { id: 'holy-shield', name: '圣盾术', description: '开局获得护盾', effect: '每级护盾+20', maxLevel: 999, cost: 3, type: 'defense' },
  { id: 'star-rain', name: '星陨', description: '攻击有几率触发范围伤害', effect: '每级触发概率+2%', maxLevel: 50, cost: 4, type: 'attack' },
  { id: 'fire-mastery', name: '火焰精通', description: '攻击附带灼烧效果', effect: '每级灼烧伤害+5', maxLevel: 999, cost: 3, type: 'attack' },
  { id: 'water-mastery', name: '流水精通', description: '提升治愈效果', effect: '每级治愈效果+10%', maxLevel: 999, cost: 3, type: 'heal' },
  { id: 'earth-mastery', name: '大地精通', description: '提升防御力上限', effect: '每级防御上限+10', maxLevel: 999, cost: 3, type: 'defense' },
  { id: 'wind-mastery', name: '风之精通', description: '提升攻击速度', effect: '每级攻速+5%', maxLevel: 50, cost: 4, type: 'attack' },
  { id: 'time-mastery', name: '时间精通', description: '有几率额外行动一次', effect: '每级额外行动概率+1%', maxLevel: 30, cost: 5, type: 'critical' },
  { id: 'space-mastery', name: '空间精通', description: '有几率使攻击失效', effect: '每级闪避概率+3%', maxLevel: 50, cost: 5, type: 'defense' },
  { id: 'life-mastery', name: '生命精通', description: '生命低于30%时获得增益', effect: '每级增益强度+10%', maxLevel: 50, cost: 4, type: 'heal' },
  { id: 'death-mastery', name: '死亡精通', description: '击败敌人后恢复生命', effect: '每级恢复生命+5%', maxLevel: 999, cost: 4, type: 'heal' },
  { id: 'dream-mastery', name: '梦境精通', description: '有几率使敌人陷入混乱', effect: '每级混乱概率+2%', maxLevel: 40, cost: 5, type: 'critical' },
  { id: 'harmony-mastery', name: '和谐精通', description: '所有属性得到均衡提升', effect: '每级全属性+2', maxLevel: 999, cost: 5, type: 'attack' },
];

// 称号系统 - 25种称号
export const titles: Title[] = [
  { id: 'beginner', name: '初出茅庐', icon: '🌟', unlockLevel: 1 },
  { id: 'learner', name: '小学者', icon: '📚', unlockLevel: 5 },
  { id: 'brave', name: '勇敢之心', icon: '💪', unlockLevel: 8 },
  { id: 'hero', name: '小英雄', icon: '🦸', unlockLevel: 12 },
  { id: 'master', name: '知识大师', icon: '🎓', unlockLevel: 18 },
  { id: 'guardian', name: '星光守护者', icon: '✨', unlockLevel: 25 },
  { id: 'champion', name: '勇者冠军', icon: '🏆', unlockLevel: 35 },
  { id: 'legend', name: '传奇英雄', icon: '👑', unlockLevel: 50 },
  { id: 'sage', name: '智慧贤者', icon: '📖', unlockLevel: 70 },
  { id: 'demigod', name: '半神之躯', icon: '👼', unlockLevel: 90 },
  { id: 'immortal', name: '不朽传说', icon: '🔥', unlockLevel: 120 },
  { id: 'cosmic', name: '宇宙行者', icon: '🌌', unlockLevel: 150 },
  { id: 'god', name: '神之化身', icon: '⚡', unlockLevel: 200 },
  { id: 'creator', name: '创世之主', icon: '🌍', unlockLevel: 300 },
  { id: 'infinity', name: '无限星女', icon: '💫', unlockLevel: 500 },
  { id: 'dreamer', name: '梦想家', icon: '💭', unlockLevel: 30 },
  { id: 'adventurer', name: '冒险家', icon: '🧭', unlockLevel: 40 },
  { id: 'wizard', name: '魔法师', icon: '🧙', unlockLevel: 60 },
  { id: 'knight', name: '骑士', icon: '⚔️', unlockLevel: 80 },
  { id: 'phoenix', name: '凤凰', icon: '🔥', unlockLevel: 100 },
  { id: 'dragon', name: '龙', icon: '🐉', unlockLevel: 140 },
  { id: 'universe', name: '宇宙', icon: '🌌', unlockLevel: 180 },
  { id: 'eternal', name: '永恒', icon: '♾️', unlockLevel: 250 },
  { id: 'omni', name: '全能', icon: '🌟', unlockLevel: 400 },
  { id: 'divine', name: '神圣', icon: '✨', unlockLevel: 600 },
];

// 敌人系统 - 支持无限关卡
export const enemies: Enemy[] = [
  { id: 'naughty-cat', name: '捣蛋小猫', description: '偷水果的调皮猫猫', icon: '🐱', health: 50, attack: 8, purifiedForm: '可爱小猫咪' },
  { id: 'doodle-monster', name: '涂鸦小妖', description: '在墙上乱画的小怪物', icon: '👾', health: 80, attack: 12, purifiedForm: '艺术小精灵' },
  { id: 'noise-bat', name: '噪音蝙蝠', description: '制造噪音打扰大家', icon: '🦇', health: 100, attack: 15, purifiedForm: '音乐小天使' },
  { id: 'trash-monster', name: '垃圾泥怪', description: '乱扔垃圾形成的泥团', icon: '🐗', health: 150, attack: 20, purifiedForm: '环保小卫士' },
  { id: 'sunglasses-fox', name: '墨镜狐狸', description: '狡猾但会认错的狐狸', icon: '🦊', health: 200, attack: 25, purifiedForm: '智慧狐狸' },
  { id: 'cloud-dragon', name: '乌云龙', description: '被误解而发脾气的龙', icon: '🐲', health: 300, attack: 30, purifiedForm: '彩虹龙' },
  { id: 'fire-wolf', name: '火焰狼', description: '被怒火控制的野狼', icon: '🐺', health: 400, attack: 35, purifiedForm: '温柔狼犬' },
  { id: 'dark-spider', name: '暗影蜘蛛', description: '织网困住路人的蜘蛛', icon: '🕷️', health: 500, attack: 40, purifiedForm: '织网小能手' },
  { id: 'ice-bear', name: '寒冰熊', description: '被寒冷冻僵的巨熊', icon: '🐻', health: 650, attack: 50, purifiedForm: '暖心大熊' },
  { id: 'thunder-eagle', name: '雷霆鹰', description: '被雷电惊扰的雄鹰', icon: '🦅', health: 800, attack: 60, purifiedForm: '天空守护者' },
  { id: 'poison-snake', name: '毒藤蛇', description: '被毒藤缠绕的蛇', icon: '🐍', health: 1000, attack: 70, purifiedForm: '花园守护者' },
  { id: 'stone-golem', name: '岩石巨人', description: '被魔法唤醒的岩石', icon: '🗿', health: 1300, attack: 85, purifiedForm: '山石守护者' },
];

// 获取当前关卡对应的敌人 - 支持无限关卡
export function getEnemyForLevel(levelId: number): Enemy {
  const baseIndex = (levelId - 1) % enemies.length;
  const cycle = Math.floor((levelId - 1) / enemies.length);
  const baseEnemy = enemies[baseIndex];
  
  // 每完成一轮，敌人属性提升
  const multiplier = 1 + cycle * 0.5;
  
  return {
    ...baseEnemy,
    health: Math.floor(baseEnemy.health * multiplier),
    attack: Math.floor(baseEnemy.attack * multiplier),
  };
}

// 生成关卡 - 支持无限关卡
export function generateLevel(levelId: number): Level {
  const enemy = getEnemyForLevel(levelId);
  const themes = ['星光镇广场', '星光图书馆', '星光公园', '星光大河畔', '暗影城堡外', '暗影城堡顶'];
  const themeIndex = (levelId - 1) % themes.length;
  const cycle = Math.floor((levelId - 1) / themes.length) + 1;
  
  return {
    id: levelId,
    name: cycle > 1 ? `${themes[themeIndex]} · 第${cycle}轮` : themes[themeIndex],
    description: themes[themeIndex],
    subLevels: [
      { id: 1, rooms: ['knowledge', 'knowledge', 'battle'], completed: false },
      { id: 2, rooms: ['knowledge', 'knowledge', 'battle'], completed: false },
      { id: 3, rooms: ['knowledge', 'knowledge', 'battle'], completed: false },
    ],
    enemy,
    theme: themes[themeIndex],
  };
}
