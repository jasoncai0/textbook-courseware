'use strict';
/* 小猴子下山 · 本课数据与本课互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完） */

/* ================= 路线地图：字幕上的 data-at / data-hand / data-drop / data-rabbit / data-empty 驱动 =================
 * SVG 800 × 400。站点：0 山上（家） 1 玉米地 2 桃树 3 瓜地 4 追兔子的路上 */
const STOPS = [[150, 118], [304, 300], [494, 196], [650, 318], [704, 246]]; // 小猴子站的位置（在各景点旁边）
const ITEMS = { corn: '🌽', peach: '🍑', melon: '🍉' };
const DROPS = { corn: [384, 196], peach: [530, 336], melon: [628, 262] }; // 扔在哪儿
const ROUTE = 'M96 96 C 150 170, 160 262, 230 282 S 360 170, 420 152 S 520 270, 572 292 S 660 236, 700 196 L 738 150';
const PLACES = [
  { x: 96, y: 40, t: '山上', py: 'shān shàng' },
  { x: 230, y: 360, t: '玉米地', py: 'yù mǐ dì' },
  { x: 420, y: 70, t: '桃树', py: 'táo shù' },
  { x: 560, y: 372, t: '瓜地', py: 'guā dì' },
  { x: 738, y: 64, t: '树林', py: 'shù lín' },
];

function buildMap(box) {
  box.innerHTML = `<svg viewBox="0 0 800 400" class="xh-svg" aria-label="小猴子下山路线图">
    <defs><linearGradient id="xhSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dff1fb"/><stop offset=".45" stop-color="#eaf6df"/><stop offset="1" stop-color="#cfe8b5"/></linearGradient></defs>
    <rect width="800" height="400" rx="18" fill="url(#xhSky)"/>
    <path d="M0 170L60 60L110 30L170 90L230 170Z" fill="#9ccf86" stroke="#6ea65a" stroke-width="3"/>
    <path d="${ROUTE}" class="xh-road"/>
    <g class="xh-scenery">
      <text x="200" y="300">🌽</text><text x="240" y="276">🌽</text><text x="262" y="306">🌽</text>
      <text x="398" y="150" class="xh-big">🌳</text><text x="412" y="122">🍑</text><text x="446" y="138">🍑</text>
      <text x="540" y="320">🍉</text><text x="582" y="304">🍉</text><text x="604" y="330">🍉</text>
      <text x="716" y="150" class="xh-big">🌲</text><text x="756" y="174" class="xh-big">🌳</text><text x="740" y="122">🌲</text>
    </g>
    ${PLACES.map((p) => `<g class="xh-place"><text x="${p.x}" y="${p.y - 22}" class="xh-py">${p.py}</text><text x="${p.x}" y="${p.y}" class="xh-name">${p.t}</text></g>`).join('')}
    ${Object.entries(DROPS).map(([k, [x, y]]) => `<g class="xh-drop" data-k="${k}"><text x="${x}" y="${y}">${ITEMS[k]}</text><text x="${x + 16}" y="${y - 26}" class="xh-throw">扔</text></g>`).join('')}
    <g class="xh-rb"><text>🐇</text></g>
    <g class="xh-mk"><circle class="xh-here" r="34"/><text class="xh-mk-i">🐒</text><circle class="xh-handbg" cx="40" cy="-22" r="22"/><text class="xh-hand" x="40" y="-20"></text></g>
  </svg>`;
}
document.querySelectorAll('.xh-map').forEach(buildMap);

