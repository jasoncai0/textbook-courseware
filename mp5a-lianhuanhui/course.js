'use strict';
/* 五上 综合与实践《班级联欢会》· 本课互动：调查结果条形图（按人数精确画）、商店单价表、购物方案计算器。
 * 金额一律以“分”为单位做整数运算，数量以 0.5 千克等小数时乘 10 再算，避免小数误差。 */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const CLASS_SIZE = 40;
const BUDGET = 20000; // 分
const yuan = (fen) => String(+(fen / 100).toFixed(2));

/* 示例单价（分）。step 为数量每次加减多少（×10 存储，0.5 千克 = 5） */
const ITEMS = [
  { name: '拉花', unit: '条', opts: [['①', 250], ['②', 380]], q10: 80, step: 10 },
  { name: '气球', unit: '个', opts: [['①', 40], ['②', 35]], q10: 500, step: 100 },
  { name: '苹果', unit: '千克', opts: [['①', 680], ['②', 750]], q10: 65, step: 5 },
  { name: '香蕉', unit: '千克', opts: [['①', 460], ['②', 520]], q10: 50, step: 5 },
  { name: '果汁', unit: '瓶', opts: [['①', 350], ['②', 320]], q10: 200, step: 10 },
  { name: '文具', unit: '个', opts: [['①', 470], ['②', 600]], q10: 40, step: 10 },
];
const qty = (q10) => String(q10 / 10);

/* 第 4 页：调查结果 */
const VOTES = [
  ['水果', [['苹果', 15], ['梨', 6], ['香蕉', 13], ['其他', 6]]],
  ['饮料', [['矿泉水', 8], ['果汁', 18], ['奶茶', 10], ['其他', 4]]],
  ['奖品', [['书籍', 9], ['文具', 16], ['玩具', 11], ['其他', 4]]],
];
function initVotes() {
  const s = $('voteBars');
  const [x0, w, max] = [150, 360, 20];
  let y = 8;
  VOTES.forEach(([q, opts], qi) => {
    svgEl('text', { x: 6, y: y + 14, class: 'vq' }, s).textContent = q;
    const top = Math.max(...opts.map((o) => o[1]));
    opts.forEach(([n, v]) => {
      svgEl('text', { x: x0 - 8, y: y + 16, class: 'vn' }, s).textContent = n;
      svgEl('rect', { x: x0, y: y + 4, width: (w * v) / max, height: 15, class: `vb q${qi} ${v === top ? 'top' : ''}` }, s);
      svgEl('text', { x: x0 + (w * v) / max + 6, y: y + 16, class: 'vv' }, s).textContent = `${v} 人`;
      y += 22;
    });
    y += 8;
  });
}

/* 第 5 页：单价表 */
function initPrices() {
  const head = '<tr><th>物品名称</th><th></th><th>单价/元</th><th>物品名称</th><th></th><th>单价/元</th><th>物品名称</th><th></th><th>单价/元</th></tr>';
  const cell = (it) => it.opts.map(([k, p], i) => `${i === 0 ? `<th rowspan="2">${it.name}</th>` : ''}<td>${k}</td><td>${(p / 100).toFixed(2)}<small>/${it.unit}</small></td>`);
  const rows = [0, 3].map((s) => [0, 1].map((r) => `<tr>${[0, 1, 2].map((c) => cell(ITEMS[s + c])[r]).join('')}</tr>`).join('')).join('');
  $('priceTab').innerHTML = head + rows;
}

/* 第 6 页：购物方案计算器 */
function initPlan() {
  const st = { pick: ITEMS.map(() => 0), q10: ITEMS.map((it) => it.q10), shown: false };
  const tab = $('planTab');
  const lineFen = (i) => (ITEMS[i].opts[st.pick[i]][1] * st.q10[i]) / 10;
  const render = () => {
    const rows = ITEMS.map((it, i) => `<tr data-i="${i}"><th>${it.name}</th>
      <td class="opt">${it.opts.map(([k, p], j) => `<button type="button" class="btn ${st.pick[i] === j ? 'solid' : ''}" data-o="${j}">${k} ${(p / 100).toFixed(2)}</button>`).join('')}</td>
      <td class="qty"><button type="button" class="btn" data-d="-">−</button><b>${qty(st.q10[i])}</b> ${it.unit}<button type="button" class="btn" data-d="+">＋</button></td>
      <td class="tot">${st.shown ? yuan(lineFen(i)) : '?'}</td></tr>`).join('');
    const total = ITEMS.reduce((s, _, i) => s + lineFen(i), 0);
    tab.innerHTML = `<tr><th>物品</th><th>选哪种（单价/元）</th><th>数量</th><th>总价/元</th></tr>${rows}<tr class="sumrow"><th colspan="3">合计</th><td>${st.shown ? yuan(total) : '?'}</td></tr>`;
    if (!st.shown) { $('perMsg').textContent = ''; return; }
    const est = parseFloat(String($('estIn').value).replace(/[^\d.]/g, ''));
    const diff = Number.isFinite(est) ? Math.abs(est * 100 - total) : null;
    const over = total > BUDGET;
    $('planMsg').className = `tip feedback ${over ? 'fb-warn' : 'fb-ok'}`;
    $('planMsg').innerHTML = `合计 <b>${yuan(total)}</b> 元。${diff === null ? '' : `你估的和实际相差 ${yuan(Math.round(diff))} 元。`}${over ? `超出班费预算 200 元 ${yuan(total - BUDGET)} 元，想办法调整！` : `没有超出班费预算 200 元，还剩 ${yuan(BUDGET - total)} 元。`}`;
    const per = total / CLASS_SIZE / 100;
    const exact = total % CLASS_SIZE === 0;
    $('perMsg').innerHTML = `平均每人：$${yuan(total)}\\div${CLASS_SIZE}${exact ? '=' : '\\approx'}${exact ? String(+per.toFixed(4)) : per.toFixed(2)}$（元）`;
    MathKit.tex($('perMsg'));
  };
  tab.addEventListener('click', (e) => {
    const tr = e.target.closest('tr[data-i]');
    const b = e.target.closest('button');
    if (!tr || !b) return;
    const i = +tr.dataset.i;
    if (b.dataset.o !== undefined) st.pick[i] = +b.dataset.o;
    if (b.dataset.d) st.q10[i] = Math.max(0, st.q10[i] + (b.dataset.d === '+' ? 1 : -1) * ITEMS[i].step);
    render();
  });
  $('calcGo').addEventListener('click', () => { st.shown = true; render(); });
  $('estIn').addEventListener('input', () => { if (st.shown) render(); });
  render();
}

window.LESSON = {
  init() {
    initVotes();
    initPrices();
    initPlan();
  },
};
