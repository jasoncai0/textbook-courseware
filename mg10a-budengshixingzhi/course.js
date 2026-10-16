'use strict';
/* 高一上 3.1 不等式的基本性质 · 本课互动：作差数轴图、数轴变换器（同加 / 同乘 c）、同向不等式反例检验器。通用部分见 ../shared/math.js */
const { board, slider, fmt } = MathKit;
const $ = (id) => document.getElementById(id);
const num = (v, d = 2) => fmt(v, d).replace('-', '−'); // 显示用真正的减号
const relOf = (l, r) => (Math.abs(l - r) < 1e-9 ? '=' : l > r ? '>' : '<');
const REL_TXT = { '>': '＞', '<': '＜', '=': '＝' };

/* 数轴：在 y 处画一条带箭头、刻度的数轴 */
function numberLine(b, y, from, to, labelEvery) {
  b.seg([[from, y], [to, y]], { cls: 'nl-ax' });
  b.poly([[to + 0.5, y], [to, y + 0.18], [to, y - 0.18]], { cls: 'nl-arrow' });
  for (let x = Math.ceil(from); x <= to; x += 1) {
    b.seg([[x, y - 0.1], [x, y + 0.1]], { cls: x === 0 ? 'nl-ax' : 'nl-tick' });
    if (x % labelEvery === 0) b.text([x, y], num(x), { cls: 'tk', dy: 22 }).setAttribute('text-anchor', 'middle');
  }
}
const label = (node) => { node.setAttribute('text-anchor', 'middle'); return node; };

/* 第 3 页：a 在 b 的右边，a − b 是正的距离 */
function initFact() {
  const A = 2;
  const B = -1;
  const b = board($('fact'), { x: [-4.6, 5], y: [-1.2, 1.4], axes: false, grid: false, w: 560 });
  numberLine(b, 0, -4.5, 4.5, 1);
  b.seg([[B, 0.62], [A, 0.62]], { cls: 'c2' });
  b.seg([[B, 0.5], [B, 0.74]], { cls: 'c2' });
  b.seg([[A, 0.5], [A, 0.74]], { cls: 'c2' });
  label(b.text([(A + B) / 2, 0.62], 'a − b = 3 > 0', { cls: 'lb up', dy: -10 }));
  b.pt([B, 0], { r: 7 });
  b.pt([A, 0], { cls: 'c2', r: 7 });
  label(b.text([B, 0], 'b', { dy: -14 }));
  label(b.text([A, 0], 'a', { dy: -14 }));
  b.update();
}

/* 第 6 页：数轴变换器。上轴是原来的 a、b（可拖动，保持 a > b），下轴是两边同加 / 同乘 c 之后的位置 */
// 手机上画板窄，文字按屏幕像素算会挤在一起：拉开两条数轴的间距、刻度数字隔 5 标一个
const IS_PHONE = window.matchMedia('(max-width: 820px), (max-height: 520px)').matches;
const TF = {
  MIN: -4, MAX: 4, GAP: 0.5, ANIM_MS: 1400,
  ...(IS_PHONE ? { TOP: 2.4, LOW: -3.2, Y: [-6.2, 4.8], EVERY: 5 } : { TOP: 1.05, LOW: -1.15, Y: [-2.3, 2.1], EVERY: 2 }),
};
const snap = (x) => Math.round(x * 2) / 2;
const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));

function tfAfter(s, v, t) {
  // 加 c：平移 c·t；乘 c：伸缩因子 1 + (c − 1)t，两点同一时刻经过原点，所以“翻转”是同时发生的
  return s.op === 'add' ? v + s.c * t : v * (1 + (s.c - 1) * t);
}

function tfReadout(s) {
  const opTxt = s.op === 'add' ? ['<i>a</i> + <i>c</i>', '<i>b</i> + <i>c</i>'] : ['<i>ac</i>', '<i>bc</i>'];
  const ra = s.op === 'add' ? s.a + s.c : s.a * s.c;
  const rb = s.op === 'add' ? s.b + s.c : s.b * s.c;
  const rel = relOf(ra, rb);
  $('tfBefore').innerHTML = `原来：<i>a</i> = ${num(s.a)}，<i>b</i> = ${num(s.b)}，<b><i>a</i> ＞ <i>b</i></b>；<i>c</i> = ${num(s.c)}`;
  const verdict = { '>': '不等号方向<b>不变</b>', '<': '不等号方向<b>改变</b>！', '=': '两边变成<b>相等</b>（乘 0）' }[rel];
  const box = $('tfAfter');
  box.className = `tip feedback ${rel === '>' ? 'fb-ok' : 'fb-warn'}`;
  box.innerHTML = `变换后：${opTxt[0]} = ${num(ra)}，${opTxt[1]} = ${num(rb)}，<b>${opTxt[0]} ${REL_TXT[rel]} ${opTxt[1]}</b>　→　${verdict}`;
}

