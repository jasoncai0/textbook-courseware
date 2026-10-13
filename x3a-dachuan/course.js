'use strict';
/* 搭船的鸟 · 本课逻辑。故事页 / 选一选 / 小练笔用 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* ================= 观察卡：给翠鸟涂色 ================= */
const COLORS = { 翠绿: '#2fa36b', 蓝色: '#2f7fd0', 红色: '#d9412e', 黄色: '#e2b41f' };
const PARTS = [
  { id: 'yu', q: '它的羽毛是', tail: '的', ok: '翠绿' },
  { id: 'chi', q: '翅膀带着一些', tail: '', ok: '蓝色' },
  { id: 'zui', q: '它还有一张', tail: '的长嘴', ok: '红色' },
];

function initPaint() {
  const list = document.getElementById('paintList');
  const bird = document.getElementById('bird');
  list.innerHTML = PARTS.map((p, i) => `<div class="paint-row" data-i="${i}">
    <span class="q">${p.q}<b>？</b>${p.tail}</span>
    ${Object.keys(COLORS).map((c) => `<button type="button" class="swatch" data-c="${c}" style="background:${COLORS[c]}">${c}</button>`).join('')}
  </div>`).join('');
  list.addEventListener('click', (e) => {
    const btn = e.target.closest('.swatch');
    if (!btn) return;
    const row = btn.closest('.paint-row');
    const part = PARTS[+row.dataset.i];
    btn.classList.remove('no');
    if (btn.dataset.c !== part.ok) {
      void btn.offsetWidth; // 重新触发抖动
      btn.classList.add('no');
      return;
    }
    row.classList.add('ok');
    row.querySelectorAll('.swatch').forEach((b) => b.classList.toggle('solid', b === btn));
    row.querySelector('b').textContent = part.ok;
    bird.classList.add(part.id);
  });
}

/* ================= 捕鱼动作：按顺序点动作词，翠鸟跟着动 ================= */
const ORDER = ['冲', '飞', '衔', '站', '吞'];
const SHUFFLED = ['衔', '冲', '吞', '飞', '站'];
const POSE = {
  start: { x: 250, y: 186, r: 0 },
  冲: { x: 445, y: 250, r: 62, gone: true, splash: true, word: '冲！一下子冲进水里，不见了' },
  飞: { x: 540, y: 110, r: -18, fish: true, word: '飞！没一会儿，飞起来了' },
  衔: { x: 540, y: 110, r: -6, fish: true, s: 1.5, word: '衔：红色的长嘴衔着一条小鱼' },
  站: { x: 250, y: 186, r: 0, fish: true, word: '站：站在船头' },
  吞: { x: 250, y: 186, r: 0, word: '吞：一口把小鱼吞了下去' },
};
const REPLAY_GAP_MS = 1500;

function initHunt() {
  const svg = document.getElementById('hunt');
  const bird = document.getElementById('hBird');
  const word = svg.querySelector('.hword');
  const splash = svg.querySelector('.splash');
  const btns = document.getElementById('actBtns');
  const sent = document.querySelectorAll('.act-sent em');
  let done = 0;
  let timers = [];

  const pose = (key) => {
    const p = POSE[key];
    bird.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.r}deg) scale(${p.s || 1})`;
    bird.classList.toggle('fish', Boolean(p.fish));
    bird.classList.toggle('gone', Boolean(p.gone));
    splash.classList.toggle('on', Boolean(p.splash));
    word.textContent = p.word || '';
    sent.forEach((em) => em.classList.toggle('lit', em.dataset.v === key));
  };
  const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };
  const reset = () => {
    clearTimers();
    done = 0;
    btns.querySelectorAll('.verb').forEach((b) => b.classList.remove('done', 'no'));
    pose('start');
  };

  btns.innerHTML = SHUFFLED.map((v) => `<button type="button" class="verb" data-v="${v}">${v}</button>`).join('');
  btns.addEventListener('click', (e) => {
    const btn = e.target.closest('.verb');
    if (!btn || btn.classList.contains('done')) return;
    btn.classList.remove('no');
    if (btn.dataset.v !== ORDER[done]) {
      void btn.offsetWidth;
      btn.classList.add('no');
      return;
    }
    clearTimers();
    done += 1;
    btn.dataset.n = done;
    btn.classList.add('done');
    pose(btn.dataset.v);
  });
  document.getElementById('actReplay').addEventListener('click', () => {
    clearTimers();
    pose('start');
    ORDER.forEach((v, i) => timers.push(setTimeout(() => pose(v), (i + 1) * REPLAY_GAP_MS)));
  });
  document.getElementById('actReset').addEventListener('click', reset);
  reset();
  return clearTimers;
}

/* ================= 选一选 ================= */
const PICKS = {
  see: [
    { t: '雨点打在船篷上', ok: true, why: '用耳朵听：沙啦沙啦' },
    { t: '外祖父家的房子', ok: false, why: '课文没写' },
    { t: '船夫摇橹', ok: true, why: '披着蓑衣，用力地摇' },
    { t: '翠鸟的样子', ok: true, why: '羽毛、翅膀、嘴的颜色' },
    { t: '河里的荷花', ok: false, why: '课文没写' },
    { t: '翠鸟捕鱼', ok: true, why: '冲、飞、衔、站、吞' },
    { t: '母亲穿的衣服', ok: false, why: '课文没写' },
  ],
};

/* ================= 小练笔 ================= */
const MOMENTS = [
  {
    name: '一种小动物', pic: 'buyu',
    prompt: '学翠鸟捕鱼那段，写一种小动物的一连串动作：小猫扑蝴蝶、小鸡啄米、小狗接球……',
    hint: '先想清楚它做了哪几个动作，再按先后顺序写，每个动作用一个准确的词。',
    example: '小猫弓起背，盯着草丛里的蝴蝶。忽然，它往前一扑，两只前爪一按——蝴蝶早飞走了。它坐在地上，舔舔爪子，好像什么都没发生。',
  },
  {
    name: '路上的发现', pic: 'chuan',
    prompt: '你在上学路上、雨后、公园里观察到了什么？用几句话写下来。',
    hint: '课本例子：雨停了，我和妈妈去买菜，在路上看到好几只小蜗牛正慢悠悠地过马路……',
    example: '雨停了，我和妈妈去买菜，在路上看到好几只小蜗牛正慢悠悠地过马路。它们背着灰褐色的壳，伸着两对小触角，身后留下一条亮晶晶的线。',
  },
  {
    name: '一样水果', pic: 'guancha',
    prompt: '拿一样水果，看一看、摸一摸、闻一闻、尝一尝，把观察到的写下来。',
    hint: '课本例子：表姐送给我一个芒果。它的皮是黄色的，摸上去很光滑……',
    example: '表姐送给我一个芒果。它的皮是黄色的，摸上去很光滑。放到鼻子边闻，有一股淡淡的香味。剥开皮尝一下，是一种很特别的香甜的味道。',
  },
];

/* ================= 接入通用引擎（../shared/deck.js） ================= */
let stopHunt = () => {};
window.LESSON = {
  init() {
    Narrative.init({ picks: PICKS, moments: MOMENTS });
    initPaint();
    stopHunt = initHunt();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (!slide.classList.contains('s-act')) stopHunt();
  },
};
