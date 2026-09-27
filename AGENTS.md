# AGENTS.md

## 项目概览

这是一个名为"星光小女侠"的寓教于乐小游戏，结合了知识答题和回合制卡片战斗元素。目标用户为小学生，通过答题获得力量，用战斗守护和平。

### 版本技术栈

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **Styling**: Tailwind CSS 4

## 目录结构

```
├── public/                 # 静态资源
├── scripts/                # 构建与启动脚本
├── src/
│   ├── app/                # 页面路由与布局
│   │   ├── page.tsx        # 首页
│   │   ├── levels/         # 关卡相关页面
│   │   │   ├── page.tsx    # 关卡选择
│   │   │   └── [levelId]/  # 关卡详情
│   │   │       ├── page.tsx
│   │   │       ├── knowledge/  # 知识答题页面
│   │   │       └── battle/     # 战斗页面
│   │   └── character/      # 角色成长页面
│   ├── components/ui/      # Shadcn UI 组件库
│   ├── hooks/              # 自定义 Hooks
│   │   └── useGameState.ts # 游戏状态管理
│   ├── lib/                # 工具库
│   ├── types/              # TypeScript 类型定义
│   │   └── game.ts         # 游戏类型
│   └── data/               # 游戏数据
│       ├── questions.ts    # 题库 (200+题目)
│       └── levels.ts       # 关卡和武器数据
├── DESIGN.md               # 设计规范文档
└── AGENTS.md               # 本文档
```

## 核心功能模块

### 1. 首页 (`src/app/page.tsx`)
- 开始新游戏
- 继续游戏（读取本地存储）
- 游戏介绍

### 2. 关卡选择 (`src/app/levels/page.tsx`)
- 显示玩家状态（等级、经验、生命值、武器）
- 展示6个大关，带解锁状态
- 关卡进度可视化

### 3. 关卡详情 (`src/app/levels/[levelId]/page.tsx`)
- 显示当前子关卡
- 知识房间入口
- 战斗房间入口
- BOSS 预告

### 4. 知识答题 (`src/app/levels/[levelId]/knowledge/page.tsx`)
- 随机抽取3道题目
- 4个科目：数学、图形、英语、语文
- 答案反馈和解释
- 经验奖励

### 5. 战斗系统 (`src/app/levels/[levelId]/battle/page.tsx`)
- 回合制卡片战斗
- 4种技能：攻击、护盾、暴击、治愈
- 敌人净化动画
- 胜利/失败处理

### 6. 角色成长 (`src/app/character/page.tsx`)
- 角色属性展示
- 技能树升级
- 武器收藏展示
- 技能点管理

## 游戏状态管理 (`src/hooks/useGameState.ts`)

### 核心状态
- `player`: 玩家信息（等级、经验、生命值、武器、技能等）
- `currentLevel`: 当前大关卡
- `currentSubLevel`: 当前子关卡
- `unlockedLevels`: 已解锁关卡
- `gameStarted`: 游戏是否开始

### 主要方法
- `startNewGame()`: 开始新游戏
- `continueGame()`: 继续游戏
- `selectLevel(levelId)`: 选择关卡
- `enterRoom(roomType)`: 进入房间
- `answerQuestionCorrect(expGain)`: 答题正确处理
- `completeSubLevel()`: 完成子关卡
- `upgradeSkill(skillId)`: 升级技能
- `healPlayer(amount)`: 恢复生命
- `takeDamage(amount)`: 受到伤害

## 题库数据 (`src/data/questions.ts`)

包含200+道题目，分为4个科目：
- 数学：32题（加减乘除、应用题、规律、图形计算）
- 图形：14题（形状识别、对称、旋转、七巧板）
- 英语：18题（单词、对话、语法、拼写）
- 语文：18题（拼音、诗词、成语、汉字）

难度分为1-3级，对应小学1-3年级。

## 关卡数据 (`src/data/levels.ts`)

### 6个大关
1. 星光镇广场 - 初露锋芒（BOSS：捣蛋小猫）
2. 星光图书馆 - 知识守护者（BOSS：涂鸦小妖）
3. 星光公园 - 自然小卫士（BOSS：噪音蝙蝠）
4. 星光大河畔 - 勇往直前（BOSS：垃圾泥怪）
5. 暗影城堡外 - 正义之心（BOSS：墨镜狐狸）
6. 暗影城堡顶 - 最终决战（BOSS：乌云龙）

每关包含3个子关卡，每个子关卡有2个知识房间+1个战斗房间。

### 武器系统
- 知识手环 (Lv.1)
- 星光手环 (Lv.3)
- 星光剑 (Lv.5)
- 彩虹弓 (Lv.7)
- 智慧法杖 (Lv.10)

## 设计规范 (DESIGN.md)

### 配色方案
- 主色：樱花粉 #FFB6C1
- 辅助色：天空蓝 #87CEEB、嫩芽绿 #98FB98、鹅黄 #FFFACD、薰衣草紫 #E6E6FA
- 背景色：米白色 #FFF8F0

### 动画
- float: 上下浮动
- sparkle: 闪烁
- bounce-soft: 轻微弹跳
- glow: 发光
- 星星粒子效果

### 字体
- 中文：Noto Sans SC
- 使用 Google Fonts .cn 域名

## 构建和测试命令

- `pnpm install`: 安装依赖
- `pnpm run dev`: 开发环境
- `pnpm run build`: 生产构建
- `pnpm run start`: 生产环境
- `pnpm lint`: 代码检查
- `pnpm ts-check`: TypeScript 检查

## 本地存储

游戏状态保存在 `localStorage` 中，键名为 `starlight-game-state`，包括：
- 玩家进度
- 已解锁关卡
- 角色等级和属性

## 注意事项

1. **Hydration 问题**：所有动态内容都使用 'use client' 并配合 useEffect + useState
2. **响应式设计**：适配各种屏幕尺寸
3. **无障碍**：无暴力画面，净化而非消灭敌人
4. **性能**：使用 Tailwind CSS 动画，避免重排重绘
5. **字体**：使用 fonts.googleapis.cn 避免跨境问题
