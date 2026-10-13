'use strict';
/* 邓小平爷爷植树 · 本课数据与本课互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：① 植树动作慢镜头（挖 → 挑选 → 移入 → 填 → 看看 → 扶正，只画树苗和铁锹，不画人物）；② 动作卡排一排；③ 词语小剧场；④ 种小树识字。 */

/* 二下课文只给生字注音：data-pyk="邓:dèng" → 按顺序给这些字注音，其余字上面空着（与课本一致） */
document.querySelectorAll('[data-pyk]').forEach((el) => {
  const want = el.dataset.pyk.trim().split(/\s+/).filter(Boolean).map((s) => s.split(':'));
  let k = 0;
  const syl = [...el.textContent].filter((ch) => /\p{Script=Han}/u.test(ch))
    .map((ch) => (k < want.length && ch === want[k][0] ? want[k++][1] : '_'));
  if (k < want.length) console.warn(`注音字没找到：${want[k][0]}（${el.textContent}）`); // eslint-disable-line no-console
  el.dataset.py = syl.join(' ');
});

/* ================= 植树动作慢镜头 ================= */
/* 一棵柏树苗（树根在原点，向上长），s 是大小 */
const cypress = (s, cls = '') => `<g class="${cls}" transform="scale(${s})">
  <path d="M0 0V-120" stroke="#7a5432" stroke-width="7"/>
  <path d="M0 -150L-26 -96H-10L-36 -54H-14L-44 -14H44L14 -54H36L10 -96H26Z" fill="#3f8f4e"/>
  <path d="M0 -150L-10 -96L-20 -54L-24 -14H0Z" fill="#5fae62"/></g>`;
const SHOVEL = `<g class="zs-shovel-in"><path d="M0 -150V-10" stroke="#9a6b3f" stroke-width="9" stroke-linecap="round"/>
  <path d="M-14 -160H14" stroke="#9a6b3f" stroke-width="9" stroke-linecap="round"/>
  <path d="M-22 -12H22L16 34Q0 48 -16 34Z" fill="#8b98a3" stroke="#5e6b75" stroke-width="3"/></g>`;
function buildPlant(svg) {
  svg.innerHTML = `
    <rect width="800" height="300" fill="#dff0fa"/><rect y="300" width="800" height="160" fill="#b98a5a"/>
    <path d="M0 300H800" stroke="#7cb85c" stroke-width="10"/>
    <g class="zs-hole"><path d="M330 300Q330 372 400 376Q470 372 470 300Z" fill="#6d4a2b"/></g>
    <g class="zs-pile"><path d="M500 300Q540 240 600 252Q650 262 660 300Z" fill="#a0703f"/></g>
    <g class="zs-fill"><path d="M330 300Q330 372 400 376Q470 372 470 300Z" fill="#a0703f"/><path d="M350 300Q400 284 450 300Z" fill="#a0703f"/></g>
    <g class="zs-picks">
      <g transform="translate(60 300)">${cypress(0.42)}</g>
      <g transform="translate(280 300) rotate(-18)">${cypress(0.7)}</g>
      <text class="zs-lb" x="60" y="345">太小</text><text class="zs-lb" x="285" y="345">弯了</text>
    </g>
    <g class="zs-tree"><g class="zs-tilt">${cypress(1)}<path class="zs-guide" d="M0 10V-190"/></g></g>
    <text class="zs-lb zs-good" x="170" y="345">茁壮</text>
    <circle class="zs-ring" cx="170" cy="230" r="96"/>
    <g class="zs-shovel">${SHOVEL}</g>
    <g class="zs-eye"><text x="700" y="120">👀</text><g class="zs-say"><rect x="560" y="140" width="220" height="62" rx="20"/><text x="670" y="182">不行，不行！</text></g></g>
    <text class="zs-ok" x="560" y="120">笔直！</text>`;
}
const zsSvg = document.getElementById('zsSvg');
if (zsSvg) buildPlant(zsSvg);

/* ================= 排一排：动作卡 ================= */
const ORDER = ['挖', '挑选', '移入', '填', '扶正'];
const SHUFFLED = ['填', '挖', '扶正', '移入', '挑选'];
function initOrder(box) {
  const reset = () => {
    box.innerHTML = `<div class="pp-slots">${ORDER.map((_, i) => `<span class="pp-slot">${i + 1}</span>`).join('<i>→</i>')}</div>
      <div class="pp-pool">${SHUFFLED.map((v) => `<button type="button" class="pp-card" data-v="${v}">${v}</button>`).join('')}</div>
      <p class="pp-msg">邓爷爷是怎样植树的？按课文的顺序点一点动作卡。</p>
      <div class="btns"><button type="button" class="btn" data-again>再排一次</button></div>`;
  };
  let next = 0;
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-again]')) { next = 0; reset(); return; }
    const card = e.target.closest('.pp-card:not(.used)');
    if (!card || next >= ORDER.length) return;
    const msg = box.querySelector('.pp-msg');
    if (card.dataset.v !== ORDER[next]) {
      card.classList.remove('wrong'); void card.offsetWidth; card.classList.add('wrong');
      msg.textContent = '再读读第 3 自然段，这一步是什么？';
      return;
    }
    card.classList.add('used');
    const slot = box.querySelectorAll('.pp-slot')[next];
    slot.textContent = card.dataset.v;
    slot.classList.add('done');
    next += 1;
    msg.textContent = next < ORDER.length ? '对了！下一步呢？' : '排好了！挖 → 挑选 → 移入 → 填 → 扶正。';
  });
  reset();
}
const ppBox = document.getElementById('ppBox');
if (ppBox) initOrder(ppBox);

