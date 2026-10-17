'use strict';
/* 五下 蒜叶的生长 · 本课互动：三盆蒜示意图、根须记录表→单式折线统计图、蒜叶记录表→复式折线统计图（核心）、
 * 显示每组数据的差。统计图由 ../shared/mzhexian.js 按输入的数据精确描点；示例数据只作演示 */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const ROOT_DAYS = [2, 3, 4, 5, 6, 7, 8];
const ROOT_DEMO = [0, 2, 5, 8, 12, 15, 19];
const LEAF_DAYS = [6, 8, 10, 12, 14, 16];
const SUN_DEMO = [12, 25, 40, 56, 70, 83];
const ROOM_DEMO = [10, 20, 31, 42, 52, 61];

/* 第 3 页：三盆蒜 */
function pot(svg, cx, soil, label, sub) {
  if (soil) {
    svgEl('path', { d: `M${cx - 60} 150L${cx + 60} 150L${cx + 46} 215H${cx - 46}Z`, class: 'pot' }, svg);
    svgEl('rect', { x: cx - 58, y: 146, width: 116, height: 12, class: 'soil' }, svg);
  } else {
    svgEl('path', { d: `M${cx - 40} 120Q${cx - 52} 175 ${cx - 38} 215H${cx + 38}Q${cx + 52} 175 ${cx + 40} 120Z`, class: 'jar' }, svg);
    svgEl('rect', { x: cx - 44, y: 150, width: 88, height: 64, class: 'water' }, svg);
    [-14, -4, 6, 14].forEach((d, i) => svgEl('path', { d: `M${cx + d} 146q${i % 2 ? 4 : -4} 22 ${i % 2 ? -2 : 2} 46`, class: 'root' }, svg));
  }
  [-22, 0, 22].forEach((d) => {
    svgEl('ellipse', { cx: cx + d, cy: 140, rx: 11, ry: 14, class: 'clove' }, svg);
    svgEl('path', { d: `M${cx + d} 128q${d / 6} -30 ${d / 3} -${soil ? 60 : 40}`, class: 'leaf' }, svg);
  });
  svgEl('text', { x: cx, y: 238, class: 'pl' }, svg).textContent = label;
  if (sub) svgEl('text', { x: cx, y: 30, class: 'pl sub' }, svg).textContent = sub;
}
function initPots() {
  const svg = $('pots');
  pot(svg, 100, false, '水', '看根须');
  pot(svg, 300, true, '土 · 阳光下', '');
  pot(svg, 500, true, '土 · 房间里', '');
  svgEl('circle', { cx: 300, cy: 34, r: 16, class: 'sun' }, svg);
  svgEl('path', { d: 'M470 20h60v30h-60z', class: 'win' }, svg);
}

/* 记录表：rows = [{ name, demo }]，返回 { read(), fill(arr[]) } */
function table(el, days, rows, onInput) {
  el.innerHTML = `<tr><th></th>${days.map((d) => `<th>第 ${d} 天</th>`).join('')}</tr>${rows.map((r, k) => `<tr><th>${r.name}</th>${days.map((_, i) => `<td><input type="number" min="0" max="${r.max}" step="1" data-k="${k}" data-i="${i}"></td>`).join('')}</tr>`).join('')}`;
  const ins = [...el.querySelectorAll('input')];
  ins.forEach((e) => e.addEventListener('input', onInput));
  const cell = (k, i) => ins.find((e) => +e.dataset.k === k && +e.dataset.i === i);
  return {
    read: () => rows.map((r, k) => days.map((_, i) => {
      const v = parseFloat(cell(k, i).value);
      return Number.isFinite(v) && v >= 0 && v <= r.max ? v : null;
    })),
    fill: (data) => { data.forEach((arr, k) => arr.forEach((v, i) => { cell(k, i).value = v === null ? '' : v; })); onInput(); },
  };
}

/* 第 4 页：根须 */
function initRoot() {
  const c = MZx.chart($('rootChart'), {
    cats: ROOT_DAYS.map((d) => `第${d}天`), y: [0, 25], ty: 5, minor: 1, yName: '长度/mm',
    series: [{ name: '根须', vals: ROOT_DAYS.map(() => null) }],
  });
  const msg = $('rootMsg');
  let t;
  const update = () => {
    const [vals] = t.read();
    c.set(0, vals);
    const filled = vals.filter((v) => v !== null).length;
    const k = vals.findIndex((v) => v !== null && v > 0);
    msg.className = 'tip feedback';
    msg.innerHTML = !filled ? '在表里填上测量的长度（毫米，0～25），统计图会自动画出来。'
      : k < 0 ? '还没有长出根须。' : `第 <b>${ROOT_DAYS[k]}</b> 天开始长出根须。${filled === 7 ? `一星期共长了 <b>${vals[6] - vals[0]}</b> mm。` : ''}`;
  };
  t = table($('rootTab'), ROOT_DAYS, [{ name: '根须长/mm', max: 25 }], update);
  $('rootDemo').addEventListener('click', () => t.fill([ROOT_DEMO]));
  $('rootClear').addEventListener('click', () => t.fill([ROOT_DAYS.map(() => null)]));
  update();
}

/* 第 6 页：蒜叶（复式）+ 显示差 */
function initLeaf() {
  const c = MZx.chart($('leafChart'), {
    cats: LEAF_DAYS.map((d) => `第${d}天`), y: [0, 100], ty: 10, minor: 0, yName: '长度/mm',
    series: [
      { name: '阳光下', vals: LEAF_DAYS.map(() => null) },
      { name: '房间里', vals: LEAF_DAYS.map(() => null), dash: true, color: MZx.COLORS[0], lbDy: LEAF_DAYS.map(() => 1) },
    ],
  });
  const diffs = svgEl('g', {}, c.top);
  const st = { diff: false };
  const msg = $('leafMsg');
  let t;
  const update = () => {
    const [sun, room] = t.read();
    c.set(0, sun); c.set(1, room);
    diffs.innerHTML = '';
    const ds = sun.map((v, i) => (v !== null && room[i] !== null ? v - room[i] : null));
    if (st.diff) {
      ds.forEach((d, i) => {
        if (d === null) return;
        const [y1, y2] = [c.Y(sun[i]), c.Y(room[i])];
        svgEl('line', { x1: c.X(i), x2: c.X(i), y1, y2, class: 'dline' }, diffs);
        svgEl('text', { x: c.X(i) + 8, y: (y1 + y2) / 2 + 6, class: 'dtext' }, diffs).textContent = `差 ${+d.toFixed(1)}`;
      });
    }
    const got = ds.filter((d) => d !== null);
    msg.className = 'tip feedback';
    msg.innerHTML = !got.length ? '在表里填上两盆蒜最长叶片的长度（毫米，0～100）。'
      : `每组数据的差：${got.map((d) => +d.toFixed(1)).join('、')}（mm）。`;
  };
  t = table($('leafTab'), LEAF_DAYS, [{ name: '阳光下/mm', max: 100 }, { name: '房间里/mm', max: 100 }], update);
  $('leafDemo').addEventListener('click', () => t.fill([SUN_DEMO, ROOM_DEMO]));
  $('leafClear').addEventListener('click', () => t.fill([LEAF_DAYS.map(() => null), LEAF_DAYS.map(() => null)]));
  $('leafDiff').addEventListener('click', () => {
    st.diff = !st.diff;
    $('leafDiff').textContent = st.diff ? '隐藏差' : '显示每组数据的差';
    update();
  });
  update();
}

window.LESSON = {
  init() {
    initPots();
    initRoot();
    initLeaf();
  },
};
