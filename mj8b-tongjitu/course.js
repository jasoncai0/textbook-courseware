'use strict';
/* 八下 7.2 统计图的选用 · 本课互动：文化程度统计表（点列高亮）、图 7-1 扇形点选看圆心角、
 * 小明一天的扇形逐个画出（量角器式累计角度）、选图实验室（3 组数据 × 3 种图）、图 7-2/7-3/7-4、
 * 复式条形图（图 7-5 / 尝试 1）、两条折线（尝试 2）、练习选图、A/B 校扇形与股价纵轴起点。
 * 所有统计图都由课本统计表数据精确计算绘制。 */
const { tex, fmt } = MathKit;
const $ = (id) => document.getElementById(id);
const YEARS = [1964, 1982, 1990, 2000, 2010, 2020];
const LEVELS = ['大学', '高中', '初中', '小学', '其他'];
/* 课本 p13 我国每 10 万人中具有各类文化程度人数的统计表 */
const EDU = {
  1964: [416, 1319, 4680, 28330, 65255],
  1982: [615, 6779, 17892, 35237, 39477],
  1990: [1422, 8039, 23344, 37057, 30138],
  2000: [3611, 11146, 33961, 35701, 15581],
  2010: [8930, 14032, 38788, 26779, 11471],
  2020: [15467, 15088, 34507, 24767, 10171],
};
const TOTAL = [723070269, 1031882511, 1160017381, 1295330000, 1370536875, 1443497378];
const PIE_C = ['#9a7fd1', '#f0a3c0', '#f3efa6', '#8fd3e8', '#e07fb0']; // 课本图 7-1/7-3 的配色顺序
const sep = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); // 千位分隔（细空格，同课本）
const boards = [];

/* ---------- 第 3 页：统计表 ---------- */
function initEduTable() {
  const t = $('eduTab');
  const render = (col) => {
    t.innerHTML = `<caption>我国每 10 万人中具有各类文化程度人数的统计表</caption><tr><th>年份</th>${LEVELS.map((l, k) => `<th class="pick-col${k === col ? ' on' : ''}" data-c="${k}">${l}</th>`).join('')}</tr>`
      + YEARS.map((y) => `<tr><td>${y}</td>${EDU[y].map((v, k) => `<td class="${k === col ? 'on' : ''}">${sep(v)}</td>`).join('')}</tr>`).join('');
  };
  t.setAttribute('data-noswipe', '');
  t.addEventListener('click', (e) => { const th = e.target.closest('[data-c]'); if (th) render(+th.dataset.c); });
  render(-1);
}

/* ---------- 第 4 页：图 7-1（1982） ---------- */
function initPie71() {
  const pcts = [0.6, 6.8, 17.9, 35.2, 39.5]; // 课本图 7-1 标注的百分比
  MStat.pie($('pie71'), LEVELS.map((n, k) => ({ name: n, v: pcts[k], color: PIE_C[k] })), { r: 92, pad: 78, fs: 16, label: (it, p) => `${it.name} ${fmt(p, 1)}%` });
  const show = (k) => {
    const msg = $('pieMsg');
    msg.className = 'tip feedback fb-ok';
    msg.innerHTML = `“${LEVELS[k]}”占 $${pcts[k]}\\%$，圆心角 $=${pcts[k]}\\%\\times360^\\circ\\approx${fmt((pcts[k] * 360) / 100, 1)}^\\circ$。`;
    tex(msg);
    $('pie71').querySelectorAll('g').forEach((g) => { g.style.opacity = +g.dataset.i === k ? 1 : 0.45; });
  };
  $('pie71').addEventListener('click', (e) => { const g = e.target.closest('g[data-i]'); if (g) show(+g.dataset.i); });
  $('pieMsg').textContent = '点一个扇形试试。';
}

