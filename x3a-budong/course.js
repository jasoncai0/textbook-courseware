'use strict';
/* 不懂就要问 · 本课数据。页面逻辑见记叙文模板 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

const PLOT = [
  { step: 1, stage: '起因', text: '私塾里只让背书，先生从来不讲意思', pic: 'sishu', x: 16, y: 97 },
  { step: 2, stage: '经过', text: '孙中山壮着胆子站起来提问', pic: 'tiwen', x: 50, y: 72 },
  { step: 3, stage: '结果', text: '先生讲得很详细，大家听得很认真', pic: 'jiangjie', x: 84, y: 50 },
];

/* 新鲜感词句收集卡：s 原句（<em> 是新鲜的词），feel 说说感觉 */
const FRESH = [
  { s: '先生念，学生跟着念，<em>咿咿呀呀，像唱歌一样</em>。', feel: '好像听见了拖得长长的读书声，可是大家不明白意思。' },
  { s: '正在<em>摇头晃脑</em>高声念书的同学们', feel: '读书时头一摇一晃的，一下子就看见了那个样子。' },
  { s: '课堂里<em>霎时</em>变得<em>鸦雀无声</em>。', feel: '一下子静得连乌鸦、麻雀的声音都没有，安静得吓人。' },
  { s: '他<em>壮着胆子</em>站起来', feel: '心里有点怕，还是鼓起勇气——“胆子”也能“壮”起来！' },
  { s: '就把那段书<em>一字不漏</em>地背了出来。', feel: '一个字也没落下，原来他背得很熟，只是想弄懂。' },
  { s: '<em>学问学问，不懂就要问</em>。', feel: '“学问”里藏着“学”和“问”，说得真巧妙，好记！' },
];

const MOMENTS = [
  { name: '我的看法', pic: 'tiwen', prompt: '你对孙中山向先生提问这件事有什么看法？', hint: '用“我觉得……，因为……”说清楚理由。', example: '我觉得孙中山很勇敢。那时候向先生提问可能会挨打，他还是壮着胆子问了，因为他想弄清楚书里的道理。' },
  { name: '我不懂的时候', pic: 'jiangjie', prompt: '你在学习中遇到过不懂的问题吗？你是怎么做的？', hint: '说说是什么问题、问了谁、后来弄懂了吗。', example: '有一次我不明白“鸦雀无声”是什么意思，就去问老师。老师说是连乌鸦麻雀的声音都没有，形容非常安静。我一下子就记住了。' },
  { name: '学问学问', pic: 'sishu', prompt: '说说你对“学问学问，不懂就要问”的理解。', hint: '“学”和“问”是什么关系？', example: '要有学问，光“学”不够，还要会“问”。不懂的地方问清楚了，才是真的学会了。' },
];

/* 收集卡：点一下点亮，读一读，看感觉 */
function initFresh(box, items) {
  box.innerHTML = items.map((it, i) => `<button type="button" class="fresh-card" data-i="${i}">
    <span class="fc-star">★</span><span class="fc-s">${it.s}</span>
    <span class="fc-feel"><b>我的感觉：</b>${it.feel}</span></button>`).join('');
  document.getElementById('freshAll').textContent = items.length;
  box.addEventListener('click', (e) => {
    const card = e.target.closest('.fresh-card');
    if (!card) return;
    card.classList.toggle('lit');
    document.getElementById('freshN').textContent = box.querySelectorAll('.fresh-card.lit').length;
  });
}

window.LESSON = {
  init() {
    Narrative.init({ plot: PLOT, moments: MOMENTS });
    initFresh(document.getElementById('fresh'), FRESH);
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    // 连环画：当前这一格描红框，前面的格子稍稍变淡
    slide.querySelectorAll('.cm').forEach((c) => c.classList.toggle('now', +c.dataset.step === step));
  },
};
