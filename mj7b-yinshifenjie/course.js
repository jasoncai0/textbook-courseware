'use strict';
/* 七下 9.5 多项式的因式分解 · 本课互动：公因式提取器（单项式整除的精确计算）、例 4 圆环按比例作图。
 * 通用部分见 ../shared/math.js */
const { tex } = MathKit;
const $ = (id) => document.getElementById(id);

/* ---------- 单项式：{ c: 系数, e: { 字母: 指数 } } ---------- */
const POLYS = [
  { name: '议一议 (1)', vars: ['a', 'b'], terms: [[1, { a: 2, b: 1 }], [1, { a: 1, b: 2 }]] },
  { name: '议一议 (2)', vars: ['x'], terms: [[3, { x: 2 }], [-6, { x: 3 }]] },
  { name: '议一议 (3)', vars: ['a', 'b', 'c'], terms: [[9, { a: 1, b: 1, c: 1 }], [-6, { a: 2, b: 2 }], [12, { a: 1, b: 1, c: 2 }]] },
  { name: '例 1', vars: ['x'], terms: [[5, { x: 3 }], [-10, { x: 2 }]] },
  { name: '例 2 (1)', vars: ['a', 'b', 'c'], terms: [[12, { a: 1, b: 2, c: 1 }], [-6, { a: 1, b: 1 }]] },
  { name: '例 2 (2)', vars: ['m'], terms: [[-2, { m: 3 }], [8, { m: 2 }], [-12, { m: 1 }]] },
];
const MAX_COEF = 12;
const MAX_EXP = 4;

const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const exp = (m, v) => m.e[v] || 0;

/** 单项式的 TeX；lead = 是否为首项（首项正号不写） */
function monoTex(m, vars, lead) {
  const letters = vars.filter((v) => exp(m, v) > 0).map((v) => (exp(m, v) > 1 ? `${v}^{${exp(m, v)}}` : v)).join('');
  const abs = Math.abs(m.c);
  const body = abs === 1 && letters ? letters : `${abs}${letters}`;
  if (m.c < 0) return `-${body}`;
  return lead ? body : `+${body}`;
}
const polyTex = (ms, vars) => ms.map((m, i) => monoTex(m, vars, i === 0)).join('');

/** term ÷ f：除得尽返回商，否则返回 { why } */
function divide(term, f, vars) {
  if (term.c % f.c !== 0) return { why: `系数 ${term.c} 不是 ${f.c} 的倍数` };
  const short = vars.find((v) => exp(term, v) < exp(f, v));
  if (short) return { why: exp(term, short) === 0 ? `这一项没有字母 ${short}` : `${short} 的次数不够` };
  const e = Object.fromEntries(vars.map((v) => [v, exp(term, v) - exp(f, v)]));
  return { q: { c: term.c / f.c, e } };
}

