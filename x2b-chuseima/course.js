'use strict';
/* 一匹出色的马 · 本课数据与本课互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：① 柳枝变马（拾起柳枝 → 变出马头马尾 → 妹妹骑着跑回家）+“出色”词义；② 妹妹前后变化对比和心情条；③ 读句子想画面 + 抄写格；④ 骑马回家识字。 */

/* 二下课文只给生字注音：data-pyk="郊:jiāo" → 按顺序给这些字注音，其余字上面空着（与课本一致） */
document.querySelectorAll('[data-pyk]').forEach((el) => {
  const want = el.dataset.pyk.trim().split(/\s+/).filter(Boolean).map((s) => s.split(':'));
  let k = 0;
  const syl = [...el.textContent].filter((ch) => /\p{Script=Han}/u.test(ch))
    .map((ch) => (k < want.length && ch === want[k][0] ? want[k++][1] : '_'));
  if (k < want.length) console.warn(`注音字没找到：${want[k][0]}（${el.textContent}）`); // eslint-disable-line no-console
  el.dataset.py = syl.join(' ');
});

/* ================= 柳枝变马 ================= */
const LEAF = (x, y, r) => `<ellipse cx="${x}" cy="${y}" rx="11" ry="4" transform="rotate(${r} ${x} ${y})"/>`;
/* 一根柳枝（中心在原点，横放，前端在右） */
function branch(withHorse) {
  const leaves = Array.from({ length: 12 }, (_, i) => LEAF(-100 + i * 17, (i % 2 ? 7 : -7), i % 2 ? 30 : -30)).join('');
  return `<path class="cm-stick" d="M-120 4Q0 -6 120 0"/>
    <g class="cm-leaves">${leaves}</g>
    ${withHorse ? `<g class="cm-head"><path d="M112 2L128 -40Q130 -62 152 -66L170 -58L182 -46L176 -38L160 -42L150 -30L142 -4Z"/><circle cx="160" cy="-54" r="3" fill="#3a2a1a"/><path class="mane" d="M128 -40Q120 -56 134 -64Q136 -50 140 -46Z"/><path class="rein" d="M150 -36Q120 -20 96 -2"/></g>
    <g class="cm-tail"><path d="M-120 4Q-150 -10 -170 10Q-150 0 -140 22Q-132 8 -120 4Z"/></g>` : ''}`;
}
const GIRL = `<g class="cm-girl">
  <path class="leg l" d="M-6 -46L-16 -2"/><path class="leg r" d="M6 -46L16 -2"/>
  <path d="M-18 -48H18L14 -84H-14Z" fill="#f2c94c"/>
  <path d="M-16 -82H16L20 -112H-20Z" fill="#e2463b"/>
  <path d="M14 -104L44 -86" stroke="#f6d2b0" stroke-width="7" stroke-linecap="round"/>
  <circle cy="-128" r="18" fill="#f6d2b0"/><circle cx="-14" cy="-146" r="8" fill="#2b2420"/><circle cx="14" cy="-146" r="8" fill="#2b2420"/>
  <path d="M-17 -130Q0 -152 17 -130Q6 -140 -17 -130Z" fill="#2b2420"/>
  <circle cx="-6" cy="-126" r="2"/><circle cx="7" cy="-126" r="2"/><path d="M-6 -118Q0 -112 6 -118" stroke="#c0392b" stroke-width="2" fill="none"/></g>`;
function buildMagic(svg) {
  const strands = Array.from({ length: 12 }, (_, i) => `<path d="M${60 + i * 9} 90Q${54 + i * 9} 170 ${64 + i * 9} ${220 + (i % 3) * 20}"/>`).join('');
  svg.innerHTML = `
    <defs><linearGradient id="cmSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbd7b4"/><stop offset="1" stop-color="#fdf3dc"/></linearGradient></defs>
    <rect width="900" height="460" fill="url(#cmSky)"/>
    <path d="M0 300Q450 270 900 300V460H0Z" fill="#8fcf6a"/>
    <path d="M0 420Q300 360 560 380T900 330V360Q620 400 300 420T0 460Z" fill="#e7cf9f"/>
    <g class="cm-tree"><path d="M110 330C104 260 120 160 104 90" stroke="#7a5432" stroke-width="16" fill="none" stroke-linecap="round"/><ellipse cx="110" cy="90" rx="80" ry="40" fill="#9fd07c"/><g class="cm-strands">${strands}</g></g>
    <g transform="translate(800 330)"><path d="M-50 0V-60L0 -100L50 -60V0Z" fill="#fff4e0" stroke="#c9a77a" stroke-width="4"/><path d="M-62 -56L0 -110L62 -56" fill="none" stroke="#c9603c" stroke-width="12" stroke-linecap="round"/><rect x="-14" y="-40" width="28" height="40" fill="#a8783e"/></g>
    <g transform="translate(260 400)"><g class="cm-br">${branch(true)}</g></g>
    <g class="cm-spark"><text x="330" y="250">✨</text><text x="420" y="300">✨</text><text x="250" y="270">✨</text><text x="380" y="210">✨</text></g>
    <g class="cm-ride"><g class="cm-bob">${GIRL}<g transform="translate(0 -52) rotate(-18)">${branch(true)}</g></g></g>
    <g class="cm-home"><rect x="560" y="130" width="250" height="60" rx="24"/><text x="685" y="172">我早回来啦！</text></g>`;
}
const cmSvg = document.getElementById('cmSvg');
if (cmSvg) buildMagic(cmSvg);

