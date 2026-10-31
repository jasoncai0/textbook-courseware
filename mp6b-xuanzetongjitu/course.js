'use strict';
/* 六下 选择合适的统计图 · 本课互动：例 2 三幅统计图（按课本数据代码绘制）、“问题找图”、
 * 李大伯家收入同一组数据换成条形 / 扇形 / 折线、练习一的数据自己选图并画出来。
 * 扇形的圆心角 = 百分比 × 360°；条形高度、折线点的位置都按数值精确计算。 */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent, text) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (text !== undefined) e.textContent = text;
  if (parent) parent.appendChild(e);
  return e;
};
const fmt = (v, d = 2) => String(+v.toFixed(d));
const PIE_C = ['#f7c6df', '#d8d2f1', '#fbf1a9', '#f8c8ae', '#cbe8cb', '#bfe0f2'];

/* ---------- 通用作图：W×H = 460×300 ---------- */
const W = 460;
const H = 300;
const pt = (cx, cy, r, deg) => [cx + r * Math.sin((deg * Math.PI) / 180), cy - r * Math.cos((deg * Math.PI) / 180)];
function sectorD(cx, cy, r, a0, a1) {
  const [x0, y0] = pt(cx, cy, r, a0);
  const [x1, y1] = pt(cx, cy, r, a1);
  return `M${cx} ${cy}L${x0.toFixed(2)} ${y0.toFixed(2)}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}Z`;
}
// 扇形图：vals 是百分数（和为 100），从 12 点方向起顺时针
function pie(svg, d) {
  const [cx, cy, r] = [W / 2, H / 2, d.r || 128];
  let a = 0;
  const placed = []; // 圆外标注的位置，上下错开避免重叠
  const pv = (v) => (d.dec ? v.toFixed(d.dec) : fmt(v, 1));
  return d.cats.map((c, i) => {
    const a1 = a + 3.6 * d.vals[i];
    const g = svgEl('g', { class: 'sec', 'data-i': i }, svg);
    svgEl('path', { d: sectorD(cx, cy, r, a, a1), fill: (d.colors || PIE_C)[i], class: 'sec-p' }, g);
    const mid = (a + a1) / 2;
    if (d.vals[i] < (d.out || 6)) { // 小扇形：标注写在圆外
      const right = mid < 180;
      const lx = cx + (right ? 1 : -1) * (r + 26);
      let ly = pt(cx, cy, r + 10, mid)[1];
      while (placed.some(([s0, y0]) => s0 === right && Math.abs(y0 - ly) < 22)) ly += 22;
      placed.push([right, ly]);
      const [ex, ey] = pt(cx, cy, r * 0.92, mid);
      svgEl('path', { d: `M${ex.toFixed(1)} ${ey.toFixed(1)}L${(lx + (right ? -4 : 4)).toFixed(1)} ${ly.toFixed(1)}`, class: 'lead' }, g);
      svgEl('text', { x: lx, y: ly + 6, class: 'sec-t out', 'text-anchor': right ? 'start' : 'end' }, g, `${c} ${pv(d.vals[i])}%`);
    } else {
      const [lx, ly] = pt(cx, cy, r * 0.6, mid);
      svgEl('text', { x: lx, y: ly - 4, class: 'sec-t' }, g, c);
      svgEl('text', { x: lx, y: ly + 18, class: 'sec-t v' }, g, `${pv(d.vals[i])}%`);
    }
    a = a1;
    return g;
  });
}
// 坐标轴：返回 x(i)、y(v)
function axes(svg, d) {
  const [L, R, T, B] = [58, W - 30, 34, H - 44];
  const n = d.cats.length;
  const y0 = d.ymin || 0;
  const y = (v) => B - ((B - T) * (v - y0)) / (d.ymax - y0);
  const x = (i) => L + ((R - L) * (i + 0.5)) / n;
  for (let v = y0; v <= d.ymax + 1e-9; v += d.ty) {
    svgEl('line', { x1: L, x2: R, y1: y(v), y2: y(v), class: v === y0 ? 'c-ax' : 'c-grid' }, svg);
    svgEl('text', { x: L - 7, y: y(v) + 5, class: 'c-tk' }, svg, fmt(v, 2));
  }
  if (y0 > 0) svgEl('path', { d: `M${L - 6} ${B + 9}l6 -5l-6 -5l6 -5`, class: 'c-break' }, svg); // 折断符号
  svgEl('line', { x1: L, x2: L, y1: T - 12, y2: B, class: 'c-ax' }, svg);
  svgEl('text', { x: L - 4, y: T - 18, class: 'c-tk st' }, svg, d.unit);
  const slot = (R - L) / n;
  d.cats.forEach((c, i) => svgEl('text', { x: x(i), y: B + 22, class: 'c-cat', 'font-size': Math.min(15, (slot * 0.95) / [...c].length) }, svg, c));
  if (d.xname) svgEl('text', { x: R + 4, y: B + 22, class: 'c-tk st' }, svg, d.xname);
  return { x, y, B, n, L, R };
}
function bars(svg, d) {
  const { x, y, B, n, L, R } = axes(svg, d);
  const series = d.series || [{ vals: d.vals, color: d.color || '#f4a6c4' }];
  const slot = (R - L) / n;
  const bw = Math.min(46, (slot * 0.62) / series.length);
  return d.cats.map((_, i) => {
    const g = svgEl('g', { class: 'bar', 'data-i': i }, svg);
    series.forEach((s, k) => {
      const bx = x(i) - (bw * series.length) / 2 + k * bw;
      svgEl('rect', { x: bx, y: y(s.vals[i]), width: bw, height: B - y(s.vals[i]), fill: s.color, class: 'c-bar' }, g);
      svgEl('text', { x: bx + bw / 2, y: y(s.vals[i]) - 5, class: 'c-v' }, g, fmt(s.vals[i], 2));
    });
    return g;
  });
}
function line(svg, d) {
  const { x, y } = axes(svg, d);
  const P = d.vals.map((v, i) => [x(i), y(v)]);
  const path = svgEl('path', { d: `M${P.map((p) => p.map((q) => q.toFixed(1)).join(' ')).join('L')}`, class: 'c-line' }, svg);
  const gs = P.map(([px, py], i) => {
    const g = svgEl('g', { class: 'lpt', 'data-i': i }, svg);
    svgEl('circle', { cx: px, cy: py, r: 5, class: 'c-dot' }, g);
    svgEl('text', { x: px, y: py - 10, class: 'c-v' }, g, fmt(d.vals[i], 2));
    return g;
  });
  return { path, gs };
}
function draw(svg, kind, d) {
  svg.innerHTML = '';
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  return kind === 'pie' ? pie(svg, d) : kind === 'line' ? line(svg, d) : bars(svg, d);
}

