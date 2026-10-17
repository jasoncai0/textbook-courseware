'use strict';
/* 八下 8.2 可能性的大小 · 本课互动：抛小立方体（2 面“1”、4 面“2”，真随机）、图 8-2 转盘（8 个 45° 扇形，指针转动动画，
 * 停止角为真随机数）、图 8-3 五只袋子排序、可能性刻度示意、转盘①与习题 5 个转盘（按课本图绘制）。 */
const { tex, fmt } = MathKit;
const $ = (id) => document.getElementById(id);
const boards = [];
const pt = (C, R, deg) => [C[0] + R * Math.sin((deg * Math.PI) / 180), C[1] - R * Math.cos((deg * Math.PI) / 180)];
const sector = (C, R, a, b, fill) => {
  const [x0, y0] = pt(C, R, a); const [x1, y1] = pt(C, R, b);
  return `<path d="M${C[0]} ${C[1]}L${x0.toFixed(2)} ${y0.toFixed(2)}A${R} ${R} 0 ${b - a > 180 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}Z" fill="${fill}" stroke="#556575" stroke-width="1.2"/>`;
};
const tableHtml = (rows, n) => '<tr><th>试验结果</th><th>划　记</th><th>频数</th><th>频率</th></tr>'
  + rows.map(([name, c]) => `<tr><td>${name}</td><td class="tl">${MStat.tally(c)}</td><td>${c}</td><td>${n ? fmt(c / n, 3) : ''}</td></tr>`).join('')
  + `<tr><th>合计</th><td></td><td>${n}</td><td>${n ? 1 : ''}</td></tr>`;

/* ---------- 第 3 页：小立方体 ---------- */
const FACES = [1, 1, 2, 2, 2, 2]; // 2 个面标 1，4 个面标 2
function initCube() {
  // 展开图（十字形）：上、下两个面标 1，四周四个面标 2
  const cells = [[1, 0, 1], [0, 1, 2], [1, 1, 2], [2, 1, 2], [3, 1, 2], [1, 2, 1]];
  $('cubeNet').innerHTML = cells.map(([c, r, v]) => `<rect x="${60 + c * 70}" y="${r * 70}" width="68" height="68" fill="${v === 1 ? '#f6c56b' : '#d98a3a'}" stroke="#7a4a14" stroke-width="2"/><text x="${94 + c * 70}" y="${46 + r * 70}" text-anchor="middle" class="fv">${v}</text>`).join('')
    + '<text x="350" y="120" class="cap">展开图</text>';
  const cnt = { 1: 0, 2: 0 };
  let last = null;
  const render = () => {
    const n = cnt[1] + cnt[2];
    $('cubeTab').innerHTML = tableHtml([['向上一面的数字为 1', cnt[1]], ['向上一面的数字为 2', cnt[2]]], n);
    $('die').innerHTML = last ? `向上一面：<span class="face">${last}</span>` : '';
    const msg = $('cubeMsg');
    if (!n) { msg.className = 'tip feedback'; msg.textContent = '先猜，再抛。'; return; }
    msg.className = 'tip feedback fb-ok';
    msg.innerHTML = `抛了 ${n} 次：数字 1 出现 ${cnt[1]} 次，数字 2 出现 ${cnt[2]} 次。${n >= 40 ? (cnt[2] > cnt[1] ? '“2”明显更多。' : '这一轮“1”不少——再做几轮看看。') : ''}`;
  };
  const toss = (k) => { for (let i = 0; i < k; i++) { last = FACES[Math.floor(Math.random() * 6)]; cnt[last] += 1; } render(); };
  $('cube1').addEventListener('click', () => toss(1));
  $('cube40').addEventListener('click', () => toss(40));
  $('cubeClr').addEventListener('click', () => { cnt[1] = 0; cnt[2] = 0; last = null; render(); });
  render();
}

