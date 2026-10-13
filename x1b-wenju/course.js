'use strict';
/* 文具的家 · 本课数据与本课互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完） */

/* ================= 文具小图标：<i data-icon="pencil"></i> 换成 SVG ================= */
const ICONS = {
  pencil: '<svg viewBox="0 0 120 40"><path d="M14 12H92V28H14Z" fill="#f6c63c" stroke="#b8871a" stroke-width="2"/><path d="M14 12H6Q2 12 2 20Q2 28 6 28H14Z" fill="#f29aa6" stroke="#c46b78" stroke-width="2"/><path d="M14 12V28" stroke="#9aa3ad" stroke-width="5"/><path d="M92 12L114 20L92 28Z" fill="#f3d9b4" stroke="#b8871a" stroke-width="2"/><path d="M107 17.5L114 20L107 22.5Z" fill="#333"/><path d="M20 20H86" stroke="#e3ad24" stroke-width="2"/></svg>',
  eraser: '<svg viewBox="0 0 80 46"><rect x="4" y="6" width="72" height="34" rx="7" fill="#fff" stroke="#8aa0b5" stroke-width="2"/><path d="M4 13Q4 6 11 6H44V40H11Q4 40 4 33Z" fill="#5aa5e6"/><path d="M14 23H36" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>',
  sharpener: '<svg viewBox="0 0 70 50"><rect x="6" y="6" width="58" height="38" rx="6" fill="#7cc77a" stroke="#4d8f4c" stroke-width="2"/><circle cx="24" cy="25" r="9" fill="#2f5f2e"/><circle cx="24" cy="25" r="4" fill="#9fd69d"/><path d="M40 14H58V36H40Z" fill="#c7d1d9" stroke="#8a96a1" stroke-width="2"/></svg>',
  ruler: '<svg viewBox="0 0 130 34"><rect x="2" y="6" width="126" height="22" rx="3" fill="#ffe7a8" stroke="#c9a24a" stroke-width="2"/><path d="M12 6V16M22 6V12M32 6V16M42 6V12M52 6V16M62 6V12M72 6V16M82 6V12M92 6V16M102 6V12M112 6V16" stroke="#a07a2a" stroke-width="2"/></svg>',
  book: '<svg viewBox="0 0 80 64"><rect x="8" y="4" width="60" height="56" rx="4" fill="#e9604f" stroke="#a63a2c" stroke-width="2"/><rect x="18" y="14" width="40" height="16" rx="3" fill="#fff4d8"/><path d="M14 4V60" stroke="#a63a2c" stroke-width="3"/><path d="M68 8V56" stroke="#fff" stroke-width="4"/></svg>',
  notebook: '<svg viewBox="0 0 80 64"><rect x="10" y="4" width="58" height="56" rx="3" fill="#8fc7ef" stroke="#4f86b0" stroke-width="2"/><rect x="20" y="16" width="38" height="12" rx="2" fill="#fff"/><path d="M20 38H58M20 46H50" stroke="#fff" stroke-width="2"/></svg>',
  car: '<svg viewBox="0 0 90 56"><path d="M8 38V30Q8 24 16 22L28 10H58L72 22Q84 24 84 32V38Z" fill="#f08a3c" stroke="#b25b1d" stroke-width="2"/><path d="M32 14H44V24H24Z M48 14H58L66 24H48Z" fill="#cfeaff"/><circle cx="26" cy="40" r="9" fill="#444"/><circle cx="66" cy="40" r="9" fill="#444"/><circle cx="26" cy="40" r="3.5" fill="#ddd"/><circle cx="66" cy="40" r="3.5" fill="#ddd"/></svg>',
  ball: '<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="25" fill="#f25b6b" stroke="#b33746" stroke-width="2"/><path d="M5 30H55M30 5Q16 30 30 55M30 5Q44 30 30 55" stroke="#fff" stroke-width="3" fill="none"/></svg>',
};
const fillIcons = (root) => root.querySelectorAll('i[data-icon]').forEach((el) => { el.innerHTML = ICONS[el.dataset.icon] || ''; });
fillIcons(document);

