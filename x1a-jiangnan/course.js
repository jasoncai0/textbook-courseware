'use strict';
/* 江南 · 本课数据。诗文模板见 ../shared/poem.js（这里横排 + 注音），低年级识字与注音见 ../shared/hanzi.js */

const POEMS = {
  jiangnan: {
    title: '江南', author: '汉乐府', layout: 'h',
    lines: [
      { t: '江南可采莲，', r: '江南/可采莲，', py: 'jiāng nán kě cǎi lián', f: '1.15 55% 45%' },
      { t: '莲叶何田田。', r: '莲叶/何田田。', py: 'lián yè hé tián tián', f: '1.25 60% 40%' },
      { t: '鱼戏莲叶间。', r: '鱼戏/莲叶间。', py: 'yú xì lián yè jiān', f: '1.35 60% 55%' },
      { t: '鱼戏莲叶东，', r: '鱼戏/莲叶东，', py: 'yú xì lián yè dōng', f: '1.3 75% 50%' },
      { t: '鱼戏莲叶西，', r: '鱼戏/莲叶西，', py: 'yú xì lián yè xī', f: '1.3 40% 50%' },
      { t: '鱼戏莲叶南，', r: '鱼戏/莲叶南，', py: 'yú xì lián yè nán', f: '1.3 60% 75%' },
      { t: '鱼戏莲叶北。', r: '鱼戏/莲叶北。', py: 'yú xì lián yè běi', f: '1.3 60% 25%' },
    ],
    notes: { 可: '正好，适宜', 何: '多么', 田田: '莲叶又多又密、一片挨着一片的样子', 戏: '玩耍，游戏' },
  },
};
Poem.render(POEMS); // 必须在 deck.js 统计分步之前生成诗句
// 诗句、诗题、作者加注音（Hanzi.init 统一转成拼音在上的 ruby）
document.querySelectorAll('.poem-v[data-poem]').forEach((box) => {
  const p = POEMS[box.dataset.poem];
  box.querySelectorAll('.pl').forEach((el, i) => { el.dataset.py = p.lines[i].py; });
  box.querySelector('h3').dataset.py = 'jiāng nán';
  box.querySelector('.author').dataset.py = 'hàn yuè fǔ';
});

Hanzi.init({
  shapes: {
    鱼: ['M50 8C28 28 30 62 50 76C70 62 72 28 50 8', 'M41 34L59 54', 'M59 34L41 54', 'M34 44L20 52', 'M66 44L80 52', 'M50 76L32 94H68Z'],
    爪: ['M18 30Q50 8 84 24', 'M30 30L20 72', 'M50 24V74', 'M70 28L82 70'],
    北: ['M40 12C38 40 38 62 28 92', 'M40 44L16 54', 'M60 12C62 40 62 62 72 92', 'M60 44L84 54'],
  },
  cards: [
    { z: '江', py: 'jiāng', bs: '氵', bh: 6, words: [['江南', 'jiāng nán'], ['长江', 'cháng jiāng']] },
    { z: '南', py: 'nán', bs: '十', bh: 9, words: [['江南', 'jiāng nán'], ['南方', 'nán fāng']] },
    { z: '可', py: 'kě', bs: '口', bh: 5, words: [['可以', 'kě yǐ'], ['可爱', 'kě ài']] },
    { z: '采', py: 'cǎi', bs: '爫', bh: 8, words: [['采莲', 'cǎi lián'], ['采花', 'cǎi huā']] },
    { z: '莲', py: 'lián', bs: '艹', bh: 10, words: [['莲叶', 'lián yè'], ['莲花', 'lián huā']] },
    { z: '鱼', py: 'yú', bs: '鱼', bh: 8, words: [['小鱼', 'xiǎo yú'], ['金鱼', 'jīn yú']] },
    { z: '东', py: 'dōng', bs: '一', bh: 5, words: [['东边', 'dōng bian'], ['东方', 'dōng fāng']] },
    { z: '西', py: 'xī', bs: '西', bh: 6, words: [['西边', 'xī bian'], ['西瓜', 'xī guā']] },
    { z: '北', py: 'běi', bs: '匕', bh: 5, words: [['北方', 'běi fāng'], ['南北', 'nán běi']] },
  ],
  evolve: [
    { z: '鱼', note: '像一条头朝上的鱼：身上有鳞，两边有鳍，下面是尾巴。' },
    { z: '采', old: ['爪', '木'], note: '上面是一只手（爪），下面是一棵树（木）：用手在树上摘——就是“采”。' },
    { z: '北', note: '像两个人背靠背。本来是“背”的意思，后来借来表示方向“北”。（帮助记字的说法）' },
  ],
  write: [
    { z: '可', py: 'kě', bs: '口', bh: 5 },
    { z: '东', py: 'dōng', bs: '一', bh: 5 },
    { z: '西', py: 'xī', bs: '西', bh: 6 },
  ],
});

