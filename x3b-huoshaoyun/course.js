'use strict';
/* 火烧云 · 本课数据与本课互动。通用逻辑见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 天空的调色盘：课文里的颜色词（最后一个是“说也说不出来”的颜色） */
const SWATCHES = [
  { w: '红彤彤', bg: 'linear-gradient(#c81e1e, #f2552c)' },
  { w: '金灿灿', bg: 'linear-gradient(#e89a0c, #ffd84a)' },
  { w: '半紫半黄', bg: 'linear-gradient(100deg, #7d3fb0 50%, #f2c230 50%)' },
  { w: '半灰半百合色', bg: 'linear-gradient(100deg, #8f8f96 50%, #f4eedd 50%)' },
  { w: '葡萄灰', bg: 'linear-gradient(#6a5a73, #8d7f92)' },
  { w: '梨黄', bg: 'linear-gradient(#d9c45a, #efe29a)' },
  { w: '茄子紫', bg: 'linear-gradient(#4f1f5e, #7b3a86)' },
  { w: '说也说不出来的颜色', bg: 'linear-gradient(120deg, #f2552c, #f2c230, #7d3fb0, #3fa0d0, #e85a9a)', magic: true },
];

/* 课后第 2 题：颜色词工坊。parts 是原料：[按钮字, 造出的词, 颜色1, 颜色2?] */
const KILNS = [
  { name: '颜色＋两个一样的字', eg: '红<b>彤彤</b>　金<b>灿灿</b>', parts: [
    ['绿', '绿油油', '#4f9a3a'], ['白', '白茫茫', '#eef0f2'], ['黄', '黄澄澄', '#e9b52c'],
    ['黑', '黑乎乎', '#3a3a3a'], ['蓝', '蓝莹莹', '#3f8fd6'], ['灰', '灰蒙蒙', '#9a9a9a']] },
  { name: '半……半……', eg: '<b>半</b>紫<b>半</b>黄　<b>半</b>灰<b>半</b>百合色', parts: [
    ['红＋绿', '半红半绿', '#d9443a', '#4f9a3a'], ['青＋白', '半青半白', '#3f8f8a', '#eef0f2'],
    ['蓝＋紫', '半蓝半紫', '#3f6fd6', '#8a4fc0'], ['黑＋白', '半黑半白', '#3a3a3a', '#eef0f2']] },
  { name: '东西的名字＋颜色', eg: '<b>葡萄</b>灰　<b>梨</b>黄　<b>茄子</b>紫', parts: [
    ['天', '天蓝', '#7cc0ef'], ['橘子', '橘黄', '#f2a33a'], ['草', '草绿', '#6cb04a'],
    ['苹果', '苹果绿', '#9cc84a'], ['玫瑰', '玫瑰红', '#d23a5a'], ['雪', '雪白', '#fbfbfb']] },
];

function initKilns(box) {
  box.innerHTML = KILNS.map((k, i) => `<div class="kl" data-i="${i}">
    <p class="kl-name">${k.name}<small>${k.eg}</small></p>
    <div class="kl-out"><i></i><b>？</b></div>
    <div class="kl-parts">${k.parts.map((p, j) => `<button class="kl-p" type="button" data-j="${j}">${p[0]}</button>`).join('')}</div></div>`).join('');
  box.addEventListener('click', (e) => {
    const btn = e.target.closest('.kl-p');
    if (!btn) return;
    const kl = btn.closest('.kl');
    const [, word, c1, c2] = KILNS[+kl.dataset.i].parts[+btn.dataset.j];
    kl.querySelectorAll('.kl-p').forEach((b) => b.classList.toggle('solid', b === btn));
    btn.classList.add('used');
    const out = kl.querySelector('.kl-out');
    out.querySelector('i').style.background = c2 ? `linear-gradient(90deg, ${c1} 50%, ${c2} 50%)` : c1;
    out.querySelector('b').textContent = word;
    out.classList.remove('made'); void out.offsetWidth; out.classList.add('made');
  });
}
/* 课后第 3 题：颜色还是形状 */
const KINDS = ['颜色', '形状'];
const SORT_ITEMS = [
  { s: '一会儿红彤彤的，一会儿金灿灿的，一会儿半紫半黄。', ok: ['颜色'], q: '颜色变化极多' },
  { s: '过了两三秒钟，那匹马大起来了，腿伸开了，脖子也长了。', ok: ['形状'], q: '形状变化极快' },
  { s: '还有些说也说不出来、见也没见过的颜色。', ok: ['颜色'], q: '颜色多得说不完' },
  { s: '跑着跑着，小狗不知哪里去了，大狗也不见了。', ok: ['形状'], q: '形状变化极快' },
  { s: '可是一转眼就变了，再也找不着了。', ok: ['形状'], q: '形状变化极快' },
];

