'use strict';
/* 女娲补天（四上 15，略读）· 本课数据与互动。情节图、读写练习见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* ================= 任务一 · 灾难和办法配对 ================= */
const FIXES = [
  ['天上露出一个大窟窿', '炼五色石，补好窟窿'],
  ['补好的天可能再塌下来', '斩下大乌龟的四条腿，撑起天空'],
  ['黑龙作恶，野兽残害人类', '杀死黑龙，野兽逃回山林'],
  ['洪水从地缝里喷涌而出', '芦苇烧成灰，堵住地缝'],
];
const FIX_RIGHT = [2, 0, 3, 1];
const ORDER_WORDS = ['先', '又', '接着', '最后'];
function initFix() {
  const L = document.getElementById('fixL');
  const R = document.getElementById('fixR');
  L.innerHTML = FIXES.map(([a], i) => `<button type="button" class="fx" data-i="${i}"><i></i>${a}</button>`).join('');
  R.innerHTML = FIX_RIGHT.map((i) => `<button type="button" class="fx" data-i="${i}"><i></i>${FIXES[i][1]}</button>`).join('');
  let picked = null;
  document.getElementById('fix').addEventListener('click', (e) => {
    const it = e.target.closest('.fx');
    if (!it || it.classList.contains('done')) return;
    if (it.parentElement === L) {
      L.querySelectorAll('.fx').forEach((x) => x.classList.toggle('sel', x === it));
      picked = it;
      return;
    }
    if (!picked) return;
    if (picked.dataset.i === it.dataset.i) {
      const k = +it.dataset.i;
      [picked, it].forEach((x) => { x.classList.remove('sel'); x.classList.add('done', `p${k}`); });
      it.querySelector('i').textContent = ORDER_WORDS[k];
      picked.querySelector('i').textContent = k + 1;
      picked = null;
    } else {
      it.classList.remove('nope');
      void it.offsetWidth; // 重新触发抖动
      it.classList.add('nope');
    }
  });
}

/* ================= 任务一 · 情节图 ================= */
const PLOT = [
  { step: 1, stage: '起因', text: '天地大变动，人们惊慌失措', pic: 'zainan', x: 16, y: 92 },
  { step: 2, stage: '经过', text: '炼石补天、斩龟足撑天、杀黑龙、堵洪水', pic: 'lianshi', x: 50, y: 48 },
  { step: 3, stage: '结果', text: '天地恢复平静，人类获得新生', pic: 'butian', x: 84, y: 62 },
];

