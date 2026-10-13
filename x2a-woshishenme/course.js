'use strict';
/* 我是什么 · 本课数据与本课互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：① “变化舞台”——第 1、2 自然段边读边看水变成汽、云、雨、冰雹、雪；② 落下来 / 打下来 / 飘下来 三种下法的小动画；
 *           ③ 水的循环圈揭开谜底；④ 好事、坏事分一分。 */

const rand = (a, b) => a + Math.random() * (b - a);
const range = (n) => Array.from({ length: n }, (_, i) => i);
const CLOUD = 'M0 40a24 24 0 0 1 26-30a30 30 0 0 1 54-8a24 24 0 0 1 36 20a20 20 0 0 1-4 40H8a20 20 0 0 1-8-22Z';

/* 第 1 自然段：太阳一晒 → 汽 → 无数小点儿连成一片 → 云（白衣服 / 黑衣服 / 红袍） */
function sky1() {
  return `<svg viewBox="0 0 400 300" class="wsm-svg" aria-hidden="true">
    <rect width="400" height="300" class="sky"/>
    <path class="sea" d="M0 236Q50 226 100 236T200 236T300 236T400 236V300H0Z"/>
    <g class="sun"><circle cx="64" cy="58" r="24"/>${range(8).map((i) => `<path d="M64 58m${(Math.cos(i * Math.PI / 4) * 32).toFixed(1)} ${(Math.sin(i * Math.PI / 4) * 32).toFixed(1)}l${(Math.cos(i * Math.PI / 4) * 10).toFixed(1)} ${(Math.sin(i * Math.PI / 4) * 10).toFixed(1)}"/>`).join('')}</g>
    <g class="vapor" data-step="2">${[150, 190, 230, 270].map((x, i) => `<path style="--d:${i * 0.5}s" d="M${x} 228q-8-10 0-20t0-20q-8-10 0-20"/>`).join('')}</g>
    <g class="dots" data-step="3">${range(26).map(() => `<circle cx="${rand(200, 330).toFixed(0)}" cy="${rand(70, 130).toFixed(0)}" r="2.6"/>`).join('')}</g>
    <g class="cloudwrap" data-step="3"><g transform="translate(200 50) scale(1.15)"><path class="cloud" d="${CLOUD}"/></g></g>
    <g class="k-dark" data-step="5"></g><g class="k-red" data-step="6"></g>
    <g class="name" data-step="7"><circle cx="334" cy="40" r="22"/><text x="334" y="48" class="t-c">云</text></g>
  </svg>`;
}

/* 第 2 自然段：越升越高、体温越来越低 → 雨（落下来）/ 冰雹（打下来）/ 雪（飘下来） */
function sky2() {
  const rain = range(14).map((i) => `<line x1="${86 + (i % 7) * 13}" y1="${118 + (i > 6 ? 30 : 0)}" x2="${82 + (i % 7) * 13}" y2="${134 + (i > 6 ? 30 : 0)}" style="--d:${(i * 0.13).toFixed(2)}s"/>`).join('');
  const hail = range(6).map((i) => `<circle cx="${196 + i * 13}" cy="120" r="5" style="--d:${(i * 0.27).toFixed(2)}s"/>`).join('');
  const snow = range(7).map((i) => `<text x="${292 + (i % 4) * 22}" y="${120 + (i > 3 ? 40 : 0)}" style="--d:${(i * 0.5).toFixed(2)}s">❄</text>`).join('');
  return `<svg viewBox="0 0 400 300" class="wsm-svg" aria-hidden="true">
    <rect width="400" height="300" class="sky dim"/>
    <path class="ground" d="M0 258Q100 246 200 256T400 252V300H0Z"/>
    <g transform="translate(70 20) scale(2.7 1.05)"><path class="cloud gray" d="${CLOUD}"/></g>
    <g class="thermo"><rect x="18" y="40" width="16" height="150" rx="8"/><rect class="merc" x="22" y="60" width="8" height="126" rx="4"/><circle cx="26" cy="196" r="13"/></g>
    <g class="k-cold" data-step="1"></g>
    <g class="rain" data-step="2">${rain}<text x="124" y="236" class="t-c lbl">雨</text></g>
    <g class="hail" data-step="3">${hail}<text x="228" y="236" class="t-c lbl">冰雹</text></g>
    <g class="snow" data-step="4">${snow}<text x="330" y="236" class="t-c lbl">雪</text></g>
  </svg>`;
}

