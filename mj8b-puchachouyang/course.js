'use strict';
/* 八下 7.1 普查与抽样调查 · 本课互动：总体/样本示意图、抽样模拟器（随机 vs 只抽一个班、样本容量）、
 * 50 份问卷点代号划记、条形图与扇形图（由课本 p8 的 50 个调查结果直接计算）。 */
const { tex, fmt } = MathKit;
const $ = (id) => document.getElementById(id);
const CLUBS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const NAMES = ['文学社', '英语俱乐部', '动漫创作社', '合唱团', '航模工作室', '生物实验小组', '健美协会'];
const COLORS = ['#a8458f', '#e8792b', '#ef8fa6', '#6b7fc8', '#b9a6dd', '#3fb1e0', '#d6338a'];
/* 课本 p8 调查结果（50 份问卷，逐行抄录） */
const RESULT = 'ECFDABDACD ADBAEBCADC GBBGCDCDCC BDFAEDDCDF BCABCECADF'.replace(/\s/g, '').split('');
const COUNT = CLUBS.map((c) => RESULT.filter((r) => r === c).length); // 8 8 12 12 4 4 2

/* 可复现的伪随机数（只用来生成模拟总体；抽样用 Math.random 真随机） */
function mulberry32(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------- 第 4 页：总体、个体、样本示意图 ---------- */
function drawPopFig() {
  const rnd = mulberry32(11);
  const [cx, cy, rx, ry] = [250, 122, 160, 100];
  const [sx, sy, sr] = [310, 132, 48];
  const dots = [];
  while (dots.length < 80) {
    const x = cx + (rnd() * 2 - 1) * rx;
    const y = cy + (rnd() * 2 - 1) * ry;
    if (((x - cx) / (rx - 8)) ** 2 + ((y - cy) / (ry - 8)) ** 2 > 1) continue;
    if (dots.some(([a, b]) => (a - x) ** 2 + (b - y) ** 2 < 210)) continue;
    dots.push([x, y]);
  }
  const inS = ([x, y]) => (x - sx) ** 2 + (y - sy) ** 2 < (sr - 6) ** 2;
  const k = dots.filter(inS).length;
  const one = dots.reduce((m, d) => (d[0] < m[0] ? d : m), [1e9, 0]); // 最左边的一个点
  const lead = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#556575" stroke-width="1.5"/>`;
  $('popFig').innerHTML = `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#e3f1fb" stroke="#1d6fa5" stroke-width="2.5"/>`
    + dots.map((d) => `<circle cx="${d[0].toFixed(1)}" cy="${d[1].toFixed(1)}" r="4.5" fill="${inS(d) ? '#d9711c' : '#4f9bd0'}"/>`).join('')
    + `<circle cx="${sx}" cy="${sy}" r="${sr}" fill="rgba(255,255,255,.55)" stroke="#d9711c" stroke-width="2.5" stroke-dasharray="7 5"/>`
    + dots.filter(inS).map((d) => `<circle cx="${d[0].toFixed(1)}" cy="${d[1].toFixed(1)}" r="4.5" fill="#d9711c"/>`).join('')
    + `${lead(70, 34, 128, 58)}<text x="66" y="30" class="pt" text-anchor="end">总体</text>`
    + `${lead(52, one[1] + 40, one[0] - 4, one[1] + 3)}<text x="48" y="${one[1] + 46}" class="pt" text-anchor="end">个体</text>`
    + `${lead(sx + sr - 6, sy - 30, 452, 60)}<text x="456" y="58" class="pt">样本</text>`
    + `<text x="${cx}" y="246" class="pt" text-anchor="middle">样本容量 = 样本中个体的个数（图中是 ${k}）</text>`;
}

/* ---------- 第 6 页：抽样模拟器 ---------- */
const CLASSES = 12;
const PER = 50;
function makePopulation() {
  const rnd = mulberry32(2024);
  const base = [16, 16, 24, 24, 8, 8, 4];
  const skew = { 0: [2, 70], 3: [3, 40], 7: [4, 30], 10: [1, 30] }; // 1 班特别喜欢动漫创作社(C)……
  const pop = [];
  for (let c = 0; c < CLASSES; c++) {
    const w = base.slice();
    if (skew[c]) w[skew[c][0]] += skew[c][1];
    const tot = w.reduce((s, v) => s + v, 0);
    for (let i = 0; i < PER; i++) {
      let r = rnd() * tot;
      let k = 0;
      while (r >= w[k]) { r -= w[k]; k += 1; }
      pop.push(k);
    }
  }
  return pop;
}
const pct = (arr, idx) => CLUBS.map((_, k) => (idx.length ? (100 * idx.filter((i) => arr[i] === k).length) / idx.length : 0));

function initSampler() {
  const pop = makePopulation();
  const all = pop.map((_, i) => i);
  const popPct = pct(pop, all);
  const st = { mode: 'rand', n: 50, sample: [], reveal: false };
  const CELL = 14;
  const COLS = 25; // 每班 50 人排成 2 行
  const L = 40;
  const rects = pop.map((_, i) => {
    const c = Math.floor(i / PER);
    const r = i % PER;
    const row = c * 2 + Math.floor(r / COLS);
    return `<rect x="${L + (r % COLS) * CELL + 1}" y="${row * CELL + c * 3 + 1}" width="${CELL - 2}" height="${CELL - 2}" rx="2" data-i="${i}"/>`;
  }).join('');
  const labels = Array.from({ length: CLASSES }, (_, c) => `<text x="${L - 5}" y="${c * 2 * CELL + c * 3 + CELL + 4}" text-anchor="end" class="cl">${c + 1}班</text>`).join('');
  $('popGrid').innerHTML = `<svg viewBox="0 0 ${L + COLS * CELL} ${CLASSES * (2 * CELL + 3)}">${labels}${rects}</svg>`;
  const cells = [...$('popGrid').querySelectorAll('rect')];
  $('clubLegend').innerHTML = CLUBS.map((c, k) => `<span><i style="background:${COLORS[k]}"></i>${c} ${NAMES[k]}</span>`).join('');

  const chart = MStat.bars($('smpChart'), {
    cats: CLUBS, ymax: 70, ty: 10, labels: ['', '%'], w: 560, h: 280, gw: 0.76, fmt: (v) => fmt(v, 0),
    series: [
      { vals: () => (st.sample.length ? pct(pop, st.sample) : CLUBS.map(() => 0)), color: '#d9711c' },
      { vals: () => (st.reveal ? popPct : CLUBS.map(() => 0)), color: '#4f9bd0' },
    ],
  });

  const paint = () => {
    const inS = new Set(st.sample);
    cells.forEach((el, i) => {
      const show = st.reveal || inS.has(i);
      el.setAttribute('fill', show ? COLORS[pop[i]] : '#dfe7ee');
      el.setAttribute('opacity', st.reveal && st.sample.length && !inS.has(i) ? 0.35 : 1);
      el.setAttribute('stroke', inS.has(i) ? '#1f2d3a' : 'none');
    });
    chart.update();
    const msg = $('smpMsg');
    if (!st.sample.length) { msg.className = 'tip feedback'; msg.textContent = '选好抽样方式和样本容量，点“抽一次样”。'; return; }
    const sp = pct(pop, st.sample);
    const top = sp.indexOf(Math.max(...sp));
    let html = `样本容量 ${st.sample.length}${st.mode === 'one' ? '（全部来自 1 班）' : ''}：样本中最喜爱 ${CLUBS[top]}（${NAMES[top]}）的最多，占 ${fmt(sp[top], 0)}%。`;
    if (st.reveal) {
      const gap = Math.max(...sp.map((v, k) => Math.abs(v - popPct[k])));
      html += `<br>与普查结果相比，最大相差 <b>${fmt(gap, 0)}</b> 个百分点${gap > 15 ? '——这个样本<b>没有代表性</b>。' : gap > 7 ? '。' : '——样本很接近总体。'}`;
    }
    msg.className = `tip feedback ${st.reveal && Math.max(...sp.map((v, k) => Math.abs(v - popPct[k]))) > 15 ? 'fb-warn' : 'fb-ok'}`;
    msg.innerHTML = html;
  };

  const draw = () => {
    const pool = st.mode === 'one' ? all.slice(0, PER) : all.slice();
    const n = Math.min(st.n, pool.length);
    for (let i = 0; i < n; i++) { // 部分 Fisher–Yates：前 n 个就是无放回随机样本
      const j = i + Math.floor(Math.random() * (pool.length - i));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    st.sample = pool.slice(0, n);
    paint();
  };

  const nIn = $('smpN');
  nIn.addEventListener('input', () => { st.n = +nIn.value; $('smpNv').textContent = st.mode === 'one' ? `${Math.min(st.n, PER)}（1 班只有 50 人）` : st.n; });
  $('smpMode').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-m]');
    if (!btn) return;
    st.mode = btn.dataset.m;
    $('smpMode').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    nIn.dispatchEvent(new Event('input'));
    draw();
  });
  $('smpGo').addEventListener('click', draw);
  $('smpReveal').addEventListener('click', () => {
    st.reveal = !st.reveal;
    $('smpReveal').textContent = st.reveal ? '隐藏总体' : '揭晓总体（全校普查）';
    paint();
  });
  draw();
  return chart;
}

