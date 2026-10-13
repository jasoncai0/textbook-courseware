'use strict';
/* 梅岭三章 · 本课数据与互动：三章竖排吟诵（节奏开关 + 情感层次）、意象卡（翻面 + 两类归位）、关键句翻卡、背诵挖空、意象赏析 */

const POEMS = {
  p1: { title: '其一', author: '陈毅', lines: [{ t: '断头今日意如何？', r: '断头/今日/意如何？' }, { t: '创业艰难百战多。', r: '创业/艰难/百战多。' }, { t: '此去泉台招旧部，', r: '此去/泉台/招旧部，' }, { t: '旌旗十万斩阎罗。', r: '旌旗/十万/斩阎罗。' }] },
  p2: { title: '其二', author: '陈毅', lines: [{ t: '南国烽烟正十年，', r: '南国/烽烟/正十年，' }, { t: '此头须向国门悬。', r: '此头/须向/国门悬。' }, { t: '后死诸君多努力，', r: '后死/诸君/多努力，' }, { t: '捷报飞来当纸钱。', r: '捷报/飞来/当纸钱。' }] },
  p3: { title: '其三', author: '陈毅', lines: [{ t: '投身革命即为家，', r: '投身/革命/即为家，' }, { t: '血雨腥风应有涯。', r: '血雨/腥风/应有涯。' }, { t: '取义成仁今日事，', r: '取义/成仁/今日事，' }, { t: '人间遍种自由花。', r: '人间/遍种/自由花。' }] },
};
Poem.render(POEMS);

/* ---------- 三章竖排：每首一步出现，下一步出情感标签 ---------- */
const MOODS = [
  { key: '断头', mood: '视死如归', d: '回顾百战艰难，想象到了泉台仍要召集牺牲的战友，率十万旌旗斩阎罗。' },
  { key: '捷报', mood: '以身许国', d: '十年战火，甘愿头悬国门；嘱托后死诸君努力，以捷报作纸钱祭奠自己。' },
  { key: '自由花', mood: '必胜信念', d: '以革命为家，相信血雨腥风终有尽头，为理想献身，换来人间遍开自由花。' },
];

function buildChant() {
  const box = document.getElementById('chant');
  box.innerHTML = ['p1', 'p2', 'p3'].map((id, i) => `<div class="ch-poem" data-step="${i * 2 + 1}">
    <h3>${POEMS[id].title}</h3>
    ${POEMS[id].lines.map((l) => `<p><span class="plain">${l.t}</span><span class="rhy">${l.r.replace(/\//g, '<i>/</i>')}</span></p>`).join('')}
    <div class="ch-mood" data-step="${i * 2 + 2}"><b>${MOODS[i].key}</b><em>${MOODS[i].mood}</em><small>${MOODS[i].d}</small></div>
  </div>`).join('');
}
buildChant();

/* ---------- 意象卡 ---------- */
const IMAGES = [
  { w: '泉台', g: 0, note: '人死后埋葬的地方，也指阴间。', mean: '直面死亡，写出处境的险恶。' },
  { w: '烽烟', g: 0, note: '原指报警的烟火，泛指战火、战争。', mean: '十年战火，征程艰辛。' },
  { w: '血雨腥风', g: 0, note: '形容残酷的屠杀和斗争。', mean: '革命道路的残酷与艰险。' },
  { w: '旧部', g: 0, note: '过去的部下，指为革命牺牲的同志。', mean: '缅怀牺牲的战友。' },
  { w: '旌旗十万', g: 1, note: '旌旗，旗帜的总称，借指军士。', mean: '死后仍要率军战斗，不屈的意志。' },
  { w: '斩阎罗', g: 1, note: '阎罗，民间传说中掌管阴间的神。', mean: '连阴间的王也要斩，气魄豪迈。' },
  { w: '捷报', g: 1, note: '胜利的消息，“飞来当纸钱”。', mean: '用胜利祭奠自己，坚信革命会胜利。' },
  { w: '自由花', g: 1, note: '“人间遍种自由花”。', mean: '对美好未来的憧憬与必胜的信念。' },
];
const GROUPS = ['艰辛 · 缅怀', '意志 · 信念'];

function renderCards(sorted) {
  const order = sorted ? [...IMAGES].sort((a, b) => a.g - b.g) : [...IMAGES].sort(() => Math.random() - 0.5);
  document.getElementById('imgCards').innerHTML = order.map((c) => `<button type="button" class="ic${sorted ? ` g${c.g}` : ''}">
    <span class="ic-front"><b>${c.w}</b>${sorted ? `<small>${GROUPS[c.g]}</small>` : ''}</span>
    <span class="ic-back"><i>注释</i>${c.note}<i>含义</i>${c.mean}</span></button>`).join('');
  document.getElementById('imgCards').classList.toggle('sorted', sorted);
}

function initCards() {
  const box = document.getElementById('imgCards');
  renderCards(false);
  box.addEventListener('click', (e) => {
    const c = e.target.closest('.ic');
    if (c) c.classList.toggle('open');
  });
  document.getElementById('imgSort').addEventListener('click', () => renderCards(true));
  document.getElementById('imgReset').addEventListener('click', () => renderCards(false));
}

const CLUES = [
  { q: '断头今日意如何？', a: '自问开篇：面对“断头”的结局，心里想什么？不是恐惧，而是回顾“创业艰难百战多”——想的仍是革命事业。' },
  { q: '此去泉台招旧部，旌旗十万斩阎罗。', a: '浪漫主义的想象：死后到了阴间，也要召集牺牲的战友，组成十万大军斩杀阎罗——战斗到底，视死如归。' },
  { q: '后死诸君多努力，捷报飞来当纸钱。', a: '对幸存同志的嘱托：不要为我烧纸钱，你们打了胜仗，胜利的消息就是对我最好的祭奠。' },
  { q: '取义成仁今日事，人间遍种自由花。', a: '“取义成仁”即舍生取义、杀身成仁：今天为人民的解放事业牺牲，换来的是人间处处开满自由之花。' },
];

const MOMENTS = [
  {
    name: '捷报', pic: 'hanmei',
    prompt: '为“捷报飞来当纸钱”中的“捷报”写一段赏析。',
    hint: '写清三层：它本来指什么——诗中把它比作什么——表达了怎样的情感。',
    example: '“捷报”本是胜利的消息，诗人却说它“飞来当纸钱”。纸钱是祭奠死者用的，诗人不要纸钱，只要胜利——他牵挂的不是自己的身后事，而是革命能否成功。一个“飞”字写出捷报纷纷传来的景象，透出对胜利的坚定信心。',
  },
  {
    name: '自由花', pic: 'ziyouhua',
    prompt: '为“人间遍种自由花”中的“自由花”写一段赏析。',
    hint: '想一想：为什么是“花”？“遍种”写出了什么？和前一句“取义成仁”有什么关系？',
    example: '“自由花”把抽象的自由写成了可以播种、可以开放的花朵，美丽而充满生机。“遍种”说明诗人盼望的不是一处一地的胜利，而是整个人间的解放。前一句是“今日”的牺牲，这一句是未来的花开——用牺牲换来自由，诗人无怨无悔。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: ['读这一句', '理解'], moments: MOMENTS });
    Poem.init();
    initCards();
    document.querySelector('.rh-btn').addEventListener('click', (e) => {
      const on = document.getElementById('chant').classList.toggle('show-rhy');
      e.target.textContent = on ? '隐藏节奏' : '显示节奏';
    });
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
