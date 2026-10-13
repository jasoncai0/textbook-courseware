'use strict';
/* 一封信 · 本课数据与互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：信封封面、把两封信“摊”在信纸上读（第一封揉成一团）、两封信对比、帮露西改一句、“寄信”识字游戏 */

Hanzi.init({
  cards: [
    { z: '封', py: 'fēng', bs: '寸', bh: 9, words: [['一封信', 'yì fēng xìn'], ['信封', 'xìn fēng']] },
    { z: '削', py: 'xiāo', bs: '刂', bh: 9, words: [['削好', 'xiāo hǎo'], ['削土豆', 'xiāo tǔ dòu']] },
    { z: '锅', py: 'guō', bs: '钅', bh: 12, words: [['锅里', 'guō lǐ'], ['饭锅', 'fàn guō']] },
    { z: '朝', py: 'cháo', bs: '月', bh: 12, words: [['朝窗外', 'cháo chuāng wài'], ['朝南', 'cháo nán']] },
    { z: '始', py: 'shǐ', bs: '女', bh: 8, words: [['开始', 'kāi shǐ'], ['始终', 'shǐ zhōng']] },
    { z: '刮', py: 'guā', bs: '刂', bh: 8, words: [['刮胡子', 'guā hú zi'], ['刮风', 'guā fēng']] },
    { z: '胡', py: 'hú', bs: '月', bh: 9, words: [['胡子', 'hú zi'], ['胡萝卜', 'hú luó bo']] },
    { z: '修', py: 'xiū', bs: '亻', bh: 9, words: [['修台灯', 'xiū tái dēng'], ['修好', 'xiū hǎo']] },
    { z: '冷', py: 'lěng', bs: '冫', bh: 7, words: [['冷清', 'lěng qīng'], ['寒冷', 'hán lěng']] },
    { z: '肩', py: 'jiān', bs: '户', bh: 8, words: [['肩膀', 'jiān bǎng'], ['并肩', 'bìng jiān']] },
    { z: '团', py: 'tuán', bs: '囗', bh: 6, words: [['一团', 'yì tuán'], ['团结', 'tuán jié']] },
    { z: '重', py: 'chóng', bs: '里', bh: 9, words: [['重新', 'chóng xīn'], ['重写', 'chóng xiě']] },
    { z: '完', py: 'wán', bs: '宀', bh: 7, words: [['写完', 'xiě wán'], ['完成', 'wán chéng']] },
    { z: '希', py: 'xī', bs: '巾', bh: 7, words: [['希比希', 'xī bǐ xī'], ['希望', 'xī wàng']] },
    { z: '期', py: 'qī', bs: '月', bh: 12, words: [['星期天', 'xīng qī tiān'], ['日期', 'rì qī']] },
    { z: '结', py: 'jié', bs: '纟', bh: 9, words: [['结尾', 'jié wěi'], ['结果', 'jié guǒ']] },
    { z: '束', py: 'shù', bs: '木', bh: 7, words: [['一大束', 'yí dà shù'], ['花束', 'huā shù']] },
    { z: '鲜', py: 'xiān', bs: '鱼', bh: 14, words: [['鲜花', 'xiān huā'], ['新鲜', 'xīn xiān']] },
  ],
  write: [
    { z: '封', py: 'fēng', bs: '寸', bh: 9 },
    { z: '信', py: 'xìn', bs: '亻', bh: 9 },
    { z: '今', py: 'jīn', bs: '人', bh: 4 },
    { z: '支', py: 'zhī', bs: '十', bh: 4 },
    { z: '圆', py: 'yuán', bs: '囗', bh: 10 },
    { z: '珠', py: 'zhū', bs: '王', bh: 10 },
    { z: '笔', py: 'bǐ', bs: '⺮', bh: 10 },
    { z: '灯', py: 'dēng', bs: '火', bh: 6 },
    { z: '电', py: 'diàn', bs: '田', bh: 5 },
    { z: '影', py: 'yǐng', bs: '彡', bh: 15 },
  ],
});

