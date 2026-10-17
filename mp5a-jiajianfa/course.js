'use strict';
/* 五上 小数加法和减法 · 本课互动：对齐实验（末尾对齐 vs 小数点对齐）、竖式逐列计算（进位 / 退位点 / 补 0）、按比例的路线图。
 * 竖式按整数（把小数放大成整数）逐列计算，每一列的数字、进位、退位都由代码算出。 */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const PLACE_INT = ['个位', '十位', '百位'];
const PLACE_DEC = ['十分位', '百分位', '千分位'];
const placeName = (p) => (p >= 0 ? PLACE_INT[p] : PLACE_DEC[-p - 1]); // p：10 的指数

/* 第 3 页：对齐实验。数字一格一列，小数点画在格子之间 */
function initAlign() {
  const st = { m: 'dot' };
  const HEAD = ['个位', '十分位', '百分位'];
  const render = () => {
    const end = st.m === 'end';
    // 每行三格：[个位, 十分位, 百分位]；dotAfter：小数点画在第几格右边
    const rows = end
      ? [{ op: '', d: ['4', '7', '5'], dot: 0 }, { op: '+', d: ['', '3', '4'], dot: 1, bad: true }, { op: '', d: ['5', '0', '9'], dot: 0, res: true, bad: true }]
      : [{ op: '', d: ['4', '7', '5'], dot: 0 }, { op: '+', d: ['3', '4', ''], dot: 0 }, { op: '', d: ['8', '1', '5'], dot: 0, res: true, carry: 1 }];
    const head = `<tr class="hdr"><td></td>${HEAD.map((h) => `<td>${h}</td>`).join('')}</tr>`;
    const carry = end ? '' : '<tr class="cr"><td></td><td>1</td><td></td><td></td></tr>';
    const body = rows.map((r) => `<tr class="${r.res ? 'res' : ''} ${r.op ? 'lined' : ''}"><td class="op">${r.op}</td>${r.d.map((c, i) => `<td class="${r.bad && c ? 'bad' : ''} ${i === r.dot ? 'dotR' : ''}">${c}</td>`).join('')}</tr>`).join('');
    $('alGrid').innerHTML = head + carry + body;
    $('alMode').querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', b.dataset.m === st.m));
    const m = $('alMsg');
    m.className = `tip feedback ${end ? 'fb-warn' : 'fb-ok'}`;
    m.innerHTML = end
      ? '末尾对齐：3.4 的“3”是 3 个<b>一</b>，却写到了<b>十分位</b>；“4”是 4 个 0.1，却写到了<b>百分位</b>。得 5.09——比估计的 8 元少太多，<b>不对</b>！'
      : '小数点对齐：个位对个位、十分位对十分位。百分位 5 + 0 = 5；十分位 7 + 4 = 11，写 1 进 1；个位 4 + 3 + 1 = 8。得 <b>8.15</b>。';
  };
  $('alMode').addEventListener('click', (e) => {
    const m = e.target.closest('[data-m]')?.dataset.m;
    if (m) { st.m = m; render(); }
  });
  render();
}

/* 竖式：a op b，逐列计算。返回每一列（从最低位开始）的结果 */
const parse = (s) => { const [i, d = ''] = s.split('.'); return { i, d }; };
function plan(a, b, op) {
  const [pa, pb] = [parse(a), parse(b)];
  const D = Math.max(pa.d.length, pb.d.length);
  const A = +(pa.i + pa.d.padEnd(D, '0'));
  const B = +(pb.i + pb.d.padEnd(D, '0'));
  const R = op === '+' ? A + B : A - B;
  const I = Math.max(pa.i.length, pb.i.length, String(Math.floor(R / 10 ** D)).length);
  const n = I + D;
  const digs = (x) => String(x).padStart(n, '0').split('').map(Number);
  const [da, db] = [digs(A), digs(B)];
  const cols = [];
  let c = 0;
  for (let j = n - 1; j >= 0; j -= 1) {
    const p = n - 1 - j - D; // 这一列的 10 的指数
    let v;
    let out;
    if (op === '+') { v = da[j] + db[j] + c; out = v % 10; cols.push({ j, p, x: da[j], y: db[j], cin: c, out, cout: v >= 10 ? 1 : 0 }); c = v >= 10 ? 1 : 0; }
    else { v = da[j] - db[j] - c; out = (v + 10) % 10; cols.push({ j, p, x: da[j], y: db[j], cin: c, out, cout: v < 0 ? 1 : 0 }); c = v < 0 ? 1 : 0; }
  }
  return { a, b, op, pa, pb, D, I, n, R, cols };
}
const fmtR = (R, D) => { const s = String(R).padStart(D + 1, '0'); return D ? `${s.slice(0, -D)}.${s.slice(-D)}` : s; };

