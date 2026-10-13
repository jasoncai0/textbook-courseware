'use strict';
/* 说和做 · 本课数据与本课独有的“说与做的天平”。通用互动见 ../shared/narrative.js */

/* 天平：k 是放到哪一边（说 / 做），w 是分量（“没有说”分量为 0） */
const MODES = [
  {
    cap: '学者：做了再说，做了不说——天平一头沉。',
    items: [
      { t: '从唐诗下手，几年辛苦，凝结而成《唐诗杂论》', k: '做', w: 1 },
      { t: '由唐诗转到楚辞，十年艰辛，一部《校补》赫然而出', k: '做', w: 1 },
      { t: '又向“古典新义”迈进', k: '做', w: 1 },
      { t: '他并没有先“说”', k: '说', w: 0 },
      { t: '“做”了，他自己也没有“说”', k: '说', w: 0 },
      { t: '别人在赞美，在惊叹，而闻一多先生个人呢，也没有“说”', k: '说', w: 0 },
    ],
  },
  {
    cap: '民主战士：说了就做——言论与行动完全一致，天平持平。',
    items: [
      { t: '起先小声说，后来向全国人民呼喊', k: '说', w: 1 },
      { t: '“讲话定要讲个痛快！”', k: '说', w: 1 },
      { t: '“你们站出来！你们站出来！”', k: '说', w: 1 },
      { t: '“前脚跨出大门，后脚就不准备再跨进大门。”', k: '说', w: 1 },
      { t: '起稿一张政治传单', k: '做', w: 1 },
      { t: '在群众大会上大骂特务', k: '做', w: 1 },
      { t: '走到游行示威队伍的前头，昂首挺胸', k: '做', w: 1 },
      { t: '以宝贵的生命，实证了他的“言”和“行”', k: '做', w: 1 },
    ],
  },
];
const DEG_PER_WEIGHT = 6;
const MAX_DEG = 18;
const PIVOT = { x: 300, y: 70 };
const ARM = 200;
const HANG = 120;
let mode = 0;
const placed = [new Set(), new Set()];

function panSvg(x, y, side, list) {
  const blocks = list.map((it, i) => (it.w
    ? `<rect x="${x - 50 + (i % 4) * 25}" y="${y - 18 - Math.floor(i / 4) * 18}" width="23" height="16" rx="3" fill="${side === '说' ? '#b0472c' : '#2f3d52'}"/>`
    : `<text class="t-s t-c" x="${x}" y="${y - 8 - i * 14}" fill="#8a7f70">（没有说）</text>`)).join('');
  return `<line x1="${x - 60}" y1="${y - HANG}" x2="${x - 60}" y2="${y}" stroke="#7d6e5a" stroke-width="2"/>
    <line x1="${x + 60}" y1="${y - HANG}" x2="${x + 60}" y2="${y}" stroke="#7d6e5a" stroke-width="2"/>
    <path d="M${x - 72} ${y} q72 38 144 0 Z" fill="#e9dcc2" stroke="#7d6e5a" stroke-width="2"/>
    ${blocks}<text class="t-l t-c" x="${x}" y="${y + 52}" fill="${side === '说' ? '#b0472c' : '#2f3d52'}">${side}</text>`;
}

function drawScale() {
  const items = MODES[mode].items.filter((_, i) => placed[mode].has(i));
  const say = items.filter((it) => it.k === '说');
  const act = items.filter((it) => it.k === '做');
  const weight = (l) => l.reduce((s, it) => s + it.w, 0);
  const deg = Math.max(-MAX_DEG, Math.min(MAX_DEG, (weight(act) - weight(say)) * DEG_PER_WEIGHT));
  const rad = deg * Math.PI / 180;
  const lx = PIVOT.x - ARM * Math.cos(rad);
  const ly = PIVOT.y - ARM * Math.sin(rad);
  const rx = PIVOT.x + ARM * Math.cos(rad);
  const ry = PIVOT.y + ARM * Math.sin(rad);
  document.getElementById('scale').innerHTML = `
    <rect x="285" y="70" width="30" height="230" fill="#8a6a44"/><rect x="220" y="300" width="160" height="22" rx="6" fill="#6b5034"/>
    <line x1="${lx.toFixed(1)}" y1="${ly.toFixed(1)}" x2="${rx.toFixed(1)}" y2="${ry.toFixed(1)}" stroke="#5a4630" stroke-width="10" stroke-linecap="round"/>
    <circle cx="${PIVOT.x}" cy="${PIVOT.y}" r="12" fill="#c08a3e"/>
    ${panSvg(lx, ly + HANG, '说', say)}${panSvg(rx, ry + HANG, '做', act)}`;
  const all = placed[mode].size === MODES[mode].items.length;
  document.getElementById('scaleCap').textContent = all ? MODES[mode].cap : `已放上 ${placed[mode].size} / ${MODES[mode].items.length} 件`;
}

function drawItems() {
  document.getElementById('scaleItems').innerHTML = MODES[mode].items.map((it, i) =>
    `<button type="button" class="item${placed[mode].has(i) ? ` in k-${it.k === '说' ? 'say' : 'do'}` : ''}" data-i="${i}">${it.t}${placed[mode].has(i) ? `<small>→ ${it.k}</small>` : ''}</button>`).join('');
  document.querySelectorAll('#modeBtns .btn').forEach((b, k) => b.classList.toggle('solid', k === mode));
  drawScale();
}

