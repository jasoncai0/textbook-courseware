'use strict';
/* 画杨桃 · 本课数据与本课互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：① 3D 杨桃——按切片画出的立体杨桃，可以转动：侧面是椭圆杨桃，正对一端就是五角星；
 *          ② 教室座位图——点哪个座位，就从哪个角度看讲桌上的杨桃（“我”的座位前排靠边，一端正对着我）；
 *          ③ 分角色读 + 选语气；④ 开火车读词；⑤ 点亮五角星识字。 */

/* 二下课文只给生字注音：data-pyk="脱:tuō 袄:ǎo" → 按顺序给这些字注音，其余字上面空着（与课本一致） */
document.querySelectorAll('[data-pyk]').forEach((el) => {
  const want = el.dataset.pyk.trim().split(/\s+/).filter(Boolean).map((s) => s.split(':'));
  let k = 0;
  const syl = [...el.textContent].filter((ch) => /\p{Script=Han}/u.test(ch))
    .map((ch) => (k < want.length && ch === want[k][0] ? want[k++][1] : '_'));
  if (k < want.length) console.warn(`注音字没找到：${want[k][0]}（${el.textContent}）`); // eslint-disable-line no-console
  el.dataset.py = syl.join(' ');
});

/* ================= 3D 杨桃：一片片星形切片，从远到近画 ================= */
const STAR = Array.from({ length: 10 }, (_, k) => {
  const a = -Math.PI / 2 + (k * Math.PI) / 5;
  const r = k % 2 ? 0.48 : 1;
  return [Math.cos(a) * r, Math.sin(a) * r];
});
const FRUIT = { L: 150, R: 92, N: 44, cx: 200, cy: 150 };
const SLICES = Array.from({ length: FRUIT.N + 1 }, (_, i) => {
  const t = -1 + (2 * i) / FRUIT.N;
  return { t, sc: Math.pow(Math.max(0, 1 - t * t), 0.55) };
});

function fruitSvg(deg) {
  const th = (deg * Math.PI) / 180;
  const c = Math.cos(th);
  const s = Math.sin(th);
  const { L, R, N, cx, cy } = FRUIT;
  const pt = (t, sc, p, q) => `${(cx + t * L * c - p * R * sc * s).toFixed(1)},${(cy + q * R * sc).toFixed(1)}`;
  const w = Math.max(1.2, (2 * L * c) / N + 1.6);
  const order = [...SLICES].sort((a, b) => b.t - a.t); // t 大的离得远，先画
  const body = order.map(({ t, sc }) => {
    const light = Math.round(72 - Math.abs(t) * 20);
    return `<polygon points="${STAR.map(([p, q]) => pt(t, sc, p, q)).join(' ')}" fill="hsl(${56 - Math.abs(t) * 12} 78% ${light}%)" stroke="hsl(50 72% ${light - 3}%)" stroke-width="${w.toFixed(1)}" stroke-linejoin="round"/>`;
  }).join('');
  const ridges = STAR.filter((_, k) => k % 2 === 0)
    .filter(([p]) => !(p * c > 0.2))
    .map(([p, q]) => `<polyline points="${SLICES.map(({ t, sc }) => pt(t, sc, p, q)).join(' ')}"/>`).join('');
  const front = SLICES[0];
  const face = s > 0.55 ? `<polygon class="yt-face" points="${STAR.map(([p, q]) => pt(front.t, 0.62, p, q)).join(' ')}" style="opacity:${((s - 0.55) / 0.45).toFixed(2)}"/>` : '';
  const stem = `<path class="yt-stem" d="M${(cx + L * c + 4).toFixed(1)} ${cy}l${(16 * c).toFixed(1)} -6"/>`;
  return `<ellipse cx="${cx}" cy="${cy + R + 16}" rx="${(L * c + R * s * 0.9 + 20).toFixed(0)}" ry="14" fill="rgba(60,50,20,.15)"/>${stem}${body}<g class="yt-ridge">${ridges}</g>${face}`;
}

function animateFruit(svg, to, cb) {
  const from = +(svg.dataset.deg || 0);
  const t0 = performance.now();
  const dur = 900;
  cancelAnimationFrame(+svg.dataset.raf || 0);
  const tick = (now) => {
    const k = Math.min(1, (now - t0) / dur);
    const e = k < 0.5 ? 2 * k * k : 1 - ((-2 * k + 2) ** 2) / 2;
    const d = from + (to - from) * e;
    svg.innerHTML = fruitSvg(d);
    svg.dataset.deg = d;
    if (cb) cb(d);
    if (k < 1) svg.dataset.raf = requestAnimationFrame(tick);
  };
  svg.dataset.raf = requestAnimationFrame(tick);
}
function setFruit(svg, deg) { svg.innerHTML = fruitSvg(deg); svg.dataset.deg = deg; }

