'use strict';
/* 八下 7.4 频数分布表和频数分布直方图 · 本课互动：50 个身高找最值/排序、9 组数轴图、频数分布表逐行划记、
 * 图 7-6、组距实验室（组距 1～8 实时重算表与直方图）、条形图与直方图对比、读体重直方图、拖动长条画直方图、噪声直方图。
 * 频数全部由课本原始数据（或课本给出的频数）计算，图形按比例绘制。 */
const { board, tex, fmt } = MathKit;
const $ = (id) => document.getElementById(id);
const boards = [];
const OFF = [[-1e5, -1e5], [-1e5, -1e5], [-1e5, -1e5]];

/* 课本 p25：50 名学生的身高（cm） */
const H = [150, 148, 159, 156, 157, 163, 156, 164, 156, 159, 169, 163, 170, 162, 163, 164, 155, 162, 153, 155,
  160, 165, 160, 161, 166, 159, 161, 157, 155, 167, 162, 165, 159, 147, 163, 172, 156, 165, 157, 164,
  152, 156, 153, 164, 165, 162, 167, 151, 161, 162];
const START = 146.5;
/** 从 START 起按组距 w 分组，组数 = ⌈(最大值 − START) / w⌉ */
function groups(w) {
  const k = Math.ceil((Math.max(...H) - START) / w);
  return Array.from({ length: k }, (_, i) => {
    const a = START + i * w;
    return { a, b: a + w, c: H.filter((x) => x > a && x < a + w).length };
  });
}

/** 直方图：get() 返回 [{ a, b, c }]；横轴从 lo 到 hi（数据单位），最多 maxBars 个长条 */
function hist(el, o) {
  const span = o.hi - o.lo;
  const x0 = o.lo - span * 0.09;
  const b = board(el, { x: [x0, o.hi + span * 0.22], y: [-Math.min(o.ymax * 0.12, o.ty * 0.95), o.ymax * 1.12], w: o.w || 560, h: o.h || 320, ticks: [0, o.ty], labels: o.labels, grid: true });
  el.classList.add('schart');
  // 横轴折断号：省略 0 到 lo 这一段
  const zz = span * 0.02;
  const zy = o.ymax * 0.018;
  b.seg([[x0 + zz, 0], [x0 + 2 * zz, zy]], { cls: 'zz' }); b.seg([[x0 + 2 * zz, zy], [x0 + 3 * zz, -zy]], { cls: 'zz' }); b.seg([[x0 + 3 * zz, -zy], [x0 + 4 * zz, 0]], { cls: 'zz' });
  for (let i = 0; i < (o.maxBars || 12); i++) {
    const g = () => o.get()[i];
    const poly = b.poly(() => (g() && g().c > 0 ? [[g().a, 0], [g().b, 0], [g().b, g().c], [g().a, g().c]] : OFF), { cls: 'hbar' });
    if (o.color) poly.style.fill = o.color;
    if (o.values !== false) b.text(() => (g() && g().c > 0 ? [(g().a + g().b) / 2, g().c] : null), () => String(g().c), { cls: 'sval', dy: -5 });
  }
  // 分界点标注：太密时隔几个标一个
  for (let i = 0; i <= (o.maxBars || 12); i++) {
    b.text(() => {
      const gs = o.get();
      const every = Math.ceil((gs.length + 1) / (o.maxLabels || 10));
      if (i > gs.length || i % every) return null;
      return [i < gs.length ? gs[i].a : gs[gs.length - 1].b, 0];
    }, () => { const gs = o.get(); return fmt(i < gs.length ? gs[i].a : gs[gs.length - 1].b, 1); }, { cls: 'scat edge', dy: 18 });
  }
  boards.push(b);
  return b;
}

/* ---------- 第 3 页：50 个身高 ---------- */
function initHeights() {
  const st = { order: H.map((_, i) => i), mark: false };
  const max = Math.max(...H);
  const min = Math.min(...H);
  const render = () => {
    $('hgrid').innerHTML = st.order.map((i) => `<span class="${st.mark && (H[i] === max || H[i] === min) ? 'on' : ''}">${H[i]}</span>`).join('');
  };
  const msg = (t) => { $('hMsg').className = 'tip feedback fb-ok'; $('hMsg').innerHTML = t; };
  $('hMax').addEventListener('click', () => { st.mark = true; render(); msg(`最大值 ${max}，最小值 ${min}，相差 ${max - min} cm。`); });
  $('hSort').addEventListener('click', () => {
    st.order = H.map((_, i) => i).sort((a, b) => H[a] - H[b]);
    st.mark = true; render();
    msg(`排好了：150 以下只有 ${H.filter((x) => x < 150).length} 人（147、148），170 以上只有 ${H.filter((x) => x > 170).length} 人（172）；160 上下最密。`);
  });
  $('hBack').addEventListener('click', () => { st.order = H.map((_, i) => i); st.mark = false; render(); $('hMsg').className = 'tip feedback'; $('hMsg').textContent = '50 个数，先找找规律。'; });
  render();
  $('hMsg').className = 'tip feedback';
  $('hMsg').textContent = '50 个数，先找找规律。';
}

