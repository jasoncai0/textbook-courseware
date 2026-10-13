'use strict';
/* 昆虫备忘录 · 本课数据与互动。通用互动见 ../shared/narrative.js */

/* 花大姐 · 益虫还是害虫 */
const KINDS = ['益虫', '害虫'];
const SORT_ITEMS = [
  { s: '吃蚜虫的瓢虫', ok: ['益虫'], q: '蚜虫祸害庄稼，吃掉它们是帮忙' },
  { s: '吃马铃薯嫩叶的瓢虫', ok: ['害虫'], q: '把庄稼的叶子吃了' },
];

/* 读与写 · 我的昆虫备忘录 */
const HINT = '写清楚：它叫什么（有没有有趣的名字）？长什么样？有什么本领？你有什么想法？';
const MOMENTS = [
  {
    name: '蜻蜓', pic: 'qingting', hint: HINT,
    prompt: '你见过蜻蜓吗？给它写一则备忘录。',
    example: '蜻蜓的眼睛又大又圆，几乎占了整个脑袋。它的翅膀薄得像玻璃纸，阳光一照，亮晶晶的。我想悄悄靠近它，可还没走到跟前，它就“噌”地飞走了。看来，它的复眼真灵！',
  },
  {
    name: '瓢虫', pic: 'piaochong', hint: HINT,
    prompt: '数一数瓢虫背上有几颗“星”，给它写一则备忘录。',
    example: '我在月季花上发现了一只七星瓢虫。它穿着红色的外衣，背上点着七个小黑点，像一颗会爬的小纽扣。我轻轻碰它一下，它马上缩起脚装死，过了一会儿，又“呼”地飞走了。',
  },
  {
    name: '我观察过的昆虫', pic: 'dujiaoxian', hint: HINT,
    prompt: '蚂蚁、蝴蝶、蝉、蟋蟀……选一种你观察过的昆虫，像汪曾祺一样写下来。',
    example: '蚂蚁个子小，力气可不小。我看见一只蚂蚁拖着一粒比它身子还大的饭粒，一步一步往洞里走。我想：如果我也有蚂蚁这么大的力气，该能搬动一辆小汽车了吧！',
  },
];

/* 复眼 · 两种猜想：A 每个小眼都看到一个小形象；B 每个小眼看到一部分，拼成整幅 */
const HEX_R = 22;
function hexCells() {
  const w = Math.sqrt(3) * HEX_R;
  const cells = [];
  for (let row = 0; row * HEX_R * 1.5 < 340; row += 1) {
    for (let col = 0; col * w < 340; col += 1) {
      const cx = col * w + (row % 2 ? w / 2 : 0);
      const cy = row * HEX_R * 1.5;
      const pts = Array.from({ length: 6 }, (_, k) => {
        const a = Math.PI / 180 * (60 * k - 30);
        return `${(cx + HEX_R * Math.cos(a)).toFixed(1)},${(cy + HEX_R * Math.sin(a)).toFixed(1)}`;
      }).join(' ');
      cells.push({ cx, cy, pts });
    }
  }
  return cells;
}
function initEye() {
  const svg = document.getElementById('kcEye');
  const mini = HEX_R * 1.2;
  svg.querySelector('#kcCells').innerHTML = hexCells().map((c, i) => `<g class="kc-cell">
    <polygon points="${c.pts}" class="kc-hex" style="--o:${(i * 37 % 10) / 40}"/>
    <use class="kc-mini" href="#kcFlower" x="${(c.cx - mini / 2).toFixed(1)}" y="${(c.cy - mini / 2).toFixed(1)}" width="${mini.toFixed(1)}" height="${mini.toFixed(1)}"/></g>`).join('');
  const slide = svg.closest('.slide');
  slide.querySelector('.btns').addEventListener('click', (e) => {
    const b = e.target.closest('[data-eye]');
    if (!b) return;
    svg.classList.remove('eye-a', 'eye-b');
    svg.classList.add(`eye-${b.dataset.eye}`);
    slide.querySelectorAll('[data-eye]').forEach((x) => x.classList.toggle('solid', x === b));
  });
}

/* 阅读提示 · 翻卡片 */
function initCards() {
  document.querySelector('.kc-cards').addEventListener('click', (e) => {
    const card = e.target.closest('.kc-card');
    if (card) card.classList.toggle('flipped');
  });
}

window.LESSON = {
  init() {
    Narrative.init({ kinds: KINDS, sort: SORT_ITEMS, moments: MOMENTS });
    initEye();
    initCards();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
