'use strict';
/* 树和喜鹊 · 本课数据与本课互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完） */

/* ================= 种树：每种一棵，多一个鸟窝、一只喜鹊 =================
 * SVG 800 × 340。第一棵在中间（从前只有一棵），后面按 SLOTS 顺序种。 */
const SLOTS = [[400, 1], [250, .85], [550, .85], [120, .75], [680, .75], [325, .7], [475, .7], [40, .65], [760, .65]];
const MANY = 6; // 种到这么多棵就算“好多好多”
const tree = ([x, s], i) => `<g class="xq-tree" data-i="${i}" transform="translate(${x} 300) scale(${s})">
  <g class="xq-grow">
    <path d="M-8 0V-90H8V0Z" fill="#9a6a3c"/>
    <circle cx="0" cy="-130" r="52" fill="#7cc35c"/><circle cx="-36" cy="-100" r="34" fill="#8fd06c"/><circle cx="36" cy="-100" r="34" fill="#6bb54e"/>
    <ellipse cx="18" cy="-118" rx="22" ry="11" fill="#c89a5a" stroke="#8a6232" stroke-width="2"/>
    <g class="xq-bird" transform="translate(18 -130)"><path d="M-14 0Q-4 -16 10 -8L22 -10L12 -2Q8 8 -6 6Z" fill="#222"/><path d="M-6 6Q2 0 10 -2L8 4Z" fill="#fff"/><path d="M-12 2L-34 10L-30 4Z" fill="#222"/><circle cx="12" cy="-6" r="1.6" fill="#fff"/></g>
  </g></g>`;
function initPlant(box) {
  box.innerHTML = `<div class="xq-field"><svg viewBox="0 0 800 340" aria-label="种树">
      <path d="M0 296Q200 280 400 296T800 290V340H0Z" fill="#a8dc86"/>
      ${SLOTS.map(tree).join('')}
      <text class="xq-chirp" x="400" y="40">叽叽喳喳！</text>
    </svg></div>
    <div class="xq-panel">
      <p class="xq-nums"><span><b class="n">1</b> 棵树</span><span><b class="n">1</b> 个鸟窝</span><span><b class="n">1</b> 只喜鹊</span></p>
      <p class="xq-say"></p>
      <p class="xq-mood"><span class="sad">孤单</span><span class="happy">快乐</span></p>
      <div class="xq-btns"><button type="button" class="btn solid" data-add>种一棵树</button><button type="button" class="btn" data-reset>回到从前</button></div>
    </div>`;
  let n = 1;
  const show = () => {
    box.querySelectorAll('.xq-tree').forEach((t) => t.classList.toggle('on', +t.dataset.i < n));
    box.querySelectorAll('.xq-nums .n').forEach((b) => { b.textContent = n; });
    const many = n >= MANY;
    box.classList.toggle('many', many);
    box.querySelector('.xq-say').textContent = n === 1 ? '从前，这里只有一棵树。' : many ? '后来，这里种了好多好多树！' : `这里有 ${n} 棵树了。`;
    box.querySelector('[data-add]').disabled = n === SLOTS.length;
  };
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-add]') && n < SLOTS.length) { n += 1; show(); }
    if (e.target.closest('[data-reset]')) { n = 1; show(); }
  });
  show();
}
initPlant(document.getElementById('plant'));

/* ================= 拍手读：拍一下读一个字 ================= */
const CLAPS = [
  ['叽叽喳喳', 'jī ji zhā zhā', '课文'], ['安安静静', 'ān ān jìng jìng', '课文'],
  ['高高兴兴', 'gāo gāo xìng xìng', '我还会说'], ['快快乐乐', 'kuài kuài lè lè', '我还会说'], ['干干净净', 'gān gān jìng jìng', '我还会说'], ['开开心心', 'kāi kāi xīn xīn', '我还会说'],
];
function initClap(box) {
  box.innerHTML = `<div class="xq-words">${CLAPS.map(([w, p, tag], i) => `<div class="xq-word" data-i="${i}"><small>${tag}</small><span class="py">${[...w].map((ch, k) => `<i>${Hanzi.ruby(ch, p.split(' ')[k])}</i>`).join('')}</span></div>`).join('')}</div>
    <div class="xq-clapbar"><button type="button" class="xq-hand" data-clap aria-label="拍手"><svg viewBox="0 0 64 64"><path d="M20 34L12 18C10 14 15 11 18 15L26 28L22 10C21 6 27 5 28 9L32 26L33 8C33 4 39 4 39 8L39 27L43 14C44 10 50 11 49 15L44 40C42 50 34 56 26 54C18 52 14 44 20 34Z" fill="#ffcf9e" stroke="#c98a52" stroke-width="2"/></svg>拍一下</button><button type="button" class="btn" data-reset>重新拍</button></div>`;
  const total = CLAPS.length * 4;
  let k = 0;
  const show = () => {
    box.querySelectorAll('.xq-word i').forEach((el, j) => el.classList.toggle('on', j < k));
    box.querySelectorAll('.xq-word').forEach((w, i) => { w.classList.toggle('cur', Math.floor(k / 4) === i && k < total); w.classList.toggle('done', (i + 1) * 4 <= k); });
  };
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-reset]')) { k = 0; show(); return; }
    if (!e.target.closest('[data-clap]') || k >= total) return;
    k += 1;
    const hand = box.querySelector('.xq-hand');
    hand.classList.remove('hit'); void hand.offsetWidth; hand.classList.add('hit');
    show();
  });
  show();
}
initClap(document.getElementById('clap'));

