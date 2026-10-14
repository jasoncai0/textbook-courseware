'use strict';
/* 一块奶酪 · 本课数据。记叙文模板见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 阅读提示一：围绕一块奶酪讲了一件什么事 */
const PLOT = [
  { step: 1, stage: '起因', text: '队长宣布：不许偷嘴，偷嘴的是自己也照样受罚', pic: 'jihe', x: 12, y: 90 },
  { step: 2, stage: '经过', text: '搬奶酪时，队长拽掉了一点儿奶酪渣', pic: 'nailao', x: 32, y: 74 },
  { step: 2, stage: '经过', text: '心七上八下，把大家支开', pic: 'nailao', pos: '60% 70%', x: 51, y: 58 },
  { step: 3, stage: '经过', text: '嗅嗅奶酪渣，犹豫，一跺脚', pic: 'duojiao', x: 70, y: 44 },
  { step: 3, stage: '结果', text: '让最小的蚂蚁吃掉，大家劲头更足', pic: 'nailao', pos: '40% 40%', x: 88, y: 36 },
];

/* 阅读提示二：喜不喜欢蚂蚁队长 · 理由天平（side：like / dislike；a：课文依据） */
const REASONS = [
  { side: 'like', q: '它说到做到，规矩对自己也管用。', a: '“要是偷嘴的是您呢？”“照样要受处罚。”——没有人看见，它也没有偷嘴。' },
  { side: 'like', q: '它能管住自己。', a: '“它低下头，嗅嗅那点儿奶酪渣，味道真香！可是，它犹豫了一会儿，终于一跺脚……”' },
  { side: 'like', q: '它关心最小的蚂蚁。', a: '“这点儿奶酪渣是刚才弄掉的，丢了可惜，你吃掉它吧！”' },
  { side: 'dislike', q: '它把大家支开，是不是想偷偷吃？', a: '它确实动心了，还“生气了”。可正因为想吃，最后没吃，才更不容易。' },
  { side: 'dislike', q: '它生气了就乱下命令，让大家白走一趟。', a: '“蚂蚁队长生气了。它登上一块大石板，突然下令：‘注意啦，全体都有。稍息！立正！向后——转！齐步——走！’”' },
];

/* ================= 草丛小剧场：谁说话谁亮起来，台词进气泡，旁白在下面 ================= */
const ANT = (cap) => `<svg class="ant" viewBox="0 0 120 90" aria-hidden="true">
  <g stroke="#2b211b" stroke-width="3.5" fill="none" stroke-linecap="round">
    <path d="M52 52 L40 74 M60 54 L58 80 M68 52 L80 76 M50 50 L30 62 M70 50 L92 62"/>
    <path d="M90 26 Q96 6 106 6 M86 26 Q84 6 92 2"/></g>
  <ellipse cx="34" cy="50" rx="22" ry="17" fill="#2f2620"/><ellipse cx="62" cy="48" rx="12" ry="10" fill="#3a2f27"/>
  <circle cx="86" cy="36" r="15" fill="#3a2f27"/><circle cx="91" cy="33" r="5" fill="#fff"/><circle cx="92" cy="33" r="2.4" fill="#1a1410"/>
  ${cap ? '<path d="M74 26 Q86 6 100 24 Z" fill="#d23b2a"/><rect x="72" y="23" width="30" height="5" rx="2" fill="#a52a1c"/>' : ''}</svg>`;
const ROLES = [['dz', '蚂蚁队长'], ['xm', '小蚂蚁'], ['pb', '旁白']];

function initPlay() {
  document.querySelectorAll('.s-play .play').forEach((play) => {
    play.querySelector('.actor.dz').insertAdjacentHTML('beforeend', `${ANT(true)}<b class="name">蚂蚁队长</b>`);
    play.querySelector('.actor.xm').insertAdjacentHTML('beforeend', `<div class="crowd">${ANT(false)}${ANT(false)}${ANT(false)}</div><b class="name">小蚂蚁们</b>`);
    play.insertAdjacentHTML('beforeend', `<div class="roles" data-noswipe><span>分角色读，我读：</span>${ROLES.map(([k, t]) => `<button class="btn" type="button" data-role="${k}">${t}</button>`).join('')}</div>`);
  });
  document.addEventListener('click', (e) => {
    const b = e.target.closest('.roles [data-role]');
    if (!b) return;
    const role = document.body.dataset.role === b.dataset.role ? '' : b.dataset.role;
    document.body.dataset.role = role;
    document.querySelectorAll('.roles [data-role]').forEach((x) => x.classList.toggle('solid', x.dataset.role === role));
  });
}

function updatePlay(slide, step) {
  const lines = [...slide.querySelectorAll('.ln')];
  lines.forEach((l) => l.classList.toggle('now', +l.dataset.step === step));
  slide.querySelectorAll('.actor').forEach((a) => a.classList.toggle('speaking', Boolean(a.querySelector('.ln.now'))));
  // 小蚂蚁们离场 / 回来：取到这一步为止最近的 data-xm
  const moves = lines.filter((l) => l.dataset.xm && +l.dataset.step <= step);
  const xm = moves.length ? moves[moves.length - 1].dataset.xm : (slide.dataset.xmStart || 'in');
  slide.querySelector('.actor.xm').classList.toggle('away', xm === 'out');
}

/* ================= 理由天平 ================= */
const TILT_PER = 7;
const TILT_MAX = 16;
function initScale(box, items) {
  const evid = document.getElementById('evid');
  box.innerHTML = items.map((r, i) => `<button class="reason ${r.side}" type="button" data-i="${i}"><small>${r.side === 'like' ? '喜欢' : '有点不喜欢'}</small>${r.q}</button>`).join('');
  const tilt = () => {
    const n = (side) => document.querySelectorAll(`#pan${side} li`).length;
    const deg = Math.max(-TILT_MAX, Math.min(TILT_MAX, (n('Dislike') - n('Like')) * TILT_PER));
    document.getElementById('scBeam').style.transform = `rotate(${deg}deg)`;
    const dy = Math.sin(deg * Math.PI / 180) * 9; // 横梁半长约 9em
    document.getElementById('panLike').style.transform = `translateY(${-dy}em)`;
    document.getElementById('panDislike').style.transform = `translateY(${dy}em)`;
  };
  box.addEventListener('click', (e) => {
    const b = e.target.closest('.reason');
    if (!b) return;
    const r = items[+b.dataset.i];
    evid.innerHTML = `<b>课文依据：</b>${r.a}`;
    if (b.classList.contains('placed')) return;
    b.classList.add('placed');
    document.querySelector(`#pan${r.side === 'like' ? 'Like' : 'Dislike'} ul`).insertAdjacentHTML('beforeend', `<li>${r.q}</li>`);
    tilt();
  });
}

window.LESSON = {
  init() {
    Narrative.init({ plot: PLOT });
    initPlay();
    initScale(document.getElementById('reasons'), REASONS);
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.classList.contains('s-play')) updatePlay(slide, step);
  },
};
