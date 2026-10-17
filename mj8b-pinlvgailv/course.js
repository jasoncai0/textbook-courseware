'use strict';
/* 八下 8.3 频率与概率 · 本课互动：全班抛硬币（真随机，每次 +50）表与折线、小明数据折线、统计学家频率偏差图、
 * 大量重复试验模拟器（硬币 / 摸球 3 白 1 红 / 骰子，每组 2 000 次，多组叠加，揭晓概率）、足球与图钉折线。
 * 课本数据的折线均按表中数值精确绘制。 */
const { fmt } = MathKit;
const $ = (id) => document.getElementById(id);
const boards = [];

/* ---------- 第 4 页：全班抛硬币 ---------- */
function initCoin() {
  const rows = []; // [n, m]
  let n = 0;
  let m = 0;
  const xs = () => rows.map((r) => r[0]);
  const fr = () => rows.map((r) => r[1] / r[0]);
  const b = MStat.line($('coinLine'), {
    xs, x: [-30, 560], y: [-0.06, 1.08], tx: 50, ty: 0.1, w: 560, h: 320, labels: ['抛掷次数', '频率'],
    series: [{ vals: fr, color: '#d9711c', maxN: 10 }],
  });
  b.seg([[0, 0.5], [520, 0.5]], { cls: 'dash' });
  boards.push(b);
  const render = () => {
    const cells = (f) => Array.from({ length: 10 }, (_, i) => `<td>${rows[i] ? f(rows[i]) : ''}</td>`).join('');
    $('coinTab').innerHTML = `<tr><th>抛掷次数 $n$</th>${Array.from({ length: 10 }, (_, i) => `<td>${(i + 1) * 50}</td>`).join('')}</tr>`
      + `<tr><th>正面朝上的频数 $m$</th>${cells((r) => r[1])}</tr><tr><th>频率 $\\frac{m}{n}$</th>${cells((r) => (r[1] / r[0]).toFixed(2))}</tr>`;
    MathKit.tex($('coinTab'));
    const msg = $('coinMsg');
    msg.className = `tip feedback ${n ? 'fb-ok' : ''}`;
    msg.innerHTML = n ? `已抛 ${n} 次，正面朝上 ${m} 次，频率 ${(m / n).toFixed(3)}。` : '点按钮开始汇总（每次 5 人 × 10 次）。';
    b.update();
  };
  const add = () => {
    if (n >= 500) return;
    for (let i = 0; i < 50; i++) if (Math.random() < 0.5) m += 1;
    n += 50;
    rows.push([n, m]);
  };
  $('coinAdd').addEventListener('click', () => { add(); render(); });
  $('coinAll').addEventListener('click', () => { while (n < 500) add(); render(); });
  $('coinClr').addEventListener('click', () => { rows.length = 0; n = 0; m = 0; render(); });
  render();
}

/* ---------- 第 5、8、9 页：课本数据折线 ---------- */
function initBookLines() {
  const XM = [20, 53, 70, 98, 115, 156, 169, 202, 219, 244];
  const b1 = MStat.line($('xmLine'), {
    xs: XM.map((_, i) => (i + 1) * 50), x: [-30, 640], y: [-0.04, 0.66], tx: 100, ty: 0.1, w: 560, h: 280, labels: ['抛掷次数', '频率'],
    series: [{ vals: XM.map((m, i) => +(m / ((i + 1) * 50)).toFixed(2)), color: '#d9711c', values: true, fmt: (v) => v.toFixed(2) }],
  });
  b1.seg([[0, 0.5], [600, 0.5]], { cls: 'dash' });
  const BALL = [[50, 46], [100, 93], [200, 192], [500, 472], [1000, 953], [2000, 1902]];
  const b2 = MStat.line($('ballLine'), {
    xs: BALL.map((r) => r[0]), x: [-120, 2300], y: [0.855, 0.99], tx: 500, ty: 0.02, w: 560, h: 300, labels: ['抽取数', '频率'],
    series: [{ vals: BALL.map((r) => r[1] / r[0]), color: '#1d6fa5', values: true, fmt: (v) => fmt(v, 3), dy: -10 }],
  });
  b2.seg([[0, 0.95], [2200, 0.95]], { cls: 'dash' });
  const PIN = [64, 118, 189, 252, 310, 360, 434, 488, 549, 610];
  const b3 = MStat.line($('pinLine'), {
    xs: PIN.map((_, i) => (i + 1) * 100), x: [-60, 1250], y: [-0.05, 0.75], tx: 200, ty: 0.1, w: 560, h: 260, labels: ['抛掷次数', '频率'],
    series: [{ vals: PIN.map((m, i) => +(m / ((i + 1) * 100)).toFixed(2)), color: '#c0392b' }],
  });
  b3.seg([[0, 0.61], [1100, 0.61]], { cls: 'dash' });
  boards.push(b1, b2, b3);
}

