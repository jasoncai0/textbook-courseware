'use strict';
/* 秋天的雨 · 本课数据。页面逻辑见记叙文模板 ../shared/narrative.js，背诵挖空见 ../shared/poem.js */

/* 背诵第 2 自然段：借用诗文模板的挖空背诵（一句一行） */
Poem.render({
  p2: {
    title: '第 2 自然段', author: '秋天的雨',
    lines: [
      { t: '秋天的雨，有一盒五彩缤纷的颜料。' },
      { t: '你看，它把黄色给了银杏树，黄黄的叶子像一把把小扇子，扇哪扇哪，扇走了夏天的炎热。' },
      { t: '它把红色给了枫树，红红的枫叶像一枚枚邮票，飘哇飘哇，邮来了秋天的凉爽。' },
      { t: '金黄色是给田野的，看，田野像金色的海洋。' },
      { t: '橙红色是给果树的，橘子、柿子你挤我碰，争着要人们去摘呢！' },
      { t: '菊花仙子得到的颜色就更多了，紫红的、淡黄的、雪白的……美丽的菊花在秋雨里频频点头。' },
    ],
  },
});

/* 理解难懂的词语 */
const KINDS = ['联系上下文', '看图', '生活经验', '查字典'];
const SORT_ITEMS = [
  { s: '秋天的雨，有一盒<b>五彩缤纷</b>的颜料。', ok: ['联系上下文'], q: '颜色多，又鲜艳' },
  { s: '美丽的菊花在秋雨里<b>频频</b>点头。', ok: ['看图', '生活经验', '查字典'], q: '一次又一次，接连不断' },
  { s: '小朋友的脚，常被那香味<b>勾住</b>。', ok: ['联系上下文', '生活经验'], q: '香得让人停下脚步，走不动了' },
];

const MOMENTS = [
  { name: '紫色', pic: 'yanliao', prompt: '秋天的雨把紫色给了谁？照样子写一写。', hint: '想想秋天紫色的东西：葡萄、茄子、牵牛花……它们像什么？', example: '它把紫色给了葡萄，紫紫的葡萄像一串串小铃铛，摇哇摇哇，摇来了秋天的甜蜜。' },
  { name: '白色', pic: 'laba', prompt: '秋天的雨把白色给了谁？', hint: '棉花、芦花……摸起来什么感觉？', example: '它把白色给了棉花，白白的棉花像一朵朵小云，飘哇飘哇，要给小朋友做暖和的棉被。' },
  { name: '金黄色', pic: 'xiangwei', prompt: '除了田野，秋天的雨还把金黄色给了谁？', hint: '稻谷、玉米、梨……', example: '它把金黄色给了玉米，金黄的玉米棒像一个个胖娃娃，挤哇挤哇，挤满了农民伯伯的院子。' },
];

/* 帮秋雨分颜料：点颜色 → 给对应的景物上色，并显示课文原句 */
const PALETTE = [
  { obj: 'yinxing', name: '黄色', color: '#f2c230', text: '它把黄色给了银杏树，黄黄的叶子像一把把小扇子，扇哪扇哪，扇走了夏天的炎热。' },
  { obj: 'feng', name: '红色', color: '#d2381f', text: '它把红色给了枫树，红红的枫叶像一枚枚邮票，飘哇飘哇，邮来了秋天的凉爽。' },
  { obj: 'tianye', name: '金黄色', color: '#e7a92a', text: '金黄色是给田野的，看，田野像金色的海洋。' },
  { obj: 'guoshu', name: '橙红色', color: '#ef6f2a', text: '橙红色是给果树的，橘子、柿子你挤我碰，争着要人们去摘呢！' },
  { obj: 'juhua', name: '紫红、淡黄、雪白', color: 'conic-gradient(#b0306a 0 33%, #f3dc6a 0 66%, #fbfbf5 0)', text: '菊花仙子得到的颜色就更多了，紫红的、淡黄的、雪白的……美丽的菊花在秋雨里频频点头。' },
];

const MAPLE = 'M0 -14 L3 -7 L10 -10 L7 -3 L14 -1 L8 3 L10 10 L3 7 L0 14 L-3 7 L-10 10 L-8 3 L-14 -1 L-7 -3 L-10 -10 L-3 -7 Z';
const range = (n, f) => Array.from({ length: n }, (_, i) => f(i)).join('');

