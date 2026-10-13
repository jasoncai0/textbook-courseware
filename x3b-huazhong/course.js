'use strict';
/* 花钟（三下 13）· 本课数据与互动。分类、选一选见 ../shared/narrative.js，背诵挖空见 ../shared/poem.js */

/* 第 1 段：九种花（时间以课文为准；h 为 24 小时制） */
const FLOWERS = [
  { h: 4, name: '牵牛花', when: '凌晨四点', say: '牵牛花吹起了紫色的小喇叭', open: '吹起了紫色的小喇叭', color: '#8e5cc8' },
  { h: 5, name: '蔷薇', when: '五点左右', say: '艳丽的蔷薇绽开了笑脸', open: '绽开了笑脸', color: '#f07fa0' },
  { h: 7, name: '睡莲', when: '七点', say: '睡莲从梦中醒来', open: '从梦中醒来', color: '#f5b8cc' },
  { h: 12, name: '午时花', when: '中午十二点左右', say: '午时花开花了', open: '开花了', color: '#e8433a' },
  { h: 15, name: '万寿菊', when: '下午三点', say: '万寿菊欣然怒放', open: '欣然怒放', color: '#f39a1e' },
  { h: 17, name: '紫茉莉', when: '下午五点', say: '紫茉莉苏醒过来', open: '苏醒过来', color: '#c2389a' },
  { h: 19, name: '月光花', when: '七点左右', say: '月光花在七点左右舒展开自己的花瓣', open: '舒展开自己的花瓣', color: '#f4f1de' },
  { h: 20, name: '夜来香', when: '晚上八点', say: '夜来香在晚上八点开花', open: '开花', color: '#e9e08a' },
  { h: 21, name: '昙花', when: '九点左右', say: '昙花却在九点左右含笑一现', open: '含笑一现', color: '#ffffff' },
];
const C = 220; // 钟面圆心
const RING_IN = 92;
const RING_OUT = 138;

const part = (h) => (h < 5 ? '凌晨' : h < 9 ? '早上' : h < 12 ? '上午' : h === 12 ? '中午' : h < 18 ? '下午' : '晚上');
const label = (h) => `${part(h)} ${h % 12 || 12} 点`;
const sky = (h) => (h >= 7 && h <= 16 ? 'day' : h >= 4 && h <= 6 ? 'dawn' : h >= 17 && h <= 18 ? 'dusk' : 'night');
const polar = (h, r) => {
  const a = ((h % 12) / 12) * Math.PI * 2;
  return [C + r * Math.sin(a), C - r * Math.cos(a)];
};

function flowerG(f, i) {
  const [x, y] = polar(f.h, f.h <= 12 ? RING_IN : RING_OUT);
  const petals = Array.from({ length: 6 }, (_, k) => `<ellipse cx="0" cy="-11" rx="6" ry="11" transform="rotate(${k * 60})" fill="${f.color}" stroke="rgba(0,0,0,.18)"/>`).join('');
  return `<g class="fl" data-i="${i}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">
    <g class="bloom">${petals}<circle r="6" fill="#f6d04d"/></g>
    <g class="bud"><ellipse rx="6" ry="10" fill="#6aa760"/><path d="M0 -10 q5 6 0 12" fill="${f.color}"/></g>
    <text class="fl-name" y="${f.h <= 12 ? 40 : -26}" text-anchor="middle">${f.name}</text></g>`;
}

