'use strict';
/* 那一定会很好 · 本课数据与互动。记叙文模板见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* ================= 排一排：按顺序点卡片（items 按正确顺序给出，页面上打乱显示；onRight(i) 第 i 项点对时回调） ================= */
function initOrder(box, items, doneText, onRight) {
  // 打乱顺序：奇数项倒着排在前，偶数项排在后（固定顺序，每次上课一样）
  const keys = [...items.keys()];
  const shuffled = [...keys.filter((i) => i % 2).reverse(), ...keys.filter((i) => !(i % 2))].map((i) => ({ t: items[i], i }));
  box.innerHTML = shuffled.map(({ t, i }) => `<button class="order-card" type="button" data-i="${i}"><em></em>${t}</button>`).join('');
  const msg = document.createElement('p');
  msg.className = 'order-msg';
  msg.textContent = `按顺序点一点：先点第 1 个。`;
  box.after(msg);
  let next = 0;
  box.addEventListener('click', (e) => {
    const card = e.target.closest('.order-card');
    if (!card || card.classList.contains('right')) return;
    card.classList.remove('wrong');
    void card.offsetWidth; // 重新触发抖动动画
    if (+card.dataset.i !== next) { card.classList.add('wrong'); return; }
    next += 1;
    card.classList.add('right');
    card.querySelector('em').textContent = next;
    if (onRight) onRight(next - 1);
    const done = next === items.length;
    box.classList.toggle('all-done', done);
    msg.textContent = done ? doneText : `对了！接着点第 ${next + 1} 个。`;
  });
}

const JOURNEY = ['种子', '树', '手推车', '椅子', '木地板'];

/* 题目：哪几句里有“那一定会很好” */
const PICKS = {
  hao: [
    { t: '“这真难受。”种子想，“我一定要站起来，大口大口地呼吸空气，那一定会很好。”', ok: true, why: '种子的心愿' },
    { t: '“要是能做一棵会跑的树，那一定会很好。”树这么想着。', ok: true, why: '树的心愿' },
    { t: '跑起来的时候，手推车听到耳边呼呼的风声，真舒服。', ok: false, why: '这是心愿实现了' },
    { t: '“要是我能停下来，坐着休息一会儿，那一定会很好。”', ok: true, why: '手推车的心愿' },
    { t: '“要是我能躺下，那一定会很好。”', ok: true, why: '椅子的心愿' },
    { t: '木地板满意地舒展着身子，躺在阳台上，阳光照在身上，暖洋洋的，舒服极了。', ok: false, why: '它已经很满意了' },
  ],
};

/* 想象：如果你是它，还会有什么心愿 */
const MOMENTS = [
  {
    name: '木地板', pic: 'diban',
    prompt: '木地板躺在阳台上，舒服极了。很多年以后，它也许又会有新的心愿。它会想什么？',
    hint: '想一想：木地板每天看到什么、听到什么？它会羡慕谁？',
    example: '木地板每天看着阳台上的花开了又谢。“要是我也能开出一朵花，那一定会很好。”',
  },
  {
    name: '手推车', pic: 'tuiche',
    prompt: '手推车年轻的时候，在山路上跑来跑去，听到呼呼的风声。那时候，它会不会也有别的心愿？',
    hint: '它每天驮着谷子、土豆和调皮的儿子……',
    example: '手推车看见天上的鸟飞过。“要是我能飞起来，带着小主人去看看山那边，那一定会很好。”',
  },
  {
    name: '我自己', pic: 'shu',
    prompt: '你有没有这样想过：“要是……那一定会很好。”说一说你的心愿，再想想它实现以后会怎样。',
    hint: '可以是一个小小的心愿，也可以是一个童话一样的心愿。',
    example: '要是我能变成一只小鸟，飞到奶奶家去，那一定会很好。',
  },
];

/* ================= 本课独有：变身圆环（种子 → 树 → 手推车 → 椅子 → 木地板 → 又像一棵树） =================
 * 故事页 .slide.wheel[data-node]：seed / 0 树 / 1 手推车 / 2 椅子 / 3 木地板；字幕行 data-wish = 说出心愿，data-loop = 绕回一棵树 */
