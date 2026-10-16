'use strict';
/* 七下 11.1 生活中的不等式 · 本课互动：限速滑块、关键词分拣台、温度计。通用部分见 ../shared/math.js */
const { tex } = MathKit;
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const mk = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  parent.appendChild(e);
  return e;
};

/* 第 3 页：车速滑块。车的位置按速度线性移动；a ≤ 100 符合要求 */
const LIMIT = 100;
function initSpeed() {
  const inp = $('spd');
  const car = $('car');
  const show = () => {
    const a = +inp.value;
    $('spdV').textContent = a;
    car.setAttribute('transform', `translate(${70 + ((a - 60) / 80) * 200} 0)`);
    car.querySelectorAll('rect')[0].setAttribute('fill', a > LIMIT ? '#c0392b' : '#1d6fa5');
    const msg = $('spdMsg');
    const ok = a <= LIMIT;
    msg.className = `tip feedback ${ok ? 'fb-ok' : 'fb-warn'}`;
    msg.innerHTML = ok
      ? `$a=${a}$：${a === LIMIT ? '恰好等于 100，<b>没有超过</b>' : '比 100 小'}，符合要求．`
      : `$a=${a}$：比 100 大，<b>超速</b>了．`;
    tex(msg);
  };
  inp.addEventListener('input', show);
  show();
}

/* 第 6 页：关键词分拣台 */
const BINS = [
  { k: '>', t: '\\gt', r: '大于' },
  { k: '<', t: '\\lt', r: '小于' },
  { k: '>=', t: '\\ge', r: '大于或等于' },
  { k: '<=', t: '\\le', r: '小于或等于' },
];
const CARDS = [
  { s: '车速<b>不超过</b> 100 km/h', k: '<=', why: '“不超过”= 小于或等于，100 本身也可以．' },
  { s: '蛋白质<b>不少于</b> 2.9 g', k: '>=', why: '“不少于”= 大于或等于．' },
  { s: '睡眠时间<b>超过</b> 8 h', k: '>', why: '“超过”不包括等于．' },
  { s: '速度<b>最高可达</b> 350 km/h', k: '<=', why: '最高就是上限：可以等于，不会超过．' },
  { s: '路程<b>最短是</b> 1 km', k: '>=', why: '最短就是下限：可以等于，不会更少．' },
  { s: '$a$ <b>是负数</b>（与 0 比）', k: '<', why: '负数小于 0，0 不是负数．' },
  { s: '$x-y$ <b>是非负数</b>（与 0 比）', k: '>=', why: '非负数 = 正数和 0，要带等号．' },
  { s: '倒数<b>不大于</b> 5', k: '<=', why: '“不大于”= 小于或等于．' },
  { s: '锻炼<b>至少</b> 30 min', k: '>=', why: '“至少”= 不少于 = 大于或等于．' },
  { s: '跑 100 m <b>打破</b> 12 s 的纪录', k: '<', why: '跑步打破纪录是用时更<b>少</b>，平纪录不算打破．' },
  { s: '跳高<b>打破</b> 1.75 m 的纪录', k: '>', why: '跳高打破纪录是跳得更<b>高</b>．' },
  { s: '$3x-2$ <b>是正数</b>（与 0 比）', k: '>', why: '正数大于 0．' },
];

