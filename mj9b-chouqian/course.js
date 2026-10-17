'use strict';
/* 九下 8.4 抽签方法合理吗 · 本课互动：
 * 投票；抽签机（真随机打乱 A、B₁、B₂，甲乙丙依次取，动画 + 大量重复的频率条形图）；图 8-6 树状图（按钮/点结果高亮）；
 * “甲没抽中”的 6 格示意；练习 2 放回/不放回结果表；习题 2 真随机试验。随机数取自 crypto.getRandomValues。 */
const $ = (id) => document.getElementById(id);
const tex = (el) => MathKit.tex(el);

function randInt(n) {
  const buf = new Uint32Array(1);
  const lim = Math.floor(0x100000000 / n) * n;
  do crypto.getRandomValues(buf); while (buf[0] >= lim);
  return buf[0] % n;
}
function shuffle(a) {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) { const j = randInt(i + 1); [r[i], r[j]] = [r[j], r[i]]; }
  return r;
}
const WHO = ['甲', '乙', '丙'];
const SLIP = { A: '#3c7fc4', B1: '#d23b3b', B2: '#e08a2c' };
const sub = (k) => (k === 'A' ? 'A' : `B<tspan baseline-shift="sub" font-size="70%">${k[1]}</tspan>`);

/* ---------- 第 3 页：投票 ---------- */
function initVote() {
  const opts = ['甲（先抽）机会大', '丙（后抽）机会大', '三人一样'];
  $('vote').innerHTML = opts.map((o, i) => `<button class="btn" type="button" data-k="${i}">${o}</button>`).join('');
  $('voteMsg').textContent = '先选一个，再说说理由。';
  $('vote').addEventListener('click', (e) => {
    const t = e.target.closest('button');
    if (!t) return;
    $('vote').querySelectorAll('.btn').forEach((b) => b.classList.toggle('on', b === t));
    $('voteMsg').textContent = `你的猜想：${t.textContent}。下一页用抽签机检验！`;
  });
}