/* ---------- 第 4 页：图 8-2 转盘 ---------- */
const SEC = ['g', 'y', 'r', 'y', 'r', 'y', 'r', 'y']; // 从 12 点方向顺时针，每格 45°
const SCOL = { r: '#e8503a', y: '#fbe98a', g: '#16a35b' };
const SNAME = { r: '红色', y: '黄色', g: '绿色' };
function initSpinner() {
  const C = [150, 150];
  const R = 130;
  const cnt = { r: 0, y: 0, g: 0 };
  let angle = 25;
  let busy = false;
  const svg = $('spinner');
  svg.innerHTML = SEC.map((c, i) => sector(C, R, i * 45, (i + 1) * 45, SCOL[c])).join('')
    + `<g id="needle"><line x1="150" y1="150" x2="150" y2="44" stroke="#1d3a6e" stroke-width="5"/><path d="M150 30l-9 20h18z" fill="#1d3a6e"/></g><circle cx="150" cy="150" r="8" fill="#1d3a6e"/>`;
  const needle = svg.querySelector('#needle');
  const setNeedle = (a) => needle.setAttribute('transform', `rotate(${a} 150 150)`);
  setNeedle(angle);
  const bar = MStat.bars($('spinBar'), { cats: ['红色', '黄色', '绿色'], ymax: 28, ty: 5, labels: ['', '频数'], w: 420, h: 200, gw: 0.5, series: [{ vals: () => [cnt.r, cnt.y, cnt.g], color: '#4f9bd0' }] });
  boards.push(bar);
  const colorAt = (a) => SEC[Math.floor((((a % 360) + 360) % 360) / 45)];
  const render = (lastC) => {
    const n = cnt.r + cnt.y + cnt.g;
    $('spinTab').innerHTML = tableHtml(['r', 'y', 'g'].map((c) => [`指针落在${SNAME[c]}区域`, cnt[c]]), n);
    const msg = $('spinMsg');
    msg.className = `tip feedback ${n ? 'fb-ok' : ''}`;
    msg.innerHTML = lastC ? `这一次落在<b>${SNAME[lastC]}</b>区域。共转了 ${n} 次。` : n ? `共转了 ${n} 次。` : '先猜，再转。';
    bar.update();
  };
  $('spin1').addEventListener('click', () => {
    if (busy) return;
    busy = true;
    const stop = Math.random() * 360; // 真随机的停止角
    const from = angle;
    const to = from - (from % 360) + 720 + stop; // 至少转两圈
    const t0 = performance.now();
    const step = (t) => {
      const u = Math.min(1, (t - t0) / 1500);
      const e = 1 - (1 - u) ** 3; // 先快后慢
      setNeedle(from + (to - from) * e);
      if (u < 1) { requestAnimationFrame(step); return; }
      angle = to % 360;
      const c = colorAt(angle);
      cnt[c] += 1;
      busy = false;
      render(c);
    };
    requestAnimationFrame(step);
  });
  $('spin40').addEventListener('click', () => {
    for (let i = 0; i < 40; i++) { const a = Math.random() * 360; cnt[colorAt(a)] += 1; angle = a; }
    setNeedle(angle);
    render(colorAt(angle));
  });
  $('spinClr').addEventListener('click', () => { cnt.r = 0; cnt.y = 0; cnt.g = 0; render(null); });
  render(null);
}

/* ---------- 第 6 页：图 8-3 五只袋子（白球个数 5、2、9、0、10） ---------- */
const WHITE = [5, 2, 9, 0, 10];
function bag10(w) {
  const balls = Array.from({ length: 10 }, (_, i) => (i < w ? '#fff' : '#e0533d'));
  // 简单交错排列，红白混在一起
  const order = [0, 5, 1, 6, 2, 7, 3, 8, 4, 9].map((k) => balls[k]);
  const pos = [[-40, 0], [-20, 0], [0, 0], [20, 0], [40, 0], [-30, -18], [-10, -18], [10, -18], [30, -18], [0, -36]];
  return `<svg viewBox="0 0 160 150"><path d="M55 25c-5-12 8-17 13-8 5-7 19-7 24 0 5-9 18-4 13 8-3 8-6 12-5 18 26 12 42 34 39 60-3 22-29 22-66 22s-63 0-66-22c-3-26 13-48 39-60 1-6-2-10-5-18z" fill="#eef0f8" stroke="#8a93b8" stroke-width="2"/>${pos.map(([dx, dy], i) => `<circle cx="${80 + dx}" cy="${118 + dy}" r="9.5" fill="${order[i]}" stroke="#556575" stroke-width="1.2"/>`).join('')}</svg>`;
}
function initBag5() {
  const picked = [];
  $('bag5').innerHTML = WHITE.map((w, i) => `<button type="button" class="b5" data-i="${i}">${bag10(w)}<span>(${i + 1})</span></button>`).join('');
  const render = () => {
    $('bag5').querySelectorAll('.b5').forEach((b) => {
      const k = picked.indexOf(+b.dataset.i);
      b.classList.toggle('on', k >= 0);
      b.dataset.n = k >= 0 ? k + 1 : '';
    });
    $('orderShow').textContent = picked.length ? picked.map((i) => `(${i + 1})`).join(' < ') : '（依次点袋子）';
    const msg = $('orderMsg');
    if (picked.length < 5) { msg.className = 'tip feedback'; msg.textContent = '从“摸到白球可能性最小”的袋子开始点。'; return; }
    const ok = picked.every((i, k) => k === 0 || WHITE[picked[k - 1]] <= WHITE[i]);
    msg.className = `tip feedback ${ok ? 'fb-ok' : 'fb-warn'}`;
    msg.innerHTML = ok ? `排对了！白球个数：${picked.map((i) => WHITE[i]).join(' < ')}（每袋都是 10 个球）。` : '有的地方排反了——数一数每只袋子里的白球。';
  };
  $('bag5').addEventListener('click', (e) => {
    const b = e.target.closest('.b5');
    if (!b || picked.length >= 5 || picked.includes(+b.dataset.i)) return;
    picked.push(+b.dataset.i);
    render();
  });
  $('orderClr').addEventListener('click', () => { picked.length = 0; render(); });
  render();
}

