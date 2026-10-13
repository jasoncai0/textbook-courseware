'use strict';
/* 荷叶圆圆 · 本课数据与互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：荷叶小舞台分角色演（角色上台、台词气泡、旁白）、连一连画线、“××圆圆的，××的”句子拼一拼、水珠滚进荷叶中间 */

const ROLES = {
  drop: { say: ['荷叶是我的摇篮。', 'hé yè shì wǒ de yáo lán'], narr: ['小水珠躺在荷叶上，眨着亮晶晶的眼睛。', 'xiǎo shuǐ zhū tǎng zài hé yè shàng zhǎ zhe liàng jīng jīng de yǎn jing'], name: ['小水珠', 'xiǎo shuǐ zhū'], thing: ['摇篮', 'yáo lán'] },
  fly: { say: ['荷叶是我的停机坪。', 'hé yè shì wǒ de tíng jī píng'], narr: ['小蜻蜓立在荷叶上，展开透明的翅膀。', 'xiǎo qīng tíng lì zài hé yè shàng zhǎn kāi tòu míng de chì bǎng'], name: ['小蜻蜓', 'xiǎo qīng tíng'], thing: ['停机坪', 'tíng jī píng'] },
  frog: { say: ['荷叶是我的歌台。', 'hé yè shì wǒ de gē tái'], narr: ['小青蛙蹲在荷叶上，呱呱地放声歌唱。', 'xiǎo qīng wā dūn zài hé yè shàng guā guā de fàng shēng gē chàng'], name: ['小青蛙', 'xiǎo qīng wā'], thing: ['歌台', 'gē tái'] },
  fish: { say: ['荷叶是我的凉伞。', 'hé yè shì wǒ de liáng sǎn'], narr: ['小鱼儿在荷叶下笑嘻嘻地游来游去。', 'xiǎo yú ér zài hé yè xià xiào xī xī de yóu lái yóu qù'], name: ['小鱼儿', 'xiǎo yú ér'], thing: ['凉伞', 'liáng sǎn'] },
};
/* 气泡位置（舞台上的百分比） */
const BUBBLE_AT = { drop: [50, 30], fly: [78, 22], frog: [28, 22], fish: [72, 80] };

Hanzi.init({
  shapes: {
    晶: ['M38 8H62V30H38Z', 'M38 19H62', 'M12 50H40V74H12Z', 'M12 62H40', 'M60 50H88V74H60Z', 'M60 62H88'],
    朵: ['M30 30Q30 10 50 10Q70 10 70 30', 'M30 30Q50 40 70 30', 'M50 40V94', 'M50 60L22 84', 'M50 60L78 84', 'M20 52H80'],
  },
  cards: [
    { z: '珠', py: 'zhū', bs: '王', bh: 10, words: [['水珠', 'shuǐ zhū'], ['珍珠', 'zhēn zhū']] },
    { z: '摇', py: 'yáo', bs: '扌', bh: 13, words: [['摇篮', 'yáo lán'], ['摇头', 'yáo tóu']] },
    { z: '躺', py: 'tǎng', bs: '身', bh: 15, words: [['躺在', 'tǎng zài'], ['躺下', 'tǎng xià']] },
    { z: '晶', py: 'jīng', bs: '日', bh: 12, words: [['亮晶晶', 'liàng jīng jīng'], ['水晶', 'shuǐ jīng']] },
    { z: '停', py: 'tíng', bs: '亻', bh: 11, words: [['停机坪', 'tíng jī píng'], ['停下', 'tíng xià']] },
    { z: '机', py: 'jī', bs: '木', bh: 6, words: [['飞机', 'fēi jī'], ['停机坪', 'tíng jī píng']] },
    { z: '展', py: 'zhǎn', bs: '尸', bh: 10, words: [['展开', 'zhǎn kāi'], ['展览', 'zhǎn lǎn']] },
    { z: '透', py: 'tòu', bs: '辶', bh: 10, words: [['透明', 'tòu míng'], ['透气', 'tòu qì']] },
    { z: '翅', py: 'chì', bs: '羽', bh: 10, words: [['翅膀', 'chì bǎng']] },
    { z: '膀', py: 'bǎng', bs: '月', bh: 14, words: [['翅膀', 'chì bǎng'], ['肩膀', 'jiān bǎng']] },
    { z: '唱', py: 'chàng', bs: '口', bh: 11, words: [['歌唱', 'gē chàng'], ['唱歌', 'chàng gē']] },
    { z: '朵', py: 'duǒ', bs: '木', bh: 6, words: [['一朵朵', 'yì duǒ duǒ'], ['花朵', 'huā duǒ']] },
  ],
  evolve: [
    { z: '晶', note: '三颗亮亮的星星（三个“日”）挤在一起闪闪发光——小水珠的眼睛“亮晶晶”。（帮助记字的说法）' },
    { z: '朵', note: '下面是树（木），上面是一团开着的花——树上开的一团团花就是“一朵朵”。（帮助记字的说法）' },
  ],
  write: [
    { z: '亮', py: 'liàng', bs: '亠', bh: 9 },
    { z: '机', py: 'jī', bs: '木', bh: 6 },
    { z: '台', py: 'tái', bs: '口', bh: 5 },
    { z: '放', py: 'fàng', bs: '攵', bh: 8 },
    { z: '鱼', py: 'yú', bs: '鱼', bh: 8 },
    { z: '朵', py: 'duǒ', bs: '木', bh: 6 },
    { z: '美', py: 'měi', bs: '⺷', bh: 9 },
  ],
});

