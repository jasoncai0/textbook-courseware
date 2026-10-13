'use strict';
/* 田家四季歌 · 本课数据与本课互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：“四季农事轮盘”——按一下转一季（也可以点轮盘上的季节），右边换成这一季的画面和儿歌；农事活动分季节。 */

/* ================= 四季农事轮盘 ================= */
const SEASONS = [
  { z: '春', c: '#9bd47a', icon: '🦋' },
  { z: '夏', c: '#4fae6a', icon: '🌱' },
  { z: '秋', c: '#f0b63c', icon: '🌾' },
  { z: '冬', c: '#a9cbe8', icon: '❄️' },
];
const R = 100;
const wedge = (i) => {
  const a0 = (-135 + i * 90) * Math.PI / 180;
  const a1 = (-45 + i * 90) * Math.PI / 180;
  const p = (a) => `${(R * Math.cos(a)).toFixed(1)} ${(R * Math.sin(a)).toFixed(1)}`;
  return `M0 0L${p(a0)}A${R} ${R} 0 0 1 ${p(a1)}Z`;
};
function wheelSvg() {
  return `<svg viewBox="-112 -124 224 236" class="tj-svg" aria-hidden="true">
    <g class="tj-rot">${SEASONS.map((s, i) => {
      const a = (-90 + i * 90) * Math.PI / 180;
      const x = (62 * Math.cos(a)).toFixed(1);
      const y = (62 * Math.sin(a)).toFixed(1);
      return `<g class="tj-w" data-s="${i}"><path d="${wedge(i)}" fill="${s.c}"/>
        <g transform="translate(${x} ${y}) rotate(${i * 90})"><text class="ic" y="-10">${s.icon}</text><text class="zi" y="22">${s.z}</text></g></g>`;
    }).join('')}<circle r="16" class="hub"/></g>
    <path class="ptr" d="M0 -100L-12 -122H12Z"/>
  </svg>`;
}

function initWheel(box) {
  box.querySelector('.tj-wheel').innerHTML = wheelSvg();
  const set = (s) => {
    box.dataset.s = s;
    box.querySelector('.tj-rot').style.transform = `rotate(${-90 * s}deg)`;
    box.querySelectorAll('.tj-panel').forEach((p, i) => p.classList.toggle('cur', i === s));
  };
  box.addEventListener('click', (e) => {
    const w = e.target.closest('.tj-w');
    if (w) set(+w.dataset.s);
  });
  box.set = set;
  set(0);
}
const wheelBox = document.getElementById('tjWheel');
initWheel(wheelBox);

/* ================= 课后第 2 题：农事活动分季节（narrative 的 sort-row） ================= */
const r = (t, py) => Hanzi.ruby(t, py);
const STORY = {
  kinds: ['春', '夏', '秋', '冬'],
  sort: [
    { s: r('播种', 'bō zhǒng'), ok: ['春'], q: '春天把种子播进地里' },
    { s: r('耕田', 'gēng tián'), ok: ['春', '夏'], q: '翻土、犁地，准备种庄稼' },
    { s: r('采桑', 'cǎi sāng'), ok: ['夏', '春'], q: '“采桑养蚕又插秧”' },
    { s: r('插秧', 'chā yāng'), ok: ['夏', '春'], q: '把秧苗插到水田里' },
    { s: r('除草', 'chú cǎo'), ok: ['夏', '春'], q: '拔掉和庄稼抢养分的草' },
    { s: r('割麦', 'gē mài'), ok: ['夏'], q: '初夏麦子黄了，割麦子' },
    { s: r('打谷', 'dǎ gǔ'), ok: ['秋'], q: '“稻上场”，把谷粒打下来' },
    { s: r('积肥', 'jī féi'), ok: ['冬'], q: '冬天攒肥料，等明年用' },
  ],
};

Hanzi.init({
  shapes: {
    艹: ['M20 30H80', 'M36 14V44', 'M64 14V44'],
  },
  evolve: [
    { z: '季', old: ['禾', '子'], note: '上面是“禾”（庄稼），下面是“子”——庄稼一年一年地长，一季接着一季。（帮助记字的说法）' },
    { z: '苗', old: ['艹', '田'], note: '田里长出的小草一样的嫩芽，就是“苗”：麦苗、禾苗。' },
  ],
  cards: [
    { z: '季', py: 'jì', words: [['四季', 'sì jì'], ['季节', 'jì jié']] },
    { z: '蝴', py: 'hú', words: [['蝴蝶', 'hú dié']] },
    { z: '蝶', py: 'dié', words: [['蝴蝶', 'hú dié']] },
    { z: '麦', py: 'mài', words: [['麦苗', 'mài miáo'], ['小麦', 'xiǎo mài']] },
    { z: '苗', py: 'miáo', words: [['麦苗', 'mài miáo'], ['禾苗', 'hé miáo']] },
    { z: '桑', py: 'sāng', words: [['桑叶', 'sāng yè'], ['采桑', 'cǎi sāng']] },
    { z: '肥', py: 'féi', words: [['正肥', 'zhèng féi'], ['积肥', 'jī féi']] },
    { z: '农', py: 'nóng', words: [['农事', 'nóng shì'], ['农民', 'nóng mín']] },
    { z: '归', py: 'guī', words: [['归来', 'guī lái'], ['回归', 'huí guī']] },
    { z: '戴', py: 'dài', words: [['戴月光', 'dài yuè guāng'], ['戴帽子', 'dài mào zi']] },
    { z: '场', py: 'cháng', words: [['稻上场', 'dào shàng cháng'], ['场院', 'cháng yuàn']] },
    { z: '谷', py: 'gǔ', words: [['谷子', 'gǔ zi'], ['稻谷', 'dào gǔ']] },
    { z: '粒', py: 'lì', words: [['粒粒香', 'lì lì xiāng'], ['米粒', 'mǐ lì']] },
    { z: '虽', py: 'suī', words: [['虽然', 'suī rán']] },
    { z: '辛', py: 'xīn', words: [['辛苦', 'xīn kǔ']] },
    { z: '苦', py: 'kǔ', words: [['辛苦', 'xīn kǔ'], ['苦瓜', 'kǔ guā']] },
    { z: '了', py: 'liǎo', words: [['农事了', 'nóng shì liǎo'], ['了不起', 'liǎo bu qǐ']] },
  ],
  apples: [['季', 'jì'], ['蝴', 'hú'], ['蝶', 'dié'], ['麦', 'mài'], ['苗', 'miáo'], ['桑', 'sāng'], ['农', 'nóng'], ['戴', 'dài'], ['谷', 'gǔ'], ['粒', 'lì'], ['虽', 'suī'], ['苦', 'kǔ']],
  write: {
    a: [
      { z: '季', py: 'jì', bs: '禾', bh: 8 },
      { z: '吹', py: 'chuī', bs: '口', bh: 7 },
      { z: '肥', py: 'féi', bs: '月', bh: 8 },
      { z: '农', py: 'nóng', bs: '冖', bh: 6 },
      { z: '事', py: 'shì', bs: '一', bh: 8 },
    ],
    b: [
      { z: '忙', py: 'máng', bs: '忄', bh: 6 },
      { z: '归', py: 'guī', bs: '彐', bh: 5 },
      { z: '戴', py: 'dài', bs: '戈', bh: 17 },
      { z: '辛', py: 'xīn', bs: '辛', bh: 7 },
      { z: '苦', py: 'kǔ', bs: '艹', bh: 8 },
    ],
  },
});

window.LESSON = {
  init() { Narrative.init(STORY); },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.contains(wheelBox)) wheelBox.set(Math.min(step, SEASONS.length - 1));
  },
};