function setMap(box, st) {
  const [x, y] = STOPS[st.at];
  const mk = box.querySelector('.xh-mk');
  mk.style.transform = `translate(${x}px, ${y}px)`;
  mk.classList.toggle('empty', Boolean(st.empty));
  box.querySelector('.xh-hand').textContent = st.empty ? '🤲' : ITEMS[st.hand] || '';
  box.querySelectorAll('.xh-drop').forEach((d) => d.classList.toggle('on', st.drops.has(d.dataset.k)));
  const rb = box.querySelector('.xh-rb');
  rb.classList.toggle('run', st.rabbit === 'run');
  rb.classList.toggle('gone', st.rabbit === 'gone');
}
// 地图状态：前面各页的全部字幕 + 本页已出现的字幕，按顺序叠加
function mapState(spans) {
  const st = { at: 0, hand: '', drops: new Set(), rabbit: '', empty: false };
  spans.forEach((el) => {
    const d = el.dataset;
    if (d.at) st.at = +d.at;
    if (d.hand) st.hand = d.hand;
    if (d.drop) st.drops.add(d.drop);
    if (d.rabbit) st.rabbit = d.rabbit;
    if (d.empty) st.empty = true;
  });
  return st;
}
const STATE_SEL = '[data-at], [data-hand], [data-drop], [data-rabbit], [data-empty]';
function updateMap(slide, step) {
  const box = slide.querySelector('.xh-map');
  if (!box) return;
  if (box.dataset.cover) { setMap(box, { at: 0, hand: '', drops: new Set(), rabbit: '', empty: false }); return; }
  const all = [...document.querySelectorAll('.slide')];
  const before = all.slice(0, all.indexOf(slide)).flatMap((s) => [...s.querySelectorAll(STATE_SEL)]);
  const shown = [...slide.querySelectorAll(STATE_SEL)].filter((el) => +el.dataset.step <= step);
  setMap(box, mapState([...before, ...shown]));
}

/* ================= 课后第 2 题：看到什么、做了什么、手里剩什么 ================= */
const FILM = [
  { place: ['玉米地', 'yù mǐ dì'], see: ['玉米又大又多', 'yù mǐ yòu dà yòu duō'], did: ['掰玉米，扛着走', 'bāi yù mǐ káng zhe zǒu'], hand: '🌽' },
  { place: ['桃树下', 'táo shù xià'], see: ['桃子又大又红', 'táo zi yòu dà yòu hóng'], did: ['扔玉米，摘桃子', 'rēng yù mǐ zhāi táo zi'], hand: '🍑' },
  { place: ['瓜地里', 'guā dì lǐ'], see: ['西瓜又大又圆', 'xī guā yòu dà yòu yuán'], did: ['扔桃子，摘西瓜', 'rēng táo zi zhāi xī guā'], hand: '🍉' },
  { place: ['回家路上', 'huí jiā lù shàng'], see: ['小兔子蹦蹦跳跳', 'xiǎo tù zi bèng bèng tiào tiào'], did: ['扔西瓜，追兔子', 'rēng xī guā zhuī tù zi'], hand: '🤲' },
];
function buildFilm(box) {
  const r = ([t, py]) => Hanzi.ruby(t, py);
  box.innerHTML = `<div class="xh-cols">${FILM.map((f, i) => `<div class="xh-col" data-step="${i + 1}">
      <h3 class="py">${r(f.place)}</h3>
      <p class="py"><small>看到</small>${r(f.see)}</p>
      <p class="py"><small>做了</small>${r(f.did)}</p>
      <p class="xh-handbox"><small>手里</small><em>${f.hand}</em>${i ? `<s>${FILM[i - 1].hand}</s>` : ''}</p></div>`).join('')}</div>
    <p class="tip gold xh-why py" data-step="5">${r(['看见一样，丢一样，最后只好空着手回家去。', 'kàn jiàn yí yàng diū yí yàng zuì hòu zhǐ hǎo kōng zhe shǒu huí jiā qù'])}</p>`;
}
buildFilm(document.getElementById('film'));

/* ================= 课后第 3 题：读读做做（点卡片看动作） ================= */
const VERBS = [
  { z: '掰', py: 'bāi', obj: '🌽', tip: ['两只手把玉米掰下来', 'liǎng zhī shǒu bǎ yù mǐ bāi xià lái'] },
  { z: '扛', py: 'káng', obj: '🌽', tip: ['把玉米放在肩上', 'bǎ yù mǐ fàng zài jiān shàng'] },
  { z: '扔', py: 'rēng', obj: '🍉', tip: ['一甩手，把西瓜扔掉', 'yì shuǎi shǒu bǎ xī guā rēng diào'] },
  { z: '摘', py: 'zhāi', obj: '🍑', tip: ['伸手从树上摘桃子', 'shēn shǒu cóng shù shàng zhāi táo zi'] },
  { z: '捧', py: 'pěng', obj: '🍑', tip: ['两只手托着桃子', 'liǎng zhī shǒu tuō zhe táo zi'] },
  { z: '抱', py: 'bào', obj: '🍉', tip: ['两只胳膊抱住西瓜', 'liǎng zhī gē bo bào zhù xī guā'] },
];
function buildVerbs(box) {
  box.innerHTML = VERBS.map((v, i) => `<button type="button" class="xh-verb" data-i="${i}" data-v="${v.py}">
      <span class="xh-vz"><ruby>${v.z}<rt>${v.py}</rt></ruby></span>
      <span class="xh-act"><em class="xh-mk2">🐒</em><em class="xh-obj">${v.obj}</em></span>
      <span class="xh-tip py">${Hanzi.ruby(...v.tip)}</span></button>`).join('');
  box.addEventListener('click', (e) => {
    const card = e.target.closest('.xh-verb');
    if (!card) return;
    box.querySelectorAll('.xh-verb').forEach((c) => c.classList.toggle('on', c === card));
    card.classList.remove('play');
    void card.offsetWidth; // 重新播放动作
    card.classList.add('play');
  });
}
buildVerbs(document.getElementById('verbs'));

