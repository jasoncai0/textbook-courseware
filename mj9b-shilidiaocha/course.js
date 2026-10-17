'use strict';
/* 九下 8.1 中学生的视力情况调查 · 本课互动：
 * 图 8-1/8-2/8-3（MStat 按课本数据绘制）、五个估计值数轴、抽签实验室（练习 2 的 50 个身高，真随机不放回抽 20 个，
 * 样本平均数/方差与总体对比）、视力统计表 → 频数分布表（点组高亮相加的两格）、三个直方图（视力不良组深色）、练习 2 直方图。
 * 随机数取自 crypto.getRandomValues；所有频数由课本数据计算。 */
const { board, fmt } = MathKit;
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const boards = [];

function randInt(n) {
  const buf = new Uint32Array(1);
  const lim = Math.floor(0x100000000 / n) * n;
  do crypto.getRandomValues(buf); while (buf[0] >= lim);
  return buf[0] % n;
}
const svgHtml = (el, html) => { el.innerHTML = html; };

/* ---------- 直方图：edges 为分点，counts 为各组频数；bad(i) 为真时画深色 ---------- */
function hist(el, o) {
  const n = o.counts.length;
  const U = (i) => i + 0.6; // 第 i 个分点的横坐标（单位：组）
  const b = board(el, {
    x: [-0.75, n + 2.3], y: [-Math.min(o.ymax * 0.17, o.ty * 0.9), o.ymax * 1.16], w: o.w || 520, h: o.h || 300,
    ticks: [0, o.ty], labels: ['', o.labels[1]], grid: true,
  });
  b.text([n + 1.9, 0], o.labels[0], { cls: 'hx', dy: 17 });
  o.counts.forEach((c, i) => {
    if (!c) return;
    const p = b.poly([[U(i), 0], [U(i + 1), 0], [U(i + 1), c], [U(i), c]]);
    p.setAttribute('class', `hbar${o.bad && o.bad(i) ? ' bad' : ''}`);
    b.text([U(i) + 0.5, c], String(c), { cls: 'hval', dy: -5 });
  });
  o.edges.forEach((e, i) => b.text([U(i), 0], e, { cls: 'hx', dy: 17 }));
  boards.push(b);
  return b;
}

/* ---------- 第 3 页：图 8-1、8-2、8-3 ---------- */
function initFigs() {
  boards.push(MStat.bars($('figA'), {
    cats: ['4.0~4.5', '4.6~4.9', '5.0~5.3'], ymax: 50, ty: 10, labels: ['视力', '人数'], w: 420, h: 250, gw: 0.5,
    series: [{ vals: [11, 37, 2], color: '#f6bfd6' }],
  }));
  MStat.pie($('figB'), [
    { name: '4.0~4.5', v: 35, color: '#f8eda8' }, { name: '4.6~4.9', v: 40, color: '#f6bfd6' }, { name: '5.0~5.3', v: 25, color: '#bfe0f2' },
  ], { r: 62, pad: 100, padY: 24, fs: 15, label: (it, p) => `${it.name} ${Math.round(p)}%` });
  const C = [30, 40, 60, 60, 70, 80];
  const names = ['七', '八', '九', '高一', '高二', '高三'];
  boards.push(MStat.line($('figC'), {
    xs: [1, 2, 3, 4, 5, 6], x: [-0.3, 6.8], y: [-16, 112], ty: 20, tx: 0, w: 420, h: 250, labels: ['年级', '不良率/%'],
    xLabels: names.map((t, i) => [i + 1, t]),
    series: [{ vals: C, color: '#d23b3b', values: true, fmt: (v) => `${v}%` }],
  }));
}

/* ---------- 第 4 页：五个估计值的数轴 ---------- */
function initEst() {
  const svg = $('estFig');
  const X = (p) => 40 + (p - 40) * 9; // 40% → 40，100% → 580
  const est = [['A', 96, '#d9711c'], ['B', 75, '#d9711c'], ['C', 56.7, '#d9711c'], ['E', 66.2, '#2f7d6b']];
  let h = `<line x1="30" y1="150" x2="600" y2="150" stroke="#556575" stroke-width="2.5"/>`;
  for (let p = 40; p <= 100; p += 10) h += `<line x1="${X(p)}" y1="143" x2="${X(p)}" y2="157" stroke="#556575" stroke-width="2"/><text x="${X(p)}" y="180" text-anchor="middle" font-size="17">${p}%</text>`;
  h += `<line x1="${X(66.1)}" y1="40" x2="${X(66.1)}" y2="150" stroke="#1d6fa5" stroke-width="2" stroke-dasharray="6 4"/>`
    + `<text x="${X(66.1)}" y="30" text-anchor="middle" font-size="16" fill="#1d6fa5">D 普查 66.1%</text>`;
  const lift = { A: 0, B: 0, C: 0, E: 46 };
  est.forEach(([k, v, c]) => {
    const y = 150 - 28 - lift[k];
    h += `<circle cx="${X(v)}" cy="150" r="7" fill="${c}"/><line x1="${X(v)}" y1="143" x2="${X(v)}" y2="${y + 6}" stroke="${c}" stroke-width="1.5"/>`
      + `<text x="${X(v) + (k === 'E' ? 6 : 0)}" y="${y}" text-anchor="${k === 'E' ? 'start' : 'middle'}" font-size="17" fill="${c}">${k} ${v}%</text>`;
  });
  h += '<text x="600" y="212" text-anchor="end" font-size="15" fill="#556575">本地区中学生视力不良率的估计</text>';
  svgHtml(svg, h);
}

