'use strict';
/* 带上她的眼睛 · 本课数据与专属互动：悬念卡（伏笔 / 谜底）、地心深度滑块 */

const CLUES = [
  { q: '“我太怕封闭了。”', a: '她被困在不到 10 立方米的控制舱里，外面裹着 6 000 多公里厚的地层——世界上最封闭的地方。' },
  { q: '“热，热得像……地狱。”', a: '飞船周围是温度高达 5 000 摄氏度的液态铁镍，“仿佛是处于一个巨大的炼钢炉中”。' },
  { q: '“能闻闻它吗？不，别拔下它！”', a: '她再也回不到地面了，每一朵花都是她最后看见的花——她要让它好好活着。' },
  { q: '她对这个世界的情感已丰富到不正常的程度。', a: '这是她最后一次“看”地面世界：一朵野花、一阵微风，都是永别前的珍藏。' },
  { q: '“告诉我你的飞船的大概方位……”她没有回答。', a: '她根本不在太空，而在“我”脚下的地心深处——无法回答，也不忍回答。' },
  { q: '“看不到日出了，好想看草原的日出……”', a: '那个没有日出的细雨蒙蒙的早晨，竟是她最后看到的地面世界：两个月前通信已经中断。' },
  { q: '她面前有一支失重的铅笔飘在空中。', a: '“除了太空，还有一个地方会失重！！”——地心。这是“我”顿悟的钥匙。' },
];

/* 深度 → 圆心距离：地球半径 190 像素 ≈ 6 371 公里 */
const EARTH_R = 190;
const EARTH_KM = 6371;
const CENTER = 200;
const LAYERS = [
  { to: 60, text: '地壳：她出发的地方' },
  { to: 2900, text: '地幔：固态岩石，越往下越热' },
  { to: 6250, text: '地核：液态铁镍，5 000 摄氏度' },
  { to: Infinity, text: '地心：失重！她将在这里度过余生' },
];
// 按讲解步骤，飞船自动沉到的深度
const STEP_DEPTH = [0, 1500, 3200, 4800, 5800, 6300];

function setDepth(km) {
  const y = CENTER - EARTH_R * (1 - km / EARTH_KM);
  document.getElementById('ship').setAttribute('transform', `translate(${CENTER} ${y.toFixed(1)})`);
  document.getElementById('depthNum').textContent = String(km);
  document.getElementById('depthLayer').textContent = km === 0 ? '地面：她最后看到的草原' : LAYERS.find((l) => km < l.to).text;
  document.getElementById('depth').value = km;
}

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: ['读到这里觉得奇怪', '谜底揭开后'] });
    const slider = document.getElementById('depth');
    slider.addEventListener('input', () => setDepth(+slider.value));
    setDepth(0);
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.classList.contains('s-core')) setDepth(STEP_DEPTH[Math.min(step, STEP_DEPTH.length - 1)]);
  },
};
