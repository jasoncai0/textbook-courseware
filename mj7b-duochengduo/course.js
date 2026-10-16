'use strict';
/* 七下 9.3 多项式乘多项式 · 本课互动：
 * ① 图 9-4“切两刀”：(a+b)(c+d) 的长方形先竖切成 a(c+d)、b(c+d)，再横切成 ac、ad、bc、bd（按比例绘制）；
 * ② 格子表：带负号的项不能画成面积，就用表格逐格相乘，再给同类项上色合并；
 * ③ 地砖长、宽各截去 2 cm（练一练 2），剩余部分按比例绘制。通用部分见 ../shared/math.js */
const { board, slider, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);

/* ---------- 第 3 页：切两刀 ---------- */
function initCut() {
  const s = { a: 4, b: 2.5, c: 2, d: 3.5, stage: 0 };
  const g = board($('cutBoard'), { x: [-1.3, 10.3], y: [-1.2, 8.2], axes: false, grid: false, w: 600 });
  const W = () => s.a + s.b;
  const H = () => s.c + s.d;
  // 上行为 c、下行为 d（与图 9-4 一致）
  const rect = (x0, x1, y0, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
  g.poly(() => (s.stage === 0 ? rect(0, W(), 0, H()) : []), { cls: 'whole' });
  g.poly(() => (s.stage === 1 ? rect(0, s.a, 0, H()) : []), { cls: 'g0' });
  g.poly(() => (s.stage === 1 ? rect(s.a, W(), 0, H()) : []), { cls: 'g1' });
  const cells = [
    ['ac', () => rect(0, s.a, s.d, H())], ['ad', () => rect(0, s.a, 0, s.d)],
    ['bc', () => rect(s.a, W(), s.d, H())], ['bd', () => rect(s.a, W(), 0, s.d)],
  ];
  cells.forEach(([name, r], i) => {
    g.poly(() => (s.stage === 2 ? r() : []), { cls: `g${i}` });
    g.text(() => (s.stage === 2 ? [r()[0][0] + (r()[1][0] - r()[0][0]) / 2, r()[0][1] + (r()[2][1] - r()[0][1]) / 2] : null), name, { cls: 'lb c', dy: 8 });
  });
  g.text(() => (s.stage === 1 ? [s.a / 2, H() / 2] : null), 'a(c+d)', { cls: 'lb c', dy: 8 });
  g.text(() => (s.stage === 1 ? [s.a + s.b / 2, H() / 2] : null), 'b(c+d)', { cls: 'lb c', dy: 8 });
  g.text(() => (s.stage === 0 ? [W() / 2, H() / 2] : null), '(a+b)(c+d)', { cls: 'lb c', dy: 8 });
  // 刀口：下一刀的位置用红色虚线预告
  g.seg(() => (s.stage === 0 ? [[s.a, -0.4], [s.a, H() + 0.4]] : [[0, 0], [0, 0]]), { cls: 'knife' });
  g.seg(() => (s.stage === 1 ? [[-0.4, s.d], [W() + 0.4, s.d]] : [[0, 0], [0, 0]]), { cls: 'knife' });
  g.text(() => [s.a / 2, H()], 'a', { dx: -4, dy: -10 });
  g.text(() => [s.a + s.b / 2, H()], 'b', { dx: -4, dy: -10 });
  g.text(() => [0, s.d + s.c / 2], 'c', { dx: -20, dy: 6 });
  g.text(() => [0, s.d / 2], 'd', { dx: -20, dy: 6 });
  const STAGE_TEX = ['(a+b)(c+d)', 'a(c+d)+b(c+d)', 'ac+ad+bc+bd'];
  const STAGE_TXT = ['看成一个大长方形', '竖着切一刀：两个长方形', '再横着切一刀：四个小长方形'];
  g.onUpdate = () => {
    const r = (v) => fmt(v, 1);
    $('cutK').textContent = STAGE_TXT[s.stage];
    $('cutTex').innerHTML = `$${STAGE_TEX[s.stage]}$`;
    $('cutNum').innerHTML = `$a=${r(s.a)}$，$b=${r(s.b)}$，$c=${r(s.c)}$，$d=${r(s.d)}$：$(${r(W())})\\times(${r(H())})=${fmt(W() * H())}$；$${fmt(s.a * s.c)}+${fmt(s.a * s.d)}+${fmt(s.b * s.c)}+${fmt(s.b * s.d)}=${fmt(s.a * s.c + s.a * s.d + s.b * s.c + s.b * s.d)}$`;
    $('cutGo').textContent = s.stage < 2 ? (s.stage === 0 ? '竖着切一刀' : '横着再切一刀') : '拼回去';
    tex($('cutRead'));
  };
  ['a', 'b', 'c', 'd'].forEach((k) => slider($(`cut${k.toUpperCase()}`), (v) => { s[k] = v; $(`cut${k.toUpperCase()}V`).textContent = fmt(v); g.update(); }));
  $('cutGo').addEventListener('click', () => { s.stage = (s.stage + 1) % 3; g.update(); });
}

/* ---------- 第 5 页：格子表。rows/cols 为两个多项式的项，cells[i][j] = [乘积, 同类项组号] ---------- */
const BOXES = {
  e1: { title: '(x+2)(x-3)', rows: ['x', '+2'], cols: ['x', '-3'], cells: [[['x^2', 1], ['-3x', 2]], [['+2x', 2], ['-6', 3]]], res: 'x^2-3x+2x-6=x^2-x-6' },
  e2: { title: '(3x-1)(x-2)', rows: ['3x', '-1'], cols: ['x', '-2'], cells: [[['3x^2', 1], ['-6x', 2]], [['-x', 2], ['+2', 3]]], res: '3x^2-6x-x+2=3x^2-7x+2' },
  e3: { title: '(3m+n)(m-2n)', rows: ['3m', '+n'], cols: ['m', '-2n'], cells: [[['3m^2', 1], ['-6mn', 2]], [['+mn', 2], ['-2n^2', 3]]], res: '3m^2-6mn+mn-2n^2=3m^2-5mn-2n^2' },
};

function initBox() {
  const s = { key: 'e1', merged: false };
  const render = () => {
    const B = BOXES[s.key];
    const head = `<tr><th>$\\times$</th>${B.cols.map((c) => `<th>$${c}$</th>`).join('')}</tr>`;
    const body = B.rows.map((r, i) => `<tr><th class="r">$${r}$</th>${B.cells[i].map(([t, k]) => `<td class="k${k}"><span>$${t}$</span></td>`).join('')}</tr>`).join('');
    $('boxTab').innerHTML = head + body;
    $('boxTab').classList.toggle('merged', s.merged);
    $('boxRes').innerHTML = s.merged ? `$${B.title}=${B.res}$` : `$${B.title}=\\ ?$`;
    $('boxMerge').textContent = s.merged ? '取消上色' : '同类项上色，合并';
    $('boxPick').querySelectorAll('[data-box]').forEach((b) => b.classList.toggle('solid', b.dataset.box === s.key));
    tex($('boxWrap'));
  };
  $('boxTab').addEventListener('click', (e) => { const td = e.target.closest('td'); if (td) td.classList.add('on'); });
  $('boxAll').addEventListener('click', () => $('boxTab').querySelectorAll('td').forEach((td) => td.classList.add('on')));
  $('boxMerge').addEventListener('click', () => {
    s.merged = !s.merged;
    render();
    $('boxTab').querySelectorAll('td').forEach((td) => td.classList.add('on'));
  });
  $('boxPick').addEventListener('click', (e) => {
    const b = e.target.closest('[data-box]');
    if (!b) return;
    s.key = b.dataset.box;
    s.merged = false;
    render();
  });
  render();
}

/* ---------- 第 9 页：长、宽各截去 2 cm ---------- */
const CUT = 2;
function initTrim() {
  const s = { a: 8, b: 6 };
  const g = board($('trimBoard'), { x: [-1.2, 10.4], y: [-1.2, 8.4], axes: false, grid: false, w: 560 });
  const rect = (x0, x1, y0, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
  // 长沿横向截去右边 2，宽沿纵向截去上边 2
  g.poly(() => rect(s.a - CUT, s.a, 0, s.b), { cls: 'cutaway' });
  g.poly(() => rect(0, s.a, s.b - CUT, s.b), { cls: 'cutaway' });
  g.poly(() => rect(s.a - CUT, s.a, s.b - CUT, s.b), { cls: 'corner' });
  g.poly(() => rect(0, s.a - CUT, 0, s.b - CUT), { cls: 'keep' });
  g.text(() => [s.a / 2, s.b], 'a', { dy: -10 });
  g.text(() => [0, s.b / 2], 'b', { dx: -20, dy: 6 });
  g.text(() => [s.a - CUT / 2, 0], '2', { cls: 'lb up c', dy: 22 });
  g.text(() => [s.a, s.b - CUT / 2], '2', { cls: 'lb up', dx: 8, dy: 6 });
  g.text(() => [(s.a - CUT) / 2, (s.b - CUT) / 2], '(a−2)(b−2)', { cls: 'lb c', dy: 8 });
  g.onUpdate = () => {
    const keep = (s.a - CUT) * (s.b - CUT);
    $('trimNum').innerHTML = `$a=${s.a}$，$b=${s.b}$：$(${s.a}-2)(${s.b}-2)=${keep}$；$${s.a}\\times${s.b}-2\\times${s.a}-2\\times${s.b}+4=${s.a * s.b - 2 * s.a - 2 * s.b + 4}$`;
    tex($('trimNum'));
  };
  slider($('trimA'), (v) => { s.a = v; $('trimAV').textContent = v; g.update(); });
  slider($('trimB'), (v) => { s.b = v; $('trimBV').textContent = v; g.update(); });
}

window.LESSON = {
  init() {
    initCut();
    initBox();
    initTrim();
  },
};
