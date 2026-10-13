'use strict';
/* 比尾巴 · 本课数据。故事页见 ../shared/narrative.js，低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完） */

Hanzi.init({
  shapes: {
    比: ['M34 12C34 40 32 62 22 90', 'M34 46L48 54', 'M66 12C66 40 64 62 54 90', 'M66 46L80 54'],
    伞: ['M8 48Q50 4 92 48Z', 'M50 10V48', 'M30 20L36 48', 'M70 20L64 48', 'M50 48V86Q50 94 40 92'],
  },
  cards: [
    { z: '比', py: 'bǐ', bs: '比', bh: 4, words: [['比尾巴', 'bǐ wěi ba'], ['比赛', 'bǐ sài']] },
    { z: '尾', py: 'wěi', bs: '尸', bh: 7, words: [['尾巴', 'wěi ba'], ['鱼尾', 'yú wěi']] },
    { z: '巴', py: 'bā', bs: '巴', bh: 4, words: [['尾巴', 'wěi ba'], ['嘴巴', 'zuǐ ba']] },
    { z: '谁', py: 'shuí', bs: '讠', bh: 10, words: [['谁的', 'shuí de'], ['是谁', 'shì shuí']] },
    { z: '长', py: 'cháng', bs: '长', bh: 4, words: [['长短', 'cháng duǎn'], ['很长', 'hěn cháng']] },
    { z: '短', py: 'duǎn', bs: '矢', bh: 12, words: [['长短', 'cháng duǎn'], ['短短', 'duǎn duǎn']] },
    { z: '把', py: 'bǎ', bs: '扌', bh: 7, words: [['一把伞', 'yì bǎ sǎn'], ['把手', 'bǎ shǒu']] },
    { z: '伞', py: 'sǎn', bs: '人', bh: 6, words: [['雨伞', 'yǔ sǎn'], ['一把伞', 'yì bǎ sǎn']] },
    { z: '兔', py: 'tù', bs: '⺈', bh: 8, words: [['兔子', 'tù zi'], ['小白兔', 'xiǎo bái tù']] },
    { z: '最', py: 'zuì', bs: '日', bh: 12, words: [['最好看', 'zuì hǎo kàn'], ['最大', 'zuì dà']] },
    { z: '公', py: 'gōng', bs: '八', bh: 4, words: [['公鸡', 'gōng jī'], ['公园', 'gōng yuán']] },
  ],
  evolve: [
    { z: '比', note: '像两个人一前一后紧挨着站，比一比谁高。（帮助记字的说法）' },
    { z: '伞', note: '就像一把撑开的伞：上面是伞面，中间是伞骨，下面是伞柄。' },
  ],
  apples: [['比', 'bǐ'], ['尾', 'wěi'], ['巴', 'bā'], ['谁', 'shuí'], ['长', 'cháng'], ['短', 'duǎn'], ['把', 'bǎ'], ['伞', 'sǎn'], ['兔', 'tù'], ['最', 'zuì'], ['公', 'gōng']],
  write: [
    { z: '长', py: 'cháng', bs: '长', bh: 4 },
    { z: '比', py: 'bǐ', bs: '比', bh: 4 },
    { z: '巴', py: 'bā', bs: '巴', bh: 4 },
    { z: '把', py: 'bǎ', bs: '扌', bh: 7 },
  ],
});

