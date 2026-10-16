'use strict';
/* 高一下 15.2 随机事件的概率 · 本课互动：例 1 枚举、例 3 点数和表、例 4 涂色、随机模拟频率折线。通用部分见 ../shared/math.js */
const { board, tex, fmt } = MathKit;
const $ = (id) => document.getElementById(id);

/* 均匀随机整数 [0, k)：crypto 拒绝采样，没有 crypto 时退回 Math.random */
const RBUF = new Uint32Array(1);
function randInt(k) {
  if (!window.crypto || !crypto.getRandomValues) return Math.floor(Math.random() * k);
  const lim = Math.floor(0x100000000 / k) * k;
  do crypto.getRandomValues(RBUF); while (RBUF[0] >= lim);
  return RBUF[0] % k;
}

/* ---------- 第 6 页：例 1 的 10 个样本点 ---------- */
const WHITE = [1, 2, 3];
const ballHtml = (k) => `<span class="ball ${WHITE.includes(k) ? 'w' : 'k'}">${k}</span>`;
const PAIRS = [1, 2, 3, 4].flatMap((a) => [2, 3, 4, 5].filter((b) => b > a).map((b) => [a, b]));
function initPairs() {
  $('pairs').innerHTML = PAIRS.map(([a, b]) => {
    const inA = WHITE.includes(a) && WHITE.includes(b);
    return `<span class="pair${inA ? ' inA' : ''}">${ballHtml(a)}${ballHtml(b)}<small>(${a},${b})</small></span>`;
  }).join('');
}

/* ---------- 第 8 页：点数和表（行：第二颗 6→1，列：第一颗 1→6），随步骤高亮 ---------- */
const SUM_HL = [[9, (s) => s % 4 === 0], [5, (s) => s % 3 === 0], [3, (s) => s === 6], [1, (s) => s === 2]];
function initSumGrid() {
  const rows = [6, 5, 4, 3, 2, 1].map((j) => `<span class="sg-h">${j}</span>${[1, 2, 3, 4, 5, 6].map((i) => `<span class="sg-c" data-s="${i + j}">${i + j}</span>`).join('')}`);
  $('sumGrid').innerHTML = rows.join('') + `<span></span>${[1, 2, 3, 4, 5, 6].map((i) => `<span class="sg-h">${i}</span>`).join('')}`;
}
function renderSumGrid(step) {
  const hit = SUM_HL.find(([n]) => step >= n);
  $('sumGrid').querySelectorAll('.sg-c').forEach((c) => c.classList.toggle('on', !!hit && hit[1](+c.dataset.s)));
}

/* ---------- 第 9 页：例 4 的 9 种涂法 ---------- */
const COLORS = ['#e05a4f', '#f2b632', '#4f9bd0'];
function initPaint() {
  const cells = [1, 2, 3].flatMap((a) => [1, 2, 3].map((b) => `<span class="pt-cell${a === b ? ' same' : ''}"><i style="background:${COLORS[a - 1]}"></i><i style="background:${COLORS[b - 1]}"></i><small>(${a},${b})</small></span>`));
  $('paint').innerHTML = cells.join('');
}

/* ---------- 第 12 页：随机模拟 ---------- */
const KINDS = [
  {
    key: 'ball', label: '例 1 摸球', p: [3, 10],
    q: '袋中 3 白（1，2，3 号）2 黑（4，5 号），一次摸出 2 个；$A$：都是白球。',
    run() {
      const a = randInt(5) + 1;
      let b = randInt(4) + 1;
      if (b >= a) b += 1; // 从剩下 4 个中等可能地取第二个
      const [x, y] = a < b ? [a, b] : [b, a];
      return { hit: WHITE.includes(x) && WHITE.includes(y), html: `摸到 ${ballHtml(x)}${ballHtml(y)}` };
    },
  },
  {
    key: 'coin', label: '抛硬币', p: [1, 2],
    q: '抛掷一枚质地均匀的硬币；$A$：正面向上。',
    run() { const h = randInt(2) === 0; return { hit: h, html: `<span class="coin">${h ? '正' : '反'}</span>` }; },
  },
  {
    key: 'dice', label: '例 3 两颗骰子', p: [5, 36],
    q: '同时抛掷两颗骰子；$A$：点数之和为 6。',
    run() { const i = randInt(6) + 1; const j = randInt(6) + 1; return { hit: i + j === 6, html: `<span class="die">${i}</span><span class="die">${j}</span>` }; },
  },
];
const SCALES = [10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000];
const MAX_N = SCALES[SCALES.length - 1];
const CHECKPOINTS = [10, 100, 1000, 10000];
const PLOT_PTS = 600; // 折线最多取 600 个点（等距抽样），其余不画

