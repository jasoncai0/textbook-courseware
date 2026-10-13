'use strict';
/* 乡下人家 · 本课数据与互动。记叙文模板见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js
 * 本课专属：横向长卷（读到哪段，画卷展开到哪里；最后一步全卷展开）、给七幅画取名字、关键句“不论什么时候，不论什么季节”点一点看画面。
 */

/* 横向长卷：段落 p[data-panel] 对应第几幅画，data-pos 是画面里的取景（视频用 object-position）；all = 全卷展开 */
function showJuan(lineEl) {
  const juan = document.getElementById('juan');
  const track = document.getElementById('juanTrack');
  const panels = [...track.children];
  document.querySelectorAll('.juan-txt p[data-step]').forEach((p) => p.classList.toggle('now', p === lineEl));
  document.querySelector('.juan-hint').hidden = Boolean(lineEl);
  const which = lineEl ? lineEl.dataset.panel : '0';
  juan.classList.toggle('all', which === 'all');
  if (which === 'all') {
    track.style.transform = 'none';
    panels.forEach((x) => x.classList.remove('cur'));
    return;
  }
  const panel = panels[+which];
  const offset = panel.offsetLeft - (juan.clientWidth - panel.offsetWidth) / 2;
  track.style.transform = `translateX(${(-Math.max(0, offset)).toFixed(0)}px)`;
  panels.forEach((x) => x.classList.toggle('cur', x === panel));
  const v = panel.querySelector('video');
  if (v && lineEl && lineEl.dataset.pos) v.style.objectPosition = lineEl.dataset.pos;
}
function updateJuan(slide, step) {
  if (!slide.querySelector('#juan')) return;
  const lines = [...slide.querySelectorAll('.juan-txt p[data-step]')].filter((p) => +p.dataset.step <= step);
  showJuan(lines.pop() || null);
}
function initJuan() {
  const track = document.getElementById('juanTrack');
  track.addEventListener('click', (e) => {
    const panel = e.target.closest('.juan-panel');
    if (!panel) return;
    const i = [...track.children].indexOf(panel);
    showJuan(document.querySelector(`.juan-txt p[data-panel="${i}"]`));
  });
  new ResizeObserver(() => {
    const slide = track.closest('.slide');
    if (slide.classList.contains('active')) showJuan(slide.querySelector('.juan-txt p.now'));
  }).observe(document.getElementById('juan'));
}

/* 课后第 1 题：七幅画（pic 取本课配图，pos 是取景位置） */
const SCENES = [
  { pic: 'guajia', pos: '35% 35%', ref: '瓜藤攀檐图', hint: '屋前的瓜架' },
  { pic: 'guajia', pos: '50% 85%', ref: '鲜花轮绽图', hint: '门前的花' },
  { pic: 'guajia', pos: '90% 80%', ref: '雨后春笋图', hint: '屋后的竹和笋' },
  { pic: 'jiya', pos: '20% 60%', ref: '雄鸡觅食图', hint: '房前屋后的鸡' },
  { pic: 'jiya', pos: '80% 60%', ref: '鸭子戏水图', hint: '屋后小河的鸭' },
  { pic: 'wanfan', pos: '50% 60%', ref: '院落晚餐图', hint: '夏天傍晚吃晚饭' },
  { pic: 'qiuye', pos: '50% 50%', ref: '月夜虫鸣图', hint: '秋夜纺织娘唱歌' },
];
function initNames() {
  const grid = document.getElementById('nameGrid');
  grid.innerHTML = SCENES.map((s, i) => `<div class="name-card">
      <div class="name-pic" style="background-image:url(assets/${s.pic}.jpg);background-position:${s.pos}"><em>${i + 1}</em></div>
      <small>${s.hint}</small>
      <input type="text" maxlength="8" placeholder="取个名字">
      <button type="button" class="name-ref" data-ref="${s.ref}">参考</button>
    </div>`).join('');
  grid.addEventListener('click', (e) => {
    const b = e.target.closest('.name-ref');
    if (b) b.textContent = b.textContent === '参考' ? b.dataset.ref : '参考';
  });
}