/* ---------- 第 5 页：小明的一天，逐个画扇形 ---------- */
function initDay() {
  const items = [['学习', 8], ['睡眠', 9], ['活动', 4], ['用餐', 1], ['其他', 2]];
  const cols = ['#4f9bd0', '#8a6fc4', '#2f7d6b', '#e0b03a', '#c0577a'];
  let timer = null;
  const R = 100;
  const C = [150, 128];
  const pt = (deg, r = R) => [C[0] + r * Math.sin((deg * Math.PI) / 180), C[1] - r * Math.cos((deg * Math.PI) / 180)];
  const draw = (upto, partial) => { // 画好前 upto 个扇形，第 upto 个画到 partial 度
    let a = 0;
    let html = `<circle cx="${C[0]}" cy="${C[1]}" r="${R}" fill="#fff" stroke="#556575" stroke-width="2"/>`;
    items.forEach(([name, h], i) => {
      if (i > upto) return;
      const full = h * 15; // 360° × h/24
      const sweep = i < upto ? full : partial;
      if (sweep <= 0) return;
      const [x0, y0] = pt(a);
      const [x1, y1] = pt(a + sweep);
      html += `<path d="M${C[0]} ${C[1]}L${x0.toFixed(2)} ${y0.toFixed(2)}A${R} ${R} 0 ${sweep > 180 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}Z" fill="${cols[i]}" stroke="#fff" stroke-width="2"/>`;
      if (sweep === full) {
        const [lx, ly] = pt(a + full / 2, R + 16);
        const anchor = lx > C[0] + 4 ? 'start' : lx < C[0] - 4 ? 'end' : 'middle';
        html += `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" dy=".35em" text-anchor="${anchor}" class="pl">${name} ${Math.round((h / 24) * 100)}%</text>`;
      }
      a += sweep;
    });
    // 量角器：从 12 点方向量起的累计角
    html += `<path d="M${C[0]} ${C[1]}L${pt(a)[0].toFixed(2)} ${pt(a)[1].toFixed(2)}" stroke="#d9711c" stroke-width="3"/><circle cx="${C[0]}" cy="${C[1]}" r="4" fill="#1f2d3a"/>`;
    $('dayPie').innerHTML = `<svg viewBox="0 0 300 256">${html}</svg>`;
    return a;
  };
  const msg = (t) => { $('dayMsg').className = 'tip feedback fb-ok'; $('dayMsg').innerHTML = t; tex($('dayMsg')); };
  const reset = () => { clearInterval(timer); draw(-1, 0); $('dayMsg').className = 'tip feedback'; $('dayMsg').textContent = '算好圆心角后，点“画扇形”。'; };
  $('dayDraw').addEventListener('click', () => {
    clearInterval(timer);
    let i = 0;
    let p = 0;
    timer = setInterval(() => {
      const full = items[i][1] * 15;
      p = Math.min(full, p + 3);
      const acc = draw(i, p);
      msg(`正在画“${items[i][0]}”：$360^\\circ\\times\\frac{${items[i][1]}}{24}=${full}^\\circ$，量角器累计转过 $${acc}^\\circ$`);
      if (p >= full) {
        i += 1;
        p = 0;
        if (i === items.length) { clearInterval(timer); msg('$120^\\circ+135^\\circ+60^\\circ+15^\\circ+30^\\circ=360^\\circ$，正好画满一周。最后写标题：<b>小明平均每天时间安排扇形统计图</b>。'); }
      }
    }, 20);
  });
  $('dayReset').addEventListener('click', reset);
  reset();
}

