'use strict';
/* 燕子 · 本课数据与互动。记叙文模板见 ../shared/narrative.js，背诵挖空见 ../shared/poem.js */

/* 背诵第 1～3 自然段（一句一行） */
Poem.render({
  beisong: {
    title: '燕子（第 1～3 自然段）', author: '郑振铎',
    lines: [
      { t: '一身乌黑的羽毛，一对轻快有力的翅膀，加上剪刀似的尾巴，凑成了那样可爱的活泼的小燕子。' },
      { t: '二三月的春日里，轻风微微地吹拂着，如毛的细雨由天上洒落着，' },
      { t: '千条万条的柔柳，红的白的黄的花，青的草，绿的叶，都像赶集似的聚拢来，形成了烂漫无比的春天。' },
      { t: '这时候，那些小燕子，那么伶俐可爱的小燕子，也由南方飞来，加入这光彩夺目的图画中，为春光平添了许多生趣。' },
      { t: '小燕子带了它的剪刀似的尾巴，在阳光满地时，斜飞于旷亮无比的天空，叽的一声，已由这里的稻田上，飞到那边的高柳下了。' },
    ],
  },
});

/* 品 · 换词（语文园地“词句段运用”） */
const PICKS = {
  dangyang: [
    { t: '水面的小圆晕一圈圈地（荡漾）开去', ok: true, why: '对！水面上的波纹' },
    { t: '水面的小圆晕一圈圈地（飘荡）开去', ok: false, why: '飘荡多指在空中随风飘' },
  ],
};

/* 读与写 · 想象写话 */
const HINT = '想一想：小燕子在哪里？怎么飞（停）？周围有什么？用上课文里的好词。';
const MOMENTS = [
  {
    name: '斜飞', pic: 'xiefei', hint: HINT,
    prompt: '小燕子斜飞过稻田，“叽”的一声飞到了高柳下。它要去做什么？',
    example: '小燕子剪刀似的尾巴一摆，斜着身子从稻田上掠过，“叽”的一声，已经飞到了高高的柳树下。它在柳枝间钻来钻去，好像在和柳姑娘捉迷藏。',
  },
  {
    name: '横掠', pic: 'hengluo', hint: HINT,
    prompt: '小燕子贴着湖面飞，翼尖沾了一下水面。湖面上会出现什么？',
    example: '湖面波光粼粼。小燕子贴着水面飞过，翼尖轻轻一点，水面上就荡开一个小圆圈，一圈，两圈，三圈……小鱼吓了一跳，赶紧躲到水草里去了。',
  },
  {
    name: '休憩', pic: 'dianxian', hint: HINT,
    prompt: '几只飞倦了的燕子停在电线上。它们在说什么悄悄话？',
    example: '几只小燕子飞累了，排成一排停在细细的电线上，你挨着我，我挨着你。一只说：“今天的春风真舒服！”另一只说：“明天我们去湖边玩吧！”远远看去，它们就像五线谱上的音符。',
  },
];

/* 第 1 自然段 · 燕子拼图：先点词语卡，再点燕子身上的“？” */
const PARTS = [
  { id: 'tail', text: '剪刀似的尾巴' },
  { id: 'body', text: '一身乌黑的羽毛' },
  { id: 'wing', text: '一对轻快有力的翅膀' },
];
function initPuzzle() {
  const words = document.getElementById('yzWords');
  const svg = document.getElementById('yzSwallow');
  const slide = svg.closest('.slide');
  let picked = null;
  const reset = () => {
    picked = null;
    slide.classList.remove('yz-all');
    svg.querySelectorAll('.placed').forEach((el) => el.classList.remove('placed'));
    words.innerHTML = PARTS.map((p) => `<button class="yz-word" type="button" data-part="${p.id}">${p.text}</button>`).join('');
  };
  words.addEventListener('click', (e) => {
    const btn = e.target.closest('.yz-word');
    if (!btn || btn.classList.contains('used')) return;
    picked = btn.dataset.part;
    words.querySelectorAll('.yz-word').forEach((b) => b.classList.toggle('sel', b === btn));
  });
  svg.addEventListener('click', (e) => {
    const q = e.target.closest('.yz-q, .yz-part');
    if (!q || !picked) return;
    if (q.dataset.part !== picked) {
      q.classList.remove('nope'); void q.getBoundingClientRect(); q.classList.add('nope');
      return;
    }
    svg.querySelectorAll(`[data-part="${picked}"]`).forEach((el) => el.classList.add('placed'));
    const btn = words.querySelector(`[data-part="${picked}"]`);
    btn.classList.remove('sel'); btn.classList.add('used');
    picked = null;
    if (svg.querySelectorAll('.yz-part.placed').length === PARTS.length) slide.classList.add('yz-all');
  });
  document.getElementById('yzReset').addEventListener('click', reset);
  reset();
}

