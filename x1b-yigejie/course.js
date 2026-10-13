'use strict';
/* 一个接一个 · 本课数据与本课互动。故事页见 ../shared/narrative.js，低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完） */

/* ================= 心情翻牌：阴天（唉）→ 晴天（不过） ================= */
const MOODS = [
  { pic: 'caiyingzi', stop: ['快回家睡觉！', 'kuài huí jiā shuì jiào'], ai: ['唉，我好想再多玩一会儿啊。', 'ài wǒ hǎo xiǎng zài duō wán yí huìr _ a'], but: ['不过，回家睡着了，倒可以做各种各样的梦呢！', 'bú guò huí jiā shuì zháo le dào kě yǐ zuò gè zhǒng gè yàng de mèng ne'] },
  { pic: 'zuomeng', stop: ['该起床上学啦！', 'gāi qǐ chuáng shàng xué la'], ai: ['唉，要是不上学就好了。', 'ài yào shi bú shàng xué jiù hǎo le'], but: ['不过，去了学校，就能见到小伙伴，多么开心哪！', 'bú guò qù le xué xiào jiù néng jiàn dào xiǎo huǒ bàn duō me kāi xīn na'] },
  { pic: 'tiaofangzi', stop: ['上课铃声响了！', 'shàng kè líng shēng xiǎng le'], ai: ['唉，要是没有上课铃就好了。', 'ài yào shi méi yǒu shàng kè líng jiù hǎo le'], but: ['不过，听老师讲故事，也是很快乐很有趣的呀！', 'bú guò tīng lǎo shī jiǎng gù shi yě shì hěn kuài lè hěn yǒu qù de ya'] },
];
const FACE_SAD = '<svg viewBox="0 0 100 70" aria-hidden="true"><path d="M20 58C4 58 4 36 20 36C20 18 46 12 54 28C70 18 90 32 80 46C94 50 88 62 76 58Z" fill="#b9c2cc"/><circle cx="40" cy="44" r="3" fill="#4a5560"/><circle cx="60" cy="44" r="3" fill="#4a5560"/><path d="M42 54Q50 48 58 54" stroke="#4a5560" stroke-width="3" fill="none" stroke-linecap="round"/></svg>';
const FACE_SUN = '<svg viewBox="0 0 100 70" aria-hidden="true"><g stroke="#f2b632" stroke-width="5" stroke-linecap="round"><path d="M50 4V12M50 58V66M16 35H24M76 35H84M26 11L32 17M68 53L74 59M26 59L32 53M68 17L74 11"/></g><circle cx="50" cy="35" r="20" fill="#ffd34d"/><circle cx="43" cy="31" r="2.6" fill="#7a4a10"/><circle cx="57" cy="31" r="2.6" fill="#7a4a10"/><path d="M41 40Q50 49 59 40" stroke="#7a4a10" stroke-width="3" fill="none" stroke-linecap="round"/></svg>';
function initMoods(box) {
  box.innerHTML = MOODS.map((m, i) => `<div class="yj-mrow">
      <div class="yj-mpic" data-bg="assets/${m.pic}.jpg"><span class="py">${Hanzi.ruby(m.stop[0], m.stop[1])}</span></div>
      <button type="button" class="yj-flip" data-i="${i}">
        <span class="yj-face yj-front">${FACE_SAD}<span class="py">${Hanzi.ruby(m.ai[0], m.ai[1])}</span></span>
        <span class="yj-face yj-back">${FACE_SUN}<span class="py">${Hanzi.ruby(m.but[0], m.but[1])}</span></span>
      </button>
    </div>`).join('') + '<p class="yj-mmsg">点一点灰色的云：“唉”之后，小姑娘又想到了什么？</p>';
  box.addEventListener('click', (e) => {
    const card = e.target.closest('.yj-flip');
    if (!card) return;
    card.classList.toggle('on');
    const n = box.querySelectorAll('.yj-flip.on').length;
    box.classList.toggle('done', n === MOODS.length);
    box.querySelector('.yj-mmsg').textContent = n === MOODS.length ? '三次“唉”，三次“不过”——开心事一个接一个！' : '“不过”以后，心情变好了！再翻一张。';
  });
}
initMoods(document.getElementById('moods'));

/* ================= 字宝宝开花（课后“读一读，记一记”）：每步开一朵 ================= */
const FLOWERS = [
  ['接', 'jiē', '接着', 'jiē zhe', '接力', 'jiē lì'],
  ['再', 'zài', '一再', 'yí zài', '再见', 'zài jiàn'],
  ['做', 'zuò', '做事', 'zuò shì', '做伴', 'zuò bàn'],
  ['趣', 'qù', '有趣', 'yǒu qù', '趣事', 'qù shì'],
  ['这', 'zhè', '这样', 'zhè yàng', '这里', 'zhè lǐ'],
  ['各', 'gè', '各自', 'gè zì', '各种各样', 'gè zhǒng gè yàng'],
];
document.getElementById('flowers').innerHTML = FLOWERS.map(([z, p, a, ap, b, bp], i) => `<div class="yj-flower" data-step="${i + 1}">
    <span class="yj-petal py">${Hanzi.ruby(a, ap)}</span><b class="py">${Hanzi.ruby(z, p)}</b><span class="yj-petal py">${Hanzi.ruby(b, bp)}</span>
  </div>`).join('');

