'use strict';
/* 枣核 · 本课数据与本课互动。通用逻辑见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* ================= 读故事 · 右上角小地图：字幕行 data-place 标地点，圆点跟着走 ================= */
const MINI_PLACES = { home: [36, 66, '家'], field: [86, 26, '山坡'], yamen: [166, 46, '县衙门'] };

function buildMiniMap() {
  const box = document.createElement('div');
  box.className = 'minimap';
  box.innerHTML = `<svg viewBox="0 0 200 92">
    <path d="M36 66 Q60 30 86 26 Q130 20 166 46 Q100 90 36 66" class="mm-road"/>
    <path d="M0 40 L22 12 L40 34 L58 8 L78 36 Z" class="mm-hill"/>
    ${Object.values(MINI_PLACES).map(([x, y, t]) => `<circle cx="${x}" cy="${y}" r="5" class="mm-pt"/><text x="${x}" y="${y + 17}" class="mm-t">${t}</text>`).join('')}
    <circle id="mmDot" r="7" cx="36" cy="66" class="mm-dot"/></svg>`;
  document.getElementById('frame').appendChild(box);
}

function updateMiniMap(slide, step) {
  const box = document.querySelector('.minimap');
  const on = slide.hasAttribute('data-map');
  box.classList.toggle('show', on);
  if (!on) return;
  let place = 'home';
  slide.querySelectorAll('[data-place]').forEach((p) => { if (+p.dataset.step <= step) place = p.dataset.place; });
  const [x, y] = MINI_PLACES[place];
  const dot = document.getElementById('mmDot');
  dot.setAttribute('cx', x);
  dot.setAttribute('cy', y);
}

/* ================= 品读 · 故事地图：五站路线，每站一件事 + 用上的本领 ================= */
const SKILLS = ['勤快', '会蹦', '人小', '聪明', '勇敢'];
const STOPS = [
  { x: 95, y: 215, name: '村里的家', stage: '起因', pic: 'benling',
    t: '夫妻俩盼孩子，生了个枣核那么大的孩子，起名“枣核”。枣核说：“别看我人小，一样能做事情。”', skills: ['人小'] },
  { x: 215, y: 95, name: '山坡田地', stage: '起因', pic: 'benling',
    t: '枣核天天干活，能扶犁，能赶驴，柴比别人打得多，一蹦就能蹦到屋脊那么高。', skills: ['勤快', '会蹦'] },
  { x: 470, y: 95, name: '县衙门院子', stage: '经过', pic: 'lvduo',
    t: '大旱年，衙役牵走了牛、驴。枣核一蹦蹦进院子，藏在驴耳朵里“哦喝！哦喝！”地吆喝，折腾得衙役们不管了，把牲口赶回了村子。', skills: ['会蹦', '聪明'] },
  { x: 165, y: 255, name: '村里', stage: '经过', pic: '',
    t: '天一亮，县官带衙役来捉人。枣核蹦出来说：“牲口是我牵的！”铁链一绑，他噗的一声从链缝里蹦了出来。', skills: ['勇敢', '人小'] },
  { x: 515, y: 220, name: '县衙大堂', stage: '结果', pic: 'huzi',
    t: '衙役们打这面，枣核蹦到那面。他蹦到县官胡子上荡秋千，一棍子打着了县官的下巴，枣核大摇大摆地走了。', skills: ['会蹦', '聪明'] },
];
const ROUTE = 'M95 215 Q140 120 215 95 Q350 40 470 95 Q330 290 165 255 Q350 320 515 220';

