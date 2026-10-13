'use strict';
/* 猴王出世 · 本课数据。页面逻辑见记叙文模板 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

const MOMENTS = [
  {
    name: '石猴是怎么出世的', pic: 'shihou',
    prompt: '用自己的话说一说：石猴是怎么出世的？',
    hint: '关键词：花果山顶、仙石、天地精华、迸裂、石卵、见风化作石猴。',
    example: '花果山顶上有一块仙石，它常年吸收天地日月的精华，有了灵性。有一天，仙石突然迸裂，生出一个圆球那么大的石卵，石卵见了风，就变成了一只石猴。石猴在山里跑跑跳跳，和各种动物做朋友，晚上睡在石崖下，早上在山洞间游玩。',
  },
  {
    name: '石猴怎样成了猴王', pic: 'chengwang',
    prompt: '用自己的话说一说：石猴是怎么成为猴王的？',
    hint: '关键词：寻源、约定、“我进去！”、水帘洞、带众猴进洞、“人而无信”、拜王。',
    example: '一天，猴子们顺着山涧找到一股瀑布，约定谁能钻进去再平安出来，就拜他为王。别的猴子都不敢，只有石猴大喊“我进去！”，闭眼一跳，发现瀑布后面是一座铁板桥和一座石房，正好给大家安家。他带着众猴住了进去，又提醒大家：说话要算数。众猴心服口服，拜他为王，他就成了美猴王。',
  },
  {
    name: '我是一只胆小的猴', pic: 'pubu',
    prompt: '想象一下：你是那些“伸头缩颈，抓耳挠腮”的胆小猴子之一。看着石猴跳进瀑布，你心里在想什么？',
    hint: '可以写写你的害怕、好奇，再写写最后为什么也跟着进去了。',
    example: '我的妈呀，那么大的瀑布，跳进去还能出来吗？我伸长脖子往里瞧，什么也瞧不见，急得直挠腮帮子。咦，石猴又跳出来了，还说里面没水，有房子、有石床！大家一个接一个跳进去了……不行，我可不能一个人留在外面，我也闭上眼睛——跳！',
  },
];

function initFlips() {
  document.querySelectorAll('.flipbox').forEach((box) => {
    box.addEventListener('click', (e) => {
      const card = e.target.closest('.clue');
      if (card) card.classList.toggle('flipped');
    });
  });
}

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    initFlips();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
