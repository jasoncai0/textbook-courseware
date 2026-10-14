'use strict';
/* 方帽子店 · 本课数据与本课互动。通用逻辑见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 了解主要内容：选词填空（{正确词|干扰词|干扰词}） */
const FILL = '方帽子店只做{方帽子|圆帽子|草帽}，大家戴着{不舒服|很暖和|正合适}；孩子们用纸、用布做出了舒服的{圆帽子|方帽子|古董}；后来对面开了一家{新帽子店|方帽子店|裁缝店}，顾客都进了新店；世界一天天在改变，方帽子慢慢成了{古董|宝贝|新式样}。';

function initFill(box, text) {
  let n = 0;
  box.innerHTML = `<p class="fill-text">${text.replace(/\{(.+?)\}/g, (_, opts) => {
    const list = opts.split('|');
    const order = list.map((_, i) => (i + n) % list.length); // 每个空的正确项位置轮换
    n += 1;
    return `<span class="fill-gap"><b>　　　</b><span class="fill-opts">${order.map((i) => `<button class="fill-o" type="button" data-ok="${i === 0 ? 1 : 0}">${list[i]}</button>`).join('')}</span></span>`;
  })}</p><p class="fill-msg"></p>`;
  const total = n;
  box.addEventListener('click', (e) => {
    const o = e.target.closest('.fill-o');
    if (!o) return;
    const gap = o.closest('.fill-gap');
    if (o.dataset.ok !== '1') { o.classList.remove('no'); void o.offsetWidth; o.classList.add('no'); return; }
    gap.querySelector('b').textContent = o.textContent;
    gap.classList.add('done');
    const done = box.querySelectorAll('.fill-gap.done').length;
    box.querySelector('.fill-msg').textContent = done === total ? '补好了！连起来读一读，这就是故事的主要内容。' : `还差 ${total - done} 个空。`;
  });
}

/* 阅读提示：猜一猜，再看看（ok 是课文里真实发生的选项；tell 是复述这部分的提示） */
const GUESS = [
  { q: '大家都说“方帽子才是好帽子，不能改的”。可方帽子戴着舒服吗？', opts: ['很舒服，所以大家都戴', '真不舒服，大家却还是戴'], ok: 1,
    tell: '先说方帽子怎么不舒服（紧、宽、冬天不暖、夏天热），再说大人们为什么还要戴。' },
  { q: '店主人看见自己的儿子也戴了一顶圆帽子，你猜他会怎么做？', opts: ['抓起圆帽子，丢在地上', '夸儿子的帽子做得好'], ok: 0,
    tell: '按顺序讲：店主人看见 → 抓起圆帽子丢在地上 → 儿子嚷嚷“我要” → 儿子戴上帽子一溜烟跑了。加上语气。' },
  { q: '两张广告贴出来了，顾客们会进哪一家？', opts: ['“专卖从不改变的方的好帽子”', '“专卖各式各样的舒服的好帽子”'], ok: 1,
    tell: '讲清两张广告写了什么，顾客怎样犹豫，最后为什么进了新帽子店。' },
  { q: '日子一天天过去，那些方帽子最后怎么样了？', opts: ['慢慢地成为古董', '又流行起来'], ok: 0,
    tell: '从满街都是方帽子讲起，讲到行人都换了舒服的帽子，最后方帽子成了没人戴的古董。' },
];

function initGuess(box) {
  box.innerHTML = GUESS.map((g, i) => `<div class="gs" data-i="${i}"><p class="gs-q"><b>${i + 1}</b>${g.q}</p>
    <div class="gs-opts">${g.opts.map((o, j) => `<button class="gs-o" type="button" data-j="${j}">我猜：${o}</button>`).join('')}</div>
    <p class="gs-res"></p></div>`).join('');
  box.addEventListener('click', (e) => {
    const o = e.target.closest('.gs-o');
    if (!o) return;
    const row = o.closest('.gs');
    if (row.classList.contains('shown')) return;
    const g = GUESS[+row.dataset.i];
    const hit = +o.dataset.j === g.ok;
    row.classList.add('shown', hit ? 'hit' : 'miss');
    o.classList.add('mine');
    row.querySelectorAll('.gs-o')[g.ok].classList.add('real');
    row.querySelector('.gs-res').innerHTML = `${hit ? '猜中了！' : '<b>意想不到！</b>课文里是这样的。'}　<small>讲一讲：${g.tell}</small>`;
  });
}

window.LESSON = {
  init() {
    Narrative.init({});
    initFill(document.getElementById('fillBox'), FILL);
    initGuess(document.getElementById('guessBox'));
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    // 连环画：最新出现的一格标 cur（手机上只显示这一格）
    const panels = [...slide.querySelectorAll('.cm-panel')];
    const shown = panels.filter((p) => +p.dataset.step <= step);
    panels.forEach((p) => p.classList.toggle('cur', p === shown[shown.length - 1]));
  },
};
