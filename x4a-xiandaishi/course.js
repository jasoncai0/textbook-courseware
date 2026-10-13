'use strict';
/* 现代诗二首 · 本课数据与互动。记叙文模板见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js
 * 本课专属：斜阳“掉”在江上的动画、花牛的动作与景物连一连。
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

const NIU = [
  { a: '花牛在草地里坐', b: '压扁了一穗剪秋罗' },
  { a: '花牛在草地里眠', b: '白云霸占了半个天' },
  { a: '花牛在草地里走', b: '小尾巴甩得滴溜溜' },
  { a: '花牛在草地里做梦', b: '太阳偷渡了西山的青峰' },
];

/* 江边的芦苇：一排细茎 + 白头（读到“红颜”时变红） */
const REEDS = 22;
function drawReeds() {
  document.getElementById('qwReeds').innerHTML = Array.from({ length: REEDS }, (_, i) => {
    const x = 10 + i * 13 + (i % 3) * 4;
    const top = 250 + (i % 4) * 9;
    const lean = (i % 2 ? 6 : -4);
    return `<path d="M${x} 440 Q${x + lean / 2} ${top + 60} ${x + lean} ${top}" stroke="#7d6a45" stroke-width="2.5" fill="none"/>
      <ellipse class="reed-top" cx="${x + lean}" cy="${top - 8}" rx="5" ry="13"/>`;
  }).join('');
}
drawReeds();

const MOMENTS = [
  { name: '花牛吃草', pic: 'huaniu1', prompt: '花牛在草地里吃草，这时候景物怎么样？', hint: '第一行写花牛做什么，第二行写景物，最后一个字尽量押韵。',
    example: '花牛在草地里吃草，\n蝴蝶落在了它的角梢。' },
  { name: '花牛听歌', pic: 'huaniu2', prompt: '花牛在草地里听什么歌？谁在唱？', hint: '可以写小鸟、小溪、风……',
    example: '花牛在草地里听歌，\n小溪唱着叮咚的山歌。' },
  { name: '换个小动物', pic: 'qiuwan', prompt: '换一个小动物：小猫、小狗、小鸭……它在做什么？', hint: '照样子写：“小____在____里____，____________。”',
    example: '小鸭在池塘里游，\n月亮跟着它晃悠悠。' },
];

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    initMatch(document.getElementById('niuMatch'), NIU, [2, 0, 3, 1]);
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
