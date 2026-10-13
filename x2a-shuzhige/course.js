'use strict';
/* 树之歌 · 本课数据与本课互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：树叶形状配对（把叶子送回它的树）、树木名片（翻面看特点）、“木”字旁找一找。 */

/* ================= 树叶简笔（100 × 100） ================= */
const LEAVES = {
  wutong: { c: '#6fae4a', d: 'M50 94V70M50 70C30 72 12 62 10 44C20 46 26 42 28 34C22 26 26 14 36 12C40 22 46 24 50 18C54 24 60 22 64 12C74 14 78 26 72 34C74 42 80 46 90 44C88 62 70 72 50 70Z' },
  feng: { c: '#d9452f', d: 'M50 94V64M50 64L30 70L34 60L14 56L24 48L12 34L30 36L32 22L44 32L50 8L56 32L68 22L70 36L88 34L76 48L86 56L66 60L70 70Z' },
  yinxing: { c: '#efbd2b', d: 'M50 94V62M50 62L14 32Q28 12 46 16L50 28L54 16Q72 12 86 32Z' },
  song: { c: '#2f7d4a', d: 'M50 94V58M50 58L22 14M50 58L32 10M50 58L42 8M50 58L50 6M50 58L58 8M50 58L68 10M50 58L78 14', line: true },
  bai: { c: '#4f8f5a', d: 'M50 94V20M50 74L30 62M50 74L70 62M50 56L28 44M50 56L72 44M50 38L32 28M50 38L68 28', line: true, scale: true },
  yang: { c: '#88b63c', d: 'M50 94V74M50 74C24 70 16 48 26 30C34 20 44 16 50 8C56 16 66 20 74 30C84 48 76 70 50 74Z' },
  gui: { c: '#3f8a3a', d: 'M50 94V80M50 80C34 70 30 40 50 10C70 40 66 70 50 80Z' },
};
const leafSvg = (k) => {
  const L = LEAVES[k];
  const fill = L.line ? 'none' : L.c;
  const scales = L.scale ? [[30, 62], [70, 62], [28, 44], [72, 44], [32, 28], [68, 28], [50, 20]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="4" fill="${L.c}"/>`).join('') : '';
  return `<svg viewBox="0 0 100 100" class="sz-leaf" aria-hidden="true"><path d="${L.d}" fill="${fill}" stroke="${L.line ? L.c : '#00000033'}" stroke-width="${L.line ? 4 : 1.5}" stroke-linecap="round" stroke-linejoin="round"/>${scales}<path d="M50 94V${L.line ? 94 : 30}" stroke="#ffffff88" stroke-width="1.5"/></svg>`;
};
document.querySelectorAll('[data-leaf]').forEach((el) => { el.innerHTML = leafSvg(el.dataset.leaf); });

/* ================= 树叶配对：把叶子拖到它的树，或先点叶子再点树 ================= */
const PAIRS = [
  { k: 'wutong', n: '梧桐', py: 'wú tóng', clue: '树叶像手掌' },
  { k: 'feng', n: '枫树', py: 'fēng shù', clue: '秋天叶儿红' },
  { k: 'yinxing', n: '银杏', py: 'yín xìng', clue: '叶子像小扇子' },
  { k: 'song', n: '松树', py: 'sōng shù', clue: '叶子像细针' },
  { k: 'yang', n: '杨树', py: 'yáng shù', clue: '叶子像桃心' },
  { k: 'gui', n: '桂花树', py: 'guì huā shù', clue: '叶子长长的、光光的' },
];
const LEAF_ORDER = ['song', 'feng', 'gui', 'wutong', 'yang', 'yinxing'];
function initLeafMatch(box) {
  box.innerHTML = `<div class="sz-pile">${LEAF_ORDER.map((k) => `<button type="button" class="sz-chip" data-k="${k}">${leafSvg(k)}</button>`).join('')}</div>
    <div class="sz-trees">${PAIRS.map((p) => `<div class="sz-tree" data-k="${p.k}"><div class="sz-slot"></div><b>${Hanzi.ruby(p.n, p.py)}</b><small>${p.clue}</small></div>`).join('')}</div>
    <p class="sz-msg">这是谁的叶子？拖到它的树下，或者先点叶子再点树。</p>`;
  const msg = box.querySelector('.sz-msg');
  let sel = null;
  let drag = null;
  const place = (chip, tree) => {
    if (!tree) return;
    if (tree.dataset.k !== chip.dataset.k) { chip.classList.remove('wrong'); void chip.offsetWidth; chip.classList.add('wrong'); msg.textContent = '不是这棵树的叶子，看看下面的提示。'; return; }
    tree.querySelector('.sz-slot').innerHTML = leafSvg(chip.dataset.k);
    tree.classList.add('done');
    chip.classList.add('used');
    const left = box.querySelectorAll('.sz-chip:not(.used)').length;
    msg.textContent = left ? '对了！' : '全部送回家了！你还认识哪些树叶？';
    box.classList.toggle('all-done', !left);
  };
  box.addEventListener('pointerdown', (e) => {
    const chip = e.target.closest('.sz-chip:not(.used)');
    if (!chip) return;
    chip.setPointerCapture(e.pointerId);
    drag = { chip, x: e.clientX, y: e.clientY, moved: false };
  });
  box.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    if (Math.hypot(dx, dy) > 6) drag.moved = true;
    if (drag.moved) { drag.chip.classList.add('dragging'); drag.chip.style.translate = `${dx}px ${dy}px`; }
  });
  box.addEventListener('pointerup', (e) => {
    if (!drag) return;
    const { chip, moved } = drag;
    drag = null;
    chip.classList.remove('dragging');
    chip.style.translate = '';
    if (moved) { place(chip, document.elementsFromPoint(e.clientX, e.clientY).map((el) => el.closest('.sz-tree')).find(Boolean)); return; }
    sel = sel === chip ? null : chip;
    box.querySelectorAll('.sz-chip').forEach((c) => c.classList.toggle('sel', c === sel));
  });
  box.addEventListener('click', (e) => {
    const tree = e.target.closest('.sz-tree');
    if (!tree || !sel) return;
    place(sel, tree);
    sel.classList.remove('sel');
    sel = null;
  });
}
initLeafMatch(document.getElementById('szLeaves'));

/* ================= 树木名片（narrative 翻卡片：正面树名，背面课文里的特点） ================= */
const r = (t, py) => Hanzi.ruby(t, py);
const icon = (k) => (LEAVES[k] ? leafSvg(k) : `<span class="sz-emo">${k}</span>`);
const CARDS = [
  ['yang', '杨树', 'yáng shù', '高', 'gāo', '又高又直'],
  ['🌳', '榕树', 'róng shù', '壮', 'zhuàng', '树干粗，气根多'],
  ['wutong', '梧桐', 'wú tóng', '树叶像手掌', 'shù yè xiàng shǒu zhǎng', '叶子又大又宽'],
  ['feng', '枫树', 'fēng shù', '秋天叶儿红', 'qiū tiān yè ér hóng', '秋天满山红'],
  ['song', '松柏', 'sōng bǎi', '四季披绿装', 'sì jì pī lǜ zhuāng', '冬天也是绿的'],
  ['🌺', '木棉', 'mù mián', '喜暖在南方', 'xǐ nuǎn zài nán fāng', '开大红花'],
  ['🌲', '桦树', 'huà shù', '耐寒守北疆', 'nài hán shǒu běi jiāng', '树皮白白的'],
  ['yinxing', '银杏 水杉', 'yín xìng shuǐ shān', '活化石', 'huó huà shí', '很久以前就有了'],
  ['gui', '金桂', 'jīn guì', '开花满院香', 'kāi huā mǎn yuàn xiāng', '秋天开小黄花'],
];
const STORY = {
  clues: CARDS.map(([k, n, npy, f, fpy, more]) => ({
    q: `<span class="sz-icon">${icon(k)}</span><b class="sz-name">${r(n, npy)}</b>`,
    a: `<b class="sz-feat">${r(f, fpy)}</b><span class="sz-more">${more}</span>`,
  })),
  clueLabels: ['树木名片', '它的特点'],
  picks: {
    mu: [
      { t: '杨', ok: true }, { t: '银', ok: false, why: '金字旁' }, { t: '桐', ok: true }, { t: '装', ok: false, why: '衣字底' },
      { t: '松', ok: true }, { t: '柏', ok: true }, { t: '疆', ok: false }, { t: '桦', ok: true },
      { t: '守', ok: false, why: '宝盖头' }, { t: '杉', ok: true }, { t: '化', ok: false, why: '单人旁' }, { t: '桂', ok: true },
      { t: '掌', ok: false }, { t: '梧', ok: true }, { t: '棉', ok: true }, { t: '枫', ok: true }, { t: '耐', ok: false },
    ],
  },
};

Hanzi.init({
  evolve: [
    { z: '木', note: '像一棵树：上面是树枝，中间是树干，下面是树根。' },
    { z: '林', old: ['木', '木'], note: '两棵树在一起，就是“林”。' },
  ],
  cards: [
    { z: '梧', py: 'wú', words: [['梧桐', 'wú tóng']] },
    { z: '桐', py: 'tóng', words: [['梧桐', 'wú tóng'], ['泡桐', 'pāo tóng']] },
    { z: '掌', py: 'zhǎng', words: [['手掌', 'shǒu zhǎng'], ['鼓掌', 'gǔ zhǎng']] },
    { z: '枫', py: 'fēng', words: [['枫树', 'fēng shù'], ['枫叶', 'fēng yè']] },
    { z: '松', py: 'sōng', words: [['松树', 'sōng shù'], ['松子', 'sōng zǐ']] },
    { z: '柏', py: 'bǎi', words: [['松柏', 'sōng bǎi'], ['翠柏', 'cuì bǎi']] },
    { z: '装', py: 'zhuāng', words: [['绿装', 'lǜ zhuāng'], ['服装', 'fú zhuāng']] },
    { z: '桦', py: 'huà', words: [['桦树', 'huà shù'], ['白桦', 'bái huà']] },
    { z: '耐', py: 'nài', words: [['耐寒', 'nài hán'], ['耐心', 'nài xīn']] },
    { z: '守', py: 'shǒu', words: [['守北疆', 'shǒu běi jiāng'], ['守门', 'shǒu mén']] },
    { z: '疆', py: 'jiāng', words: [['北疆', 'běi jiāng'], ['新疆', 'xīn jiāng']] },
    { z: '银', py: 'yín', words: [['银杏', 'yín xìng'], ['银色', 'yín sè']] },
    { z: '杉', py: 'shān', words: [['水杉', 'shuǐ shān'], ['云杉', 'yún shān']] },
    { z: '化', py: 'huà', words: [['活化石', 'huó huà shí'], ['变化', 'biàn huà']] },
    { z: '桂', py: 'guì', words: [['金桂', 'jīn guì'], ['桂花', 'guì huā']] },
  ],
  write: {
    a: [
      { z: '杨', py: 'yáng', bs: '木', bh: 7 },
      { z: '壮', py: 'zhuàng', bs: '丬', bh: 6 },
      { z: '桐', py: 'tóng', bs: '木', bh: 10 },
      { z: '枫', py: 'fēng', bs: '木', bh: 8 },
      { z: '松', py: 'sōng', bs: '木', bh: 8 },
    ],
    b: [
      { z: '柏', py: 'bǎi', bs: '木', bh: 9 },
      { z: '棉', py: 'mián', bs: '木', bh: 12 },
      { z: '杉', py: 'shān', bs: '木', bh: 7 },
      { z: '化', py: 'huà', bs: '亻', bh: 4 },
      { z: '桂', py: 'guì', bs: '木', bh: 10 },
    ],
  },
});

window.LESSON = {
  init() { Narrative.init(STORY); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