/* 课后第 2 题：三种“下来”的小动画 */
function drop(kind) {
  const n = 9;
  const items = range(n).map((i) => {
    const x = 14 + (i % 5) * 18 + (i > 4 ? 9 : 0);
    const d = (i * 0.31).toFixed(2);
    if (kind === 'luo') return `<line x1="${x}" y1="0" x2="${x - 2}" y2="12" style="--d:${d}s"/>`;
    if (kind === 'da') return `<circle cx="${x}" cy="4" r="4.5" style="--d:${d}s"/>`;
    return `<text x="${x}" y="10" style="--d:${(i * 0.6).toFixed(2)}s">❄</text>`;
  }).join('');
  return `<svg viewBox="0 0 110 100" class="wsm-drop ${kind}" aria-hidden="true"><rect width="110" height="100" rx="8" class="bg"/>${items}<path class="floor" d="M0 92H110"/></svg>`;
}

document.querySelectorAll('[data-sky]').forEach((el) => { el.innerHTML = el.dataset.sky === '1' ? sky1() : sky2(); });
document.querySelectorAll('[data-drop]').forEach((el) => { el.innerHTML = drop(el.dataset.drop); });

/* ================= 好事、坏事分一分：拖到筐里，或先点卡片再点筐 ================= */
const DEEDS = [
  { t: '灌溉田地', py: 'guàn gài tián dì', k: 'good' },
  { t: '淹没庄稼', py: 'yān mò zhuāng jia', k: 'bad' },
  { t: '发动机器', py: 'fā dòng jī qì', k: 'good' },
  { t: '冲毁房屋', py: 'chōng huǐ fáng wū', k: 'bad' },
  { t: '帮助人们工作', py: 'bāng zhù rén men gōng zuò', k: 'good' },
  { t: '给人们带来灾害', py: 'gěi rén men dài lái zāi hài', k: 'bad' },
];
function initDeeds(box) {
  box.innerHTML = `<div class="wsm-pool">${DEEDS.map((d, i) => `<button type="button" class="wsm-deed" data-i="${i}">${Hanzi.ruby(d.t, d.py)}</button>`).join('')}</div>
    <div class="wsm-bins"><div class="wsm-bin good" data-k="good"><h3>😊 好事</h3><div class="in"></div></div><div class="wsm-bin bad" data-k="bad"><h3>😠 坏事</h3><div class="in"></div></div></div>
    <p class="wsm-msg">水做了哪些好事，哪些坏事？拖到筐里，或者先点卡片再点筐。</p>`;
  const msg = box.querySelector('.wsm-msg');
  let sel = null;
  let drag = null;
  const shake = (el) => { el.classList.remove('wrong'); void el.offsetWidth; el.classList.add('wrong'); };
  const place = (card, bin) => {
    if (!bin) return;
    const d = DEEDS[+card.dataset.i];
    if (bin.dataset.k !== d.k) { shake(card); msg.textContent = '再想想：这件事对人们有好处吗？'; return; }
    bin.querySelector('.in').appendChild(card);
    card.classList.add('done');
    card.classList.remove('sel');
    const left = box.querySelectorAll('.wsm-pool .wsm-deed').length;
    msg.textContent = left ? '对了！' : '分好了！水的脾气有时温和，有时暴躁。';
    box.classList.toggle('all-done', !left);
  };
  box.addEventListener('pointerdown', (e) => {
    const card = e.target.closest('.wsm-deed:not(.done)');
    if (!card) return;
    card.setPointerCapture(e.pointerId);
    drag = { card, x: e.clientX, y: e.clientY, moved: false };
  });
  box.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    if (Math.hypot(dx, dy) > 6) drag.moved = true;
    if (drag.moved) { drag.card.classList.add('dragging'); drag.card.style.translate = `${dx}px ${dy}px`; }
  });
  box.addEventListener('pointerup', (e) => {
    if (!drag) return;
    const { card, moved } = drag;
    drag = null;
    card.classList.remove('dragging');
    card.style.translate = '';
    if (moved) { place(card, document.elementsFromPoint(e.clientX, e.clientY).map((el) => el.closest('.wsm-bin')).find(Boolean)); return; }
    sel = sel === card ? null : card;
    box.querySelectorAll('.wsm-deed').forEach((c) => c.classList.toggle('sel', c === sel));
  });
  box.addEventListener('click', (e) => {
    const bin = e.target.closest('.wsm-bin');
    if (!bin || !sel) return;
    place(sel, bin);
    sel = null;
  });
}
initDeeds(document.getElementById('deeds'));