/* ---------- 荷叶小舞台 ---------- */
function initTheatre() {
  const th = document.getElementById('theatre');
  const bubble = document.getElementById('bubble');
  const narr = document.getElementById('narr');
  const show = (r) => {
    th.classList.add(`on-${r}`);
    th.dataset.cur = r;
    th.querySelectorAll('.hy-role').forEach((b) => b.classList.toggle('cur', b.dataset.r === r));
    const [x, y] = BUBBLE_AT[r];
    bubble.style.left = `${x}%`;
    bubble.style.top = `${y}%`;
    bubble.innerHTML = Hanzi.ruby(...ROLES[r].say);
    narr.innerHTML = Hanzi.ruby(...ROLES[r].narr);
    [bubble, narr].forEach((el) => { el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); });
  };
  th.querySelector('.hy-roles').addEventListener('click', (e) => {
    const b = e.target.closest('.hy-role');
    if (b) show(b.dataset.r);
  });
  document.getElementById('allOn').addEventListener('click', () => {
    Object.keys(ROLES).forEach((r) => th.classList.add(`on-${r}`));
    th.dataset.cur = 'all';
    bubble.innerHTML = Hanzi.ruby('荷叶是我们的好朋友！', 'hé yè shì wǒ men de hǎo péng you');
    bubble.style.left = '50%';
    bubble.style.top = '30%';
    narr.innerHTML = Hanzi.ruby('荷叶圆圆的，绿绿的。', 'hé yè yuán yuán de lǜ lǜ de');
  });
}