/* ---------- 课本数据 ---------- */
const READ_PIE = { cats: ['科普', '漫画', '童话', '小说', '其他'], vals: [27, 19, 20, 24, 10] };
const READ_LINE = { cats: ['7月', '8月', '9月', '10月', '11月', '12月'], vals: [136, 121, 85, 94, 72, 92], ymax: 140, ty: 20, unit: '数量/本', xname: '月份' };
const READ_BAR = { cats: ['2小时以下', '2~4小时', '4~6小时', '6~8小时', '8小时及以上'], vals: [3, 7, 8, 18, 9], ymax: 20, ty: 2, unit: '数量/人' };
const LI = { cats: ['粮食', '养殖', '水果', '其他'], vals: [3.1, 2.5, 1.8, 1.6] };
const LI_LINE = { cats: ['2002', '2004', '2006', '2008', '2010', '2012'], vals: [4.2, 5.7, 6.4, 7.6, 8.2, 9], ymax: 10, ty: 1, unit: '收入/万元', xname: '年份' };

/* 第 3 页：三幅图 */
function initThree() {
  draw($('rPie'), 'pie', READ_PIE);
  draw($('rLine'), 'line', READ_LINE);
  draw($('rBar'), 'bar', READ_BAR);
}

/* 第 4 页：问题找图 */
const QUEST = [
  { q: '六年级一班同学比较喜欢哪一种课外书？', want: 'pie', ok: '看<b>扇形统计图</b>：科普书占 27%，扇形最大，同学们比较喜欢科普书。', hi: (f) => f.pie.forEach((g, i) => g.classList.toggle('dim', i !== 0)) },
  { q: '下半年各月阅读课外书的本数是怎样变化的？', want: 'line', ok: '看<b>折线统计图</b>：7 月到 9 月一直减少，10 月有所回升，11 月又减少，12 月再增加。', hi: (f) => f.line.path.classList.add('hot') },
  { q: '平均每星期阅读时间在哪一段的人数最多？哪一段最少？', want: 'bar', ok: '看<b>条形统计图</b>：6~8 小时的人数最多（18 人），2 小时以下的最少（3 人）。', hi: (f) => f.bar.forEach((g, i) => g.classList.toggle('dim', i !== 3 && i !== 0)) },
];
const KIND_NAME = { pie: '扇形统计图', line: '折线统计图', bar: '条形统计图' };
function initFind() {
  const f = { pie: draw($('fPie'), 'pie', READ_PIE), line: draw($('fLine'), 'line', READ_LINE), bar: draw($('fBar'), 'bar', READ_BAR) };
  const st = { q: 0 };
  const box = $('fQ');
  box.innerHTML = QUEST.map((x, i) => `<button type="button" class="btn${i ? '' : ' solid'}" data-q="${i}">问题 ${i + 1}</button>`).join('');
  const clear = () => {
    document.querySelectorAll('#fPie .sec, #fBar .bar').forEach((g) => g.classList.remove('dim'));
    f.line.path.classList.remove('hot');
    document.querySelectorAll('.fcard').forEach((c) => c.classList.remove('ok', 'no'));
  };
  const show = () => {
    clear();
    $('fText').textContent = QUEST[st.q].q;
    $('fMsg').className = 'tip feedback';
    $('fMsg').textContent = '应该看哪幅统计图？点一点那幅图。';
  };
  box.addEventListener('click', (e) => {
    const b = e.target.closest('[data-q]');
    if (!b) return;
    st.q = +b.dataset.q;
    box.querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === b));
    show();
  });
  document.querySelectorAll('.fcard').forEach((c) => c.addEventListener('click', () => {
    const qq = QUEST[st.q];
    clear();
    const right = c.dataset.k === qq.want;
    c.classList.add(right ? 'ok' : 'no');
    $('fMsg').className = `tip feedback ${right ? 'ok' : 'warn'}`;
    $('fMsg').innerHTML = right ? `✓ ${qq.ok}` : `这幅${KIND_NAME[c.dataset.k]}回答不了这个问题，再想一想。`;
    if (right) qq.hi(f);
  }));
  show();
}

