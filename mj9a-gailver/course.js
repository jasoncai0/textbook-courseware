'use strict';
/* 九上 4.3 等可能条件下的概率（二）· 本课互动：
 * 真随机转盘（指针停在 [0°,360°) 的均匀随机角度上，按扇形精确判定落点）、可调红色份数并打乱位置的转盘、
 * 例题 24 等分转盘、设计转盘、飞镖板随机投掷、习题转盘与“积的奇偶”表格、正方形内随机投点估计面积比。
 * 随机数取自 crypto.getRandomValues；所有扇形的圆心角、格子位置都由代码精确计算。 */
const $ = (id) => document.getElementById(id);
const rand = () => crypto.getRandomValues(new Uint32Array(1))[0] / 0x100000000; // [0, 1)
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const frac = (m, n) => { const g = gcd(m, n) || 1; return n / g === 1 ? String(m / g) : `${m / g}/${n / g}`; };

const COL = { R: '#e5533d', Y: '#f5d547', B: '#5b9bd5', W: '#ffffff', P: '#8f86c7', C: '#93d6e2', F: '#fbe7a1' };
const NAME = { R: '红', Y: '黄', B: '蓝', W: '白', P: '紫' };

/** 扇形路径：圆心 (c, c)，半径 r，从 12 点方向顺时针 a0° 到 a1° */
function sectorPath(c, r, a0, a1) {
  const P = (a) => [c + r * Math.sin(a * Math.PI / 180), c - r * Math.cos(a * Math.PI / 180)];
  if (a1 - a0 >= 359.999) return `M${c - r} ${c} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
  const [x0, y0] = P(a0);
  const [x1, y1] = P(a1);
  return `M${c} ${c} L${x0} ${y0} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1} Z`;
}

/** 把 [{c, a}]（颜色、圆心角）从 off° 起依次排开，返回 [{c, a0, a1, lab}] */
function layout(list, off = 0) {
  let a = off;
  return list.map((s) => { const r = { ...s, a0: a, a1: a + s.a }; a += s.a; return r; });
}
const equal = (cols, off = 0, labs) => layout(cols.map((c, i) => ({ c, a: 360 / cols.length, lab: labs && labs[i] })), off);

/** 画转盘（静态）；返回 svg 内容字符串 */
function diskSvg(secs, o = {}) {
  const c = 150;
  const r = 136;
  let h = secs.map((s) => `<path d="${sectorPath(c, r, s.a0, s.a1)}" fill="${COL[s.c]}" stroke="#34495e" stroke-width="${o.sw || 2}" stroke-linejoin="round"/>`).join('');
  h += `<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="#2c3e74" stroke-width="3"/>`;
  secs.forEach((s) => {
    if (s.lab === undefined) return;
    const m = (s.a0 + s.a1) / 2 * Math.PI / 180;
    const rr = o.labR || r * 0.66;
    h += `<text x="${c + rr * Math.sin(m)}" y="${c - rr * Math.cos(m) + 9}" class="sl" style="font-size:${o.fs || 28}px">${s.lab}</text>`;
  });
  return h;
}
const arrow = (cls = 'ptr') => `<g class="${cls}"><line x1="150" y1="150" x2="150" y2="52" stroke="#111" stroke-width="5"/><path d="M150 34 L139 60 L161 60 Z" fill="#111"/><circle cx="150" cy="150" r="8" fill="#111"/></g>`;

/** 可转动的转盘：host 里放 svg + 按钮 + 统计表；get() 返回当前扇形，tally: [{ name, keys }] */
function spinner(host, cfg) {
  host.innerHTML = `<svg class="disk" viewBox="0 0 300 300" aria-label="转盘"></svg>
    <div class="btns" data-noswipe><button class="btn solid" data-n="1">转 1 次</button>${cfg.simple ? '' : '<button class="btn" data-n="100">转 100 次</button><button class="btn" data-n="1000">转 1000 次</button><button class="btn" data-n="0">清零</button>'}</div>
    ${cfg.simple ? '' : '<table class="ftab"></table>'}`;
  const svg = host.querySelector('svg');
  const tab = host.querySelector('table');
  let ang = 0; // 指针累计转过的角度（动画用）
  let total = 0;
  let cnt = cfg.tally.map(() => 0);
  const draw = () => { svg.innerHTML = diskSvg(cfg.get(), cfg.disk) + arrow(); svg.querySelector('.ptr').style.transform = `rotate(${ang}deg)`; };
  const theory = (t) => cfg.get().filter((s) => t.keys.includes(s.c)).reduce((x, s) => x + s.a, 0);
  const show = () => {
    if (!tab) return;
    tab.innerHTML = `<tr><th>落在</th><th>次数</th><th>频率</th><th>面积比（概率）</th></tr>${cfg.tally.map((t, i) => {
      const deg = theory(t);
      return `<tr><td><i class="sw" style="background:${t.keys.length > 1 ? `linear-gradient(90deg, ${t.keys.map((k) => COL[k]).join(',')})` : COL[t.keys[0]]}"></i>${t.name}</td><td>${cnt[i]}</td><td>${total ? (cnt[i] / total).toFixed(3) : '—'}</td><td>${frac(Math.round(deg * 1000), 360000)} ≈ ${(deg / 360).toFixed(3)}</td></tr>`;
    }).join('')}<tr><td colspan="4" class="tot">共转 ${total} 次</td></tr>`;
  };
  const hit = (theta) => cfg.get().find((s) => (((theta - s.a0) % 360) + 360) % 360 < s.a);
  const record = (theta) => {
    const s = hit(theta);
    cfg.tally.forEach((t, i) => { if (s && t.keys.includes(s.c)) cnt[i] += 1; });
    total += 1;
  };
  host.querySelector('.btns').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-n]');
    if (!b) return;
    const k = +b.dataset.n;
    if (!k) { total = 0; cnt = cnt.map(() => 0); show(); return; }
    let theta = 0;
    for (let i = 0; i < k; i++) { theta = rand() * 360; record(theta); }
    const base = Math.ceil(ang / 360) * 360;
    ang = base + (k === 1 ? 1080 : 360) + theta; // 转几圈后停在 theta
    const p = svg.querySelector('.ptr');
    p.style.transition = k === 1 ? 'transform 2.2s cubic-bezier(.15,.7,.2,1)' : 'transform .6s ease-out';
    p.style.transform = `rotate(${ang}deg)`;
    show();
  });
  draw();
  show();
  return { redraw: () => { draw(); show(); }, reset: () => { total = 0; cnt = cnt.map(() => 0); draw(); show(); } };
}

/* ---------- 第 3 页：图 4-7 空白转盘、图 4-8 八等分转盘 ---------- */
$('blank47').innerHTML = `<circle cx="150" cy="150" r="136" fill="${COL.F}" stroke="#e0c050" stroke-width="3"/>${arrow()}`;
$('blank47').querySelector('.ptr').style.transform = 'rotate(20deg)';
const S48 = equal(['R', 'R', 'R', 'P', 'P', 'R', 'R', 'R'], 0);
spinner($('spin48'), { get: () => S48, tally: [{ name: '红色区域', keys: ['R'] }, { name: '紫色区域', keys: ['P'] }] });

/* ---------- 第 4 页：24 格，红色 k 格，可打乱位置 ---------- */
(() => {
  const st = { k: 6, order: Array.from({ length: 24 }, (_, i) => i) };
  const secs = () => equal(st.order.map((i) => (i < st.k ? 'R' : 'W')), 0);
  const sp = spinner($('spinK'), { get: secs, tally: [{ name: '红色区域', keys: ['R'] }], disk: { sw: 1.2 } });
  const out = $('kOut');
  const upd = () => {
    out.innerHTML = `红色 <b>${st.k}</b> 格 / 24 格，红色圆心角 <b>${st.k * 15}°</b>，$P(\\text{红})=\\dfrac{${st.k * 15}}{360}=${st.k ? `\\dfrac{${st.k}}{24}` : '0'}${gcd(st.k, 24) > 1 && st.k ? `=\\dfrac{${st.k / gcd(st.k, 24)}}{${24 / gcd(st.k, 24)}}` : ''}$`;
    MathKit.tex(out);
    sp.reset();
  };
  MathKit.slider($('kSlider'), (v) => { st.k = v; upd(); });
  $('kShuffle').addEventListener('click', () => {
    const a = [...st.order];
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    st.order = a;
    upd();
  });
  $('kTidy').addEventListener('click', () => { st.order = Array.from({ length: 24 }, (_, i) => i); upd(); });
})();

/* ---------- 第 5 页：例题 24 等分转盘（红 1、蓝 3、黄 5、白 15） ---------- */
const EX24 = (() => {
  const cols = Array(24).fill('W');
  const seq = ['R', 'Y', 'B', 'Y', 'B', 'Y', 'B', 'Y', 'Y'];
  seq.forEach((c, i) => { cols[Math.floor(i * 24 / seq.length)] = c; });
  return equal(cols, 0, Array.from({ length: 24 }, (_, i) => i + 1));
})();
spinner($('spin24'), {
  get: () => EX24, disk: { sw: 1.2, fs: 13, labR: 120 },
  tally: [{ name: '红（500 元）', keys: ['R'] }, { name: '蓝（100 元）', keys: ['B'] }, { name: '黄（50 元）', keys: ['Y'] }, { name: '获得礼品', keys: ['R', 'B', 'Y'] }],
});

/* ---------- 第 6 页：设计转盘（以 1/12 为单位） ---------- */
(() => {
  const st = { R: 6, Y: 3, B: 3 };
  const TARGET = [{ name: '(1)', R: 6, Y: 3, B: 3 }, { name: '(2)', R: 6, Y: 3, B: 2 }];
  const svg = $('designDisk');
  const ctl = $('designCtl');
  const msg = $('designMsg');
  ctl.innerHTML = ['R', 'Y', 'B'].map((c) => `<div class="stp" data-c="${c}"><i class="sw" style="background:${COL[c]}"></i>${NAME[c]}色 <button class="btn" data-d="-1">−</button><b data-v></b><button class="btn" data-d="1">＋</button></div>`).join('');
  const draw = () => {
    const w = 12 - st.R - st.Y - st.B;
    const list = [['R', st.R], ['Y', st.Y], ['B', st.B], ['W', w]].filter(([, n]) => n > 0).map(([c, n]) => ({ c, a: n * 30 }));
    svg.innerHTML = diskSvg(layout(list, 0)) + Array.from({ length: 12 }, (_, i) => `<line x1="150" y1="150" x2="${150 + 136 * Math.sin(i * Math.PI / 6)}" y2="${150 - 136 * Math.cos(i * Math.PI / 6)}" class="tick12"/>`).join('') + arrow();
    ctl.querySelectorAll('.stp').forEach((d) => { d.querySelector('[data-v]').textContent = frac(st[d.dataset.c], 12); });
    const ok = TARGET.filter((t) => t.R === st.R && t.Y === st.Y && t.B === st.B).map((t) => t.name);
    msg.innerHTML = `红 ${frac(st.R, 12)}，黄 ${frac(st.Y, 12)}，蓝 ${frac(st.B, 12)}，其余（白）${frac(w, 12)}．${ok.length ? `<b class="okc">✓ 符合要求 ${ok[0]}</b>` : ''}`;
  };
  ctl.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-d]');
    if (!b) return;
    const c = b.closest('.stp').dataset.c;
    const v = st[c] + +b.dataset.d;
    if (v < 0 || st.R + st.Y + st.B + +b.dataset.d > 12) return;
    st[c] = v;
    draw();
  });
  draw();
})();

/* ---------- 第 7 页：练习 1 六等分转盘、练习 2 飞镖板 ---------- */
spinner($('spin6'), {
  get: () => equal(['C', 'C', 'C', 'C', 'C', 'C'], 0, [1, 2, 3, 4, 5, 6]),
  tally: [], simple: true,
});

const DART = ['BWWWBB', 'BBBWWW', 'BWWWWB', 'WWBBWW', 'BWBWBW', 'WBWWWB']; // 课本 p141 第 2 题，逐格核对
(() => {
  const svg = $('dart');
  const U = 50;
  let base = '';
  DART.forEach((row, r) => [...row].forEach((ch, c) => { base += `<rect x="${c * U}" y="${r * U}" width="${U}" height="${U}" class="${ch === 'B' ? 'db' : 'dw'}"/>`; }));
  svg.setAttribute('viewBox', `-2 -2 ${6 * U + 4} ${6 * U + 4}`);
  const dots = [];
  let nB = 0;
  let total = 0;
  const show = () => {
    svg.innerHTML = base + dots.map(([x, y]) => `<circle cx="${x * U}" cy="${y * U}" r="3.2" class="dd"/>`).join('');
    $('dartSt').innerHTML = `已投 <b>${total}</b> 次：黑 ${nB} 次（频率 ${total ? (nB / total).toFixed(3) : '—'}），白 ${total - nB} 次（频率 ${total ? ((total - nB) / total).toFixed(3) : '—'}）．`;
  };
  $('dartBtns').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-n]');
    if (!b) return;
    const k = +b.dataset.n;
    if (!k) { dots.length = 0; nB = 0; total = 0; show(); return; }
    for (let i = 0; i < k; i++) {
      const x = rand() * 6;
      const y = rand() * 6;
      if (DART[Math.floor(y)][Math.floor(x)] === 'B') nB += 1;
      total += 1;
      dots.push([x, y]);
    }
    if (dots.length > 300) dots.splice(0, dots.length - 300); // 只画最近 300 个点
    show();
  });
  show();
})();

/* ---------- 第 8 页：习题转盘（静态，按课本图逐扇形核对） ---------- */
const stat = (id, secs, o) => { const s = $(id); s.setAttribute('viewBox', '0 0 300 300'); s.innerHTML = diskSvg(secs, o) + arrow(); };
stat('ex1a', equal(['R', 'W', 'Y', 'W'], -45));
stat('ex1b', equal(['W', 'R', 'R'], 0));
stat('ex1c', equal(['R', 'P', 'R', 'P', 'R', 'R', 'P', 'R'], 0));
stat('exA', equal(['C', 'C', 'C', 'C'], -45, [1, 4, 3, 2]), { fs: 40 });
stat('exB', equal(['C', 'C', 'C', 'C', 'C', 'C'], 10, [6, 5, 4, 3, 2, 1]), { fs: 40 });
$('exB').querySelector('.ptr').style.transform = 'rotate(118deg)';
$('exA').querySelector('.ptr').style.transform = 'rotate(22deg)';
(() => {
  const A = [1, 2, 3, 4];
  const B = [1, 2, 3, 4, 5, 6];
  $('prodTab').innerHTML = `<tr><th class="corner"><span class="c-top">B</span><span class="c-bot">A</span></th>${B.map((b) => `<th>${b}</th>`).join('')}</tr>${A.map((a) => `<tr><th>${a}</th>${B.map((b) => `<td class="${(a * b) % 2 ? 'odd' : ''}">${a * b}</td>`).join('')}</tr>`).join('')}`;
  $('prodBtn').addEventListener('click', () => $('prodTab').classList.toggle('show'));
})();

/* ---------- 第 9 页：正方形内随机投点（阅读：面积之比） ---------- */
(() => {
  const svg = $('mc');
  const S = 300;
  let inC = 0;
  let total = 0;
  const pts = [];
  const show = () => {
    svg.innerHTML = `<rect x="0" y="0" width="${S}" height="${S}" class="mq"/><circle cx="${S / 2}" cy="${S / 2}" r="${S / 2}" class="mcirc"/>${pts.map(([x, y, i]) => `<circle cx="${x * S}" cy="${y * S}" r="2.2" class="${i ? 'pin' : 'pout'}"/>`).join('')}`;
    const f = total ? inC / total : 0;
    $('mcSt').innerHTML = total ? `已投 <b>${total}</b> 个点，落在圆内 <b>${inC}</b> 个，频率 ${f.toFixed(4)}；面积比 $\\dfrac{\\pi}{4}\\approx0.7854$．频率 × 4 ≈ <b>${(4 * f).toFixed(3)}</b>` : '点按钮向正方形内随机投点．';
    MathKit.tex($('mcSt'));
  };
  $('mcBtns').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-n]');
    if (!b) return;
    const k = +b.dataset.n;
    if (!k) { pts.length = 0; inC = 0; total = 0; show(); return; }
    for (let i = 0; i < k; i++) {
      const x = rand();
      const y = rand();
      const isIn = (x - 0.5) ** 2 + (y - 0.5) ** 2 < 0.25;
      inC += isIn ? 1 : 0;
      total += 1;
      pts.push([x, y, isIn]);
    }
    if (pts.length > 2000) pts.splice(0, pts.length - 2000);
    show();
  });
  svg.setAttribute('viewBox', `-2 -2 ${S + 4} ${S + 4}`);
  show();
})();
