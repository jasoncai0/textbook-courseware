'use strict';
/* 古诗二首 · 本课数据与互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：登楼看远（一层层往上爬，雾一层层退去）、瀑布竖排诗句“流”下来、一句一笔画出庐山瀑布、词语“长大”、爬楼梯识字 */

const HAN = /\p{Script=Han}/u;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* 竖排诗：每个字一格，拼音横写在字上方（要在 Hanzi.init 之前转换，避免被当成横排注音） */
function buildColumns() {
  document.querySelectorAll('.gs-col [data-py]').forEach((el) => {
    const syl = el.dataset.py.split(/\s+/);
    let k = 0;
    el.innerHTML = [...el.textContent].map((ch) => (HAN.test(ch)
      ? `<span class="gs-c"><i>${esc(syl[k++] || '')}</i>${esc(ch)}</span>`
      : `<span class="gs-p">${esc(ch)}</span>`)).join('');
    if (k !== syl.length) console.warn(`注音数量不符：${el.textContent}`); // eslint-disable-line no-console
    el.removeAttribute('data-py');
    el.classList.remove('py');
  });
}
buildColumns();

Hanzi.init({
  cards: [
    { z: '依', py: 'yī', bs: '亻', bh: 8, words: [['依山', 'yī shān'], ['依靠', 'yī kào']] },
    { z: '尽', py: 'jìn', bs: '尸', bh: 6, words: [['依山尽', 'yī shān jìn'], ['尽头', 'jìn tóu']] },
    { z: '欲', py: 'yù', bs: '欠', bh: 11, words: [['欲穷', 'yù qióng']] },
    { z: '穷', py: 'qióng', bs: '穴', bh: 7, words: [['欲穷', 'yù qióng'], ['无穷', 'wú qióng']] },
    { z: '层', py: 'céng', bs: '尸', bh: 7, words: [['一层楼', 'yì céng lóu'], ['楼层', 'lóu céng']] },
    { z: '瀑', py: 'pù', bs: '氵', bh: 18, words: [['瀑布', 'pù bù']] },
    { z: '布', py: 'bù', bs: '巾', bh: 5, words: [['瀑布', 'pù bù'], ['花布', 'huā bù']] },
    { z: '炉', py: 'lú', bs: '火', bh: 8, words: [['香炉', 'xiāng lú'], ['火炉', 'huǒ lú']] },
    { z: '烟', py: 'yān', bs: '火', bh: 10, words: [['紫烟', 'zǐ yān'], ['炊烟', 'chuī yān']] },
    { z: '遥', py: 'yáo', bs: '辶', bh: 13, words: [['遥看', 'yáo kàn'], ['遥远', 'yáo yuǎn']] },
    { z: '川', py: 'chuān', bs: '川', bh: 3, words: [['前川', 'qián chuān'], ['山川', 'shān chuān']] },
  ],
  write: [
    { z: '依', py: 'yī', bs: '亻', bh: 8 },
    { z: '尽', py: 'jìn', bs: '尸', bh: 6 },
    { z: '黄', py: 'huáng', bs: '黄', bh: 11 },
    { z: '层', py: 'céng', bs: '尸', bh: 7 },
    { z: '照', py: 'zhào', bs: '灬', bh: 13 },
    { z: '炉', py: 'lú', bs: '火', bh: 8 },
    { z: '烟', py: 'yān', bs: '火', bh: 10 },
    { z: '挂', py: 'guà', bs: '扌', bh: 9 },
    { z: '川', py: 'chuān', bs: '川', bh: 3 },
  ],
});

/* ---------- 登楼看远 ---------- */
const FLOORS = [
  { me: 400, fog: -30, say: null, tip: '站在楼下，被房子、树挡着，只看得见近处。' },
  { me: 318, fog: -160, say: ['白日依山尽，', 'bái rì yī shān jìn'], tip: '登上二楼：看见太阳挨着远山，慢慢落下去。' },
  { me: 240, fog: -250, say: ['黄河入海流。', 'huáng hé rù hǎi liú'], tip: '登上三楼：看见黄河弯弯曲曲，一直流向大海。' },
  { me: 162, fog: -460, say: ['欲穷千里目，更上一层楼。', 'yù qióng qiān lǐ mù gèng shàng yì céng lóu'], tip: '登上顶楼：想看到千里以外，就要再上一层楼！' },
];
function initClimb() {
  const $ = (id) => document.getElementById(id);
  const view = $('gsView');
  let f = 0;
  const draw = () => {
    const fl = FLOORS[f];
    $('gsMe').style.transform = `translateY(${fl.me}px)`;
    $('gsFogRect').style.transform = `translateY(${fl.fog}px)`;
    view.dataset.floor = f + 1;
    $('gsFloor').textContent = f + 1;
    $('gsSay').innerHTML = FLOORS.slice(1, f + 1).map((x) => `<p>${Hanzi.ruby(...x.say)}</p>`).join('');
    $('gsTip').textContent = fl.tip;
    $('gsUp').disabled = f === FLOORS.length - 1;
    $('gsDown').disabled = f === 0;
  };
  $('gsUp').addEventListener('click', () => { f = Math.min(FLOORS.length - 1, f + 1); draw(); });
  $('gsDown').addEventListener('click', () => { f = Math.max(0, f - 1); draw(); });
  draw();
}

/* ---------- 节奏 ---------- */
function initRhythm() {
  document.querySelectorAll('.gs-rhythm').forEach((b) => b.addEventListener('click', () => {
    b.classList.toggle('on', document.getElementById(b.dataset.board).classList.toggle('rhythm'));
  }));
}

/* ---------- 词语“长大” ---------- */
function initGrow() {
  document.getElementById('gsGrow').addEventListener('click', (e) => {
    const b = e.target.closest('.gs-gw');
    if (b) b.classList.toggle('open');
  });
}

/* ---------- 爬楼梯 ---------- */
const STAIRS = [['依', 'yī'], ['尽', 'jìn'], ['欲', 'yù'], ['穷', 'qióng'], ['层', 'céng'], ['瀑', 'pù'], ['布', 'bù'], ['炉', 'lú'], ['烟', 'yān'], ['遥', 'yáo'], ['川', 'chuān']];
function initStairs() {
  const box = document.getElementById('gsSteps');
  const n = document.getElementById('gsSN');
  const done = document.getElementById('gsSDone');
  box.innerHTML = STAIRS.map(([z, p], i) => `<button type="button" class="gs-st" data-i="${i}" style="--i:${i}"><span class="py">${Hanzi.ruby(z, p)}</span></button>`).join('')
    + '<i class="gs-kid" id="gsKid"></i>';
  let at = 0;
  const update = () => {
    n.textContent = at;
    box.style.setProperty('--at', at);
    done.classList.toggle('show', at === STAIRS.length);
  };
  box.addEventListener('click', (e) => {
    const b = e.target.closest('.gs-st');
    if (!b) return;
    if (+b.dataset.i !== at) { b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong'); return; }
    b.classList.add('ok');
    at += 1;
    update();
  });
  document.getElementById('gsSReset').addEventListener('click', () => {
    at = 0;
    box.querySelectorAll('.gs-st').forEach((b) => b.classList.remove('ok'));
    update();
  });
  update();
}

window.LESSON = {
  init() {
    Narrative.init({});
    initClimb();
    initRhythm();
    initGrow();
    initStairs();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
