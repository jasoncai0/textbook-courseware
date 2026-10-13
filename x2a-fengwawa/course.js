'use strict';
/* 风娃娃 · 本课数据与本课互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用）
 * 本课独有：① 风车转、帆船跑：跟着课文，风娃娃一吹，风车由慢变快、帆鼓起来船跑快（字幕行上 data-set / data-unset），可点“吹一口气”；
 *           ② 帮了忙 / 帮倒忙 举手表决；③ 风力滑块读风的词语；④ 吹风车转盘识字。 */
const SVGNS = 'http://www.w3.org/2000/svg';
const BLOW_MS = 3000;

/* 风娃娃（半透明小云朵，鼓着腮帮子） */
const BABY = `<symbol id="fwBaby" viewBox="0 0 200 130">
  <path d="M30 110Q0 110 4 84Q8 62 34 62Q34 28 70 26Q92 0 124 18Q160 10 166 46Q198 50 196 82Q194 112 160 110Z" fill="#eef7ff" stroke="#9ccbe8" stroke-width="4"/>
  <circle cx="80" cy="66" r="8" fill="#2a4a66"/><circle cx="122" cy="66" r="8" fill="#2a4a66"/><circle cx="83" cy="63" r="2.5" fill="#fff"/><circle cx="125" cy="63" r="2.5" fill="#fff"/>
  <circle cx="62" cy="86" r="13" fill="#ffd0d0"/><circle cx="140" cy="86" r="13" fill="#ffd0d0"/>
  <ellipse cx="101" cy="90" rx="7" ry="6" fill="#2a4a66"/></symbol>`;
document.body.insertAdjacentHTML('afterbegin', `<svg width="0" height="0" style="position:absolute" aria-hidden="true">${BABY}</svg>`);

const svgEl = (tag, attrs) => {
  const el = document.createElementNS(SVGNS, tag);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
};
/* 秧苗：一行行小苗 */
document.querySelectorAll('.fw-seed').forEach((g) => {
  for (let r = 0; r < 4; r += 1) {
    for (let c = 0; c < 9; c += 1) {
      const x = 580 + c * 66 + r * 10; const y = 520 + r * 46;
      g.append(svgEl('path', { class: 'fw-sprout', d: `M${x} ${y}q-12 -26 -22 -30M${x} ${y}q4 -30 0 -40M${x} ${y}q12 -26 22 -30`, style: `--d:${((r + c) % 5) * 0.12}s` }));
    }
  }
});
/* 船工：岸上三个人，弯着腰拉纤 */
document.querySelectorAll('.fw-men').forEach((g) => {
  [880, 990, 1100].forEach((x, i) => {
    const m = svgEl('g', { class: 'fw-man', transform: `translate(${x} 336) scale(1.4)`, style: `--d:${i * 0.15}s` });
    m.innerHTML = `<g class="fw-body"><path d="M0 0L-6 -50M0 0L12 -2" stroke="#3a3a3a" stroke-width="8" stroke-linecap="round"/><path d="M-6 -50L-30 -90" stroke="#3f6fb0" stroke-width="18" stroke-linecap="round"/><circle cx="-36" cy="-108" r="16" fill="#f2c9a0"/><path d="M-26 -84L-50 -70" stroke="#f2c9a0" stroke-width="7" stroke-linecap="round"/><text class="fw-sweat" x="-14" y="-118">💧</text></g>`;
    g.append(m);
  });
});

/* 场景状态：data-init + 已出现字幕行的 data-set / data-unset；“吹一口气”按钮临时加上 puff + fast */
const words = (s) => (s || '').split(/\s+/).filter(Boolean);
const STATES = ['kid', 'puff', 'fast', 'nod', 'heave', 'thanks'];
function applyScene(slide, step) {
  const sc = slide.querySelector('.fw-scene');
  if (!sc) return;
  const on = new Set(words(sc.dataset.init));
  [...slide.querySelectorAll('[data-step][data-set], [data-step][data-unset]')]
    .filter((e) => +e.dataset.step <= step)
    .sort((a, b) => a.dataset.step - b.dataset.step)
    .forEach((e) => { words(e.dataset.set).forEach((k) => on.add(k)); words(e.dataset.unset).forEach((k) => on.delete(k)); });
  STATES.forEach((k) => sc.classList.toggle(`s-${k}`, on.has(k)));
}
document.querySelectorAll('.fw-scene').forEach((sc) => {
  sc.querySelector('[data-blow]').addEventListener('click', () => {
    sc.classList.add('blowing');
    clearTimeout(sc.timer);
    sc.timer = setTimeout(() => sc.classList.remove('blowing'), BLOW_MS);
  });
});
document.querySelectorAll('.slide').forEach((s) => applyScene(s, 0));

