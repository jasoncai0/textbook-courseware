'use strict';
/* 五上 小数乘小数 · 本课互动：估算框、面积图（按 0.1 米分格，数 0.01 平方米的小方格）、乘法竖式逐步演示、点小数点。
 * 面积图按真实比例绘制：1 米 = 100 个 viewBox 单位，0.1 米 = 10 个单位；所有数值用“十分之几米”的整数计算。 */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent, text) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (text !== undefined) e.textContent = text;
  if (parent) parent.appendChild(e);
  return e;
};
const M = 100; // 1 米对应的单位数
const dec = (tenths) => MDec.move(String(tenths), -1);

/* ---------- 第 3 页：估一估 ---------- */
function initEstimate() {
  const s = $('estFig');
  const x0 = 40;
  const y0 = 30;
  svgEl('rect', { x: x0, y: y0, width: 3.8 * M, height: 3.2 * M, class: 'est-room' }, s);
  svgEl('text', { x: x0 + 1.9 * M, y: y0 + 1.6 * M + 8, class: 'est-t' }, s, '房间 3.8 × 3.2');
  const g1 = svgEl('g', { 'data-step': 1 }, s);
  svgEl('rect', { x: x0, y: y0, width: 4 * M, height: 3.2 * M, class: 'est-big' }, g1);
  svgEl('text', { x: x0 + 4 * M - 4, y: y0 - 8, class: 'est-t o end' }, g1, '4 × 3.2 = 12.8（大了）');
  const g2 = svgEl('g', { 'data-step': 2 }, s);
  svgEl('rect', { x: x0, y: y0, width: 3.8 * M, height: 3 * M, class: 'est-small' }, g2);
  svgEl('text', { x: x0 + 4, y: y0 + 3.2 * M + 30, class: 'est-t g start' }, g2, '3.8 × 3 = 11.4（小了）');
  svgEl('text', { x: x0 - 8, y: y0 + 1.6 * M, class: 'est-t end' }, s, '3.2');
  svgEl('text', { x: x0 + 1.9 * M, y: y0 + 3.2 * M + 62, class: 'est-t' }, s, '3.8 米');
}

/* ---------- 第 4 页：面积图 ---------- */
function initAreaGrid() {
  const s = $('agFig');
  const st = { L: 38, W: 32, mode: 'grid' }; // 单位：十分之一米
  const X0 = 50;
  const Y0 = 20;
  const draw = () => {
    const { L, W } = st;
    const w = L * 10;
    const h = W * 10;
    s.innerHTML = '';
    // 4 米 × 4 米的底板，标出整米刻度
    svgEl('rect', { x: X0, y: Y0, width: 4 * M, height: 4 * M, class: 'ag-board' }, s);
    for (let m = 0; m <= 4; m += 1) {
      svgEl('text', { x: X0 + m * M, y: Y0 + 4 * M + 22, class: 'ag-tk' }, s, `${m}`);
      svgEl('text', { x: X0 - 12, y: Y0 + m * M + 6, class: 'ag-tk end' }, s, `${m}`);
    }
    const a = Math.floor(L / 10);
    const b = Math.floor(W / 10);
    const fa = L % 10;
    const fb = W % 10;
    if (st.mode === 'part') {
      svgEl('rect', { x: X0, y: Y0, width: a * M, height: b * M, class: 'ag-p1' }, s);
      svgEl('rect', { x: X0 + a * M, y: Y0, width: fa * 10, height: b * M, class: 'ag-p2' }, s);
      svgEl('rect', { x: X0, y: Y0 + b * M, width: a * M, height: fb * 10, class: 'ag-p2' }, s);
      svgEl('rect', { x: X0 + a * M, y: Y0 + b * M, width: fa * 10, height: fb * 10, class: 'ag-p3' }, s);
    } else {
      svgEl('rect', { x: X0, y: Y0, width: w, height: h, class: 'ag-fill' }, s);
    }
    // 0.1 米细线、1 米粗线（只画在长方形里）
    let d = '';
    for (let i = 1; i < L; i += 1) if (i % 10) d += `M${X0 + i * 10} ${Y0}v${h}`;
    for (let j = 1; j < W; j += 1) if (j % 10) d += `M${X0} ${Y0 + j * 10}h${w}`;
    svgEl('path', { d, class: 'ag-thin' }, s);
    let D = '';
    for (let i = 10; i < L; i += 10) D += `M${X0 + i * 10} ${Y0}v${h}`;
    for (let j = 10; j < W; j += 10) D += `M${X0} ${Y0 + j * 10}h${w}`;
    svgEl('path', { d: D, class: 'ag-bold' }, s);
    svgEl('rect', { x: X0, y: Y0, width: w, height: h, class: 'ag-edge' }, s);
    const n = L * W; // 小方格个数 = 面积里有几个 0.01 平方米
    const area = MDec.move(String(n), -2);
    $('agLv').textContent = dec(L);
    $('agWv').textContent = dec(W);
    if (st.mode === 'grid') {
      $('agRead').innerHTML = `长：${L} 个 0.1 米　宽：${W} 个 0.1 米<br>小方格：${L} × ${W} = <b>${n}</b> 个<br>面积：${n} 个 0.01 平方米 = <b>${area}</b> 平方米`;
    } else {
      const strips = a * fb + fa * b;
      $('agRead').innerHTML = `<span class="k1">■</span> 整平方米：${a} × ${b} = ${a * b} 个 → ${a * b}<br>`
        + `<span class="k2">■</span> 0.1 平方米的长条：${a} × ${fb} + ${fa} × ${b} = ${strips} 条 → ${dec(strips)}<br>`
        + `<span class="k3">■</span> 0.01 平方米的小方格：${fa} × ${fb} = ${fa * fb} 个 → ${MDec.move(String(fa * fb), -2)}<br>`
        + `合起来：<b>${area}</b> 平方米`;
    }
  };
  MathKit.slider($('agL'), (v) => { st.L = v; draw(); });
  MathKit.slider($('agW'), (v) => { st.W = v; draw(); });
  $('agMode').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-m]');
    if (!btn) return;
    st.mode = btn.dataset.m;
    $('agMode').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    draw();
  });
}

