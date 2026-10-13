'use strict';
/* 十六年前的回忆 · 本课数据。页面逻辑见记叙文模板 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 品读 · 时间顺序（课后第 2 题）：x、y 为情节板内的百分比位置 */
const PLOT = [
  { step: 1, stage: '被捕前 · 那年春天', text: '烧掉书籍文件；坚决不离开北京', pic: 'shaoshu', x: 12, y: 92 },
  { step: 2, stage: '被捕时 · 4 月 6 日', text: '不慌不忙，保持严峻态度', pic: 'xiaowu', x: 37, y: 66 },
  { step: 3, stage: '法庭上 · 十几天后', text: '平静而慈祥，安定沉着，保护家人', pic: 'fating', x: 62, y: 44 },
  { step: 4, stage: '被害后 · 28 日', text: '噩耗传来，“记住”这一天', pic: 'baozhi', x: 87, y: 74 },
];

/* 品读 · 外貌、神态、言行（课后第 3 题） */
const KINDS = ['外貌', '神态', '言行'];
const SORT_ITEMS = [
  { s: '我看到了他那乱蓬蓬的长头发下面的平静而慈祥的脸。', ok: ['外貌', '神态'], q: '受尽折磨，仍从容慈爱' },
  { s: '父亲坚决地对母亲说：“……我是不能轻易离开北京的。……我哪能离开呢？”', ok: ['言行'], q: '把革命工作放在第一位' },
  { s: '父亲不慌不忙地向外走去。', ok: ['言行', '神态'], q: '临危不惧，沉着镇定' },
  { s: '“不要了就烧掉。你小孩子家知道什么！”', ok: ['言行'], q: '保护党组织，也保护孩子' },
  { s: '父亲保持着他那惯有的严峻态度，没有向他们讲任何道理。', ok: ['神态', '言行'], q: '坚贞不屈，蔑视敌人' },
  { s: '他的神情非常安定，非常沉着。', ok: ['神态'], q: '对革命事业充满信心' },
  { s: '“……我的孩子年纪都还小，她们什么也不懂，一切都跟她们没有关系。”', ok: ['言行'], q: '机智沉着，保护家人' },
];

/* 读与写 · 那些没说出口的话 */
const MOMENTS = [
  {
    name: '法庭上 · 父亲望了望我们', pic: 'fating',
    prompt: '“父亲说完了这段话，又望了望我们。”这是最后一次见面。这一望里，父亲想对妻子和女儿说什么？',
    hint: '想一想：他知道自己可能回不来了吗？他最放心不下的是什么？他相信什么？',
    example: '星儿，你今天真勇敢，爹为你骄傲。别哭，照顾好妈妈和妹妹。爹做的事是对的，总有一天，你们会过上好日子的。',
  },
  {
    name: '烧书时 · 父亲待了一会儿', pic: 'shaoshu',
    prompt: '“我”问为什么要烧掉，父亲“待了一会儿”才回答。这一会儿，父亲心里在想什么？',
    hint: '联系后文：军阀要来搜查，为了避免党组织被破坏。',
    example: '这些文件要是落到敌人手里，许多同志就危险了，必须烧掉……孩子还小，告诉她这些，只会让她害怕。就让她以为是我不要了吧。',
  },
  {
    name: '十六年后 · 我想对父亲说', pic: 'chunri',
    prompt: '十六年过去了，李星华提笔写下这篇回忆。她会在心里对父亲说些什么？',
    hint: '“我永远忘不了那一天”——她忘不了什么？十六年来，她明白了什么？',
    example: '爹，十六年了，我还记得您把书投进火炉的样子，记得法庭上您平静的脸。那时我不懂，现在我懂了：您心里装着的，是千千万万的人。',
  },
];

/* 故事页右上角时间线：slide 上写 data-tl="0~3"，-1 表示开头（只显示时间线、不点亮） */
const TL = ['被捕前', '被捕时', '法庭上', '被害后'];
function buildTimeline() {
  const box = document.createElement('div');
  box.className = 'tl';
  box.id = 'tl';
  box.innerHTML = TL.map((t) => `<span>${t}</span>`).join('<i></i>');
  document.getElementById('frame').appendChild(box);
}
function updateTimeline(slide) {
  const box = document.getElementById('tl');
  const at = slide.dataset.tl;
  box.classList.toggle('show', at !== undefined);
  box.querySelectorAll('span').forEach((s, i) => {
    s.classList.toggle('cur', String(i) === at);
    s.classList.toggle('done', i < +at);
  });
}

window.LESSON = {
  init() {
    Narrative.init({ plot: PLOT, kinds: KINDS, sort: SORT_ITEMS, moments: MOMENTS });
    buildTimeline();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateTimeline(slide);
  },
};
