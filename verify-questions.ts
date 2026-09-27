// 简单脚本验证数学题答案
import { allQuestions } from './src/data/questions';

console.log('正在验证数学题答案...\n');

const mathQuestions = allQuestions.filter(q => q.subject === 'math');
let errorCount = 0;

mathQuestions.forEach(q => {
  const question = q.question;
  let correctAnswer: number | null = null;
  let computedAnswer: number | null = null;
  
  // 解析题目并计算正确答案
  try {
    if (question.includes('×')) {
      const [a, b] = question.split('×').map(s => parseInt(s.trim().replace('=', '').replace('?', '')));
      computedAnswer = a * b;
    } else if (question.includes('÷')) {
      const [a, b] = question.split('÷').map(s => parseInt(s.trim().replace('=', '').replace('?', '')));
      computedAnswer = a / b;
    } else if (question.includes('+')) {
      const [a, b] = question.split('+').map(s => parseInt(s.trim().replace('=', '').replace('?', '')));
      computedAnswer = a + b;
    } else if (question.includes('-')) {
      const [a, b] = question.split('-').map(s => parseInt(s.trim().replace('=', '').replace('?', '')));
      computedAnswer = a - b;
    }
  } catch (e) {
    // 跳过无法解析的题
    return;
  }
  
  if (computedAnswer !== null) {
    // 找到选项中正确的答案
    const optionIndex = q.options.findIndex(opt => parseInt(opt) === computedAnswer);
    if (optionIndex === -1) {
      console.log(`❌ 题${q.id}: 选项中未找到正确答案 ${computedAnswer}`);
      console.log(`   题目: ${question}`);
      console.log(`   选项: ${q.options.join(', ')}`);
      errorCount++;
    } else if (q.correctAnswer !== optionIndex) {
      console.log(`❌ 题${q.id}: 正确答案索引错误`);
      console.log(`   题目: ${question}`);
      console.log(`   正确答案: ${computedAnswer} (索引${optionIndex})`);
      console.log(`   当前设置: 索引${q.correctAnswer} (${q.options[q.correctAnswer]})`);
      errorCount++;
    }
  }
});

console.log(`\n✅ 验证完成! 发现 ${errorCount} 个错误`);
