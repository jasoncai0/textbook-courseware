'use strict';
/* 八下 12.3 二次根式的加减 · 本课互动：线段拼接尺（精确长度）、翻牌归类台（分数系数精确合并）、
 * 圆环（按面积精确绘制）、代值验算表。 */
const { fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));

/* ---------- 分数（精确） ---------- */
const fr = (n, d = 1) => { const g = gcd(n, d) || 1; const s = d < 0 ? -1 : 1; return [s * n / g, s * d / g]; };
const add = ([a, b], [c, d]) => fr(a * d + c * b, b * d);
const mul = ([a, b], [c, d]) => fr(a * c, b * d);
/** 系数（分数）× √b 的 TeX；first 为真时正数前不写 + */
function termTex([n, d], b, first) {
  const sign = n < 0 ? '-' : first ? '' : '+';
  const an = Math.abs(n);
  const rad = b === 1 ? '' : `\\sqrt{${b}}`;
  let co;
  if (d === 1) co = an === 1 && rad ? '' : String(an);
  else co = `\\dfrac{${an}}{${d}}`;
  return `${sign}${co}${rad}`;
}
/** n = a²·b */
function splitSquare(n) {
  let a = 1;
  let b = n;
  for (let k = 2; k * k <= b; k++) while (b % (k * k) === 0) { b /= k * k; a *= k; }
  return [a, b];
}

/* ---------- 第 3 页：线段拼接尺 ---------- */
const RULER = [
  { t: '\\sqrt2+\\sqrt8', a: 2, b: 8, unit: 2, cmp: null },
  { t: '\\sqrt{12}+\\sqrt{27}', a: 12, b: 27, unit: 3, cmp: null },
  { t: '\\sqrt2+\\sqrt3', a: 2, b: 3, unit: 0, cmp: 5 },
];
function initRuler() {
  const svg = $('ruler');
  const X0 = 40;
  const draw = (c) => {
    const la = Math.sqrt(c.a);
    const lb = Math.sqrt(c.b);
    const U = 760 / (la + lb); // 同一组三条线段用同一比例尺，总长画成 760 px
    let h = '';
    // 上：两段拼接
    h += `<rect x="${X0}" y="40" width="${la * U}" height="26" fill="rgba(29,111,165,.75)"/><rect x="${X0 + la * U}" y="40" width="${lb * U}" height="26" fill="rgba(217,113,28,.75)"/>`;
    h += `<text x="${X0 + (la * U) / 2}" y="32" font-size="20" text-anchor="middle" fill="#1d6fa5">√${c.a}</text><text x="${X0 + la * U + (lb * U) / 2}" y="32" font-size="20" text-anchor="middle" fill="#d9711c">√${c.b}</text>`;
    // 中：刻度尺（单位长 √unit 的整数倍，或 1 的整数倍）
    const step = c.unit ? Math.sqrt(c.unit) : 1;
    const total = la + lb;
    h += `<line x1="${X0}" y1="100" x2="${X0 + total * U + 20}" y2="100" stroke="#556575" stroke-width="2"/>`;
    for (let k = 0; k * step <= total + 1e-9; k++) {
      const x = X0 + k * step * U;
      h += `<line x1="${x}" y1="92" x2="${x}" y2="108" stroke="#556575" stroke-width="2"/><text x="${x}" y="128" font-size="17" text-anchor="middle" fill="#556575">${k === 0 ? '0' : c.unit ? `${k === 1 ? '' : k}√${c.unit}` : k}</text>`;
    }
    h += `<line x1="${X0 + total * U}" y1="34" x2="${X0 + total * U}" y2="112" stroke="#2f7d6b" stroke-width="2.5" stroke-dasharray="5 4"/>`;
    // 下：对比
    if (c.cmp) {
      const lc = Math.sqrt(c.cmp);
      h += `<rect x="${X0}" y="160" width="${lc * U}" height="26" fill="rgba(142,91,181,.7)"/><text x="${X0 + lc * U + 10}" y="180" font-size="20" fill="#8e5bb5">√${c.cmp} ≈ ${fmt(lc, 3)}</text>`;
    } else {
      const [k] = splitSquare(c.a);
      const [m] = splitSquare(c.b);
      for (let i = 0; i < k + m; i++) h += `<rect x="${X0 + i * step * U + 1}" y="160" width="${step * U - 2}" height="26" fill="${i < k ? 'rgba(29,111,165,.45)' : 'rgba(217,113,28,.45)'}" stroke="#1f2d3a" stroke-width="1"/>`;
      h += `<text x="${X0 + (k + m) * step * U + 10}" y="180" font-size="20" fill="#2f7d6b">${k + m} 个 √${c.unit}</text>`;
    }
    svg.innerHTML = h;
    const m = $('rulerMsg');
    if (c.cmp) {
      m.className = 'tip feedback fb-warn';
      m.innerHTML = `$\\sqrt2+\\sqrt3\\approx${fmt(total, 3)}$，而 $\\sqrt5\\approx${fmt(Math.sqrt(5), 3)}$：<b>不相等</b>．$\\sqrt2$ 与 $\\sqrt3$ 不是同类，只能写成 $\\sqrt2+\\sqrt3$．`;
    } else {
      const [k, b1] = splitSquare(c.a);
      const [mm] = splitSquare(c.b);
      m.className = 'tip feedback fb-ok';
      m.innerHTML = `$${c.t}=${termTex([k, 1], b1, true)}${termTex([mm, 1], b1)}=${k + mm}\\sqrt{${b1}}$：拼起来正好是 ${k + mm} 个 $\\sqrt{${b1}}$．`;
    }
    tex(m);
  };
  $('rulerBtns').innerHTML = RULER.map((c, i) => `<button type="button" class="btn${i ? '' : ' solid'}" data-i="${i}">$${c.t}$</button>`).join('');
  tex($('rulerBtns'));
  $('rulerBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-i]');
    if (!btn) return;
    [...$('rulerBtns').children].forEach((b) => b.classList.toggle('solid', b === btn));
    draw(RULER[+btn.dataset.i]);
  });
  draw(RULER[0]);
}

