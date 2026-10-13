'use strict';
/* 植物妈妈有办法 · 本课数据与本课互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：每种植物一个“小实验”动画（吹一吹蒲公英 / 小鹿走过苍耳 / 晒一晒豌豆），连一连植物和办法，拓展卡分一分，点豆荚认生字。 */

const range = (n) => Array.from({ length: n }, (_, i) => i);

/* ================= 小实验（300 × 110） ================= */
const LABS = {
  pu: () => `<svg viewBox="0 0 300 110" class="zw-lab-svg" aria-hidden="true">
      <path class="stem" d="M46 106Q44 80 48 58"/><path class="leaf" d="M46 100Q24 90 20 76Q38 80 46 94Z"/>
      <circle class="ball" cx="48" cy="48" r="14"/>
      ${range(9).map((i) => `<g class="seed" style="--i:${i};--x:${150 + i * 14}px;--y:${-30 - (i % 3) * 14}px"><g transform="translate(48 48) rotate(${-80 + i * 20})"><path d="M0 0V-14"/><path d="M-6 -14Q0 -22 6 -14"/></g></g>`).join('')}
    </svg>`,
  cang: () => `<svg viewBox="0 0 300 110" class="zw-lab-svg" aria-hidden="true">
      <path class="ground" d="M0 100H300"/>
      <path class="stem" d="M70 100V50M70 70L54 58M70 62L88 50"/>
      ${[[54, 56], [88, 48], [70, 46], [62, 76]].map(([x, y], i) => `<g class="burr b${i}"><circle cx="${x}" cy="${y}" r="6"/><path d="M${x - 9} ${y}h18M${x} ${y - 9}v18M${x - 6} ${y - 6}l12 12M${x + 6} ${y - 6}l-12 12"/></g>`).join('')}
      <g class="walker"><text x="0" y="96" class="deer">🦌</text>${[0, 1, 2].map((i) => `<g class="ride r${i}"><circle cx="${18 + i * 9}" cy="${66 + (i % 2) * 6}" r="5"/></g>`).join('')}</g>
    </svg>`,
  wan: () => `<svg viewBox="0 0 300 110" class="zw-lab-svg" aria-hidden="true">
      <circle class="sunc" cx="262" cy="22" r="14"/>
      <path class="vine" d="M60 10Q120 30 150 40"/>
      <g class="pod"><path class="half top" d="M110 48Q150 22 190 48Q150 40 110 48Z"/><path class="half bot" d="M110 48Q150 74 190 48Q150 56 110 48Z"/></g>
      ${range(5).map((i) => `<circle class="pea" cx="${126 + i * 12}" cy="48" r="6" style="--i:${i};--x:${(i - 2) * 46}px;--y:${i % 2 ? 46 : 52}px"/>`).join('')}
      <text class="pa" x="150" y="24">啪！</text>
      <path class="ground" d="M0 104H300"/>
    </svg>`,
};
document.querySelectorAll('[data-lab]').forEach((box) => {
  const kind = box.dataset.lab;
  box.insertAdjacentHTML('afterbegin', LABS[kind]());
  const btn = box.querySelector('button');
  btn.addEventListener('click', () => {
    box.classList.remove('go');
    void box.offsetWidth;
    box.classList.add('go');
  });
});

