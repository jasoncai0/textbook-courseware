'use strict';
/* 青蛙卖泥塘 · 本课数据与互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：① 泥塘建设图（撒草籽—长草—竹管引水—灌满水—栽树种花修路盖房，读到哪建到哪）；② 小动物角色卡；③ 吆喝推荐；④ 播撒草籽识字游戏 */

/* 二下课文只给生字注音：data-pyk="烂:làn" → 按顺序给这些字注音，其余字上面空着（与课本一致） */
document.querySelectorAll('[data-pyk]').forEach((el) => {
  const want = el.dataset.pyk.trim().split(/\s+/).filter(Boolean).map((s) => s.split(':'));
  let k = 0;
  const syl = [...el.textContent].filter((ch) => /\p{Script=Han}/u.test(ch))
    .map((ch) => (k < want.length && ch === want[k][0] ? want[k++][1] : '_'));
  if (k < want.length) console.warn(`注音字没找到：${want[k][0]}（${el.textContent}）`); // eslint-disable-line no-console
  el.dataset.py = syl.join(' ');
});

/* ---------- 泥塘建设图：layer 的值是 data-step（数字）、'show'（一开始就有）或省略（没有） ---------- */
const POND_STAGES = {
  a: { seeds: 1, grass: 2, pipe: 4, water: 5 },
  b: { grass: 'show', water: 'show', pipe: 'show', trees: 6, flowers: 6, road: 6, house: 6, critters: 6 },
};
const tree = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-7" y="-10" width="14" height="44" rx="4" fill="#8a5a32"/><circle cy="-34" r="34" fill="#4f9a45"/><circle cx="-22" cy="-16" r="22" fill="#5aa84d"/><circle cx="22" cy="-18" r="24" fill="#5aa84d"/></g>`;
const flower = (x, y, c) => `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map((a) => `<circle cx="${(7 * Math.cos((a * Math.PI) / 180)).toFixed(1)}" cy="${(7 * Math.sin((a * Math.PI) / 180)).toFixed(1)}" r="6" fill="${c}"/>`).join('')}<circle r="4" fill="#f6d34a"/></g>`;
const LAYERS = {
  seeds: () => [[150, 250], [220, 400], [520, 260], [600, 400], [90, 330], [420, 410], [680, 330], [300, 240]].map(([x, y], i) => `<circle class="nt-seed" cx="${x}" cy="${y}" r="4" style="--d:${i * 0.12}s"/>`).join(''),
  grass: () => `<path d="M0 196Q200 186 400 196T800 194V450H0Z" fill="#9fd06f"/>${[[60, 260], [160, 410], [250, 245], [470, 255], [560, 410], [700, 280], [90, 390], [640, 360]].map(([x, y]) => `<path d="M${x - 10} ${y}l4 -16l4 12l4 -18l4 14l4 -12l2 20Z" fill="#6fb04a"/>`).join('')}`,
  pipe: () => '<path class="nt-bamboo" d="M108 158L170 214L232 274L262 298"/><path class="nt-node" d="M136 176l8 8M196 236l8 8M244 280l8 8"/><path class="nt-flow" d="M108 158L170 214L232 274L262 298"/>',
  water: () => '<ellipse cx="330" cy="330" rx="184" ry="56" fill="#6fb8de"/><ellipse cx="300" cy="316" rx="90" ry="14" fill="#a8dbf2" opacity=".8"/>',
  road: () => '<path d="M500 384Q650 330 718 198L746 198Q676 350 528 404Z" fill="#ecd7a4"/>',
  trees: () => `<g class="nt-pop" style="--d:0s">${tree(88, 300)}</g><g class="nt-pop" style="--d:.3s">${tree(250, 214, .8)}</g><g class="nt-pop" style="--d:.6s">${tree(560, 236, .9)}</g>`,
  flowers: () => `<g class="nt-pop" style="--d:1s">${[[150, 405, '#f07a9a'], [176, 418, '#f9b233'], [130, 425, '#b07ae0'], [460, 412, '#f07a9a'], [486, 420, '#ffffff'], [60, 380, '#f9b233'], [610, 410, '#f07a9a']].map(([x, y, c]) => flower(x, y, c)).join('')}</g>`,
  house: () => '<g class="nt-pop" style="--d:1.8s"><rect x="620" y="282" width="80" height="58" fill="#fff4dc" stroke="#b07a4a" stroke-width="3"/><path d="M608 286L660 246L712 286Z" fill="#d9534a"/><rect x="650" y="306" width="20" height="34" fill="#b07a4a"/><rect x="680" y="298" width="14" height="14" fill="#9fd2f0"/></g>',
  critters: () => '<g class="nt-pop" style="--d:2.4s"><g class="nt-bfly"><ellipse cx="-6" rx="7" ry="5" fill="#f3a3c8"/><ellipse cx="6" rx="7" ry="5" fill="#f3a3c8"/></g><text x="96" y="248" font-size="26">🐦</text></g>',
};
function pondSvg(stage) {
  const cfg = POND_STAGES[stage];
  const layer = (k) => {
    if (cfg[k] === undefined) return '';
    const st = cfg[k] === 'show' ? '' : ` data-step="${cfg[k]}"`;
    return `<g class="nt-l nt-${k}"${st}>${LAYERS[k]()}</g>`;
  };
  return `<svg viewBox="0 0 800 450" aria-label="泥塘建设图">
    <rect width="800" height="450" fill="#dff0fb"/>
    <path d="M0 200Q120 90 260 170Q330 120 420 190L800 190V260H0Z" fill="#c6d6b3"/>
    <circle cx="106" cy="154" r="9" fill="#7cc4e6"/>
    <g fill="#c8ccd8"><rect x="700" y="150" width="24" height="44"/><rect x="728" y="132" width="20" height="62"/><rect x="752" y="160" width="30" height="34"/></g>
    <rect y="190" width="800" height="260" fill="#b98d5e"/>
    ${layer('grass')}${layer('seeds')}${layer('road')}
    <ellipse cx="330" cy="330" rx="192" ry="62" fill="#7a5a3a"/><ellipse cx="350" cy="340" rx="70" ry="16" fill="#8f7a58"/>
    ${layer('water')}${layer('pipe')}${layer('trees')}${layer('flowers')}${layer('house')}
    <g transform="translate(520 300)"><rect x="-4" y="-60" width="8" height="64" fill="#8a5a32"/><rect x="-40" y="-92" width="80" height="36" rx="4" fill="#d9a766" stroke="#8a5a32" stroke-width="3"/><text y="-66" class="nt-signt">卖泥塘</text></g>
    <g transform="translate(470 318)"><ellipse rx="26" ry="20" fill="#5cb85c"/><ellipse cy="6" rx="16" ry="11" fill="#eaf6d8"/><circle cx="-12" cy="-18" r="9" fill="#5cb85c"/><circle cx="12" cy="-18" r="9" fill="#5cb85c"/><circle cx="-12" cy="-19" r="4" fill="#222"/><circle cx="12" cy="-19" r="4" fill="#222"/><path d="M-10 -4Q0 4 10 -4" fill="none" stroke="#2e6b2e" stroke-width="2.5"/><path d="M-6 6L0 12L6 6" fill="#d9534a"/></g>
    ${layer('critters')}
  </svg>`;
}
document.querySelectorAll('[data-pond]').forEach((el) => { el.innerHTML = pondSvg(el.dataset.pond); });

