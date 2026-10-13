'use strict';
/* 月迹（五上 24，略读）· 本课数据。故事页、翻卡、朗读见 ../shared/narrative.js */

/* 阅读提示 ②：有趣的地方 */
const CLUE_LABELS = ['有趣的句子', '有趣在哪里'];
const CLUES = [
  { q: '却疑心这骨朵儿是繁星儿变的', a: '桂树上的骨朵儿密密的像星星，抬头一看，星儿“似乎就比平日少了许多”——把地上的和天上的连在一起想。' },
  { q: '那月桂分明就是我们身后的这一棵了', a: '一种气息“袅袅”地飘到头发梢儿上，孩子们觉得自己已经在月亮里了。' },
  { q: '“啊啊，月亮是属于我的了！”', a: '嫦娥“和三妹一样漂亮”，三妹就说月亮是她的；大家都争着要月亮——天真可爱。' },
  { q: '葡萄叶儿上、瓷花盆儿上、爷爷的锨刃儿上找到了', a: '有光的地方就有月亮，孩子们一找一个准，越找越有兴趣。' },
  { q: '在弟弟妹妹的眼睛里看见了小小的月亮', a: '月亮映在眼睛里，月亮真的“是每个人的”。' },
  { q: '只要你愿意，它就有了哩', a: '月亮无处不在。只要用心去找，美就在身边。' },
];

/* 竹帘格儿 */
function buildBlind() {
  const g = document.querySelector('#mirror .blind');
  const BARS = 18;
  g.innerHTML = Array.from({ length: BARS }, (_, i) =>
    `<rect x="${12 + i * 7}" y="20" width="4" height="320" fill="#c9a86a" opacity=".85"/>`).join('') +
    Array.from({ length: 8 }, (_, i) => `<path d="M12 ${50 + i * 38} H136" stroke="#8a6a3a" stroke-width="2"/>`).join('');
}

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: CLUE_LABELS });
    buildBlind();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
