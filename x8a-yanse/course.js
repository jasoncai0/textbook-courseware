'use strict';
/* 美丽的颜色 · 本课独有的“提炼过程”与“色板”。通用互动见 ../shared/narrative.js */

/* 提炼过程：q 为课文原句；yr 为时间条进度（0~1，只作示意） */
const PROC = [
  { t: '原料', q: '他们炼制沥青铀矿的设备极其简陋……炼制的大部分工作就必须在院子的露天地里进行。', yr: 0.05 },
  { t: '共同离析', q: '第一年里，他们共同从事镭和钋的化学离析工作，并且研究他们所得到的活性产物的放射性。', yr: 0.25 },
  { t: '分工', q: '比埃尔便试着确定镭的特性，以求熟悉这种新金属。玛丽继续炼制，提取纯镭盐。', yr: 0.35 },
  { t: '一家工厂', q: '“我一次炼制 20 公斤材料……连续几小时搅动熔化锅里沸腾着的材料，这真是一种极累人的工作。”', yr: 0.5 },
  { t: '最难的一步', q: '最困难的，或者说几乎不可能的，乃是离析这极小含量的物质，使它从与它密切混合着的杂质中分离出来。', yr: 0.7 },
  { t: '坚持', q: '工作日变成了工作月，工作月变成了工作年，比埃尔和玛丽并没有失掉勇气。', yr: 0.9 },
  { t: '蓝色的微光', q: '它们那些略带蓝色荧光的轮廓闪耀着，悬在夜的黑暗中。', yr: 1 },
];

// 必须在 deck.js 统计分步之前生成
document.getElementById('proc').innerHTML = PROC.map((p, i) =>
  `<li data-step="${i + 1}" data-i="${i}"><i>${i + 1}</i>${p.t}</li>`).join('');

function showProc(i) {
  const p = PROC[i];
  document.querySelectorAll('#proc li').forEach((li, k) => li.classList.toggle('cur', k === i));
  document.getElementById('yrFill').style.width = `${p.yr * 100}%`;
  document.getElementById('labCard').innerHTML = `<h3>${i + 1}. ${p.t}</h3><blockquote>${p.q}</blockquote>`;
}

function initVoices() {
  const btn = document.getElementById('voiceBtn');
  btn.addEventListener('click', () => {
    const on = document.getElementById('voices').classList.toggle('only-mq');
    btn.textContent = on ? '恢复全文' : '只看玛丽的话';
  });
}

window.LESSON = {
  init() {
    Narrative.init({});
    document.getElementById('proc').addEventListener('click', (e) => {
      const li = e.target.closest('li.on');
      if (li) showProc(+li.dataset.i);
    });
    document.getElementById('swatches').addEventListener('click', (e) => {
      const sw = e.target.closest('.sw');
      if (sw) sw.classList.toggle('open');
    });
    initVoices();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.classList.contains('s-proc')) {
      if (step >= 1) showProc(Math.min(step, PROC.length) - 1);
      else document.getElementById('yrFill').style.width = '0';
    }
  },
};