/* ================= 骑马回家 ================= */
const HORSE_Q = [
  { q: 'pǐ', ans: '匹', opts: ['四', '匹', '区'] },
  { q: 'jiāo', ans: '郊', opts: ['郊', '效', '较'] },
  { q: 'bō', ans: '波', opts: ['坡', '皮', '波'] },
  { q: 'liàn', ans: '恋', opts: ['恋', '变', '弯'] },
  { q: 'shě', ans: '舍', opts: ['合', '舍', '全'] },
  { q: 'qiú', ans: '求', opts: ['球', '救', '求'] },
  { q: 'qí', ans: '骑', opts: ['骑', '奇', '椅'] },
  { q: 'kuà', ans: '跨', opts: ['夸', '垮', '跨'] },
];
function initHorse(box) {
  let i = 0;
  let busy = false;
  const track = () => `<div class="qm-track"><span class="qm-horse" style="--p:${(i / HORSE_Q.length) * 100}%">🏇</span><b>🏠</b></div>`;
  const show = () => {
    const it = HORSE_Q[i];
    box.innerHTML = `${track()}<p class="qm-q hz-latin">${it.q}</p>
      <div class="qm-row">${it.opts.map((o) => `<button type="button" class="qm-o" data-o="${o}">${o}</button>`).join('')}</div>
      <p class="qm-msg"></p>`;
    busy = false;
  };
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-again]')) { i = 0; show(); return; }
    const o = e.target.closest('.qm-o');
    if (!o || busy) return;
    const msg = box.querySelector('.qm-msg');
    if (o.dataset.o !== HORSE_Q[i].ans) {
      o.classList.remove('wrong'); void o.offsetWidth; o.classList.add('wrong');
      msg.textContent = '马儿停住了，再看看';
      return;
    }
    busy = true;
    o.classList.add('right');
    box.querySelector('.qm-horse').style.setProperty('--p', `${((i + 1) / HORSE_Q.length) * 100}%`);
    msg.textContent = `驾！${HORSE_Q[i].ans}（${HORSE_Q[i].q}）`;
    setTimeout(() => {
      i += 1;
      if (i < HORSE_Q.length) { show(); return; }
      box.innerHTML = `${track()}<p class="qm-q done">我早回来啦！</p><button type="button" class="btn solid" data-again>再骑一次</button>`;
    }, 1300);
  });
  show();
}
const qmGame = document.getElementById('qmGame');
if (qmGame) initHorse(qmGame);

Hanzi.init({
  cards: [
    { z: '郊', py: 'jiāo', words: [['郊外', 'jiāo wài'], ['市郊', 'shì jiāo']] },
    { z: '泛', py: 'fàn', words: [['泛起', 'fàn qǐ']] },
    { z: '波', py: 'bō', words: [['波纹', 'bō wén'], ['波浪', 'bō làng']] },
    { z: '纹', py: 'wén', words: [['波纹', 'bō wén'], ['花纹', 'huā wén']] },
    { z: '葱', py: 'cōng', words: [['葱葱绿绿', 'cōng cōng lǜ lǜ'], ['大葱', 'dà cōng']] },
    { z: '软', py: 'ruǎn', words: [['柔软', 'róu ruǎn'], ['软绵绵', 'ruǎn mián mián']] },
    { z: '毯', py: 'tǎn', words: [['绿毯', 'lǜ tǎn'], ['毛毯', 'máo tǎn']] },
    { z: '异', py: 'yì', words: [['异常', 'yì cháng']] },
    { z: '恋', py: 'liàn', words: [['恋恋不舍', 'liàn liàn bù shě']] },
    { z: '舍', py: 'shě', words: [['不舍', 'bù shě'], ['舍得', 'shě de']] },
    { z: '求', py: 'qiú', words: [['请求', 'qǐng qiú'], ['要求', 'yāo qiú']] },
    { z: '株', py: 'zhū', words: [['一株', 'yì zhū']] },
    { z: '拾', py: 'shí', words: [['拾起', 'shí qǐ'], ['收拾', 'shōu shi']] },
    { z: '骑', py: 'qí', words: [['骑马', 'qí mǎ'], ['骑车', 'qí chē']] },
    { z: '跨', py: 'kuà', words: [['跨上', 'kuà shàng'], ['跨过', 'kuà guò']] },
  ],
  write: {
    a: [
      { z: '匹', py: 'pǐ', bh: 4 },
      { z: '妹', py: 'mèi', bs: '女', bh: 8 },
      { z: '波', py: 'bō', bs: '氵', bh: 8 },
      { z: '纹', py: 'wén', bs: '纟', bh: 7 },
      { z: '像', py: 'xiàng', bs: '亻', bh: 13 },
    ],
    b: [
      { z: '景', py: 'jǐng', bs: '日', bh: 12 },
      { z: '恋', py: 'liàn', bs: '心', bh: 10 },
      { z: '舍', py: 'shě', bh: 8 },
      { z: '求', py: 'qiú', bh: 7 },
    ],
  },
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
