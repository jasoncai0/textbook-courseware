'use strict';
/* 操场上 · 本课数据。识字组件见 ../shared/hanzi.js；归类、换偏旁见 zuzi.js（都在顶层调用，deck.js 加载前渲染完） */

/* 做动作认字（本课独有）：点字，小人做动作；hand = 用手（扌），否则用脚（足字旁） */
const ACTS = [
  { z: '打', py: 'dǎ', w: '打球', wpy: 'dǎ qiú', hand: true },
  { z: '拔', py: 'bá', w: '拔河', wpy: 'bá hé', hand: true },
  { z: '拍', py: 'pāi', w: '拍皮球', wpy: 'pāi pí qiú', hand: true },
  { z: '跑', py: 'pǎo', w: '跑步', wpy: 'pǎo bù' },
  { z: '踢', py: 'tī', w: '踢足球', wpy: 'tī zú qiú' },
  { z: '跳', py: 'tiào', w: '跳高', wpy: 'tiào gāo' },
];
const FIGURE = `<svg class="cc-man" viewBox="0 0 240 260" aria-hidden="true">
  <line class="cc-rope" x1="150" y1="118" x2="236" y2="118"/>
  <g class="cc-body">
    <circle class="cc-head" cx="110" cy="46" r="22"/>
    <line x1="110" y1="68" x2="110" y2="150"/>
    <g class="cc-arm l"><line x1="110" y1="84" x2="74" y2="128"/></g>
    <g class="cc-arm r"><line x1="110" y1="84" x2="146" y2="128"/></g>
    <g class="cc-leg l"><line x1="110" y1="150" x2="86" y2="214"/></g>
    <g class="cc-leg r"><line x1="110" y1="150" x2="134" y2="214"/></g>
  </g>
  <circle class="cc-ball" cx="170" cy="200" r="13"/>
  <line class="cc-ground" x1="20" y1="216" x2="220" y2="216"/>
</svg>`;

function initAct(box) {
  const r = Hanzi.ruby;
  box.innerHTML = `<div class="cc-btns">${ACTS.map((a, i) => `<button type="button" class="cc-btn${a.hand ? ' hand' : ''}" data-i="${i}">${r(a.z, a.py)}</button>`).join('')}</div>
    <div class="cc-stage">${FIGURE}</div>
    <div class="cc-info"><p class="cc-word"></p><p class="cc-bs">点左边的字，看小人做动作。</p></div>`;
  const svg = box.querySelector('.cc-man');
  const word = box.querySelector('.cc-word');
  const bs = box.querySelector('.cc-bs');
  box.addEventListener('click', (e) => {
    const b = e.target.closest('.cc-btn');
    if (!b) return;
    const a = ACTS[+b.dataset.i];
    box.querySelectorAll('.cc-btn').forEach((x) => x.classList.toggle('on', x === b));
    svg.setAttribute('class', `cc-man act-${b.dataset.i} ${a.hand ? 'use-hand' : 'use-foot'}`);
    word.innerHTML = r(a.w, a.wpy);
    bs.innerHTML = a.hand ? '用<b>手</b>做 → 提手旁 <b class="cc-r">扌</b>' : '用<b>脚</b>做 → 足字旁 <b class="cc-r">⻊</b>';
  });
}
document.querySelectorAll('[data-act]').forEach(initAct);

Zuzi.init({
  sort: {
    bs: {
      buckets: [
        { t: '扌', name: '提手旁 · 用手做', ok: ['打', '拔', '拍', '操'] },
        { t: '⻊', name: '足字旁 · 用脚做', ok: ['跑', '踢', '跳'] },
      ],
      cards: [['打', 'dǎ'], ['拔', 'bá'], ['拍', 'pāi'], ['操', 'cāo'], ['跑', 'pǎo'], ['踢', 'tī'], ['跳', 'tiào']],
    },
  },
  swap: {
    bao: {
      base: '包', py: 'bāo', name: '“包”字家族',
      items: [
        { bs: '⻊', z: '跑', py: 'pǎo', w: '跑步', wpy: 'pǎo bù', tip: '足字旁：跑步用脚' },
        { bs: '扌', z: '抱', py: 'bào', w: '抱一抱', wpy: 'bào yi bào', tip: '提手旁：抱要用手' },
        { bs: '氵', z: '泡', py: 'pào', w: '泡泡', wpy: 'pào pao', tip: '三点水：水里冒泡泡' },
        { bs: '饣', z: '饱', py: 'bǎo', w: '吃饱', wpy: 'chī bǎo', tip: '食字旁：和吃东西有关' },
      ],
    },
  },
});