document.querySelectorAll('.yt-mini').forEach((svg) => setFruit(svg, +svg.dataset.deg));
const coverFruit = document.getElementById('ytCover');
if (coverFruit) setFruit(coverFruit, 90);

/* ================= 教室座位图 ================= */
const DESK = [180, 84];
const MY_SEAT = [44, 112];
const AXIS = [MY_SEAT[0] - DESK[0], MY_SEAT[1] - DESK[1]];
const SEATS = [MY_SEAT, [140, 196], [230, 196], [316, 196], [56, 290], [140, 290], [230, 290], [316, 290], [56, 376], [140, 376], [230, 376], [316, 376]];
function seatDeg([x, y]) {
  const v = [x - DESK[0], y - DESK[1]];
  const cos = Math.abs(v[0] * AXIS[0] + v[1] * AXIS[1]) / (Math.hypot(...v) * Math.hypot(...AXIS));
  return Math.round(90 - (Math.acos(Math.min(1, cos)) * 180) / Math.PI);
}
const deskAngle = (Math.atan2(AXIS[1], AXIS[0]) * 180) / Math.PI;
function buildMap(svg) {
  svg.innerHTML = `<rect width="360" height="420" rx="18" fill="#f3efe4"/>
    <rect x="90" y="12" width="180" height="20" rx="4" fill="#3e6b52"/>
    <rect x="120" y="58" width="120" height="52" rx="8" fill="#c99a5e" stroke="#8a5f33" stroke-width="3"/>
    <g transform="translate(${DESK[0]} ${DESK[1]}) rotate(${deskAngle.toFixed(1)})"><ellipse cx="-6" cy="-8" rx="22" ry="11" fill="#e3cf3e" stroke="#b39a22" stroke-width="2"/><ellipse cx="6" cy="8" rx="22" ry="11" fill="#e3cf3e" stroke="#b39a22" stroke-width="2"/></g>
    <path class="yt-sight" d=""/>
    ${SEATS.map((p, i) => `<g class="yt-seat${i ? '' : ' me'}" data-i="${i}" transform="translate(${p[0]} ${p[1]})" role="button" aria-label="${i ? '同学的座位' : '我的座位'}">
      <rect x="-32" y="-22" width="64" height="44" rx="10"/><text y="9">${i ? '同学' : '我'}</text></g>`).join('')}`;
}
const map = document.getElementById('ytMap');
const view = document.getElementById('ytView');
const range = document.getElementById('ytRange');
const say = document.getElementById('ytSay');
function sayFor(deg) {
  if (deg >= 75) return '正对着杨桃的一端：像一颗五角星！';
  if (deg <= 25) return '从侧面看：就是平时看到的杨桃。';
  return '斜着看：一半像杨桃，一半像星星。';
}
function sitAt(i, extra = '') {
  const p = SEATS[i];
  const deg = seatDeg(p);
  map.querySelectorAll('.yt-seat').forEach((g) => g.classList.toggle('sit', +g.dataset.i === i));
  map.querySelector('.yt-sight').setAttribute('d', `M${p[0]} ${p[1]}L${DESK[0]} ${DESK[1]}`);
  animateFruit(view, deg, (d) => { range.value = Math.round(d); });
  say.textContent = extra || sayFor(deg);
}
if (map) {
  buildMap(map);
  setFruit(view, 20);
  map.addEventListener('click', (e) => {
    const seat = e.target.closest('.yt-seat');
    if (seat) sitAt(+seat.dataset.i);
  });
  range.addEventListener('input', () => {
    setFruit(view, +range.value);
    map.querySelectorAll('.yt-seat').forEach((g) => g.classList.remove('sit'));
    map.querySelector('.yt-sight').setAttribute('d', '');
    say.textContent = sayFor(+range.value);
  });
}
const VIEW_STEPS = [
  null,
  [0, '“我”的座位：前排靠边，杨桃的一端正对着我——像五角星！'],
  [6, '同学们的座位：从侧面看，就是平时看到的杨桃。'],
  [0, '同学们轮流坐到“我”的座位上：“像……五……五角星。”'],
];

/* ================= 分角色读 ================= */
document.querySelectorAll('.yt-roles').forEach((bar) => {
  const slide = bar.closest('.slide');
  bar.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-role]');
    if (!btn) return;
    const role = btn.dataset.role;
    bar.querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', b === btn && !!role));
    slide.querySelectorAll('.yt-line, .yt-in').forEach((el) => el.classList.remove('lit', 'dim'));
    if (!role) return;
    slide.querySelectorAll('.yt-line').forEach((el) => {
      const has = el.classList.contains(role) || el.querySelector(`.yt-in.${role}`);
      el.classList.add(has ? 'lit' : 'dim');
    });
  });
});

