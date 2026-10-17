'use strict';
/* 五上 用列举的策略解决问题（一）· 本课互动：22 根木条围长方形（自动查重）、有序列表生成器（拖动排序 + 查重 + 查漏）、
 * 面积条形图、音乐钟时间轴、荤素搭配表、数正方形。木条根数、面积、时间间隔都由代码按题目数据算出。 */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const HALF = 11; // 长 + 宽 = 22 ÷ 2
const WOOD = '#c98a3e';
const keyOf = (l, w) => `${Math.max(l, w)}×${Math.min(l, w)}`; // 长 3 宽 8 与长 8 宽 3 是同一个长方形
const ALL = [10, 9, 8, 7, 6].map((l) => ({ l, w: HALF - l })); // 课本的有序列举结果

/* 一圈木条：左上角 (x0, y0)，每米 u 像素，每根木条单独画，根数精确 */
function drawSticks(svg, x0, y0, u, l, w) {
  const g = svgEl('g', {}, svg);
  const gap = Math.max(2, u * 0.06);
  const th = Math.max(5, u * 0.16);
  const stick = (x, y, horiz) => svgEl('rect', horiz
    ? { x: x + gap, y: y - th / 2, width: u - 2 * gap, height: th, rx: th / 2, fill: WOOD, stroke: '#8a5a22', 'stroke-width': 1 }
    : { x: x - th / 2, y: y + gap, width: th, height: u - 2 * gap, rx: th / 2, fill: WOOD, stroke: '#8a5a22', 'stroke-width': 1 }, g);
  for (let i = 0; i < l; i += 1) { stick(x0 + i * u, y0, true); stick(x0 + i * u, y0 + w * u, true); }
  for (let j = 0; j < w; j += 1) { stick(x0, y0 + j * u, false); stick(x0 + l * u, y0 + j * u, false); }
  return 2 * (l + w);
}

/* 第 2 页：3×5 方格 */
function initRecall() {
  const g = $('rcGrid');
  for (let i = 0; i < 3; i += 1) for (let j = 0; j < 5; j += 1) svgEl('rect', { x: 47 + j * 25, y: 15 + i * 25, width: 25, height: 25, fill: '#e8f1f8', stroke: '#1d6fa5', 'stroke-width': 1.5 }, g);
}

/* 第 3 页：长 6 宽 5，22 根 */
function initSticks22() {
  const svg = $('sticks22');
  const [x0, y0, u] = [50, 22, 45];
  drawSticks(svg, x0, y0, u, 6, 5);
  svgEl('text', { x: x0 + 3 * u, y: y0 + 5 * u + 30, class: 'fig-lb' }, svg).textContent = '长 6 米（6 根）';
  svgEl('text', { x: x0 + 6 * u + 16, y: y0 + 2.5 * u + 6, class: 'fig-lb st' }, svg).textContent = '宽 5 米（5 根）';
}

/* 第 4 页：随便围，自动查重 */
function initFence() {
  const svg = $('fence');
  const [x0, y0, u] = [24, 24, 32];
  const st = { l: 7, rec: [] };
  const draw = () => {
    svg.innerHTML = '';
    for (let i = 0; i <= 10; i += 1) for (let j = 0; j <= 10; j += 1) svgEl('circle', { cx: x0 + i * u, cy: y0 + j * u, r: 1.6, fill: '#b9c8d5' }, svg);
    const w = HALF - st.l;
    svgEl('rect', { x: x0, y: y0, width: st.l * u, height: w * u, fill: '#dff0d0' }, svg);
    const n = drawSticks(svg, x0, y0, u, st.l, w);
    svgEl('text', { x: x0 + (st.l * u) / 2, y: y0 + w * u + 26, class: 'fig-lb' }, svg).textContent = `${st.l} 米`;
    const side = svgEl('text', { x: x0 + st.l * u + 14, y: y0 + (w * u) / 2 + 6, class: 'fig-lb st halo' }, svg);
    side.textContent = `${w} 米`;
    $('fL').textContent = st.l; $('fW').textContent = w; $('fN').textContent = n; $('fS').textContent = st.l * w;
    $('fenceLv').textContent = `${st.l} 米`;
  };
  const showRec = () => {
    const seen = new Set();
    const html = st.rec.map(({ l, w }) => {
      const k = keyOf(l, w);
      const dup = seen.has(k);
      seen.add(k);
      const same = l < w ? `<small>（就是长 ${w} 宽 ${l}）</small>` : '';
      return `<span class="rchip${dup ? ' dup' : ''}">长 ${l} 宽 ${w}，面积 ${l * w}${same}${dup ? ' <em>重复</em>' : ''}</span>`;
    });
    $('fenceRec').innerHTML = html.length ? html.join('') : '<p class="muted">拖动滑块改变长，再点“记下”。随便试几种！</p>';
    const dups = st.rec.length - seen.size;
    const msg = $('fenceMsg');
    msg.className = `tip feedback${dups ? ' fb-warn' : ''}`;
    msg.innerHTML = st.rec.length
      ? `记了 ${st.rec.length} 次，其中不同的围法 <b>${seen.size}</b> 种${dups ? `，<b>重复 ${dups} 次</b>` : ''}。还有没有漏掉的？`
      : '';
  };
  $('fenceL').addEventListener('input', (e) => { st.l = +e.target.value; draw(); });
  $('fenceAdd').addEventListener('click', () => { st.rec = [...st.rec, { l: st.l, w: HALF - st.l }]; showRec(); });
  $('fenceClr').addEventListener('click', () => { st.rec = []; showRec(); });
  draw();
  showRec();
}

