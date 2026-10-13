'use strict';
/* 祖先的摇篮 · 本课数据与互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：① 想象拼贴（读一句“可曾……”贴一张想象贴纸，最后对照想象图）；② 仿写诗句机；③ 动作词连一连；④ 摘野果识字（本组唯一一次摘果子） */

/* 二下课文只给生字注音：data-pyk="掏:tāo" → 按顺序给这些字注音，其余字上面空着（与课本一致） */
document.querySelectorAll('[data-pyk]').forEach((el) => {
  const want = el.dataset.pyk.trim().split(/\s+/).filter(Boolean).map((s) => s.split(':'));
  let k = 0;
  const syl = [...el.textContent].filter((ch) => /\p{Script=Han}/u.test(ch))
    .map((ch) => (k < want.length && ch === want[k][0] ? want[k++][1] : '_'));
  if (k < want.length) console.warn(`注音字没找到：${want[k][0]}（${el.textContent}）`); // eslint-disable-line no-console
  el.dataset.py = syl.join(' ');
});

/* ---------- 拼贴底图：浓绿的原始森林 ---------- */
const FOREST = `<svg class="yl-forest" viewBox="0 0 800 450" preserveAspectRatio="none" aria-hidden="true">
  <rect width="800" height="450" fill="#cfe7c0"/>
  <g fill="#5e9a4a">${[60, 190, 330, 470, 610, 740].map((x) => `<rect x="${x - 14}" y="80" width="28" height="300" rx="8" fill="#8a6440"/>`).join('')}</g>
  <path d="M0 0H800V110Q740 150 690 110Q640 160 580 115Q520 165 450 112Q390 160 330 110Q270 165 200 112Q140 160 80 110Q40 150 0 120Z" fill="#3f7f3a"/>
  <path d="M0 0H800V70Q700 110 620 70Q540 112 440 66Q340 110 250 68Q160 110 70 70Q30 92 0 80Z" fill="#2f6a30"/>
  <path d="M60 170Q140 150 210 160" stroke="#8a6440" stroke-width="12" fill="none" stroke-linecap="round"/>
  <path d="M190 220Q260 200 330 232" stroke="#8a6440" stroke-width="10" fill="none" stroke-linecap="round"/>
  <path d="M0 330Q200 300 400 320T800 310V450H0Z" fill="#8cc463"/>
  <path d="M0 370Q200 350 400 365T800 360V450H0Z" fill="#7ab653"/>
</svg>`;
document.querySelectorAll('[data-forest]').forEach((el) => el.insertAdjacentHTML('afterbegin', FOREST));

Hanzi.init({
  shapes: {
    示: ['M30 14H70', 'M14 34H86', 'M50 34V92', 'M34 56L22 78', 'M66 56L78 78'],
    且: ['M28 12V88', 'M72 12V88', 'M28 12H72', 'M28 38H72', 'M28 64H72', 'M14 88H86'],
    望: ['M24 30A10 12 0 1 0 24 54A10 12 0 1 0 24 30', 'M24 54C24 70 30 78 40 82', 'M36 58L50 52', 'M24 92H76', 'M50 82V92', 'M78 12C58 20 58 46 78 54C68 44 68 22 78 12'],
  },
  cards: [
    { z: '祖', py: 'zǔ', bs: '礻', bh: 9, words: [['祖先', 'zǔ xiān'], ['祖国', 'zǔ guó']] },
    { z: '掏', py: 'tāo', bs: '扌', bh: 11, words: [['掏鹊蛋', 'tāo què dàn'], ['掏出来', 'tāo chū lái']] },
    { z: '逗', py: 'dòu', bs: '辶', bh: 10, words: [['逗小松鼠', 'dòu xiǎo sōng shǔ'], ['逗号', 'dòu hào']] },
    { z: '蔷', py: 'qiáng', bs: '艹', bh: 14, words: [['蔷薇', 'qiáng wēi'], ['野蔷薇', 'yě qiáng wēi']] },
    { z: '薇', py: 'wēi', bs: '艹', bh: 16, words: [['蔷薇', 'qiáng wēi']] },
    { z: '逮', py: 'dǎi', bs: '辶', bh: 11, words: [['逮蝈蝈', 'dǎi guō guo'], ['逮住', 'dǎi zhù']] },
    { z: '忆', py: 'yì', bs: '忄', bh: 4, words: [['回忆', 'huí yì'], ['记忆', 'jì yì']] },
  ],
  evolve: [
    { z: '祖', old: ['示', '且'], note: '左边“示”像摆供品的祭台，右边“且”像祭祀时立的牌位。纪念祖先，就是“祖”。' },
    { z: '望', note: '像一个人站在土堆上，睁大眼睛望着天上的月亮。“一望无边”就是一眼望过去，看不到边。' },
  ],
  apples: [['祖', 'zǔ'], ['掏', 'tāo'], ['逗', 'dòu'], ['蔷', 'qiáng'], ['薇', 'wēi'], ['逮', 'dǎi'], ['忆', 'yì'],
    ['浓', 'nóng'], ['望', 'wàng'], ['蓝', 'lán'], ['摘', 'zhāi'], ['赛', 'sài']],
  write: [
    { z: '祖', py: 'zǔ', bs: '礻', bh: 9 },
    { z: '啊', py: 'a', bs: '口', bh: 10 },
    { z: '浓', py: 'nóng', bs: '氵', bh: 9 },
    { z: '望', py: 'wàng', bs: '王', bh: 11 },
    { z: '蓝', py: 'lán', bs: '艹', bh: 13 },
    { z: '摘', py: 'zhāi', bs: '扌', bh: 14 },
    { z: '掏', py: 'tāo', bs: '扌', bh: 11 },
    { z: '赛', py: 'sài', bs: '宀', bh: 14 },
    { z: '忆', py: 'yì', bs: '忄', bh: 4 },
  ],
});

