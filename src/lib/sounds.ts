// 星月小女侠 - 音效系统
// 使用 Web Audio API 合成儿童友好的柔和音效，无需外部素材文件
// 音量温和、音色圆润，支持开关记忆（localStorage）

let audioContext: AudioContext | null = null;
let enabled: boolean | null = null;

const SOUND_ENABLED_KEY = 'starlight-sound-enabled';

export function isSoundEnabled(): boolean {
  if (enabled === null) {
    if (typeof window === 'undefined') return true;
    try {
      const stored = localStorage.getItem(SOUND_ENABLED_KEY);
      enabled = stored !== 'false';
    } catch {
      enabled = true;
    }
  }
  return enabled;
}

export function setSoundEnabled(value: boolean): void {
  enabled = value;
  try {
    localStorage.setItem(SOUND_ENABLED_KEY, String(value));
  } catch {
    // localStorage 不可用时静默忽略
  }
}

export function toggleSound(): boolean {
  setSoundEnabled(!isSoundEnabled());
  return isSoundEnabled();
}

function getContext(): AudioContext | null {
  if (!isSoundEnabled()) return null;
  if (typeof window === 'undefined') return null;
  try {
    if (!audioContext) {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      if (!Ctx) return null;
      audioContext = new Ctx();
    }
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    return audioContext;
  } catch {
    return null;
  }
}

// 播放单个音符：freq 频率，start 延迟秒，dur 时长秒，type 波形，vol 音量
function tone(
  ctx: AudioContext,
  freq: number,
  start: number,
  dur: number,
  type: OscillatorType = 'sine',
  vol = 0.12
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t0 = ctx.currentTime + start;
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(vol, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

// 按钮点击：轻快短叮
export function playClick(): void {
  const ctx = getContext();
  if (!ctx) return;
  tone(ctx, 880, 0, 0.08, 'sine', 0.06);
}

// 答对：明亮上行琶音 C5-E5-G5
export function playCorrect(): void {
  const ctx = getContext();
  if (!ctx) return;
  tone(ctx, 523.25, 0, 0.12, 'sine', 0.1);
  tone(ctx, 659.25, 0.09, 0.12, 'sine', 0.1);
  tone(ctx, 783.99, 0.18, 0.22, 'sine', 0.12);
}

// 答错：柔和的降调双音（不刺耳）
export function playWrong(): void {
  const ctx = getContext();
  if (!ctx) return;
  tone(ctx, 330, 0, 0.18, 'sine', 0.09);
  tone(ctx, 262, 0.14, 0.28, 'sine', 0.09);
}

// 攻击：快速下扫音（嗖）
export function playAttack(): void {
  const ctx = getContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  const t0 = ctx.currentTime;
  osc.frequency.setValueAtTime(700, t0);
  osc.frequency.exponentialRampToValueAtTime(220, t0 + 0.18);
  gain.gain.setValueAtTime(0.1, t0);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.2);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + 0.25);
}

// 暴击：闪亮高频琶音
export function playCritical(): void {
  const ctx = getContext();
  if (!ctx) return;
  tone(ctx, 783.99, 0, 0.1, 'triangle', 0.1);
  tone(ctx, 987.77, 0.07, 0.1, 'triangle', 0.1);
  tone(ctx, 1318.51, 0.14, 0.25, 'triangle', 0.12);
}

// 治愈：温柔上行双音
export function playHeal(): void {
  const ctx = getContext();
  if (!ctx) return;
  tone(ctx, 392, 0, 0.15, 'sine', 0.1);
  tone(ctx, 587.33, 0.12, 0.3, 'sine', 0.1);
}

// 防御：低沉厚实的盾音
export function playDefense(): void {
  const ctx = getContext();
  if (!ctx) return;
  tone(ctx, 196, 0, 0.25, 'triangle', 0.12);
  tone(ctx, 261.63, 0.05, 0.2, 'sine', 0.08);
}

// 胜利：欢快小旋律 C-E-G-C6
export function playVictory(): void {
  const ctx = getContext();
  if (!ctx) return;
  tone(ctx, 523.25, 0, 0.15, 'sine', 0.11);
  tone(ctx, 659.25, 0.14, 0.15, 'sine', 0.11);
  tone(ctx, 783.99, 0.28, 0.15, 'sine', 0.11);
  tone(ctx, 1046.5, 0.42, 0.4, 'sine', 0.13);
}

// 失败安慰：温柔下滑（不吓人）
export function playDefeat(): void {
  const ctx = getContext();
  if (!ctx) return;
  tone(ctx, 392, 0, 0.25, 'sine', 0.09);
  tone(ctx, 311.13, 0.2, 0.35, 'sine', 0.09);
}

// 升级/解锁：号角感三连音
export function playLevelUp(): void {
  const ctx = getContext();
  if (!ctx) return;
  tone(ctx, 440, 0, 0.12, 'triangle', 0.1);
  tone(ctx, 554.37, 0.1, 0.12, 'triangle', 0.1);
  tone(ctx, 659.25, 0.2, 0.12, 'triangle', 0.1);
  tone(ctx, 880, 0.3, 0.45, 'triangle', 0.12);
}

// 连击：轻快小滑音
export function playCombo(comboCount: number): void {
  const ctx = getContext();
  if (!ctx) return;
  const base = 523.25 + Math.min(comboCount, 8) * 60;
  tone(ctx, base, 0, 0.08, 'sine', 0.08);
  tone(ctx, base * 1.25, 0.06, 0.12, 'sine', 0.08);
}