/* 第 5 页：有序列表生成器——拖动排序，自动查顺序、查重复、查遗漏 */
const START_CARDS = [{ l: 7, w: 4 }, { l: 10, w: 1 }, { l: 5, w: 6 }, { l: 6, w: 5 }, { l: 8, w: 3 }];
function initOrderList() {
  const list = $('olist');
  const cardHtml = ({ l, w }) => `<div class="ocard" data-l="${l}" data-w="${w}"><button type="button" class="ox" aria-label="去掉这张">✕</button><p>长 <b>${l}</b> 米</p><p>宽 <b>${w}</b> 米</p><p class="oa">面积 ${l * w}</p></div>`;
  const read = () => [...list.children].map((c) => ({ l: +c.dataset.l, w: +c.dataset.w }));
  const render = (cards) => { list.innerHTML = cards.map(cardHtml).join(''); check(); };
  const check = () => {
    const cards = read();
    const keys = cards.map(({ l, w }) => keyOf(l, w));
    const dupKeys = keys.filter((k, i) => keys.indexOf(k) !== i);
    const ordered = cards.every((c, i) => i === 0 || cards[i - 1].l > c.l);
    const missing = ALL.filter(({ l, w }) => !keys.includes(keyOf(l, w)));
    [...list.children].forEach((c, i) => c.classList.toggle('dup', dupKeys.includes(keys[i])));
    const row = (ok, good, bad) => `<p class="chk ${ok ? 'ok' : 'no'}">${ok ? '✓' : '✗'} ${ok ? good : bad}</p>`;
    const missBtns = missing.map(({ l, w }) => `<button type="button" class="btn addm" data-l="${l}" data-w="${w}">补上 长 ${l} 宽 ${w}</button>`).join('');
    const allOk = ordered && !dupKeys.length && !missing.length;
    $('oChecks').innerHTML = row(ordered, '按长从大到小排好了', '顺序还乱，拖一拖')
      + row(!dupKeys.length, '没有重复', `有重复：${[...new Set(dupKeys)].map((k) => `长 ${k.replace('×', ' 宽 ')}`).join('、')} 出现了两次`)
      + row(!missing.length, '没有遗漏', `有遗漏！${ordered ? '' : '排好顺序就能看出来。'}`)
      + (missing.length && ordered && !dupKeys.length ? `<div class="btns">${missBtns}</div>` : '')
      + (allOk ? '<p class="chk win">🎉 不重复、不遗漏！一共 5 种围法。</p>' : '');
  };
  let drag = null;
  list.addEventListener('pointerdown', (e) => {
    const card = e.target.closest('.ocard');
    if (!card || e.target.closest('.ox')) return;
    drag = card;
    card.classList.add('dragging');
    list.setPointerCapture(e.pointerId);
  });
  list.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const over = document.elementFromPoint(e.clientX, e.clientY)?.closest('.ocard');
    if (!over || over === drag || over.parentNode !== list) return;
    const cards = [...list.children];
    list.insertBefore(drag, cards.indexOf(drag) < cards.indexOf(over) ? over.nextSibling : over);
  });
  const drop = () => { if (!drag) return; drag.classList.remove('dragging'); drag = null; check(); };
  list.addEventListener('pointerup', drop);
  list.addEventListener('pointercancel', drop);
  list.addEventListener('click', (e) => {
    const x = e.target.closest('.ox');
    if (!x) return;
    x.closest('.ocard').remove();
    check();
  });
  $('oChecks').addEventListener('click', (e) => {
    const b = e.target.closest('.addm');
    if (!b) return;
    const add = { l: +b.dataset.l, w: +b.dataset.w };
    render([...read(), add].sort((p, q) => q.l - p.l));
  });
  $('oSort').addEventListener('click', () => render([...read()].sort((p, q) => q.l - p.l)));
  $('oReset').addEventListener('click', () => render(START_CARDS));
  render(START_CARDS);
}

/* 第 6 页：面积条形图（条长 ∝ 面积） */
function initBars() {
  const max = Math.max(...ALL.map(({ l, w }) => l * w));
  $('areaBars').innerHTML = ALL.map(({ l, w }) => {
    const s = l * w;
    return `<div class="brow${s === max ? ' top' : ''}"><span>长 ${l} 宽 ${w}</span><i style="width:${(s / max) * 100}%"></i><b>${s}</b></div>`;
  }).join('');
}

