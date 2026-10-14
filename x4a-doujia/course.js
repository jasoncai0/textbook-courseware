'use strict';
/* 一个豆荚里的五粒豆 · 本课数据与互动。记叙文模板见 ../shared/narrative.js，提问清单见 qlist.js，翻页引擎见 ../shared/deck.js
 * 本课专属：豌豆飞行图（五粒豌豆的“愿望”和落点画在一张图上）。
 */

/* ================= 豌豆飞行图：点一粒，看它说的话和落到哪里（g 对应 SVG 里 #pg0~#pg3） ================= */
const PEAS = [
  { who: '第一粒', say: '“现在我要飞到广阔的世界里去了！”', end: '落到了屋顶的水笕里，被一只鸽子吃掉了。' },
  { who: '第二粒', say: '“我将直接飞进太阳里去。”', end: '却落到了水沟里，在脏水里躺了好几个星期，涨得大大的，还说自己“最了不起”。' },
  { who: '第三、四粒', say: '“我们才会飞得最远呢！”', end: '也没有走多远，也被鸽子吃掉了。' },
  { who: '最后一粒', say: '“该怎么样就怎么样吧！”', end: '落到顶楼窗子下面的旧板子上，在长满青苔的裂缝里生根、开花，给小女孩带来了希望。' },
];
function initPeaMap() {
  const btns = document.getElementById('peaBtns');
  const card = document.getElementById('peaCard');
  btns.innerHTML = PEAS.map((p, i) => `<button type="button" class="pea-btn" data-i="${i}"><i></i>${p.who}</button>`).join('');
  const seen = new Set();
  btns.addEventListener('click', (e) => {
    const b = e.target.closest('.pea-btn');
    if (!b) return;
    const i = +b.dataset.i;
    const p = PEAS[i];
    seen.add(i);
    btns.querySelectorAll('.pea-btn').forEach((x) => x.classList.toggle('cur', x === b));
    b.classList.add('seen');
    document.getElementById(`pg${i}`).classList.add('go');
    card.innerHTML = `<b>${p.who}说：</b><p>${p.say}</p><b>结果：</b><p>${p.end}</p>`
      + (seen.size === PEAS.length ? '<p class="pea-q">谁走得最远？比一比路程，再比一比它带来了什么。</p>' : '');
  });
}

/* 课后第 2 题：问题清单（k 是参考分类） */
const QLISTS = {
  doujia: {
    cats: [{ k: 'part', name: '针对部分内容', tip: '读一段就能问' }, { k: 'all', name: '针对全文', tip: '要联系全文想' }],
    items: [
      { q: '豌豆为什么会以为整个世界都是绿的？', k: 'part' },
      { q: '课文说被青苔包裹的豌豆像“一个囚犯”，但它却长得很好，为什么？', k: 'part' },
      { q: '母亲为什么要把一株豌豆苗称为“一个小花园”呢？', k: 'part' },
      { q: '掉到水沟里的那粒豌豆真的是最了不起的吗？', k: 'all' },
      { q: '五粒豌豆，到底谁走得最远？', k: 'all' },
      { q: '这个故事想告诉我们什么？', k: 'all' },
    ],
  },
};

window.LESSON = {
  init() {
    Narrative.init({});
    QList.init(QLISTS);
    initPeaMap();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
