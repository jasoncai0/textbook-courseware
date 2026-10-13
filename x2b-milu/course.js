'use strict';
/* 要是你在野外迷了路 · 本课数据与本课互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：① 四位“天然的指南针”名片卡（太阳、北极星、大树、积雪），每张配诗节 + 示意图；
 *          ② 北在哪边？——从天上往下看的小地图会转动，用树影、北极星、枝叶稀稠判断北方；
 *          ③ 拖滑条看“稀—稠”；④ 近义词找朋友；⑤ 点亮北斗七星识字。 */

/* 二下课文只给生字注音：data-pyk="脱:tuō 袄:ǎo" → 按顺序给这些字注音，其余字上面空着（与课本一致） */
document.querySelectorAll('[data-pyk]').forEach((el) => {
  const want = el.dataset.pyk.trim().split(/\s+/).filter(Boolean).map((s) => s.split(':'));
  let k = 0;
  const syl = [...el.textContent].filter((ch) => /\p{Script=Han}/u.test(ch))
    .map((ch) => (k < want.length && ch === want[k][0] ? want[k++][1] : '_'));
  if (k < want.length) console.warn(`注音字没找到：${want[k][0]}（${el.textContent}）`); // eslint-disable-line no-console
  el.dataset.py = syl.join(' ');
});

// 伪随机（固定种子），画面每次一样
const seeded = (seed) => () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }; // eslint-disable-line no-param-reassign
const star5 = (x, y, r, cls = '') => `<polygon class="${cls}" points="${Array.from({ length: 10 }, (_, k) => {
  const a = -Math.PI / 2 + (k * Math.PI) / 5;
  const rr = k % 2 ? r * 0.45 : r;
  return `${(x + Math.cos(a) * rr).toFixed(1)},${(y + Math.sin(a) * rr).toFixed(1)}`;
}).join(' ')}"/>`;
const DIPPER = [[70, 190], [120, 168], [168, 160], [214, 166], [222, 214], [290, 222], [292, 166]];
const dipperSvg = (pts, cls) => `<path class="ml-dline" d="M${pts.slice(0, 7).map((p) => p.join(' ')).join('L')}L${pts[3].join(' ')}"/>${pts.map(([x, y], k) => star5(x, y, 9, `${cls} s${k}`)).join('')}`;