/* ---------- 第 4 页：抽签机 ---------- */
function initSim() {
  const svg = $('drawSvg');
  const cnt = [0, 0, 0];
  let n = 0;
  let busy = false;
  const BOX = [[40, 70], [100, 70], [160, 70]];
  const SEAT = [[300, 30], [370, 30], [440, 30]];
  svg.innerHTML = '<rect x="20" y="55" width="210" height="110" rx="10" fill="#f3e3c8" stroke="#a0784a" stroke-width="3"/>'
    + SEAT.map(([x], i) => `<text x="${x + 25}" y="175" text-anchor="middle" font-size="22" class="who" fill="#1f2d3a">${WHO[i]}</text><rect x="${x}" y="${SEAT[i][1] + 70}" width="50" height="40" rx="4" fill="none" stroke="#cdd8e2" stroke-dasharray="4 3"/>`).join('')
    + '<text x="125" y="40" text-anchor="middle" font-size="16" fill="#556575">盒子（已搅匀）</text>'
    + '<g id="slips"></g>';
  const slips = svg.querySelector('#slips');
  const place = (order, k) => { // k = 已抽出的张数
    slips.innerHTML = order.map((s, i) => {
      const [x, y] = i < k ? [SEAT[i][0], SEAT[i][1] + 70] : BOX[i];
      const win = i < k && s === 'A';
      return `<g style="transition:transform .45s;transform:translate(${x}px,${y}px)"><rect width="50" height="40" rx="4" fill="${win ? '#fde7cf' : '#fff'}" stroke="${win ? '#d9711c' : '#556575'}" stroke-width="${win ? 3 : 1.5}"/>`
        + (i < k ? `<text x="25" y="27" text-anchor="middle" font-size="20" font-style="italic" fill="${SLIP[s]}">${sub(s)}</text>` : '<text x="25" y="27" text-anchor="middle" font-size="18" fill="#b9c4ce">?</text>')
        + '</g>';
    }).join('');
  };
  place(['A', 'B1', 'B2'], 0);
  const once = () => { const o = shuffle(['A', 'B1', 'B2']); cnt[o.indexOf('A')] += 1; n += 1; return o; };
  const render = () => {
    const f = (c) => (n ? (c / n).toFixed(3) : '');
    $('simTab').innerHTML = `<tr><th>抽签次数</th><th>甲中签</th><th>乙中签</th><th>丙中签</th></tr><tr><td>${n}</td>${cnt.map((c) => `<td>${c}</td>`).join('')}</tr>`
      + `<tr><th>频率</th>${cnt.map((c) => `<td>${f(c)}</td>`).join('')}</tr>`;
    const Y = (v) => 200 - v * 300;
    let h = '<line x1="50" y1="200" x2="510" y2="200" stroke="#6f8191" stroke-width="2"/>';
    [0.2, 0.4, 0.6].forEach((v) => { h += `<line x1="50" x2="510" y1="${Y(v)}" y2="${Y(v)}" stroke="#e3eaf0"/><text x="44" y="${Y(v) + 5}" text-anchor="end" font-size="14">${v}</text>`; });
    cnt.forEach((c, i) => {
      const v = n ? c / n : 0;
      const x = 90 + i * 145;
      h += `<rect x="${x}" y="${Y(v)}" width="80" height="${200 - Y(v)}" fill="${['#4f9bd0', '#d9711c', '#2f7d6b'][i]}"/>`
        + `<text x="${x + 40}" y="225" text-anchor="middle" font-size="18">${WHO[i]}中签</text>`
        + (n ? `<text x="${x + 40}" y="${Y(v) - 6}" text-anchor="middle" font-size="16">${v.toFixed(3)}</text>` : '');
    });
    h += `<line x1="50" x2="510" y1="${Y(1 / 3)}" y2="${Y(1 / 3)}" stroke="#c0392b" stroke-width="2" stroke-dasharray="7 5"/><text x="512" y="${Y(1 / 3) - 6}" text-anchor="end" font-size="15" fill="#c0392b">1/3</text>`;
    $('freqSvg').innerHTML = h;
    $('simMsg').className = `tip feedback${n ? ' fb-ok' : ''}`;
    $('simMsg').textContent = n ? `共抽 ${n} 次。频率最大与最小相差 ${((Math.max(...cnt) - Math.min(...cnt)) / n).toFixed(3)}。` : '点“抽 1 次”看三人依次抽签。';
  };
  $('sim1').addEventListener('click', () => {
    if (busy) return;
    busy = true;
    const o = once();
    place(o, 0);
    [1, 2, 3].forEach((k) => setTimeout(() => { place(o, k); if (k === 3) { render(); busy = false; } }, k * 500));
  });
  const many = (m) => { if (busy) return; let o; for (let i = 0; i < m; i++) o = once(); place(o, 3); render(); };
  $('sim100').addEventListener('click', () => many(100));
  $('sim1000').addEventListener('click', () => many(1000));
  $('simClr').addEventListener('click', () => { if (busy) return; cnt.fill(0); n = 0; place(['A', 'B1', 'B2'], 0); render(); });
  render();
}

