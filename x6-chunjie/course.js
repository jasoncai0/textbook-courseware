'use strict';
/* 北京的春节 · 本课数据与“春节日历”。页面逻辑见记叙文模板 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 课文写到的日子，按时间顺序。chars = 课文写这一段用的汉字数（按课本原文数，不含标点）；xiang = 详写；peak = 春节的高潮 */
const DAYS = [
  { d: '腊月初旬', s: '初旬', n: '春节开始', chars: 74, xiang: false, pic: 'laba',
    items: ['春节差不多在腊月的初旬就开始了', '“腊七腊八，冻死寒鸦”，一年里最冷的时候', '略写：几句话带过'] },
  { d: '腊月初八', s: '腊八', n: '腊八', chars: 174, xiang: true, pic: 'laba',
    items: ['熬腊八粥——“小型的农业产品展览会”', '泡腊八蒜——色如翡翠，色味双美'] },
  { d: '腊八以后', s: '腊月', n: '备年货', chars: 304, xiang: true, pic: 'nianhuo',
    items: ['铺户上年货，街上添了货摊子', '孩子们的三件事：杂拌儿、爆竹、玩意儿', '大人们预备吃的喝的用的，做新鞋新衣'] },
  { d: '腊月二十三', s: '廿三', n: '小年', chars: 156, xiang: true, pic: 'xiaonian',
    items: ['过春节的“彩排”', '祭灶王、放鞭炮', '麦芽糖、江米糖“粘住灶王的嘴”'] },
  { d: '二十三以后', s: '除夕前', n: '更忙了', chars: 111, xiang: false, pic: 'xiaonian',
    items: ['贴春联、扫房、预备吃食', '略写：三个“必须”一口气带过'] },
  { d: '除夕', s: '除夕', n: '真热闹', chars: 111, xiang: true, peak: true, pic: 'chuxi',
    items: ['做年菜、穿新衣、贴对联和年画', '灯火通宵，鞭炮声日夜不绝', '吃团圆饭、守岁', '字数不多，却句句是除夕特有的习俗'] },
  { d: '正月初一', s: '初一', n: '拜年 · 逛庙会', chars: 284, xiang: true, peak: true, pic: 'chuyi',
    items: ['与除夕截然不同：全城都在休息', '男人们拜年，女人们接待客人', '初五初六庙会风光：骑毛驴、买玩具、赛轿车赛马'] },
  { d: '正月初六', s: '初六', n: '开张', chars: 76, xiang: false, pic: 'miaohui',
    items: ['多数铺户开张，又放鞭炮', '略写：两句话带过'] },
  { d: '正月十五', s: '元宵', n: '火炽而美丽', chars: 341, xiang: true, peak: true, pic: 'yuanxiao',
    items: ['明月当空，悬灯结彩', '老铺挂出几百盏灯，冰灯、麦苗长龙', '孩子们放花炮、玩灯，吃元宵'] },
  { d: '正月十九', s: '十九', n: '春节结束', chars: 104, xiang: false, pic: 'yuanxiao',
    items: ['残灯末庙，学生上学，大人做事', '略写：“一眨眼”就结束了'] },
];

/* ================= 故事页右上角：春节日历（跟着 data-day 走） ================= */
function buildStrip() {
  const box = document.createElement('div');
  box.className = 'cj-strip';
  box.id = 'cjStrip';
  box.innerHTML = `<div class="cj-dots">${DAYS.map((x) => `<i title="${x.d}"><b>${x.s}</b></i>`).join('')}</div><span id="cjStripText"></span>`;
  document.getElementById('frame').appendChild(box);
}

function updateStrip(slide, step) {
  let src = slide.dataset.day !== undefined ? slide : null;
  slide.querySelectorAll('[data-day][data-step]').forEach((el) => { if (+el.dataset.step <= step) src = el; });
  const box = document.getElementById('cjStrip');
  box.classList.toggle('show', Boolean(src));
  if (!src) return;
  const k = +src.dataset.day;
  box.querySelectorAll('.cj-dots i').forEach((dot, i) => {
    dot.classList.toggle('cur', i === k);
    dot.classList.toggle('done', i < k);
  });
  document.getElementById('cjStripText').textContent = `${DAYS[k].d} · ${DAYS[k].n}`;
}

/* ================= 品读 · 时间轴 + 详略柱 ================= */
function buildLine() {
  const line = document.getElementById('cjLine');
  const max = Math.max(...DAYS.map((x) => x.chars));
  line.innerHTML = DAYS.map((x, i) => `<button type="button" class="cj-node${x.xiang ? ' xiang' : ''}${x.peak ? ' peak' : ''}" data-i="${i}" style="--h:${(x.chars / max * 86).toFixed(1)}%">
      <span class="cj-col"><span class="cj-bar"><em>${x.chars}</em></span></span>
      <span class="cj-dot"></span><b>${x.d}</b><small>${x.n}</small></button>`).join('');
  const total = DAYS.reduce((a, x) => a + x.chars, 0);
  const xiang = DAYS.filter((x) => x.xiang).reduce((a, x) => a + x.chars, 0);
  document.querySelector('.cj-total').innerHTML = `详写的 6 段占全文约 <b>${Math.round(xiang / total * 100)}%</b>`;
  line.addEventListener('click', (e) => {
    const node = e.target.closest('.cj-node');
    if (node) showDay(+node.dataset.i);
  });
  placePeak();
  new ResizeObserver(placePeak).observe(line);
}