/* 竖式组件：problems = [[a, op, b, 按钮文字], ...] */
function mountVert(root, problems) {
  const st = { k: 0, s: 0 };
  root.innerHTML = `<div class="btns vt-pick" data-noswipe>${problems.map((p, i) => `<button type="button" class="btn ${i ? '' : 'solid'}" data-k="${i}">${p[3] || `${p[0]} ${p[1] === '-' ? '−' : '+'} ${p[2]}`}</button>`).join('')}</div>
    <table class="vt"></table>
    <div class="btns vt-go" data-noswipe><button type="button" class="btn solid" data-go="1">算下一列 ▶</button><button type="button" class="btn" data-go="0">重来</button></div>
    <p class="tip feedback vt-msg"></p>`;
  const tab = root.querySelector('.vt');
  const msg = root.querySelector('.vt-msg');
  const render = () => {
    const [a, op, b] = problems[st.k];
    const P = plan(a, b, op);
    const { n, D, cols } = P;
    const done = new Map(cols.slice(0, st.s).map((c) => [c.j, c]));
    // 每个操作数在 n 格里的数字；空着的小数位看作 0（虚框），整数前面的空位不写
    const cells = (pp) => {
      const ip = pp.i.padStart(n - D, ' ');
      const dp = pp.d.padEnd(D, '_');
      return [...ip, ...dp];
    };
    const ca = cells(P.pa);
    const cb = cells(P.pb);
    const mark = Array(n).fill('');
    cols.slice(0, st.s).forEach((c) => {
      if (!c.cout || c.j === 0) return;
      mark[c.j - 1] = op === '+' ? '1' : '•';
    });
    const td = (ch, j, extra = '') => {
      const isPad = ch === '_';
      const dotR = D && j === n - D - 1;
      return `<td class="${isPad ? 'pad' : ''} ${dotR ? 'dotR' : ''} ${done.has(j) ? 'did' : ''} ${extra}">${isPad ? '0' : ch === ' ' ? '' : ch}</td>`;
    };
    const rText = fmtR(P.R, D);
    const rDigits = rText.replace('.', '').padStart(n, ' ');
    const resRow = [...rDigits].map((ch, j) => {
      const show = done.has(j) && (j >= n - rText.replace('.', '').length);
      const dotR = D && j === n - D - 1 && st.s === cols.length;
      return `<td class="${dotR ? 'dotR' : ''} ${done.has(j) && st.s === j + 1 ? '' : ''} ${show && st.s && cols[st.s - 1].j === j ? 'cur' : ''}">${show ? ch : ''}</td>`;
    }).join('');
    const borrowRow = op === '-' ? `<tr class="cr"><td></td>${mark.map((m) => `<td>${m}</td>`).join('')}</tr>` : '';
    const carryRow = op === '+' ? `<tr class="cr bot"><td></td>${mark.map((m) => `<td>${m}</td>`).join('')}</tr>` : '';
    tab.innerHTML = `${borrowRow}<tr><td class="op"></td>${ca.map((c, j) => td(c, j)).join('')}</tr><tr class="lined"><td class="op">${op === '-' ? '−' : '+'}</td>${cb.map((c, j) => td(c, j)).join('')}</tr>${carryRow}<tr class="res"><td></td>${resRow}</tr>`;
    if (st.s === 0) { msg.className = 'tip feedback vt-msg'; msg.innerHTML = `小数点对齐，${D ? `从<b>${placeName(-D)}</b>` : '从个位'}算起。${ca.includes('_') || cb.includes('_') ? '空着的数位看作 0（虚框）。' : ''}`; return; }
    const c = cols[st.s - 1];
    const nm = placeName(c.p);
    let col;
    if (op === '+') col = `${nm}：${c.x} + ${c.y}${c.cin ? ' + 1（进上来的）' : ''} = ${c.x + c.y + c.cin}${c.cout ? `，写 ${c.out}，向${placeName(c.p + 1)}进 1` : ''}。`;
    else {
      const top = c.x - c.cin;
      col = c.cin && c.x === 0
        ? `${nm}：这一位是 0，不够退给后面一位，先从${placeName(c.p + 1)}退 1（打退位点）看作 10，退给后面 1 还剩 9，9 − ${c.y} = ${c.out}。`
        : `${nm}：${c.cin ? `${c.x} 退给后面 1，还剩 ${top}，` : ''}${c.cout ? `${top} − ${c.y} 不够减，从${placeName(c.p + 1)}退 1（打退位点），${top + 10} − ${c.y} = ${c.out}` : `${top} − ${c.y} = ${c.out}`}。`;
    }
    if (st.s < cols.length) { msg.className = 'tip feedback vt-msg'; msg.innerHTML = col; return; }
    const simple = rText.includes('.') ? rText.replace(/0+$/, '').replace(/\.$/, '') : rText;
    msg.className = 'tip feedback vt-msg fb-ok';
    msg.innerHTML = `${col}<br>得数里对齐横线上的小数点，点上小数点：<b>${a} ${op === '-' ? '−' : '+'} ${b} = ${rText}</b>${simple !== rText ? `，化简成 <b>${simple}</b>` : ''}。`;
  };
  root.querySelector('.vt-pick').addEventListener('click', (e) => {
    const k = e.target.closest('[data-k]')?.dataset.k;
    if (k === undefined) return;
    st.k = +k; st.s = 0;
    root.querySelectorAll('.vt-pick .btn').forEach((b) => b.classList.toggle('solid', b.dataset.k === k));
    render();
  });
  root.querySelector('.vt-go').addEventListener('click', (e) => {
    const g = e.target.closest('[data-go]')?.dataset.go;
    if (g === undefined) return;
    const P = plan(problems[st.k][0], problems[st.k][2], problems[st.k][1]);
    st.s = g === '1' ? Math.min(P.cols.length, st.s + 1) : 0;
    render();
  });
  render();
}

