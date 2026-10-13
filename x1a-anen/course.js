'use strict';
/* an en in un ün · 本课数据。拼音模板见 ../shared/hanyu.js，低年级通用见 ../shared/hanzi.js（都在顶层调用，deck.js 加载前渲染完） */

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
/* 课本 p46 三拼（g k h + u + ān，j q x + ü + ān），p47 五朵花（an en in un ün） */
const SPELL = spell(`g-u-ān k-u-ān h-u-ān j-ü-ān q-ü-ān x-ü-ān
  w-ān y-ǎn n-án zh-àn d-u-ǎn r-ǎn j-i-ān q-ü-án
  ch-én k-ěn zh-ēn r-én w-èn n-èn
  p-īn n-ín j-ìn x-īn q-īn m-ín
  r-ùn t-ūn h-ūn zh-ǔn l-ún ch-ūn
  j-ǖn q-ǘn x-ǘn`);

Hanyu.init({
  /* 情境图热点：x / y 是 assets/qingjing.jpg 上的百分比位置（已按生成的图核对） */
  scene: [
    { x: 70, y: 32, l: 'an', say: '天安门 an an an' },
    { x: 43, y: 55, l: 'en', say: '摁一摁 en en en' },
    { x: 82, y: 46, l: 'in', say: '声音 in in in' },
    { x: 81, y: 73, l: 'un', say: '滚足球 un un un' },
    { x: 56, y: 13, l: 'ün', say: '白云 ün ün ün' },
  ],
  letters: [
    { l: 'an', tip: '天安门 an' },
    { l: 'en', tip: '摁一摁 en' },
    { l: 'in', tip: '声音 in' },
    { l: 'un', tip: '滚足球 un' },
    { l: 'ün', tip: '白云 ün' },
  ],
  spell: SPELL,
  write: 'lún chuán',
});
spellLabels(SPELL);
Hanzi.init({
  cards: [
    { z: '白', py: 'bái', bs: '白', bh: 5, words: [['白云', 'bái yún'], ['白帆', 'bái fān']] },
    { z: '草', py: 'cǎo', bs: '艹', bh: 9, words: [['草原', 'cǎo yuán'], ['青草', 'qīng cǎo']] },
    { z: '家', py: 'jiā', bs: '宀', bh: 10, words: [['大家', 'dà jiā'], ['回家', 'huí jiā']] },
    { z: '是', py: 'shì', bs: '日', bh: 9, words: [['就是', 'jiù shì'], ['不是', 'bú shì']] },
  ],
});

clapSong(); // 本课练习形式：拍手读儿歌

window.LESSON = {
  init() { Narrative.init({}); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
