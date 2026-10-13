'use strict';
/* 中国石拱桥 · 本课数据与专属互动：段落拱石（说明顺序）、两座桥的数据信息图（点部位看作用）、例子表格、删字比较 */

const svgNS = (tag, attrs, text) => {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  if (text) el.textContent = text;
  return el;
};

/* ---------- 段落拱石：十段 = 十块拱石，按组上色（顶层生成：deck.js 要统计分步） ---------- */
const PARAS = [
  { n: 1, lab: '像虹', g: 1, s: '石拱桥的桥洞成弧形，就像虹。——从“虹”说起，引出说明对象。' },
  { n: 2, lab: '优美坚固', g: 1, s: '这种桥不但形式优美，而且结构坚固，能几十年几百年甚至上千年雄跨在江河之上。——石拱桥的特点。' },
  { n: 3, lab: '悠久多样', g: 1, s: '我国的石拱桥有悠久的历史……这些桥大小不一，形式多样，有许多是惊人的杰作。——中国石拱桥的特点。' },
  { n: 4, lab: '赵州桥', g: 2, s: '赵州桥……是世界著名的古代石拱桥，也是造成后一直使用到现在的最古的石桥。——历史悠久。' },
  { n: 5, lab: '赵州桥', g: 2, s: '桥的设计完全合乎科学原理，施工技术更是巧妙绝伦。——四个特点：大拱、小拱、拱圈、匀称美观。' },
  { n: 6, lab: '卢沟桥', g: 3, s: '永定河上的卢沟桥……由于各拱相连，所以这种桥叫作联拱石桥。——坚固、石狮千态万状。' },
  { n: 7, lab: '闻名世界', g: 3, s: '早在 13 世纪，卢沟桥就闻名世界。——马可·波罗的评价，“卢沟晓月”。' },
  { n: 8, lab: '值得纪念', g: 3, s: '卢沟桥在我国人民反抗帝国主义侵略战争的历史上，也是值得纪念的。' },
  { n: 9, lab: '成就原因', g: 4, s: '为什么我国的石拱桥会有这样光辉的成就呢？首先……其次……再其次……——劳动人民的勤劳智慧、优良传统、富有石料。' },
  { n: 10, lab: '新发展', g: 4, s: '解放后……长虹大桥……“双曲拱桥”是我国劳动人民的新创造。——今天的发展。' },
];
const GROUPS = ['', '总说特征（1—3）', '举例：赵州桥（4—5）', '举例：卢沟桥（6—8）', '原因与发展（9—10）'];

function buildArch() {
  const svg = document.getElementById('archSvg');
  const [cx, cy, r1, r2] = [400, 380, 150, 290];
  const pt = (r, a) => `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy - r * Math.sin(a)).toFixed(1)}`;
  svg.appendChild(svgNS('path', { class: 'arch-water', d: 'M0 380 H800 V420 H0 Z' }));
  svg.appendChild(svgNS('path', { class: 'arch-bank', d: 'M0 380 L0 300 L110 300 L110 380 Z M800 380 L800 300 L690 300 L690 380 Z' }));
  [1, 2, 3, 4].forEach((g) => {
    const grp = svgNS('g', { class: `paint arch-g g${g}`, 'data-step': g });
    PARAS.filter((p) => p.g === g).forEach((p) => {
      const a0 = Math.PI - (p.n - 1) * Math.PI / 10;
      const a1 = Math.PI - p.n * Math.PI / 10;
      const stone = svgNS('g', { class: 'stone', 'data-i': p.n - 1 });
      stone.appendChild(svgNS('path', { d: `M${pt(r2, a0)} A${r2} ${r2} 0 0 1 ${pt(r2, a1)} L${pt(r1, a1)} A${r1} ${r1} 0 0 0 ${pt(r1, a0)} Z` }));
      const am = (a0 + a1) / 2;
      const [tx, ty] = pt(220, am).split(' ').map(Number);
      stone.appendChild(svgNS('text', { class: 'num t-c', x: tx, y: ty - 4 }, String(p.n)));
      stone.appendChild(svgNS('text', { class: 'lab t-c', x: tx, y: ty + 16 }, p.lab));
      grp.appendChild(stone);
    });
    grp.appendChild(svgNS('text', { class: 'grp-lab t-c', x: 400, y: 236 + g * 32 }, GROUPS[g]));
    svg.appendChild(grp);
  });
}
buildArch();

/* ---------- 卢沟桥：11 个半圆拱，中间最大，两端最小（顶层生成） ---------- */
function buildLugou() {
  const spans = [16, 16.5, 17.5, 18.5, 20, 21.6, 20, 18.5, 17.5, 16.5, 16];
  const PIER = 14;
  const scale = (600 - PIER * 10) / spans.reduce((a, b) => a + b, 0);
  let x = 100;
  let holes = '';
  let piers = '';
  spans.forEach((m, i) => {
    const w = m * scale;
    const r = w / 2;
    holes += ` M${x.toFixed(1)} 182 L${x.toFixed(1)} 172 A${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${(x + w).toFixed(1)} 172 L${(x + w).toFixed(1)} 182 Z`;
    x += w;
    if (i < spans.length - 1) { piers += `<rect x="${x.toFixed(1)}" y="140" width="${PIER}" height="42" rx="2"/>`; x += PIER; }
  });
  document.getElementById('lgBody').setAttribute('d', `M40 182 L40 112 L100 96 L700 96 L760 112 L760 182 Z${holes}`);
  document.getElementById('lgPier').innerHTML = piers;
  let rail = '<line x1="100" y1="84" x2="700" y2="84"/>';
  for (let px = 100; px <= 700; px += 20) rail += `<line x1="${px}" y1="96" x2="${px}" y2="78"/><circle cx="${px}" cy="75" r="4"/>`;
  document.getElementById('lgRail').innerHTML = rail;
}
buildLugou();