function initTransformer() {
  const s = { a: 3, b: 1, c: 2, op: 'add', t: 1 };
  const b = board($('tf'), { x: [-10.8, 11.2], y: TF.Y, axes: false, grid: false, w: 900 });
  numberLine(b, TF.TOP, -10.5, 10.5, TF.EVERY);
  numberLine(b, TF.LOW, -10.5, 10.5, TF.EVERY);
  label(b.text([-10.5, TF.TOP], '原来', { cls: 'lb up tf-tag', dy: IS_PHONE ? -30 : -16 })).setAttribute('text-anchor', 'start');
  label(b.text([-10.5, TF.LOW], () => (s.op === 'add' ? '两边加 c' : '两边乘 c'), { cls: 'lb up tf-tag', dy: IS_PHONE ? -30 : -16 })).setAttribute('text-anchor', 'start');
  const lowX = (v) => tfAfter(s, v, s.t);
  b.seg(() => [[s.a, TF.TOP], [lowX(s.a), TF.LOW]], { cls: 'dash tf-link-a' });
  b.seg(() => [[s.b, TF.TOP], [lowX(s.b), TF.LOW]], { cls: 'dash tf-link-b' });
  b.pt(() => [s.a, TF.LOW], { hollow: true, r: 5, show: () => s.t > 0 });
  b.pt(() => [s.b, TF.LOW], { hollow: true, r: 5, show: () => s.t > 0 });
  b.pt(() => [lowX(s.a), TF.LOW], { cls: 'c2', r: 8 });
  b.pt(() => [lowX(s.b), TF.LOW], { cls: 'tf-b', r: 8 });
  const names = () => (s.op === 'add' ? ['a+c', 'b+c'] : ['ac', 'bc']);
  label(b.text(() => [lowX(s.a), TF.LOW], () => names()[0], { cls: 'lb tf-na', dy: -16 }));
  label(b.text(() => [lowX(s.b), TF.LOW], () => names()[1], { cls: 'lb tf-nb', dy: 44 }));
  label(b.text(() => [s.a, TF.TOP], 'a', { cls: 'lb tf-na', dy: -18 }));
  label(b.text(() => [s.b, TF.TOP], 'b', { cls: 'lb tf-nb', dy: -18 }));
  b.drag(() => [s.b, TF.TOP], (x) => { s.b = clamp(snap(x), TF.MIN, s.a - TF.GAP); s.t = 1; });
  b.drag(() => [s.a, TF.TOP], (x) => { s.a = clamp(snap(x), s.b + TF.GAP, TF.MAX); s.t = 1; });
  b.onUpdate = () => tfReadout(s);

  let raf = 0;
  const play = () => {
    cancelAnimationFrame(raf);
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / TF.ANIM_MS);
      s.t = p < 0.5 ? 2 * p * p : 1 - 2 * (1 - p) * (1 - p); // 缓入缓出
      b.update();
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  };
  $('tfOps').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-op]');
    if (!btn) return;
    s.op = btn.dataset.op;
    $('tfOps').querySelectorAll('[data-op]').forEach((x) => x.classList.toggle('solid', x === btn));
    play();
  });
  $('tfPlay').addEventListener('click', play);
  slider($('tfC'), (v) => { s.c = v; s.t = 1; $('tfCV').textContent = num(v, 1); b.update(); });
  return { play, isOnSlide: (slide) => slide.contains($('tf')) };
}

/* 第 9 页：同向不等式的反例检验器 */
const CE_PRESETS = { pos: [5, 2, 4, 1], neg: [1, -2, -1, -3], zero: [3, 1, 0, -2] };
const CE_ROWS = [
  { key: 'add', tex: ['a+c', 'b+d'], f: ({ a, b, c, d }) => [a + c, b + d], tag: '性质 5' },
  { key: 'sub', tex: ['a−c', 'b−d'], f: ({ a, b, c, d }) => [a - c, b - d], tag: '练习 1(2)' },
  { key: 'mul', tex: ['ac', 'bd'], f: ({ a, b, c, d }) => [a * c, b * d], tag: '练习 1(3)' },
  { key: 'sq', tex: ['ac²', 'bc²'], f: ({ a, b, c }) => [a * c * c, b * c * c], tag: '练习 1(1)' },
];
const CE_RANGE = 6;
const randInt = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
function randPair() {
  const hi = randInt(-CE_RANGE + 1, CE_RANGE);
  return [hi, randInt(-CE_RANGE, hi - 1)];
}

function initCounter() {
  const tally = { n: 0, fail: { add: 0, sub: 0, mul: 0, sq: 0 } };
  const show = ([a, b, c, d]) => {
    const v = { a, b, c, d };
    tally.n += 1;
    $('ceNow').innerHTML = `<i>a</i> = ${num(a)}，<i>b</i> = ${num(b)}；<i>c</i> = ${num(c)}，<i>d</i> = ${num(d)}`;
    const rows = CE_ROWS.map((r) => {
      const [l, rr] = r.f(v);
      const rel = relOf(l, rr);
      if (rel !== '>') tally.fail[r.key] += 1;
      const ok = rel === '>';
      return `<tr class="${ok ? 'ok' : 'no'}"><td><i>${r.tex[0]}</i> ? <i>${r.tex[1]}</i><small>${r.tag}</small></td><td>${num(l)} ${REL_TXT[rel]} ${num(rr)}</td><td>${ok ? '✓ 同向' : '✗ 不成立'}</td></tr>`;
    });
    $('ceTab').innerHTML = `<tr><th>结论</th><th>代入</th><th>与原不等式同向？</th></tr>${rows.join('')}`;
    const fails = CE_ROWS.map((r) => `<i>${r.tex[0]}</i> &gt; <i>${r.tex[1]}</i> 失败 <b>${tally.fail[r.key]}</b> 次`).join('；');
    $('ceTally').innerHTML = `已试 ${tally.n} 组：${fails}`;
  };
  document.querySelector('.ce-btns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-ce]');
    if (btn) show(CE_PRESETS[btn.dataset.ce]);
  });
  $('ceRand').addEventListener('click', () => show([...randPair(), ...randPair()]));
  show(CE_PRESETS.pos);
}

let transformer = null;
window.LESSON = {
  init() {
    initFact();
    transformer = initTransformer();
    initCounter();
  },
  // 翻到数轴变换器这一页时自动演示一次
  onRender(slide, step) {
    if (step === 0 && transformer && transformer.isOnSlide(slide)) transformer.play();
  },
};