/* ================= 词语小剧场：点一下播放 ================= */
document.querySelectorAll('.cy').forEach((c) => c.addEventListener('click', () => {
  c.classList.remove('play'); void c.offsetWidth; c.classList.add('play');
}));

/* ================= 种小树：看拼音选字 ================= */
const TREE_Q = [
  { q: 'dèng', ans: '邓', opts: ['邓', '对', '登'] },
  { q: 'wā', ans: '挖', opts: ['空', '挖', '控'] },
  { q: 'xuǎn', ans: '选', opts: ['先', '洗', '选'] },
  { q: 'yí', ans: '移', opts: ['移', '多', '侈'] },
  { q: 'huī', ans: '挥', opts: ['浑', '挥', '晖'] },
  { q: 'tián', ans: '填', opts: ['真', '镇', '填'] },
  { q: 'fú', ans: '扶', opts: ['扶', '夫', '肤'] },
  { q: 'zhuó', ans: '茁', opts: ['出', '茁', '拙'] },
];
function initTrees(box) {
  let i = 0;
  let busy = false;
  const grove = () => `<div class="sm-grove">${TREE_Q.map((_, k) => `<span class="${k < i ? 'grown' : ''}">🌲</span>`).join('')}</div>`;
  const show = () => {
    const it = TREE_Q[i];
    box.innerHTML = `<p class="sm-q hz-latin">${it.q}</p>
      <div class="sm-row">${it.opts.map((o) => `<button type="button" class="sm-sap" data-o="${o}"><span>${o}</span><i>🌱</i></button>`).join('')}</div>
      <p class="sm-msg"></p>${grove()}`;
    busy = false;
  };
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-again]')) { i = 0; show(); return; }
    const sap = e.target.closest('.sm-sap');
    if (!sap || busy) return;
    const msg = box.querySelector('.sm-msg');
    if (sap.dataset.o !== TREE_Q[i].ans) {
      sap.classList.remove('wrong'); void sap.offsetWidth; sap.classList.add('wrong');
      msg.textContent = '这棵树苗读音不对，再看看';
      return;
    }
    busy = true;
    sap.classList.add('right');
    box.querySelectorAll('.sm-grove span')[i].classList.add('grown', 'new');
    msg.textContent = `种活了！${TREE_Q[i].ans}（${TREE_Q[i].q}）`;
    setTimeout(() => {
      i += 1;
      if (i < TREE_Q.length) { show(); return; }
      box.innerHTML = `<p class="sm-q">种满一排小树啦！</p>${grove()}<button type="button" class="btn solid" data-again>再种一次</button>`;
    }, 1300);
  });
  show();
}
const smGame = document.getElementById('smGame');
if (smGame) initTrees(smGame);

Hanzi.init({
  cards: [
    { z: '邓', py: 'dèng', words: [['邓小平', 'dèng xiǎo píng']] },
    { z: '坛', py: 'tán', words: [['天坛', 'tiān tán'], ['花坛', 'huā tán']] },
    { z: '龄', py: 'líng', words: [['高龄', 'gāo líng'], ['年龄', 'nián líng']] },
    { z: '格', py: 'gé', words: [['格外', 'gé wài'], ['方格', 'fāng gé']] },
    { z: '致', py: 'zhì', words: [['兴致', 'xìng zhì'], ['一致', 'yí zhì']] },
    { z: '勃', py: 'bó', words: [['兴致勃勃', 'xìng zhì bó bó']] },
    { z: '挖', py: 'wā', words: [['挖树坑', 'wā shù kēng'], ['挖土', 'wā tǔ']] },
    { z: '选', py: 'xuǎn', words: [['挑选', 'tiāo xuǎn'], ['选择', 'xuǎn zé']] },
    { z: '茁', py: 'zhuó', words: [['茁壮', 'zhuó zhuàng']] },
    { z: '移', py: 'yí', words: [['移入', 'yí rù'], ['移动', 'yí dòng']] },
    { z: '挥', py: 'huī', words: [['挥锹', 'huī qiāo'], ['挥手', 'huī shǒu']] },
    { z: '填', py: 'tián', words: [['填土', 'tián tǔ'], ['填空', 'tián kòng']] },
    { z: '扶', py: 'fú', words: [['扶正', 'fú zhèng'], ['搀扶', 'chān fú']] },
  ],
  write: {
    a: [
      { z: '邓', py: 'dèng', bs: '阝', bh: 4 },
      { z: '植', py: 'zhí', bs: '木', bh: 12 },
      { z: '格', py: 'gé', bs: '木', bh: 10 },
      { z: '引', py: 'yǐn', bs: '弓', bh: 4 },
    ],
    b: [
      { z: '注', py: 'zhù', bs: '氵', bh: 8 },
      { z: '满', py: 'mǎn', bs: '氵', bh: 13 },
      { z: '休', py: 'xiū', bs: '亻', bh: 6 },
      { z: '息', py: 'xī', bs: '心', bh: 10 },
    ],
  },
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