/* ---------- 第 5 页：翻牌归类台 ---------- */
// 每一项：系数（分数）× √(p/q)
const SETS = [
  { name: '尝试', terms: [[[1, 1], 5, 1], [[-3, 1], 20, 1], [[1, 1], 125, 1], [[1, 1], 1, 5]] },
  { name: '例 1(2)', terms: [[[1, 1], 12, 1], [[1, 1], 18, 1], [[-1, 1], 8, 1], [[-1, 1], 32, 1]] },
  { name: '例 1(3)', terms: [[[1, 1], 40, 1], [[-5, 1], 1, 10], [[1, 1], 10, 1]] },
  { name: '练习 1(2)', terms: [[[1, 1], 27, 1], [[-1, 1], 45, 1], [[-1, 1], 20, 1], [[1, 1], 75, 1]] },
  { name: '习题 1(2)', terms: [[[1, 1], 12, 1], [[-1, 1], 27, 1], [[-1, 1], 20, 1], [[1, 1], 50, 1]] },
];
const rawTex = ([c, d], p, q, first) => {
  const rad = q === 1 ? `\\sqrt{${p}}` : `\\sqrt{\\dfrac{${p}}{${q}}}`;
  const sign = c < 0 ? '-' : first ? '' : '+';
  const a = Math.abs(c);
  return `${sign}${a === 1 && d === 1 ? '' : a}${rad}`;
};
/** c·√(p/q) = c·√(pq)/q = (c·a/q)·√b */
function simplify(co, p, q) {
  const [a, b] = splitSquare(p * q);
  return { co: mul(co, fr(a, q)), b };
}
function initSort() {
  const s = { set: 0, open: [] };
  const render = (merged) => {
    const set = SETS[s.set];
    $('sortQ').innerHTML = `计算：$${set.terms.map(([co, p, q], i) => rawTex(co, p, q, i === 0)).join('')}$`;
    $('sortCards').innerHTML = set.terms.map(([co, p, q], i) => {
      const o = s.open[i];
      const r = simplify(co, p, q);
      return `<button type="button" class="card${o ? ' open' : ''}" data-i="${i}"><span class="front">$${rawTex(co, p, q, true)}$</span>${o ? `<span class="back">$=${termTex(r.co, r.b, true)}$</span>` : '<span class="hint">点我化简</span>'}</button>`;
    }).join('');
    const bins = {};
    set.terms.forEach(([co, p, q], i) => {
      if (!s.open[i]) return;
      const r = simplify(co, p, q);
      (bins[r.b] = bins[r.b] || []).push(r.co);
    });
    $('sortBins').innerHTML = Object.keys(bins).sort((a, b) => a - b).map((b) => {
      const list = bins[b];
      const sum = list.reduce(add, [0, 1]);
      return `<div class="bin"><h4>同类：$\\sqrt{${b}}$</h4><p>$${list.map((c, i) => termTex(c, +b, i === 0)).join('')}${merged && list.length > 1 ? `=${sum[0] === 0 ? '0' : termTex(sum, +b, true)}` : ''}$</p></div>`;
    }).join('') || '<p class="muted small-t">化简后的牌会落到这里，按被开方数分组</p>';
    const m = $('sortMsg');
    if (merged) {
      const total = Object.keys(bins).sort((a, b) => a - b).map((b) => [bins[b].reduce(add, [0, 1]), +b]).filter(([c]) => c[0] !== 0);
      m.className = 'tip feedback fb-ok';
      m.innerHTML = `原式 $=${total.length ? total.map(([c, b], i) => termTex(c, b, i === 0)).join('') : '0'}$${Object.keys(bins).length > 1 ? '（不同类的不能再合并）' : ''}．`;
    } else {
      m.className = 'tip feedback';
      m.textContent = '';
    }
    ['sortQ', 'sortCards', 'sortBins', 'sortMsg'].forEach((id) => tex($(id)));
  };
  const pick = (i) => {
    s.set = i;
    s.open = SETS[i].terms.map(() => false);
    [...$('sortBtns').children].forEach((b, j) => b.classList.toggle('solid', j === i));
    render(false);
  };
  $('sortBtns').innerHTML = SETS.map((c, i) => `<button type="button" class="btn" data-i="${i}">${c.name}</button>`).join('');
  $('sortBtns').addEventListener('click', (e) => { const b = e.target.closest('[data-i]'); if (b) pick(+b.dataset.i); });
  $('sortCards').addEventListener('click', (e) => { const c = e.target.closest('[data-i]'); if (!c) return; s.open[+c.dataset.i] = true; render(false); });
  $('sortMerge').addEventListener('click', () => {
    if (s.open.some((o) => !o)) {
      const m = $('sortMsg');
      m.className = 'tip feedback fb-warn';
      m.textContent = '还有没化简的牌：先把每一张都化成最简二次根式，才看得出谁和谁同类．';
      return;
    }
    render(true);
  });
  $('sortReset').addEventListener('click', () => pick(s.set));
  pick(0);
}

