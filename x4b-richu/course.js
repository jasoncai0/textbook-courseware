'use strict';
/* 海上日出 · 本课数据与互动。记叙文模板见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js
 * 本课独有：日出时间滑块（拖动看天色、红霞、太阳按顺序变化，原文跟着走） */

/* 第 2～3 自然段：太阳变化的五个阶段（at = 滑块起点） */
const SUN_STAGES = [
  { at: 0, name: '浅蓝', text: '天空还是一片浅蓝，颜色很浅。', tags: ['颜色：浅蓝'] },
  { at: 15, name: '红霞', text: '转眼间天边出现了一道红霞，慢慢地在扩大它的范围，加强它的亮光。', tags: ['颜色：红霞', '范围：扩大', '亮光：加强'] },
  { at: 40, name: '小半边脸', text: '果然，过了一会儿，在那个地方出现了太阳的小半边脸，红是真红，却没有亮光。', tags: ['形状：小半边脸', '颜色：真红', '亮光：没有'] },
  { at: 65, name: '跳出海面', text: '太阳好像负着重荷似的一步一步，慢慢地努力上升，到了最后，终于冲破了云霞，完全跳出了海面，颜色红得非常可爱。', tags: ['位置：上升', '形状：整个圆', '颜色：红得可爱'] },
  { at: 85, name: '夺目亮光', text: '一刹那间，这个深红的圆东西，忽然发出了夺目的亮光，射得人眼睛发痛，它旁边的云片也突然有了光彩。', tags: ['亮光：夺目', '云片：有了光彩'] },
];
const PLAY_MS = 9000;
const RAY_COUNT = 12;

const clamp01 = (x) => Math.max(0, Math.min(1, x));
const ramp = (v, a, b) => clamp01((v - a) / (b - a));
function mix(c1, c2, t) {
  const p = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const [a, b] = [p(c1), p(c2)];
  return `rgb(${a.map((x, i) => Math.round(x + (b[i] - x) * t)).join(',')})`;
}

function initSun() {
  const $ = (id) => document.getElementById(id);
  const range = $('sunRange');
  $('rays').innerHTML = Array.from({ length: RAY_COUNT }, (_, i) => {
    const a = (i / RAY_COUNT) * Math.PI * 2;
    const [c, s] = [Math.cos(a), Math.sin(a)];
    return `<line x1="${(c * 64).toFixed(1)}" y1="${(s * 64).toFixed(1)}" x2="${(c * 110).toFixed(1)}" y2="${(s * 110).toFixed(1)}"/>`;
  }).join('');
  $('sunSteps').innerHTML = SUN_STAGES.map((s, i) => `<button class="btn" type="button" data-i="${i}">${s.name}</button>`).join('<i>→</i>');

  let shown = -1;
  function draw(v) {
    const bright = ramp(v, 85, 95);
    $('sky').setAttribute('fill', v < 40 ? mix('#bcd4e6', '#f2c4a6', ramp(v, 10, 40)) : mix('#f2c4a6', '#ffe2a8', bright));
    const xia = $('xia');
    xia.setAttribute('opacity', ramp(v, 12, 30).toFixed(2));
    xia.setAttribute('rx', (80 + 300 * ramp(v, 12, 45)).toFixed(0));
    xia.setAttribute('fill', mix('#ef7a5a', '#ffc46a', bright));
    // 太阳：40 起露出小半边脸（圆心在海平线下），65～80 冲破云霞跳出海面
    const cy = v < 55 ? 345 - 45 * ramp(v, 40, 55) : 300 - 75 * ramp(v, 55, 80);
    const sun = $('sun');
    sun.setAttribute('cy', cy.toFixed(1));
    sun.setAttribute('fill', mix('#d42a22', '#ffd65a', bright));
    $('glow').setAttribute('cy', cy.toFixed(1));
    $('glow').setAttribute('opacity', bright.toFixed(2));
    $('rays').setAttribute('transform', `translate(400 ${cy.toFixed(1)})`);
    $('rays').setAttribute('opacity', bright.toFixed(2));
    $('path').setAttribute('opacity', (bright * 0.55).toFixed(2));
    $('seaTop').setAttribute('stop-color', mix('#7f9fb8', '#e7b46a', bright));
    document.querySelector('#clouds .near').style.opacity = (1 - ramp(v, 66, 80)).toFixed(2);
    $('clouds').classList.toggle('lit', bright > 0.5);

    const idx = SUN_STAGES.reduce((k, s, i) => (v >= s.at ? i : k), 0);
    if (idx === shown) return;
    shown = idx;
    const st = SUN_STAGES[idx];
    $('sunText').textContent = st.text;
    $('sunTags').innerHTML = st.tags.map((t) => `<span>${t}</span>`).join('');
    document.querySelectorAll('#sunSteps .btn').forEach((b, i) => b.classList.toggle('solid', i === idx));
  }

  let timer = 0;
  function stop() { cancelAnimationFrame(timer); timer = 0; $('sunPlay').textContent = '▶ 自动看'; }
  function play() {
    const from = +range.value >= 100 ? 0 : +range.value;
    const t0 = performance.now() - (from / 100) * PLAY_MS;
    $('sunPlay').textContent = '❚❚ 暂停';
    const tick = (now) => {
      const v = Math.min(100, ((now - t0) / PLAY_MS) * 100);
      range.value = v;
      draw(v);
      if (v < 100) timer = requestAnimationFrame(tick); else stop();
    };
    timer = requestAnimationFrame(tick);
  }
  range.addEventListener('input', () => { stop(); draw(+range.value); });
  $('sunPlay').addEventListener('click', () => (timer ? stop() : play()));
  $('sunSteps').addEventListener('click', (e) => {
    const b = e.target.closest('[data-i]');
    if (!b) return;
    stop();
    const st = SUN_STAGES[+b.dataset.i];
    const next = SUN_STAGES[+b.dataset.i + 1];
    range.value = next ? Math.round((st.at + next.at) / 2) + 3 : 100;
    draw(+range.value);
  });
  draw(0);
}

