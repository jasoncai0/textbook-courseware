'use strict';
/* 雪地里的小画家 · 本课数据与本课互动。记叙文故事页见 ../shared/narrative.js，低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完） */

/* 四种脚印（100 × 100 简笔）：小鸡—竹叶，小狗—梅花，小鸭—枫叶，小马—月牙 */
const dot = (cx, cy, r) => `M${cx} ${cy - r}A${r} ${r} 0 1 0 ${cx} ${cy + r}A${r} ${r} 0 1 0 ${cx} ${cy - r}Z`;
const FOOT = {
  zhu: ['M50 78C40 60 28 40 22 20C34 36 46 56 50 78Z', 'M50 78C45 56 46 34 50 10C54 34 55 56 50 78Z', 'M50 78C60 60 72 40 78 20C66 36 54 56 50 78Z', 'M50 78C48 84 48 90 50 96C52 90 52 84 50 78Z'],
  mei: ['M50 52C66 52 74 66 70 78C66 90 34 90 30 78C26 66 34 52 50 52Z', dot(24, 46, 9), dot(40, 28, 9), dot(60, 28, 9), dot(76, 46, 9)],
  feng: ['M50 94L46 62L16 30L36 38L40 12L50 34L60 12L64 38L84 30L54 62Z'],
  ya: ['M16 28C16 74 84 74 84 28C72 50 28 50 16 28Z'],
};
const footSvg = (k) => `<svg class="xd-fp" viewBox="0 0 100 100" aria-hidden="true">${FOOT[k].map((d) => `<path d="${d}"/>`).join('')}</svg>`;

/* 课后第 2 题：这是谁画的？（行的顺序打乱，免得和按钮顺序一样） */
const CHOOSE = {
  foot: {
    opts: [['小鸡', 'xiǎo jī'], ['小狗', 'xiǎo gǒu'], ['小鸭', 'xiǎo yā'], ['小马', 'xiǎo mǎ']],
    items: [
      { k: 'mei', t: '梅花', py: 'méi huā', ok: ['小狗'], say: '小狗画梅花' },
      { k: 'ya', t: '月牙', py: 'yuè yá', ok: ['小马'], say: '小马画月牙' },
      { k: 'zhu', t: '竹叶', py: 'zhú yè', ok: ['小鸡'], say: '小鸡画竹叶' },
      { k: 'feng', t: '枫叶', py: 'fēng yè', ok: ['小鸭'], say: '小鸭画枫叶' },
    ].map((it) => ({ ...it, icon: footSvg(it.k) })),
  },
};
const CLUE_LABELS = ['想一想', '原来是这样'];
const CLUES = [
  { q: '青蛙为什么没参加？', a: '它在洞里<b>冬眠</b>呢：天冷了，青蛙钻进泥土里的洞，不吃也不动，一直睡到第二年春天。' },
  { q: '冬天还有谁也躲起来睡大觉？', a: '蛇、刺猬、熊、蝙蝠……它们也要冬眠。' },
];

/* ================= 选一选（一上第七、八单元各课相同） =================
 * 容器 <div class="ch" data-choose="key" data-noswipe>；数据 CHOOSE[key] = { opts: [['很大', 'hěn dà'], ...], items: [{ t, py, ok: ['很大'], say, icon }] }
 * 每行点一个选项：对了整行变绿、显示 say（不写 say 就显示“选项 + 词”）；错了抖一下。t / py 是这一行的字（可省），icon 是行首的小图（SVG 字符串，可省）。
 * 在 Hanzi.init 之前调用（生成的注音直接用 Hanzi.ruby）。 */
function initChoose(box, { opts, items }) {
  const r = Hanzi.ruby;
  box.innerHTML = `${items.map((it, i) => `<div class="ch-row" data-i="${i}">
      ${it.icon ? `<span class="ch-ic">${it.icon}</span>` : ''}${it.t ? `<span class="ch-t py">${r(it.t, it.py)}</span>` : ''}
      <span class="ch-btns">${opts.map(([o, p]) => `<button type="button" class="ch-o" data-o="${o}"><span class="py">${r(o, p)}</span></button>`).join('')}</span>
      <span class="ch-say"></span></div>`).join('')}
    <p class="ch-count">做对了 <b>0</b> / ${items.length}</p>`;
  box.addEventListener('click', (e) => {
    const btn = e.target.closest('.ch-o');
    const row = btn && btn.closest('.ch-row');
    if (!row || row.classList.contains('ok')) return;
    const it = items[+row.dataset.i];
    row.classList.remove('no');
    if (!it.ok.includes(btn.dataset.o)) {
      void row.offsetWidth; // 重新触发抖动动画
      row.classList.add('no');
      return;
    }
    row.classList.add('ok');
    btn.classList.add('solid');
    row.querySelector('.ch-say').textContent = it.say !== undefined ? it.say : `${btn.dataset.o}${it.t || ''}`; // 没写 say 就把选项和词连起来读
    const n = box.querySelectorAll('.ch-row.ok').length;
    box.querySelector('.ch-count b').textContent = n;
    box.classList.toggle('all-done', n === items.length);
    box.dispatchEvent(new CustomEvent('chosen', { detail: { i: +row.dataset.i, o: btn.dataset.o } }));
  });
}
/* 配对成功：这张卡片下面走出一串脚印 */
function addTrack(box) {
  const items = CHOOSE.foot.items;
  box.addEventListener('chosen', (e) => {
    const row = box.querySelectorAll('.ch-row')[e.detail.i];
    row.insertAdjacentHTML('beforeend', `<div class="xd-track">${Array.from({ length: 6 }, (_, j) => `<i style="--j:${j}">${footSvg(items[e.detail.i].k)}</i>`).join('')}</div>`);
  });
}
document.querySelectorAll('[data-choose]').forEach((box) => initChoose(box, CHOOSE[box.dataset.choose]));
addTrack(document.querySelector('[data-choose="foot"]'));