/* 第 6 页：同一组数据换一换 */
function initSwap() {
  const total = LI.vals.reduce((s, v) => s + v, 0); // 9 万元
  const pct = LI.vals.map((v) => (v / total) * 100);
  const VERDICT = {
    bar: ['ok', '条形统计图：一眼看出<b>每项收入各是多少万元</b>，粮食收入最多。'],
    pie: ['ok', `扇形统计图：每项收入占年收入的百分之几。粮食收入占 $3.1\\div9\\approx${fmt(pct[0], 1)}\\%$。`],
    line: ['warn', '折线统计图：粮食、养殖、水果、其他是四个<b>不同的项目</b>，没有先后变化，连成折线没有意义。'],
  };
  const pick = (k) => {
    const svg = $('swapFig');
    if (k === 'pie') draw(svg, 'pie', { cats: LI.cats, vals: pct, colors: ['#cbe8cb', '#d8d2f1', '#fbf1a9', '#f8c8ae'], dec: 1 });
    else draw(svg, k, { cats: LI.cats, vals: LI.vals, ymax: 3.5, ty: 0.5, unit: '收入/万元', xname: '项目' });
    const [cls, txt] = VERDICT[k];
    const msg = $('swapMsg');
    msg.className = `tip feedback ${cls}`;
    msg.innerHTML = txt;
    MathKit.tex(msg);
    $('swapK').querySelectorAll('[data-k]').forEach((b) => b.classList.toggle('solid', b.dataset.k === k));
  };
  $('swapK').addEventListener('click', (e) => { const b = e.target.closest('[data-k]'); if (b) pick(b.dataset.k); });
  pick('bar');
}

/* 第 7 页：练一练的折线图 */
function initLi() {
  draw($('liLine'), 'line', LI_LINE);
}