const PARTS = {
  'zz-body': '<b>大拱 · 像一张弓：</b>桥洞不是普通半圆形，而是像一张弓，因而大拱上面的道路没有陡坡，便于车马上下。',
  'zz-small': '<b>两肩小拱 · 创造性的设计：</b>① 节约石料，减轻桥身重量；② 河水暴涨时增加过水量，减轻洪水对桥身的冲击；③ 拱上加拱，桥身更美观。',
  'zz-ring': '<b>28 道拱圈：</b>就像这么多同样形状的弓合拢在一起。每道拱圈都能独立支撑上面的重量，一道坏了，其他各道不致受到影响。',
  'zz-rail': '<b>石栏石板：</b>全桥结构匀称，和四周景色配合得十分和谐；石栏石板雕刻得古朴美观——远望“初月出云，长虹饮涧”。',
  'lg-body': '<b>11 个半圆形石拱：</b>各拱相连，叫作联拱石桥。永定河发水时来势很猛，这座桥极少出事，足见它的坚固。',
  'lg-pier': '<b>石砌桥墩：</b>每两个石拱之间有石砌桥墩，把 11 个石拱联成一个整体。',
  'lg-rail': '<b>石栏石柱上的狮子：</b>有的母子相抱，有的交头接耳，有的像倾听水声，有的像注视行人，千态万状，惟妙惟肖。',
};

function initBridges() {
  const info = document.getElementById('bridgeInfo');
  document.querySelector('.bridge-stage').addEventListener('click', (e) => {
    const hot = e.target.closest('.hot');
    if (!hot) return;
    document.querySelectorAll('.bridge .hot').forEach((h) => h.classList.toggle('sel', h === hot));
    info.innerHTML = PARTS[hot.dataset.k];
  });
}

function initArch() {
  const info = document.getElementById('archInfo');
  document.getElementById('archSvg').addEventListener('click', (e) => {
    const st = e.target.closest('.stone');
    if (!st) return;
    document.querySelectorAll('#archSvg .stone').forEach((s) => s.classList.toggle('sel', s === st));
    const p = PARAS[+st.dataset.i];
    info.innerHTML = `<b>第 ${p.n} 段 · ${GROUPS[p.g]}</b><br>${p.s}`;
  });
}

/* ---------- 思考探究一：表格，灰格点开 ---------- */
const ROWS = [
  [['旅人桥', 1], ['约 282 年', 0], ['可能是有记载的最早石拱桥', 0]],
  [['赵州桥', 0], ['约 605 年', 0], ['一直使用到现在的最古的石桥；单个弓形大拱，两肩各两个小拱，28 道拱圈', 1]],
  [['卢沟桥', 1], ['1189—1192 年', 0], ['联拱石桥，11 个半圆形石拱；坚固；石狮千态万状', 1]],
  [['江东桥', 0], ['700 多年前', 1], ['石梁一块有 200 来吨重，怎样安装至今不完全知道', 1]],
  [['长虹大桥', 1], ['1961 年', 0], ['当时世界上最长的独拱石桥', 0]],
  [['双曲拱桥', 0], ['解放后', 0], ['我国劳动人民的新创造，世界上所仅有的', 1]],
];
function initTable() {
  const t = document.getElementById('exTable');
  t.insertAdjacentHTML('beforeend', ROWS.map((r, i) => `<tr><td class="no">${i + 1}</td>${r.map(([v, hide]) =>
    (hide ? `<td><button type="button" class="cell" data-v="${v}">？</button></td>` : `<td>${v}</td>`)).join('')}</tr>`).join(''));
  t.addEventListener('click', (e) => {
    const c = e.target.closest('.cell');
    if (c) { c.textContent = c.dataset.v; c.classList.add('open'); }
  });
}

