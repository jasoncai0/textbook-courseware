'use strict';
/* 场景歌 · 本课数据与本课互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：“贴纸拼场景”——把景物贴纸拖进海边 / 田野 / 校园，贴上去前先选对数量词；还有“开火车”读生字。 */

/* ================= 贴纸拼场景 ================= */
const ZONES = [
  { id: 'sea', name: '海边', py: 'hǎi biān' },
  { id: 'field', name: '田野', py: 'tián yě' },
  { id: 'school', name: '校园', py: 'xiào yuán' },
];
// q：正确的数量词；opts：选项（另外两个明显不搭）；x / y：贴在场景里的位置（%）
const STICKERS = [
  { e: '🕊️', n: '海鸥', py: 'hǎi ōu', z: 'sea', q: '只', opts: ['块', '只', '把'], x: 12, y: 20 },
  { e: '⛵', n: '帆船', py: 'fān chuán', z: 'sea', q: '条', opts: ['条', '面', '丛'], x: 9, y: 56 },
  { e: '🚢', n: '军舰', py: 'jūn jiàn', z: 'sea', q: '艘', opts: ['把', '片', '艘'], x: 24, y: 46 },
  { e: '⚓', n: '港湾', py: 'gǎng wān', z: 'sea', q: '处', opts: ['处', '只', '把'], x: 22, y: 80 },
  { e: '🐦', n: '飞鸟', py: 'fēi niǎo', z: 'field', q: '群', opts: ['块', '群', '艘'], x: 50, y: 13 },
  { e: '🌳', n: '垂柳', py: 'chuí liǔ', z: 'field', q: '行', opts: ['行', '块', '把'], x: 39, y: 34 },
  { e: '🎋', n: '翠竹', py: 'cuì zhú', z: 'field', q: '丛', opts: ['艘', '块', '丛'], x: 61, y: 32 },
  { e: '🐟', n: '鱼塘', py: 'yú táng', z: 'field', q: '方', opts: ['方', '只', '把'], x: 40, y: 58 },
  { e: '🌷', n: '花园', py: 'huā yuán', z: 'field', q: '座', opts: ['只', '座', '条'], x: 60, y: 55 },
  { e: '🌉', n: '石桥', py: 'shí qiáo', z: 'field', q: '座', opts: ['面', '只', '座'], x: 50, y: 76 },
  { e: '💧', n: '小溪', py: 'xiǎo xī', z: 'field', q: '道', opts: ['道', '块', '只'], x: 39, y: 85 },
  { e: '🌾', n: '稻田', py: 'dào tián', z: 'field', q: '块', opts: ['只', '面', '块'], x: 61, y: 84 },
  { e: '🚩', n: '队旗', py: 'duì qí', z: 'school', q: '面', opts: ['座', '面', '只'], x: 76, y: 26 },
  { e: '🎺', n: '铜号', py: 'tóng hào', z: 'school', q: '把', opts: ['把', '块', '艘'], x: 91, y: 38 },
  { e: '🧣', n: '红领巾', py: 'hóng lǐng jīn', z: 'school', q: '队', opts: ['座', '艘', '队'], x: 78, y: 62 },
  { e: '😄', n: '欢笑', py: 'huān xiào', z: 'school', q: '片', opts: ['片', '只', '艘'], x: 91, y: 80 },
];
const QPY = { 只: 'zhī', 条: 'tiáo', 艘: 'sōu', 处: 'chù', 群: 'qún', 行: 'háng', 丛: 'cóng', 方: 'fāng', 座: 'zuò', 道: 'dào', 块: 'kuài', 面: 'miàn', 把: 'bǎ', 队: 'duì', 片: 'piàn' };
// “一”的变调：第四声前读 yí，其余读 yì
const yi = (q) => (/[àèìòùǜ]/.test(QPY[q]) ? 'yí' : 'yì');
const SMSG = {
  start: '把贴纸拖到它该在的地方（也可以先点贴纸，再点地方）。',
  wrongZone: '它不在这儿，想想课文里它在哪儿？',
  ask: '贴上去之前，先选一选：一（　）？',
  wrongQ: '不对哦，再读读课文。',
  done: '场景拼好了！看着画面，从左到右说一说。',
};