Hanzi.init({
  cards: [
    { z: '只', py: 'zhī', bs: '口', bh: 5, words: [['一只', 'yì zhī'], ['只有', 'zhǐ yǒu']] },
    { z: '窝', py: 'wō', bs: '穴', bh: 12, words: [['鸟窝', 'niǎo wō'], ['被窝', 'bèi wō']] },
    { z: '孤', py: 'gū', bs: '子', bh: 8, words: [['孤单', 'gū dān']] },
    { z: '单', py: 'dān', bs: '丷', bh: 8, words: [['孤单', 'gū dān'], ['简单', 'jiǎn dān']] },
    { z: '种', py: 'zhòng', bs: '禾', bh: 9, words: [['种树', 'zhòng shù'], ['种花', 'zhòng huā']] },
    { z: '都', py: 'dōu', bs: '阝', bh: 10, words: [['都有', 'dōu yǒu'], ['全都', 'quán dōu']] },
    { z: '邻', py: 'lín', bs: '阝', bh: 7, words: [['邻居', 'lín jū']] },
    { z: '居', py: 'jū', bs: '尸', bh: 8, words: [['邻居', 'lín jū']] },
    { z: '招', py: 'zhāo', bs: '扌', bh: 8, words: [['招呼', 'zhāo hu'], ['招手', 'zhāo shǒu']] },
    { z: '呼', py: 'hū', bs: '口', bh: 8, words: [['招呼', 'zhāo hu'], ['呼吸', 'hū xī']] },
    { z: '静', py: 'jìng', bs: '青', bh: 14, words: [['安静', 'ān jìng'], ['安安静静', 'ān ān jìng jìng']] },
    { z: '乐', py: 'lè', bs: '丿', bh: 5, words: [['快乐', 'kuài lè'], ['音乐', 'yīn yuè']] },
  ],
  shapes: {
    鸟: ['M38 28C40 16 54 14 60 24', 'M60 24C82 30 88 56 72 68C58 78 36 72 32 56', 'M32 56L12 80', 'M38 28L24 32', 'M54 74V94', 'M62 72V94'],
  },
  evolve: [
    { z: '木', note: '像一棵树：上面是树枝，下面是树根。“棵、树”都是木字旁，都和树木有关。' },
    { z: '鸟', note: '像一只侧着身子的鸟：头、身子、尾巴和爪子。“鹊、鸡、鸭”右边都有“鸟”。' },
  ],
  match: {
    bg: 'assets/haoduoshu.jpg',
    items: [
      { z: '只', x: 6, y: 52, hint: 'zhī' }, { z: '窝', x: 15, y: 46, hint: 'wō' }, { z: '孤', x: 33, y: 51, hint: 'gū' }, { z: '单', x: 41, y: 47, hint: 'dān' },
      { z: '邻', x: 63.5, y: 53, hint: 'lín' }, { z: '居', x: 76.5, y: 49, hint: 'jū' }, { z: '招', x: 20, y: 71, hint: 'zhāo' }, { z: '呼', x: 44.5, y: 69, hint: 'hū' },
      { z: '静', x: 68.5, y: 71, hint: 'jìng' }, { z: '乐', x: 91, y: 72, hint: 'lè' },
    ],
  },
  write: [
    { z: '单', py: 'dān', bs: '丷', bh: 8 },
    { z: '居', py: 'jū', bs: '尸', bh: 8 },
    { z: '招', py: 'zhāo', bs: '扌', bh: 8 },
    { z: '呼', py: 'hū', bs: '口', bh: 8 },
    { z: '快', py: 'kuài', bs: '忄', bh: 7 },
    { z: '乐', py: 'lè', bs: '丿', bh: 5 },
  ],
});

window.LESSON = {
  init() {
    Narrative.init({
      picks: {
        why: [
          { t: Hanzi.ruby('因为树有了邻居，喜鹊也有了邻居。', 'yīn wèi shù yǒu le lín jū xǐ què yě yǒu le lín jū'), ok: true, why: '对！不再孤单了。' },
          { t: Hanzi.ruby('因为天亮了，太阳出来了。', 'yīn wèi tiān liàng le tài yáng chū lái le'), ok: false, why: '天天都会天亮呀。' },
          { t: Hanzi.ruby('因为喜鹊们每天一起飞出去，一起飞回来。', 'yīn wèi xǐ què men měi tiān yì qǐ fēi chū qù yì qǐ fēi huí lái'), ok: true, why: '对！有伙伴一起。' },
          { t: Hanzi.ruby('因为树长得很高很高。', 'yīn wèi shù zhǎng de hěn gāo hěn gāo'), ok: false, why: '课文里没有这样说。' },
        ],
      },
    });
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
