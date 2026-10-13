'use strict';
/* 明天要远足 · 本课数据与本课互动。记叙文故事页见 ../shared/narrative.js，低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完） */

/* ================= 睡不着时的想象：点一个“想法泡泡”，看看小女孩在想什么 =================
 * 前两个是课文里的“那地方的海 / 云”，第三个让孩子自己编：选一样东西、选一个人，句子自动拼好。 */
const DREAMS = [
  {
    t: ['那地方的海', 'nà dì fang de hǎi'], pic: 'hai',
    lines: [['那地方的海，', 'nà dì fang de hǎi'], ['真的像老师说的，', 'zhēn de xiàng lǎo shī shuō de'], ['那么多种颜色吗？', 'nà me duō zhǒng yán sè ma']],
  },
  {
    t: ['那地方的云', 'nà dì fang de yún'], pic: 'yun',
    lines: [['那地方的云，', 'nà dì fang de yún'], ['真的像同学说的，', 'zhēn de xiàng tóng xué shuō de'], ['那么洁白柔软吗？', 'nà me jié bái róu ruǎn ma']],
  },
];
/* 自己编：东西 + 它的样子（选东西时自动带出），谁说的 */
const OWN_THINGS = [['山', 'shān', '高', 'gāo'], ['花', 'huā', '香', 'xiāng'], ['星星', 'xīng xing', '亮', 'liàng'], ['小鸟', 'xiǎo niǎo', '多', 'duō']];
const OWN_WHO = [['爸爸', 'bà ba'], ['妈妈', 'mā ma'], ['书上', 'shū shàng']];

function buildDream(box) {
  const r = Hanzi.ruby;
  const bubble = (i, [t, py]) => `<button type="button" class="yz-bub" data-i="${i}"><span class="py">${r(t, py)}</span></button>`;
  const panel = (d, i) => `<div class="yz-panel" data-i="${i}">
      <div class="yz-pic" data-bg="assets/${d.pic}.jpg"></div>
      <div class="yz-lines py">${d.lines.map(([t, py]) => `<p>${r(t, py)}</p>`).join('')}</div></div>`;
  const chips = (list, kind) => list.map(([t, py], k) => `<button type="button" class="btn yz-chip" data-${kind}="${k}"><span class="py">${r(t, py)}</span></button>`).join('');
  box.innerHTML = `<div class="yz-bed" data-bg="assets/shuibuzhao.jpg">
      ${DREAMS.map((d, i) => bubble(i, d.t)).join('')}${bubble(2, ['我来想', 'wǒ lái xiǎng'])}</div>
    <div class="yz-side">
      <p class="yz-hint">点一点小女孩头上的泡泡：她睡不着，在想什么呢？</p>
      ${DREAMS.map(panel).join('')}
      <div class="yz-panel yz-own" data-i="2">
        <div class="yz-pick"><b>想什么？</b>${chips(OWN_THINGS, 'th')}</div>
        <div class="yz-pick"><b>谁说的？</b>${chips(OWN_WHO, 'who')}</div>
        <div class="yz-lines py yz-out"></div>
      </div>
    </div>`;
  const own = { th: 0, who: 0 };
  const renderOwn = () => {
    const [n, npy, a, apy] = OWN_THINGS[own.th];
    const [w, wpy] = OWN_WHO[own.who];
    box.querySelector('.yz-out').innerHTML = [
      [`那地方的${n}，`, `nà dì fang de ${npy}`], [`真的像${w}说的，`, `zhēn de xiàng ${wpy} shuō de`], [`那么${a}吗？`, `nà me ${apy} ma`],
    ].map(([t, py]) => `<p>${r(t, py)}</p>`).join('');
    box.querySelectorAll('[data-th]').forEach((c) => c.classList.toggle('solid', +c.dataset.th === own.th));
    box.querySelectorAll('[data-who]').forEach((c) => c.classList.toggle('solid', +c.dataset.who === own.who));
  };
  box.addEventListener('click', (e) => {
    const bub = e.target.closest('.yz-bub');
    if (bub) {
      box.querySelectorAll('.yz-bub').forEach((b) => b.classList.toggle('on', b === bub));
      box.querySelectorAll('.yz-panel').forEach((p) => p.classList.toggle('on', p.dataset.i === bub.dataset.i));
      box.querySelector('.yz-hint').hidden = true;
      return;
    }
    const chip = e.target.closest('.yz-chip');
    if (!chip) return;
    if (chip.dataset.th !== undefined) own.th = +chip.dataset.th;
    else own.who = +chip.dataset.who;
    renderOwn();
  });
  renderOwn();
}
buildDream(document.getElementById('dream'));

Hanzi.init({
  cards: [
    { z: '睡', py: 'shuì', bs: '目', bh: 13, words: [['睡觉', 'shuì jiào'], ['睡不着', 'shuì bù zháo']] },
    { z: '那', py: 'nà', bs: '阝', bh: 6, words: [['那么', 'nà me'], ['那地方', 'nà dì fang']] },
    { z: '海', py: 'hǎi', bs: '氵', bh: 10, words: [['大海', 'dà hǎi'], ['海水', 'hǎi shuǐ']] },
    { z: '真', py: 'zhēn', bs: '十', bh: 10, words: [['真的', 'zhēn de'], ['认真', 'rèn zhēn']] },
    { z: '老', py: 'lǎo', bs: '老', bh: 6, words: [['老师', 'lǎo shī'], ['老人', 'lǎo rén']] },
    { z: '师', py: 'shī', bs: '巾', bh: 6, words: [['老师', 'lǎo shī']] },
    { z: '吗', py: 'ma', bs: '口', bh: 6, words: [['好吗', 'hǎo ma'], ['是吗', 'shì ma']] },
    { z: '同', py: 'tóng', bs: '冂', bh: 6, words: [['同学', 'tóng xué'], ['同样', 'tóng yàng']] },
    { z: '什', py: 'shén', bs: '亻', bh: 4, words: [['什么', 'shén me']] },
    { z: '才', py: 'cái', bs: '一', bh: 3, words: [['才天亮', 'cái tiān liàng'], ['刚才', 'gāng cái']] },
    { z: '亮', py: 'liàng', bs: '亠', bh: 9, words: [['天亮', 'tiān liàng'], ['明亮', 'míng liàng']] },
  ],
  shapes: {
    才: ['M8 34H92', 'M56 8V94', 'M56 34L28 64'],
  },
  evolve: [
    { z: '明', old: ['日', '月'], note: '太阳和月亮放在一起，又亮又光明。“明天”的“明”就是这个字。' },
    { z: '才', note: '像小草刚从地里冒出头来。（帮助记字的说法）' },
  ],
  apples: [['睡', 'shuì'], ['那', 'nà'], ['海', 'hǎi'], ['真', 'zhēn'], ['老', 'lǎo'], ['师', 'shī'], ['吗', 'ma'], ['同', 'tóng'], ['什', 'shén'], ['才', 'cái'], ['亮', 'liàng']],
  write: [
    { z: '才', py: 'cái', bs: '一', bh: 3 },
    { z: '明', py: 'míng', bs: '日', bh: 8 },
    { z: '同', py: 'tóng', bs: '冂', bh: 6 },
    { z: '学', py: 'xué', bs: '子', bh: 8 },
  ],
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
