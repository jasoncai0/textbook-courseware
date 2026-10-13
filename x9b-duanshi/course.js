'use strict';
/* 短诗五首 · 本课互动：断章视角切换、统一（聚合成一朵花）、意象氛围表。月夜叠化、萧红墓畔、风雨吟靠分步出现 */

/* ---------- 断章：三种视角 ---------- */
const DZ_VIEWS = [
  { on: ['a1'], who: 'pYou', lines: [0], t: '<b>你是看者：</b>你站在桥上，眼里是风景——你是主体，风景是客体。' },
  { on: ['a1', 'a2'], who: 'pThem', lines: [0, 1], t: '<b>你是被看者：</b>楼上的人在看你——你和桥、河一起，成了别人眼中的风景。看者同时也是被看者。' },
  { on: ['a3', 'a4'], who: 'pYou', lines: [2, 3], t: '<b>明月与你：</b>明月装饰了你的窗子，你又装饰了别人的梦——你被装饰，也在装饰别人。' },
];

function initDz() {
  const svg = document.getElementById('dzSvg');
  const lines = document.querySelectorAll('.dz-poem p');
  const btns = document.querySelectorAll('#dzBtns .btn');
  const show = (i) => {
    const v = DZ_VIEWS[i];
    svg.querySelectorAll('.dz-arrow').forEach((a) => a.classList.toggle('on', v.on.includes(a.id)));
    svg.querySelectorAll('.dz-person').forEach((p) => p.classList.toggle('focus', p.id === v.who));
    lines.forEach((p, k) => p.classList.toggle('hl', v.lines.includes(k)));
    btns.forEach((b, k) => b.classList.toggle('solid', k === i));
    document.getElementById('dzInfo').innerHTML = v.t;
  };
  document.getElementById('dzBtns').addEventListener('click', (e) => {
    const b = e.target.closest('[data-v]');
    if (b) show(+b.dataset.v);
  });
}

/* ---------- 统一：叶、花、果、树散开 ↔ 聚成一朵花 ---------- */
const TY_ITEMS = ['叶', '花', '果', '树'];
const TY_N = 28;

function initTy() {
  const field = document.getElementById('tyField');
  field.innerHTML = Array.from({ length: TY_N }, (_, i) => {
    const x = 6 + ((i * 37) % 88);
    const y = 8 + ((i * 53) % 80);
    return `<span class="ty-i k${i % 4}" style="--x:${x}%;--y:${y}%">${TY_ITEMS[i % 4]}</span>`;
  }).join('') + '<span class="ty-one">一朵花</span>';
  document.getElementById('tyBtn').addEventListener('click', (e) => {
    const on = field.classList.toggle('one');
    e.target.textContent = on ? '散开' : '统一';
  });
}

/* ---------- 意象—氛围表 ---------- */
const MOOD = [
  { p: '月夜', img: '霜风、月光、顶高的树', air: '清冷、寂寞', feel: '独立自主，渴望自由' },
  { p: '萧红墓畔口占', img: '长途、红山茶、长夜、海涛', air: '寂寞、哀婉、宁静', feel: '对亡友深切的怀念' },
  { p: '断章', img: '桥、风景、楼、明月、窗子、梦', air: '恬淡、空灵', feel: '万物相对、相互关联的哲思' },
  { p: '风雨吟', img: '风、雨、海、舟、舵手', air: '激荡、雄壮', feel: '迎击风雨、把握方向的豪情' },
  { p: '统一', img: '叶、花、果实、树木、大地', air: '开阔、和谐', feel: '多中见一、万物统一的哲思' },
];

function initMood() {
  const box = document.getElementById('moodTable');
  const cell = (t) => `<button type="button" class="mt-q"><i>？</i><span>${t}</span></button>`;
  box.innerHTML = `<div class="mt-row mt-head"><b>诗</b><b>意象</b><b>氛围</b><b>情思</b></div>${MOOD.map((m) => `<div class="mt-row"><b>${m.p}</b><span>${m.img}</span>${cell(m.air)}${cell(m.feel)}</div>`).join('')}`;
  box.addEventListener('click', (e) => {
    const q = e.target.closest('.mt-q');
    if (q) q.classList.add('open');
  });
}

window.LESSON = {
  init() {
    Narrative.init({});
    initDz();
    initTy();
    initMood();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