function buildClock() {
  const nums = Array.from({ length: 12 }, (_, k) => {
    const [x, y] = polar(k + 1, 184);
    return `<text class="num" x="${x.toFixed(1)}" y="${(y + 7).toFixed(1)}" text-anchor="middle">${k + 1}</text>`;
  }).join('');
  const ticks = Array.from({ length: 60 }, (_, k) => `<line x1="${C}" y1="${C - 206}" x2="${C}" y2="${C - (k % 5 ? 200 : 194)}" transform="rotate(${k * 6} ${C} ${C})" stroke="#7a6a52" stroke-width="${k % 5 ? 1 : 2.5}"/>`).join('');
  document.getElementById('clock').innerHTML = `
    <circle class="face" cx="${C}" cy="${C}" r="212"/>
    <circle cx="${C}" cy="${C}" r="${RING_OUT}" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="44"/>
    <circle cx="${C}" cy="${C}" r="${RING_IN}" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="44"/>
    ${ticks}${nums}
    <g class="sunmoon"><circle class="sun" cx="${C}" cy="${C + 58}" r="15" fill="#f6c142"/><path class="moon" d="M${C + 6} ${C + 44} a15 15 0 1 0 0 28 a11 11 0 1 1 0 -28 Z" fill="#f3efd2"/></g>
    ${FLOWERS.map(flowerG).join('')}
    <g id="hand"><line x1="${C}" y1="${C + 14}" x2="${C}" y2="${C - 120}" stroke="#4a2e1a" stroke-width="9" stroke-linecap="round"/></g>
    <line class="minute" x1="${C}" y1="${C}" x2="${C}" y2="${C - 170}" stroke="#4a2e1a" stroke-width="3.5" stroke-linecap="round" opacity=".55"/>
    <circle cx="${C}" cy="${C}" r="10" fill="#4a2e1a"/>`;
}

function showHour(h) {
  const svg = document.getElementById('clock');
  svg.dataset.sky = sky(h);
  document.getElementById('hand').style.transform = `rotate(${(h % 12) * 30 + (h >= 12 ? 360 : 0)}deg)`;
  document.getElementById('hRange').value = h;
  svg.querySelectorAll('.fl').forEach((g) => {
    const f = FLOWERS[+g.dataset.i];
    g.classList.toggle('open', f.h <= h);
    g.classList.toggle('now', f.h === h);
  });
  document.querySelectorAll('#strip .chip').forEach((c) => c.classList.toggle('red', +c.dataset.h === h));
  const f = FLOWERS.find((x) => x.h === h);
  const nextF = FLOWERS.find((x) => x.h > h);
  document.getElementById('nowCard').innerHTML = f
    ? `<p class="now-time">${label(h)}</p><p class="now-name" style="--fc:${f.color}">${f.name}</p>
       <p class="now-say">${f.say.replace(f.open, `<em>${f.open}</em>`)}</p><small>课文：${f.when}</small>`
    : `<p class="now-time">${label(h)}</p><p class="now-none">这个时候，没有新的花开放。</p>
       <small>${nextF ? `往后拨，下一朵是${nextF.name}。` : '花钟上的花都开过了，第二天凌晨再来看吧。'}</small>`;
}

function initClock() {
  buildClock();
  const range = document.getElementById('hRange');
  const go1 = (d) => showHour(Math.max(0, Math.min(23, +range.value + d)));
  range.addEventListener('input', () => showHour(+range.value));
  document.getElementById('hPrev').addEventListener('click', () => go1(-1));
  document.getElementById('hNext').addEventListener('click', () => go1(1));
  document.getElementById('clock').addEventListener('click', (e) => {
    const g = e.target.closest('.fl');
    if (g) showHour(FLOWERS[+g.dataset.i].h);
  });
  const strip = document.getElementById('strip');
  strip.innerHTML = FLOWERS.map((x) => `<button type="button" class="chip" data-h="${x.h}">${x.h % 12 || 12} 点 ${x.name}</button>`).join('');
  strip.addEventListener('click', (e) => {
    const c = e.target.closest('[data-h]');
    if (c) showHour(+c.dataset.h);
  });
  showHour(4);
}

/* 第 2 段：昙花什么时候开 */
const TAN = {
  day: { say: '白天阳光强，气温高，空气干燥，要是在白天开花，就有被灼伤的危险。', ok: false },
  nine: { say: '对了！它适应了晚上九点左右的温度和湿度，便悄悄绽开淡雅的花蕾，向人们展示美丽的笑脸。', ok: true },
  deep: { say: '深夜气温过低，开花也不适宜。', ok: false },
};

