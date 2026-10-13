'use strict';
/* 列夫·托尔斯泰 · 本课独有的“抑扬柱”和“眼睛聚光灯”。通用互动见 ../shared/narrative.js */

/* 抑扬：v 为示意高度（负为抑，正为扬），q 为课文原句 */
const YY = [
  { p: '第 1 段', v: -1, q: '他生就一副多毛的脸庞，植被多于空地' },
  { p: '第 2 段', v: -2, q: '长相粗劣，生就一张乡野村夫的脸孔' },
  { p: '第 3 段', v: -3, q: '这张脸蒙昧阴沉，郁郁寡欢，丑陋可憎' },
  { p: '第 4 段', v: -2, q: '长相平平，混在人群里找都找不出来' },
  { p: '第 5 段', v: -3, q: '什么？就这么个侏儒！' },
  { p: '第 6 段', v: 3, q: '突然……一对灰色的眼睛射出一道黑豹似的目光' },
  { p: '第 7 段', v: 4, q: '托尔斯泰这对眼睛里有一百只眼珠' },
  { p: '第 8 段', v: 4, q: '把探照灯光射进最阴暗的灵魂深处' },
  { p: '第 9 段', v: 2, q: '他肯定缺少一样东西，那就是属于自己的那一份幸福' },
];
const YY_MAX = 4;

// 必须在 deck.js 统计分步之前生成
document.getElementById('yy').innerHTML = YY.map((x, i) => {
  const h = Math.abs(x.v) / YY_MAX * 50;
  const cls = x.v < 0 ? 'down' : 'up';
  return `<div class="yc" data-step="${i + 1}"><div class="bar ${cls}" style="height:${h}%"></div><small>${x.p}</small><p class="${cls}">${x.q}</p></div>`;
}).join('');

/* 聚光灯：关键句的点评 */
const EYE = [
  ['黑豹', '黑豹似的目光：锐利、有力，猛然一击'],
  ['钢刀', '锃亮的钢刀：又稳又准，击中要害——目光的穿透力'],
  ['枪弹 · 金刚刀', '任何伪装都抵挡不住：看透人心'],
  ['星光', '粲然笑意，犹如神奇的星光：温柔、和蔼'],
  ['热泪', '像村妇那样热泪涟涟：感情真挚、易被打动'],
  ['手术刀 · X 射线', '揭开隐藏的秘密：洞察事物的本质'],
  ['一百只眼珠', '夸张：情感极其丰富，什么都看得见'],
  ['探照灯', '照进最阴暗的灵魂深处：深邃的思想'],
];

function lightAt(el) {
  const box = document.getElementById('spot');
  const r = box.getBoundingClientRect();
  const e = el.getBoundingClientRect();
  box.style.setProperty('--x', `${e.left + e.width / 2 - r.left}px`);
  box.style.setProperty('--y', `${e.top + e.height / 2 - r.top + box.scrollTop}px`);
}

function showEye(i) {
  const k = document.querySelector(`.spot .k[data-k="${i}"]`);
  document.querySelectorAll('.spot .k').forEach((x) => x.classList.toggle('hit', x === k));
  document.querySelectorAll('#eyeBtns .btn').forEach((b, j) => b.classList.toggle('solid', j === i));
  document.getElementById('spot').classList.add('lit');
  lightAt(k);
  document.getElementById('eyeSay').innerHTML = `<b>${EYE[i][0]}</b>　${EYE[i][1]}`;
}

function initSpot() {
  const box = document.getElementById('spot');
  document.getElementById('eyeBtns').innerHTML = EYE.map((e, i) => `<button type="button" class="btn" data-i="${i}">${e[0]}</button>`).join('');
  document.getElementById('eyeBtns').addEventListener('click', (e) => {
    const b = e.target.closest('[data-i]');
    if (b) showEye(+b.dataset.i);
  });
  box.addEventListener('pointermove', (e) => {
    const r = box.getBoundingClientRect();
    box.classList.add('lit');
    box.style.setProperty('--x', `${e.clientX - r.left}px`);
    box.style.setProperty('--y', `${e.clientY - r.top + box.scrollTop}px`);
  });
  box.addEventListener('click', (e) => {
    const k = e.target.closest('.k');
    if (k) showEye(+k.dataset.k);
  });
}

const QA = [
  { q: '这里为什么提到陀思妥耶夫斯基？', a: '对比：陀思妥耶夫斯基“眉宇之间那种像大理石穹顶一样缓缓隆起的非凡器宇”，衬出托尔斯泰面容“没有一点儿光彩可言”。后文又说托尔斯泰的天赋集中在眼睛里，“就像俊美的陀思妥耶夫斯基的丰富思想都集中在他的眉峰之间一样”——前后呼应。' },
  { q: '“天才灵魂”为什么再三出现？', a: '每写一次粗陋的外貌，就提一次“天才灵魂”，形成“外貌平庸”与“灵魂伟大”的张力，提醒读者：别被外表骗了。这是在为后文的“扬”蓄势。' },
  { q: '“看透事物本质”，却会失去幸福？', a: '能看清一切真相的人，“容不得幻影”，要扯掉一切虚假的伪装——也包括自己的。看得太透，便难以满足于安逸的幻想。这是天才的代价，也写出作者对托尔斯泰深深的理解与敬意。' },
];

function initQA() {
  document.getElementById('qBtns').addEventListener('click', (e) => {
    const b = e.target.closest('[data-q]');
    if (!b) return;
    const x = QA[+b.dataset.q];
    document.querySelectorAll('#qBtns .btn').forEach((y) => y.classList.toggle('solid', y === b));
    document.getElementById('qa').innerHTML = `<h3>${x.q}</h3><p>${x.a}</p>`;
  });
  document.querySelector('#qBtns .btn').click();
}

window.LESSON = {
  init() {
    Narrative.init({});
    initSpot();
    initQA();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
  },
};
