'use strict';
/* 玲玲的画 · 本课数据与互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：读课文时右上角“心情牌”跟着字幕变、心情曲线（得意—伤心—满意）、补画小花狗（污点变花斑，也可以自己画） */

Hanzi.init({
  cards: [
    { z: '玲', py: 'líng', bs: '王', bh: 9, words: [['玲玲', 'líng ling'], ['小玲', 'xiǎo líng']] },
    { z: '详', py: 'xiáng', bs: '讠', bh: 8, words: [['端详', 'duān xiang'], ['详细', 'xiáng xì']] },
    { z: '幅', py: 'fú', bs: '巾', bh: 12, words: [['这幅画', 'zhè fú huà'], ['一幅', 'yì fú']] },
    { z: '评', py: 'píng', bs: '讠', bh: 7, words: [['评奖', 'píng jiǎng'], ['评一评', 'píng yi píng']] },
    { z: '奖', py: 'jiǎng', bs: '大', bh: 9, words: [['评奖', 'píng jiǎng'], ['奖状', 'jiǎng zhuàng']] },
    { z: '催', py: 'cuī', bs: '亻', bh: 13, words: [['催她', 'cuī tā'], ['催促', 'cuī cù']] },
    { z: '脏', py: 'zāng', bs: '月', bh: 10, words: [['弄脏', 'nòng zāng'], ['脏衣服', 'zāng yī fu']] },
    { z: '伤', py: 'shāng', bs: '亻', bh: 6, words: [['伤心', 'shāng xīn'], ['受伤', 'shòu shāng']] },
    { z: '报', py: 'bào', bs: '扌', bh: 7, words: [['报纸', 'bào zhǐ'], ['画报', 'huà bào']] },
    { z: '另', py: 'lìng', bs: '口', bh: 5, words: [['另画', 'lìng huà'], ['另外', 'lìng wài']] },
    { z: '及', py: 'jí', bs: '丿', bh: 3, words: [['来不及', 'lái bù jí'], ['来得及', 'lái de jí']] },
    { z: '懒', py: 'lǎn', bs: '忄', bh: 16, words: [['懒洋洋', 'lǎn yáng yáng'], ['偷懒', 'tōu lǎn']] },
    { z: '并', py: 'bìng', bs: '丷', bh: 6, words: [['并不', 'bìng bù'], ['合并', 'hé bìng']] },
    { z: '糟', py: 'zāo', bs: '米', bh: 17, words: [['那么糟', 'nà me zāo'], ['糟糕', 'zāo gāo']] },
    { z: '肯', py: 'kěn', bs: '月', bh: 8, words: [['肯动脑筋', 'kěn dòng nǎo jīn'], ['不肯', 'bù kěn']] },
  ],
  pick: [
    { q: 'píng', ans: '评', opts: ['平', '评', '苹'] },
    { q: 'jiǎng', ans: '奖', opts: ['将', '浆', '奖'] },
    { q: 'zāng', ans: '脏', opts: ['脏', '庄', '桩'] },
    { q: 'cuī', ans: '催', opts: ['崔', '催', '摧'] },
    { q: 'lǎn', ans: '懒', opts: ['赖', '懒', '烂'] },
    { q: 'zāo', ans: '糟', opts: ['遭', '槽', '糟'] },
    { q: 'kěn', ans: '肯', opts: ['肯', '背', '骨'] },
    { q: 'fú', ans: '幅', opts: ['福', '幅', '副'] },
  ],
  write: [
    { z: '画', py: 'huà', bs: '凵', bh: 8 },
    { z: '幅', py: 'fú', bs: '巾', bh: 12 },
    { z: '评', py: 'píng', bs: '讠', bh: 7 },
    { z: '奖', py: 'jiǎng', bs: '大', bh: 9 },
    { z: '纸', py: 'zhǐ', bs: '纟', bh: 7 },
    { z: '报', py: 'bào', bs: '扌', bh: 7 },
    { z: '另', py: 'lìng', bs: '口', bh: 5 },
    { z: '及', py: 'jí', bs: '丿', bh: 3 },
    { z: '拿', py: 'ná', bs: '手', bh: 10 },
    { z: '并', py: 'bìng', bs: '丷', bh: 6 },
  ],
});

const STORY = {
  clues: [
    { q: '画画时，水彩笔把画弄脏了。', a: '在脏的地方添一只小花狗，画更好看了。' },
    { q: '衣服上不小心滴了一个墨点。', a: '妈妈在墨点上绣了一朵小花，衣服更漂亮了。' },
    { q: '下雨了，不能去公园玩。', a: '在家听雨声、读绘本，也很有意思。' },
    { q: '搭好的积木塔倒了。', a: '重新搭，这次把底座搭宽一点，搭得更高更稳。' },
  ],
  clueLabels: ['坏事', '动脑筋以后'],
};

/* ---------- 心情牌：跟着字幕变 ---------- */
const MOODS = {
  deyi: { t: '得意', py: 'dé yì', face: 'M34 62Q50 74 66 62', cls: 'up' },
  shangxin: { t: '伤心', py: 'shāng xīn', face: 'M34 70Q50 58 66 70', cls: 'down' },
  xiang: { t: '想一想', py: 'xiǎng yi xiǎng', face: 'M38 66H62', cls: 'mid' },
  manyi: { t: '满意', py: 'mǎn yì', face: 'M30 60Q50 80 70 60', cls: 'up' },
};
function moodHtml(key) {
  const m = MOODS[key];
  const tear = key === 'shangxin' ? '<path class="ll-tear" d="M36 52Q32 60 36 64Q40 60 36 52Z"/>' : '';
  return `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="44" class="ll-face ${m.cls}"/>
    <circle cx="36" cy="42" r="4.5"/><circle cx="64" cy="42" r="4.5"/>${tear}<path d="${m.face}" class="ll-mouth"/></svg>
    <span class="py">${Hanzi.ruby(m.t, m.py)}</span>`;
}
function updateMood(slide, step) {
  const box = slide.querySelector('.ll-mood');
  if (!box) return;
  let key = null;
  slide.querySelectorAll('.subs [data-mood][data-step]').forEach((p) => { if (+p.dataset.step <= step) key = p.dataset.mood; });
  if (!key) { box.classList.remove('show'); box.dataset.mood = ''; return; }
  box.classList.add('show');
  if (box.dataset.mood === key) return;
  box.dataset.mood = key;
  box.innerHTML = moodHtml(key);
}

/* ---------- 补画小花狗 ---------- */
function initPaint() {
  const canvas = document.getElementById('llCanvas');
  const tip = document.getElementById('llTip');
  const set = (mode, text) => {
    canvas.classList.remove('dog');
    void canvas.offsetWidth; // 重新触发描线动画
    if (mode) canvas.classList.add(mode);
    tip.textContent = text;
  };
  document.getElementById('llDraw').addEventListener('click', () => set('dog', '玲玲画了一只小花狗：眯着眼睛，懒洋洋地趴在楼梯上。紫色的污点变成了小狗身上的花斑！'));
  document.getElementById('llMine').addEventListener('click', () => set('', '在虚线框里画一画你的主意，说说为什么这样画。'));
}

window.LESSON = {
  init() {
    Narrative.init(STORY);
    initPaint();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateMood(slide, step);
  },
};
