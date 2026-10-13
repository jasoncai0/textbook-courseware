'use strict';
/* 谈创造性思维 · 本课数据与互动：图形小实验、问题链、组合“＋”、自评与发散挑战。通用部分见 ../shared/narrative.js */

/* 图形小实验：理由取自课文 */
const SHAPES = [
  { k: 'A', t: '因为A是唯一没有角的图形，所以A也是正确答案。' },
  { k: 'B', t: '你若选择的是B，那就恭喜你答对了。因为图形B是唯一一个仅由直线构成的图形。' },
  { k: 'C', t: '由于非对称性图形只有C一个，所以C会被认为与其他图形不同。确实如此，这也是正确答案。' },
  { k: 'D', t: '这是唯一一个由直线与曲线构成的图形，因此D也是正确答案。' },
];

function initShapes() {
  const why = document.getElementById('why');
  const seen = new Set();
  document.getElementById('shapes').addEventListener('click', (e) => {
    const g = e.target.closest('.shp');
    if (!g) return;
    const k = +g.dataset.k;
    g.classList.add('seen');
    if (!seen.has(k)) {
      seen.add(k);
      why.insertAdjacentHTML('beforeend', `<p data-k="${k}"><b>选 ${SHAPES[k].k}</b>${SHAPES[k].t}</p>`);
    }
    why.querySelectorAll('p').forEach((p) => p.classList.toggle('cur', +p.dataset.k === k));
    document.getElementById('allRight').hidden = seen.size < SHAPES.length;
  });
}

/* 问题链：q 问题（课文设问或旁批），a 课文中的回答 */
const QCHAIN = [
  { from: '课文开头', q: '正确答案只有一个吗？', a: '生活中解决问题的方法并非只有一个，而是多种多样。……因此，不满足于一个答案，不放弃探求，这一点非常重要。' },
  { from: '作者设问', q: '创造性的思维必须具备哪些条件呢？', a: '富有创造力的人总是孜孜不倦地汲取知识，使自己学识渊博。……知识是形成新创意的素材。' },
  { from: '旁批', q: '知识和创造力到底有怎样的关系？', a: '但这并不是说，光凭知识就能拥有创造力。发挥创造力的真正关键，在于如何运用知识。' },
  { from: '作者设问', q: '是否存在富有创造力的人和缺乏创造力的人的区别呢？', a: '区分一个人是否拥有创造力，主要根据之一是，拥有创造力的人留意自己细小的想法。' },
  { from: '结尾', q: '怎样才能成为一个富有创造力的人？', a: '关键是要经常保持好奇心，不断积累知识；不满足于一个答案，而去探求新思路，去运用所得的知识；一旦产生小的灵感，相信它的价值，并锲而不舍地把它发展下去。' },
];

function initQchain() {
  const box = document.getElementById('qchain');
  box.innerHTML = QCHAIN.map((c, i) => `<div class="qn" data-step="${i + 1}">
    <button type="button" class="qn-q"><small>${c.from}</small><b>${i + 1}</b>${c.q}</button>
    <p class="qn-a">${c.a}</p></div>`).join('<i class="qn-arr">↓</i>');
  box.addEventListener('click', (e) => {
    const q = e.target.closest('.qn-q');
    if (q) q.parentElement.classList.toggle('open');
  });
}

function initCombos() {
  document.querySelectorAll('.combo').forEach((c) => {
    c.querySelector('.cb-plus').addEventListener('click', () => c.classList.add('done'));
  });
}

/* 自评：课文最后一段列出的要素 */
const CHECKS = ['经常保持好奇心', '不断积累知识', '不满足于一个答案', '去探求新思路', '去运用所得的知识', '相信小灵感的价值，锲而不舍'];

function initChecks() {
  const box = document.getElementById('checks');
  const msg = document.getElementById('checkMsg');
  box.innerHTML = CHECKS.map((c) => `<label class="ck"><input type="checkbox"><span>${c}</span></label>`).join('');
  const update = () => {
    const n = box.querySelectorAll('input:checked').length;
    msg.textContent = n === 0 ? '“任何人都拥有创造力，首先要坚信这一点。”' : `做到了 ${n} 条。“如果能做到这些，你一定会成为一个富有创造力的人。”`;
  };
  box.addEventListener('change', update);
  update();
}

const BRICK_LEVELS = [[1, '　好的开始！'], [5, '　思路打开了！'], [10, '　了不起，换个角度还能更多！']];

function initBrick() {
  const ta = document.getElementById('brick');
  ta.addEventListener('input', () => {
    const n = ta.value.split(/[\n，,、；;]/).filter((s) => s.trim()).length;
    document.getElementById('brickN').textContent = n;
    const hit = BRICK_LEVELS.filter(([k]) => n >= k).pop();
    document.getElementById('brickTip').textContent = hit ? hit[1] : '';
  });
}

// 问题链带 data-step，必须在 deck.js 统计步数之前生成，所以在顶层调用
initQchain();

window.LESSON = {
  init() {
    Narrative.init({});
    initShapes();
    initCombos();
    initChecks();
    initBrick();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