/* ---------- 第 8 页：圆环 ---------- */
function initRing() {
  const R = Math.sqrt(18 / Math.PI);
  const r = Math.sqrt(8 / Math.PI);
  const K = 150 / R; // 外圆半径画成 150 px
  const c = 160;
  $('ring').innerHTML = `<defs><pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="8" stroke="#556575" stroke-width="2"/></pattern></defs>`
    + `<circle cx="${c}" cy="${c}" r="${R * K}" fill="url(#hatch)" stroke="#1f2d3a" stroke-width="2.5"/><circle cx="${c}" cy="${c}" r="${r * K}" fill="#fff" stroke="#1f2d3a" stroke-width="2.5"/>`
    + `<line x1="${c}" y1="${c}" x2="${c + R * K * Math.cos(-Math.PI / 4)}" y2="${c + R * K * Math.sin(-Math.PI / 4)}" stroke="#1d6fa5" stroke-width="3"/>`
    + `<line x1="${c}" y1="${c}" x2="${c + r * K * Math.cos(Math.PI / 8)}" y2="${c + r * K * Math.sin(Math.PI / 8)}" stroke="#d9711c" stroke-width="3"/>`
    + `<text x="${c + 30}" y="${c - 52}" font-size="22" font-style="italic" fill="#1d6fa5">R</text><text x="${c + 40}" y="${c + 6}" font-size="22" font-style="italic" fill="#d9711c">r</text>`;
  $('ringMsg').innerHTML = `验算：$R\\approx${fmt(R, 3)}$，$r\\approx${fmt(r, 3)}$，$R-r\\approx${fmt(R - r, 3)}$；$\\dfrac1\\pi\\sqrt{2\\pi}\\approx${fmt(Math.sqrt(2 * Math.PI) / Math.PI, 3)}$ ✓`;
  tex($('ringMsg'));
}