/* 关键句：时候、季节 → 画面 */
const KEYS = [
  { pic: 'jiya', pos: '50% 50%', t: '白天：母鸡率领小鸡在竹林中觅食，鸭子在小河里游戏。' },
  { pic: 'wanfan', pos: '50% 50%', t: '傍晚：把桌椅饭菜搬到门前，天高地阔地吃起来。' },
  { pic: 'qiuye', pos: '50% 50%', t: '夜里：纺织娘唱起歌来，人们甜甜蜜蜜地进入梦乡。' },
  { pic: 'guajia', pos: '90% 80%', t: '春天：几场春雨过后，鲜嫩的笋成群地从土里探出头来。' },
  { pic: 'wanfan', pos: '50% 30%', t: '夏天：傍晚的红霞、微风、归巢的鸟儿都是他们的好友。' },
  { pic: 'qiuye', pos: '40% 45%', t: '秋天：纺织娘寄住在屋前的瓜架上，唱起歌来。' },
];
function initKey() {
  const pic = document.getElementById('keyPic');
  const txt = document.getElementById('keyTxt');
  const slide = pic.closest('.slide');
  slide.addEventListener('click', (e) => {
    const b = e.target.closest('[data-k]');
    if (!b) return;
    const k = KEYS[+b.dataset.k];
    slide.querySelectorAll('[data-k]').forEach((x) => x.classList.toggle('solid', x === b));
    pic.style.backgroundImage = `url(assets/${k.pic}.jpg)`;
    pic.style.backgroundPosition = k.pos;
    txt.textContent = k.t;
  });
}

/* 课后第 3 题：生动形象的句子 */
const PICKS = {
  vivid: [
    { t: '几场春雨过后……许多鲜嫩的笋，成群地从土里探出头来。', ok: true, why: '笋会“探出头”' },
    { t: '他们把桌椅饭菜搬到门前，天高地阔地吃起来。', ok: true, why: '天高地阔，多自在' },
    { t: '鸡，乡下人家照例总要养几只的。', ok: false, why: '交代养鸡的习惯' },
    { t: '一只母鸡，率领一群小鸡，在竹林中觅食。', ok: true, why: '母鸡像将军“率领”' },
    { t: '耸着尾巴的雄鸡，在场地上大踏步地走来走去。', ok: true, why: '雄鸡神气十足' },
    { t: '他们的屋后倘若有一条小河……', ok: false, why: '交代地点' },
    { t: '天边的红霞，向晚的微风，头上飞过的归巢的鸟儿，都是他们的好友。', ok: true, why: '景物都成了“好友”' },
    { t: '“织，织，织，织啊！织，织，织，织啊！”那歌声真好听，赛过催眠曲。', ok: true, why: '听得见的歌声' },
  ],
};

/* 读与写 */
const MOMENTS = [
  { name: '田野', pic: 'guajia', prompt: '乡下的田野、菜园是什么样子的？', hint: '学第 1 自然段：写出颜色（青的、红的、碧绿的），再说说你喜欢它的理由。',
    example: '外婆家的菜园就在屋旁。黄瓜藤顺着竹竿爬得高高的，顶着一朵朵小黄花；紫红的茄子胖乎乎地垂着，像一个个小灯笼；绿油油的青菜挤在一起，叶子上还挂着露珠。站在菜园边，我觉得这比城里的花坛有趣多了。' },
  { name: '小动物', pic: 'jiya', prompt: '乡下的鸡、鸭、鹅、牛、狗……它们在做什么？', hint: '学第 3、4 自然段：用上准确的动作（率领、耸着、大踏步、扎到水下）。',
    example: '一出门，就看见一只大白鹅伸长脖子，摇摇摆摆地走过来，好像在巡视自己的地盘。池塘边，老黄牛慢悠悠地甩着尾巴吃草；小黄狗在田埂上跑来跑去，一会儿追蝴蝶，一会儿又冲着我摇尾巴。' },
  { name: '照样子写', pic: 'wanfan', prompt: '照样子写：天边的红霞，向晚的微风，头上飞过的归巢的鸟儿，都是他们的好友。', hint: '选一个地方（海边、公园、校园），用三个景物写一句话，再说它们“构成了”或“都是”什么。',
    example: '清晨的露珠，林间的鸟鸣，小路上淡淡的雾，都是早起散步的人们的好朋友。' },
];

window.LESSON = {
  init() {
    Narrative.init({ picks: PICKS, moments: MOMENTS });
    initJuan();
    initNames();
    initKey();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateJuan(slide, step);
  },
};
