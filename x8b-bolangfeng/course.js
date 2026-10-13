'use strict';
/* 登勃朗峰 · 本课数据。本课独有：移步换景胶片条 + 速度表 / 写景笔墨表 */

/* 胶片：每格 = 地点、行进方式、速度（0~100）、写景笔墨（0~100）、原文 */
const FRAMES = [
  { pic: 'qiongding', pos: '10% 80%', place: '马蒂尼出发', move: '徒步上坡', speed: 22, ink: 45, q: '路为上坡——一路都为上坡——且相当陡峭。天气灼热难当……' },
  { pic: 'qiongding', pos: '20% 60%', place: '黑首道', move: '徒步', speed: 22, ink: 70, q: '俯瞰脚下峡谷，只见其间一股清流急湍，环顾四周，岩壁巉峻，丘岗葱绿，美不胜收。' },
  { pic: 'qiongding', pos: '50% 30%', place: 'V 字形山口', move: '徒步', speed: 22, ink: 80, q: '一座巨大的白雪穹顶骤然映入眼帘，日照其上，光艳耀目。' },
  { pic: 'qiongding', pos: '60% 15%', place: '拾级而上', move: '拾级', speed: 12, ink: 80, q: '威严的穹顶也随之愈升愈高，耸入蓝天，最后仿佛独踞苍穹。' },
  { pic: 'caixia', pos: '85% 60%', place: '高地 · 怪峰', move: '逗留', speed: 6, ink: 85, q: '有些顶端尖峭，并微微倾向一旁，宛如美女的纤指；有一怪峰，形如塔糖。' },
  { pic: 'caixia', pos: '50% 25%', place: '仰望峰巅彩霞', move: '就地而坐', speed: 0, ink: 100, q: '彩霞满天，白云缭绕，轻歌曼舞……瞬息万变，真是无穷变幻，纷至沓来。' },
  { pic: 'mache', pos: '50% 50%', place: '河谷 → 沙蒙尼', move: '敞篷马车', speed: 100, ink: 12, q: '什么乱石废物，沟壑旷野，一概不顾——有时一两个轮子着地，但大多数时候腾空而起。' },
  { pic: 'mache', pos: '80% 40%', place: '沙蒙尼旅馆', move: '到达', speed: 0, ink: 8, q: '结果，到达沙蒙尼旅馆后，我们住进了上等的房间。' },
];
const SPEED_TEXT = (v) => (v === 0 ? '停下' : v < 15 ? '很慢' : v < 50 ? '慢' : '疾驰');
const INK_TEXT = (v) => (v >= 80 ? '浓墨重彩' : v >= 40 ? '细描' : '简笔');

function buildFilm() {
  document.getElementById('fmStrip').innerHTML = FRAMES.map((f, i) => `<div class="fm-frame" data-step="${i + 1}">
      <div class="fm-pic" data-bg="assets/${f.pic}.jpg" style="background-position:${f.pos}"></div>
      <div class="fm-cap"><b>${i + 1}　${f.place}</b><em>${f.move}</em><p>${f.q}</p></div></div>`).join('');
  // 最后一步出“发现”
  document.querySelector('.fm-end').dataset.step = FRAMES.length + 1;
}
buildFilm(); // 必须在 deck.js 统计分步之前

const FRAME_VISIBLE = 3; // 一屏同时看到的格数
function updateFilm(slide, step) {
  const strip = slide.querySelector('#fmStrip');
  if (!strip) return;
  const idx = Math.max(0, Math.min(step, FRAMES.length) - 1);
  const shift = Math.max(0, Math.min(idx - 1, FRAMES.length - FRAME_VISIBLE));
  strip.style.setProperty('--shift', shift);
  strip.querySelectorAll('.fm-frame').forEach((f, i) => f.classList.toggle('cur', step > 0 && i === idx && step <= FRAMES.length));
  const f = step > 0 ? FRAMES[idx] : { speed: 0, ink: 0 };
  slide.querySelector('#fmSpeed').style.width = `${f.speed}%`;
  slide.querySelector('#fmInk').style.width = `${f.ink}%`;
  slide.querySelector('#fmSpeedText').textContent = step > 0 ? SPEED_TEXT(f.speed) : '';
  slide.querySelector('#fmInkText').textContent = step > 0 ? INK_TEXT(f.ink) : '';
}

function initSideQ() {
  document.querySelector('.bl-q').addEventListener('click', (e) => {
    const q = e.target.closest('.bl-qa');
    if (q) q.classList.toggle('open');
  });
}

const MOMENTS = [
  {
    name: '写旅途中的奇人', pic: 'mache',
    prompt: '回忆一次出游中遇到的有趣的人（司机、导游、摊主……），学习“车夫之王”的写法写一个片段。',
    hint: '抓住他最有特点的一句口头禅或一个动作，反复写；用一点夸张、反差，让人物活起来。',
    example: '那位出租车司机一路都在说：“放心，这条路我闭着眼睛都能开。”遇到堵车，他说；拐错了弯，他也说；最后绕了半个城才到车站，他把车一停，回头冲我们一笑：“看，我说什么来着——闭着眼睛都能开！”我们几个人愣了一下，全都笑出了声。',
  },
  {
    name: '写一段移步换景', pic: 'qiongding',
    prompt: '写一段登高（爬楼、爬山、上天桥）的经历，写出“随着我往上走，看到的景物在变化”。',
    hint: '至少写三个位置；每个位置用一两个准确的词写出所见；最后一句写感受。',
    example: '刚走上台阶，眼前只有一面灰扑扑的墙。转过第一个平台，墙矮了下去，露出对面楼顶上一排晒着的被子。再往上，被子也沉到了脚下，远处的河像一条亮闪闪的带子绕过城市。等我喘着气站到楼顶，风一下子扑过来——整座城都铺在眼前了。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    initSideQ();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateFilm(slide, step);
  },
};