/* 第 9 页：路线图（1 千米 = 200 个单位） */
const STOPS = [['少年宫', 0], ['小冬家', 2.15], ['学校', 2.7], ['小华家', 4.25]];
function initRoute() {
  const svg = $('routeFig');
  const [x0, k, y] = [60, 200, 95];
  const X = (km) => x0 + km * k;
  svgEl('line', { x1: X(0), x2: X(4.25), y1: y, y2: y, class: 'rt-road' }, svg);
  STOPS.forEach(([nm, km]) => {
    svgEl('circle', { cx: X(km), cy: y, r: 9, class: 'rt-stop' }, svg);
    svgEl('text', { x: X(km), y: y + 38, class: 'rt-name' }, svg).textContent = nm;
  });
  [[0, 2.15, '2.15 km'], [2.15, 2.7, '0.55 km'], [2.7, 4.25, '1.55 km']].forEach(([a, b, t]) => {
    const [xa, xb] = [X(a) + 4, X(b) - 4];
    const m = (xa + xb) / 2;
    svgEl('path', { d: `M${xa} ${y - 22}Q${xa} ${y - 34} ${xa + 12} ${y - 34}H${m - 10}l10 -10l10 10H${xb - 12}Q${xb} ${y - 34} ${xb} ${y - 22}`, class: 'rt-brace' }, svg);
    svgEl('text', { x: m, y: y - 52, class: 'rt-len' }, svg).textContent = t;
  });
}

window.LESSON = {
  init() {
    initAlign();
    mountVert($('vt1'), [['4.75', '+', '3.4'], ['4.75', '-', '3.4'], ['4.75', '+', '2.65'], ['4.75', '-', '2.65']]);
    mountVert($('vt2'), [['3.4', '-', '2.65'], ['8', '-', '2.65'], ['0.75', '+', '2.65', '验算 0.75 + 2.65']]);
    initRoute();
  },
};