/* ================= 读好语气 ================= */
const TONES = [
  { who: '老师', s: '“画杨桃画成了五角星，好笑吗？”', opts: ['严肃地问', '笑眯眯地问'], a: 0, tip: '老师神情严肃，读得慢一点、沉一点。' },
  { who: '同学', s: '“好——笑！”', opts: ['拖长声音，满不在乎', '小小声，很害怕'], a: 0, tip: '破折号表示声音拖长：好——笑！' },
  { who: '同学', s: '“不……像。”', opts: ['大声，很肯定', '吞吞吐吐，不好意思'], a: 1, tip: '省略号表示说话断断续续，他发现自己笑错了。' },
  { who: '同学', s: '“像……五……五角星。”', opts: ['吞吞吐吐，不好意思', '又快又响'], a: 0, tip: '一顿一顿地读：像……五……五角星。' },
  { who: '老师', s: '“看的角度不同，杨桃的样子也就不一样。”', opts: ['生气地批评', '和颜悦色地讲'], a: 1, tip: '和颜悦色：语气亲切、温和，像在和大家讲道理。' },
];
function initTones(box) {
  box.innerHTML = TONES.map((it, i) => `<div class="yt-tone" data-i="${i}"><span class="yt-who ${it.who === '老师' ? 'tch' : 'kid'}">${it.who}</span>
    <p>${it.s}</p><div class="yt-tb">${it.opts.map((o, k) => `<button type="button" class="btn" data-a="${k}">${o}</button>`).join('')}</div><small></small></div>`).join('');
  box.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-a]');
    if (!btn) return;
    const row = btn.closest('.yt-tone');
    const it = TONES[+row.dataset.i];
    if (+btn.dataset.a !== it.a) { row.classList.remove('no'); void row.offsetWidth; row.classList.add('no'); return; }
    row.classList.add('ok');
    btn.classList.add('solid');
    row.querySelector('small').textContent = it.tip;
  });
}
const tones = document.getElementById('ytTones');
if (tones) initTones(tones);

/* ================= 开火车 ================= */
const train = document.getElementById('ytTrain');
if (train) {
  const trSay = document.getElementById('ytTrSay');
  train.addEventListener('click', (e) => {
    const car = e.target.closest('.yt-car');
    if (!car) return;
    car.classList.remove('go'); void car.offsetWidth; car.classList.add('go');
    const words = [...car.querySelectorAll('span')].map((s) => s.textContent).join('、');
    trSay.textContent = `“${car.querySelector('b').textContent}”字车厢：${words}`;
    const n = train.querySelectorAll('.yt-car.go').length;
    if (n === 4) trSay.textContent += '——四节车厢都上车啦，开火车读一遍！';
  });
}