const STORY = {
  picks: {
    like: [
      { t: '第二封：爸爸读了会放心', ok: true, why: '对！不让爸爸担心' },
      { t: '第二封：写了家里开心的事', ok: true, why: '希比希又蹦又跳、要去看电影' },
      { t: '第二封：还想办法自己修台灯', ok: true, why: '遇到难事想办法' },
      { t: '第一封：说的是心里话', ok: true, why: '说真话也很好——怎样说，爸爸不太担心？' },
      { t: '第一封：家里很冷清', ok: false, why: '爸爸读了会难过' },
    ],
  },
};

/* ---------- 帮露西改一句 ---------- */
const FIX = [
  { s: ['你不在，我们很不开心。', 'nǐ bú zài wǒ men hěn bù kāi xīn'], e: ['我们过得挺好，就是很想你。', 'wǒ men guò de tǐng hǎo jiù shì hěn xiǎng nǐ'] },
  { s: ['家里的台灯坏了，我们修不好。', 'jiā lǐ de tái dēng huài le wǒ men xiū bù hǎo'], e: ['请告诉我们螺丝刀放在哪儿，我们自己修台灯。', 'qǐng gào su wǒ men luó sī dāo fàng zài nǎr _ wǒ men zì jǐ xiū tái dēng'] },
  { s: ['从早到晚，家里总是很冷清。', 'cóng zǎo dào wǎn jiā lǐ zǒng shì hěn lěng qīng'], e: ['希比希天天陪着我们，家里可热闹了。', 'xī bǐ xī tiān tiān péi zhe wǒ men jiā lǐ kě rè nao le'] },
];
function initFix() {
  const $ = (id) => document.getElementById(id);
  let cur = 0;
  $('yfSad').innerHTML = FIX.map((f, i) => `<button type="button" class="yf-chip py" data-i="${i}">${Hanzi.ruby(...f.s)}</button>`).join('');
  const show = (i) => {
    cur = i;
    $('yfSad').querySelectorAll('.yf-chip').forEach((b) => b.classList.toggle('on', +b.dataset.i === i));
    $('yfFrom').innerHTML = Hanzi.ruby(...FIX[i].s);
    $('yfExText').innerHTML = `示例：${Hanzi.ruby(...FIX[i].e)}`;
    $('yfExText').hidden = true;
    $('yfText').value = '';
  };
  $('yfSad').addEventListener('click', (e) => {
    const b = e.target.closest('.yf-chip');
    if (b) show(+b.dataset.i);
  });
  $('yfEx').addEventListener('click', () => { $('yfExText').hidden = false; });
  show(cur);
}

/* ---------- 识字游戏：寄信 ---------- */
const LETTERS = [['封', 'fēng'], ['削', 'xiāo'], ['锅', 'guō'], ['朝', 'cháo'], ['始', 'shǐ'], ['刮', 'guā'], ['胡', 'hú'], ['修', 'xiū'], ['冷', 'lěng'],
  ['肩', 'jiān'], ['团', 'tuán'], ['重', 'chóng'], ['完', 'wán'], ['希', 'xī'], ['期', 'qī'], ['结', 'jié'], ['束', 'shù'], ['鲜', 'xiān']];
function initPost() {
  const envs = document.getElementById('yfEnvs');
  const n = document.getElementById('yfN');
  const done = document.getElementById('yfDone');
  envs.innerHTML = LETTERS.map(([z, p], i) => `<button type="button" class="yf-e" data-i="${i}"><span class="py">${Hanzi.ruby(z, p)}</span></button>`).join('');
  const update = () => {
    const k = envs.querySelectorAll('.yf-e.sent').length;
    n.textContent = k;
    done.classList.toggle('show', k === LETTERS.length);
  };
  envs.addEventListener('click', (e) => {
    const b = e.target.closest('.yf-e:not(.sent)');
    if (!b) return;
    b.classList.add('sent');
    update();
  });
  document.getElementById('yfReset').addEventListener('click', () => {
    envs.querySelectorAll('.yf-e').forEach((b) => b.classList.remove('sent'));
    update();
  });
  update();
}

window.LESSON = {
  init() {
    Narrative.init(STORY);
    initFix();
    initPost();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
