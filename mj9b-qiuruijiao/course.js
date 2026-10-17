'use strict';
/* 九下 7.4 由三角函数值求锐角 · 本课互动：由值造角（按比值精确作直角三角形）、秋千摆角、反三角计算器。 */
const { slider, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const RAD = Math.PI / 180;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];

/* 第 3 页：已知 sin / cos / tan 的值，作出直角三角形，量出角 */
const RANGE = { sin: [0.05, 0.95, 0.385], cos: [0.05, 0.95, 0.5], tan: [0.1, 2.8, 1] };
function initMaker() {
  const s = { f: 'sin', v: 0.385 };
  const R = 4; // sin、cos：斜边取 1（画成 4 格）
  const U = 1.4; // tan：邻边取 1（画成 1.4 格）
  const ang = () => ({ sin: Math.asin, cos: Math.acos, tan: Math.atan }[s.f](s.v));
  const P = () => {
    const t = ang();
    if (s.f === 'tan') return { A: [0, 0], C: [U, 0], B: [U, U * s.v] };
    return { A: [0, 0], C: [R * Math.cos(t), 0], B: [R * Math.cos(t), R * Math.sin(t)] };
  };
  const b = Geo.board($('mk'), { x: [-0.8, 4.8], y: [-0.9, 4.3], w: 520 });
  const seg = { AB: b.seg(() => [P().A, P().B], { cls: 'gs' }), BC: b.seg(() => [P().B, P().C], { cls: 'gs' }), AC: b.seg(() => [P().A, P().C], { cls: 'gs' }) };
  b.seg([[-0.6, 0], [4.6, 0]], { cls: 'thin' });
  Geo.right(b, () => P().C, () => P().A, () => P().B, { s: 0.22 });
  Geo.arc(b, () => P().A, () => P().C, () => P().B, { r: 0.7, label: () => `${(ang() / RAD).toFixed(1)}°`, lr: 1.9, cls: 'garc on' });
  b.text(() => P().A, 'A', { dx: -22, dy: 8 }); b.text(() => P().B, 'B', { dx: 6, dy: -4 }); b.text(() => P().C, 'C', { dx: 6, dy: 22 });
  const lab = { sin: { BC: () => fmt(s.v, 3), AB: '1' }, cos: { AC: () => fmt(s.v, 3), AB: '1' }, tan: { BC: () => fmt(s.v, 3), AC: '1' } };
  const L = (n) => () => { const t = lab[s.f][n]; return t === undefined ? '' : (typeof t === 'function' ? t() : t); };
  b.text(() => mid(P().A, P().B), L('AB'), { cls: 'lb up gnum', dx: -30, dy: -10 });
  b.text(() => mid(P().B, P().C), L('BC'), { cls: 'lb up gnum', dx: 8, dy: 6 });
  b.text(() => mid(P().A, P().C), L('AC'), { cls: 'lb up gnum', dx: -16, dy: 26 });
  const USE = { sin: ['BC', 'AB'], cos: ['AC', 'AB'], tan: ['BC', 'AC'] };
  b.onUpdate = () => {
    const [num, den] = USE[s.f];
    Object.entries(seg).forEach(([n, node]) => node.setAttribute('class', n === num ? 'gl so' : n === den ? 'gl sa' : 'gs'));
    $('mkV').textContent = fmt(s.v, 3);
    $('mkMsg').innerHTML = `已知 $\\${s.f} A=${fmt(s.v, 3)}$，作出的直角三角形中 $\\angle A\\approx${(ang() / RAD).toFixed(2)}^\\circ$`;
    tex($('mkMsg'));
  };
  const inp = $('mkS');
  $('mkBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-f]');
    if (!btn) return;
    s.f = btn.dataset.f;
    const [lo, hi, v0] = RANGE[s.f];
    inp.min = lo; inp.max = hi; inp.value = v0; s.v = v0;
    $('mkBtns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    b.update();
  });
  slider(inp, (v) => { s.v = v; b.update(); });
}