function initScale() {
  document.getElementById('modeBtns').addEventListener('click', (e) => {
    const b = e.target.closest('[data-mode]');
    if (b) { mode = +b.dataset.mode; drawItems(); }
  });
  document.getElementById('scaleItems').addEventListener('click', (e) => {
    const b = e.target.closest('.item');
    if (!b) return;
    const i = +b.dataset.i;
    if (placed[mode].has(i)) placed[mode].delete(i); else placed[mode].add(i);
    drawItems();
  });
  drawItems();
}

/* 细节卡 */
const CLUE_LABELS = ['细节', '看到的闻一多'];
const CLUES = [
  { q: '闻先生也总是头发凌乱，他是无暇及此。', a: '专心学问，顾不上打理自己——像晚年“一月不梳头”的杜甫。' },
  { q: '闻先生的书桌，零乱不堪，众物腾怨……“秩序不在我的范围以内。”', a: '心思全在研究上；“众物腾怨”把物拟人，写得幽默。' },
  { q: '饭，几乎忘记了吃，他贪的是精神食粮；夜间睡得很少……', a: '废寝忘食，把读书当作最大的满足。' },
  { q: '一个又一个大的四方竹纸本子，写满了密密麻麻的小楷，如群蚁排衙。', a: '日积月累、一丝不苟——成果是一笔一画“做”出来的。' },
  { q: '在情况紧急的生死关头，他走到游行示威队伍的前头，昂首挺胸，长须飘飘。', a: '大无畏，视死如归；外貌写出了精神。' },
  { q: '“此身别无长处，既然有一颗心，有一张嘴，讲话定要讲个痛快！”', a: '坦荡、刚烈，敢说真话。' },
];

/* 诗化语言：原句 / 大白话 */
const POETIC = [
  { o: '仰之弥高，越高，攀得越起劲；钻之弥坚，越坚，钻得越锲而不舍。', p: '他越研究越觉得学问深，越深越有劲头，一直坚持下去。', why: '引用《论语》，两句对称、反复，节奏像登山凿石，一步紧似一步。' },
  { o: '他要给我们衰微的民族开一剂救济的文化药方。', p: '他想通过研究古代文化来帮助国家。', why: '比喻：民族“衰微”像病人，研究是开“药方”——写出他做学问的目的和胸怀。' },
  { o: '深宵灯火是他的伴侣，因它大开光明之路，“漂白了四壁”。', p: '他经常在灯下工作到深夜。', why: '拟人 + 引用闻一多诗句：灯火成了“伴侣”，孤独的夜读变得温暖而明亮。' },
  { o: '他潜心贯注，心会神凝，成了“何妨一下楼”的主人。', p: '他很专心，很少下楼。', why: '四字短语连用，凝练有节奏；借别人的戏称写出他的专注，略带幽默。' },
];

function initPoetic() {
  const box = document.getElementById('poetic');
  box.innerHTML = POETIC.map((s, i) => `<div class="pz-row" data-i="${i}">
    <p class="pz-s">${s.o}</p><button type="button" class="btn">换成大白话</button><p class="pz-why">${s.why}</p></div>`).join('');
  box.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;
    const row = btn.closest('.pz-row');
    const s = POETIC[+row.dataset.i];
    const plain = row.classList.toggle('plain');
    row.querySelector('.pz-s').textContent = plain ? s.p : s.o;
    btn.textContent = plain ? '还原原句' : '换成大白话';
    row.classList.add('seen');
  });
}

const MOMENTS = [
  {
    name: '我的好朋友', pic: 'xiaokai',
    prompt: '写作实践一：以《我的好朋友》为题，写一个 200 字左右的片段，重点写出他的性格和精神气质。',
    hint: '选一个最能代表他的细节（一个习惯动作、一句口头禅、一样随身物品），用外貌、动作、语言写出来。',
    example: '阿杰的铅笔盒里永远只有一支铅笔，削得短短的，握都握不住了还在用。我笑他小气，他把铅笔头往笔帽里一插，接长了接着写：“还能写三天呢。”可上周班里募捐，他把攒了一学期的零花钱全投了进去，眼睛都没眨一下。',
  },
  {
    name: '再补充一个事例', pic: 'youxing',
    prompt: '积累拓展四：查阅资料，为课文再补充一件体现闻一多“说”和“做”特点的事，用一两句话写出来。',
    hint: '先查资料，再想：这件事属于“做了再说”“做了不说”，还是“说了就做”？',
    example: '例如：《最后一次讲演》——李公朴被害后，闻一多在追悼会上拍案而起、当众痛斥特务，当天下午就遭特务暗杀，用生命兑现了“后脚就不准备再跨进大门”。这正是“说了就做”。',
  },
  {
    name: '仿写一句“诗”', pic: 'denghuo',
    prompt: '学课文的写法，用比喻或拟人，写一写你熟悉的一个人怎样学习或工作。',
    hint: '可以仿“深宵灯火是他的伴侣”：把一样物件当作人来写。',
    example: '那本翻卷了边的字典是外婆的老朋友，陪她认识了一个又一个新字，也陪她熬过了一个又一个学认字的夜晚。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: CLUE_LABELS, moments: MOMENTS });
    initScale();
    initPoetic();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
