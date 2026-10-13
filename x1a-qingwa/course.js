'use strict';
/* 青蛙写诗 · 本课数据。故事页见 ../shared/narrative.js，低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完） */

Hanzi.init({
  shapes: {
    雨: ['M10 14H90', 'M50 14V40', 'M26 32V48', 'M74 32V48', 'M26 62V78', 'M50 56V72', 'M74 62V78'],
    下: ['M10 38Q50 32 90 38', 'M32 62H68'],
  },
  cards: [
    { z: '写', py: 'xiě', bs: '冖', bh: 5, words: [['写诗', 'xiě shī'], ['写字', 'xiě zì']] },
    { z: '诗', py: 'shī', bs: '讠', bh: 8, words: [['写诗', 'xiě shī'], ['诗歌', 'shī gē']] },
    { z: '点', py: 'diǎn', bs: '灬', bh: 9, words: [['雨点儿', 'yǔ diǎnr _'], ['一点', 'yì diǎn']] },
    { z: '要', py: 'yào', bs: '覀', bh: 9, words: [['我要', 'wǒ yào'], ['不要', 'bú yào']] },
    { z: '过', py: 'guò', bs: '辶', bh: 6, words: [['游过来', 'yóu guò lái'], ['过年', 'guò nián']] },
    { z: '给', py: 'gěi', bs: '纟', bh: 9, words: [['给你', 'gěi nǐ'], ['送给', 'sòng gěi']] },
    { z: '当', py: 'dāng', bs: '⺌', bh: 6, words: [['当个', 'dāng gè'], ['当心', 'dāng xīn']] },
    { z: '串', py: 'chuàn', bs: '丨', bh: 7, words: [['一串', 'yí chuàn'], ['串门', 'chuàn mén']] },
    { z: '们', py: 'men', bs: '亻', bh: 5, words: [['我们', 'wǒ men'], ['你们', 'nǐ men']] },
    { z: '以', py: 'yǐ', bs: '人', bh: 4, words: [['可以', 'kě yǐ'], ['以前', 'yǐ qián']] },
    { z: '成', py: 'chéng', bs: '戈', bh: 6, words: [['写成', 'xiě chéng'], ['成为', 'chéng wéi']] },
  ],
  evolve: [
    { z: '雨', note: '上面一横是天，下面一点一点是落下来的雨滴。' },
    { z: '下', note: '长长的一横是地面，短横在它的下面——就是“下”。（帮助记字的说法）' },
  ],
  write: [
    { z: '下', py: 'xià', bs: '一', bh: 3 },
    { z: '个', py: 'gè', bs: '人', bh: 3 },
    { z: '雨', py: 'yǔ', bs: '雨', bh: 8 },
    { z: '们', py: 'men', bs: '亻', bh: 5 },
  ],
});

/* ---------- 识字游戏：小青蛙跳荷叶（本课用，代替摘苹果） ---------- */
const PADS = [['写', 'xiě'], ['诗', 'shī'], ['点', 'diǎn'], ['要', 'yào'], ['过', 'guò'], ['给', 'gěi'], ['当', 'dāng'], ['串', 'chuàn'], ['们', 'men'], ['以', 'yǐ'], ['成', 'chéng']];
function initPads() {
  const box = document.getElementById('pads');
  const msg = document.getElementById('jumpMsg');
  // 荷叶排成两行“之”字，青蛙从左下的岸边出发
  const at = (i) => [10 + (i % 6) * 16 + (i >= 6 ? 8 : 0), i >= 6 ? 74 : 30 + (i % 2) * 8];
  box.innerHTML = PADS.map(([z, p], i) => { const [x, y] = at(i); return `<button type="button" class="qw-pad" data-i="${i}" style="left:${x}%;top:${y}%">${Hanzi.ruby(z, p)}</button>`; }).join('')
    + '<i class="qw-frog" id="frog">🐸</i>';
  const frog = document.getElementById('frog');
  let next = 0;
  const place = (i) => {
    const [x, y] = i < 0 ? [4, 90] : at(i);
    frog.style.left = `${x}%`;
    frog.style.top = `${y - 16}%`;
    frog.classList.remove('hop'); void frog.offsetWidth; frog.classList.add('hop');
  };
  box.addEventListener('click', (e) => {
    const pad = e.target.closest('.qw-pad');
    if (!pad) return;
    const i = +pad.dataset.i;
    if (i < next) return;
    if (i > next) { msg.textContent = '一片一片按顺序跳，先读前面那片。'; pad.classList.remove('wrong'); void pad.offsetWidth; pad.classList.add('wrong'); return; }
    pad.classList.add('done');
    place(i);
    next += 1;
    msg.textContent = next < PADS.length ? `呱！跳了 ${next} 片。` : '呱呱呱！小青蛙跳过了所有荷叶！';
  });
  document.getElementById('jumpReset').addEventListener('click', () => {
    next = 0;
    box.querySelectorAll('.qw-pad').forEach((p) => p.classList.remove('done'));
    msg.textContent = '读出下一片荷叶上的字，小青蛙就跳过去。';
    place(-1);
  });
  place(-1);
}

/* ---------- 小伙伴变标点 ---------- */
function initHelpers() {
  document.querySelector('.qw-helpers').addEventListener('click', (e) => {
    const b = e.target.closest('.qw-helper');
    if (b) b.classList.toggle('on');
  });
}

/* ---------- 帮青蛙把诗写完整：选小伙伴，点空格 ---------- */
const POEM = [[['呱呱', '，'], ['呱呱', '，']], [['呱呱呱', '。']], [['呱呱', '，'], ['呱呱', '，']], [['呱呱呱', '……']]];
const NAMES = { '，': '逗号', '。': '句号', '……': '省略号' };

function initPoemGame() {
  const box = document.getElementById('qwLines');
  const count = document.getElementById('qwCount');
  const tools = document.querySelector('.qw-tools');
  box.innerHTML = POEM.map((line) => `<p>${line.map(([w, p]) => `<span class="qw-w">${Hanzi.ruby(w, 'guā '.repeat(w.length).trim())}</span><button type="button" class="qw-slot" data-p="${p}"></button>`).join('')}</p>`).join('');
  let pick = null;
  tools.addEventListener('click', (e) => {
    const t = e.target.closest('.qw-tool');
    if (!t) return;
    pick = t.dataset.p;
    tools.querySelectorAll('.qw-tool').forEach((x) => x.classList.toggle('on', x === t));
  });
  box.addEventListener('click', (e) => {
    const s = e.target.closest('.qw-slot:not(.done)');
    if (!s) return;
    if (!pick) { count.textContent = '先点上面的一个小伙伴。'; return; }
    if (s.dataset.p !== pick) { s.classList.remove('wrong'); void s.offsetWidth; s.classList.add('wrong'); count.textContent = `这里不是${NAMES[pick]}，再想想。`; return; }
    s.textContent = pick;
    s.classList.add('done');
    const left = box.querySelectorAll('.qw-slot:not(.done)').length;
    if (left) { count.textContent = `放对了！还有 ${left} 个空格。`; return; }
    const n = (p) => box.querySelectorAll(`.qw-slot[data-p="${p}"]`).length;
    count.innerHTML = `诗写完整啦！数一数：逗号 <b>${n('，')}</b> 个，句号 <b>${n('。')}</b> 个，省略号 <b>${n('……')}</b> 个。`;
  });
}

window.LESSON = {
  init() { Narrative.init({}); initHelpers(); initPoemGame(); initPads(); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
