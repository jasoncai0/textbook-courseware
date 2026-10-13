'use strict';
/* 叶圣陶先生二三事 · 本课数据与本课独有的“品质卡片”“删废字”“略读计时”。通用页面逻辑见 ../shared/narrative.js */

/* 品质卡片：正面原文小事，背面品质 */
const KUAN = [
  { t: '描标点', q: '见叶先生伏案执笔改什么，走近一看，是描他的一篇文章的标点。', a: '给后辈改文章，连标点都描清楚——耐心细致，吕叔湘先生“受了教育”。' },
  { t: '请人改稿', q: '“千万不要慎重，怕改得不妥。我觉得不妥再改回来。”', a: '不耻下问，谦虚恳切；改了还要来商量，“好像应该做主的是我，不是他”。' },
  { t: '送客', q: '他一定还是走过三道门，四道台阶，送到大门外。告别，他鞠躬，口说谢谢……', a: '对每一位客人都这样，“无论怎样说”——宽厚待人，一以贯之。' },
  { t: '打拱', q: '他晚年的时候已经不能起床……他还举手打拱，不断地说谢谢。', a: '卧床也不失礼——待人厚，是刻在骨子里的修养。' },
  { t: '来信', q: '他说他非常悔恨，真不该到天坛去看花。', a: '没见到朋友就悔恨；误以为“我”沦为住旅店，感到很悲伤——体贴入微。' },
];
const YAN = [
  { t: '写话', q: '“写成文章，在这间房里念，要让那间房里的人听着，是说话，不是念稿，才算及了格。”', a: '写完试念试听，不像话，坚决改——严格要求自己。' },
  { t: '简洁', q: '“你写成文章，给人家看，人家给你删去一两个字，意思没变，就证明你不行。”', a: '可简就绝不该繁——重视语文，努力求完美。' },
  { t: '“做”与“作”', q: '定为“行动”义用“做”，“充当”义用“作”。', a: '小至一个标点，以至抄稿的格式，不做到完全妥帖决不放松——以身作则，鞠躬尽瘁。' },
];
function cardsHtml(list) {
  return list.map((c) => `<button class="clue v-card" type="button"><div class="clue-in">
    <div class="clue-face front"><small>${c.t}（点一点翻面）</small>${c.q}</div>
    <div class="clue-face back"><small>见出</small>${c.a}</div></div></button>`).join('');
}
function initVirtue() {
  document.getElementById('cardsKuan').innerHTML = cardsHtml(KUAN);
  document.getElementById('cardsYan').innerHTML = cardsHtml(YAN);
  document.querySelector('.virtue').addEventListener('click', (e) => {
    const card = e.target.closest('.v-card');
    if (card) card.classList.toggle('flipped');
  });
}

/* 略读：选出写到的事 · 写话：哪句像话 */
const PICKS = {
  skim: [
    { t: '吕叔湘见他描自己文章的标点', ok: true },
    { t: '请“我”直接修改文稿，又来商量恢复', ok: true },
    { t: '给中学生上作文课', ok: false, why: '课文没写' },
    { t: '送客走过三道门，送到大门外', ok: true },
    { t: '没见到“我”，来信悔恨', ok: true },
    { t: '带“我”游览天坛', ok: false, why: '他是和朋友去看月季' },
    { t: '主张写完念给隔壁听', ok: true },
    { t: '规定“做”“作”的分工', ok: true },
  ],
  talk: [
    { t: '鉴于天气原因，本次活动予以延期举行。', ok: false, why: '念稿腔' },
    { t: '下雨了，活动改到下周。', ok: true, why: '像说话' },
    { t: '此举对于提升同学们的阅读能力具有重要意义。', ok: false, why: '空、绕' },
    { t: '这样做，大家会更爱读书。', ok: true, why: '一听就懂' },
    { t: '我遵嘱，不客气，这样做了。', ok: true, why: '课文原句：简明如话' },
  ],
};

/* 删废字：[ ] 里是可删的字 */
const CUTS = ['我见到[了]老师。', '他坐在[了]前排。', '吸烟不[太]好。', '那个人我不[太]认识。', '通过这次活动，[使]我明白了一个道理。', '他大约十岁[左右]。', '我们要[加以]认真讨论。'];
function initCuts() {
  const box = document.getElementById('cutList');
  const total = CUTS.length;
  box.innerHTML = CUTS.map((s) => `<p class="cut">${s.split(/(\[[^\]]+\])/).filter(Boolean).map((seg) => (seg.startsWith('[')
    ? `<span class="c x">${seg.slice(1, -1)}</span>`
    : [...seg].map((ch) => `<span class="c">${ch}</span>`).join(''))).join('')}</p>`).join('');
  const count = () => { document.getElementById('cutCount').textContent = `删掉 ${box.querySelectorAll('.x.del').length} / ${total}`; };
  box.addEventListener('click', (e) => {
    const c = e.target.closest('.c');
    if (!c) return;
    if (c.classList.contains('x')) { c.classList.add('del'); count(); return; }
    c.classList.remove('nope');
    void c.offsetWidth; // 重新触发抖动动画
    c.classList.add('nope');
  });
  count();
}

/* 略读计时 */
function initClock() {
  const SECONDS = 300;
  let left = SECONDS;
  let timer = null;
  const clock = document.getElementById('clock');
  const paint = () => { clock.textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`; clock.classList.toggle('done', left === 0); };
  document.getElementById('clockGo').addEventListener('click', () => {
    if (timer) return;
    timer = setInterval(() => { left = Math.max(0, left - 1); paint(); if (!left) { clearInterval(timer); timer = null; } }, 1000);
  });
  document.getElementById('clockReset').addEventListener('click', () => { clearInterval(timer); timer = null; left = SECONDS; paint(); });
  paint();
}

/* 读写迁移 */
const MOMENTS = [
  {
    name: '二三事写一个人', pic: 'songke',
    prompt: '选一位你熟悉的人，用两三件小事写出他（她）的一种品质，最后用一句话评价。',
    hint: '学本文：事要小、要真，评价要有分寸；写完念一念，像不像“话”。',
    example: '我们的班主任每天第一个到教室。冬天，她先把窗户打开一条缝，再把暖气片上的抹布一块块翻个面。有一回我值日忘了擦黑板，她什么也没说，自己擦好了，只在我的作业本上写了一句：“明天记得哦。”——她的严，是从自己开始的。',
  },
  {
    name: '删一删我的作文', pic: 'gaogao',
    prompt: '把你最近一篇作文里的一段抄在这里，学叶圣陶先生：删去意思不变的字。',
    hint: '重点找：多余的“了”“太”“的”，重复的意思，“通过……使……”这类句式。',
    example: '原句：通过这次的春游活动，使我深深地明白了团结就是力量的这个道理。\n改后：这次春游，我明白了团结就是力量。',
  },
  {
    name: '给叶老写一张便条', pic: 'yueji',
    prompt: '假如你是作者，去看望叶老没见着，给他留一张便条。',
    hint: '便条要简明如话：称呼、事由、住址、署名，不说一个废字。',
    example: '叶老：今天来看您，您去天坛看月季了。我在乡下住了几年，最近来京，暂住西郊某大学公寓，一切都好。改日再来拜访。　中行',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ picks: PICKS, moments: MOMENTS });
    initVirtue();
    initCuts();
    initClock();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
