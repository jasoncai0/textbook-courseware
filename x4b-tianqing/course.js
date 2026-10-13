'use strict';
/* 在天晴了的时候 · 本课数据与互动。记叙文模板见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js
 * 本课专属：诗画长卷（横向展开，一步走一段）、景物连一连、仿写填词机。
 */

/* ================= 诗画长卷：第 n 步滚到第 n 段 ================= */
function initJuan() {
  const juan = document.getElementById('juan');
  const dots = document.getElementById('juDots');
  const n = juan.children.length;
  dots.innerHTML = Array.from({ length: n }, (_, i) => `<button type="button" data-i="${i}" aria-label="第 ${i + 1} 段"></button>`).join('');
  dots.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (b) scrollJuan(+b.dataset.i);
  });
  juan.addEventListener('scroll', () => {
    const i = Math.round(juan.scrollLeft / juan.clientWidth);
    dots.querySelectorAll('button').forEach((b, k) => b.classList.toggle('on', k === i));
  }, { passive: true });
}

function scrollJuan(i) {
  const juan = document.getElementById('juan');
  juan.scrollTo({ left: i * juan.clientWidth, behavior: 'smooth' });
  document.querySelectorAll('#juDots button').forEach((b, k) => b.classList.toggle('on', k === i));
  const v = juan.querySelector('video');
  if (i === juan.children.length - 1) v.play().catch(() => { /* 素材未生成或浏览器拒绝自动播放 */ });
  else v.pause();
}

/* ================= 连一连：先点左边，再点右边（右边按 rightOrder 打乱） ================= */
function initMatch(box, pairs, rightOrder) {
  box.innerHTML = `<div class="m-col">${pairs.map((p, i) => `<button class="m-a" type="button" data-i="${i}">${p.a}</button>`).join('')}</div>
    <div class="m-col">${rightOrder.map((i) => `<button class="m-b" type="button" data-i="${i}">${pairs[i].b}</button>`).join('')}</div>`;
  let picked = null;
  let found = 0;
  box.addEventListener('click', (e) => {
    const a = e.target.closest('.m-a');
    const b = e.target.closest('.m-b');
    if (a && !a.classList.contains('right')) {
      box.querySelectorAll('.m-a').forEach((x) => x.classList.toggle('sel', x === a));
      picked = a;
      return;
    }
    if (!b || b.classList.contains('right') || !picked) return;
    b.classList.remove('wrong');
    void b.offsetWidth; // 重新触发抖动动画
    if (b.dataset.i !== picked.dataset.i) { b.classList.add('wrong'); return; }
    found += 1;
    [picked, b].forEach((x) => { x.classList.remove('sel'); x.classList.add('right'); x.dataset.n = found; });
    picked = null;
    box.classList.toggle('all-found', found === pairs.length);
  });
}

const NIREN = [
  { a: '小草', b: '炫耀着新绿' },
  { a: '小白菊', b: '不再胆怯，慢慢地抬起头' },
  { a: '凤蝶儿', b: '把智慧书页一开一收' },
  { a: '新阳', b: '推开了阴霾' },
  { a: '云的脚迹', b: '它也在闲游' },
];

/* ================= 仿写填词机 ================= */
const TC_TEMPLATE = ['在{0}的时候，', '该到{1}去走走：', '{2}，', '一定是{3}；'];
const TC_SLOTS = [
  { name: '什么时候', opts: ['天晴了', '下雪了', '春风来了', '放学了'] },
  { name: '去哪儿', opts: ['小径中', '田野里', '小河边', '操场上'] },
  { name: '看见什么', opts: ['给雨洗过的树叶', '刚刚开放的桃花', '铺满白雪的小路', '闪着光的溪水'] },
  { name: '它怎么样', opts: ['亮晶晶又干干净净', '香喷喷又红艳艳', '软绵绵又静悄悄', '清凉又欢快'] },
];

function initTianci() {
  const pick = TC_SLOTS.map(() => 0);
  const slots = document.getElementById('tcSlots');
  const render = () => {
    slots.querySelectorAll('.tc-slot').forEach((row, k) => row.querySelectorAll('.pick').forEach((b, j) => b.classList.toggle('right', j === pick[k])));
    document.getElementById('tcPoem').innerHTML = TC_TEMPLATE
      .map((line) => `<p>${line.replace(/\{(\d)\}/g, (_, k) => `<b>${TC_SLOTS[+k].opts[pick[+k]]}</b>`)}</p>`).join('');
  };
  slots.innerHTML = TC_SLOTS.map((s, k) => `<div class="tc-slot" data-k="${k}"><span>${s.name}</span>${s.opts.map((o, j) => `<button class="pick" type="button" data-j="${j}">${o}</button>`).join('')}</div>`).join('');
  slots.addEventListener('click', (e) => {
    const b = e.target.closest('.pick');
    if (!b) return;
    pick[+b.closest('.tc-slot').dataset.k] = +b.dataset.j;
    render();
  });
  document.getElementById('tcRand').addEventListener('click', () => {
    TC_SLOTS.forEach((s, k) => { pick[k] = Math.floor(Math.random() * s.opts.length); });
    render();
  });
  render();
}

window.LESSON = {
  init() {
    Narrative.init({});
    initJuan();
    initMatch(document.getElementById('nirenMatch'), NIREN, [3, 0, 4, 2, 1]);
    initTianci();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.classList.contains('s-juan')) scrollJuan(step);
    else document.querySelector('#juan video').pause();
  },
};