/* 有云时的两种情形 */
function initCloud() {
  const view = document.getElementById('cloudView');
  document.getElementById('cloudBtns').addEventListener('click', (e) => {
    const b = e.target.closest('[data-c]');
    if (!b) return;
    view.dataset.c = b.dataset.c;
    document.querySelectorAll('#cloudBtns .btn').forEach((x) => x.classList.toggle('solid', x === b));
  });
  view.dataset.c = '0';
}

/* 课后第 2 题：加点的部分换成平常的说法，比一比 */
const DOT_PLAIN = '太阳好像负着重荷似的一步一步，慢慢地<u>升起来</u>，到了最后，终于<u>穿过了云霞</u>，<u>离开了海面</u>，颜色红得非常可爱。';
function initDots() {
  const sent = document.getElementById('dotSent');
  const btn = document.getElementById('dotToggle');
  const original = sent.innerHTML;
  btn.addEventListener('click', () => {
    const plain = btn.textContent.startsWith('换成');
    sent.innerHTML = plain ? DOT_PLAIN : original;
    sent.classList.toggle('plain', plain);
    btn.textContent = plain ? '还原课文的句子' : '换成平常的说法';
  });
}

/* 小练笔：按变化的顺序写 */
const MOMENTS = [
  {
    name: '月亮升起来', pic: 'hongxia',
    prompt: '你看过月亮从东边升起来吗？按变化的顺序写一写。',
    hint: '先写天色，再写月亮露出一点、慢慢升高、挂上天空；写出颜色和亮光的变化。',
    example: '傍晚，东边的天空还是灰蓝灰蓝的。转眼间，树梢后面透出一点淡黄的光。过了一会儿，月亮露出了弯弯的一角，接着慢慢地往上爬，像一个害羞的小姑娘。一刹那间，圆圆的月亮完全挂上了天空，银光洒满了整个院子。',
  },
  {
    name: '一朵花开了', pic: 'xiaobian',
    prompt: '观察一朵花从花骨朵到盛开的变化，按顺序写下来。',
    hint: '用上“一开始……过了几天……终于……”，写清花瓣的颜色、形状怎样变。',
    example: '一开始，牵牛花只是一个绿色的小尖尖，紧紧地裹着。第二天，尖尖上透出一点紫色。第三天清早，它悄悄地展开了花瓣，像一个紫色的小喇叭，对着太阳吹响了。',
  },
  {
    name: '天边的晚霞', pic: 'heiyun',
    prompt: '傍晚的天空是怎样变化的？试着按顺序写一写。',
    hint: '颜色由浅到深，云的形状也在变：一会儿……一会儿……最后……',
    example: '太阳快落山了，西边的云先是镶上了金边，接着变成了橘红色，一会儿又变成了紫红色。最后，太阳沉了下去，天边只剩下一抹淡淡的灰紫。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    initSun();
    initCloud();
    initDots();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