/* ---------- 第 6 页：统计学家频率与 0.5 的偏差 ---------- */
function drawDev() {
  const D = [['布丰', 0.5069], ['德·摩根', 0.5005], ['费勒', 0.4979], ['皮尔逊', 0.5016], ['皮尔逊', 0.5005], ['罗曼诺夫斯基', 0.4923]];
  const L = 60; const R = 440; const T = 20; const B = 200;
  const Y = (v) => B - ((v - 0.48) / 0.04) * (B - T);
  const X = (i) => L + 35 + i * ((R - L - 40) / 5);
  let s = `<line x1="${L}" y1="${B}" x2="${R}" y2="${B}" class="ax"/><line x1="${L}" y1="${B}" x2="${L}" y2="${T - 6}" class="ax"/>`;
  [0.48, 0.49, 0.5, 0.51, 0.52].forEach((v) => { s += `<text x="${L - 6}" y="${Y(v) + 5}" text-anchor="end" class="tk">${v.toFixed(2)}</text><line x1="${L}" y1="${Y(v)}" x2="${R}" y2="${Y(v)}" class="${v === 0.5 ? 'half' : 'gl'}"/>`; });
  D.forEach(([name, v], i) => {
    s += `<line x1="${X(i)}" y1="${Y(0.5)}" x2="${X(i)}" y2="${Y(v)}" stroke="#d9711c" stroke-width="3"/><circle cx="${X(i)}" cy="${Y(v)}" r="5" fill="#d9711c"/>`
      + `<text x="${X(i)}" y="${B + 18}" text-anchor="middle" class="tk s">${name}</text><text x="${X(i)}" y="${Y(v) + (v >= 0.5 ? -9 : 18)}" text-anchor="middle" class="tk v">${v.toFixed(4)}</text>`;
  });
  s += `<text x="${L + 4}" y="${T - 8}" class="tk">频率（纵轴放大）</text>`;
  $('devFig').innerHTML = s;
}

