'use strict';
/* 古诗三首（三下 9）· 本课数据。诗文模板见 ../shared/poem.js，分类见 ../shared/narrative.js */

const POEMS = {
  yuanri: {
    title: '元日', author: '［宋］王安石',
    lines: [
      { t: '爆竹声中一岁除，', r: '爆竹/声中/一岁除，', f: '1.25 35% 40%' },
      { t: '春风送暖入屠苏。', r: '春风/送暖/入屠苏。', f: '1.25 60% 55%' },
      { t: '千门万户曈曈日，', r: '千门/万户/曈曈日，', f: '1.1 50% 30%' },
      { t: '总把新桃换旧符。', r: '总把/新桃/换旧符。', f: '1.3 45% 60%' },
    ],
    notes: {
      一岁除: '一年过去了（补充）',
      屠苏: '这里指一种酒，根据古代风俗，常在元日饮用',
      曈曈: '形容太阳出来后天色渐亮的样子',
      新桃: '新桃符。桃符是古代新年时悬挂于大门上的辟邪门饰，春联的前身',
      旧符: '旧桃符。“新桃换旧符”：用新桃符换下旧桃符',
    },
  },
  qingming: {
    title: '清明', author: '［唐］杜牧',
    lines: [
      { t: '清明时节雨纷纷，', r: '清明/时节/雨纷纷，', f: '1.15 50% 35%' },
      { t: '路上行人欲断魂。', r: '路上/行人/欲断魂。', f: '1.3 40% 55%' },
      { t: '借问酒家何处有？', r: '借问/酒家/何处有？', f: '1.25 55% 55%' },
      { t: '牧童遥指杏花村。', r: '牧童/遥指/杏花村。', f: '1.3 70% 40%' },
    ],
    notes: {
      清明: '我国传统节日，有扫墓、踏青等习俗',
      断魂: '形容非常愁苦、伤心（补充）',
      借问: '请问（补充）',
      杏花村: '杏花深处的村庄（补充）',
    },
  },
  chongyang: {
    title: '九月九日忆山东兄弟', author: '［唐］王维',
    lines: [
      { t: '独在异乡为异客，', r: '独在/异乡/为异客，', f: '1.3 70% 50%' },
      { t: '每逢佳节倍思亲。', r: '每逢/佳节/倍思亲。', f: '1.15 60% 45%' },
      { t: '遥知兄弟登高处，', r: '遥知/兄弟/登高处，', f: '1.3 30% 35%' },
      { t: '遍插茱萸少一人。', r: '遍插/茱萸/少一人。', f: '1.4 30% 35%' },
    ],
    notes: {
      异乡: '他乡，外地（补充）',
      佳节: '美好的节日（补充）',
      倍: '加倍，更加（补充）',
      登高: '重阳节有登高的习俗',
      茱萸: '一种香气浓郁的植物，古人在重阳节有插戴茱萸的习俗',
    },
  },
};
Poem.render(POEMS); // 必须在 deck.js 统计分步之前生成诗句

/* 习俗卡小图标（64×64） */
const ICONS = {
  baozhu: '<g fill="#c8312a"><rect x="12" y="26" width="11" height="30" rx="2"/><rect x="26" y="20" width="11" height="36" rx="2"/><rect x="40" y="28" width="11" height="28" rx="2"/></g><g fill="#f2c94c"><rect x="12" y="26" width="11" height="4"/><rect x="26" y="20" width="11" height="4"/><rect x="40" y="28" width="11" height="4"/></g><path d="M31 20 q2 -9 10 -11" stroke="#5a3a1a" stroke-width="2" fill="none"/><g stroke="#f2a33a" stroke-width="2.5" stroke-linecap="round"><path d="M44 7 l5 -4 M46 11 l7 -1 M40 5 l0 -4"/></g>',
  jiu: '<path d="M16 24 h32 l-5 24 q-11 7 -22 0 Z" fill="#b8733a"/><ellipse cx="32" cy="24" rx="16" ry="4" fill="#e8c38a"/><path d="M24 16 q-3 -5 0 -10 M32 16 q-3 -5 0 -10 M40 16 q-3 -5 0 -10" stroke="#c9b9a6" stroke-width="2" fill="none"/><rect x="22" y="54" width="20" height="4" rx="2" fill="#8a5a2a"/>',
  taofu: '<rect x="18" y="8" width="28" height="50" fill="#8a5a2a"/><line x1="32" y1="8" x2="32" y2="58" stroke="#5a3a1a" stroke-width="2"/><rect x="8" y="10" width="8" height="44" fill="#c8312a"/><rect x="48" y="10" width="8" height="44" fill="#c8312a"/><rect x="18" y="2" width="28" height="7" fill="#c8312a"/><circle cx="28" cy="34" r="1.8" fill="#f2c94c"/><circle cx="36" cy="34" r="1.8" fill="#f2c94c"/>',
  saomu: '<path d="M32 58 L32 30 M32 50 L22 30 M32 50 L42 30" stroke="#4f7a3a" stroke-width="2.5" fill="none"/><g fill="#fff" stroke="#d8cfa8"><circle cx="22" cy="26" r="8"/><circle cx="42" cy="26" r="8"/><circle cx="32" cy="20" r="9"/></g><g fill="#f2c94c"><circle cx="22" cy="26" r="3"/><circle cx="42" cy="26" r="3"/><circle cx="32" cy="20" r="3.5"/></g><path d="M24 46 h16 l-3 8 h-10 Z" fill="#8a8f96"/>',
  taqing: '<rect x="4" y="50" width="56" height="10" rx="3" fill="#8cc06a"/><rect x="29" y="30" width="6" height="22" fill="#8a5a2a"/><circle cx="32" cy="24" r="15" fill="#6fb35a"/><g fill="#f6c2cf"><circle cx="24" cy="20" r="3"/><circle cx="38" cy="18" r="3"/><circle cx="34" cy="30" r="3"/></g>',
  fengzheng: '<path d="M32 4 L50 26 L32 48 L14 26 Z" fill="#e2704f"/><path d="M32 4 L32 48 M14 26 L50 26" stroke="#fff" stroke-width="2"/><path d="M32 48 q-6 5 0 8 t0 8" stroke="#5a7fa8" stroke-width="2" fill="none"/>',
  denggao: '<path d="M2 60 L26 14 L40 38 L48 28 L62 60 Z" fill="#7aa36a"/><path d="M26 14 L20 26 L32 26 Z" fill="#e9efe0"/><line x1="26" y1="14" x2="26" y2="2" stroke="#5a3a1a" stroke-width="2"/><path d="M26 2 h10 l-3 4 l3 4 h-10" fill="#c8312a"/>',
  zhuyu: '<path d="M10 56 Q30 40 54 10" stroke="#6b4b2a" stroke-width="3" fill="none"/><g fill="#4f8a4a"><ellipse cx="22" cy="40" rx="8" ry="4" transform="rotate(-30 22 40)"/><ellipse cx="42" cy="26" rx="8" ry="4" transform="rotate(30 42 26)"/></g><g fill="#d22f2f"><circle cx="30" cy="44" r="4"/><circle cx="36" cy="40" r="4"/><circle cx="33" cy="50" r="4"/><circle cx="48" cy="20" r="4"/><circle cx="52" cy="26" r="4"/></g>',
  juhua: `<g fill="#f2b62c">${Array.from({ length: 12 }, (_, i) => `<ellipse cx="32" cy="16" rx="4" ry="12" transform="rotate(${i * 30} 32 28)"/>`).join('')}</g><circle cx="32" cy="28" r="7" fill="#d98a1c"/><path d="M32 40 V62" stroke="#4f8a4a" stroke-width="3"/>`,
};