/* ================= 帮文具回家：拖（或先点东西再点家）到对应的家；全部放好后“放学检查” ================= */
const HOMES = [
  { id: 'box', name: '文具盒', py: 'wén jù hé', icon: '✏️' },
  { id: 'bag', name: '书包', py: 'shū bāo', icon: '🎒' },
  { id: 'toy', name: '玩具筐', py: 'wán jù kuāng', icon: '🧺' },
];
const THINGS = [ // x / y：在书桌上的位置（%）
  { icon: 'pencil', name: '铅笔', py: 'qiān bǐ', home: 'box', x: 3, y: 6 },
  { icon: 'book', name: '语文书', py: 'yǔ wén shū', home: 'bag', x: 28, y: 6 },
  { icon: 'eraser', name: '橡皮', py: 'xiàng pí', home: 'box', x: 53, y: 6 },
  { icon: 'car', name: '小汽车', py: 'xiǎo qì chē', home: 'toy', x: 3, y: 52 },
  { icon: 'sharpener', name: '转笔刀', py: 'zhuàn bǐ dāo', home: 'box', x: 28, y: 52 },
  { icon: 'notebook', name: '作业本', py: 'zuò yè běn', home: 'bag', x: 53, y: 52 },
  { icon: 'ruler', name: '尺子', py: 'chǐ zi', home: 'box', x: 78, y: 52 },
  { icon: 'ball', name: '皮球', py: 'pí qiú', home: 'toy', x: 78, y: 6 },
];
const CHECK = [['铅笔呀', 'qiān bǐ ya'], ['橡皮呀', 'xiàng pí ya'], ['转笔刀哇', 'zhuàn bǐ dāo wa'], ['尺子呀', 'chǐ zi ya']];
const MSG = {
  start: '把桌上的东西送回它的家：拖过去，或者先点东西，再点家。',
  ok: '对了！它回家啦。',
  wrong: '这不是它的家，再想想。',
  done: '桌子收拾好了！点“放学检查”，像贝贝一样数一数。',
  checked: '所有的小伙伴都回家了！',
};

function initHomeGame(box) {
  box.innerHTML = `<div class="wjj-desk">${THINGS.map((t, i) => `<button type="button" class="wjj-thing" data-i="${i}" style="left:${t.x}%;top:${t.y}%"><i data-icon="${t.icon}"></i><span>${Hanzi.ruby(t.name, t.py)}</span></button>`).join('')}</div>
    <div class="wjj-zones">${HOMES.map((h) => `<div class="wjj-zone" data-zone="${h.id}"><p><em>${h.icon}</em>${Hanzi.ruby(h.name, h.py)}</p><div class="wjj-in"></div></div>`).join('')}</div>
    <div class="wjj-bar"><span class="wjj-msg">${MSG.start}</span><button type="button" class="btn solid" data-check disabled>放学检查</button><button type="button" class="btn" data-reset>再来一次</button></div>
    <div class="wjj-roll py"></div>`;
  fillIcons(box);
  const msg = box.querySelector('.wjj-msg');
  const checkBtn = box.querySelector('[data-check]');
  let sel = null;
  let drag = null;
  let timers = [];
  const shake = (el) => { el.classList.remove('wrong'); void el.offsetWidth; el.classList.add('wrong'); };
  const place = (thing, zone) => {
    if (!zone) return;
    const t = THINGS[+thing.dataset.i];
    if (zone.dataset.zone !== t.home) { shake(thing); shake(zone); msg.textContent = MSG.wrong; return; }
    thing.classList.add('home');
    zone.querySelector('.wjj-in').insertAdjacentHTML('beforeend', `<i data-icon="${t.icon}" title="${t.name}"></i>`);
    fillIcons(zone);
    const left = box.querySelectorAll('.wjj-thing:not(.home)').length;
    msg.textContent = left ? MSG.ok : MSG.done;
    checkBtn.disabled = Boolean(left);
  };
  const reset = () => {
    timers.forEach(clearTimeout);
    timers = [];
    box.querySelectorAll('.wjj-thing').forEach((el) => el.classList.remove('home', 'sel'));
    box.querySelectorAll('.wjj-in').forEach((el) => { el.innerHTML = ''; });
    box.querySelector('.wjj-roll').innerHTML = '';
    box.classList.remove('checked');
    checkBtn.disabled = true;
    sel = null;
    msg.textContent = MSG.start;
  };
  const check = () => {
    const roll = box.querySelector('.wjj-roll');
    roll.innerHTML = '';
    CHECK.forEach(([w, py], k) => {
      timers.push(setTimeout(() => roll.insertAdjacentHTML('beforeend', `<span>${Hanzi.ruby(w, py)} ✓</span>`), 600 * k));
    });
    timers.push(setTimeout(() => { box.classList.add('checked'); msg.textContent = MSG.checked; }, 600 * CHECK.length));
  };
  box.addEventListener('pointerdown', (e) => {
    const thing = e.target.closest('.wjj-thing:not(.home)');
    if (!thing) return;
    thing.setPointerCapture(e.pointerId);
    drag = { thing, x: e.clientX, y: e.clientY, moved: false };
  });
  box.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    if (Math.hypot(dx, dy) > 6) drag.moved = true;
    if (drag.moved) { drag.thing.classList.add('dragging'); drag.thing.style.translate = `${dx}px ${dy}px`; }
  });
  box.addEventListener('pointerup', (e) => {
    if (!drag) return;
    const { thing, moved } = drag;
    drag = null;
    thing.classList.remove('dragging');
    thing.style.translate = '';
    if (moved) {
      place(thing, document.elementsFromPoint(e.clientX, e.clientY).map((el) => el.closest('.wjj-zone')).find(Boolean));
      return;
    }
    sel = sel === thing ? null : thing;
    box.querySelectorAll('.wjj-thing').forEach((el) => el.classList.toggle('sel', el === sel));
  });
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-reset]')) { reset(); return; }
    if (e.target.closest('[data-check]')) { check(); return; }
    const zone = e.target.closest('.wjj-zone');
    if (!zone || !sel) return;
    place(sel, zone);
    sel.classList.remove('sel');
    sel = null;
  });
}
initHomeGame(document.getElementById('homeGame'));