const RING = { cx: 350, cy: 330, r: 235, node: 52 };
const FORMS = ['树', '手推车', '椅子', '木地板'];
const WISHES = ['想做会跑的树', '想坐着休息', '想躺下', '又变成了一棵树'];
const SEED = { x: 82, y: 72 };
const ptAt = (deg, r = RING.r) => [RING.cx + r * Math.cos(deg * Math.PI / 180), RING.cy + r * Math.sin(deg * Math.PI / 180)].map((v) => v.toFixed(1));
const nodeDeg = (i) => -90 + i * 90;
const GAP = 15; // 弧线两端让开圆点（度）

function ringSvg() {
  const arc = (from, to, k) => {
    const [x1, y1] = ptAt(nodeDeg(from) + GAP);
    const [x2, y2] = ptAt(nodeDeg(to) - GAP);
    return `<path class="arc" data-arc="${k}" d="M${x1} ${y1} A${RING.r} ${RING.r} 0 0 1 ${x2} ${y2}" marker-end="url(#wArrow)"/>`;
  };
  const label = (k, deg, text) => {
    const [x, y] = ptAt(deg, 180);
    const lines = text.length > 5 ? [text.slice(0, 4), text.slice(4)] : [text];
    return `<text class="wl" data-arc="${k}" x="${x}" y="${y}" text-anchor="middle">${lines.map((t, i) => `<tspan x="${x}" dy="${i ? '1.2em' : (lines.length > 1 ? '-.2em' : '.35em')}">${t}</tspan>`).join('')}</text>`;
  };
  const [tx, ty] = ptAt(nodeDeg(0));
  return `<svg class="ring" viewBox="0 0 700 640" aria-hidden="true">
    <defs><marker id="wArrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="context-stroke"/></marker></defs>
    <circle class="track" cx="${RING.cx}" cy="${RING.cy}" r="${RING.r}"/>
    <path class="arc" data-arc="0" d="M${SEED.x + 44} ${SEED.y + 6} Q 210 70 ${(+tx - RING.node - 6).toFixed(1)} ${ty}" marker-end="url(#wArrow)"/>
    <text class="wl" data-arc="0" x="215" y="58" text-anchor="middle">想站起来</text>
    ${[1, 2, 3].map((k) => arc(k - 1, k, k)).join('')}${arc(3, 4, 4)}
    ${[1, 2, 3, 4].map((k) => label(k, nodeDeg(k - 1) + 45, WISHES[k - 1])).join('')}
    <g class="wn" data-n="-1"><circle cx="${SEED.x}" cy="${SEED.y}" r="40"/><text x="${SEED.x}" y="${SEED.y + 9}" text-anchor="middle">种子</text></g>
    ${FORMS.map((f, i) => { const [x, y] = ptAt(nodeDeg(i)); return `<g class="wn" data-n="${i}"><circle cx="${x}" cy="${y}" r="${RING.node}"/><text x="${x}" y="${+y + 9}" text-anchor="middle"${f.length > 2 ? ' class="long"' : ''}>${f}</text></g>`; }).join('')}
  </svg>`;
}

function initWheel() {
  document.querySelectorAll('.slide.wheel .wheel-box').forEach((box) => box.insertAdjacentHTML('afterbegin', ringSvg()));
}

function updateWheel(slide, step) {
  const cur = slide.dataset.node === 'seed' ? -1 : +slide.dataset.node;
  const shown = (attr) => [...slide.querySelectorAll(`.subs p[${attr}]`)].some((p) => +p.dataset.step <= step);
  const wish = shown('data-wish');
  const loop = shown('data-loop');
  slide.querySelectorAll('.wn').forEach((g) => {
    const n = +g.dataset.n;
    g.classList.toggle('done', n < cur);
    g.classList.toggle('cur', n === cur || (loop && n === 0));
  });
  slide.querySelectorAll('[data-arc]').forEach((a) => {
    const k = +a.dataset.arc; // 第 k 段：从第 k-1 个到第 k 个（4 = 木地板绕回树）
    a.classList.toggle('done', k <= cur || (k === 4 && loop));
    a.classList.toggle('pending', wish && k === cur + 1 && k < 4);
  });
}

window.LESSON = {
  init() {
    Narrative.init({ picks: PICKS, moments: MOMENTS });
    initOrder(document.getElementById('journeyOrder'), JOURNEY, '排对了！种子 → 树 → 手推车 → 椅子 → 木地板。');
    initWheel();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.classList.contains('wheel')) updateWheel(slide, step);
  },
};