function initSorter() {
  let st = { sel: -1, placed: CARDS.map(() => false), tries: 0 };
  const msg = $('sMsg');
  const say = (html, cls = '') => { msg.className = `tip feedback ${cls}`; msg.innerHTML = html; tex(msg); };
  const render = () => {
    $('sCards').innerHTML = CARDS.map((c, i) => (st.placed[i] ? '' : `<button type="button" class="scard${st.sel === i ? ' sel' : ''}" data-i="${i}">${c.s}</button>`)).join('')
      || '<span class="muted">全部分拣完毕！</span> <button type="button" class="btn" id="sReset">重新开始</button>';
    $('sBins').innerHTML = BINS.map((b) => `<div class="bin" data-k="${b.k}"><p class="bin-h">$${b.t}$ <small>${b.r}</small></p>${
      CARDS.map((c, i) => (st.placed[i] && c.k === b.k ? `<span class="in">${c.s}</span>` : '')).join('')}</div>`).join('');
    tex($('sorter'));
  };
  $('sorter').addEventListener('click', (e) => {
    if (e.target.closest('#sReset')) { st = { sel: -1, placed: CARDS.map(() => false), tries: 0 }; say(''); render(); return; }
    const card = e.target.closest('.scard');
    if (card) { st = { ...st, sel: +card.dataset.i }; render(); say('现在点它该放进的不等号盒子．'); return; }
    const bin = e.target.closest('.bin');
    if (!bin || st.sel < 0) return;
    const c = CARDS[st.sel];
    if (bin.dataset.k === c.k) {
      st = { ...st, placed: st.placed.map((v, i) => v || i === st.sel), sel: -1 };
      const left = st.placed.filter((v) => !v).length;
      say(`✓ ${c.why}${left ? `　还剩 ${left} 张．` : '　全部完成！'}`, 'fb-ok');
    } else {
      st = { ...st, tries: st.tries + 1 };
      say(`✗ 不对．${c.why}`, 'fb-warn');
    }
    render();
    if (bin.dataset.k !== c.k) $('sBins').querySelector(`[data-k="${bin.dataset.k}"]`).classList.add('shake');
  });
  render();
}

/* 第 7 页：温度计（-6℃～10℃），-2℃～6℃ 的区间用绿色标出 */
const T0 = -6;
const T1 = 10;
function initThermo() {
  const svg = $('thermo');
  const Y = (t) => 170 - ((t - T0) / (T1 - T0)) * 150;
  mk('rect', { x: 52, y: Y(T1) - 6, width: 24, height: Y(T0) - Y(T1) + 12, rx: 12, fill: '#fff', stroke: '#7b8a97', 'stroke-width': 2 }, svg);
  mk('circle', { cx: 64, cy: 184, r: 13, fill: '#c0392b' }, svg);
  const liquid = mk('rect', { x: 58, width: 12, fill: '#c0392b' }, svg);
  mk('rect', { x: 84, y: Y(6), width: 10, height: Y(-2) - Y(6), fill: 'rgba(47,125,107,.45)' }, svg);
  for (let t = T0; t <= T1; t += 1) {
    const major = t % 2 === 0;
    mk('line', { x1: 76, x2: major ? 90 : 84, y1: Y(t), y2: Y(t), stroke: '#556575', 'stroke-width': major ? 2 : 1 }, svg);
    if (major) mk('text', { x: 100, y: Y(t) + 5, class: 'th-n' }, svg).textContent = String(t).replace('-', '−');
  }
  [[6, '最高 6℃'], [-2, '最低 −2℃']].forEach(([t, s]) => {
    mk('line', { x1: 130, x2: 168, y1: Y(t), y2: Y(t), stroke: '#2f7d6b', 'stroke-width': 2, 'stroke-dasharray': '4 3' }, svg);
    mk('text', { x: 172, y: Y(t) + 5, class: 'th-k' }, svg).textContent = s;
  });
  const lab = mk('text', { x: 172, y: 110, class: 'th-t' }, svg);
  const inp = $('tmp');
  const show = () => {
    const t = +inp.value;
    liquid.setAttribute('y', Y(t));
    liquid.setAttribute('height', 184 - Y(t));
    const ok = t >= -2 && t <= 6;
    $('tmpV').textContent = String(t).replace('-', '−');
    lab.textContent = ok ? `t = ${String(t).replace('-', '−')}℃ 可能` : `t = ${String(t).replace('-', '−')}℃ 不可能`;
    lab.setAttribute('fill', ok ? '#2f7d6b' : '#c0392b');
  };
  inp.addEventListener('input', show);
  show();
}

window.LESSON = {
  init() {
    initSpeed();
    initSorter();
    initThermo();
  },
};