/* ================= 四张示意图（左边是南，右边是北） ================= */
const ground = '<path d="M0 200H400V260H0Z" fill="#b9d89a"/><text class="ml-dir" x="22" y="244">南</text><text class="ml-dir" x="378" y="244">北</text><path d="M60 236H340" stroke="#5a6a4a" stroke-width="3" marker-end="url(#mlArr)"/>';
const DIA = [
  () => `<rect width="400" height="260" fill="#e3f2fb"/>${ground}
    <circle cx="90" cy="46" r="26" fill="#ffd34d"/><g stroke="#ffc21a" stroke-width="4">${[0, 1, 2, 3, 4, 5, 6, 7].map((k) => { const a = (k * Math.PI) / 4; return `<path d="M${90 + Math.cos(a) * 34} ${46 + Math.sin(a) * 34}l${(Math.cos(a) * 12).toFixed(1)} ${(Math.sin(a) * 12).toFixed(1)}"/>`; }).join('')}</g>
    <ellipse cx="270" cy="204" rx="80" ry="10" fill="rgba(40,50,30,.35)"/>
    <rect x="194" y="120" width="14" height="82" fill="#7a5432"/><circle cx="200" cy="104" r="38" fill="#5aa845"/>
    <text class="ml-lab" x="90" y="100">中午 · 太阳在南</text><text class="ml-lab" x="290" y="186">树影指北</text>`,
  () => `<rect width="400" height="260" fill="#1d2a44"/>${ground.replace('#b9d89a', '#2e3d2a')}
    <g transform="translate(20 -60) scale(.9)">${dipperSvg(DIPPER, 'ml-st lit')}</g>
    <path d="M281 140L296 30" stroke="#ffe680" stroke-width="2" stroke-dasharray="6 6"/>
    ${star5(298, 22, 13, 'ml-polaris')}<text class="ml-lab w" x="330" y="56">北极星</text><text class="ml-lab w" x="120" y="138">北斗七星</text>
    <path d="M298 40V190" stroke="#ffe680" stroke-width="2" stroke-dasharray="3 7"/>`,
  () => {
    const r = seeded(11);
    let leaves = '';
    for (let i = 0; i < 160; i += 1) {
      const a = r() * Math.PI * 2;
      const d = Math.sqrt(r()) * 70;
      const x = 200 + Math.cos(a) * d * 1.2;
      const y = 104 + Math.sin(a) * d * 0.8;
      if (x > 200 && r() < 0.72) continue; // eslint-disable-line no-continue
      leaves += `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="9" ry="5" fill="hsl(${110 + r() * 25} 45% ${34 + r() * 16}%)" transform="rotate(${(r() * 180).toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)})"/>`;
    }
    return `<rect width="400" height="260" fill="#dfe6ea"/>${ground}
      <rect x="192" y="110" width="16" height="92" fill="#7a5432"/><path d="M200 140L150 96M200 130L256 90M200 120L200 60" stroke="#7a5432" stroke-width="6"/>
      ${leaves}<text class="ml-lab" x="100" y="30">枝叶稠 → 南</text><text class="ml-lab" x="306" y="30">枝叶稀 → 北</text>`;
  },
  () => `<rect width="400" height="260" fill="#e8f0f6"/>
    <circle cx="40" cy="36" r="22" fill="#ffd34d"/><path d="M60 50L250 150M66 62L262 170" stroke="#ffc21a" stroke-width="3" stroke-dasharray="8 6"/>
    <path d="M0 110H120L170 200H230L280 110H400V260H0Z" fill="#b39b7a"/>
    <path d="M120 110L170 200H200L190 186L136 110Z" fill="#fff"/>
    <path d="M280 110L230 200H214L268 112Z" fill="#fff" opacity=".7"/>
    <text class="ml-dir" x="40" y="96">南</text><text class="ml-dir" x="360" y="96">北</text>
    <text class="ml-lab" x="100" y="236">背阴：化得慢</text><text class="ml-lab" x="300" y="236">向阳：化得快</text>`,
];
document.querySelectorAll('[data-dia]').forEach((svg) => {
  svg.innerHTML = `<defs><marker id="mlArr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#5a6a4a"/></marker></defs>${DIA[+svg.dataset.dia]()}`;
});

/* ================= 名片卡 ================= */
const cardsBox = document.getElementById('mlCards');
function pickCard(k) {
  const slide = cardsBox.closest('.slide');
  slide.querySelectorAll('.ml-card').forEach((c) => c.classList.toggle('on', +c.dataset.k === k));
  slide.querySelectorAll('.ml-pane').forEach((p) => p.classList.toggle('on', +p.dataset.k === k));
  slide.querySelector('.ml-pick').hidden = k >= 0;
}
if (cardsBox) {
  cardsBox.addEventListener('click', (e) => {
    const c = e.target.closest('.ml-card');
    if (c) pickCard(+c.dataset.k);
  });
}

