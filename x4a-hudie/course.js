'use strict';
/* 蝴蝶的家 · 本课数据与互动。记叙文模板见 ../shared/narrative.js，提问清单见 qlist.js，翻页引擎见 ../shared/deck.js
 * 本课专属：寻家地图（读一句、找一处、打 ✗ 或 ？，“着急”跟着涨）、问题链、问题分类加星、尝试解决选办法。
 */

const QLISTS = {
  hudie: {
    cats: [
      { k: 'nr', name: '针对内容', tip: '写了什么？' },
      { k: 'xf', name: '针对写法', tip: '为什么这样写？' },
      { k: 'qs', name: '得到启示', tip: '联系生活想一想' },
    ],
    star: '最值得思考',
    items: [
      { q: '下大雨的时候，蝴蝶的家到底在哪里？', k: 'nr' },
      { q: '作者为什么反复说“我真为蝴蝶着急了”？', k: 'xf' },
      { q: '下雨时，别的昆虫又躲在哪里呢？', k: 'qs' },
      { q: '课文为什么要写小朋友和女孩说的话？', k: 'xf' },
      { q: '为什么蝴蝶的翅膀一点儿水都不能沾？', k: 'nr' },
      { q: '我们可以怎样观察、找到雨天蝴蝶藏身的地方？', k: 'qs' },
    ],
  },
};

/* ================= 试着解决：选办法（ok 里是合适的办法，可以不止一个） ================= */
const WAYS = ['读课文', '查资料', '去观察', '问别人'];
const SOLVES = [
  { q: '下大雨的时候，蝴蝶的家到底在哪里？', ok: ['查资料', '去观察', '问别人'], a: '课文没有答案，要查资料、去观察。人们观察到：下雨时，蝴蝶常常收拢翅膀，躲在茂密的草丛深处、宽大叶片的背面或石缝里。' },
  { q: '作者为什么反复说“我真为蝴蝶着急了”？', ok: ['读课文'], a: '回到课文找：每找一处都找不到，一次比一次着急。反复说，让我们感受到作者对小小蝴蝶的关心。' },
  { q: '课文为什么要写小朋友和女孩说的话？', ok: ['读课文'], a: '回到课文找：小朋友说“肯定有家”，女孩说是“秘密的家”，不同的猜想引着作者和我们继续想下去。' },
  { q: '下雨时，别的昆虫又躲在哪里呢？', ok: ['查资料', '去观察', '问别人'], a: '课文里没有写，可以翻翻昆虫书、问问科学老师，下雨天到草丛、墙角、树下看一看，把发现记下来。' },
];
function initSolve() {
  const box = document.getElementById('solve');
  box.innerHTML = SOLVES.map((s, i) => `<div class="sv" data-i="${i}"><p class="sv-q">${s.q}</p>
    <div class="sv-ways">${WAYS.map((w) => `<button type="button" data-w="${w}">${w}</button>`).join('')}</div>
    <p class="sv-a">${s.a}</p></div>`).join('');
  box.addEventListener('click', (e) => {
    const b = e.target.closest('[data-w]');
    if (!b) return;
    const row = b.closest('.sv');
    const ok = SOLVES[+row.dataset.i].ok.includes(b.dataset.w);
    b.classList.remove('nope');
    void b.offsetWidth; // 重新触发抖动
    b.classList.add(ok ? 'yes' : 'nope');
    if (ok) row.classList.add('open');
  });
}

/* ================= 寻家地图：只留最近两句原文 ================= */
const HUNT_KEEP = 2;
function updateHunt(slide, step) {
  const lines = [...slide.querySelectorAll('#huntTxt p')];
  if (!lines.length) return;
  const shown = lines.filter((p) => +p.dataset.step <= step);
  lines.forEach((p) => {
    const idx = shown.indexOf(p);
    p.classList.toggle('now', idx >= 0 && idx === shown.length - 1);
    p.classList.toggle('gone', idx >= 0 && idx < shown.length - HUNT_KEEP);
  });
}

window.LESSON = {
  init() {
    Narrative.init({});
    QList.init(QLISTS);
    initSolve();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateHunt(slide, step);
  },
};
