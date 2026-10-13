'use strict';
/* 精神的三间小屋 · 本课数据与互动：三屋空间布置（爱恨滑块、事业与自我的两种布置）、比喻翻卡、读写。通用部分见 ../shared/narrative.js */

const SAY = {
  love: '假若爱比恨多，小屋就光明温暖，像一座金色池塘，有红色的鲤鱼游弋，那是你的大福气。',
  hate: '假如恨比爱多，小屋就凄风苦雨，愁云惨雾，你会精神悲戚压抑，形销骨立。',
  even: '拖动滑块：在布置我们的精神空间时，给爱留下足够的容量。',
  r2love: '假如你所从事的工作，是你的爱好，这七万个小时，将是怎样快活和充满创意的时光！',
  r2halo: '否则，鸠占鹊巢，李代桃僵，那屋内必是鸡飞狗跳，不得安宁。',
  r3self: '在自己的思维里留一条细细的羊肠小道，给自己的发现留一个小小的储藏盒。',
  r3others: '我们的精神小屋，不必等待地震和潮汐，在微风中就悄无声息地坍塌了。',
};

function initHouse() {
  const $ = (id) => document.getElementById(id);
  const range = $('loveRange');
  const room1 = () => {
    const v = +range.value;
    const mood = v > 55 ? 'love' : v < 45 ? 'hate' : 'even';
    $('room1').dataset.mood = mood;
    $('say1').textContent = SAY[mood];
  };
  range.addEventListener('input', room1);
  room1();
  $('say2').textContent = '选一种布置。';
  $('say3').textContent = '选一种布置。';
  document.querySelectorAll('[data-r2]').forEach((b) => b.addEventListener('click', () => {
    document.querySelectorAll('[data-r2]').forEach((x) => x.classList.toggle('solid', x === b));
    $('room2').dataset.mood = b.dataset.r2;
    $('say2').textContent = SAY[`r2${b.dataset.r2}`];
  }));
  document.querySelectorAll('[data-r3]').forEach((b) => b.addEventListener('click', () => {
    document.querySelectorAll('[data-r3]').forEach((x) => x.classList.toggle('solid', x === b));
    $('room3').dataset.mood = b.dataset.r3;
    $('say3').textContent = SAY[`r3${b.dataset.r3}`];
  }));
}

const CLUES = [
  { q: '“宰相肚里能撑船”“比大地、海洋和天空都更为博大”', a: '心灵的空间要博大——引出“精神的三间小屋”。' },
  { q: '“仿佛以木石制作的古老乐器……与天地呼应，铮铮作响”', a: '一生经历的悲欢离合、喜怒哀乐，会在某一时刻被唤醒。' },
  { q: '“每一天都如同穿着淋湿的衬衣，针芒在身”', a: '从事不喜欢的工作，每一天都难受。' },
  { q: '“我们的事业，是我们的田野”', a: '事业要我们播种、耕耘，才有收获。' },
  { q: '“他人思想汽车驰骋的高速公路”“集装箱”', a: '头脑里装满别人的思想和信息，却没有自己的思考。' },
  { q: '“纸糊的墙壁”“白雪的顶棚”“江米纸的窗棂”', a: '没有自我的精神小屋，脆弱得一碰就坍塌。' },
];

const MOMENTS = [
  {
    name: '我的第一间小屋', pic: 'chitang',
    prompt: '写一写你的第一间小屋里，放着哪些“爱”？你准备怎样“给爱留下足够的容量”？',
    hint: '写具体：对谁的爱、哪一件小事。',
    example: '我的第一间小屋里，有外婆晒在阳台上的被子味，有同桌借我的那支笔，有楼下那只总来蹭我裤腿的猫。遇到不开心的事，我就把它们一件件拿出来擦一擦，小屋就又亮了。',
  },
  {
    name: '给自己留一间', pic: 'sanjian',
    prompt: '在信息很多的今天，你怎样让第三间小屋“住着自己”？写两三条做法。',
    hint: '可以从阅读、独处、写日记、提出自己的疑问等方面想。',
    example: '一、每天留出十分钟不看手机，只想自己的事；二、读完一本书，写下一句“我不同意”或“我还想知道”；三、遇到热门话题，先问问自己怎么看，再去看别人怎么说。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: ['课文中的比喻', '它说的是'], moments: MOMENTS });
    initHouse();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