/* ---------- 仿写诗句机 ---------- */
const WHERE = ['那条小河边', '这片山坡上', '那个山洞里', '这片竹林里'];
const DO = ['捉小鱼', '捡贝壳', '采野花', '挖野菜', '追蝴蝶', '听鸟叫', '看星星', '烤火取暖'];
function initMake() {
  const whereBox = document.getElementById('ylWhere');
  const doBox = document.getElementById('ylDo');
  const out = document.getElementById('ylOut');
  let w = -1;
  let picked = [];
  whereBox.innerHTML = WHERE.map((t, i) => `<button type="button" class="btn" data-i="${i}">${t}</button>`).join('');
  doBox.innerHTML = DO.map((t, i) => `<button type="button" class="btn" data-i="${i}">${t}</button>`).join('');
  const render = () => {
    whereBox.querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', +b.dataset.i === w));
    doBox.querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', picked.includes(+b.dataset.i)));
    const place = w < 0 ? '（　　　　）' : WHERE[w];
    const [a, b] = [0, 1].map((k) => (picked[k] === undefined ? '（　　）' : DO[picked[k]]));
    out.innerHTML = `<p>我想——</p><p>我们的祖先，</p><p>可曾在${place}</p><p>${a}，</p><p>${b}？</p>`;
  };
  whereBox.addEventListener('click', (e) => { const b = e.target.closest('.btn'); if (b) { w = +b.dataset.i; render(); } });
  doBox.addEventListener('click', (e) => {
    const b = e.target.closest('.btn');
    if (!b) return;
    const i = +b.dataset.i;
    picked = picked.includes(i) ? picked.filter((x) => x !== i) : [...picked, i].slice(-2);
    render();
  });
  render();
}

/* ---------- 动作词连一连 ---------- */
const VERBS = ['摘', '采', '挖', '逗', '捉', '逮', '看', '赏', '数'];
const NOUNS = ['野果', '蘑菇', '野菜', '松鼠', '蜻蜓', '蝈蝈', '夕阳', '明月', '星星'];
const OK = {
  摘: ['野果'], 采: ['蘑菇'], 挖: ['野菜'], 逗: ['松鼠'], 捉: ['蜻蜓', '蝈蝈'], 逮: ['蝈蝈', '蜻蜓'],
  看: ['夕阳', '明月', '星星'], 赏: ['明月', '夕阳'], 数: ['星星'],
};
function initPair() {
  const vBox = document.getElementById('ylVerbs');
  const nBox = document.getElementById('ylNouns');
  const made = document.getElementById('ylMade');
  vBox.innerHTML = VERBS.map((v) => `<button type="button" class="yl-v" data-v="${v}">${v}</button>`).join('');
  nBox.innerHTML = [6, 0, 4, 2, 8, 1, 5, 3, 7].map((i) => `<button type="button" class="yl-n" data-n="${NOUNS[i]}">${NOUNS[i]}</button>`).join('');
  let sel = null;
  vBox.addEventListener('click', (e) => {
    const b = e.target.closest('.yl-v');
    if (!b) return;
    sel = b.dataset.v;
    vBox.querySelectorAll('.yl-v').forEach((x) => x.classList.toggle('sel', x === b));
  });
  nBox.addEventListener('click', (e) => {
    const b = e.target.closest('.yl-n');
    if (!b || !sel) return;
    const word = sel + b.dataset.n;
    if (!OK[sel].includes(b.dataset.n)) { b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong'); return; }
    if (!made.querySelector(`[data-w="${word}"]`)) made.insertAdjacentHTML('beforeend', `<span data-w="${word}"><em>${sel}</em>${b.dataset.n}</span>`);
    vBox.querySelector(`[data-v="${sel}"]`).classList.add('used');
    b.classList.add('used');
  });
}

window.LESSON = {
  init() {
    Narrative.init({});
    initMake();
    initPair();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
