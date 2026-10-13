'use strict';
/* 富饶的西沙群岛 · 本课逻辑。故事页 / 选一选 / 小练笔用 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* ================= 分区域地图：点哪里，看哪一段 ================= */
const ZONES = [
  { name: '海面', para: '第 2 段', key: '西沙群岛一带海水五光十色，瑰丽无比。', more: '深蓝的，淡青的，浅绿的，杏黄的。' },
  { name: '海底', para: '第 3 段', key: '', more: '珊瑚像花朵、像鹿角；海参懒洋洋地蠕动；大龙虾样子挺威武。' },
  { name: '鱼群', para: '第 4 段', key: '各种各样的鱼多得数不清。', more: '一半是水，一半是鱼。' },
  { name: '海岛', para: '第 5 段', key: '西沙群岛也是鸟的天下。', more: '海鸟、鸟蛋、鸟粪。' },
];

function initZones() {
  const svg = document.getElementById('zones');
  const card = document.getElementById('zoneCard');
  svg.addEventListener('click', (e) => {
    const zone = e.target.closest('.zone');
    if (!zone) return;
    const z = ZONES[+zone.dataset.z];
    svg.querySelectorAll('.zone').forEach((g) => g.classList.toggle('sel', g === zone));
    card.innerHTML = `<h3>${z.name}<small>${z.para}</small></h3>
      ${z.key ? `<p class="zc-key">关键句：${z.key}</p>` : '<p class="zc-key none">这一段没有一句总的话，三样东西分开写。</p>'}
      <p class="zc-more">${z.more}</p>`;
  });
}

/* ================= 第 2 段：海水深浅不同，颜色就不同 ================= */
const SEA_W = 800;
const SURFACE_Y = 70;
const COLORS = {
  深蓝: { fill: '#1e4f8f', say: '这里是峡谷，海水很深，从海面看是深蓝的。' },
  淡青: { fill: '#7cc7c9', say: '这里海水比较深，看上去是淡青的。' },
  浅绿: { fill: '#93d3a2', say: '这里海底高起来，海水比较浅，看上去是浅绿的。' },
  杏黄: { fill: '#e9c27a', say: '这里是山崖顶，海水很浅，能看见下面的沙，看上去是杏黄的。' },
};
const STRIPS = [['深蓝', 340], ['淡青', 250], ['浅绿', 170], ['杏黄', 112], ['浅绿', 180], ['深蓝', 330], ['淡青', 240], ['杏黄', 115]];

function initSeabed() {
  const svg = document.getElementById('seabed');
  const w = SEA_W / STRIPS.length;
  const pts = STRIPS.map(([, d], i) => [w * i + w / 2, d]);
  const bed = `M0 ${pts[0][1]} ${pts.map(([x, y], i) => {
    if (i === 0) return '';
    const [px, py] = pts[i - 1];
    return `C ${(px + w / 2).toFixed(0)} ${py} ${(x - w / 2).toFixed(0)} ${y} ${x.toFixed(0)} ${y}`;
  }).join(' ')} L${SEA_W} ${pts[pts.length - 1][1]} V380 H0 Z`;
  svg.innerHTML = `
    <rect width="800" height="380" fill="#e3f2f7"/>
    <rect y="${SURFACE_Y}" width="800" height="310" fill="#9fd0e3" opacity=".45"/>
    <path d="${bed}" fill="#c9a46a" stroke="#a5824e" stroke-width="2"/>
    <text class="t-s" x="${(w * 0.5).toFixed(0)}" y="370" text-anchor="middle" fill="#5a4a2a">峡谷</text>
    <text class="t-s" x="${(w * 3.5).toFixed(0)}" y="100" text-anchor="middle" fill="#5a4a2a">山崖</text>
    <g class="depth"></g>
    ${STRIPS.map(([c], i) => `<rect class="strip" data-i="${i}" x="${(w * i).toFixed(0)}" y="${SURFACE_Y - 34}" width="${w.toFixed(0)}" height="34" fill="${COLORS[c].fill}"/>
      <text class="t-s strip-t" x="${(w * i + w / 2).toFixed(0)}" y="${SURFACE_Y - 12}" text-anchor="middle">${c}</text>`).join('')}
    <text class="t-s" x="790" y="20" text-anchor="end" fill="#2f5a7a">↓ 从海面往下看</text>`;
  const depth = svg.querySelector('.depth');
  svg.addEventListener('click', (e) => {
    const strip = e.target.closest('.strip');
    if (!strip) return;
    const i = +strip.dataset.i;
    const [c, d] = STRIPS[i];
    const x = w * i + w / 2;
    svg.querySelectorAll('.strip').forEach((s) => s.classList.toggle('sel', s === strip));
    depth.innerHTML = `<line x1="${x}" y1="${SURFACE_Y}" x2="${x}" y2="${d - 4}" stroke="${COLORS[c].fill}" stroke-width="6" stroke-dasharray="10 6"/>
      <circle cx="${x}" cy="${d - 4}" r="8" fill="${COLORS[c].fill}" stroke="#fff" stroke-width="2"/>`;
    document.getElementById('depthSay').innerHTML = `<b>${c}：</b>${COLORS[c].say}`;
  });
}