/* ---------- 钓鱼：本课的识字游戏（代替摘苹果） ---------- */
const FISHES = [['江', 'jiāng'], ['南', 'nán'], ['可', 'kě'], ['采', 'cǎi'], ['莲', 'lián'], ['鱼', 'yú'], ['东', 'dōng'], ['西', 'xī'], ['北', 'běi']];
function initFishing() {
  const pool = document.getElementById('pool');
  const caught = document.getElementById('caught');
  const n = document.getElementById('caughtN');
  pool.innerHTML = FISHES.map(([z], i) => `<button type="button" class="jn-zfish" data-i="${i}" style="left:${8 + (i % 3) * 30 + (i % 2) * 6}%;top:${12 + Math.floor(i / 3) * 27}%;animation-delay:${(i * .7).toFixed(1)}s"><span>${z}</span></button>`).join('');
  pool.addEventListener('click', (e) => {
    const f = e.target.closest('.jn-zfish:not(.caught)');
    if (!f) return;
    f.classList.add('caught');
    const [z, p] = FISHES[+f.dataset.i];
    caught.insertAdjacentHTML('beforeend', `<span>${Hanzi.ruby(z, p)}</span>`);
    n.textContent = caught.children.length;
  });
  document.getElementById('poolReset').addEventListener('click', () => {
    pool.querySelectorAll('.jn-zfish').forEach((f) => f.classList.remove('caught'));
    caught.innerHTML = '';
    n.textContent = '0';
  });
}

/* 鱼戏莲叶：点方向字，小鱼游过去；“考考你”时小鱼自己游，孩子说方向 */
const SPOTS = {
  jian: { x: 390, y: 150, line: ['鱼戏莲叶间。', 'yú xì lián yè jiān'], name: '莲叶中间' },
  dong: { x: 500, y: 210, line: ['鱼戏莲叶东，', 'yú xì lián yè dōng'], name: '东边' },
  xi: { x: 100, y: 210, line: ['鱼戏莲叶西，', 'yú xì lián yè xī'], name: '西边' },
  nan: { x: 300, y: 355, line: ['鱼戏莲叶南，', 'yú xì lián yè nán'], name: '南边' },
  bei: { x: 300, y: 50, line: ['鱼戏莲叶北。', 'yú xì lián yè běi'], name: '北边' },
};
const LEAVES = [[300, 205, 92], [400, 120, 34], [210, 290, 40], [430, 300, 30], [180, 110, 30], [110, 70, 20], [120, 330, 24]];

function initPond() {
  const svg = document.getElementById('pond');
  const fish = document.getElementById('fish');
  const line = document.getElementById('fishLine');
  const msg = document.getElementById('fishMsg');
  svg.querySelector('.jn-leaves').innerHTML = LEAVES.map(([x, y, r]) =>
    `<g transform="translate(${x} ${y})"><path d="M0 0L${(r * .26).toFixed(1)} ${(-r * .966).toFixed(1)}A${r} ${r} 0 1 1 ${(-r * .26).toFixed(1)} ${(-r * .966).toFixed(1)}Z" fill="#5fae6a" stroke="#3f8a4d" stroke-width="2"/><path d="M0 0L0 ${(r * .8).toFixed(1)}M0 0L${(r * .7).toFixed(1)} ${(r * .4).toFixed(1)}M0 0L${(-r * .7).toFixed(1)} ${(r * .4).toFixed(1)}" stroke="#3f8a4d" stroke-width="2" fill="none"/></g>`).join('')
    + '<g transform="translate(330 170)"><circle r="16" fill="#f7b6c8"/><circle r="7" fill="#f6d34a"/></g>';
  svg.querySelector('.jn-ripples').innerHTML = [[150, 60], [520, 330], [60, 120]].map(([x, y], i) =>
    `<ellipse cx="${x}" cy="${y}" rx="26" ry="9" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2" style="animation-delay:${i * .8}s"/>`).join('');
  let at = { x: 300, y: 205 };
  let quiz = null;
  const swim = (key) => {
    const to = SPOTS[key];
    const angle = Math.atan2(to.y - at.y, to.x - at.x) * 180 / Math.PI;
    fish.style.transform = `translate(${to.x}px, ${to.y}px)`;
    fish.querySelector('.jn-fish-body').style.transform = `rotate(${angle.toFixed(0)}deg) scale(1.4)`;
    at = to;
  };
  const say = (key) => { line.innerHTML = Hanzi.ruby(...SPOTS[key].line); };
  fish.style.transform = 'translate(300px, 205px)';
  fish.querySelector('.jn-fish-body').style.transform = 'scale(1.4)';
  document.querySelector('.jn-dirs').addEventListener('click', (e) => {
    const b = e.target.closest('[data-dir]');
    if (!b) return;
    const key = b.dataset.dir;
    if (quiz) {
      if (key !== quiz) { msg.textContent = '再看看，小鱼在莲叶的哪一边？'; b.classList.add('wrong'); setTimeout(() => b.classList.remove('wrong'), 400); return; }
      msg.textContent = `对啦！小鱼在${SPOTS[key].name}。`;
      quiz = null;
      say(key);
      return;
    }
    msg.textContent = '';
    swim(key);
    say(key);
  });
  document.getElementById('fishQuiz').addEventListener('click', () => {
    const keys = Object.keys(SPOTS).filter((k) => SPOTS[k] !== at);
    quiz = keys[Math.floor(Math.random() * keys.length)];
    swim(quiz);
    line.innerHTML = '';
    msg.textContent = '小鱼游到哪边去了？点一点方向字。';
  });
}

window.LESSON = {
  init() {
    Narrative.init({});
    Poem.init();
    // 注释弹窗：诗句加了注音，弹窗里只取汉字（Poem 自己的写法会把拼音也带进去）
    document.addEventListener('click', (e) => {
      const nt = e.target.closest('.show-notes .nt');
      if (!nt) return;
      const word = [...nt.querySelectorAll('ruby')].map((r) => r.firstChild.nodeValue).join('');
      nt.closest('.poem-v').querySelector('.note-pop').textContent = `${word}：${nt.dataset.note}`;
    });
    initPond();
    initFishing();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