Hanzi.init({
  shapes: {
    手: ['M50 92V30', 'M50 30L22 8', 'M50 30L38 6', 'M50 30L62 6', 'M50 30L78 8', 'M24 48H76', 'M28 66H72'],
    足: ['M30 10H70V40H30Z', 'M50 40V84', 'M50 84H86', 'M50 62H72', 'M50 84L22 92'],
  },
  evolve: [
    { z: '手', note: '像一只张开手指的手。做偏旁写成“扌”（提手旁）：打、拔、拍。' },
    { z: '足', note: '像一只脚：上面是膝盖，下面是脚。做偏旁写成足字旁：跑、踢、跳。' },
  ],
  /* 看图选字：裁 assets/caochang.jpg 的局部（放大 3 倍） */
  pick: {
    kan: [
      { pic: 'assets/caochang.jpg', pos: '2% 34%', size: '300%', ans: '打', opts: ['打', '踢', '拔'] },
      { pic: 'assets/caochang.jpg', pos: '52% 30%', size: '300%', ans: '拔', opts: ['拍', '拔', '跑'] },
      { pic: 'assets/caochang.jpg', pos: '0% 92%', size: '300%', ans: '拍', opts: ['跳', '打', '拍'] },
      { pic: 'assets/caochang.jpg', pos: '47% 92%', size: '300%', ans: '跑', opts: ['跑', '拔', '踢'] },
      { pic: 'assets/caochang.jpg', pos: '98% 88%', size: '300%', ans: '踢', opts: ['拍', '踢', '跳'] },
    ],
  },
  cards: [
    { z: '操', py: 'cāo', bs: '扌', bh: 16, words: [['操场', 'cāo chǎng'], ['做操', 'zuò cāo']] },
    { z: '场', py: 'chǎng', bs: '土', bh: 6, words: [['操场', 'cāo chǎng'], ['广场', 'guǎng chǎng']] },
    { z: '拔', py: 'bá', bs: '扌', bh: 8, words: [['拔河', 'bá hé'], ['拔草', 'bá cǎo']] },
    { z: '拍', py: 'pāi', bs: '扌', bh: 8, words: [['拍皮球', 'pāi pí qiú'], ['拍手', 'pāi shǒu']] },
    { z: '跑', py: 'pǎo', bs: '足', bh: 12, words: [['跑步', 'pǎo bù'], ['赛跑', 'sài pǎo']] },
    { z: '踢', py: 'tī', bs: '足', bh: 15, words: [['踢足球', 'tī zú qiú'], ['踢毽子', 'tī jiàn zi']] },
    { z: '铃', py: 'líng', bs: '钅', bh: 10, words: [['铃声', 'líng shēng'], ['门铃', 'mén líng']] },
    { z: '热', py: 'rè', bs: '灬', bh: 10, words: [['热闹', 'rè nao'], ['热水', 'rè shuǐ']] },
    { z: '闹', py: 'nào', bs: '门', bh: 8, words: [['热闹', 'rè nao'], ['闹钟', 'nào zhōng']] },
    { z: '锻', py: 'duàn', bs: '钅', bh: 14, words: [['锻炼', 'duàn liàn']] },
    { z: '炼', py: 'liàn', bs: '火', bh: 9, words: [['锻炼', 'duàn liàn']] },
    { z: '体', py: 'tǐ', bs: '亻', bh: 7, words: [['身体', 'shēn tǐ'], ['体操', 'tǐ cāo']] },
  ],
  write: {
    a: [
      { z: '打', py: 'dǎ', bs: '扌', bh: 5 },
      { z: '拍', py: 'pāi', bs: '扌', bh: 8 },
      { z: '跑', py: 'pǎo', bs: '足', bh: 12 },
      { z: '足', py: 'zú', bs: '足', bh: 7 },
    ],
    b: [
      { z: '声', py: 'shēng', bs: '士', bh: 7 },
      { z: '身', py: 'shēn', bs: '身', bh: 7 },
      { z: '体', py: 'tǐ', bs: '亻', bh: 7 },
    ],
  },
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
