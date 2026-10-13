'use strict';
/* 纸船和风筝 · 本课数据与本课互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用）
 * 本课独有：① 路线图：一座山，纸船顺着小溪往下漂，风筝乘着风往上飞（字幕行上写 data-set / data-unset 改地图状态）；
 *           ② 心情曲线（吵架—和好）；③ 放纸船识字游戏；④ 替小熊写卡片。 */
const SVGNS = 'http://www.w3.org/2000/svg';
const MOVE_MS = 3200;

const BOAT = '<path d="M-34 -6H34L22 14H-22Z" fill="#fff" stroke="#9fb4c4" stroke-width="3"/><path d="M-4 -6L4 -40L22 -6Z" fill="#fff" stroke="#9fb4c4" stroke-width="3"/>';
const KITE = '<path d="M0 -40L28 0L0 40L-28 0Z" fill="#f06a5a" stroke="#fff" stroke-width="3"/><path d="M0 -40V40M-28 0H28" stroke="#fff" stroke-width="2"/><path d="M0 40q10 16 -4 30q-12 14 4 28" fill="none" stroke="#f0a020" stroke-width="3"/>';
const CABIN = (x, y, roof) => `<g transform="translate(${x} ${y})"><rect x="-50" y="-40" width="100" height="70" fill="#c48a52"/><path d="M-66 -36L0 -90L66 -36Z" fill="${roof}"/><rect x="-14" y="-6" width="28" height="36" fill="#7a4e2c"/></g>`;

function mapSvg() {
  return `<svg viewBox="0 0 900 820" aria-hidden="true">
    <defs><linearGradient id="zcHill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fd27a"/><stop offset="1" stop-color="#e3b25a"/></linearGradient></defs>
    <rect width="900" height="820" fill="#dff0fa"/>
    <path d="M0 820Q200 480 450 90Q700 480 900 820Z" fill="url(#zcHill)"/>
    <g class="zc-trees">${[[620, 400], [700, 560], [180, 420], [760, 700], [340, 600]].map(([x, y]) => `<g><rect x="${x - 6}" y="${y}" width="12" height="40" fill="#7a5233"/><circle cx="${x}" cy="${y - 10}" r="30" fill="${x % 3 ? '#e07a3a' : '#e8b03a'}"/></g>`).join('')}</g>
    <path id="zcStream" class="zc-stream" d="M470 190C620 280 330 360 470 450S640 640 280 760"/>
    <path id="zcRoute" class="zc-route" d="M250 700C60 560 180 380 300 330S430 240 450 170"/>
    ${CABIN(470, 160, '#b8322c')}${CABIN(180, 740, '#3f6fb0')}
    <text class="zc-who" x="545" y="160">🐿️</text><text class="zc-who" x="245" y="790">🐻</text>
    <g class="zc-tree"><rect x="84" y="560" width="16" height="120" fill="#7a5233"/><circle cx="92" cy="540" r="60" fill="#5f9e4a"/><g transform="translate(130 600) rotate(-20) scale(.7)">${KITE}</g><g transform="translate(60 620) rotate(15) scale(.6)">${KITE}</g></g>
    <g class="zc-roof">${[-30, 0, 30].map((dx) => `<g transform="translate(${470 + dx} 96) scale(.6)">${BOAT}</g>`).join('')}</g>
    <g class="zc-heart"><text x="330" y="470">❤️</text></g>
    <g class="zc-fight"><text x="300" y="470">💢</text><text x="400" y="420">⚡</text></g>
    <g class="zc-bub b1"><rect x="200" y="560" width="230" height="64" rx="16"/><text x="315" y="603">🌰 祝你快乐！</text></g>
    <g class="zc-bub b2"><rect x="560" y="200" width="230" height="64" rx="16"/><text x="675" y="243">🍓 祝你幸福！</text></g>
    <g class="zc-bub b3"><rect x="300" y="610" width="300" height="64" rx="16"/><text x="450" y="653">📝 我们和好吧！</text></g>
    <g class="zc-mv" data-mv="boat" data-path="zcStream">${BOAT}</g>
    <g class="zc-mv" data-mv="note" data-path="zcStream">${BOAT}<text x="-6" y="-14" font-size="26">📝</text></g>
    <g class="zc-mv" data-mv="kite" data-path="zcRoute">${KITE}</g>
    <g class="zc-mv" data-mv="kite2" data-path="zcRoute">${KITE}</g>
    ${[0, 600, 1200].map((d) => `<g class="zc-mv" data-mv="boats" data-path="zcStream" data-delay="${d}">${BOAT}</g>`).join('')}
  </svg>`;
}

