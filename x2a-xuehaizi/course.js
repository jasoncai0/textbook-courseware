'use strict';
/* 雪孩子 · 本课数据与本课互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用）
 * 本课独有：① 连环画分格读故事（12 格，一格一段）；② 雪孩子的变化动画：雪 → 水 → 水汽 → 白云；
 *           ③ 句子“长”出来（课后第 2 题）；④ 排连环画讲故事；⑤ 接雪花识字游戏。 */

/* ================= 变化页：字幕只显示最新一句 ================= */
function updateCaption(slide, step) {
  const lines = [...slide.querySelectorAll('.xh-cap p')];
  lines.forEach((p) => p.classList.toggle('cur', +p.dataset.step === Math.max(1, step)));
  const scene = slide.querySelector('.xh-scene');
  if (scene) scene.dataset.s = step;
}

/* ================= 排一排连环画 ================= */
const STORY = [
  { e: '⛄', t: '堆雪孩子', py: 'duī xuě hái zi' },
  { e: '🎵', t: '一起玩', py: 'yì qǐ wán' },
  { e: '💤', t: '添柴睡觉', py: 'tiān chái shuì jiào' },
  { e: '🔥', t: '着火了', py: 'zháo huǒ le' },
  { e: '🐰', t: '救小白兔', py: 'jiù xiǎo bái tù' },
  { e: '☁️', t: '变成白云', py: 'biàn chéng bái yún' },
];
const SHUFFLED = [3, 0, 5, 2, 4, 1];
function initOrder(box) {
  if (!box) return;
  const card = (i) => `<span class="xo-e">${STORY[i].e}</span><span class="xo-t">${Hanzi.ruby(STORY[i].t, STORY[i].py)}</span>`;
  box.innerHTML = `<div class="xo-slots">${STORY.map((_, i) => `<div class="xo-slot"><b>${i + 1}</b></div>`).join('')}</div>
    <div class="xo-pool">${SHUFFLED.map((i) => `<button type="button" class="xo-card" data-i="${i}">${card(i)}</button>`).join('')}</div>
    <p class="xo-msg">故事是怎样发生的？按先后顺序点一点。</p>
    <div class="btns"><button type="button" class="btn" data-again>再排一次</button></div>`;
  const msg = box.querySelector('.xo-msg');
  const slots = box.querySelectorAll('.xo-slot');
  let next = 0;
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-again]')) {
      next = 0; box.classList.remove('all-done');
      box.querySelectorAll('.xo-card').forEach((c) => c.classList.remove('used', 'wrong'));
      slots.forEach((s, i) => { s.innerHTML = `<b>${i + 1}</b>`; s.classList.remove('done'); });
      msg.textContent = '故事是怎样发生的？按先后顺序点一点。'; return;
    }
    const c = e.target.closest('.xo-card:not(.used)');
    if (!c || next >= STORY.length) return;
    const i = +c.dataset.i;
    if (i !== next) {
      c.classList.remove('wrong'); void c.offsetWidth; c.classList.add('wrong');
      msg.textContent = '再想想，接下来发生了什么？'; return;
    }
    c.classList.add('used');
    slots[next].innerHTML = `<b>${next + 1}</b>${card(i)}`;
    slots[next].classList.add('done');
    next += 1;
    msg.textContent = next < STORY.length ? '对了！接下来呢？' : '排好了！看着格子，把故事讲一讲。';
    box.classList.toggle('all-done', next === STORY.length);
  });
}
initOrder(document.getElementById('xhOrder'));

/* ================= 接雪花 ================= */
const GAME = [['添', 'tiān'], ['柴', 'chái'], ['烧', 'shāo'], ['旺', 'wàng'], ['渐', 'jiàn'], ['哎', 'āi'], ['呀', 'yā'], ['冒', 'mào'],
  ['呛', 'qiàng'], ['烫', 'tàng'], ['终', 'zhōng'], ['浑', 'hún'], ['淋', 'lín'], ['灭', 'miè'], ['激', 'jī'], ['瞧', 'qiáo']];
const ASK = [2, 9, 0, 13, 5, 11, 3, 15, 7, 12, 1, 8, 6, 14, 4, 10];
const FALL_S = 11;
const COLS = 8;
function flakeSvg() {
  const arms = Array.from({ length: 6 }, (_, i) => `<path d="M0 0V-44M0 -28l-10 -10M0 -28l10 -10" transform="rotate(${i * 60})"/>`).join('');
  return `<svg viewBox="-50 -50 100 100" aria-hidden="true"><g>${arms}</g><circle r="24"/></svg>`;
}
function initFlakes(box) {
  if (!box) return;
  box.innerHTML = `<div class="xs-bar"><span class="xs-q"></span><span class="xs-msg">雪花飘下来了，接住拼音对应的字！</span><button type="button" class="btn" data-again>再玩一次</button></div>
    <div class="xs-sky">${GAME.map(([z], i) => `<button type="button" class="xs-flake" data-i="${i}" style="left:${(i % COLS) * (100 / COLS) + 6}%;animation-delay:${-((i * 5.3) % FALL_S).toFixed(1)}s">${flakeSvg()}<b>${z}</b></button>`).join('')}
    <div class="xs-cup"><span class="xs-in"></span><b>0</b></div></div>`;
  const q = box.querySelector('.xs-q');
  const msg = box.querySelector('.xs-msg');
  const cnt = box.querySelector('.xs-cup b');
  const cup = box.querySelector('.xs-in');
  let k = 0;
  const ask = () => { q.textContent = k < ASK.length ? GAME[ASK[k]][1] : '★'; };
  ask();
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-again]')) {
      k = 0; cup.innerHTML = ''; cnt.textContent = '0'; box.classList.remove('all-done');
      box.querySelectorAll('.xs-flake').forEach((f) => f.classList.remove('got', 'wrong'));
      msg.textContent = '雪花飘下来了，接住拼音对应的字！'; ask(); return;
    }
    const f = e.target.closest('.xs-flake:not(.got)');
    if (!f || k >= ASK.length) return;
    if (+f.dataset.i !== ASK[k]) {
      f.classList.remove('wrong'); void f.offsetWidth; f.classList.add('wrong');
      msg.textContent = '不是这片雪花，再看看！'; return;
    }
    f.classList.add('got');
    const [z, py] = GAME[ASK[k]];
    cup.insertAdjacentHTML('beforeend', `<i>${Hanzi.ruby(z, py)}</i>`);
    k += 1; cnt.textContent = k;
    msg.textContent = k < ASK.length ? `接住了“${z}”，化成一颗小水珠！` : '16 片雪花都接住了！';
    box.classList.toggle('all-done', k === ASK.length);
    ask();
  });
}
initFlakes(document.getElementById('xhGame'));

