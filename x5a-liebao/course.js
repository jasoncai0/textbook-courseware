'use strict';
/* 什么比猎豹的速度更快 · 本课数据与互动。分类、选一选、写作框用 ../shared/narrative.js，提速小工具见 speed.js，翻页引擎见 ../shared/deck.js
 * 本课专属：段首句猜段意、速度条形图（每加一级重新定刻度）、光绕赤道动画、按快慢排序。
 */

/* 课后第 1 题：读得快，还要读得懂（有“陷阱”选项） */
const PICKS = {
  know: [
    { t: '鸵鸟是两条腿的动物里奔跑的世界冠军', ok: true, why: '第 2 段' },
    { t: '猎豹是陆地上跑得最快的动物', ok: true, why: '第 3 段' },
    { t: '游隼向下俯冲时，比任何一种动物奔跑时都快', ok: true, why: '第 4 段' },
    { t: '光的速度比流星体快几千倍', ok: true, why: '第 8 段' },
    { t: '游隼比喷气式飞机飞得还快', ok: false, why: '“游隼还是没有飞机飞行的速度快”' },
    { t: '火箭进入太空后，关掉发动机就停下来了', ok: false, why: '“仍可以继续前进”' },
    { t: '流星体是人们能见到的速度最快的物体', ok: false, why: '“还有比流星体运动速度快得多的东西”' },
    { t: '猎豹跑得比汽车在高速公路上还快', ok: false, why: '课文说的是游隼俯冲比汽车快两到三倍' },
  ],
};

/* 课后第 1 题：段首句 → 这一段讲什么 */
const GUESS = [
  { n: 2, s: '人在奋力奔跑的时候，最大速度能够达到 44 千米每小时。这个速度跟鸵鸟比起来差远了……', a: '鸵鸟比人快' },
  { n: 3, s: '比鸵鸟跑得更快的动物就要数猎豹了。', a: '猎豹比鸵鸟快' },
  { n: 4, s: '但是游隼向下俯冲时的速度更快，超过 320 千米每小时。', a: '游隼比猎豹快' },
  { n: 5, s: '不过，游隼还是没有飞机飞行的速度快。', a: '喷气式飞机比游隼快' },
  { n: 6, s: '乘坐喷气式飞机去旅行，速度绝对是够快的了。但是，如果你想到月球上去，就需要搭乘速度更快的工具了。', a: '火箭比喷气式飞机快' },
  { n: 7, s: '看！前面呼啸而过的东西是什么？', a: '流星体比火箭快' },
  { n: 8, s: '现在，你一定会认为流星体是人们所能见到的速度最快的物体。不过，还有比流星体运动速度快得多的东西……', a: '光比流星体快' },
];

function initGuess(box) {
  box.innerHTML = GUESS.map((g) => `<button class="guess-row" type="button"><em>第 ${g.n} 段</em><span>${g.s}</span><b>${g.a}</b></button>`).join('');
  box.addEventListener('click', (e) => {
    const row = e.target.closest('.guess-row');
    if (row) row.classList.toggle('open');
  });
}

/* 速度阶梯：千米每小时。喷气式飞机课文只说“声速的数倍”，按 3 倍示意；光约 30 万千米每秒 = 10.8 亿千米每小时 */
const SOUND = 1050;
const LIGHT_KMH = 300000 * 3600;
const SPEEDS = [
  { name: '人', v: 44, label: '44', note: '最大速度' },
  { name: '鸵鸟', v: 72, label: '约 72', note: '两条腿动物的世界冠军' },
  { name: '猎豹', v: 110, label: '可达 110', note: '陆地上跑得最快' },
  { name: '游隼', v: 320, label: '超过 320', note: '俯冲 · 汽车的两到三倍' },
  { name: '喷气式飞机', v: SOUND * 3, label: '声速的数倍', note: '声速约 1050', rough: true },
  { name: '火箭', v: 40000, label: '4 万', note: '声速的 30 多倍' },
  { name: '流星体', v: 250000, label: '25 万', note: '火箭的 6 倍多' },
  { name: '光', v: LIGHT_KMH, label: '约 30 万千米每秒', note: '比流星体快几千倍', off: true },
];
const fmt = (v) => (v >= 10000 ? `${v / 10000} 万` : `${v}`);

function initBars(box) {
  box.innerHTML = SPEEDS.map((s, i) => `<div class="speed-row${s.rough ? ' rough' : ''}${s.off ? ' off' : ''}" data-step="${i + 1}">
    <span class="nm">${s.name}</span><div class="track"><i></i></div><span class="val">${s.label}<small>${s.note}</small></span></div>`).join('');
}

function updateBars(slide, step) {
  const shown = SPEEDS.slice(0, Math.max(1, step)).filter((s) => !s.off);
  const max = Math.max(...shown.map((s) => s.v));
  slide.querySelectorAll('.speed-row').forEach((row, i) => {
    const s = SPEEDS[i];
    const pct = s.off ? 100 : Math.max(.4, s.v / max * 100);
    row.querySelector('i').style.width = i < step ? `${pct}%` : '0';
  });
  const lightOn = step >= SPEEDS.length;
  document.getElementById('barAxis').innerHTML = lightOn
    ? `刻度：0 — ${fmt(max)} 千米每小时　<b>光的条画不下：要再画长四千多倍</b>`
    : `刻度：0 — ${fmt(max)} 千米每小时`;
}

/* 光绕赤道：30 万千米 ÷ 约 4 万千米 ≈ 7.5 圈 */
const LAPS = 7.5;
const LIGHT_R = { x: 150, y: 34 };
let lightRaf = null;