/* 沿路径移动：pos 0（起点）→ 1（终点） */
function place(el, path, t) {
  const len = path.getTotalLength();
  const p = path.getPointAtLength(len * t);
  el.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
}
function travel(el, path) {
  const delay = +(el.dataset.delay || 0);
  const t0 = performance.now() + delay;
  const token = Symbol('move');
  el.token = token;
  place(el, path, 0);
  const tick = (now) => {
    if (el.token !== token) return;
    const t = Math.min(1, Math.max(0, (now - t0) / MOVE_MS));
    place(el, path, 1 - (1 - t) ** 2);
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const words = (s) => (s || '').split(/\s+/).filter(Boolean);
const STATICS = ['gift1', 'gift2', 'friends', 'fight', 'tree', 'roof', 'note'];
function applyMap(slide, step, instant = false) {
  const map = slide.querySelector('.zc-map');
  if (!map) return;
  const init = new Set(words(map.dataset.init));
  const on = new Set(init);
  [...slide.querySelectorAll('[data-step][data-set], [data-step][data-unset]')]
    .filter((e) => +e.dataset.step <= step)
    .sort((a, b) => a.dataset.step - b.dataset.step)
    .forEach((e) => { words(e.dataset.set).forEach((k) => on.add(k)); words(e.dataset.unset).forEach((k) => on.delete(k)); });
  STATICS.forEach((k) => map.classList.toggle(`s-${k}`, on.has(k)));
  map.querySelectorAll('.zc-mv').forEach((el) => {
    const path = map.querySelector(`#${el.dataset.path}`);
    const want = on.has(el.dataset.mv);
    el.classList.toggle('on', want);
    if (!want) { el.token = null; el.dataset.at = '0'; place(el, path, 0); return; }
    if (el.dataset.at === '1') return;
    el.dataset.at = '1';
    if (instant || init.has(el.dataset.mv)) { el.token = null; place(el, path, 1); } else travel(el, path);
  });
}
document.querySelectorAll('.zc-map').forEach((m) => { m.innerHTML = mapSvg(); });
document.querySelectorAll('.slide').forEach((s) => applyMap(s, 0, true));

/* ================= 心情曲线：画到第几个点 ================= */
const MOOD_STOPS = [0, 0.04, 0.3, 0.55, 0.78, 1];
function updateMood(slide, step) {
  const c = slide.querySelector('#zcCurve');
  if (!c) return;
  const len = c.getTotalLength();
  c.style.strokeDasharray = len;
  c.style.strokeDashoffset = len * (1 - MOOD_STOPS[Math.min(step, MOOD_STOPS.length - 1)]);
}

/* ================= 放纸船 ================= */
const GAME = [['筝', 'zhēng'], ['鼠', 'shǔ'], ['折', 'zhé'], ['漂', 'piāo'], ['扎', 'zā'], ['抓', 'zhuā'], ['幸', 'xìng'], ['俩', 'liǎ'], ['但', 'dàn'], ['愿', 'yuàn'], ['哭', 'kū'], ['取', 'qǔ']];
const ASK = [3, 10, 0, 7, 5, 2, 9, 1, 11, 4, 8, 6];
function initBoats(box) {
  if (!box) return;
  box.innerHTML = `<div class="zg-bar"><span class="zg-q"></span><span class="zg-msg">找到写着这个字的纸船，放进小溪！</span><button type="button" class="btn" data-again>再放一次</button></div>
    <div class="zg-land"><div class="zg-bank">${GAME.map(([z], i) => `<button type="button" class="zg-boat" data-i="${i}"><svg viewBox="-40 -44 80 62" aria-hidden="true">${BOAT}</svg><b>${z}</b></button>`).join('')}</div>
    <div class="zg-river"><span class="zg-home">🐻🏠</span><b class="zg-n">0</b></div></div>`;
  const q = box.querySelector('.zg-q');
  const msg = box.querySelector('.zg-msg');
  const n = box.querySelector('.zg-n');
  let k = 0;
  const ask = () => { q.textContent = k < ASK.length ? GAME[ASK[k]][1] : '★'; };
  ask();
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-again]')) {
      k = 0; n.textContent = '0'; box.classList.remove('all-done');
      box.querySelectorAll('.zg-boat').forEach((b) => b.classList.remove('go', 'wrong'));
      msg.textContent = '找到写着这个字的纸船，放进小溪！'; ask(); return;
    }
    const b = e.target.closest('.zg-boat:not(.go)');
    if (!b || k >= ASK.length) return;
    if (+b.dataset.i !== ASK[k]) {
      b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong');
      msg.textContent = '不是这只，再看看拼音！'; return;
    }
    b.classList.add('go');
    k += 1; n.textContent = k;
    msg.textContent = k < ASK.length ? `“${GAME[+b.dataset.i][0]}”漂哇漂，漂到小熊家啦！` : '12 只纸船都放进小溪了！';
    box.classList.toggle('all-done', k === ASK.length);
    ask();
  });
}
initBoats(document.getElementById('zcGame'));