/* 第 5 自然段 · 点电线停燕子 */
const WIRES = [90, 130, 170, 210, 250];
const POLE_L = 66;
const POLE_R = 734;
const SAG = 18;
const MAX_BIRDS = 24;
const wireY = (y0, x) => y0 + SAG * (1 - ((x - 400) / ((POLE_R - POLE_L) / 2)) ** 2);
function perch(g, x, y0) {
  g.insertAdjacentHTML('beforeend', `<use href="#yzPerch" class="yz-p" x="${(x - 14).toFixed(0)}" y="${(wireY(y0, x) - 40).toFixed(0)}" width="28" height="42"/>`);
}
function initWires() {
  const svg = document.getElementById('yzWires');
  const g = svg.querySelector('#yzPerched');
  svg.querySelector('#yzLines').innerHTML = WIRES.map((y) => `<path d="M${POLE_L} ${y} Q 400 ${y + SAG * 2} ${POLE_R} ${y}"/>`).join('');
  const seed = () => { g.innerHTML = ''; [[200, 90], [260, 130], [520, 170]].forEach(([x, y]) => perch(g, x, y)); };
  svg.addEventListener('click', (e) => {
    if (g.children.length >= MAX_BIRDS) return;
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(svg.getScreenCTM().inverse());
    const x = Math.max(POLE_L + 14, Math.min(POLE_R - 14, pt.x));
    const y0 = WIRES.reduce((best, y) => (Math.abs(wireY(y, x) - pt.y) < Math.abs(wireY(best, x) - pt.y) ? y : best));
    perch(g, x, y0);
  });
  document.getElementById('yzClear').addEventListener('click', () => { g.innerHTML = ''; });
  seed();
}

/* 课后第 2 题 · 连一连 */
const PAIRS = [['剪刀似的', '尾巴'], ['伶俐可爱的', '小燕子'], ['光彩夺目的', '图画'], ['旷亮无比的', '天空']];
const RIGHT_ORDER = [2, 0, 3, 1];
function initMatch() {
  const box = document.getElementById('yzMatch');
  box.innerHTML = `<div class="yz-col">${PAIRS.map(([a], i) => `<button class="yz-m" type="button" data-side="l" data-i="${i}">${a}</button>`).join('')}</div>
    <div class="yz-col">${RIGHT_ORDER.map((i) => `<button class="yz-m" type="button" data-side="r" data-i="${i}">${PAIRS[i][1]}</button>`).join('')}</div>`;
  let left = null;
  box.addEventListener('click', (e) => {
    const b = e.target.closest('.yz-m');
    if (!b || b.classList.contains('done')) return;
    if (b.dataset.side === 'l') {
      left = b;
      box.querySelectorAll('[data-side="l"]').forEach((x) => x.classList.toggle('sel', x === b));
      return;
    }
    if (!left) return;
    if (left.dataset.i === b.dataset.i) {
      left.textContent = PAIRS[+b.dataset.i].join('');
      left.classList.remove('sel'); left.classList.add('done');
      b.classList.add('done');
      left = null;
    } else {
      b.classList.remove('nope'); void b.offsetWidth; b.classList.add('nope');
    }
  });
}

/* 边读边想象：读到哪一句，画面哪里亮起来（.spot-layer 跟着字幕的镜头焦点走） */
const SPOT_ALL = '50% 50% 100%';
const SPOT_R = '24%';
const SPOT_MIN_ZOOM = 1.1;
function updateSpot(slide, step) {
  const layer = slide.querySelector('.spot-layer');
  if (!layer) return;
  let hit = null;
  slide.querySelectorAll('[data-focus][data-step]').forEach((el) => { if (+el.dataset.step <= step) hit = el; });
  const [s, fx, fy] = hit ? hit.dataset.focus.split(' ') : [];
  const [x, y, r] = +s >= SPOT_MIN_ZOOM ? [fx, fy, SPOT_R] : SPOT_ALL.split(' '); // 拉远的全景镜头不压暗
  layer.style.setProperty('--sx', x);
  layer.style.setProperty('--sy', y);
  layer.style.setProperty('--sr', r);
}

window.LESSON = {
  init() {
    Narrative.init({ picks: PICKS, moments: MOMENTS });
    Poem.init();
    initPuzzle();
    initWires();
    initMatch();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateSpot(slide, step);
  },
};