Hanzi.init({
  shapes: {
    泉: ['M20 56C20 24 80 24 80 56', 'M20 56H80', 'M50 30V46', 'M50 56C46 70 54 80 48 94', 'M36 66L28 82', 'M64 66L72 82'],
    隹: ['M40 12L30 30', 'M30 30H76', 'M34 30V80', 'M52 30V80', 'M34 46H70', 'M34 62H70', 'M34 80H76'],
  },
  cards: [
    { z: '卖', py: 'mài', bs: '十', bh: 8, words: [['卖泥塘', 'mài ní táng'], ['买卖', 'mǎi mài']] },
    { z: '烂', py: 'làn', bs: '火', bh: 9, words: [['烂泥塘', 'làn ní táng'], ['灿烂', 'càn làn']] },
    { z: '牌', py: 'pái', bs: '片', bh: 12, words: [['牌子', 'pái zi'], ['招牌', 'zhāo pái']] },
    { z: '喝', py: 'hè', bs: '口', bh: 12, words: [['吆喝', 'yāo hè'], ['喝水', 'hē shuǐ']] },
    { z: '坑', py: 'kēng', bs: '土', bh: 7, words: [['水坑', 'shuǐ kēng'], ['土坑', 'tǔ kēng']] },
    { z: '舒', py: 'shū', bs: '舌', bh: 12, words: [['舒服', 'shū fu'], ['舒展', 'shū zhǎn']] },
    { z: '集', py: 'jí', bs: '隹', bh: 12, words: [['采集', 'cǎi jí'], ['集合', 'jí hé']] },
    { z: '籽', py: 'zǐ', bs: '米', bh: 9, words: [['草籽', 'cǎo zǐ'], ['菜籽', 'cài zǐ']] },
    { z: '播', py: 'bō', bs: '扌', bh: 15, words: [['播撒', 'bō sǎ'], ['播种', 'bō zhǒng']] },
    { z: '撒', py: 'sǎ', bs: '扌', bh: 15, words: [['播撒', 'bō sǎ'], ['撒种子', 'sǎ zhǒng zi']] },
    { z: '茵', py: 'yīn', bs: '艹', bh: 9, words: [['绿茵茵', 'lǜ yīn yīn'], ['绿茵', 'lǜ yīn']] },
    { z: '灌', py: 'guàn', bs: '氵', bh: 20, words: [['灌足', 'guàn zú'], ['灌溉', 'guàn gài']] },
    { z: '缺', py: 'quē', bs: '缶', bh: 10, words: [['缺少', 'quē shǎo'], ['缺条路', 'quē tiáo lù']] },
    { z: '泳', py: 'yǒng', bs: '氵', bh: 8, words: [['游泳', 'yóu yǒng'], ['泳衣', 'yǒng yī']] },
    { z: '愣', py: 'lèng', bs: '忄', bh: 12, words: [['愣住', 'lèng zhù'], ['发愣', 'fā lèng']] },
  ],
  evolve: [
    { z: '泉', note: '像水从山洞里流出来：上面是泉眼，下面是流出来的水。山里找到的“泉水”就是这样来的。' },
    { z: '集', old: ['隹', '木'], note: '上面的“隹”是一只短尾巴的鸟，下面是“木”。鸟儿聚到树上，就是“集”。采集草籽，就是把草籽收到一起。' },
  ],
  write: [
    { z: '蛙', py: 'wā', bs: '虫', bh: 12 },
    { z: '卖', py: 'mài', bs: '十', bh: 8 },
    { z: '搬', py: 'bān', bs: '扌', bh: 13 },
    { z: '倒', py: 'dào', bs: '亻', bh: 10 },
    { z: '籽', py: 'zǐ', bs: '米', bh: 9 },
    { z: '泉', py: 'quán', bs: '水', bh: 9 },
    { z: '破', py: 'pò', bs: '石', bh: 10 },
    { z: '应', py: 'yīng', bs: '广', bh: 7 },
  ],
});