/* ================= 给句子分类（两页共用；有的句子两类都对） ================= */
function initSortList(list, items, kinds, rowClass = "sort-row") {
  list.innerHTML = items.map((it, i) => `<div class="${rowClass}" data-i="${i}">
    <span class="s">${it.s}</span>
    <span class="btns">${kinds.map((k) => `<button class="btn" type="button" data-k="${k}">${k}</button>`).join('')}</span>
    <span class="res"></span></div>`).join('');
  list.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-k]');
    if (!btn) return;
    const row = btn.closest('[data-i]');
    const item = items[+row.dataset.i];
    row.classList.remove('no');
    if (item.ok.includes(btn.dataset.k)) {
      row.classList.add('ok');
      btn.classList.add('solid');
      row.querySelector('.res').textContent = item.q;
    } else {
      void row.offsetWidth; // 重新触发抖动
      row.classList.add('no');
      row.querySelector('.res').textContent = '再想想';
    }
  });
}

const SEA_SORT = [
  { s: '有的像绽开的花朵，有的像分枝的鹿角', ok: ['珊瑚'], q: '像花朵、像鹿角' },
  { s: '到处都是', ok: ['海参'], q: '多' },
  { s: '在海底懒洋洋地蠕动', ok: ['海参'], q: '懒洋洋' },
  { s: '全身披甲', ok: ['大龙虾'], q: '像穿着盔甲' },
  { s: '划过来，划过去，样子挺威武', ok: ['大龙虾'], q: '威武' },
];
const RICH_SORT = [
  { s: '海水五光十色，瑰丽无比', ok: ['风景优美'], q: '美' },
  { s: '珊瑚有的像绽开的花朵，有的像分枝的鹿角', ok: ['风景优美'], q: '美' },
  { s: '海参到处都是', ok: ['物产丰富'], q: '多' },
  { s: '鱼成群结队地在珊瑚丛中穿来穿去，好看极了', ok: ['风景优美', '物产丰富'], q: '又美又多' },
  { s: '遍地都是鸟蛋', ok: ['物产丰富'], q: '多' },
  { s: '一层厚厚的鸟粪，这是非常宝贵的肥料', ok: ['物产丰富'], q: '宝贵' },
];

/* ================= 第 4 段：各种各样的鱼 ================= */
const FISH = [
  { say: '有的全身布满彩色的条纹；', svg: '<ellipse cx="60" cy="40" rx="38" ry="22" fill="#4fa3e0"/><path d="M38 20 v40 M52 18 v44 M66 18 v44 M80 22 v36" stroke="#f5c542" stroke-width="6"/><path d="M22 40 l-18 -14 v28 z" fill="#4fa3e0"/><circle cx="86" cy="34" r="4" fill="#222"/>' },
  { say: '有的头上长着一簇红缨；', svg: '<ellipse cx="60" cy="44" rx="38" ry="20" fill="#9ad0ec"/><path d="M84 26 q-4 -20 6 -22 M88 26 q4 -18 14 -16 M80 28 q-10 -16 -4 -22" stroke="#e53935" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M22 44 l-18 -14 v28 z" fill="#9ad0ec"/><circle cx="86" cy="40" r="4" fill="#222"/>' },
  { say: '有的周身像插着好些扇子，游动的时候飘飘摇摇；', svg: '<g class="fan"><path d="M40 30 l-18 -26 l14 2 l10 -6 l6 20 z M40 54 l-18 22 l14 0 l12 6 l4 -22 z M60 26 l0 -24 l12 6 l8 -2 l-6 22 z" fill="#e57373" stroke="#fff" stroke-width="1.5"/></g><ellipse cx="62" cy="42" rx="32" ry="16" fill="#c62828"/><path d="M30 42 l-18 -12 v24 z" fill="#e57373"/><path d="M50 30 v24 M62 28 v28 M74 30 v24" stroke="#fff" stroke-width="3"/><circle cx="84" cy="38" r="4" fill="#222"/>' },
  { say: '有的眼睛圆溜溜的，身上长满了刺，鼓起气来像皮球一样圆。', puff: true, svg: '<g class="puffer"><circle cx="60" cy="42" r="24" fill="#e0c068"/><g stroke="#8a6a2a" stroke-width="3" stroke-linecap="round">' + Array.from({ length: 14 }, (_, i) => { const a = i / 14 * Math.PI * 2; return `<line x1="${(60 + Math.cos(a) * 24).toFixed(0)}" y1="${(42 + Math.sin(a) * 24).toFixed(0)}" x2="${(60 + Math.cos(a) * 32).toFixed(0)}" y2="${(42 + Math.sin(a) * 32).toFixed(0)}"/>`; }).join('') + '</g><circle cx="72" cy="34" r="8" fill="#fff"/><circle cx="74" cy="34" r="5" fill="#222"/></g><path d="M34 42 l-16 -10 v20 z" fill="#e0c068"/>' },
];

