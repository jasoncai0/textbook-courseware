'use strict';
/* 我的伯父鲁迅先生 · 本课数据。页面逻辑见记叙文模板 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 阅读提示 ② · 鲁迅给你留下了怎样的印象（选一选） */
const PICKS = {
  yinxiang: [
    { t: '关心、爱护下一代', ok: true, why: '谈《水浒传》、送书、放花筒' },
    { t: '幽默风趣', ok: true, why: '笑谈“碰壁”' },
    { t: '敢于同黑暗势力斗争', ok: true, why: '“四周黑洞洞的”' },
    { t: '同情劳动人民', ok: true, why: '救护车夫、关心女佣' },
    { t: '为自己想得少，为别人想得多', ok: true, why: '病重仍写作，劝阿三多休息' },
    { t: '对孩子严厉，常常批评', ok: false, why: '他是笑着委婉提醒的' },
    { t: '只关心自己的书和文章', ok: false, why: '他关心身边的每一个人' },
    { t: '高高在上，不理普通人', ok: false, why: '他半跪着为车夫包扎' },
  ],
};

/* 读与写 · 通过事情写一个人 */
const MOMENTS = [
  {
    name: '写一位长辈', pic: 'huatong',
    prompt: '想一位让你觉得“有你，真好”的长辈。选一件小事，写出当时的场景和他（她）的神态、动作、语言。',
    hint: '学课文：放花筒时，作者盯住了伯父的眉毛、眼睛、皱纹，写出了“心底的欢笑”。',
    example: '那天我发高烧，半夜醒来，看见奶奶还坐在床边，一手拿着湿毛巾，一手轻轻拍着我。台灯调得很暗，她眯着眼睛，额上的皱纹在灯光里一道一道的。见我醒了，她赶紧凑过来：“乖，喝口水再睡。”',
  },
  {
    name: '写一位普通劳动者', pic: 'chefu',
    prompt: '你身边有没有默默付出的普通人？保安、清洁工、食堂阿姨……写一件你亲眼看到的事。',
    hint: '学课文：写清楚天气、环境，再写人物怎样做，最后写写你的感受。',
    example: '下雪的早晨，天还没亮，校门口的保安叔叔已经拿着大扫帚，把通往教学楼的小路扫出一条黑色的道。他的眉毛上结了一层白霜，见我们来了，还笑着提醒：“慢点走，别滑倒！”',
  },
  {
    name: '写一位朋友', pic: 'shuihu',
    prompt: '写一位好朋友。用一两件事写出他（她）最让你感动或佩服的地方。',
    hint: '一件事写一个方面，几件事合起来，人物就立起来了。',
    example: '期中考试前，我数学总考不好。同桌小林每天课间都拿着草稿纸给我讲题，一遍听不懂就讲两遍。有一次我急哭了，他把自己的错题本推过来：“你看，我以前错得比你还多呢。”',
  },
];

function initThings() {
  const box = document.getElementById('things');
  if (!box) return;
  box.addEventListener('click', (e) => {
    const card = e.target.closest('.thing');
    if (card) card.classList.toggle('open');
  });
}

window.LESSON = {
  init() {
    Narrative.init({ picks: PICKS, moments: MOMENTS });
    initThings();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