/* 第 8 页：音乐钟，每隔 40 分钟 */
const RING = { start: 9 * 60, step: 40, end: 16 * 60 + 20, shown0: 4, axis: [9 * 60, 16 * 60 + 40] };
const ASK = [13 * 60, 14 * 60 + 40, 15 * 60 + 40, 16 * 60];
const hm = (m) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
function initRing() {
  const svg = $('ring');
  const X = (m) => 40 + ((m - RING.axis[0]) / (RING.axis[1] - RING.axis[0])) * 920;
  let shown = RING.shown0;
  const draw = () => {
    svg.innerHTML = '';
    svgEl('line', { x1: X(RING.axis[0]), x2: X(RING.axis[1]), y1: 70, y2: 70, stroke: '#7d8e9c', 'stroke-width': 3 }, svg);
    for (let h = 9; h <= 16; h += 1) {
      svgEl('line', { x1: X(h * 60), x2: X(h * 60), y1: 62, y2: 78, stroke: '#7d8e9c', 'stroke-width': 2 }, svg);
      svgEl('text', { x: X(h * 60), y: 100, class: 'r-tk' }, svg).textContent = `${h}:00`;
    }
    ASK.forEach((m) => {
      svgEl('line', { x1: X(m), x2: X(m), y1: 36, y2: 70, stroke: '#d9711c', 'stroke-width': 2, 'stroke-dasharray': '4 3' }, svg);
      svgEl('text', { x: X(m), y: m % 60 ? 14 : 30, class: 'r-ask' }, svg).textContent = `${hm(m)}?`;
    });
    for (let k = 0; k < shown; k += 1) {
      const m = RING.start + k * RING.step;
      svgEl('circle', { cx: X(m), cy: 70, r: 9, fill: k < RING.shown0 ? '#1d6fa5' : '#2f7d6b', stroke: '#fff', 'stroke-width': 2 }, svg);
      if (k >= RING.shown0 && m % 60) svgEl('text', { x: X(m), y: 118, class: 'r-new' }, svg).textContent = hm(m);
    }
  };
  $('ringNext').addEventListener('click', () => {
    if (RING.start + shown * RING.step <= RING.end) shown += 1;
    draw();
  });
  $('ringReset').addEventListener('click', () => { shown = RING.shown0; draw(); });
  draw();
}

/* 第 9 页：荤素搭配表 */
const MEAT = ['红烧鱼', '炸鸡腿', '牛排'];
const VEG = ['炒青菜', '烧茄子', '拌黄瓜', '炒包菜'];
function initDish() {
  const t = $('dish');
  t.innerHTML = `<tr><th></th>${VEG.map((v) => `<th>${v}</th>`).join('')}</tr>`
    + MEAT.map((m, i) => `<tr><th>${m}</th>${VEG.map((v, j) => `<td><button type="button" class="dcell" data-i="${i}" data-j="${j}" aria-label="${m}配${v}">?</button></td>`).join('')}</tr>`).join('')
    + `<tr><td colspan="5" class="dcount" id="dcount">已点亮 0 种</td></tr>`;
  t.addEventListener('click', (e) => {
    const b = e.target.closest('.dcell');
    if (!b) return;
    b.classList.toggle('on');
    b.textContent = b.classList.contains('on') ? `${MEAT[b.dataset.i].slice(-1)}＋${VEG[b.dataset.j].slice(-1)}` : '?';
    $('dcount').textContent = `已点亮 ${t.querySelectorAll('.dcell.on').length} 种`;
  });
}

/* 第 10 页：3×3 方格数正方形，按大小逐个高亮 */
function initSq9() {
  const svg = $('sq9');
  const [x0, y0, c] = [52, 8, 44];
  for (let i = 0; i < 3; i += 1) for (let j = 0; j < 3; j += 1) svgEl('rect', { x: x0 + j * c, y: y0 + i * c, width: c, height: c, fill: '#fff', stroke: '#4f9bd0', 'stroke-width': 2 }, svg);
  const hi = svgEl('rect', { x: 0, y: 0, width: 0, height: 0, fill: 'rgba(217,113,28,.25)', stroke: '#d9711c', 'stroke-width': 4 }, svg);
  const cnt = svgEl('text', { x: x0 + 3 * c + 12, y: y0 + 1.6 * c, class: 'sq-cnt', 'text-anchor': 'start' }, svg);
  let timer = 0;
  const run = (k) => {
    clearInterval(timer);
    const pos = [];
    for (let i = 0; i + k <= 3; i += 1) for (let j = 0; j + k <= 3; j += 1) pos.push([i, j]);
    let n = 0;
    const show = () => {
      const [i, j] = pos[n];
      Object.entries({ x: x0 + j * c, y: y0 + i * c, width: k * c, height: k * c }).forEach(([a, v]) => hi.setAttribute(a, v));
      n += 1;
      cnt.textContent = `${n} 个`;
      if (n >= pos.length) clearInterval(timer);
    };
    show();
    if (pos.length > 1) timer = setInterval(show, 650);
  };
  document.querySelector('.sqbtns').addEventListener('click', (e) => {
    const b = e.target.closest('[data-k]');
    if (b) run(+b.dataset.k);
  });
}

window.LESSON = {
  init() {
    initRecall();
    initSticks22();
    initFence();
    initOrderList();
    initBars();
    initRing();
    initDish();
    initSq9();
  },
};