/* ---------- 课后 1：小动物角色卡 ---------- */
const ROLES = [
  ['🐂', '老牛', '慢吞吞地', '这个水坑坑嘛，在里边打打滚倒挺舒服。不过，要是周围有些草就更好了。'],
  ['🦆', '野鸭', '看了看泥塘', '这地方好是好，就是塘里的水太少了。'],
  ['🐦', '小鸟', '飞来说', '青蛙，你这儿好是好，就是缺点儿树。'],
  ['🦋', '蝴蝶', '飞来说', '这里缺点儿花，有花我就来跳舞啦！'],
  ['🐰', '小兔', '跑来说', '这里还缺条路，有了路，大家才好来呀。'],
  ['🐒', '小猴', '跑来说', '这儿应该盖所房子，住着才舒服。'],
  ['🦊', '小狐狸', '想了想说', '……（你来编：小狐狸会说什么？）'],
];
function initRoles() {
  const box = document.getElementById('ntRoles');
  const say = document.getElementById('ntSay');
  box.innerHTML = ROLES.map(([e, n], i) => `<button type="button" class="nt-role" data-i="${i}"><span>${e}</span>${n}</button>`).join('');
  box.addEventListener('click', (ev) => {
    const b = ev.target.closest('.nt-role');
    if (!b) return;
    const [e, n, how, line] = ROLES[+b.dataset.i];
    box.querySelectorAll('.nt-role').forEach((x) => x.classList.toggle('on', x === b));
    say.innerHTML = `<span>${e}</span><p><small>${n}${how}：</small>“${line}”</p>`;
    say.classList.remove('pop'); void say.offsetWidth; say.classList.add('pop');
  });
}