/* ---------- 第 8 页：点小数点 ---------- */
function initDots() {
  document.querySelectorAll('.dotq').forEach((el) => {
    const { a, b } = el.dataset;
    const p = (a.split('.')[1] || '').length + (b.split('.')[1] || '').length;
    const prod = String(+a.replace('.', '') * +b.replace('.', ''));
    const host = document.createElement('div');
    host.className = 'mini-v';
    host.dataset.rows = `${a}|×${b}|${prod}`;
    host.dataset.ul = '1';
    const msg = document.createElement('p');
    msg.className = 'dot-msg';
    msg.textContent = '点一个数字，小数点就点在它的右下角';
    el.append(host, msg);
    el.setAttribute('data-noswipe', '');
    MDec.mini(host);
    const digits = [...host.querySelectorAll('.md-c')].filter((c) => c.style.gridRow === '3' && !c.classList.contains('ul'));
    const want = digits.length - 1 - p; // 小数点画在这一位的右边
    digits.forEach((c, i) => {
      c.classList.add('dig');
      c.addEventListener('click', () => {
        digits.forEach((x) => x.classList.remove('pt', 'ok', 'no'));
        c.classList.add('pt', i === want ? 'ok' : 'no');
        const got = `${prod.slice(0, i + 1)}.${prod.slice(i + 1)}`;
        msg.innerHTML = i === want
          ? `✓ 一共 ${p} 位小数：${got}${/0$/.test(got) ? ` = <b>${MDec.move(prod, -p)}</b>` : ''}`
          : `✗ 两个因数一共有几位小数？从积的右边数一数（你点出了 ${prod.length - 1 - i} 位）`;
        msg.className = `dot-msg ${i === want ? 'ok' : 'no'}`;
      });
    });
  });
}

function initPractice() {
  const show = (btn) => {
    $('vPick').querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', b === btn));
    MDec.mul($('v3'), btn.dataset.a, btn.dataset.b);
  };
  $('vPick').addEventListener('click', (e) => { const b = e.target.closest('[data-a]'); if (b) show(b); });
  show($('vPick').querySelector('[data-a]'));
}

window.LESSON = {
  init() {
    initEstimate();
    initAreaGrid();
    MDec.mul($('v1'), '3.8', '3.2', { notes: { A: '× 10 → 38', B: '× 10 → 32', P: '1216 ÷ 100' } });
    MDec.mul($('v2'), '1.15', '3.2', { notes: { A: '× 100 → 115', B: '× 10 → 32', P: '3680 ÷ 1000' } });
    initDots();
    initPractice();
  },
};