function placePhoton(angle) {
  const p = document.getElementById('photon');
  p.setAttribute('cx', (300 + LIGHT_R.x * Math.cos(angle)).toFixed(1));
  p.setAttribute('cy', (200 + LIGHT_R.y * Math.sin(angle)).toFixed(1));
  // 转到地球背面时变淡
  p.setAttribute('opacity', Math.sin(angle) < 0 ? '.35' : '1');
}

function runLight(slow) {
  cancelAnimationFrame(lightRaf);
  const dur = 1000 * slow;
  const t0 = performance.now();
  const tick = (now) => {
    const t = Math.min(1, (now - t0) / dur);
    const laps = LAPS * t;
    placePhoton(laps * 2 * Math.PI + Math.PI / 2);
    document.getElementById('lapText').textContent = `第 ${Math.min(8, Math.floor(laps) + 1)} 圈`;
    document.getElementById('timeText').textContent = `光跑了 ${(t).toFixed(2)} 秒${slow > 1 ? `（慢放 ${slow} 倍）` : ''}`;
    if (t < 1) lightRaf = requestAnimationFrame(tick);
    else document.getElementById('lapText').textContent = '一秒钟：7 圈多！';
  };
  lightRaf = requestAnimationFrame(tick);
}

function initLight(svg) {
  svg.querySelector('.far-stars').innerHTML = Array.from({ length: 90 }, (_, i) =>
    `<circle cx="${(i * 97) % 600}" cy="${(i * 61) % 400}" r="${(.6 + (i % 4) * .4).toFixed(1)}" fill="#fff" opacity="${(.3 + (i % 5) * .14).toFixed(2)}"/>`).join('');
  placePhoton(Math.PI / 2);
  svg.closest('.slide').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-light]');
    if (btn) runLight(+btn.dataset.light);
  });
}

/* 课后第 2 题：按快慢排序（课本顺序出示，序号 1 = 最快） */
const SHOWN = ['光', '游隼', '火箭', '猎豹', '人', '流星体', '鸵鸟', '喷气式飞机'];
const FAST_TO_SLOW = ['光', '流星体', '火箭', '喷气式飞机', '游隼', '猎豹', '鸵鸟', '人'];

function initOrder(box) {
  let next = 1; // 光已经填好
  box.innerHTML = SHOWN.map((t) => `<button class="order-card${t === '光' ? ' right' : ''}" type="button" data-t="${t}"><span>${t}</span><em>${t === '光' ? 1 : ''}</em></button>`).join('');
  box.addEventListener('click', (e) => {
    const card = e.target.closest('.order-card');
    if (!card || card.classList.contains('right')) return;
    card.classList.remove('wrong');
    void card.offsetWidth; // 重新触发抖动动画
    if (card.dataset.t === FAST_TO_SLOW[next]) {
      next += 1;
      card.classList.add('right');
      card.querySelector('em').textContent = next;
      document.getElementById('orderDone').hidden = next < FAST_TO_SLOW.length;
    } else {
      card.classList.add('wrong');
    }
  });
}

/* 课后第 3 题：提出问题 */
const MOMENTS = [
  {
    name: '声音追不上他？', pic: 'feiji',
    prompt: '为什么对着一个以超音速移动的人大喊，他什么都听不见？',
    hint: '带着问题再读第 5 段：声音传播的速度是多少？高速喷气式飞机的速度是声速的几倍？',
    example: '声音每小时大约只能传 1050 千米，而高速喷气式飞机的速度是声速的数倍。人跑在声音前面，声音还没传到，他已经飞走了，所以听不见。',
  },
  {
    name: '关掉发动机还能走？', pic: 'liuxing',
    prompt: '火箭进入太空之后，即使关掉发动机，为什么仍可以继续前进？',
    hint: '课文没有直接回答，可以查资料：太空中有没有空气？没有东西挡着，会怎样？',
    example: '太空中几乎没有空气，没有什么东西阻挡火箭，所以它关掉发动机后还会保持原来的速度继续前进。（答案来自科普资料，课文里没有。）',
  },
  {
    name: '一秒绕赤道 7 圈多？', pic: 'liuxing',
    prompt: '光一秒钟怎么能沿着地球赤道转 7 圈多？',
    hint: '查一查：地球赤道一圈大约多长？再用光一秒钟走的路程去除。',
    example: '地球赤道一圈约 4 万千米，光一秒钟大约走 30 万千米。30 万 ÷ 4 万 = 7.5，所以光一秒钟能绕赤道 7 圈多。',
  },
  {
    name: '我的问题', pic: 'yousun',
    prompt: '你还有什么感兴趣的或不懂的问题？写下来，带着它再读一读课文。',
    hint: '可以问“为什么”，也可以问“还有什么”：比如，还有比光更快的东西吗？游隼为什么俯冲得那么快？',
    example: '我的问题：游隼平时飞得快吗？为什么向下俯冲时那么快？——再读第 4 段，我发现课文强调的是“向下俯冲时”的速度。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ picks: PICKS, moments: MOMENTS });
    Speed.init();
    initGuess(document.getElementById('guess'));
    initBars(document.getElementById('bars'));
    initLight(document.getElementById('light'));
    initOrder(document.getElementById('order'));
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    Speed.onRender(slide);
    if (slide.classList.contains('s-bars')) updateBars(slide, step);
    if (!slide.classList.contains('s-light')) cancelAnimationFrame(lightRaf);
  },
};