/* ---------- 第 6 页：选图实验室 ---------- */
const LAB = [
  {
    key: 'edu', tab: '2000 年各类文化程度', title: '2000 年我国每 10 万人中具有各类文化程度的人数', cats: LEVELS, vals: EDU[2000], unit: '人数', ymax: 40000, ty: 10000,
    verdict: {
      bar: ['ok', '合适：能清楚地看出每类有多少人，小学、初中最多，大学最少（图 7-2）。'],
      pie: ['ok', '合适：五类人数合起来正好是 10 万人，扇形能看出各类占总体的百分比（图 7-3）。'],
      line: ['x', '不合适：大学、高中、初中……之间没有先后顺序，连成折线表示“变化过程”没有意义。'],
    },
  },
  {
    key: 'uni', tab: '1964～2020 年大学人数', title: '1964～2020 年我国每 10 万人中具有大学文化程度的人数', cats: YEARS.map(String), vals: YEARS.map((y) => EDU[y][0]), unit: '人数', ymax: 16000, ty: 2000,
    verdict: {
      bar: ['mid', '可以：能比较各年人数的多少；但要看“怎样增长”，不如折线直观。'],
      pie: ['x', '不合适：把各年的人数加在一起没有意义，它们不是一个“总体”的各部分。'],
      line: ['ok', '最合适：折线清楚地显示人数逐次增加，而且越来越快（图 7-4）。'],
    },
  },
  {
    key: 'pop', tab: '1964～2020 年总人口', title: '1964～2020 年我国总人口数（亿人，保留两位小数）', cats: YEARS.map(String), vals: TOTAL.map((v) => +(v / 1e8).toFixed(2)), unit: '亿人', ymax: 16, ty: 2,
    verdict: {
      bar: ['mid', '可以：能比较各次普查总人口的多少；看趋势不如折线。'],
      pie: ['x', '不合适：各年总人口相加没有意义。'],
      line: ['ok', '最合适：看出总人口一直在增加，但近几次增加得越来越慢。'],
    },
  },
];
function initLab() {
  const st = { d: LAB[0], t: 'bar' };
  $('labData').innerHTML = LAB.map((d, i) => `<button type="button" class="btn${i ? '' : ' solid'}" data-d="${d.key}">${d.tab}</button>`).join('');
  const render = () => {
    const { d, t } = st;
    const host = $('labChart');
    host.innerHTML = '';
    host.className = 'lab-chart';
    $('labPie').innerHTML = '';
    $('labPie').hidden = t !== 'pie';
    host.hidden = t === 'pie';
    $('labTitle').textContent = `${d.title}　${{ bar: '条形', pie: '扇形', line: '折线' }[t]}统计图`;
    st.board = null;
    if (t === 'bar') {
      st.board = MStat.bars(host, { cats: d.cats, ymax: d.ymax, ty: d.ty, labels: ['', d.unit], w: 560, h: 320, gw: 0.55, series: [{ vals: d.vals, color: '#f4d03f' }], fmt: (v) => (d.key === 'pop' ? fmt(v, 2) : sep(v)) });
      st.board.update();
    } else if (t === 'line') {
      st.board = MStat.line(host, {
        xs: d.cats.map((_, i) => i + 0.6), x: [-0.3, d.cats.length + 0.5], y: [-d.ymax * 0.09, d.ymax * 1.12], ty: d.ty, w: 560, h: 320, labels: ['', d.unit],
        xLabels: d.cats.map((c, i) => [i + 0.6, c]), series: [{ vals: d.vals, color: '#1d6fa5', values: true, fmt: (v) => (d.key === 'pop' ? fmt(v, 2) : sep(v)) }],
      });
      st.board.update();
    } else {
      MStat.pie($('labPie'), d.cats.map((c, k) => ({ name: c, v: d.vals[k], color: d.key === 'edu' ? PIE_C[k] : MStat.COLORS[k] })), { r: 100, pad: 110, padY: 64, fs: 17 });
    }
    const [kind, why] = d.verdict[t];
    const msg = $('labMsg');
    msg.className = `tip feedback ${kind === 'x' ? 'fb-warn' : 'fb-ok'}`;
    msg.innerHTML = `<b>${kind === 'ok' ? '✓ ' : kind === 'x' ? '✗ ' : '△ '}</b>${why}`;
    $('labType').querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', b.dataset.t === t));
    $('labData').querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', b.dataset.d === d.key));
  };
  $('labData').addEventListener('click', (e) => { const b = e.target.closest('[data-d]'); if (b) { st.d = LAB.find((x) => x.key === b.dataset.d); render(); } });
  $('labType').addEventListener('click', (e) => { const b = e.target.closest('[data-t]'); if (b) { st.t = b.dataset.t; render(); } });
  render();
  return { update: () => { if (st.board) st.board.update(); } };
}

