'use strict';
/* 白鹭 · 本课逻辑：第 5 段“增减”互动、挖空背诵。故事页 / 朗读符号用 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

const GROUND_Y = 352;
const LEG_BASE = 120;
const LEG_PER_STEP = 26;
const NECK_PER_STEP = 10;
const BEAK = '#3e3f3f'; // 铁色
const LEG = '#4f7f6f'; // 青色

// tone < 0：越来越白，轮廓化进背景（嫌白）；tone > 0：越来越黑（嫌黑）
function featherColors(tone) {
  if (tone > 0) {
    const g = Math.round(253 - tone * 42);
    return { fill: `rgb(${g - 6},${g},${g})`, stroke: '#7d8787' };
  }
  const a = 1 + tone / 3.2;
  return { fill: '#ffffff', stroke: `rgba(150,166,166,${a.toFixed(2)})` };
}

function drawEgret(len, tone) {
  const leg = LEG_BASE + len * LEG_PER_STEP;
  const n = len * NECK_PER_STEP;
  const bx = 320;
  const by = GROUND_Y - leg - 20;
  const { fill, stroke } = featherColors(tone);
  document.getElementById('egretBird').innerHTML = `
    <g stroke="${LEG}" stroke-width="5" stroke-linecap="round" fill="none">
      <path d="M${bx - 8} ${by + 22} L${bx - 14} ${GROUND_Y} l-14 4 M${bx + 14} ${by + 22} L${bx + 22} ${GROUND_Y} l14 3"/></g>
    <g stroke="${stroke}" stroke-width="2" fill="${fill}">
      <path d="M${bx + 60} ${by - 8} q40 4 70 26 q-40 -2 -66 -10 M${bx + 56} ${by - 2} q36 14 60 40 q-36 -12 -58 -26" fill="none"/>
      <path d="M${bx - 52} ${by - 12} C${bx - 104} ${by - 40} ${bx - 40} ${by - 100 - n} ${bx - 86} ${by - 140 - n}" stroke-width="20" fill="none" stroke-linecap="round"/>
      <path d="M${bx - 52} ${by - 12} C${bx - 104} ${by - 40} ${bx - 40} ${by - 100 - n} ${bx - 86} ${by - 140 - n}" stroke-width="16" stroke="${fill}" fill="none" stroke-linecap="round"/>
      <ellipse cx="${bx}" cy="${by}" rx="80" ry="33" transform="rotate(-12 ${bx} ${by})"/>
      <circle cx="${bx - 88}" cy="${by - 144 - n}" r="13"/>
      <path d="M${bx - 80} ${by - 150 - n} q30 -6 46 6 M${bx - 80} ${by - 146 - n} q26 2 40 14" fill="none"/></g>
    <path d="M${bx - 100} ${by - 146 - n} L${bx - 178} ${by - 134 - n}" stroke="${BEAK}" stroke-width="5" stroke-linecap="round"/>
    <circle cx="${bx - 92}" cy="${by - 147 - n}" r="2.6" fill="#c9a227"/>`;
  const verdict = [];
  if (len > 0) verdict.push('增之一分则嫌长');
  if (len < 0) verdict.push('减之一分则嫌短');
  if (tone < 0) verdict.push('素之一忽则嫌白');
  if (tone > 0) verdict.push('黛之一忽则嫌黑');
  const el = document.getElementById('egretVerdict');
  el.textContent = verdict.length ? verdict.join('；') : '恰到好处';
  el.setAttribute('fill', verdict.length ? '#9b3b2a' : '#2a4a52');
}

function initEgret() {
  const len = document.getElementById('egretLen');
  const tone = document.getElementById('egretTone');
  const update = () => drawEgret(+len.value, +tone.value);
  len.addEventListener('input', update);
  tone.addEventListener('input', update);
  update();
}

/* 比一比：四种鸟的小剪影，大小、颜色按课文 */
const BIRDS = {
  crane: { scale: 1, fill: '#ffffff', crown: '#c8372d', tail: '#2b2b2b' },
  ibis: { scale: .86, fill: '#f3b8b0', crown: '#d9483b' },
  grey: { scale: .86, fill: '#a7b0b3' },
  egret: { scale: .7, fill: '#ffffff' },
};
function birdIcon({ scale, fill, crown, tail }) {
  return `<svg viewBox="0 0 200 170"><path d="M10 164 H190" stroke="#cfdcd9" stroke-width="3"/>
    <g transform="translate(100 164) scale(${scale}) translate(-100 -164)" stroke="#8d9a9a" stroke-width="1.5">
      <path d="M100 118 L96 164 M112 118 L118 164" stroke="#5b6f68" stroke-width="3"/>
      <ellipse cx="108" cy="104" rx="42" ry="19" fill="${fill}" transform="rotate(-12 108 104)"/>
      ${tail ? `<path d="M138 98 q20 8 28 22 q-18 -4 -30 -12 Z" fill="${tail}"/>` : ''}
      <path d="M76 98 C 52 80, 84 52, 62 30" stroke-width="12" fill="none" stroke-linecap="round"/>
      <path d="M76 98 C 52 80, 84 52, 62 30" stroke="${fill}" stroke-width="9" fill="none" stroke-linecap="round"/>
      <circle cx="60" cy="28" r="8" fill="${fill}"/>${crown ? `<circle cx="60" cy="22" r="4" fill="${crown}" stroke="none"/>` : ''}
      <path d="M54 29 L22 36" stroke="#3e3f3f" stroke-width="3" stroke-linecap="round"/></g></svg>`;
}

function initCloze() {
  const btn = document.getElementById('clozeToggle');
  const slide = btn.closest('.slide');
  btn.addEventListener('click', () => {
    const on = slide.classList.toggle('cloze-on');
    slide.querySelectorAll('.cz').forEach((c) => c.classList.remove('peek'));
    btn.textContent = on ? '显示全文' : '挖空背诵';
  });
  slide.addEventListener('click', (e) => {
    const cz = e.target.closest('.cz');
    if (cz && slide.classList.contains('cloze-on')) cz.classList.toggle('peek');
  });
}

window.LESSON = {
  init() {
    Narrative.init({});
    initEgret();
    initCloze();
    document.querySelectorAll('[data-bird]').forEach((el) => { el.innerHTML = birdIcon(BIRDS[el.dataset.bird]); });
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