/* ---------- 第 5 页：树状图 ---------- */
const OUT = [['A', 'B1', 'B2'], ['A', 'B2', 'B1'], ['B1', 'A', 'B2'], ['B1', 'B2', 'A'], ['B2', 'A', 'B1'], ['B2', 'B1', 'A']];
function initTree() {
  const svg = $('treeSvg');
  const rowY = (i) => 70 + i * 55;
  const X = [150, 270, 390];
  const ball = (x, y, k) => `<circle cx="${x}" cy="${y}" r="17" fill="${SLIP[k]}"/><text x="${x}" y="${y + 6}" text-anchor="middle" font-size="17" fill="#fff">${sub(k)}</text>`;
  const arrow = (x1, y1, x2, y2) => `<line x1="${x1 + 19}" y1="${y1}" x2="${x2 - 22}" y2="${y2}" stroke="#2a9fd6" stroke-width="2.5" marker-end="url(#ar)"/>`;
  let h = '<defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#2a9fd6"/></marker></defs>';
  h += [['第一次', '（甲抽）'], ['第二次', '（乙抽）'], ['第三次', '（丙抽）']].map(([a, b], i) => `<text x="${X[i]}" y="20" text-anchor="middle" font-size="16" class="who" fill="#1f2d3a">${a}</text><text x="${X[i]}" y="40" text-anchor="middle" font-size="14" class="who" fill="#556575">${b}</text>`).join('')
    + '<text x="560" y="30" text-anchor="middle" font-size="15" class="who" fill="#1f2d3a">所有可能出现的结果</text>';
  const startY = (rowY(0) + rowY(5)) / 2;
  h += `<rect x="12" y="${startY - 15}" width="58" height="30" rx="4" fill="#b8a046"/><text x="41" y="${startY + 6}" text-anchor="middle" font-size="16" class="who" fill="#fff">开始</text>`;
  ['A', 'B1', 'B2'].forEach((k, g) => {
    const y1 = (rowY(2 * g) + rowY(2 * g + 1)) / 2;
    h += `<line x1="72" y1="${startY}" x2="${X[0] - 22}" y2="${y1}" stroke="#2a9fd6" stroke-width="2.5" marker-end="url(#ar)"/>` + ball(X[0], y1, k);
    [0, 1].forEach((j) => {
      const r = 2 * g + j;
      const o = OUT[r];
      h += arrow(X[0], y1, X[1], rowY(r)) + ball(X[1], rowY(r), o[1]) + arrow(X[1], rowY(r), X[2], rowY(r)) + ball(X[2], rowY(r), o[2]);
    });
  });
  OUT.forEach((o, r) => {
    h += `<g class="leaf" data-r="${r}"><rect x="478" y="${rowY(r) - 22}" width="160" height="44" rx="8" fill="#fff" stroke="#cdd8e2"/>`
      + o.map((k, j) => ball(512 + j * 46, rowY(r), k)).join('') + '</g>';
  });
  svg.innerHTML = h;
  const msg = document.createElement('p');
  msg.className = 'tip feedback';
  $('treeBtns').after(msg);
  const hl = (rows, text) => {
    svg.querySelectorAll('g.leaf').forEach((g) => g.classList.toggle('on', rows.includes(+g.dataset.r)));
    msg.innerHTML = text;
    tex(msg);
  };
  $('treeBtns').innerHTML = WHO.map((w, i) => `<button class="btn" type="button" data-w="${i}">${w}中签</button>`).join('') + '<button class="btn" type="button" data-w="-1">清除</button>';
  $('treeBtns').addEventListener('click', (e) => {
    const t = e.target.closest('button');
    if (!t) return;
    const w = +t.dataset.w;
    if (w < 0) { hl([], '点按钮或右侧的结果。'); return; }
    const rows = OUT.map((o, r) => (o[w] === 'A' ? r : -1)).filter((r) => r >= 0);
    hl(rows, `${WHO[w]}中签：第 ${w + 1} 个位置是 $A$ 的结果有 ${rows.length} 种，$P(\\text{${WHO[w]}中签})=\\dfrac{2}{6}=\\dfrac13$．`);
  });
  svg.addEventListener('click', (e) => {
    const g = e.target.closest('g.leaf');
    if (!g) return;
    const r = +g.dataset.r;
    const w = OUT[r].indexOf('A');
    hl([r], `结果 ${OUT[r].map((k) => (k === 'A' ? 'A' : `B_${k[1]}`)).map((k) => `$${k}$`).join('')}：$A$ 在第 ${w + 1} 位，<b>${WHO[w]}</b>中签．`);
  });
  hl([], '点按钮或右侧的结果。');
}

