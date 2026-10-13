'use strict';
/* 小虾（三下 15*，略读）· 本课数据与互动。选一选见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

const PICKS = {
  key: [
    { t: '缸里的小虾十分有趣。', ok: true, why: '对！后面的句子都在说明“有趣”' },
    { t: '它们有的独自荡来荡去，有的互相追逐，有的紧贴住缸壁。', ok: false, why: '这只写了平时的样子' },
    { t: '如果这时碰到正在闲游的同伴，说不定就要打起来。', ok: false, why: '这只写了碰到同伴' },
    { t: '小虾的搏斗很激烈，蹦出水面是常有的事。', ok: false, why: '这只写了搏斗' },
  ],
};

/* 小虾示意图：腿、钳子、胡须、眼珠四个部位，分步动起来（动画写在 course.css，靠 .ph 的 on 状态触发） */
function buildShrimp() {
  const body = [[248, 150, 40, 32], [302, 160, 34, 28], [350, 174, 28, 24], [390, 192, 22, 20], [420, 212, 18, 16]]
    .map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="rgba(214,234,238,.85)" stroke="#6d9aa6" stroke-width="2.5"/>`).join('');
  const smallLegs = [240, 270, 300, 330].map((x) => `<path d="M${x} 176 q-6 22 -14 30" stroke="#6d9aa6" stroke-width="3" fill="none"/>`).join('');
  const bubbles = [[520, 60, 8], [550, 110, 5], [500, 140, 6], [80, 270, 7], [560, 250, 9]]
    .map(([x, y, r]) => `<circle class="bub" cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#fff" stroke-width="2"/>`).join('');
  document.getElementById('shrimp').innerHTML = `
    <rect width="600" height="320" rx="14" fill="#9fd0dc"/>
    <path d="M0 290 Q150 270 300 292 T600 286 V320 H0 Z" fill="#c9b48b"/>
    <path d="M40 300 q10 -60 -6 -110 M60 300 q-6 -50 14 -90 M540 300 q8 -40 -10 -80" stroke="#4f8a4a" stroke-width="5" fill="none"/>
    ${bubbles}
    <g class="whisker"><path d="M132 126 Q70 60 14 46" stroke="#4d7a86" stroke-width="2.5" fill="none"/><path d="M136 132 Q90 40 40 14" stroke="#4d7a86" stroke-width="2.5" fill="none"/></g>
    <g class="legs">
      <path d="M176 172 L130 214 L82 228" stroke="#6d9aa6" stroke-width="4" fill="none" stroke-linejoin="round"/>
      <g class="claw"><path class="claw-a" d="M84 228 q-20 -16 -40 -8" stroke="#4d7a86" stroke-width="5" fill="none" stroke-linecap="round"/><path class="claw-b" d="M84 228 q-22 6 -40 0" stroke="#4d7a86" stroke-width="5" fill="none" stroke-linecap="round"/></g>
    </g>
    ${smallLegs}${body}
    <path d="M430 220 l40 6 l-12 -30 Z M430 222 l30 30 l4 -30 Z" fill="rgba(214,234,238,.9)" stroke="#6d9aa6" stroke-width="2"/>
    <path d="M140 140 q20 -40 80 -30 q40 10 40 40 q-20 34 -80 30 q-34 -4 -40 -40 Z" fill="rgba(214,234,238,.9)" stroke="#6d9aa6" stroke-width="2.5"/>
    <path d="M142 134 L96 124 L142 128" fill="#b7d4da" stroke="#6d9aa6" stroke-width="2"/>
    <line x1="166" y1="118" x2="156" y2="100" stroke="#4d7a86" stroke-width="3"/>
    <g class="eye"><circle cx="155" cy="96" r="9" fill="#2b2420"/><circle cx="152" cy="93" r="2.5" fill="#fff"/></g>`;
}
buildShrimp();

window.LESSON = {
  init() {
    Narrative.init({ picks: PICKS });
    document.querySelectorAll('.cell').forEach((c) => c.addEventListener('click', () => c.classList.toggle('open')));
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
