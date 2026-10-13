'use strict';
/* 千年梦圆在今朝（略读）· 本课数据与互动。记叙文模板见 ../shared/narrative.js，提问—解决卡见 wenjie.js，翻页引擎见 ../shared/deck.js
 * 本课专属：火箭时间线（每往下一步，火箭往上飞一站，从地面上的神话飞到月球背面）。
 */

/* 火箭时间线：每一站的高度 y、时间、事件、课文原句（有删节） */
const STOPS = [
  { y: 540, when: '古代', what: '神话、传说和想象', t: '在古代就有“嫦娥奔月”的神话，有人飞上天、空中飞车的传说，还有“鲲鹏展翅”“九天揽月”的奇妙想象。' },
  { y: 480, when: '明代', what: '万户试验利用火箭上天', t: '他把四十七支火箭安装在椅子背后，自己坐在椅子上，手拿两只大风筝，叫人点火发射。……万户仍然被国际航天史学家公认为人类飞行探索的先驱。' },
  { y: 415, when: '1949年 · 1958年', what: '“我们也要搞人造卫星。”', t: '1949年，中华人民共和国成立……中国的航天事业也呈现出勃勃生机。……1958年，庄重地表示：“我们也要搞人造卫星。”' },
  { y: 350, when: '1970年4月24日', what: '第一次响起了中国人的声音', t: '寂寞而辽阔的太空中，第一次响起了中国人的声音，那穿越苍穹的《东方红》乐曲，让海内外华人振奋不已。中国成为世界上第五个能够独立发射卫星的国家。' },
  { y: 290, when: '1992年9月21日', what: '决定实施载人航天工程', t: '党中央决定实施载人航天工程，一百一十多个单位直接承担了研制、建设和发射任务。' },
  { y: 225, when: '2003年10月15日', what: '“神舟五号”载人飞行', t: '我国自行研制的“神舟五号”飞船被送上太空。……中国已经成为第三个独立掌握载人航天技术的国家。' },
  { y: 160, when: '2007年10月24日', what: '“嫦娥一号”', t: '我国成功发射第一颗月球探测卫星“嫦娥一号”，这是我国航天事业的又一座里程碑。' },
  { y: 105, when: '2019年1月3日', what: '“嫦娥四号”月背软着陆', t: '“嫦娥四号”探测器实现了人类首次月球背面软着陆，并传回了第一张月背近距离拍摄的清晰的月表形貌图。' },
];
const LINE_X = 210;
const GROUND_Y = 560;
// 分步节点要在 deck.js 统计分步之前生成，所以放在顶层
document.getElementById('rkNodes').innerHTML = STOPS.map((s, i) => `<g class="rk-node" data-step="${i + 1}" data-i="${i}">
  <circle cx="${LINE_X}" cy="${s.y}" r="9"/><text x="${LINE_X - 16}" y="${s.y + 5}" class="rk-when">${s.when.split(' · ')[0]}</text>
  <text x="${LINE_X + 18}" y="${s.y + 5}" class="rk-what">${s.what.length > 12 ? `${s.what.slice(0, 12)}…` : s.what}</text></g>`).join('');

function showStop(i) {
  const s = STOPS[i];
  document.getElementById('rkRocket').style.transform = `translate(${LINE_X}px, ${i < 0 ? GROUND_Y : s.y}px)`;
  document.getElementById('rkWhen').textContent = i < 0 ? '出发' : s.when;
  document.getElementById('rkWhat').textContent = i < 0 ? '一个很久以来的梦想' : s.what;
  document.getElementById('rkText').textContent = i < 0 ? '飞离地球、遨游太空是中华民族很久以来的梦想。' : s.t;
  document.querySelectorAll('.rk-node').forEach((n) => n.classList.toggle('cur', +n.dataset.i === i));
}
function initRocket() {
  document.getElementById('rkNodes').addEventListener('click', (e) => {
    const n = e.target.closest('.rk-node.on');
    if (n) showStop(+n.dataset.i);
  });
}

/* 排一排：items 按正确顺序给出，页面上固定打乱 */
function initOrder(box, items, doneText) {
  const keys = [...items.keys()];
  const shuffled = [...keys.filter((i) => i % 2).reverse(), ...keys.filter((i) => !(i % 2))];
  box.innerHTML = shuffled.map((i) => `<button class="order-card" type="button" data-i="${i}"><em></em>${items[i]}</button>`).join('');
  const msg = document.createElement('p');
  msg.className = 'order-msg';
  msg.textContent = '先点第 1 步。';
  box.after(msg);
  let next = 0;
  box.addEventListener('click', (e) => {
    const card = e.target.closest('.order-card');
    if (!card || card.classList.contains('right')) return;
    card.classList.remove('wrong');
    void card.offsetWidth; // 重新触发抖动动画
    if (+card.dataset.i !== next) { card.classList.add('wrong'); return; }
    next += 1;
    card.classList.add('right');
    card.style.order = next;
    card.querySelector('em').textContent = next;
    const done = next === items.length;
    box.classList.toggle('all-done', done);
    msg.textContent = done ? doneText : `对了！接着点第 ${next + 1} 步。`;
  });
}
const STEPS = ['古代：嫦娥奔月的神话', '明代：万户试验利用火箭上天', '1970年：第一颗人造卫星上天', '2003年：“神舟五号”载人飞行', '2007年：“嫦娥一号”探月', '2019年：“嫦娥四号”月背软着陆'];

const WENJIE = {
  qiannian: {
    items: [
      { q: '“鲲鹏展翅”“九天揽月”是什么意思？', k: 'ci', how: ['zl', 'qj'], a: '查资料：鲲鹏是古代传说中的大鱼和大鸟，能飞九万里；“九天揽月”是到最高的天上去摘月亮——都是古人飞上天的想象。' },
      { q: '万户的试验没有成功，为什么还被称为“先驱”？', k: 'nr', how: ['sx'], a: '联系上下文：他是世界历史上第一个试验利用火箭上天的人，“勇于实践的探索精神”鼓舞着后来的人。' },
      { q: '课文为什么写了那么多具体的日期？', k: 'xf', how: ['sx', 'qj'], a: '和同学讨论：日期写得清清楚楚，既准确，又能让我们看出飞天梦是一步一步实现的。' },
    ],
  },
};

window.LESSON = {
  init() {
    Narrative.init({});
    WenJie.init(WENJIE);
    initRocket();
    initOrder(document.getElementById('qnOrder'), STEPS, '排好了！连起来说一说吧。');
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.classList.contains('s-rocket')) showStop(step - 1);
  },
};