/* ---------- 第 11 页：代值验算 ---------- */
const VER = [
  ['(\\sqrt3+\\sqrt2)(\\sqrt3-\\sqrt2)', () => (Math.sqrt(3) + Math.sqrt(2)) * (Math.sqrt(3) - Math.sqrt(2)), '1', () => 1],
  ['(3+2\\sqrt5)^2', () => (3 + 2 * Math.sqrt(5)) ** 2, '29+12\\sqrt5', () => 29 + 12 * Math.sqrt(5)],
  ['\\left(\\sqrt{\\frac5{12}}+2\\sqrt3\\right)\\sqrt{15}', () => (Math.sqrt(5 / 12) + 2 * Math.sqrt(3)) * Math.sqrt(15), '\\frac52+6\\sqrt5', () => 2.5 + 6 * Math.sqrt(5)],
  ['(3+\\sqrt{10})(\\sqrt2-\\sqrt5)', () => (3 + Math.sqrt(10)) * (Math.sqrt(2) - Math.sqrt(5)), '-2\\sqrt2-\\sqrt5', () => -2 * Math.sqrt(2) - Math.sqrt(5)],
  ['(3+2\\sqrt5)^2', () => (3 + 2 * Math.sqrt(5)) ** 2, '29\\ \\text{（错）}', () => 29],
];
function initVerify() {
  $('verTab').innerHTML = '<tr><th>原式</th><th>化简结果</th></tr>' + VER.map(([l, , r], i) => `<tr data-i="${i}"><td>$${l}$</td><td>$${r}$</td></tr>`).join('');
  tex($('verTab'));
  $('verTab').setAttribute('data-noswipe', '');
  $('verTab').addEventListener('click', (e) => {
    const tr = e.target.closest('tr[data-i]');
    if (!tr) return;
    const [, fl, , fr2] = VER[+tr.dataset.i];
    const [a, b] = [fl(), fr2()];
    const ok = Math.abs(a - b) < 1e-9;
    [...$('verTab').rows].forEach((row) => row.classList.toggle('on', row === tr));
    const m = $('verMsg');
    m.className = `tip feedback ${ok ? 'fb-ok' : 'fb-warn'}`;
    m.innerHTML = `左边 $\\approx${a.toFixed(12)}$<br>右边 $\\approx${b.toFixed(12)}$<br>${ok ? '一致 ✓' : '<b>不一致</b>：化简有错！'}`;
    tex(m);
  });
}

window.LESSON = {
  init() { initRuler(); initSort(); initRing(); initVerify(); },
};
