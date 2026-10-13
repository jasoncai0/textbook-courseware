'use strict';
/* 一分钟 · 本课数据与本课互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完） */

const ONE_MINUTE = 60; // 秒

/* ================= 时间线：.yf-track 由脚本画；字幕上的 data-node 点亮第几站，data-sigh 在那一站冒出叹气泡泡 ================= */
const NODES = [
  { icon: '⏰', t: '闹钟响', py: 'nào zhōng xiǎng' },
  { icon: '😴', t: '再睡一分钟', py: 'zài shuì yì fēn zhōng' },
  { icon: '🎒', t: '上学去', py: 'shàng xué qù' },
  { icon: '🚦', t: '红灯亮了', py: 'hóng dēng liàng le' },
  { icon: '🚌', t: '车子开了', py: 'chē zi kāi le' },
  { icon: '🚶', t: '走到学校', py: 'zǒu dào xué xiào' },
  { icon: '🏫', t: '迟到了', py: 'chí dào le' },
];
const SIGH = { t: '唉！', py: 'ài' }; // 叹气：“要是早一分钟就好了”

function buildTrack(track) {
  const pic = track.dataset.pic;
  const media = !pic ? '' : track.dataset.video
    ? `<video class="yf-pic" data-src="assets/${pic}.mp4" data-poster="assets/${pic}.jpg" muted loop autoplay playsinline preload="none"></video>`
    : `<div class="yf-pic" data-bg="assets/${pic}.jpg"></div>`;
  track.innerHTML = `${media}<ol class="yf-nodes" style="--n:${NODES.length}">${NODES.map((n, i) => `<li data-i="${i}">
      <span class="yf-sigh">${Hanzi.ruby(SIGH.t, SIGH.py)}</span>
      <em>${n.icon}</em><small>${Hanzi.ruby(n.t, n.py)}</small></li>`).join('')}</ol>`;
}
document.querySelectorAll('.yf-track').forEach(buildTrack);

const maxAttr = (els, attr) => Math.max(-1, ...[...els].map((el) => +el.getAttribute(attr)));
function updateTrack(slide, step) {
  const track = slide.querySelector('.yf-track');
  if (!track) return;
  const all = [...document.querySelectorAll('.slide')];
  const before = all.slice(0, all.indexOf(slide));
  const shown = [...slide.querySelectorAll('[data-step]')].filter((el) => +el.dataset.step <= step);
  const base = maxAttr(before.flatMap((s) => [...s.querySelectorAll('[data-node]')]), 'data-node');
  const cur = Math.max(base, 0, maxAttr(shown.filter((el) => el.dataset.node), 'data-node'));
  const sighs = new Set([...before.flatMap((s) => [...s.querySelectorAll('[data-sigh]')]), ...shown.filter((el) => el.dataset.sigh)].map((el) => +el.dataset.sigh));
  track.querySelectorAll('.yf-nodes li').forEach((li, i) => {
    li.classList.toggle('done', i < cur);
    li.classList.toggle('cur', i === cur);
    li.classList.toggle('sighed', sighs.has(i));
  });
}

/* ================= 课后第 2 题：骨牌因果链（第 2、3 块后半句点问号再看） ================= */
const DOMINO = [
  { a: ['要是早一分钟，', 'yào shi zǎo yì fēn zhōng'], b: ['就能赶上绿灯了。', 'jiù néng gǎn shàng lǜ dēng le'] },
  { a: ['要是能赶上绿灯，', 'yào shi néng gǎn shàng lǜ dēng'], b: ['就能及时通过路口了。', 'jiù néng jí shí tōng guò lù kǒu le'], ask: true },
  { a: ['要是能及时通过路口，', 'yào shi néng jí shí tōng guò lù kǒu'], b: ['就能赶上公共汽车了。', 'jiù néng gǎn shàng gōng gòng qì chē le'], ask: true },
  { a: ['要是能赶上公共汽车，', 'yào shi néng gǎn shàng gōng gòng qì chē'], b: ['就不会迟到了。', 'jiù bú huì chí dào le'] },
];
function buildDomino(box) {
  const r = ([t, py]) => Hanzi.ruby(t, py);
  box.innerHTML = `<div class="yf-tiles">${DOMINO.map((d, i) => `<div class="yf-tile" data-step="${i + 1}"><b>${i + 1}</b></div>`).join('')}</div>
    <ol class="yf-lines">${DOMINO.map((d, i) => `<li class="py" data-step="${i + 1}">${r(d.a)}${d.ask ? `<button type="button" class="yf-ask">？</button><span class="yf-ans">${r(d.b)}</span>` : r(d.b)}</li>`).join('')}</ol>`;
  box.addEventListener('click', (e) => {
    const ask = e.target.closest('.yf-ask');
    if (ask) ask.closest('li').classList.add('open');
  });
}
buildDomino(document.getElementById('domino'));

