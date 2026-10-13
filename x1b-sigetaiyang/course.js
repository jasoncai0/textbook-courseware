'use strict';
/* 四个太阳 · 本课数据与本课互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完） */

/* ================= 蜡笔太阳：kind = green | gold | red | rainbow，或直接给颜色 ================= */
const SUN_COLORS = { green: '#5cc26b', gold: '#f2b02a', red: '#e8432f', rainbow: 'url(#sgRb)' };
const RAY_RAINBOW = ['#ff6b6b', '#ffb347', '#ffe66d', '#6bcb77', '#4d96ff', '#9b6bff'];
function sunSvg(kind) {
  const fill = SUN_COLORS[kind] || kind;
  const rays = Array.from({ length: 12 }, (_, i) => {
    const a = (i * Math.PI) / 6;
    const [x1, y1, x2, y2] = [50 + Math.cos(a) * 32, 50 + Math.sin(a) * 32, 50 + Math.cos(a) * 46, 50 + Math.sin(a) * 46].map((v) => v.toFixed(1));
    const c = kind === 'rainbow' ? RAY_RAINBOW[i % RAY_RAINBOW.length] : fill;
    return `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${c}" pathLength="1"/>`;
  }).join('');
  return `<svg class="sg-sun" viewBox="0 0 100 100" aria-hidden="true"><g class="sg-rays">${rays}</g><circle class="sg-disc" cx="50" cy="50" r="25" fill="${fill}"/>
    <circle cx="42" cy="46" r="2.6" fill="#5a3a12"/><circle cx="58" cy="46" r="2.6" fill="#5a3a12"/><path d="M41 56Q50 64 59 56" stroke="#5a3a12" stroke-width="2.6" fill="none" stroke-linecap="round"/></svg>`;
}
document.querySelectorAll('[data-sun]').forEach((el) => { el.innerHTML = sunSvg(el.dataset.sun); });

/* 封面：四个太阳排一排 */
document.getElementById('coverSuns').innerHTML = ['green', 'gold', 'red', 'rainbow'].map((k) => `<span>${sunSvg(k)}</span>`).join('');

/* 春天：没有配图，画板上画一幅简单的春景（太阳由第 2 步画上去） */
document.getElementById('spring').insertAdjacentHTML('afterbegin', `<svg class="sg-spring-art" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <path d="M0 120Q80 90 160 115T320 105V180H0Z" fill="#9bd77a"/><path d="M0 145Q100 125 200 145T320 140V180H0Z" fill="#7cc35c"/>
  ${[[40, 150, '#ff7aa2'], [80, 160, '#ffd34d'], [130, 150, '#b07cff'], [190, 162, '#ff9f43'], [240, 150, '#ff6b6b'], [285, 160, '#4dabf7']].map(([x, y, c]) => `<g><path d="M${x} ${y}V${y + 16}" stroke="#4c8a3a" stroke-width="2"/><circle cx="${x}" cy="${y}" r="7" fill="${c}"/><circle cx="${x}" cy="${y}" r="2.5" fill="#fff6c2"/></g>`).join('')}
  <path d="M250 40L270 55L262 75L240 62Z" fill="#ff8a65"/><path d="M262 75Q250 100 268 120" stroke="#aa6a4a" fill="none"/>
</svg>`);