/* ---------- 第 7 页：抽签实验室 ---------- */
const HEIGHTS = [150, 148, 159, 156, 157, 163, 156, 164, 156, 159, 169, 163, 170, 162, 163, 164, 155, 162, 153, 155,
  177, 165, 160, 161, 166, 159, 161, 157, 155, 167, 162, 165, 159, 147, 163, 172, 156, 165, 157, 164,
  152, 156, 153, 164, 165, 162, 167, 151, 175, 162];
const stats = (a) => {
  const m = a.reduce((s, x) => s + x, 0) / a.length;
  return [m, a.reduce((s, x) => s + (x - m) ** 2, 0) / a.length];
};
function initLab() {
  const pool = $('pool');
  pool.innerHTML = HEIGHTS.map((h, i) => `<span title="${i + 1} 号">${h}</span>`).join('');
  const cells = [...pool.children];
  const [M, V] = stats(HEIGHTS);
  const samples = [];
  let busy = false;
  const X = (m) => 30 + (m - 155) * 54; // 155 → 30，165 → 570
  const render = () => {
    const last = samples.slice(-4);
    $('labTab').innerHTML = '<tr><th></th><th>平均数/cm</th><th>方差</th></tr>'
      + `<tr><th>总体（50 人）</th><td>${M.toFixed(2)}</td><td>${V.toFixed(2)}</td></tr>`
      + last.map((s) => `<tr><th>样本 ${s.k}（20 人）</th><td>${s.m.toFixed(2)}</td><td>${s.v.toFixed(2)}</td></tr>`).join('');
    let h = '<line x1="20" y1="100" x2="580" y2="100" stroke="#556575" stroke-width="2"/>';
    for (let t = 155; t <= 165; t += 1) h += `<line x1="${X(t)}" y1="95" x2="${X(t)}" y2="105" stroke="#556575"/><text x="${X(t)}" y="124" text-anchor="middle" font-size="15">${t}</text>`;
    const stack = {};
    samples.forEach((s) => {
      const key = Math.round(X(s.m) / 9);
      stack[key] = (stack[key] || 0) + 1;
      h += `<circle cx="${X(Math.min(165, Math.max(155, s.m)))}" cy="${100 - 9 * stack[key]}" r="4.5" fill="#d9711c"/>`;
    });
    h += `<line x1="${X(M)}" y1="10" x2="${X(M)}" y2="104" stroke="#c0392b" stroke-width="2.5"/><text x="${X(M) + 6}" y="20" font-size="15" fill="#c0392b">总体平均数 ${fmt(M, 2)}</text>`;
    svgHtml($('meanFig'), h);
    const msg = $('labMsg');
    if (!samples.length) { msg.className = 'tip feedback'; msg.textContent = '点“抽签”开始；橙点 = 每个样本的平均数。'; return; }
    const s = samples[samples.length - 1];
    msg.className = 'tip feedback fb-ok';
    msg.textContent = `已抽 ${samples.length} 个样本。样本 ${s.k} 的平均数与总体相差 ${fmt(Math.abs(s.m - M), 2)} cm。`;
  };
  const drawIdx = () => {
    const idx = HEIGHTS.map((_, i) => i);
    for (let i = 0; i < 20; i++) { const j = i + randInt(50 - i); [idx[i], idx[j]] = [idx[j], idx[i]]; }
    return idx.slice(0, 20);
  };
  const record = (idx) => {
    const [m, v] = stats(idx.map((i) => HEIGHTS[i]));
    samples.push({ k: samples.length + 1, m, v });
  };
  const show = (idx) => cells.forEach((c, i) => { c.className = idx.includes(i) ? 'pick' : ''; });
  $('drawOne').addEventListener('click', () => {
    if (busy) return;
    busy = true;
    const idx = drawIdx();
    show([]);
    idx.forEach((i, t) => setTimeout(() => {
      cells.forEach((c) => c.classList.remove('cur'));
      cells[i].className = 'pick cur';
      if (t === idx.length - 1) {
        setTimeout(() => { cells[i].classList.remove('cur'); record(idx); render(); busy = false; }, 120);
      }
    }, t * 70));
  });
  $('drawTen').addEventListener('click', () => {
    if (busy) return;
    let idx = [];
    for (let r = 0; r < 10; r++) { idx = drawIdx(); record(idx); }
    show(idx);
    render();
  });
  $('drawClr').addEventListener('click', () => { if (busy) return; samples.length = 0; show([]); render(); });
  render();
}