/* ================= 任务二 · 五彩石（卡片内容是示例想象） ================= */
const STONES = [
  { c: '#d2402c', name: '赤石', where: '南方的火山口', text: '女娲来到南方的火山口，岩浆咕嘟咕嘟地冒着泡，热浪烤得人睁不开眼。她捧来一捧清凉的神水，“哧”地浇下去，冷却的岩浆里露出一块火红的石头，像一团燃烧的火焰。' },
  { c: '#2f8f8a', name: '青石', where: '东海的海底', text: '女娲潜入东海，海底黑沉沉的，漩涡一个接一个。她拨开飘摇的海草，躲过张着大嘴的鲨鱼，终于在一只巨大的贝壳下面，找到了一块像翡翠一样闪光的青石。' },
  { c: '#e3b62f', name: '黄石', where: '西边的大沙漠', text: '西边的大沙漠里，狂风卷着黄沙扑面而来。女娲眯着眼睛，顶着风沙一步一步往前走，扒开一座沙丘，一块金灿灿的黄石出现在眼前，像一轮小太阳。' },
  { c: '#eeeae0', name: '白石', where: '北方的雪山顶', text: '北方的雪山又高又陡，寒风像刀子一样。女娲踏着厚厚的积雪，攀上冰崖，在雪山顶上找到了一块洁白晶莹的石头，像一块不会融化的冰。' },
  { c: '#2b2a30', name: '黑石', where: '密林深处', text: '密林深处，古树遮天蔽日，藤蔓缠得密不透风。女娲拨开藤蔓，赶走盘在树根上的毒蛇，从老树根下挖出一块乌黑发亮的石头。' },
];
const SLOT_X = [250, 275, 300, 325, 350];
function buildStones() {
  const clouds = STONES.map((s, i) => `<ellipse cx="${200 + i * 50}" cy="${70 + (i % 2) * 18}" rx="56" ry="18" fill="${s.c}" opacity=".85"/>`).join('');
  document.getElementById('stoneSvg').innerHTML = `<defs><clipPath id="snClip"><rect width="600" height="400" rx="14"/></clipPath>
    <linearGradient id="snSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6d7fa6"/><stop offset="1" stop-color="#e8d9c0"/></linearGradient></defs>
    <g clip-path="url(#snClip)">
      <rect width="600" height="400" fill="url(#snSky)"/>
      <g class="sn-clouds">${clouds}</g>
      <path class="sn-hole" d="M220 80 L250 50 L300 60 L350 40 L390 76 L360 110 L300 104 L250 118 Z" fill="#14121c"/>
      <path class="sn-flow" d="M300 300 C 300 220, 300 160, 300 96" stroke="url(#snSky)" stroke-width="16" fill="none" stroke-linecap="round"/>
      <path d="M0 360 H600 V400 H0 Z" fill="#7a6a4a"/>
      <g class="sn-fire"><path d="M250 360 q10 -40 22 -10 q8 -36 28 -4 q12 -40 24 -6 q12 -30 26 20 z" fill="#f08a2c"/></g>
      <path d="M220 290 h160 l-16 60 h-128 z" fill="#5a4a3a"/>
      <ellipse cx="300" cy="290" rx="80" ry="12" fill="#3a2e24"/>
      ${STONES.map((s, i) => `<circle class="sn-st sn-st${i}" cx="${SLOT_X[i]}" cy="284" r="11" fill="${s.c}" stroke="#2b2420" stroke-width="1.5"/>`).join('')}
      <text class="t-l t-c" x="300" y="390" fill="#fff" id="snCount">五彩石：0 / 5</text>
    </g>`;
}
function initStones() {
  const svg = document.getElementById('stoneSvg');
  const card = document.getElementById('stoneCard');
  const got = new Set();
  document.querySelector('.stone-btns').addEventListener('click', (e) => {
    const b = e.target.closest('[data-s]');
    if (!b) return;
    const k = +b.dataset.s;
    const s = STONES[k];
    got.add(k);
    b.classList.add('got');
    svg.querySelector(`.sn-st${k}`).classList.add('in');
    card.innerHTML = `<b style="--c:${s.c}">${s.name} · ${s.where}</b><p>${s.text}</p><small>（示例想象）</small>`;
    document.getElementById('snCount').textContent = `五彩石：${got.size} / 5`;
    svg.classList.toggle('done', got.size === STONES.length);
    if (got.size === STONES.length) document.getElementById('snCount').textContent = '炼成石浆，补好了天！';
  });
}

/* ================= 读与写 ================= */
const MOMENTS = [
  {
    name: '拣一块石头', pic: 'lianshi',
    prompt: '选一种颜色的石头，想象女娲是在哪里、怎样把它拣来的，写一段话。',
    hint: '说清楚：在哪里、遇到什么困难、怎么拣到的；说生动：写动作、写石头的样子、写女娲心里想的。',
    example: '女娲来到北方的雪山脚下。抬头一看，山顶直插云霄，寒风呼呼地刮着。她心想：“为了人类，再难也要上去！”她踩着厚厚的积雪往上爬，脚下一滑，差点掉下山崖，她抓住一块冰岩，又继续向上。终于，在山顶的冰缝里，她看见了一块洁白晶莹的石头，像一块不会融化的冰。',
  },
  {
    name: '讲《女娲补天》', pic: 'butian',
    prompt: '按起因、经过、结果，把女娲补天的故事讲给同学听。',
    hint: '经过部分用上“先……又……接着……最后……”。',
    example: '有一年，天地发生了大变动：天上露出大窟窿，地上裂开深沟，洪水喷涌，野兽残害人类。女娲决心修补天地。她先从各地拣来五色石，炼成石浆补好了天；又斩下大乌龟的四条腿撑起天空；接着杀死了作恶的黑龙；最后用芦灰堵住了喷水的地缝。天地终于恢复了平静，人们世世代代怀念着她。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ plot: PLOT, moments: MOMENTS });
    initFix();
    buildStones();
    initStones();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