/* ---------- 第 7 页：图 7-2、7-3、7-4 ---------- */
function initThree() {
  boards.push(MStat.bars($('fig72'), { cats: LEVELS, ymax: 40000, ty: 10000, labels: ['', '人数'], w: 420, h: 300, gw: 0.5, series: [{ vals: EDU[2000], color: '#f4d03f' }], fmt: sep }));
  MStat.pie($('fig73'), LEVELS.map((n, k) => ({ name: n, v: EDU[2000][k], color: PIE_C[k] })), { r: 90, pad: 80, fs: 16, label: (it, p) => `${it.name} ${fmt(p, 1)}%` });
  boards.push(MStat.line($('fig74'), {
    xs: [0.6, 1.6, 2.6, 3.6, 4.6, 5.6], x: [-0.3, 6.5], y: [-1500, 17500], ty: 2000, w: 420, h: 300, labels: ['', '人数'],
    xLabels: YEARS.map((y, i) => [i + 0.6, String(y)]), series: [{ vals: YEARS.map((y) => EDU[y][0]), color: '#1f2d3a', values: true, fmt: sep, dx: -24, dy: -4 }],
  }));
}

/* ---------- 第 8 页：复式条形图、两条折线 ---------- */
function initDouble() {
  const st = { y: 2000 };
  const pair = () => (st.y === 2000 ? [2000, 2010] : [2010, 2020]);
  const b = MStat.bars($('dblChart'), {
    cats: LEVELS, ymax: 40000, ty: 10000, labels: ['', '人数'], w: 560, h: 300, gw: 0.7, fmt: sep,
    series: [{ vals: () => EDU[pair()[0]], color: '#f4d03f' }, { vals: () => EDU[pair()[1]], color: '#1e9e5a' }],
  });
  const render = () => {
    const [a, c] = pair();
    $('dblTitle').textContent = `${a} 年、${c} 年我国每 10 万人中具有各类文化程度人数的条形统计图`;
    $('dblLegend').innerHTML = `<span><i style="background:#f4d03f"></i>${a} 年</span><span><i style="background:#1e9e5a"></i>${c} 年</span>`;
    $('dblBtns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', +x.dataset.y === st.y));
    b.update();
  };
  $('dblBtns').addEventListener('click', (e) => { const x = e.target.closest('[data-y]'); if (x) { st.y = +x.dataset.y; render(); } });
  render();
  boards.push(b);
  boards.push(MStat.line($('twoLine'), {
    xs: [0.6, 1.6, 2.6, 3.6, 4.6, 5.6], x: [-0.3, 6.5], y: [-1500, 17500], ty: 2000, w: 560, h: 300, labels: ['', '人数'],
    xLabels: YEARS.map((y, i) => [i + 0.6, String(y)]),
    series: [{ vals: YEARS.map((y) => EDU[y][0]), color: '#1d6fa5' }, { vals: YEARS.map((y) => EDU[y][1]), color: '#d9711c' }],
  }));
}

/* ---------- 第 9 页：练习 1 的三幅参考图 ---------- */
function initPractice() {
  const spend = [['食品', 40.6], ['衣着', 12.2], ['家庭设备', 7.0], ['医疗保健', 5.9], ['交通通信', 8.7], ['娱乐教育文化', 12.7], ['居住', 8.6], ['其他', 4.3]];
  MStat.pie($('prPie'), spend.map(([n, v]) => ({ name: n, v })), { r: 70, pad: 92, padY: 22, fs: 13, label: (it) => `${it.name} ${fmt(it.v, 1)}%` });
  boards.push(MStat.bars($('prBar'), { cats: ['鸡', '鸭', '鹅', '鸽子'], ymax: 32, ty: 5, labels: ['', '天'], w: 380, h: 240, gw: 0.5, series: [{ vals: [21, 30, 30, 16], color: '#4f9bd0' }] }));
  boards.push(MStat.line($('prLine'), {
    xs: [0.6, 1.6, 2.6, 3.6, 4.6, 5.6], x: [-0.3, 6.5], y: [-14, 115], ty: 20, w: 380, h: 240, labels: ['', '万亿元'],
    xLabels: [1970, 1980, 1990, 2000, 2010, 2020].map((y, i) => [i + 0.6, String(y)]), series: [{ vals: [0.23, 0.46, 1.89, 10.03, 41.21, 101.6], color: '#c0392b' }],
  }));
}