/* ---------- 第 7 页：可能性刻度（示意）与转盘① ---------- */
function drawScale() {
  const X = (p) => 30 + p * 440;
  const marks = [[0, '(1)'], [0.25, '(3)'], [0.5, '(2)'], [0.9, '(4)'], [1, '(5)']];
  $('scale1').innerHTML = `<line x1="${X(0)}" y1="45" x2="${X(1)}" y2="45" stroke="#556575" stroke-width="3"/>`
    + marks.map(([p, t], i) => `<circle cx="${X(p)}" cy="45" r="6" fill="#d9711c"/><text x="${X(p)}" y="${i === 3 ? 28 : 28}" dx="${i === 3 ? -8 : i === 4 ? 8 : 0}" text-anchor="middle" class="sc">${t}</text>`).join('')
    + `<text x="${X(0)}" y="75" text-anchor="middle" class="sc s">不可能</text><text x="${X(0.5)}" y="75" text-anchor="middle" class="sc s">一半对一半</text><text x="${X(1)}" y="75" text-anchor="middle" class="sc s">必然</text>`;
  const L = ['E', 'X', 'M', 'X', 'M', 'X', 'M', 'X']; // 课本图①，从 12 点方向顺时针
  const C = [110, 110];
  $('xem').innerHTML = L.map((_, i) => sector(C, 100, i * 45, (i + 1) * 45, '#fff200')).join('')
    + L.map((t, i) => { const [x, y] = pt(C, 64, i * 45 + 22.5); return `<text x="${x.toFixed(1)}" y="${(y + 8).toFixed(1)}" text-anchor="middle" class="xem">${t}</text>`; }).join('')
    + '<line x1="110" y1="110" x2="110" y2="22" stroke="#1d3a6e" stroke-width="3"/><circle cx="110" cy="110" r="4" fill="#1d3a6e"/>';
}

/* ---------- 第 8 页：习题 5 个转盘（左上、右上、右下、左下） ---------- */
function drawSpin5() {
  const c = { r: '#ef6f53', y: '#f2e06a', w: '#ffffff' };
  const S = [['y', 'w', 'r', 'w'], ['r', 'r', 'r', 'r'], ['r', 'r', 'y', 'r'], ['w', 'r', 'y', 'r'], ['y', 'w', 'y', 'w']];
  const ang = [[270, 360], [0, 90], [90, 180], [180, 270]];
  $('spin5').innerHTML = S.map((s, k) => {
    const C = [56 + k * 112, 56];
    return s.map((col, i) => sector(C, 48, ang[i][0], ang[i][1], c[col])).join('')
      + `<line x1="${C[0]}" y1="${C[1]}" x2="${C[0]}" y2="${C[1] - 40}" stroke="#1d3a6e" stroke-width="2.5"/><text x="${C[0]}" y="124" text-anchor="middle" class="sc">${'①②③④⑤'[k]}</text>`;
  }).join('');
}

window.LESSON = {
  init() {
    initCube();
    initSpinner();
    initBag5();
    drawScale();
    drawSpin5();
  },
  onRender() { requestAnimationFrame(() => boards.forEach((b) => b.update())); },
};