/* ---------- 问答对歌：问句 → 动物，连对了出现答句 ---------- */
const DUIGE = {
  a: {
    q: [
      { id: 'hou', q: ['谁的尾巴长？', 'shuí de wěi ba cháng'], a: ['猴子的尾巴长。', 'hóu zi de wěi ba cháng'] },
      { id: 'tu', q: ['谁的尾巴短？', 'shuí de wěi ba duǎn'], a: ['兔子的尾巴短。', 'tù zi de wěi ba duǎn'] },
      { id: 'song', q: ['谁的尾巴好像一把伞？', 'shuí de wěi ba hǎo xiàng yì bǎ sǎn'], a: ['松鼠的尾巴好像一把伞。', 'sōng shǔ de wěi ba hǎo xiàng yì bǎ sǎn'] },
    ],
    who: [['song', '🐿️', '松鼠', 'sōng shǔ'], ['hou', '🐒', '猴子', 'hóu zi'], ['tu', '🐇', '兔子', 'tù zi']],
  },
  b: {
    q: [
      { id: 'ji', q: ['谁的尾巴弯？', 'shuí de wěi ba wān'], a: ['公鸡的尾巴弯。', 'gōng jī de wěi ba wān'] },
      { id: 'ya', q: ['谁的尾巴扁？', 'shuí de wěi ba biǎn'], a: ['鸭子的尾巴扁。', 'yā zi de wěi ba biǎn'] },
      { id: 'que', q: ['谁的尾巴最好看？', 'shuí de wěi ba zuì hǎo kàn'], a: ['孔雀的尾巴最好看。', 'kǒng què de wěi ba zuì hǎo kàn'] },
    ],
    who: [['ya', '🦆', '鸭子', 'yā zi'], ['que', '🦚', '孔雀', 'kǒng què'], ['ji', '🐓', '公鸡', 'gōng jī']],
  },
};

