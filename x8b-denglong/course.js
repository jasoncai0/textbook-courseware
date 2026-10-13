'use strict';
/* 灯笼 · 本课专属互动：灯笼记忆串（按文章顺序挂灯，点亮看原文与情思）、三层意义分类、结尾名将卡 */

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---------- 灯笼记忆串：k = qing 情感 / wen 文化 / guo 家国 ---------- */
const LAMPS = [
  { t: '爱火爱光', k: 'qing', s: '小孩子喜欢火，喜欢亮光，却仿佛是天性。', f: '童心：喜欢光明是孩子的天性。' },
  { t: '记忆的网', k: 'qing', s: '真的，灯笼的缘结得太多了，记忆的网里挤着的就都是。', f: '总起：灯笼串起了数不清的记忆。' },
  { t: '迎回祖父', k: 'qing', s: '伴着我们的除了李老五的叙家常，便是一把腰刀、一具灯笼。', f: '挑着灯笼，迎回祖父——长幼情笃。' },
  { t: '母亲的纱灯', k: 'qing', s: '“路上黑，打了灯笼去吧。”', f: '接过纱灯，上下灯学——母子情深；离乡后再听不到，深感怅惘。' },
  { t: '村头红灯', k: 'qing', s: '忽然发现星天下红灯高照，总会以去村不远而默默高兴起来的吧。', f: '村口红灯高照，慰藉孤行客“四面虚惊”的心——乡情民俗。' },
  { t: '元宵龙灯', k: 'qing', s: '跟了一条龙灯在人海里跑半夜，不觉疲乏是什么，还要去看庆丰酒店的跑马灯，猜源亨油坊出的灯谜。', f: '跟着龙灯跑半夜，伴着小灯入梦——飞扬的青春。' },
  { t: '族姊远嫁', k: 'qing', s: '进士第的官衔灯该还有吧，垂珠联珑的朱门却早已褪色了。', f: '官衔灯映照着褪色的朱门——岁月的沧桑。' },
  { t: '纱灯描红', k: 'wen', s: '用朱红在纱灯上描宋体字，从前很引起过自己的喜悦。', f: '爱的是那份雅致——文化上的喜爱。' },
  { t: '想象宫灯', k: 'wen', s: '宫灯，还没见过；总该有翠羽流苏的装饰吧。', f: '对宫灯的想象，体验深长的历史况味。' },
  { t: '挑灯看剑', k: 'guo', s: '最壮的是塞外点兵，吹角连营，夜深星阑时候，将军在挑灯看剑……', f: '由灯笼联想到边塞点兵的将军——情绪陡然一扬。' },
  { t: '燎原烈火', k: 'guo', s: '我愿就是那灯笼下的马前卒。', f: '誓做“灯笼下的马前卒”——个人情感升华为家国情怀。' },
];
function buildString() {
  document.getElementById('string').innerHTML = `<i class="rope"></i>${LAMPS.map((l, i) => `<button type="button" class="lamp ${l.k}" data-step="${i + 1}" data-i="${i}" style="--d:${(i % 3) * 0.6}em">
    <span class="lamp-cord"></span><span class="lamp-body"><span class="lamp-n">${i + 1}</span></span><span class="lamp-t">${l.t}</span></button>`).join('')}`;
}
buildString();
const KIND = { qing: '情感', wen: '文化', guo: '家国' };
function initString() {
  const card = document.getElementById('lampCard');
  document.getElementById('string').addEventListener('click', (e) => {
    const b = e.target.closest('.lamp');
    if (!b) return;
    document.querySelectorAll('#string .lamp').forEach((x) => x.classList.toggle('sel', x === b));
    const l = LAMPS[+b.dataset.i];
    card.className = `lamp-card ${l.k}`;
    card.innerHTML = `<span class="lc-k">${KIND[l.k]}</span><p class="lc-s">${esc(l.s)}</p><p class="lc-f">${esc(l.f)}</p>`;
  });
}

/* ---------- 三层意义 ---------- */
const SORT = [
  { s: '“路上黑，打了灯笼去吧。”', ok: ['情感'], q: '慈母的叮咛，远离家乡后再也听不到——母子情深，怅惘思念。' },
  { s: '若有孤行客，黑夜摸路，正自四面虚惊的时候，忽然发现星天下红灯高照，总会以去村不远而默默高兴起来的吧。', ok: ['情感'], q: '村头红灯有“行好”的意思，温暖路人——乡情与民俗。' },
  { s: '用朱红在纱灯上描宋体字，从前很引起过自己的喜悦。', ok: ['文化'], q: '爱的是纱灯描字的雅致——文化上的喜爱。' },
  { s: '假定是暖融融的春宵，西宫南内有人在趁了灯光调绿嘴鹦鹉，也有人在秋千索下缓步寻一脉幽悄，意味应是深长的。', ok: ['文化'], q: '想象宫中灯下的情景，体会深长的历史况味。' },
  { s: '进士第的官衔灯该还有吧，垂珠联珑的朱门却早已褪色了。', ok: ['情感', '文化'], q: '官衔灯是身份地位的象征；朱门褪色，写出世事变迁、岁月沧桑。' },
  { s: '你听，正萧萧班马鸣也，我愿就是那灯笼下的马前卒。', ok: ['家国'], q: '愿为保家卫国的将军做马前卒——悲壮激越的家国情怀。' },
];

const MOMENTS = [
  {
    name: '一张旧照片', pic: 'shadeng',
    prompt: '仿照“提起灯笼，就会想起……”，用一张旧照片串起几段记忆。',
    hint: '先用排比列出三四个画面，再选一个最难忘的展开写，结尾写一句此刻的感受。',
    example: '提起那张泛黄的全家福，就会想起照相馆里刺眼的灯光，想起爷爷特意换上的中山装，想起我哭花了的小脸……那天回家的路上，爷爷把我扛在肩头，说：“等你长大，咱再照一张。”',
  },
  {
    name: '外婆的蒲扇', pic: 'jiezufu',
    prompt: '用一件旧物写一位亲人，让物成为贯穿全段的线索。',
    hint: '物在哪些场景里出现？每个场景里，亲人在做什么、说什么？',
    example: '提起蒲扇，就会想起夏夜的竹床，想起外婆一下一下扇着的风，想起她讲了一百遍的牛郎织女。后来我搬进了有空调的房子，那把蒲扇就挂在外婆的床头，扇柄被摸得发亮。',
  },
  {
    name: '村口的路灯', pic: 'hongdeng',
    prompt: '写一盏灯（路灯、台灯、窗口的灯），由个人的记忆写到更大的意义。',
    hint: '可以学结尾的写法：从“我”的灯写到更多人的灯，让感情往上扬一扬。',
    example: '提起村口那盏路灯，就会想起晚自习回家时远远看见它的安心。后来我才知道，是村里的老党员自己掏钱装的。一盏灯照亮一段路，许多盏灯，就照亮了许多人回家的路。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ sort: SORT, kinds: ['情感', '文化', '家国'], moments: MOMENTS });
    initString();
    document.querySelector('.heroes').addEventListener('click', (e) => { const h = e.target.closest('.hero'); if (h) h.classList.toggle('open'); });
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