function initFish() {
  const grid = document.getElementById('fishGrid');
  const say = document.getElementById('fishSay');
  grid.innerHTML = FISH.map((f, i) => `<button type="button" class="fish" data-i="${i}"><svg viewBox="0 0 120 84">${f.svg}</svg><span>有的……</span></button>`).join('');
  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('.fish');
    if (!btn) return;
    const f = FISH[+btn.dataset.i];
    btn.classList.add('seen');
    if (f.puff) btn.classList.toggle('puffed');
    grid.querySelectorAll('.fish').forEach((b) => b.classList.toggle('sel', b === btn));
    btn.querySelector('span').textContent = '✓';
    say.textContent = f.say;
  });
}

/* ================= 选一选：第 5 段的关键句 ================= */
const PICKS = {
  birds: [
    { t: '西沙群岛也是鸟的天下。', ok: true, why: '✓ 全段都围绕这句话写' },
    { t: '岛上有一片片茂密的树林，树林里栖息着各种海鸟。', ok: false, why: '写鸟多，是在说明那一句' },
    { t: '遍地都是鸟蛋。', ok: false, why: '写蛋多，是在说明那一句' },
    { t: '树下堆积着一层厚厚的鸟粪，这是非常宝贵的肥料。', ok: false, why: '写鸟粪，是在说明那一句' },
  ],
};

/* ================= 小练笔 ================= */
const MOMENTS = [
  {
    name: '鱼群', pic: 'yu',
    prompt: '课本第一幅图：一大群黄色的鱼在珊瑚丛中游。先用一句话说清图意，再写具体。',
    hint: '可以这样开头：“珊瑚丛中，一大群黄色的小鱼正在游玩。”接着写它们的样子、怎样游。',
    example: '珊瑚丛中，一大群黄色的小鱼正在游玩。它们身上有黑色的条纹，尾巴一摆一摆的。有的在珊瑚中间钻来钻去，有的停下来啄啄岩石，好像在找吃的。',
  },
  {
    name: '海底', pic: 'haidi',
    prompt: '课本的图里还有小丑鱼和海龟。选一种，围绕一句话写几句话。',
    hint: '先写一句总的话，比如“海龟在海底慢悠悠地散步。”再写它的样子和动作。',
    example: '海龟在海底慢悠悠地散步。它的背上驮着一个大大的硬壳，壳上有一块块花纹。四只脚像船桨一样，轻轻一划，就游出去好远。',
  },
  {
    name: '海鸟', pic: 'haidao',
    prompt: '课本最后一幅图：许多海鸥在海面上飞。围绕一句话写一写。',
    hint: '可以用“海面上热闹极了。”开头，再写海鸥怎样飞、怎样叫。',
    example: '海面上热闹极了。一群群海鸥张开雪白的翅膀，有的贴着浪花飞，有的冲上蓝天，还有的一头扎进水里，叼起一条小鱼。',
  },
];

/* ================= 接入通用引擎（../shared/deck.js） ================= */
window.LESSON = {
  init() {
    Narrative.init({ picks: PICKS, moments: MOMENTS });
    initZones();
    initSeabed();
    initSortList(document.getElementById('sortList'), SEA_SORT, ['珊瑚', '海参', '大龙虾']);
    initSortList(document.getElementById('sortList2'), RICH_SORT, ['风景优美', '物产丰富'], 'sort-row2');
    initFish();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
