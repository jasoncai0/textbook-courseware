'use strict';
/* 田忌赛马 · 本课数据与“连一连”对阵图。页面逻辑见记叙文模板 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 田忌的神态卡 */
const CLUE_LABELS = ['神态', '心里在想'];
const CLUES = [
  { q: '第一场输了，<br>但他<b>不动声色</b>，一点儿都不着急。', a: '这一场本来就是故意“舍掉”的，后面两场稳赢——心里有底。' },
  { q: '胜了第二场。<br>田忌<b>微微一笑</b>。', a: '计划成功了一半！再赢一场就赢了。' },
  { q: '又胜了一场。<br>田忌<b>满意地笑了</b>。', a: '果然赢了！孙膑的主意真妙。' },
  { q: '齐威王<b>好奇地问</b>田忌：“……是不是有人给你出谋划策了？”', a: '同样的马，怎么换个顺序就输了？他猜到背后有高人。' },
];

const MOMENTS = [
  {
    name: '讲《田忌赛马》', pic: 'saima',
    prompt: '用自己的话讲讲田忌赛马的故事。',
    hint: '起因：孙膑发现马的脚力相差不多、分三等；经过：调换出场顺序，三场比赛；结果：胜两场输一场，孙膑被任命为军师。',
    example: '田忌常和齐威王赛马。他的门客孙膑看了几场比赛，发现大家的马脚力差不多，都分上、中、下三等。孙膑对田忌说：“马不用换，听我的，保证您赢。”比赛时，田忌先用下等马对齐威王的上等马，输了；再用上等马对中等马，赢了；最后用中等马对下等马，又赢了。三局两胜，田忌赢了！齐威王知道是孙膑出的主意，就任命他做了军师。',
  },
  {
    name: '孙膑悄悄说了什么', pic: 'miji',
    prompt: '“孙膑把田忌请到一边，悄悄地把办法告诉了他。”孙膑会怎么说？',
    hint: '把办法说清楚：先出哪匹马，对哪匹马，为什么。',
    example: '“将军，第一场您先用下等马对他的上等马，这场咱们输了也别急；第二场用上等马对他的中等马，第三场用中等马对他的下等马，这两场都能赢。三局两胜，赢的就是您！”',
  },
  {
    name: '齐威王回去后', pic: 'shengli',
    prompt: '比赛结束后，齐威王回到宫里，会想些什么？',
    hint: '他会怎么看这次输了的比赛？怎么看孙膑？',
    example: '我的马明明比田忌的好，怎么会输呢？原来只是换了换出场顺序！这个孙膑真了不起，这样会动脑筋的人，应该让他来当军师。',
  },
];

/* ================= 连一连：齐威王的马连田忌的马，三场连好自动判胜负 ================= */
const GRADE = { 3: '上等马', 2: '中等马', 1: '下等马' };
const PRESETS = { same: { 3: 3, 2: 2, 1: 1 }, sun: { 3: 1, 2: 3, 1: 2 } }; // 齐威王的马 → 田忌的马
const VERDICT = { win: '田忌胜', lose: '田忌负', tie: '没把握' };
const TAG_AT = .28;
let pairs = {}; // { 齐威王等级: 田忌等级 }

const verdict = (qi, tian) => (tian > qi ? 'win' : tian < qi ? 'lose' : 'tie');

function anchor(btn, box, side) {
  const r = btn.getBoundingClientRect();
  return { x: (side === 'qi' ? r.right : r.left) - box.left, y: r.top + r.height / 2 - box.top };
}