/* ---------- 第 6 页：6 种结果按“甲是否中签”分组 ---------- */
function initBar() {
  const order = [0, 1, 2, 4, 3, 5]; // 甲中签 2 种 | 乙中签 2 种 | 丙中签 2 种
  const col = ['#4f9bd0', '#d9711c', '#2f7d6b'];
  let h = '';
  order.forEach((r, i) => {
    const w = OUT[r].indexOf('A');
    const x = 20 + i * 88;
    h += `<rect x="${x}" y="40" width="84" height="40" fill="${col[w]}" opacity=".85"/><text x="${x + 42}" y="66" text-anchor="middle" font-size="15" fill="#fff" font-style="italic">${OUT[r].map(sub).join('')}</text>`;
  });
  h += '<path d="M20 34 V24 H192 V34" fill="none" stroke="#4f9bd0" stroke-width="2"/><text x="106" y="18" text-anchor="middle" font-size="15">甲中签（2 种）</text>';
  h += '<path d="M196 34 V24 H544 V34" fill="none" stroke="#556575" stroke-width="2"/><text x="370" y="18" text-anchor="middle" font-size="15">甲没抽中（4 种）</text>';
  h += '<path d="M196 86 V96 H368 V86" fill="none" stroke="#d9711c" stroke-width="2"/><text x="282" y="114" text-anchor="middle" font-size="15" fill="#d9711c">其中乙中签 2 种</text>';
  h += '<text x="456" y="114" text-anchor="middle" font-size="15" fill="#2f7d6b">丙中签 2 种</text>';
  $('bar1').innerHTML = h;
}

/* ---------- 第 7 页：放回 / 不放回 ---------- */
function initBalls() {
  const B = ['红₁', '红₂', '白'];
  const draw = (back) => {
    let h = '<span class="h">1↓ 2→</span>' + B.map((b) => `<span class="h">${b}</span>`).join('');
    let tot = 0;
    let rr = 0;
    B.forEach((a, i) => {
      h += `<span class="h">${a}</span>`;
      B.forEach((b, j) => {
        const x = !back && i === j;
        const red = !x && i < 2 && j < 2;
        if (!x) tot += 1;
        if (red) rr += 1;
        h += `<span class="${x ? 'x' : red ? 'rr' : ''}">${x ? '×' : `${a}${b}`}</span>`;
      });
    });
    $('ballGrid').innerHTML = `<div class="grid9">${h}</div>`;
    $('ballMsg').className = 'tip feedback fb-ok';
    $('ballMsg').innerHTML = back
      ? `(1) 放回：共 $3\\times3=9$ 种等可能结果，2 次都摸到红球 ${rr} 种，$P=\\dfrac{4}{9}$．`
      : `(2) 不放回：划掉对角线，共 $3\\times2=6$ 种，2 个都是红球 ${rr} 种，$P=\\dfrac{2}{6}=\\dfrac13$．`;
    tex($('ballMsg'));
    $('ballBtns').querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', (b.dataset.k === '1') === back));
  };
  $('ballBtns').innerHTML = '<button class="btn" type="button" data-k="1">(1) 放回</button><button class="btn" type="button" data-k="0">(2) 不放回</button>';
  $('ballBtns').addEventListener('click', (e) => { const t = e.target.closest('button'); if (t) draw(t.dataset.k === '1'); });
  draw(true);
}

/* ---------- 第 8 页：习题 2 试验 ---------- */
function initEx2() {
  const c = [0, 0, 0];
  let n = 0;
  const render = () => {
    $('ex2Tab').innerHTML = `<tr><th>摸球次数</th><th>甲摸到白球</th><th>乙摸到白球</th><th>丙摸到白球</th></tr><tr><td>${n}</td>${c.map((x) => `<td>${x}</td>`).join('')}</tr>`
      + `<tr><th>频率</th>${c.map((x) => `<td>${n ? (x / n).toFixed(3) : ''}</td>`).join('')}</tr>`;
    $('ex2Msg').className = `tip feedback${n ? ' fb-ok' : ''}`;
    $('ex2Msg').textContent = n ? '三人摸到白球的频率都在 0.5 附近。' : '每次把 2 白 2 红随机打乱，前 3 个分别给甲、乙、丙。';
  };
  $('ex2Go').addEventListener('click', () => {
    for (let i = 0; i < 2000; i++) { const o = shuffle(['W', 'W', 'R', 'R']); for (let k = 0; k < 3; k++) if (o[k] === 'W') c[k] += 1; }
    n += 2000;
    render();
  });
  $('ex2Clr').addEventListener('click', () => { c.fill(0); n = 0; render(); });
  render();
}

window.LESSON = {
  init() {
    initVote();
    initSim();
    initTree();
    initBar();
    initBalls();
    initEx2();
  },
};
