'use strict';
/* 一个豆荚里的五粒豆 · 本课数据与互动。记叙文模板见 ../shared/narrative.js，提问清单见 qlist.js，翻页引擎见 ../shared/deck.js */

/* ================= 连一连：先点左边，再点右边（pairs[i].a 对 pairs[i].b；右边按 rightOrder 打乱） ================= */
function initMatch(box, pairs, rightOrder) {
  box.innerHTML = `<div class="m-col">${pairs.map((p, i) => `<button class="m-a" type="button" data-i="${i}">${p.a}</button>`).join('')}</div>
    <div class="m-col">${rightOrder.map((i) => `<button class="m-b" type="button" data-i="${i}">${pairs[i].b}</button>`).join('')}</div>`;
  let picked = null;
  let found = 0;
  box.addEventListener('click', (e) => {
    const a = e.target.closest('.m-a');
    const b = e.target.closest('.m-b');
    if (a && !a.classList.contains('right')) {
      box.querySelectorAll('.m-a').forEach((x) => x.classList.toggle('sel', x === a));
      picked = a;
      return;
    }
    if (!b || b.classList.contains('right') || !picked) return;
    b.classList.remove('wrong');
    void b.offsetWidth; // 重新触发抖动动画
    if (b.dataset.i !== picked.dataset.i) { b.classList.add('wrong'); return; }
    found += 1;
    [picked, b].forEach((x) => { x.classList.remove('sel'); x.classList.add('right'); x.dataset.n = found; });
    picked = null;
    box.classList.toggle('all-found', found === pairs.length);
  });
}

const PEAS = [
  { a: '第一粒：“我要飞到广阔的世界里去了！”', b: '落到屋顶的水笕里，被鸽子吃掉了' },
  { a: '第二粒：“我将直接飞进太阳里去。”', b: '落到水沟里，在脏水里涨得大大的' },
  { a: '第三、四粒：“我们才会飞得最远呢！”', b: '没有走多远，也被鸽子吃掉了' },
  { a: '最后一粒：“该怎么样就怎么样吧！”', b: '在石缝里生根、开花，给小女孩带来希望' },
];

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
    initMatch(document.getElementById('peaMatch'), PEAS, [1, 3, 0, 2]);
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