function buildTan() {
  document.getElementById('tanSvg').innerHTML = `
    <rect class="tan-sky" width="520" height="250" rx="12"/>
    <circle class="tan-sun" cx="440" cy="60" r="30" fill="#f6c142"/>
    <path class="tan-moon" d="M446 36 a26 26 0 1 0 0 50 a20 20 0 1 1 0 -50 Z" fill="#f3efd2"/>
    <g class="thermo"><rect x="40" y="40" width="22" height="150" rx="11" fill="#fff" stroke="#9a8f80"/><circle cx="51" cy="198" r="18" fill="#e04b3a"/>
      <rect class="merc" x="45" y="60" width="12" height="134" fill="#e04b3a"/><text class="t-m" x="74" y="56" fill="currentColor">气温</text></g>
    <path d="M260 240 V150" stroke="#4f8a4a" stroke-width="7"/><ellipse cx="226" cy="200" rx="34" ry="12" fill="#5f9a55" transform="rotate(-20 226 200)"/><ellipse cx="294" cy="190" rx="34" ry="12" fill="#5f9a55" transform="rotate(20 294 190)"/>
    <g class="tan-bud"><ellipse cx="260" cy="128" rx="16" ry="30" fill="#d9e6c8" stroke="#8fb07a"/></g>
    <g class="tan-open">${Array.from({ length: 10 }, (_, k) => `<ellipse cx="260" cy="88" rx="11" ry="40" transform="rotate(${k * 36} 260 128)" fill="#fff" stroke="#d8e0d0"/>`).join('')}<circle cx="260" cy="128" r="12" fill="#f3e9a8"/></g>
    <g class="tan-burn"><path d="M232 104 l10 10 M288 104 l-10 10 M260 92 v12" stroke="#c0392b" stroke-width="4"/></g>`;
}

function initTan() {
  buildTan();
  const svg = document.getElementById('tanSvg');
  document.querySelector('.tan-btns').addEventListener('click', (e) => {
    const b = e.target.closest('[data-t]');
    if (!b) return;
    const t = TAN[b.dataset.t];
    svg.setAttribute('class', `tan-${b.dataset.t}`);
    document.querySelectorAll('.tan-btns .btn').forEach((x) => x.classList.toggle('solid', x === b));
    const say = document.getElementById('tanSay');
    say.textContent = t.say;
    say.className = `tip tan-say ${t.ok ? 'ok' : 'no'}`;
  });
}

/* 选一选：关键句、看花猜时间 */
const PICKS = {
  key1: [
    { t: '鲜花朵朵，争奇斗艳，芬芳迷人。', ok: false, why: '这是开头，写花很美' },
    { t: '要是我们留心观察，就会发现，一天之内，不同的花开放的时间是不同的。', ok: true, why: '对！这句提示了这段的主要意思' },
    { t: '凌晨四点，牵牛花吹起了紫色的小喇叭；', ok: false, why: '只写了一种花' },
    { t: '下午三点，万寿菊欣然怒放；', ok: false, why: '只写了一种花' },
    { t: '昙花却在九点左右含笑一现……', ok: false, why: '只写了一种花' },
  ],
  q1: [{ t: '早上五点', ok: false, why: '那是蔷薇' }, { t: '下午五点', ok: true, why: '对！' }, { t: '晚上九点', ok: false, why: '那是昙花' }],
  q2: [{ t: '早上七点', ok: true, why: '对！' }, { t: '中午十二点', ok: false, why: '那是午时花' }, { t: '晚上八点', ok: false, why: '那是夜来香' }],
  q3: [{ t: '凌晨四点', ok: false, why: '那是牵牛花' }, { t: '下午三点', ok: false, why: '那是万寿菊' }, { t: '晚上九点左右', ok: true, why: '对！' }],
};

