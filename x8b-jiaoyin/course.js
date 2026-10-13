'use strict';
/* 时间的脚印 · 本课专属互动：岩层计时器、“时间书页”地层剖面（从下往上堆叠，点层读记录，可倾斜）、独立成段单句的作用 */

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const svgNS = (tag, attrs, text) => {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  if (text) el.textContent = text;
  return el;
};

/* ---------- 地层：从下（最古老）到上；deco 为层内示意花纹 ---------- */
const LAYERS = [
  { n: '古老陆块', c: '#6b5a4e', deco: 'ore', s: '“寒武纪”以前形成的古老陆块内藏有许多铁矿……', r: '读懂岩石的历史，有助于找寻地下的宝藏——铁矿。' },
  { n: '三叶虫化石', c: '#8c9aa3', deco: 'tri', s: '它告诉我们，在6亿多年前到5亿多年前的那个叫作“寒武纪”的时代，地球上的海洋是多么宽广。', r: '化石是历史的证人：这里曾是一片海洋。' },
  { n: '砾岩', c: '#b49a78', deco: 'peb', s: '有一种很粗糙的石头，叫作“砾岩”。你可以清楚地看到，砾岩中包含着从前的鹅卵石。', r: '较大的石子不能被搬到海或湖的中央——这里当时是陆地的边缘。' },
  { n: '颗粒变细', c: '#cdb98f', deco: 'fine', s: '这是因为地壳下沉，使原来靠岸的地方变成了海洋的中心。', r: '粗糙的岩石上覆盖着颗粒逐渐变细的岩层——从“死”的石头上，看到了地壳的活动。' },
  { n: '红色岩层', c: '#b6553e', deco: '', s: '红色的岩石意味着当时气候非常炎热……', r: '石头的颜色说明着气候的变化：炎热。' },
  { n: '树木化石 · 煤', c: '#3d3a36', deco: 'tree', s: '许多高大树木的化石告诉我们，有一个时期地球上的气候是温暖而潮湿的，这是叫作“石炭纪”的时代的特征。', r: '“石炭纪”时期造成了许多煤矿。' },
  { n: '灰黑色 · 擦痕', c: '#6f7378', deco: 'scratch', s: '如果这里的石头有光滑的擦痕，那很可能从前这里有冰河经过。', r: '灰黑色常常是寒冷的表示；擦痕是冰河留下的。' },
  { n: '长毛象化石', c: '#a99e8c', deco: 'mam', s: '还有一些“象”和“犀牛”都长上了长长的毛，这准是天气冷了，说明了“第四纪”冰河时期的来临。', r: '长毛象即猛犸象，适应寒冷气候——冰期来了。' },
  { n: '地表痕迹', c: '#d8c7a2', deco: 'marks', s: '如雨打沙滩的遗迹，水波使水底泥沙掀起的波痕，古代动物走过的脚印和天旱时候泥土龟裂的形象……', r: '自然界某些转眼就消逝的活动，在石头上也留下了痕迹。' },
];
const L_H = 38;
const BASE = 360;
function decoFor(kind, y) {
  const g = [];
  const mid = y + L_H / 2;
  if (kind === 'peb') for (let x = 30; x < 540; x += 34) g.push(['ellipse', { cx: x + (x % 3) * 4, cy: mid + ((x / 34) % 2 ? 6 : -6), rx: 9, ry: 6, class: 'peb' }]);
  if (kind === 'fine') for (let x = 20; x < 540; x += 12) g.push(['circle', { cx: x, cy: mid + ((x / 12) % 3) * 5 - 5, r: 1.6, class: 'dot' }]);
  if (kind === 'tri') [120, 330, 470].forEach((x) => { g.push(['ellipse', { cx: x, cy: mid, rx: 15, ry: 10, class: 'tri' }]); g.push(['line', { x1: x, y1: mid - 9, x2: x, y2: mid + 9, class: 'tri-l' }]); });
  if (kind === 'tree') [90, 260, 420].forEach((x) => g.push(['path', { d: `M${x} ${mid + 10} q20 -14 60 -6 m-40 2 l-8 -10 m22 8 l6 -10`, class: 'tree' }]));
  if (kind === 'scratch') for (let x = 40; x < 520; x += 70) g.push(['line', { x1: x, y1: mid - 6, x2: x + 50, y2: mid + 4, class: 'scr' }]);
  if (kind === 'ore') [80, 230, 400].forEach((x) => g.push(['path', { d: `M${x} ${mid} l12 -8 l14 6 l-6 10 z`, class: 'ore' }]));
  if (kind === 'mam') g.push(['text', { x: 380, y: mid + 9, class: 'emo' }, '🦣']);
  if (kind === 'marks') g.push(['text', { x: 360, y: mid + 8, class: 'emo s' }, '🐾 〰 ∴']);
  return g;
}
function buildStrata() {
  const svg = document.getElementById('strataSvg');
  svg.appendChild(svgNS('rect', { x: 0, y: 0, width: 560, height: 380, class: 'sky' }));
  const all = svgNS('g', { id: 'strataG' });
  LAYERS.forEach((l, i) => {
    const y = BASE - (i + 1) * L_H;
    const g = svgNS('g', { class: 'layer', 'data-step': i + 1, 'data-i': i });
    g.appendChild(svgNS('path', { d: `M-60 ${y + 4} Q140 ${y - 3} 280 ${y + 2} T620 ${y} V${y + L_H + 2} H-60 Z`, fill: l.c, class: 'lay' }));
    decoFor(l.deco, y).forEach(([tag, attrs, text]) => g.appendChild(svgNS(tag, attrs, text)));
    g.appendChild(svgNS('text', { class: 'lay-t', x: 14, y: y + L_H / 2 + 6 }, l.n));
    all.appendChild(g);
  });
  svg.appendChild(all);
  svg.appendChild(svgNS('text', { class: 'age', x: 548, y: BASE - 6, 'text-anchor': 'end' }, '最古老 ↓'));
  svg.appendChild(svgNS('text', { class: 'age', x: 548, y: 14, 'text-anchor': 'end' }, '最年轻 ↑'));
}
buildStrata();
function initStrata() {
  const card = document.getElementById('pageCard');
  document.getElementById('strataSvg').addEventListener('click', (e) => {
    const g = e.target.closest('.layer');
    if (!g) return;
    document.querySelectorAll('#strataSvg .layer').forEach((x) => x.classList.toggle('sel', x === g));
    const i = +g.dataset.i;
    const l = LAYERS[i];
    card.innerHTML = `<span class="pc-n">第 ${i + 1} 页 · ${l.n}</span><p class="pc-s">${esc(l.s)}</p><p class="pc-r">${esc(l.r)}</p>`;
  });
  const btn = document.getElementById('tiltBtn');
  btn.addEventListener('click', () => {
    const on = document.getElementById('strataG').classList.toggle('tilt');
    btn.textContent = on ? '恢复平卧' : '地壳运动：让岩层歪斜';
    btn.classList.toggle('solid', on);
  });
}

