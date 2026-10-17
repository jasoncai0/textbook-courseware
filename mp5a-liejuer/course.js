'use strict';
/* 五上 用列举的策略解决问题（二）· 本课互动：四支球队连线图（点两队连一条线，自动查重）、n 支球队两两连线、
 * 通电话（线段）与寄贺卡（箭头）对比、只向东北走的路线逐条列举。线条数、路线都由代码按题目数据算出。 */
const { tex } = MathKit;
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};

/* 第 4 页：画图列举。点的位置照课本 p96：红上、黄左、绿右、蓝下 */
const TEAMS = [
  { name: '红', color: '#e0463c', x: 210, y: 62 },
  { name: '黄', color: '#e8b400', x: 72, y: 190 },
  { name: '绿', color: '#3a9a4a', x: 348, y: 190 },
  { name: '蓝', color: '#2f6fd0', x: 210, y: 318 },
];
const pairKey = (a, b) => [Math.min(a, b), Math.max(a, b)].join('-'); // 红—黄 与 黄—红 是同一场
const pairName = (k) => k.split('-').map((i) => TEAMS[i].name).join('—');
function initMatch() {
  const svg = $('match');
  const st = { pick: -1, edges: [], flash: '' };
  const draw = () => {
    svg.innerHTML = '';
    st.edges.forEach((k) => {
      const [a, b] = k.split('-').map(Number);
      svgEl('line', { x1: TEAMS[a].x, y1: TEAMS[a].y, x2: TEAMS[b].x, y2: TEAMS[b].y, class: `medge${k === st.flash ? ' flash' : ''}` }, svg);
    });
    TEAMS.forEach((t, i) => {
      const g = svgEl('g', { class: `team${st.pick === i ? ' on' : ''}`, 'data-i': i, tabindex: 0, role: 'button', 'aria-label': `${t.name}队` }, svg);
      svgEl('circle', { cx: t.x, cy: t.y, r: 34, fill: t.color }, g);
      svgEl('text', { x: t.x, y: t.y + 9, class: 'tname' }, g).textContent = `${t.name}队`;
    });
  };
  const list = () => {
    // 按“新加入的球队”分行，和课本列表一致
    const rows = [1, 2, 3].map((j) => st.edges.filter((k) => +k.split('-')[1] === j).sort().map(pairName));
    $('mList').innerHTML = rows.map((r) => `<p>${r.join('　') || '<span class="muted">…</span>'}</p>`).join('');
  };
  const say = (html, cls = '') => { const m = $('mMsg'); m.className = `tip feedback ${cls}`; m.innerHTML = html; };
  const tap = (i) => {
    if (st.pick < 0) { st.pick = i; st.flash = ''; say(`选了<b>${TEAMS[i].name}队</b>，再点它的对手。`); draw(); return; }
    if (st.pick === i) { st.pick = -1; say('取消了。'); draw(); return; }
    const k = pairKey(st.pick, i);
    const typed = `${TEAMS[st.pick].name}—${TEAMS[i].name}`;
    st.pick = -1;
    if (st.edges.includes(k)) {
      st.flash = k;
      say(`<b>重复了！</b>${typed} 就是 ${pairName(k)}，这一场已经连过了。`, 'fb-warn');
    } else {
      st.edges = [...st.edges, k];
      st.flash = '';
      const done = st.edges.length === 6;
      say(done ? `连了 <b>6</b> 条线，每两支队之间都有一条，<b>全部连好了！</b>` : `连了 <b>${st.edges.length}</b> 条线（${pairName(k)}）。还有没连的吗？`, done ? 'fb-ok' : '');
    }
    draw(); list();
  };
  svg.addEventListener('click', (e) => { const g = e.target.closest('.team'); if (g) tap(+g.dataset.i); });
  svg.addEventListener('keydown', (e) => { const g = e.target.closest('.team'); if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.stopPropagation(); tap(+g.dataset.i); } });
  $('mUndo').addEventListener('click', () => { st.edges = st.edges.slice(0, -1); st.pick = -1; st.flash = ''; say(`连了 <b>${st.edges.length}</b> 条线。`); draw(); list(); });
  $('mClr').addEventListener('click', () => { st.edges = []; st.pick = -1; st.flash = ''; say('还没有连线。'); draw(); list(); });
  draw(); list();
}

/* 第 6 页：n 支球队，每两点之间连一条线 */
function initPoly() {
  const svg = $('poly');
  const [cx, cy, R] = [200, 190, 150];
  const colors = ['#e0463c', '#e8b400', '#3a9a4a', '#2f6fd0', '#8e44ad', '#d9711c', '#16a085', '#7f8c8d'];
  const draw = (n) => {
    svg.innerHTML = '';
    const pts = Array.from({ length: n }, (_, i) => {
      const t = -Math.PI / 2 + (2 * Math.PI * i) / n;
      return [cx + R * Math.cos(t), cy + R * Math.sin(t)];
    });
    let lines = 0;
    for (let i = 0; i < n; i += 1) for (let j = i + 1; j < n; j += 1) {
      svgEl('line', { x1: pts[i][0], y1: pts[i][1], x2: pts[j][0], y2: pts[j][1], class: 'medge thin' }, svg);
      lines += 1;
    }
    pts.forEach(([x, y], i) => svgEl('circle', { cx: x, cy: y, r: 16, fill: colors[i], stroke: '#fff', 'stroke-width': 3 }, svg));
    const terms = Array.from({ length: n - 1 }, (_, i) => i + 1);
    $('polyNv').textContent = `${n} 支`;
    $('polyEq').innerHTML = `${n} 支球队：$${terms.join('+')}=${lines}$（场）`;
    tex($('polyEq'));
  };
  $('polyN').addEventListener('input', (e) => draw(+e.target.value));
  draw(4);
}