/* ================= 帮了忙 / 帮倒忙 ================= */
const JUDGE = [
  { e: '🌾', t: '吹风车，抽上来的水流进秧田', good: true },
  { e: '⛵', t: '吹船帆，船飞快地跑起来', good: true },
  { e: '🪁', t: '吹风筝，风筝吹得无影无踪', good: false },
  { e: '👕', t: '吹跑了人们晾晒的衣服', good: false },
  { e: '🌱', t: '折断了路边新栽的小树', good: false },
  { e: '🧺', t: '轻轻吹，把晾着的衣服吹干', good: true },
  { e: '🍎', t: '把果园里没熟的苹果吹落了', good: false },
  { e: '😌', t: '夏天给人们送来凉快', good: true },
];
function initJudge(box) {
  if (!box) return;
  box.innerHTML = `<div class="fj-pile good"><b>👍 帮了忙</b><div class="fj-in"></div></div>
    <div class="fj-mid"><div class="fj-card"></div><div class="fj-btns"><button type="button" class="btn fj-yes" data-v="1">👍 帮了忙</button><button type="button" class="btn fj-no" data-v="0">👎 帮倒忙</button></div><p class="fj-msg"></p><button type="button" class="btn" data-again>再来一次</button></div>
    <div class="fj-pile bad"><b>👎 帮倒忙</b><div class="fj-in"></div></div>`;
  const card = box.querySelector('.fj-card');
  const msg = box.querySelector('.fj-msg');
  let k = 0;
  const show = () => {
    if (k >= JUDGE.length) { card.innerHTML = '<span class="fj-e">👩‍👧</span><span class="fj-t">妈妈说：还要看是不是真的对别人有用。</span>'; box.classList.add('all-done'); return; }
    const d = JUDGE[k];
    card.innerHTML = `<span class="fj-e">${d.e}</span><span class="fj-t">${d.t}</span><small>${k < 5 ? '课文里' : '生活中'}</small>`;
    card.classList.remove('pop'); void card.offsetWidth; card.classList.add('pop');
  };
  const reset = () => { k = 0; box.classList.remove('all-done'); box.querySelectorAll('.fj-in').forEach((p) => { p.innerHTML = ''; }); msg.textContent = '这件事是帮了忙，还是帮倒忙？'; show(); };
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-again]')) { reset(); return; }
    const b = e.target.closest('[data-v]');
    if (!b || k >= JUDGE.length) return;
    const d = JUDGE[k];
    if ((b.dataset.v === '1') !== d.good) {
      card.classList.remove('wrong'); void card.offsetWidth; card.classList.add('wrong');
      msg.textContent = '再想想：这样做，对别人真的有用吗？'; return;
    }
    box.querySelector(`.fj-pile.${d.good ? 'good' : 'bad'} .fj-in`).insertAdjacentHTML('beforeend', `<span>${d.e} ${d.t}</span>`);
    msg.textContent = d.good ? '对，这真的帮到了别人！' : '对，好心办了坏事——帮倒忙。';
    k += 1; show();
  });
  reset();
}
initJudge(document.getElementById('fwJudge'));

/* ================= 风力滑块 ================= */
function initForce() {
  const range = document.getElementById('fwRange');
  if (!range) return;
  const box = document.getElementById('fwForce');
  const sets = document.querySelectorAll('#fwWords .fw-wset');
  const update = () => {
    box.dataset.lv = range.value;
    sets.forEach((s) => s.classList.toggle('on', s.dataset.lv === range.value));
  };
  range.addEventListener('input', update);
  update();
}
initForce();