Hanzi.init({
  pick: {
    zhao: [
      { q: '睡着', py: 'shuì _', ans: 'zháo', opts: ['zháo', 'zhe'] },
      { q: '笑着', py: 'xiào _', ans: 'zhe', opts: ['zháo', 'zhe'] },
      { q: '睡不着', py: 'shuì bù _', ans: 'zháo', opts: ['zháo', 'zhe'] },
      { q: '盼着', py: 'pàn _', ans: 'zhe', opts: ['zháo', 'zhe'] },
    ],
  },
  cards: [
    { z: '群', py: 'qún', bs: '羊', bh: 13, words: [['一群', 'yì qún'], ['羊群', 'yáng qún']] },
    { z: '竹', py: 'zhú', bs: '竹', bh: 6, words: [['竹叶', 'zhú yè'], ['竹子', 'zhú zi']] },
    { z: '牙', py: 'yá', bs: '牙', bh: 4, words: [['月牙', 'yuè yá'], ['牙齿', 'yá chǐ']] },
    { z: '用', py: 'yòng', bs: '用', bh: 5, words: [['不用', 'bú yòng'], ['有用', 'yǒu yòng']] },
    { z: '几', py: 'jǐ', bs: '几', bh: 2, words: [['几步', 'jǐ bù'], ['几个', 'jǐ gè']] },
    { z: '步', py: 'bù', bs: '止', bh: 7, words: [['几步', 'jǐ bù'], ['跑步', 'pǎo bù']] },
    { z: '为', py: 'wèi', bs: '丶', bh: 4, words: [['为什么', 'wèi shén me']] },
    { z: '参', py: 'cān', bs: '厶', bh: 8, words: [['参加', 'cān jiā']] },
    { z: '加', py: 'jiā', bs: '力', bh: 5, words: [['参加', 'cān jiā'], ['加油', 'jiā yóu']] },
    { z: '洞', py: 'dòng', bs: '氵', bh: 9, words: [['洞里', 'dòng lǐ'], ['山洞', 'shān dòng']] },
    { z: '着', py: 'zháo', bs: '目', bh: 11, words: [['睡着', 'shuì zháo'], ['着急', 'zháo jí']] },
  ],
  shapes: {
    竹: ['M30 8V94', 'M30 30L12 52', 'M30 30L46 48', 'M70 8V94', 'M70 30L54 48', 'M70 30L88 52'],
    马: ['M30 10H64L74 22', 'M30 10V66', 'M30 26H52', 'M30 40H52', 'M30 66H72', 'M72 66C82 76 82 86 74 94', 'M30 66L24 92', 'M46 66L46 92'],
  },
  evolve: [
    { z: '竹', note: '像两根竹枝，上面垂着竹叶。小鸡的脚印就像竹叶。' },
    { z: '马', note: '像一匹竖着画的马：长长的脸、飘起的鬃毛、马腿和尾巴。' },
  ],
  apples: [['群', 'qún'], ['竹', 'zhú'], ['牙', 'yá'], ['用', 'yòng'], ['几', 'jǐ'], ['步', 'bù'], ['为', 'wèi'], ['参', 'cān'], ['加', 'jiā'], ['洞', 'dòng'], ['着', 'zháo']],
  write: [
    { z: '竹', py: 'zhú', bs: '竹', bh: 6 },
    { z: '牙', py: 'yá', bs: '牙', bh: 4 },
    { z: '马', py: 'mǎ', bs: '马', bh: 3 },
    { z: '用', py: 'yòng', bs: '用', bh: 5 },
    { z: '几', py: 'jǐ', bs: '几', bh: 2 },
  ],
});

window.LESSON = {
  init() { Narrative.init({ clues: CLUES, clueLabels: CLUE_LABELS }); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
