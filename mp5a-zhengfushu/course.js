'use strict';
/* 五上 认识正数和负数 · 本课互动：例 1 三支温度计、可拖动温度计（核心）、海拔按比例作图、正负数分一分、
 * 练习一第 4 题拖温度计。温度计刻度与课本一致：每大格 10℃，每小格 2℃。拖动用 ../shared/mgrid.js 的 MGrid.drag */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const mk = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const sign = (v) => (v > 0 ? `+${v}` : v < 0 ? `−${-v}` : '0'); // 课本用长减号
const DIG = '零一二三四五六七八九';
const cn = (n) => { // 0–99 的读法
  if (n < 10) return DIG[n];
  const [t, u] = [Math.floor(n / 10), n % 10];
  return `${t === 1 ? '' : DIG[t]}十${u ? DIG[u] : ''}`;
};
const readOf = (v) => (v > 0 ? `正${cn(v)}` : v < 0 ? `负${cn(-v)}` : '零');

/* ---------- 温度计 ---------- */
// o: { min, max, v, h（高）, drag: 是否可拖, onChange(v) }
function thermo(svg, o) {
  const W = 130;
  const H = o.h || 320;
  const top = 26;
  const bot = H - 66;
  const cx = 74;
  const Y = (v) => bot - ((v - o.min) / (o.max - o.min)) * (bot - top);
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  mk('rect', { x: cx - 11, y: top - 14, width: 22, height: bot - top + 40, rx: 11, class: 't-tube' }, svg);
  for (let v = o.min; v <= o.max; v += 2) {
    const major = v % 10 === 0;
    mk('line', { x1: cx + 11, x2: cx + (major ? 26 : 19), y1: Y(v), y2: Y(v), class: major ? 't-tk major' : 't-tk' }, svg);
    if (major) mk('text', { x: cx - 18, y: Y(v) + 6, class: v === 0 ? 't-lb zero' : 't-lb' }, svg).textContent = Math.abs(v); // 和真实温度计一样：0 下面的刻度也不写“−”
  }
  mk('text', { x: cx - 18, y: top - 18, class: 't-lb unit' }, svg).textContent = '℃';
  const col = mk('rect', { x: cx - 5, width: 10, class: 't-col' }, svg);
  mk('circle', { cx, cy: H - 36, r: 20, class: 't-bulb' }, svg);
  const st = { v: o.v };
  const set = (v) => {
    st.v = Math.max(o.min, Math.min(o.max, v));
    col.setAttribute('y', Y(st.v).toFixed(1));
    col.setAttribute('height', (H - 36 - Y(st.v)).toFixed(1));
    if (o.onChange) o.onChange(st.v);
  };
  if (o.drag) {
    const handle = mk('rect', { x: 0, y: 0, width: W, height: H, class: 't-hit' }, svg);
    MGrid.drag(svg, handle, ([, y]) => set(Math.round(o.min + ((bot - y) / (bot - top)) * (o.max - o.min))));
  }
  set(o.v);
  return { set, get: () => st.v };
}

/* ---------- 第 4 页：可拖动温度计 + 任务 ---------- */
const TASKS = [
  { q: '把温度调到<b>零下 5℃</b>。', v: -5 },
  { q: '把温度调到 <b>+15℃</b>。', v: 15 },
  { q: '把温度调到 <b>−12℃</b>。', v: -12 },
  { q: '调到一个<b>既不是零上、也不是零下</b>的温度。', v: 0 },
  { q: '调到比 0℃ <b>低 20℃</b> 的温度。', v: -20 },
];
function initBig() {
  let k = 0;
  let wait = false;
  const showTask = () => {
    $('taskQ').innerHTML = k < TASKS.length ? `任务 ${k + 1}/${TASKS.length}：${TASKS[k].q}` : '任务全部完成！你能自己出一道题考考同桌吗？';
    $('taskOk').textContent = '';
  };
  const onChange = (v) => {
    const word = v > 0 ? `零上 ${v}℃` : v < 0 ? `零下 ${-v}℃` : '0℃';
    $('tRead').innerHTML = `<p class="t-word ${v > 0 ? 'pos' : v < 0 ? 'neg' : ''}">${word}</p>`
      + `<p>记作：<b class="${v > 0 ? 'pos' : v < 0 ? 'neg' : ''}">${sign(v)}℃</b></p>`
      + `<p>读作：<b>${readOf(v)}</b>摄氏度</p>`;
    if (wait || k >= TASKS.length || v !== TASKS[k].v) return;
    wait = true;
    $('taskOk').textContent = `✓ 对了！${sign(v)}℃`;
    setTimeout(() => { k += 1; wait = false; showTask(); }, 1300);
  };
  showTask();
  thermo($('tBig'), { min: -30, max: 40, v: 20, h: 470, drag: true, onChange });
}

