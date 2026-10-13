'use strict';
/* 古诗二首（村居 · 咏柳）· 本课数据与本课互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：① 村居意象拼贴（点贴纸把诗里的景物贴到画上，诗句对应的词亮起）；② 咏柳“春风剪柳叶”动画；③ 放风筝识字。 */

/* 二下课文只给生字注音：data-pyk="莺:yīng 拂:fú" → 按顺序给这些字注音，其余字上面空着（与课本一致） */
document.querySelectorAll('[data-pyk]').forEach((el) => {
  const want = el.dataset.pyk.trim().split(/\s+/).filter(Boolean).map((s) => s.split(':'));
  let k = 0;
  const syl = [...el.textContent].filter((ch) => /\p{Script=Han}/u.test(ch))
    .map((ch) => (k < want.length && ch === want[k][0] ? want[k++][1] : '_'));
  if (k < want.length) console.warn(`注音字没找到：${want[k][0]}（${el.textContent}）`); // eslint-disable-line no-console
  el.dataset.py = syl.join(' ');
});

/* ================= 村居：意象拼贴 ================= */
const STICKERS = [
  { k: 'cao', name: '小草', py: 'xiǎo cǎo' },
  { k: 'ying', name: '黄莺', py: 'huáng yīng' },
  { k: 'liu', name: '杨柳', py: 'yáng liǔ' },
  { k: 'yan', name: '春烟', py: 'chūn yān' },
  { k: 'tong', name: '儿童', py: 'ér tóng' },
  { k: 'yuan', name: '纸鸢', py: 'zhǐ yuān' },
];