/* ================= 识字游戏：点亮五角星 ================= */
const STAR_Q = [
  { q: 'kào', ans: '靠', opts: ['告', '靠', '造'] },
  { q: 'ér', ans: '而', opts: ['而', '面', '耐'] },
  { q: 'bān', ans: '班', opts: ['斑', '般', '班'] },
  { q: 'dào', ans: '倒', opts: ['到', '倒', '例'] },
  { q: 'shěn', ans: '审', opts: ['审', '申', '宙'] },
  { q: 'sù', ans: '肃', opts: ['隶', '肃', '康'] },
  { q: 'shǎng', ans: '晌', opts: ['响', '尚', '晌'] },
  { q: 'qiǎng', ans: '抢', opts: ['抢', '枪', '仓'] },
  { q: 'yuè', ans: '悦', opts: ['说', '悦', '脱'] },
  { q: 'huì', ans: '诲', opts: ['诲', '悔', '海'] },
];
const P5 = (r, k, off) => {
  const a = -Math.PI / 2 + ((k * 2 + off) * Math.PI) / 5;
  return [70 + Math.cos(a) * r, 70 + Math.sin(a) * r];
};
const starTips = () => Array.from({ length: 5 }, (_, k) => {
  const pts = [P5(26, k - 1, 1), P5(64, k, 0), P5(26, k, 1)];
  return `<polygon class="yt-tip" points="${pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ')}"/>`;
}).join('');
const starCenter = () => `<polygon class="yt-core" points="${Array.from({ length: 5 }, (_, k) => P5(26, k, 1).map((v) => v.toFixed(1)).join(',')).join(' ')}"/>`;
function initStars(box) {
  let i = 0;
  let busy = false;
  box.innerHTML = `<div class="yt-sky">${[0, 1].map((s) => `<svg viewBox="0 0 140 140" class="yt-bigstar" data-s="${s}">${starCenter()}${starTips()}</svg>`).join('')}</div><div class="yt-gask"></div>`;
  const ask = box.querySelector('.yt-gask');
  const tips = [...box.querySelectorAll('.yt-tip')];
  const show = () => {
    const it = STAR_Q[i];
    ask.innerHTML = `<p class="yt-q hz-latin">${it.q}</p>
      <div class="yt-opts">${it.opts.map((o) => `<button type="button" class="yt-opt" data-o="${o}">${o}</button>`).join('')}</div>
      <p class="yt-msg">${i ? '' : '哪个字读这个音？'}</p>`;
    busy = false;
  };
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-again]')) {
      i = 0;
      tips.forEach((t) => t.classList.remove('lit'));
      box.querySelectorAll('.yt-bigstar').forEach((s) => s.classList.remove('full'));
      show();
      return;
    }
    const opt = e.target.closest('.yt-opt');
    if (!opt || busy) return;
    const msg = box.querySelector('.yt-msg');
    if (opt.dataset.o !== STAR_Q[i].ans) {
      opt.classList.remove('wrong'); void opt.offsetWidth; opt.classList.add('wrong');
      msg.textContent = '再看看，这个字不读这个音';
      return;
    }
    busy = true;
    opt.classList.add('right');
    tips[i].classList.add('lit');
    if (i % 5 === 4) box.querySelectorAll('.yt-bigstar')[Math.floor(i / 5)].classList.add('full');
    msg.textContent = `亮了一个角！${STAR_Q[i].ans}（${STAR_Q[i].q}）`;
    setTimeout(() => {
      i += 1;
      if (i < STAR_Q.length) { show(); return; }
      ask.innerHTML = '<p class="yt-q">两颗五角星都亮起来啦！</p><button type="button" class="btn solid" data-again>再玩一次</button>';
    }, 1100);
  });
  show();
}
const stars = document.getElementById('ytStars');
if (stars) initStars(stars);

Hanzi.init({
  cards: [
    { z: '室', py: 'shì', words: [['教室', 'jiào shì'], ['室内', 'shì nèi']] },
    { z: '靠', py: 'kào', words: [['靠边', 'kào biān'], ['依靠', 'yī kào']] },
    { z: '而', py: 'ér', words: [['而且', 'ér qiě'], ['反而', 'fǎn ér']] },
    { z: '班', py: 'bān', words: [['班里', 'bān lǐ'], ['班级', 'bān jí']] },
    { z: '哈', py: 'hā', words: [['哈哈大笑', 'hā hā dà xiào']] },
    { z: '倒', py: 'dào', words: [['倒不如', 'dào bù rú'], ['倒过来', 'dào guò lái']] },
    { z: '审', py: 'shěn', words: [['审视', 'shěn shì']] },
    { z: '页', py: 'yè', words: [['那页画纸', 'nà yè huà zhǐ'], ['书页', 'shū yè']] },
    { z: '肃', py: 'sù', words: [['严肃', 'yán sù']] },
    { z: '晌', py: 'shǎng', words: [['半晌', 'bàn shǎng']] },
    { z: '抢', py: 'qiǎng', words: [['抢着', 'qiǎng zhe'], ['抢先', 'qiǎng xiān']] },
    { z: '嘻', py: 'xī', words: [['嘻嘻', 'xī xī'], ['笑嘻嘻', 'xiào xī xī']] },
    { z: '悦', py: 'yuè', words: [['和颜悦色', 'hé yán yuè sè'], ['喜悦', 'xǐ yuè']] },
    { z: '诲', py: 'huì', words: [['教诲', 'jiào huì']] },
  ],
  write: {
    a: [
      { z: '图', py: 'tú', bs: '囗', bh: 8 },
      { z: '课', py: 'kè', bs: '讠', bh: 10 },
      { z: '摆', py: 'bǎi', bs: '扌', bh: 13 },
      { z: '座', py: 'zuò', bs: '广', bh: 10 },
      { z: '室', py: 'shì', bs: '宀', bh: 9 },
    ],
    b: [
      { z: '交', py: 'jiāo', bs: '亠', bh: 6 },
      { z: '哈', py: 'hā', bs: '口', bh: 9 },
      { z: '页', py: 'yè', bs: '页', bh: 6 },
      { z: '抢', py: 'qiǎng', bs: '扌', bh: 7 },
      { z: '嘻', py: 'xī', bs: '口', bh: 15 },
    ],
  },
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (coverFruit && slide.contains(coverFruit)) animateFruit(coverFruit, step >= 2 ? 14 : 90);
    if (map && slide.contains(map) && VIEW_STEPS[step]) sitAt(...VIEW_STEPS[step]);
  },
};
