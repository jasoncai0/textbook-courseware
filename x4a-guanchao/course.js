'use strict';
/* 观潮 · 本课数据与互动。记叙文模板见 ../shared/narrative.js，背诵挖空见 ../shared/poem.js，翻页引擎见 ../shared/deck.js
 * 本课专属：三幅画面排顺序、潮来时“声音 + 样子”变化图、古诗与课文古今对读。
 */

/* 背诵第 3～4 自然段（一句一行） */
Poem.render({
  beisong: {
    title: '观潮（第 3～4 自然段）', author: '赵宗成　朱明元',
    lines: [
      { t: '午后一点左右，从远处传来隆隆的响声，好像闷雷滚动。' },
      { t: '顿时人声鼎沸，有人告诉我们，潮来了！我们踮着脚往东望去，江面还是风平浪静，看不出有什么变化。' },
      { t: '过了一会儿，响声越来越大，只见东边水天相接的地方出现了一条白线，人群又沸腾起来。' },
      { t: '那条白线很快地向我们移来，逐渐拉长，变粗，横贯江面。再近些，只见白浪翻滚，形成一堵两丈多高的水墙。' },
      { t: '浪潮越来越近，犹如千万匹白色战马齐头并进，浩浩荡荡地飞奔而来；那声音如同山崩地裂，好像大地都被震得颤动起来。' },
    ],
  },
});

/* ================= 排一排：带图的卡片按顺序点（items 按正确顺序给出，页面上固定打乱） ================= */
function initPicOrder(box, items, doneText) {
  const SHUFFLE = [2, 0, 1];
  box.innerHTML = SHUFFLE.map((i) => `<button class="po-card" type="button" data-i="${i}">
      <span class="po-pic" data-bg="assets/${items[i].pic}.jpg"></span>
      <em></em><b>${items[i].label}</b><span class="po-t">${items[i].t}</span></button>`).join('');
  const msg = document.createElement('p');
  msg.className = 'order-msg';
  msg.textContent = '先点最早出现的画面。';
  box.after(msg);
  let next = 0;
  box.addEventListener('click', (e) => {
    const card = e.target.closest('.po-card');
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
    msg.textContent = done ? doneText : `对了！接着点第 ${next + 1} 个。`;
  });
}

/* ================= 古今对读：一句诗对一句课文，先说再点开 ================= */
function initDuidu(box, pairs) {
  box.innerHTML = pairs.map((p) => `<button class="dd-row" type="button">
      <span class="dd-gu">${p.a}</span><i class="dd-k">${p.k}</i>
      <span class="dd-jin"><em>课文里的哪句？说一说，再点开</em><span>${p.b}</span></span></button>`).join('');
  box.addEventListener('click', (e) => {
    const row = e.target.closest('.dd-row');
    if (row) row.classList.add('open');
  });
}

const ORDER = [
  { pic: 'chaoqian', label: '潮来前', t: '江面很平静……大家昂首东望，等着，盼着。' },
  { pic: 'chaotou', label: '潮来时', t: '只见白浪翻滚，形成一堵两丈多高的水墙。' },
  { pic: 'chaohou', label: '潮过后', t: '余波还在漫天卷地般涌来，江面上依旧风号浪吼。' },
];

const POEM_PAIRS = [
  { a: '八月涛声吼地来', k: '声音', b: '那声音如同山崩地裂，好像大地都被震得颤动起来。' },
  { a: '头高数丈触山回', k: '样子', b: '只见白浪翻滚，形成一堵两丈多高的水墙。' },
  { a: '须臾却入海门去', k: '潮去', b: '霎时，潮头奔腾西去……' },
  { a: '卷起沙堆似雪堆', k: '余波', b: '余波还在漫天卷地般涌来，江面上依旧风号浪吼。' },
];

/* 潮来时的“白色战马”和大堤上的人群：一排起伏的浪头、一排小人背影 */
const HORSES = 14;
const CROWD = 40;
function drawTide() {
  document.getElementById('tdHorses').innerHTML = Array.from({ length: HORSES }, (_, i) => {
    const x = 20 + i * 56;
    return `<path class="horse" style="animation-delay:${(i % 4) * 0.12}s" d="M${x} 250 q14 -34 34 -22 q-6 4 -4 10 q12 -2 14 12 q-20 -6 -44 0 Z"/>`;
  }).join('');
  document.getElementById('tdCrowd').innerHTML = Array.from({ length: CROWD }, (_, i) => {
    const x = 10 + i * 20 + (i % 3) * 3;
    const y = 418 - (i % 2) * 4;
    return `<circle cx="${x}" cy="${y - 14}" r="5"/><rect x="${x - 5}" y="${y - 10}" width="10" height="14" rx="4"/>`;
  }).join('');
}
drawTide();

window.LESSON = {
  init() {
    Narrative.init({});
    Poem.init();
    initPicOrder(document.getElementById('tideOrder'), ORDER, '排好了！潮来前 → 潮来时 → 潮过后。');
    initDuidu(document.getElementById('poemDuidu'), POEM_PAIRS);
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