function initStickers(box) {
  box.innerHTML = `<div class="cj-scene">${ZONES.map((z) => `<div class="cj-zone ${z.id}" data-zone="${z.id}"><b>${Hanzi.ruby(z.name, z.py)}</b></div>`).join('')}
      <div class="cj-placed"></div>
      <div class="cj-ask" hidden><p></p><div class="cj-opts"></div></div></div>
    <div class="cj-tray">${STICKERS.map((s, i) => `<button type="button" class="cj-sticker" data-i="${i}"><span>${s.e}</span>${Hanzi.ruby(s.n, s.py)}</button>`).join('')}</div>
    <div class="cj-bar"><span class="cj-msg">${SMSG.start}</span><button type="button" class="btn" data-reset>重新贴</button></div>`;
  const msg = box.querySelector('.cj-msg');
  const ask = box.querySelector('.cj-ask');
  const placed = box.querySelector('.cj-placed');
  let sel = null;
  let drag = null;
  let pending = null;
  const shake = (el) => { el.classList.remove('wrong'); void el.offsetWidth; el.classList.add('wrong'); };
  const tryZone = (card, zone) => {
    if (!zone || pending) return;
    const s = STICKERS[+card.dataset.i];
    if (zone.dataset.zone !== s.z) { shake(card); msg.textContent = SMSG.wrongZone; return; }
    pending = card;
    ask.querySelector('p').innerHTML = `${s.e} ${Hanzi.ruby('一', '_')}（　）${Hanzi.ruby(s.n, s.py)}`;
    ask.querySelector('.cj-opts').innerHTML = s.opts.map((o) => `<button type="button" class="cj-opt" data-q="${o}">${Hanzi.ruby(o, QPY[o])}</button>`).join('');
    ask.style.left = `${s.x}%`;
    ask.style.top = `${s.y}%`;
    ask.hidden = false;
    msg.textContent = SMSG.ask;
  };
  const answer = (btn) => {
    const s = STICKERS[+pending.dataset.i];
    if (btn.dataset.q !== s.q) { shake(btn); msg.textContent = SMSG.wrongQ; return; }
    placed.insertAdjacentHTML('beforeend', `<span class="cj-put" style="left:${s.x}%;top:${s.y}%"><i>${s.e}</i><span class="lbl">${Hanzi.ruby(`一${s.q}${s.n}`, `${yi(s.q)} ${QPY[s.q]} ${s.py}`)}</span></span>`);
    pending.classList.add('used');
    pending = null;
    ask.hidden = true;
    const left = box.querySelectorAll('.cj-sticker:not(.used)').length;
    msg.textContent = left ? `贴好了！还有 ${left} 张。` : SMSG.done;
    box.classList.toggle('all-done', !left);
  };
  const reset = () => {
    placed.innerHTML = '';
    ask.hidden = true;
    pending = null;
    sel = null;
    box.querySelectorAll('.cj-sticker').forEach((c) => c.classList.remove('used', 'sel'));
    box.classList.remove('all-done');
    msg.textContent = SMSG.start;
  };
  box.addEventListener('pointerdown', (e) => {
    const card = e.target.closest('.cj-sticker:not(.used)');
    if (!card || pending) return;
    card.setPointerCapture(e.pointerId);
    drag = { card, x: e.clientX, y: e.clientY, moved: false };
  });
  box.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    if (Math.hypot(dx, dy) > 6) drag.moved = true;
    if (drag.moved) { drag.card.classList.add('dragging'); drag.card.style.translate = `${dx}px ${dy}px`; }
  });
  box.addEventListener('pointerup', (e) => {
    if (!drag) return;
    const { card, moved } = drag;
    drag = null;
    card.classList.remove('dragging');
    card.style.translate = '';
    if (moved) { tryZone(card, document.elementsFromPoint(e.clientX, e.clientY).map((el) => el.closest('.cj-zone')).find(Boolean)); return; }
    sel = sel === card ? null : card;
    box.querySelectorAll('.cj-sticker').forEach((c) => c.classList.toggle('sel', c === sel));
  });
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-reset]')) { reset(); return; }
    const opt = e.target.closest('.cj-opt');
    if (opt && pending) { answer(opt); return; }
    const zone = e.target.closest('.cj-zone');
    if (!zone || !sel || pending) return;
    tryZone(sel, zone);
    sel.classList.remove('sel');
    sel = null;
  });
}
initStickers(document.getElementById('cjStickers'));

/* ================= 课后第 3 题：选一张图，说一说 ================= */
function initChoose(box) {
  box.addEventListener('click', (e) => {
    const th = e.target.closest('.cj-thumb');
    if (!th) return;
    box.querySelectorAll('.cj-thumb').forEach((t) => t.classList.toggle('on', t === th));
    const big = box.querySelector('.cj-big');
    big.style.backgroundImage = getComputedStyle(th).backgroundImage;
  });
}
initChoose(document.getElementById('cjChoose'));

