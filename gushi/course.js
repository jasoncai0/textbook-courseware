'use strict';
/* 古诗三首 · 本课数据。诗文模板见 ../shared/poem.js，画面与选一选见 ../shared/narrative.js */

const POEMS = {
  ltsha: {
    title: '浪淘沙（其一）', author: '［唐］刘禹锡',
    lines: [
      { t: '九曲黄河万里沙，', r: '九曲/黄河/万里沙，', f: '1.2 40% 70%' },
      { t: '浪淘风簸自天涯。', r: '浪淘/风簸/自天涯。', f: '1.3 30% 45%' },
      { t: '如今直上银河去，', r: '如今/直上/银河去，', f: '1.25 60% 25%' },
      { t: '同到牵牛织女家。', r: '同到/牵牛/织女家。', f: '1.1 60% 20%' },
    ],
    notes: { 浪淘沙: '唐代曲名', 九曲: '形容河道弯弯曲曲', 簸: '颠簸', 天涯: '天边，极远的地方', 牵牛: '牵牛星，即牛郎星', 织女: '织女星' },
  },
  jnc: {
    title: '江南春', author: '［唐］杜牧',
    lines: [
      { t: '千里莺啼绿映红，', r: '千里/莺啼/绿映红，', f: '1.25 60% 40%' },
      { t: '水村山郭酒旗风。', r: '水村/山郭/酒旗风。', f: '1.3 55% 60%' },
      { t: '南朝四百八十寺，', r: '南朝/四百八十寺，', f: '1.25 70% 30%' },
      { t: '多少楼台烟雨中。', r: '多少/楼台/烟雨中。', f: '1.1 65% 30%' },
    ],
    notes: { 山郭: '山城，山村', 酒旗: '酒招子，酒馆外悬挂的旗子', 南朝: '先后建都于建康（今南京）的宋、齐、梁、陈四个朝代', 四百八十寺: '虚指，形容寺院很多' },
  },
  hyx: {
    title: '书湖阴先生壁', author: '［宋］王安石',
    lines: [
      { t: '茅檐长扫净无苔，', r: '茅檐/长扫/净无苔，', f: '1.35 40% 40%' },
      { t: '花木成畦手自栽。', r: '花木/成畦/手自栽。', f: '1.3 40% 70%' },
      { t: '一水护田将绿绕，', r: '一水/护田/将绿绕，', f: '1.25 30% 65%' },
      { t: '两山排闼送青来。', r: '两山/排闼/送青来。', f: '1.15 55% 35%' },
    ],
    notes: { 湖阴先生: '杨骥（字德逢）的别号，王安石的邻居', 苔: '青苔', 畦: '一块块排列整齐、有土埂围着的种花木的土地', 排闼: '推开门。闼，小门' },
  },
};
Poem.render(POEMS); // 必须在 deck.js 统计分步之前生成诗句

/* 浪淘沙 · 词语卡 */
const CLUE_LABELS = ['这个词……', '写出了黄河……'];
const CLUES = [
  { q: '九曲', a: '弯多——弯弯曲曲，绕过无数山川。' },
  { q: '万里沙', a: '路长、沙多——奔流万里，裹挟泥沙。' },
  { q: '浪淘风簸', a: '浪大、风急——波涛翻滚，颠簸起伏。' },
  { q: '自天涯', a: '来得远——仿佛从天边奔来。' },
];

/* 江南春 · 选景物 */
const PICKS = {
  jnc: [
    { t: '莺', ok: true, why: '莺啼' }, { t: '柳絮', ok: false, why: '诗里没写' },
    { t: '绿树', ok: true, why: '绿' }, { t: '红花', ok: true, why: '红' },
    { t: '水村', ok: true }, { t: '山郭', ok: true }, { t: '渔船', ok: false, why: '诗里没写' },
    { t: '酒旗', ok: true, why: '酒旗风' }, { t: '寺庙楼台', ok: true, why: '四百八十寺' },
    { t: '燕子', ok: false, why: '诗里没写' }, { t: '烟雨', ok: true, why: '烟雨中' },
  ],
};

/* 黄河的弯和浪 */
function buildRiver() {
  const svg = document.getElementById('river');
  const path = svg.querySelector('.yellow-river');
  const len = path.getTotalLength();
  const BENDS = 9;
  svg.querySelector('.bends').innerHTML = Array.from({ length: BENDS }, (_, i) => {
    const p = path.getPointAtLength(len * (i + .5) / BENDS);
    return `<g class="pop" style="animation-delay:${(.3 + i * .18).toFixed(2)}s"><circle cx="${p.x.toFixed(0)}" cy="${p.y.toFixed(0)}" r="10" fill="#f6e7c1"/><text class="t-s t-c" x="${p.x.toFixed(0)}" y="${(p.y + 4).toFixed(0)}" fill="#6b4b1a">${i + 1}</text></g>`;
  }).join('');
  svg.querySelector('.waves').innerHTML = Array.from({ length: 10 }, (_, i) => {
    const p = path.getPointAtLength(len * (i + 1) / 12);
    return `<path class="wave" d="M${(p.x - 14).toFixed(0)} ${p.y.toFixed(0)} q7 -10 14 0 t14 0" fill="none" stroke="#fff4d6" stroke-width="3" style="animation-delay:${(i * .12).toFixed(2)}s"/>`;
  }).join('');
  svg.querySelector('.stars').innerHTML = Array.from({ length: 40 }, (_, i) =>
    `<circle cx="${(280 + (i * 53) % 240)}" cy="${(i * 37) % 200}" r="${1 + (i % 3) * .6}" fill="#fff"/>`).join('');
}

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: CLUE_LABELS, picks: PICKS });
    Poem.init();
    buildRiver();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
