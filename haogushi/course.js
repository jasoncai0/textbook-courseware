'use strict';
/* 好的故事 · 本课数据。页面逻辑见记叙文模板 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 课后第 2 题 · 美丽、幽雅、有趣（答案不唯一，允许多选一对） */
const KINDS = ['美丽', '幽雅', '有趣'];
const SORT_ITEMS = [
  { s: '两岸边的乌桕，新禾，野花，鸡，狗，丛树和枯树，茅屋，塔，伽蓝……', ok: ['美丽', '幽雅'], q: '景物多，一幅宁静的水乡图' },
  { s: '诸影诸物，无不解散，而且摇动，扩大，互相融和；刚一融和，却又退缩，复近于原形。', ok: ['有趣'], q: '倒影变来变去，像在游戏' },
  { s: '边缘都参差如夏云头，镶着日光，发出水银色焰。', ok: ['美丽'], q: '倒影的边闪着银光' },
  { s: '河边枯柳树下的几株瘦削的一丈红，该是村女种的罢。', ok: ['幽雅'], q: '清静雅致，令人想见种花的村女' },
  { s: '大红花一朵朵全被拉长了，这时是泼剌奔迸的红锦带。', ok: ['美丽', '有趣'], q: '色彩艳丽，又在跳动变化' },
  { s: '带织入狗中，狗织入白云中，白云织入村女中……', ok: ['有趣'], q: '倒影互相“编织”，奇妙有趣' },
];

/* 课后第 3 题 · 结合阅读链接理解最后两段 */
const CLUE_LABELS = ['读原文 / 资料', '我们读懂了'];
const CLUES = [
  { q: '“我抛了书，欠身伸手去取笔，——何尝有一丝碎影，只见昏暗的灯光，我不在小船里了。”', a: '梦醒了，美好一下子消失，眼前只有昏暗的现实——作者怅惘、失望。' },
  { q: '“但我总记得见过这一篇好的故事，在昏沉的夜……。”', a: '虽然在“昏沉的夜”，作者仍坚信美好存在——不放弃对理想的追求。' },
  { q: '冯雪峰：“作者希望着这样美丽的生活，是这篇作品的主要精神。”', a: '“好的故事”就是作者盼望的美好生活。' },
  { q: '李何林：表面是写风景、眷恋故乡，“实际是有所象征或寄托……”', a: '美景象征理想，昏沉的夜象征黑暗的现实：理想和现实的矛盾。' },
];

const MOMENTS = [
  {
    name: '写倒影', pic: 'daoying',
    prompt: '你见过水中的倒影吗？（湖边、河边、雨后的水洼……）学着课文，先写倒映着哪些景物，再写风吹或扔石子时倒影怎样变化。',
    hint: '可以用上：摇动、扩大、拉长、融和、碎散、退缩……',
    example: '公园的湖面像一面镜子，柳树、亭子、拱桥、白云都倒映在水里。一阵风吹过，倒影摇动起来，柳条拉得长长的，和亭子的红柱子融在一起；风一停，它们又慢慢退回原来的样子。',
  },
  {
    name: '写一个美梦', pic: 'shanyin',
    prompt: '你做过一个美好的梦吗？写一写梦里看见的景物和人，再写写醒来时的心情。',
    hint: '学课文：先写入梦（在哪里、怎样睡着），再写梦境，最后写醒来。',
    example: '我梦见自己坐在一片油菜花田里，金黄的花一直开到天边，蜜蜂嗡嗡地飞，外婆在田埂上喊我回家吃饭……闹钟一响，眼前只有灰白的天花板，可我总记得那片金黄。',
  },
];

/* 景物拼贴：把课文里的景物放到岸上，看它们倒映在水里 */
const BANK = ['乌桕', '新禾', '野花', '鸡', '狗', '丛树', '枯树', '茅屋', '塔', '伽蓝', '农夫', '村妇', '村女', '晒着的衣裳', '和尚', '蓑笠', '天', '云', '竹', '一丈红'];
const PER_ROW = 7;   // 每排 7 个，分三排前后错开，避免文字重叠
const STIR_MS = 2600;
const STONE_MS = 1800;

function initCollage() {
  const $ = (id) => document.getElementById(id);
  if (!$('river')) return;
  const say = (t) => { $('riverSay').textContent = t; };
  const placeAt = (i) => `${6 + ((i * 37) % 84)}%`;
  $('bankWords').innerHTML = BANK.map((w, i) => `<button type="button" class="bw" data-i="${i}">${w}</button>`).join('');

  $('bankWords').addEventListener('click', (e) => {
    const b = e.target.closest('.bw');
    if (!b || b.classList.contains('used')) return;
    const w = BANK[+b.dataset.i];
    const cls = `row${Math.floor(+b.dataset.i / PER_ROW)}`;
    const left = placeAt(+b.dataset.i);
    $('sky').insertAdjacentHTML('beforeend', `<span class="${cls}" style="left:${left}">${w}</span>`);
    $('water').insertAdjacentHTML('beforeend', `<span class="${cls}" style="left:${left}">${w}</span>`);
    b.classList.add('used');
    $('river').classList.remove('dark');
    say(`${w}，倒影在澄碧的小河中……`);
  });

  $('rowBtn').addEventListener('click', () => {
    const r = $('river');
    r.classList.remove('stir');
    void r.offsetWidth; // 重新触发动画
    r.classList.add('stir');
    say('诸影诸物，无不解散，而且摇动，扩大，互相融和；刚一融和，却又退缩，复近于原形。');
    setTimeout(() => r.classList.remove('stir'), STIR_MS);
  });

  $('stoneBtn').addEventListener('click', () => {
    const r = $('river');
    r.classList.add('shatter');
    say('水波陡然起立，将整篇的影子撕成片片了……');
    setTimeout(() => {
      r.classList.remove('shatter');
      r.classList.add('dark');
      $('water').innerHTML = '';
      $('sky').innerHTML = '';
      document.querySelectorAll('.bw.used').forEach((b) => b.classList.remove('used'));
      say('——何尝有一丝碎影，只见昏暗的灯光，我不在小船里了。');
    }, STONE_MS);
  });

  $('clearBtn').addEventListener('click', () => {
    $('river').classList.remove('dark', 'stir', 'shatter');
    $('water').innerHTML = '';
    $('sky').innerHTML = '';
    document.querySelectorAll('.bw.used').forEach((b) => b.classList.remove('used'));
    say('点上面的词语，把景物放到岸上，看它们倒映在水里。');
  });
}

window.LESSON = {
  init() {
    Narrative.init({ kinds: KINDS, sort: SORT_ITEMS, clues: CLUES, clueLabels: CLUE_LABELS, moments: MOMENTS });
    initCollage();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