/* ---------- 课后 2：连一连（先点动物，再点青蛙做的事） ---------- */
const LINKS = [['🐂 老牛', '播撒草籽'], ['🦆 野鸭', '引来泉水'], ['🐦 小鸟', '栽了树'], ['🦋 蝴蝶', '种了花'], ['🐰 小兔', '修了路'], ['🐒 小猴', '盖了房子']];
const DO_ORDER = [3, 0, 5, 1, 4, 2];
function initLink() {
  const who = document.getElementById('ntWho');
  const doBox = document.getElementById('ntDo');
  const svg = document.getElementById('ntLines');
  const wrap = document.getElementById('ntLink');
  who.innerHTML = LINKS.map(([w], i) => `<button type="button" class="nt-lk" data-i="${i}">${w}</button>`).join('');
  doBox.innerHTML = DO_ORDER.map((i) => `<button type="button" class="nt-lk" data-i="${i}">${LINKS[i][1]}</button>`).join('');
  let sel = null;
  const drawLines = () => {
    const r = wrap.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${r.width} ${r.height}`);
    svg.innerHTML = [...who.querySelectorAll('.nt-lk.ok')].map((a) => {
      const b = doBox.querySelector(`.nt-lk[data-i="${a.dataset.i}"]`);
      const ra = a.getBoundingClientRect();
      const rb = b.getBoundingClientRect();
      return `<line x1="${ra.right - r.left}" y1="${ra.top + ra.height / 2 - r.top}" x2="${rb.left - r.left}" y2="${rb.top + rb.height / 2 - r.top}"/>`;
    }).join('');
  };
  who.addEventListener('click', (e) => {
    const b = e.target.closest('.nt-lk:not(.ok)');
    if (!b) return;
    sel = b;
    who.querySelectorAll('.nt-lk').forEach((x) => x.classList.toggle('sel', x === b));
  });
  doBox.addEventListener('click', (e) => {
    const b = e.target.closest('.nt-lk:not(.ok)');
    if (!b || !sel) return;
    if (b.dataset.i !== sel.dataset.i) { b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong'); return; }
    sel.classList.remove('sel');
    sel.classList.add('ok');
    b.classList.add('ok');
    sel = null;
    drawLines();
    wrap.classList.toggle('done', who.querySelectorAll('.nt-lk.ok').length === LINKS.length);
  });
  new ResizeObserver(drawLines).observe(wrap);
}

/* ---------- 课后 3：推荐 ---------- */
const THINGS = [
  ['📖', '一本书', '书里的故事可有意思了', '你可以跟着主人公去冒险，还能认识好多新字'],
  ['✏️', '一支铅笔', '它写字又顺又滑', '你可以用它写字、画画，用完还能削一削'],
  ['🎒', '一个书包', '它又结实又轻巧', '你可以把书本、文具都装进去，背着上学可神气了'],
];
function initThings() {
  const box = document.getElementById('ntThings');
  const frame = document.getElementById('ntFrame');
  box.innerHTML = THINGS.map(([e, t], i) => `<button type="button" class="btn" data-i="${i}">${e} ${t}</button>`).join('');
  box.addEventListener('click', (ev) => {
    const b = ev.target.closest('.btn');
    if (!b) return;
    const [, t, good, use] = THINGS[+b.dataset.i];
    box.querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === b));
    frame.innerHTML = `<b>喊一声：</b>快来看看这${t.slice(1)}喽！<br><b>夸一夸：</b>${good}！<br><b>说好处：</b>${use}……<br><b>再补充：</b>（你接着说）`;
  });
}

/* ---------- 识字游戏：播撒草籽 ---------- */
const GAME = [['卖', 'mài'], ['烂', 'làn'], ['牌', 'pái'], ['喝', 'hè'], ['坑', 'kēng'], ['舒', 'shū'], ['集', 'jí'], ['籽', 'zǐ'],
  ['播', 'bō'], ['撒', 'sǎ'], ['茵', 'yīn'], ['灌', 'guàn'], ['缺', 'quē'], ['泳', 'yǒng'], ['愣', 'lèng']];
function initGame() {
  const field = document.getElementById('ntField');
  const msg = document.getElementById('ntGMsg');
  const draw = () => {
    field.innerHTML = GAME.map(([z, p], i) => `<button type="button" class="nt-sd" data-i="${i}"><span class="nt-z">${Hanzi.ruby(z, p)}</span><span class="nt-tuft" aria-hidden="true"></span></button>`).join('');
    msg.textContent = '长出了 0 丛草';
  };
  field.addEventListener('click', (e) => {
    const b = e.target.closest('.nt-sd:not(.grown)');
    if (!b) return;
    b.classList.add('grown');
    const n = field.querySelectorAll('.nt-sd.grown').length;
    msg.innerHTML = n === GAME.length ? '泥塘周围绿茵茵的啦！<button type="button" class="btn" id="ntAgain">再撒一次</button>' : `长出了 ${n} 丛草`;
    field.classList.toggle('green', n === GAME.length);
  });
  msg.addEventListener('click', (e) => { if (e.target.id === 'ntAgain') { field.classList.remove('green'); draw(); } });
  draw();
}

window.LESSON = {
  init() {
    Narrative.init({});
    initRoles();
    initLink();
    initThings();
    initGame();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