function grassPath(y0, h, n, seed) {
  let d = `M0 520V${y0}`;
  for (let i = 0; i <= n; i += 1) {
    const x = (800 / n) * i;
    const tip = y0 - h * (0.55 + 0.45 * Math.abs(Math.sin(i * 1.7 + seed)));
    d += `L${(x - 800 / n / 2).toFixed(0)} ${tip.toFixed(0)}L${x.toFixed(0)} ${y0}`;
  }
  return `${d}V520Z`;
}
const bird = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><g class="cj-bird">
  <ellipse cx="0" cy="0" rx="22" ry="12" fill="#f2c230"/><circle cx="18" cy="-6" r="8" fill="#f2c230"/>
  <path d="M25 -6l10 3l-10 2z" fill="#e07b2a"/><circle cx="20" cy="-8" r="1.8" fill="#2b2420"/>
  <path class="cj-wing" d="M-4 -4Q-14 -30 -30 -24Q-18 -10 -4 -4Z" fill="#e0a92e"/><path d="M-20 0l-16 -6l4 10z" fill="#3d3a2a"/></g></g>`;
const kid = (x, y, coat, d) => `<g transform="translate(${x} ${y})"><g class="cj-kid" style="animation-delay:${d}s">
  <path d="M-6 30L-14 56M6 30L14 56" stroke="#5b4636" stroke-width="5" stroke-linecap="round"/>
  <path d="M-16 0H16L20 34H-20Z" fill="${coat}"/><path d="M14 4L30 -26" stroke="#f6d2b0" stroke-width="5" stroke-linecap="round"/>
  <circle cx="0" cy="-12" r="13" fill="#f6d2b0"/><circle cx="-9" cy="-25" r="6" fill="#2b2420"/><circle cx="9" cy="-25" r="6" fill="#2b2420"/>
  <path d="M-12 -14Q0 -30 12 -14Q4 -22 -12 -14Z" fill="#2b2420"/><circle cx="-4" cy="-11" r="1.6"/><circle cx="5" cy="-11" r="1.6"/></g></g>`;

function buildCollage(board) {
  const strands = Array.from({ length: 14 }, (_, i) => {
    const x = 70 + i * 13;
    const len = 150 + (i % 4) * 26;
    return `<path d="M${x} 140Q${x - 10} ${140 + len / 2} ${x + 6} ${140 + len}" style="animation-delay:${(i % 5) * 0.3}s"/>`;
  }).join('');
  board.innerHTML = `<svg viewBox="0 0 800 520" aria-hidden="true">
    <defs>
      <linearGradient id="cjSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe8f2"/><stop offset="1" stop-color="#f1f7e6"/></linearGradient>
      <filter id="cjCut"><feDropShadow dx="2" dy="3" stdDeviation="2" flood-color="#3d4a2a" flood-opacity=".28"/></filter>
      <filter id="cjBlur"><feGaussianBlur stdDeviation="9"/></filter>
    </defs>
    <rect width="800" height="520" fill="url(#cjSky)"/>
    <circle cx="700" cy="78" r="38" fill="#fde9a6"/>
    <path d="M0 360Q160 300 330 336T800 318V520H0Z" fill="#d9ebc4"/>
    <g class="cj-piece" data-k="liu" filter="url(#cjCut)">
      <path d="M0 382Q200 330 420 350T800 336V392Q560 384 380 398T0 430Z" fill="#b99a6a"/>
      <path d="M128 384C124 300 138 220 120 150" stroke="#7a5432" stroke-width="12" fill="none" stroke-linecap="round"/>
      <ellipse cx="128" cy="140" rx="90" ry="36" fill="#9fd07c"/>
      <g class="cj-strands">${strands}</g>
    </g>
    <g class="cj-piece" data-k="yan"><g filter="url(#cjBlur)" class="cj-mist">
      <ellipse cx="200" cy="330" rx="210" ry="26" fill="#fff" opacity=".85"/><ellipse cx="520" cy="352" rx="240" ry="22" fill="#fff" opacity=".7"/></g></g>
    <g class="cj-piece" data-k="cao" filter="url(#cjCut)">
      <path d="${grassPath(470, 70, 26, 0)}" fill="#8cc95a"/><path d="${grassPath(500, 46, 34, 2)}" fill="#5ea544"/>
    </g>
    <g class="cj-piece" data-k="ying" filter="url(#cjCut)">${bird(250, 110, 1)}${bird(340, 70, 0.8)}${bird(410, 140, 0.7)}</g>
    <g class="cj-piece" data-k="tong" filter="url(#cjCut)">${kid(470, 420, '#7fb4dc', 0)}${kid(545, 432, '#f0b74a', 0.2)}${kid(620, 416, '#8ccf8a', 0.4)}</g>
    <g class="cj-piece" data-k="yuan">
      <path class="cj-line" d="M500 392Q560 260 590 150M651 382Q690 300 712 214" />
      <g class="cj-kite" filter="url(#cjCut)"><path d="M590 120L560 150L590 160L620 150Z" fill="#d8453b"/><path d="M560 150Q540 130 520 140L560 152ZM620 150Q640 130 660 140L620 152Z" fill="#b8322a"/><path d="M590 160q-8 20 4 40q-10 16 0 30" stroke="#d8453b" stroke-width="3" fill="none"/></g>
      <g class="cj-kite k2" filter="url(#cjCut)"><path d="M712 196q-30 -34 -44 -4q14 22 44 10q30 12 44 -10q-14 -30 -44 4Z" fill="#c07ad0"/><path d="M712 206q-10 20 6 40" stroke="#c07ad0" stroke-width="3" fill="none"/></g>
      <g class="cj-wind"><path d="M40 210q60 -30 120 0t120 0"/><path d="M90 250q50 -24 100 0t100 0"/></g>
    </g>
  </svg>`;
}

function initCollage() {
  const board = document.getElementById('cjBoard');
  const tray = document.getElementById('cjTray');
  const msg = document.getElementById('cjMsg');
  if (!board) return;
  buildCollage(board);
  tray.innerHTML = `${STICKERS.map((s) => `<button type="button" class="cj-stk" data-k="${s.k}">${Hanzi.ruby(s.name, s.py)}</button>`).join('')}
    <button type="button" class="btn cj-reset">撕下重贴</button>`;
  const slide = board.closest('.slide');
  tray.addEventListener('click', (e) => {
    if (e.target.closest('.cj-reset')) {
      slide.querySelectorAll('.stuck').forEach((el) => el.classList.remove('stuck'));
      msg.textContent = '诗里有什么？点下面的“贴纸”，贴到画上。';
      return;
    }
    const btn = e.target.closest('.cj-stk');
    if (!btn) return;
    const k = btn.dataset.k;
    slide.querySelectorAll(`[data-k="${k}"]`).forEach((el) => el.classList.add('stuck'));
    const left = STICKERS.length - tray.querySelectorAll('.cj-stk.stuck').length;
    msg.textContent = left ? `贴上了！诗里亮起来的是哪几个字？还差 ${left} 张。` : '六张都贴好了：这就是二月里的“村居”！';
  });
}
initCollage();

/* ================= 咏柳：春风剪柳叶 ================= */
const LEAVES = Array.from({ length: 10 }, (_, i) => {
  const t = (i + 1) / 11;
  const y = 70 + t * 380;
  const x = 628 - t * 26 + Math.sin(t * 3) * 8;
  const side = i % 2 ? 1 : -1;
  return { x, y, side };
});
function buildWillow(svg) {
  const strands = Array.from({ length: 18 }, (_, i) => {
    const x = 150 + i * 12;
    const len = 190 + ((i * 37) % 70);
    return `<path pathLength="1" d="M${x} 190Q${x - 14} ${190 + len / 2} ${x + 4} ${190 + len}" style="--d:${(i % 6) * 0.12}s"/>`;
  }).join('');
  const leaves = LEAVES.map((l, i) => `<path class="yl-leaf" style="--d:${0.3 + i * 0.3}s" d="M${l.x.toFixed(0)} ${l.y.toFixed(0)}q${l.side * 34} -6 ${l.side * 58} 16q${-l.side * 30} 10 ${-l.side * 58} -16z"/>`).join('');
  svg.innerHTML = `
    <defs><linearGradient id="ylSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e3f1f6"/><stop offset="1" stop-color="#f4f8ec"/></linearGradient></defs>
    <rect width="800" height="520" fill="url(#ylSky)"/>
    <path d="M0 470Q200 450 440 466V520H0Z" fill="#cfe3c0"/>
    <g class="yl-tree">
      <path d="M262 500C258 420 270 320 250 210M256 300L210 230M258 270L300 214" stroke="#7a5432" stroke-width="14" fill="none" stroke-linecap="round"/>
      <ellipse class="yl-crown" cx="250" cy="170" rx="130" ry="58"/><ellipse class="yl-crown" cx="200" cy="150" rx="70" ry="40"/><ellipse class="yl-crown" cx="300" cy="148" rx="74" ry="40"/>
      <g class="yl-strands">${strands}</g>
    </g>
    <g class="yl-zoom">
      <rect x="470" y="30" width="300" height="460" rx="24" fill="#fffef8" stroke="#bcd9a8" stroke-width="4"/>
      <path class="yl-stem" d="M628 50C620 180 640 320 600 470"/>
      ${leaves}
      <text class="yl-q" x="720" y="110">?</text>
      <g class="yl-sc"><g class="yl-scin">
        <g class="yl-b1"><path d="M0 0L64 -10L4 8Z" fill="#9aa7b0"/><circle cx="-22" cy="-14" r="13" fill="none" stroke="#d8453b" stroke-width="7"/></g>
        <g class="yl-b2"><path d="M0 0L64 10L4 -8Z" fill="#b8c3ca"/><circle cx="-22" cy="14" r="13" fill="none" stroke="#d8453b" stroke-width="7"/></g>
        <circle r="4" fill="#555"/></g></g>
    </g>`;
}
const ylSvg = document.getElementById('ylSvg');
if (ylSvg) {
  buildWillow(ylSvg);
  document.getElementById('ylAgain').addEventListener('click', () => {
    ylSvg.classList.remove('cut');
    void ylSvg.getBoundingClientRect();
    ylSvg.classList.add('cut');
  });
}

/* ================= 识字游戏：放风筝 ================= */
const KITE_Q = [
  { q: 'yīng', ans: '莺', opts: ['鸟', '莺', '营'] },
  { q: 'dī', ans: '堤', opts: ['堤', '提', '题'] },
  { q: 'fú', ans: '拂', opts: ['佛', '沸', '拂'] },
  { q: 'zuì', ans: '醉', opts: ['碎', '醉', '翠'] },
  { q: 'zhuāng', ans: '妆', opts: ['妆', '装', '庄'] },
  { q: 'cái', ans: '裁', opts: ['栽', '载', '裁'] },
  { q: 'jiǎn', ans: '剪', opts: ['前', '剪', '煎'] },
  { q: 'chèn', ans: '趁', opts: ['趁', '诊', '珍'] },
];
const KITE_COLORS = ['#d8453b', '#3f8fd0', '#e0a92e'];
function initKites(box) {
  let i = 0;
  let busy = false;
  const show = () => {
    const it = KITE_Q[i];
    box.innerHTML = `<p class="fz-q hz-latin">${it.q}</p>
      <div class="fz-row">${it.opts.map((o, k) => `<button type="button" class="fz-kite" data-o="${o}" style="--c:${KITE_COLORS[k]}"><span>${o}</span><i></i></button>`).join('')}</div>
      <p class="fz-msg">${i ? '' : '哪只风筝上的字读这个音？'}</p>
      <div class="hz-dots">${KITE_Q.map((_, k) => `<i class="${k < i ? 'done' : k === i ? 'cur' : ''}"></i>`).join('')}</div>`;
    busy = false;
  };
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-again]')) { i = 0; show(); return; }
    const kite = e.target.closest('.fz-kite');
    if (!kite || busy) return;
    const msg = box.querySelector('.fz-msg');
    if (kite.dataset.o !== KITE_Q[i].ans) {
      kite.classList.remove('wrong'); void kite.offsetWidth; kite.classList.add('wrong');
      msg.textContent = '再看看，这个字不读这个音';
      return;
    }
    busy = true;
    kite.classList.add('fly');
    msg.textContent = `飞起来了！${KITE_Q[i].ans}（${KITE_Q[i].q}）`;
    setTimeout(() => {
      i += 1;
      if (i < KITE_Q.length) { show(); return; }
      box.innerHTML = '<p class="fz-q">八只风筝都飞上天啦！</p><button type="button" class="btn solid" data-again>再放一次</button>';
    }, 1300);
  });
  show();
}
const fz = document.getElementById('fzGame');
if (fz) initKites(fz);

Hanzi.init({
  cards: [
    { z: '莺', py: 'yīng', words: [['黄莺', 'huáng yīng'], ['莺飞', 'yīng fēi']] },
    { z: '拂', py: 'fú', words: [['吹拂', 'chuī fú'], ['春风拂面', 'chūn fēng fú miàn']] },
    { z: '堤', py: 'dī', words: [['河堤', 'hé dī'], ['堤岸', 'dī àn']] },
    { z: '柳', py: 'liǔ', words: [['杨柳', 'yáng liǔ'], ['柳条', 'liǔ tiáo']] },
    { z: '醉', py: 'zuì', words: [['醉春烟', 'zuì chūn yān'], ['陶醉', 'táo zuì']] },
    { z: '咏', py: 'yǒng', words: [['咏柳', 'yǒng liǔ'], ['歌咏', 'gē yǒng']] },
    { z: '妆', py: 'zhuāng', words: [['化妆', 'huà zhuāng'], ['梳妆', 'shū zhuāng']] },
    { z: '丝', py: 'sī', words: [['丝绦', 'sī tāo'], ['丝线', 'sī xiàn']] },
    { z: '绦', py: 'tāo', words: [['绿丝绦', 'lǜ sī tāo']] },
    { z: '裁', py: 'cái', words: [['裁出', 'cái chū'], ['裁缝', 'cái féng']] },
    { z: '剪', py: 'jiǎn', words: [['剪刀', 'jiǎn dāo'], ['剪纸', 'jiǎn zhǐ']] },
  ],
  write: {
    a: [
      { z: '诗', py: 'shī', bs: '讠', bh: 8 },
      { z: '童', py: 'tóng', bs: '立', bh: 12 },
      { z: '趁', py: 'chèn', bs: '走', bh: 12 },
      { z: '碧', py: 'bì', bs: '石', bh: 14 },
    ],
    b: [
      { z: '妆', py: 'zhuāng', bh: 6 },
      { z: '绿', py: 'lǜ', bs: '纟', bh: 11 },
      { z: '丝', py: 'sī', bh: 5 },
      { z: '剪', py: 'jiǎn', bs: '刀', bh: 11 },
    ],
  },
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.contains(ylSvg)) ylSvg.classList.toggle('cut', step >= 4);
  },
};