/* ================= 找一找：生字藏在操场图里，点到就跳出来 =================
 * x / y 是图上百分比位置（tiaofangzi.jpg：天空、教学楼、大树、地上的格子、小伙伴旁边） */
const HIDE = [['接', 'jiē', 8, 12], ['觉', 'jiào', 30, 9], ['再', 'zài', 52, 7], ['做', 'zuò', 72, 14], ['各', 'gè', 92, 10], ['种', 'zhǒng', 14, 40],
  ['样', 'yàng', 40, 36], ['伙', 'huǒ', 62, 33], ['伴', 'bàn', 88, 42], ['却', 'què', 8, 72], ['也', 'yě', 34, 88], ['趣', 'qù', 58, 80], ['这', 'zhè', 84, 86]];
function initFind(box) {
  box.innerHTML = `<div class="yj-findpic" data-bg="assets/tiaofangzi.jpg">${HIDE.map(([z, p, x, y], i) => `<button type="button" class="yj-hid" style="left:${x}%;top:${y}%;--r:${(i % 5) * 9 - 18}deg"><i>${p}</i>${z}</button>`).join('')}</div>
    <div class="yj-findbar"><span class="yj-findmsg">图上藏着 ${HIDE.length} 个生字，找一找！</span><b class="yj-findn">0 / ${HIDE.length}</b><button type="button" class="btn" data-reset>再藏一次</button></div>`;
  const show = () => {
    const n = box.querySelectorAll('.yj-hid.on').length;
    box.querySelector('.yj-findn').textContent = `${n} / ${HIDE.length}`;
    box.classList.toggle('done', n === HIDE.length);
    box.querySelector('.yj-findmsg').textContent = n === HIDE.length ? '全部找到啦！再一起读一遍。' : n ? '找到了！读一读，再找下一个。' : `图上藏着 ${HIDE.length} 个生字，找一找！`;
  };
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-reset]')) { box.querySelectorAll('.yj-hid').forEach((h) => h.classList.remove('on')); show(); return; }
    const h = e.target.closest('.yj-hid');
    if (!h) return;
    h.classList.add('on');
    show();
  });
  show();
}
initFind(document.getElementById('find'));

Hanzi.init({
  cards: [
    { z: '接', py: 'jiē', bs: '扌', bh: 11, words: [['接着', 'jiē zhe'], ['接力', 'jiē lì']] },
    { z: '觉', py: 'jiào', bs: '见', bh: 9, words: [['睡觉', 'shuì jiào'], ['觉得', 'jué de']] },
    { z: '再', py: 'zài', bs: '一', bh: 6, words: [['再见', 'zài jiàn'], ['一再', 'yí zài']] },
    { z: '做', py: 'zuò', bs: '亻', bh: 11, words: [['做事', 'zuò shì'], ['做伴', 'zuò bàn']] },
    { z: '各', py: 'gè', bs: '夂', bh: 6, words: [['各自', 'gè zì'], ['各种各样', 'gè zhǒng gè yàng']] },
    { z: '种', py: 'zhǒng', bs: '禾', bh: 9, words: [['各种', 'gè zhǒng'], ['种子', 'zhǒng zi']] },
    { z: '样', py: 'yàng', bs: '木', bh: 10, words: [['这样', 'zhè yàng'], ['样子', 'yàng zi']] },
    { z: '伙', py: 'huǒ', bs: '亻', bh: 6, words: [['伙伴', 'huǒ bàn']] },
    { z: '伴', py: 'bàn', bs: '亻', bh: 7, words: [['伙伴', 'huǒ bàn'], ['做伴', 'zuò bàn']] },
    { z: '却', py: 'què', bs: '卩', bh: 7, words: [['却是', 'què shì']] },
    { z: '也', py: 'yě', bs: '乙', bh: 3, words: [['也是', 'yě shì'], ['也好', 'yě hǎo']] },
    { z: '趣', py: 'qù', bs: '走', bh: 15, words: [['有趣', 'yǒu qù'], ['趣事', 'qù shì']] },
    { z: '这', py: 'zhè', bs: '辶', bh: 7, words: [['这样', 'zhè yàng'], ['这里', 'zhè lǐ']] },
  ],
  shapes: {
    各: ['M30 12C44 6 64 10 68 24C70 36 60 44 46 44', 'M46 44L32 30', 'M24 58V90H76V58'],
  },
  evolve: [
    { z: '伙', old: ['人', '火'], note: '古时候，一起围着一个火堆做饭、吃饭的人叫“火伴”，后来写成“伙伴”。（帮助记字的说法）' },
    { z: '各', note: '上面像一只朝下走来的脚，下面像家门口——脚走到了门口，表示“来到”。' },
  ],
  write: [
    { z: '过', py: 'guò', bs: '辶', bh: 6 },
    { z: '各', py: 'gè', bs: '夂', bh: 6 },
    { z: '种', py: 'zhǒng', bs: '禾', bh: 9 },
    { z: '样', py: 'yàng', bs: '木', bh: 10 },
    { z: '伙', py: 'huǒ', bs: '亻', bh: 6 },
    { z: '伴', py: 'bàn', bs: '亻', bh: 7 },
    { z: '这', py: 'zhè', bs: '辶', bh: 7 },
  ],
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
