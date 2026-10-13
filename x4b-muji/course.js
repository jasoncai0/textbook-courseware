'use strict';
/* 母鸡 · 本课数据与互动。记叙文模板见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js
 * 本课专属：态度计（读到哪段，“我”的态度在哪儿）、态度转变曲线（先抑后扬）、四个词连证据。
 */

/* ================= 态度计：取当前步之前最后一个 data-att，没有就用 slide 上的 ================= */
function updateAtt(slide, step) {
  const box = document.getElementById('att');
  let v = slide.dataset.att;
  slide.querySelectorAll('[data-att][data-step]').forEach((el) => { if (+el.dataset.step <= step) v = el.dataset.att; });
  box.classList.toggle('show', v !== undefined);
  if (v === undefined) return;
  document.getElementById('attDot').style.left = `${v}%`;
  box.classList.toggle('hi', +v >= 50);
}

/* ================= 态度转变曲线：第 i 步画到第 i 个点 ================= */
const CURVE = [
  { t: '乱叫', y: 300 }, { t: '如怨如诉', y: 318 }, { t: '欺侮鸭子', y: 336 }, { t: '下毒手', y: 350 }, { t: '下蛋发狂', y: 356 },
  { t: '孵出雏鸡', y: 250, turn: true }, { t: '警戒', y: 186 }, { t: '让儿女吃', y: 146 }, { t: '教和护', y: 112 }, { t: '夜里啼叫', y: 86 },
  { t: '不敢再讨厌', y: 58, end: true },
];
const X0 = 120;
const DX = 62;

function drawCurve() {
  const pts = CURVE.map((p, i) => ({ ...p, x: X0 + i * DX }));
  const segs = pts.slice(1).map((p, i) => {
    const a = pts[i];
    const cls = p.y < 260 && a.y < 260 ? 'pos' : p.turn ? 'turn' : 'neg';
    return `<path class="draw cv-seg ${cls}" data-step="${i + 2}" pathLength="1" d="M${a.x} ${a.y} L${p.x} ${p.y}"/>`;
  }).join('');
  const dots = pts.map((p, i) => {
    const up = i % 2 === 0;
    const ty = up ? p.y - 18 : p.y + 34;
    const cls = p.turn ? 'turn' : p.y < 260 ? 'pos' : 'neg';
    return `<g class="cv-pt ${cls}${p.end ? ' end' : ''}" data-step="${i + 1}"><circle cx="${p.x}" cy="${p.y}" r="${p.end ? 11 : 8}"/><text x="${p.x}" y="${ty}" text-anchor="middle">${p.t}</text></g>`;
  }).join('');
  document.getElementById('cvLayer').innerHTML = segs + dots;
}
drawCurve();

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

const SICI = [
  { a: '负责', b: '一有动静就警戒，咕咕地警告鸡雏集合' },
  { a: '慈爱', b: '找到吃的马上放下，让它的儿女吃' },
  { a: '勇敢', b: '别的大鸡来抢食，它一定出击，连大公鸡也怕它三分' },
  { a: '辛苦', b: '一天不知教多少次，自己却消瘦了许多' },
];

window.LESSON = {
  init() {
    Narrative.init({});
    initMatch(document.getElementById('siciMatch'), SICI, [2, 0, 3, 1]);
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateAtt(slide, step);
    document.querySelectorAll('.yd-pic').forEach((v) => {
      if (v.tagName !== 'VIDEO') return;
      if (v.closest('.slide') === slide) v.play().catch(() => { /* 素材未生成或浏览器拒绝自动播放 */ });
      else v.pause();
    });
  },
};
