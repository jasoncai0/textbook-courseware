'use strict';
/* 呼风唤雨的世纪 · 本课数据与互动。记叙文模板见 ../shared/narrative.js，提问清单见 qlist.js，翻页引擎见 ../shared/deck.js
 * 本课专属：神话愿望与现代发明连一连、20 世纪科技时间线（写在页面里，分步出现）、问题筛选。
 */

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

const MYTH = [
  { a: '“千里眼”：看见千里之外', b: '电视、望远镜、视频通话' },
  { a: '“顺风耳”：听见远方的声音', b: '电话、收音机' },
  { a: '腾云驾雾的神仙', b: '飞机、宇宙飞船' },
  { a: '一到夜里就黑暗无光', b: '电灯照亮了夜晚' },
];

const QLISTS = {
  hufeng: {
    cats: [
      { k: 'help', name: '帮助理解课文', tip: '弄懂了，课文就读懂了' },
      { k: 'deep', name: '引发深入思考', tip: '读完还值得想一想' },
      { k: 'skip', name: '不影响理解', tip: '查一查就行' },
    ],
    star: '对理解课文最有帮助',
    items: [
      { q: '什么是“程控电话”？', k: 'skip' },
      { q: '“忽如一夜春风来，千树万树梨花开”是什么意思？20 世纪的科学成就为什么可以用这句诗来形容？', k: 'help' },
      { q: '现代科学技术给我们带来的全是好处吗？', k: 'deep' },
      { q: '为什么说 20 世纪是一个“呼风唤雨”的世纪呢？', k: 'help' },
      { q: '伯特兰·罗素是谁？', k: 'skip' },
      { q: '未来科学技术的发展还会给我们的生活带来怎样的变化？', k: 'deep' },
    ],
  },
};

const MOMENTS = [
  { name: '出行', pic: 'diqiucun', prompt: '以前出远门和现在出远门，有什么不一样？', hint: '问问爷爷奶奶：以前去外地坐什么车？要多久？现在呢？',
    example: '爷爷说，他年轻时去省城要坐一整天的绿皮火车。现在我们坐高铁，一个多小时就到了，车上又干净又舒适。科学技术让远方变近了。' },
  { name: '联系家人', pic: 'shenhua', prompt: '想念远方的亲人时，以前和现在怎样联系？', hint: '写信、打电话、视频通话……比一比。',
    example: '妈妈说，她小时候给在外地的舅舅写信，要等半个月才能收到回信。现在我们打开手机就能和舅舅视频，像面对面说话一样——这不就是“千里眼”“顺风耳”吗？' },
  { name: '看病学习', pic: 'tansuo', prompt: '科学技术怎样帮助我们看病、学习？', hint: '可以写网上查资料、医院的新机器、在家上网课……',
    example: '上次我生病发烧，医生用一个小机器在额头上一碰，就知道了体温。查资料时，我在电脑上一搜，就能看到好多图片和视频。科学技术让我们的生活越来越方便。' },
];

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    QList.init(QLISTS);
    initMatch(document.getElementById('mythMatch'), MYTH, [2, 0, 3, 1]);
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