// “春节的高潮”括号：从除夕盖到元宵（随布局实际位置摆放）
function placePeak() {
  const line = document.getElementById('cjLine');
  const peaks = [...line.querySelectorAll('.cj-node.peak')];
  const br = document.querySelector('.cj-peak');
  if (!peaks.length || !line.clientWidth) return;
  const box = line.parentElement.getBoundingClientRect();
  const a = peaks[0].getBoundingClientRect();
  const b = peaks[peaks.length - 1].getBoundingClientRect();
  Object.assign(br.style, { left: `${a.left - box.left}px`, width: `${b.right - a.left}px`, top: `${a.top - box.top}px`, height: `${b.bottom - a.top}px` });
}

function showDay(i) {
  const x = DAYS[i];
  document.querySelectorAll('#cjLine .cj-node').forEach((n, k) => n.classList.toggle('sel', k === i));
  document.getElementById('cjPic').style.backgroundImage = `url(assets/${x.pic}.jpg)`;
  document.getElementById('cjName').textContent = `${x.d} · ${x.n}`;
  document.getElementById('cjKind').textContent = `${x.xiang ? '详写' : '略写'} · ${x.chars} 字`;
  document.getElementById('cjKind').className = x.xiang ? 'xiang' : '';
  document.getElementById('cjItems').innerHTML = x.items.map((t) => `<li>${t}</li>`).join('');
}

/* 品读 · 孩子们过春节（课后第 2 题） */
const PICKS = {
  kids: [
    { t: '买杂拌儿', ok: true, why: '第一件事' }, { t: '买爆竹', ok: true, why: '第二件事' },
    { t: '买风筝、空竹、口琴', ok: true, why: '第三件事：玩意儿' }, { t: '收压岁钱', ok: false, why: '课文没写' },
    { t: '逛庙会、骑毛驴', ok: true, why: '初五初六' }, { t: '看春节联欢晚会', ok: false, why: '课文没写' },
    { t: '买花炮燃放', ok: true, why: '元宵节' }, { t: '玩走马灯、纱灯', ok: true, why: '元宵节家中的灯' },
    { t: '堆雪人', ok: false, why: '课文没写' }, { t: '守岁', ok: true, why: '除了很小的孩子，都要守岁' },
  ],
};

/* 品读 · 京味儿词语（课后第 3 题加点词） */
const CLUE_LABELS = ['京味儿词语', '意思'];
const CLUES = [
  { q: '零七八碎儿', a: '零零碎碎的小东西。“七”“八”说得热闹，带儿化，口语味十足。' },
  { q: '杂拌儿', a: '用各种干果和蜜饯掺和成的年货。“拌儿”读儿化。' },
  { q: '玩意儿', a: '玩具，小东西。北京人说“玩意儿”，不说“玩具”。' },
  { q: '闲在', a: '清闲自在，没什么事做。北京方言，“在”读轻声。' },
];

/* 读与写 · 习作准备：先定详略再写 */
const MOMENTS = [
  {
    name: '我家的除夕', pic: 'chuxi',
    prompt: '写你家的除夕：一整天都在忙，哪一段最热闹、最有特色？把它写详细，其他一两句带过。',
    hint: '可以略写：上午贴春联、打扫；详写：年夜饭或守岁。写出看到的、听到的、闻到的。',
    example: '一大早，我们就贴好了春联，把屋子打扫得干干净净。（略）\n最热闹的是年夜饭。圆桌上摆满了菜，奶奶端出一大盘饺子，热气直往上冒……（详）',
  },
  {
    name: '拜年', pic: 'chuyi',
    prompt: '正月初一去拜年：一路上去了好几家，哪一家、哪一个场面最难忘？抓住它写具体。',
    hint: '去了几家可以一句话带过；最难忘的那一家，写清楚人物说了什么、做了什么，你心里怎么想。',
    example: '初一这天，我跟着爸爸妈妈走了好几家亲戚。（略）\n到了姥姥家，门还没进，就听见姥姥在院子里喊：“我的大孙子来喽！”……（详）',
  },
  {
    name: '家乡的一种风俗', pic: 'miaohui',
    prompt: '单元习作“家乡的风俗”：介绍一种风俗，先想想它有哪几个方面，重点介绍哪一个。',
    hint: '可以穿插风俗的来历：“听爸爸说，这个习俗大有来历呢……”重点部分写自己的亲身体验。',
    example: '我们家乡元宵节有“走百病”的习俗。（来历、时间：略）\n那天晚上，我和小伙伴们提着灯笼，从村东头的桥上走过去……（经历：详）',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ picks: PICKS, clues: CLUES, clueLabels: CLUE_LABELS, moments: MOMENTS });
    buildStrip();
    buildLine();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateStrip(slide, step);
    if (slide.querySelector('#cjLine')) placePeak();
  },
};
