'use strict';
/* 六下 选择列表、假设等策略解决问题 · 本课互动：点船换船（大船 5 座 / 小船 3 座，人数按座位累加）、鸡兔按步骤画腿（腿数按画出的线条计数）。 */
const { tex } = MathKit;
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const setMsg = (el, ok, html) => {
  el.className = `tip feedback ${ok ? 'fb-ok' : 'fb-warn'}`;
  el.innerHTML = html;
  tex(el);
};

/* 第 3 页：10 只船 */
const BOATS = 10;
const SEATS = { big: 5, small: 3 };
const TOTAL = 42;
function drawBoat(g, x, y, kind) {
  g.innerHTML = '';
  const n = SEATS[kind];
  const w = 104;
  svgEl('rect', { x: x - 4, y: y - 8, width: w + 8, height: 112, fill: 'transparent' }, g); // 点击区
  svgEl('path', { d: `M${x} ${y + 52}H${x + w}L${x + w - 14} ${y + 84}H${x + 14}Z`, fill: kind === 'big' ? '#5aa9e6' : '#f5a65b', stroke: '#2f4b60', 'stroke-width': 2 }, g);
  const gap = w / (n + 1);
  for (let i = 1; i <= n; i += 1) {
    svgEl('circle', { cx: x + i * gap, cy: y + 38, r: 9, fill: '#ffe2b8', stroke: '#2f4b60', 'stroke-width': 1.5 }, g);
  }
  const t = svgEl('text', { x: x + w / 2, y: y + 76, class: 'fl m b', fill: '#fff' }, g);
  t.textContent = kind === 'big' ? '大 5' : '小 3';
}
function initBoats() {
  const svg = $('boats');
  const kinds = Array(BOATS).fill('big');
  const groups = kinds.map((_, i) => {
    const g = svgEl('g', { class: 'boat', role: 'button', tabindex: 0 }, svg);
    g.addEventListener('click', () => { kinds[i] = kinds[i] === 'big' ? 'small' : 'big'; render(); });
    return g;
  });
  const pos = (i) => [12 + (i % 5) * 118, 20 + Math.floor(i / 5) * 140];
  function render() {
    groups.forEach((g, i) => drawBoat(g, ...pos(i), kinds[i]));
    const a = kinds.filter((k) => k === 'big').length;
    const b = BOATS - a;
    const sum = a * SEATS.big + b * SEATS.small;
    $('boatSum').innerHTML = `大船 <b>${a}</b> 只，小船 <b>${b}</b> 只：$${a}\\times5+${b}\\times3=${sum}$（人）`;
    tex($('boatSum'));
    const d = sum - TOTAL;
    setMsg($('boatMsg'), d === 0, d === 0
      ? `<b>✓ 正好 42 人！</b>大船 ${a} 只，小船 ${b} 只。`
      : `比 42 人${d > 0 ? '多' : '少'}了 <b>${Math.abs(d)}</b> 人。${d > 0 ? '再把大船换成小船试试。' : '再把小船换成大船试试。'}`);
  }
  $('boatAllBig').addEventListener('click', () => { kinds.fill('big'); render(); });
  $('boatAllSmall').addEventListener('click', () => { kinds.fill('small'); render(); });
  render();
}

/* 第 6 页：鸡兔同笼按步骤画图 */
const ANIMALS = 8;
const LEGS = 22;
function initChickRabbit() {
  const svg = $('cr');
  let step = 0;
  const cx = (i) => 48 + i * 78;
  const CY = 70;
  const draw = () => {
    svg.innerHTML = '';
    if (step < 1) {
      setMsg($('crMsg'), false, '点“按步骤画”，一步一步来。');
      return;
    }
    let legs = 0;
    for (let i = 0; i < ANIMALS; i += 1) {
      svgEl('circle', { cx: cx(i), cy: CY, r: 26, fill: '#fff', stroke: '#2f4b60', 'stroke-width': 2.5 }, svg);
      if (step >= 2) {
        [-9, 9].forEach((dx) => svgEl('line', { x1: cx(i) + dx, y1: CY + 24, x2: cx(i) + dx * 1.4, y2: CY + 70, stroke: '#2f4b60', 'stroke-width': 3, class: 'leg' }, svg));
        legs += 2;
      }
      if (step >= 3 && i < 3) {
        [-20, 20].forEach((dx) => svgEl('line', { x1: cx(i) + dx, y1: CY + 16, x2: cx(i) + dx * 1.4, y2: CY + 62, stroke: '#d9711c', 'stroke-width': 3, class: 'leg' }, svg));
        legs += 2;
      }
      if (step >= 4) {
        const t = svgEl('text', { x: cx(i), y: CY + 8, class: 'fl m b', fill: i < 3 ? '#d9711c' : '#1d6fa5' }, svg);
        t.textContent = i < 3 ? '兔' : '鸡';
      }
    }
    const counted = svg.querySelectorAll('.leg').length;
    const lines = {
      1: '① 画 8 个圆，表示一共有 8 只动物。',
      2: `② 假设 8 只都是鸡，每只画 2 条腿：一共 ${counted} 条，比 22 条少 <b>${LEGS - counted}</b> 条。`,
      3: `③ 一只兔比一只鸡多 2 条腿：$${LEGS - 2 * ANIMALS}\\div2=3$，给 3 只添上 2 条腿，现在一共 <b>${counted}</b> 条。`,
      4: '④ 鸡有 <b>5</b> 只，兔有 <b>3</b> 只。检验：$5\\times2+3\\times4=22$ ✓',
    };
    setMsg($('crMsg'), step >= 3 && legs === LEGS, lines[step]);
  };
  $('crNext').addEventListener('click', () => { step = Math.min(4, step + 1); draw(); });
  $('crReset').addEventListener('click', () => { step = 0; draw(); });
  draw();
}

window.LESSON = {
  init() {
    initBoats();
    initChickRabbit();
  },
};