function autumnSvg() {
  // 银杏树冠：一圈圈小扇子，扇面朝外
  const fans = range(22, (i) => {
    const a = (i * 67) % 360;
    const r = 12 + (i * 29) % 52;
    const x = 130 + Math.cos(a * Math.PI / 180) * r;
    const y = 140 + Math.sin(a * Math.PI / 180) * r * .85;
    return `<path class="fan" d="M0 0 L-12 -18 A22 22 0 0 1 12 -18 Z" fill="${i % 3 ? '#f2c230' : '#e8b222'}" transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${(a + 90).toFixed(0)})"/>`;
  });
  const maples = range(14, (i) => `<path class="mp" d="${MAPLE}" fill="${i % 2 ? '#d2381f' : '#e0502a'}" transform="translate(${300 + (i * 37) % 90} ${100 + (i * 23) % 90}) rotate(${i * 25}) scale(1.6)"/>`);
  const fruits = range(9, (i) => `<circle class="fruit" cx="${505 + (i * 29) % 80}" cy="${135 + (i * 19) % 60}" r="${i % 3 ? 9 : 11}" fill="${i % 2 ? '#ef6f2a' : '#f39a2a'}"/>`);
  const flower = (cx, cy, color) => `<g class="mum"><path d="M${cx} ${cy} V${cy + 60}" stroke="#4f8a3c" stroke-width="4"/>${range(12, (k) => `<ellipse cx="${cx}" cy="${cy - 14}" rx="5" ry="14" fill="${color}" stroke="#c9b9a0" stroke-width=".6" transform="rotate(${k * 30} ${cx} ${cy})"/>`)}<circle cx="${cx}" cy="${cy}" r="6" fill="#e3a42a"/></g>`;
  return `<rect width="800" height="420" fill="#eaf2f4"/>
    <g class="obj" data-obj="tianye"><path d="M0 300 Q200 268 400 298 T800 288 V420 H0 Z" fill="#e7a92a"/>
      <path d="M0 340 Q200 318 400 342 T800 334" stroke="#cf8f1e" stroke-width="4" fill="none"/><path d="M0 380 Q200 360 400 382 T800 374" stroke="#cf8f1e" stroke-width="4" fill="none"/></g>
    <g class="obj" data-obj="yinxing"><rect x="122" y="160" width="16" height="150" fill="#7a5532"/>${fans}</g>
    <g class="obj" data-obj="feng"><rect x="337" y="170" width="16" height="140" fill="#6e4a2c"/>${maples}</g>
    <g class="obj" data-obj="guoshu"><rect x="537" y="170" width="16" height="135" fill="#7a5532"/><circle cx="545" cy="160" r="62" fill="#5f9e4a"/>${fruits}</g>
    <g class="obj" data-obj="juhua">${flower(680, 300, '#b0306a')}${flower(725, 320, '#f3dc6a')}${flower(765, 296, '#fbfbf5')}</g>
    <g class="rain-drops" stroke="#9cc3dc" stroke-width="2">${range(26, (i) => `<line x1="${(i * 31) % 800}" y1="${(i * 47) % 260}" x2="${(i * 31) % 800 - 4}" y2="${(i * 47) % 260 + 14}"/>`)}</g>`;
}

function initPalette() {
  const svg = document.getElementById('autumnSvg');
  svg.innerHTML = autumnSvg();
  const box = document.getElementById('palBtns');
  box.innerHTML = PALETTE.map((p, i) => `<button type="button" class="pal-btn" data-i="${i}"><i style="background:${p.color}"></i>${p.name}</button>`).join('');
  box.addEventListener('click', (e) => {
    const btn = e.target.closest('.pal-btn');
    if (!btn) return;
    const p = PALETTE[+btn.dataset.i];
    btn.classList.add('used');
    svg.querySelector(`[data-obj="${p.obj}"]`).classList.add('painted');
    document.getElementById('palText').textContent = p.text;
  });
}

window.LESSON = {
  init() {
    Narrative.init({ kinds: KINDS, sort: SORT_ITEMS, moments: MOMENTS });
    Poem.init();
    initPalette();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
