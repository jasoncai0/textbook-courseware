'use strict';
/* 现代诗二首 · 本课数据与互动。记叙文模板见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js
 * 本课专属：斜阳“掉”在江上的动画、花牛的动作与景物连一连。
 */

/* ================= 花牛的一天：一节诗一个动作（k 是景物“调皮”的词，pic/pos 取本课配图） ================= */
const NIU = [
  { v: '坐', a: '花牛在草地里坐，', b: '压扁了一穗剪秋罗。', k: '压扁', why: '一屁股坐下去，小花被压扁了——真调皮！', pic: 'huaniu1', pos: '45% 75%' },
  { v: '眠', a: '花牛在草地里眠，', b: '白云霸占了半个天。', k: '霸占', why: '花牛躺下了，白云趁机占了半个天。', pic: 'huaniu1', pos: '50% 20%' },
  { v: '走', a: '花牛在草地里走，', b: '小尾巴甩得滴溜溜。', k: '滴溜溜', why: '边走边甩尾巴，多快活。', pic: 'huaniu2', pos: '40% 60%' },
  { v: '做梦', a: '花牛在草地里做梦，', b: '太阳偷渡了西山的青峰。', k: '偷渡', why: '花牛做着梦，太阳悄悄溜过了西山，一天过去了。', pic: 'huaniu2', pos: '72% 30%' },
];
/* 动作按钮排在太阳走过的弧线上（left/top 为百分比） */
const ARC = [[8, 78], [34, 17], [66, 17], [92, 78]];
function initNiuDay() {
  const box = document.getElementById('niuDay');
  box.insertAdjacentHTML('beforeend', NIU.map((n, i) => `<button type="button" class="niu-v" data-i="${i}" style="left:${ARC[i][0]}%;top:${ARC[i][1]}%">${n.v}</button>`).join(''));
  const $ = (id) => document.getElementById(id);
  const show = (i) => {
    const n = NIU[i];
    box.querySelectorAll('.niu-v').forEach((b, k) => { b.classList.toggle('cur', k === i); if (k === i) b.classList.add('seen'); });
    $('niuSun').style.left = `${ARC[i][0]}%`;
    $('niuSun').style.top = `${ARC[i][1] - 26}%`;
    $('niuPic').style.backgroundImage = `url(assets/${n.pic}.jpg)`;
    $('niuPic').style.backgroundPosition = n.pos;
    $('niuA').textContent = n.a;
    $('niuB').innerHTML = n.b.replace(n.k, `<b>${n.k}</b>`);
    $('niuWhy').textContent = n.why;
  };
  box.addEventListener('click', (e) => {
    const b = e.target.closest('.niu-v');
    if (b) show(+b.dataset.i);
  });
  show(0);
}

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
    initNiuDay();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