/* 写一写：天空又出现了什么 */
const MOMENTS = [
  {
    name: '一只大公鸡', pic: 'yunma',
    prompt: '一会儿，天空里又出现了一只大公鸡……接着写下去。',
    hint: '按课文的顺序写：怎样出现 → 什么样子 → 怎样变化 → 怎样不见了。用上“一会儿”“忽然”“一转眼”。',
    example: '一会儿，天空出现一只大公鸡，昂着头，翘着尾巴，好像要打鸣似的。过了两三秒钟，公鸡的尾巴散开了，像一把大扇子，鸡冠却不见了。一转眼，它变成了一团金灿灿的云。',
  },
  {
    name: '一条大鱼', pic: 'yungou',
    prompt: '忽然，天空游来一条大鱼……接着写下去。',
    hint: '想一想：大鱼是什么颜色的？它在做什么？后来变成了什么？',
    example: '忽然，天空游来一条红彤彤的大鱼，摇着尾巴，张着大嘴，好像要把太阳吞下去。游着游着，鱼尾巴越来越长，变成了一条带子，大鱼也不见了。',
  },
  {
    name: '我想象的', pic: 'yunshi',
    prompt: '接着，天空里又来了……你看到了什么？',
    hint: '可以是一只小兔、一座城堡、一位老爷爷……先写样子，再写变化。',
    example: '接着，天空里出现了一座金色的城堡，有高高的尖顶，还有一扇大门。一转眼，尖顶倒了，城堡变成了一片模模糊糊的云。',
  },
];

function initPalette() {
  const sky = document.getElementById('skyBox');
  const word = document.getElementById('skyWord');
  const btns = document.getElementById('swatchBtns');
  btns.innerHTML = SWATCHES.map((s, i) => `<button class="sw" type="button" data-i="${i}" style="--sw:${s.bg}">${s.w}</button>`).join('');
  btns.addEventListener('click', (e) => {
    const b = e.target.closest('.sw');
    if (!b) return;
    const s = SWATCHES[+b.dataset.i];
    sky.style.background = s.bg;
    sky.classList.toggle('magic', Boolean(s.magic));
    word.textContent = s.magic ? '你会给它起什么名字？' : s.w;
    btns.querySelectorAll('.sw').forEach((x) => x.classList.toggle('cur', x === b));
  });
}

function initRecite() {
  const slide = document.querySelector('.s-recite');
  const btn = document.getElementById('gapToggle');
  btn.addEventListener('click', () => {
    const on = slide.classList.toggle('gaps-on');
    slide.querySelectorAll('.gap').forEach((g) => g.classList.remove('peek'));
    btn.textContent = on ? '显示全文' : '挖空';
  });
  slide.querySelector('.recite').addEventListener('click', (e) => {
    const g = e.target.closest('.gap');
    if (g) g.classList.toggle('peek');
  });
}

window.LESSON = {
  init() {
    Narrative.init({ kinds: KINDS, sort: SORT_ITEMS, moments: MOMENTS });
    initKilns(document.getElementById('kilnBox'));
    initPalette();
    initRecite();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
