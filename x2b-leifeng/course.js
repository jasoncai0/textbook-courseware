'use strict';
/* 雷锋叔叔，你在哪里 · 本课数据与本课互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：① 足迹路线图（小溪 → 小路 → 需要爱心的地方，一节诗一处足迹；不画雷锋形象）；② 诗歌页右上角的路线小地图；③ 猜词义翻卡；④ 身边的“雷锋”看图点一点；⑤ 踩脚印识字。 */

/* 二下课文只给生字注音：data-pyk="曾:céng" → 按顺序给这些字注音，其余字上面空着（与课本一致） */
document.querySelectorAll('[data-pyk]').forEach((el) => {
  const want = el.dataset.pyk.trim().split(/\s+/).filter(Boolean).map((s) => s.split(':'));
  let k = 0;
  const syl = [...el.textContent].filter((ch) => /\p{Script=Han}/u.test(ch))
    .map((ch) => (k < want.length && ch === want[k][0] ? want[k++][1] : '_'));
  if (k < want.length) console.warn(`注音字没找到：${want[k][0]}（${el.textContent}）`); // eslint-disable-line no-console
  el.dataset.py = syl.join(' ');
});

/* ================= 诗歌页右上角：路线小地图 ================= */
const STOPS = [['💧', '小溪'], ['🌿', '小路'], ['❤️', '身边']];
document.querySelectorAll('.lf-route').forEach((el) => {
  const at = +el.dataset.at;
  el.innerHTML = STOPS.map(([e, n], i) => `<span class="${i < at ? 'past' : i === at ? 'cur' : ''}"><i>${e}</i>${n}</span>`).join('<b>👣</b>');
});

/* ================= 足迹路线图 ================= */
const CREEK_STEPS = [[60, 120], [150, 170], [230, 150], [300, 210], [360, 250]];
const PATH_STEPS = [[420, 270], [500, 240], [580, 260], [650, 220], [700, 200]];
function prints(points, cls) {
  const out = [];
  for (let s = 0; s < points.length - 1; s += 1) {
    const [x1, y1] = points[s];
    const [x2, y2] = points[s + 1];
    const ang = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI + 90;
    for (let k = 0; k < 3; k += 1) {
      const t = k / 3;
      const side = (s * 3 + k) % 2 ? 7 : -7;
      out.push(`<g transform="translate(${(x1 + (x2 - x1) * t).toFixed(0)} ${(y1 + (y2 - y1) * t).toFixed(0)}) rotate(${ang.toFixed(0)}) translate(${side} 0)"><ellipse rx="5" ry="9" style="--i:${s * 3 + k}"/></g>`);
    }
  }
  return `<g class="${cls}">${out.join('')}</g>`;
}
function buildRoute(box) {
  const thorns = Array.from({ length: 7 }, (_, i) => {
    const x = 430 + i * 40;
    const y = 300 - (i % 2) * 110;
    return `<path d="M${x} ${y}l6 -22l6 22l8 -16l-2 18Z"/>`;
  }).join('');
  const hearts = [[760, 120], [850, 90], [930, 150], [800, 250], [900, 300], [740, 330], [960, 380], [860, 380]]
    .map(([x, y], i) => `<text x="${x}" y="${y}" style="--i:${i}">❤️</text>`).join('');
  box.innerHTML = `<svg viewBox="0 0 1000 440" aria-hidden="true">
    <rect width="1000" height="440" class="lj-bg"/>
    <path class="lj-creek" d="M0 60C120 90 140 200 240 190S330 260 380 300S360 440 300 440H200C260 400 300 330 230 260S80 150 0 120Z"/>
    <path class="lj-path" d="M380 290C460 300 500 240 580 262S680 210 720 200"/>
    <g class="lj-thorn">${thorns}</g>
    <g class="lj-town"><path d="M740 300h60v-40l-30 -26l-30 26Z"/><path d="M830 220h56v-36l-28 -24l-28 24Z"/><path d="M900 330h70v-46l-35 -30l-35 30Z"/></g>
    ${prints(CREEK_STEPS, 'lj-f lj-f1')}${prints(PATH_STEPS, 'lj-f lj-f2')}
    <g class="lj-stop"><circle cx="150" cy="56" r="34"/><text x="150" y="68">💧</text><text class="nm" x="150" y="118">小溪</text></g>
    <g class="lj-stop"><circle cx="560" cy="150" r="34"/><text x="560" y="162">🌿</text><text class="nm" x="560" y="212">小路</text></g>
    <g class="lj-stop"><circle cx="860" cy="40" r="30"/><text x="860" y="52">❤️</text></g>
    <g class="lj-tag t1"><rect x="40" y="300" width="250" height="90" rx="16"/><text x="165" y="338">抱着迷路的孩子</text><text x="165" y="372">冒着蒙蒙的细雨</text></g>
    <g class="lj-tag t2"><rect x="420" y="330" width="250" height="90" rx="16"/><text x="545" y="368">背着年迈的大娘</text><text x="545" y="402">踏着路上的荆棘</text></g>
    <g class="lj-hearts">${hearts}</g>
  </svg>`;
}
const ljMap = document.getElementById('ljMap');
if (ljMap) buildRoute(ljMap);

