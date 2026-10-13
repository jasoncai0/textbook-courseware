'use strict';
/* 盘古开天地（四上 12）· 本课数据与互动。情节图、选一选、读写练习见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* ================= 天每天升高一丈：拖动时间，天升高、盘古长高 ================= */
const MAX_YEARS = 18000;
const DAYS_PER_YEAR = 365;
const GROUND_Y = 330;
const GROW_SAYS = [
  [0, '天和地刚刚分开，盘古头顶天，脚踏地。'],
  [3000, '天一天天升高，地一天天加厚，盘古也跟着长高。'],
  [9000, '几千年过去了，盘古还撑着，一刻也不松劲。'],
  [17000, '快一万八千年了！天高极了，地厚极了。'],
  [18000, '一万八千年！盘古像一根柱子，撑在天和地之间。'],
];
// 盘古剪影：脚在 (0,0)，头顶在 (0,-100)，双手举过头顶托着天
const PANGU = 'M-8 0 L-6 -40 L-12 -42 L-14 -62 L-24 -100 L-18 -101 L-8 -72 L-6 -80 A8 8 0 1 1 6 -80 L8 -72 L18 -101 L24 -100 L14 -62 L12 -42 L6 -40 L8 0 L2 0 L0 -36 L-2 0 Z';
function buildGrow() {
  document.getElementById('growSvg').innerHTML = `<defs><clipPath id="grClip"><rect width="600" height="400" rx="14"/></clipPath>
    <linearGradient id="grSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f5d8a"/><stop offset="1" stop-color="#9cc6e6"/></linearGradient></defs>
    <g clip-path="url(#grClip)">
      <rect width="600" height="400" fill="#f3ecd9"/>
      <rect id="grSkyRect" width="600" height="290" fill="url(#grSky)"/>
      <g id="grClouds" fill="#fff" opacity=".8"><ellipse cx="120" cy="0" rx="50" ry="12"/><ellipse cx="460" cy="0" rx="60" ry="14"/></g>
      <rect y="${GROUND_Y}" width="600" height="${400 - GROUND_Y}" fill="#8a6a44"/>
      <g id="grLayers" stroke="#6f5234" stroke-width="3"></g>
      <g id="grPangu" fill="#7a3a22"><path d="${PANGU}"/></g>
      <text class="t-l" x="20" y="34" fill="#fff" id="grSkyLab">天</text>
      <text class="t-l" x="20" y="${GROUND_Y + 34}" fill="#fff">地</text>
    </g>`;
}
function setGrow(years) {
  const p = years / MAX_YEARS;
  const skyBottom = 290 - 250 * p;             // 天的下沿：从 290 升到 40
  const height = GROUND_Y - skyBottom;         // 盘古正好撑满天地之间
  document.getElementById('grSkyRect').setAttribute('height', skyBottom.toFixed(0));
  document.getElementById('grClouds').setAttribute('transform', `translate(0 ${(skyBottom - 14).toFixed(0)})`);
  document.getElementById('grPangu').setAttribute('transform', `translate(300 ${GROUND_Y}) scale(${(height / 100).toFixed(3)})`);
  const layers = 1 + Math.round(p * 6);        // 地越来越厚：地层越来越多
  document.getElementById('grLayers').innerHTML = Array.from({ length: layers }, (_, i) => `<path d="M0 ${GROUND_Y + 8 + i * 9} H600"/>`).join('');
  document.getElementById('growY').textContent = years.toLocaleString('zh-CN');
  document.getElementById('growSay').textContent = GROW_SAYS.filter(([y]) => years >= y).pop()[1];
}
function initGrow() {
  const input = document.getElementById('growYears');
  input.addEventListener('input', () => setGrow(+input.value));
  setGrow(0);
}

