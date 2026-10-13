'use strict';
/* 少年中国说（节选）· 本课数据。背诵挖空见 ../shared/poem.js，翻卡片、朗读符号见 ../shared/narrative.js */

/* 背诵：按句分行，“只留首字”时每句留第一个字 */
const POEMS = {
  p1: {
    title: '第一、三段', author: '梁启超',
    lines: [
      { t: '故今日之责任，不在他人，而全在我少年。' },
      { t: '少年智则国智，少年富则国富，少年强则国强，' },
      { t: '少年独立则国独立，少年自由则国自由，少年进步则国进步，' },
      { t: '少年胜于欧洲则国胜于欧洲，少年雄于地球则国雄于地球。' },
      { t: '美哉，我少年中国，与天不老！' },
      { t: '壮哉，我中国少年，与国无疆！' },
    ],
  },
  p2: {
    title: '第二段', author: '一句一幅画',
    lines: ['红日初升，其道大光。', '河出伏流，一泻汪洋。', '潜龙腾渊，鳞爪飞扬。', '乳虎啸谷，百兽震惶。', '鹰隼试翼，风尘吸张。',
      '奇花初胎，矞矞皇皇。', '干将发硎，有作其芒。', '天戴其苍，地履其黄。', '纵有千古，横有八荒。', '前途似海，来日方长。'].map((t) => ({ t })),
  },
};
Poem.render(POEMS);

/* 第一段 · 八个“少年……则国……”：分三组出现（data-step 要在 deck.js 统计分步之前生成） */
const CHAIN = [
  { step: 2, words: ['智', '富', '强'], tag: '本领' },
  { step: 3, words: ['独立', '自由', '进步'], tag: '精神' },
  { step: 4, words: ['胜于欧洲', '雄于地球'], tag: '志向' },
];
document.getElementById('chain').innerHTML = CHAIN.map((g) => `<div class="ch-group" data-step="${g.step}"><b class="ch-tag">${g.tag}</b>${g.words.map((w) =>
  `<div class="ch-row"><span class="ch-sn">少年${w}</span><i>→</i><span class="ch-gj">国${w}</span></div>`).join('')}</div>`).join('');

/* 课后第 2 题 · 意象卡片：正面是课文里的事物，背面是它赞美的少年中国的特点 */
const CLUE_LABELS = ['课文写到……', '赞美少年中国……'];
const pic = (name, pos = 'center') => `<span class="sn-pic" data-bg="assets/${name}.jpg" style="background-position:${pos}"></span>`;
const CLUES = [
  { q: `${pic('hongri', '50% 30%')}红日初升`, a: '像初升的太阳，<b>光明灿烂</b>，前途一片光明。' },
  { q: `${pic('hongri', '50% 80%')}河出伏流`, a: '像奔涌而出的大河，<b>一往无前</b>，势不可挡。' },
  { q: `${pic('qianlong')}潜龙腾渊`, a: '像腾跃而起的龙，<b>蓄势待发</b>，充满力量。' },
  { q: `${pic('ruhu')}乳虎啸谷`, a: '像长啸的小老虎，<b>威风凛凛</b>，让百兽震惶。' },
  { q: `${pic('yingsun', '50% 25%')}鹰隼试翼`, a: '像初次展翅的雄鹰，<b>志向远大</b>，搏击长空。' },
  { q: `${pic('yingsun', '50% 85%')}奇花初胎`, a: '像刚孕育的奇花，<b>美好</b>而富有生机。' },
  { q: `${pic('shaonian', '50% 40%')}干将发硎`, a: '像刚磨好的宝剑，<b>锋芒毕露</b>，光彩照人。' },
  { q: `${pic('shaonian', '50% 75%')}前途似海`, a: '像大海一样宽广，<b>前途无量</b>，来日方长。' },
];

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: CLUE_LABELS });
    Poem.init();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