function initTrek() {
  const svg = document.getElementById('trekMap');
  const card = document.getElementById('trekCard');
  const badges = document.getElementById('trekBadges');
  const got = new Set();
  svg.innerHTML = `<rect width="600" height="320" rx="14" class="tk-land"/>
    <path d="M0 70 L50 18 L90 60 L140 6 L190 64 L0 64 Z" class="tk-hill"/>
    <path d="M330 300 Q380 250 360 200 Q340 160 380 120" class="tk-river"/>
    <g class="tk-house"><rect x="70" y="190" width="50" height="34"/><polygon points="62,192 95,166 128,192"/></g>
    <g class="tk-yamen"><rect x="430" y="60" width="130" height="40"/><polygon points="420,62 495,30 570,62"/><rect x="485" y="200" width="70" height="38"/><polygon points="478,202 520,178 562,202"/></g>
    <path d="${ROUTE}" class="tk-road"/>
    <path d="${ROUTE}" class="tk-walk" id="trekWalk"/>
    ${STOPS.map((s, i) => `<g class="tk-stop" data-i="${i}" tabindex="0" role="button"><circle cx="${s.x}" cy="${s.y}" r="20"/><text x="${s.x}" y="${s.y + 7}" class="tk-n">${i + 1}</text><text x="${s.x}" y="${s.y + 42}" class="tk-name">${s.name}</text></g>`).join('')}`;
  const walk = svg.querySelector('#trekWalk');
  const len = walk.getTotalLength();
  walk.style.strokeDasharray = len;
  walk.style.strokeDashoffset = len;
  const renderBadges = () => {
    badges.innerHTML = `<b>本领收集 ${got.size}/${SKILLS.length}</b>${SKILLS.map((k) => `<span class="bdg${got.has(k) ? ' got' : ''}">${k}</span>`).join('')}`;
  };
  svg.addEventListener('click', (e) => {
    const g = e.target.closest('.tk-stop');
    if (!g) return;
    const i = +g.dataset.i;
    const s = STOPS[i];
    svg.querySelectorAll('.tk-stop').forEach((el, k) => {
      el.classList.toggle('cur', k === i);
      if (k === i) el.classList.add('seen');
    });
    walk.style.strokeDashoffset = len * (1 - [0, .2, .45, .72, 1][i]);
    s.skills.forEach((k) => got.add(k));
    card.innerHTML = `${s.pic ? `<div class="tc-pic" style="background-image:url('assets/${s.pic}.jpg')"></div>` : ''}
      <p class="tc-hd"><b>${i + 1}</b>${s.name}<small>${s.stage}</small></p>
      <p class="tc-t">${s.t}</p>
      <p class="tc-sk">用上的本领：${s.skills.map((k) => `<span class="bdg got">${k}</span>`).join('')}</p>
      ${got.size === SKILLS.length && !svg.querySelector('.tk-stop:not(.seen)') ? '<p class="tip gold"><b>本领收齐了！</b>枣核人小本领大——勤快、聪明、勇敢，还会把“小”变成本领。</p>' : ''}`;
    renderBadges();
  });
  renderBadges();
}

/* 续编故事 */
const MOMENTS = [
  {
    name: '县官又来了', pic: 'huzi',
    prompt: '县官的牙被打掉了，他咽不下这口气，又派衙役到村里来抓枣核……',
    hint: '枣核会怎样对付他们？想想他“小”“会蹦”“聪明”的本领。',
    example: '衙役们挨家挨户地搜，连米缸都翻遍了，也没找到枣核。原来枣核早就蹦到了领头衙役的帽子里，一会儿揪揪他的头发，一会儿在他耳边喊“哦喝”，吓得衙役们扔下刀枪就跑……',
  },
  {
    name: '帮助乡亲', pic: 'benling',
    prompt: '这一年又遇上了大旱，地里没有水，庄稼都快干死了……',
    hint: '枣核会想出什么好办法？他会去哪里、怎么做？',
    example: '枣核一蹦蹦上了山顶，发现山那边有一眼清泉。他一边蹦一边喊，带着大伙儿开出一条小水沟，清凉的泉水哗哗地流进了田里……',
  },
  {
    name: '我来编', pic: 'lvduo',
    prompt: '枣核大摇大摆地走了。后来，他还会遇到什么事？自己编一编。',
    hint: '先想好：遇到了什么难事 → 枣核怎样用本领解决 → 结果怎样。',
    example: '有一天，枣核在路上遇到一个迷路的小孩，他一蹦蹦到大树顶上，看清了回村的路……',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    buildMiniMap();
    initTrek();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateMiniMap(slide, step);
  },
};
