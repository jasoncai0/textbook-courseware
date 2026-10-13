'use strict';
/* 姓氏歌 · 本课数据。识字组件见 ../shared/hanzi.js；合字见 zuzi.js（都在顶层调用，deck.js 加载前渲染完） */

/* 问答游戏（课后第 2 题）：点一个姓，两个小朋友一问一答。say 是介绍这个姓的说法 */
const WENDA = [
  { z: '李', py: 'lǐ', say: '木子李', saypy: 'mù zǐ lǐ' },
  { z: '张', py: 'zhāng', say: '弓长张', saypy: 'gōng cháng zhāng' },
  { z: '胡', py: 'hú', say: '古月胡', saypy: 'gǔ yuè hú' },
  { z: '吴', py: 'wú', say: '口天吴', saypy: 'kǒu tiān wú' },
  { z: '徐', py: 'xú', say: '双人徐', saypy: 'shuāng rén xú' },
  { z: '许', py: 'xǔ', say: '言午许', saypy: 'yán wǔ xǔ' },
  { z: '方', py: 'fāng', say: '方向的方', saypy: 'fāng xiàng de fāng' },
  { z: '王', py: 'wáng', say: '大王的王', saypy: 'dà wáng de wáng' },
];

function initWenda(box) {
  const r = Hanzi.ruby;
  box.innerHTML = `<div class="ws-btns">${WENDA.map((w, i) => `<button type="button" class="btn" data-i="${i}">${r(w.z, w.py)}</button>`).join('')}</div>
    <div class="ws-talk"></div>`;
  const talk = box.querySelector('.ws-talk');
  const show = (i) => {
    const w = WENDA[i];
    box.querySelectorAll('[data-i]').forEach((b) => b.classList.toggle('solid', +b.dataset.i === i));
    talk.innerHTML = `<p class="ws-b q">${r('你姓什么？', 'nǐ xìng shén me')}</p>
      <p class="ws-b a">${r('我姓', 'wǒ xìng')}<b>${r(w.z, w.py)}</b>。</p>
      <p class="ws-b q">${r('什么', 'shén me')}<b>${r(w.z, w.py)}</b>？</p>
      <p class="ws-b a ws-said"><b>${r(w.say, w.saypy)}</b>。</p>`;
  };
  box.addEventListener('click', (e) => {
    const b = e.target.closest('[data-i]');
    if (b) show(+b.dataset.i);
  });
  show(0);
}
document.querySelectorAll('[data-wenda]').forEach(initWenda);

Zuzi.init({
  combine: [
    { parts: ['木', '子'], z: '李', py: 'lǐ', say: '木子李', saypy: 'mù zǐ lǐ' },
    { parts: ['弓', '长'], z: '张', py: 'zhāng', say: '弓长张', saypy: 'gōng cháng zhāng' },
    { parts: ['古', '月'], z: '胡', py: 'hú', say: '古月胡', saypy: 'gǔ yuè hú' },
    { parts: ['口', '天'], z: '吴', py: 'wú', say: '口天吴', saypy: 'kǒu tiān wú' },
    { parts: ['彳', '余'], z: '徐', py: 'xú', say: '双人徐', saypy: 'shuāng rén xú' },
    { parts: ['讠', '午'], z: '许', py: 'xǔ', say: '言午许', saypy: 'yán wǔ xǔ' },
  ],
});

Hanzi.init({
  evolve: [
    { z: '李', old: ['木', '子'], note: '树（木）下有个孩子（子）：木子李。' },
    { z: '吴', old: ['口', '天'], note: '上面一张嘴（口），下面一个人（天）：口天吴。' },
  ],
  pick: {
    cai: [
      { q: '木子', py: 'mù zǐ', ans: '李', opts: ['李', '张', '胡'] },
      { q: '弓长', py: 'gōng cháng', ans: '张', opts: ['吴', '张', '许'] },
      { q: '古月', py: 'gǔ yuè', ans: '胡', opts: ['胡', '李', '吴'] },
      { q: '口天', py: 'kǒu tiān', ans: '吴', opts: ['张', '许', '吴'] },
      { q: '言午', py: 'yán wǔ', ans: '许', opts: ['许', '徐', '胡'] },
    ],
  },
  cards: [
    { z: '姓', py: 'xìng', bs: '女', bh: 8, words: [['姓名', 'xìng míng'], ['姓氏', 'xìng shì']] },
    { z: '氏', py: 'shì', bs: '氏', bh: 4, words: [['姓氏', 'xìng shì']] },
    { z: '李', py: 'lǐ', bs: '木', bh: 7, words: [['木子李', 'mù zǐ lǐ'], ['李子', 'lǐ zi']] },
    { z: '张', py: 'zhāng', bs: '弓', bh: 7, words: [['弓长张', 'gōng cháng zhāng'], ['一张纸', 'yì zhāng zhǐ']] },
    { z: '古', py: 'gǔ', bs: '十', bh: 5, words: [['古月胡', 'gǔ yuè hú'], ['古代', 'gǔ dài']] },
    { z: '吴', py: 'wú', bs: '口', bh: 7, words: [['口天吴', 'kǒu tiān wú']] },
    { z: '赵', py: 'zhào', bs: '走', bh: 9, words: [['赵钱孙李', 'zhào qián sūn lǐ']] },
    { z: '钱', py: 'qián', bs: '钅', bh: 10, words: [['钱包', 'qián bāo'], ['零钱', 'líng qián']] },
    { z: '孙', py: 'sūn', bs: '子', bh: 6, words: [['孙子', 'sūn zi'], ['孙女', 'sūn nǚ']] },
    { z: '周', py: 'zhōu', bs: '冂', bh: 8, words: [['周末', 'zhōu mò'], ['一周', 'yì zhōu']] },
    { z: '王', py: 'wáng', bs: '王', bh: 4, words: [['大王', 'dà wáng'], ['王子', 'wáng zǐ']] },
    { z: '官', py: 'guān', bs: '宀', bh: 8, words: [['上官', 'shàng guān'], ['五官', 'wǔ guān']] },
  ],
  apples: [['姓', 'xìng'], ['氏', 'shì'], ['李', 'lǐ'], ['张', 'zhāng'], ['古', 'gǔ'], ['吴', 'wú'], ['赵', 'zhào'], ['钱', 'qián'], ['孙', 'sūn'], ['周', 'zhōu'], ['王', 'wáng'], ['官', 'guān']],
  write: {
    a: [
      { z: '姓', py: 'xìng', bs: '女', bh: 8 },
      { z: '什', py: 'shén', bs: '亻', bh: 4 },
      { z: '么', py: 'me', bs: '丿', bh: 3 },
      { z: '双', py: 'shuāng', bs: '又', bh: 4 },
    ],
    b: [
      { z: '国', py: 'guó', bs: '囗', bh: 8 },
      { z: '王', py: 'wáng', bs: '王', bh: 4 },
      { z: '方', py: 'fāng', bs: '方', bh: 4 },
    ],
  },
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
