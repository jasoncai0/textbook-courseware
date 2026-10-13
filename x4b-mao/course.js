'use strict';
/* 猫 · 本课数据与互动。记叙文模板见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js
 * 本课专属：性格天平（相反的性格一对一对放上去，天平先歪后平 → “古怪”）。
 */

/* ================= 性格天平：第 2k-1 步放左边，第 2k 步放右边 ================= */
const PAIRS = [
  { l: '老实', r: '贪玩', el: '找个暖和的地方，成天睡大觉', er: '出走一天一夜，任凭谁怎么呼唤，也不肯回来' },
  { l: '贪玩', r: '尽职', el: '一天一夜不回家', er: '屏息凝视，一连就是几个钟头，非把老鼠等出来不可' },
  { l: '温柔可亲', r: '一声不出', el: '蹭你的腿，在稿纸上踩印几朵小梅花', er: '无论谁说多少好话，它也一声不出' },
  { l: '胆小', r: '勇猛', el: '什么都怕，总想藏起来', er: '遇上蛇也敢斗一斗' },
];
const TILT = 8;
const ARM = 290;
const CHIP_W = 210;

function chip(cx, k, text, step, side) {
  const y = 262 - k * 40;
  return `<g class="tp-chip ${side}" data-step="${step}"><rect x="${cx - CHIP_W / 2}" y="${y}" width="${CHIP_W}" height="36" rx="18"/><text x="${cx}" y="${y + 27}" text-anchor="middle">${text}</text></g>`;
}
document.getElementById('tpLChips').innerHTML = PAIRS.map((p, k) => chip(160, k, p.l, k * 2 + 1, 'l')).join('');
document.getElementById('tpRChips').innerHTML = PAIRS.map((p, k) => chip(640, k, p.r, k * 2 + 2, 'r')).join('');

function renderTianping(step) {
  const pairDone = Math.floor(step / 2);
  const leftOnly = step % 2 === 1 && step <= PAIRS.length * 2;
  const deg = leftOnly ? -TILT : 0;
  const dy = Math.sin((deg * Math.PI) / 180) * ARM;
  document.getElementById('tpBeam').style.transform = `rotate(${deg}deg)`;
  document.getElementById('tpL').style.transform = `translateY(${(-dy).toFixed(1)}px)`;
  document.getElementById('tpR').style.transform = `translateY(${dy.toFixed(1)}px)`;
  const k = leftOnly ? pairDone : pairDone - 1;
  const p = PAIRS[Math.min(k, PAIRS.length - 1)];
  const ev = document.getElementById('tpEv');
  if (step === 0) { ev.innerHTML = '<p class="tp-hint">点“下一步”，一对一对放上天平。</p>'; return; }
  if (step > PAIRS.length * 2) {
    ev.innerHTML = '<p class="tp-big">两边一样重，都是真的——</p><p class="tp-big"><b>这就是“古怪”！</b></p><p class="tp-hint">这种古怪的小动物，真让人觉得可爱。</p>';
    return;
  }
  ev.innerHTML = `<p class="tp-say">说它<b>${p.l}</b>吧——</p><p class="tp-e">${p.el}</p>` +
    (leftOnly ? '<p class="tp-hint">可是……（下一步）</p>' : `<p class="tp-say">可是，它又<b class="r">${p.r}</b>——</p><p class="tp-e">${p.er}</p>`);
}

/* 课后第 2 题：从哪些地方看出作者喜欢猫 */
const CLUES = [
  { q: '在稿纸上踩印几朵小梅花。', a: '猫爪印弄脏了稿纸，作者却说成“小梅花”，不但不生气，还觉得美。' },
  { q: '这可都凭它的高兴。', a: '像在说一个任性的孩子，语气里满是宠爱。' },
  { q: '连半朵小梅花也不肯印在稿纸上！', a: '好像在埋怨，其实是盼着它跳上桌来。' },
  { q: '这种古怪的小动物，真让人觉得可爱。', a: '直接说出喜爱：古怪，所以可爱。' },
  { q: '院中的花草可遭了殃。', a: '花草被弄坏了，作者却笑着说“遭了殃”，一点儿不生气。' },
  { q: '你见了，绝不会责打它们。', a: '再淘气也舍不得打——直接写出了疼爱。' },
];

const MOMENTS = [
  { name: '我家的小狗', pic: 'shuijiao', prompt: '写写你家（或你熟悉）的小狗。',
    hint: '照样子：说它____吧，它的确____。可是，____。', example: '说它胆小吧，它的确胆小，听见打雷就钻到床底下。可是，有陌生人敲门，它又第一个冲到门口，汪汪叫个不停。' },
  { name: '我的小弟弟', pic: 'xiaomao', prompt: '人也可以这样写：写写家里的弟弟妹妹。',
    hint: '先写一面，再用“可是”写相反的一面，每一面都举一件事。', example: '说他调皮吧，的确是啊，把我的作业本画得乱七八糟。可是，我生病的时候，他又悄悄把最爱吃的糖放在我枕头边。' },
  { name: '我自己选', pic: 'meihua', prompt: '你还想写谁？小鸟、小兔，还是你自己？', hint: '记住：两面都要写具体的事。', example: '……' },
];

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: ['读句子', '我体会到'], moments: MOMENTS });
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.classList.contains('s-tianping')) renderTianping(step);
  },
};