/* ---------- 第 5 页：海拔（按比例：1000 米 = 30 像素；放大框 20 倍） ---------- */
function initSea() {
  const svg = $('seaFig');
  const k = 0.03;
  const sea = 300;
  const Y = (m) => sea - m * k;
  // 标尺
  mk('line', { x1: 50, y1: Y(9000), x2: 50, y2: Y(-1000), class: 's-rule' }, svg);
  for (let m = -1000; m <= 9000; m += 1000) {
    mk('line', { x1: 44, x2: 56, y1: Y(m), y2: Y(m), class: 's-rule' }, svg);
    if (m % 2000 === 0 || m === -1000) mk('text', { x: 40, y: Y(m) + 5, class: 's-lb end' }, svg).textContent = m < 0 ? `−${-m}` : m;
  }
  mk('text', { x: 52, y: Y(9000) - 10, class: 's-lb' }, svg).textContent = '海拔/米';
  // 海水与陆地
  mk('rect', { x: 380, y: sea, width: 80, height: 70, class: 's-water' }, svg);
  const peak = [170, Y(8848.86)];
  const low = [300, Y(-155)];
  mk('path', { d: `M90 ${sea}L120 ${Y(4200)}L140 ${Y(5100)}L${peak[0]} ${peak[1]}L195 ${Y(6500)}L215 ${Y(5600)}L250 ${sea}L${low[0]} ${low[1]}L345 ${Y(600)}L380 ${sea}V370H90Z`, class: 's-land' }, svg);
  mk('line', { x1: 50, x2: 460, y1: sea, y2: sea, class: 's-sea' }, svg);
  mk('text', { x: 456, y: sea - 8, class: 's-lb end' }, svg).textContent = '海平面 0 米';
  mk('line', { x1: 50, x2: peak[0], y1: peak[1], y2: peak[1], class: 's-dash' }, svg);
  mk('circle', { cx: peak[0], cy: peak[1], r: 5, class: 's-pt pos' }, svg);
  mk('text', { x: peak[0] + 12, y: peak[1] + 6, class: 's-lb pos' }, svg).textContent = '珠穆朗玛峰 +8848.86';
  mk('circle', { cx: low[0], cy: low[1], r: 4, class: 's-pt neg' }, svg);
  mk('text', { x: 300, y: 352, class: 's-lb neg mid' }, svg).textContent = '吐鲁番盆地';
  // 放大框：盆地附近放大 20 倍
  const bx = { x: 250, y: 90, w: 200, h: 150 };
  const z = k * 20;
  const zy = (m) => bx.y + 50 - m * z;
  const zx = (x) => bx.x + 10 + (x - 250) * 1.8;
  mk('rect', { x: bx.x, y: bx.y, width: bx.w, height: bx.h, class: 's-box' }, svg);
  const clip = mk('clipPath', { id: 'seaClip' }, mk('defs', {}, svg));
  mk('rect', { x: bx.x, y: bx.y, width: bx.w, height: bx.h }, clip);
  const gz = mk('g', { 'clip-path': 'url(#seaClip)' }, svg);
  mk('path', { d: `M${zx(250)} ${zy(0)}L${zx(300)} ${zy(-155)}L${zx(345)} ${zy(600)}V${bx.y + bx.h}H${zx(250)}Z`, class: 's-land' }, gz);
  mk('line', { x1: bx.x, x2: bx.x + bx.w, y1: zy(0), y2: zy(0), class: 's-sea' }, gz);
  mk('line', { x1: bx.x + 4, x2: zx(300), y1: zy(-155), y2: zy(-155), class: 's-dash' }, gz);
  mk('circle', { cx: zx(300), cy: zy(-155), r: 5, class: 's-pt neg' }, gz);
  mk('text', { x: bx.x + 6, y: zy(0) - 6, class: 's-lb sm' }, gz).textContent = '0';
  mk('text', { x: bx.x + 6, y: zy(-155) - 6, class: 's-lb sm neg' }, gz).textContent = '−155';
  mk('text', { x: bx.x + bx.w - 6, y: bx.y + 18, class: 's-lb sm end' }, svg).textContent = '放大 20 倍';
  mk('line', { x1: low[0], y1: low[1], x2: zx(300), y2: bx.y + bx.h, class: 's-zl' }, svg);
}