/* ---------- 第 10 页：A/B 校扇形、股价纵轴 ---------- */
function initTraps() {
  MStat.pie($('pieA'), [{ name: '女生', v: 50, color: '#d39ac7' }, { name: '男生', v: 50, color: '#8fd3f0' }], { r: 70, pad: 52, fs: 17, label: (it, p) => `${it.name} ${fmt(p, 0)}%` });
  MStat.pie($('pieB'), [{ name: '女生', v: 60, color: '#d39ac7' }, { name: '男生', v: 40, color: '#8fd3f0' }], { r: 70, pad: 52, fs: 17, label: (it, p) => `${it.name} ${fmt(p, 0)}%` });
  const P = [20, 21, 23, 27];
  const yr = [2007, 2008, 2009, 2010];
  const render = (y0) => {
    const W = 520; const H = 300; const L = 60; const B = 40; const T = 20;
    const y1 = y0 === 0 ? 30 : 28; // 起点为 0 时纵轴画到 30，否则画到 28（同课本两图）
    const X = (i) => L + 60 + i * 110;
    const Y = (v) => H - B - ((v - y0) / (y1 - y0)) * (H - B - T);
    let s = `<line x1="${L}" y1="${H - B}" x2="${W - 10}" y2="${H - B}" class="ax"/><line x1="${L}" y1="${H - B}" x2="${L}" y2="${T - 8}" class="ax"/>`;
    const step = y0 === 0 ? 10 : 2;
    for (let v = Math.ceil(y0 / step) * step; v <= y1; v += step) {
      if (v === y0 && v !== 0) continue;
      s += `<line x1="${L - 5}" y1="${Y(v)}" x2="${L}" y2="${Y(v)}" class="ax"/><text x="${L - 9}" y="${Y(v) + 5}" text-anchor="end" class="tk">${v}</text>`;
    }
    s += `<text x="${L - 9}" y="${H - B + 5}" text-anchor="end" class="tk">0</text>`;
    if (y0 > 0) s += `<path d="M${L - 7} ${H - B - 14}l14 -5M${L - 7} ${H - B - 8}l14 -5" stroke="#1f2d3a" stroke-width="2"/>`; // 折断号
    s += `<polyline points="${P.map((v, i) => `${X(i)},${Y(v)}`).join(' ')}" fill="none" stroke="#c0392b" stroke-width="3"/>`;
    s += P.map((v, i) => `<circle cx="${X(i)}" cy="${Y(v)}" r="4" fill="#c0392b"/><text x="${X(i)}" y="${H - B + 24}" text-anchor="middle" class="tk">${yr[i]}</text><text x="${X(i)}" y="${Y(v) - 10}" text-anchor="middle" class="tk v">${v}</text>`).join('');
    s += `<text x="${L + 6}" y="${T - 4}" class="tk">价格/元</text><text x="${W - 10}" y="${H - 6}" text-anchor="end" class="tk">年份</text>`;
    $('stock').innerHTML = `<svg viewBox="0 0 ${W} ${H}">${s}</svg>`;
    $('stkY0v').textContent = y0;
  };
  const inp = $('stkY0');
  inp.addEventListener('input', () => render(+inp.value));
  render(0);
}

let lab = null;
window.LESSON = {
  init() {
    initEduTable();
    initPie71();
    initDay();
    lab = initLab();
    initThree();
    initDouble();
    initPractice();
    initTraps();
  },
  onRender() { requestAnimationFrame(() => { boards.forEach((b) => b.update()); lab.update(); }); },
};