function drawLines(temp) {
  const board = document.getElementById('tjBoard');
  const svg = document.getElementById('tjLines');
  const box = svg.getBoundingClientRect();
  if (!box.width) return;
  svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
  const btn = (side, r) => board.querySelector(`.tj-horse[data-side="${side}"][data-r="${r}"]`);
  const lines = Object.entries(pairs).map(([qi, tian]) => {
    const a = anchor(btn('qi', qi), box, 'qi');
    const b = anchor(btn('tian', tian), box, 'tian');
    const v = verdict(+qi, +tian);
    const mx = a.x + (b.x - a.x) * TAG_AT; // 标签靠近齐威王一侧，三条线交叉时不重叠
    const my = a.y + (b.y - a.y) * TAG_AT;
    return `<line class="tj-l ${v}" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"/>
      <g class="tj-tag ${v}"><rect x="${mx - 30}" y="${my - 12}" width="60" height="24" rx="12"/><text x="${mx}" y="${my + 5}">${VERDICT[v]}</text></g>`;
  });
  if (temp) lines.push(`<line class="tj-l temp" x1="${temp.a.x}" y1="${temp.a.y}" x2="${temp.x - box.left}" y2="${temp.y - box.top}"/>`);
  svg.innerHTML = lines.join('');
  board.querySelectorAll('.tj-horse').forEach((b) => {
    const linked = b.dataset.side === 'qi' ? b.dataset.r in pairs : Object.values(pairs).includes(+b.dataset.r);
    b.classList.toggle('linked', linked);
  });
}

function judge() {
  const res = document.getElementById('tjRes');
  const n = Object.keys(pairs).length;
  res.classList.remove('ok', 'warn');
  if (n < 3) { res.textContent = n ? `已经连了 ${n} 场，还差 ${3 - n} 场。` : '还没有连线。'; return; }
  const vs = Object.entries(pairs).map(([qi, tian]) => verdict(+qi, +tian));
  const count = (k) => vs.filter((v) => v === k).length;
  const [win, lose, tie] = [count('win'), count('lose'), count('tie')];
  const sure = win >= 2;
  res.classList.add(sure ? 'ok' : 'warn');
  res.innerHTML = `田忌 胜 ${win} 场 · 负 ${lose} 场 · 没把握 ${tie} 场。` + (sure
    ? '<b>三局两胜，稳赢！</b>这就是孙膑的安排。'
    : '<b>没有赢的把握。</b>再换一种出场顺序试试？');
}

function link(qi, tian) {
  const next = Object.fromEntries(Object.entries(pairs).filter(([q, t]) => +q !== qi && t !== tian));
  pairs = { ...next, [qi]: tian };
  drawLines();
  judge();
}

function initDuizhen() {
  const board = document.getElementById('tjBoard');
  let drag = null;
  let picked = null;
  const horseAt = (x, y) => (document.elementFromPoint(x, y) || document.body).closest('.tj-horse');
  const pair = (a, b) => {
    if (!a || !b || a.dataset.side === b.dataset.side) return false;
    const [qi, tian] = a.dataset.side === 'qi' ? [a, b] : [b, a];
    link(+qi.dataset.r, +tian.dataset.r);
    return true;
  };
  board.addEventListener('pointerdown', (e) => {
    const h = e.target.closest('.tj-horse');
    if (!h) return;
    e.preventDefault();
    const box = document.getElementById('tjLines').getBoundingClientRect();
    drag = { from: h, a: anchor(h, box, h.dataset.side), moved: false };
  });
  window.addEventListener('pointermove', (e) => {
    if (!drag) return;
    drag.moved = true;
    drawLines({ a: drag.a, x: e.clientX, y: e.clientY });
  });
  window.addEventListener('pointerup', (e) => {
    if (!drag) return;
    const { from } = drag;
    const target = horseAt(e.clientX, e.clientY);
    drag = null;
    if (target && target !== from && pair(from, target)) { picked = null; }
    else if (target === from) {
      // 点一下：先选中一匹，再点对面一匹
      if (picked && pair(picked, from)) picked = null;
      else picked = from;
    }
    board.querySelectorAll('.tj-horse').forEach((b) => b.classList.toggle('sel', b === picked));
    drawLines();
  });
  document.querySelector('.s-duizhen').addEventListener('click', (e) => {
    const p = e.target.closest('[data-preset]');
    if (!p) return;
    pairs = p.dataset.preset === 'clear' ? {} : { ...PRESETS[p.dataset.preset] };
    drawLines();
    judge();
  });
  new ResizeObserver(() => drawLines()).observe(board);
}

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: CLUE_LABELS, moments: MOMENTS });
    initDuizhen();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.classList.contains('s-duizhen')) setTimeout(() => drawLines(), 750); // 等转场结束再按实际位置画线
  },
};
