'use strict';
/* 高一下 12.1 复数的概念 · 本课互动：数集分类（点数放进维恩图）、例 2 参数滑块与数轴。通用部分见 ../shared/math.js */
const { board, slider, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);

/* 第 6 页：分类。z：real 实数 / pure 纯虚数 / imag 非纯虚数的虚数 */
const NUMS = [
  { tex: '2+\\sqrt3', txt: '2+√3', z: 'real', why: '虚部为 0' },
  { tex: '1-2\\mathrm i', txt: '1−2i', z: 'imag', why: '实部 1，虚部 −2' },
  { tex: '\\frac12\\mathrm i', txt: '½ i', z: 'pure', why: '实部 0，虚部 ½' },
  { tex: '\\mathrm i^2', txt: 'i²', z: 'real', why: 'i² = −1，是实数' },
  { tex: '-5+\\sqrt2\\,\\mathrm i', txt: '−5+√2 i', z: 'imag', why: '实部 −5，虚部 √2' },
  { tex: '0', txt: '0', z: 'real', why: '实部、虚部都为 0' },
  { tex: '7+(\\sqrt5-2)\\mathrm i', txt: '7+(√5−2)i', z: 'imag', why: '√5 − 2 ≠ 0，是虚数' },
  { tex: '6\\mathrm i', txt: '6i', z: 'pure', why: '实部 0，虚部 6' },
];
const SLOTS = {
  real: [[118, 118], [118, 178], [118, 238], [118, 288]],
  pure: [[372, 218], [372, 258], [436, 238]],
  imag: [[300, 104], [444, 104], [372, 140], [262, 214], [482, 214]],
};
const ZONE_NAME = { real: '实数集', pure: '纯虚数集', imag: '虚数集（非纯虚数）', none: '这里' };

function initSorter() {
  const st = { sel: null, placed: {} };
  const chips = $('chips');
  const msg = $('sortMsg');
  const say = (cls, html) => { msg.className = `tip feedback ${cls}`; msg.innerHTML = html; };
  const draw = () => {
    chips.innerHTML = NUMS.map((n, i) => (st.placed[i] ? '' : `<button type="button" class="chip nchip${st.sel === i ? ' sel' : ''}" data-i="${i}">$${n.tex}$</button>`)).join('');
    tex(chips);
    const used = { real: 0, pure: 0, imag: 0 };
    $('placed').innerHTML = NUMS.map((n, i) => {
      if (!st.placed[i]) return '';
      const [x, y] = SLOTS[n.z][used[n.z]++];
      return `<text x="${x}" y="${y}" class="vn">${n.txt}</text>`;
    }).join('');
    if (Object.keys(st.placed).length === NUMS.length) say('fb-ok', '<b>全部放好！</b>实数集与虚数集没有公共元素；纯虚数集是虚数集的子集。');
  };
  chips.addEventListener('click', (e) => {
    const c = e.target.closest('[data-i]');
    if (!c) return;
    st.sel = +c.dataset.i;
    say('', `已选 $${NUMS[st.sel].tex}$，再点它所在的区域。`);
    tex(msg);
    draw();
  });
  $('venn').addEventListener('click', (e) => {
    const zEl = e.target.closest('[data-z]');
    if (!zEl || st.sel === null) return;
    const n = NUMS[st.sel];
    const z = zEl.dataset.z;
    if (z === n.z) {
      st.placed[st.sel] = true;
      say('fb-ok', `✓ $${n.tex}$：${n.why}。`);
      st.sel = null;
    } else {
      const hint = z === 'none' ? '复数集中的数，不是实数就是虚数，没有放在“外面”的。' : `不在${ZONE_NAME[z]}里。先整理成 $a+b\\mathrm i$，看虚部 $b$ 是否为 0，再看实部 $a$。`;
      say('fb-warn', `✗ $${n.tex}$ ${hint}`);
    }
    tex(msg);
    draw();
  });
  $('sortReset').addEventListener('click', () => { st.placed = {}; st.sel = null; say('', '先点一个数，再点右图中它所在的区域。'); draw(); });
  $('sortAll').addEventListener('click', () => { NUMS.forEach((_, i) => { st.placed[i] = true; }); st.sel = null; draw(); });
  draw();
}

/* 第 8 页：例 2，z = m(m − 1) + (m − 1)i */
function initParam() {
  const s = { m: 2 };
  const b = board($('mline'), { x: [-2.5, 3.5], y: [-0.9, 0.9], axes: false, grid: false, w: 560, h: 110 });
  b.seg([[-2.4, 0], [3.4, 0]], { cls: 'thin' });
  [-2, -1, 0, 1, 2, 3].forEach((x) => { b.seg([[x, -0.08], [x, 0.08]], { cls: 'thin' }); b.text([x, 0], String(x), { cls: 'tk', dx: -4, dy: 22 }); });
  b.pt([0, 0], { cls: 'c2', r: 7 });
  b.text([0, 0], '纯虚数', { cls: 'lb up c2t', dx: -26, dy: -14 });
  b.pt([1, 0], { r: 7 });
  b.text([1, 0], '实数', { cls: 'lb up', dx: -16, dy: -14 });
  b.seg(() => [[s.m, -0.5], [s.m, 0.5]], { cls: 'c1' });
  slider($('mm'), (v) => {
    s.m = v;
    b.update();
    const a = v * (v - 1);
    const im = v - 1;
    const kind = im === 0 ? '实数' : a === 0 ? '纯虚数' : '虚数';
    $('mmV').textContent = fmt(v);
    $('mRead').innerHTML = `<span>实部 $m(m-1)=${fmt(a, 4)}$</span><span>虚部 $m-1=${fmt(im)}$</span><span>$z$ 是 <b>${kind}</b></span>`;
    tex($('mRead'));
  });
}

window.LESSON = {
  init() {
    initSorter();
    initParam();
  },
};