/* ---------- 第 8 页：50 份问卷，点代号划记 ---------- */
function initLetters() {
  const done = new Set();
  $('letters').innerHTML = RESULT.map((r) => `<span>${r}</span>`).join('');
  const spans = [...$('letters').children];
  $('codeBtns').innerHTML = CLUBS.map((c) => `<button type="button" class="btn" data-c="${c}">${c}</button>`).join('')
    + '<button type="button" class="btn solid" data-c="all">全部整理</button><button type="button" class="btn" data-c="clr">重来</button>';
  const render = (cur) => {
    const cell = (k, f) => (done.has(CLUBS[k]) ? f(k) : '');
    const sum = [...done].reduce((s, c) => s + COUNT[CLUBS.indexOf(c)], 0);
    const full = done.size === CLUBS.length;
    $('clubTab').innerHTML = `<tr><th>社团代号</th>${CLUBS.map((c) => `<th>${c}</th>`).join('')}<th>合计</th></tr>`
      + `<tr><th>划　记</th>${CLUBS.map((c, k) => `<td class="${c === cur ? 'on' : ''}">${cell(k, (i) => MStat.tally(COUNT[i]))}</td>`).join('')}<td></td></tr>`
      + `<tr><th>人　数</th>${CLUBS.map((c, k) => `<td class="${c === cur ? 'on' : ''}">${cell(k, (i) => COUNT[i])}</td>`).join('')}<td>${full ? sum : ''}</td></tr>`
      + `<tr><th>百分比</th>${CLUBS.map((c, k) => `<td class="${c === cur ? 'on' : ''}">${cell(k, (i) => `${(COUNT[i] / 50) * 100}%`)}</td>`).join('')}<td>${full ? '100%' : ''}</td></tr>`;
    spans.forEach((s, i) => {
      s.classList.toggle('on', RESULT[i] === cur);
      s.classList.toggle('done', RESULT[i] !== cur && done.has(RESULT[i]));
    });
    const msg = $('clubMsg');
    if (cur && cur !== 'all') {
      const k = CLUBS.indexOf(cur);
      msg.className = 'tip feedback fb-ok';
      msg.innerHTML = `${cur}（${NAMES[k]}）：数到 <b>${COUNT[k]}</b> 个，占 $${COUNT[k]}\\div50\\times100\\%=${(COUNT[k] / 50) * 100}\\%$。`;
    } else {
      msg.className = `tip feedback ${full ? 'fb-ok' : ''}`;
      msg.innerHTML = full ? `合计 ${sum} 人，百分比合计 100%——没有漏数、也没有重数。` : '点一个代号开始整理。';
    }
    tex(msg);
  };
  $('codeBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-c]');
    if (!btn) return;
    const c = btn.dataset.c;
    if (c === 'clr') { done.clear(); render(null); return; }
    if (c === 'all') CLUBS.forEach((x) => done.add(x)); else done.add(c);
    render(c === 'all' ? null : c);
  });
  render(null);
}

/* ---------- 第 9 页：条形图与扇形图（课本 p9） ---------- */
function initCharts() {
  const bar = MStat.bars($('clubBar'), { cats: CLUBS, ymax: 13, ty: 2, labels: ['社团代号', '人数'], w: 520, h: 300, gw: 0.5, series: [{ vals: COUNT, color: '#f2a0ae' }] });
  // 扇形图按课本：A 从约 2 点钟方向起，A→G 顺时针（E、F、G 在最上方）
  MStat.pie($('clubPie'), CLUBS.map((c, k) => ({ name: c, v: COUNT[k], color: COLORS[k] })), {
    start: 72, r: 96, pad: 60, fs: 13, label: (it, p) => `${it.name} ${fmt(p, 0)}%`,
  });
  return bar;
}

let boards = [];
window.LESSON = {
  init() {
    drawPopFig();
    boards = [initSampler(), initCharts()];
    initLetters();
  },
  onRender() { requestAnimationFrame(() => boards.forEach((b) => b.update())); },
};