/* ---------- 第 7 页：分一分 ---------- */
const NUMS = [['−5', 'neg'], ['+26', 'pos'], ['8', 'pos'], ['−40', 'neg'], ['−120', 'neg'], ['+103', 'pos'], ['0', 'zero']];
const WHY = {
  pos: '前面有“+”或者省略了“+”，是正数。',
  neg: '前面有“−”，是负数。',
  zero: '0 既不是正数，也不是负数。',
};
function initSort() {
  const box = $('sortChips');
  let cur = null;
  NUMS.forEach(([t, kind]) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip snum';
    b.textContent = t;
    b.dataset.kind = kind;
    box.appendChild(b);
  });
  box.addEventListener('click', (e) => {
    const b = e.target.closest('.snum');
    if (!b) return;
    if (cur) cur.classList.remove('sel');
    cur = b === cur ? null : b;
    if (cur) cur.classList.add('sel');
  });
  $('sortBoxes').addEventListener('click', (e) => {
    const target = e.target.closest('.sbox');
    if (!target || !cur) return;
    const ok = cur.dataset.kind === target.dataset.k;
    const say = $('sortSay');
    if (ok) {
      cur.classList.remove('sel');
      cur.classList.add('done');
      target.querySelector('.got').appendChild(cur);
      say.innerHTML = `✓ ${cur.textContent}：${WHY[cur.dataset.kind]}`;
      cur = null;
      if (!box.querySelector('.snum')) say.innerHTML = '全部分好了！正数：+26、8、+103；负数：−5、−40、−120；0 两个圈都不放。';
    } else {
      target.classList.add('shake');
      setTimeout(() => target.classList.remove('shake'), 500);
      say.innerHTML = `✗ 再想想：${cur.textContent} ${WHY[cur.dataset.kind].replace('，是', '，应该是')}`;
    }
  });
}

/* ---------- 第 9 页：练习一第 4 题 ---------- */
function initFour() {
  document.querySelectorAll('.thermo-m').forEach((svg) => {
    const target = +svg.dataset.target;
    const mark = svg.parentNode.querySelector('.ok-mark');
    thermo(svg, {
      min: -20, max: 50, v: 0, h: 330, drag: true,
      onChange: (v) => { mark.textContent = v === target ? '✓' : `${sign(v)}℃`; mark.classList.toggle('ok', v === target); },
    });
    mark.textContent = ''; // 还没拖时不显示读数
  });
}

window.LESSON = {
  init() {
    thermo($('tNJ'), { min: -40, max: 40, v: 0 });
    thermo($('tSY'), { min: -40, max: 40, v: 20 });
    thermo($('tHE'), { min: -40, max: 40, v: -20 });
    initBig();
    initSea();
    initSort();
    initFour();
  },
};