function initSim() {
  const st = { kind: KINDS[0], n: 0, m: 0, hist: [], cp: {}, scale: 0, b: null, last: '' };
  const pVal = () => st.kind.p[0] / st.kind.p[1];
  const scaleFor = (n) => SCALES.find((s) => s >= n) || MAX_N;

  const makeBoard = (xmax) => {
    const host = $('simB');
    host.innerHTML = '';
    const b = board(host, { x: [-xmax * 0.1, xmax * 1.04], y: [-0.13, 1.06], w: 640, h: 380, ticks: [xmax / 5, 0.1], labels: ['n', 'm/n'] });
    b.seg([[0, pVal()], [xmax, pVal()]], { cls: 'c2' });
    b.text([xmax, pVal()], `P = ${st.kind.p[0]}/${st.kind.p[1]}`, { cls: 'lb up', dx: -110, dy: -10 });
    b.curve((t) => { const i = Math.round(t); return [i + 1, st.hist[i]]; }, 0, () => Math.max(0, st.hist.length - 1), { n: PLOT_PTS });
    b.pt(() => (st.hist.length ? [st.hist.length, st.hist[st.hist.length - 1]] : null), { r: 6 });
    st.b = b; st.scale = xmax;
  };

  const show = () => {
    const xmax = scaleFor(st.n);
    if (xmax !== st.scale) makeBoard(xmax); else st.b.update();
    const f = st.n ? st.m / st.n : 0;
    $('simN').textContent = st.n; $('simM').textContent = st.m;
    $('simF').textContent = st.n ? fmt(f, 4) : '—';
    $('simBar').style.width = `${f * 100}%`;
    $('simPBar').style.width = `${pVal() * 100}%`;
    $('simLast').innerHTML = st.last || '还没有做试验。';
    $('simCp').innerHTML = `<tr><th>试验次数</th>${CHECKPOINTS.map((c) => `<td>${c}</td>`).join('')}</tr>`
      + `<tr><th>频率</th>${CHECKPOINTS.map((c) => `<td>${st.cp[c] === undefined ? '' : fmt(st.cp[c], 4)}</td>`).join('')}</tr>`;
    document.querySelectorAll('[data-n]').forEach((btn) => { btn.disabled = st.n + +btn.dataset.n > MAX_N; });
  };

  const trial = (k) => {
    let r = null;
    for (let t = 0; t < k && st.n < MAX_N; t += 1) {
      r = st.kind.run();
      st.n += 1;
      if (r.hit) st.m += 1;
      st.hist.push(st.m / st.n);
      if (CHECKPOINTS.includes(st.n)) st.cp[st.n] = st.m / st.n;
    }
    if (r) st.last = k === 1 ? `第 ${st.n} 次：${r.html}　→　A ${r.hit ? '<b>发生</b>' : '不发生'}` : `最后一次：${r.html}　→　A ${r.hit ? '<b>发生</b>' : '不发生'}`;
    show();
  };

  const reset = (kind) => {
    Object.assign(st, { kind, n: 0, m: 0, hist: [], cp: {}, scale: 0, last: '' });
    $('simQ').innerHTML = kind.q;
    $('simP').innerHTML = `$\\frac{${kind.p[0]}}{${kind.p[1]}}\\approx${fmt(pVal(), 4)}$`;
    tex($('simQ')); tex($('simP'));
    $('simKind').querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', b.dataset.k === kind.key));
    show();
  };

  $('simKind').innerHTML = KINDS.map((k) => `<button type="button" class="btn" data-k="${k.key}">${k.label}</button>`).join('');
  $('simKind').addEventListener('click', (e) => { const b = e.target.closest('[data-k]'); if (b) reset(KINDS.find((k) => k.key === b.dataset.k)); });
  document.querySelectorAll('[data-n]').forEach((b) => b.addEventListener('click', () => trial(+b.dataset.n)));
  $('simReset').addEventListener('click', () => reset(st.kind));
  reset(KINDS[0]);
  return () => st.b && st.b.update();
}

let refitSim = () => {};
window.LESSON = {
  init() {
    initPairs();
    initSumGrid();
    initPaint();
    refitSim = initSim();
  },
  onRender(slide, step) {
    if (slide.contains($('sumGrid'))) renderSumGrid(step);
    if (slide.contains($('simB'))) { requestAnimationFrame(refitSim); setTimeout(refitSim, 750); }
  },
};
