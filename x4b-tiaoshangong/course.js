'use strict';
/* 挑山工（四下 25 · 略读）· 本课数据与互动。记叙文模板见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js
 * 本课独有：折尺形 vs 直线登山比赛动画——挑山工慢而不停，游人快而常停。 */

/* 比赛参数（示意）：挑山工匀速走折尺形；游人速度快一倍多，但在三处停下 */
const P_SPEED = 68;        // 挑山工：像素 / 秒
const T_SPEED = 160;       // 游人：像素 / 秒
const T_PAUSE = 3.4;       // 游人每处停留秒数
const PACE_PX = 20;        // 示意：20 像素算一步
const T_X = 590;
const T_Y0 = 430;
const T_Y1 = 42;
const STOPS = [
  { y: 340, t: '饱览山色' },
  { y: 240, t: '读石壁题句' },
  { y: 140, t: '溪边洗脸洗脚' },
];
const TURNS = [[330, 300], [90, 170]];

function drawStairs() {
  const lines = [];
  for (let y = 430; y >= 44; y -= 13) {
    lines.push(`<path d="M80 ${y} H340 M460 ${y} H720" />`);
  }
  document.getElementById('stairs').innerHTML = `<rect x="80" y="42" width="260" height="392" fill="#efe9da"/><rect x="460" y="42" width="260" height="392" fill="#efe9da"/>
    <g stroke="#c9bfa8" stroke-width="1.5">${lines.join('')}</g>`;
  document.getElementById('stops').innerHTML = STOPS.map((s) => `<g class="stop"><circle cx="${T_X}" cy="${s.y}" r="7" fill="none" stroke="#2f6fa3" stroke-width="2"/><text x="${T_X + 16}" y="${s.y + 5}">${s.t}</text></g>`).join('');
}

// 游人在时间 t 时的位置（走—停—走—停……）
function touristAt(t) {
  let y = T_Y0;
  let clock = 0;
  for (const s of [...STOPS, { y: T_Y1, end: true }]) {
    const walk = (y - s.y) / T_SPEED;
    if (t < clock + walk) return { y: y - (t - clock) * T_SPEED, paused: false, done: false };
    clock += walk;
    y = s.y;
    if (s.end) return { y, paused: false, done: true, total: clock };
    if (t < clock + T_PAUSE) return { y, paused: s.t, done: false };
    clock += T_PAUSE;
  }
  return { y, done: true };
}

function initRace() {
  drawStairs();
  const $ = (id) => document.getElementById(id);
  const pathP = $('pathP');
  const lenP = pathP.getTotalLength();
  const lenT = T_Y0 - T_Y1;
  let raf = 0;
  let start = 0;
  let doneP = null;
  let doneT = null;
  const place = (el, x, y) => el.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
  const show = (t) => {
    const dP = Math.min(lenP, t * P_SPEED);
    const pt = pathP.getPointAtLength(dP);
    place($('runP'), pt.x, pt.y);
    const turn = TURNS.find(([x, y]) => Math.hypot(pt.x - x, pt.y - y) < 30);
    $('swap').classList.toggle('on', Boolean(turn) && dP < lenP);
    if (turn) $('swap').setAttribute('transform', `translate(${turn[0] > 200 ? turn[0] - 70 : turn[0] + 20} ${turn[1] - 16})`);
    const tu = touristAt(t);
    place($('runT'), T_X, tu.y);
    $('distP').textContent = `${Math.round(dP / PACE_PX)} 步`;
    $('distT').textContent = `${Math.round((T_Y0 - tu.y) / PACE_PX)} 步`;
    if (dP >= lenP && doneP === null) doneP = t;
    if (tu.done && doneT === null) doneT = t;
    $('timeP').textContent = `${(doneP ?? t).toFixed(1)} 秒`;
    $('timeT').textContent = `${(doneT ?? t).toFixed(1)} 秒`;
    $('raceMsg').textContent = tu.paused ? `游人停下来${tu.paused}……挑山工一步不停。` : (doneP !== null && doneT === null ? '挑山工已经到山顶了！游人还在路上。' : '');
    return doneP !== null && doneT !== null;
  };
  const tick = (now) => {
    const t = (now - start) / 1000;
    if (show(t)) {
      $('raceMsg').textContent = `挑山工的路程是游人的 ${(lenP / lenT).toFixed(1)} 倍，却先到了山顶！`;
      $('raceGo').textContent = '再来一次';
      return;
    }
    raf = requestAnimationFrame(tick);
  };
  $('raceGo').addEventListener('click', () => {
    cancelAnimationFrame(raf);
    doneP = null; doneT = null;
    start = performance.now();
    $('raceGo').textContent = '登山中……';
    raf = requestAnimationFrame(tick);
  });
  show(0);
}

/* 阅读提示 2：几句朴素的话 */
const CLUE_LABELS = ['挑山工的话', '联系上下文想一想'];
const CLUES = [
  { q: '“你们肩膀上没有挑子，是走得快，可是一路上东看西看，玩玩闹闹，总得停下来嘛！”', a: '游人轻松、走得快，却常常停下来——三心二意、走走停停，反而落在后面。' },
  { q: '“我们跟你们不一样，不像你们那么随便，高兴怎么就怎么。”', a: '挑山工肩上有重担，心里有目标：天天挑货上山，近二十年，一年四季，一天一个来回。' },
  { q: '“一步踩不实不行，更不能耽误工夫。我们得一个劲往前走。”', a: '脚踏实地，一步一个脚印；珍惜时间，一刻也不停。' },
  { q: '“别看我们慢，走长了就跑到你们前边去了。”', a: '慢不要紧，只要坚持不懈，日积月累，就能走在别人前面。' },
];

/* 读与写 */
const MOMENTS = [
  {
    name: '我需要这幅画', pic: 'hua',
    prompt: '作者说：“这幅画一直挂在我的书桌前，因为我需要它。”作者为什么需要它？',
    hint: '想一想画上的挑山工在做什么，作者每天看到它会想到什么。',
    example: '画上的挑山工被重物压弯了腰，却一步一步地向上攀登。作者每天看到它，就会想起挑山工的话：一步踩不实不行，更不能耽误工夫。当他遇到困难想偷懒时，这幅画会提醒他：像挑山工那样，坚持一个劲往前走。',
  },
  {
    name: '说说怎样登山', pic: 'tiaoshan',
    prompt: '阅读提示 1：用几句话说说挑山工是怎样登山的。',
    hint: '用上课文里的动作：搭、甩、斜行、转过身子、换肩；再说说为什么这样走。',
    example: '挑山工肩上搭一根扁担，一条胳膊搭在扁担上，另一条胳膊一甩一甩地保持平衡。他们走折尺形的路线：从台阶左侧斜行向上，到了右侧就转身反方向斜行，每转一次身，扁担换一次肩。这样东西不碰台阶，还能省些力气。',
  },
  {
    name: '我身边的“挑山工”', pic: 'wusong',
    prompt: '你身边有没有像挑山工一样的人？或者，你自己在什么事上也要做“挑山工”？',
    hint: '可以写坚持练琴、跑步、每天读书……写清楚他（你）是怎样“一个劲往前走”的。',
    example: '我的同桌小林学习不算快，可她每天都把错题抄在本子上，一道一道弄明白，从来不偷懒。一个学期下来，她的数学成绩跑到了很多同学前面。她就是我身边的“挑山工”。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: CLUE_LABELS, moments: MOMENTS });
    initRace();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
