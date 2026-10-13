'use strict';
/* 我多想去看看 · 本课数据与本课互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完） */

/* ================= 路线图：天山（左）⇄ 北京（右）；data-route="1" 画弯弯的小路，"2" 画宽宽的公路 =================
 * SVG 1000 × 360。路线 path 带 data-step="1"：读第一句时从起点画到终点（pathLength=100，见 course.css）。 */
const ROAD_SMALL = 'M240 230C330 120 420 300 520 190S690 120 770 210';
const ROAD_WIDE = 'M770 262C620 320 400 320 240 270';
const MOUNTAINS = `<path d="M40 270L150 110L260 270Z" fill="#9cb7c9"/><path d="M150 110L182 156L164 150L150 166L134 150L118 156Z" fill="#fff"/>
  <path d="M140 270L240 140L330 270Z" fill="#b5cbd8"/><path d="M240 140L266 176L250 172L240 184L228 172L214 176Z" fill="#fff"/>`;
const CITY = `<path d="M720 270V190H770V270Z" fill="#e9b07c"/><path d="M780 270V150H840V270Z" fill="#f0c592"/><path d="M850 270V200H900V270Z" fill="#e2a46c"/>
  <path d="M790 170H830M790 195H830M790 220H830" stroke="#fff" stroke-width="6"/>
  <path d="M930 270V96" stroke="#8b8b8b" stroke-width="5"/><path d="M932 98H982V130H932Z" fill="#d8352a"/>`;
function buildMap(box) {
  const route = box.dataset.route;
  const road = route === '1'
    ? `<path d="${ROAD_SMALL}" class="dx-road small"/><path d="${ROAD_SMALL}" class="dx-route small" pathLength="100" data-step="1"/>`
    : `<path d="${ROAD_WIDE}" class="dx-road wide"/><path d="${ROAD_WIDE}" class="dx-route wide" pathLength="100" data-step="1"/><path d="${ROAD_WIDE}" class="dx-mid"/>`;
  box.insertAdjacentHTML('afterbegin', `<svg class="dx-svg" viewBox="0 80 1000 260" aria-label="从${route === '1' ? '天山到北京' : '北京到天山'}的路线图">
    <path d="M0 270H1000V360H0Z" fill="#cfe5b8"/>
    ${MOUNTAINS}${CITY}${road}
    <text x="150" y="326" class="dx-place">天山</text><text x="150" y="284" class="dx-place-py">tiān shān</text>
    <text x="830" y="326" class="dx-place">北京</text><text x="830" y="284" class="dx-place-py">běi jīng</text>
  </svg>`);
}
document.querySelectorAll('.dx-map').forEach(buildMap);