Hanzi.init({
  cards: [
    { z: '晒', py: 'shài', words: [['晒太阳', 'shài tài yáng'], ['晒衣服', 'shài yī fu']] },
    { z: '极', py: 'jí', words: [['极小', 'jí xiǎo'], ['好极了', 'hǎo jí le']] },
    { z: '傍', py: 'bàng', words: [['傍晚', 'bàng wǎn']] },
    { z: '越', py: 'yuè', words: [['越升越高', 'yuè shēng yuè gāo'], ['越来越低', 'yuè lái yuè dī']] },
    { z: '滴', py: 'dī', words: [['水滴', 'shuǐ dī'], ['雨滴', 'yǔ dī']] },
    { z: '溪', py: 'xī', words: [['小溪', 'xiǎo xī'], ['溪水', 'xī shuǐ']] },
    { z: '奔', py: 'bēn', words: [['奔跑', 'bēn pǎo'], ['奔流', 'bēn liú']] },
    { z: '洋', py: 'yáng', words: [['海洋', 'hǎi yáng'], ['洋娃娃', 'yáng wá wa']] },
    { z: '坏', py: 'huài', words: [['坏事', 'huài shì'], ['好坏', 'hǎo huài']] },
    { z: '淹', py: 'yān', words: [['淹没', 'yān mò']] },
    { z: '没', py: 'mò', words: [['淹没', 'yān mò'], ['没有', 'méi yǒu']] },
    { z: '冲', py: 'chōng', words: [['冲毁', 'chōng huǐ'], ['冲出', 'chōng chū']] },
    { z: '毁', py: 'huǐ', words: [['冲毁', 'chōng huǐ'], ['毁坏', 'huǐ huài']] },
    { z: '屋', py: 'wū', words: [['房屋', 'fáng wū'], ['屋子', 'wū zi']] },
    { z: '灾', py: 'zāi', words: [['灾害', 'zāi hài'], ['火灾', 'huǒ zāi']] },
    { z: '猜', py: 'cāi', words: [['猜猜', 'cāi cai'], ['猜谜语', 'cāi mí yǔ']] },
  ],
  match: { bg: 'assets/liuchuan.jpg', items: [
    { z: '池', x: 13, y: 62, hint: 'chí' },
    { z: '溪', x: 36, y: 68, hint: 'xī' },
    { z: '河', x: 62, y: 62, hint: 'hé' },
    { z: '洋', x: 87, y: 58, hint: 'yáng' },
  ] },
  write: {
    a: [
      { z: '变', py: 'biàn', bs: '又', bh: 8 },
      { z: '极', py: 'jí', bs: '木', bh: 7 },
      { z: '片', py: 'piàn', bs: '片', bh: 4 },
      { z: '傍', py: 'bàng', bs: '亻', bh: 12 },
      { z: '海', py: 'hǎi', bs: '氵', bh: 10 },
    ],
    b: [
      { z: '洋', py: 'yáng', bs: '氵', bh: 9 },
      { z: '作', py: 'zuò', bs: '亻', bh: 7 },
      { z: '坏', py: 'huài', bs: '土', bh: 7 },
      { z: '给', py: 'gěi', bs: '纟', bh: 9 },
      { z: '带', py: 'dài', bs: '巾', bh: 9 },
    ],
  },
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