/* ================= 点季节换太阳 + 调色盘 ================= */
const SEASONS = [
  { k: 'xia', name: '夏天', py: 'xià tiān', sun: 'green', say: ['绿绿的太阳，到处一片清凉。', 'lǜ lǜ de tài yáng dào chù yí piàn qīng liáng'], bg: '#e6f6e4' },
  { k: 'qiu', name: '秋天', py: 'qiū tiān', sun: 'gold', say: ['金黄的太阳，尝尝水果的香甜。', 'jīn huáng de tài yáng cháng chang shuǐ guǒ de xiāng tián'], bg: '#fdf1d4' },
  { k: 'dong', name: '冬天', py: 'dōng tiān', sun: 'red', say: ['红红的太阳，温暖小朋友的手和脸。', 'hóng hóng de tài yáng wēn nuǎn xiǎo péng you de shǒu hé liǎn'], bg: '#e9f1fa' },
  { k: 'chun', name: '春天', py: 'chūn tiān', sun: 'rainbow', say: ['彩色的太阳，春天是个多彩的季节。', 'cǎi sè de tài yáng chūn tiān shì gè duō cǎi de jì jié'], bg: '#fbeef6' },
];
const PALETTE = [['红', '#e8432f'], ['橙', '#ff9f43'], ['黄', '#ffd34d'], ['绿', '#5cc26b'], ['蓝', '#4dabf7'], ['紫', '#9b6bff'], ['彩色', 'rainbow']];
function initStudio(box) {
  box.innerHTML = `<div class="sg-sky">${sunSvg('green')}<p class="sg-say py"></p></div>
    <div class="sg-tools">
      <p class="sg-h">课文里的太阳</p>
      <div class="sg-seasons">${SEASONS.map((s, i) => `<button type="button" class="sg-season" data-i="${i}">${Hanzi.ruby(s.name, s.py)}</button>`).join('')}</div>
      <p class="sg-h">我来画太阳</p>
      <div class="sg-palette">${PALETTE.map(([n, c]) => `<button type="button" class="sg-color${c === 'rainbow' ? ' rb' : ''}" data-c="${c}" style="--c:${c}">${n}</button>`).join('')}</div>
    </div>`;
  const sky = box.querySelector('.sg-sky');
  const paint = (kind) => {
    sky.querySelector('.sg-sun').outerHTML = sunSvg(kind);
  };
  const pickSeason = (i) => {
    const s = SEASONS[i];
    paint(s.sun);
    sky.style.background = s.bg;
    sky.querySelector('.sg-say').innerHTML = Hanzi.ruby(s.say[0], s.say[1]);
    box.querySelectorAll('.sg-season').forEach((b) => b.classList.toggle('on', +b.dataset.i === i));
    box.querySelectorAll('.sg-color').forEach((b) => b.classList.remove('on'));
  };
  box.addEventListener('click', (e) => {
    const s = e.target.closest('.sg-season');
    if (s) { pickSeason(+s.dataset.i); return; }
    const c = e.target.closest('.sg-color');
    if (!c) return;
    paint(c.dataset.c);
    box.querySelectorAll('.sg-color').forEach((b) => b.classList.toggle('on', b === c));
    sky.querySelector('.sg-say').textContent = `我画了个${c.textContent}的太阳，因为……`;
  });
  pickSeason(0);
}
initStudio(document.getElementById('studio'));

/* ================= 贴纸：点贴纸，再点季节 ================= */
const STICKERS = [['高山', 'gāo shān', 'xia'], ['果园', 'guǒ yuán', 'qiu'], ['田野', 'tián yě', 'xia'], ['碧绿', 'bì lǜ', 'xia'], ['金黄', 'jīn huáng', 'qiu'],
  ['火红', 'huǒ hóng', 'dong'], ['清凉', 'qīng liáng', 'xia'], ['香甜', 'xiāng tián', 'qiu'], ['温暖', 'wēn nuǎn', 'dong']];
function initStick(box) {
  const boards = SEASONS.slice(0, 3);
  box.innerHTML = `<div class="sg-tray">${STICKERS.map(([w, p, k], i) => `<button type="button" class="sg-sticker" data-k="${k}" style="--r:${(i % 3) * 4 - 4}deg">${Hanzi.ruby(w, p)}</button>`).join('')}</div>
    <div class="sg-boards">${boards.map((s) => `<div class="sg-board-s" data-k="${s.k}" style="--bg:${s.bg}">${sunSvg(s.sun)}<b>${Hanzi.ruby(s.name, s.py)}</b><div class="sg-got"></div></div>`).join('')}</div>
    <p class="sg-stick-msg">先点一张贴纸，再点它该去的季节。</p>`;
  let sel = null;
  const msg = (t) => { box.querySelector('.sg-stick-msg').textContent = t; };
  box.addEventListener('click', (e) => {
    const st = e.target.closest('.sg-tray .sg-sticker');
    if (st) { sel = st; box.querySelectorAll('.sg-tray .sg-sticker').forEach((x) => x.classList.toggle('sel', x === st)); return; }
    const bd = e.target.closest('.sg-board-s');
    if (!bd || !sel) return;
    if (bd.dataset.k !== sel.dataset.k) {
      bd.classList.remove('wrong'); void bd.offsetWidth; bd.classList.add('wrong');
      msg('想一想：课文里这个词写的是哪个季节？');
      return;
    }
    bd.querySelector('.sg-got').appendChild(sel);
    sel.classList.remove('sel');
    sel = null;
    const done = !box.querySelector('.sg-tray .sg-sticker');
    box.classList.toggle('done', done);
    msg(done ? '全贴好了！每个季节的太阳都有了自己的颜色和感觉。' : '贴对了！再来一张。');
  });
}
initStick(document.getElementById('stick'));

