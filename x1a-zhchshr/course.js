'use strict';
/* zh ch sh r · 本课数据。拼音模板见 ../shared/hanyu.js，低年级通用见 ../shared/hanzi.js（都在顶层调用，deck.js 加载前渲染完） */

/* 拼读数据：'b-ā' → ['b', 'ā', 'bā']；三拼 'g-u-ā' → ['g', 'u ā', 'guā']；j q x y 后面的 ü 去两点（卡片上留着 ü，拼出来的音节去点） */
const DROP = { ü: 'u', ǖ: 'ū', ǘ: 'ú', ǚ: 'ǔ', ǜ: 'ù' };
const spell = (s) => s.trim().split(/\s+/).map((w) => {
  const [a, ...rest] = w.split('-');
  const tail = rest.join('');
  return [a, rest.join(' '), a + (/^[jqxy]$/.test(a) ? tail.replace(/^[üǖǘǚǜ]/, (c) => DROP[c]) : tail)];
});
/* 拼读列表的按钮换成四线三格里的音节（和课本音节表一样；字体里的 ǐ 会带点） */
const spellLabels = (data) => document.querySelectorAll('[data-hy="spell"]').forEach((box) => {
  const list = box.dataset.key ? data[box.dataset.key] : data;
  box.querySelectorAll('.hy-spell-list .btn').forEach((b) => { b.innerHTML = Hanyu.strip(list[+b.dataset.i][2]); });
});
/* 练习形式轮换（各课只调用一种）：拍手读儿歌 / 找一找 / 开火车读音节 */
const addBtn = (box, label) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'btn py-act';
  b.textContent = label;
  box.append(b);
  return b;
};
const BEAT_MS = 650;
const TRAIN_MS = 2600;
/* 拍手读：一拍亮一个字，师生跟着拍手读；再点一下停 */
function clapSong(sel = '.song .hz-text') {
  const text = document.querySelector(sel);
  if (!text) return;
  const chars = [...text.querySelectorAll('p:not(.src) ruby')];
  const btn = addBtn(text, '拍手读');
  let timer = 0;
  const clear = () => chars.forEach((c) => c.classList.remove('beat'));
  const stop = () => { clearInterval(timer); timer = 0; clear(); btn.textContent = '拍手读'; };
  btn.addEventListener('click', () => {
    if (timer) { stop(); return; }
    let i = 0;
    btn.textContent = '停一停';
    timer = setInterval(() => {
      clear();
      if (i >= chars.length) { stop(); return; }
      chars[i++].classList.add('beat');
    }, BEAT_MS);
  });
}
/* 找一找：孩子先点字圈出来，再按按钮看答案（拼音去掉调号后和 re 比） */
function findSyl(re, sel = '.song .hz-text') {
  const text = document.querySelector(sel);
  if (!text) return;
  text.setAttribute('data-noswipe', '');
  const plain = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ü/g, 'ü');
  text.addEventListener('click', (e) => { const r = e.target.closest('p ruby'); if (r) r.classList.toggle('picked'); });
  const btn = addBtn(text, '找一找·看答案');
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    text.querySelectorAll('p ruby rt').forEach((rt) => { if (re.test(plain(rt.textContent))) rt.parentElement.classList.toggle('found'); });
  });
}
/* 开火车：自动一个接一个拼，每节“车厢”请一个孩子读 */
function trainSpell(sel = '[data-hy="spell"]') {
  const box = document.querySelector(sel);
  if (!box) return;
  const items = [...box.querySelectorAll('.hy-spell-list .btn')];
  const btn = addBtn(box.querySelector('.hy-spell-go'), '开火车');
  let timer = 0;
  const stop = () => { clearInterval(timer); timer = 0; btn.textContent = '开火车'; };
  btn.addEventListener('click', () => {
    if (timer) { stop(); return; }
    let i = 0;
    const next = () => {
      if (i >= items.length) { stop(); return; }
      items[i++].click();
      box.querySelector('[data-go]').click();
    };
    btn.textContent = '停车';
    next();
    timer = setInterval(next, TRAIN_MS);
  });
}
/* 课本 p34 音节表：左两拼，右三拼 */
const SPELL = spell('zh-ā zh-è zh-ù ch-á ch-ē ch-ū sh-ǎ sh-é sh-ù r-è r-ǔ zh-u-ǎ zh-u-ō ch-u-ā ch-u-ō sh-u-ā sh-u-ō r-u-ò');

Hanyu.init({
  /* 情境图热点：x / y 是 assets/qingjing.jpg 上的百分比位置（已按生成的图核对） */
  scene: [
    { x: 65, y: 69, l: 'zh', say: '织毛衣 zh zh zh' },
    { x: 16, y: 69, l: 'ch', say: '吃苹果 ch ch ch' },
    { x: 38, y: 57, l: 'sh', say: '小狮子 sh sh sh' },
    { x: 14, y: 24, l: 'r', say: '红日 r r r' },
  ],
  letters: {
    sm: [
      { l: 'zh', tip: '织毛衣 zh zh zh' },
      { l: 'ch', tip: '吃苹果 ch ch ch' },
      { l: 'sh', tip: '小狮子 sh sh sh' },
      { l: 'r', tip: '红日 r r r' },
    ],
    zt: [
      { l: 'zhí', tip: '笔直' },
      { l: 'chī', tip: '吃饭' },
      { l: 'shī', tip: '狮子' },
      { l: 'rì', tip: '日出' },
    ],
  },
  spell: SPELL,
  write: 'zh ch sh r',
});
spellLabels(SPELL);
Hanzi.init({
  cards: [
    { z: '桌', py: 'zhuō', bs: '木', bh: 10, words: [['桌子', 'zhuō zi'], ['擦桌子', 'cā zhuō zi']] },
    { z: '纸', py: 'zhǐ', bs: '纟', bh: 7, words: [['折纸', 'zhé zhǐ'], ['白纸', 'bái zhǐ']] },
  ],
});

clapSong(); // 本课练习形式：拍手读儿歌

window.LESSON = {
  init() { Narrative.init({}); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
