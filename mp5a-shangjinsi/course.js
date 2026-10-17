'use strict';
/* 五上 商的近似值 · 本课互动：例 12 竖式除到第三位、海豚/飞鱼竖式切换、例 13 按比例的线段图（300 元里有几个 45 元）、
 * “再除一位”余数追踪器（余数重复 → 商循环，标出循环节）。竖式见 ../shared/mvert.js，数值全部由代码计算。 */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent, txt) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (txt !== undefined) e.textContent = txt;
  if (parent) parent.appendChild(e);
  return e;
};

/* 近似数末尾的 0 不能省：mcheck 按数值比较（0.7 = 0.70），这里对 data-strict 的空再按字面判一次 */
function strictBlanks() {
  document.querySelectorAll('.blank[data-strict]').forEach((el) => {
    const inp = el.querySelector('input');
    const judge = () => {
      const v = inp.value.trim().replace(/[．。]/g, '.');
      if (!v) return;
      if (el.dataset.ans.split('|').includes(v)) return;
      el.classList.remove('ok');
      el.classList.add('no');
    };
    inp.addEventListener('change', judge);
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') judge(); });
  });
}

/* ---------- 第 3 页：例 12 ---------- */
function initV12() {
  const m = MVert.div('#v12', '40', '60', { places: 3, start: 0 });
  const say = ['40 ÷ 60：40 比 60 小，商的个位写 0，点上小数点。', '400 里有 6 个 60，商 6，余 40。', '余 40，添 0 再除：又商 6，余数还是 40……', '已经除到第三位（千分位）了，看它是 6：满 5 进 1，0.666 ≈ 0.67。'];
  MVert.bind(m, $('v12p'), $('v12n'), (n) => { $('v12say').textContent = say[n]; });
}

/* ---------- 第 4 页：海豚 / 飞鱼 ---------- */
function initCmp() {
  const show = (k) => MVert.div('#vcmp', ['50', '64'][k], '60', { places: 3 });
  $('cmpPick').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    $('cmpPick').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    show(+btn.dataset.k);
  });
  show(0);
}

/* ---------- 第 5 页：300 元里有几个 45 元（1 元 = 3 个单位长） ---------- */
function initBalls() {
  const svg = $('ballFig');
  const [x0, u, price, total] = [40, 3, 45, 300];
  const n = Math.floor(total / price);
  for (let i = 0; i < n; i += 1) {
    const x = x0 + i * price * u;
    svgEl('rect', { x, y: 40, width: price * u, height: 50, class: 'bf-seg' }, svg);
    svgEl('circle', { cx: x + (price * u) / 2, cy: 65, r: 17, class: 'bf-ball' }, svg);
    svgEl('text', { x: x + (price * u) / 2, y: 118, class: 'bf-t' }, svg, '45 元');
    svgEl('text', { x: x + (price * u) / 2, y: 30, class: 'bf-n' }, svg, `第 ${i + 1} 个`);
  }
  const xr = x0 + n * price * u;
  const rest = total - n * price;
  svgEl('rect', { x: xr, y: 40, width: rest * u, height: 50, class: 'bf-rest' }, svg);
  svgEl('text', { x: xr + (rest * u) / 2, y: 118, class: 'bf-t red' }, svg, `剩 ${rest} 元`);
  svgEl('rect', { x: xr, y: 40, width: price * u, height: 50, class: 'bf-ghost' }, svg);
  svgEl('text', { x: xr + (price * u) / 2 + 30, y: 30, class: 'bf-n red' }, svg, '第 7 个？不够');
  svgEl('path', { d: `M${x0} 140H${x0 + total * u}M${x0} 132V148M${x0 + total * u} 132V148`, class: 'bf-ax' }, svg);
  svgEl('text', { x: x0 + (total * u) / 2, y: 146, class: 'bf-t' }, svg, '300 元');
}

/* ---------- 第 7 页：余数追踪器 ---------- */
const CY = [[14, 16], [5, 3], [14, 37], [25, 22]];
function initCycle() {
  const st = { k: 0, n: 0 };
  const calc = () => {
    const [a, b] = CY[st.k];
    const ip = Math.floor(a / b);
    let r = a % b;
    const digits = [];
    const rems = [r];
    let cyc = null;
    for (let i = 0; i < st.n; i += 1) {
      if (r === 0) break;
      digits.push(Math.floor((r * 10) / b));
      r = (r * 10) % b;
      const seen = rems.indexOf(r);
      rems.push(r);
      if (seen >= 0 && r !== 0 && !cyc) cyc = [seen, rems.length - 1]; // 第 seen 位小数起开始重复
    }
    return { a, b, ip, digits, rems, r, cyc };
  };
  const draw = () => {
    const { a, b, ip, digits, rems, r, cyc } = calc();
    const ds = digits.map((d, i) => `<span class="${cyc && i >= cyc[0] && i < cyc[1] ? 'cyc' : ''}">${d}</span>`).join('');
    $('cyQ').innerHTML = `<span class="cy-eq">${a} ÷ ${b} = </span><span class="cy-num">${ip}${digits.length ? '.' : ''}${ds}${cyc || (r && digits.length) ? '<span class="dots">…</span>' : ''}</span>`;
    $('cyRem').innerHTML = rems.map((x, i) => `<span class="rem${cyc && (i === cyc[0] || i === cyc[1]) ? ' hit' : ''}${x === 0 ? ' zero' : ''}">${x}</span>`).join('<i>→</i>');
    const done = r === 0 && st.n > 0;
    let say = '按“再除一位”，看看商和余数怎样变化。';
    if (st.n) say = `已经除到第 ${digits.length} 位小数，余数是 ${r}。`;
    if (done) say = `余数是 0，除尽了！${a} ÷ ${b} = ${ip}.${digits.join('')}，是有限小数。`;
    if (cyc) {
      const sec = digits.slice(cyc[0], cyc[1]).join('');
      say = `余数 ${rems[cyc[1]]} 又出现了！后面的商会重复“${sec}”——循环节是 ${sec}。`;
    }
    $('cySay').textContent = say;
    $('cyGo').disabled = done || (cyc && digits.length >= cyc[1] + (cyc[1] - cyc[0]));
  };
  $('cyGo').addEventListener('click', () => { st.n += 1; draw(); });
  $('cyReset').addEventListener('click', () => { st.n = 0; draw(); });
  $('cyPick').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    $('cyPick').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    Object.assign(st, { k: +btn.dataset.k, n: 0 });
    draw();
  });
  draw();
}

window.LESSON = {
  init() {
    strictBlanks();
    initV12();
    initCmp();
    initBalls();
    initCycle();
  },
};
