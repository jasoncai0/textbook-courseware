'use strict';
/* b p m f · 本课数据。拼音模板见 ../shared/hanyu.js，低年级通用见 ../shared/hanzi.js（都在顶层调用，deck.js 加载前渲染完） */

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
const SPELL = spell('b-ā b-á b-ǎ b-à b-ō b-ǐ b-ù p-á p-ò p-í p-ǔ m-ǎ m-ō m-ǐ m-ù f-ā f-ó f-ǔ'); // 课本 p24–25：bā bá bǎ bà + 四朵花

Hanyu.init({
  /* 情境图热点：x / y 是 assets/qingjing.jpg 上的百分比位置（已按生成的图核对） */
  scene: [
    { x: 30, y: 53, l: 'b', say: '听广播 b b b' },
    { x: 16, y: 75, l: 'p', say: '爬山坡 p p p' },
    { x: 72, y: 40, l: 'm', say: '两个门洞 m m m' },
    { x: 27, y: 40, l: 'f', say: '一根拐棍 f f f' },
  ],
  letters: [
    { l: 'b', tip: '听广播 b b b' },
    { l: 'p', tip: '爬山坡 p p p' },
    { l: 'm', tip: '摸一摸 m m m' },
    { l: 'f', tip: '拐棍 f f f' },
  ],
  spell: SPELL,
  tonequiz: ['bā', 'pó', 'mǐ', 'fù', 'bǔ', 'pà'],
  write: 'b p m f',
});
spellLabels(SPELL);
Hanzi.init({
  cards: [
    { z: '爸', py: 'bà', bs: '父', bh: 8, words: [['爸爸', 'bà ba']] },
    { z: '妈', py: 'mā', bs: '女', bh: 6, words: [['妈妈', 'mā ma']] },
  ],
});

trainSpell(); // 本课练习形式：开火车读音节

window.LESSON = {
  init() { Narrative.init({}); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
