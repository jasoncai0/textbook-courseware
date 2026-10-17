'use strict';
/* 课本插件 · 竖式（小学小数乘法、除法用；不依赖 math.js，加载在 course.js 之前）
 * 竖式里的每个数字、小数点、横线都由代码按数位排版，积和商用 BigInt 逐位精确计算，不手写结果。
 * 1. 乘法：const m = MVert.mul(el, '0.28', '0.28', { round: 2 });
 *    课本写法：两个因数末位对齐，先按整数乘。分步：0 两个因数 → 部分积（每行一步，只有一行时省略）
 *    → 整数积 → 点小数点（位数不够在前面补 0，粉色）→ round: k 时框出第 k+1 位小数（四舍五入看它）。
 *    o.dec 可指定积的小数位数（故意点错，用于“辨一辨”）。o.start 初始显示到第几步。
 *    m.total 最后一步的序号；m.show(n) 显示到第 n 步；m.product 积（字符串）；m.approx 近似值；m.stage.point 点小数点那一步。
 * 2. 除法：const d = MVert.div(el, '7.98', '4.2', { places: 2 });
 *    除数是小数时自动把除数变成整数：原来的小数点划掉（灰色斜线），被除数的小数点向右移动同样的位数（红点），
 *    位数不够补 0（粉色）。分步：0 列竖式 → 每商一位（非 0）一步：商、乘积、横线、余数落下一位。
 *    places：商最多算到小数点后第几位（除不尽时用）；d.quotient 商；d.steps[i] = { col, cur, q, r }（每一位，含商 0 的位）。
 */
