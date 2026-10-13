'use strict';
/* 升国旗 · 本课数据。识字模板见 ../shared/hanzi.js（必须在顶层调用，deck.js 加载前渲染完）
 * 国旗一律用本文件按国家标准（GB 12982）画的 SVG，配图里不出现旗帜。 */

/* 五星红旗：长宽比 3:2；左上四分之一按 15 × 10 方格定位。大星中心 (5,5)、外接圆半径 3，一角朝正上；
 * 四颗小星外接圆半径 1，中心 (10,2) (12,4) (12,7) (10,9)，各有一角正对大星中心。 */
const FLAG_RED = '#DE2910';
const FLAG_GOLD = '#FFDE00';
const BIG = [5, 5, 3];
const SMALL = [[10, 2], [12, 4], [12, 7], [10, 9]];
function star(cx, cy, r, tip) {
  const inner = r * Math.sin(Math.PI / 10) / Math.sin(Math.PI * 3 / 10);
  const pts = Array.from({ length: 10 }, (_, k) => {
    const a = tip + (k * Math.PI) / 5;
    const rr = k % 2 ? inner : r;
    return `${(cx + rr * Math.cos(a)).toFixed(3)},${(cy + rr * Math.sin(a)).toFixed(3)}`;
  });
  return `<polygon points="${pts.join(' ')}" fill="${FLAG_GOLD}"/>`;
}
function flagSvg(count) {
  const stars = [star(BIG[0], BIG[1], BIG[2], -Math.PI / 2), ...SMALL.map(([x, y]) => star(x, y, 1, Math.atan2(BIG[1] - y, BIG[0] - x)))];
  /* count：数一数星星，序号一步一个 */
  const nums = count ? [[BIG[0], BIG[1] + 4.6], ...SMALL.map(([x, y]) => [x + 1.9, y + .6])]
    .map(([x, y], i) => `<text class="sq-num" data-step="${i + 1}" x="${x}" y="${y}">${i + 1}</text>`).join('') : '';
  return `<svg viewBox="0 0 30 20" role="img" aria-label="五星红旗"><rect width="30" height="20" fill="${FLAG_RED}"/>${stars.join('')}${nums}</svg>`;
}
document.querySelectorAll('[data-flag]').forEach((el) => { el.innerHTML = flagSvg(el.dataset.flag === 'count'); });

/* 开火车读：点“开车”，火车开进来，车厢一节一节亮起，一人读一节；点车厢也能单独亮 */
const TRAIN_START = 1600;
const TRAIN_GAP = 1300;
function initTrain(box, list) {
  box.innerHTML = `<div class="tr-rail"><div class="tr-cars"><span class="tr-engine"></span>${list.map(([z, py]) => `<button type="button" class="tr-car"><small>${py || ''}</small><b>${z}</b></button>`).join('')}</div></div>
    <p class="tr-btns"><button type="button" class="btn" data-go>开车</button></p>`;
  const cars = [...box.querySelectorAll('.tr-car')];
  let timers = [];
  box.addEventListener('click', (e) => {
    const car = e.target.closest('.tr-car');
    if (car) { car.classList.toggle('on'); return; }
    if (!e.target.closest('[data-go]')) return;
    timers.forEach(clearTimeout);
    cars.forEach((c) => c.classList.remove('on'));
    box.classList.remove('run');
    void box.offsetWidth;
    box.classList.add('run');
    timers = cars.map((c, i) => setTimeout(() => c.classList.add('on'), TRAIN_START + i * TRAIN_GAP));
  });
}
initTrain(document.getElementById('train'), [['升', 'shēng'], ['国', 'guó'], ['旗', 'qí'], ['中', 'zhōng'], ['红', 'hóng'], ['歌', 'gē'], ['起', 'qǐ'], ['么', 'me'], ['美', 'měi'], ['丽', 'lì'], ['立', 'lì']]);

Hanzi.init({
  /* 本课补的古字形（示意简笔，100 × 100，一笔一条 path） */
  shapes: {
    中: ['M50 6V94', 'M28 38H72V62H28Z', 'M50 10H74', 'M50 18H74', 'M50 82H74', 'M50 90H74'],
    五: ['M14 16H86', 'M28 18L72 82', 'M72 18L28 82', 'M14 84H86'],
    立: ['M50 12V56', 'M18 34Q50 26 82 34', 'M50 56L30 84', 'M50 56L70 84', 'M12 90H88'],
    正: ['M30 10H70V30H30Z', 'M50 44V86', 'M50 64H72', 'M30 58V86', 'M14 86H86'],
  },
  evolve: [
    { z: '中', note: '像一根旗杆插在正中间，上下飘着旗子。' },
    { z: '五', note: '上下两横，中间交叉一个“×”。' },
    { z: '立', note: '一个人张开手脚，稳稳地站在地面上——“立”。' },
    { z: '正', note: '上面是要去的地方，下面是一只脚，朝着它一直走去。' },
  ],
  pick: {
    py: [
      { q: 'shēng', ans: '升', opts: ['升', '红', '中'] },
      { q: 'qí', ans: '旗', opts: ['起', '旗', '国'] },
      { q: 'guó', ans: '国', opts: ['歌', '美', '国'] },
      { q: 'gē', ans: '歌', opts: ['歌', '国', '红'] },
      { q: 'qǐ', ans: '起', opts: ['旗', '起', '立'] },
      { q: 'měi', ans: '美', opts: ['么', '丽', '美'] },
      { q: 'lì', ans: '立', opts: ['立', '起', '中'] },
    ],
  },
  cards: [
    { z: '升', py: 'shēng', bs: '十', bh: 4, words: [['升旗', 'shēng qí'], ['升起', 'shēng qǐ']] },
    { z: '国', py: 'guó', bs: '囗', bh: 8, words: [['中国', 'zhōng guó'], ['国旗', 'guó qí']] },
    { z: '旗', py: 'qí', bs: '方', bh: 14, words: [['国旗', 'guó qí'], ['红旗', 'hóng qí']] },
    { z: '中', py: 'zhōng', bs: '丨', bh: 4, words: [['中国', 'zhōng guó'], ['中间', 'zhōng jiān']] },
    { z: '红', py: 'hóng', bs: '纟', bh: 6, words: [['红旗', 'hóng qí'], ['红色', 'hóng sè']] },
    { z: '歌', py: 'gē', bs: '欠', bh: 14, words: [['国歌', 'guó gē'], ['唱歌', 'chàng gē']] },
    { z: '起', py: 'qǐ', bs: '走', bh: 10, words: [['升起', 'shēng qǐ'], ['起来', 'qǐ lái']] },
    { z: '么', py: 'me', bs: '丿', bh: 3, words: [['多么', 'duō me'], ['什么', 'shén me']] },
    { z: '美', py: 'měi', bs: '羊', bh: 9, words: [['美丽', 'měi lì'], ['美好', 'měi hǎo']] },
    { z: '丽', py: 'lì', bs: '一', bh: 7, words: [['美丽', 'měi lì']] },
    { z: '立', py: 'lì', bs: '立', bh: 5, words: [['立正', 'lì zhèng'], ['站立', 'zhàn lì']] },
  ],
  write: [
    { z: '中', py: 'zhōng', bs: '丨', bh: 4 },
    { z: '五', py: 'wǔ', bs: '一', bh: 4 },
    { z: '立', py: 'lì', bs: '立', bh: 5 },
    { z: '正', py: 'zhèng', bs: '止', bh: 5 },
  ],
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