/* ---------- 第 4 页：9 组在数轴上 ---------- */
function drawGroupsFig() {
  const L = 20; const R = 540; const lo = 145; const hi = 175;
  const X = (v) => L + ((v - lo) / (hi - lo)) * (R - L);
  let s = `<line x1="${L}" y1="70" x2="${R + 10}" y2="70" stroke="#6f8191" stroke-width="2"/><path d="M${R + 14} 70l-10 -5v10z" fill="#6f8191"/>`;
  for (let v = 146; v <= 174; v += 1) s += `<line x1="${X(v)}" y1="66" x2="${X(v)}" y2="74" stroke="#9fb0bf" stroke-width="1"/>`;
  groups(3).forEach((g, i) => {
    s += `<rect x="${X(g.a)}" y="38" width="${X(g.b) - X(g.a)}" height="26" fill="${i % 2 ? '#d3e6f4' : '#fde7cf'}" stroke="#556575" stroke-width="1"/><text x="${(X(g.a) + X(g.b)) / 2}" y="56" text-anchor="middle" class="gt">${i + 1}</text>`;
    s += `<text x="${X(g.a)}" y="96" text-anchor="middle" class="gt s">${g.a}</text>`;
  });
  s += `<text x="${X(173.5)}" y="96" text-anchor="middle" class="gt s">173.5</text>`;
  [147, 172].forEach((v) => { s += `<circle cx="${X(v)}" cy="70" r="5" fill="#1f2d3a"/><text x="${X(v)}" y="116" text-anchor="middle" class="gt s b">${v}</text>`; });
  $('groupsFig').innerHTML = s;
}

/* ---------- 第 5 页：频数分布表（逐行出现） ---------- */
function initTable() {
  const gs = groups(3);
  $('ftab').innerHTML = '<tr><th>身高分组</th><th>划　记</th><th>频　数</th></tr>'
    + gs.map((g, i) => `<tr data-step="${i + 1}"><td>${g.a}～${g.b}</td><td class="tl">${MStat.tally(g.c)}</td><td>${g.c}</td></tr>`).join('')
    + `<tr data-step="10"><td>合　计</td><td></td><td>${gs.reduce((s, g) => s + g.c, 0)}</td></tr>`;
}

/* ---------- 第 7 页：组距实验室 ---------- */
function initLab() {
  const st = { w: 3 };
  hist($('gHist'), { lo: 146.5, hi: 174.5, ymax: 26, ty: 5, labels: ['身高/cm', '频数'], maxBars: 26, maxLabels: 10, get: () => groups(st.w) });
  const b = boards[boards.length - 1];
  const render = () => {
    const gs = groups(st.w);
    $('gwv').textContent = st.w;
    $('gtab').innerHTML = gs.map((g) => `<span>${fmt(g.a, 1)}～${fmt(g.b, 1)}<b>${g.c}</b></span>`).join('');
    const msg = $('gwMsg');
    const verdict = gs.length > 12 ? '组太多，每组数据太少，图形忽高忽低。' : gs.length < 5 ? '组太少，分布的细节看不出来了。' : '组数适中，能看出“中间多、两头少”。';
    msg.className = `tip feedback ${gs.length > 12 || gs.length < 5 ? 'fb-warn' : 'fb-ok'}`;
    msg.innerHTML = `组距 ${st.w}：$25\\div${st.w}${25 % st.w ? `=${fmt(25 / st.w, 2)}` : `=${25 / st.w}`}$，分 <b>${gs.length}</b> 组。${verdict}`;
    tex(msg);
    b.update();
  };
  const inp = $('gw');
  inp.addEventListener('input', () => { st.w = +inp.value; render(); });
  render();
}

/* ---------- 第 8 页：对比 ---------- */
function initCompare() {
  boards.push(MStat.bars($('cmpBar'), { cats: ['A', 'B', 'C', 'D', 'E', 'F', 'G'], ymax: 13, ty: 2, labels: ['社团代号', '人数'], w: 520, h: 300, gw: 0.5, series: [{ vals: [8, 8, 12, 12, 4, 4, 2], color: '#f2a0ae' }] }));
  hist($('cmpHist'), { lo: 146.5, hi: 173.5, ymax: 14, ty: 2, labels: ['身高/cm', '频数'], maxBars: 9, maxLabels: 5, get: () => groups(3) });
}