/* ================= 开火车读生字 ================= */
const TRAIN = [['帆', 'fān'], ['艘', 'sōu'], ['军', 'jūn'], ['舰', 'jiàn'], ['稻', 'dào'], ['园', 'yuán'], ['翠', 'cuì'], ['队', 'duì'], ['铜', 'tóng'], ['号', 'hào']];
const TRAIN_GAP_MS = 1400;
function initTrain(box) {
  box.innerHTML = `<div class="cj-track"><div class="cj-train"><span class="cj-engine">🚂</span>${TRAIN.map(([z, py], i) => `<button type="button" class="cj-car" data-i="${i}"><b>${Hanzi.ruby(z, py)}</b></button>`).join('')}</div></div>
    <div class="cj-bar"><span class="cj-msg">开火车读：火车开到谁，谁就读一节车厢上的字。</span><button type="button" class="btn solid" data-go>开火车</button><button type="button" class="btn" data-hide>遮住拼音</button></div>`;
  let timers = [];
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-hide]')) { box.classList.toggle('nopy'); return; }
    const car = e.target.closest('.cj-car');
    if (car) { car.classList.toggle('lit'); return; }
    if (!e.target.closest('[data-go]')) return;
    timers.forEach(clearTimeout);
    box.querySelectorAll('.cj-car').forEach((c) => c.classList.remove('lit'));
    box.classList.remove('run');
    void box.offsetWidth;
    box.classList.add('run');
    timers = TRAIN.map((_, i) => setTimeout(() => box.querySelectorAll('.cj-car')[i].classList.add('lit'), 900 + i * TRAIN_GAP_MS));
  });
}
initTrain(document.getElementById('cjTrain'));

Hanzi.init({
  cards: [
    { z: '帆', py: 'fān', words: [['帆船', 'fān chuán'], ['一帆风顺', 'yì fān fēng shùn']] },
    { z: '艘', py: 'sōu', words: [['一艘', 'yì sōu']] },
    { z: '军', py: 'jūn', words: [['军舰', 'jūn jiàn'], ['解放军', 'jiě fàng jūn']] },
    { z: '舰', py: 'jiàn', words: [['军舰', 'jūn jiàn']] },
    { z: '稻', py: 'dào', words: [['稻田', 'dào tián'], ['水稻', 'shuǐ dào']] },
    { z: '园', py: 'yuán', words: [['花园', 'huā yuán'], ['校园', 'xiào yuán']] },
    { z: '翠', py: 'cuì', words: [['翠竹', 'cuì zhú'], ['翠绿', 'cuì lǜ']] },
    { z: '队', py: 'duì', words: [['队旗', 'duì qí'], ['排队', 'pái duì']] },
    { z: '铜', py: 'tóng', words: [['铜号', 'tóng hào'], ['铜钱', 'tóng qián']] },
    { z: '号', py: 'hào', words: [['铜号', 'tóng hào'], ['号角', 'hào jiǎo']] },
  ],
  pick: {
    lc: [
      { q: '一（　）鱼塘', py: '_ yú táng', ans: '方', opts: ['方', '只', '把'] },
      { q: '一（　）稻田', py: '_ dào tián', ans: '块', opts: ['群', '块', '面'] },
      { q: '一（　）石桥', py: '_ shí qiáo', ans: '座', opts: ['条', '只', '座'] },
      { q: '一（　）翠竹', py: '_ cuì zhú', ans: '丛', opts: ['丛', '艘', '块'] },
      { q: '一（　）海鸥', py: '_ hǎi ōu', ans: '只', opts: ['把', '只', '道'] },
      { q: '一（　）帆船', py: '_ fān chuán', ans: '条', opts: ['面', '丛', '条'] },
    ],
  },
  write: {
    a: [
      { z: '处', py: 'chù', bs: '夂', bh: 5 },
      { z: '园', py: 'yuán', bs: '囗', bh: 7 },
      { z: '桥', py: 'qiáo', bs: '木', bh: 10 },
      { z: '群', py: 'qún', bs: '羊', bh: 13 },
      { z: '队', py: 'duì', bs: '阝', bh: 4 },
    ],
    b: [
      { z: '旗', py: 'qí', bs: '方', bh: 14 },
      { z: '铜', py: 'tóng', bs: '钅', bh: 11 },
      { z: '号', py: 'hào', bs: '口', bh: 5 },
      { z: '领', py: 'lǐng', bs: '页', bh: 11 },
      { z: '巾', py: 'jīn', bs: '巾', bh: 3 },
    ],
  },
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