/* ================= 计时一分钟：圆环倒计时 ================= */
const RING = 2 * Math.PI * 54;
function countdown(box, onTick, onEnd) {
  let left = ONE_MINUTE;
  let timer = 0;
  const ring = box.querySelector('.yf-ring-fg');
  const num = box.querySelector('.yf-sec');
  const show = () => {
    num.textContent = left;
    ring.style.strokeDashoffset = RING * (1 - left / ONE_MINUTE);
    box.classList.toggle('over', left === 0);
  };
  const stop = () => { clearInterval(timer); timer = 0; box.classList.remove('running'); };
  return {
    start() {
      if (timer) return;
      if (left === 0) left = ONE_MINUTE;
      box.classList.add('running');
      show();
      timer = setInterval(() => {
        left -= 1;
        show();
        if (onTick) onTick(left);
        if (left === 0) { stop(); if (onEnd) onEnd(); }
      }, 1000);
    },
    reset() { stop(); left = ONE_MINUTE; show(); },
    running: () => Boolean(timer),
  };
}
const ringSvg = `<svg class="yf-clock" viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" class="yf-ring-bg"/><circle cx="60" cy="60" r="54" class="yf-ring-fg" style="stroke-dasharray:${RING}"/><text x="60" y="58" class="yf-sec">60</text><text x="60" y="84" class="yf-unit">秒</text></svg>`;

const TASKS = [
  { name: '走路', pre: ['我一分钟能走', 'wǒ yì fēn zhōng néng zǒu'], post: ['步。', 'bù'] },
  { name: '写字', pre: ['我一分钟能写', 'wǒ yì fēn zhōng néng xiě'], post: ['个字。', 'gè zì'] },
  { name: '拍手', pre: ['我一分钟能拍', 'wǒ yì fēn zhōng néng pāi'], post: ['下手。', 'xià shǒu'] },
  { name: '跳绳', pre: ['我一分钟能跳绳', 'wǒ yì fēn zhōng néng tiào shéng'], post: ['下。', 'xià'] },
];
function buildTimer(box) {
  box.innerHTML = `<div class="yf-timer-l">${ringSvg}
      <div class="btns"><button type="button" class="btn solid" data-go>开始</button><button type="button" class="btn" data-reset>重来</button></div>
      <p class="yf-timer-msg">选一件事，点“开始”。</p></div>
    <ul class="yf-tasks">${TASKS.map((t, i) => `<li data-i="${i}"><span class="py">${Hanzi.ruby(...t.pre)}</span><input type="number" min="0" max="999" inputmode="numeric" aria-label="${t.name}的次数"><span class="py">${Hanzi.ruby(...t.post)}</span></li>`).join('')}
      <li class="yf-more py">${Hanzi.ruby('还能……', 'hái néng')}</li></ul>`;
  const msg = box.querySelector('.yf-timer-msg');
  const clock = countdown(box, (left) => { if (left === 10) msg.textContent = '还有 10 秒！'; }, () => { msg.textContent = '时间到！数一数，填一填。'; });
  box.addEventListener('click', (e) => {
    const li = e.target.closest('.yf-tasks li[data-i]');
    if (li) box.querySelectorAll('.yf-tasks li').forEach((x) => x.classList.toggle('on', x === li));
    if (e.target.closest('[data-go]')) { clock.start(); msg.textContent = '开始！一分钟里能做多少？'; }
    if (e.target.closest('[data-reset]')) { clock.reset(); msg.textContent = '选一件事，点“开始”。'; }
  });
}
buildTimer(document.getElementById('timer'));