/* ---------- 岩层计时器：1 米 = 3000—10000 年 ---------- */
function initTimer() {
  const r = document.getElementById('thick');
  const fmt = (n) => (n >= 10000 ? `${(n / 10000).toLocaleString('zh-CN')} 万` : n.toLocaleString('zh-CN'));
  const upd = () => {
    const m = +r.value;
    document.getElementById('thickV').textContent = `${m} 米`;
    document.getElementById('thickY').innerHTML = `约需 <b>${fmt(m * 3000)} — ${fmt(m * 10000)} 年</b>`;
  };
  r.addEventListener('input', upd);
  upd();
}

/* ---------- 独立成段的单句 ---------- */
const SORT = [
  { s: '岩石是怎样记下时间的呢？', ok: ['提出问题', '标示层次'], q: '设问句，提出本文要说明的核心问题，引出下文对岩石破坏和形成的说明。' },
  { s: '真的有“海枯石烂”的时候。', ok: ['提示重点'], q: '用一个成语点明“岩石也会被破坏”，打破“坚固不坏”的常识，引起注意。' },
  { s: '水和空气还能够进入岩石内部的孔隙中造成破坏。', ok: ['提示重点', '标示层次'], q: '单独成段，强调岩石内部也会被破坏——“攻击”来自四面八方。' },
  { s: '经过长期的重压和胶结，那些碎石和泥沙重新形成了岩石。', ok: ['提示重点', '标示层次'], q: '总结岩石形成的过程，标示这一层次的结束。' },
  { s: '岩石保存了远比上面所说的多得多的历史痕迹。', ok: ['标示层次'], q: '承上启下：由“记下时间”过渡到“记下历史痕迹”。' },
  { s: '从“死”的石头上，我们看到了地壳的活动。', ok: ['提示重点'], q: '用“死”与“活”对照，点明岩石记录了地壳运动——辩证地看问题。' },
  { s: '化石是历史的证人，它帮助我们认识地球历史的发展过程。', ok: ['提示重点', '标示层次'], q: '比喻点明化石的价值，引出下文三叶虫、石炭纪、第四纪的例子。' },
];

window.LESSON = {
  init() {
    Narrative.init({ sort: SORT, kinds: ['提出问题', '提示重点', '标示层次'] });
    initTimer();
    initStrata();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
