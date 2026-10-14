'use strict';
/* 走月亮 · 本课数据与互动。记叙文模板见 ../shared/narrative.js，背诵挖空见 ../shared/poem.js，翻页引擎见 ../shared/deck.js
 * 本课专属：月光长卷（读一句，画卷向前展开一段）、跟着月光走一走（一站一幅画面，标出看到、听到、闻到）。
 */

/* 背诵第 4 自然段（一句一行） */
Poem.render({
  beisong: {
    title: '走月亮（第 4 自然段）', author: '吴然',
    lines: [
      { t: '细细的溪水，流着山草和野花的香味，流着月光。灰白色的鹅卵石布满河床。' },
      { t: '哟，卵石间有多少可爱的小水塘啊，每个小水塘都抱着一个月亮！' },
      { t: '哦，阿妈，白天你在溪里洗衣裳，而我，用树叶做小船，运载许多新鲜的花瓣……' },
      { t: '哦，阿妈，我们到溪边去吧，去看看小水塘，看看水塘里的月亮，看看我采过野花的地方。' },
    ],
  },
});

/* 课后第 2 题：月光下的一站站（pic 取本课配图，pos 是取景位置） */
const STOPS = [
  { name: '小路', pic: 'yuesheng', pos: '50% 60%', q: '月光是那样柔和，照亮了高高的点苍山，照亮了村头的大青树，也照亮了，照亮了村间的大道和小路……',
    senses: [['看', '明亮的月盘、高高的山、大青树、洒满月光的小路']] },
  { name: '溪边', pic: 'xishui', pos: '50% 70%', q: '细细的溪水，流着山草和野花的香味，流着月光。……每个小水塘都抱着一个月亮！',
    senses: [['看', '灰白色的鹅卵石、抱着月亮的小水塘'], ['闻', '山草和野花的香味']] },
  { name: '村道', pic: 'guoyuan', pos: '20% 80%', q: '秋虫唱着，夜鸟拍打着翅膀，鱼儿跃出水面，泼剌声里银光一闪……',
    senses: [['听', '秋虫唱、夜鸟拍翅膀、鱼儿跃出水面的泼剌声'], ['看', '银光一闪']] },
  { name: '果园', pic: 'guoyuan', pos: '25% 35%', q: '从果园那边飘来果子的甜香，是雪梨，是火把梨，还是紫葡萄？都有。',
    senses: [['闻', '果子的甜香'], ['看', '果子挂满枝头']] },
  { name: '稻田', pic: 'guoyuan', pos: '70% 75%', q: '沟水汩汩，很满意地响着。……稻穗低垂着头，稻田像一块月光镀亮的银毯。',
    senses: [['听', '沟水汩汩'], ['看', '低垂的稻穗、银毯一样的稻田'], ['想', '春天的油菜花，阿爸就要回来了']] },
  { name: '天上', pic: 'xingxing', pos: '60% 25%', q: '美丽的月亮牵着那些闪闪烁烁的小星星，好像也在天上走着，走着……',
    senses: [['看', '月亮牵着小星星，也在天上走']] },
];

function initWalk() {
  const $ = (id) => document.getElementById(id);
  $('walkStops').innerHTML = STOPS.map((s, i) => `<button class="walk-stop" type="button" data-i="${i}"><em>${i + 1}</em>${s.name}</button>`).join('');
  const show = (i) => {
    const s = STOPS[i];
    $('walkStops').querySelectorAll('.walk-stop').forEach((b, k) => {
      b.classList.toggle('cur', k === i);
      if (k === i) b.classList.add('seen');
    });
    const pic = $('walkPic');
    pic.style.backgroundImage = `url(assets/${s.pic}.jpg)`;
    pic.style.backgroundPosition = s.pos;
    $('walkQ').textContent = s.q;
    $('walkSenses').innerHTML = s.senses.map(([k, t]) => `<p><b class="sense s-${k}">${k}</b>${t}</p>`).join('');
  };
  $('walkStops').addEventListener('click', (e) => {
    const b = e.target.closest('.walk-stop');
    if (b) show(+b.dataset.i);
  });
  show(0);
}

