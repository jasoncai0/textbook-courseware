'use strict';
/* 朱德的扁担 · 本课数据与互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：挑粮路线图（小人在山路上来回走）、扁担上一笔笔“写”出五个字（页面文字，不让 AI 画字）、
 *           白天/晚上对照、“选一选连一连”连线、“我是小战士”换身份讲故事、挑粮上山识字游戏
 * 安全：画面只用远景小人影、空镜和物件；不画人物正脸 */

Hanzi.init({
  cards: [
    { z: '朱', py: 'zhū', bs: '木', bh: 6, words: [['朱德', 'zhū dé']] },
    { z: '德', py: 'dé', bs: '彳', bh: 15, words: [['朱德', 'zhū dé'], ['品德', 'pǐn dé']] },
    { z: '扁', py: 'biǎn', bs: '户', bh: 9, words: [['扁担', 'biǎn dan'], ['扁扁的', 'biǎn biǎn de']] },
    { z: '担', py: 'dàn', bs: '扌', bh: 8, words: [['扁担', 'biǎn dan'], ['担子', 'dàn zi']] },
    { z: '志', py: 'zhì', bs: '心', bh: 7, words: [['同志', 'tóng zhì'], ['志气', 'zhì qì']] },
    { z: '伍', py: 'wǔ', bs: '亻', bh: 6, words: [['队伍', 'duì wu'], ['入伍', 'rù wǔ']] },
    { z: '泽', py: 'zé', bs: '氵', bh: 8, words: [['毛泽东', 'máo zé dōng'], ['光泽', 'guāng zé']] },
    { z: '敌', py: 'dí', bs: '攵', bh: 10, words: [['敌人', 'dí rén']] },
    { z: '陡', py: 'dǒu', bs: '阝', bh: 9, words: [['山高路陡', 'shān gāo lù dǒu'], ['陡坡', 'dǒu pō']] },
    { z: '整', py: 'zhěng', bs: '攵', bh: 16, words: [['整夜', 'zhěng yè'], ['整齐', 'zhěng qí']] },
    { z: '仗', py: 'zhàng', bs: '亻', bh: 5, words: [['打仗', 'dǎ zhàng']] },
    { z: '疼', py: 'téng', bs: '疒', bh: 10, words: [['心疼', 'xīn téng'], ['头疼', 'tóu téng']] },
    { z: '料', py: 'liào', bs: '斗', bh: 10, words: [['不料', 'bú liào'], ['材料', 'cái liào']] },
    { z: '敬', py: 'jìng', bs: '攵', bh: 12, words: [['敬爱', 'jìng ài'], ['尊敬', 'zūn jìng']] },
  ],
  write: [
    { z: '扁', py: 'biǎn', bs: '户', bh: 9 },
    { z: '担', py: 'dàn', bs: '扌', bh: 8 },
    { z: '志', py: 'zhì', bs: '心', bh: 7 },
    { z: '伍', py: 'wǔ', bs: '亻', bh: 6 },
    { z: '师', py: 'shī', bs: '巾', bh: 6 },
    { z: '军', py: 'jūn', bs: '冖', bh: 6 },
    { z: '战', py: 'zhàn', bs: '戈', bh: 9 },
    { z: '士', py: 'shì', bs: '士', bh: 3 },
  ],
});

const STORY = {
  picks: {
    why: [
      { t: '他是带领队伍的人，也跟战士们一块儿去挑粮', ok: true, why: '对！他和大家一样吃苦' },
      { t: '白天挑粮爬山，晚上还整夜研究打仗', ok: true, why: '对！他太辛苦了' },
      { t: '扁担被藏了，他又找来一根，写上名字接着挑', ok: true, why: '对！他一定要和大家一起挑粮' },
      { t: '他的扁担比别人的好看', ok: false, why: '大家敬爱的是他这个人' },
    ],
  },
};

/* ---------- 挑粮路线图（封面、路线页共用）：山上 ↔ 山下，SVG 坐标 600 × 400 ---------- */
const ROUTE = 'M468 96C430 140 520 160 470 200S380 230 404 268S270 282 246 318S150 334 112 338';
const MAP_SVG = `<svg viewBox="0 0 600 400" aria-label="挑粮的路：从井冈山到山下的茅坪">
  <rect width="600" height="400" rx="18" fill="#f3ead6"/>
  <path d="M330 150L420 40L480 90L540 30L600 120V160H330Z" fill="#8fa77e"/>
  <path d="M360 150L420 70L470 120L540 60L600 140V170H360Z" fill="#6f8b62"/>
  <path d="M0 360Q160 300 330 330T600 300V400H0Z" fill="#cbd9a8"/>
  <path class="bd-road" d="${ROUTE}"/>
  <path class="bd-road-on" pathLength="1" d="${ROUTE}"/>
  <g transform="translate(70 318)"><path d="M0 22L18 6L36 22V40H0Z" fill="#c9a26b" stroke="#7a5a33" stroke-width="2"/><path d="M40 26L54 14L68 26V40H40Z" fill="#c9a26b" stroke="#7a5a33" stroke-width="2"/></g>
  <text x="500" y="128" class="bd-lab t-c">jǐng gāng shān</text><text x="500" y="152" class="bd-big t-c">井冈山</text>
  <text x="96" y="282" class="bd-lab t-c">máo píng</text><text x="96" y="306" class="bd-big t-c">茅坪</text>
  <text x="250" y="228" class="bd-lab t-c">lái huí wǔ liù shí lǐ</text><text x="250" y="252" class="bd-mid t-c">来回五六十里</text>
  <g class="bd-walker" visibility="hidden">
    <line x1="-18" y1="-14" x2="18" y2="-14" stroke="#7a5230" stroke-width="3"/>
    <path d="M-22 -14V-4H-12V-14M12 -14V-4H22V-14" fill="#e3c27a" stroke="#7a5230" stroke-width="2"/>
    <circle cx="0" cy="-26" r="6" fill="#5a4a3a"/><path d="M-6 -20H6L4 0H-4Z" fill="#5a4a3a"/>
    <animateMotion class="bd-anim" dur="9s" begin="indefinite" repeatCount="indefinite" keyPoints="0;1;0" keyTimes="0;.5;1" calcMode="linear" path="${ROUTE}"/>
  </g>
</svg>`;
document.querySelectorAll('[data-map]').forEach((el) => { el.innerHTML = MAP_SVG; });