/* ================= 北在哪边？ ================= */
const ROUNDS = [['sun', 90], ['star', 0], ['tree', 270], ['sun', 180], ['star', 270], ['tree', 90]];
const DIRS = ['up', 'right', 'down', 'left'];
const SCENE_NAME = { sun: '中午', star: '夜晚', tree: '阴雨天' };
const HINT = { sun: '树影指着的方向就是北。', star: '北极星在哪边，哪边就是北。', tree: '枝叶稀的一面是北。' };
function mapScene(type) {
  if (type === 'sun') {
    return `<rect width="400" height="400" fill="#cde7b0"/>
      <ellipse cx="200" cy="118" rx="34" ry="78" fill="rgba(40,50,30,.3)"/><circle cx="200" cy="206" r="46" fill="#5aa845"/><circle cx="188" cy="194" r="16" fill="#7cc35e"/>
      <circle cx="200" cy="362" r="24" fill="#ffd34d"/>${[0, 1, 2, 3, 4, 5, 6, 7].map((k) => { const a = (k * Math.PI) / 4; return `<path d="M${200 + Math.cos(a) * 30} ${362 + Math.sin(a) * 30}l${(Math.cos(a) * 10).toFixed(1)} ${(Math.sin(a) * 10).toFixed(1)}" stroke="#ffc21a" stroke-width="4"/>`; }).join('')}`;
  }
  if (type === 'star') {
    const pts = DIPPER.map(([x, y]) => [x * 0.7 + 70, y * 0.7 + 60]);
    return `<rect width="400" height="400" fill="#1d2a44"/>
      ${[[40, 300], [330, 320], [360, 120], [60, 70], [300, 260], [120, 360]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="#cbd5ea"/>`).join('')}
      ${dipperSvg(pts, 'ml-st lit')}<path d="M${pts[5].join(' ')}L200 40" stroke="#ffe680" stroke-width="2" stroke-dasharray="6 6"/>
      ${star5(200, 34, 14, 'ml-polaris')}<circle cx="200" cy="300" r="12" fill="#f0a35a"/>`;
  }
  const r = seeded(5);
  let leaves = '';
  for (let i = 0; i < 220; i += 1) {
    const a = r() * Math.PI * 2;
    const d = Math.sqrt(r()) * 130;
    const x = 200 + Math.cos(a) * d;
    const y = 200 + Math.sin(a) * d;
    if (y < 200 && r() < 0.75) continue; // eslint-disable-line no-continue
    leaves += `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="11" ry="6" fill="hsl(${110 + r() * 25} 45% ${32 + r() * 16}%)" transform="rotate(${(r() * 180).toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)})"/>`;
  }
  return `<rect width="400" height="400" fill="#c9d4c4"/><circle cx="200" cy="200" r="138" fill="rgba(90,130,70,.18)"/>
    <path d="M200 200L120 120M200 200L290 130M200 200L210 70M200 200L110 260M200 200L300 280" stroke="#7a5432" stroke-width="7" stroke-linecap="round"/>${leaves}`;
}
function initGame(box) {
  let i = 0;
  box.innerHTML = `<div class="ml-map"><span class="ml-when"></span><svg viewBox="0 0 400 400" aria-label="从天上往下看的小地图"><g class="ml-rot"></g></svg>
    ${DIRS.map((d) => `<button type="button" class="ml-arrow d-${d}" data-d="${d}" aria-label="北在这边">北？</button>`).join('')}</div>
    <div class="ml-gside"><p class="ml-gq">用哪位“指南针”？北在哪边？</p><p class="ml-gmsg"></p><div class="hz-dots"></div></div>`;
  const g = box.querySelector('.ml-rot');
  const msg = box.querySelector('.ml-gmsg');
  const show = () => {
    const [type, rot] = ROUNDS[i];
    g.innerHTML = mapScene(type);
    g.setAttribute('transform', `rotate(${rot} 200 200)`);
    box.querySelector('.ml-when').textContent = SCENE_NAME[type];
    box.querySelectorAll('.ml-arrow').forEach((b) => b.classList.remove('ok', 'wrong'));
    msg.textContent = '';
    box.querySelector('.hz-dots').innerHTML = ROUNDS.map((_, k) => `<i class="${k < i ? 'done' : k === i ? 'cur' : ''}"></i>`).join('');
  };
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-again]')) { i = 0; e.target.closest('[data-again]').remove(); show(); return; }
    const btn = e.target.closest('.ml-arrow');
    if (!btn || box.querySelector('.ml-arrow.ok')) return;
    const [type, rot] = ROUNDS[i];
    if (btn.dataset.d !== DIRS[rot / 90]) {
      btn.classList.remove('wrong'); void btn.offsetWidth; btn.classList.add('wrong');
      msg.textContent = `再看看：${HINT[type]}`;
      return;
    }
    btn.classList.add('ok');
    btn.textContent = '北';
    msg.textContent = `对了！${HINT[type]}`;
    setTimeout(() => {
      i += 1;
      if (i < ROUNDS.length) { show(); btn.textContent = '北？'; return; }
      btn.textContent = '北？';
      msg.textContent = '六张地图都找到北了，你就是辨别方向的小能手！';
      box.querySelector('.ml-gside').insertAdjacentHTML('beforeend', '<button type="button" class="btn solid" data-again>再玩一次</button>');
    }, 1300);
  });
  show();
}
const game = document.getElementById('mlGame');
if (game) initGame(game);

/* ================= 稀—稠 ================= */
const branch = document.getElementById('mlBranch');
function drawBranch(n) {
  const r = seeded(3);
  let leaves = '';
  for (let k = 0; k < n; k += 1) {
    const t = (k + 0.5) / n;
    const x = 40 + t * 420;
    const y = 160 - t * 40 + Math.sin(t * 6) * 8;
    const up = k % 2 ? -1 : 1;
    const ang = up * (40 + r() * 30);
    leaves += `<ellipse cx="${(x + up * 6).toFixed(0)}" cy="${(y - up * 30).toFixed(0)}" rx="14" ry="34" fill="hsl(${105 + r() * 25} 48% ${34 + r() * 14}%)" transform="rotate(${ang.toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)})"/>`;
  }
  branch.innerHTML = `<rect width="500" height="300" rx="16" fill="#f1f6ec"/><path d="M20 168Q250 150 480 116" stroke="#7a5432" stroke-width="10" fill="none" stroke-linecap="round"/>${leaves}
    <text class="ml-thw" x="250" y="280">${n <= 7 ? '稀：叶子少，空隙大' : n >= 16 ? '稠：叶子多，挤得密' : '……'}</text>`;
}
if (branch) {
  const dense = document.getElementById('mlDense');
  drawBranch(+dense.value);
  dense.addEventListener('input', () => drawBranch(+dense.value));
}

/* ================= 近义词找朋友 ================= */
const PAIRS = [['慌张', '惊慌'], ['分辨', '辨别'], ['忠实', '忠诚'], ['向导', '导游'], ['永远', '永久']];
const PAIR_PY = { 忠诚: '诚:chéng' };
function initPairs(box) {
  const words = PAIRS.flatMap((p, k) => p.map((w) => ({ w, k })));
  const order = [3, 7, 0, 9, 5, 1, 8, 2, 6, 4].map((x) => words[x]);
  box.innerHTML = `<div class="ml-pgrid">${order.map((o) => `<button type="button" class="ml-word" data-k="${o.k}" data-pyk="${PAIR_PY[o.w] || ''}">${o.w}</button>`).join('')}</div>
    <p class="ml-pmsg">先点一个词，再点和它意思相近的词。</p>`;
  let sel = null;
  const msg = box.querySelector('.ml-pmsg');
  box.addEventListener('click', (e) => {
    const b = e.target.closest('.ml-word:not(.done)');
    if (!b) return;
    if (!sel || sel === b) { sel = sel === b ? null : b; box.querySelectorAll('.ml-word').forEach((x) => x.classList.toggle('sel', x === sel)); return; }
    if (sel.dataset.k !== b.dataset.k) { b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong'); msg.textContent = '它们不是一对，再找找。'; return; }
    [sel, b].forEach((x) => { x.classList.remove('sel'); x.classList.add('done', `p${b.dataset.k}`); });
    msg.textContent = `${sel.textContent} — ${b.textContent}，是好朋友！`;
    sel = null;
    if (box.querySelectorAll('.ml-word.done').length === 10) msg.textContent = '五对好朋友都找到了！一起读一读。';
  });
}
const pairs = document.getElementById('mlPairs');
if (pairs) initPairs(pairs);
// 找朋友的按钮是 JS 生成的，补一次注音（data-pyk → data-py），交给下面的 Hanzi.init 处理
document.querySelectorAll('.ml-word[data-pyk]').forEach((el) => {
  const want = el.dataset.pyk.trim().split(/\s+/).filter(Boolean).map((s) => s.split(':'));
  let k = 0;
  el.dataset.py = [...el.textContent].map((ch) => (k < want.length && ch === want[k][0] ? want[k++][1] : '_')).join(' ');
});

/* ================= 识字游戏：点亮北斗七星 ================= */
const DIPPER_Q = [
  { q: 'huāng', ans: '慌', opts: ['荒', '慌', '谎'] },
  { q: 'biàn', ans: '辨', opts: ['辨', '辛', '编'] },
  { q: 'zhōng', ans: '忠', opts: ['患', '思', '忠'] },
  { q: 'zhǎn', ans: '盏', opts: ['盖', '盏', '盘'] },
  { q: 'chuǎng', ans: '闯', opts: ['闯', '闪', '问'] },
  { q: 'pèng', ans: '碰', opts: ['砰', '并', '碰'] },
  { q: 'chóu', ans: '稠', opts: ['调', '稠', '周'] },
  { q: 'qú', ans: '渠', opts: ['渠', '柜', '巨'] },
];
function initDipper(box) {
  let i = 0;
  let busy = false;
  const pts = DIPPER.map(([x, y]) => [x * 1.4 + 20, y * 1.2 - 40]);
  box.innerHTML = `<svg class="ml-sky" viewBox="0 0 600 340" aria-hidden="true">${dipperSvg(pts, 'ml-st')}<path class="ml-point" d="M${pts[5].join(' ')}L430 34"/>${star5(432, 30, 16, 'ml-st ml-pol')}<text class="ml-poltxt" x="470" y="70">北极星</text></svg><div class="ml-gask"></div>`;
  const ask = box.querySelector('.ml-gask');
  const stars = [...box.querySelectorAll('.ml-st')];
  const show = () => {
    const it = DIPPER_Q[i];
    ask.innerHTML = `<p class="ml-q hz-latin">${it.q}</p>
      <div class="ml-opts">${it.opts.map((o) => `<button type="button" class="ml-opt" data-o="${o}">${o}</button>`).join('')}</div>
      <p class="ml-msg">${i ? '' : '哪个字读这个音？'}</p>`;
    busy = false;
  };
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-again]')) { i = 0; stars.forEach((s) => s.classList.remove('lit')); box.classList.remove('found'); show(); return; }
    const opt = e.target.closest('.ml-opt');
    if (!opt || busy) return;
    const msg = box.querySelector('.ml-msg');
    if (opt.dataset.o !== DIPPER_Q[i].ans) {
      opt.classList.remove('wrong'); void opt.offsetWidth; opt.classList.add('wrong');
      msg.textContent = '再看看，这个字不读这个音';
      return;
    }
    busy = true;
    opt.classList.add('right');
    stars[i].classList.add('lit');
    if (i === DIPPER_Q.length - 1) box.classList.add('found');
    msg.textContent = `亮了一颗星！${DIPPER_Q[i].ans}（${DIPPER_Q[i].q}）`;
    setTimeout(() => {
      i += 1;
      if (i < DIPPER_Q.length) { show(); return; }
      ask.innerHTML = '<p class="ml-q">找到北极星，就找到了北方！</p><button type="button" class="btn solid" data-again>再玩一次</button>';
    }, 1100);
  });
  show();
}
const dipper = document.getElementById('mlDipper');
if (dipper) initDipper(dipper);

Hanzi.init({
  cards: [
    { z: '慌', py: 'huāng', words: [['慌张', 'huāng zhāng'], ['惊慌', 'jīng huāng']] },
    { z: '辨', py: 'biàn', words: [['辨别', 'biàn bié'], ['分辨', 'fēn biàn']] },
    { z: '忠', py: 'zhōng', words: [['忠实', 'zhōng shí'], ['忠诚', 'zhōng chéng']] },
    { z: '实', py: 'shí', words: [['忠实', 'zhōng shí'], ['诚实', 'chéng shí']] },
    { z: '导', py: 'dǎo', words: [['向导', 'xiàng dǎo'], ['导游', 'dǎo yóu']] },
    { z: '盏', py: 'zhǎn', words: [['一盏灯', 'yì zhǎn dēng']] },
    { z: '永', py: 'yǒng', words: [['永远', 'yǒng yuǎn'], ['永久', 'yǒng jiǔ']] },
    { z: '闯', py: 'chuǎng', words: [['乱闯', 'luàn chuǎng'], ['闯过', 'chuǎng guò']] },
    { z: '碰', py: 'pèng', words: [['碰上', 'pèng shàng'], ['碰见', 'pèng jiàn']] },
    { z: '稠', py: 'chóu', words: [['稠密', 'chóu mì']] },
    { z: '稀', py: 'xī', words: [['稀少', 'xī shǎo'], ['稀饭', 'xī fàn']] },
    { z: '渠', py: 'qú', words: [['沟渠', 'gōu qú'], ['水渠', 'shuǐ qú']] },
    { z: '积', py: 'jī', words: [['积雪', 'jī xuě'], ['积木', 'jī mù']] },
  ],
  write: {
    a: [
      { z: '指', py: 'zhǐ', bs: '扌', bh: 9 },
      { z: '针', py: 'zhēn', bs: '钅', bh: 7 },
      { z: '帮', py: 'bāng', bs: '巾', bh: 9 },
      { z: '助', py: 'zhù', bs: '力', bh: 7 },
      { z: '导', py: 'dǎo', bs: '寸', bh: 6 },
    ],
    b: [
      { z: '永', py: 'yǒng', bs: '丶', bh: 5 },
      { z: '碰', py: 'pèng', bs: '石', bh: 13 },
      { z: '特', py: 'tè', bs: '牛', bh: 10 },
      { z: '积', py: 'jī', bs: '禾', bh: 10 },
    ],
  },
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (cardsBox && slide.contains(cardsBox)) pickCard(step - 1);
  },
};