/* 第 7 页：秋千 OA = 3.5 m，摆到 OA′ 时升高 AB = 3.5(1 − cos∠AOA′) */
function initSwing() {
  const s = { th: 30 };
  const L = 3.5;
  const O = [0, L];
  const A = [0, 0];
  const Ap = () => [-L * Math.sin(s.th * RAD), L - L * Math.cos(s.th * RAD)];
  const B = () => [0, Ap()[1]];
  const b = Geo.board($('swing'), { x: [-3.9, 1.4], y: [-0.6, 4.1], w: 420 });
  b.seg([[-0.5, L], [0.5, L]], { cls: 'gs' });
  b.seg([O, A], { cls: 'gs' });
  b.curve((t) => [-L * Math.sin(t * RAD), L - L * Math.cos(t * RAD)], 0, () => s.th, { cls: 'dash' });
  b.seg(() => [O, Ap()], { cls: 'gl c-b' });
  b.seg(() => [Ap(), B()], { cls: 'dash' });
  b.seg(() => [B(), A], { cls: 'gl so' });
  Geo.right(b, B, Ap, O, { s: 0.16 });
  Geo.arc(b, O, A, Ap, { r: 0.55, show: () => s.th > 2 });
  b.pt(Ap, { r: 6, cls: 'c2' });
  b.text(O, 'O', { dx: 8, dy: -4 }); b.text(A, 'A', { dx: 8, dy: 18 }); b.text(Ap, 'A′', { dx: -26, dy: 6 }); b.text(B, 'B', { dx: 8, dy: 6 });
  b.text(() => mid(B(), A), () => `${fmt(L - L * Math.cos(s.th * RAD))} m`, { cls: 'lb up so-t', dx: 10, dy: 6 });
  b.onUpdate = () => {
    const rise = L - L * Math.cos(s.th * RAD);
    $('swV').textContent = `${fmt(s.th, 1)}°`;
    const ok = Math.abs(rise - 1) < 0.01;
    $('swMsg').className = `tip feedback ${ok ? 'fb-ok' : ''}`;
    $('swMsg').textContent = ok ? `升高 ${rise.toFixed(3)} m ≈ 1 m：摆角约 ${fmt(s.th, 1)}°。用 cos∠AOA′ = 2.5 / 3.5 算一算！` : `A′ 比 A 升高了 ${rise.toFixed(2)} m。拖到升高 1 m 时，摆角约是多少？`;
  };
  slider($('swS'), (v) => { s.th = v; b.update(); });
}

function initSketches() {
  const r15 = Math.sqrt(15);
  Geo.sketch($('ex1a'), { P: { A: [0, 0], C: [1.5, 0], B: [1.5, 1.5 * r15] }, seg: 'AB BC CA', right: [['C', 'A', 'B']], ang: [['A', 'C', 'B', '', 0.6]], text: [[[0.75, 0], '1', -4, 22], [[0.75, 0.75 * r15], '4', -18, -2]], w: 300, pad: 0.5 });
  Geo.sketch($('ex1b'), { P: { A: [0, 0], C: [2, 0], B: [2, 4] }, seg: 'AB BC CA', right: [['C', 'A', 'B']], ang: [['A', 'C', 'B', '', 0.6]], text: [[[1, 0], '1', -4, 22], [[2, 2], '2', 8, 6]], w: 300, pad: 0.5 });
  Geo.sketch($('ex2Fig'), { P: { B: [0, 0], C: [6, 0], A: [3, Math.sqrt(7)], D: [3, 0] }, seg: 'AB BC CA', dash: 'AD', right: [['D', 'C', 'A']], text: [[[1.5, Math.sqrt(7) / 2], '4', -18, -4], [[4.5, Math.sqrt(7) / 2], '4', 8, -4], [[4.5, 0], '3', -4, 22]], w: 400, pad: 0.7 });
  const ad = 16 * Math.tan(35 * RAD);
  Geo.sketch($('hw2Fig'), { P: { B: [-3, 0], C: [4, 0], A: [0, ad / 4], D: [0, 0] }, seg: 'AB BC CA AD', right: [['D', 'C', 'A']], ang: [['C', 'A', 'D', '35°', 1]], text: [[[-1.5, 0], '12', -8, 22], [[2, 0], '16', -8, 22]], w: 420, pad: 0.5 });
}

/* 第 4 页：反三角计算器（核对用） */
function parseVal(t) {
  const m = String(t).trim().match(/^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/);
  if (m) return +m[2] ? +m[1] / +m[2] : NaN;
  return /^\d+(\.\d+)?$/.test(String(t).trim()) ? +t : NaN;
}
function dms(deg) {
  let d = Math.floor(deg);
  let m = Math.floor((deg - d) * 60);
  let sec = Math.round(((deg - d) * 60 - m) * 60);
  if (sec === 60) { sec = 0; m += 1; }
  if (m === 60) { m = 0; d += 1; }
  return `${d}°${m}′${sec}″`;
}
function initCalc() {
  const run = () => {
    const fn = $('cFn').value;
    const v = parseVal($('cVal').value);
    const bad = !Number.isFinite(v) || v <= 0 || (fn !== 'atan' && v >= 1);
    if (bad) {
      $('cAng').textContent = 'Error';
      $('cDms').textContent = fn === 'atan' ? '请输入正数（如 2 或 20/3）' : 'sin、cos 的值要在 0 和 1 之间';
      return;
    }
    const deg = Math[fn](v) / RAD;
    $('cAng').textContent = `${deg.toPrecision(10)}°`;
    $('cDms').textContent = `≈ ${deg.toFixed(2)}° ≈ ${dms(deg)}`;
  };
  ['cFn', 'cVal'].forEach((id) => $(id).addEventListener('input', run));
  run();
}

window.LESSON = {
  init() { initMaker(); initSwing(); initSketches(); initCalc(); },
  onRender() { requestAnimationFrame(Geo.refresh); },
};