Hanzi.init({
  cards: [
    { z: '具', py: 'jù', bs: '八', bh: 8, words: [['文具', 'wén jù'], ['玩具', 'wán jù']] },
    { z: '次', py: 'cì', bs: '欠', bh: 6, words: [['一次', 'yí cì'], ['下次', 'xià cì']] },
    { z: '丢', py: 'diū', bs: '丿', bh: 6, words: [['丢东西', 'diū dōng xi']] },
    { z: '哪', py: 'nǎ', bs: '口', bh: 9, words: [['哪里', 'nǎ lǐ'], ['哪些', 'nǎ xiē']] },
    { z: '新', py: 'xīn', bs: '斤', bh: 13, words: [['新的', 'xīn de'], ['新年', 'xīn nián']] },
    { z: '每', py: 'měi', bs: '母', bh: 7, words: [['每天', 'měi tiān']] },
    { z: '平', py: 'píng', bs: '一', bh: 5, words: [['平安', 'píng ān'], ['平时', 'píng shí']] },
    { z: '她', py: 'tā', bs: '女', bh: 6, words: [['她们', 'tā men']] },
    { z: '些', py: 'xiē', bs: '二', bh: 8, words: [['这些', 'zhè xiē'], ['一些', 'yì xiē']] },
    { z: '仔', py: 'zǐ', bs: '亻', bh: 5, words: [['仔细', 'zǐ xì']] },
    { z: '检', py: 'jiǎn', bs: '木', bh: 11, words: [['检查', 'jiǎn chá']] },
    { z: '查', py: 'chá', bs: '木', bh: 9, words: [['检查', 'jiǎn chá']] },
    { z: '所', py: 'suǒ', bs: '斤', bh: 8, words: [['所有', 'suǒ yǒu']] },
  ],
  pick: [
    { q: 'jù', ans: '具', opts: ['真', '具', '且'] },
    { q: 'diū', ans: '丢', opts: ['丢', '去', '云'] },
    { q: 'nǎ', ans: '哪', opts: ['那', '哪', '娜'] },
    { q: 'xīn', ans: '新', opts: ['亲', '听', '新'] },
    { q: 'měi', ans: '每', opts: ['每', '母', '海'] },
    { q: 'tā', ans: '她', opts: ['他', '地', '她'] },
    { q: 'xiē', ans: '些', opts: ['此', '些', '柴'] },
    { q: 'zǐ', ans: '仔', opts: ['子', '好', '仔'] },
    { q: 'jiǎn', ans: '检', opts: ['检', '脸', '捡'] },
  ],
  write: [
    { z: '文', py: 'wén', bs: '文', bh: 4 },
    { z: '次', py: 'cì', bs: '欠', bh: 6 },
    { z: '找', py: 'zhǎo', bs: '扌', bh: 7 },
    { z: '平', py: 'píng', bs: '一', bh: 5 },
    { z: '办', py: 'bàn', bs: '力', bh: 4 },
    { z: '让', py: 'ràng', bs: '讠', bh: 5 },
    { z: '包', py: 'bāo', bs: '勹', bh: 5 },
  ],
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
