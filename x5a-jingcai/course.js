'use strict';
/* “精彩极了”和“糟糕透了” · 本课数据。页面逻辑见记叙文模板 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 两种声音的天平 */
const SCALE_SAY = {
  praise: '<b>只有“精彩极了”：</b>天平一边倒。巴迪可能以为自己写得很好，骄傲自满——“它可能会把人引入歧途”。',
  critic: '<b>只有“糟糕透了”：</b>天平又倒向另一边。巴迪可能失去信心，再也不想写了。',
  both: '<b>两种声音都有：</b>天平平衡了。鼓励给他信心，批评让他清醒——“我谨慎地把握住我生活的小船，使它不被哪一股风刮倒。”',
};
function initScale(box) {
  const say = document.getElementById('scaleSay');
  box.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-mode]');
    if (!btn) return;
    const { mode } = btn.dataset;
    box.classList.remove('mode-praise', 'mode-critic', 'mode-both');
    box.classList.add(`mode-${mode}`);
    box.querySelectorAll('button[data-mode]').forEach((b) => b.classList.toggle('solid', b === btn));
    say.innerHTML = SCALE_SAY[mode];
  });
}

/* 阅读提示第 3 问 · 说看法 */
const MOMENTS = [
  { name: '我怎么看巴迪的父母', pic: 'fuqin',
    prompt: '联系生活实际，说说你如何看待巴迪父母表达爱的方式。',
    hint: '先亮出观点（赞同 / 部分赞同 / 不赞同），再用课文内容或自己的经历说理由。',
    example: '我觉得巴迪的父母都很爱他。母亲的鼓励让他有信心一直写下去，父亲的批评让他知道哪里不足、学着修改。不过我认为，父亲可以说得温和一些，比如先指出一个优点，再提出要改的地方，这样巴迪就不会那么伤心了。' },
  { name: '我家的“精彩极了”', pic: 'muqin',
    prompt: '你的家里，谁常对你说“精彩极了”？写一件具体的事。',
    hint: '写清那句话是在什么时候说的，你当时的心情，它给了你什么力量。',
    example: '我第一次自己包饺子，包得歪歪扭扭，有的还露了馅。奶奶却夹起一个，笑眯眯地说：“这是我吃过最香的饺子！”从那以后，我包饺子越包越好。' },
  { name: '我家的“糟糕透了”', pic: 'kuqi',
    prompt: '你的家里，谁对你说过“糟糕透了”这样的话？现在你怎么看？',
    hint: '像巴迪一样，写出当时的感受和后来的想法有什么不同。',
    example: '有一次我的数学考了九十分，高高兴兴地拿给爸爸看。爸爸皱着眉头说：“这道题这么简单也错，太粗心了！”我当时委屈得直掉眼泪。后来我养成了检查的习惯，才明白爸爸是在提醒我。' },
];

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    initScale(document.getElementById('scale'));
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