/* ---------- 第 7 页：大量重复试验模拟器 ---------- */
const KINDS = [
  { key: 'coin', tab: '抛硬币', p: 0.5, pTxt: '0.5', desc: '抛掷 1 枚质地均匀的硬币，事件 A：“正面朝上”。', ymax: 1 },
  { key: 'ball', tab: '摸球（3 白 1 红）', p: 0.25, pTxt: '0.25', desc: '袋中有 3 个白球、1 个红球，任意摸出 1 个后放回，事件 A：“摸到红球”。', ymax: 1 },
  { key: 'die', tab: '抛骰子', p: 1 / 6, pTxt: '1/6 ≈ 0.167', desc: '抛掷 1 枚质地均匀的骰子，事件 A：“6 点朝上”。', ymax: 1 },
];
const RUN_COLORS = ['#d9711c', '#1d6fa5', '#2f7d6b', '#c0577a', '#8a6fc4', '#6f8191'];
function initSim() {
  const N = 2000;
  const st = { k: KINDS[0], runs: [], show: false, anim: 0 };
  const L = 56; const R = 585; const T = 14; const B = 320;
  const X = (n) => L + (n / N) * (R - L);
  const Y = (v) => B - (v / st.k.ymax) * (B - T);
  const trial = () => (st.k.key === 'coin' ? Math.random() < 0.5 : st.k.key === 'ball' ? Math.floor(Math.random() * 4) === 0 : Math.floor(Math.random() * 6) === 5);
  const draw = () => {
    let s = `<line x1="${L}" y1="${B}" x2="${R}" y2="${B}" class="ax"/><line x1="${L}" y1="${B}" x2="${L}" y2="${T}" class="ax"/>`;
    for (let v = 0; v <= 1.0001; v += 0.1) s += `<line x1="${L}" y1="${Y(v)}" x2="${R}" y2="${Y(v)}" class="gl"/><text x="${L - 6}" y="${Y(v) + 5}" text-anchor="end" class="tk">${v.toFixed(1)}</text>`;
    for (let n = 500; n <= N; n += 500) s += `<text x="${X(n)}" y="${B + 20}" text-anchor="middle" class="tk">${n}</text>`;
    s += `<text x="${R}" y="${B + 40}" text-anchor="end" class="tk">试验次数 n</text><text x="${L + 6}" y="${T + 12}" class="tk">频率 m/n</text>`;
    st.runs.forEach((run, i) => {
      const upto = i === st.runs.length - 1 ? st.anim : N;
      let d = '';
      let m = 0;
      for (let n = 1; n <= upto; n++) {
        m += run[n - 1];
        if (n <= 50 || n % 5 === 0 || n === upto) d += `${d ? 'L' : 'M'}${X(n).toFixed(1)} ${Y(m / n).toFixed(1)}`;
      }
      s += `<path d="${d}" fill="none" stroke="${RUN_COLORS[i % RUN_COLORS.length]}" stroke-width="2"/>`;
    });
    if (st.show) s += `<line x1="${L}" y1="${Y(st.k.p)}" x2="${R}" y2="${Y(st.k.p)}" class="pline2"/><text x="${R - 4}" y="${Y(st.k.p) - 8}" text-anchor="end" class="tk pv">P(A) = ${st.k.pTxt}</text>`;
    $('sim').innerHTML = s;
  };
  const msg = () => {
    const el = $('simMsg');
    if (!st.runs.length) { el.className = 'tip feedback'; el.textContent = '点“做 2 000 次”开始。'; return; }
    const fin = st.runs.map((r) => r.reduce((a, c) => a + c, 0) / N);
    el.className = 'tip feedback fb-ok';
    el.innerHTML = `已做 ${st.runs.length} 组，每组 2 000 次后的频率：${fin.map((f, i) => `<b style="color:${RUN_COLORS[i % RUN_COLORS.length]}">${f.toFixed(3)}</b>`).join('，')}${st.show ? `；概率 P(A) = ${st.k.pTxt}` : ''}。`;
  };
  const run = () => {
    if (st.runs.length >= RUN_COLORS.length) st.runs.shift();
    st.runs.push(Array.from({ length: N }, () => (trial() ? 1 : 0)));
    const t0 = performance.now();
    const step = (t) => {
      st.anim = Math.min(N, Math.round(((t - t0) / 1800) * N));
      draw();
      if (st.anim < N) requestAnimationFrame(step); else msg();
    };
    requestAnimationFrame(step);
  };
  $('simKind').innerHTML = KINDS.map((k, i) => `<button type="button" class="btn${i ? '' : ' solid'}" data-k="${k.key}">${k.tab}</button>`).join('');
  $('simKind').addEventListener('click', (e) => {
    const b = e.target.closest('[data-k]');
    if (!b) return;
    st.k = KINDS.find((k) => k.key === b.dataset.k);
    st.runs = []; st.show = false; st.anim = N;
    $('simKind').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === b));
    $('simDesc').textContent = st.k.desc;
    draw(); msg();
  });
  $('simGo').addEventListener('click', run);
  $('simMore').addEventListener('click', run);
  $('simP').addEventListener('click', () => { st.show = true; draw(); msg(); });
  $('simClr').addEventListener('click', () => { st.runs = []; st.show = false; draw(); msg(); });
  $('simDesc').textContent = st.k.desc;
  st.anim = N;
  draw(); msg();
}

window.LESSON = {
  init() {
    initCoin();
    initBookLines();
    drawDev();
    initSim();
  },
  onRender() { requestAnimationFrame(() => boards.forEach((b) => b.update())); },
};
