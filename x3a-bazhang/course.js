'use strict';
/* 铺满金色巴掌的水泥道 · 本课数据。页面逻辑见记叙文模板 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 课后第 2 题：理解词语用了什么方法 */
const KINDS = ['联系上下文', '看图', '生活经验', '查字典'];
const SORT_ITEMS = [
  { s: '啊！多么<b>明朗</b>的天空。', ok: ['联系上下文', '生活经验'], q: '明亮晴朗：雨停了，天放晴了' },
  { s: '它们排列得并不规则，甚至有些<b>凌乱</b>。', ok: ['联系上下文', '看图'], q: '不整齐，没有次序' },
  { s: '<b>熨帖</b>地、平展地粘在水泥道上。', ok: ['查字典', '联系上下文'], q: '平平整整、服服帖帖' },
];

const CLUE_LABELS = ['课文这样写……', '我发现……'];
const CLUES = [
  { q: '水泥道像铺上了一块彩色的地毯。', a: '落叶铺满了路，印着落叶图案、闪闪发光，一直铺到路的尽头。' },
  { q: '每一片落叶，都像一个金色的小巴掌。', a: '梧桐叶分成几个尖尖的叶片，像张开的手掌，又是金黄色的。' },
  { q: '小雨靴多像两只棕红色的小鸟。', a: '“我”在落叶间一蹦一跳，心里快活得想唱歌。' },
  { q: '开头和结尾都写：一夜秋风，一夜秋雨。', a: '首尾呼应：是秋风秋雨送来了满地金色的巴掌。' },
];

const MOMENTS = [
  { name: '上学路上', pic: 'fangqing', prompt: '早晨上学的路上，你看到了什么样的景色？', hint: '看看天空、路边的树、花坛、小摊……抓住一处写具体。', example: '上学路上，小区门口的银杏树全黄了。风一吹，叶子像一只只黄蝴蝶飞下来，落在我的书包上，好像要跟我一起去上学。' },
  { name: '放学路上', pic: 'ditan', prompt: '放学回家的路上，什么景色让你停下了脚步？', hint: '可以写傍晚的天空、路灯亮起来的时候……', example: '放学路上，西边的天空红彤彤的，晚霞像一块大红布铺在楼顶上。我一边走一边看，差点走过了家门。' },
  { name: '雨后的路', pic: 'bazhang', prompt: '下过雨的路是什么样的？学着课文写一写。', hint: '水洼里映着什么？路边的叶子、花草有什么变化？', example: '雨停了，路上有好几个小水洼，像一面面小镜子，映着蓝天和白云。我小心地绕过去，生怕踩碎了里面的天空。' },
];

/* 凌乱 / 规则：同一组叶子换两种排法 */
const LEAF_COLORS = ['#e6a72a', '#d9902a', '#efbd3a', '#c97a24'];
const LEAVES = 12;
function leafLayout(kind) {
  return Array.from({ length: LEAVES }, (_, i) => {
    if (kind === 'grid') return { x: 60 + (i % 4) * 93, y: 60 + Math.floor(i / 4) * 90, r: 0 };
    // 固定的“乱”：每片叶子位置、角度各不相同，但每次一样
    return { x: 40 + ((i * 137) % 330), y: 40 + ((i * 83) % 225), r: (i * 47) % 360 };
  });
}
function initLeaves() {
  const g = document.getElementById('leafGroup');
  g.innerHTML = Array.from({ length: LEAVES }, (_, i) => `<use href="#leafShape" class="lf" fill="${LEAF_COLORS[i % LEAF_COLORS.length]}"/>`).join('');
  const apply = (kind) => {
    leafLayout(kind).forEach((p, i) => { g.children[i].style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.r}deg)`; });
    document.querySelectorAll('.layout-btn').forEach((b) => b.classList.toggle('solid', b.dataset.layout === kind));
  };
  document.querySelectorAll('.layout-btn').forEach((b) => b.addEventListener('click', () => apply(b.dataset.layout)));
  apply('messy');
}

/* ================= 本课独有：上学路长卷（读到哪里，画面走到哪里） =================
 * 字幕行 data-pan = 第几幅画（4 = 走到终点，仍停在最后一幅）；画幅宽占屏 PANEL，左右露出相邻的画 */
const PANEL = 0.78;
const LAST_PANEL = 3;
function updateRoll(slide, step) {
  const shown = [...slide.querySelectorAll('.subs p[data-pan]')].filter((p) => +p.dataset.step <= step);
  const stop = shown.length ? +shown[shown.length - 1].dataset.pan : 0;
  const pan = Math.min(stop, LAST_PANEL);
  const w = slide.clientWidth;
  const isNarrow = w < slide.clientHeight; // 竖屏手机：一幅占满，不露邻图
  const pw = isNarrow ? 1 : PANEL;
  const track = slide.querySelector('.roll-track');
  track.style.setProperty('--pw', `${pw * w}px`);
  track.style.transform = `translateX(${((1 - pw) / 2 - pan * pw) * w}px)`;
  slide.querySelectorAll('.roll-panel').forEach((p, i) => p.classList.toggle('cur', i === pan));
  slide.querySelectorAll('.route li').forEach((li) => {
    li.classList.toggle('done', +li.dataset.p < stop);
    li.classList.toggle('cur', +li.dataset.p === stop && step > 0);
  });
  const v = slide.querySelector('.roll video');
  if (v) { if (pan === LAST_PANEL) v.play().catch(() => { /* 不能自动播放就停在封面帧 */ }); else v.pause(); }
}

window.LESSON = {
  init() {
    Narrative.init({ kinds: KINDS, sort: SORT_ITEMS, clues: CLUES, clueLabels: CLUE_LABELS, moments: MOMENTS });
    initLeaves();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    document.querySelectorAll('.s-roll').forEach((r) => { if (r !== slide) { const v = r.querySelector('video'); if (v) v.pause(); } });
    if (slide.classList.contains('s-roll')) updateRoll(slide, step);
  },
};