const MVert = (() => {
  const NS = 'http://www.w3.org/2000/svg';
  const CW = 40; // 一个数位的宽
  const RH = 46; // 一行的高
  const PAD = 14;

  function parse(s) {
    const t = String(s).trim();
    const [i, f = ''] = t.split('.');
    return { chars: (i + f).split(''), intLen: i.length, dec: f.length, int: BigInt((i + f).replace(/^0+(?=\d)/, '')) };
  }

  /** 整数 v 表示 v / 10^n，四舍五入保留 k 位小数，返回字符串（不用浮点，避免 1.005 这类误差） */
  function roundStr(v, n, k) {
    const cut = 10n ** BigInt(n - k);
    let q = v / cut;
    if ((v % cut) * 2n >= cut) q += 1n;
    const t = q.toString().padStart(k + 1, '0');
    return k ? `${t.slice(0, -k)}.${t.slice(-k)}` : t;
  }

  /* 画布：先收集图元（列号可以是负数、小数），最后统一平移 */
  function sheet(host) {
    const el = typeof host === 'string' ? document.querySelector(host) : host;
    el.classList.add('mvert');
    const items = [];
    const add = (kind, a, s, cls = '') => items.push({ kind, a, s, cls });
    return {
      el,
      digit: (col, row, ch, s, cls) => add('t', { col, row, ch }, s, cls),
      point: (bnd, row, s, cls) => add('p', { bnd, row }, s, cls), // bnd：小数点画在第 bnd 列的左边界
      slash: (bnd, row, s) => add('x', { bnd, row }, s, 'mv-slash'),
      line: (c0, c1, row, s, cls) => add('l', { c0, c1, row }, s, cls),
      box: (col, row, s) => add('b', { col, row }, s, 'mv-box'),
      bracket: (c1, row, s) => add('k', { c1, row }, s, 'mv-ln'),
      render() {
        const cols = items.flatMap((d) => [d.a.col ?? d.a.bnd ?? d.a.c0, (d.a.col ?? d.a.c1 ?? d.a.bnd) + 1]).filter((v) => v !== undefined);
        const rows = items.map((d) => d.a.row);
        const c0 = Math.floor(Math.min(...cols)) - 0.4;
        const c1 = Math.max(...cols) + 0.2;
        const nRow = Math.max(...rows) + 1;
        const W = (c1 - c0) * CW + 2 * PAD;
        const H = nRow * RH + PAD;
        const X = (c) => PAD + (c - c0) * CW;
        const base = (r) => PAD / 2 + r * RH + RH * 0.74;
        const mk = (tag, attrs, txt) => {
          const e = document.createElementNS(NS, tag);
          Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
          if (txt !== undefined) e.textContent = txt;
          return e;
        };
        const svg = mk('svg', { viewBox: `0 0 ${W.toFixed(1)} ${H}`, role: 'img' });
        items.forEach((d) => {
          const { a } = d;
          let e;
          if (d.kind === 't') e = mk('text', { x: X(a.col + 0.5), y: base(a.row), class: `mv-d ${d.cls}` }, a.ch);
          else if (d.kind === 'p') e = mk('circle', { cx: X(a.bnd), cy: base(a.row) - 2.5, r: 3.6, class: `mv-pt ${d.cls}` });
          else if (d.kind === 'x') e = mk('path', { d: `M${X(a.bnd) - 7} ${base(a.row) - 15}L${X(a.bnd) + 4} ${base(a.row) + 3}`, class: d.cls });
          else if (d.kind === 'l') { const y = PAD / 2 + (a.row + 1) * RH - 3; e = mk('path', { d: `M${X(a.c0) - 4} ${y}H${X(a.c1 + 1) + 4}`, class: `mv-ln ${d.cls}` }); }
          else if (d.kind === 'b') e = mk('rect', { x: X(a.col) + 3, y: base(a.row) - RH * 0.62, width: CW - 6, height: RH * 0.76, rx: 4, class: d.cls });
          else if (d.kind === 'k') {
            const top = PAD / 2 + a.row * RH + 4;
            const x = X(0) - 6;
            e = mk('path', { d: `M${x - 4} ${top + RH - 4}Q${x + 7} ${top + RH / 2} ${x} ${top}H${X(a.c1 + 1) + 6}`, class: d.cls });
          }
          e.dataset.s = d.s;
          svg.appendChild(e);
        });
        el.innerHTML = '';
        el.appendChild(svg);
        el.style.setProperty('--mv-w', `${((c1 - c0) * 1.2 + 0.8).toFixed(2)}em`);
        return svg;
      },
    };
  }

  function stepper(svg, total) {
    let n = total;
    const show = (k, hl = true) => {
      n = Math.max(0, Math.min(total, k));
      svg.querySelectorAll('[data-s]').forEach((e) => {
        const s = +e.dataset.s;
        e.classList.toggle('off', s > n);
        e.classList.toggle('cur', hl && s === n && n > 0);
      });
      return n;
    };
    return { show, get now() { return n; } };
  }

  /* ---------- 乘法 ---------- */
  function mul(host, a, b, o = {}) {
    const sh = sheet(host);
    const A = parse(a);
    const B = parse(b);
    const ib = String(B.int);
    const P = String(A.int * B.int);
    const n = o.dec ?? A.dec + B.dec; // o.dec：故意点错的位数（辨一辨用）
    const padded = P.length <= n ? '0'.repeat(n - P.length + 1) + P : P;
    const R = 0; // 末位所在列
    const left = R - Math.max(A.chars.length, B.chars.length);
    const putNum = (str, rightCol, row, s, cls) => str.split('').forEach((ch, i) => sh.digit(rightCol - (str.length - 1 - i), row, ch, s, cls));

    putNum(A.chars.join(''), R, 0, 0);
    putNum(B.chars.join(''), R, 1, 0);
    if (A.dec) sh.point(R - A.dec + 1, 0, 0);
    if (B.dec) sh.point(R - B.dec + 1, 1, 0);
    sh.digit(left, 1, '×', 0, 'mv-op');
    const lineL = Math.min(left, R - padded.length + 1);
    sh.line(lineL, R, 1, 0);
    let row = 2;
    let s = 0;
    const parts = ib.split('').reverse().map((d, j) => ({ d: +d, j })).filter((p) => p.d);
    if (parts.length > 1) {
      parts.forEach(({ d, j }) => { s += 1; putNum(String(A.int * BigInt(d)), R - j, row, s); row += 1; });
      sh.line(lineL, R, row - 1, s);
    }
    s += 1;
    const intStage = s;
    putNum(P, R, row, s);
    s += 1;
    const pointStage = s;
    if (n) {
      putNum(padded.slice(0, padded.length - P.length), R - P.length, row, s, 'mv-add');
      sh.point(R - n + 1, row, s, 'mv-new');
    }
    const prodStr = n ? `${padded.slice(0, padded.length - n)}.${padded.slice(-n)}` : P;
    const product = n ? prodStr.replace(/0+$/, '').replace(/\.$/, '') : P;
    let approx = null;
    if (o.round !== undefined && o.round < n) {
      s += 1;
      sh.box(R - n + o.round + 1, row, s);
      approx = roundStr(BigInt(P), n, o.round);
    }
    const svg = sh.render();
    const st = stepper(svg, s);
    st.show(o.start ?? s, false);
    return { total: s, show: st.show, get now() { return st.now; }, product, approx, stage: { int: intStage, point: pointStage }, intProduct: P };
  }

  /* ---------- 除法 ---------- */
  function div(host, dividend, divisor, o = {}) {
    const sh = sheet(host);
    const S = parse(dividend);
    const T = parse(divisor);
    const k = T.dec;
    const p = S.intLen + k; // 移动后，小数点前有 p 位
    const D = S.chars.slice();
    while (D.length < p) D.push('0');
    const addFrom = S.chars.length; // 从这一位起是补上的 0
    const d = T.int;
    const places = o.places ?? 6;
    const N = Math.max(D.length, p + places);

    // 逐位试商
    const steps = [];
    const Q = [];
    let r = 0n;
    let started = false;
    for (let i = 0; i < N; i += 1) {
      if (i >= D.length) D.push('0');
      const cur = r * 10n + BigInt(D[i]);
      const q = cur / d;
      if (!started && q === 0n) { Q[i] = i >= p - 1 ? '0' : ''; r = cur; continue; }
      started = true;
      Q[i] = String(q);
      r = cur - q * d;
      steps.push({ col: i, cur, q: Number(q), r });
      if (r === 0n && i >= Math.max(addFrom, p) - 1) break;
    }
    const last = steps.length ? steps[steps.length - 1].col : D.length - 1;
    const used = Math.max(last + 1, addFrom, Math.min(p, D.length));
    const nz = steps.filter((x) => x.q > 0);
    // 第 c 位在哪一步出现：第一个列号 ≥ c 的非 0 步
    const stageOf = (c) => { const i = nz.findIndex((x) => x.col >= c); return i < 0 ? nz.length : i + 1; };
    // 被除数后面补的 0：在哪一步的余数行里被“落下来”
    const downOf = (c) => { const i = nz.findIndex((x) => x.col >= c); return i < 0 ? nz.length : Math.max(1, i); };

    // 除数（右对齐到括号左边）、括号、被除数
    const tw = T.chars.length;
    T.chars.forEach((ch, i) => sh.digit(-tw - 0.35 + i, 1, ch, 0));
    if (k) { sh.point(-tw - 0.35 + T.intLen, 1, 0, 'mv-old'); sh.slash(-tw - 0.35 + T.intLen, 1, 0); }
    sh.bracket(used - 1, 1, 0);
    for (let c = 0; c < used; c += 1) {
      const extra = c >= addFrom;
      sh.digit(c, 1, D[c], extra && c >= Math.max(p, addFrom) ? downOf(c) : 0, extra ? 'mv-add' : '');
    }
    if (S.dec) {
      if (k) { sh.point(S.intLen, 1, 0, 'mv-old'); sh.slash(S.intLen, 1, 0); } else sh.point(S.intLen, 1, 0);
    }
    if (used > p && !(S.dec && !k)) sh.point(p, 1, p < addFrom ? 0 : downOf(p), k ? 'mv-new' : '');

    // 商
    Q.forEach((ch, c) => { if (ch && c <= last) sh.digit(c, 0, ch, stageOf(c), 'mv-q'); });
    if (last >= p) sh.point(p, 0, stageOf(p), 'mv-q');

    // 每一步：乘积、横线、余数（落下下一位）
    nz.forEach((x, i) => {
      const s = i + 1;
      const row = 2 + 2 * i;
      const prod = String(BigInt(x.q) * d);
      prod.split('').forEach((ch, j) => sh.digit(x.col - (prod.length - 1 - j), row, ch, s));
      const nextCur = nz[i + 1] ? nz[i + 1] : null;
      const remCol = nextCur ? nextCur.col : last;
      const remVal = nextCur ? String(nextCur.cur) : String(steps[steps.length - 1].r);
      sh.line(Math.min(x.col - prod.length + 1, remCol - remVal.length + 1), x.col, row, s);
      remVal.split('').forEach((ch, j) => sh.digit(remCol - (remVal.length - 1 - j), row + 1, ch, s));
    });

    const digits = Q.slice(0, last + 1);
    let quotient = '';
    digits.forEach((ch, c) => { if (ch) quotient += ch; if (c === p - 1 && last >= p) quotient += '.'; });
    if (quotient.startsWith('.')) quotient = `0${quotient}`;

    const svg = sh.render();
    const st = stepper(svg, nz.length);
    st.show(o.start ?? nz.length, false);
    return { total: nz.length, show: st.show, get now() { return st.now; }, quotient, steps, remainder: steps.length ? steps[steps.length - 1].r : 0n, exact: steps.length > 0 && steps[steps.length - 1].r === 0n };
  }

  /** 步进按钮：MVert.bind(m, prevBtn, nextBtn, onChange, max) —— 点按钮一步一步演示（max：最多演示到第几步） */
  function bind(m, prev, next, onChange, max = m.total) {
    const go = (k) => { const n = m.show(Math.min(k, max)); if (prev) prev.disabled = n <= 0; if (next) next.disabled = n >= max; if (onChange) onChange(n); };
    if (prev) prev.addEventListener('click', () => go(m.now - 1));
    if (next) next.addEventListener('click', () => go(m.now + 1));
    go(m.now);
    return go;
  }

  return { mul, div, bind, parse, roundStr };
})();
window.MVert = MVert;