/* ---------- 第 9 页：练习 1 体重 ---------- */
function fixed(edges, counts) { return edges.slice(0, -1).map((a, i) => ({ a, b: edges[i + 1], c: counts[i] })); }
const WEIGHT = fixed([39.5, 44.5, 49.5, 54.5, 59.5, 64.5, 69.5], [3, 8, 13, 9, 5, 2]);
function initWeight() {
  const st = { k: -1 };
  hist($('wHist'), { lo: 39.5, hi: 69.5, ymax: 14, ty: 2, labels: ['体重/kg', '频数'], maxBars: 6, get: () => WEIGHT, color: '#cfe9dc' });
  const b = boards[boards.length - 1];
  b.poly(() => (st.k >= 0 ? [[WEIGHT[st.k].a, 0], [WEIGHT[st.k].b, 0], [WEIGHT[st.k].b, WEIGHT[st.k].c], [WEIGHT[st.k].a, WEIGHT[st.k].c]] : OFF), { cls: 'hsel' });
  b.text(() => (st.k >= 0 ? [(WEIGHT[st.k].a + WEIGHT[st.k].b) / 2, 13.2] : null), () => (st.k >= 0 ? `${WEIGHT[st.k].a}～${WEIGHT[st.k].b} kg：${WEIGHT[st.k].c} 人` : ''), { cls: 'scat' });
  b.svg.addEventListener('click', (e) => {
    const p = b.svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
    const q = p.matrixTransform(b.svg.getScreenCTM().inverse());
    const x = 39.5 - 30 * 0.09 + q.x / (b.W / (30 * 1.19));
    st.k = WEIGHT.findIndex((g) => x >= g.a && x < g.b);
    b.update();
  });
}

/* ---------- 第 10 页：拖动长条画直方图 ---------- */
const BUILD = fixed([59.5, 61.5, 63.5, 65.5, 67.5, 69.5, 71.5, 73.5, 75.5, 77.5, 79.5], [2, 5, 9, 15, 21, 19, 13, 9, 5, 2]);
function initBuild() {
  const cur = BUILD.map(() => 0);
  const get = () => BUILD.map((g, i) => ({ ...g, c: cur[i] }));
  hist($('buildHist'), { lo: 59.5, hi: 79.5, ymax: 24, ty: 2, labels: ['', '频数'], maxBars: 10, get, color: '#cfe9dc', values: false });
  const b = boards[boards.length - 1];
  BUILD.forEach((g, i) => {
    b.pt(() => [(g.a + g.b) / 2, cur[i]], { r: 6, cls: 'okpt', show: () => cur[i] === g.c });
    b.drag(() => [(g.a + g.b) / 2, cur[i]], (x, y) => { cur[i] = Math.max(0, Math.min(23, Math.round(y))); }, { hit: 16, r: 7 });
  });
  const msg = $('buildMsg');
  b.onUpdate = () => {
    const ok = cur.filter((c, i) => c === BUILD[i].c).length;
    msg.className = `tip feedback ${ok === BUILD.length ? 'fb-ok' : ''}`;
    msg.innerHTML = ok === BUILD.length ? '10 个长条全部正确！频数合计 100。中间高、两边低，67.5～69.5 这组最多。' : `已画对 ${ok} / 10 个长条（画对的顶点会出现绿点）。`;
    b.svg.querySelectorAll('.handle').forEach((h, i) => h.classList.toggle('done', cur[i] === BUILD[i].c));
  };
  $('buildShow').addEventListener('click', () => { BUILD.forEach((g, i) => { cur[i] = g.c; }); b.update(); });
  $('buildClr').addEventListener('click', () => { cur.fill(0); b.update(); });
}

/* ---------- 第 11 页：噪声直方图 ---------- */
function initNoise() {
  hist($('nHist'), { lo: 55, hi: 80, ymax: 14, ty: 2, labels: ['dB', '频数'], maxBars: 5, get: () => fixed([55, 60, 65, 70, 75, 80], [4, 10, 12, 8, 6]), color: '#cfe9dc', w: 520, h: 260 });
}

window.LESSON = {
  init() {
    initHeights();
    drawGroupsFig();
    initTable();
    hist($('h76'), { lo: 146.5, hi: 173.5, ymax: 14, ty: 2, labels: ['身高/cm', '频数'], maxBars: 9, get: () => groups(3), color: '#cfe9dc' });
    initLab();
    initCompare();
    initWeight();
    initBuild();
    initNoise();
  },
  onRender() { requestAnimationFrame(() => boards.forEach((b) => b.update())); },
};