Hanzi.init({
  cards: [
    { z: '添', py: 'tiān', bs: '氵', bh: 11, words: [['添柴', 'tiān chái'], ['添加', 'tiān jiā']] },
    { z: '柴', py: 'chái', bs: '木', bh: 10, words: [['柴堆', 'chái duī'], ['火柴', 'huǒ chái']] },
    { z: '烧', py: 'shāo', bs: '火', bh: 10, words: [['烧火', 'shāo huǒ'], ['发烧', 'fā shāo']] },
    { z: '旺', py: 'wàng', bs: '日', bh: 8, words: [['旺旺的', 'wàng wàng de'], ['兴旺', 'xīng wàng']] },
    { z: '渐', py: 'jiàn', bs: '氵', bh: 11, words: [['渐渐', 'jiàn jiàn']] },
    { z: '哎', py: 'āi', bs: '口', bh: 8, words: [['哎呀', 'āi yā']] },
    { z: '呀', py: 'yā', bs: '口', bh: 7, words: [['哎呀', 'āi yā'], ['飞呀', 'fēi ya']] },
    { z: '冒', py: 'mào', bh: 9, words: [['冒出', 'mào chū'], ['感冒', 'gǎn mào']] },
    { z: '呛', py: 'qiàng', bs: '口', bh: 7, words: [['呛人', 'qiàng rén']] },
    { z: '烫', py: 'tàng', bs: '火', bh: 10, words: [['烫人', 'tàng rén'], ['滚烫', 'gǔn tàng']] },
    { z: '终', py: 'zhōng', bs: '纟', bh: 8, words: [['终于', 'zhōng yú']] },
    { z: '浑', py: 'hún', bs: '氵', bh: 9, words: [['浑身', 'hún shēn']] },
    { z: '淋', py: 'lín', bs: '氵', bh: 11, words: [['水淋淋', 'shuǐ lín lín'], ['淋雨', 'lín yǔ']] },
    { z: '灭', py: 'miè', bs: '火', bh: 5, words: [['扑灭', 'pū miè'], ['熄灭', 'xī miè']] },
    { z: '激', py: 'jī', bs: '氵', bh: 16, words: [['激动', 'jī dòng']] },
    { z: '瞧', py: 'qiáo', bs: '目', bh: 17, words: [['瞧见', 'qiáo jiàn'], ['瞧一瞧', 'qiáo yi qiáo']] },
  ],
  pick: {
    duo: [
      { q: '一会儿就睡“着”了', py: 'yí huìr _ jiù shuì zháo le', ans: 'zháo', opts: ['zhe', 'zháo'] },
      { q: '你不能跟“着”去', py: 'nǐ bù néng gēn zhe qù', ans: 'zhe', opts: ['zhe', 'zháo'] },
      { q: '小白兔家“着”火了', py: 'xiǎo bái tù jiā zháo huǒ le', ans: 'zháo', opts: ['zhe', 'zháo'] },
      { q: '小白兔“得”救了', py: 'xiǎo bái tù dé jiù le', ans: 'dé', opts: ['dé', 'děi', 'de'] },
      { q: '真“得”谢谢他呢', py: 'zhēn děi xiè xie tā ne', ans: 'děi', opts: ['dé', 'děi', 'de'] },
      { q: '小白兔睡“得”正香', py: 'xiǎo bái tù shuì de zhèng xiāng', ans: 'de', opts: ['dé', 'děi', 'de'] },
    ],
  },
  write: {
    a: [
      { z: '唱', py: 'chàng', bs: '口', bh: 11 },
      { z: '赶', py: 'gǎn', bs: '走', bh: 10 },
      { z: '旺', py: 'wàng', bs: '日', bh: 8 },
      { z: '旁', py: 'páng', bs: '方', bh: 10 },
    ],
    b: [
      { z: '浑', py: 'hún', bs: '氵', bh: 9 },
      { z: '候', py: 'hòu', bs: '亻', bh: 10 },
      { z: '谁', py: 'shuí', bs: '讠', bh: 10 },
      { z: '汽', py: 'qì', bs: '氵', bh: 7 },
    ],
  },
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.querySelector('.xh-cap')) updateCaption(slide, step);
  },
};