/* ---------- 思考探究三：说明方法 ---------- */
const SORT = [
  { s: '赵州桥非常雄伟，全长 50.82 米，两端宽 9.6 米，中部略窄，宽约 9 米。', ok: ['列数字'], q: '用准确的数字具体说明赵州桥的“雄伟”。' },
  { s: '石拱桥的桥洞成弧形，就像虹。', ok: ['打比方'], q: '把桥洞比作虹，形象说明它的弧形。' },
  { s: '桥洞不是普通半圆形，而是像一张弓。', ok: ['作比较', '打比方'], q: '和半圆形比，又比作弓，突出大拱扁平、没有陡坡。' },
  { s: '唐朝的张嘉贞说它“制造奇特，人不知其所以为”。', ok: ['引用'], q: '用古人的评价说明设计施工巧妙，增强说服力。' },
  { s: '如福建漳州的江东桥……有的石梁一块就有 200 来吨重。', ok: ['举例子', '列数字'], q: '具体说明“起重吊装方面更有意想不到的办法”。' },
  { s: '大拱由 28 道拱圈拼成，就像这么多同样形状的弓合拢在一起。', ok: ['打比方', '列数字'], q: '把看不见的内部结构说得形象可感。' },
  { s: '其中最著名的当推河北省赵县的赵州桥，还有北京丰台区的卢沟桥。', ok: ['举例子'], q: '以最著名的两座桥为例，具体说明“惊人的杰作”。' },
];

/* ---------- 积累拓展四：删字比较 ---------- */
const PRECISE = [
  ['《水经注》里提到的“旅人桥”，', { w: '大约', why: '删去“大约”，成了确定的“建成于公元 282 年”。史料只能推断大致时间，“大约”表示估计。' },
    '建成于公元 282 年，', { w: '可能', why: '删去“可能”，就成了断定它是最早的。“可能”表示推测，留有余地。' }, '是',
    { w: '有记载的', why: '删去“有记载的”，范围扩大到所有石拱桥，无从证明。“有记载的”限定了范围。' }, '最早的石拱桥了。'],
  ['全桥只有一个大拱，长达 37.02 米，', { w: '在当时', why: '删去“在当时”，就成了“至今世界最长”，与课文后面 112.5 米的长虹大桥矛盾。它限定了时间。' },
    { w: '可算是', why: '删去“可算是”，语气变得绝对。“可算是”表示就当时情况评价，委婉而有分寸。' }, '世界上最长的石拱。'],
  ['卢沟桥……每个石拱', { w: '长度不一', why: '删去“长度不一”，读者会以为 11 个拱一样长。后面“自 16 米到 21.6 米”正好说明不一样长。' },
    '，自 16 米到 21.6 米。桥宽', { w: '约', why: '删去“约”，成了确数 8 米。材料（一）说桥面宽 7.6 米、全宽约 8 米，“约”更准确。' },
    ' 8 米，桥面平坦，', { w: '几乎', why: '删去“几乎”，成了完全与河面平行。“几乎”表示非常接近但不完全，准确。' }, '与河面平行。'],
];
function initPrecise() {
  const list = document.getElementById('prList');
  const res = document.getElementById('prRes');
  const words = [];
  list.innerHTML = PRECISE.map((parts) => `<p class="pr-s">${parts.map((p) => {
    if (typeof p === 'string') return p;
    words.push(p);
    return `<button type="button" class="pr-w" data-i="${words.length - 1}">${p.w}</button>`;
  }).join('')}</p>`).join('');
  list.addEventListener('click', (e) => {
    const b = e.target.closest('.pr-w');
    if (!b) return;
    const del = b.classList.toggle('del');
    const w = words[+b.dataset.i];
    res.innerHTML = del ? `<b>删去“${w.w}”：</b>${w.why}` : `“${w.w}”放回去了。再删一个试试。`;
  });
}

const MOMENTS = [
  {
    name: '赵州桥的小拱', pic: 'zhaozhou',
    prompt: '假如你是赵州桥的讲解员，向游客介绍大拱两肩的四个小拱。',
    hint: '先说位置和数量（列数字），再说三个作用（可以用“不但……而且……还……”），最后用一个比喻收尾。',
    example: '请大家看大拱的两肩，左右各有两个小拱。别小看这四个小拱：它们不但节约了石料，减轻了桥身的重量，而且在河水暴涨时能增加过水量，减轻洪水对桥身的冲击。拱上加拱，整座桥就像一张拉满的弓上又挂了几轮新月，更加美观。',
  },
  {
    name: '卢沟桥的石狮', pic: 'shizi',
    prompt: '用“有的……有的……”介绍卢沟桥的石狮子，再补一个数字。',
    hint: '可以借用材料（二）的数字“485 个大小石狮”，再写三四种姿态。',
    example: '卢沟桥两旁的石柱上蹲着 485 个大小石狮，没有两只是一样的：有的母子相抱，有的交头接耳，有的侧着头像在倾听水声，有的低着头像在注视行人。难怪人们说“卢沟桥的狮子——数不清”。',
  },
  {
    name: '家乡的一座桥', pic: 'hong',
    prompt: '介绍你家乡或上学路上的一座桥，先用一句话说出它的特征，再用两种以上说明方法。',
    hint: '长多少？几个桥洞？什么形状？用什么材料？和别的桥比有什么不同？',
    example: '我上学路上有一座三孔石拱桥，全长约 30 米。中间的桥洞最大，两边的稍小，倒映在水里，正好是三个圆。和旁边新修的平板钢桥比，它的桥面中间高、两头低，走上去像翻过一个小山坡……',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ sort: SORT, kinds: ['列数字', '举例子', '作比较', '打比方', '引用'], moments: MOMENTS });
    initArch();
    initBridges();
    initTable();
    initPrecise();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