/* 课后第 3 题：开放的说法 */
const KINDS = ['比作别的东西', '当作人来写', '直接说'];
const SORT_ITEMS = [
  { s: '牵牛花吹起了紫色的小喇叭', ok: ['比作别的东西', '当作人来写'], q: '把花比作小喇叭，还会“吹”' },
  { s: '艳丽的蔷薇绽开了笑脸', ok: ['当作人来写'], q: '像人一样笑' },
  { s: '睡莲从梦中醒来', ok: ['当作人来写'], q: '像人睡醒了' },
  { s: '午时花开花了', ok: ['直接说'], q: '直接说开花' },
  { s: '万寿菊欣然怒放', ok: ['当作人来写'], q: '欣然：高兴地，像人一样' },
  { s: '紫茉莉苏醒过来', ok: ['当作人来写'], q: '像人醒过来' },
  { s: '月光花舒展开自己的花瓣', ok: ['当作人来写', '直接说'], q: '像人伸懒腰，舒展开' },
  { s: '昙花含笑一现', ok: ['当作人来写'], q: '像人微微一笑' },
];

/* 背诵第 1 段 */
const POEMS = {
  p1: {
    title: '花钟 · 第 1 自然段', author: '课后第 1 题',
    lines: [
      { t: '鲜花朵朵，争奇斗艳，芬芳迷人。' },
      { t: '要是我们留心观察，就会发现，一天之内，不同的花开放的时间是不同的。' },
      { t: '凌晨四点，牵牛花吹起了紫色的小喇叭；' },
      { t: '五点左右，艳丽的蔷薇绽开了笑脸；' },
      { t: '七点，睡莲从梦中醒来；' },
      { t: '中午十二点左右，午时花开花了；' },
      { t: '下午三点，万寿菊欣然怒放；' },
      { t: '下午五点，紫茉莉苏醒过来；' },
      { t: '月光花在七点左右舒展开自己的花瓣；' },
      { t: '夜来香在晚上八点开花；' },
      { t: '昙花却在九点左右含笑一现。' },
    ],
  },
};
Poem.render(POEMS);

/* 小练笔 */
const MY = [
  { name: '向日葵', prompt: '向日葵什么时候开？它总是朝着太阳，像在做什么？', example: '清晨，向日葵抬起金黄的笑脸，一整天都追着太阳转，像一个个跟着老师走的小学生。' },
  { name: '蝴蝶兰', prompt: '蝴蝶兰的花像什么？它开放的时候像在做什么？', example: '春天，蝴蝶兰轻轻展开翅膀，一朵朵像停在枝头的蝴蝶，好像随时要飞走。' },
  { name: '牡丹花', prompt: '牡丹花又大又艳，它开放的样子像谁？', example: '四月，牡丹花穿上了层层叠叠的花裙子，大大方方地向人们点头微笑。' },
  { name: '我喜欢的花', prompt: '写一种你观察过的花：时间 + 花 + 开放的说法。', example: '傍晚，院子里的喇叭花收起了小喇叭，悄悄地睡着了。' },
];

function initMyWrite() {
  const $ = (id) => document.getElementById(id);
  const show = (i) => {
    document.querySelectorAll('#flBtns .btn').forEach((b, k) => b.classList.toggle('solid', k === i));
    $('flPrompt').textContent = MY[i].prompt;
    $('flExampleText').textContent = `示例：${MY[i].example}`;
    $('flExampleText').hidden = true;
  };
  $('flBtns').innerHTML = MY.map((m, i) => `<button class="btn" type="button" data-i="${i}">${m.name}</button>`).join('');
  $('flBtns').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-i]');
    if (b) show(+b.dataset.i);
  });
  $('flExample').addEventListener('click', () => { $('flExampleText').hidden = false; });
  show(0);
}

function initCells() {
  document.addEventListener('click', (e) => {
    const cell = e.target.closest('.cell');
    if (cell) cell.classList.toggle('open');
  });
}

window.LESSON = {
  init() {
    Narrative.init({ picks: PICKS, kinds: KINDS, sort: SORT_ITEMS });
    Poem.init();
    initClock();
    initTan();
    initMyWrite();
    initCells();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
