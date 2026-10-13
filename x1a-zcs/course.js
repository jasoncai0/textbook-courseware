'use strict';
/* z c s · 本课数据。拼音模板见 ../shared/hanyu.js，低年级通用见 ../shared/hanzi.js（都在顶层调用，deck.js 加载前渲染完） */

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
const SPELL = spell('z-á z-é z-ǔ z-u-ó c-ā c-è c-ū c-u-ō s-ǎ s-è s-ù s-u-ǒ'); // 课本 p32 音节表

Hanyu.init({
  /* 情境图热点：x / y 是 assets/qingjing.jpg 上的百分比位置（已按生成的图核对） */
  scene: [
    { x: 28, y: 65, l: 'z', say: '写字 z z z' },
    { x: 10, y: 56, l: 'c', say: '刺猬 c c c' },
    { x: 67, y: 78, l: 's', say: '蚕丝 s s s' },
  ],
  letters: {
    sm: [
      { l: 'z', tip: '写字 z z z' },
      { l: 'c', tip: '刺猬 c c c' },
      { l: 's', tip: '蚕丝 s s s' },
    ],
    zt: [
      { l: 'zǐ', tip: '紫色' },
      { l: 'cì', tip: '刺猬' },
      { l: 'sī', tip: '蚕丝' },
    ],
  },
  spell: SPELL,
  write: 'z c s',
});
spellLabels(SPELL);
Hanzi.init({
  cards: [
    { z: '字', py: 'zì', bs: '宀', bh: 6, words: [['写字', 'xiě zì'], ['汉字', 'hàn zì']] },
    { z: '词', py: 'cí', bs: '讠', bh: 7, words: [['词语', 'cí yǔ']] },
    { z: '语', py: 'yǔ', bs: '讠', bh: 9, words: [['词语', 'cí yǔ'], ['语文', 'yǔ wén']] },
    { z: '句', py: 'jù', bs: '勹', bh: 5, words: [['句子', 'jù zi']] },
    { z: '子', py: 'zǐ', bs: '子', bh: 3, words: [['句子', 'jù zi'], ['棋子', 'qí zǐ']] },
  ],
});

trainSpell(); // 本课练习形式：开火车读音节

window.LESSON = {
  init() { Narrative.init({}); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
