'use strict';
/* “贝”的故事 · 本课数据与本课互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：① “贝”字变变变（海贝→甲骨文→金文→楷书）；② 贝壳连环画；③ 贝字旁字族；④ 贝币小商店。 */

/* 二下只给生字注音：data-pyk="甲:jiǎ" → 按顺序给这些字注音，其余字上面空着（与课本一致） */
document.querySelectorAll('[data-pyk]').forEach((el) => {
  const want = el.dataset.pyk.trim().split(/\s+/).filter(Boolean).map((s) => s.split(':'));
  let k = 0;
  const syl = [...el.textContent].filter((ch) => /\p{Script=Han}/u.test(ch))
    .map((ch) => (k < want.length && ch === want[k][0] ? want[k++][1] : '_'));
  if (k < want.length) console.warn(`注音字没找到：${want[k][0]}（${el.textContent}）`); // eslint-disable-line no-console
  el.dataset.py = syl.join(' ');
});

const shake = (el) => { el.classList.remove('wrong'); void el.offsetWidth; el.classList.add('wrong'); };

/* ================= 字理动画：点古字形重描 ================= */
document.querySelectorAll('.bei-evo .hz-old').forEach((svg) => svg.addEventListener('click', () => {
  svg.classList.remove('hz-draw'); void svg.getBoundingClientRect(); svg.classList.add('hz-draw');
}));

/* ================= 贝字旁字族 ================= */
const FAMILY = [
  { z: '赚', py: 'zhuàn', w: '赚钱', wpy: 'zhuàn qián', why: '做买卖得到钱', pos: 'l' },
  { z: '赔', py: 'péi', w: '赔本', wpy: 'péi běn', why: '做买卖亏了钱', pos: 'l' },
  { z: '购', py: 'gòu', w: '购买', wpy: 'gòu mǎi', why: '用钱买东西', pos: 'l' },
  { z: '财', py: 'cái', w: '钱财', wpy: 'qián cái', why: '钱和值钱的东西', pos: 'l' },
  { z: '贫', py: 'pín', w: '贫穷', wpy: 'pín qióng', why: '钱很少，生活苦', pos: 'b' },
  { z: '货', py: 'huò', w: '货物', wpy: 'huò wù', why: '拿来卖的东西', pos: 'b' },
  { z: '贵', py: 'guì', w: '珍贵', wpy: 'zhēn guì', why: '要花很多钱才能买到', pos: 'b' },
];
function initFamily(box) {
  box.innerHTML = `<div class="bei-tree"><div class="bei-root"><span class="hz-tzg">贝</span><small>🐚 古时候的钱</small></div>
      ${FAMILY.map((f, i) => `<button type="button" class="bei-leaf ${f.pos}" data-i="${i}" style="--a:${i}">${Hanzi.ruby(f.z, f.py)}</button>`).join('')}</div>
    <div class="bei-info"><p class="bei-hint">点一个字看一看</p></div>`;
  const info = box.querySelector('.bei-info');
  box.addEventListener('click', (e) => {
    const leaf = e.target.closest('.bei-leaf');
    if (!leaf) return;
    const f = FAMILY[+leaf.dataset.i];
    box.querySelectorAll('.bei-leaf').forEach((l) => l.classList.toggle('on', l === leaf));
    leaf.classList.add('seen');
    info.innerHTML = `<span class="hz-tzg">${f.z}</span><p class="bei-w">${Hanzi.ruby(f.w, f.wpy)}</p><p class="bei-why">${f.why}</p><p class="bei-pos">贝在${f.pos === 'l' ? '左边' : '下面'}</p>`;
    info.classList.remove('pop'); void info.offsetWidth; info.classList.add('pop');
  });
}
initFamily(document.getElementById('beiFam'));