/* 回顾板书 */
document.getElementById('sumBoard').innerHTML = SEASONS.map((s) => `<div class="sg-sumrow">${sunSvg(s.sun)}<p class="py">${Hanzi.ruby(s.name, s.py)}</p></div>`).join('');

Hanzi.init({
  cards: [
    { z: '太', py: 'tài', bs: '大', bh: 4, words: [['太阳', 'tài yáng'], ['太好了', 'tài hǎo le']] },
    { z: '阳', py: 'yáng', bs: '阝', bh: 6, words: [['太阳', 'tài yáng'], ['阳光', 'yáng guāng']] },
    { z: '道', py: 'dào', bs: '辶', bh: 12, words: [['街道', 'jiē dào'], ['道路', 'dào lù']] },
    { z: '送', py: 'sòng', bs: '辶', bh: 9, words: [['送给', 'sòng gěi'], ['欢送', 'huān sòng']] },
    { z: '忙', py: 'máng', bs: '忄', bh: 6, words: [['忙着', 'máng zhe'], ['帮忙', 'bāng máng']] },
    { z: '尝', py: 'cháng', bs: '⺌', bh: 9, words: [['尝尝', 'cháng chang'], ['品尝', 'pǐn cháng']] },
    { z: '香', py: 'xiāng', bs: '香', bh: 9, words: [['香甜', 'xiāng tián'], ['花香', 'huā xiāng']] },
    { z: '甜', py: 'tián', bs: '舌', bh: 11, words: [['香甜', 'xiāng tián'], ['甜美', 'tián měi']] },
    { z: '温', py: 'wēn', bs: '氵', bh: 12, words: [['温暖', 'wēn nuǎn'], ['气温', 'qì wēn']] },
    { z: '暖', py: 'nuǎn', bs: '日', bh: 13, words: [['温暖', 'wēn nuǎn'], ['暖和', 'nuǎn huo']] },
    { z: '该', py: 'gāi', bs: '讠', bh: 8, words: [['应该', 'yīng gāi']] },
    { z: '颜', py: 'yán', bs: '页', bh: 15, words: [['颜色', 'yán sè']] },
    { z: '因', py: 'yīn', bs: '囗', bh: 6, words: [['因为', 'yīn wèi']] },
  ],
  evolve: [
    { z: '阳', old: ['山', '日'], note: '左边的“阝”原来像高高的土山，右边是太阳——山向着太阳的那一面，叫“阳”。' },
    { z: '香', old: ['禾', '日'], note: '上面是“禾”（庄稼），下面是“日”：庄稼在太阳下成熟，散发出香味。（帮助记字的说法）' },
  ],
  pick: [
    { q: 'tài', ans: '太', opts: ['大', '太', '犬'] },
    { q: 'yáng', ans: '阳', opts: ['阳', '阴', '旧'] },
    { q: 'sòng', ans: '送', opts: ['关', '这', '送'] },
    { q: 'xiāng', ans: '香', opts: ['秀', '香', '季'] },
    { q: 'nuǎn', ans: '暖', opts: ['暖', '晴', '爱'] },
    { q: 'yīn', ans: '因', opts: ['困', '团', '因'] },
  ],
  write: [
    { z: '太', py: 'tài', bs: '大', bh: 4 },
    { z: '阳', py: 'yáng', bs: '阝', bh: 6 },
    { z: '校', py: 'xiào', bs: '木', bh: 10 },
    { z: '金', py: 'jīn', bs: '金', bh: 8 },
    { z: '秋', py: 'qiū', bs: '禾', bh: 9 },
    { z: '因', py: 'yīn', bs: '囗', bh: 6 },
    { z: '为', py: 'wèi', bs: '丶', bh: 4 },
  ],
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