Hanzi.init({
  pick: {
    verb: [
      { q: '（　）了一个玉米', py: 'le yí gè yù mǐ', ans: '掰', opts: ['扔', '掰', '抱'] },
      { q: '（　）着玉米往前走', py: 'zhe yù mǐ wǎng qián zǒu', ans: '扛', opts: ['扛', '捧', '追'] },
      { q: '去（　）桃子', py: 'qù táo zi', ans: '摘', opts: ['抱', '摘', '扛'] },
      { q: '（　）着几个桃子', py: 'zhe jǐ gè táo zi', ans: '捧', opts: ['掰', '追', '捧'] },
      { q: '（　）着一个大西瓜', py: 'zhe yí gè dà xī guā', ans: '抱', opts: ['抱', '扛', '摘'] },
      { q: '（　）了西瓜', py: 'le xī guā', ans: '扔', opts: ['捧', '扔', '掰'] },
      { q: '去（　）小兔子', py: 'qù xiǎo tù zi', ans: '追', opts: ['追', '扔', '摘'] },
    ],
  },
  cards: [
    { z: '猴', py: 'hóu', bs: '犭', bh: 12, words: [['小猴子', 'xiǎo hóu zi']] },
    { z: '结', py: 'jiē', bs: '纟', bh: 9, words: [['结得多', 'jiē de duō'], ['结果', 'jiē guǒ']] },
    { z: '掰', py: 'bāi', bs: '手', bh: 12, words: [['掰玉米', 'bāi yù mǐ']] },
    { z: '扛', py: 'káng', bs: '扌', bh: 6, words: [['扛着', 'káng zhe']] },
    { z: '满', py: 'mǎn', bs: '氵', bh: 13, words: [['满树', 'mǎn shù'], ['满地', 'mǎn dì']] },
    { z: '扔', py: 'rēng', bs: '扌', bh: 5, words: [['扔了', 'rēng le']] },
    { z: '摘', py: 'zhāi', bs: '扌', bh: 14, words: [['摘桃子', 'zhāi táo zi']] },
    { z: '捧', py: 'pěng', bs: '扌', bh: 11, words: [['捧着', 'pěng zhe']] },
    { z: '瓜', py: 'guā', bs: '瓜', bh: 5, words: [['西瓜', 'xī guā'], ['瓜地', 'guā dì']] },
    { z: '抱', py: 'bào', bs: '扌', bh: 8, words: [['抱着', 'bào zhe']] },
    { z: '蹦', py: 'bèng', bs: '⻊', bh: 18, words: [['蹦蹦跳跳', 'bèng bèng tiào tiào']] },
    { z: '追', py: 'zhuī', bs: '辶', bh: 9, words: [['追兔子', 'zhuī tù zi']] },
  ],
  shapes: {
    瓜: ['M10 22Q30 10 50 20Q70 30 90 18', 'M50 20V40', 'M50 40C28 46 30 88 50 90C70 88 72 46 50 40', 'M30 20L20 38', 'M72 24L82 40'],
  },
  evolve: [{ z: '瓜', note: '两边是弯弯的瓜藤，中间挂着一个圆圆的瓜。' }],
  write: [
    { z: '块', py: 'kuài', bs: '土', bh: 7 },
    { z: '非', py: 'fēi', bs: '非', bh: 8 },
    { z: '常', py: 'cháng', bs: '巾', bh: 11 },
    { z: '往', py: 'wǎng', bs: '彳', bh: 8 },
    { z: '瓜', py: 'guā', bs: '瓜', bh: 5 },
    { z: '进', py: 'jìn', bs: '辶', bh: 7 },
    { z: '空', py: 'kōng', bs: '穴', bh: 8 },
  ],
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateMap(slide, step);
  },
};