function updateRoute(slide, step) {
  const map = slide.querySelector('[data-walk]');
  if (!map) return;
  const walking = step >= 3;
  map.classList.toggle('walk', walking);
  const walker = map.querySelector('.bd-walker');
  const anim = map.querySelector('.bd-anim');
  walker.setAttribute('visibility', walking ? 'visible' : 'hidden');
  if (walking && !map.dataset.started) { anim.beginElement(); map.dataset.started = '1'; }
  if (!walking) delete map.dataset.started;
}

/* ---------- 选一选，连一连 ---------- */
const LINK_L = ['挑着', '穿着', '戴着'];
const LINK_LPY = ['tiāo zhe', 'chuān zhe', 'dài zhe'];
const LINK_R = [['草鞋', 'cǎo xié'], ['斗笠', 'dǒu lì'], ['粮食', 'liáng shi']];
const LINK_ANS = { 0: 2, 1: 0, 2: 1 };
function initLink() {
  const box = document.getElementById('bdLink');
  box.innerHTML = `<svg class="bd-wires"></svg>
    <div class="bd-col">${LINK_L.map((t, i) => `<button type="button" class="bd-node py" data-l="${i}">${Hanzi.ruby(t, LINK_LPY[i])}</button>`).join('')}</div>
    <div class="bd-col">${LINK_R.map(([t, p], i) => `<button type="button" class="bd-node py" data-r="${i}">${Hanzi.ruby(t, p)}</button>`).join('')}</div>
    <button type="button" class="btn bd-linkreset">重新连</button>`;
  const wires = box.querySelector('.bd-wires');
  let sel = null;
  const center = (el, side) => {
    const a = box.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return [side === 'r' ? r.right - a.left : r.left - a.left, r.top + r.height / 2 - a.top];
  };
  box.addEventListener('click', (e) => {
    if (e.target.closest('.bd-linkreset')) {
      wires.innerHTML = ''; sel = null;
      box.querySelectorAll('.bd-node').forEach((n) => n.classList.remove('sel', 'done', 'wrong'));
      return;
    }
    const n = e.target.closest('.bd-node:not(.done)');
    if (!n) return;
    if (n.dataset.l !== undefined) {
      box.querySelectorAll('[data-l]').forEach((x) => x.classList.remove('sel'));
      n.classList.add('sel'); sel = n; return;
    }
    if (!sel) { n.classList.remove('wrong'); void n.offsetWidth; n.classList.add('wrong'); return; }
    if (LINK_ANS[sel.dataset.l] !== +n.dataset.r) { n.classList.remove('wrong'); void n.offsetWidth; n.classList.add('wrong'); return; }
    const [x1, y1] = center(sel, 'r');
    const [x2, y2] = center(n, 'l');
    wires.insertAdjacentHTML('beforeend', `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`);
    sel.classList.remove('sel'); sel.classList.add('done'); n.classList.add('done'); sel = null;
  });
}

/* ---------- 识字游戏：挑粮上山 ---------- */
const SACKS = [['朱', 'zhū'], ['德', 'dé'], ['扁', 'biǎn'], ['担', 'dàn'], ['志', 'zhì'], ['伍', 'wǔ'], ['泽', 'zé'], ['敌', 'dí'], ['陡', 'dǒu'], ['整', 'zhěng'], ['仗', 'zhàng'], ['疼', 'téng'], ['料', 'liào'], ['敬', 'jìng']];
function initCarry() {
  const box = document.getElementById('bdCarry');
  box.innerHTML = `<div class="bd-sacks">${SACKS.map(([z, p], i) => `<button type="button" class="bd-sack" data-i="${i}">${Hanzi.ruby(z, p)}</button>`).join('')}</div>
    <div class="bd-hill">${MAP_SVG}<p id="bdCarryMsg"></p><button type="button" class="btn" id="bdCarryReset">回到山下，再挑一次</button></div>`;
  const svg = box.querySelector('.bd-hill svg');
  const road = svg.querySelector('.bd-road');
  const walker = svg.querySelector('.bd-walker');
  walker.querySelector('animateMotion').remove();
  walker.setAttribute('visibility', 'visible');
  const total = road.getTotalLength();
  const msg = box.querySelector('#bdCarryMsg');
  const update = () => {
    const n = box.querySelectorAll('.bd-sack.used').length;
    const pt = road.getPointAtLength(total * (1 - n / SACKS.length)); // 路线从山上画到山下，挑粮是往上走
    walker.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
    box.classList.toggle('done', n === SACKS.length);
    msg.textContent = n === SACKS.length ? '粮食挑上山啦！' : `挑了 ${n} 袋粮食`;
  };
  box.addEventListener('click', (e) => {
    if (e.target.closest('#bdCarryReset')) { box.querySelectorAll('.bd-sack').forEach((s) => s.classList.remove('used')); update(); return; }
    const s = e.target.closest('.bd-sack:not(.used)');
    if (!s) return;
    s.classList.add('used');
    update();
  });
  update();
}

window.LESSON = {
  init() {
    Narrative.init(STORY);
    initLink();
    initCarry();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateRoute(slide, step);
  },
};