/* 连一连（与《四季》同一份写法） */
function initLian(box, { left, right, onDone }) {
  const L = box.querySelector('.lx-l');
  const R = box.querySelector('.lx-r');
  const svg = box.querySelector('.lx-lines');
  const item = (it) => `<button type="button" class="lx-item" data-id="${it.id}">${it.html}</button>`;
  L.innerHTML = left.map(item).join('');
  R.innerHTML = right.map(item).join('');
  const done = [];
  let sel = null;
  const draw = () => {
    const b = box.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${b.width.toFixed(0)} ${b.height.toFixed(0)}`);
    svg.innerHTML = done.map((id) => {
      const a = L.querySelector(`[data-id="${id}"]`).getBoundingClientRect();
      const c = R.querySelector(`[data-id="${id}"]`).getBoundingClientRect();
      return `<line x1="${(a.right - b.left).toFixed(0)}" y1="${(a.top + a.height / 2 - b.top).toFixed(0)}" x2="${(c.left - b.left).toFixed(0)}" y2="${(c.top + c.height / 2 - b.top).toFixed(0)}"/>`;
    }).join('');
  };
  const shake = (el) => { el.classList.remove('wrong'); void el.offsetWidth; el.classList.add('wrong'); };
  box.addEventListener('click', (e) => {
    const it = e.target.closest('.lx-item:not(.done)');
    if (!it) return;
    const side = it.parentElement === L ? 'l' : 'r';
    if (!sel || sel.side === side) {
      if (sel) sel.el.classList.remove('sel');
      sel = { el: it, side };
      it.classList.add('sel');
      return;
    }
    const other = sel.el;
    other.classList.remove('sel');
    sel = null;
    if (other.dataset.id !== it.dataset.id) { shake(it); shake(other); return; }
    it.classList.add('done');
    other.classList.add('done');
    done.push(it.dataset.id);
    draw();
    onDone(it.dataset.id);
    box.classList.toggle('all-done', done.length === left.length);
  });
  new ResizeObserver(draw).observe(box);
}

function initDuige() {
  Object.entries(DUIGE).filter(([key]) => document.querySelector(`[data-lx="${key}"]`)).forEach(([key, d]) => {
    const out = document.querySelector(`[data-out="${key}"]`);
    out.innerHTML = d.q.map((it) => `<p class="py" data-id="${it.id}">${Hanzi.ruby(...it.a)}</p>`).join('');
    initLian(document.querySelector(`[data-lx="${key}"]`), {
      left: d.q.map((it) => ({ id: it.id, html: `<span class="py">${Hanzi.ruby(...it.q)}</span>` })),
      right: d.who.map(([id, e, t, p]) => ({ id, html: `<i class="bw-emoji">${e}</i><span class="py">${Hanzi.ruby(t, p)}</span>` })),
      onDone: (id) => out.querySelector(`[data-id="${id}"]`).classList.add('on'),
    });
  });
}

/* ---------- 找一找：听问句，在“比尾巴大会”图上点动物（x / y 是图上的百分比，按 bisai.jpg 核对过） ---------- */
const FIND = [
  { x: 8, y: 62, q: DUIGE.a.q[0] }, { x: 22, y: 62, q: DUIGE.a.q[1] }, { x: 37, y: 60, q: DUIGE.a.q[2] },
  { x: 53, y: 60, q: DUIGE.b.q[0] }, { x: 66, y: 60, q: DUIGE.b.q[1] }, { x: 87, y: 55, q: DUIGE.b.q[2] },
];
const FIND_ORDER = [5, 1, 3, 0, 4, 2]; // 打乱一下顺序，不按课文顺序问
function initFind() {
  const pic = document.getElementById('findPic');
  const q = document.getElementById('findQ');
  const msg = document.getElementById('findMsg');
  pic.innerHTML = FIND.map((f, i) => `<button type="button" class="bw-spot" data-i="${i}" style="left:${f.x}%;top:${f.y}%" aria-label="动物"></button>
    <p class="bw-ans py" data-i="${i}" style="left:${f.x}%;top:${f.y - 30}%">${Hanzi.ruby(...f.q.a)}</p>`).join('');
  let k = 0;
  const ask = () => { q.innerHTML = Hanzi.ruby(...FIND[FIND_ORDER[k]].q.q); msg.textContent = ''; };
  pic.addEventListener('click', (e) => {
    const b = e.target.closest('.bw-spot');
    if (!b || k >= FIND_ORDER.length) return;
    if (+b.dataset.i !== FIND_ORDER[k]) { msg.textContent = '不是它，再看看尾巴。'; b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong'); return; }
    pic.querySelectorAll('.bw-ans').forEach((a) => a.classList.toggle('on', a.dataset.i === b.dataset.i));
    b.classList.add('done');
    k += 1;
    if (k < FIND_ORDER.length) { msg.textContent = '对啦！'; setTimeout(ask, 1400); return; }
    msg.innerHTML = '六个问题都答对了！ <button type="button" class="btn" id="findAgain">再来一次</button>';
  });
  msg.addEventListener('click', (e) => {
    if (!e.target.closest('#findAgain')) return;
    k = 0;
    pic.querySelectorAll('.bw-spot').forEach((x) => x.classList.remove('done'));
    pic.querySelectorAll('.bw-ans').forEach((x) => x.classList.remove('on'));
    ask();
  });
  ask();
}

/* ---------- 问答游戏：翻卡片 ---------- */
const QA = [
  ['🐇', ['谁的样子最可爱？', 'shuí de yàng zi zuì kě ài'], ['兔子的样子最可爱。', 'tù zi de yàng zi zuì kě ài']],
  ['🐘', ['谁的鼻子最长？', 'shuí de bí zi zuì cháng'], ['大象的鼻子最长。', 'dà xiàng de bí zi zuì cháng']],
  ['🦒', ['谁的脖子最长？', 'shuí de bó zi zuì cháng'], ['长颈鹿的脖子最长。', 'cháng jǐng lù de bó zi zuì cháng']],
  ['🦛', ['谁的嘴巴最大？', 'shuí de zuǐ ba zuì dà'], ['河马的嘴巴最大。', 'hé mǎ de zuǐ ba zuì dà']],
];

function initQa() {
  const box = document.getElementById('qa');
  box.innerHTML = QA.map(([e, q, a]) => `<button type="button" class="bw-card">
      <span class="bw-q py">${Hanzi.ruby(...q)}</span>
      <span class="bw-a"><i class="bw-emoji">${e}</i><span class="py">${Hanzi.ruby(...a)}</span></span>
    </button>`).join('');
  box.addEventListener('click', (e) => {
    const c = e.target.closest('.bw-card');
    if (c) c.classList.toggle('open');
  });
}

window.LESSON = {
  init() { Narrative.init({}); initDuige(); initQa(); initFind(); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