/* 课后第 3 题：优美生动的句子 */
const PICKS = {
  beauty: [
    { t: '细细的溪水，流着山草和野花的香味，流着月光。', ok: true, why: '月光也会“流”' },
    { t: '村道已经修补过，坑坑洼洼的地方已经填上碎石和新土。', ok: false, why: '交代村里的事' },
    { t: '每个小水塘都抱着一个月亮！', ok: true, why: '小水塘会“抱”月亮' },
    { t: '秋虫唱着，夜鸟拍打着翅膀……', ok: true, why: '秋虫会“唱”' },
    { t: '收了油菜，栽上水稻。', ok: false, why: '讲农活' },
    { t: '沟水汩汩，很满意地响着。', ok: true, why: '沟水也会“满意”' },
    { t: '稻田像一块月光镀亮的银毯。', ok: true, why: '比喻：稻田像银毯' },
    { t: '这是村里的风俗。', ok: false, why: '说明风俗' },
    { t: '美丽的月亮牵着那些闪闪烁烁的小星星，好像也在天上走着，走着……', ok: true, why: '月亮会“牵”星星' },
  ],
};

/* 小练笔 */
const MOMENTS = [
  { name: '月下散步', pic: 'yuesheng', prompt: '和家人在月光下散步，你看到了什么，又想到了什么？', hint: '学第 6 自然段：先写看到、听到、闻到的，再写由此想起的事。',
    example: '吃过晚饭，我和爸爸在小区里散步。月光洒在小路上，像铺了一层薄薄的霜。草丛里的蟋蟀在唱歌，桂花的香味一阵阵飘过来。爸爸说，他小时候也常和奶奶在月下走，一边走一边听奶奶讲嫦娥的故事。' },
  { name: '中秋赏月', pic: 'xingxing', prompt: '中秋节晚上，一家人一起赏月，是什么样的情景？', hint: '月亮是什么样子的？大家在做什么、说什么？你心里想到了什么？',
    example: '中秋节的晚上，月亮又大又圆，像一个白玉盘挂在天上。我们一家人坐在阳台上，一边吃月饼，一边看月亮。妈妈说，远在外地的舅舅这时候也在看同一个月亮呢。' },
  { name: '月下的水边', pic: 'xishui', prompt: '月光下的河边、湖边或者小水洼，是什么样子的？', hint: '水里的月亮是什么样的？风一吹，又会怎样？',
    example: '雨停了，路边的小水洼里也有一个月亮。我蹲下来看，它圆圆的、亮亮的。一阵风吹过，月亮碎成了好多片银光，一会儿又合在了一起，好像在跟我玩捉迷藏。' },
];

/* 月光长卷：最近出现的那句话在哪一段（data-pan），画卷就移到哪一段 */
function updateScroll(slide, step) {
  const track = slide.querySelector('#lsTrack');
  if (!track) return;
  const lines = [...slide.querySelectorAll('#lsTxt p')];
  const shown = lines.filter((p) => +p.dataset.step <= step);
  const pan = shown.length ? +shown[shown.length - 1].dataset.pan : 0;
  const pans = track.children.length;
  track.style.transform = `translateX(calc(3.125% - ${pan * 25}%))`;
  [...track.children].forEach((el, i) => el.classList.toggle('cur', i === pan));
  slide.querySelectorAll('#lsRoad span').forEach((el, i) => el.classList.toggle('cur', i === pan));
  slide.querySelector('.ls-moon').style.left = `${(pan + 0.5) * (100 / pans)}%`;
  lines.forEach((p) => {
    p.classList.toggle('here', +p.dataset.pan === pan);
    p.classList.toggle('now', p === shown[shown.length - 1]);
  });
  // 句子多时文字框自己滚到最新一句（不用 scrollIntoView，免得把整页带着滚）
  const box = slide.querySelector('#lsTxt');
  const now = shown[shown.length - 1];
  box.scrollTop = now ? Math.max(0, now.offsetTop + now.offsetHeight - box.clientHeight) : 0;
}

window.LESSON = {
  init() {
    Narrative.init({ picks: PICKS, moments: MOMENTS });
    Poem.init();
    initWalk();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateScroll(slide, step);
  },
};