/* ================= 贝币小商店 ================= */
const SHOP = [
  { q: '去商店（　）买文具', ans: '购', opts: ['构', '购', '沟'], item: '📒' },
  { q: '卖了西瓜（　）了钱', ans: '赚', opts: ['赚', '嫌', '歉'], item: '🍉' },
  { q: '做生意亏了叫（　）本', ans: '赔', opts: ['陪', '培', '赔'], item: '🏺' },
  { q: '很穷叫（　）穷', ans: '贫', opts: ['贫', '贪', '盆'], item: '🧺' },
  { q: '纸（　）和硬币', ans: '币', opts: ['市', '币', '巾'], item: '🪁' },
  { q: '钱（　）', ans: '财', opts: ['材', '才', '财'], item: '🎁' },
  { q: '贝壳很（　）贵', ans: '珍', opts: ['珍', '诊', '趁'], item: '📿' },
  { q: '不容易（　）坏', ans: '损', opts: ['捐', '损', '员'], item: '🧸' },
];
const SHOP_NEXT_MS = 1200;
function initShop(box) {
  let i = 0;
  let busy = false;
  box.innerHTML = `<div class="bei-stall"><div class="bei-sign">贝币小商店</div><p class="bei-sq"></p><div class="bei-sopts"></div><p class="bei-smsg"></p></div>
    <div class="bei-side"><div class="bei-purse"><b>我的钱袋</b><div class="bei-coins">${SHOP.map(() => '<i>🐚</i>').join('')}</div></div>
    <div class="bei-basket"><b>买到的东西</b><div class="bei-items"></div></div></div>`;
  const show = () => {
    const it = SHOP[i];
    box.querySelector('.bei-sq').innerHTML = `<span class="bei-item">${it.item}</span>${it.q}`;
    box.querySelector('.bei-sopts').innerHTML = it.opts.map((o) => `<button type="button" class="bei-so" data-o="${o}">${o}</button>`).join('');
    box.querySelector('.bei-smsg').textContent = '';
    busy = false;
  };
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-again]')) {
      i = 0;
      box.querySelectorAll('.bei-coins i').forEach((c) => c.classList.remove('paid'));
      box.querySelector('.bei-items').innerHTML = '';
      box.classList.remove('done');
      show();
      return;
    }
    const b = e.target.closest('.bei-so');
    if (!b || busy) return;
    const it = SHOP[i];
    if (b.dataset.o !== it.ans) { shake(b); box.querySelector('.bei-smsg').textContent = '店主摇摇头：再看看这个字。'; return; }
    busy = true;
    b.classList.add('right');
    box.querySelectorAll('.bei-coins i')[i].classList.add('paid');
    box.querySelector('.bei-items').insertAdjacentHTML('beforeend', `<span>${it.item}</span>`);
    box.querySelector('.bei-smsg').textContent = `付一枚贝币！${it.q.replace('（　）', it.ans)}`;
    i += 1;
    setTimeout(() => {
      if (i < SHOP.length) { show(); return; }
      box.classList.add('done');
      box.querySelector('.bei-sq').textContent = '贝币用完啦，东西都买齐了！';
      box.querySelector('.bei-sopts').innerHTML = '<button type="button" class="btn solid" data-again>再逛一次</button>';
    }, SHOP_NEXT_MS);
  });
  show();
}
initShop(document.getElementById('beiShop'));

Hanzi.init({
  cards: [
    { z: '甲', py: 'jiǎ', words: [['甲骨文', 'jiǎ gǔ wén'], ['指甲', 'zhǐ jia']] },
    { z: '骨', py: 'gǔ', words: [['甲骨文', 'jiǎ gǔ wén'], ['骨头', 'gǔ tou']] },
    { z: '漂', py: 'piào', words: [['漂亮', 'piào liang']] },
    { z: '珍', py: 'zhēn', words: [['珍贵', 'zhēn guì'], ['珍惜', 'zhēn xī']] },
    { z: '饰', py: 'shì', words: [['饰品', 'shì pǐn'], ['装饰', 'zhuāng shì']] },
    { z: '品', py: 'pǐn', words: [['饰品', 'shì pǐn'], ['物品', 'wù pǐn']] },
    { z: '随', py: 'suí', words: [['随身', 'suí shēn'], ['跟随', 'gēn suí']] },
    { z: '易', py: 'yì', words: [['容易', 'róng yì'], ['不易', 'bú yì']] },
    { z: '损', py: 'sǔn', words: [['损坏', 'sǔn huài'], ['损失', 'sǔn shī']] },
    { z: '币', py: 'bì', words: [['钱币', 'qián bì'], ['纸币', 'zhǐ bì']] },
    { z: '财', py: 'cái', words: [['钱财', 'qián cái'], ['财富', 'cái fù']] },
    { z: '赚', py: 'zhuàn', words: [['赚钱', 'zhuàn qián']] },
    { z: '赔', py: 'péi', words: [['赔本', 'péi běn'], ['赔礼', 'péi lǐ']] },
    { z: '购', py: 'gòu', words: [['购买', 'gòu mǎi'], ['采购', 'cǎi gòu']] },
    { z: '贫', py: 'pín', words: [['贫穷', 'pín qióng'], ['贫苦', 'pín kǔ']] },
  ],
  pick: {
    bs: [
      { q: '镜', py: 'jìng', ans: '钅', opts: ['贝', '钅', '王'] },
      { q: '珠', py: 'zhū', ans: '王', opts: ['王', '贝', '钅'] },
    ],
  },
  write: {
    a: [
      { z: '贝', py: 'bèi', bs: '贝', bh: 4 },
      { z: '壳', py: 'ké', bs: '士', bh: 7 },
      { z: '甲', py: 'jiǎ', bh: 5 },
      { z: '骨', py: 'gǔ', bs: '骨', bh: 9 },
      { z: '钱', py: 'qián', bs: '钅', bh: 10 },
    ],
    b: [
      { z: '币', py: 'bì', bs: '巾', bh: 4 },
      { z: '与', py: 'yǔ', bs: '一', bh: 3 },
      { z: '财', py: 'cái', bs: '贝', bh: 7 },
      { z: '购', py: 'gòu', bs: '贝', bh: 8 },
    ],
  },
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