function initGcf() {
  const s = { k: 1, f: { c: 1, e: {} } };
  const poly = () => POLYS[s.k];
  const terms = () => poly().terms.map(([c, e]) => ({ c, e }));

  const pick = $('gcfPick');
  pick.innerHTML = POLYS.map((p, i) => `<button class="btn" type="button" data-k="${i}">${p.name}</button>`).join('');
  pick.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    s.k = +btn.dataset.k;
    s.f = { c: 1, e: {} };
    buildSteppers();
    render();
  });

  const stepper = (label, get, set, lo, hi) => {
    const box = document.createElement('span');
    box.className = 'stepper';
    box.innerHTML = `<span>${label}</span><button type="button" aria-label="减少">−</button><b></b><button type="button" aria-label="增加">+</button>`;
    const [minus, plus] = box.querySelectorAll('button');
    const out = box.querySelector('b');
    const bump = (d) => { set(Math.min(hi, Math.max(lo, get() + d))); render(); };
    minus.addEventListener('click', () => bump(-1));
    plus.addEventListener('click', () => bump(1));
    box.refresh = () => { out.textContent = get(); };
    return box;
  };

  let boxes = [];
  function buildSteppers() {
    const host = $('gcfSteps');
    host.innerHTML = '';
    // 系数跳过 0（0 不能作除数）
    const coef = stepper('系数', () => s.f.c, (v) => { s.f = { ...s.f, c: v === 0 ? (s.f.c > 0 ? -1 : 1) : v }; }, -MAX_COEF, MAX_COEF);
    const letters = poly().vars.map((v) => stepper(`${v} 的指数`, () => exp(s.f, v), (n) => { s.f = { ...s.f, e: { ...s.f.e, [v]: n } }; }, 0, MAX_EXP));
    boxes = [coef, ...letters];
    boxes.forEach((b) => host.appendChild(b));
  }

  function render() {
    const vars = poly().vars;
    const ts = terms();
    pick.querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', +b.dataset.k === s.k));
    boxes.forEach((b) => b.refresh());
    $('gcfPoly').innerHTML = `多项式：$${polyTex(ts, vars)}$`;
    const fTex = monoTex(s.f, vars, true);
    $('gcfF').innerHTML = `要提出的因式：$${fTex}$`;
    const rows = ts.map((t) => ({ t, r: divide(t, s.f, vars) }));
    $('gcfTerms').innerHTML = rows.map(({ t, r }) => `<span>$${monoTex(t, vars, true)}$</span><span>$\\div(${fTex})=$</span>${r.q ? `<span class="ok">$${monoTex(r.q, vars, true)}$</span>` : `<span class="bad">除不尽：${r.why}</span>`}`).join('');
    const msg = $('gcfMsg');
    const qs = rows.map((x) => x.r.q);
    if (qs.some((q) => !q)) {
      $('gcfOut').innerHTML = '';
      msg.className = 'tip feedback fb-warn';
      msg.innerHTML = `$${fTex}$ 不是每一项都含有的因式，<b>不是公因式</b>。`;
    } else {
      $('gcfOut').innerHTML = `$${polyTex(ts, vars)}=${fTex === '1' ? '' : fTex}(${polyTex(qs, vars)})$`;
      const g = qs.reduce((acc, q) => gcd(acc, q.c), 0);
      const left = vars.filter((v) => qs.every((q) => exp(q, v) > 0));
      const more = [g > 1 ? `系数还有公约数 ${g}` : '', ...left.map((v) => `每项都还有 ${v}`)].filter(Boolean);
      if (more.length) {
        msg.className = 'tip feedback fb-warn';
        msg.innerHTML = `是公因式，但括号里${more.join('、')}——<b>还能再提</b>。`;
      } else {
        msg.className = 'tip feedback fb-ok';
        msg.innerHTML = qs[0].c < 0
          ? '提干净了 ✓ 不过括号里第一项是负的：通常把“−”号也一起提出来（系数调成负数试试）。'
          : `提干净了 ✓ $${fTex}$ 就是各项的公因式（括号里不再有公因式）。`;
      }
    }
    [$('gcfPoly'), $('gcfF'), $('gcfTerms'), $('gcfOut'), msg].forEach(tex);
  }

  buildSteppers();
  render();
}

/* 例 4：外半径 32 m、内半径 18 m 的圆环（按比例画） */
function drawRing() {
  const K = 2.6; // 1 m = 2.6 px
  const CX = 150;
  const CY = 95;
  const R = 32 * K;
  const r = 18 * K;
  const ang = -Math.PI / 5; // 外半径的方向
  const ang2 = Math.PI / 2.6; // 内半径的方向
  const P = (rad, a) => [CX + rad * Math.cos(a), CY + rad * Math.sin(a)];
  const [ox, oy] = P(R, ang);
  const [ix, iy] = P(r, ang2);
  $('ringFig').innerHTML = `
    <circle cx="${CX}" cy="${CY}" r="${R}" fill="#7fcf8a" stroke="#1f2d3a" stroke-width="1.5"/>
    <circle cx="${CX}" cy="${CY}" r="${r}" fill="#fff" stroke="#1f2d3a" stroke-width="1.5"/>
    <line x1="${CX}" y1="${CY}" x2="${ox}" y2="${oy}" stroke="#1f2d3a" stroke-width="1.5"/>
    <line x1="${CX}" y1="${CY}" x2="${ix}" y2="${iy}" stroke="#1f2d3a" stroke-width="1.5"/>
    <circle cx="${CX}" cy="${CY}" r="2.5" fill="#1f2d3a"/>
    <text x="${(CX + ox) / 2 + 6}" y="${(CY + oy) / 2 - 4}" class="fl" font-size="13">32 m</text>
    <text x="${(CX + ix) / 2 + 4}" y="${(CY + iy) / 2 + 4}" class="fl" font-size="13">18 m</text>`;
}

window.LESSON = {
  init() {
    initGcf();
    drawRing();
  },
};