/* 习俗卡：诗句是证据，没写进诗里的标“诗外知识” */
const XISU = {
  chunjie: [
    { icon: 'baozhu', name: '放爆竹', line: '爆竹声中一岁除', say: '爆竹一响，旧的一年过去了。' },
    { icon: 'jiu', name: '喝屠苏酒', line: '春风送暖入屠苏', say: '古人在正月初一喝屠苏酒。' },
    { icon: 'taofu', name: '换桃符', line: '总把新桃换旧符', say: '桃符是春联的前身，今天我们贴春联。' },
  ],
  qingming: [
    { icon: 'saomu', name: '扫墓', line: '路上行人欲断魂', say: '祭扫先人，怀念亲人，心里难过。' },
    { icon: 'taqing', name: '踏青', line: '牧童遥指杏花村', say: '杏花开了，人们到郊外春游。' },
    { icon: 'fengzheng', name: '放风筝', line: '诗外知识', say: '清明前后，还有放风筝、插柳的习俗。' },
  ],
  chongyang: [
    { icon: 'denggao', name: '登高', line: '遥知兄弟登高处', say: '重阳节，人们一起登上高处。' },
    { icon: 'zhuyu', name: '插茱萸', line: '遍插茱萸少一人', say: '人人插戴茱萸，偏偏少了诗人。' },
    { icon: 'juhua', name: '赏菊', line: '诗外知识', say: '九月菊花开，人们赏菊、喝菊花酒。' },
  ],
};

function renderXisu() {
  document.querySelectorAll('[data-xisu]').forEach((box) => {
    box.innerHTML = XISU[box.dataset.xisu].map((c, i) => `<div class="xs-card" data-step="${i + 1}">
      <svg viewBox="0 0 64 64" class="xs-icon pop">${ICONS[c.icon]}</svg>
      <div><b>${c.name}</b><q class="${c.line === '诗外知识' ? 'extra' : ''}">${c.line}</q><span>${c.say}</span></div></div>`).join('');
  });
}
renderXisu(); // 同样要在 deck.js 统计分步之前

/* 连一连：诗句 → 节日 */
const KINDS = ['春节', '清明节', '重阳节'];
const SORT_ITEMS = [
  { s: '爆竹声中一岁除', ok: ['春节'], q: '放爆竹，旧年过去' },
  { s: '清明时节雨纷纷', ok: ['清明节'], q: '诗里直接写了“清明”' },
  { s: '遥知兄弟登高处', ok: ['重阳节'], q: '重阳登高' },
  { s: '总把新桃换旧符', ok: ['春节'], q: '新年换桃符' },
  { s: '遍插茱萸少一人', ok: ['重阳节'], q: '重阳插茱萸' },
  { s: '牧童遥指杏花村', ok: ['清明节'], q: '杏花开在清明前后' },
];

function initFestTable() {
  document.querySelectorAll('.fest-table').forEach((t) => t.addEventListener('click', (e) => {
    const cell = e.target.closest('.cell');
    if (cell) cell.classList.toggle('open');
  }));
}

window.LESSON = {
  init() {
    Narrative.init({ kinds: KINDS, sort: SORT_ITEMS });
    Poem.init();
    initFestTable();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