/* ================= 连一连：身体 → 万物 ================= */
const PAIRS = [
  ['呼出的气息', '四季的风和飘动的云'], ['发出的声音', '隆隆的雷声'], ['左眼', '太阳'], ['右眼', '月亮'],
  ['四肢和躯干', '大地的四极和五方的名山'], ['血液', '奔流不息的江河'], ['汗毛', '茂盛的花草树木'], ['汗水', '滋润万物的雨露'],
];
const RIGHT_ORDER = [4, 2, 7, 0, 5, 3, 6, 1];
function initMatch() {
  const L = document.getElementById('matchL');
  const R = document.getElementById('matchR');
  const box = document.getElementById('match');
  const lines = document.getElementById('matchLines');
  L.innerHTML = PAIRS.map(([a], i) => `<button type="button" class="mt-item" data-i="${i}">${a}</button>`).join('');
  R.innerHTML = RIGHT_ORDER.map((i) => `<button type="button" class="mt-item" data-i="${i}">${PAIRS[i][1]}</button>`).join('');
  let picked = null;
  const drawAll = () => {
    const b = box.getBoundingClientRect();
    lines.setAttribute('viewBox', `0 0 ${b.width} ${b.height}`);
    lines.innerHTML = [...L.querySelectorAll('.done')].map((l) => {
      const r = R.querySelector(`[data-i="${l.dataset.i}"]`).getBoundingClientRect();
      const a = l.getBoundingClientRect();
      return `<line x1="${a.right - b.left}" y1="${a.top + a.height / 2 - b.top}" x2="${r.left - b.left}" y2="${r.top + r.height / 2 - b.top}"/>`;
    }).join('');
  };
  box.addEventListener('click', (e) => {
    const it = e.target.closest('.mt-item');
    if (!it || it.classList.contains('done')) return;
    if (it.parentElement === L) {
      L.querySelectorAll('.mt-item').forEach((x) => x.classList.toggle('sel', x === it));
      picked = it;
      return;
    }
    if (!picked) return;
    if (picked.dataset.i === it.dataset.i) {
      picked.classList.remove('sel');
      picked.classList.add('done');
      it.classList.add('done');
      picked = null;
      drawAll();
    } else {
      it.classList.remove('nope');
      void it.offsetWidth; // 重新触发抖动
      it.classList.add('nope');
    }
  });
  new ResizeObserver(drawAll).observe(box);
}

/* ================= 情节图 ================= */
const PLOT = [
  { step: 1, stage: '起因', text: '天地混沌像个大鸡蛋，盘古在其中睡了一万八千年', pic: 'hundun', x: 13, y: 92 },
  { step: 2, stage: '经过', text: '盘古醒来，劈开“大鸡蛋”，天地分开', pic: 'pikai', x: 38, y: 58 },
  { step: 2, stage: '经过', text: '头顶天，脚踏地，撑了一万八千年', pic: 'dingtian', x: 63, y: 36 },
  { step: 3, stage: '结果', text: '盘古倒下，身体化成了世间万物', pic: 'huashen', x: 88, y: 62 },
];

/* ================= 心目中的盘古 ================= */
const PICKS = {
  hero: [
    { t: '高大巍峨', ok: true, why: '像一根柱子撑在天地间' },
    { t: '力大无穷', ok: true, why: '一斧劈开“大鸡蛋”' },
    { t: '坚持不懈', ok: true, why: '撑了一万八千年' },
    { t: '无私奉献', ok: true, why: '用整个身体创造世界' },
    { t: '胆小怕事', ok: false, why: '他对着黑暗劈过去' },
    { t: '半途而废', ok: false, why: '直到天地成形才倒下' },
    { t: '有责任心', ok: true, why: '怕天地重新合拢' },
  ],
};

/* ================= 读与写 ================= */
const MOMENTS = [
  {
    name: '讲《盘古开天地》', pic: 'pikai',
    prompt: '按起因、经过、结果的顺序，把盘古开天地的故事讲给同学听。',
    hint: '起因：天地混沌；经过：劈开大鸡蛋、顶天立地；结果：身体化成万物。讲出神奇的地方。',
    example: '很久很久以前，天和地还没有分开，混沌一片，像个大鸡蛋，巨人盘古在里面睡了一万八千年。有一天他醒了，拿起斧头一劈，“大鸡蛋”碎了：轻而清的升上去成了天，重而浊的沉下来成了地。盘古怕天地再合上，就头顶天、脚踏地，天升高一丈，他就长高一丈，这样撑了一万八千年。最后他累得倒下了，身体变成了日月星辰、山川河流、花草树木。',
  },
  {
    name: '想象：盘古醒来', pic: 'hundun',
    prompt: '展开想象：盘古在黑乎乎的“大鸡蛋”里醒来，他会看到什么、想到什么、做些什么？',
    hint: '可以写他的动作（睁眼、翻身、拿起斧头）、心里想的话，让画面更生动。',
    example: '盘古揉揉眼睛，四周黑乎乎的，伸手不见五指，闷得他喘不过气来。“这是什么地方？太憋闷了！”他一使劲翻身坐起，“咔嚓”一声，头顶裂开一道缝，一丝微光透了进来。盘古眼睛一亮，抓起身边的大斧头，用尽全身力气向黑暗劈去……',
  },
  {
    name: '我心目中的盘古', pic: 'dingtian',
    prompt: '写一写你心目中的盘古：他长什么样？是一个怎样的巨人？',
    hint: '外形 + 品质，每一点都从课文里找依据。',
    example: '在我心目中，盘古是一个顶天立地的巨人。他的身体像一根擎天柱，肩膀宽得能扛起整片天空，手臂粗得像千年的大树。他力大无穷，一斧头就劈开了混沌；他坚持不懈，一撑就是一万八千年；他无私奉献，最后把整个身体都献给了这个世界。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ plot: PLOT, picks: PICKS, moments: MOMENTS });
    buildGrow();
    initGrow();
    initMatch();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
