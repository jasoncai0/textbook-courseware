'use strict';
/* 我们奇妙的世界 · 本课数据与本课互动。通用逻辑见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 课后第 1 题 · 分一分：天空的珍藏还是大地的珍藏 */
const KINDS = ['天空', '大地'];
const SORT_ITEMS = [
  { s: '太阳就像一个大火球一样升起来了。', ok: ['天空'], q: '清晨的太阳' },
  { s: '雨后，地上有许多水洼，就像有趣的镜子。', ok: ['天空'], q: '雨后的水洼（接着写雨）' },
  { s: '圆润的鲜红色的樱桃，深紫色的李子，浅黄色的梨。', ok: ['大地'], q: '诱人的水果' },
  { s: '落日的余晖不时变幻着颜色。', ok: ['天空'], q: '傍晚的余晖' },
  { s: '蝴蝶张开漂亮的翅膀在空中翩翩起舞。', ok: ['大地'], q: '秋天的景物' },
  { s: '房檐上垂下的冰柱，好像一把把锋利的刀剑。', ok: ['大地'], q: '冬天的冰柱' },
];

/* 课后第 2 题：哪里像是“活”的 */
const CLUE_LABELS = ['课文里的句子', '像“活”的一样'];
const CLUES = [
  { q: '太阳升起，带来新的一天。', a: '太阳像一位朋友，每天早上给我们<b>送来</b>新的一天。' },
  { q: '云彩在蓝色的天空中飞行……告诉我们许多奇妙的故事……', a: '云彩会<b>飞</b>，还会<b>讲故事</b>，像一个会变魔术的小伙伴。' },
  { q: '好像有谁在天空涂上了金色、红色和紫色。', a: '天空像一块大画布，好像有一位<b>画家</b>在上面涂颜色。' },
  { q: '秋天带着金黄色的光辉神奇地到来了。', a: '秋天像一个人，<b>带着</b>礼物、<b>神奇地</b>走来了。' },
];

/* 小练笔：普通而美的事物（前三项是课后例句） */
const MOMENTS = [
  {
    name: '水洼', pic: 'shuiwa',
    prompt: '雨后，我们会看到地上有许多水洼，就像有趣的镜子，映射着我们的脸。',
    hint: '课文把普通的水洼写成了“有趣的镜子”。你身边有什么东西，也像镜子、像玩具、像朋友？',
    example: '下雪后，窗玻璃上结了一层冰花，就像谁在夜里悄悄画了一片白色的森林。',
  },
  {
    name: '星星', pic: 'xingkong',
    prompt: '黑夜降临了，我们看见夜空中群星闪烁，就像千千万万支极小的蜡烛在发光。',
    hint: '仔细看看晚上的天空、路灯、窗户里的灯光，它们像什么？',
    example: '天黑了，楼房的窗户一扇扇亮起来，就像一格格装满星星的小盒子。',
  },
  {
    name: '大树', pic: 'qingchen',
    prompt: '夏日，在大树下乘凉，我们会感叹，大树带来这么多绿荫。',
    hint: '想一想校园里、小区里的一棵树、一丛花、一块石头，你在它旁边有什么感受？',
    example: '操场边的老槐树张开大大的手臂，夏天给我们撑起一把绿色的大伞。',
  },
  {
    name: '我身边的', pic: 'dongtian',
    prompt: '只要我们仔细地观察，寻找，就能从极普通的事物中找到美。选一样你身边普通的东西，写一写它的美。',
    hint: '可以写：一片落叶、一颗小石子、早上的露珠、妈妈的围巾……先说它的样子，再用“就像……”说说它像什么。',
    example: '草叶上挂着一颗颗露珠，太阳一照，亮晶晶的，就像小草戴上了透明的珍珠项链。',
  },
];

/* 天空的一天：第 n 步换成第 n 种天空 */
const SKY_CAPS = [
  '点“下一步”，看天空从早到晚怎样变化。',
  '清晨：天空呈粉红色，慢慢地变成了蔚蓝色，太阳像一个大火球。',
  '有时：云彩在蓝色的天空中飞行，呈现出各种奇妙的形状。',
  '云彩变得又黑又重，雨点噼噼啪啪地降落到大地上。',
  '雨后：地上的水洼就像有趣的镜子，映射着我们的脸。',
  '傍晚：落日的余晖不时变幻着颜色——金色、红色和紫色。',
  '黑夜：群星闪烁，就像千千万万支极小的蜡烛在发光。',
];
function setSky(slide, n) {
  slide.dataset.sky = n;
  slide.querySelectorAll('[data-sky]').forEach((b) => { if (b !== slide) b.classList.toggle('solid', +b.dataset.sky === n); });
  slide.querySelector('#skyCap').textContent = SKY_CAPS[n];
}

window.LESSON = {
  init() {
    Narrative.init({ kinds: KINDS, sort: SORT_ITEMS, clues: CLUES, clueLabels: CLUE_LABELS, moments: MOMENTS });
    const sky = document.querySelector('.s-sky');
    sky.querySelector('.sky-times').addEventListener('click', (e) => {
      const b = e.target.closest('button[data-sky]');
      if (b) setSky(sky, +b.dataset.sky);
    });
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.classList.contains('s-sky')) setSky(slide, Math.min(step, 6));
  },
};
