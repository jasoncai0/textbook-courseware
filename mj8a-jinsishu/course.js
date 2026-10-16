'use strict';
/* 八上 4.4 近似数 · 本课互动：取近似值机（核心：逐位高亮 + 放大数轴上的“代表区间”）、0.1 与 0.10 的区间对比、单杠拉索示意图。
 * 四舍五入用十进制整数（BigInt）逐位计算，不经过浮点数；数轴位置按数值精确计算。 */
const { board, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const boards = [];
const keep = (b) => { boards.push(b); return b; };

/* ---------- 十进制四舍五入（只处理正数） ---------- */
/** "43.95" → { n: 4395n, scale: 2 } */
function parseDec(str) {
  const [ip, fp = ''] = str.split('.');
  return { n: BigInt(ip + fp), scale: fp.length };
}
/** 精确到 10^p 位：返回近似值字符串（p < 0 时保留 −p 位小数，末尾 0 保留） */
function roundTo(str, p) {
  const { n, scale } = parseDec(str);
  const drop = scale + p;
  if (drop <= 0) return str;
  const D = 10n ** BigInt(drop);
  const q = n / D + ((n % D) * 2n >= D ? 1n : 0n);
  if (p >= 0) return (q * 10n ** BigInt(p)).toString();
  const s = q.toString().padStart(-p + 1, '0');
  return `${s.slice(0, p)}.${s.slice(p)}`;
}
/** 第 10^p 位上的数字（p = 0 个位，−1 十分位……） */
function digitAt(str, p) {
  const [ip, fp = ''] = str.split('.');
  if (p >= 0) { const i = ip.length - 1 - p; return i >= 0 ? +ip[i] : 0; }
  const j = -p - 1;
  return j < fp.length ? +fp[j] : 0;
}

const PLACE = { 1: '十位', 0: '个位', '-1': '十分位', '-2': '百分位', '-3': '千分位', '-4': '万分位', '-5': '十万分位', '-6': '百万分位' };
const UNIT_TXT = (p) => (p >= 0 ? String(10 ** p) : `0.${'0'.repeat(-p - 1)}1`);
const NUMS = {
  pi: { str: '3.14159265', inf: true, name: 'π', unit: '', precs: [0, -1, -2, -3, -4], p: -2 },
  can: { str: '2.026', inf: false, name: '2.026', unit: ' kg', precs: [0, -1, -2], p: -2 },
  liang: { str: '43.95', inf: false, name: '43.95', unit: ' kg', precs: [1, 0, -1], p: -1 },
  cbrt5: { str: '1.70997594', inf: true, name: '∛5', unit: '', precs: [-1, -2, -3, -4], p: -3 },
};

/* 第 5 页：取近似值机 */
function initRound() {
  const s = { k: 'pi', p: -2 };
  const cur = () => NUMS[s.k];
  // 放大数轴用“以近似值为 0、一个精确单位为 1”的相对坐标 t = (x − r) / 10^p，所以画板范围固定
  const b = keep(board($('roundBoard'), { x: [-1.8, 1.8], y: [-1.05, 1.15], axes: false, grid: false, w: 680, h: 170 }));
  const r = () => roundTo(cur().str, s.p);
  const u = () => 10 ** s.p;
  const tOf = () => (Number(cur().str) - Number(r())) / u();
  const dec = (extra) => Math.max(0, -s.p + extra);
  const val = (t, extra) => (Number(r()) + t * u()).toFixed(dec(extra));
  b.poly([[-0.5, -0.2], [0.5, -0.2], [0.5, 0.2], [-0.5, 0.2]], { cls: 'band' });
  b.seg([[-1.75, 0], [1.72, 0]], { cls: 'nl-ax' });
  b.poly([[1.8, 0], [1.7, 0.09], [1.7, -0.09]], { cls: 'nl-arrow' });
  for (let i = -17; i <= 17; i++) {
    const t = i / 10;
    const major = i % 10 === 0;
    b.seg([[t, major ? -0.16 : -0.07], [t, major ? 0.16 : 0.07]], { cls: major ? 'nl-tick' : 'nl-minor' });
  }
  [-1, 0, 1].forEach((t) => b.text([t, 0], () => val(t, 0), { cls: 'nl-num', dy: 28 }));
  [-0.5, 0.5].forEach((t) => b.text([t, 0.2], () => val(t, 1), { cls: 'bl', dy: -8 }));
  b.pt([0, 0], { r: 7, cls: 'rv' });
  b.pt(() => [tOf(), 0], { r: 7, cls: 'orig' });
  b.text(() => [tOf(), 0], () => cur().name, { cls: 'nl-or', dy: -50 }); // 高于区间端点的标注，避免重叠
  const renderDigits = () => {
    const { str, inf } = cur();
    const [ip, fp = ''] = str.split('.');
    const cells = [];
    [...ip].forEach((d, i) => cells.push({ d, p: ip.length - 1 - i }));
    cells.push({ d: '.', p: null });
    [...fp].forEach((d, j) => cells.push({ d, p: -j - 1 }));
    const html = cells.map(({ d, p }) => {
      if (p === null) return '<span class="dg pt"><b>.</b><i>&nbsp;</i></span>';
      const cls = p === s.p ? 'keep' : (p === s.p - 1 ? 'next' : (p < s.p - 1 ? 'drop' : ''));
      const lab = cls === 'keep' || cls === 'next' ? PLACE[p] : '&nbsp;'; // 只标保留位和下一位，避免挤在一起
      return `<span class="dg ${cls}"><b>${d}</b><i>${lab}</i></span>`;
    }).join('') + (inf ? '<span class="dg ell"><b>…</b><i>&nbsp;</i></span>' : '');
    $('digits').innerHTML = html;
  };
  const renderPrec = () => {
    $('precBtns').innerHTML = '<span>精确到：</span>' + cur().precs.map((p) => `<button class="btn${p === s.p ? ' solid' : ''}" type="button" data-p="${p}">${UNIT_TXT(p)}${p >= 0 && p <= 1 ? `（${PLACE[p]}）` : ''}</button>`).join('');
  };
  b.onUpdate = () => {
    renderDigits();
    renderPrec();
    $('numBtns').querySelectorAll('[data-v]').forEach((x) => x.classList.toggle('solid', x.dataset.v === s.k));
    const nd = digitAt(cur().str, s.p - 1);
    const up = nd >= 5;
    const msg = $('roundMsg');
    msg.className = 'tip feedback fb-ok';
    msg.innerHTML = `精确到 ${UNIT_TXT(s.p)}（${PLACE[s.p]}）：看下一位（${PLACE[s.p - 1]}）是 <b>${nd}</b>，${up ? '大于或等于 5，进 1' : '小于 5，舍去'}，所以 ${cur().name} ≈ <b>${r()}</b>${cur().unit}。`
      + `　凡是 ${val(-0.5, 1)} ≤ x &lt; ${val(0.5, 1)} 的数，都近似为 ${r()}。`;
  };
  $('numBtns').addEventListener('click', (e) => {
    const k = e.target.closest('[data-v]')?.dataset.v;
    if (!k) return;
    s.k = k;
    s.p = NUMS[k].p;
    b.update();
  });
  $('precBtns').addEventListener('click', (e) => {
    const p = e.target.closest('[data-p]')?.dataset.p;
    if (p === undefined) return;
    s.p = +p;
    b.update();
  });
  $('numBtns').setAttribute('data-noswipe', '');
  tex($('numBtns'));
}

/* 第 7 页：0.1 与 0.10 代表的范围 */
function initCmp() {
  const b = keep(board($('cmpBoard'), { x: [-0.012, 0.218], y: [-0.85, 1.75], axes: false, grid: false, w: 680, h: 190 }));
  NumLine.axis(b, { from: 0, to: 0.2, step: 0.05, minor: 0.01, tail: 0.01, lead: 0.008, tick: 0.13, label: (v) => v.toFixed(2) });
  b.poly([[0.05, 0.35], [0.15, 0.35], [0.15, 0.75], [0.05, 0.75]], { cls: 'band' });
  b.poly([[0.095, 0.95], [0.105, 0.95], [0.105, 1.35], [0.095, 1.35]], { cls: 'band2' });
  b.seg([[0.05, 0], [0.05, 0.35]], { cls: 'dash' });
  b.seg([[0.15, 0], [0.15, 0.35]], { cls: 'dash' });
  b.text([0.152, 0.55], '0.1：0.05 ≤ x < 0.15', { cls: 'bt', dx: 6, dy: 6 });
  b.text([0.107, 1.15], '0.10：0.095 ≤ x < 0.105', { cls: 'bt', dx: 6, dy: 6 });
  b.pt([0.1, 0], { r: 6, cls: 'rv' });
}

/* 第 9 页：单杠拉索示意图（AC = 2.55 m，BC = 3 m，按比例） */
function drawPole() {
  const svg = $('poleFig');
  const K = 38; // 1 m = 38 px
  const C = [70, 150];
  const A = [C[0], C[1] - 2.55 * K];
  const B = [C[0] + 3 * K, C[1]];
  svg.innerHTML = `
    <line x1="20" y1="${C[1]}" x2="300" y2="${C[1]}" stroke="#1f2d3a" stroke-width="2"/>
    <line x1="${A[0]}" y1="${A[1]}" x2="${C[0]}" y2="${C[1]}" stroke="#d9711c" stroke-width="6"/>
    <line x1="${A[0]}" y1="${A[1]}" x2="${B[0]}" y2="${B[1]}" stroke="#1d6fa5" stroke-width="2.5"/>
    <path d="M${C[0]} ${C[1] - 12} h12 v12" fill="none" stroke="#c0392b" stroke-width="1.8"/>
    <text class="it" x="${A[0] - 6}" y="${A[1] - 4}" text-anchor="end">A</text>
    <text class="it" x="${C[0] - 6}" y="${C[1] + 16}" text-anchor="end">C</text>
    <text class="it" x="${B[0] + 4}" y="${B[1] + 16}">B</text>
    <text x="${C[0] - 10}" y="${(A[1] + C[1]) / 2}" text-anchor="end">2.55 m</text>
    <text x="${(C[0] + B[0]) / 2}" y="${C[1] + 16}" text-anchor="middle">3 m</text>`;
}

window.LESSON = {
  init() {
    initRound();
    initCmp();
    drawPole();
    boards.forEach((b) => b.update());
  },
  onRender() { requestAnimationFrame(() => boards.forEach((b) => b.update())); },
};
