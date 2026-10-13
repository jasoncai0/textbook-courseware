'use strict';
/* 太阳 · 本课逻辑：太阳里的“地球点阵”、说明方法分类、删词比较、关掉太阳。页面逻辑见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 大：太阳圆里排约 1300 个点，每点代表 1000 个地球（130 万 ÷ 1000） */
const SUN = { cx: 300, cy: 210, r: 182 };
const DOTS = 1300;
const DOT_GAP = 8.6;
function fillEarthDots() {
  const pts = [];
  for (let y = SUN.cy - SUN.r; y <= SUN.cy + SUN.r; y += DOT_GAP) {
    for (let x = SUN.cx - SUN.r; x <= SUN.cx + SUN.r; x += DOT_GAP) {
      if ((x - SUN.cx) ** 2 + (y - SUN.cy) ** 2 <= SUN.r ** 2) pts.push([x, y]);
    }
  }
  // 由中心往外排，正好取 1300 个
  pts.sort((a, b) => Math.hypot(a[0] - SUN.cx, a[1] - SUN.cy) - Math.hypot(b[0] - SUN.cx, b[1] - SUN.cy));
  document.getElementById('earthDots').innerHTML = pts.slice(0, DOTS)
    .map(([x, y], i) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.6" fill="#4f8fd6" style="animation-delay:${(i / DOTS * 1.6).toFixed(2)}s"/>`).join('');
}

/* 课后第 2 题：说明方法 */
const KINDS = ['列数字', '作比较', '举例子', '打比方'];
const SORT_ITEMS = [
  { s: '太阳离我们约有一亿五千万千米远。', ok: ['列数字'], q: '用数字说明远，准确' },
  { s: '约一百三十万个地球的体积才能抵得上一个太阳。', ok: ['列数字', '作比较'], q: '拿地球来比，说明大' },
  { s: '如果步行，日夜不停地走，差不多要走三千五百年；就是坐飞机，也要飞二十几年。', ok: ['列数字', '作比较'], q: '换算成时间来比，远变得可感' },
  { s: '太阳会发光，会发热，是个大火球。', ok: ['打比方'], q: '把太阳比作大火球，形象' },
  { s: '表面温度有五千多摄氏度，', ok: ['列数字'], q: '用数字说明热' },
  { s: '就是钢铁碰到它，也会变成气体。', ok: ['举例子', '作比较'], q: '拿钢铁作例子，热得好懂' },
];

/* 说明的语言：删词比较 */
const CLUE_LABELS = ['去掉一个词', '原文 · 为什么要用'];
const CLUES = [
  { q: '太阳离我们有一亿五千万千米远。', a: '原文：“约有一亿五千万千米”。这是一个大概的数，加“约”才符合事实，说得准确。' },
  { q: '如果步行，日夜不停地走，要走三千五百年。', a: '原文：“差不多要走三千五百年”。这是估算出来的，“差不多”表示接近，不是正好。' },
  { q: '就是坐飞机，也要飞二十年。', a: '原文：“二十几年”。“几”说明比二十年还多一些，又不确定具体多少。' },
  { q: '表面温度有五千摄氏度。', a: '原文：“五千多摄氏度”。少了“多”，说的温度就不准确了。' },
];

function initSunOff() {
  const btn = document.getElementById('sunOff');
  const slide = btn.closest('.slide');
  btn.addEventListener('click', () => {
    const off = slide.classList.toggle('sun-off');
    btn.textContent = off ? '打开太阳' : '关掉太阳';
  });
}

window.LESSON = {
  init() {
    Narrative.init({ kinds: KINDS, sort: SORT_ITEMS, clues: CLUES, clueLabels: CLUE_LABELS });
    fillEarthDots();
    initSunOff();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