/* ---------- 连一连 ---------- */
function initLink() {
  const box = document.getElementById('link');
  const svg = document.getElementById('linkSvg');
  const say = document.getElementById('linkSay');
  let picked = null;
  const done = new Set();
  const center = (el, side) => {
    const r = el.getBoundingClientRect();
    const b = box.getBoundingClientRect();
    return [r.left - b.left + r.width / 2, side === 'top' ? r.bottom - b.top : r.top - b.top];
  };
  const draw = () => {
    const b = box.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${b.width} ${b.height}`);
    svg.innerHTML = [...done].map((k) => {
      const [x1, y1] = center(box.querySelector(`.hy-top [data-k="${k}"]`), 'top');
      const [x2, y2] = center(box.querySelector(`.hy-bot [data-k="${k}"]`), 'bot');
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
    }).join('');
  };
  box.addEventListener('click', (e) => {
    const n = e.target.closest('.hy-node');
    if (!n || n.classList.contains('ok')) return;
    const top = !!n.closest('.hy-top');
    if (top) {
      box.querySelectorAll('.hy-top .hy-node').forEach((x) => x.classList.toggle('sel', x === n));
      picked = n.dataset.k;
      return;
    }
    if (!picked) { say.textContent = '先点上面的小伙伴，再点下面的东西。'; return; }
    if (n.dataset.k !== picked) {
      n.classList.remove('wrong'); void n.offsetWidth; n.classList.add('wrong');
      return;
    }
    done.add(picked);
    box.querySelectorAll(`[data-k="${picked}"]`).forEach((x) => { x.classList.add('ok'); x.classList.remove('sel'); });
    const r = ROLES[picked];
    say.innerHTML = Hanzi.ruby(`荷叶是${r.name[0]}的${r.thing[0]}。`, `hé yè shì ${r.name[1]} de ${r.thing[1]}`);
    picked = null;
    draw();
  });
  new ResizeObserver(draw).observe(box);
}

/* ---------- 句子拼一拼：××圆圆的，××的 ---------- */
const THINGS = [
  ['苹果', 'píng guǒ', '<circle cx="30" cy="34" r="22" fill="#e53935"/><path d="M30 12Q32 4 38 2" stroke="#6b4b2a" stroke-width="3" fill="none"/><ellipse cx="40" cy="8" rx="7" ry="4" fill="#4caf50"/>'],
  ['西瓜', 'xī guā', '<circle cx="30" cy="32" r="24" fill="#43a047"/><path d="M14 18Q30 32 14 48M30 8V56M46 18Q30 32 46 48" stroke="#1b5e20" stroke-width="3" fill="none"/>'],
  ['太阳', 'tài yáng', '<circle cx="30" cy="30" r="16" fill="#ffb300"/><g stroke="#ffb300" stroke-width="4"><path d="M30 2V9M30 51V58M2 30H9M51 30H58M10 10L15 15M45 45L50 50M10 50L15 45M45 15L50 10"/></g>'],
  ['香蕉', 'xiāng jiāo', '<path d="M8 20Q20 54 54 44Q30 40 18 14Z" fill="#fdd835" stroke="#c49000" stroke-width="2"/>'],
];
const ADJS = [['圆圆', 'yuán yuán'], ['红红', 'hóng hóng'], ['甜甜', 'tián tián'], ['大大', 'dà dà'], ['绿绿', 'lǜ lǜ'], ['弯弯', 'wān wān'], ['黄黄', 'huáng huáng'], ['亮亮', 'liàng liàng']];
function initMake() {
  const things = document.getElementById('things');
  const adjs = document.getElementById('adjs');
  const out = document.getElementById('makeOut');
  let thing = 0;
  let picks = [];
  things.innerHTML = THINGS.map(([z, p, svg], i) => `<button type="button" class="hy-thing" data-i="${i}"><svg viewBox="0 0 60 60">${svg}</svg><span>${Hanzi.ruby(z, p)}</span></button>`).join('');
  adjs.innerHTML = ADJS.map(([z, p], i) => `<button type="button" class="hy-adj" data-i="${i}">${Hanzi.ruby(`${z}的`, `${p} de`)}</button>`).join('');
  const render = () => {
    things.querySelectorAll('.hy-thing').forEach((b) => b.classList.toggle('on', +b.dataset.i === thing));
    adjs.querySelectorAll('.hy-adj').forEach((b) => b.classList.toggle('on', picks.includes(+b.dataset.i)));
    const [tz, tp] = THINGS[thing];
    const a = picks.map((i) => ADJS[i]);
    const blank = ['＿＿＿', ''];
    const [a1, a2] = [a[0] || blank, a[1] || blank];
    const txt = `${tz}${a1[0]}${a[0] ? '的' : ''}，${a2[0]}${a[1] ? '的' : ''}。`;
    const py = [tp, a[0] ? `${a1[1]} de` : '', a[1] ? `${a2[1]} de` : ''].filter(Boolean).join(' ');
    out.innerHTML = Hanzi.ruby(txt, py);
    out.classList.toggle('full', picks.length === 2);
  };
  things.addEventListener('click', (e) => { const b = e.target.closest('.hy-thing'); if (b) { thing = +b.dataset.i; render(); } });
  adjs.addEventListener('click', (e) => {
    const b = e.target.closest('.hy-adj');
    if (!b) return;
    const i = +b.dataset.i;
    picks = picks.includes(i) ? picks.filter((x) => x !== i) : [...picks, i].slice(-2);
    render();
  });
  document.getElementById('makeClear').addEventListener('click', () => { picks = []; render(); });
  render();
}

/* ---------- 水珠滚一滚 ---------- */
const DROPS = [['珠', 'zhū'], ['摇', 'yáo'], ['躺', 'tǎng'], ['晶', 'jīng'], ['停', 'tíng'], ['机', 'jī'], ['展', 'zhǎn'], ['透', 'tòu'], ['翅', 'chì'], ['膀', 'bǎng'], ['唱', 'chàng'], ['朵', 'duǒ']];
function initDrops() {
  const leaf = document.getElementById('bigLeaf');
  const pearl = document.getElementById('pearl');
  const list = document.getElementById('dropList');
  const n = document.getElementById('dropN');
  document.getElementById('dropAll').textContent = DROPS.length;
  leaf.insertAdjacentHTML('beforeend', DROPS.map(([z], i) => {
    const a = (i / DROPS.length) * Math.PI * 2;
    return `<button type="button" class="hy-drop" data-i="${i}" style="--x:${(50 + 38 * Math.cos(a)).toFixed(1)}%;--y:${(50 + 36 * Math.sin(a)).toFixed(1)}%">${z}</button>`;
  }).join(''));
  const update = () => {
    const k = list.children.length;
    n.textContent = k;
    pearl.style.setProperty('--k', k);
    pearl.classList.toggle('full', k === DROPS.length);
  };
  leaf.addEventListener('click', (e) => {
    const d = e.target.closest('.hy-drop:not(.in)');
    if (!d) return;
    d.classList.add('in');
    const [z, p] = DROPS[+d.dataset.i];
    list.insertAdjacentHTML('beforeend', `<span>${Hanzi.ruby(z, p)}</span>`);
    update();
  });
  document.getElementById('dropReset').addEventListener('click', () => {
    leaf.querySelectorAll('.hy-drop').forEach((d) => d.classList.remove('in'));
    list.innerHTML = '';
    update();
  });
}

window.LESSON = {
  init() {
    Narrative.init({});
    initTheatre();
    initLink();
    initMake();
    initDrops();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