/* ================= 连一连：点左边，再点右边，连对了画线 ================= */
const LINKS = [
  ['弯弯的', 'wān wān de', '小路', 'xiǎo lù'],
  ['宽宽的', 'kuān kuān de', '公路', 'gōng lù'],
  ['美丽的', 'měi lì de', '天山', 'tiān shān'],
  ['洁白的', 'jié bái de', '雪莲', 'xuě lián'],
  ['雄伟的', 'xióng wěi de', '天安门', 'tiān ān mén'],
  ['壮观的', 'zhuàng guān de', '升旗仪式', 'shēng qí yí shì'],
];
const RIGHT_ORDER = [3, 0, 5, 2, 1, 4]; // 右边打乱的顺序
function initLink(box) {
  box.innerHTML = `<svg class="dx-lines"></svg>
    <div class="dx-col">${LINKS.map(([w, p], i) => `<button type="button" class="dx-l" data-i="${i}">${Hanzi.ruby(w, p)}</button>`).join('')}</div>
    <div class="dx-col">${RIGHT_ORDER.map((i) => `<button type="button" class="dx-r" data-i="${i}">${Hanzi.ruby(LINKS[i][2], LINKS[i][3])}</button>`).join('')}</div>
    <p class="dx-link-msg">先点左边的词，再点右边和它搭配的词。</p>`;
  const svg = box.querySelector('.dx-lines');
  let sel = null;
  const drawLines = () => {
    const r0 = box.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${r0.width} ${r0.height}`);
    svg.innerHTML = [...box.querySelectorAll('.dx-l.ok')].map((l) => {
      const r = box.querySelector(`.dx-r[data-i="${l.dataset.i}"]`);
      const a = l.getBoundingClientRect();
      const b = r.getBoundingClientRect();
      return `<line x1="${a.right - r0.left}" y1="${a.top + a.height / 2 - r0.top}" x2="${b.left - r0.left}" y2="${b.top + b.height / 2 - r0.top}"/>`;
    }).join('');
  };
  box.addEventListener('click', (e) => {
    const l = e.target.closest('.dx-l:not(.ok)');
    if (l) { box.querySelectorAll('.dx-l').forEach((x) => x.classList.toggle('sel', x === l)); sel = l; return; }
    const r = e.target.closest('.dx-r:not(.ok)');
    if (!r || !sel) return;
    if (r.dataset.i === sel.dataset.i) {
      sel.classList.add('ok'); r.classList.add('ok'); sel.classList.remove('sel'); sel = null;
      drawLines();
      const done = !box.querySelector('.dx-l:not(.ok)');
      box.classList.toggle('done', done);
      box.querySelector('.dx-link-msg').textContent = done ? '全连对了！连起来读一读。' : '连对了！接着连。';
    } else {
      r.classList.remove('wrong'); void r.offsetWidth; r.classList.add('wrong');
      box.querySelector('.dx-link-msg').textContent = '再读一读，搭配得上吗？';
    }
  });
  window.addEventListener('resize', drawLines);
}
initLink(document.getElementById('link'));

/* ================= 我的愿望：点一个例子，填进“我多想去……，看看……！” ================= */
const WISHES = [
  ['海边', 'hǎi biān', '蓝蓝的大海', 'lán lán de dà hǎi'],
  ['草原', 'cǎo yuán', '奔跑的骏马', 'bēn pǎo de jùn mǎ'],
  ['太空', 'tài kōng', '我们的地球', 'wǒ men de dì qiú'],
  ['动物园', 'dòng wù yuán', '可爱的大熊猫', 'kě ài de dà xióng māo'],
];
function initWish(box) {
  const blank = '<span class="dx-blank"></span>';
  box.innerHTML = `<p class="dx-frame py"><span>${Hanzi.ruby('我多想去', 'wǒ duō xiǎng qù')}</span><b class="dx-a">${blank}</b><span>${Hanzi.ruby('，看看', 'kàn kan')}</span><b class="dx-b">${blank}</b>！</p>
    <div class="dx-ideas">${WISHES.map(([a], i) => `<button type="button" class="btn" data-i="${i}">${a}</button>`).join('')}<button type="button" class="btn solid" data-i="-1">我自己说</button></div>`;
  box.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-i]');
    if (!btn) return;
    const w = WISHES[+btn.dataset.i];
    box.querySelector('.dx-a').innerHTML = w ? Hanzi.ruby(w[0], w[1]) : blank;
    box.querySelector('.dx-b').innerHTML = w ? Hanzi.ruby(w[2], w[3]) : blank;
    box.querySelectorAll('[data-i]').forEach((b) => b.classList.toggle('on', b === btn));
    box.querySelector('.dx-frame').classList.remove('pop'); void box.offsetWidth; box.querySelector('.dx-frame').classList.add('pop');
  });
}
initWish(document.getElementById('wish'));

Hanzi.init({
  cards: [
    { z: '想', py: 'xiǎng', bs: '心', bh: 13, words: [['多想', 'duō xiǎng'], ['想念', 'xiǎng niàn']] },
    { z: '告', py: 'gào', bs: '口', bh: 7, words: [['告诉', 'gào su'], ['报告', 'bào gào']] },
    { z: '诉', py: 'sù', bs: '讠', bh: 7, words: [['告诉', 'gào su'], ['诉说', 'sù shuō']] },
    { z: '就', py: 'jiù', bs: '尢', bh: 12, words: [['就会', 'jiù huì'], ['就是', 'jiù shì']] },
    { z: '京', py: 'jīng', bs: '亠', bh: 8, words: [['北京', 'běi jīng'], ['京城', 'jīng chéng']] },
    { z: '安', py: 'ān', bs: '宀', bh: 6, words: [['天安门', 'tiān ān mén'], ['平安', 'píng ān']] },
    { z: '广', py: 'guǎng', bs: '广', bh: 3, words: [['广场', 'guǎng chǎng'], ['广大', 'guǎng dà']] },
    { z: '非', py: 'fēi', bs: '非', bh: 8, words: [['非常', 'fēi cháng']] },
    { z: '常', py: 'cháng', bs: '巾', bh: 11, words: [['非常', 'fēi cháng'], ['常常', 'cháng cháng']] },
    { z: '壮', py: 'zhuàng', bs: '丬', bh: 6, words: [['壮观', 'zhuàng guān'], ['强壮', 'qiáng zhuàng']] },
    { z: '观', py: 'guān', bs: '又', bh: 6, words: [['壮观', 'zhuàng guān'], ['观看', 'guān kàn']] },
  ],
  shapes: {
    北: ['M40 10C42 40 40 64 28 92', 'M40 42C32 50 22 54 10 56', 'M60 10C58 40 60 64 72 92', 'M60 42C68 50 78 54 90 56'],
    京: ['M50 6V18', 'M22 18H78', 'M32 30H68V54H32Z', 'M50 54V94', 'M36 70L24 86', 'M64 70L76 86'],
  },
  evolve: [
    { z: '北', note: '像两个人背靠着背。后来人们用它表示方向“北”。' },
    { z: '京', note: '像建在高台上的高大房子。古时候都城里才有这样的大房子，所以“京”指首都，比如“北京”。' },
  ],
  apples: [['想', 'xiǎng'], ['告', 'gào'], ['诉', 'sù'], ['就', 'jiù'], ['京', 'jīng'], ['安', 'ān'], ['广', 'guǎng'], ['非', 'fēi'], ['常', 'cháng'], ['壮', 'zhuàng'], ['观', 'guān']],
  write: [
    { z: '多', py: 'duō', bs: '夕', bh: 6 },
    { z: '会', py: 'huì', bs: '人', bh: 6 },
    { z: '走', py: 'zǒu', bs: '走', bh: 7 },
    { z: '北', py: 'běi', bs: '匕', bh: 5 },
    { z: '京', py: 'jīng', bs: '亠', bh: 8 },
    { z: '广', py: 'guǎng', bs: '广', bh: 3 },
  ],
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