/* ---------- 第 8、9 页：视力统计表 → 频数分布表 → 直方图 ---------- */
const VIS = ['4.0', '4.1', '4.2', '4.3', '4.4', '4.5', '4.6', '4.7', '4.8', '4.9', '5.0', '5.1', '5.2', '5.3'];
const GRADE = {
  七年级: [0, 0, 0, 0, 0, 0, 4, 4, 8, 16, 25, 30, 9, 4],
  八年级: [0, 0, 0, 0, 3, 6, 5, 5, 15, 8, 28, 21, 6, 3],
  九年级: [0, 1, 2, 1, 6, 5, 6, 7, 12, 14, 24, 15, 5, 2],
};
const EDGES = ['3.95', '4.15', '4.35', '4.55', '4.75', '4.95', '5.15', '5.35'];
const groups = (f) => Array.from({ length: 7 }, (_, g) => f[2 * g] + f[2 * g + 1]);

function initGroup() {
  const st = { g: '七年级', k: -1 };
  const names = Object.keys(GRADE);
  $('gradeBtns').innerHTML = names.map((n) => `<button class="btn" type="button" data-g="${n}">${n}</button>`).join('');
  const render = () => {
    const pair = st.k >= 0 ? [2 * st.k, 2 * st.k + 1] : [];
    $('rawTab').innerHTML = `<tr><th>视力</th>${VIS.map((v, i) => `<th class="${pair.includes(i) ? 'on' : ''}">${v}</th>`).join('')}</tr>`
      + names.map((n) => `<tr><th>${n}</th>${GRADE[n].map((c, i) => `<td class="${n === st.g && pair.includes(i) ? 'on' : ''}">${c}</td>`).join('')}</tr>`).join('');
    const gs = groups(GRADE[st.g]);
    $('grpTab').innerHTML = `<tr><th>视力（${st.g}）</th><th>频数</th><th>频率</th></tr>`
      + gs.map((c, i) => `<tr data-k="${i}" style="cursor:pointer"><td class="${i === st.k ? 'on' : ''}">${EDGES[i]}～${EDGES[i + 1]}</td><td class="${i === st.k ? 'on' : ''}">${i === st.k ? `${GRADE[st.g][2 * i]}+${GRADE[st.g][2 * i + 1]}=` : ''}${c}</td><td>${c ? (c / 100).toFixed(2) : 0}</td></tr>`).join('');
    $('gradeBtns').querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.g === st.g));
  };
  $('gradeBtns').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { st.g = b.dataset.g; render(); } });
  $('grpTab').addEventListener('click', (e) => { const r = e.target.closest('tr[data-k]'); if (r) { st.k = +r.dataset.k; render(); } });
  $('grpTab').setAttribute('data-noswipe', '');
  render();

  // 第 9 页：三个直方图，视力 ≤ 4.9（前 5 组，分点 4.95 以左）画深色
  [['h7', '七年级', 60], ['h8', '八年级', 50], ['h9', '九年级', 50]].forEach(([id, g, ymax]) => hist($(id), {
    counts: groups(GRADE[g]), edges: EDGES, ymax, ty: 10, labels: ['视力', '频数'], w: 520, h: 330, bad: (i) => i < 5,
  }));
}

/* ---------- 第 11 页：练习 2 的直方图 ---------- */
function initHw() {
  hist($('hwHist'), {
    counts: [3, 6, 9, 8, 4], edges: ['60.5', '80.5', '100.5', '120.5', '140.5', '160.5'], ymax: 10, ty: 1,
    labels: ['时间/min', '人数'], w: 520, h: 250,
  });
}

window.LESSON = {
  init() {
    initFigs();
    initEst();
    initLab();
    initGroup();
    initHw();
  },
  onRender() { requestAnimationFrame(() => boards.forEach((b) => b.update())); },
};