/* ================= 课后第 2 题：连一连（点植物，再点它的办法） ================= */
const LINKS = [
  { a: '蒲公英', apy: 'pú gōng yīng', b: '降落伞，乘着风', bpy: 'jiàng luò sǎn chéng zhe fēng' },
  { a: '苍耳', apy: 'cāng ěr', b: '带刺的铠甲，挂住皮毛', bpy: 'dài cì de kǎi jiǎ guà zhù pí máo' },
  { a: '豌豆', apy: 'wān dòu', b: '豆荚炸开，蹦着跳着', bpy: 'dòu jiá zhà kāi bèng zhe tiào zhe' },
];
const B_ORDER = [1, 2, 0];
function initLink(box) {
  box.innerHTML = `<svg class="zw-lines" aria-hidden="true"></svg>
    <div class="zw-col">${LINKS.map((l, i) => `<button type="button" class="zw-a" data-i="${i}">${Hanzi.ruby(l.a, l.apy)}</button>`).join('')}</div>
    <div class="zw-col">${B_ORDER.map((i) => `<button type="button" class="zw-b" data-i="${i}">${Hanzi.ruby(LINKS[i].b, LINKS[i].bpy)}</button>`).join('')}</div>`;
  const svg = box.querySelector('svg');
  let sel = null;
  const draw = () => {
    const r0 = box.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${r0.width} ${r0.height}`);
    svg.innerHTML = [...box.querySelectorAll('.zw-a.done')].map((a) => {
      const b = box.querySelector(`.zw-b[data-i="${a.dataset.i}"]`);
      const ra = a.getBoundingClientRect();
      const rb = b.getBoundingClientRect();
      return `<line x1="${ra.right - r0.left}" y1="${ra.top + ra.height / 2 - r0.top}" x2="${rb.left - r0.left}" y2="${rb.top + rb.height / 2 - r0.top}"/>`;
    }).join('');
  };
  new ResizeObserver(draw).observe(box);
  box.addEventListener('click', (e) => {
    const a = e.target.closest('.zw-a:not(.done)');
    if (a) { sel = a; box.querySelectorAll('.zw-a').forEach((x) => x.classList.toggle('sel', x === sel)); return; }
    const b = e.target.closest('.zw-b:not(.done)');
    if (!b || !sel) return;
    if (b.dataset.i !== sel.dataset.i) { b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong'); return; }
    [sel, b].forEach((x) => x.classList.add('done'));
    sel.classList.remove('sel');
    sel = null;
    draw();
    box.classList.toggle('all-done', !box.querySelector('.zw-a:not(.done)'));
  });
}
initLink(document.getElementById('zwLink'));

/* ================= 识字游戏：点豆荚，啪！豆子蹦出来 ================= */
const PODS = [
  [['植', 'zhí'], ['如', 'rú']], [['为', 'wéi'], ['旅', 'lǚ']], [['备', 'bèi'], ['纷', 'fēn']], [['刺', 'cì'], ['底', 'dǐ']],
  [['啪', 'pā'], ['炸', 'zhà']], [['离', 'lí'], ['识', 'shí']], [['粗', 'cū'], ['得', 'dé']],
];
function initPods(box) {
  box.innerHTML = `<div class="zw-pods">${PODS.map((peas, i) => `<button type="button" class="zw-pod" data-i="${i}">
      <span class="shell l"></span><span class="shell r"></span>
      <span class="peas">${peas.map(([z, py]) => `<b>${Hanzi.ruby(z, py)}</b>`).join('')}</span></button>`).join('')}</div>
    <p class="zw-pod-msg">点一个豆荚，啪！读一读蹦出来的字。 <button type="button" class="btn" data-again>收起豆荚</button></p>`;
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-again]')) { box.querySelectorAll('.zw-pod').forEach((p) => p.classList.remove('open')); return; }
    const pod = e.target.closest('.zw-pod');
    if (pod) pod.classList.add('open');
  });
}
initPods(document.getElementById('zwPods'));

const KINDS = ['靠风', '靠动物', '靠弹', '靠水'];
const r = (t, py) => Hanzi.ruby(t, py);
const STORY = {
  kinds: KINDS,
  sort: [
    { s: r('柳絮白白的，轻轻的，像一团团棉花。', 'liǔ xù bái bái de qīng qīng de xiàng yì tuán tuán mián huā'), ok: ['靠风'], q: '乘着风飞走' },
    { s: r('椰子掉进大海，在水里漂呀漂。', 'yē zi diào jìn dà hǎi zài shuǐ lǐ piāo ya piāo'), ok: ['靠水'], q: '随着海水漂到远方' },
    { s: r('凤仙花的果实一碰就裂开。', 'fèng xiān huā de guǒ shí yí pèng jiù liè kāi'), ok: ['靠弹'], q: '种子被弹出去' },
    { s: r('松鼠把松子藏在地下，忘了吃。', 'sōng shǔ bǎ sōng zǐ cáng zài dì xià wàng le chī'), ok: ['靠动物'], q: '松子在土里发芽' },
    { s: r('鬼针草的种子长着小钩子。', 'guǐ zhēn cǎo de zhǒng zi zhǎng zhe xiǎo gōu zi'), ok: ['靠动物'], q: '钩住动物的皮毛' },
    { s: r('枫树的种子长着一对小翅膀。', 'fēng shù de zhǒng zi zhǎng zhe yí duì xiǎo chì bǎng'), ok: ['靠风'], q: '像小飞机一样被风吹走' },
  ],
};

Hanzi.init({
  cards: [
    { z: '植', py: 'zhí', words: [['植物', 'zhí wù'], ['种植', 'zhòng zhí']] },
    { z: '如', py: 'rú', words: [['如果', 'rú guǒ']] },
    { z: '为', py: 'wéi', words: [['四海为家', 'sì hǎi wéi jiā'], ['因为', 'yīn wèi']] },
    { z: '旅', py: 'lǚ', words: [['旅行', 'lǚ xíng'], ['旅游', 'lǚ yóu']] },
    { z: '备', py: 'bèi', words: [['准备', 'zhǔn bèi']] },
    { z: '纷', py: 'fēn', words: [['纷纷', 'fēn fēn']] },
    { z: '刺', py: 'cì', words: [['带刺', 'dài cì'], ['刺猬', 'cì wei']] },
    { z: '底', py: 'dǐ', words: [['底下', 'dǐ xià'], ['海底', 'hǎi dǐ']] },
    { z: '啪', py: 'pā', words: [['啪的一声', 'pā de yì shēng']] },
    { z: '炸', py: 'zhà', words: [['炸开', 'zhà kāi']] },
    { z: '离', py: 'lí', words: [['离开', 'lí kāi'], ['离家', 'lí jiā']] },
    { z: '识', py: 'shí', words: [['知识', 'zhī shi'], ['认识', 'rèn shi']] },
    { z: '粗', py: 'cū', words: [['粗心', 'cū xīn'], ['粗细', 'cū xì']] },
    { z: '得', py: 'dé', words: [['得不到', 'dé bú dào'], ['得到', 'dé dào']] },
  ],
  write: {
    a: [
      { z: '法', py: 'fǎ', bs: '氵', bh: 8 },
      { z: '如', py: 'rú', bs: '女', bh: 6 },
      { z: '公', py: 'gōng', bs: '八', bh: 4 },
      { z: '它', py: 'tā', bs: '宀', bh: 5 },
      { z: '娃', py: 'wá', bs: '女', bh: 9 },
    ],
    b: [
      { z: '她', py: 'tā', bs: '女', bh: 6 },
      { z: '毛', py: 'máo', bs: '毛', bh: 4 },
      { z: '更', py: 'gèng', bs: '一', bh: 7 },
      { z: '知', py: 'zhī', bs: '矢', bh: 8 },
      { z: '识', py: 'shí', bs: '讠', bh: 7 },
    ],
  },
});

window.LESSON = {
  init() { Narrative.init(STORY); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