/* 第 9 页：自己选图（练习一第 4、6 题） */
const SETS = [
  { t: '六年级一班同学 1～6 年级时视力不良人数占全班人数的百分比', want: 'line', d: { cats: ['一', '二', '三', '四', '五', '六'], vals: [5, 7.5, 12.5, 17.5, 25, 30], ymax: 35, ty: 5, unit: '百分比/%', xname: '年级' },
    why: { line: '要看百分比<b>逐年怎样变化</b>，选折线统计图：视力不良的百分比一年比一年高。', bar: '条形图也能比较，但看不出<b>连续的变化趋势</b>。', pie: '这 6 个百分比不是同一个整体的几部分（加起来不是 100%），<b>不能</b>画扇形统计图。' } },
  { t: '六年级一班同学本学期视力情况统计（左眼、右眼）', want: 'bar', d: { cats: ['5.0及以上', '4.9', '4.8~4.6', '4.5及以下'], series: [{ vals: [29, 4, 5, 2], color: '#bfe0f2' }, { vals: [28, 5, 4, 3], color: '#6fb3df' }], ymax: 30, ty: 5, unit: '数量/人', xname: '视力' },
    why: { bar: '要比较各视力段<b>有多少人</b>，左、右眼对照，选复式条形统计图（浅蓝：左眼，深蓝：右眼）。', line: '视力段之间不是时间先后，连成折线没有意义。', pie: '两组数据（左眼、右眼）要放在一起比，一幅扇形图做不到。' } },
  { t: '顾英所在班级女生 50 米跑测试成绩（共 20 人）', want: 'bar', d: { cats: ['优秀', '良好', '及格', '不及格'], vals: [5, 8, 6, 1], ymax: 10, ty: 2, unit: '数量/人', xname: '成绩' },
    why: { bar: '课本的扇形图换成条形图：先算人数，$20\\times25\\%=5$，$20\\times40\\%=8$，$20\\times30\\%=6$，$20\\times5\\%=1$。条形图直接看出各等级多少人。', line: '成绩等级不是时间先后，不用折线图。', pie: '课本原来就是扇形图，题目要求换一种统计图来表示。' } },
  { t: '顾英五个学期 50 米跑的测试成绩', want: 'line', d: { cats: ['四上', '四下', '五上', '五下', '六上'], vals: [9.7, 9.5, 9.2, 9.0, 8.9], ymin: 8.5, ymax: 10, ty: 0.5, unit: '时间/秒', xname: '学期' },
    why: { line: '要看成绩<b>怎样变化</b>，选折线统计图：用时越来越短，跑得越来越快。纵轴从 8.5 开始，前面用折断符号省略。', bar: '课本原来就是条形图，题目要求换一种统计图来表示。', pie: '五次成绩不是一个整体的几部分，不能画扇形统计图。' } },
];
function initChoose() {
  const st = { s: 0 };
  const box = $('chS');
  box.innerHTML = SETS.map((s, i) => `<button type="button" class="btn${i ? '' : ' solid'}" data-s="${i}">数据 ${i + 1}</button>`).join('');
  const reset = () => {
    $('chT').textContent = SETS[st.s].t;
    $('chFig').innerHTML = '<text x="230" y="150" class="c-ph">选好统计图，就画在这里</text>';
    $('chMsg').className = 'tip feedback';
    $('chMsg').textContent = '你准备用哪种统计图？点下面的按钮画出来。';
    $('chK').querySelectorAll('[data-k]').forEach((b) => b.classList.remove('solid'));
  };
  box.addEventListener('click', (e) => {
    const b = e.target.closest('[data-s]');
    if (!b) return;
    st.s = +b.dataset.s;
    box.querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === b));
    reset();
  });
  $('chK').addEventListener('click', (e) => {
    const b = e.target.closest('[data-k]');
    if (!b) return;
    const s = SETS[st.s];
    const k = b.dataset.k;
    $('chK').querySelectorAll('[data-k]').forEach((x) => x.classList.toggle('solid', x === b));
    const fig = $('chFig');
    const canDraw = k === s.want || (k === 'bar' && !s.d.series) || (k === 'line' && !s.d.series);
    if (canDraw && k !== 'pie') draw(fig, k, s.d);
    else fig.innerHTML = '<text x="230" y="150" class="c-ph">这种统计图不合适，画不出来</text>';
    const msg = $('chMsg');
    msg.className = `tip feedback ${k === s.want ? 'ok' : 'warn'}`;
    msg.innerHTML = (k === s.want ? '✓ ' : '') + s.why[k];
    MathKit.tex(msg);
  });
  reset();
}

window.LESSON = {
  init() {
    initThree();
    initFind();
    initSwap();
    initLi();
    initChoose();
    const FOOD = ['豆奶类', '油脂类', '蔬菜水果类', '谷类', '鱼肉蛋类'];
    const FOOD_C = ['#f8c8ae', '#e7a3d6', '#bfe0f2', '#cbe8cb', '#fbf1a9'];
    draw($('day1'), 'pie', { cats: FOOD, vals: [12.3, 1.5, 46.8, 24.6, 14.8], colors: FOOD_C, r: 118, out: 16, dec: 1 });
    draw($('day2'), 'pie', { cats: FOOD, vals: [7.5, 2.5, 20.0, 32.5, 37.5], colors: FOOD_C, r: 118, out: 16, dec: 1 });
    draw($('sumPie'), 'pie', READ_PIE);
    draw($('sumLine'), 'line', READ_LINE);
    draw($('sumBar'), 'bar', READ_BAR);
  },
};