/* 第 8 页：通电话（每两人一条线）与寄贺卡（每两人两个方向） */
const FRIENDS = [{ name: '小强', x: 200, y: 52 }, { name: '小华', x: 70, y: 250 }, { name: '小丽', x: 330, y: 250 }];
function initFriends() {
  const svg = $('friends');
  const draw = (mode) => {
    svg.innerHTML = '';
    const defs = svgEl('defs', {}, svg);
    const mk = svgEl('marker', { id: 'arr', viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' }, defs);
    svgEl('path', { d: 'M0 0L10 5L0 10Z', fill: '#d9711c' }, mk);
    const items = [];
    for (let i = 0; i < 3; i += 1) for (let j = i + 1; j < 3; j += 1) {
      const [a, b] = [FRIENDS[i], FRIENDS[j]];
      if (mode === 'call') {
        svgEl('line', { x1: a.x, y1: a.y, x2: b.x, y2: b.y, class: 'medge' }, svg);
        items.push(`${a.name}—${b.name}`);
        continue;
      }
      // 两张贺卡：沿连线两侧各偏移 9 像素，方向相反
      const len = Math.hypot(b.x - a.x, b.y - a.y);
      const [ux, uy] = [(b.x - a.x) / len, (b.y - a.y) / len];
      const [nx, ny] = [-uy * 9, ux * 9];
      const cut = 38; // 箭头停在头像圆外
      [[a, b, 1], [b, a, -1]].forEach(([p, q, s]) => {
        const [dx, dy] = [(q.x - p.x) / len, (q.y - p.y) / len];
        svgEl('line', { x1: p.x + dx * cut + nx * s, y1: p.y + dy * cut + ny * s, x2: q.x - dx * cut + nx * s, y2: q.y - dy * cut + ny * s, class: 'cardline', 'marker-end': 'url(#arr)' }, svg);
        items.push(`${p.name}→${q.name}`);
      });
    }
    FRIENDS.forEach((f) => {
      svgEl('circle', { cx: f.x, cy: f.y, r: 32, fill: '#eef5fb', stroke: '#1d6fa5', 'stroke-width': 3 }, svg);
      svgEl('text', { x: f.x, y: f.y + 8, class: 'fname' }, svg).textContent = f.name;
    });
    $('fMsg').innerHTML = mode === 'call'
      ? `<b>通电话</b>（每两人一次，不分谁打给谁）：${items.join('　')}，共 <b>${items.length}</b> 次`
      : `<b>寄贺卡</b>（谁寄给谁不一样）：${items.join('　')}，共 <b>${items.length}</b> 张`;
  };
  document.querySelector('.seg').addEventListener('click', (e) => {
    const b = e.target.closest('[data-mode]');
    if (!b) return;
    document.querySelectorAll('.seg .btn').forEach((x) => x.classList.toggle('solid', x === b));
    draw(b.dataset.mode);
  });
  draw('call');
}

/* 第 10 页：只向东、向北走，东 2 段、北 2 段，按顺序列出 6 条路线 */
const ROUTES = ['东东北北', '东北东北', '东北北东', '北东东北', '北东北东', '北北东东'];
function initRoute() {
  const svg = $('route');
  const u = 95;
  const home = [120, 245];
  const P = ([i, j]) => [home[0] + i * u, home[1] - j * u];
  let shown = 0;
  const draw = () => {
    svg.innerHTML = '';
    for (let j = 0; j <= 2; j += 1) svgEl('line', { x1: 30, x2: 400, y1: P([0, j])[1], y2: P([0, j])[1], class: 'street' }, svg);
    for (let i = 0; i <= 2; i += 1) svgEl('line', { x1: P([i, 0])[0], x2: P([i, 0])[0], y1: 30, y2: 270, class: 'street' }, svg);
    if (shown) {
      let cur = [0, 0];
      const pts = [P(cur)];
      [...ROUTES[shown - 1]].forEach((d) => { cur = d === '东' ? [cur[0] + 1, cur[1]] : [cur[0], cur[1] + 1]; pts.push(P(cur)); });
      svgEl('polyline', { points: pts.map((p) => p.join(',')).join(' '), class: 'rpath' }, svg);
    }
    const [hx, hy] = P([0, 0]);
    const [sx, sy] = P([2, 2]);
    svgEl('circle', { cx: hx, cy: hy, r: 8, fill: '#e0569a' }, svg);
    svgEl('circle', { cx: sx, cy: sy, r: 8, fill: '#e0569a' }, svg);
    svgEl('text', { x: hx - 12, y: hy + 30, class: 'rlab' }, svg).textContent = '小宁家';
    svgEl('text', { x: sx - 10, y: sy - 16, class: 'rlab' }, svg).textContent = '少年宫';
    svgEl('text', { x: 392, y: 26, class: 'rlab' }, svg).textContent = '北';
    svgEl('path', { d: 'M392 34L386 46H398Z', fill: '#e0569a' }, svg);
    $('rList').innerHTML = shown
      ? ROUTES.slice(0, shown).map((r, i) => `<span class="rtag${i === shown - 1 ? ' on' : ''}">${'①②③④⑤⑥'[i]} ${r}</span>`).join('')
      : '点“下一条路线”，按顺序一条一条地列。';
  };
  $('rNext').addEventListener('click', () => { shown = shown % ROUTES.length + 1; draw(); });
  $('rAll').addEventListener('click', () => { shown = ROUTES.length; draw(); });
  draw();
}

window.LESSON = {
  init() {
    initMatch();
    initPoly();
    initFriends();
    initRoute();
  },
};