/* ================= 吹风车转盘 ================= */
const WHEEL = [['帮', 'bāng'], ['助', 'zhù'], ['抽', 'chōu'], ['续', 'xù'], ['使', 'shǐ'], ['劲', 'jìn'], ['秧', 'yāng'], ['表', 'biǎo'], ['示', 'shì'], ['摆', 'bǎi'], ['翻', 'fān'], ['仍', 'réng'], ['栽', 'zāi'], ['责', 'zé']];
const SEG = 360 / WHEEL.length;
const SPIN_MS = 2600;
const COLORS = ['#ffd27a', '#9fd4f0', '#b8e09a', '#f7b2a8'];
function initWheel(box) {
  if (!box) return;
  const R = 200;
  const pt = (a, r) => { const t = ((a - 90) * Math.PI) / 180; return [(Math.cos(t) * r).toFixed(1), (Math.sin(t) * r).toFixed(1)]; };
  const segs = WHEEL.map(([z], i) => {
    const [x1, y1] = pt(i * SEG - SEG / 2, R); const [x2, y2] = pt(i * SEG + SEG / 2, R); const [tx, ty] = pt(i * SEG, R * 0.74);
    return `<g class="fwh-seg" data-i="${i}"><path d="M0 0L${x1} ${y1}A${R} ${R} 0 0 1 ${x2} ${y2}Z" fill="${COLORS[i % COLORS.length]}" stroke="#fff" stroke-width="3"/><text x="${tx}" y="${ty}" transform="rotate(${i * SEG} ${tx} ${ty})">${z}</text></g>`;
  }).join('');
  box.innerHTML = `<div class="fwh-left"><div class="fwh-wrap"><svg class="fwh-wheel" viewBox="-210 -210 420 420" aria-hidden="true">${segs}<circle r="22" fill="#6b4b2a"/></svg><i class="fwh-ptr">▼</i></div></div>
    <div class="fwh-right"><button type="button" class="btn solid fwh-spin" data-spin>🌬️ 吹一吹</button><p class="fwh-out"><span class="fwh-big">？</span></p>
      <button type="button" class="btn fwh-ok" data-ok disabled>读对了</button><p class="fwh-cnt">已读 <b>0</b> / ${WHEEL.length}</p><button type="button" class="btn" data-again>重新开始</button></div>`;
  const wheel = box.querySelector('.fwh-wheel');
  const out = box.querySelector('.fwh-big');
  const ok = box.querySelector('[data-ok]');
  const cnt = box.querySelector('.fwh-cnt b');
  const read = new Set();
  let angle = 0; let cur = -1; let spinning = false;
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-again]')) {
      read.clear(); cur = -1; cnt.textContent = '0'; out.textContent = '？'; ok.disabled = true; box.classList.remove('all-done');
      box.querySelectorAll('.fwh-seg').forEach((s) => s.classList.remove('read')); return;
    }
    if (e.target.closest('[data-ok]') && cur >= 0) {
      read.add(cur); box.querySelector(`.fwh-seg[data-i="${cur}"]`).classList.add('read');
      cnt.textContent = read.size; ok.disabled = true; cur = -1;
      box.classList.toggle('all-done', read.size === WHEEL.length); return;
    }
    if (!e.target.closest('[data-spin]') || spinning || read.size === WHEEL.length) return;
    const left = WHEEL.map((_, i) => i).filter((i) => !read.has(i));
    const pick = left[Math.floor(Math.random() * left.length)];
    angle += 720 + ((((-pick * SEG - angle) % 360) + 360) % 360);
    wheel.style.transform = `rotate(${angle}deg)`;
    spinning = true; out.textContent = '…'; ok.disabled = true;
    setTimeout(() => { spinning = false; cur = pick; out.innerHTML = Hanzi.ruby(WHEEL[pick][0], WHEEL[pick][1]); ok.disabled = false; }, SPIN_MS);
  });
}
initWheel(document.getElementById('fwWheel'));

Hanzi.init({
  cards: [
    { z: '帮', py: 'bāng', bs: '巾', bh: 9, words: [['帮助', 'bāng zhù'], ['帮忙', 'bāng máng']] },
    { z: '助', py: 'zhù', bs: '力', bh: 7, words: [['帮助', 'bāng zhù'], ['互助', 'hù zhù']] },
    { z: '抽', py: 'chōu', bs: '扌', bh: 8, words: [['抽水', 'chōu shuǐ'], ['抽上来', 'chōu shàng lái']] },
    { z: '续', py: 'xù', bs: '纟', bh: 11, words: [['断断续续', 'duàn duàn xù xù'], ['继续', 'jì xù']] },
    { z: '使', py: 'shǐ', bs: '亻', bh: 8, words: [['使劲', 'shǐ jìn']] },
    { z: '劲', py: 'jìn', bs: '力', bh: 7, words: [['使劲', 'shǐ jìn'], ['有劲', 'yǒu jìn']] },
    { z: '秧', py: 'yāng', bs: '禾', bh: 10, words: [['秧苗', 'yāng miáo']] },
    { z: '表', py: 'biǎo', bs: '一', bh: 8, words: [['表示', 'biǎo shì'], ['手表', 'shǒu biǎo']] },
    { z: '示', py: 'shì', bs: '示', bh: 5, words: [['表示', 'biǎo shì']] },
    { z: '摆', py: 'bǎi', bs: '扌', bh: 13, words: [['摇摇摆摆', 'yáo yáo bǎi bǎi'], ['摆动', 'bǎi dòng']] },
    { z: '翻', py: 'fān', bs: '羽', bh: 18, words: [['翻跟头', 'fān gēn tou'], ['翻书', 'fān shū']] },
    { z: '仍', py: 'réng', bs: '亻', bh: 4, words: [['仍然', 'réng rán']] },
    { z: '栽', py: 'zāi', bs: '木', bh: 10, words: [['新栽', 'xīn zāi'], ['栽树', 'zāi shù']] },
    { z: '责', py: 'zé', bs: '贝', bh: 8, words: [['责怪', 'zé guài']] },
  ],
  write: {
    a: [
      { z: '车', py: 'chē', bs: '车', bh: 4 },
      { z: '得', py: 'de', bs: '彳', bh: 11 },
      { z: '秧', py: 'yāng', bs: '禾', bh: 10 },
      { z: '苗', py: 'miáo', bs: '艹', bh: 8 },
      { z: '汗', py: 'hàn', bs: '氵', bh: 6 },
    ],
    b: [
      { z: '急', py: 'jí', bs: '心', bh: 9 },
      { z: '场', py: 'chǎng', bs: '土', bh: 6 },
      { z: '伤', py: 'shāng', bs: '亻', bh: 6 },
      { z: '路', py: 'lù', bs: '足', bh: 13 },
    ],
  },
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    applyScene(slide, step);
  },
};
