'use strict';
/* 八下 12.2 二次根式的乘除 · 本课互动：方格纸画矩形（边长、面积按格点坐标精确计算）、
 * 化简精确检验器（整数比较 a²b 与 n，判断是否最简；分母版比较 a²b·Q 与 P·c²）。 */
const { board, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const redraws = [];

/** n = a²·b，b 不含平方因数 */
function splitSquare(n) {
  let a = 1;
  let b = n;
  for (let d = 2; d * d <= b; d++) while (b % (d * d) === 0) { b /= d * d; a *= d; }
  return [a, b];
}
const squareFree = (b) => splitSquare(b)[0] === 1;
/** √n 的最简形式（TeX） */
function radTex(n) {
  const [a, b] = splitSquare(n);
  if (b === 1) return String(a);
  return `${a === 1 ? '' : a}\\sqrt{${b}}`;
}
function primeFactors(n) {
  const out = [];
  let m = n;
  for (let d = 2; d * d <= m; d++) while (m % d === 0) { out.push(d); m /= d; }
  if (m > 1) out.push(m);
  return out;
}

/* ---------- 第 3 页：方格纸 ---------- */
function initGrid() {
  const s = { mode: 'abcd', E: [0, 1], F: [1, 0], G: [3, 2] };
  const b = board($('gridBoard'), { x: [-0.6, 4.6], y: [-0.6, 4.6], w: 440, ticks: 1, axes: false });
  const H = () => [s.E[0] + s.G[0] - s.F[0], s.E[1] + s.G[1] - s.F[1]];
  const free = () => s.mode === 'free';
  const ABCD = { A: [3, 1], B: [2, 0], C: [0, 2], D: [1, 3] };
  // ABCD：外接 3×3 正方形减去四个直角三角形（“补”）
  b.poly(() => (free() ? [] : [[0, 0], [3, 0], [3, 3], [0, 3]]), { cls: 'fillB' });
  b.poly(() => (free() ? [s.E, s.F, s.G, H()] : [ABCD.A, ABCD.B, ABCD.C, ABCD.D]), { cls: 'fillA' });
  Object.entries(ABCD).forEach(([k, p]) => b.text(() => (free() ? null : p), k, { cls: 'lb', dx: k === 'A' ? 8 : k === 'C' ? -22 : 4, dy: k === 'B' ? 22 : -6 }));
  const handles = ['E', 'F', 'G'].map((k) => {
    b.text(() => (free() ? s[k] : null), k, { cls: 'lb', dx: 10, dy: -8 });
    return b.drag(() => s[k], (x, y) => { if (free()) s[k] = [clamp(Math.round(x), 0, 4), clamp(Math.round(y), 0, 4)]; });
  });
  b.text(() => (free() ? H() : null), 'H', { cls: 'lb', dx: 10, dy: -8 });
  b.onUpdate = () => {
    const m = $('gMsg');
    handles.forEach((g) => { g.style.display = free() ? '' : 'none'; });
    if (!free()) {
      $('gTask').innerHTML = '(1) 小正方形边长为 1，$AB=\\sqrt2$，$BC=\\sqrt8$．矩形 $ABCD$ 的面积是多少？';
      m.className = 'tip feedback fb-ok';
      m.innerHTML = '补成 $3\\times3$ 的正方形（绿），减去四个直角三角形：$9-2\\times\\dfrac12\\times1\\times1-2\\times\\dfrac12\\times2\\times2=4$．';
      tex($('gTask')); tex(m);
      return;
    }
    $('gTask').innerHTML = '(2) 拖动 $E$、$F$、$G$（都在格点上），画出 $EF=\\sqrt2$、$FG=\\sqrt{18}$ 的矩形 $EFGH$．';
    const u = [s.E[0] - s.F[0], s.E[1] - s.F[1]];
    const v = [s.G[0] - s.F[0], s.G[1] - s.F[1]];
    const ef2 = u[0] ** 2 + u[1] ** 2;
    const fg2 = v[0] ** 2 + v[1] ** 2;
    const dot = u[0] * v[0] + u[1] * v[1];
    const area = Math.abs(u[0] * v[1] - u[1] * v[0]);
    const h = H();
    const inGrid = h.every((c) => c >= 0 && c <= 4);
    const right = dot === 0 && ef2 > 0 && fg2 > 0;
    const goal = right && ef2 === 2 && fg2 === 18;
    m.className = `tip feedback ${goal ? 'fb-ok' : right ? '' : 'fb-warn'}`;
    m.innerHTML = `$EF=\\sqrt{${ef2}}${ef2 && !squareFree(ef2) ? `=${radTex(ef2)}` : ''}$，$FG=\\sqrt{${fg2}}${fg2 && !squareFree(fg2) ? `=${radTex(fg2)}` : ''}$；`
      + (right ? `$\\angle F=90^\\circ$，面积 $=${area}$${goal ? '．<b>画对了！$\\sqrt2\\times\\sqrt{18}=6$</b>' : ''}` : '$\\angle F$ 不是直角，还不是矩形')
      + (inGrid ? '' : '（$H$ 跑出方格纸了）');
    tex($('gTask')); tex(m);
  };
  const pick = (mode, btn) => {
    s.mode = mode;
    ['gABCD', 'gFree'].forEach((id) => $(id).classList.toggle('solid', $(id) === btn));
    b.update();
  };
  $('gABCD').addEventListener('click', (e) => pick('abcd', e.currentTarget));
  $('gFree').addEventListener('click', (e) => pick('free', e.currentTarget));
  b.update();
  redraws.push(() => b.update());
}

/* ---------- 化简精确检验器（第 8、16 页共用） ---------- */
function checker(host, btnHost, items, withC) {
  const s = { i: 0 };
  host.innerHTML = `<div class="rc-q" data-r="q"></div>
    <div class="rc-in">${withC ? '<span class="rc-frac"><span class="rc-top">' : ''}<input type="number" min="1" step="1" data-r="a" aria-label="根号外的数 a"><span class="rc-sqrt">√<input type="number" min="1" step="1" data-r="b" aria-label="被开方数 b"></span>${withC ? '</span><span class="rc-bar"></span><input type="number" min="1" step="1" data-r="c" aria-label="分母 c"></span>' : ''}
    <button type="button" class="btn solid" data-r="go">检验</button>${withC ? '' : '<button type="button" class="btn" data-r="tree">看分解</button>'}</div>
    <p class="tip feedback" data-r="msg"></p>${withC ? '' : '<p class="rc-own">自己出题：$\\sqrt{n}$，$n=$ <input type="number" min="2" max="999" step="1" data-r="own" aria-label="自定义 n"></p>'}`;
  host.setAttribute('data-noswipe', '');
  const r = (k) => host.querySelector(`[data-r="${k}"]`);
  const tree = withC ? null : host.parentElement.querySelector('.factor');
  const cur = () => items[s.i];
  const show = () => {
    const it = cur();
    r('q').innerHTML = `化简：$${it.t}=$`;
    ['a', 'b', 'c'].forEach((k) => { if (r(k)) r(k).value = ''; });
    r('msg').className = 'tip feedback';
    r('msg').textContent = '';
    if (tree) tree.innerHTML = '';
    tex(r('q'));
    [...btnHost.children].forEach((b, j) => b.classList.toggle('solid', j === s.i));
  };
  const check = () => {
    const it = cur();
    const a = +r('a').value || 1; // 不填 a 视为 1
    const b = +r('b').value || 1;
    const c = withC ? +r('c').value || 1 : 1;
    const msg = r('msg');
    if (![a, b, c].every((x) => Number.isInteger(x) && x > 0)) { msg.className = 'tip feedback fb-warn'; msg.textContent = '请填正整数．'; return; }
    const lhs = a * a * b * it.Q; // (a√b / c)² = a²b / c²，与 P / Q 交叉相乘
    const rhs = it.P * c * c;
    const shown = `${withC ? '\\dfrac{' : ''}${a === 1 ? '' : a}${b === 1 ? (a === 1 ? '1' : '') : `\\sqrt{${b}}`}${withC ? `}{${c}}` : ''}`;
    let html;
    let cls = 'fb-warn';
    if (lhs !== rhs) {
      html = withC ? `$\\left(${shown}\\right)^2=\\dfrac{${a * a * b}}{${c * c}}$，而原式的平方是 $\\dfrac{${it.P}}{${it.Q}}$：<b>不相等</b>．`
        : `$${shown}=\\sqrt{${a}^2\\times${b}}=\\sqrt{${a * a * b}}\\ne\\sqrt{${it.P}}$：<b>不相等</b>．`;
    } else if (!squareFree(b)) {
      html = `$${shown}$ <b>相等</b>，但 $\\sqrt{${b}}=${radTex(b)}$ 还能化简．`;
    } else if (withC && gcd(a, c) !== 1) {
      html = `$${shown}$ <b>相等</b>，但 ${a} 和 ${c} 还能约分．`;
    } else {
      cls = 'fb-ok';
      html = `$${it.t}=${shown}$ ✓ <b>正确，且是最简形式</b>．`;
    }
    msg.className = `tip feedback ${cls}`;
    msg.innerHTML = html;
    tex(msg);
  };
  const showTree = () => {
    const n = cur().P;
    const fs = primeFactors(n);
    const cnt = {};
    fs.forEach((p) => { cnt[p] = (cnt[p] || 0) + 1; });
    const [a, b] = splitSquare(n);
    const chips = Object.entries(cnt).flatMap(([p, k]) => Array.from({ length: k }, (_, i) => `<span class="pf${i < k - (k % 2) ? ' pair' : ''}">${p}</span>`));
    tree.innerHTML = `<p>$${n}=$ ${chips.join('<i>×</i>')}</p><p>成对的因数（橙色）每对提一个到根号外：$\\sqrt{${n}}=\\sqrt{${a}^2\\times${b}}=${radTex(n)}$</p>`;
    tex(tree);
  };
  btnHost.innerHTML = items.map((it, j) => `<button type="button" class="btn" data-j="${j}">$${it.t}$</button>`).join('');
  tex(btnHost);
  btnHost.setAttribute('data-noswipe', '');
  btnHost.addEventListener('click', (e) => { const b = e.target.closest('[data-j]'); if (b) { s.i = +b.dataset.j; show(); } });
  r('go').addEventListener('click', check);
  host.querySelectorAll('input').forEach((inp) => inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') check(); }));
  if (tree) {
    r('tree').addEventListener('click', showTree);
    tex(host.querySelector('.rc-own'));
    r('own').addEventListener('change', () => {
      const n = Math.round(+r('own').value);
      if (!(n >= 2 && n <= 999)) return;
      items.push({ t: `\\sqrt{${n}}`, P: n, Q: 1 });
      btnHost.insertAdjacentHTML('beforeend', `<button type="button" class="btn" data-j="${items.length - 1}">$\\sqrt{${n}}$</button>`);
      tex(btnHost.lastElementChild);
      s.i = items.length - 1;
      show();
    });
  }
  show();
}

window.LESSON = {
  init() {
    initGrid();
    checker($('simpChk'), $('simpBtns'), [12, 18, 24, 45, 48, 72, 75, 98, 150, 200].map((n) => ({ t: `\\sqrt{${n}}`, P: n, Q: 1 })), false);
    checker($('fracChk'), $('fracBtns'), [
      { t: '\\sqrt{\\frac25}', P: 2, Q: 5 },
      { t: '\\sqrt{3\\frac15}', P: 16, Q: 5 },
      { t: '\\frac{\\sqrt3}{\\sqrt5}', P: 3, Q: 5 },
      { t: '\\frac{1}{\\sqrt8}', P: 1, Q: 8 },
      { t: '\\sqrt{\\frac23}', P: 2, Q: 3 },
      { t: '\\sqrt{2\\frac13}', P: 7, Q: 3 },
      { t: '\\frac{1}{\\sqrt5}', P: 1, Q: 5 },
    ], true);
  },
  onRender() { requestAnimationFrame(() => redraws.forEach((f) => f())); },
};