Hanzi.init({
  cards: [
    { z: '筝', py: 'zhēng', bs: '⺮', bh: 12, words: [['风筝', 'fēng zheng'], ['古筝', 'gǔ zhēng']] },
    { z: '鼠', py: 'shǔ', bs: '鼠', bh: 13, words: [['松鼠', 'sōng shǔ'], ['老鼠', 'lǎo shǔ']] },
    { z: '折', py: 'zhé', bs: '扌', bh: 7, words: [['折纸', 'zhé zhǐ'], ['折断', 'zhé duàn']] },
    { z: '漂', py: 'piāo', bs: '氵', bh: 14, words: [['漂流', 'piāo liú'], ['漂哇漂', 'piāo wa piāo']] },
    { z: '扎', py: 'zā', bs: '扌', bh: 4, words: [['扎风筝', 'zā fēng zheng']] },
    { z: '抓', py: 'zhuā', bs: '扌', bh: 7, words: [['抓住', 'zhuā zhù']] },
    { z: '幸', py: 'xìng', bs: '干', bh: 8, words: [['幸福', 'xìng fú']] },
    { z: '俩', py: 'liǎ', bs: '亻', bh: 9, words: [['他们俩', 'tā men liǎ'], ['咱俩', 'zán liǎ']] },
    { z: '但', py: 'dàn', bs: '亻', bh: 7, words: [['但是', 'dàn shì']] },
    { z: '愿', py: 'yuàn', bs: '心', bh: 14, words: [['愿意', 'yuàn yì'], ['心愿', 'xīn yuàn']] },
    { z: '哭', py: 'kū', bs: '口', bh: 10, words: [['哭了', 'kū le'], ['大哭', 'dà kū']] },
    { z: '取', py: 'qǔ', bs: '又', bh: 8, words: [['取下', 'qǔ xià'], ['取水', 'qǔ shuǐ']] },
  ],
  pick: {
    piao: [
      { q: '纸船（　）到了小熊家门口', py: 'zhǐ chuán dào le xiǎo xióng jiā mén kǒu', ans: '漂', opts: ['漂', '飘'] },
      { q: '风筝乘着风，（　）到了松鼠家门口', py: 'fēng zheng chéng zhe fēng dào le sōng shǔ jiā mén kǒu', ans: '飘', opts: ['漂', '飘'] },
      { q: '雪花从天上（　）下来', py: 'xuě huā cóng tiān shàng xià lái', ans: '飘', opts: ['漂', '飘'] },
      { q: '一片树叶在河面上（　）着', py: 'yí piàn shù yè zài hé miàn shàng zhe', ans: '漂', opts: ['漂', '飘'] },
    ],
  },
  write: {
    a: [
      { z: '折', py: 'zhé', bs: '扌', bh: 7 },
      { z: '张', py: 'zhāng', bs: '弓', bh: 7 },
      { z: '祝', py: 'zhù', bs: '礻', bh: 9 },
      { z: '扎', py: 'zā', bs: '扌', bh: 4 },
    ],
    b: [
      { z: '抓', py: 'zhuā', bs: '扌', bh: 7 },
      { z: '吵', py: 'chǎo', bs: '口', bh: 7 },
      { z: '但', py: 'dàn', bs: '亻', bh: 7 },
      { z: '哭', py: 'kū', bs: '口', bh: 10 },
    ],
  },
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    applyMap(slide, step);
    updateMood(slide, step);
  },
};
