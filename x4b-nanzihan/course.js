'use strict';
/* 我们家的男子汉 · 本课数据与互动。记叙文模板见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js
 * 本课独有：成长相册（三个小标题 = 三页相册）、“越长越大”的结尾段 */

/* 成长相册：每页一个小标题（原文中“……”为略去部分） */
const ALBUM = [
  {
    pic: 'chifan', cap: '吃一客小笼包子，可以耐心地等上三刻钟',
    lines: [
      '“他吃饭很爽气。”带他的保姆这么说他。确实，他吃饭吃得很好，量很多，范围很广——什么都要吃，而且吃得极有滋味，叫人看了不由得也会嘴馋起来。',
      '为了吃一客小笼包子，他可以耐心地等上三刻钟；他会为他喜欢吃的东西编儿歌一样的谜语。',
      '他说：“用肉汤拌饭可以吗？”“不可以。”“那么棒冰可以吃吗？”他小心地问……',
    ],
    tag: '他是个热爱生活、懂得享受生活的小男子汉。',
  },
  {
    pic: 'qishui', cap: '自个儿拿着汽水瓶去换橘子水',
    lines: [
      '一只胖胖的小手在我的手掌里，像一条倔强的活鱼一样挣扎着。',
      '“不要，不要，我自己说。”他说。到了柜台前，他又嘱咐我一句：“你不要讲话啊！”',
      '他满头大汗地、耐心地等待着。我很想走过去帮他叫一声“同志”，可最后还是忍住了。',
    ],
    tag: '他什么都想自己来——一个要求独立的小男子汉。',
  },
  {
    pic: 'chechuang', cap: '四岁，自己从车窗爬进车厢',
    lines: [
      '去的那天早晨，他一声不吭，很镇静地四下打量着。',
      '他明白了自己不得不去，也就坦然地接受了这个现实，不作任何无效的挣扎。',
      '他勇敢地抓住窗框，两只脚有力地蹬着车厢，攀上了窗口。',
    ],
    tag: '遇到难事不哭不闹，沉着勇敢——真是个男子汉！',
  },
];

function initAlbum() {
  const $ = (id) => document.getElementById(id);
  const show = (i) => {
    const a = ALBUM[i];
    $('albumPhoto').style.backgroundImage = `url(assets/${a.pic}.jpg)`;
    $('albumCap').textContent = a.cap;
    $('albumLines').innerHTML = a.lines.map((t) => `<p>${t}</p>`).join('');
    $('albumTag').textContent = a.tag;
    document.querySelectorAll('#albumTabs .btn').forEach((b, k) => b.classList.toggle('solid', k === i));
  };
  $('albumTabs').addEventListener('click', (e) => {
    const b = e.target.closest('[data-a]');
    if (b) show(+b.dataset.a);
  });
  show(0);
}

/* 为什么称他为男子汉 */
const PICKS = {
  why: [
    { t: '什么都要吃，而且吃得极有滋味', ok: true, why: '✓ 热爱生活' },
    { t: '不愿让人牵他的手', ok: true, why: '✓ 要求独立' },
    { t: '“不要，不要，我自己说。”', ok: true, why: '✓ 要求独立' },
    { t: '哭着闹着不肯去托儿所', ok: false, why: '✗ 这是“我们姐妹几个小时候”' },
    { t: '一声不吭，很镇静地四下打量着', ok: true, why: '✓ 沉着' },
    { t: '一路都要大人牵着手', ok: false, why: '✗ 正相反，他不让人牵手' },
    { t: '推开妨碍他的手，蹿进了车厢', ok: true, why: '✓ 勇敢' },
  ],
};

/* 换个小标题 · 写一写 */
const MOMENTS = [
  {
    name: '换小标题', pic: 'qishui',
    prompt: '给三个部分各换一个小标题。',
    hint: '可以短一点、生动一点，抓住这部分最突出的事或特点。',
    example: '小馋猫／我自己来／自己爬上火车（也可以是：吃饭真爽气／一个人去买橘子水／不哭不闹去托儿所）',
  },
  {
    name: '我家的“小大人”', pic: 'chifan',
    prompt: '你家有没有像他一样的“小大人”？或者写写你自己的一次“我自己来”。',
    hint: '学课文：抓住一两件小事，写出他说的话、做的动作。',
    example: '我的表弟才四岁，可什么都要自己来。吃饭时，妈妈想喂他，他一扭头：“我自己吃！”结果饭粒撒了一桌子，他却吃得特别香……',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ picks: PICKS, moments: MOMENTS });
    initAlbum();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