/* ================= 识字游戏：一分钟读字挑战 ================= */
const FLASH = [['钟', 'zhōng'], ['丁', 'dīng'], ['元', 'yuán'], ['迟', 'chí'], ['洗', 'xǐ'], ['背', 'bēi'], ['刚', 'gāng'], ['共', 'gòng'], ['汽', 'qì'], ['决', 'jué'], ['定', 'dìng'], ['已', 'yǐ'], ['经', 'jīng']];
function buildFlash(box) {
  box.innerHTML = `<div class="yf-timer-l">${ringSvg}
      <div class="btns"><button type="button" class="btn solid" data-go>开始</button><button type="button" class="btn" data-reset>重来</button></div></div>
    <div class="yf-flash-r"><div class="yf-card"><ruby>？<rt></rt></ruby></div>
      <div class="btns"><button type="button" class="btn solid" data-ok disabled>读对了 ✓</button><button type="button" class="btn" data-skip disabled>下一个</button><button type="button" class="btn" data-hint disabled>看拼音</button></div>
      <p class="yf-score">读对了 <b>0</b> 个</p></div>`;
  const card = box.querySelector('.yf-card');
  const score = box.querySelector('.yf-score b');
  const playBtns = box.querySelectorAll('[data-ok], [data-skip], [data-hint]');
  let deck = [];
  let n = 0;
  const shuffle = () => FLASH.map((x) => x).sort(() => Math.random() - 0.5);
  const nextCard = () => {
    if (!deck.length) deck = shuffle();
    const [z, py] = deck.pop();
    card.classList.remove('hint', 'pop');
    void card.offsetWidth;
    card.classList.add('pop');
    card.innerHTML = `<ruby>${z}<rt>${py}</rt></ruby>`;
  };
  const end = () => {
    playBtns.forEach((b) => { b.disabled = true; });
    card.classList.add('hint');
    card.innerHTML = `<span class="yf-end">一分钟读对了 ${n} 个字！</span>`;
  };
  const clock = countdown(box, null, end);
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-go]') && !clock.running()) {
      n = 0; score.textContent = '0'; deck = [];
      playBtns.forEach((b) => { b.disabled = false; });
      clock.start();
      nextCard();
    }
    if (e.target.closest('[data-reset]')) { clock.reset(); n = 0; score.textContent = '0'; playBtns.forEach((b) => { b.disabled = true; }); card.innerHTML = '<ruby>？<rt></rt></ruby>'; }
    if (e.target.closest('[data-ok]')) { n += 1; score.textContent = n; nextCard(); }
    if (e.target.closest('[data-skip]')) nextCard();
    if (e.target.closest('[data-hint]')) card.classList.add('hint');
  });
}
buildFlash(document.getElementById('flash'));

Hanzi.init({
  cards: [
    { z: '钟', py: 'zhōng', bs: '钅', bh: 9, words: [['一分钟', 'yì fēn zhōng'], ['闹钟', 'nào zhōng']] },
    { z: '丁', py: 'dīng', bs: '一', bh: 2, words: [['丁零零', 'dīng líng líng']] },
    { z: '元', py: 'yuán', bs: '儿', bh: 4, words: [['元元', 'yuán yuan'], ['一元', 'yì yuán']] },
    { z: '迟', py: 'chí', bs: '辶', bh: 7, words: [['迟到', 'chí dào']] },
    { z: '洗', py: 'xǐ', bs: '氵', bh: 9, words: [['洗脸', 'xǐ liǎn'], ['洗手', 'xǐ shǒu']] },
    { z: '背', py: 'bēi', bs: '月', bh: 9, words: [['背书包', 'bēi shū bāo']] },
    { z: '刚', py: 'gāng', bs: '刂', bh: 6, words: [['刚想', 'gāng xiǎng'], ['刚才', 'gāng cái']] },
    { z: '共', py: 'gòng', bs: '八', bh: 6, words: [['公共汽车', 'gōng gòng qì chē'], ['一共', 'yí gòng']] },
    { z: '汽', py: 'qì', bs: '氵', bh: 7, words: [['汽车', 'qì chē']] },
    { z: '决', py: 'jué', bs: '冫', bh: 6, words: [['决定', 'jué dìng']] },
    { z: '定', py: 'dìng', bs: '宀', bh: 8, words: [['决定', 'jué dìng'], ['一定', 'yí dìng']] },
    { z: '已', py: 'yǐ', bs: '己', bh: 3, words: [['已经', 'yǐ jīng']] },
    { z: '经', py: 'jīng', bs: '纟', bh: 8, words: [['已经', 'yǐ jīng']] },
  ],
  write: [
    { z: '钟', py: 'zhōng', bs: '钅', bh: 9 },
    { z: '丁', py: 'dīng', bs: '一', bh: 2 },
    { z: '元', py: 'yuán', bs: '儿', bh: 4 },
    { z: '共', py: 'gòng', bs: '八', bh: 6 },
    { z: '已', py: 'yǐ', bs: '己', bh: 3 },
    { z: '经', py: 'jīng', bs: '纟', bh: 8 },
    { z: '坐', py: 'zuò', bs: '土', bh: 7 },
  ],
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateTrack(slide, step);
  },
};