/* ================= 翻卡 / 看图点一点 ================= */
document.querySelectorAll('.fk').forEach((c) => c.addEventListener('click', () => c.classList.toggle('flip')));
const lfPic = document.getElementById('lfPic');
if (lfPic) {
  lfPic.addEventListener('click', (e) => {
    const hot = e.target.closest('.lf-hot');
    if (!hot) return;
    lfPic.querySelectorAll('.lf-hot').forEach((h) => h.classList.toggle('on', h === hot));
    hot.classList.add('seen');
    const bub = document.getElementById('lfBub');
    bub.textContent = `他们在${hot.dataset.say}——这就是身边的“雷锋”！`;
    bub.classList.remove('pop'); void bub.offsetWidth; bub.classList.add('pop');
  });
}

/* ================= 踩脚印识字 ================= */
const STEP_Q = [
  { q: 'fēng', ans: '锋', opts: ['峰', '锋', '蜂'] },
  { q: 'zuó', ans: '昨', opts: ['昨', '作', '怎'] },
  { q: 'mào', ans: '冒', opts: ['胃', '帽', '冒'] },
  { q: 'liú', ans: '留', opts: ['流', '留', '溜'] },
  { q: 'wān', ans: '弯', opts: ['弯', '变', '湾'] },
  { q: 'sǎ', ans: '洒', opts: ['酒', '西', '洒'] },
  { q: 'nuǎn', ans: '暖', opts: ['缓', '暖', '援'] },
  { q: 'mì', ans: '觅', opts: ['觅', '见', '觉'] },
];
function initSteps(box) {
  let i = 0;
  let busy = false;
  const trail = () => `<div class="jy-trail">${STEP_Q.map((_, k) => `<span class="${k < i ? 'on' : ''}">👣</span>`).join('')}<b>❤️</b></div>`;
  const show = () => {
    const it = STEP_Q[i];
    box.innerHTML = `<p class="jy-q hz-latin">${it.q}</p>
      <div class="jy-row">${it.opts.map((o, k) => `<button type="button" class="jy-foot${k % 2 ? ' r' : ''}" data-o="${o}">${o}</button>`).join('')}</div>
      <p class="jy-msg"></p>${trail()}`;
    busy = false;
  };
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-again]')) { i = 0; show(); return; }
    const f = e.target.closest('.jy-foot');
    if (!f || busy) return;
    const msg = box.querySelector('.jy-msg');
    if (f.dataset.o !== STEP_Q[i].ans) {
      f.classList.remove('wrong'); void f.offsetWidth; f.classList.add('wrong');
      msg.textContent = '踩错啦，再看看这个字读什么';
      return;
    }
    busy = true;
    f.classList.add('right');
    box.querySelectorAll('.jy-trail span')[i].classList.add('on', 'new');
    msg.textContent = `往前一步！${STEP_Q[i].ans}（${STEP_Q[i].q}）`;
    setTimeout(() => {
      i += 1;
      if (i < STEP_Q.length) { show(); return; }
      box.innerHTML = `<p class="jy-q done">走到终点，找到爱心啦！</p>${trail()}<button type="button" class="btn solid" data-again>再走一次</button>`;
    }, 1200);
  });
  show();
}
const jyGame = document.getElementById('jyGame');
if (jyGame) initSteps(jyGame);

Hanzi.init({
  cards: [
    { z: '曾', py: 'céng', words: [['曾经', 'céng jīng'], ['曾路过', 'céng lù guò']] },
    { z: '蒙', py: 'méng', words: [['蒙蒙细雨', 'méng méng xì yǔ']] },
    { z: '泞', py: 'nìng', words: [['泥泞', 'ní nìng']] },
    { z: '顺', py: 'shùn', words: [['顺着', 'shùn zhe'], ['顺利', 'shùn lì']] },
    { z: '迈', py: 'mài', words: [['年迈', 'nián mài'], ['迈步', 'mài bù']] },
    { z: '踏', py: 'tà', words: [['踏着', 'tà zhe'], ['踏步', 'tà bù']] },
    { z: '荆', py: 'jīng', words: [['荆棘', 'jīng jí']] },
    { z: '棘', py: 'jí', words: [['荆棘', 'jīng jí']] },
    { z: '瓣', py: 'bàn', words: [['花瓣', 'huā bàn']] },
    { z: '莹', py: 'yíng', words: [['晶莹', 'jīng yíng']] },
    { z: '觅', py: 'mì', words: [['寻觅', 'xún mì']] },
    { z: '需', py: 'xū', words: [['需要', 'xū yào']] },
    { z: '献', py: 'xiàn', words: [['献出', 'xiàn chū'], ['奉献', 'fèng xiàn']] },
  ],
  write: {
    a: [
      { z: '锋', py: 'fēng', bs: '钅', bh: 12 },
      { z: '昨', py: 'zuó', bs: '日', bh: 9 },
      { z: '冒', py: 'mào', bh: 9 },
      { z: '留', py: 'liú', bs: '田', bh: 10 },
      { z: '弯', py: 'wān', bs: '弓', bh: 9 },
    ],
    b: [
      { z: '背', py: 'bēi', bh: 9 },
      { z: '洒', py: 'sǎ', bs: '氵', bh: 9 },
      { z: '温', py: 'wēn', bs: '氵', bh: 12 },
      { z: '暖', py: 'nuǎn', bs: '日', bh: 13 },
    ],
  },
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
